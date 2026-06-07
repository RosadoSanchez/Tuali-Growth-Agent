import React from 'react';
import { ScrollView, StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { featuredPromos } from '../data/catalog';
import { colors, radius, shadow } from '../constants/theme';

const PROMO_IMG = require('../assets/img/promo.png');

const W = Dimensions.get('window').width;
const CARD_W = W - 64;

export default function PromoCarousel() {
  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      snapToInterval={CARD_W + 12}
      decelerationRate="fast"
      contentContainerStyle={styles.row}
    >
      {featuredPromos.map((p) => (
        <View key={p.id} style={[styles.card, { width: CARD_W }]}>
          <View style={styles.left}>
            <View style={[styles.tag, { backgroundColor: p.color }]}>
              <Ionicons name="pricetag" size={11} color="#fff" />
              <Text style={styles.tagText}>{p.tag}</Text>
            </View>
            <Text style={styles.title} numberOfLines={2}>
              {p.title}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {p.subtitle}
            </Text>
            <View style={styles.cta}>
              <Text style={styles.ctaText}>Ver promoción</Text>
              <Ionicons name="arrow-forward" size={13} color={colors.primary} />
            </View>
          </View>
          <View style={styles.iconWrap}>
            <Image source={PROMO_IMG} style={styles.promoImg} resizeMode="contain" />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 12, paddingHorizontal: 16, paddingVertical: 4 },
  card: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...shadow.card,
  },
  left: { flex: 1 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  tagText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  title: { fontSize: 15, fontWeight: '800', color: colors.text, lineHeight: 19 },
  subtitle: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 },
  ctaText: { color: colors.primary, fontWeight: '800', fontSize: 13 },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoImg: { width: 56, height: 56 },
});
