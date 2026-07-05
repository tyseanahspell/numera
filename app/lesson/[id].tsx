import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Markdown from 'react-native-markdown-display';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { Button, Card, ScreenHeader, ProgressBar } from '@/shared/components';
import { COLORS, SPACING, BORDER_RADIUS } from '@/shared/constants/theme';
import { LESSONS_DATA } from '@/features/learn/data/lessons';
import { useAppDataStore } from '@/shared/store';
import { hapticSuccess } from '@/shared/utils/haptics';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { lessonProgress, updateLessonProgress, unlockAchievement } = useAppDataStore();
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [quizComplete, setQuizComplete] = useState(false);

  const lesson = LESSONS_DATA.find((l) => l.id === id);
  const progress = lessonProgress.find((p) => p.lessonId === id);

  if (!lesson) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Lesson not found" />
      </ScreenContainer>
    );
  }

  const handleCompleteLesson = () => {
    setShowQuiz(true);
  };

  const handleSubmitQuiz = () => {
    const correct = lesson.quiz.questions.filter((q) => answers[q.id] === q.correctIndex).length;
    const score = Math.round((correct / lesson.quiz.questions.length) * 100);

    updateLessonProgress({
      lessonId: lesson.id,
      completed: true,
      quizScore: score,
      completedAt: new Date().toISOString(),
    });

    if (score === 100) {
      unlockAchievement({ id: 'quiz_master', title: 'Quiz Master', description: 'Score 100%', icon: '🏆' });
    }
    unlockAchievement({ id: 'first_lesson', title: 'First Steps', description: 'Complete a lesson', icon: '📖' });

    setQuizComplete(true);
    hapticSuccess();
  };

  const markdownStyles = {
    body: { color: COLORS.white, fontSize: 15, lineHeight: 24 },
    heading1: { color: COLORS.gold, fontSize: 24, marginBottom: 12 },
    heading2: { color: COLORS.gold, fontSize: 20, marginTop: 16 },
    blockquote: { backgroundColor: COLORS.navy800, borderLeftColor: COLORS.gold, padding: 12 },
    table: { borderColor: COLORS.navy700 },
    th: { color: COLORS.gold, backgroundColor: COLORS.navy800 },
    td: { color: COLORS.white, borderColor: COLORS.navy700 },
  };

  if (showQuiz && !quizComplete) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Quiz" subtitle={lesson.title} />
        {lesson.quiz.questions.map((q) => (
          <Card key={q.id} title={q.question} style={{ marginBottom: SPACING.md }}>
            {q.options.map((opt, i) => (
              <Pressable
                key={i}
                onPress={() => setAnswers((prev) => ({ ...prev, [q.id]: i }))}
                style={{
                  padding: SPACING.sm,
                  borderRadius: BORDER_RADIUS.sm,
                  backgroundColor: answers[q.id] === i ? COLORS.navy700 : 'transparent',
                  borderWidth: 1,
                  borderColor: answers[q.id] === i ? COLORS.gold : COLORS.navy700,
                  marginBottom: 4,
                }}
              >
                <Text style={{ color: COLORS.white }}>{opt}</Text>
              </Pressable>
            ))}
          </Card>
        ))}
        <Button
          title="Submit Quiz"
          onPress={handleSubmitQuiz}
          disabled={Object.keys(answers).length < lesson.quiz.questions.length}
        />
      </ScreenContainer>
    );
  }

  if (quizComplete) {
    const score = lessonProgress.find((p) => p.lessonId === id)?.quizScore ?? 0;
    return (
      <ScreenContainer>
        <View style={{ alignItems: 'center', marginTop: SPACING.xxl }}>
          <Text style={{ fontSize: 48 }}>🎉</Text>
          <Text style={{ color: COLORS.white, fontSize: 24, fontWeight: '700', marginTop: SPACING.md }}>
            Quiz Complete!
          </Text>
          <Text style={{ color: COLORS.gold, fontSize: 18, marginTop: 8 }}>Score: {score}%</Text>
          <View style={{ marginTop: SPACING.xl, width: '100%' }}>
            <Button title="Back to Learn" onPress={() => router.back()} />
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader title={lesson.title} subtitle={`${lesson.topic} · ${lesson.durationMinutes} min`} />
      {progress?.completed && (
        <Text style={{ color: COLORS.gold, marginBottom: SPACING.md }}>✓ Completed</Text>
      )}
      <Markdown style={markdownStyles}>{lesson.content}</Markdown>
      <View style={{ marginTop: SPACING.xl }}>
        <Button title="Take Quiz" onPress={handleCompleteLesson} />
      </View>
    </ScreenContainer>
  );
}
