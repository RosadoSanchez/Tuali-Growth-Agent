import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radius, shadow } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { fetchClients } from '../services/api';

export default function Login() {
  const { signIn } = useAuth();

  const [clients, setClients] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState<string | null>(null);

  const loadClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const ids = await fetchClients();
      setClients(ids);
    } catch (e: any) {
      setError(e.message ?? 'No se pudieron cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleSelect = async (id: string) => {
    setSigningIn(id);
    setError(null);
    try {
      await signIn(id);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message ?? 'No se pudo iniciar sesión');
      setSigningIn(null);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.logo}>
          <Ionicons name="storefront" size={30} color="#fff" />
        </View>
        <Text style={styles.title}>Túali Growth</Text>
        <Text style={styles.subtitle}>Elige tu tienda para entrar</Text>
      </LinearGradient>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.hint}>Cargando clientes…</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons name="cloud-offline-outline" size={40} color={colors.textMuted} />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retry} onPress={loadClients}>
            <Text style={styles.retryText}>Reintentar</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={clients}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.hint}>No hay clientes disponibles.</Text>
          }
          renderItem={({ item, index }) => (
            <Pressable
              style={styles.card}
              disabled={!!signingIn}
              onPress={() => handleSelect(item)}
            >
              <View style={styles.cardIcon}>
                <Text style={styles.cardIconText}>{index + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Cliente {index + 1}</Text>
                <Text style={styles.cardId} numberOfLines={1}>
                  ID: {item}
                </Text>
              </View>
              {signingIn === item ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              )}
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  hero: {
    paddingTop: 36,
    paddingBottom: 32,
    alignItems: 'center',
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: '#ffffff33',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff66',
  },
  title: { fontSize: 24, fontWeight: '900', color: '#fff', marginTop: 12 },
  subtitle: { fontSize: 14, color: '#ffffffe6', marginTop: 4 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  hint: { color: colors.textMuted, fontSize: 14, marginTop: 8, textAlign: 'center' },
  errorText: { color: colors.text, fontSize: 14, textAlign: 'center' },
  retry: {
    marginTop: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: radius.pill,
  },
  retryText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  list: { padding: 16, gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: 16,
    ...shadow.soft,
  },
  cardIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconText: { fontSize: 16, fontWeight: '900', color: colors.primary },
  cardTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
  cardId: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
});
