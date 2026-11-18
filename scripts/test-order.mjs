/**
 * End-to-end check of the website order flow (cart → /api/orders → erxes).
 *
 *   node scripts/test-order.mjs [baseUrl] [--send]
 *
 * Without --send it only runs the validation cases (no order reaches erxes).
 * With --send it also places ONE real test order, marked «ТЕСТ ЗАХИАЛГА: устгана уу» in the note.
 * Exit code 1 if any check fails.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const base = (args.find((a) => !a.startsWith("--")) ?? "http://localhost:3000").replace(/\/$/, "");
const send = args.includes("--send");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(await readFile(path.join(root, "src", "data", "catalog.json"), "utf8"));
const P = catalog.products;
// Zochil rules (shop 37746): no order minimum; Ulaanbaatar 7,000₮, free from 150,000₮; express (2–5 h) and countryside
// fee told by phone (null); pick-up at the store (0); QPay only, paid 100% up front.
const FEE = 7000;
const FREE = 150000;
const ok = (p, n) => p.stock == null || p.stock >= n;
const item = (p, qty) => ({ slug: p.slug, opt: null, qty });

const cheap = [...P].filter((p) => ok(p, 3)).sort((a, b) => a.price - b.price)[0];
const mid = P.find((p) => ok(p, 3) && p.price >= 30000 && p.price <= 60000 && p !== cheap);
const forFree = P.find((p) => ok(p, 3) && p.price * 3 >= FREE && p.price * 3 < FREE + 60000);
const scarce = P.find((p) => p.stock != null && p.stock >= 1 && p.stock <= 3);
const soldout = P.find((p) => p.stock === 0);

const order = {
  name: "Тест Захиалагч",
  phone: "99112233",
  delivery: "city",
  address: "Хан-Уул дүүрэг, Яармаг, тест хаяг, 1 тоот",
  payment: "qpay",
  receiptType: "person",
  note: "ТЕСТ ЗАХИАЛГА: устгана уу",
  items: [item(mid, 1), item(cheap, 1)],
};
const SUBTOTAL = mid.price + cheap.price;

async function post(body) {
  const res = await fetch(`${base}/api/orders`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return { status: res.status, json: await res.json().catch(() => null) };
}

const valid = (r) => !r.json?.errors && (r.status === 200 || r.status === 503);
const rejects = (field) => (r) => r.status === 422 && !!r.json?.errors?.[field];
const total = (expected, fee) => (r) => valid(r) && r.json?.total === expected && (fee === undefined || r.json?.deliveryFee === fee);

const cases = [
  ["empty cart is rejected", { ...order, items: [] }, rejects("items")],
  ["unknown product is ignored (then empty)", { ...order, items: [{ slug: "no-such-product", opt: null, qty: 1 }] }, rejects("items")],
  ["an option on a product without options is rejected", { ...order, items: [{ ...item(mid, 1), opt: "Улаан" }] }, rejects("items")],
  ...(soldout ? [[`sold-out product is not orderable (${soldout.slug})`, { ...order, items: [item(soldout, 1)] }, rejects("items")]] : []),
  ...(scarce ? [[`more than the stock is rejected (${scarce.slug}: ${scarce.stock})`, { ...order, items: [item(scarce, scarce.stock + 1)] }, rejects("items")]] : []),
  [`no order minimum: one ${cheap.price}₮ item passes`, { ...order, items: [item(cheap, 1)] }, total(cheap.price + FEE, FEE)],
  [`city ${SUBTOTAL}₮ + ${FEE}₮ delivery`, order, total(SUBTOTAL + FEE, FEE)],
  ...(forFree ? [[`city from ${FREE}₮ is free (${forFree.slug} × 3)`, { ...order, items: [item(forFree, 3)] }, total(forFree.price * 3, 0)]] : []),
  ["express: fee by phone (null, not in total)", { ...order, delivery: "express" }, total(SUBTOTAL, null)],
  ["countryside: fee by phone (null, not in total)", { ...order, delivery: "countryside", address: "Дархан-Уул, Дархан сум, унаагаар" }, total(SUBTOTAL, null)],
  ["pick-up: no fee, no address", { ...order, delivery: "pickup", address: "" }, total(SUBTOTAL, 0)],
  ["address is required for city delivery", { ...order, address: "" }, rejects("address")],
  ["address is required for express delivery", { ...order, delivery: "express", address: "" }, rejects("address")],
  ["countryside needs an address", { ...order, delivery: "countryside", address: "" }, rejects("address")],
  ["QPay is accepted", order, valid],
  ["bank transfer is not offered", { ...order, payment: "transfer" }, rejects("payment")],
  ["unknown payment is rejected", { ...order, payment: "cash" }, rejects("payment")],
  ["unknown delivery option is rejected", { ...order, delivery: "drone" }, rejects("delivery")],
  ["company eBarimt needs a 7-digit registry number", { ...order, receiptType: "company", regNo: "12" }, rejects("regNo")],
  ["company eBarimt with a valid registry number passes", { ...order, receiptType: "company", regNo: "1234567" }, valid],
  ["bad phone is rejected", { ...order, phone: "123" }, rejects("phone")],
  ["+976 phone prefix is accepted", { ...order, phone: "+976 9911 2233" }, valid],
  ["bad email is rejected", { ...order, email: "not-an-email" }, rejects("email")],
  ["quantity over 10 is ignored", { ...order, items: [item(cheap, 11)] }, rejects("items")],
  ["the browser's price is ignored", { ...order, items: order.items.map((i) => ({ ...i, price: 1 })) }, total(SUBTOTAL + FEE)],
  ["honeypot is silently accepted", { ...order, website: "spam" }, (r) => r.status === 200 && r.json?.ok === true],
];

let failed = 0;
console.log(`Order API checks against ${base}\n`);
for (const [label, body, check] of cases) {
  const r = await post(body);
  const pass = check(r);
  if (!pass) failed++;
  console.log(`${pass ? "✓" : "✗"} ${label}  (${r.status}${r.json?.errors ? " " + Object.keys(r.json.errors).join(",") : ""}${r.json?.total != null ? " total " + r.json.total : ""})`);
}

if (send) {
  const r = await post(order);
  if (r.status === 200 && r.json?.ok) {
    console.log(`\n✓ test order delivered to erxes: ${r.json.reference}, total ${r.json.total}₮ (expected ${SUBTOTAL + FEE})`);
    if (r.json.total !== SUBTOTAL + FEE) {
      failed++;
      console.log("✗ unexpected total");
    }
  } else if (r.status === 503 && r.json?.error === "not_configured") {
    console.log(`\n– test order NOT sent: erxes env vars are not set on ${base} (reference ${r.json.reference}). See .env.example.`);
  } else {
    failed++;
    console.log(`\n✗ test order failed: ${r.status} ${JSON.stringify(r.json)}`);
  }
}

console.log(failed ? `\n${failed} check(s) failed` : `\nall ${cases.length} checks passed`);
process.exit(failed ? 1 : 0);
