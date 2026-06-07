import React, { useRef, useState } from 'react';
import {
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
import { router } from 'expo-router';
import { colors, radius, shadow } from '../../constants/theme';

const CAPI_PFP = require('../../assets/img/capipfpbig.png');
const CAPI_REPLY = require('../../assets/img/capichatreply.png');

type Msg = { id: string; from: 'capi' | 'user'; text: string };

const INITIAL: Msg[] = [
  {
    id: 'm1',
    from: 'capi',
    text: '¡Listo, Chabelita! Tu meta es subir el ticket promedio. Te armé una jugada para llegar al gol.',
  },
  { id: 'm2', from: 'user', text: '¿Y qué hago primero, Capi?' },
  {
    id: 'm3',
    from: 'capi',
    text: 'Fácil. Aquí está tu jugada. Activa las que quieras y yo llevo el marcador.',
  },
];

const CHIPS = ['Subir mi ticket', 'Vender más', 'Ponme una meta'];

export default function CapiChat() {
  const [messages, setMessages] = useState<Msg[]>(INITIAL);
  const [text, setText] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const send = (t: string) => {
    const v = t.trim();
    if (!v) return;
    setMessages((prev) => [
      ...prev,
      { id: `u${prev.length}`, from: 'user', text: v },
      {
        id: `c${prev.length}`,
        from: 'capi',
        text: '¡Va! Lo sumo a tu jugada y te aviso cómo vamos en el marcador.',
      },
    ]);
    setText('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={CAPI_PFP} style={styles.hpfp} />
        <View style={{ flex: 1 }}>
          <Text style={styles.hname}>Capi</Text>
          <Text style={styles.status}>armando tu jugada</Text>
        </View>
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

          {/* Tarjeta de jugada */}
          <View style={styles.jugada}>
            <View style={styles.jugadaHead}>
              <Image source={CAPI_REPLY} style={styles.replyPfp} />
              <View style={{ flex: 1 }}>
                <Text style={styles.jugadaTitle}>Tu jugada para subir tu ticket</Text>
                <Text style={styles.jugadaSub}>
                  4 movimientos · toca Activar los que quieras
                </Text>
              </View>
            </View>

            <View style={styles.reto}>
              <View style={styles.retoTagRow}>
                <View style={styles.retoIcon}>
                  <Ionicons name="disc" size={16} color="#fff" />
                </View>
                <Text style={styles.retoTag}>RETO DE GANA</Text>
              </View>
              <Text style={styles.retoTitle}>
                Acepta el reto: vende 3 combos esta semana
              </Text>
              <Text style={styles.retoDesc}>
                Tú vendes mucho refresco solo; los combos suben el ticket sin bajar
                tu margen. Y te dan 200 Puntos.
              </Text>
              <Pressable style={styles.activar}>
                <Ionicons name="flash" size={15} color="#fff" />
                <Text style={styles.activarText}>Activar</Text>
              </Pressable>
            </View>
          </View>
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
