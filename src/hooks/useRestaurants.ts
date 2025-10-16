import { useCallback, useEffect, useState } from 'react';
import { categoryService, restaurantService } from '../services/dataServices';
import { Category, Restaurant } from '../types';

// Categories Hook
interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await categoryService.getCategories();

      if (response.success) {
        setCategories(response.data);
      } else {
        setError(response.error || 'Failed to fetch categories');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refresh,
  };
};

// Restaurants Hook
interface UseRestaurantsParams {
  cuisine?: string[];
  minRating?: number;
  search?: string;
  autoFetch?: boolean;
}

interface UseRestaurantsReturn {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  totalItems: number;
  fetchRestaurants: () => Promise<void>;
  searchRestaurants: (query: string) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useRestaurants = ({
  cuisine,
  minRating,
  search,
  autoFetch = true,
}: UseRestaurantsParams = {}): UseRestaurantsReturn => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchRestaurants = useCallback(async (pageNum: number = 1, reset: boolean = false) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await restaurantService.getRestaurants({
        cuisine,
        minRating,
        search,
        page: pageNum,
        limit: 10,
      });

      if (response.success && response.data) {
        const newRestaurants = response.data.data;
        
        if (reset) {
          setRestaurants(newRestaurants);
        } else {
          setRestaurants(prev => [...prev, ...newRestaurants]);
        }
        
        setHasMore(response.data.hasNext);
        setTotalItems(response.data.totalItems);
        setPage(pageNum);
      } else {
        setError(response.error || 'Failed to fetch restaurants');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [cuisine, minRating, search, loading]);

  const searchRestaurants = useCallback(async (query: string) => {
    setPage(1);
    await fetchRestaurants(1, true);
  }, [fetchRestaurants]);

  const loadMore = useCallback(async () => {
    if (hasMore && !loading) {
      await fetchRestaurants(page + 1, false);
    }
  }, [hasMore, loading, page, fetchRestaurants]);

  const refresh = useCallback(async () => {
    setPage(1);
    await fetchRestaurants(1, true);
  }, [fetchRestaurants]);

  useEffect(() => {
    if (autoFetch) {
      fetchRestaurants(1, true);
    }
  }, [autoFetch, fetchRestaurants]);

  return {
    restaurants,
    loading,
    error,
    hasMore,
    page,
    totalItems,
    fetchRestaurants: () => fetchRestaurants(1, true),
    searchRestaurants,
    loadMore,
    refresh,
  };
};

// Single Restaurant Hook
interface UseRestaurantReturn {
  restaurant: Restaurant | null;
  loading: boolean;
  error: string | null;
  fetchRestaurant: (id: string) => Promise<void>;
}

export const useRestaurant = (id?: string): UseRestaurantReturn => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurant = useCallback(async (restaurantId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await restaurantService.getRestaurantById(restaurantId);

      if (response.success) {
        setRestaurant(response.data);
      } else {
        setError(response.error || 'Failed to fetch restaurant');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchRestaurant(id);
    }
  }, [id, fetchRestaurant]);

  return {
    restaurant,
    loading,
    error,
    fetchRestaurant,
  };
};

// Featured Restaurants Hook
interface UseFeaturedRestaurantsReturn {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useFeaturedRestaurants = (): UseFeaturedRestaurantsReturn => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedRestaurants = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await restaurantService.getFeaturedRestaurants(6);

      if (response.success) {
        setRestaurants(response.data);
      } else {
        setError(response.error || 'Failed to fetch featured restaurants');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchFeaturedRestaurants();
  }, [fetchFeaturedRestaurants]);

  useEffect(() => {
    fetchFeaturedRestaurants();
  }, [fetchFeaturedRestaurants]);

  return {
    restaurants,
    loading,
    error,
    refresh,
  };
};