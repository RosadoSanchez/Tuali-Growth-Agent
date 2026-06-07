import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../../constants/theme';
import { store } from '../../data/store';

const challenges = [
  { id: 'c1', title: 'Órdenes de Ale', points: 200, current: 0, target: 100 },
  { id: 'c2', title: 'Surte 3 veces esta semana', points: 350, current: 1, target: 3 },
];

export default function Gana() {
  const [showHelp, setShowHelp] = useState(true);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View style={styles.topBar}>
          <Ionicons name="star" size={16} color={colors.red} />
          <Text style={styles.topText}>Gana con tuali</Text>
        </View>

        {/* Mis Puntos */}
        <LinearGradient
          colors={['#ED1C24', '#FF6A3D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.pointsCard}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.pointsLabel}>Mis Puntos</Text>
            <Text style={styles.pointsValue}>
              {store.points.toLocaleString('es-MX')}
            </Text>
          </View>
          <View style={styles.pointsIcon}>
            <Ionicons name="sparkles" size={30} color="#fff" />
          </View>
        </LinearGradient>

        {/* Accesos */}
        <View style={styles.actions}>
          <Pressable style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: '#FDE3F1' }]}>
              <Ionicons name="gift" size={22} color={colors.red} />
            </View>
            <Text style={styles.actionText}>Tienda de Recompensas</Text>
          </Pressable>
          <Pressable style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: '#E3E9FF' }]}>
              <Ionicons name="time" size={22} color={colors.primary} />
            </View>
            <Text style={styles.actionText}>Movimiento de Puntos</Text>
          </Pressable>
        </View>

        {/* ¿Qué tengo que hacer? */}
        {showHelp && (
          <View style={styles.help}>
            <View style={styles.helpHead}>
              <Text style={styles.helpTitle}>¿Qué tengo que hacer?</Text>
              <Pressable hitSlop={8} onPress={() => setShowHelp(false)}>
                <Ionicons name="close" size={18} color={colors.textMuted} />
              </Pressable>
            </View>
            <Text style={styles.helpStep}>
              1- Presiona en <Text style={styles.helpStrong}>Participar y Gana</Text>
            </Text>
            <Text style={styles.helpStep}>2- Revisa y completa los pasos a seguir</Text>
            <Text style={styles.helpStep}>3- Gana más Puntos</Text>
          </View>
        )}

        {/* Pensado en ti */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Pensado en ti</Text>
            <Pressable hitSlop={8}>
              <Text style={styles.more}>Mostrar más</Text>
            </Pressable>
          </View>

          <View style={{ gap: 12, marginTop: 12 }}>
            {challenges.map((c) => {
              const pct = Math.min(100, Math.round((c.current / c.target) * 100));
              return (
                <View key={c.id} style={styles.challenge}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Participando</Text>
                  </View>
                  <Text style={styles.challengeTitle}>{c.title}</Text>
                  <View style={styles.gainRow}>
                    <Ionicons name="star" size={14} color={colors.star} />
                    <Text style={styles.gainText}>Gana {c.points} Puntos</Text>
                  </View>
                  <View style={styles.track}>
                    <View style={[styles.fill, { width: `${pct}%` }]} />
                  </View>
                  <Text style={styles.progress}>
                    {c.current} / {c.target}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  topText: { fontSize: 15, fontWeight: '900', color: colors.text },
  pointsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    borderRadius: radius.xl,
    padding: 20,
    ...shadow.card,
  },
  pointsLabel: { color: '#ffffffe6', fontSize: 14, fontWeight: '700' },
  pointsValue: { color: '#fff', fontSize: 40, fontWeight: '900', marginTop: 2 },
  pointsIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: '#ffffff33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginTop: 14 },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: 14,
    gap: 10,
    ...shadow.soft,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: { fontSize: 13, fontWeight: '800', color: colors.text },
  help: {
    backgroundColor: '#EEF1FF',
    borderRadius: radius.lg,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
  },
  helpHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  helpTitle: { fontSize: 15, fontWeight: '900', color: colors.text },
  helpStep: { fontSize: 13, color: colors.text, marginTop: 4, lineHeight: 18 },
  helpStrong: { fontWeight: '900', color: colors.primary },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: colors.text },
  more: { fontSize: 13, fontWeight: '700', color: colors.primary },
  challenge: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: 16,
    ...shadow.soft,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  challengeTitle: { fontSize: 15, fontWeight: '800', color: colors.text, marginTop: 10 },
  gainRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  gainText: { fontSize: 13, fontWeight: '700', color: colors.text },
  track: {
    height: 8,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    marginTop: 12,
    overflow: 'hidden',
  },
  fill: { height: 8, backgroundColor: colors.primary, borderRadius: radius.pill },
  progress: { fontSize: 11, color: colors.textMuted, marginTop: 6, textAlign: 'right' },
});
