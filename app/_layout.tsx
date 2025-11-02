import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import AuthInitializer from '../src/components/auth/AuthInitializer';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { store } from '../src/store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthInitializer>
          <Stack
            screenOptions={{ headerShown: false }}
            initialRouteName="(tabs)"
          >
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="admin-login" options={{ headerShown: false }} />
            <Stack.Screen name="admin-home" options={{ headerShown: false }} />
            <Stack.Screen name="add-food" options={{ headerShown: false }} />
            <Stack.Screen name="add-category" options={{ headerShown: false }} />
                <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
                <Stack.Screen name="settings" options={{ headerShown: false }} />
                <Stack.Screen name="favorites" options={{ headerShown: false }} />
                <Stack.Screen name="help" options={{ headerShown: false }} />
                <Stack.Screen name="addresses" options={{ headerShown: false }} />
                <Stack.Screen name="add-address" options={{ headerShown: false }} />
                <Stack.Screen name="payment-methods" options={{ headerShown: false }} />
                <Stack.Screen name="notifications" options={{ headerShown: false }} />
                <Stack.Screen name="order-detail" options={{ headerShown: false }} />
                <Stack.Screen name="today-meal" options={{ headerShown: false }} />
          </Stack>
        </AuthInitializer>
      </ThemeProvider>
    </Provider>
  );
}
