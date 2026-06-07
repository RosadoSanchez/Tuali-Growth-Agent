import Constants from 'expo-constants';

// URL base del backend (Tuali-Growth-Agent-Backend).
//
// Se lee de app.json -> expo.extra.apiUrl para que sea fácil de cambiar
// en un solo lugar. Cuando lo despliegues, cambia ese valor por tu URL
// pública (ej. https://tuali-backend.onrender.com).
//
// IMPORTANTE para probar en CELULAR físico:
// "localhost" apunta al teléfono, no a tu compu. Usa la IP de tu red local,
// por ejemplo "http://192.168.1.20:3000" (corre `ipconfig`/`ifconfig` para verla).
// En el emulador de Android usa "http://10.0.2.2:3000".
const extra = Constants.expoConfig?.extra as
  | { apiUrl?: string; elevenLabsAgentId?: string }
  | undefined;

export const API_URL = extra?.apiUrl ?? 'http://localhost:3000';
console.log('🔗 API_URL:', API_URL);

// ID del agente conversacional de ElevenLabs (Modo voz).
// Pégalo en app.json -> expo.extra.elevenLabsAgentId.
export const ELEVENLABS_AGENT_ID = extra?.elevenLabsAgentId ?? '';
