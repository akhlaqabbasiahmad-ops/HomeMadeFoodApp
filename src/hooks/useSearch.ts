import { useCallback, useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Category, FoodItem } from '../types';

export interface SearchFilters {
  categories: string[];
  priceRange: { min: number; max: number };
  isVegetarian?: boolean;
  isVegan?: boolean;
  rating?: number;
  deliveryTime?: number;
}

export interface UseSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  results: FoodItem[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  performSearch: () => Promise<void>;
  clearSearch: () => void;
  loadCategories: () => Promise<void>;
}

const defaultFilters: SearchFilters = {
  categories: [],
  priceRange: { min: 0, max: 100 },
  isVegetarian: undefined,
  isVegan: undefined,
  rating: undefined,
  deliveryTime: undefined,
};

export const useSearch = (): UseSearchReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [results, setResults] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search function using API
  const performSearch = useCallback(async () => {
    if (!searchQuery.trim() && filters === defaultFilters) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getFoodItems({
        query: searchQuery.trim() || undefined,
        category: filters.categories.length > 0 ? filters.categories[0] : undefined,
        minPrice: filters.priceRange.min,
        maxPrice: filters.priceRange.max,
        isVegetarian: filters.isVegetarian,
        isVegan: filters.isVegan,
        page: 1,
        limit: 20,
      });

      if (response.success && response.data) {
        let filteredItems = response.data.items || [];

        // Apply client-side filters that aren't handled by API
        if (filters.rating !== undefined) {
          filteredItems = filteredItems.filter((item: FoodItem) =>
            item.rating >= filters.rating!
          );
        }

        if (filters.deliveryTime !== undefined) {
          filteredItems = filteredItems.filter((item: FoodItem) =>
            item.preparationTime <= filters.deliveryTime!
          );
        }

        setResults(filteredItems);
      } else {
        console.log('API failed:', response.error);
        setResults([]);
        setError(response.error || 'Search failed');
      }
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters]);

  // Load categories from API
  const loadCategories = useCallback(async () => {
    try {
      const response = await apiService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setFilters(defaultFilters);
    setResults([]);
    setError(null);
  }, []);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    results,
    categories,
    loading,
    error,
    performSearch,
    clearSearch,
    loadCategories,
  };
};