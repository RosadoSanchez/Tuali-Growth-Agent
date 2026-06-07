import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { brands } from '../data/catalog';
import { radius, shadow } from '../constants/theme';

// Marcas destacadas como botones rectangulares (Coca-Cola y Bokados).
const FEATURED = brands.filter((b) => b.logoBg);

export default function BrandChips() {
  return (
    <View style={styles.row}>
      {FEATURED.map((b) => (
        <Pressable
          key={b.id}
          onPress={() => router.push('/(tabs)/productos')}
          style={[styles.btn, { backgroundColor: b.logoBg }]}
        >
          <Image source={b.image} style={styles.logo} resizeMode="contain" />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, paddingHorizontal: 16 },
  btn: {
    flex: 1,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    ...shadow.soft,
  },
  logo: { width: '66%', height: '52%' },
});
