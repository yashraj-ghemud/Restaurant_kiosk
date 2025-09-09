import React, { useState } from 'react';

export default function ItemModal({ item, open, onClose, onAdd }) {
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState({}); // modifierId -> boolean

  if (!open || !item) return null;

  const toggle = (id) => setSelected(s => ({ ...s, [id]: !s[id] }));

  const selectedModifiers = (item.modifiers || []).filter(m => selected[m.id]);
  const modifiersCost = selectedModifiers.reduce((s, m) => s + (m.price || 0), 0);
  const totalPrice = (item.price + modifiersCost) * qty;

  const handleAdd = () => {
    const uid = `${item.id}::${Object.keys(selected).filter(k => selected[k]).sort().join('|')}::${Date.now()}`;
    const cartItem = {
      _uid: uid,
      id: item.id,
      name: item.name,
      image: item.image, // include image so OrderCard can use it
      price: item.price,
      qty,
      modifiers: selectedModifiers,
      totalPrice
    };
    onAdd(cartItem);
    onClose();
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md rounded p-4 shadow-lg">
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-semibold">{item.name}</h2>
          <button onClick={onClose} aria-label="Close modal" className="text-gray-600">✕</button>
        </div>
        <div className="mt-3">
          <img src={item.image} alt={item.name} className="w-full h-36 object-cover rounded" />
          <p className="mt-2">Base price: ₹{item.price}</p>

          {item.modifiers && item.modifiers.length > 0 && (
            <div className="mt-3">
              <div className="font-medium">Modifiers</div>
              <div className="flex flex-col gap-2 mt-2">
                {item.modifiers.map(m => (
                  <label key={m.id} className="flex items-center gap-2">
                    <input type="checkbox" checked={!!selected[m.id]} onChange={() => toggle(m.id)} />
                    <span>{m.name} (+₹{m.price})</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center gap-3">
            <label className="sr-only">Quantity</label>
            <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-1 border rounded">-</button>
            <input aria-label="quantity" value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))} className="w-14 text-center border rounded" />
            <button onClick={() => setQty(q => q + 1)} className="px-3 py-1 border rounded">+</button>
            <div className="ml-auto font-semibold">Total: ₹{totalPrice}</div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
            <button onClick={handleAdd} className="px-3 py-1 bg-blue-600 text-white rounded">Add to cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}
