import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../constants/theme';
import { store } from '../data/store';

export default function LoyaltyBanner() {
  return (
    <LinearGradient
      colors={['#E2231A', '#FF5A4D']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.kicker}>Loyalty · Gana</Text>
        <Text style={styles.title}>
          ¡Ya acumulaste {store.points.toLocaleString('es-MX')} puntos, ahora
          hazlos valer!
        </Text>
        <View style={styles.cta}>
          <Text style={styles.ctaText}>Canjear puntos</Text>
          <Ionicons name="arrow-forward" size={13} color={colors.red} />
        </View>
      </View>
      <View style={styles.badge}>
        <Ionicons name="star" size={26} color="#fff" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    borderRadius: radius.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...shadow.card,
  },
  kicker: {
    color: '#ffffffcc',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: { color: '#fff', fontSize: 16, fontWeight: '800', marginTop: 4, lineHeight: 20 },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 12,
  },
  ctaText: { color: colors.red, fontWeight: '800', fontSize: 12 },
  badge: {
    width: 54,
    height: 54,
    borderRadius: radius.pill,
    backgroundColor: '#ffffff33',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
