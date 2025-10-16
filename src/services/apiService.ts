import { ApiResponse } from '../types';

const API_BASE_URL = __DEV__ 
  ? 'http://192.168.1.6:3000/api/v1' 
  : 'https://your-production-api.com/api/v1';

class ApiService {
  private baseURL: string;
  private authToken: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('🔧 ApiService initialized with baseURL:', this.baseURL);
    console.log('🔧 __DEV__ value:', __DEV__);
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
    
    console.log('🚀 API REQUEST:', {
      url,
      method: options.method || 'GET',
      timestamp: new Date().toISOString(),
      baseURL: this.baseURL,
      endpoint
    });
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

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
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If we can't parse the error response, use the default message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ API REQUEST FAILED:', {
        url,
        method: options.method || 'GET',
        error: error instanceof Error ? error.message : 'Network error occurred',
        timestamp: new Date().toISOString()
      });
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

    // Use the working test endpoint for now
    try {
      const response = await this.request<any>('/test/food');
      if (response.success && response.data) {
        const data = response.data as any;
        return {
          success: true,
          data: {
            items: data.items || [],
            total: data.total || 0,
            page: params?.page || 1,
            totalPages: Math.ceil((data.total || 0) / (params?.limit || 10))
          }
        };
      }
      return { 
        success: false, 
        error: 'No data received',
        data: { items: [], total: 0, page: 1, totalPages: 0 }
      };
    } catch {
      return { 
        success: false, 
        error: 'Failed to fetch food items',
        data: { items: [], total: 0, page: 1, totalPages: 0 }
      };
    }
  }

  async getFoodItemById(id: string): Promise<ApiResponse<any>> {
    return this.request(`/food/${id}`);
  }

  async getCategories(): Promise<ApiResponse<any[]>> {
    try {
      const response = await this.request<any>('/test/categories');
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data || []
        };
      }
      return { success: false, error: 'No categories found', data: [] };
    } catch {
      return { success: false, error: 'Failed to fetch categories', data: [] };
    }
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
    return this.request('/test/categories', {
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
    category: string;
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
    return this.request('/test/food', {
      method: 'POST',
      body: JSON.stringify(foodData),
    });
  }

}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService;