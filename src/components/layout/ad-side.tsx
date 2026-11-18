import Image from "next/image";
import Link from "next/link";

/** Decorative side banners, only on very wide screens (as before). */
export function AdSide() {
  const banner = (side: "left" | "right") => (
    <Link
      href="/"
      className={`absolute top-0 hidden h-[480px] w-[160px] xl:block ${side === "left" ? "left-0" : "right-0"}`}
    >
      <Image
        src="/image/AD_02.png"
        alt="AD"
        width={180}
        height={480}
        className="size-full object-cover"
      />
    </Link>
  );
  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 mx-auto w-[1260px] max-w-full">
      <div className="pointer-events-auto relative">
        {banner("left")}
        {banner("right")}
      </div>
    </div>
  );
}
