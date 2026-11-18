import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { brands, products } from "@/lib/catalog";

export const metadata: Metadata = { title: "Брэндүүд", alternates: { canonical: "/brands" } };

const cover = (id: string) => products.find((p) => p.brand === id && p.bestseller && p.images.length) ?? products.find((p) => p.brand === id && p.images.length);

export default function BrandsPage() {
  const top = brands.slice(0, 8);
  const az = [...brands].sort((a, b) => a.name.localeCompare(b.name));
  const groups = az.reduce<Record<string, typeof brands>>((g, b) => {
    const k = b.name[0].toUpperCase();
    (g[k] ??= []).push(b);
    return g;
  }, {});
  return (
    <div className="wrap pt-10 md:pt-14">
      <div className="text-center">
        <p className="rise kicker text-mauve">{brands.length} брэнд</p>
        <h1 className="rise display mt-2 text-[44px] md:text-[68px]" style={{ "--d": "100ms" } as React.CSSProperties}>
          Брэндүүд
        </h1>
      </div>

      <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {top.map((b, i) => {
          const c = cover(b.id);
          return (
            <Reveal as="li" key={b.id} delay={(i % 4) * 90}>
              <Link href={`/shop?b=${b.id}`} className="group block text-center">
                <span className="arch zoom block aspect-[3/4] border-[6px] border-white shadow-[0_24px_40px_-30px_rgb(58_38_48/0.6)]">{c && <Image src={c.images[0].thumb.src} alt="" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />}</span>
                <span className="display mt-4 block text-[24px] transition group-hover:text-rose md:text-[28px]">{b.name}</span>
                <span className="text-[12px] tracking-[0.14em] text-mute uppercase">{b.count} бүтээгдэхүүн</span>
              </Link>
            </Reveal>
          );
        })}
      </ul>

      <section className="mt-24" aria-label="А-Я">
        <Reveal className="text-center">
          <p className="kicker text-mauve">A – Z</p>
          <h2 className="display mt-2 text-[34px] md:text-[46px]">Бүх брэнд</h2>
        </Reveal>
        <div className="mt-10 columns-2 gap-8 sm:columns-3 lg:columns-4">
          {Object.entries(groups).map(([letter, list]) => (
            <div key={letter} className="mb-7 break-inside-avoid">
              <p className="display text-[30px] text-rose">{letter}</p>
              <ul className="mt-1 space-y-1">
                {list.map((b) => (
                  <li key={b.id}>
                    <Link href={`/shop?b=${b.id}`} className="group inline-flex items-baseline gap-2 text-[15px] transition hover:text-rose">
                      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0_1px] bg-bottom-left bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">{b.name}</span>
                      <span className="text-[12px] text-mute">{b.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
