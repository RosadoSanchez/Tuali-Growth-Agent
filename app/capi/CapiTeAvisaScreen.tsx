import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

const API = "http://YourIP:3000"; // ← tu IP local

// ─── Tipos ───────────────────────────────────────────────────────────────────
interface NotificationToggleProps {
  icon: string;
  iconBg: string;
  title: string;
  subtitle: string;
  value: boolean;
  onToggle: (v: boolean) => void;
}

// ─── Sub-componente: fila de toggle ──────────────────────────────────────────
const NotificationToggle: React.FC<NotificationToggleProps> = ({
  icon, iconBg, title, subtitle, value, onToggle,
}) => (
  <View style={styles.toggleRow}>
    <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
      <Text style={styles.iconEmoji}>{icon}</Text>
    </View>
    <View style={styles.toggleText}>
      <Text style={styles.toggleTitle}>{title}</Text>
      <Text style={styles.toggleSubtitle}>{subtitle}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: '#D1D5DB', true: '#4ADE80' }}
      thumbColor="#fff"
      ios_backgroundColor="#D1D5DB"
    />
  </View>
);

// ─── Pantalla principal ───────────────────────────────────────────────────────
export default function CapiTeAvisaScreen() {
  const { customerId: authCustomerId } = useAuth();
  const customerId = authCustomerId ?? 'test-001';

  const [appNotifs, setAppNotifs] = useState(true);
  const [diaDeRendir, setDiaDeRendir] = useState(true);
  const [avanceMeta, setAvanceMeta] = useState(true);
  const [promoTerminar, setPromoTerminar] = useState(false);

  // Estado del modal
  const [modalVisible, setModalVisible] = useState(false);
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);
  const [waConectado, setWaConectado] = useState(false);

  // ── Guardar preferencia de toggle en backend ──────────────────────────────
  const handleToggle = async (key: string, value: boolean) => {
    try {
      await fetch(`${API}/api/whatsapp/preferences/${customerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      });
    } catch (err) {
      console.warn("No se pudo guardar preferencia:", err);
    }
  };

  // ── Conectar WhatsApp (se llama desde el modal) ───────────────────────────
  const handleConectarWhatsApp = async () => {
    const soloDigitos = telefono.replace(/\D/g, '');

    if (soloDigitos.length < 10) {
      Alert.alert('Número inválido', 'Ingresa un número de 10 dígitos.');
      return;
    }

    // Agrega 52 si no tiene código de país
    const phoneCompleto = soloDigitos.startsWith('52')
      ? soloDigitos
      : `52${soloDigitos}`;

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/whatsapp/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerId,
          phone: phoneCompleto,
          name: customerId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setWaConectado(true);
        setModalVisible(false);
        setTelefono('');
        Alert.alert('¡Listo! 🎉', 'Revisa tu WhatsApp, Capi ya te escribió 📲');
      } else {
        Alert.alert('Error', data.error || 'No se pudo conectar.');
      }
    } catch (err) {
      Alert.alert('Error', 'Verifica que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#EEEAF6" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.capiAvatar}>
            <Text style={styles.capiAvatarText}>🤖</Text>
          </View>
          <Text style={styles.headerTitle}>Capi te avisa 🔔</Text>
        </View>
        <TouchableOpacity style={styles.closeBtn} onPress={() => Alert.alert('Cerrar')}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Mensaje de bienvenida ── */}
        <View style={styles.card}>
          <View style={styles.welcomeRow}>
            <View style={styles.capiAvatarSmall}>
              <Text style={styles.capiAvatarText}>🤖</Text>
            </View>
            <Text style={styles.welcomeText}>
              Yo te aviso para que no se te pase ningún gol. ⚽
            </Text>
          </View>
        </View>

        {/* ── Card WhatsApp ── */}
        <View style={styles.card}>
          <View style={styles.waRow}>
            <View style={[styles.iconBox, { backgroundColor: '#25D366' }]}>
              <Text style={styles.iconEmoji}>💬</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.waTitle}>Recibe avisos por WhatsApp</Text>
              <Text style={styles.waSubtitle}>Capi te escribe como un cuate, en tu chat.</Text>
            </View>
          </View>

          {waConectado ? (
            <View style={styles.waConectadoBox}>
              <Text style={styles.waConectadoText}>✅ WhatsApp conectado</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.waButton}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.waButtonIcon}>💬</Text>
              <Text style={styles.waButtonText}>Conectar WhatsApp</Text>
            </TouchableOpacity>
          )}

          <View style={styles.appNotifsRow}>
            <Text style={styles.appNotifsIcon}>📲</Text>
            <Text style={styles.appNotifsLabel}>Notificaciones de la app</Text>
            <Switch
              value={appNotifs}
              onValueChange={(v) => { setAppNotifs(v); handleToggle('app_enabled', v); }}
              trackColor={{ false: '#D1D5DB', true: '#4ADE80' }}
              thumbColor="#fff"
              ios_backgroundColor="#D1D5DB"
            />
          </View>
        </View>

        {/* ── Card "¿De qué te aviso?" ── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>¿De qué te aviso?</Text>

          <NotificationToggle
            icon="📦" iconBg="#F59E0B"
            title="Día de surtir"
            subtitle="Te recuerdo el día de tu pedido."
            value={diaDeRendir}
            onToggle={(v) => { setDiaDeRendir(v); handleToggle('dia_de_surtir', v); }}
          />
          <View style={styles.divider} />
          <NotificationToggle
            icon="🎯" iconBg="#EF4444"
            title="Avance de mi meta"
            subtitle="Cómo va tu marcador rumbo al gol."
            value={avanceMeta}
            onToggle={(v) => { setAvanceMeta(v); handleToggle('avance_meta', v); }}
          />
          <View style={styles.divider} />
          <NotificationToggle
            icon="🏷️" iconBg="#F97316"
            title="Promo por terminar"
            subtitle="Antes de que se acabe una promo."
            value={promoTerminar}
            onToggle={(v) => { setPromoTerminar(v); handleToggle('promo_por_terminar', v); }}
          />
        </View>

        {/* ── Preview del aviso ── */}
        <Text style={styles.previewLabel}>👀 Así se ve tu aviso</Text>
        <View style={styles.whatsappPreview}>
          <View style={styles.wpHeader}>
            <View style={styles.capiAvatarSmall}>
              <Text style={styles.capiAvatarText}>🤖</Text>
            </View>
            <View>
              <Text style={styles.wpHeaderName}>Capi</Text>
              <Text style={styles.wpHeaderStatus}>en línea</Text>
            </View>
          </View>
          <View style={styles.wpBody}>
            <View style={styles.wpBubble}>
              <Text style={styles.wpBubbleText}>
                ¡Hola, Valeria! Hoy toca surtir para no quedarte sin tus más vendidos. Vamos por ese gol ⚽
              </Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* ── Modal: ingresar número ── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>¿A qué número te aviso? 📲</Text>
            <Text style={styles.modalSubtitle}>
              Capi te mandará un mensaje de bienvenida para confirmar.
            </Text>

            <View style={styles.inputRow}>
              <View style={styles.inputPrefix}>
                <Text style={styles.inputPrefixText}>🇲🇽 +52</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="81 1234 5678"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                maxLength={12}
                value={telefono}
                onChangeText={setTelefono}
                autoFocus
              />
            </View>

            <TouchableOpacity
              style={[styles.waButton, loading && { opacity: 0.7 }]}
              onPress={handleConectarWhatsApp}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <>
                    <Text style={styles.waButtonIcon}>💬</Text>
                    <Text style={styles.waButtonText}>Confirmar y conectar</Text>
                  </>
              }
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => { setModalVisible(false); setTelefono(''); }}
            >
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const PURPLE_BG = '#EEEAF6';
const GREEN = '#22C55E';
const WHITE = '#FFFFFF';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PURPLE_BG },
  scroll: { padding: 16, paddingBottom: 40, gap: 12 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: PURPLE_BG,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A2E' },
  capiAvatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#E53E3E',
  },
  capiAvatarSmall: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#E53E3E',
  },
  capiAvatarText: { fontSize: 18 },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#E5E0F0', alignItems: 'center', justifyContent: 'center',
  },
  closeBtnText: { color: '#666', fontSize: 14, fontWeight: '600' },

  card: {
    backgroundColor: WHITE, borderRadius: 20, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 2, gap: 12,
  },

  welcomeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  welcomeText: { flex: 1, fontSize: 15, color: '#374151', lineHeight: 22 },

  waRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  waTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
  waSubtitle: { fontSize: 13, color: '#6B7280', marginTop: 2 },

  waButton: {
    backgroundColor: GREEN, borderRadius: 14, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  waButtonIcon: { fontSize: 18 },
  waButtonText: { color: WHITE, fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },

  waConectadoBox: {
    backgroundColor: '#F0FDF4', borderRadius: 14, paddingVertical: 14,
    alignItems: 'center', borderWidth: 1, borderColor: '#BBF7D0',
  },
  waConectadoText: { color: '#16A34A', fontSize: 15, fontWeight: '600' },

  appNotifsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  appNotifsIcon: { fontSize: 18 },
  appNotifsLabel: { flex: 1, fontSize: 14, color: '#374151', fontWeight: '500' },

  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A2E', marginBottom: 4 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  iconEmoji: { fontSize: 20 },
  toggleText: { flex: 1 },
  toggleTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  toggleSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 2, lineHeight: 16 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 2 },

  previewLabel: { fontSize: 13, color: '#6B7280', fontWeight: '500', marginTop: 4, marginLeft: 4 },
  whatsappPreview: {
    borderRadius: 20, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  wpHeader: {
    backgroundColor: '#075E54', flexDirection: 'row',
    alignItems: 'center', padding: 12, gap: 10,
  },
  wpHeaderName: { color: WHITE, fontWeight: '700', fontSize: 15 },
  wpHeaderStatus: { color: '#A7F3D0', fontSize: 12 },
  wpBody: { backgroundColor: '#ECE5DD', padding: 16, minHeight: 80 },
  wpBubble: {
    backgroundColor: WHITE, borderRadius: 12, borderTopLeftRadius: 2,
    padding: 12, maxWidth: '85%',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 1,
  },
  wpBubbleText: { fontSize: 14, color: '#1A1A2E', lineHeight: 20 },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: WHITE, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, gap: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A2E', textAlign: 'center' },
  modalSubtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 },

  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 14, overflow: 'hidden',
  },
  inputPrefix: {
    backgroundColor: '#F9FAFB', paddingHorizontal: 14, paddingVertical: 14,
    borderRightWidth: 1, borderRightColor: '#E5E7EB',
  },
  inputPrefixText: { fontSize: 14, color: '#374151', fontWeight: '600' },
  input: {
    flex: 1, paddingHorizontal: 14, paddingVertical: 14,
    fontSize: 16, color: '#1A1A2E', letterSpacing: 1,
  },

  cancelBtn: { alignItems: 'center', paddingVertical: 8 },
  cancelBtnText: { color: '#9CA3AF', fontSize: 15 },
});