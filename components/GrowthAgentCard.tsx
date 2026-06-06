import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { radius, shadow } from '../constants/theme';

// Punto de entrada al Growth Agent (el reto del hackathon) desde el Home.
export default function GrowthAgentCard() {
  return (
    <Pressable onPress={() => router.push('/growth')} style={styles.wrap}>
      <LinearGradient
        colors={['#FF7A66', '#FF9E86', '#FFC2AE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.iconWrap}>
          <Ionicons name="sparkles" size={22} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Tu Agente de Crecimiento</Text>
          <Text style={styles.subtitle}>
            Recomendaciones para vender más, hechas para tu tienda.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color="#fff" />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { marginHorizontal: 16, ...shadow.card },
  card: {
    borderRadius: radius.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: '#ffffff33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: '#fff', fontSize: 16, fontWeight: '800' },
  subtitle: { color: '#ffffffe6', fontSize: 12, marginTop: 3, lineHeight: 16 },
});
