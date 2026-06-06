// Paleta de marca Túali (basada en la app y el branding de Arca Continental)
export const colors = {
  // Marca Túali
  primary: '#FF7A66', // coral Túali
  primaryDark: '#E85C46',
  primaryLight: '#FFB3A3',
  gradientStart: '#FF8E73',
  gradientMid: '#FF9E86',
  gradientEnd: '#FFC2AE',

  // Acentos
  red: '#E3000F', // rojo Coca-Cola / carrito
  green: '#7CB342', // etiqueta verde (promos Gana)
  greenLight: '#E7F3D8',
  purple: '#6C4DEE',
  yellow: '#FFC72C',
  gana: '#E2231A', // rojo Gana

  // Superficies
  bg: '#FFFFFF',
  surface: '#F6F5FA',
  surfaceAlt: '#FBEFE9',
  card: '#FFFFFF',
  border: '#ECEAF2',

  // Texto
  text: '#23222A',
  textMuted: '#8E8C9A',
  textOnPrimary: '#FFFFFF',

  // Estado
  star: '#FFB400',
  success: '#34B36B',
  shadow: '#1A1A2E',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 26,
  pill: 999,
};

export const font = {
  // tamaños
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
};

export const shadow = {
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  soft: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
};
