import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import TopBar from '../../components/TopBar';
import SearchBar from '../../components/SearchBar';
import BrandChips from '../../components/BrandChips';
import OrderStatusStrip from '../../components/OrderStatusStrip';
import QuickCategories from '../../components/QuickCategories';
import LoyaltyBanner from '../../components/LoyaltyBanner';
import PromoCarousel from '../../components/PromoCarousel';
import SectionHeader from '../../components/SectionHeader';
import ProductCard from '../../components/ProductCard';
import { popularProducts, reorderProducts } from '../../data/catalog';
import { colors, spacing } from '../../constants/theme';

export default function Home() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar />
      <View style={{ paddingHorizontal: 16, paddingBottom: 6 }}>
        <SearchBar />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24, gap: spacing.md }}
      >
        <View style={{ marginTop: 6 }}>
          <BrandChips />
        </View>

        <OrderStatusStrip />

        <QuickCategories />

        <LoyaltyBanner />

        <View>
          <View style={styles.sectionPad}>
            <SectionHeader title="Promociones para ti" actionLabel="Ver todas" />
          </View>
          <PromoCarousel />
        </View>

        <View style={styles.sectionPad}>
          <SectionHeader
            title="Vuelve a surtir"
            subtitle="De pedidos anteriores, listos para reponer"
            actionLabel="Ver todos"
            onAction={() => router.push('/(tabs)/productos')}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingRight: 8 }}
          >
            {reorderProducts.map((p) => (
              <ProductCard key={p.id} product={p} width={150} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.sectionPad}>
          <SectionHeader
            title="Se venden bien"
            icon="bulb"
            subtitle="Ya dejan ganancias en negocios como el tuyo"
            actionLabel="Ver todos"
            onAction={() => router.push('/(tabs)/productos')}
          />
          <View style={styles.grid}>
            {popularProducts.map((p) => (
              <View key={p.id} style={styles.gridItem}>
                <ProductCard product={p} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  sectionPad: { paddingHorizontal: 16 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  gridItem: { width: '48.5%' },
});
