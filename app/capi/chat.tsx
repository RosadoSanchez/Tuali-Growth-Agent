import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, radius, shadow } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { agentChat, Jugada } from '../../services/api';

const CAPI_PFP = require('../../assets/img/capipfpbig.png');
const CAPI_REPLY = require('../../assets/img/capichatreply.png');

// Metas predeterminadas: cada una le pide a Gemini una jugada nueva.
// Esto NO es un chat de escribir: son botones que regeneran la jugada.
const GOALS = ['Subir mi ticket', 'Vender más', 'Ponme una meta'];

export default function CapiChat() {
  const { customerId } = useAuth();
  const { add } = useCart();
  const insets = useSafeAreaInsets();
  const { goal: initialGoal } = useLocalSearchParams<{ goal?: string }>();

  const [goal, setGoal] = useState<string>((initialGoal as string) || 'Vender más');
  const [reply, setReply] = useState('');
  const [jugada, setJugada] = useState<Jugada | null>(null);
  const [activated, setActivated] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // Pide la jugada a Gemini para la meta elegida.
  const loadJugada = async (g: string) => {
    if (!customerId) return;
    setGoal(g);
    setLoading(true);
    setActivated({});
    try {
      const res = await agentChat(customerId, { goal: g });
      setReply(res.reply);
      setJugada(res.jugada);
    } catch (e: any) {
      setReply(`No pude conectarme 😕 (${e.message})`);
      setJugada(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJugada(goal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  // Un solo tap: activar el movimiento (y si es pedido, va al carrito).
  const activate = (key: string, type: string) => {
    setActivated((prev) => ({ ...prev, [key]: true }));
    if (type === 'reorder') add('p1', 1);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={CAPI_PFP} style={styles.hpfp} />
        <View style={{ flex: 1 }}>
          <Text style={styles.hname}>Capi</Text>
          <Text style={styles.status}>
            {loading ? 'armando tu jugada…' : 'tu coach de ventas'}
          </Text>
        </View>
        <Pressable style={styles.hbtnWa} onPress={() => router.push('/capiteavisascreen')}>
          <Ionicons name="logo-whatsapp" size={18} color="#fff" />
        </Pressable>
        <Pressable style={styles.hbtn} onPress={() => router.push('/capi/marcador')}>
          <Ionicons name="speedometer-outline" size={18} color={colors.primary} />
        </Pressable>
        <Pressable style={styles.hbtn} onPress={() => router.back()}>
          <Ionicons name="close" size={18} color={colors.textMuted} />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 8, gap: 14 }}
      >
        {/* Meta actual */}
        <View style={styles.goalTag}>
          <Ionicons name="flag" size={13} color={colors.red} />
          <Text style={styles.goalTagText}>{goal}</Text>
        </View>

        {loading ? (
          <View style={styles.capiRow}>
            <Image source={CAPI_REPLY} style={styles.replyPfp} />
            <View style={styles.capiBubble}>
              <ActivityIndicator color={colors.red} />
            </View>
          </View>
        ) : (
          !!reply && (
            <View style={styles.capiRow}>
              <Image source={CAPI_REPLY} style={styles.replyPfp} />
              <View style={styles.capiBubble}>
                <Text style={styles.capiText}>{reply}</Text>
              </View>
            </View>
          )
        )}

        {/* Tarjeta de jugada (Gemini) */}
        {!loading && jugada && (
          <View style={styles.jugada}>
            <View style={styles.jugadaHead}>
              <Image source={CAPI_REPLY} style={styles.replyPfp} />
              <View style={{ flex: 1 }}>
                <Text style={styles.jugadaTitle}>{jugada.title}</Text>
                <Text style={styles.jugadaSub}>{jugada.sub}</Text>
              </View>
            </View>

            {jugada.moves.map((mv, i) => {
              const key = `mv${i}`;
              const done = activated[key];
              return (
                <View key={key} style={styles.reto}>
                  <View style={styles.retoTagRow}>
                    <View style={styles.retoIcon}>
                      <Ionicons name="disc" size={16} color="#fff" />
                    </View>
                    <Text style={styles.retoTag}>{mv.tag}</Text>
                    {!!mv.impact && <Text style={styles.impact}>{mv.impact}</Text>}
                  </View>
                  <Text style={styles.retoTitle}>{mv.title}</Text>
                  <Text style={styles.retoDesc}>{mv.desc}</Text>
                  <Pressable
                    style={[styles.activar, done && styles.activarDone]}
                    onPress={() => activate(key, mv.type)}
                    disabled={done}
                  >
                    <Ionicons name={done ? 'checkmark' : 'flash'} size={15} color="#fff" />
                    <Text style={styles.activarText}>{done ? 'Activado' : mv.cta}</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Cambiar de meta (Gemini) */}
      <View style={styles.chipRow}>
        {GOALS.map((g) => {
          const active = g === goal || (g === 'Subir mi ticket' && goal.startsWith('Subir'));
          return (
            <Pressable
              key={g}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => loadJugada(g)}
              disabled={loading}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]} numberOfLines={1}>
                {g}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Conversar libre = por voz con el agente de ElevenLabs */}
      <View style={[styles.voiceBar, { paddingBottom: insets.bottom + 14 }]}>
        <Pressable style={styles.voiceBtn} onPress={() => router.push('/capi/voz')}>
          <Ionicons name="mic" size={22} color="#fff" />
          <Text style={styles.voiceText}>Hablar con Capi</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  hpfp: { width: 40, height: 40, borderRadius: radius.pill },
  hname: { fontSize: 16, fontWeight: '900', color: colors.text },
  status: { fontSize: 12, color: colors.textMuted },
  hbtn: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hbtnWa: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalTag: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FBE3E3',
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  goalTagText: { fontSize: 12, fontWeight: '800', color: colors.red },
  capiRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, maxWidth: '88%' },
  replyPfp: { width: 30, height: 30, borderRadius: radius.pill },
  capiBubble: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    borderTopLeftRadius: 4,
    padding: 12,
    ...shadow.soft,
  },
  capiText: { fontSize: 14, color: colors.text, lineHeight: 19 },
  jugada: { backgroundColor: '#fff', borderRadius: radius.lg, padding: 14, ...shadow.card },
  jugadaHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  jugadaTitle: { fontSize: 15, fontWeight: '900', color: colors.text },
  jugadaSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  reto: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: 12,
    marginTop: 12,
  },
  retoTagRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  retoIcon: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retoTag: { fontSize: 11, fontWeight: '800', color: '#9C8B17' },
  impact: { fontSize: 11, fontWeight: '800', color: colors.green, marginLeft: 'auto' },
  retoTitle: { fontSize: 14, fontWeight: '800', color: colors.text, marginTop: 8 },
  retoDesc: { fontSize: 12, color: colors.textMuted, marginTop: 4, lineHeight: 16 },
  activar: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: colors.red,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 9,
    marginTop: 12,
  },
  activarDone: { backgroundColor: colors.green },
  activarText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 10,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.red,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: colors.red },
  chipText: { color: colors.red, fontWeight: '700', fontSize: 12 },
  chipTextActive: { color: '#fff' },
  voiceBar: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  voiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.red,
    borderRadius: radius.pill,
    paddingVertical: 14,
    ...shadow.soft,
  },
  voiceText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
