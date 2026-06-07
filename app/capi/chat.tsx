import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, radius, shadow } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { agentChat, ChatTurn, Jugada } from '../../services/api';

const CAPI_PFP = require('../../assets/img/capipfpbig.png');
const CAPI_REPLY = require('../../assets/img/capichatreply.png');

type Msg = { id: string; from: 'capi' | 'user'; text: string };

const CHIPS = ['Subir mi ticket', 'Vender más', 'Ponme una meta'];

export default function CapiChat() {
  const { customerId } = useAuth();
  const { add } = useCart();
  const { goal } = useLocalSearchParams<{ goal?: string }>();

  const [messages, setMessages] = useState<Msg[]>([]);
  const [jugada, setJugada] = useState<Jugada | null>(null);
  const [activated, setActivated] = useState<Record<string, boolean>>({});
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const scrollDown = () =>
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);

  // Primer saludo + jugada al abrir (un solo flujo, cero clics extra).
  useEffect(() => {
    if (!customerId) return;
    (async () => {
      try {
        const res = await agentChat(customerId, { goal: goal as string });
        setMessages([{ id: 'm0', from: 'capi', text: res.reply }]);
        setJugada(res.jugada);
      } catch (e: any) {
        setMessages([
          {
            id: 'err',
            from: 'capi',
            text: `No pude conectarme 😕 (${e.message})`,
          },
        ]);
      } finally {
        setLoading(false);
        scrollDown();
      }
    })();
  }, [customerId]);

  const send = async (t: string) => {
    const v = t.trim();
    if (!v || sending || !customerId) return;

    const userMsg: Msg = { id: `u${messages.length}`, from: 'user', text: v };
    setMessages((prev) => [...prev, userMsg]);
    setText('');
    setSending(true);
    scrollDown();

    try {
      const history: ChatTurn[] = [...messages, userMsg].map((m) => ({
        from: m.from,
        text: m.text,
      }));
      const res = await agentChat(customerId, { message: v, goal: goal as string, history });
      setMessages((prev) => [
        ...prev,
        { id: `c${prev.length}`, from: 'capi', text: res.reply },
      ]);
      if (res.jugada) setJugada(res.jugada);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { id: `e${prev.length}`, from: 'capi', text: `Ups, fallé: ${e.message}` },
      ]);
    } finally {
      setSending(false);
      scrollDown();
    }
  };

  // Un solo tap: activar el movimiento (y si es pedido, va al carrito).
  const activate = (key: string, type: string) => {
    setActivated((prev) => ({ ...prev, [key]: true }));
    if (type === 'reorder') add('p1', 1); // sugerido al carrito
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={CAPI_PFP} style={styles.hpfp} />
        <View style={{ flex: 1 }}>
          <Text style={styles.hname}>Capi</Text>
          <Text style={styles.status}>
            {sending ? 'escribiendo…' : 'armando tu jugada'}
          </Text>
        </View>
        <Pressable style={styles.hbtn} onPress={() => router.push('/capi/marcador')}>
          <Ionicons name="stats-chart" size={18} color={colors.primary} />
        </Pressable>
        <Pressable style={styles.hbtn} onPress={() => router.back()}>
          <Ionicons name="close" size={18} color={colors.textMuted} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}
      >
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 8, gap: 14 }}
        >
          {loading && (
            <View style={styles.capiRow}>
              <Image source={CAPI_REPLY} style={styles.replyPfp} />
              <View style={styles.capiBubble}>
                <ActivityIndicator color={colors.red} />
              </View>
            </View>
          )}

          {messages.map((m) =>
            m.from === 'capi' ? (
              <View key={m.id} style={styles.capiRow}>
                <Image source={CAPI_REPLY} style={styles.replyPfp} />
                <View style={styles.capiBubble}>
                  <Text style={styles.capiText}>{m.text}</Text>
                </View>
              </View>
            ) : (
              <View key={m.id} style={styles.userRow}>
                <View style={styles.userBubble}>
                  <Text style={styles.userText}>{m.text}</Text>
                </View>
              </View>
            )
          )}

          {/* Tarjeta de jugada (dinámica) */}
          {jugada && (
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
                      <Ionicons
                        name={done ? 'checkmark' : 'flash'}
                        size={15}
                        color="#fff"
                      />
                      <Text style={styles.activarText}>
                        {done ? 'Activado' : mv.cta}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          )}

          {sending && (
            <View style={styles.capiRow}>
              <Image source={CAPI_REPLY} style={styles.replyPfp} />
              <View style={styles.capiBubble}>
                <ActivityIndicator color={colors.red} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick chips */}
        <View style={styles.chipRow}>
          {CHIPS.map((c) => (
            <Pressable key={c} style={styles.chip} onPress={() => send(c)}>
              <Text style={styles.chipText} numberOfLines={1}>
                {c}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Input */}
        <View style={styles.inputBar}>
          <View style={styles.inputWrap}>
            <Ionicons name="happy-outline" size={20} color={colors.textMuted} />
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Escríbele a Capi..."
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              onSubmitEditing={() => send(text)}
              returnKeyType="send"
              editable={!sending}
            />
          </View>
          <Pressable style={styles.micBtn} onPress={() => router.push('/capi/voz')}>
            <Ionicons name="mic" size={20} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 1 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
  status: { fontSize: 12, color: colors.textMuted },
  hbtn: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  jugada: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: 14,
    ...shadow.card,
  },
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
    paddingBottom: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.red,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  chipText: { color: colors.red, fontWeight: '700', fontSize: 12 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    height: 44,
  },
  input: { flex: 1, fontSize: 14, color: colors.text },
  micBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
