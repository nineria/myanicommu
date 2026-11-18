import Link from "next/link";
import { ADVERTISEMENTS } from "@/lib/constants";

export function Advertisement() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {ADVERTISEMENTS.map((ad) => (
        <Link key={ad.href} href={ad.href}>
          {/* biome-ignore lint/performance/noImgElement: remote animated gif banners */}
          <img
            src={ad.image.src}
            alt={ad.image.alt}
            className="w-full cursor-pointer rounded-md"
          />
        </Link>
      ))}
    </div>
  );
}
