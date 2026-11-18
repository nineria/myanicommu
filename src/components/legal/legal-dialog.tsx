"use client";

import { useState } from "react";
import { PrivacyContent } from "@/components/legal/privacy-content";
import { RulesContent } from "@/components/legal/rules-content";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

function LegalDialog({
  trigger,
  title,
  children,
}: {
  trigger: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="cursor-pointer text-primary underline-offset-2 hover:underline"
        onClick={() => setOpen(true)}
      >
        {trigger}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <DialogDescription className="sr-only">{title}</DialogDescription>
          {children}
          <DialogFooter className="sm:justify-center">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              ยอมรับ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** "โปรดปฏิบัติตาม กฎ กติกา และ มารยาท ..." line shown under every create form. */
export function WebsiteRuleNotice() {
  return (
    <div className="my-2 text-xs">
      โปรดปฏิบัติตาม{" "}
      <LegalDialog trigger="กฎ กติกา และ มารยาท" title="กฎ กติกา และมารยาท">
        <RulesContent />
      </LegalDialog>{" "}
      ของเว็บไซต์ MyAnimeCommunity
      <p>เพื่อรักษาบรรยากาศการพูดคุยของชุมชนคนรักอนิเมะ</p>
    </div>
  );
}

export function AgreeWebsiteRule() {
  return (
    <span>
      ยอมรับ{" "}
      <LegalDialog trigger="กฎ กติกา และมารยาท" title="กฎ กติกา และมารยาท">
        <RulesContent />
      </LegalDialog>{" "}
      ของ MyAnimeCommunity
    </span>
  );
}

export function AgreePrivacyPolicy() {
  return (
    <span>
      ยอมรับ{" "}
      <LegalDialog
        trigger="นโยบายเกี่ยวกับข้อมูลส่วนบุคคล"
        title="นโยบายเกี่ยวกับข้อมูลส่วนบุคคล"
      >
        <PrivacyContent />
      </LegalDialog>{" "}
      ของ MyAnimeCommunity
    </span>
  );
}
