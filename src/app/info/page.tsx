import type { Metadata } from "next";
import Image from "next/image";
import { ClockIcon, FacebookIcon, GiftIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, TruckIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { business, deliveryFee, storeMap } from "@/content/business";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Хүргэлт, төлбөр, холбоо барих",
  description: `ANEN: хүргэлт ${formatPrice(business.cityFee)} (${formatPrice(business.freeFrom)}-өөс үнэгүй, 10:00-аас өмнө бол өдөртөө), QPay, солилт, Яармаг Шүншиг вилла 3.`,
  alternates: { canonical: "/info" },
};

function H2({ id, n, children }: { id: string; n: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-40">
      <span className="display block text-[15px] text-rose">{n}</span>
      <span className="display mt-1 block text-[34px] md:text-[46px]">{children}</span>
    </h2>
  );
}

const feeLabel = (id: (typeof business.delivery)[number]["id"]) => {
  const f = deliveryFee(id, 0);
  return f == null ? "Утсаар мэдэгдэнэ" : f === 0 ? "Үнэгүй" : `${formatPrice(f)} · ${formatPrice(business.freeFrom)}-өөс үнэгүй`;
};

export default function InfoPage() {
  return (
    <div className="wrap pt-10 md:pt-14">
      <div className="text-center">
        <p className="rise kicker text-mauve">ANEN · skincare & beauty</p>
        <h1 className="rise display mt-2 text-[44px] md:text-[72px]" style={{ "--d": "100ms" } as React.CSSProperties}>
          Мэдээлэл
        </h1>
        <nav className="rise mt-7 flex flex-wrap justify-center gap-2" aria-label="Хэсгүүд" style={{ "--d": "200ms" } as React.CSSProperties}>
          {[
            ["#delivery", "Хүргэлт"],
            ["#payment", "Төлбөр"],
            ["#exchange", "Солилт"],
            ["#store", "Дэлгүүр"],
          ].map(([h, t]) => (
            <a key={h} href={h} className="chip">
              {t}
            </a>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-16 max-w-3xl space-y-20">
        <Reveal as="section">
          <H2 id="delivery" n="01">
            Хүргэлт
          </H2>
          <ul className="mt-7 grid gap-3">
            {business.delivery.map((d) => (
              <li key={d.id} className="card flex flex-wrap items-start justify-between gap-x-6 gap-y-1 p-5 md:p-6">
                <span className="flex gap-3.5">
                  <TruckIcon size={21} className="mt-0.5 shrink-0 text-rose" />
                  <span>
                    <span className="block font-semibold">{d.name}</span>
                    <span className="block text-[14px] text-ink-2">{d.note}</span>
                  </span>
                </span>
                <span className="pl-9 text-[14px] text-rose md:pl-0">{feeLabel(d.id)}</span>
              </li>
            ))}
          </ul>
          <ul className="prose-soft mt-5">
            <li>{business.rules.delivery}</li>
            <li>{business.rules.deliveryNote}</li>
            <li>{business.rules.express}</li>
          </ul>
        </Reveal>

        <Reveal as="section">
          <H2 id="payment" n="02">
            Төлбөр, и-баримт
          </H2>
          <ul className="prose-soft mt-6">
            <li>
              <b>QPay</b>: аль ч банкны аппаар QR уншуулж төлнө. {business.rules.payment}
            </li>
            <li>{business.rules.ebarimt}</li>
          </ul>
        </Reveal>

        <Reveal as="section">
          <H2 id="exchange" n="03">
            Солилт, буцаалт
          </H2>
          <div className="card mt-6 flex gap-4 p-6">
            <GiftIcon size={24} className="mt-0.5 shrink-0 text-rose" />
            <p className="text-[15px] leading-relaxed text-ink-2">{business.rules.exchange}</p>
          </div>
        </Reveal>

        <Reveal as="section">
          <H2 id="store" n="04">
            Дэлгүүр, холбоо барих
          </H2>
          <p className="mt-5 text-[15.5px] leading-relaxed text-ink-2">
            Манай дэлгүүр {business.since} оноос хойш үйл ажиллагаа явуулж байна. {business.tagline}: {business.values.join(", ").toLowerCase()}.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {[
              { href: storeMap, icon: <PinIcon size={20} />, t: "Хаяг", v: business.address, ext: true },
              { href: storeMap, icon: <ClockIcon size={20} />, t: "Цагийн хуваарь", v: `Өдөр бүр ${business.hours}`, ext: true },
              { href: `tel:${business.phone.tel}`, icon: <PhoneIcon size={20} />, t: "Утас", v: business.phone.display },
              { href: `mailto:${business.email}`, icon: <MailIcon size={20} />, t: "Имэйл", v: business.email },
              { href: business.facebook, icon: <FacebookIcon size={20} />, t: "Facebook", v: "AnEn's shop", ext: true },
              { href: business.instagram, icon: <InstagramIcon size={20} />, t: "Instagram", v: "@anen_online_shop", ext: true },
            ].map((c) => (
              <a key={c.t} href={c.href} {...(c.ext ? { target: "_blank", rel: "noreferrer" } : {})} className="lift card flex gap-4 p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blush text-rose">{c.icon}</span>
                <span className="min-w-0">
                  <span className="kicker block !text-[10px] text-mute">{c.t}</span>
                  <span className="mt-0.5 block text-[14.5px] leading-snug break-words">{c.v}</span>
                </span>
              </a>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Image src="/brand/wreath.png" alt="" width={140} height={125} className="breathe h-24 w-auto opacity-80" />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
