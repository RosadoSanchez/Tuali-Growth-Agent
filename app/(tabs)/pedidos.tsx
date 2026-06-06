import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../../constants/theme';
import { money, monthYear } from '../../constants/format';
import { orders, statusLabel } from '../../data/orders';
import { productById } from '../../data/catalog';
import { Order } from '../../data/types';

const FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'en_camino', label: 'En camino' },
  { id: 'entregado', label: 'Entregados' },
  { id: 'cancelado', label: 'Cancelados' },
] as const;

const statusColor: Record<Order['status'], string> = {
  entregado: colors.green,
  en_camino: colors.purple,
  preparando: colors.yellow,
  cancelado: colors.textMuted,
};

export default function Pedidos() {
  const [filter, setFilter] = useState<string>('todos');

  const grouped = useMemo(() => {
    const list =
      filter === 'todos' ? orders : orders.filter((o) => o.status === filter);
    const map: Record<string, Order[]> = {};
    list.forEach((o) => {
      const key = monthYear(o.date);
      (map[key] ||= []).push(o);
    });
    return map;
  }, [filter]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.h1}>Mis pedidos</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <Pressable
              key={f.id}
              onPress={() => setFilter(f.id)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      >
        {Object.entries(grouped).map(([month, list]) => (
          <View key={month} style={{ marginBottom: 18 }}>
            <Text style={styles.month}>{month}</Text>
            {list.map((o) => {
              const first = productById(o.items[0].productId);
              return (
                <View key={o.id} style={styles.card}>
                  <View style={[styles.thumb, { backgroundColor: first?.color }]}>
                    <Text style={{ fontSize: 26 }}>{first?.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.folio}>{o.folio}</Text>
                    <Text style={styles.meta}>
                      {o.items.length} productos · {o.units} unidades
                    </Text>
                    <View style={styles.statusRow}>
                      <View
                        style={[styles.dot, { backgroundColor: statusColor[o.status] }]}
                      />
                      <Text style={[styles.status, { color: statusColor[o.status] }]}>
                        {statusLabel[o.status]}
                      </Text>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <Text style={styles.total}>{money(o.total)}</Text>
                    <Pressable style={styles.reorder} hitSlop={6}>
                      <Ionicons name="refresh" size={13} color={colors.primary} />
                      <Text style={styles.reorderText}>Repetir</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        ))}
        {Object.keys(grouped).length === 0 && (
          <Text style={styles.empty}>No tienes pedidos en este filtro.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 10 },
  h1: { fontSize: 26, fontWeight: '900', color: colors.text },
  filterRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 8 },
  chip: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  chipTextActive: { color: '#fff' },
  month: { fontSize: 13, fontWeight: '800', color: colors.textMuted, marginBottom: 10 },
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: 12,
    marginBottom: 10,
    ...shadow.soft,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  folio: { fontSize: 14, fontWeight: '800', color: colors.text },
  meta: { fontSize: 12, color: colors.textMuted, marginTop: 3 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  status: { fontSize: 12, fontWeight: '700' },
  total: { fontSize: 15, fontWeight: '900', color: colors.text },
  reorder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  reorderText: { fontSize: 11, fontWeight: '800', color: colors.primary },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: 40 },
});
