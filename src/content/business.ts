/**
 * Business facts from anenbeauty.mn (Zochil shop 37746: shop settings, payment / delivery rules, delivery option,
 * terms, About page, home banner) and the Facebook page «AnEn's shop», read on 2026-11-18. Nothing here is invented;
 * where something is missing or unclear it is listed in docs/erxes/MANUAL-STEPS.md.
 */
export const business = {
  name: "anen store",
  brand: "ANEN",
  domain: "anenbeauty.mn",
  tagline: "Таны гоо үзэсгэлэнг эрхэмлэнэ",
  values: ["Итгэлтэй", "Чанартай", "Таны төлөө"],
  /** Zochil About page. */
  since: 2020,
  description: "ANEN skincare & beauty: Солонгос арьс арчилгаа, будалтын жинхэнэ бүтээгдэхүүн. Anua, Torriden, Dr.Althea, Medicube, Tirtir. 10:00-аас өмнөх захиалга өдөртөө хүргэгдэнэ.",
  phone: { display: "9903-8150", tel: "+97699038150" },
  email: "mongolia9272@gmail.com",
  address: "Яармаг, Нүхтийн зам, Шүншиг вилла 3 худалдааны төв, 1 давхарт баруун талд, Fresh хүнсний дэлгүүрийн хажууд",
  hours: "11:00–20:00",
  mapQuery: "Shunshig villa 3 Yarmag Ulaanbaatar",
  facebook: "https://www.facebook.com/profile.php?id=100023497105360",
  instagram: "https://www.instagram.com/anen_online_shop",
  /** Zochil: QPay (qpay2) is the only payment method; payment rule = 100% up front. */
  payments: [{ id: "qpay", name: "QPay", note: "Аль ч банкны аппаар QR уншуулж төлнө" }],
  /** Zochil has no order minimum for this shop. */
  minOrder: 0,
  deliveryMin: 0,
  /** Zochil delivery option «Хүргэлтийн бүх бүс»: 7,000₮, free from 150,000₮ (`delivery_price_limit`). */
  cityFee: 7000,
  freeFrom: 150000,
  delivery: [
    { id: "city", name: "Улаанбаатар · бүх бүс", note: "10:00-аас өмнөх захиалга өдөртөө 14:00–22:00, дараах нь маргааш 14:00–22:00" },
    { id: "express", name: "Шуурхай хүргэлт", note: "2–5 цагийн дотор. Нэмэлт төлбөрийг холбогдож мэдэгдэнэ" },
    { id: "countryside", name: "Орон нутаг", note: "Унаанд тавьж өгнө. Төлбөрийг холбогдож мэдэгдэнэ" },
    { id: "pickup", name: "Дэлгүүрээс очиж авах", note: "Яармаг, Шүншиг вилла 3, 1 давхар · 11:00–20:00" },
  ],
  rules: {
    payment: "Төлбөрөө 100% төлсний дараа захиалга баталгаажиж, бэлтгэгдэн хүргэлтэд гарна.",
    delivery: "Өглөөний 10:00-аас өмнө захиалбал тухайн өдөртөө 14:00–22:00-ийн хооронд хүргэнэ. 10:00-аас хойшхи захиалга дараагийн өдрийн 14:00–22:00-д очно.",
    deliveryNote: "Ажил эсвэл гэрийн хаяг дээр авах бол цагаа тоймлож тайлбар дээр бичээрэй. Цаг заасан хүргэлт боломжгүй.",
    express: "Шуурхай хүргэлт 2–5 цагийн дотор очих бөгөөд нэмэлт төлбөртэй.",
    exchange: "Бүтээгдэхүүн асуудалтай бол 100% сольж өгнө. Харшил үүссэн тохиолдолд буцаалт хийх боломжгүй: хүн бүрийн арьсны онцлог өөр тул эргэлзвэл худалдан авахаасаа өмнө зөвлөгөө аваарай.",
    ebarimt: "И-баримтыг утасны дугаараар тань бүртгэнэ. Байгууллагаар авах бол 7 оронтой регистрийн дугаараа бичнэ үү.",
  },
} as const;

export type DeliveryId = (typeof business.delivery)[number]["id"];
export type PaymentId = (typeof business.payments)[number]["id"];
export const deliveryOption = (id: DeliveryId) => business.delivery.find((d) => d.id === id)!;
export const paymentOption = (id: PaymentId) => business.payments.find((p) => p.id === id)!;
export const storeMap = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(business.mapQuery);

/** City 7,000₮ (free from 150,000₮); express and countryside told by phone (null); pick-up 0. */
export function deliveryFee(id: DeliveryId, subtotal: number): number | null {
  if (id === "pickup") return 0;
  if (id === "countryside" || id === "express") return null;
  return subtotal >= business.freeFrom ? 0 : business.cityFee;
}
