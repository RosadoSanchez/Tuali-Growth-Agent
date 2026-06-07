import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Product } from '../data/types';
import { colors, radius, shadow } from '../constants/theme';
import { money } from '../constants/format';
import { useCart } from '../context/CartContext';
import QtyStepper from './QtyStepper';
import ProductImage from './ProductImage';

type Props = { product: Product; width?: number };

export default function ProductCard({ product, width }: Props) {
  const { qtyOf, add, setQty } = useCart();
  const qty = qtyOf(product.id);
  const [liked, setLiked] = useState(false);

  return (
    <Pressable
      onPress={() => router.push(`/producto/${product.id}`)}
      style={[styles.card, width ? { width } : undefined]}
    >
      <View style={styles.thumbWrap}>
        <ProductImage
          product={product}
          style={styles.thumb}
          radius={radius.md}
          iconSize={44}
        />
        <Pressable
          hitSlop={8}
          onPress={(e) => {
            e.stopPropagation?.();
            setLiked((v) => !v);
          }}
          style={styles.heart}
        >
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={18}
            color={liked ? colors.red : colors.textMuted}
          />
        </Pressable>
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
      <Text style={styles.price}>{money(product.price)}</Text>

      <Text style={styles.paqLabel}>Paquetes</Text>
      <View style={styles.stepperRow}>
        <QtyStepper qty={qty} onChange={(q) => setQty(product.id, q)} size="sm" />
      </View>

      <Pressable
        style={styles.addBtn}
        onPress={(e) => {
          e.stopPropagation?.();
          add(product.id);
        }}
      >
        <Text style={styles.addBtnText}>
          {qty > 0 ? `Agrega ${qty} Paquete${qty === 1 ? '' : 's'}` : 'Agregar'}
        </Text>
      </Pressable>
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
  thumbWrap: { marginBottom: 8 },
  thumb: { height: 110 },
  heart: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: '#ffffffcc',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  price: { fontSize: 16, fontWeight: '900', color: colors.text, marginTop: 4 },
  paqLabel: { fontSize: 11, color: colors.textMuted, marginTop: 8 },
  stepperRow: { marginTop: 6, alignItems: 'flex-start' },
  addBtn: {
    marginTop: 10,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
});
