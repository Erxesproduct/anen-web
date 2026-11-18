import Image from "next/image";
import Link from "next/link";
import { business, storeMap } from "@/content/business";
import { ClockIcon, FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon } from "./icons";
import { NAV } from "./header";

export function Footer() {
  const cards = [
    { href: `tel:${business.phone.tel}`, icon: <PhoneIcon size={20} />, label: "Утас", value: business.phone.display },
    { href: `mailto:${business.email}`, icon: <MailIcon size={20} />, label: "Имэйл", value: business.email },
    { href: storeMap, icon: <PinIcon size={20} />, label: "Дэлгүүр", value: "Яармаг, Шүншиг вилла 3, 1 давхар", ext: true },
    { href: "/info#store", icon: <ClockIcon size={20} />, label: "Цагийн хуваарь", value: `Өдөр бүр ${business.hours}` },
  ];
  return (
    <footer className="relative mt-32 overflow-hidden bg-blush/70">
      <div className="wrap relative pt-16 pb-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Image src="/brand/wreath.png" alt="" width={64} height={57} className="h-14 w-auto" />
              <span>
                <span className="display block text-[34px] leading-none tracking-[0.18em] text-rose">ANEN</span>
                <span className="mt-1 block text-[10px] tracking-[0.32em] text-mute uppercase">skincare & beauty</span>
              </span>
            </Link>
            <p className="mt-6 max-w-sm text-[14.5px] leading-relaxed text-ink-2">
              {business.since} оноос хойш Солонгос арьс арчилгаа, будалтын жинхэнэ бүтээгдэхүүнийг танд хүргэж байна. {business.tagline}.
            </p>
            <div className="mt-6 flex gap-2">
              <a href={business.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink transition duration-500 hover:-translate-y-1 hover:bg-rose hover:text-white">
                <FacebookIcon size={19} />
              </a>
              <a href={business.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink transition duration-500 hover:-translate-y-1 hover:bg-rose hover:text-white">
                <InstagramIcon size={19} />
              </a>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {cards.map((c) => (
              <a key={c.label} href={c.href} {...(c.ext ? { target: "_blank", rel: "noreferrer" } : {})} className="lift flex items-center gap-4 rounded-3xl bg-white/80 p-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blush text-rose">{c.icon}</span>
                <span className="min-w-0">
                  <span className="kicker block !text-[10px] text-mute">{c.label}</span>
                  <span className="mt-0.5 block truncate text-[14.5px] font-medium">{c.value}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
        <nav className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-petal pt-6 text-[13.5px] text-ink-2" aria-label="Доод цэс">
          {NAV.map(([href, label]) => (
            <Link key={href} href={href} className="hover:text-rose">
              {label}
            </Link>
          ))}
          <Link href="/cart" className="hover:text-rose">
            Сагс
          </Link>
        </nav>
        <p className="mt-6 text-[12px] text-mute">
          © {new Date().getFullYear()} {business.name} · {business.domain}
        </p>
      </div>
    </footer>
  );
}
