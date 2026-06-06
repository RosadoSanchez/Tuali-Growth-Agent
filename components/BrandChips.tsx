import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { brands } from '../data/catalog';
import { colors, radius, shadow } from '../constants/theme';

export default function BrandChips() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {brands.map((b) => (
        <View key={b.id} style={styles.chip}>
          <View style={[styles.logo, { backgroundColor: b.color + '22' }]}>
            <Text style={styles.emoji}>{b.emoji}</Text>
          </View>
          <Text style={styles.name}>{b.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 14, paddingHorizontal: 16, paddingVertical: 4 },
  chip: { alignItems: 'center', width: 64 },
  logo: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  emoji: { fontSize: 26 },
  name: { fontSize: 11, color: colors.text, marginTop: 6, fontWeight: '600' },
});
