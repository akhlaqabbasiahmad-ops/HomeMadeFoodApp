import { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { useAppSelector } from '../store';
import { Order } from '../types';

export interface OrderItem {
  id: string;
  foodItemId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryFee: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  restaurantId: string;
  restaurantName: string;
  estimatedTime: number; // in minutes
  actualDeliveryTime?: string;
  orderDate: string;
  deliveryAddress: {
    street: string;
    city: string;
    zipCode: string;
  };
  paymentMethod: string;
  customerNotes?: string;
}

export interface UseOrdersReturn {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  refreshOrders: () => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  cancelOrder: (orderId: string) => Promise<void>;
  reorderItems: (orderId: string) => Promise<void>;
}

export const useOrders = (): UseOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const user = useAppSelector((state) => state.auth.user);

  // Fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (user) {
        const response = await apiService.getOrderHistory();
        
        if (response.success && response.data) {
          setOrders(response.data);
          // Set current order (most recent non-delivered order)
          const current = response.data.find((order: Order) => 
            ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status)
          );
          setCurrentOrder(current || null);
        } else {
          setOrders([]);
          setCurrentOrder(null);
          setError(response.error || 'Failed to fetch orders');
        }
      } else {
        setOrders([]);
        setCurrentOrder(null);
      }
    } catch (err) {
      setError('Failed to fetch orders. Please try again.');
      console.error('Orders fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = async () => {
    await fetchOrders();
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  const cancelOrder = async (orderId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.cancelOrder(orderId);
      
      if (response.success) {
        setOrders(prev => 
          prev.map(order => 
            order.id === orderId 
              ? { ...order, status: 'cancelled' as const }
              : order
          )
        );
        
        // Update current order if it was cancelled
        if (currentOrder?.id === orderId) {
          setCurrentOrder(null);
        }
      } else {
        setError(response.error || 'Failed to cancel order');
      }
    } catch (err) {
      setError('Failed to cancel order. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reorderItems = async (orderId: string): Promise<void> => {
    const order = getOrderById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    setLoading(true);
    setError(null);
    
    try {
      // Create new order with same items
      const orderData = {
        items: order.items.map(item => ({
          foodItemId: item.foodItemId,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions,
        })),
        restaurantId: order.restaurantId,
        deliveryAddress: order.deliveryAddress,
        paymentMethod: order.paymentMethod,
        customerNotes: order.customerNotes,
      };

      const response = await apiService.createOrder(orderData);
      
      if (response.success) {
        // Refresh orders to get the new order
        await fetchOrders();
      } else {
        setError(response.error || 'Failed to reorder items');
      }
    } catch (err) {
      setError('Failed to reorder items. Please try again.');
      console.error('Reorder error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return {
    orders,
    currentOrder,
    loading,
    error,
    refreshOrders,
    getOrderById,
    cancelOrder,
    reorderItems,
  };
};