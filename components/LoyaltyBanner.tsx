import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { radius, shadow } from '../constants/theme';

// Banner promocional de Retos / Gana en el Home.
export default function LoyaltyBanner() {
  return (
    <Pressable
      onPress={() => router.push('/(tabs)/gana')}
      style={styles.card}
    >
      <Image
        source={require('../assets/img/home-banner.png')}
        style={styles.image}
        resizeMode="cover"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow.card,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: radius.lg,
  },
});
