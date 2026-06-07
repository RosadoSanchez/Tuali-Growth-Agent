import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartProvider } from '../context/CartContext';
import { colors } from '../constants/theme';
import ElevenFloatingButton from '../components/ElevenFloatingButton';
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <CartProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bg },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="producto/[id]"
              options={{ presentation: 'card' }}
            />
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
          <ElevenFloatingButton />
        </CartProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
