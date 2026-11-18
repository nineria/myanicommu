import { Compass } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 text-center">
      <Logo />
      <div className="grid size-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <Compass className="size-8" />
      </div>
      <div className="max-w-sm space-y-2">
        <h1 className="text-2xl font-bold">ไม่พบหน้าที่ต้องการ</h1>
        <p className="text-muted-foreground">
          ลิงก์อาจผิดพลาด หรือโพสต์นี้ถูกลบไปแล้ว ลองกลับไปที่หน้าหลักหรือค้นหาใหม่อีกครั้ง
        </p>
      </div>
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/">กลับหน้าหลัก</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/search">ค้นหา</Link>
        </Button>
      </div>
    </div>
  );
}
