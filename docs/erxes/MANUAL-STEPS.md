# anen store (ANEN skincare & beauty): erxes manual steps

Owner of every step below: **Terbish**, with anen store for credentials and decisions.

These steps happen inside the erxes 3.0 admin, not in code. The website reads the results through the environment
variables in `.env.example`. Never commit their values.

| Task | Status | What to do in erxes (admin path) |
| --- | --- | --- |
| [1.1] Import products, categories, prices | website done · manual import in erxes | Section 1.1 |
| [1.2] Payment setup (QPay) | website done · manual, blocked on QPay merchant credentials | Section 1.2 |
| [1.3] eBarimt setup | website done · manual, blocked on PosAPI registration + TIN | Section 1.3 |
| [1.4] Delivery zones, fees, order statuses | website done · manual in erxes; express fee to confirm | Section 1.4 |
| [1.5] Test order from cart to receipt | validation verified · real order blocked on erxes env vars + 1.2 + 1.3 | Section 1.5 |

There is no erxes instance for anen store yet ("erxes 3.0: NOT SET"). Create it first, then add the env vars under
**Vercel → anen-web → Settings → Environment Variables**.

---

## 1.1 Import products, categories and prices

Source: anenbeauty.mn (Zochil shop 37746), scraped 2026-11-18: **190 products**, 66 Zochil categories (a «Брэнд» tree
and a «Бүтээгдэхүүний төрөл» tree), the logo, 1 home banner, the About text and the terms. The Facebook page
(«AnEn's shop», profile 100023497105360) gives no content without a login beyond its name and profile photo.

The website imports **189 products**. «Innisfree No-Sebum Mineral Powder» (id 981363) is priced **0₮** on Zochil
and is left out.

- **Brands:** 51, from the Zochil brand categories and, for the 62 products that have none, from the start of the
  name (Klavuu, Jayjun, Isntree, Etude, Catrice…). Every product has a brand.
- **Types:** 22 Zochil product types, grouped into 7 routine steps (Цэвэрлэх, Тэнцвэржүүлэх, Тэжээх, Чийгшүүлэх,
  Хамгаалах, Будалт, Үс/бие/сэт). 14 products had no type on Zochil; the build guessed it from the name
  (shampoo → hair, mask, set → travel set, cream…).
- **Skin concerns** (website filter only): Тайвшруулах, Чийгшүүлэх, Гэрэлтүүлэх, Уян чанар, Батга/нүх сүв, Хамгаалах
  давхарга, read from names and descriptions (cica, hyaluronic, vitamin C, collagen/PDRN/retinol, azelaic/BHA,
  ceramide). 31 products match none.
- **Names:** ALL-CAPS Zochil names are written in Title Case, brand names unified (Dr.Althea, Dr.Jart+, Round Lab),
  shade numbers shortened (Catrice «…Foundation №20»). The original name is kept in the CSV column `zochilName`.
- **Prices:** 53 products are on sale on Zochil (sale price is the price, the old price is `compareAtPrice`).

Files:

- `docs/erxes/anen-categories.csv`: **30 rows**, parent `AN`, steps `AN-<step>`, types `AN-<type>`.
- `docs/erxes/anen-products.csv`: **189 rows**, code `AN-<zochilId>`, name, main type category, other type categories,
  price, old price, brand, concerns, stock, status, bestseller flag, the Zochil name, description, photo paths.

Steps:

1. **Products & services → Categories**: import `anen-categories.csv` (parents first: it is already ordered).
2. **Settings → Import & Export → Import → Products**: upload `anen-products.csv`. Map `code → Code`,
   `name → Name`, `categoryCode → Category code`, `unitPrice → Unit price`, `type → Type`, `uom → UOM`,
   `description → Description`. Add the brand as a tag or a custom field. Keep the codes: the website and
   `npm run sync:erxes` match on them.
3. **Inventories → Remainders**: Zochil stock, 1,736 units; **28 products are sold out** (hidden on the site by
   default) and 1 («Torriden travel set») is not tracked.
4. Upload the photos (`public/images/p/*.webp`) on the products. **«Laneige travel set» has no photo** on Zochil (the
   site shows an «ANEN» placeholder).
5. Run `npm run sync:erxes` once with a Client Portal token (`ERXES_APP_TOKEN`) to confirm the codes match (it also
   refreshes `src/data/lite.json`, which the cart reads).

## 1.2 Payment setup (QPay)

Zochil: QPay (`qpay2`, Khan Bank) is the shop's only payment method and is connected (`has_qpay: true`). Payment rule:
the order is confirmed only after 100% payment. erxes 3.0 has a QPay payment kind
(`backend/plugins/payment_api/src/constants.ts`).

1. Get anen store's QPay merchant credentials (`client_id`, `client_secret`, `invoice_code`); ask QPay / Zochil
   whether the existing merchant can be used outside Zochil. Owner: Terbish / anen store.
2. **Settings → Payments → Add → QPay**: enter them. **Settings → Payments → (QPay) → Test**: a 100₮ invoice.
3. **Sales → Pipelines → «Вэбсайт» → Settings → Payments**: select QPay.

Website (done): checkout offers **QPay** only, validated on the server (bank transfer, StorePay and anything else are
rejected). The browser's prices are ignored; the server prices every line from the catalog.

## 1.3 eBarimt setup

Zochil has no eBarimt setting for this shop (`vat_enabled` is off on every product).

1. Collect from anen store: company TIN, district code (СБД), VAT status, product classification code (cosmetics).
2. Register for **PosAPI 3.0** (ebarimt.mn → Business → PosAPI) and install the PosAPI service.
3. **Settings → eBarimt → Add**: PosAPI URL, TIN, district code, VAT switches; assign it to the website pipeline.

Website (done): checkout asks «Хувь хүн» or «Байгууллага»; a company needs a 7-digit registry number, validated on the
server; the order message carries it.
