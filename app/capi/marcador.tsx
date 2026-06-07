import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radius, shadow } from '../../constants/theme';

const CAPI = require('../../assets/img/capichatreply.png');
const CAPI_GOL = require('../../assets/img/Capi_gol.png');
const FUTBOL = require('../../assets/img/futbol_loadingbar.png');
const PORTERIA = require('../../assets/img/porteria_loadingbar.png');

const FUNCIONO = [
  'El 2x1 en botanas jaló: +18 tickets esta semana.',
  'El agua que sumaste vendió $240. ¡Bien ahí!',
  'Más clientes llegaron a $120 por el cupón.',
];

const AJUSTAR = [
  'Súrtete de combos el jueves, se te acaban el finde.',
  'Sube el refresco grande junto a las botanas.',
];

export default function CapiMarcador() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Image source={CAPI} style={styles.hpfp} />
        <Text style={styles.htitle}>Tu marcador</Text>
        <View style={{ flex: 1 }} />
        <Pressable style={styles.hbtn} onPress={() => router.back()}>
          <Ionicons name="close" size={18} color={colors.textMuted} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 14 }}
      >
        {/* Ticket promedio */}
        <View style={styles.card}>
          <Text style={styles.kicker}>TICKET PROMEDIO · esta semana</Text>
          <View style={styles.bigRow}>
            <Text style={styles.big}>$202</Text>
            <View style={styles.up}>
              <Ionicons name="trending-up" size={14} color={colors.green} />
              <Text style={styles.upText}>+12%</Text>
            </View>
          </View>
          <Text style={styles.muted}>Antes $180 · Meta $210 · ¡casi gol!</Text>
        </View>

        {/* Partido */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Vas ganando el partido</Text>
            <Text style={styles.pct}>96%</Text>
          </View>
          <View style={styles.barWrap}>
            <View style={styles.track}>
              <View style={[styles.fill, { width: '88%' }]} />
            </View>
            <Image source={FUTBOL} style={[styles.ball, { left: '80%' }]} />
            <Image source={PORTERIA} style={styles.goal} />
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.muted}>Inicio $180</Text>
            <Text style={styles.muted}>Meta $210</Text>
          </View>
        </View>

        {/* GOOOL */}
        <View style={styles.gool}>
          <Image source={CAPI_GOL} style={styles.goolCapi} resizeMode="contain" />
          <View style={{ flex: 1 }}>
            <View style={styles.markBadge}>
              <Text style={styles.markText}>Nueva marca personal</Text>
            </View>
            <Text style={styles.goolTitle}>¡GOOOOL!</Text>
            <Text style={styles.goolSub}>Subiste tu ticket 12% esta semana</Text>
          </View>
        </View>

        {/* Qué funcionó */}
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <Ionicons name="checkmark-circle" size={18} color={colors.green} />
            <Text style={[styles.cardTitle, { color: colors.green }]}>
              Qué funcionó
            </Text>
          </View>
          <View style={{ marginTop: 10, gap: 10 }}>
            {FUNCIONO.map((t) => (
              <View key={t} style={styles.li}>
                <View style={[styles.bullet, { backgroundColor: colors.green }]} />
                <Text style={styles.liText}>{t}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Qué ajustar */}
        <View style={[styles.card, { borderColor: '#F4C84A', borderWidth: 1 }]}>
          <View style={styles.titleRow}>
            <Ionicons name="build" size={16} color="#C9971A" />
            <Text style={[styles.cardTitle, { color: '#C9971A' }]}>Qué ajustar</Text>
          </View>
          <View style={{ marginTop: 10, gap: 10 }}>
            {AJUSTAR.map((t) => (
              <View key={t} style={styles.li}>
                <View style={[styles.bullet, { backgroundColor: '#E2A019' }]} />
                <Text style={styles.liText}>{t}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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
  htitle: { fontSize: 18, fontWeight: '900', color: colors.text },
  hbtn: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: 16,
    ...shadow.soft,
  },
  kicker: { fontSize: 11, fontWeight: '800', color: colors.textMuted, letterSpacing: 0.4 },
  bigRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  big: { fontSize: 38, fontWeight: '900', color: colors.text },
  up: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.greenLight,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  upText: { fontSize: 13, fontWeight: '800', color: colors.green },
  muted: { fontSize: 12, color: colors.textMuted, marginTop: 8 },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardTitle: { fontSize: 15, fontWeight: '900', color: colors.text },
  pct: { fontSize: 15, fontWeight: '900', color: colors.green },
  barWrap: { height: 44, justifyContent: 'center', marginVertical: 10 },
  track: {
    height: 12,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    marginRight: 38,
    overflow: 'hidden',
  },
  fill: { height: 12, backgroundColor: colors.green, borderRadius: radius.pill },
  ball: {
    position: 'absolute',
    width: 30,
    height: 30,
    top: 7,
  },
  goal: {
    position: 'absolute',
    right: 0,
    width: 40,
    height: 40,
    top: 2,
  },
  gool: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1E9E54',
    borderRadius: radius.lg,
    padding: 16,
    ...shadow.card,
  },
  goolCapi: { width: 72, height: 80 },
  markBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff2e',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  markText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  goolTitle: { color: '#fff', fontSize: 30, fontWeight: '900', marginTop: 6 },
  goolSub: { color: '#ffffffe6', fontSize: 13, fontWeight: '700', marginTop: 2 },
  li: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  bullet: { width: 7, height: 7, borderRadius: 4, marginTop: 6 },
  liText: { flex: 1, fontSize: 13, color: colors.text, lineHeight: 18 },
});
