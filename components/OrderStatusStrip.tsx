import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radius, shadow } from '../constants/theme';
import {
  normalizeStatus,
  statusKindColor,
  statusKindLabel,
} from '../constants/orderStatus';
import { BackendOrder, fetchCustomerOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Tira con el estado del último pedido real del cliente en el Home.
export default function OrderStatusStrip() {
  const { customerId } = useAuth();
  const [order, setOrder] = useState<BackendOrder | null>(null);

  useEffect(() => {
    let alive = true;
    if (!customerId) {
      setOrder(null);
      return;
    }
    fetchCustomerOrders(customerId)
      .then((res) => {
        if (!alive) return;
        const list = res.data ?? [];
        setOrder(list.length ? list[list.length - 1] : null);
      })
      .catch(() => alive && setOrder(null));
    return () => {
      alive = false;
    };
  }, [customerId]);

  if (!order) return null;

  const kind = normalizeStatus(order.status_final);
  const color = statusKindColor[kind];
  const folio = String(order.id_pedido ?? order['﻿id_pedido'] ?? '');

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
              {statusKindLabel[kind]}
            </Text>
          </View>
        </View>
        <Text style={styles.folio} numberOfLines={1}>
          #{folio}
        </Text>
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
  folio: { fontSize: 11, color: colors.textMuted, flex: 1 },
});
