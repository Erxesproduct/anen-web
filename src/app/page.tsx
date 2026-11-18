import Image from "next/image";
import Link from "next/link";
import { ArrowIcon, ClockIcon, DropIcon, GiftIcon, HeartIcon, LeafIcon, PinIcon, ShieldIcon, SparkIcon, SunIcon, TruckIcon } from "@/components/icons";
import { LeafShadows, Petals } from "@/components/petals";
import { Price } from "@/components/price";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { Scroller } from "@/components/scroller";
import { business, storeMap } from "@/content/business";
import { banners, brandName, brands, concerns, discount, getKind, inStock, products, steps, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

const withPhoto = inStock.filter((p) => p.images.length);
const newest = [...withPhoto].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id);
const best = withPhoto.filter((p) => p.bestseller);
const sale = withPhoto.filter((p) => discount(p) > 0).sort((a, b) => discount(b) - discount(a));
const banner = banners[0];
const maxOff = Math.max(...sale.map(discount));
const pickFor = (f: (p: Product) => boolean) => best.find(f) ?? newest.find(f);

const CONCERN_STYLE: Record<string, { icon: React.ReactNode; bg: string }> = {
  calm: { icon: <LeafIcon size={22} />, bg: "linear-gradient(150deg,#eef2ea,#dfe8da)" },
  hydrate: { icon: <DropIcon size={22} />, bg: "linear-gradient(150deg,#eef3f8,#dde8f1)" },
  glow: { icon: <SparkIcon size={22} />, bg: "linear-gradient(150deg,#fbf1e4,#f3e2cb)" },
  firm: { icon: <HeartIcon size={22} />, bg: "linear-gradient(150deg,#fbecef,#f4d7de)" },
  clear: { icon: <ShieldIcon size={22} />, bg: "linear-gradient(150deg,#f3eef6,#e6dcee)" },
  barrier: { icon: <SunIcon size={22} />, bg: "linear-gradient(150deg,#f6efe9,#ece0d4)" },
};

function Heading({ kicker, title, href, link = "Бүгдийг үзэх", center = false }: { kicker: string; title: string; href?: string; link?: string; center?: boolean }) {
  return (
    <Reveal className={`flex flex-wrap items-end gap-4 ${center ? "flex-col items-center text-center" : "justify-between"}`}>
      <div>
        <p className="kicker text-mauve">{kicker}</p>
        <h2 className="display mt-2 text-[36px] md:text-[52px]">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="group inline-flex items-center gap-2 text-[13px] font-semibold tracking-[0.14em] uppercase hover:text-rose">
          {link} <ArrowIcon size={15} className="transition duration-500 group-hover:translate-x-1.5" />
        </Link>
      )}
    </Reveal>
  );
}

function Shelf({ list }: { list: Product[] }) {
  return (
    <Scroller className="scroller mt-8">
      {list.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </Scroller>
  );
}

export default function Home() {
  const float = [best[0], best[1]].filter(Boolean);
  return (
    <>
      {/* hero: the owner's banner in an arch, petals rising, leaf shadows swaying */}
      <section className="relative overflow-hidden">
        <LeafShadows />
        <Petals />
        <div className="wrap relative grid items-center gap-14 pt-12 pb-20 md:pt-20 md:pb-28 lg:grid-cols-[1.05fr_1fr]">
          <div className="text-center lg:text-left">
            <p className="rise ruled text-[11px] font-semibold tracking-[0.34em] text-mauve uppercase">Since {business.since}</p>
            <p className="rise script mt-5 text-[46px] text-mauve md:text-[58px]" style={{ "--d": "120ms" } as React.CSSProperties}>
              skincare & beauty
            </p>
            <h1 className="rise display mt-3 text-[46px] sm:text-[64px] lg:text-[76px]" style={{ "--d": "240ms" } as React.CSSProperties}>
              Таны гоо үзэсгэлэнг <span className="shimmer">эрхэмлэнэ</span>
            </h1>
            <p className="rise mt-5 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11.5px] font-semibold tracking-[0.3em] text-rose uppercase lg:justify-start" style={{ "--d": "360ms" } as React.CSSProperties}>
              {business.values.map((v, i) => (
                <span key={v} className="inline-flex items-center gap-4">
                  {i > 0 && <HeartIcon size={10} className="text-mauve" />}
                  {v}
                </span>
              ))}
            </p>
            <p className="rise mx-auto mt-7 max-w-lg text-[16.5px] leading-relaxed text-ink-2 lg:mx-0" style={{ "--d": "480ms" } as React.CSSProperties}>
              {brands.length} брэндийн Солонгос арьс арчилгаа, будалт: Anua, Torriden, Dr.Althea, Medicube, Tirtir. Арьсныхаа хэрэгцээг сонгоод тохирохоо олоорой.
            </p>
            <div className="rise mt-9 flex flex-wrap justify-center gap-3 lg:justify-start" style={{ "--d": "600ms" } as React.CSSProperties}>
              <Link href="/shop" className="btn btn-rose">
                Дэлгүүр үзэх <ArrowIcon size={16} />
              </Link>
              <a href="#concerns" className="btn btn-line">
                Арьсны хэрэгцээгээр
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[460px]">
            <div className="bloom arch aspect-[5/6] border-[10px] border-white shadow-[0_40px_80px_-50px_rgb(168_17_79/0.55)]">
              {banner && <Image src={banner.src} alt="ANEN skincare & beauty" fill priority sizes="460px" className="object-cover" />}
            </div>
            {float.map((p, i) => (
              <Link
                key={p.id}
                href={`/p/${p.slug}`}
                className={`veil breathe absolute flex w-[170px] items-center sm:w-[190px] gap-3 rounded-2xl p-2.5 pr-4 shadow-[0_20px_40px_-24px_rgb(58_38_48/0.5)] transition hover:scale-[1.03] ${i === 0 ? "top-[10%] left-0 sm:-left-14" : "right-0 -bottom-6 sm:-right-12"}`}
                style={{ animationDelay: `${i * 2.4}s` }}
              >
                <span className="frame relative h-14 w-12 shrink-0 !rounded-xl">
                  <Image src={p.images[0].thumb.src} alt="" fill sizes="48px" className="object-cover" />
                </span>
                <span className="min-w-0">
                  <span className="kicker block truncate !text-[9px] text-mauve">{brandName(p.brand)}</span>
                  <span className="block truncate text-[12.5px] font-medium">{p.name}</span>
                  <Price price={p.price} compareAt={null} size="sm" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* brands, drifting */}
      <section className="overflow-hidden border-y border-line bg-white/50 py-5" aria-label="Брэндүүд">
        <div className="marquee">
          {[0, 1].map((k) => (
            <span key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
              {brands.slice(0, 24).map((b) => (
                <Link key={b.id} href={`/shop?b=${b.id}`} tabIndex={k ? -1 : 0} className="display flex items-center gap-10 px-5 text-[24px] tracking-[0.08em] text-ink/70 transition hover:text-rose md:text-[28px]">
                  {b.name}
                  <LeafIcon size={14} className="text-mauve/60" />
                </Link>
              ))}
            </span>
          ))}
        </div>
      </section>

      {/* skin concerns */}
      <section id="concerns" className="wrap mt-24 scroll-mt-32 md:mt-32" aria-labelledby="concerns-h">
        <Reveal className="text-center">
          <p className="kicker text-mauve">Арьсны хэрэгцээгээр</p>
          <h2 id="concerns-h" className="display mt-2 text-[36px] md:text-[52px]">
            Арьс тань юу хүсэж байна?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] text-ink-2">Нэрс, найрлагаар нь ангилсан. Эргэлзвэл утсаар эсвэл Facebook-оор зөвлөгөө аваарай.</p>
        </Reveal>
        <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {concerns.map((c, i) => {
            const s = CONCERN_STYLE[c.id];
            const faces = withPhoto.filter((p) => p.concerns.includes(c.id) && p.bestseller).concat(withPhoto.filter((p) => p.concerns.includes(c.id))).slice(0, 3);
            return (
              <Reveal as="li" key={c.id} delay={(i % 3) * 110}>
                <Link href={`/shop?c=${c.id}`} className="lift group relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-[28px] p-5 md:min-h-[240px] md:p-7" style={{ background: s.bg }}>
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-white/80 text-rose transition duration-700 group-hover:rotate-[20deg]">{s.icon}</span>
                  <span className="display mt-5 text-[26px] md:text-[32px]">{c.name}</span>
                  <span className="mt-1 text-[13px] text-ink-2">{c.line}</span>
                  <span className="mt-auto flex items-end justify-between gap-2 pt-5">
                    <span className="text-[12px] font-semibold tracking-[0.14em] uppercase">{c.count} бараа</span>
                    <span className="flex -space-x-3">
                      {faces.map((p, k) => (
                        <span key={p.id} className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white transition duration-700 md:h-12 md:w-12" style={{ transitionDelay: `${k * 60}ms` }}>
                          <Image src={p.images[0].thumb.src} alt="" fill sizes="48px" className="object-cover" />
                        </span>
                      ))}
                    </span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </section>

      <section className="wrap mt-24 md:mt-32" aria-label="Их захиалагддаг">
        <Heading kicker="Хамгийн их хайртай" title="Их захиалагддаг" href="/shop?sort=best" />
        <Shelf list={best} />
      </section>

      {/* routine */}
      <section className="relative mt-24 overflow-hidden bg-blush/60 py-20 md:mt-32 md:py-28" aria-labelledby="routine-h">
        <LeafShadows />
        <div className="wrap relative">
          <Reveal className="text-center">
            <p className="script text-[40px] text-mauve">daily ritual</p>
            <h2 id="routine-h" className="display mt-1 text-[36px] md:text-[52px]">
              Арчилгааны алхам
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] text-ink-2">Өглөө, оройн арчилгаагаа алхам алхмаар бүрдүүлээрэй.</p>
          </Reveal>
          <ol className="relative mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            <span className="absolute top-[38%] right-[10%] left-[10%] hidden h-px bg-gradient-to-r from-transparent via-mauve/40 to-transparent lg:block" aria-hidden />
            {steps.slice(0, 5).map((s, i) => {
              const p = pickFor((x) => x.kinds.some((k) => getKind(k)?.step === s.id));
              return (
                <Reveal as="li" key={s.id} delay={i * 120} className="relative text-center">
                  <Link href={`/shop?step=${s.id}`} className="group block">
                    <span className="arch zoom mx-auto block aspect-[3/4] w-full max-w-[200px] border-[6px] border-white shadow-[0_24px_40px_-30px_rgb(58_38_48/0.6)]">
                      {p && <Image src={p.images[0].thumb.src} alt="" fill sizes="200px" className="object-cover" />}
                    </span>
                    <span className="display mt-4 block text-[15px] text-rose">0{i + 1}</span>
                    <span className="display mt-1 block text-[24px] transition group-hover:text-rose">{s.name}</span>
                    <span className="block text-[12.5px] text-ink-2">{s.line}</span>
                  </Link>
                </Reveal>
              );
            })}
          </ol>
          <Reveal className="mt-12 flex flex-wrap justify-center gap-3">
            {steps.slice(5).map((s) => (
              <Link key={s.id} href={`/shop?step=${s.id}`} className="btn btn-line">
                {s.name} <span className="text-mute">{s.count}</span>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* sale */}
      {sale.length > 0 && (
        <section className="wrap mt-24 md:mt-32" aria-label="Хямдрал">
          <Reveal className="relative overflow-hidden rounded-[36px] bg-ink px-6 py-10 text-white md:px-12 md:py-14">
            <Image src="/brand/wreath.png" alt="" width={420} height={374} className="breathe pointer-events-none absolute -right-16 -bottom-20 w-[360px] opacity-[0.14] md:w-[440px]" />
            <p className="kicker text-petal">Хямдралтай</p>
            <p className="display mt-2 text-[44px] md:text-[68px]">
              −{maxOff}% <span className="text-petal">хүртэл</span>
            </p>
            <p className="mt-2 max-w-md text-white/70">{sale.length} бүтээгдэхүүн хямдарсан үнээр. Үлдэгдэл хязгаартай.</p>
            <Link href="/shop?sale=1" className="btn mt-7 bg-white text-ink hover:bg-petal">
              Хямдрал үзэх <ArrowIcon size={16} />
            </Link>
          </Reveal>
          <Shelf list={sale.slice(0, 14)} />
        </section>
      )}

      <section className="wrap mt-20 md:mt-28" aria-label="Шинээр ирсэн">
        <Heading kicker="Шинээр ирсэн" title="Шинэ бүтээгдэхүүн" href="/shop" />
        <Shelf list={newest.slice(0, 14)} />
      </section>

      {/* promises */}
      <section className="wrap mt-24 grid gap-4 md:mt-32 md:grid-cols-3" aria-label="Хүргэлт ба баталгаа">
        {[
          { icon: <ClockIcon size={26} />, title: "Өдөртөө", text: business.rules.delivery },
          { icon: <TruckIcon size={26} />, title: formatPrice(business.cityFee), text: `Улаанбаатарын бүх бүсэд. ${formatPrice(business.freeFrom)}-өөс дээш захиалгад үнэгүй. Шуурхай хүргэлт 2–5 цагт.` },
          { icon: <GiftIcon size={26} />, title: "100% солино", text: business.rules.exchange },
        ].map((c, i) => (
          <Reveal key={c.title} delay={i * 110} className="card p-7 md:p-8">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-blush text-rose">{c.icon}</span>
            <p className="display mt-5 text-[30px]">{c.title}</p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{c.text}</p>
          </Reveal>
        ))}
      </section>

      {/* store */}
      <section className="wrap mt-6" aria-label="Дэлгүүр">
        <Reveal>
          <a href={storeMap} target="_blank" rel="noreferrer" className="lift group relative grid items-center gap-6 overflow-hidden rounded-[32px] bg-gradient-to-br from-blush to-petal/70 p-7 md:grid-cols-[auto_1fr_auto] md:p-10">
            <Image src="/brand/wreath.png" alt="" width={120} height={107} className="h-20 w-auto transition duration-1000 group-hover:rotate-[-8deg] md:h-24" />
            <span>
              <span className="kicker text-rose">Манай дэлгүүр · {business.hours}</span>
              <span className="display mt-2 block text-[28px] md:text-[34px]">Яармаг, Шүншиг вилла 3</span>
              <span className="mt-1 block text-[14.5px] text-ink-2">{business.address}. Ирж үзэж, зөвлөгөө аваарай.</span>
            </span>
            <span className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-[0.14em] text-rose uppercase">
              <PinIcon size={17} /> Газрын зураг
            </span>
          </a>
        </Reveal>
        <p className="sr-only">{products.length} бүтээгдэхүүн</p>
      </section>
    </>
  );
}
