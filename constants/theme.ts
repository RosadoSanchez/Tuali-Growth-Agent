// Paleta basada en la app real de Tuali (Arca Continental):
// fondo blanco, acciones en morado, carrito/Gana/links en rojo.
export const colors = {
  // Color de acción (botones +, "Agregar X Paquetes")
  primary: '#6D28D9',
  primaryDark: '#5B21B6',
  primaryLight: '#C9B6F2',

  // Gradiente de marca Túali (splash / agente de crecimiento)
  gradientStart: '#FF8E73',
  gradientMid: '#FF9E86',
  gradientEnd: '#FFC2AE',
  coral: '#FF7A66',

  // Acentos
  red: '#ED1C24', // carrito, Gana, links ("Ver todos"), tab activo
  green: '#34A853', // etiqueta verde (promos Gana)
  greenLight: '#E3F4E6',
  purple: '#6D28D9',
  yellow: '#FFC72C',
  gana: '#ED1C24', // rojo Gana

  // Superficies
  bg: '#EFEFF1',
  surface: '#F6F5FA',
  surfaceAlt: '#F2ECFB',
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
