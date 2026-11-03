# AGENTS.md

- The Supabase backend is managed outside Lovable: never create, delete or edit anything in `supabase/migrations/` or `supabase/functions/`, and never change the database, RLS policies or SQL functions. If a backend change is needed, write it in `docs/pedido-bd.md` and stop. Why: the backend has its own owner and deploy process.
- The client never sends prices, totals or payment status, and never writes to `orders` or `order_items` directly. Why: those are server-authoritative.
- Sale rules (delivery fee, totals, stock, closed season, valid states) live in `src/lib/pricing.ts`, mirrored by the server copy in `supabase/functions/_shared/pricing.ts` (read-only for us); a test fails if they differ — request server changes via `docs/pedido-bd.md`. Why: the shop and the payment server must compute the same totals.
- Checkout is a quote request: the client only sends contact, address, optional slot/notes, items (productId, quantity, state) and an empty `website` honeypot to `submit-order` (body built in `src/lib/quote-request.ts`); the cart is cleared only on `{ok:true}`. Why: Marisca sells on quote and client prices can be tampered with.
- Only the Stripe webhook (signature-verified or re-fetched from Stripe) marks orders paid and decrements stock, guarded by `payment_status != 'paid'`. Why: idempotency and no client-side payment trust.
- Server data is fetched with React Query hooks (`use-products`, `use-admin-data`); the cart stores snapshots but always prices/blocks against the live catalog. Why: one cache, no stale prices.
- Public pages (catalog, product page, order page, modals) never show prices or "€"; they show `PRICE_ON_QUOTE` from `src/lib/catalog.ts` — a test scans those files. The public catalog is a category-grouped list in `src/components/catalog/` whose quantity controls write straight to the cart. Why: Marisca sells on quote (price set after weighing).
- Order status labels/colors/flow live in `src/lib/order-status.ts`; reports in `src/lib/admin-reports.ts`; admin sections are separate components in `src/components/admin/`.
- Colors only via semantic tokens in `src/index.css`; the `cta` Button variant is the only use of the accent color. Why: brand rule (accent reserved for CTAs) and AA contrast.
- Tests: `npm test` (vitest), next to the code as `*.test.ts`.
