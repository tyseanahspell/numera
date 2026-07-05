import React, { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { Button, Input, ScreenHeader, Card } from '@/shared/components';
import { COLORS, SPACING, BORDER_RADIUS } from '@/shared/constants/theme';
import { useAuthStore, useAppDataStore } from '@/shared/store';
import type { JournalEntry, MoodTag } from '@/shared/types';

const MOODS: { value: MoodTag; emoji: string }[] = [
  { value: 'peaceful', emoji: '😌' },
  { value: 'grateful', emoji: '🙏' },
  { value: 'curious', emoji: '🤔' },
  { value: 'hopeful', emoji: '🌟' },
  { value: 'reflective', emoji: '💭' },
  { value: 'anxious', emoji: '😰' },
  { value: 'energized', emoji: '⚡' },
  { value: 'uncertain', emoji: '🌫️' },
];

export default function JournalScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { journalEntries, addJournalEntry } = useAppDataStore();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodTag | undefined>();
  const [search, setSearch] = useState('');

  const filtered = journalEntries.filter(
    (e) =>
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!title.trim() || !content.trim() || !user) return;
    const entry: JournalEntry = {
      id: `journal_${Date.now()}`,
      userId: user.id,
      title: title.trim(),
      content: content.trim(),
      mood,
      personalNumbers: [
        user.numerology.personalDay.value,
        user.numerology.personalYear.value,
      ],
      tags: mood ? [mood] : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addJournalEntry(entry);
    setTitle('');
    setContent('');
    setMood(undefined);
    setShowForm(false);
  };

  const handleExport = () => {
    if (!user?.isPremium) {
      Alert.alert('Premium Feature', 'Journal export is available with Numera Premium.');
      router.push('/premium');
      return;
    }
    Alert.alert('Export', 'Journal export would generate a shareable file.');
  };

  return (
    <ScreenContainer>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <ScreenHeader title="Journal" subtitle="Reflect on your numerology journey" />
      </View>

      <Input
        placeholder="Search entries..."
        value={search}
        onChangeText={setSearch}
      />

      {!showForm ? (
        <Button title="+ New Entry" onPress={() => setShowForm(true)} />
      ) : (
        <Card title="New Entry" style={{ marginBottom: SPACING.md }}>
          <Input label="Title" value={title} onChangeText={setTitle} />
          <Input label="Content" value={content} onChangeText={setContent} multiline numberOfLines={4} />
          <Text style={{ color: COLORS.textMuted, marginBottom: 8 }}>Mood</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: SPACING.md }}>
            {MOODS.map((m) => (
              <Pressable
                key={m.value}
                onPress={() => setMood(m.value)}
                style={{
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: mood === m.value ? COLORS.navy700 : COLORS.navy800,
                  borderWidth: 1,
                  borderColor: mood === m.value ? COLORS.gold : 'transparent',
                }}
              >
                <Text>{m.emoji}</Text>
              </Pressable>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
            <Button title="Save" onPress={handleSave} />
            <Button title="Cancel" variant="ghost" onPress={() => setShowForm(false)} />
          </View>
        </Card>
      )}

      {filtered.map((entry) => (
        <Card key={entry.id} title={entry.title} subtitle={new Date(entry.createdAt).toLocaleDateString()} style={{ marginTop: SPACING.sm }}>
          <Text style={{ color: COLORS.textMuted }} numberOfLines={3}>{entry.content}</Text>
          {entry.mood && <Text style={{ color: COLORS.gold, fontSize: 12, marginTop: 4 }}>Mood: {entry.mood}</Text>}
        </Card>
      ))}

      {journalEntries.length > 0 && (
        <View style={{ marginTop: SPACING.lg }}>
          <Button title="Export Journal" variant="outline" onPress={handleExport} />
        </View>
      )}
    </ScreenContainer>
  );
}
