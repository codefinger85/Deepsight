import { useQuery } from '@tanstack/react-query';

interface SessionsWithTradesData {
  sessions: (string | number | null)[][];
  trades: Record<string, (string | number | null)[][]>;
}

export function useSessionsWithTrades() {
  return useQuery({
    queryKey: ['sessions-with-trades'],
    queryFn: async (): Promise<SessionsWithTradesData> => {
      const response = await fetch('/api/sessions-with-trades');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}