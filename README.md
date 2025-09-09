# Restaurant Kiosk (Frontend) — Hack Studio Track 2

## Summary
A PWA-enabled frontend for a self-serve restaurant ordering kiosk and a kitchen dashboard. Built with React + Vite + Tailwind. Backend simulated using `json-server`. Supports offline cart, offline order outbox and sync, responsive layouts (kiosk/tablet/phone).

## Tech
- React + Vite
- Tailwind CSS
- json-server (mock API)
- axios
- vite-plugin-pwa (optional for offline caching)

## How to run locally
1. Install: `npm install`
2. Start mock API: `npm run start:api` (runs at http://localhost:3001)
3. Start frontend: `npm run dev` (open printed URL, e.g. http://localhost:5173)

## Endpoints (mock)
- `GET /menu` — returns menu items
- `GET /orders` — returns orders
- `POST /orders` — place order
- `PATCH /orders/:id` — update order status

## Offline behavior
- Menu cached in `localStorage.rk_cached_menu` (and via Service Worker if PWA enabled).
- Cart persisted in `localStorage.rk_cart_v1`.
- When placing order offline, order saved to `localStorage.rk_outbox_v1`. Use **Sync** button to push pending orders when online.

## Demo steps (record this)
1. Browse menu, customize and place an order.
2. Open Dashboard → you will see the new order appear (polling).
3. Change status to Preparing → Ready → Completed.
4. Demonstrate offline: go offline, place order (saved to outbox), go online, click Sync.

## Notes
- To switch from JSON server to MSW (mock worker), replace API calls with MSW handlers (not included here).
- For production, replace json-server with a real backend and add authentication.

