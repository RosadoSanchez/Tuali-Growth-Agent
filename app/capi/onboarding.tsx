import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radius, shadow } from '../../constants/theme';

const CAPI = require('../../assets/img/capipfpbig.png');

export default function CapiOnboarding() {
  const [goal, setGoal] = useState('');
  const insets = useSafeAreaInsets();

  const openChat = (selectedGoal: string) =>
    router.replace({ pathname: '/capi/chat', params: { goal: selectedGoal } });

  return (
    <View style={styles.root}>
      <Pressable style={styles.backdrop} onPress={() => router.back()} />

      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Pressable style={styles.close} hitSlop={8} onPress={() => router.back()}>
          <Ionicons name="close" size={20} color={colors.textMuted} />
        </Pressable>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingTop: 6, paddingBottom: insets.bottom + 16 }}
        >
          <View style={styles.head}>
            <Image source={CAPI} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.hi}>¡Qué onda, Chabelita!</Text>
              <Text style={styles.sub}>Soy Capi, tu coach de ventas.</Text>
            </View>
          </View>

          <Text style={styles.title}>¿Cuál es tu próximo gol?</Text>
          <Text style={styles.lead}>
            Elige una meta y armamos la jugada juntos. Tú pones el balón, yo te
            paso el plan.
          </Text>

          <Pressable style={[styles.option, styles.optionTop]} onPress={() => openChat('Vender más')}>
            <View style={[styles.optIcon, { backgroundColor: '#FBE3E3' }]}>
              <Ionicons name="trending-up" size={22} color={colors.red} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.optTitle}>Vender más</Text>
              <Text style={styles.optReco}>Recomendado para ti</Text>
              <Text style={styles.optDesc}>
                Mete más ventas esta semana. Capi te arma el plan goleador.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.primary} />
          </Pressable>

          <Pressable style={styles.option} onPress={() => openChat('Subir mi ticket promedio')}>
            <View style={[styles.optIcon, { backgroundColor: '#EDE7FB' }]}>
              <Ionicons name="receipt-outline" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.optTitle}>Subir mi ticket promedio</Text>
              <Text style={styles.optDesc}>
                Que cada cliente se lleve un poquito más en cada compra.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.primary} />
          </Pressable>

          <Pressable style={styles.option} onPress={() => router.replace('/capi/marcador')}>
            <View style={[styles.optIcon, { backgroundColor: '#E3F4E6' }]}>
              <Ionicons name="stats-chart" size={22} color={colors.green} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.optTitle}>Mi marcador</Text>
              <Text style={styles.optDesc}>
                Mira cómo vas con tus metas y qué está funcionando.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.primary} />
          </Pressable>

          <Text style={styles.orLabel}>O escríbela tú mismo</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={goal}
              onChangeText={setGoal}
              placeholder="Ej. Vender 50 cajas de refresco..."
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              onSubmitEditing={() => openChat(goal || 'Vender más')}
              returnKeyType="send"
            />
            <Pressable style={styles.mic} onPress={() => router.replace('/capi/voz')}>
              <Ionicons name="mic" size={18} color="#fff" />
            </Pressable>
          </View>

          <View style={styles.secure}>
            <Ionicons name="lock-closed" size={13} color={colors.green} />
            <Text style={styles.secureText}>Tus datos están protegidos</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20,18,30,0.45)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: '88%',
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: 10,
  },
  close: {
    position: 'absolute',
    top: 12,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  avatar: { width: 52, height: 52, borderRadius: radius.pill },
  hi: { fontSize: 15, fontWeight: '900', color: colors.text },
  sub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  title: { fontSize: 27, fontWeight: '900', color: colors.text, marginTop: 18, lineHeight: 31 },
  lead: { fontSize: 14, color: colors.textMuted, marginTop: 8, lineHeight: 20 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginTop: 14,
    ...shadow.soft,
  },
  optionTop: { borderColor: colors.red, borderWidth: 1.5 },
  optIcon: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  optReco: { fontSize: 12, fontWeight: '800', color: colors.red, marginTop: 3 },
  optDesc: { fontSize: 12, color: colors.textMuted, marginTop: 3, lineHeight: 16 },
  orLabel: { fontSize: 13, color: colors.textMuted, marginTop: 20 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    marginTop: 8,
  },
  input: { flex: 1, fontSize: 14, color: colors.text },
  mic: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secure: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.greenLight,
    borderRadius: radius.md,
    paddingVertical: 10,
    marginTop: 18,
  },
  secureText: { fontSize: 12, fontWeight: '700', color: colors.green },
});
