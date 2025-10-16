import { useCallback, useEffect, useState } from 'react';
import { foodService } from '../services/dataServices';
import { FoodItem } from '../types';

interface UseFoodItemsParams {
  category?: string;
  restaurantId?: string;
  search?: string;
  autoFetch?: boolean;
}

interface UseFoodItemsReturn {
  items: FoodItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  totalItems: number;
  fetchItems: () => Promise<void>;
  searchItems: (query: string) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useFoodItems = ({
  category,
  restaurantId,
  search,
  autoFetch = true,
}: UseFoodItemsParams = {}): UseFoodItemsReturn => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchItems = useCallback(async (pageNum: number = 1, reset: boolean = false) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await foodService.getFoodItems({
        category,
        restaurantId,
        search,
        page: pageNum,
        limit: 10,
      });

      if (response.success && response.data) {
        const newItems = response.data.data;
        
        if (reset) {
          setItems(newItems);
        } else {
          setItems(prev => [...prev, ...newItems]);
        }
        
        setHasMore(response.data.hasNext);
        setTotalItems(response.data.totalItems);
        setPage(pageNum);
      } else {
        setError(response.error || 'Failed to fetch food items');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [category, restaurantId, search, loading]);

  const searchItems = useCallback(async (query: string) => {
    setPage(1);
    await fetchItems(1, true);
  }, [fetchItems]);

  const loadMore = useCallback(async () => {
    if (hasMore && !loading) {
      await fetchItems(page + 1, false);
    }
  }, [hasMore, loading, page, fetchItems]);

  const refresh = useCallback(async () => {
    setPage(1);
    await fetchItems(1, true);
  }, [fetchItems]);

  useEffect(() => {
    if (autoFetch) {
      fetchItems(1, true);
    }
  }, [autoFetch, fetchItems]);

  return {
    items,
    loading,
    error,
    hasMore,
    page,
    totalItems,
    fetchItems: () => fetchItems(1, true),
    searchItems,
    loadMore,
    refresh,
  };
};

interface UseFoodItemReturn {
  item: FoodItem | null;
  loading: boolean;
  error: string | null;
  fetchItem: (id: string) => Promise<void>;
}

export const useFoodItem = (id?: string): UseFoodItemReturn => {
  const [item, setItem] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItem = useCallback(async (itemId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await foodService.getFoodItemById(itemId);

      if (response.success) {
        setItem(response.data);
      } else {
        setError(response.error || 'Failed to fetch food item');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchItem(id);
    }
  }, [id, fetchItem]);

  return {
    item,
    loading,
    error,
    fetchItem,
  };
};

interface UseFeaturedItemsReturn {
  items: FoodItem[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useFeaturedItems = (): UseFeaturedItemsReturn => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await foodService.getFeaturedFoodItems(6);

      if (response.success) {
        setItems(response.data);
      } else {
        setError(response.error || 'Failed to fetch featured items');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchFeaturedItems();
  }, [fetchFeaturedItems]);

  useEffect(() => {
    fetchFeaturedItems();
  }, [fetchFeaturedItems]);

  return {
    items,
    loading,
    error,
    refresh,
  };
};

export const usePopularItems = (): UseFeaturedItemsReturn => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPopularItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await foodService.getPopularFoodItems(6);

      if (response.success) {
        setItems(response.data);
      } else {
        setError(response.error || 'Failed to fetch popular items');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchPopularItems();
  }, [fetchPopularItems]);

  useEffect(() => {
    fetchPopularItems();
  }, [fetchPopularItems]);

  return {
    items,
    loading,
    error,
    refresh,
  };
};