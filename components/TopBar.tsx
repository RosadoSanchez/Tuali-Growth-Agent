import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radius } from '../constants/theme';
import { store } from '../data/store';
import { useCart } from '../context/CartContext';

export default function TopBar() {
  const { count } = useCart();
  return (
    <View style={styles.row}>
      <Pressable style={{ flex: 1 }}>
        <View style={styles.storeRow}>
          <Text style={styles.store} numberOfLines={1}>
            {store.name}
          </Text>
          <Ionicons name="chevron-down" size={14} color={colors.red} />
        </View>
        <Text style={styles.loc} numberOfLines={1}>
          {store.location}
        </Text>
      </Pressable>

      <Pressable hitSlop={8} style={styles.iconBtn}>
        <Ionicons name="heart" size={20} color={colors.red} />
      </Pressable>
      <Pressable
        hitSlop={8}
        style={styles.cartBtn}
        onPress={() => router.push('/carrito')}
      >
        <Ionicons name="cart" size={18} color="#fff" />
        {count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 6,
    gap: 8,
  },
  storeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  store: { fontSize: 16, fontWeight: '800', color: colors.text, maxWidth: 210 },
  loc: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
});
