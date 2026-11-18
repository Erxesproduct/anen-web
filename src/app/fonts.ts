import { Forum, Great_Vibes, Raleway } from "next/font/google";

/** Engraved capitals like the ANEN wordmark (has Ө Ү). */
export const display = Forum({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: "400", variable: "--nf-display", display: "swap" });
/** Airy reading face (has Ө Ү). */
export const sans = Raleway({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["400", "500", "600", "700"], variable: "--nf-sans", display: "swap" });
/** Script for Latin flourishes only («skincare & beauty»); it has no Mongolian letters. */
export const script = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--nf-script", display: "swap" });
