import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Product } from '../data/types';
import ItemImage from './ItemImage';

type Props = {
  product: Product;
  style?: StyleProp<ViewStyle>; // tamaño (height/width/margin) lo da el caller
  iconSize?: number;
  radius?: number;
};

// Imagen del producto (local) con ícono de respaldo.
export default function ProductImage({
  product,
  style,
  iconSize = 40,
  radius = 12,
}: Props) {
  return (
    <ItemImage
      image={product.image}
      icon={product.icon}
      bgColor={product.color}
      iconSize={iconSize}
      radius={radius}
      style={style}
    />
  );
}
