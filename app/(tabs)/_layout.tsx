import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadow } from '../../constants/theme';
import { useCart } from '../../context/CartContext';

type IconName = keyof typeof Ionicons.glyphMap;

const TABS: {
  name: string;
  label: string;
  icon: IconName;
  iconActive: IconName;
}[] = [
  { name: 'index', label: 'Inicio', icon: 'home-outline', iconActive: 'home' },
  { name: 'categorias', label: 'Categorías', icon: 'grid-outline', iconActive: 'grid' },
  { name: 'carrito', label: 'Carrito', icon: 'cart-outline', iconActive: 'cart' },
  { name: 'pedidos', label: 'Pedidos', icon: 'receipt-outline', iconActive: 'receipt' },
  { name: 'perfil', label: 'Perfil', icon: 'person-outline', iconActive: 'person' },
];

function TabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { count } = useCart();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {state.routes.map((route: any, index: number) => {
        const meta = TABS.find((t) => t.name === route.name);
        if (!meta) return null;
        const focused = state.index === index;
        const isCart = route.name === 'carrito';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        if (isCart) {
          return (
            <Pressable key={route.key} onPress={onPress} style={styles.centerWrap}>
              <View style={styles.centerBtn}>
                <Ionicons name="cart" size={26} color="#fff" />
                {count > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{count}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.label, focused && styles.labelActive]}>
                Carrito
              </Text>
            </Pressable>
          );
        }

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.tab}>
            <Ionicons
              name={focused ? meta.iconActive : meta.icon}
              size={23}
              color={focused ? colors.primary : colors.textMuted}
            />
            <Text style={[styles.label, focused && styles.labelActive]}>
              {meta.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="categorias" />
      <Tabs.Screen name="carrito" />
      <Tabs.Screen name="pedidos" />
      <Tabs.Screen name="perfil" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    paddingHorizontal: 6,
  },
  tab: { flex: 1, alignItems: 'center', gap: 3 },
  label: { fontSize: 10, color: colors.textMuted, fontWeight: '600' },
  labelActive: { color: colors.primary, fontWeight: '800' },
  centerWrap: { flex: 1, alignItems: 'center' },
  centerBtn: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    borderWidth: 4,
    borderColor: '#fff',
    ...shadow.card,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 6,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
});
