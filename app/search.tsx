import React, { useState, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { Input, ScreenHeader, Card } from '@/shared/components';
import { COLORS, SPACING } from '@/shared/constants/theme';
import { searchContent } from '@/shared/services/search';
import type { SearchResult } from '@/shared/types';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const results = useMemo(() => (query.length >= 2 ? searchContent(query) : []), [query]);

  const typeIcons: Record<SearchResult['type'], string> = {
    lesson: '📖',
    number: '🔢',
    report: '📄',
    faq: '❓',
    journal: '📓',
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Search" subtitle="Lessons, numbers, reports, and more" />

      <Input
        placeholder="Search..."
        value={query}
        onChangeText={setQuery}
        autoFocus
      />

      {query.length < 2 ? (
        <Text style={{ color: COLORS.textMuted }}>Type at least 2 characters to search</Text>
      ) : results.length === 0 ? (
        <Text style={{ color: COLORS.textMuted }}>No results for "{query}"</Text>
      ) : (
        results.map((result) => (
          <Pressable key={result.id} onPress={() => router.push(result.route as never)}>
            <Card style={{ marginBottom: SPACING.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
                <Text style={{ fontSize: 20 }}>{typeIcons[result.type]}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: COLORS.white, fontWeight: '600' }}>{result.title}</Text>
                  <Text style={{ color: COLORS.textMuted, fontSize: 12 }} numberOfLines={2}>
                    {result.snippet}
                  </Text>
                </View>
              </View>
            </Card>
          </Pressable>
        ))
      )}
    </ScreenContainer>
  );
}
