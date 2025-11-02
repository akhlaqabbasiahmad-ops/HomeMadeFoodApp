import { ApiResponse, MealSuggestion } from '../types';

const API_BASE_URL = 'http://16.170.206.245:3000/api/v1';

class ApiService {
  private baseURL: string;
  private authToken: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  removeAuthToken() {
    this.authToken = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available
    if (this.authToken) {
      defaultHeaders.Authorization = `Bearer ${this.authToken}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      // Add timeout to prevent hanging requests (10 seconds)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      // Check if this is an optional endpoint that may not exist (404 is OK)
      const isOptionalEndpoint = (url.includes('/restaurants') || url.includes('/addresses')) && response.status === 404;
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If we can't parse the error response, use the default message
        }
        
        // For optional endpoints with 404, return gracefully instead of throwing
        if (isOptionalEndpoint) {
          // For addresses endpoint, return empty array instead of error
          if (url.includes('/addresses')) {
            return {
              success: true,
              data: [] as any,
            };
          }
          return {
            success: false,
            data: {} as T,
            error: errorMessage,
          };
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Handle abort/timeout errors gracefully
      if (error instanceof Error && error.name === 'AbortError') {
        if (__DEV__) {
          console.warn('API request timeout:', url);
        }
        return {
          success: false,
          data: {} as T,
          error: 'Request timeout. Please check your connection.',
        };
      }
      
      if (__DEV__) {
        console.error('API REQUEST FAILED:', {
          url,
          method: options.method || 'GET',
          error: error instanceof Error ? error.message : 'Network error occurred',
        });
      }
      return {
        success: false,
        data: {} as T,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse<{ user: any; token: string }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Generic HTTP methods
  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  async getProfile(): Promise<ApiResponse<any>> {
    return this.request('/profile');
  }

  // Address endpoints - using /users/{userId}/addresses format
  // Authorization header is automatically added via this.authToken
  async getAddresses(userId: string): Promise<ApiResponse<any[]>> {
    return this.request(`/users/${userId}/addresses`);
  }

  async addAddress(userId: string, addressData: {
    title: string;
    address: string;
    latitude: number;
    longitude: number;
    isDefault?: boolean;
  }): Promise<ApiResponse<any>> {
    return this.request(`/users/${userId}/addresses`, {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  }

  async updateAddress(userId: string, id: string, addressData: Partial<{
    title: string;
    address: string;
    latitude: number;
    longitude: number;
    isDefault: boolean;
  }>): Promise<ApiResponse<any>> {
    return this.request(`/users/${userId}/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  }

  async deleteAddress(userId: string, id: string): Promise<ApiResponse<any>> {
    return this.request(`/users/${userId}/addresses/${id}`, {
      method: 'DELETE',
    });
  }

  // Food endpoints
  async getFoodItems(params?: {
    query?: string;
    category?: string;
    page?: number;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
    isVegetarian?: boolean;
    isVegan?: boolean;
    featured?: boolean;
    popular?: boolean;
  }): Promise<ApiResponse<{
    items: any[];
    total: number;
    page: number;
    totalPages: number;
  }>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `/food${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async getFoodItemById(id: string): Promise<ApiResponse<any>> {
    return this.request(`/food/${id}`);
  }

  async getCategories(): Promise<ApiResponse<any[]>> {
    return this.request('/food/categories');
  }

  async getFeaturedItems(limit: number = 6): Promise<ApiResponse<any[]>> {
    return this.request(`/food/featured?limit=${limit}`);
  }

  async getPopularItems(limit: number = 6): Promise<ApiResponse<any[]>> {
    return this.request(`/food/popular?limit=${limit}`);
  }

  // Restaurant endpoints
  async getRestaurants(params?: {
    page?: number;
    limit?: number;
    category?: string;
  }): Promise<ApiResponse<{
    restaurants: any[];
    total: number;
    page: number;
    totalPages: number;
  }>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `/restaurants${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async getRestaurantById(id: string): Promise<ApiResponse<any>> {
    return this.request(`/restaurants/${id}`);
  }

  // Order endpoints
  async createOrder(orderData: {
    restaurantId: string;
    items: {
      foodItemId: string;
      quantity: number;
      specialInstructions?: string;
    }[];
    deliveryAddress: {
      title: string;
      address: string;
      latitude: number;
      longitude: number;
    };
    paymentMethod: string;
    specialInstructions?: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<ApiResponse<{
    orders: any[];
    total: number;
    page: number;
    totalPages: number;
  }>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `/orders${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async getOrderById(id: string): Promise<ApiResponse<any>> {
    return this.request(`/orders/${id}`);
  }

  // Admin endpoints for adding food and categories
  async createCategory(categoryData: {
    name: string;
    description?: string;
    icon?: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async createFoodItem(foodData: {
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string; // Category name (API doesn't accept categoryId)
    restaurantId: string;
    restaurantName: string;
    ingredients: string[];
    allergens?: string[];
    isVegetarian?: boolean;
    isVegan?: boolean;
    isSpicy?: boolean;
    preparationTime: number;
    calories?: number;
    isFeatured?: boolean;
    isPopular?: boolean;
  }): Promise<ApiResponse<any>> {
    return this.request('/admin/food', {
      method: 'POST',
      body: JSON.stringify(foodData),
    });
  }

  // Get meal suggestion
  async getMealSuggestion(): Promise<ApiResponse<MealSuggestion>> {
    return this.request<MealSuggestion>('/meal-suggestions/suggest', {
      method: 'GET',
    });
  }

  // Get today's meal suggestion with preferences
  async getTodayMealSuggestion(params?: {
    dietaryRestrictions?: string[];
    favoriteCategories?: string[];
    maxPrice?: number;
  }): Promise<ApiResponse<MealSuggestion>> {
    // Build query string manually for React Native compatibility
    const queryParts: string[] = [];
    
    if (params?.dietaryRestrictions && params.dietaryRestrictions.length > 0) {
      queryParts.push(`dietaryRestrictions=${encodeURIComponent(params.dietaryRestrictions.join(','))}`);
    }
    
    if (params?.favoriteCategories && params.favoriteCategories.length > 0) {
      queryParts.push(`favoriteCategories=${encodeURIComponent(params.favoriteCategories.join(','))}`);
    }
    
    if (params?.maxPrice !== undefined) {
      queryParts.push(`maxPrice=${params.maxPrice}`);
    }

    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    const url = `/meal-suggestions/today${queryString}`;

    return this.request<MealSuggestion>(url, {
      method: 'GET',
    });
  }

}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService;