import { useCallback, useState } from 'react';
import { apiService } from '../services/apiService';
import { MealSuggestion } from '../types';

interface UseTodayMealSuggestionParams {
  dietaryRestrictions?: string[];
  favoriteCategories?: string[];
  maxPrice?: number;
}

interface UseTodayMealSuggestionReturn {
  suggestion: MealSuggestion | null;
  loading: boolean;
  error: string | null;
  fetchSuggestion: (params?: UseTodayMealSuggestionParams) => Promise<void>;
}

export const useTodayMealSuggestion = (autoFetch: boolean = false): UseTodayMealSuggestionReturn => {
  const [suggestion, setSuggestion] = useState<MealSuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestion = useCallback(async (params?: UseTodayMealSuggestionParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getTodayMealSuggestion(params);

      if (response.success && response.data) {
        setSuggestion(response.data);
      } else {
        setError(response.error || 'Failed to fetch meal suggestion');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
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

