import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ConversationProvider, useConversation } from '@elevenlabs/react-native';
import { colors, radius, shadow } from '../../constants/theme';
import { ELEVENLABS_AGENT_ID } from '../../constants/config';
import { useAuth } from '../../context/AuthContext';

const CAPI = require('../../assets/img/capichatreply.png');

type Line = { id: string; from: 'capi' | 'user'; text: string };

// El SDK nativo de ElevenLabs habla con el agente vía WebRTC (LiveKit).
// Esto SÍ usa el micrófono real del teléfono y reproduce el audio de Capi.
// IMPORTANTE: requiere un *development build* (no funciona en Expo Go) y un
// teléfono físico o emulador de Android (el simulador de iOS no tiene micro).
function VozInner() {
  const { customerId } = useAuth();
  const [lines, setLines] = useState<Line[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  const scrollDown = () =>
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);

  // Agrega una línea al transcript. Si el último mensaje es del mismo
  // interlocutor, lo vamos actualizando (efecto "se escribe mientras hablas").
  const pushLine = (from: 'capi' | 'user', text: string) => {
    setLines((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.from === from) {
        const copy = [...prev];
        copy[copy.length - 1] = { ...last, text };
        return copy;
      }
      return [...prev, { id: `${from}-${prev.length}-${Date.now()}`, from, text }];
    });
    scrollDown();
  };

  const conversation = useConversation({
    onDisconnect: () => {},
    onError: (message: string) =>
      pushLine('capi', `Se cortó la llamada 😕 (${message})`),
    onMessage: ({ message, source }: { message: string; source: 'user' | 'ai' }) => {
      if (!message) return;
      pushLine(source === 'user' ? 'user' : 'capi', message);
    },
  });

  const status = conversation.status; // 'disconnected' | 'connecting' | 'connected' | 'error'
  const connecting = status === 'connecting';
  const connected = status === 'connected';
  const active = connected || connecting;
  const isSpeaking = !!conversation.isSpeaking;

  const start = () => {
    if (active) return;
    try {
      conversation.startSession({
        agentId: ELEVENLABS_AGENT_ID,
        // Capi ya sabe con qué tendero habla, sin tener que preguntárselo.
        dynamicVariables: { customer_id: customerId ?? '' },
      });
    } catch (e: any) {
      pushLine('capi', `No pude conectar el micrófono 😕 (${e?.message ?? e})`);
    }
  };

  const stop = () => {
    try {
      conversation.endSession();
    } catch {}
  };

  // Cierra la sesión si sales de la pantalla.
  useEffect(() => {
    return () => {
      try {
        conversation.endSession();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusLabel = !connected
    ? connecting
      ? 'Conectando…'
      : 'Toca el micrófono para hablar'
    : isSpeaking
    ? 'Capi está hablando…'
    : 'Te escucho…';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.htitle}>Hablar con Capi</Text>
        <Pressable style={styles.hbtn} onPress={() => router.back()}>
          <Ionicons name="close" size={18} color={colors.textMuted} />
        </Pressable>
      </View>

      {/* Avatar */}
      <View style={styles.avatarWrap}>
        {active && <View style={[styles.pulse, styles.pulse3]} />}
        {active && <View style={[styles.pulse, styles.pulse2]} />}
        <View style={[styles.pulse, styles.pulse1, isSpeaking && styles.pulseActive]} />
        <Image source={CAPI} style={styles.capi} />
      </View>

      <View style={styles.statusPill}>
        {connected && (
          <View style={[styles.dot, isSpeaking ? styles.dotRed : styles.dotGreen]} />
        )}
        <Text style={styles.statusText}>{statusLabel}</Text>
      </View>

      {/* Transcript en vivo */}
      <ScrollView
        ref={scrollRef}
        style={styles.transcript}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {lines.length === 0 && (
          <Text style={styles.empty}>
            Aquí vas a ver lo que dices y lo que te responde Capi, en vivo.
          </Text>
        )}
        {lines.map((l) =>
          l.from === 'user' ? (
            <View key={l.id} style={styles.userRow}>
              <View style={styles.userBubble}>
                <Text style={styles.userText}>{l.text}</Text>
              </View>
            </View>
          ) : (
            <View key={l.id} style={styles.capiRow}>
              <Image source={CAPI} style={styles.miniPfp} />
              <View style={styles.capiBubble}>
                <Text style={styles.capiText}>{l.text}</Text>
              </View>
            </View>
          )
        )}
      </ScrollView>

      {/* Botón de micrófono */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.mic, active && styles.micActive]}
          onPress={active ? stop : start}
        >
          <Ionicons name={active ? 'stop' : 'mic'} size={28} color="#fff" />
        </Pressable>
        <Text style={styles.hold}>
          {active ? 'Toca para terminar' : 'Toca para empezar a hablar'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default function CapiVoz() {
  // Sin Agent ID no hay voz real: mostramos un aviso claro.
  if (!ELEVENLABS_AGENT_ID) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Text style={styles.htitle}>Hablar con Capi</Text>
          <Pressable style={styles.hbtn} onPress={() => router.back()}>
            <Ionicons name="close" size={18} color={colors.textMuted} />
          </Pressable>
        </View>
        <View style={styles.center}>
          <Image source={CAPI} style={styles.capi} />
          <Text style={styles.hint}>
            Falta el Agent ID de ElevenLabs. Pégalo en{'\n'}
            app.json → expo.extra.elevenLabsAgentId
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ConversationProvider>
      <VozInner />
    </ConversationProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F1ECFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  htitle: { fontSize: 16, fontWeight: '900', color: colors.text },
  hbtn: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: '#ffffffaa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },
  avatarWrap: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  pulse: { position: 'absolute', borderRadius: radius.pill, backgroundColor: colors.red },
  pulse1: { width: 130, height: 130, opacity: 0.18 },
  pulse2: { width: 165, height: 165, opacity: 0.1 },
  pulse3: { width: 195, height: 195, opacity: 0.06 },
  pulseActive: { opacity: 0.32 },
  capi: { width: 110, height: 110 },
  statusPill: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffffcc',
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginTop: 4,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotRed: { backgroundColor: colors.red },
  dotGreen: { backgroundColor: colors.success },
  statusText: { fontSize: 13, fontWeight: '700', color: colors.text },
  transcript: { flex: 1, marginTop: 12 },
  empty: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 24,
    marginTop: 24,
  },
  capiRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, maxWidth: '88%' },
  miniPfp: { width: 28, height: 28, borderRadius: radius.pill },
  capiBubble: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    borderTopLeftRadius: 4,
    padding: 12,
    ...shadow.soft,
  },
  capiText: { fontSize: 14, color: colors.text, lineHeight: 19 },
  userRow: { alignItems: 'flex-end' },
  userBubble: {
    maxWidth: '85%',
    backgroundColor: colors.red,
    borderRadius: radius.lg,
    borderTopRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userText: { fontSize: 14, color: '#fff', fontWeight: '600', lineHeight: 19 },
  footer: { alignItems: 'center', gap: 8, paddingVertical: 14 },
  mic: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  micActive: { backgroundColor: colors.text },
  hold: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  hint: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
  },
});
