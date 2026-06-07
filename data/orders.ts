import { Order } from './types';

export const orders: Order[] = [
  {
    id: 'o1',
    folio: 'TUA-2026-0512',
    date: '2026-06-03',
    items: [
      { productId: 'p1', qty: 3 },
      { productId: 'p3', qty: 2 },
      { productId: 'p9', qty: 1 },
    ],
    total: 1357.0,
    units: 6,
    status: 'en_camino',
  },
  {
    id: 'o2',
    folio: 'TUA-2026-0498',
    date: '2026-05-27',
    items: [
      { productId: 'p2', qty: 2 },
      { productId: 'p10', qty: 4 },
    ],
    total: 792.0,
    units: 6,
    status: 'entregado',
  },
  {
    id: 'o3',
    folio: 'TUA-2026-0455',
    date: '2026-05-14',
    items: [
      { productId: 'p1', qty: 5 },
      { productId: 'p7', qty: 3 },
      { productId: 'p12', qty: 2 },
    ],
    total: 2698.5,
    units: 10,
    status: 'entregado',
  },
  {
    id: 'o4',
    folio: 'TUA-2026-0431',
    date: '2026-05-02',
    items: [{ productId: 'p6', qty: 2 }],
    total: 396.0,
    units: 2,
    status: 'cancelado',
  },
];

export const statusLabel: Record<Order['status'], string> = {
  entregado: 'Entregado',
  en_camino: 'En camino',
  preparando: 'Preparando',
  cancelado: 'Cancelado',
};
