import data from "@/data/lite.json";

/** Slim product record for client components: s slug, n name, p price, o price before discount, k stock, t thumbnail (null = no photo), b brand name. */
export type Lite = { s: string; n: string; p: number; o: number | null; k: number | null; t: string | null; b: string };

export const liteProducts = data as Lite[];
const bySlug = new Map(liteProducts.map((p) => [p.s, p]));

export const getLite = (slug: string) => bySlug.get(slug);

/** Same rules as the server's resolveLine (no options in this shop). */
export function resolveLine(slug: string, opt: string | null) {
  const product = bySlug.get(slug);
  if (!product || opt) return null;
  return { product, opt: null, price: product.p, stock: product.k };
}
