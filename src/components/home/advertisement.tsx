import Link from "next/link";
import { ADVERTISEMENTS } from "@/lib/constants";

export function Advertisement() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {ADVERTISEMENTS.map((ad) => (
        <Link
          key={ad.href}
          href={ad.href}
          className="group relative block overflow-hidden rounded-2xl border bg-card"
        >
          {/* biome-ignore lint/performance/noImgElement: remote animated gif banners */}
          <img
            src={ad.image.src}
            alt={ad.image.alt}
            loading="lazy"
            className="w-full transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <span className="absolute top-2 right-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] text-white backdrop-blur">
            โฆษณา
          </span>
        </Link>
      ))}
    </div>
  );
}
