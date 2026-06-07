import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../../constants/theme';
import { money, monthYear } from '../../constants/format';
import { orders, statusLabel } from '../../data/orders';
import { Order } from '../../data/types';
import BrandChips from '../../components/BrandChips';

const FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'activos', label: 'Activos' },
  { id: 'entregado', label: 'Entregados' },
  { id: 'cancelado', label: 'Cancelados' },
] as const;

const statusColor: Record<Order['status'], string> = {
  entregado: colors.green,
  en_camino: '#2D7FF9',
  preparando: colors.yellow,
  cancelado: colors.red,
};

const shortDate = (iso: string) => {
  const d = new Date(iso + 'T00:00:00');
  const m = d.toLocaleDateString('es-MX', { month: 'short' }).replace('.', '');
  return `${d.getDate()}/${m}/${d.getFullYear()}`;
};

export default function Pedidos() {
  const [filter, setFilter] = useState<string>('todos');

  const grouped = useMemo(() => {
    const list = orders.filter((o) => {
      if (filter === 'todos') return true;
      if (filter === 'activos') return o.status === 'en_camino' || o.status === 'preparando';
      return o.status === filter;
    });
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
        <Text style={styles.h1}>Pedidos Bokados</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View style={{ marginTop: 4, marginBottom: 14 }}>
          <BrandChips />
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

        <View style={{ paddingHorizontal: 16, marginTop: 4 }}>
          {Object.entries(grouped).map(([month, list]) => (
            <View key={month} style={{ marginBottom: 18 }}>
              <View style={styles.monthRow}>
                <Text style={styles.month}>{month}</Text>
                <Text style={styles.count}>{list.length} Pedidos</Text>
              </View>

              {list.map((o) => {
                const color = statusColor[o.status];
                const cancel = o.status === 'cancelado';
                return (
                  <View key={o.id} style={styles.card}>
                    <Text style={styles.orderNo}>No. de pedido: {o.folio}</Text>

                    <View style={styles.midRow}>
                      <View style={styles.truck}>
                        <Ionicons name="cube" size={20} color="#fff" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.qty}>
                          {o.units} paquetes + 0 unidades
                        </Text>
                        <Text style={styles.date}>Pedido el {shortDate(o.date)}</Text>
                      </View>
                      <Text style={styles.total}>{money(o.total)}</Text>
                    </View>

                    <View style={styles.bottomRow}>
                      <View style={styles.statusRow}>
                        <Ionicons
                          name={cancel ? 'close-circle' : 'checkmark-circle'}
                          size={16}
                          color={color}
                        />
                        <Text style={[styles.status, { color }]}>
                          {statusLabel[o.status]}
                        </Text>
                      </View>
                      <Pressable style={styles.detail} hitSlop={6}>
                        <Text style={styles.detailText}>Ver detalle</Text>
                        <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 6 },
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
  chipActive: { backgroundColor: colors.red, borderColor: colors.red },
  chipText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  chipTextActive: { color: '#fff' },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  month: { fontSize: 14, fontWeight: '800', color: colors.text },
  count: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  card: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 12,
    ...shadow.soft,
  },
  orderNo: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  midRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 },
  truck: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: { fontSize: 14, fontWeight: '800', color: colors.text },
  date: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  total: { fontSize: 16, fontWeight: '900', color: colors.text },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  status: { fontSize: 13, fontWeight: '800' },
  detail: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  detailText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: 40 },
});
