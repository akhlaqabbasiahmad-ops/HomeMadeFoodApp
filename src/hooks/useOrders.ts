import { useEffect, useState } from 'react';
import { useAppSelector } from '../store';

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

// Mock orders data
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'HMF001',
    items: [
      {
        id: '1',
        foodItemId: '1',
        name: 'Margherita Pizza',
        image: 'https://images.unsplash.com/photo-1565298507278-760aac2d3d0a',
        price: 12.99,
        quantity: 1,
      },
      {
        id: '2',
        foodItemId: '2',
        name: 'Caesar Salad',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
        price: 8.99,
        quantity: 1,
      },
    ],
    totalAmount: 24.97,
    deliveryFee: 2.99,
    status: 'delivered',
    restaurantId: '1',
    restaurantName: "Mario's Pizzeria",
    estimatedTime: 30,
    actualDeliveryTime: '25 min',
    orderDate: '2025-10-14T10:30:00Z',
    deliveryAddress: {
      street: '123 Main St',
      city: 'New York',
      zipCode: '10001',
    },
    paymentMethod: 'Credit Card',
  },
  {
    id: '2',
    orderNumber: 'HMF002',
    items: [
      {
        id: '3',
        foodItemId: '3',
        name: 'Beef Burger Deluxe',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
        price: 14.50,
        quantity: 2,
        specialInstructions: 'No onions, extra cheese',
      },
    ],
    totalAmount: 32.99,
    deliveryFee: 3.49,
    status: 'preparing',
    restaurantId: '2',
    restaurantName: 'Burger House',
    estimatedTime: 25,
    orderDate: '2025-10-14T12:15:00Z',
    deliveryAddress: {
      street: '456 Oak Ave',
      city: 'New York',
      zipCode: '10002',
    },
    paymentMethod: 'PayPal',
    customerNotes: 'Please call when you arrive',
  },
  {
    id: '3',
    orderNumber: 'HMF003',
    items: [
      {
        id: '4',
        foodItemId: '4',
        name: 'Chicken Tikka Masala',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
        price: 16.99,
        quantity: 1,
      },
    ],
    totalAmount: 19.98,
    deliveryFee: 2.99,
    status: 'confirmed',
    restaurantId: '3',
    restaurantName: 'Spice Palace',
    estimatedTime: 40,
    orderDate: '2025-10-14T13:45:00Z',
    deliveryAddress: {
      street: '789 Pine St',
      city: 'New York',
      zipCode: '10003',
    },
    paymentMethod: 'Credit Card',
  },
];

export const useOrders = (): UseOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const user = useAppSelector((state) => state.auth.user);

  // Simulate API call to fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        setOrders(mockOrders);
        // Set current order (most recent non-delivered order)
        const current = mockOrders.find(order => 
          ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status)
        );
        setCurrentOrder(current || null);
      } else {
        setOrders([]);
        setCurrentOrder(null);
      }
    } catch {
      setError('Failed to fetch orders. Please try again.');
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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

    // Here you would typically add items to cart
    // For now, just simulate the action
    console.log('Reordering items from order:', orderId);
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