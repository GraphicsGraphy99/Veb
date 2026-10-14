import { useCallback, useEffect, useMemo, useState } from "react";
import { services } from "../data/services.js";

const STORAGE_KEY = "freshfold_cart_v1";
export const MAX_QUANTITY = 99;

// Reads the saved cart safely: bad/old data is ignored instead of crashing the app.
function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item) =>
          services.some((service) => service.id === item?.id) &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0
      )
      .map((item) => ({ id: item.id, quantity: Math.min(item.quantity, MAX_QUANTITY) }));
  } catch {
    return [];
  }
}

export function useCart() {
  // Only { id, quantity } is stored. Prices always come from services.js.
  const [entries, setEntries] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      /* storage full or blocked – the cart still works in memory */
    }
  }, [entries]);

  const addItem = useCallback((id, quantity = 1) => {
    setEntries((prev) => {
      const existing = prev.find((entry) => entry.id === id);
      if (existing) {
        return prev.map((entry) =>
          entry.id === id ? { ...entry, quantity: Math.min(entry.quantity + quantity, MAX_QUANTITY) } : entry
        );
      }
      return [...prev, { id, quantity: Math.min(quantity, MAX_QUANTITY) }];
    });
  }, []);

  const setQuantity = useCallback((id, quantity) => {
    setEntries((prev) =>
      quantity <= 0
        ? prev.filter((entry) => entry.id !== id)
        : prev.map((entry) => (entry.id === id ? { ...entry, quantity: Math.min(quantity, MAX_QUANTITY) } : entry))
    );
  }, []);

  const removeItem = useCallback((id) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const clearCart = useCallback(() => setEntries([]), []);

  const items = useMemo(
    () =>
      entries.map((entry) => {
        const service = services.find((s) => s.id === entry.id);
        return { ...service, quantity: entry.quantity, subtotal: service.price * entry.quantity };
      }),
    [entries]
  );

  const total = useMemo(() => items.reduce((sum, item) => sum + item.subtotal, 0), [items]);
  const count = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  return { items, total, count, addItem, setQuantity, removeItem, clearCart };
}
