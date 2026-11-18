import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background p-4">
      <h1 className="clip-image-text text-[43vw] leading-none md:text-[20vw]">
        404
      </h1>
      <div className="rounded-sm bg-card p-4 lg:p-8">
        <blockquote className="border-l-4 border-primary pl-4">
          <p className="text-sm text-foreground md:text-xl">
            การเดินทางนับพันไมล์ เริ่มต้นได้ด้วยก้าวเดียวเสมอ
          </p>
          <cite className="text-sm text-muted-foreground not-italic">
            – อ๊ะ! ไม่พบหน้าเว็บไซต์ที่ร้องขอ
          </cite>
        </blockquote>
        <div className="mt-4 flex justify-center">
          <Button asChild>
            <Link href="/">กลับหน้าหลัก</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
