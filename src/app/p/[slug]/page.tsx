import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/buy-box";
import { Gallery } from "@/components/gallery";
import { ChatIcon, GiftIcon, TruckIcon } from "@/components/icons";
import { Price } from "@/components/price";
import { ProductCard } from "@/components/product-card";
import { Scroller } from "@/components/scroller";
import { business } from "@/content/business";
import { brandName, discount, getConcern, getKind, getProduct, inStock, products, sku, soldOut, stepOf } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { absoluteUrl } from "@/lib/site-url";

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const description = `${p.name}: ${formatPrice(p.price)}. ${p.details[0]?.x ?? ""} ${business.rules.delivery}`.slice(0, 300);
  const img = p.images[0];
  return { title: p.name, description, alternates: { canonical: `/p/${p.slug}` }, openGraph: { title: p.name, description, images: img ? [{ url: img.src, width: img.w, height: img.h }] : undefined } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const out = soldOut(p);
  const off = discount(p);
  const kind = getKind(p.kinds[0]);
  const shared = (x: typeof p) => x.concerns.filter((c) => p.concerns.includes(c)).length;
  const pairs = inStock
    .filter((x) => x.id !== p.id && x.images.length && stepOf(x) !== stepOf(p) && shared(x) > 0)
    .sort((a, b) => shared(b) - shared(a) || Number(b.bestseller) - Number(a.bestseller))
    .slice(0, 12);
  const sameBrand = inStock.filter((x) => x.id !== p.id && x.images.length && x.brand === p.brand && !pairs.includes(x)).slice(0, 12);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: sku(p),
    brand: { "@type": "Brand", name: brandName(p.brand) },
    image: p.images.map((m) => absoluteUrl(m.src)),
    category: kind?.name,
    offers: { "@type": "Offer", priceCurrency: "MNT", price: p.price, availability: out ? "https://schema.org/OutOfStock" : "https://schema.org/InStock", url: absoluteUrl(`/p/${p.slug}`) },
  };

  return (
    <div className="wrap pt-6 md:pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav className="flex flex-wrap items-center gap-2 text-[12.5px] text-mute" aria-label="Зам">
        <Link href="/" className="hover:text-rose">
          Нүүр
        </Link>
        <span aria-hidden>·</span>
        {kind && (
          <>
            <Link href={`/shop?step=${kind.step}&k=${kind.id}`} className="hover:text-rose">
              {kind.name}
            </Link>
            <span aria-hidden>·</span>
          </>
        )}
        <Link href={`/shop?b=${p.brand}`} className="hover:text-rose">
          {brandName(p.brand)}
        </Link>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div className="rise relative lg:sticky lg:top-36 lg:self-start">
          <Gallery images={p.images} name={p.name} />
          {off > 0 && !out && <span className="bloom absolute top-6 right-6 grid h-16 w-16 place-items-center rounded-full bg-rose font-display text-[18px] text-white shadow-lg">−{off}%</span>}
        </div>

        <div className="rise lg:pt-4" style={{ "--d": "150ms" } as React.CSSProperties}>
          <Link href={`/shop?b=${p.brand}`} className="kicker text-mauve hover:text-rose">
            {brandName(p.brand)}
          </Link>
          <h1 className="display mt-3 text-[34px] md:text-[46px]">{p.name}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Price price={p.price} compareAt={p.compareAt} size="lg" />
            {p.bestseller && <span className="tag bg-blush text-rose-deep">♥ Их захиалагддаг</span>}
          </div>
          {(p.concerns.length > 0 || p.kinds.length > 0) && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {p.kinds.map((k) => (
                <Link key={k} href={`/shop?step=${getKind(k)?.step}&k=${k}`} className="chip min-h-8 px-3 text-[12.5px]">
                  {getKind(k)?.name}
                </Link>
              ))}
              {p.concerns.map((c) => (
                <Link key={c} href={`/shop?c=${c}`} className="chip min-h-8 border-transparent bg-blush px-3 text-[12.5px] text-rose-deep">
                  {getConcern(c)?.name}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-7">
            <BuyBox slug={p.slug} />
          </div>
          {p.stock != null && p.stock > 0 && p.stock < 4 && <p className="mt-3 text-[13px] text-rose">Цөөхөн үлдсэн: {p.stock} ширхэг</p>}

          <ul className="mt-7 grid gap-2.5 text-[14px]">
            <li className="flex gap-3.5 rounded-3xl bg-white/70 p-4">
              <TruckIcon size={21} className="mt-0.5 shrink-0 text-rose" />
              <span className="text-ink-2">
                {business.rules.delivery} {formatPrice(business.cityFee)}, {formatPrice(business.freeFrom)}-өөс дээш үнэгүй.{" "}
                <Link href="/info#delivery" className="text-rose underline underline-offset-4">
                  Дэлгэрэнгүй
                </Link>
              </span>
            </li>
            <li className="flex gap-3.5 rounded-3xl bg-white/70 p-4">
              <GiftIcon size={21} className="mt-0.5 shrink-0 text-rose" />
              <span className="text-ink-2">{business.rules.exchange}</span>
            </li>
            <li className="flex gap-3.5 rounded-3xl bg-white/70 p-4">
              <ChatIcon size={21} className="mt-0.5 shrink-0 text-rose" />
              <span className="text-ink-2">
                Арьсандаа тохирох эсэхийг асуух бол{" "}
                <a href={business.facebook} target="_blank" rel="noreferrer" className="text-rose underline underline-offset-4">
                  Facebook
                </a>{" "}
                эсвэл{" "}
                <a href={`tel:${business.phone.tel}`} className="whitespace-nowrap text-ink">
                  {business.phone.display}
                </a>
              </span>
            </li>
          </ul>

          {p.details.length > 0 && (
            <section className="prose-soft mt-10" aria-label="Тайлбар">
              <h2 className="display text-[26px]">Тайлбар</h2>
              {p.details.map((b, i) => (b.t === "li" ? <li key={i}>{b.x}</li> : <p key={i}>{b.x}</p>))}
            </section>
          )}
          <dl className="mt-10 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 border-t border-line pt-5 text-[13px]">
            <dt className="text-mute">Брэнд</dt>
            <dd>{brandName(p.brand)}</dd>
            {kind && (
              <>
                <dt className="text-mute">Төрөл</dt>
                <dd>{p.kinds.map((k) => getKind(k)?.name).join(", ")}</dd>
              </>
            )}
            <dt className="text-mute">Код</dt>
            <dd>{sku(p)}</dd>
          </dl>
        </div>
      </div>

      {pairs.length > 0 && (
        <section className="mt-28" aria-label="Хослуулах">
          <p className="script text-[36px] text-mauve">perfect pair</p>
          <h2 className="display mt-1 text-[32px] md:text-[44px]">Хамт хэрэглэхэд</h2>
          <Scroller className="scroller mt-7">
            {pairs.map((x) => (
              <ProductCard key={x.id} p={x} />
            ))}
          </Scroller>
        </section>
      )}
      {sameBrand.length > 0 && (
        <section className="mt-20" aria-label="Ижил брэнд">
          <p className="kicker text-mauve">{brandName(p.brand)}</p>
          <h2 className="display mt-2 text-[32px] md:text-[44px]">Энэ брэндээс</h2>
          <Scroller className="scroller mt-7">
            {sameBrand.map((x) => (
              <ProductCard key={x.id} p={x} />
            ))}
          </Scroller>
        </section>
      )}
    </div>
  );
}
