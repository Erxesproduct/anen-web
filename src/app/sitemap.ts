import type { MetadataRoute } from "next";
import { brands, catalogUpdatedAt, products, steps } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(catalogUpdatedAt);
  return [
    { url: absoluteUrl("/"), lastModified, priority: 1 },
    { url: absoluteUrl("/shop"), lastModified, priority: 0.8 },
    { url: absoluteUrl("/brands"), lastModified, priority: 0.7 },
    ...steps.map((s) => ({ url: absoluteUrl(`/shop?step=${s.id}`), lastModified, priority: 0.7 })),
    ...brands.map((b) => ({ url: absoluteUrl(`/shop?b=${b.id}`), lastModified, priority: 0.6 })),
    ...products.map((p) => ({ url: absoluteUrl(`/p/${p.slug}`), lastModified, priority: 0.7 })),
    { url: absoluteUrl("/info"), lastModified, priority: 0.5 },
  ];
}
