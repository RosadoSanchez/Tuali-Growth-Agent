import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Product } from '../data/types';
import { colors, radius, shadow } from '../constants/theme';
import { money } from '../constants/format';
import { useCart } from '../context/CartContext';
import QtyStepper from './QtyStepper';

type Props = { product: Product; width?: number };

export default function ProductCard({ product, width }: Props) {
  const { qtyOf, add, setQty } = useCart();
  const qty = qtyOf(product.id);

  return (
    <Pressable
      onPress={() => router.push(`/producto/${product.id}`)}
      style={[styles.card, width ? { width } : undefined]}
    >
      <View style={[styles.thumb, { backgroundColor: product.color }]}>
        <Text style={styles.emoji}>{product.emoji}</Text>
        {product.hasPromo && (
          <View style={styles.promoTag}>
            <Ionicons name="pricetag" size={10} color="#fff" />
            <Text style={styles.promoTagText}>{product.promoLabel}</Text>
          </View>
        )}
      </View>

      <Text numberOfLines={2} style={styles.name}>
        {product.name}
      </Text>
      <Text style={styles.unit}>{product.unit}</Text>

      <View style={styles.bottomRow}>
        <Text style={styles.price}>{money(product.price)}</Text>
        {qty === 0 ? (
          <Pressable
            onPress={(e) => {
              e.stopPropagation?.();
              add(product.id);
            }}
            hitSlop={6}
            style={styles.addBtn}
          >
            <Ionicons name="add" size={18} color="#fff" />
          </Pressable>
        ) : (
          <QtyStepper qty={qty} onChange={(q) => setQty(product.id, q)} size="sm" />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 10,
    ...shadow.soft,
  },
  thumb: {
    height: 96,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  emoji: { fontSize: 44 },
  promoTag: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: colors.green,
    borderRadius: radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  promoTagText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 17,
    minHeight: 34,
  },
  unit: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: { fontSize: 15, fontWeight: '800', color: colors.text },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
