import { ApiResponse, Category, FoodItem, PaginatedResponse, Restaurant } from '../types';
import { mockCategories, mockFoodItems, mockRestaurants } from './mockData';

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
      // For now, return mock data
      // In production, this would make an API call
      let filteredItems = [...mockFoodItems];

      if (params?.category) {
        filteredItems = filteredItems.filter(item => 
          item.category.toLowerCase() === params.category!.toLowerCase()
        );
      }

      if (params?.restaurantId) {
        filteredItems = filteredItems.filter(item => 
          item.restaurantId === params.restaurantId
        );
      }

      if (params?.search) {
        const searchTerm = params.search.toLowerCase();
        filteredItems = filteredItems.filter(item =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          item.restaurantName.toLowerCase().includes(searchTerm)
        );
      }

      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedItems = filteredItems.slice(startIndex, endIndex);

      return {
        success: true,
        data: {
          data: paginatedItems,
          currentPage: page,
          totalPages: Math.ceil(filteredItems.length / limit),
          totalItems: filteredItems.length,
          hasNext: endIndex < filteredItems.length,
          hasPrevious: page > 1,
        },
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
      const foodItem = mockFoodItems.find(item => item.id === id);
      
      if (!foodItem) {
        return {
          success: false,
          data: null,
          error: 'Food item not found',
        };
      }

      return {
        success: true,
        data: foodItem,
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
      // Return top-rated items as featured
      const featuredItems = mockFoodItems
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);

      return {
        success: true,
        data: featuredItems,
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
      // Return items with most reviews as popular
      const popularItems = mockFoodItems
        .sort((a, b) => b.reviews - a.reviews)
        .slice(0, limit);

      return {
        success: true,
        data: popularItems,
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
      return {
        success: true,
        data: mockCategories,
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
      const category = mockCategories.find(cat => cat.id === id);
      
      if (!category) {
        return {
          success: false,
          data: null,
          error: 'Category not found',
        };
      }

      return {
        success: true,
        data: category,
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
      let filteredRestaurants = [...mockRestaurants];

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

      if (params?.search) {
        const searchTerm = params.search.toLowerCase();
        filteredRestaurants = filteredRestaurants.filter(restaurant =>
          restaurant.name.toLowerCase().includes(searchTerm) ||
          restaurant.description.toLowerCase().includes(searchTerm) ||
          restaurant.categories.some(cat => cat.toLowerCase().includes(searchTerm))
        );
      }

      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedRestaurants = filteredRestaurants.slice(startIndex, endIndex);

      return {
        success: true,
        data: {
          data: paginatedRestaurants,
          currentPage: page,
          totalPages: Math.ceil(filteredRestaurants.length / limit),
          totalItems: filteredRestaurants.length,
          hasNext: endIndex < filteredRestaurants.length,
          hasPrevious: page > 1,
        },
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
      const restaurant = mockRestaurants.find(rest => rest.id === id);
      
      if (!restaurant) {
        return {
          success: false,
          data: null,
          error: 'Restaurant not found',
        };
      }

      return {
        success: true,
        data: restaurant,
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
      const featuredRestaurants = mockRestaurants
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);

      return {
        success: true,
        data: featuredRestaurants,
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