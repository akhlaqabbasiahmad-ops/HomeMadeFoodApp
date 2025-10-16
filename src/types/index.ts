// User types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  address?: Address[];
}

export interface Address {
  id: string;
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
}

// Food and Restaurant types
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  categories: string[];
  isOpen: boolean;
  distance: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  category: string;
  restaurantId: string;
  restaurantName: string;
  ingredients: string[];
  allergens: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  isSpicy: boolean;
  preparationTime: number;
  calories?: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  icon: string;
}

// Cart types
export interface CartItem extends FoodItem {
  quantity: number;
  totalPrice: number;
  specialInstructions?: string;
}

// Order types
export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  totalAmount: number;
  deliveryFee: number;
  tax: number;
  grandTotal: number;
  status: OrderStatus;
  orderDate: Date;
  estimatedDeliveryTime: Date;
  deliveryAddress: Address;
  paymentMethod: string;
  trackingId?: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'ready' 
  | 'on_the_way' 
  | 'delivered' 
  | 'cancelled';

// Navigation types
export type RootStackParamList = {
  Welcome: undefined;
  Auth: undefined;
  MainStack: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  Main: undefined;
  Restaurant: { restaurantId: string };
  FoodDetail: { foodItem: FoodItem };
  Cart: undefined;
  Order: undefined;
  Checkout: undefined;
  OrderTracking: { orderId: string };
  Profile: undefined;
  OrderHistory: undefined;
  EditProfile: undefined;
  AddAddress: undefined;
  Search: { query?: string };
  Filter: undefined;
  Favorites: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Filter types
export interface FilterOptions {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  rating: number;
  deliveryTime: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  sortBy: 'rating' | 'price_low' | 'price_high' | 'delivery_time' | 'popularity';
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Cart state types
export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  deliveryFee: number;
  tax: number;
  grandTotal: number;
}

// Loading states
export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

// Component Props types
export interface FoodCardProps {
  item: FoodItem;
  onPress: (item: FoodItem) => void;
  onAddToCart?: (item: FoodItem) => void;
}

export interface CategoryCardProps {
  item: Category;
  onPress: (category: Category) => void;
}

export interface CartItemComponentProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Hook return types
export interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
}

export interface UseCartReturn {
  items: CartItem[];
  total: number;
  itemCount: number;
  deliveryFee: number;
  tax: number;
  grandTotal: number;
  addToCart: (item: FoodItem, quantity?: number, specialInstructions?: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  updateSpecialInstructions: (itemId: string, instructions: string) => void;
  setDeliveryFee: (fee: number) => void;
}

// Redux types
export type RootState = {
  auth: AuthState;
  cart: CartState;
};

// Screen types for navigation state
export type Screen = 'welcome' | 'login' | 'signup' | 'home' | 'restaurant' | 'foodDetail' | 'cart' | 'profile';

// Notification types
export interface NotificationData {
  id: string;
  title: string;
  body: string;
  type: 'order_update' | 'promotion' | 'general';
  data?: any;
  timestamp: Date;
  isRead: boolean;
}