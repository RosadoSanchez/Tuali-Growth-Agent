import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radius, shadow } from '../../constants/theme';
import { moneyShort } from '../../constants/format';
import { store } from '../../data/store';

type IconName = keyof typeof Ionicons.glyphMap;

const MENU: { icon: IconName; label: string; sub?: string; route?: string }[] = [
  { icon: 'person-outline', label: 'Mi Perfil', sub: 'Datos de la tienda' },
  { icon: 'help-circle-outline', label: 'Soporte' },
  { icon: 'document-text-outline', label: 'Términos y condiciones' },
];

export default function Perfil() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <LinearGradient
          colors={['#FF7A66', '#FF9E86', '#FFC2AE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {store.name.charAt(0)}
            </Text>
          </View>
          <Text style={styles.name}>{store.name}</Text>
          <Text style={styles.owner}>{store.owner} · {store.level}</Text>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{store.points}</Text>
              <Text style={styles.statLabel}>Puntos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{moneyShort(store.ticketPromedio)}</Text>
              <Text style={styles.statLabel}>Ticket prom.</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{moneyShort(store.ventasMes)}</Text>
              <Text style={styles.statLabel}>Ventas mes</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.menu}>
          {MENU.map((m, i) => (
            <Pressable
              key={m.label}
              onPress={() => m.route && router.push(m.route as any)}
              style={[styles.item, i < MENU.length - 1 && styles.itemBorder]}
            >
              <View style={styles.itemIcon}>
                <Ionicons name={m.icon} size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemLabel}>{m.label}</Text>
                {m.sub && <Text style={styles.itemSub}>{m.sub}</Text>}
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.logout}>
          <Ionicons name="log-out-outline" size={18} color={colors.red} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </Pressable>
        <Text style={styles.version}>Tuali · v1.0.0 (demo hackathon)</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  hero: { padding: 24, paddingTop: 28, alignItems: 'center' },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: radius.pill,
    backgroundColor: '#ffffff33',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff66',
  },
  avatarText: { fontSize: 32, fontWeight: '900', color: '#fff' },
  name: { fontSize: 20, fontWeight: '900', color: '#fff', marginTop: 12 },
  owner: { fontSize: 13, color: '#ffffffe6', marginTop: 3 },
  stats: {
    flexDirection: 'row',
    backgroundColor: '#ffffff26',
    borderRadius: radius.lg,
    padding: 14,
    marginTop: 18,
    alignSelf: 'stretch',
  },
  stat: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: '#ffffff40' },
  statValue: { fontSize: 17, fontWeight: '900', color: '#fff' },
  statLabel: { fontSize: 11, color: '#ffffffd9', marginTop: 2 },
  menu: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    marginHorizontal: 16,
    marginTop: 18,
    paddingHorizontal: 16,
    ...shadow.soft,
  },
  item: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  itemIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: { fontSize: 15, fontWeight: '700', color: colors.text },
  itemSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  logoutText: { color: colors.red, fontWeight: '800', fontSize: 15 },
  version: { textAlign: 'center', color: colors.textMuted, fontSize: 12, marginTop: 14 },
});
