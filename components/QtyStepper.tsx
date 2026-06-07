import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../constants/theme';

type Props = {
  qty: number;
  onChange: (qty: number) => void;
  size?: 'sm' | 'md';
};

export default function QtyStepper({ qty, onChange, size = 'md' }: Props) {
  const dim = size === 'sm' ? 26 : 32;
  return (
    <View style={[styles.wrap, { height: dim }]}>
      <Pressable
        hitSlop={8}
        onPress={() => onChange(qty - 1)}
        style={[styles.btn, { width: dim, height: dim }]}
      >
        <Ionicons name="remove" size={size === 'sm' ? 14 : 18} color={colors.primary} />
      </Pressable>
      <Text style={[styles.qty, { minWidth: dim }]}>{qty}</Text>
      <Pressable
        hitSlop={8}
        onPress={() => onChange(qty + 1)}
        style={[styles.btn, styles.btnAdd, { width: dim, height: dim }]}
      >
        <Ionicons name="add" size={size === 'sm' ? 14 : 18} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  btnAdd: {
    backgroundColor: colors.primary,
  },
  qty: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
});
