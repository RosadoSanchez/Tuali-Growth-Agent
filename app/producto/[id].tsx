import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, radius, shadow } from '../../constants/theme';
import { money } from '../../constants/format';
import { productById, products } from '../../data/catalog';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/ProductCard';
import QtyStepper from '../../components/QtyStepper';

export default function ProductoDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = productById(id);
  const { qtyOf, add, setQty } = useCart();

  if (!product) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ padding: 24 }}>Producto no encontrado.</Text>
      </SafeAreaView>
    );
  }

  const qty = qtyOf(product.id);
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 6);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.navbar}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Pressable hitSlop={8} style={styles.navBtn}>
          <Ionicons name="heart-outline" size={22} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View style={[styles.hero, { backgroundColor: product.color }]}>
          <Text style={{ fontSize: 120 }}>{product.emoji}</Text>
          {product.hasPromo && (
            <View style={styles.promo}>
              <Ionicons name="pricetag" size={12} color="#fff" />
              <Text style={styles.promoText}>{product.promoLabel}</Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.unit}>Presentación: {product.unit}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{money(product.price)}</Text>
            {product.loyaltyPoints ? (
              <View style={styles.points}>
                <Ionicons name="star" size={13} color={colors.star} />
                <Text style={styles.pointsText}>
                  +{product.loyaltyPoints} pts
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Ionicons name="cube-outline" size={18} color={colors.primary} />
              <Text style={styles.infoText}>Mayoreo</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={18} color={colors.primary} />
              <Text style={styles.infoText}>Entrega 24-48h</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="shield-checkmark-outline" size={18} color={colors.primary} />
              <Text style={styles.infoText}>Arca Continental</Text>
            </View>
          </View>

          {related.length > 0 && (
            <View style={{ marginTop: 24 }}>
              <Text style={styles.relatedTitle}>También te puede interesar</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingTop: 12 }}
              >
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} width={150} />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {qty === 0 ? (
          <Pressable style={styles.addBtn} onPress={() => add(product.id)}>
            <Ionicons name="cart" size={20} color="#fff" />
            <Text style={styles.addText}>Agregar al carrito</Text>
          </Pressable>
        ) : (
          <View style={styles.footerRow}>
            <QtyStepper qty={qty} onChange={(q) => setQty(product.id, q)} />
            <Pressable style={[styles.addBtn, { flex: 1 }]} onPress={() => router.push('/(tabs)/carrito')}>
              <Text style={styles.addText}>Ver carrito · {money(product.price * qty)}</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    margin: 16,
    borderRadius: radius.xl,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promo: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.green,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  promoText: { color: '#fff', fontWeight: '800', fontSize: 11 },
  body: { paddingHorizontal: 16 },
  brand: { fontSize: 13, fontWeight: '800', color: colors.primary, textTransform: 'uppercase' },
  name: { fontSize: 22, fontWeight: '900', color: colors.text, marginTop: 4, lineHeight: 27 },
  unit: { fontSize: 14, color: colors.textMuted, marginTop: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14 },
  price: { fontSize: 28, fontWeight: '900', color: colors.text },
  points: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF6DC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  pointsText: { fontSize: 12, fontWeight: '800', color: '#B8860B' },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    marginTop: 20,
  },
  infoItem: { alignItems: 'center', gap: 6 },
  infoText: { fontSize: 11, color: colors.text, fontWeight: '600' },
  relatedTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  footer: {
    padding: 16,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: '#fff',
  },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  addBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...shadow.soft,
  },
  addText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
