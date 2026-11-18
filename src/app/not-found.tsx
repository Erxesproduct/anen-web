import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap grid place-items-center py-24 text-center">
      <Image src="/brand/wreath.png" alt="" width={160} height={142} className="bloom h-28 w-auto" />
      <p className="display mt-6 text-[44px] md:text-[60px]">Хуудас олдсонгүй</p>
      <p className="mt-2 text-ink-2">Холбоос өөрчлөгдсөн байж магадгүй.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-rose">
          Нүүр хуудас
        </Link>
        <Link href="/shop" className="btn btn-line">
          Бүх бүтээгдэхүүн
        </Link>
      </div>
    </div>
  );
}
