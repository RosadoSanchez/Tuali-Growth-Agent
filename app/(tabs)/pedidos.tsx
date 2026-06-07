import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../../constants/theme';
import { money } from '../../constants/format';
import {
  normalizeStatus,
  statusKindColor,
  statusKindLabel,
  toNumber,
} from '../../constants/orderStatus';
import {
  BackendOrder,
  OrderDetailLine,
  fetchCustomerOrders,
  fetchOrderDetails,
} from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import BrandChips from '../../components/BrandChips';

const FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'activos', label: 'Activos' },
  { id: 'entregado', label: 'Entregados' },
  { id: 'cancelado', label: 'Cancelados' },
] as const;

export default function Pedidos() {
  const { customerId } = useAuth();
  const [filter, setFilter] = useState<string>('todos');

  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detalle por pedido (carga perezosa al tocar "Ver detalle").
  const [openId, setOpenId] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, OrderDetailLine[]>>({});
  const [loadingDetail, setLoadingDetail] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!customerId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCustomerOrders(customerId);
      setOrders(res.data ?? []);
    } catch (e: any) {
      setError(e.message ?? 'No se pudieron cargar los pedidos');
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    load();
  }, [load]);

  const orderId = (o: BackendOrder) =>
    String(o.id_pedido ?? o['﻿id_pedido'] ?? '');

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const kind = normalizeStatus(o.status_final);
      if (filter === 'todos') return true;
      if (filter === 'activos')
        return kind === 'en_camino' || kind === 'preparando';
      return kind === filter;
    });
  }, [orders, filter]);

  const toggleDetail = async (o: BackendOrder) => {
    const id = orderId(o);
    if (openId === id) {
      setOpenId(null);
      return;
    }
    setOpenId(id);
    if (!details[id]) {
      setLoadingDetail(id);
      try {
        const res = await fetchOrderDetails(id);
        setDetails((p) => ({ ...p, [id]: res.data ?? [] }));
      } catch {
        setDetails((p) => ({ ...p, [id]: [] }));
      } finally {
        setLoadingDetail(null);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.h1}>Mis pedidos</Text>
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
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.hint}>Cargando tus pedidos…</Text>
            </View>
          ) : error ? (
            <View style={styles.center}>
              <Ionicons
                name="cloud-offline-outline"
                size={36}
                color={colors.textMuted}
              />
              <Text style={styles.hint}>{error}</Text>
              <Pressable style={styles.retry} onPress={load}>
                <Text style={styles.retryText}>Reintentar</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.monthRow}>
                <Text style={styles.month}>Historial</Text>
                <Text style={styles.count}>{filtered.length} pedidos</Text>
              </View>

              {filtered.map((o) => {
                const id = orderId(o);
                const kind = normalizeStatus(o.status_final);
                const color = statusKindColor[kind];
                const cancel = kind === 'cancelado';
                const isOpen = openId === id;
                const lines = details[id];
                return (
                  <View key={id} style={styles.card}>
                    <Text style={styles.orderNo}>No. de pedido: {id}</Text>

                    <View style={styles.midRow}>
                      <View style={[styles.truck, { backgroundColor: color }]}>
                        <Ionicons name="cube" size={20} color="#fff" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.qty}>
                          {o.pais ? o.pais : 'Pedido'}
                        </Text>
                        <Text style={styles.date}>
                          Subtotal {money(toNumber(o.SubTotal))}
                        </Text>
                      </View>
                      <Text style={styles.total}>{money(toNumber(o.Total))}</Text>
                    </View>

                    <View style={styles.bottomRow}>
                      <View style={styles.statusRow}>
                        <Ionicons
                          name={cancel ? 'close-circle' : 'checkmark-circle'}
                          size={16}
                          color={color}
                        />
                        <Text style={[styles.status, { color }]}>
                          {statusKindLabel[kind]}
                        </Text>
                      </View>
                      <Pressable
                        style={styles.detail}
                        hitSlop={6}
                        onPress={() => toggleDetail(o)}
                      >
                        <Text style={styles.detailText}>
                          {isOpen ? 'Ocultar' : 'Ver detalle'}
                        </Text>
                        <Ionicons
                          name={isOpen ? 'chevron-up' : 'chevron-forward'}
                          size={14}
                          color={colors.textMuted}
                        />
                      </Pressable>
                    </View>

                    {isOpen && (
                      <View style={styles.detailBox}>
                        {loadingDetail === id ? (
                          <ActivityIndicator color={colors.primary} />
                        ) : lines && lines.length > 0 ? (
                          lines.map((l, i) => (
                            <View key={l.id_linea ?? i} style={styles.lineRow}>
                              <Text style={styles.lineName} numberOfLines={2}>
                                {l.nombre_sku_solicitado ?? 'Producto'}
                              </Text>
                              <Text style={styles.lineQty}>
                                x{toNumber(l.Quantity)}
                              </Text>
                            </View>
                          ))
                        ) : (
                          <Text style={styles.hint}>
                            Sin líneas para este pedido.
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                );
              })}

              {filtered.length === 0 && (
                <Text style={styles.empty}>
                  {customerId
                    ? 'No tienes pedidos en este filtro.'
                    : 'Inicia sesión para ver tus pedidos.'}
                </Text>
              )}
            </>
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
  center: { alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  hint: { color: colors.textMuted, fontSize: 14, textAlign: 'center' },
  retry: {
    marginTop: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: radius.pill,
  },
  retryText: { color: '#fff', fontWeight: '800', fontSize: 14 },
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
  detailBox: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    gap: 8,
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  lineName: { flex: 1, fontSize: 13, color: colors.text },
  lineQty: { fontSize: 13, fontWeight: '800', color: colors.primary },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: 40 },
});
