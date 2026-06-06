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
      <View style={{ flex: 1 }}>
        <View style={styles.storeRow}>
          <Ionicons name="location" size={15} color={colors.primary} />
          <Text style={styles.store} numberOfLines={1}>
            {store.name}
          </Text>
          <Ionicons name="chevron-down" size={14} color={colors.textMuted} />
        </View>
        <Text style={styles.location} numberOfLines={1}>
          {store.location}
        </Text>
      </View>

      <Pressable hitSlop={8} style={styles.iconBtn}>
        <Ionicons name="heart-outline" size={22} color={colors.text} />
      </Pressable>
      <Pressable
        hitSlop={8}
        style={styles.iconBtn}
        onPress={() => router.push('/(tabs)/carrito')}
      >
        <Ionicons name="cart-outline" size={22} color={colors.text} />
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 6,
  },
  storeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  store: { fontSize: 16, fontWeight: '800', color: colors.text, maxWidth: 200 },
  location: { fontSize: 12, color: colors.textMuted, marginTop: 1, marginLeft: 19 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 2,
    minWidth: 17,
    height: 17,
    paddingHorizontal: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
});
