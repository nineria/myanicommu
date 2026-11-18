import type { Metadata } from "next";
import { PostListPage } from "@/components/post/post-list-page";

export const metadata: Metadata = { title: "ข่าวสาร" };
export const dynamic = "force-dynamic";

export default function Page() {
  return <PostListPage kind="NEWS" />;
}
