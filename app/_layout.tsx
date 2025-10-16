import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import AuthInitializer from '../src/components/auth/AuthInitializer';
import { store } from '../src/store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <Stack 
          screenOptions={{ headerShown: false }}
          initialRouteName="login"
        >
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </AuthInitializer>
    </Provider>
  );
}
