import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { orders, statusLabel } from '../data/orders';
import { colors, radius, shadow } from '../constants/theme';

const STATUS_COLOR: Record<string, string> = {
  entregado: colors.green,
  en_camino: '#2D7FF9',
  preparando: colors.yellow,
  cancelado: colors.red,
};

// Tira con el estado del último pedido en el Home.
export default function OrderStatusStrip() {
  const o = orders[0];
  if (!o) return null;
  const color = STATUS_COLOR[o.status] ?? colors.green;

  return (
    <Pressable style={styles.card} onPress={() => router.push('/(tabs)/pedidos')}>
      <View style={styles.icon}>
        <Ionicons name="cube" size={18} color="#fff" />
      </View>
      <View style={styles.mid}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Pedido</Text>
          <View style={[styles.pill, { backgroundColor: color + '1A' }]}>
            <Text style={[styles.pillText, { color }]}>
              {statusLabel[o.status]}
            </Text>
          </View>
        </View>
        <Text style={styles.folio}>#{o.folio}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: radius.md,
    paddingVertical: 8,
    paddingHorizontal: 10,
    ...shadow.soft,
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mid: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { fontSize: 13, fontWeight: '800', color: colors.text },
  pill: { borderRadius: radius.pill, paddingHorizontal: 7, paddingVertical: 1 },
  pillText: { fontSize: 9, fontWeight: '800' },
  folio: { fontSize: 11, color: colors.textMuted },
});
