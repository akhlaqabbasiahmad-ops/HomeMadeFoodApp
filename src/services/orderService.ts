import { Order, OrderStatus } from '../types';
import { apiService } from './apiService';
import { authService } from './authService';

export interface OrderFilters {
  status?: OrderStatus;
  dateFrom?: Date;
  dateTo?: Date;
  restaurantId?: string;
}

export interface OrderPaginationResult {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

class OrderService {
  // Get order history with pagination and filters
  async getOrderHistory(page: number = 1, limit: number = 10, filters?: OrderFilters): Promise<OrderPaginationResult> {
    try {
      const authHeader = await authService.getAuthHeader();
      if (!authHeader) {
        throw new Error('User not authenticated');
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters?.status) {
        params.append('status', filters.status);
      }
      if (filters?.dateFrom) {
        params.append('dateFrom', filters.dateFrom.toISOString());
      }
      if (filters?.dateTo) {
        params.append('dateTo', filters.dateTo.toISOString());
      }
      if (filters?.restaurantId) {
        params.append('restaurantId', filters.restaurantId);
      }

      const response = await apiService.get(`/orders/history?${params.toString()}`, {
        headers: authHeader
      });

      if (response.success || response.orders) {
        return {
          orders: response.orders || response.data?.orders || [],
          total: response.total || response.data?.total || 0,
          page: response.page || response.data?.page || page,
          totalPages: response.totalPages || response.data?.totalPages || 0,
          hasNext: response.hasNext || response.data?.hasNext || false,
          hasPrevious: response.hasPrevious || response.data?.hasPrevious || false,
        };
      }

      throw new Error(response.message || 'Failed to fetch order history');
    } catch (error) {
      console.error('Get order history error:', error);
      throw error;
    }
  }

  // Get specific order by ID
  async getOrderById(orderId: string): Promise<Order> {
    try {
      const authHeader = await authService.getAuthHeader();
      if (!authHeader) {
        throw new Error('User not authenticated');
      }

      const response = await apiService.get(`/orders/${orderId}`, {
        headers: authHeader
      });

      if (response.success || response.order) {
        return response.order || response.data;
      }

      throw new Error(response.message || 'Order not found');
    } catch (error) {
      console.error('Get order by ID error:', error);
      throw error;
    }
  }

  // Cancel order
  async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    try {
      const authHeader = await authService.getAuthHeader();
      if (!authHeader) {
        throw new Error('User not authenticated');
      }

      const response = await apiService.put(`/orders/${orderId}/cancel`, 
        { reason },
        { headers: authHeader }
      );

      if (response.success || response.order) {
        return response.order || response.data;
      }

      throw new Error(response.message || 'Failed to cancel order');
    } catch (error) {
      console.error('Cancel order error:', error);
      throw error;
    }
  }

  // Rate order (for future use)
  async rateOrder(orderId: string, rating: number, review?: string): Promise<void> {
    try {
      const authHeader = await authService.getAuthHeader();
      if (!authHeader) {
        throw new Error('User not authenticated');
      }

      const response = await apiService.post(`/orders/${orderId}/rate`, 
        { rating, review },
        { headers: authHeader }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to rate order');
      }
    } catch (error) {
      console.error('Rate order error:', error);
      throw error;
    }
  }

  // Reorder items (add previous order items to cart)
  async reorderItems(orderId: string): Promise<Order> {
    try {
      const authHeader = await authService.getAuthHeader();
      if (!authHeader) {
        throw new Error('User not authenticated');
      }

      const response = await apiService.post(`/orders/${orderId}/reorder`, 
        {},
        { headers: authHeader }
      );

      if (response.success || response.order) {
        return response.order || response.data;
      }

      throw new Error(response.message || 'Failed to reorder items');
    } catch (error) {
      console.error('Reorder items error:', error);
      throw error;
    }
  }

  // Track order status (for real-time updates)
  async trackOrder(orderId: string): Promise<Order> {
    try {
      const authHeader = await authService.getAuthHeader();
      if (!authHeader) {
        throw new Error('User not authenticated');
      }

      const response = await apiService.get(`/orders/${orderId}/track`, {
        headers: authHeader
      });

      if (response.success || response.order) {
        return response.order || response.data;
      }

      throw new Error(response.message || 'Failed to track order');
    } catch (error) {
      console.error('Track order error:', error);
      throw error;
    }
  }

  // Get order summary/statistics
  async getOrderStats(period: 'week' | 'month' | 'year' = 'month'): Promise<any> {
    try {
      const authHeader = await authService.getAuthHeader();
      if (!authHeader) {
        throw new Error('User not authenticated');
      }

      const response = await apiService.get(`/orders/stats?period=${period}`, {
        headers: authHeader
      });

      if (response.success || response.stats) {
        return response.stats || response.data;
      }

      throw new Error(response.message || 'Failed to fetch order statistics');
    } catch (error) {
      console.error('Get order stats error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const orderService = new OrderService();