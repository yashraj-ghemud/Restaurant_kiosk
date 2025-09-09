import { useEffect, useState } from 'react';
import api from '../api/api';

const CART_KEY = 'rk_cart_v1';
const OUTBOX_KEY = 'rk_outbox_v1';

export default function useCart() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
  });
  const [outboxCount, setOutboxCount] = useState(() => {
    try { return JSON.parse(localStorage.getItem(OUTBOX_KEY) || '[]').length; } catch { return 0; }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (cartItem) => {
    setCart(prev => {
      // if same id + modifiers -> merge quantity
      const idx = prev.findIndex(i => i._uid === cartItem._uid);
      if (idx >= 0) {
        const next = [...prev];
        next[idx].qty += cartItem.qty;
        return next;
      }
      return [...prev, cartItem];
    });
  };

  const updateQty = (uid, qty) => {
    setCart(prev => prev.map(i => i._uid === uid ? {...i, qty} : i));
  };

  const removeItem = (uid) => {
    setCart(prev => prev.filter(i => i._uid !== uid));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async (orderPayload) => {
    try {
      const res = await api.post('/orders', orderPayload);
      return { ok: true, data: res.data };
    } catch (err) {
      // offline -> push to outbox in localStorage
      const outbox = JSON.parse(localStorage.getItem(OUTBOX_KEY) || '[]');
      outbox.push({ ...orderPayload, _tempId: Date.now() });
      localStorage.setItem(OUTBOX_KEY, JSON.stringify(outbox));
      setOutboxCount(outbox.length);
      return { ok: false, offline: true };
    }
  };

  const syncOutbox = async () => {
    const outbox = JSON.parse(localStorage.getItem(OUTBOX_KEY) || '[]');
    const remaining = [];
    for (const o of outbox) {
      try {
        await api.post('/orders', o);
      } catch (e) {
        remaining.push(o);
      }
    }
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(remaining));
    setOutboxCount(remaining.length);
    return remaining.length === 0;
  };

  return { cart, addToCart, updateQty, removeItem, clearCart, placeOrder, syncOutbox, outboxCount };
}
