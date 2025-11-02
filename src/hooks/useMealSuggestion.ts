import { useCallback, useState } from 'react';
import { apiService } from '../services/apiService';
import { MealSuggestion } from '../types';

interface UseMealSuggestionReturn {
  suggestion: MealSuggestion | null;
  loading: boolean;
  error: string | null;
  fetchSuggestion: () => Promise<void>;
}

export const useMealSuggestion = (autoFetch: boolean = false): UseMealSuggestionReturn => {
  const [suggestion, setSuggestion] = useState<MealSuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestion = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getMealSuggestion();

      if (response.success && response.data) {
        setSuggestion(response.data);
      } else {
        setError(response.error || 'Failed to fetch meal suggestion');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    suggestion,
    loading,
    error,
    fetchSuggestion,
  };
};

