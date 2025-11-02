import { ApiResponse, Category, FoodItem, PaginatedResponse, Restaurant } from '../types';
import { apiService } from './apiService';

class FoodService {
  // Get all food items with optional filters
  async getFoodItems(params?: {
    category?: string;
    restaurantId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<FoodItem>>> {
    try {
      const response = await apiService.getFoodItems({
        query: params?.search,
        category: params?.category,
        page: params?.page || 1,
        limit: params?.limit || 10,
      });

      if (response.success && response.data) {
        return {
          success: true,
          data: {
            data: response.data.items || [],
            currentPage: response.data.page || 1,
            totalPages: response.data.totalPages || 1,
            totalItems: response.data.total || 0,
            hasNext: (response.data.page || 1) < (response.data.totalPages || 1),
            hasPrevious: (response.data.page || 1) > 1,
          },
        };
      }

      return {
        success: false,
        data: {
          data: [],
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          hasNext: false,
          hasPrevious: false,
        },
        error: response.error || 'Failed to fetch food items',
      };
    } catch (error) {
      return {
        success: false,
        data: {
          data: [],
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          hasNext: false,
          hasPrevious: false,
        },
        error: error instanceof Error ? error.message : 'Failed to fetch food items',
      };
    }
  }

  // Get a single food item by ID
  async getFoodItemById(id: string): Promise<ApiResponse<FoodItem | null>> {
    try {
      const response = await apiService.getFoodItemById(id);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        data: null,
        error: response.error || 'Food item not found',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch food item',
      };
    }
  }

  // Get featured food items
  async getFeaturedFoodItems(limit: number = 6): Promise<ApiResponse<FoodItem[]>> {
    try {
      const response = await apiService.getFoodItems({
        featured: true,
        limit,
      });

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data.items || [],
        };
      }

      return {
        success: false,
        data: [],
        error: response.error || 'Failed to fetch featured items',
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch featured items',
      };
    }
  }

  // Get popular food items
  async getPopularFoodItems(limit: number = 6): Promise<ApiResponse<FoodItem[]>> {
    try {
      const response = await apiService.getFoodItems({
        popular: true,
        limit,
      });

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data.items || [],
        };
      }

      return {
        success: false,
        data: [],
        error: response.error || 'Failed to fetch popular items',
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch popular items',
      };
    }
  }
}

class CategoryService {
  // Get all categories
  async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const response = await apiService.getCategories();
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        data: [],
        error: response.error || 'Failed to fetch categories',
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
      };
    }
  }

  // Get category by ID
  async getCategoryById(id: string): Promise<ApiResponse<Category | null>> {
    try {
      const response = await apiService.getCategoryById(id);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        data: null,
        error: response.error || 'Category not found',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch category',
      };
    }
  }
}

class RestaurantService {
  // Get all restaurants with optional filters
  async getRestaurants(params?: {
    cuisine?: string[];
    minRating?: number;
    maxDeliveryTime?: number;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<Restaurant>>> {
    try {
      const response = await apiService.getRestaurants({
        search: params?.search,
        page: params?.page || 1,
        limit: params?.limit || 10,
      });

      if (response.success && response.data) {
        let filteredRestaurants = response.data.items || [];

        // Apply client-side filters
        if (params?.cuisine && params.cuisine.length > 0) {
          filteredRestaurants = filteredRestaurants.filter(restaurant =>
            params.cuisine!.some(cuisine => 
              restaurant.categories.includes(cuisine)
            )
          );
        }

        if (params?.minRating) {
          filteredRestaurants = filteredRestaurants.filter(restaurant =>
            restaurant.rating >= params.minRating!
          );
        }

        return {
          success: true,
          data: {
            data: filteredRestaurants,
            currentPage: response.data.page || 1,
            totalPages: response.data.totalPages || 1,
            totalItems: response.data.total || 0,
            hasNext: (response.data.page || 1) < (response.data.totalPages || 1),
            hasPrevious: (response.data.page || 1) > 1,
          },
        };
      }

      return {
        success: false,
        data: {
          data: [],
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          hasNext: false,
          hasPrevious: false,
        },
        error: response.error || 'Failed to fetch restaurants',
      };
    } catch (error) {
      return {
        success: false,
        data: {
          data: [],
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          hasNext: false,
          hasPrevious: false,
        },
        error: error instanceof Error ? error.message : 'Failed to fetch restaurants',
      };
    }
  }

  // Get restaurant by ID
  async getRestaurantById(id: string): Promise<ApiResponse<Restaurant | null>> {
    try {
      const response = await apiService.getRestaurantById(id);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        data: null,
        error: response.error || 'Restaurant not found',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch restaurant',
      };
    }
  }

  // Get featured restaurants
  async getFeaturedRestaurants(limit: number = 6): Promise<ApiResponse<Restaurant[]>> {
    try {
      const response = await apiService.getRestaurants({
        featured: true,
        limit,
      });

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data.items || [],
        };
      }

      return {
        success: false,
        data: [],
        error: response.error || 'Failed to fetch featured restaurants',
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch featured restaurants',
      };
    }
  }
}

// Export service instances
export const foodService = new FoodService();
export const categoryService = new CategoryService();
export const restaurantService = new RestaurantService();