import { colors } from './theme';

// El backend guarda el estado como texto libre en `status_final`
// (ej. "Entregado", "Cancelado", "En camino"...). Aquí lo normalizamos
// a una de nuestras categorías de UI para color, etiqueta y filtros.
export type StatusKind = 'entregado' | 'en_camino' | 'preparando' | 'cancelado';

export function normalizeStatus(raw?: string): StatusKind {
  const s = (raw ?? '').toLowerCase();
  if (s.includes('entreg')) return 'entregado';
  if (s.includes('cancel')) return 'cancelado';
  if (s.includes('prepar') || s.includes('pend') || s.includes('proces'))
    return 'preparando';
  return 'en_camino';
}

export const statusKindLabel: Record<StatusKind, string> = {
  entregado: 'Entregado',
  en_camino: 'En camino',
  preparando: 'Preparando',
  cancelado: 'Cancelado',
};

export const statusKindColor: Record<StatusKind, string> = {
  entregado: colors.green,
  en_camino: '#2D7FF9',
  preparando: colors.yellow,
  cancelado: colors.red,
};

// Convierte un Total que puede venir como string ("1585.96") o número.
export const toNumber = (v: unknown): number => {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? '').replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};
