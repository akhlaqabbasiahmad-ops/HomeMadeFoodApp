// Colors - Modern Food App Palette
export const COLORS = {
  // Primary colors - Vibrant Food Orange/Red
  primary: '#FF6B4A',
  primaryLight: '#FF9068',
  primaryDark: '#E54A2E',
  primarySoft: '#FFF4F2',
  
  // Secondary colors - Fresh Green
  secondary: '#22C55E',
  secondaryLight: '#4ADE80',
  secondaryDark: '#16A34A',
  secondarySoft: '#F0FDF4',
  
  // Accent colors - Golden Yellow
  accent: '#FBBF24',
  accentLight: '#FDE047',
  accentDark: '#F59E0B',
  accentSoft: '#FFFBEB',
  
  // Tertiary colors - Deep Purple
  tertiary: '#8B5CF6',
  tertiaryLight: '#A78BFA',
  tertiaryDark: '#7C3AED',
  tertiarySoft: '#F5F3FF',
  
  // Neutral colors - Modern grays
  white: '#FFFFFF',
  black: '#0F172A',
  gray: {
    25: '#FCFCFD',
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  
  // Status colors - Modern variants
  success: '#10B981',
  successLight: '#34D399',
  successSoft: '#ECFDF5',
  
  error: '#EF4444',
  errorLight: '#F87171',
  errorSoft: '#FEF2F2',
  
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  warningSoft: '#FFFBEB',
  
  info: '#3B82F6',
  infoLight: '#60A5FA',
  infoSoft: '#EFF6FF',
  
  // Background colors - Clean and modern
  background: '#FFFFFF',
  backgroundSecondary: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',
  card: '#FFFFFF',
  
  // Text colors - Better contrast
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    tertiary: '#64748B',
    disabled: '#94A3B8',
    hint: '#CBD5E1',
    inverse: '#FFFFFF',
  },
  
  // Border colors
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#CBD5E1',
  
  // Shadow colors
  shadow: 'rgba(15, 23, 42, 0.1)',
  shadowLight: 'rgba(15, 23, 42, 0.05)',
  shadowMedium: 'rgba(15, 23, 42, 0.15)',
  shadowDark: 'rgba(15, 23, 42, 0.25)',
  
  // Overlay colors
  overlay: 'rgba(15, 23, 42, 0.6)',
  overlayLight: 'rgba(15, 23, 42, 0.4)',
  overlayDark: 'rgba(15, 23, 42, 0.8)',
  
  // Rating colors
  rating: '#FBBF24',
  ratingStar: '#F59E0B',
  
  // Delivery status colors
  preparing: '#F59E0B',
  onTheWay: '#3B82F6',
  delivered: '#10B981',
  cancelled: '#EF4444',
  
  // Gradient colors
  gradient: {
    primary: ['#FF6B4A', '#E54A2E'],
    secondary: ['#22C55E', '#16A34A'],
    accent: ['#FBBF24', '#F59E0B'],
    warm: ['#FF6B4A', '#FBBF24'],
    cool: ['#3B82F6', '#8B5CF6'],
    fresh: ['#22C55E', '#10B981'],
  },
  
  // Food category colors
  categories: {
    pizza: '#FF6B4A',
    burger: '#F59E0B',
    sushi: '#22C55E',
    dessert: '#8B5CF6',
    drinks: '#3B82F6',
    salad: '#10B981',
    indian: '#EF4444',
    chinese: '#F59E0B',
  },
};

// Typography
export const FONTS = {
  // Font families
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
  
  // Font sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Line heights
  lineHeights: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 32,
    '2xl': 36,
    '3xl': 40,
    '4xl': 44,
    '5xl': 56,
  },
};

// Spacing - Modern scale
export const SPACING = {
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
  
  // Semantic spacing
  xs: 4,
  sm: 8,
  base: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 80,
  '5xl': 96,
};

// Border radius - Modern rounded corners
export const RADIUS = {
  none: 0,
  xs: 2,
  sm: 4,
  base: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  '4xl': 32,
  full: 9999,
  
  // Component specific
  button: 8,
  card: 12,
  input: 8,
  modal: 16,
  avatar: 9999,
  badge: 6,
  chip: 20,
};

// Shadows - Modern soft shadows
export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  base: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  md: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6,
  },
  lg: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 8,
  },
  xl: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 12,
  },
  card: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  modal: {
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 16,
  },
};

// Layout
export const LAYOUT = {
  screen: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.base,
  },
  header: {
    height: 60,
  },
  tabBar: {
    height: 60,
  },
  card: {
    padding: SPACING.base,
    borderRadius: RADIUS.lg,
  },
  button: {
    height: 48,
    borderRadius: RADIUS.base,
  },
  input: {
    height: 48,
    borderRadius: RADIUS.base,
    paddingHorizontal: SPACING.base,
  },
};

// Animation
export const ANIMATION = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// Screen dimensions (will be set dynamically)
export const SCREEN = {
  width: 375, // Default, will be updated
  height: 667, // Default, will be updated
};

// API endpoints
export const API_ENDPOINTS = {
  BASE_URL: 'https://api.homemadefood.com/v1',
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    FORGOT_PASSWORD: '/auth/forgot-password',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
  RESTAURANTS: {
    GET_ALL: '/restaurants',
    GET_BY_ID: '/restaurants/:id',
    GET_NEARBY: '/restaurants/nearby',
    SEARCH: '/restaurants/search',
  },
  FOOD: {
    GET_BY_RESTAURANT: '/restaurants/:restaurantId/foods',
    GET_BY_ID: '/foods/:id',
    SEARCH: '/foods/search',
    GET_CATEGORIES: '/foods/categories',
  },
  ORDERS: {
    CREATE: '/orders',
    GET_ALL: '/orders',
    GET_BY_ID: '/orders/:id',
    UPDATE_STATUS: '/orders/:id/status',
    TRACK: '/orders/:id/track',
  },
  USER: {
    GET_PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    GET_ADDRESSES: '/user/addresses',
    ADD_ADDRESS: '/user/addresses',
    UPDATE_ADDRESS: '/user/addresses/:id',
    DELETE_ADDRESS: '/user/addresses/:id',
    GET_FAVORITES: '/user/favorites',
    ADD_FAVORITE: '/user/favorites',
    REMOVE_FAVORITE: '/user/favorites/:id',
  },
};

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  REFRESH_TOKEN: '@refresh_token',
  USER_DATA: '@user_data',
  CART_ITEMS: '@cart_items',
  ADDRESSES: '@addresses',
  FAVORITES: '@favorites',
  SEARCH_HISTORY: '@search_history',
  APP_SETTINGS: '@app_settings',
};