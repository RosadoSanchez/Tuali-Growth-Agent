import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCart } from '../context/CartContext';
import { colors } from '../constants/theme';
import { money } from '../constants/format';

// Barra de subtotal integrada justo arriba del nav. Solo con productos.
export default function CartBar() {
  const { count, total } = useCart();
  if (count === 0) return null;

  return (
    <Pressable style={styles.bar} onPress={() => router.push('/carrito')}>
      <View>
        <Text style={styles.label}>Subtotal :</Text>
        <Text style={styles.total}>{money(total)}</Text>
        <View style={styles.accent} />
      </View>
      <View style={styles.right}>
        <Text style={styles.ver}>Ver descuentos</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.red} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
  },
  label: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  total: { color: colors.text, fontSize: 24, fontWeight: '900', marginTop: 1 },
  accent: {
    width: 64,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.red,
    marginTop: 6,
  },
  right: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ver: { color: colors.red, fontSize: 15, fontWeight: '700' },
});
