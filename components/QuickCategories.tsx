import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radius, shadow } from '../constants/theme';

type Tile = {
  key: string;
  label: string;
  color: string;
  image?: any;
  icon?: string;
};

const TILES: Tile[] = [
  { key: 'top', label: 'Tus más vendidos', color: '#fff', icon: 'flame' },
  { key: 'promos', label: 'Promos', color: '#fff', image: require('../assets/img/promo.png') },
  { key: 'refrescos', label: 'Refrescos', color: '#fff', image: require('../assets/img/refrescos.png') },
  { key: 'agua', label: 'Agua', color: '#fff', image: require('../assets/img/agua.png') },
];

export default function QuickCategories() {
  return (
    <View style={styles.row}>
      {TILES.map((t) => (
        <Pressable
          key={t.key}
          style={styles.item}
          onPress={() => router.push('/(tabs)/productos')}
        >
          <View style={[styles.thumb, { backgroundColor: t.color }]}>
            {t.image ? (
              <Image source={t.image} style={styles.img} resizeMode="contain" />
            ) : (
              <Ionicons name={t.icon as any} size={24} color={colors.red} />
            )}
          </View>
          <Text style={styles.label} numberOfLines={2}>
            {t.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  item: { width: '23.5%', alignItems: 'center' },
  thumb: {
    width: '88%',
    aspectRatio: 1,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...shadow.soft,
  },
  img: { width: '72%', height: '72%' },
  label: { fontSize: 10.5, fontWeight: '700', color: colors.text, marginTop: 4, textAlign: 'center' },
});
