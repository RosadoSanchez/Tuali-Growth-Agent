import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartProvider } from '../context/CartContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { colors } from '../constants/theme';

// Redirige según haya o no sesión:
// - sin sesión -> pantalla de login
// - con sesión y parado en login -> entra a la app
function AuthGate() {
  const { isLoggedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const onLogin = segments[0] === 'login';
    if (!isLoggedIn && !onLogin) {
      router.replace('/login');
    } else if (isLoggedIn && onLogin) {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="producto/[id]" options={{ presentation: 'card' }} />
      <Stack.Screen name="growth" />
      <Stack.Screen name="carrito" options={{ presentation: 'card' }} />
      <Stack.Screen
        name="capi/onboarding"
        options={{
          presentation: 'transparentModal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen name="capi/chat" options={{ presentation: 'card' }} />
      <Stack.Screen name="capi/marcador" options={{ presentation: 'card' }} />
      <Stack.Screen name="capi/voz" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <CartProvider>
            <StatusBar style="dark" />
            <AuthGate />
          </CartProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
