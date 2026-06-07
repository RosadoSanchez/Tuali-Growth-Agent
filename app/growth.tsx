import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radius, shadow } from '../constants/theme';
import { moneyShort } from '../constants/format';
import { GrowthGoal, growthGoals, recommendations } from '../data/store';
import { CustomerInsights, fetchCustomerInsights } from '../services/api';
import { useAuth } from '../context/AuthContext';

type Feedback = 'up' | 'down' | null;

export default function Growth() {
  const { customerId } = useAuth();
  const [feedback, setFeedback] = useState<Record<string, Feedback>>({});
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [insights, setInsights] = useState<CustomerInsights | null>(null);

  useEffect(() => {
    if (!customerId) return;
    let alive = true;
    fetchCustomerInsights(customerId)
      .then((data) => alive && setInsights(data))
      .catch(() => alive && setInsights(null));
    return () => {
      alive = false;
    };
  }, [customerId]);

  // Hero y metas a partir de datos reales (con fallback al mock).
  const heroSummary = insights?.summary ??
    'Analicé tu historial, tus promos y lo que se vende en tu zona.';

  const goals: GrowthGoal[] = useMemo(() => {
    if (!insights) return growthGoals;
    const { totalSpent, totalOrders, deliveryRate } = insights.metrics;
    const ticket = totalOrders > 0 ? totalSpent / totalOrders : 0;
    return [
      {
        id: 'ventas',
        title: 'Ventas históricas acumuladas',
        metric: `${totalOrders} pedidos`,
        current: totalSpent,
        target: Math.max(totalSpent * 1.15, 1),
        unit: '$',
      },
      {
        id: 'ticket',
        title: 'Subir ticket promedio',
        metric: 'Ticket promedio',
        current: ticket,
        target: Math.max(ticket * 1.2, 1),
        unit: '$',
      },
      {
        id: 'entrega',
        title: 'Tasa de entrega exitosa',
        metric: 'Pedidos entregados',
        current: Math.round(deliveryRate),
        target: 100,
        unit: '%',
      },
    ];
  }, [insights]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.navbar}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.navTitle}>Agente de Crecimiento</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 20 }}
      >
        {/* Hero / saludo del agente */}
        <LinearGradient
          colors={['#FF7A66', '#FF9E86', '#FFC2AE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroIcon}>
            <Ionicons name="sparkles" size={24} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>
            ¡Hola Chabela! Esta semana podemos crecer tus ventas un 9%.
          </Text>
          <Text style={styles.heroSub}>{heroSummary}</Text>
        </LinearGradient>

        {/* Metas activas */}
        <View>
          <Text style={styles.sectionTitle}>Tus metas</Text>
          <View style={{ gap: 12, marginTop: 12 }}>
            {goals.map((g) => {
              const pct = Math.min(100, Math.round((g.current / g.target) * 100));
              const fmt = (n: number) =>
                g.unit === '%' ? `${Math.round(n)}%` : moneyShort(n);
              return (
                <View key={g.id} style={styles.goalCard}>
                  <View style={styles.goalHead}>
                    <Text style={styles.goalTitle}>{g.title}</Text>
                    <Text style={styles.goalPct}>{pct}%</Text>
                  </View>
                  <View style={styles.track}>
                    <View style={[styles.fill, { width: `${pct}%` }]} />
                  </View>
                  <Text style={styles.goalMeta}>
                    {fmt(g.current)} de {fmt(g.target)} · {g.metric}
                  </Text>
                </View>
              );
            })}
            <Pressable style={styles.newGoal}>
              <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
              <Text style={styles.newGoalText}>Definir nueva meta</Text>
            </Pressable>
          </View>
        </View>

        {/* Recomendaciones */}
        <View>
          <Text style={styles.sectionTitle}>Acciones recomendadas</Text>
          <Text style={styles.sectionSub}>
            Toca una acción para aplicarla. Dinos qué funcionó para mejorar.
          </Text>
          <View style={{ gap: 12, marginTop: 12 }}>
            {recommendations.map((r) => {
              const isDone = done[r.id];
              const fb = feedback[r.id];
              return (
                <View key={r.id} style={styles.recCard}>
                  <View style={styles.recTop}>
                    <View style={styles.recIcon}>
                      <Ionicons name={r.icon as any} size={22} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.recTitle}>{r.title}</Text>
                      <Text style={styles.recReason}>{r.reason}</Text>
                    </View>
                  </View>

                  <View style={styles.recBottom}>
                    <View style={styles.impact}>
                      <Ionicons name="trending-up" size={14} color={colors.green} />
                      <Text style={styles.impactText}>{r.impact}</Text>
                    </View>

                    {isDone ? (
                      <View style={styles.feedbackRow}>
                        <Text style={styles.feedbackQ}>¿Funcionó?</Text>
                        <Pressable
                          hitSlop={6}
                          onPress={() =>
                            setFeedback((p) => ({ ...p, [r.id]: 'up' }))
                          }
                        >
                          <Ionicons
                            name={fb === 'up' ? 'thumbs-up' : 'thumbs-up-outline'}
                            size={20}
                            color={fb === 'up' ? colors.green : colors.textMuted}
                          />
                        </Pressable>
                        <Pressable
                          hitSlop={6}
                          onPress={() =>
                            setFeedback((p) => ({ ...p, [r.id]: 'down' }))
                          }
                        >
                          <Ionicons
                            name={fb === 'down' ? 'thumbs-down' : 'thumbs-down-outline'}
                            size={20}
                            color={fb === 'down' ? colors.red : colors.textMuted}
                          />
                        </Pressable>
                      </View>
                    ) : (
                      <Pressable
                        style={styles.recBtn}
                        onPress={() => setDone((p) => ({ ...p, [r.id]: true }))}
                      >
                        <Text style={styles.recBtnText}>{r.action}</Text>
                        <Ionicons name="arrow-forward" size={14} color="#fff" />
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Entrada de chat / voz (placeholder para Gemini + ElevenLabs) */}
        <Pressable style={styles.ask}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.primary} />
          <Text style={styles.askText}>Pregúntale a tu agente...</Text>
          <View style={styles.micBtn}>
            <Ionicons name="mic" size={18} color="#fff" />
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  hero: { borderRadius: radius.xl, padding: 20, ...shadow.card },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: '#ffffff33',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroTitle: { fontSize: 19, fontWeight: '900', color: '#fff', lineHeight: 24 },
  heroSub: { fontSize: 13, color: '#ffffffe6', marginTop: 8, lineHeight: 18 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: colors.text },
  sectionSub: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  goalCard: { backgroundColor: '#fff', borderRadius: radius.lg, padding: 16, ...shadow.soft },
  goalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
  goalPct: { fontSize: 15, fontWeight: '900', color: colors.primary },
  track: {
    height: 10,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    marginTop: 12,
    overflow: 'hidden',
  },
  fill: { height: 10, backgroundColor: colors.primary, borderRadius: radius.pill },
  goalMeta: { fontSize: 12, color: colors.textMuted, marginTop: 8 },
  newGoal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    borderStyle: 'dashed',
  },
  newGoalText: { color: colors.primary, fontWeight: '800', fontSize: 14 },
  recCard: { backgroundColor: '#fff', borderRadius: radius.lg, padding: 16, ...shadow.soft },
  recTop: { flexDirection: 'row', gap: 12 },
  recIcon: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recTitle: { fontSize: 15, fontWeight: '800', color: colors.text, lineHeight: 19 },
  recReason: { fontSize: 12, color: colors.textMuted, marginTop: 4, lineHeight: 16 },
  recBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  impact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.greenLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  impactText: { fontSize: 12, fontWeight: '800', color: colors.green },
  recBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.pill,
  },
  recBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  feedbackRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  feedbackQ: { fontSize: 13, fontWeight: '700', color: colors.text },
  ask: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: radius.pill,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    ...shadow.soft,
  },
  askText: { flex: 1, fontSize: 14, color: colors.textMuted },
  micBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
