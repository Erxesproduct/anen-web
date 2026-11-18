"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { business, deliveryFee, deliveryOption, type DeliveryId, type PaymentId } from "@/content/business";
import { cart, cartSubtotal, maxQty, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { resolveLine } from "@/lib/lite";
import type { OrderErrors } from "@/lib/orders/schema";
import { BasketIcon, ChatIcon, CheckIcon, HeartIcon, MinusIcon, PhoneIcon, PlusIcon, TrashIcon } from "./icons";

type Done = { reference: string; subtotal: number; total: number; deliveryFee: number | null; delivery: DeliveryId; payment: PaymentId; lines: { name: string; qty: number; total: number }[] };

const field = "mt-1.5 w-full rounded-2xl border border-line bg-white px-4 py-3 text-[15.5px] outline-none transition duration-300 focus:border-mauve focus:ring-4 focus:ring-petal/60 aria-invalid:border-rose aria-invalid:bg-rose/5";
const feeText = (fee: number | null) => (fee == null ? "Утсаар" : fee === 0 ? "Үнэгүй" : formatPrice(fee));

export function Checkout() {
  const items = useCart();
  const [delivery, setDelivery] = useState<DeliveryId>("city");
  const payment: PaymentId = "qpay";
  const [receiptType, setReceiptType] = useState<"person" | "company">("person");
  const [errors, setErrors] = useState<OrderErrors>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);

  const lines = items.flatMap((i) => {
    const l = resolveLine(i.slug, i.opt);
    return l ? [{ ...i, line: l }] : [];
  });
  const subtotal = cartSubtotal(items);
  const fee = deliveryFee(delivery, subtotal);
  const total = subtotal + (fee ?? 0);
  const toFree = delivery === "city" && subtotal < business.freeFrom ? business.freeFrom - subtotal : 0;

  if (done) return <Receipt done={done} />;

  if (!lines.length)
    return (
      <div className="card mx-auto max-w-lg px-8 py-14 text-center">
        <span className="breathe mx-auto grid h-20 w-20 place-items-center rounded-full bg-blush text-rose">
          <BasketIcon size={32} />
        </span>
        <p className="display mt-6 text-[34px]">Сагс хоосон байна</p>
        <p className="mt-2 text-[15px] text-mute">Арьсандаа тохирох арчилгаагаа сонгоорой.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/#concerns" className="btn btn-rose">
            Арьсны хэрэгцээгээр
          </Link>
          <Link href="/shop" className="btn btn-line">
            Бүх бараа
          </Link>
        </div>
      </div>
    );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setNotice(null);
    setErrors({});
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"),
          phone: f.get("phone"),
          email: f.get("email"),
          delivery,
          address: f.get("address") ?? "",
          payment,
          receiptType,
          regNo: f.get("regNo") ?? "",
          note: f.get("note"),
          website: f.get("website"),
          items: items.map(({ slug, opt, qty }) => ({ slug, opt, qty })),
        }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        setDone({
          reference: json.reference,
          subtotal: json.subtotal ?? subtotal,
          total: json.total ?? total,
          deliveryFee: json.deliveryFee === undefined ? fee : json.deliveryFee,
          delivery,
          payment,
          lines: lines.map((l) => ({ name: l.line.product.n, qty: l.qty, total: l.line.price * l.qty })),
        });
        cart.clear();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (res.status === 422 && json?.errors) {
        setErrors(json.errors);
        setNotice("Мэдээллээ шалгаад дахин оролдоно уу.");
      } else if (json?.error === "not_configured") {
        setNotice(`Онлайн захиалгын систем тохируулагдаж байна. Захиалгаа ${business.phone.display} дугаарт эсвэл Facebook-оор өгнө үү (лавлах код ${json.reference}, нийт ${formatPrice(json.total ?? total)}).`);
      } else {
        setNotice(`Захиалга илгээхэд алдаа гарлаа. Дахин оролдох эсвэл ${business.phone.display} дугаарт залгана уу.`);
      }
    } catch {
      setNotice("Интернэт холболтоо шалгаад дахин оролдоно уу.");
    } finally {
      setBusy(false);
    }
  }

  const err = (k: keyof OrderErrors) => errors[k] && <p className="mt-1.5 text-[13.5px] font-medium text-rose">{errors[k]}</p>;
  const step = (n: number, t: string) => (
    <h2 className="flex items-center gap-3.5">
      <span className="display grid h-10 w-10 place-items-center rounded-full border border-petal text-[18px] text-rose">{n}</span>
      <span className="display text-[26px]">{t}</span>
    </h2>
  );
  const radio = (on: boolean) => <span className={`mt-1 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border transition ${on ? "border-rose" : "border-ink/25"}`}>{on && <span className="bloom h-2.5 w-2.5 rounded-full bg-rose" />}</span>;
  const option = "flex items-start gap-3 rounded-2xl border border-line bg-white p-4 text-left transition duration-300 hover:border-mauve aria-checked:border-rose aria-checked:bg-blush/50";

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
      <div className="space-y-5">
        <section className="card overflow-hidden">
          <ul className="divide-y divide-line">
            {lines.map(({ slug, opt, qty, line }) => (
              <li key={slug} className="flex gap-4 p-4 md:p-5">
                <Link href={`/p/${slug}`} className="frame relative h-24 w-20 shrink-0 bg-blush">
                  {line.product.t ? <Image src={line.product.t} alt="" fill sizes="80px" className="object-cover" /> : null}
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="kicker !text-[10px] text-mauve">{line.product.b}</span>
                  <Link href={`/p/${slug}`} className="mt-0.5 line-clamp-2 leading-snug font-medium hover:text-rose">
                    {line.product.n}
                  </Link>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                    <div className="flex items-center rounded-full border border-line">
                      <button type="button" onClick={() => cart.setQty(slug, opt, qty - 1)} className="grid h-9 w-9 place-items-center rounded-full hover:text-rose" aria-label="Цөөлөх">
                        <MinusIcon size={14} />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                      <button type="button" onClick={() => cart.setQty(slug, opt, qty + 1)} disabled={qty >= maxQty(slug, opt)} className="grid h-9 w-9 place-items-center rounded-full hover:text-rose disabled:opacity-30" aria-label="Нэмэх">
                        <PlusIcon size={14} />
                      </button>
                    </div>
                    <span className="font-display text-[19px]">{formatPrice(line.price * qty)}</span>
                    <button type="button" onClick={() => cart.setQty(slug, opt, 0)} className="grid h-9 w-9 place-items-center rounded-full text-mute hover:bg-blush hover:text-rose" aria-label={`${line.product.n}: хасах`}>
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-5 md:p-8">
          {step(1, "Захиалагч")}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="text-[13.5px] font-semibold">
              Нэр
              <input name="name" autoComplete="name" required aria-invalid={!!errors.name} className={field} />
              {err("name")}
            </label>
            <label className="text-[13.5px] font-semibold">
              Утас
              <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="99112233" required aria-invalid={!!errors.phone} className={field} />
              {err("phone")}
            </label>
            <label className="text-[13.5px] font-semibold sm:col-span-2">
              Имэйл <span className="font-normal text-mute">(заавал биш)</span>
              <input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} className={field} />
              {err("email")}
            </label>
          </div>
          <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        </section>

        <section className="card p-5 md:p-8">
          {step(2, "Хүргэлт")}
          <div className="mt-6 grid gap-2.5" role="radiogroup" aria-label="Хүргэлт">
            {business.delivery.map((d) => (
              <button key={d.id} type="button" role="radio" aria-checked={delivery === d.id} onClick={() => setDelivery(d.id)} className={option}>
                {radio(delivery === d.id)}
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3 font-semibold">
                    {d.name}
                    <span className="text-[14px] text-rose">{feeText(deliveryFee(d.id, subtotal))}</span>
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-ink-2">{d.note}</span>
                </span>
              </button>
            ))}
          </div>
          {toFree > 0 && (
            <p className="fade-in mt-3 flex items-center gap-2 rounded-2xl bg-blush px-4 py-3 text-[13.5px] text-rose-deep">
              <HeartIcon size={15} /> Дахиад {formatPrice(toFree)}-ийн бараа нэмбэл хүргэлт үнэгүй.
            </p>
          )}
          {err("delivery")}
          {delivery !== "pickup" && (
            <label className="mt-5 block text-[13.5px] font-semibold">
              {delivery === "countryside" ? "Аймаг, сум, унааны мэдээлэл" : "Хаяг"}
              <textarea name="address" rows={2} required aria-invalid={!!errors.address} placeholder={delivery === "countryside" ? "Аймаг, сум, хүлээн авах хүн, унааны дугаар" : "Дүүрэг, хороо, байр, орц, давхар, тоот"} className={field} />
              {err("address")}
            </label>
          )}
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink-2">{delivery === "pickup" ? `${business.address}. ${business.hours}. Захиалга бэлэн болмогц утсаар мэдэгдэнэ.` : delivery === "express" ? business.rules.express : `${business.rules.delivery} ${business.rules.deliveryNote}`}</p>
        </section>

        <section className="card p-5 md:p-8">
          {step(3, "Төлбөр, и-баримт")}
          <div className="mt-6 grid gap-2.5" role="radiogroup" aria-label="Төлбөрийн хэлбэр">
            {business.payments.map((m) => (
              <div key={m.id} role="radio" aria-checked className={option}>
                {radio(true)}
                <span>
                  <span className="block font-semibold">{m.name}</span>
                  <span className="block text-[13px] leading-snug text-ink-2">{m.note}</span>
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[13.5px] text-ink-2">{business.rules.payment}</p>
          {err("payment")}
          <div className="mt-6 flex gap-2" role="radiogroup" aria-label="И-баримтын төрөл">
            {(
              [
                ["person", "Хувь хүн"],
                ["company", "Байгууллага"],
              ] as const
            ).map(([id, label]) => (
              <button key={id} type="button" role="radio" aria-checked={receiptType === id} onClick={() => setReceiptType(id)} className="chip">
                {label}
              </button>
            ))}
          </div>
          {receiptType === "company" ? (
            <label className="mt-4 block text-[13.5px] font-semibold">
              Байгууллагын регистр
              <input name="regNo" inputMode="numeric" maxLength={7} placeholder="1234567" aria-invalid={!!errors.regNo} className={field} />
              {err("regNo")}
            </label>
          ) : (
            <p className="mt-3 text-[13.5px] text-mute">И-баримтыг таны утасны дугаараар бүртгэнэ.</p>
          )}
          <label className="mt-5 block text-[13.5px] font-semibold">
            Нэмэлт тайлбар <span className="font-normal text-mute">(хүлээн авах цаг, арьсны онцлог гэх мэт)</span>
            <textarea name="note" rows={2} className={field} />
          </label>
        </section>
      </div>

      <aside className="lg:sticky lg:top-36 lg:self-start">
        <div className="relative overflow-hidden rounded-[32px] bg-ink p-6 text-white md:p-8">
          <Image src="/brand/wreath.png" alt="" width={220} height={196} className="breathe pointer-events-none absolute -top-10 -right-12 w-52 opacity-[0.12]" />
          <h2 className="display relative text-[32px]">Төлөх дүн</h2>
          <dl className="relative mt-6 space-y-3 text-[15px]">
            <div className="flex justify-between gap-4">
              <dt className="text-white/65">Барааны дүн</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/65">{deliveryOption(delivery).name}</dt>
              <dd>{feeText(fee)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-white/15 pt-4">
              <dt className="kicker text-white/80">Нийт</dt>
              <dd className="font-display text-[36px] text-petal">{formatPrice(total)}</dd>
            </div>
          </dl>
          {fee == null && <p className="relative mt-3 text-[12.5px] text-white/60">Хүргэлтийн төлбөрийг холбогдож мэдэгдэнэ.</p>}
          {notice && (
            <p role="alert" className="fade-in relative mt-4 rounded-2xl bg-white px-4 py-3 text-[14px] font-medium text-ink">
              {notice}
            </p>
          )}
          {errors.items && <p className="relative mt-3 rounded-2xl bg-rose px-3 py-2 text-[14px] font-medium">{errors.items}</p>}
          <button type="submit" disabled={busy} className="btn btn-rose relative mt-6 h-14 w-full disabled:cursor-not-allowed disabled:opacity-60">
            {busy ? "Илгээж байна…" : "Захиалга өгөх"}
          </button>
          <div className="relative mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13.5px] text-white/80">
            <a href={`tel:${business.phone.tel}`} className="inline-flex items-center gap-2 hover:text-petal">
              <PhoneIcon size={15} /> {business.phone.display}
            </a>
            <a href={business.facebook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-petal">
              <ChatIcon size={15} /> Facebook
            </a>
          </div>
        </div>
      </aside>
    </form>
  );
}

function Receipt({ done }: { done: Done }) {
  const option = deliveryOption(done.delivery);
  return (
    <div className="mx-auto max-w-lg">
      <div className="card rise overflow-hidden">
        <div className="relative overflow-hidden bg-blush p-8 text-center">
          <Image src="/brand/wreath.png" alt="" width={120} height={107} className="bloom mx-auto h-24 w-auto" />
          <h2 className="display mt-4 text-[36px]">Баярлалаа!</h2>
          <p className="mt-1 text-ink-2">
            Захиалгын дугаар: <b className="text-rose">{done.reference}</b>
          </p>
        </div>
        <div className="p-8">
          <ul className="space-y-2 text-[14.5px]">
            {done.lines.map((l) => (
              <li key={l.name} className="flex justify-between gap-4">
                <span className="text-ink-2">
                  {l.name} × {l.qty}
                </span>
                <span className="shrink-0">{formatPrice(l.total)}</span>
              </li>
            ))}
            <li className="flex justify-between gap-4">
              <span className="text-ink-2">{option.name}</span>
              <span className="shrink-0">{feeText(done.deliveryFee)}</span>
            </li>
            <li className="flex justify-between gap-4 border-t border-line pt-3 font-display text-[22px]">
              <span>Нийт</span>
              <span>{formatPrice(done.total)}</span>
            </li>
          </ul>
          <p className="mt-6 flex gap-3 text-[14.5px] leading-relaxed text-ink-2">
            <CheckIcon size={20} className="mt-0.5 shrink-0 text-rose" />
            <span>
              QPay-ийн нэхэмжлэлийг таны утас руу илгээнэ. {business.rules.payment} {done.delivery === "pickup" ? "" : business.rules.delivery} {business.rules.ebarimt}
            </span>
          </p>
          <Link href="/" className="btn btn-ink mt-7">
            Нүүр хуудас
          </Link>
        </div>
      </div>
    </div>
  );
}
