export const SITE_NAME = "MyAniCommu";
export const DEFAULT_TITLE = "ยินดีต้อนรับสู่ MyAniCommu!";
export const DEFAULT_DESCRIPTION =
  "รวมพลคนรักอนิเมะ พูดคุยแลกเปลี่ยนความรู้เกี่ยวกับ อนิเมะ มังงะ ไลท์โนเวล และอื่นๆ อีกมากมาย!";

export const ADMIN_RANK_LABEL = "ผู้ดูแลระบบ";

export type TagValue = { label: string; colorFrom: string; colorTo: string };

/** Post tags - the first selected tag decides the post "kind" (news/review/Q&A). */
export const POST_TAGS: TagValue[] = [
  { label: "คำถาม", colorFrom: "indigo", colorTo: "cyan" },
  { label: "สปอย", colorFrom: "red", colorTo: "red" },
  { label: "รีวิว", colorFrom: "teal", colorTo: "lime" },
  { label: "ข่าวสาร", colorFrom: "orange", colorTo: "red" },
  { label: "ปัญหา", colorFrom: "#000000", colorTo: "#434343" },
];

/**
 * User ranks an admin can hand out. Grouped: starter -> contributor -> specialist -> staff -> legend.
 * `label` is the identity (unique per user), so renaming one does not migrate existing rows.
 */
export const RANKS: TagValue[] = [
  // starter
  { label: "มือใหม่หัดดู", colorFrom: "#6B7280", colorTo: "#4B5563" },
  { label: "โอตาคุตัวยง", colorFrom: "#8B5CF6", colorTo: "#6D28D9" },
  // contributor
  { label: "นักเขียนรีวิวมือหนึ่ง", colorFrom: "#237A57", colorTo: "#093028" },
  { label: "นักข่าวสายด่วน", colorFrom: "#F97316", colorTo: "#DC2626" },
  { label: "ผู้ตอบคำถามดีเด่น", colorFrom: "#4C6EF5", colorTo: "#15AABF" },
  { label: "ศิลปินแฟนอาร์ต", colorFrom: "#EC4899", colorTo: "#F59E0B" },
  // specialist
  { label: "เซียนอนิเมะ", colorFrom: "#0EA5E9", colorTo: "#1E3A8A" },
  { label: "นักล่ามังงะ", colorFrom: "#14B8A6", colorTo: "#0F766E" },
  { label: "ผู้กล้าแห่งชุมชน", colorFrom: "#393E46", colorTo: "#111827" },
  // supporters & staff
  { label: "ผู้สนับสนุน", colorFrom: "#E1D89F", colorTo: "#D89216" },
  { label: "ผู้ช่วยดูแล", colorFrom: "#2563EB", colorTo: "#1D4ED8" },
  { label: ADMIN_RANK_LABEL, colorFrom: "#FF004D", colorTo: "#9D0B28" },
  // legend
  { label: "ตำนานแห่งชุมชน", colorFrom: "#FDE047", colorTo: "#B45309" },
];

export const DEFAULT_RANK: TagValue = {
  label: "มือใหม่หัดดู",
  colorFrom: "#6B7280",
  colorTo: "#4B5563",
};

export const KIND_BY_TAG: Record<string, "NEWS" | "REVIEW" | "QNA"> = {
  ข่าวสาร: "NEWS",
  รีวิว: "REVIEW",
  คำถาม: "QNA",
};

export const KIND_WATERMARK: Record<string, string> = {
  QNA: "QUESTION",
  REVIEW: "REVIEW",
  NEWS: "NEWS",
  GENERAL: "OTHER",
};

export const REPORT_REASONS = [
  { key: "inappropriateUsername", label: "ชื่อผู้ใช้ไม่เหมาะสม" },
  { key: "inappropriateVerbUse", label: "ใช้วาจาไม่เหมาะสม / ทัศนคติเชิงลบ" },
  { key: "advertisement", label: "โฆษณาขายของ / การสแปมข้อความ" },
  { key: "hateSpeech", label: "สร้างความเกลียดชัง" },
  { key: "contentGotUpdated", label: "เนื้อหามีการเปลี่ยนแปลง" },
] as const;

export const RESERVED_USERNAMES = new Set([
  "posts",
  "news",
  "reviews",
  "qandas",
  "search",
  "setting",
  "faq",
  "sign-in",
  "sign-up",
  "external-link",
  "api",
  "admin",
  "_next",
]);

export const USERNAME_REGEX =
  /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

export const NAV_LINKS = [
  { name: "โพสต์ใหม่", path: "/posts" },
  { name: "ข่าวสาร", path: "/news" },
  { name: "รีวิว", path: "/reviews" },
  { name: "Q&A", path: "/qandas" },
  { name: "ค้นหา", path: "/search" },
];

export const ACCENT_THEMES = [
  { value: "red", label: "ROSE", color: "#ec5555" },
  { value: "ocean", label: "Ocean Blue", color: "#3282B8" },
  { value: "pinky", label: "Just pink!", color: "#ff5d8d" },
  { value: "neon", label: "Neon", color: "#00adb5" },
] as const;
