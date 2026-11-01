# AGENTS.md

- Sale rules (delivery fee, totals, stock, closed season, valid states) live in `src/lib/pricing.ts`, with an identical copy in `supabase/functions/_shared/pricing.ts`; keep both in sync — a test fails if they differ. Why: the shop and the payment server must compute the same totals.
- The client only sends product id, quantity and state to `create-payment`; prices, stock and closed season are always read server-side. Why: client prices can be tampered with.
- Only the Stripe webhook (signature-verified or re-fetched from Stripe) marks orders paid and decrements stock, guarded by `payment_status != 'paid'`. Why: idempotency and no client-side payment trust.
- `PaymentSuccess` reads order state via the read-only `order-status` function and clears the cart only when paid. Why: guests have no RLS access and the cart must survive cancelled payments.
- Server data is fetched with React Query hooks (`use-products`, `use-admin-data`); the cart stores snapshots but always prices/blocks against the live catalog. Why: one cache, no stale prices.
- Order status labels/colors/flow live in `src/lib/order-status.ts`; reports in `src/lib/admin-reports.ts`; admin sections are separate components in `src/components/admin/`.
- Colors only via semantic tokens in `src/index.css`; the `cta` Button variant is the only use of the accent color. Why: brand rule (accent reserved for CTAs) and AA contrast.
- Tests: `npm test` (vitest), next to the code as `*.test.ts`.
