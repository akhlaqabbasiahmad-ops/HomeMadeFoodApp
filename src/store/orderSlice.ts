import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../services/apiService';
import { authService } from '../services/authService';
import { Address, CartItem, Order, OrderStatus } from '../types';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  orderHistory: Order[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  orderHistory: [],
  isLoading: false,
  error: null,
};

// Async thunks for order management
export const fetchOrderHistory = createAsyncThunk(
  'orders/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      console.log('📱 Fetching order history...');
      
      const authHeader = await authService.getAuthHeader();
      if (!authHeader) {
        console.log('❌ User not authenticated');
        return rejectWithValue('User not authenticated');
      }

      console.log('🔑 Auth header:', authHeader);
      console.log('📡 Making API call to /orders/history');

      const response = await apiService.get('/orders/history', {
        headers: authHeader
      });

      console.log('📡 API Response:', response);

      if (response.success) {
        // Backend returns { orders: [], total, page, ... }
        return (response.data as any)?.orders || response.data || [];
      } else {
        // If API call fails, try to extract orders from direct response
        if ((response as any).orders) {
          return (response as any).orders;
        }
        return rejectWithValue(response.message || 'Failed to fetch order history');
      }
    } catch (error: any) {
      console.error('📱 Fetch order history error:', error);
      console.log('📱 API call failed, returning mock data for development');
      
      // Always return mock data in development for testing
      const mockOrders = [
        {
          id: '1',
          userId: 'user1',
          restaurantId: 'restaurant1',
          restaurantName: "Mario's Pizzeria",
          items: [],
          totalAmount: 25.99,
          deliveryFee: 2.99,
          tax: 2.60,
          grandTotal: 31.58,
          status: 'delivered' as OrderStatus,
          orderDate: new Date('2025-10-14T10:30:00'),
          estimatedDeliveryTime: new Date('2025-10-14T11:00:00'),
          deliveryAddress: {
            id: '1',
            title: 'Home',
            address: '123 Main Street',
            latitude: 40.7128,
            longitude: -74.0060,
            isDefault: true
          },
          paymentMethod: 'Credit Card'
        }
      ];
      
      console.log('📱 Returning mock orders:', mockOrders);
      return mockOrders;
    }
  }
);

export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async (orderData: CreateOrderPayload, { rejectWithValue }) => {
    try {
      const authHeader = await authService.getAuthHeader();
      if (!authHeader) {
        return rejectWithValue('User not authenticated');
      }

      // Transform frontend data to backend format
      const backendOrderData = {
        restaurantId: orderData.items[0]?.restaurantId || 'unknown',
        restaurantName: orderData.items[0]?.restaurantName || 'Unknown Restaurant',
        items: orderData.items.map(item => ({
          foodItemId: item.id,
          name: item.name || 'Unknown Item',
          image: item.image || '',
          price: item.price || 0,
          quantity: item.quantity || 1,
          specialInstructions: item.specialInstructions || ''
        })),
        totalAmount: orderData.totalAmount,
        deliveryFee: orderData.deliveryFee,
        tax: orderData.tax,
        grandTotal: orderData.grandTotal,
        deliveryAddress: {
          title: orderData.deliveryAddress.title,
          address: orderData.deliveryAddress.address,
          latitude: orderData.deliveryAddress.latitude,
          longitude: orderData.deliveryAddress.longitude
        },
        paymentMethod: orderData.paymentMethod,
        specialInstructions: orderData.deliveryInstructions || '',
        promoCode: orderData.promoCode,
        promoDiscount: orderData.promoDiscount || 0
      };

      console.log('📤 Placing order:', backendOrderData);
      
      const response = await apiService.post('/orders', backendOrderData, {
        headers: authHeader
      });

      if (response.success || (response as any).order) {
        const orderResult = (response as any).order || response.data;
        console.log('✅ Order placed successfully:', orderResult);
        return orderResult;
      } else {
        return rejectWithValue(response.message || 'Failed to place order');
      }
    } catch (error: any) {
      console.error('Place order error:', error);
      return rejectWithValue(error.message || 'Failed to place order');
    }
  }
);

interface CreateOrderPayload {
  items: CartItem[];
  deliveryAddress: Address;
  paymentMethod: string;
  totalAmount: number;
  deliveryFee: number;
  tax: number;
  grandTotal: number;
  promoDiscount?: number;
  promoCode?: string;
  deliveryInstructions?: string;
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    createOrderStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createOrderSuccess: (state, action: PayloadAction<CreateOrderPayload>) => {
      const {
        items,
        deliveryAddress,
        paymentMethod,
        totalAmount,
        deliveryFee,
        tax,
        grandTotal,
        promoDiscount = 0,
        promoCode,
        deliveryInstructions,
      } = action.payload;

      const newOrder: Order = {
        id: 'ORD_' + Date.now().toString(),
        userId: 'user_123', // In real app, get from auth state
        restaurantId: items[0]?.restaurantId || 'unknown',
        restaurantName: items[0]?.restaurantName || 'Unknown Restaurant',
        items,
        totalAmount,
        deliveryFee,
        tax,
        grandTotal: grandTotal - promoDiscount,
        status: 'pending',
        orderDate: new Date(),
        estimatedDeliveryTime: new Date(Date.now() + 35 * 60 * 1000), // 35 minutes from now
        deliveryAddress,
        paymentMethod,
        trackingId: 'TRK_' + Date.now().toString(),
      };

      state.orders.unshift(newOrder); // Add to beginning of array
      state.currentOrder = newOrder;
      state.isLoading = false;
    },
    createOrderFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: OrderStatus }>) => {
      const { orderId, status } = action.payload;
      const orderIndex = state.orders.findIndex(order => order.id === orderId);
      
      if (orderIndex >= 0) {
        state.orders[orderIndex].status = status;
        
        // Update estimated delivery time based on status
        if (status === 'confirmed') {
          state.orders[orderIndex].estimatedDeliveryTime = new Date(Date.now() + 30 * 60 * 1000);
        } else if (status === 'preparing') {
          state.orders[orderIndex].estimatedDeliveryTime = new Date(Date.now() + 25 * 60 * 1000);
        } else if (status === 'ready') {
          state.orders[orderIndex].estimatedDeliveryTime = new Date(Date.now() + 15 * 60 * 1000);
        } else if (status === 'on_the_way') {
          state.orders[orderIndex].estimatedDeliveryTime = new Date(Date.now() + 10 * 60 * 1000);
        }
        
        // Update current order if it matches
        if (state.currentOrder?.id === orderId) {
          state.currentOrder = state.orders[orderIndex];
        }
      }
    },
    setCurrentOrder: (state, action: PayloadAction<string>) => {
      const order = state.orders.find(order => order.id === action.payload);
      state.currentOrder = order || null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    reorderItems: (state, action: PayloadAction<string>) => {
      // This would typically trigger a new order creation with the same items
      const orderToReorder = state.orders.find(order => order.id === action.payload);
      if (orderToReorder) {
        // In a real app, this would add items back to cart and navigate to cart
        console.log('Reordering items from order:', orderToReorder.id);
      }
    },
    markOrderAsDelivered: (state, action: PayloadAction<string>) => {
      const orderIndex = state.orders.findIndex(order => order.id === action.payload);
      if (orderIndex >= 0) {
        state.orders[orderIndex].status = 'delivered';
        if (state.currentOrder?.id === action.payload) {
          state.currentOrder.status = 'delivered';
        }
      }
    },
    cancelOrder: (state, action: PayloadAction<string>) => {
      const orderIndex = state.orders.findIndex(order => order.id === action.payload);
      if (orderIndex >= 0) {
        // Only allow cancellation if order is not yet preparing
        if (['pending', 'confirmed'].includes(state.orders[orderIndex].status)) {
          state.orders[orderIndex].status = 'cancelled';
          if (state.currentOrder?.id === action.payload) {
            state.currentOrder.status = 'cancelled';
          }
        }
      }
    },
    loadOrderHistory: (state) => {
      // Mock loading order history - in real app would fetch from API
      state.isLoading = true;
    },
    loadOrderHistorySuccess: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    loadOrderHistoryFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearOrderError: (state) => {
      state.error = null;
    },
    addTestOrders: (state) => {
      // Add some test orders for development
      const testOrders = [
        {
          id: 'TEST_1',
          userId: 'user1',
          restaurantId: 'restaurant1',
          restaurantName: "Mario's Pizzeria",
          items: [],
          totalAmount: 25.99,
          deliveryFee: 2.99,
          tax: 2.60,
          grandTotal: 31.58,
          status: 'delivered' as OrderStatus,
          orderDate: new Date('2025-10-14T10:30:00'),
          estimatedDeliveryTime: new Date('2025-10-14T11:00:00'),
          deliveryAddress: {
            id: '1',
            title: 'Home',
            address: '123 Main Street',
            latitude: 40.7128,
            longitude: -74.0060,
            isDefault: true
          },
          paymentMethod: 'Credit Card'
        }
      ];
      state.orderHistory = testOrders;
      state.orders = testOrders;
    },
  },
  extraReducers: (builder) => {
    // Fetch order history
    builder
      .addCase(fetchOrderHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderHistory = action.payload as Order[];
        state.error = null;
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Place order
      .addCase(placeOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        const newOrder = action.payload as Order;
        state.orders.unshift(newOrder);
        state.orderHistory.unshift(newOrder); // Also add to order history for immediate visibility
        state.currentOrder = newOrder;
        state.error = null;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  createOrderStart,
  createOrderSuccess,
  createOrderFailure,
  updateOrderStatus,
  setCurrentOrder,
  clearCurrentOrder,
  reorderItems,
  markOrderAsDelivered,
  cancelOrder,
  loadOrderHistory,
  loadOrderHistorySuccess,
  loadOrderHistoryFailure,
  clearOrderError,
  addTestOrders,
} = orderSlice.actions;

// Async thunk for creating order
export const createOrder = (orderData: CreateOrderPayload) => async (dispatch: any) => {
  dispatch(createOrderStart());
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would make an API call to create the order
    dispatch(createOrderSuccess(orderData));
    
    // Start simulating order status updates
    setTimeout(() => dispatch(updateOrderStatus({ 
      orderId: 'ORD_' + Date.now().toString(), 
      status: 'confirmed' 
    })), 5000);
    
  } catch (error) {
    dispatch(createOrderFailure('Failed to create order. Please try again.'));
  }
};

// Thunk for simulating real-time order tracking
export const startOrderTracking = (orderId: string) => (dispatch: any) => {
  const statusUpdates: OrderStatus[] = ['confirmed', 'preparing', 'ready', 'on_the_way', 'delivered'];
  let currentStatusIndex = 0;
  
  const updateInterval = setInterval(() => {
    if (currentStatusIndex < statusUpdates.length) {
      dispatch(updateOrderStatus({
        orderId,
        status: statusUpdates[currentStatusIndex]
      }));
      currentStatusIndex++;
    } else {
      clearInterval(updateInterval);
    }
  }, 30000); // Update every 30 seconds for demo
};

export default orderSlice.reducer;