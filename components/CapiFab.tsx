import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import { colors, radius, shadow } from '../constants/theme';

// Botón flotante del agente Capi. Se posiciona arriba del nav (y de la barra
// de subtotal cuando hay productos), en todas las tabs.
export default function CapiFab() {
  const { count } = useCart();
  const insets = useSafeAreaInsets();
  const navHeight = Math.max(insets.bottom, 10) + 56;
  const cartBar = count > 0 ? 66 : 0;
  const bottom = navHeight + cartBar + 12;

  return (
    <Pressable
      style={[styles.fab, { bottom }]}
      onPress={() => router.push('/capi/onboarding')}
      hitSlop={6}
    >
      <Image
        source={require('../assets/img/capi_initial_icon.png')}
        style={styles.icon}
        resizeMode="contain"
      />
      <View style={styles.dot} />
    </Pressable>
  );
}

const SIZE = 82;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 14,
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  icon: { width: SIZE, height: SIZE },
  dot: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: '#fff',
  },
});
