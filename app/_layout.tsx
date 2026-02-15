import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { CartProvider } from '@/hooks/use-cart';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const { isLoading, userToken } = useAuth();

  if (isLoading) {
    return null; // Loading screen
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {userToken ? (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        )}
        <Stack.Screen name="auth" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        <Stack.Screen name="auth/forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="product/[id]" options={{ title: 'Product Details', headerShown: true }} />
        <Stack.Screen name="checkout" options={{ title: 'Checkout', headerShown: true }} />
        <Stack.Screen name="order-details/[id]" options={{ title: 'Order Details', headerShown: true }} />
        <Stack.Screen name="profile/edit-profile" options={{ title: 'Edit Profile', headerShown: true }} />
        <Stack.Screen name="profile/addresses" options={{ title: 'Addresses', headerShown: true }} />
        <Stack.Screen name="profile/settings" options={{ title: 'Settings', headerShown: true }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <RootLayoutContent />
      </CartProvider>
    </AuthProvider>
  );
}
