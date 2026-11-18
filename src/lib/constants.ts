export const SITE_NAME = "MyAnimeCommunity";
export const DEFAULT_TITLE = "ยินดีต้อนรับสู่ My Anime Community!";
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

export const RANKS: TagValue[] = [
  { label: "ผู้กล้า", colorFrom: "#393E46", colorTo: "#393E46" },
  { label: "นายทุน", colorFrom: "#E1D89F", colorTo: "#D89216" },
  { label: "สมาชิกใหม่", colorFrom: "#5C3D2E", colorTo: "#5C3D2E" },
  { label: "ผู้ดูแลระบบ", colorFrom: "#FF004D", colorTo: "#9D0B28" },
  { label: "นักเขียนรีวิวมือหนึ่ง", colorFrom: "#237A57", colorTo: "#093028" },
];

export const DEFAULT_RANK = RANKS[2];

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

export const ADVERTISEMENTS = [
  {
    title: "86-Eighty-Six",
    image: {
      src: "https://i.ibb.co/V2HxPJg/86-Eighty-Six-Part-2.gif",
      alt: "86-Eighty-Six-Part-2",
    },
    href: "/posts/hunter/86-eighty-six-season-2-episode-11-release-date-time-confirmed",
  },
  {
    title: "Hibike-Euphonium",
    image: {
      src: "https://i.ibb.co/V9TfHcd/Hibike-Euphonium-3-2024.gif",
      alt: "Hibike-Euphonium-3-2024",
    },
    href: "/posts/hunter/DL4G15DA6AN8BoXfKJki",
  },
];
