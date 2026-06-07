import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radius, shadow } from '../../constants/theme';

const CAPI = require('../../assets/img/capichatreply.png');

const BARS = [10, 18, 28, 16, 34, 22, 40, 26, 14, 30, 20, 36, 12, 24, 18];

export default function CapiVoz() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        <Pressable style={styles.hbtn} onPress={() => router.back()}>
          <Ionicons name="close" size={18} color={colors.textMuted} />
        </Pressable>
      </View>

      <View style={styles.body}>
        <View style={styles.avatarWrap}>
          <View style={[styles.pulse, styles.pulse3]} />
          <View style={[styles.pulse, styles.pulse2]} />
          <View style={[styles.pulse, styles.pulse1]} />
          <Image source={CAPI} style={styles.capi} />
        </View>

        <View style={styles.speaking}>
          <View style={styles.recDot} />
          <Text style={styles.speakingText}>Capi está hablando...</Text>
        </View>

        <View style={styles.wave}>
          {BARS.map((h, i) => (
            <View key={i} style={[styles.bar, { height: h }]} />
          ))}
        </View>

        <Text style={styles.prompt}>
          Hoy toca surtir refrescos.{'\n'}¿Armo tu pedido de siempre?
        </Text>

        <View style={styles.actions}>
          <Pressable
            style={[styles.action, { backgroundColor: colors.green }]}
            onPress={() => router.push('/carrito')}
          >
            <Text style={styles.actionText}>Sí, dale</Text>
          </Pressable>
          <Pressable
            style={[styles.action, styles.actionGhost]}
            onPress={() => router.back()}
          >
            <Text style={[styles.actionText, { color: colors.text }]}>
              Ahorita no
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.mic}>
          <Ionicons name="mic" size={26} color="#fff" />
        </Pressable>
        <Text style={styles.hold}>Mantén para hablar</Text>
      </View>
    </SafeAreaView>
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
  hbtn: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: '#ffffffaa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18 },
  avatarWrap: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: { position: 'absolute', borderRadius: radius.pill, backgroundColor: colors.red },
  pulse1: { width: 150, height: 150, opacity: 0.18 },
  pulse2: { width: 190, height: 190, opacity: 0.1 },
  pulse3: { width: 220, height: 220, opacity: 0.06 },
  capi: { width: 130, height: 130 },
  speaking: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffffcc',
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  recDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.red },
  speakingText: { fontSize: 13, fontWeight: '700', color: colors.text },
  wave: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 44 },
  bar: { width: 4, borderRadius: 2, backgroundColor: colors.red },
  prompt: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 24,
  },
  actions: { flexDirection: 'row', gap: 12, paddingHorizontal: 24 },
  action: {
    flex: 1,
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
    ...shadow.soft,
  },
  actionGhost: { backgroundColor: '#fff' },
  actionText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  footer: { alignItems: 'center', gap: 8, paddingBottom: 16 },
  mic: {
    width: 68,
    height: 68,
    borderRadius: radius.pill,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  hold: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
});
