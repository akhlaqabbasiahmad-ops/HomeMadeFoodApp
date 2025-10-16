import { useCallback, useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Category, FoodItem } from '../types';

export interface SearchFilters {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
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
  loading: boolean;
  error: string | null;
  categories: Category[];
  clearFilters: () => void;
  searchHistory: string[];
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
}

const defaultFilters: SearchFilters = {
  categories: [],
  priceRange: { min: 0, max: 100 },
  isVegetarian: undefined,
  isVegan: undefined,
  rating: undefined,
  deliveryTime: undefined,
};

// Mock data outside component to prevent re-creation
const mockCategories: Category[] = [
  { id: '1', name: 'Pizza', image: '', icon: '🍕' },
  { id: '2', name: 'Burger', image: '', icon: '🍔' },
  { id: '3', name: 'Pasta', image: '', icon: '🍝' },
  { id: '4', name: 'Salad', image: '', icon: '🥗' },
  { id: '5', name: 'Dessert', image: '', icon: '🍰' },
  { id: '6', name: 'Drinks', image: '', icon: '🥤' },
];

const mockFoodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Fresh tomatoes, mozzarella, and basil',
    price: 12.99,
    originalPrice: 14.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
    category: 'Pizza',
    restaurantId: '1',
    restaurantName: "Tony's Pizzeria",
    rating: 4.5,
    reviews: 128,
    preparationTime: 20,
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    ingredients: ['tomato', 'mozzarella', 'basil'],
    allergens: ['dairy'],
    calories: 280,
  },
  {
    id: '2',
    name: 'Chicken Burger',
    description: 'Grilled chicken with lettuce and mayo',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
    category: 'Burger',
    restaurantId: '2',
    restaurantName: "Joe's Burgers",
    rating: 4.2,
    reviews: 95,
    preparationTime: 15,
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    ingredients: ['chicken', 'lettuce', 'mayo'],
    allergens: ['gluten'],
    calories: 350,
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with caesar dressing',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=300&h=200&fit=crop',
    category: 'Salad',
    restaurantId: '3',
    restaurantName: "Green Garden",
    rating: 4.3,
    reviews: 67,
    preparationTime: 10,
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    ingredients: ['romaine lettuce', 'caesar dressing', 'parmesan'],
    allergens: ['dairy'],
    calories: 180,
  },
];

export const useSearch = (): UseSearchReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [results, setResults] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>(mockCategories);

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
        // Fallback to mock data if API fails
        console.log('API failed, using mock data:', response.error);
        setResults(mockFoodItems.slice(0, 3));
      }
    } catch (err) {
      console.error('Search error:', err);
      // Fallback to mock data
      setResults(mockFoodItems.slice(0, 3));
      setError('Search failed, showing sample results');
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
      // Keep mock categories as fallback
    }
  }, []);

  // Trigger search when query or filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch();
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
  }, [performSearch]);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const addToSearchHistory = useCallback((query: string) => {
    if (query.trim() && !searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev.slice(0, 9)]); // Keep last 10 searches
    }
  }, [searchHistory]);

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        addToSearchHistory(searchQuery);
      }, 1000); // Add to history after 1 second of typing

      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, addToSearchHistory]);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    results,
    loading,
    error,
    categories,
    clearFilters,
    searchHistory,
    addToSearchHistory,
    clearSearchHistory,
  };
};