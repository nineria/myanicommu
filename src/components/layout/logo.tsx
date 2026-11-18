import Link from "next/link";
import { cn } from "@/lib/utils";

/** MyAniCommu wordmark (VoiceBox): heavy Archivo Black with "My" in a white outline and "Ani" in a red block, followed by plain "Commu". */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="MyAniCommu"
      className={cn(
        "inline-flex items-center leading-none tracking-[-0.02em] text-foreground uppercase",
        className,
      )}
      style={
        {
          fontFamily: "var(--font-archivo), Impact, sans-serif",
          // horizontal run of the fold over the block height (~22deg like the "A" stroke)
          "--fold": "0.5em",
        } as React.CSSProperties
      }
    >
      {/* "My" outline: a ring (outer trapezoid minus inner one) so the slanted right edge is a true border */}
      <span className="relative pt-[0.073em] pb-[0.055em] pr-[0.44em] pl-[0.16em]">
        <span
          aria-hidden
          className="absolute inset-0 bg-foreground"
          style={{
            clipPath:
              "polygon(evenodd, 0 0, 100% 0, calc(100% - var(--fold)) 100%, 0 100%, 0 0, 0.08em 0.08em, 0.08em calc(100% - 0.08em), calc(100% - var(--fold) * 0.929 - 0.088em) calc(100% - 0.08em), calc(100% - var(--fold) * 0.071 - 0.088em) 0.08em, 0.08em 0.08em)",
          }}
        />
        <span className="relative">My</span>
      </span>
      {/* "Ani" block: left edge follows the same slant, with a hairline gap like a paper fold */}
      <span
        className="bg-primary pt-[0.073em] pb-[0.055em] pr-[0.16em] pl-[0.34em] text-primary-foreground"
        style={{
          marginLeft: "calc(0.06em - var(--fold))",
          clipPath: "polygon(var(--fold) 0, 100% 0, 100% 100%, 0 100%)",
        }}
      >
        Ani
      </span>
      <span className="ml-[0.12em]">Commu</span>
    </Link>
  );
}

export function ResponsiveLogo() {
  return <Logo className="text-lg/none sm:text-xl/none" />;
}
