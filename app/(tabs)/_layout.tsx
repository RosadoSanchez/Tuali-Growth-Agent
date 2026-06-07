import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/theme';
import CartBar from '../../components/CartBar';

type IconName = keyof typeof Ionicons.glyphMap;

const TABS: {
  name: string;
  label: string;
  icon: IconName;
  iconActive: IconName;
}[] = [
  { name: 'index', label: 'Inicio', icon: 'home-outline', iconActive: 'home' },
  { name: 'productos', label: 'Productos', icon: 'apps-outline', iconActive: 'apps' },
  { name: 'gana', label: 'Gana', icon: 'star-outline', iconActive: 'star' },
  { name: 'pedidos', label: 'Pedidos', icon: 'bookmark-outline', iconActive: 'bookmark' },
  { name: 'menu', label: 'Menú', icon: 'menu-outline', iconActive: 'menu' },
];

function TabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <CartBar />
      <View style={styles.bar}>
      {state.routes
        .filter((r: any) => TABS.some((t) => t.name === r.name))
        .map((route: any) => {
          const meta = TABS.find((t) => t.name === route.name)!;
          const index = state.routes.findIndex((r: any) => r.key === route.key);
          const focused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          return (
            <Pressable key={route.key} onPress={onPress} style={styles.tab}>
              <Ionicons
                name={focused ? meta.iconActive : meta.icon}
                size={23}
                color={focused ? colors.red : colors.textMuted}
              />
              <Text style={[styles.label, focused && styles.labelActive]}>
                {meta.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
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
      <Tabs.Screen name="productos" />
      <Tabs.Screen name="gana" />
      <Tabs.Screen name="pedidos" />
      <Tabs.Screen name="menu" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  bar: {
    flexDirection: 'row',
    paddingHorizontal: 6,
  },
  tab: { flex: 1, alignItems: 'center', gap: 3 },
  label: { fontSize: 10, color: colors.textMuted, fontWeight: '600' },
  labelActive: { color: colors.red, fontWeight: '800' },
});
