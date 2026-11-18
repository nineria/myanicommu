import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70svh] w-full max-w-xl flex-col items-center justify-center gap-6 px-4 py-12 text-center">
      <p
        aria-hidden
        className="font-display text-[8rem] leading-none font-bold tracking-tighter text-primary select-none sm:text-[12rem]"
      >
        404
      </p>
      <h1 className="font-display text-xl font-bold text-foreground sm:text-2xl">
        อ๊ะ! ไม่พบหน้าเว็บไซต์ที่ร้องขอ
      </h1>
      <p className="text-muted-foreground">
        การเดินทางนับพันไมล์ เริ่มต้นได้ด้วยก้าวเดียวเสมอ
      </p>
      <Button asChild>
        <Link href="/">กลับหน้าหลัก</Link>
      </Button>
    </div>
  );
}
