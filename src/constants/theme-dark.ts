import { COLORS as LIGHT_COLORS } from './theme';

// Dark mode color palette
export const DARK_COLORS = {
  // Primary colors - Vibrant Food Orange/Red (same as light)
  primary: '#FF6B4A',
  primaryLight: '#FF9068',
  primaryDark: '#E54A2E',
  primarySoft: '#2D1B1A',
  
  // Secondary colors - Fresh Green (same as light)
  secondary: '#22C55E',
  secondaryLight: '#4ADE80',
  secondaryDark: '#16A34A',
  secondarySoft: '#0F2A1A',
  
  // Accent colors - Golden Yellow (same as light)
  accent: '#FBBF24',
  accentLight: '#FDE047',
  accentDark: '#F59E0B',
  accentSoft: '#2A2410',
  
  // Tertiary colors - Deep Purple (same as light)
  tertiary: '#8B5CF6',
  tertiaryLight: '#A78BFA',
  tertiaryDark: '#7C3AED',
  tertiarySoft: '#1F1A2A',
  
  // Neutral colors - Dark theme grays
  white: '#FFFFFF',
  black: '#0F172A',
  gray: {
    25: '#0F172A',
    50: '#1E293B',
    100: '#334155',
    200: '#475569',
    300: '#64748B',
    400: '#94A3B8',
    500: '#CBD5E1',
    600: '#E2E8F0',
    700: '#F1F5F9',
    800: '#F8FAFC',
    900: '#FCFCFD',
  },
  
  // Status colors - Dark theme variants
  success: '#10B981',
  successLight: '#34D399',
  successSoft: '#0F2A1A',
  
  error: '#EF4444',
  errorLight: '#F87171',
  errorSoft: '#2A1A1A',
  
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  warningSoft: '#2A2410',
  
  info: '#3B82F6',
  infoLight: '#60A5FA',
  infoSoft: '#1A1F2A',
  
  // Background colors - Dark theme
  background: '#0F172A',
  backgroundSecondary: '#1E293B',
  surface: '#1E293B',
  surfaceSecondary: '#334155',
  card: '#1E293B',
  
  // Text colors - Dark theme
  text: {
    primary: '#F8FAFC',
    secondary: '#CBD5E1',
    tertiary: '#94A3B8',
    disabled: '#64748B',
    hint: '#475569',
    inverse: '#0F172A',
  },
  
  // Border colors - Dark theme
  border: '#334155',
  borderLight: '#475569',
  divider: '#64748B',
  
  // Shadow colors - Dark theme
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowLight: 'rgba(0, 0, 0, 0.2)',
  shadowMedium: 'rgba(0, 0, 0, 0.4)',
  shadowDark: 'rgba(0, 0, 0, 0.6)',
  
  // Overlay colors - Dark theme
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',
  overlayDark: 'rgba(0, 0, 0, 0.9)',
  
  // Rating colors (same as light)
  rating: '#FBBF24',
  ratingStar: '#F59E0B',
  
  // Delivery status colors (same as light)
  preparing: '#F59E0B',
  onTheWay: '#3B82F6',
  delivered: '#10B981',
  cancelled: '#EF4444',
  
  // Gradient colors - Dark theme variants
  gradient: {
    primary: ['#FF6B4A', '#E54A2E'],
    secondary: ['#22C55E', '#16A34A'],
    accent: ['#FBBF24', '#F59E0B'],
    warm: ['#FF6B4A', '#FBBF24'],
    cool: ['#3B82F6', '#8B5CF6'],
    fresh: ['#22C55E', '#10B981'],
    dark: ['#1E293B', '#0F172A'],
    surface: ['#334155', '#1E293B'],
  },
  
  // Food category colors (same as light)
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

// Theme configuration
export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  colors: typeof LIGHT_COLORS;
  isDark: boolean;
}

export const createTheme = (mode: ThemeMode): Theme => ({
  mode,
  colors: mode === 'dark' ? DARK_COLORS : LIGHT_COLORS,
  isDark: mode === 'dark',
});

// Default themes
export const lightTheme = createTheme('light');
export const darkTheme = createTheme('dark');

// Theme context type
export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}
