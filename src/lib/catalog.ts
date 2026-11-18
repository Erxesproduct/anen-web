import data from "@/data/catalog.json";

export type Img = { src: string; w: number; h: number };
export type Photo = Img & { thumb: Img };
export type Block = { t: "p" | "li"; x: string };

export type Product = {
  /** Zochil product id (erxes code AN-<id>, old-URL redirects). */
  id: number;
  slug: string;
  name: string;
  /** The name exactly as on Zochil. */
  zochilName: string;
  brand: string;
  /** Product types (Zochil «Бүтээгдэхүүний төрөл»), e.g. serum, sun, cushion. */
  kinds: string[];
  /** Skin concerns read from the name and description. */
  concerns: string[];
  price: number;
  compareAt: number | null;
  stock: number | null;
  bestseller: boolean;
  featured: boolean;
  createdAt: string;
  details: Block[];
  images: Photo[];
};

export type Brand = { id: string; name: string; count: number };
export type Kind = { id: string; name: string; step: string; count: number };
export type Step = { id: string; name: string; line: string; count: number };
export type Concern = { id: string; name: string; line: string; count: number };

export const products = data.products as Product[];
export const brands = data.brands as Brand[];
export const kinds = data.kinds as Kind[];
export const steps = data.steps as Step[];
export const concerns = data.concerns as Concern[];
export const excluded = data.excluded as { id: number; name: string; price: number }[];
export const banners = data.banners as (Img & { href: string | null })[];
export const catalogUpdatedAt = data.updatedAt;

const bySlug = new Map(products.map((p) => [p.slug, p]));
export const getProduct = (slug: string) => bySlug.get(slug);
export const getBrand = (id: string) => brands.find((b) => b.id === id);
export const getKind = (id: string) => kinds.find((k) => k.id === id);
export const getStep = (id: string) => steps.find((s) => s.id === id);
export const getConcern = (id: string) => concerns.find((c) => c.id === id);
export const brandName = (id: string) => getBrand(id)?.name ?? "";
export const stepOf = (p: Product) => getKind(p.kinds[0])?.step ?? "care";

export const soldOut = (p: { stock: number | null }) => p.stock === 0;
export const onSale = (p: Pick<Product, "price" | "compareAt">) => p.compareAt != null && p.compareAt > p.price;
export const discount = (p: Pick<Product, "price" | "compareAt">) => (onSale(p) ? Math.round((1 - p.price / p.compareAt!) * 100) : 0);
export const inStock = products.filter((p) => !soldOut(p));

/** erxes product code: AN-<zochil id>. */
export const sku = (p: Pick<Product, "id">) => `AN-${p.id}`;

/** The product a cart line points at (server side). anen products have no options, so `opt` is always null. */
export function resolveLine(slug: string, opt: string | null) {
  const product = getProduct(slug);
  if (!product || opt) return null;
  return { product, opt: null, price: product.price, stock: product.stock };
}
