import type { Metadata } from "next";
import Link from "next/link";
import { SearchIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { brandName, brands, concerns, getBrand, getConcern, getKind, getStep, kinds, onSale, products, soldOut, steps, type Product } from "@/lib/catalog";
import { countLabel } from "@/lib/format";

type Search = { q?: string; b?: string; step?: string; k?: string; c?: string; sale?: string; sort?: string; all?: string; page?: string };
const PER_PAGE = 40;

function heading(s: Search) {
  if (s.q) return `«${s.q.slice(0, 60)}»`;
  const parts = [getKind(s.k ?? "")?.name ?? getStep(s.step ?? "")?.name, getBrand(s.b ?? "")?.name, getConcern(s.c ?? "")?.name, s.sale === "1" && "Хямдрал"].filter(Boolean) as string[];
  return parts.length ? parts.join(" · ") : "Бүх бүтээгдэхүүн";
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<Search> }): Promise<Metadata> {
  const s = await searchParams;
  return { title: heading(s), alternates: { canonical: "/shop" }, robots: s.q || s.page ? { index: false } : undefined };
}

const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е").replace(/[^\p{L}\p{N}+%]+/gu, " ").trim();
const haystack = new Map(
  products.map((p) => {
    const text = norm([p.name, p.zochilName, brandName(p.brand), ...p.kinds.map((k) => getKind(k)?.name), ...p.concerns.map((c) => getConcern(c)?.name)].filter(Boolean).join(" "));
    return [p.id, `${text} ${text.replace(/\s+/g, "")}`];
  }),
);

export default async function ShopPage({ searchParams }: { searchParams: Promise<Search> }) {
  const s = await searchParams;
  const q = (s.q ?? "").slice(0, 60);
  const brand = getBrand(s.b ?? "");
  const step = getStep(s.step ?? "");
  const kind = getKind(s.k ?? "");
  const concern = getConcern(s.c ?? "");
  const saleOnly = s.sale === "1";
  const showAll = s.all === "1";
  const sort = s.sort === "cheap" || s.sort === "dear" || s.sort === "best" ? s.sort : "default";

  const words = norm(q).split(" ").filter(Boolean);
  const inStep = (p: Product) => !step || p.kinds.some((k) => getKind(k)?.step === step.id);
  const base = (p: Product) => (!brand || p.brand === brand.id) && inStep(p) && (!kind || p.kinds.includes(kind.id)) && words.every((w) => haystack.get(p.id)!.includes(w));
  const pool = products.filter(base);
  const match = (p: Product) => (!concern || p.concerns.includes(concern.id)) && (!saleOnly || onSale(p));
  let list = pool.filter((p) => match(p) && (showAll || !soldOut(p)));
  if (sort === "cheap") list = [...list].sort((a, b) => a.price - b.price);
  else if (sort === "dear") list = [...list].sort((a, b) => b.price - a.price);
  else if (sort === "best") list = [...list].sort((a, b) => Number(b.bestseller) - Number(a.bestseller));
  else list = [...list].sort((a, b) => Number(!a.images.length) - Number(!b.images.length) || b.createdAt.localeCompare(a.createdAt) || b.id - a.id);
  const hidden = showAll ? 0 : pool.filter((p) => match(p) && soldOut(p)).length;

  const kindList = step ? kinds.filter((k) => k.step === step.id && pool.some((p) => p.kinds.includes(k.id))) : [];
  const concernList = concerns.filter((c) => pool.some((p) => p.concerns.includes(c.id)));

  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const page = Math.min(pages, Math.max(1, Number(s.page) || 1));
  const shown = list.slice(0, page * PER_PAGE);

  const href = (patch: Partial<Search>) => {
    const next = { ...s, ...patch };
    if (!("page" in patch)) delete next.page;
    const qs = new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][]).toString();
    return qs ? `/shop?${qs}` : "/shop";
  };
  const row = "-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0";

  return (
    <div className="wrap pt-10 md:pt-14">
      <div className="text-center">
        <p className="rise kicker text-mauve">{q ? "Хайлтын үр дүн" : "ANEN · skincare & beauty"}</p>
        <h1 className="rise display mt-2 text-[40px] md:text-[64px]" style={{ "--d": "100ms" } as React.CSSProperties}>
          {heading(s)}
        </h1>
        <form action="/shop" role="search" className="rise relative mx-auto mt-7 max-w-xl" style={{ "--d": "200ms" } as React.CSSProperties}>
          {brand && <input type="hidden" name="b" value={brand.id} />}
          {step && <input type="hidden" name="step" value={step.id} />}
          <SearchIcon size={18} className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-mute" />
          <input name="q" type="search" defaultValue={q} placeholder="Anua, sun cream, PDRN…" aria-label="Хайх" className="h-14 w-full rounded-full border border-line bg-white/85 pr-28 pl-12 text-[16px] shadow-[0_18px_40px_-30px_rgb(58_38_48/0.5)] outline-none transition focus:border-mauve" />
          <button className="btn btn-rose absolute top-1/2 right-1.5 h-11 min-h-0 -translate-y-1/2 px-5">Хайх</button>
        </form>
      </div>

      <nav className={`${row} mt-10 md:justify-center`} aria-label="Ангилал">
        <Link href={href({ step: undefined, k: undefined })} className="chip shrink-0" aria-current={!step}>
          Бүгд
        </Link>
        {steps.map((x) => (
          <Link key={x.id} href={href({ step: x.id, k: undefined })} className="chip shrink-0" aria-current={step?.id === x.id}>
            {x.name}
          </Link>
        ))}
      </nav>
      {kindList.length > 1 && (
        <nav className="fade-in mt-3 flex flex-wrap justify-center gap-1.5" aria-label="Төрөл">
          <Link href={href({ k: undefined })} className="chip min-h-8 px-3 text-[12.5px]" aria-current={!kind}>
            Бүх {step!.name.toLowerCase()}
          </Link>
          {kindList.map((k) => (
            <Link key={k.id} href={href({ k: k.id })} className="chip min-h-8 px-3 text-[12.5px]" aria-current={kind?.id === k.id}>
              {k.name}
            </Link>
          ))}
        </nav>
      )}
      <div className={`${row} mt-3 md:justify-center`} aria-label="Арьсны хэрэгцээ">
        {concernList.map((c) => (
          <Link key={c.id} href={href({ c: concern?.id === c.id ? undefined : c.id })} className="chip min-h-8 shrink-0 px-3 text-[12.5px]" aria-current={concern?.id === c.id}>
            {c.name}
          </Link>
        ))}
        <Link href={href({ sale: saleOnly ? undefined : "1" })} className="chip min-h-8 shrink-0 px-3 text-[12.5px] text-rose" aria-current={saleOnly}>
          Хямдрал
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <p className="kicker text-mute">Брэнд</p>
          <ul className="mt-3 max-h-[70vh] space-y-0.5 overflow-y-auto pr-2 text-[14px] [scrollbar-width:thin]">
            <li>
              <Link href={href({ b: undefined })} className={`flex justify-between rounded-xl px-3 py-1.5 transition hover:bg-blush ${!brand ? "bg-blush text-rose" : ""}`}>
                Бүх брэнд <span className="text-mute">{products.length}</span>
              </Link>
            </li>
            {brands.map((b) => (
              <li key={b.id}>
                <Link href={href({ b: brand?.id === b.id ? undefined : b.id })} className={`flex justify-between rounded-xl px-3 py-1.5 transition hover:bg-blush ${brand?.id === b.id ? "bg-blush text-rose" : ""}`}>
                  {b.name} <span className="text-mute">{b.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
        <div>
          <nav className={`${row} lg:hidden`} aria-label="Брэнд">
            <Link href={href({ b: undefined })} className="chip min-h-8 shrink-0 px-3 text-[12.5px]" aria-current={!brand}>
              Бүх брэнд
            </Link>
            {brands.map((b) => (
              <Link key={b.id} href={href({ b: brand?.id === b.id ? undefined : b.id })} className="chip min-h-8 shrink-0 px-3 text-[12.5px]" aria-current={brand?.id === b.id}>
                {b.name}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4 text-[13.5px] lg:mt-0">
            <p>
              {countLabel(list.length, "бүтээгдэхүүн")}
              {hidden > 0 && (
                <>
                  {" · "}
                  <Link href={href({ all: "1" })} className="text-rose underline underline-offset-4">
                    дууссан {hidden}-г харуулах
                  </Link>
                </>
              )}
              {showAll && (
                <>
                  {" · "}
                  <Link href={href({ all: undefined })} className="text-rose underline underline-offset-4">
                    зөвхөн бэлэн байгаа
                  </Link>
                </>
              )}
            </p>
            <div className="flex flex-wrap gap-1.5" aria-label="Эрэмбэ">
              {(
                [
                  ["default", "Шинэ"],
                  ["best", "Их захиалагддаг"],
                  ["cheap", "Хямд"],
                  ["dear", "Үнэтэй"],
                ] as const
              ).map(([id, label]) => (
                <Link key={id} href={href({ sort: id === "default" ? undefined : id })} className="chip min-h-8 px-3 text-[12.5px]" aria-current={sort === id}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {shown.length ? (
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
              {shown.map((p, i) => (
                <li key={p.id} className="fade-in" style={{ animationDelay: `${Math.min(i % PER_PAGE, 12) * 45}ms` }}>
                  <ProductCard p={p} priority={i < 4} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="card mx-auto mt-10 max-w-md p-10 text-center">
              <p className="display text-[32px]">Олдсонгүй</p>
              <p className="mt-2 text-ink-2">Хайсан бүтээгдэхүүн тань дэлгүүрт байж магадгүй: утсаар эсвэл Facebook-оор асуугаарай.</p>
              <Link href="/shop" className="btn btn-rose mt-6">
                Бүх бүтээгдэхүүн
              </Link>
            </div>
          )}

          {page < pages && (
            <div className="mt-14 text-center">
              <Link href={href({ page: String(page + 1) })} scroll={false} className="btn btn-line h-14 px-8">
                Цааш үзэх ({list.length - shown.length})
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
