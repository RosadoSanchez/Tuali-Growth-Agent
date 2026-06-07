import React, { createContext, useContext, useMemo, useState } from 'react';
import { Product } from '../data/types';
import { productById } from '../data/catalog';

type CartLine = { productId: string; qty: number };

type CartState = {
  lines: CartLine[];
  add: (productId: string, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
  detailed: { product: Product; qty: number }[];
  qtyOf: (productId: string) => number;
};

const CartContext = createContext<CartState | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([
    { productId: 'p1', qty: 2 },
    { productId: 'p3', qty: 1 },
  ]);

  const add = (productId: string, qty = 1) =>
    setLines((prev) => {
      const found = prev.find((l) => l.productId === productId);
      if (found) {
        return prev.map((l) =>
          l.productId === productId ? { ...l, qty: l.qty + qty } : l
        );
      }
      return [...prev, { productId, qty }];
    });

  const setQty = (productId: string, qty: number) =>
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.productId !== productId)
        : prev.map((l) => (l.productId === productId ? { ...l, qty } : l))
    );

  const remove = (productId: string) =>
    setLines((prev) => prev.filter((l) => l.productId !== productId));

  const clear = () => setLines([]);

  const qtyOf = (productId: string) =>
    lines.find((l) => l.productId === productId)?.qty ?? 0;

  const detailed = useMemo(
    () =>
      lines
        .map((l) => {
          const product = productById(l.productId);
          return product ? { product, qty: l.qty } : null;
        })
        .filter(Boolean) as { product: Product; qty: number }[],
    [lines]
  );

  const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);
  const total = useMemo(
    () => detailed.reduce((s, d) => s + d.product.price * d.qty, 0),
    [detailed]
  );

  return (
    <CartContext.Provider
      value={{ lines, add, remove, setQty, clear, count, total, detailed, qtyOf }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
}
