import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { getReports, getJournalEntries, getLessons, saveReport, saveJournalEntry } from '@/shared/services/firebase';
import { useAuthStore } from '@/shared/store';
import type { NumerologyReport, JournalEntry } from '@/shared/types';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
      gcTime: 1000 * 60 * 30,
    },
    mutations: {
      retry: 1,
    },
  },
});

export function AppQueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export function useReports() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: ['reports', userId],
    queryFn: () => (userId ? getReports(userId) : []),
    enabled: !!userId,
  });
}

export function useJournal() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: ['journal', userId],
    queryFn: () => (userId ? getJournalEntries(userId) : []),
    enabled: !!userId,
  });
}

export function useLessons() {
  return useQuery({
    queryKey: ['lessons'],
    queryFn: getLessons,
    staleTime: Infinity,
  });
}

export function useSaveReport() {
  const userId = useAuthStore((s) => s.user?.id);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (report: NumerologyReport) => {
      if (userId) await saveReport(userId, report);
      return report;
    },
    onMutate: async (report) => {
      await qc.cancelQueries({ queryKey: ['reports', userId] });
      const previous = qc.getQueryData(['reports', userId]);
      qc.setQueryData(['reports', userId], (old: NumerologyReport[] = []) => [
        report,
        ...old,
      ]);
      return { previous };
    },
    onError: (_err, _report, context) => {
      if (context?.previous) {
        qc.setQueryData(['reports', userId], context.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['reports', userId] });
    },
  });
}

export function useSaveJournalEntry() {
  const userId = useAuthStore((s) => s.user?.id);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (entry: JournalEntry) => {
      if (userId) await saveJournalEntry(userId, entry);
      return entry;
    },
    onMutate: async (entry) => {
      await qc.cancelQueries({ queryKey: ['journal', userId] });
      const previous = qc.getQueryData(['journal', userId]);
      qc.setQueryData(['journal', userId], (old: JournalEntry[] = []) => [
        entry,
        ...old,
      ]);
      return { previous };
    },
    onError: (_err, _entry, context) => {
      if (context?.previous) {
        qc.setQueryData(['journal', userId], context.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['journal', userId] });
    },
  });
}
