# anen-web

Storefront for **anen store** (ANEN skincare & beauty, anenbeauty.mn, Zochil shop 37746): Korean skincare and makeup.
Next.js 16 (App Router), Tailwind 4, static product pages, orders to erxes 3.0.

- 189 products, 51 brands, 7 routine steps, 6 skin-concern filters
- «Soft Bloom» look from the shop's banner: heart wreath, leaf shadows, rising petals, slow fade-ups
- Cart and checkout: QPay, Ulaanbaatar 7,000₮ (free from 150,000₮), express, countryside, pick-up
- `/api/orders` validates on the server and sends the order to erxes (`widgetsSaveLead`)

```bash
npm install
npm run dev            # http://localhost:3000
npm run lint && npm run typecheck && npm run build
npm run test:order -- http://localhost:3000          # order API checks
npm run test:order -- https://<url> --send           # + one real test order (needs erxes env vars)
npm run sync:erxes                                   # check product codes / prices against erxes
```

Environment variables: see `.env.example` (never commit values). erxes admin steps and open questions:
[`docs/erxes/MANUAL-STEPS.md`](docs/erxes/MANUAL-STEPS.md).
