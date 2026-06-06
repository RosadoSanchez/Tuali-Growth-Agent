import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import TopBar from '../../components/TopBar';
import SearchBar from '../../components/SearchBar';
import BrandChips from '../../components/BrandChips';
import LoyaltyBanner from '../../components/LoyaltyBanner';
import PromoCarousel from '../../components/PromoCarousel';
import SectionHeader from '../../components/SectionHeader';
import ProductCard from '../../components/ProductCard';
import GrowthAgentCard from '../../components/GrowthAgentCard';
import { popularProducts, reorderProducts } from '../../data/catalog';
import { colors, spacing } from '../../constants/theme';

export default function Home() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar />
      <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        <SearchBar />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24, gap: spacing.xl }}
      >
        <View style={{ marginTop: 8 }}>
          <BrandChips />
        </View>

        <GrowthAgentCard />

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
            actionLabel="Ver todo"
            onAction={() => router.push('/(tabs)/categorias')}
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
          <SectionHeader title="Más vendidos en tu zona" />
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
