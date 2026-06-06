export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  unit: string; // ej. "12 piezas", "Botella 1.5L"
  emoji: string;
  color: string; // color de fondo del tile
  hasPromo?: boolean;
  promoLabel?: string;
  loyaltyPoints?: number;
  reorder?: boolean; // aparece en "Vuelve a surtir"
  popular?: boolean;
};

export type Category = {
  id: string;
  name: string;
  emoji: string;
  color: string;
};

export type Brand = {
  id: string;
  name: string;
  emoji: string;
  color: string;
};

export type OrderItem = {
  productId: string;
  qty: number;
};

export type Order = {
  id: string;
  folio: string;
  date: string; // ISO
  items: OrderItem[];
  total: number;
  units: number;
  status: 'entregado' | 'en_camino' | 'preparando' | 'cancelado';
};
