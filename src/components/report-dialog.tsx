"use client";

import { useMutation } from "@tanstack/react-query";
import { Flag, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { REPORT_REASONS } from "@/lib/constants";
import { useTRPC } from "@/trpc/client";

export function ReportButton({ from, title }: { from: string; title: string }) {
  const trpc = useTRPC();
  const [open, setOpen] = useState(false);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [other, setOther] = useState("");
  const create = useMutation(trpc.report.create.mutationOptions());

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await create.mutateAsync({
        title,
        from,
        detail: {
          inappropriateUsername: !!checks.inappropriateUsername,
          inappropriateVerbUse: !!checks.inappropriateVerbUse,
          advertisement: !!checks.advertisement,
          hateSpeech: !!checks.hateSpeech,
          contentGotUpdated: !!checks.contentGotUpdated,
          other,
        },
      });
      toast.success("แจ้งรายงานแล้ว");
      setOpen(false);
      setChecks({});
      setOther("");
    } catch {
      toast.error("มีข้อผิดพลาดเกิดขึ้นโปรดลองอีกครั้งภายหลัง");
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-muted-foreground"
      >
        <Flag /> รายงาน
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>เหตุผลที่รายงาน</DialogTitle>
            <DialogDescription className="sr-only">
              รายงานเนื้อหา
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            {REPORT_REASONS.map((r) => (
              <Label
                key={r.key}
                className="flex items-center gap-2 font-normal"
              >
                <Checkbox
                  checked={!!checks[r.key]}
                  onCheckedChange={(c) =>
                    setChecks((p) => ({ ...p, [r.key]: c === true }))
                  }
                />
                {r.label}
              </Label>
            ))}
            <Textarea
              value={other}
              onChange={(e) => setOther(e.target.value)}
              placeholder="อื่น ๆ (โปรดระบุ)"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                ยกเลิก
              </Button>
              <Button type="submit" disabled={create.isPending}>
                {create.isPending && <Loader2 className="animate-spin" />}
                แจ้งรายงาน
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
