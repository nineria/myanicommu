import type { SVGProps } from "react";

export type OrigamiIcon = (props: {
  size?: number;
  className?: string;
}) => React.JSX.Element;

/*
 * Paper-fold icons: every shape is built from flat facets, one lit (white) and
 * one in shade (white at lower opacity), so it reads as folded paper on any
 * coloured background. Marks are cut out in a translucent dark.
 */
const MARK = "rgb(0 0 0 / 0.38)";

function Svg({
  size = 24,
  className,
  children,
}: { size?: number; className?: string; children: React.ReactNode } & Omit<
  SVGProps<SVGSVGElement>,
  "children"
>) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: decorative, hidden from assistive tech
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

/** Paper plane: announcement / info. */
export const OrigamiPlane: OrigamiIcon = (p) => (
  <Svg {...p}>
    <polygon points="2,11 22,2 10,14" fill="white" />
    <polygon points="22,2 14,22 10,14" fill="white" fillOpacity="0.72" />
    <polygon points="10,14 14,22 11.5,17" fill="white" fillOpacity="0.45" />
  </Svg>
);

/** Folded triangle with an exclamation mark: danger. */
export const OrigamiWarning: OrigamiIcon = (p) => (
  <Svg {...p}>
    <polygon points="12,2 1.5,21 12,21" fill="white" />
    <polygon points="12,2 22.5,21 12,21" fill="white" fillOpacity="0.72" />
    <rect x="11" y="8" width="2" height="7" rx="0.6" fill={MARK} />
    <rect x="11" y="16.5" width="2" height="2" rx="0.6" fill={MARK} />
  </Svg>
);

/** Folded diamond with a check: success. */
export const OrigamiCheck: OrigamiIcon = (p) => (
  <Svg {...p}>
    <polygon points="12,1 1,12 12,23" fill="white" />
    <polygon points="12,1 23,12 12,23" fill="white" fillOpacity="0.72" />
    <polyline
      points="7.5,12.5 11,16 17,9"
      fill="none"
      stroke={MARK}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </Svg>
);
