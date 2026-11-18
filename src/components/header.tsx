import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { formatPrice } from "@/lib/format";
import { CartLink } from "./cart-link";
import { HeartIcon, SearchIcon } from "./icons";
import { Scroller } from "./scroller";

const ribbon = [`${business.rules.delivery.split(".")[0]}`, `${formatPrice(business.freeFrom)}-өөс дээш хүргэлт үнэгүй`, "Солонгос арьс арчилгааны жинхэнэ бүтээгдэхүүн", `Дэлгүүр: Яармаг, Шүншиг вилла 3 · ${business.hours}`];

export const NAV = [
  ["/shop", "Бүх бараа"],
  ["/shop?step=treat", "Серум, ампуль"],
  ["/shop?step=protect", "Нарны тос"],
  ["/shop?step=makeup", "Будалт"],
  ["/shop?sale=1", "Хямдрал"],
  ["/brands", "Брэнд"],
  ["/info", "Мэдээлэл"],
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40">
      <div className="overflow-hidden bg-ink py-2 text-white/90" aria-label="Мэдээлэл">
        <div className="marquee">
          {[0, 1].map((k) => (
            <span key={k} className="flex shrink-0" aria-hidden={k === 1}>
              {ribbon.map((t) => (
                <span key={t} className="flex items-center gap-8 px-8 text-[11.5px] font-medium tracking-[0.12em]">
                  {t}
                  <HeartIcon size={11} className="text-mauve" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <div className="border-b border-line/70 bg-porcelain/80 backdrop-blur-xl">
        <div className="wrap flex h-[68px] items-center gap-4 md:h-[78px] md:gap-8">
          <Link href="/" aria-label={`${business.name}: нүүр`} className="group flex shrink-0 items-center gap-2.5">
            <Image src="/brand/wreath.png" alt="" width={46} height={41} priority className="h-9 w-auto transition duration-700 group-hover:scale-110 group-hover:-rotate-6 md:h-10" />
            <span className="leading-none">
              <span className="display block text-[24px] tracking-[0.18em] text-rose md:text-[27px]">ANEN</span>
              <span className="mt-0.5 block text-[9.5px] font-medium tracking-[0.3em] text-mute uppercase">skincare & beauty</span>
            </span>
          </Link>
          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="Үндсэн цэс">
            {NAV.map(([href, label]) => (
              <Link key={href} href={href} className={`group relative px-2.5 py-2 text-[13.5px] font-medium whitespace-nowrap transition hover:text-rose ${label === "Хямдрал" ? "text-rose" : ""}`}>
                {label}
                <span className="absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-rose transition duration-500 group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>
          <form action="/shop" role="search" className="relative ml-auto hidden md:block lg:ml-0">
            <SearchIcon size={16} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-mute" />
            <input name="q" type="search" placeholder="Брэнд, бүтээгдэхүүн" aria-label="Хайх" className="h-10 w-44 rounded-full border border-line bg-white/80 pr-3 pl-10 text-[13.5px] outline-none transition placeholder:text-mute focus:w-56 xl:w-52 focus:border-mauve" />
          </form>
          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <Link href="/shop" className="grid h-11 w-11 place-items-center rounded-full md:hidden" aria-label="Хайх">
              <SearchIcon size={20} />
            </Link>
            <CartLink />
          </div>
        </div>
        <div className="wrap lg:hidden">
          <Scroller as="nav" label="Үндсэн цэс" small className="flex gap-1 overflow-x-auto pb-2.5 select-none [scrollbar-width:none]">
            {NAV.map(([href, label]) => (
              <Link key={href} href={href} className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] font-medium ${label === "Хямдрал" ? "text-rose" : ""}`}>
                {label}
              </Link>
            ))}
          </Scroller>
        </div>
      </div>
    </header>
  );
}
