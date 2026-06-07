import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radius, shadow } from '../constants/theme';
import { money } from '../constants/format';
import { useCart } from '../context/CartContext';
import QtyStepper from '../components/QtyStepper';
import ProductImage from '../components/ProductImage';

export default function Carrito() {
  const { detailed, total, setQty, remove, count } = useCart();
  const envio = total > 0 ? 0 : 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.h1}>Mi carrito</Text>
          <Text style={styles.sub}>
            {count} {count === 1 ? 'producto' : 'productos'}
          </Text>
        </View>
      </View>

      {detailed.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="cart-outline" size={64} color={colors.primaryLight} />
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptyText}>
            Agrega productos para surtir tu tienda.
          </Text>
          <Pressable style={styles.cta} onPress={() => router.push('/(tabs)')}>
            <Text style={styles.ctaText}>Explorar productos</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 16 }}
          >
            {detailed.map(({ product, qty }) => (
              <View key={product.id} style={styles.line}>
                <ProductImage
                  product={product}
                  style={styles.thumb}
                  radius={radius.md}
                  iconSize={30}
                />
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={2} style={styles.name}>
                    {product.name}
                  </Text>
                  <Text style={styles.unit}>{product.unit}</Text>
                  <Text style={styles.price}>{money(product.price)}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <Pressable onPress={() => remove(product.id)} hitSlop={8}>
                    <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
                  </Pressable>
                  <QtyStepper
                    qty={qty}
                    onChange={(q) => setQty(product.id, q)}
                    size="sm"
                  />
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.summary}>
            <View style={styles.sumRow}>
              <Text style={styles.sumLabel}>Subtotal</Text>
              <Text style={styles.sumValue}>{money(total)}</Text>
            </View>
            <View style={styles.sumRow}>
              <Text style={styles.sumLabel}>Envío</Text>
              <Text style={[styles.sumValue, { color: colors.green }]}>Gratis</Text>
            </View>
            <View style={[styles.sumRow, { marginTop: 6 }]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{money(total + envio)}</Text>
            </View>
            <Pressable style={styles.checkout}>
              <Text style={styles.checkoutText}>Confirmar pedido</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  h1: { fontSize: 24, fontWeight: '900', color: colors.text },
  sub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  line: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: 12,
    ...shadow.soft,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 13, fontWeight: '700', color: colors.text, lineHeight: 17 },
  unit: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  price: { fontSize: 15, fontWeight: '800', color: colors.text, marginTop: 6 },
  summary: {
    backgroundColor: '#fff',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: 20,
    paddingBottom: 28,
    gap: 8,
    ...shadow.card,
  },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between' },
  sumLabel: { fontSize: 14, color: colors.textMuted },
  sumValue: { fontSize: 14, fontWeight: '700', color: colors.text },
  totalLabel: { fontSize: 17, fontWeight: '900', color: colors.text },
  totalValue: { fontSize: 20, fontWeight: '900', color: colors.text },
  checkout: {
    marginTop: 12,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  checkoutText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginTop: 8 },
  emptyText: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
  cta: {
    marginTop: 16,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  ctaText: { color: '#fff', fontWeight: '800' },
});
