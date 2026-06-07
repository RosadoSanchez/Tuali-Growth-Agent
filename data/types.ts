// Nombre de un ícono de Ionicons (usamos íconos en vez de emojis).
export type IconName = string;

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  unit: string; // ej. "12 piezas", "Botella 1.5L"
  icon: IconName; // ícono de respaldo si no hay imagen local
  color: string; // color de fondo del tile
  image?: any; // imagen local (require). Si no hay, se usa el ícono.
  hasPromo?: boolean;
  promoLabel?: string;
  loyaltyPoints?: number;
  reorder?: boolean; // aparece en "Vuelve a surtir"
  popular?: boolean;
};

export type Category = {
  id: string;
  name: string;
  icon: IconName;
  color: string;
  image?: any; // imagen local (require)
};

export type Brand = {
  id: string;
  name: string;
  icon: IconName;
  color: string;
  image?: any; // logo local (require)
  logoBg?: string; // fondo del chip cuando el logo lo necesita (ej. logo blanco)
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
