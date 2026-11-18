import Image from "next/image";
import Link from "next/link";

/** Decorative side banners, only on very wide screens. */
export function AdSide() {
  const banner = (side: "left" | "right") => (
    <Link
      href="/"
      tabIndex={-1}
      aria-hidden
      className={`absolute top-0 hidden h-[480px] w-[160px] overflow-hidden rounded-2xl opacity-90 transition-opacity hover:opacity-100 min-[1500px]:block ${side === "left" ? "left-0" : "right-0"}`}
    >
      <Image
        src="/image/AD_02.png"
        alt=""
        width={180}
        height={480}
        className="size-full object-cover"
      />
    </Link>
  );
  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 mx-auto w-[1360px] max-w-full">
      <div className="pointer-events-auto relative">
        {banner("left")}
        {banner("right")}
      </div>
    </div>
  );
}
