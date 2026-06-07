import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../../components/SearchBar';
import ItemImage from '../../components/ItemImage';
import ProductCard from '../../components/ProductCard';
import SectionHeader from '../../components/SectionHeader';
import { categories, products } from '../../data/catalog';
import { colors, radius, shadow } from '../../constants/theme';

export default function Categorias() {
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    let list = products;
    if (selected) list = list.filter((p) => p.category === selected);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selected, query]);

  const selectedName = categories.find((c) => c.id === selected)?.name;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.h1}>Productos</Text>
        <View style={{ marginTop: 12 }}>
          <SearchBar value={query} onChangeText={setQuery} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      >
        <View style={styles.catGrid}>
          {categories.map((c) => {
            const active = selected === c.id;
            return (
              <Pressable
                key={c.id}
                onPress={() => setSelected(active ? null : c.id)}
                style={[styles.catItem, active && styles.catItemActive]}
              >
                <ItemImage
                  image={c.image}
                  icon={c.icon}
                  iconColor={active ? colors.primary : colors.text}
                  iconSize={30}
                  bgColor={c.color}
                  radius={radius.lg}
                  style={styles.catThumb}
                />
                <Text
                  style={[styles.catName, active && { color: colors.primary }]}
                  numberOfLines={1}
                >
                  {c.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ marginTop: 20 }}>
          <SectionHeader
            title={selectedName ? selectedName : 'Todos los productos'}
            actionLabel={selected ? 'Limpiar' : undefined}
            onAction={() => setSelected(null)}
          />
          <View style={styles.grid}>
            {filtered.map((p) => (
              <View key={p.id} style={styles.gridItem}>
                <ProductCard product={p} />
              </View>
            ))}
          </View>
          {filtered.length === 0 && (
            <Text style={styles.empty}>No encontramos productos.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 8 },
  h1: { fontSize: 26, fontWeight: '900', color: colors.text },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  catItem: { width: '31%', alignItems: 'center' },
  catItemActive: {},
  catThumb: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  catName: { fontSize: 12, fontWeight: '700', color: colors.text, marginTop: 6 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  gridItem: { width: '48.5%' },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: 30 },
});
