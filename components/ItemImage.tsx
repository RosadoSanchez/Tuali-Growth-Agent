import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/theme';

type Props = {
  image?: ImageSourcePropType; // imagen local (require). Si no hay, se usa el ícono.
  icon: string; // ícono de respaldo (Ionicons)
  iconColor?: string;
  iconSize?: number;
  bgColor?: string;
  radius?: number;
  style?: StyleProp<ViewStyle>; // tamaño (height/width/margin) lo da el caller
};

// Muestra una imagen local del producto/categoría/marca. Si no hay imagen,
// cae a un ícono limpio sobre un fondo de color.
export default function ItemImage({
  image,
  icon,
  iconColor = colors.textMuted,
  iconSize = 40,
  bgColor = '#fff',
  radius = 12,
  style,
}: Props) {
  return (
    <View
      style={[styles.base, { borderRadius: radius, backgroundColor: bgColor }, style]}
    >
      {image ? (
        <Image
          source={image}
          style={{ width: '86%', height: '86%', borderRadius: radius }}
          resizeMode="contain"
        />
      ) : (
        <Ionicons name={icon as any} size={iconSize} color={iconColor} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
