import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_FIRST_LIST, FAQ_LIST } from "@/lib/faq-data";

export const metadata: Metadata = { title: "คำถามที่พบบ่อย" };

type Group = {
  title: string;
  description: { label: string; content: React.ReactNode }[];
};

function FaqGroup({ group, id }: { group: Group; id: string }) {
  return (
    <>
      <h4 className="mt-4 mb-2 font-semibold">{group.title}</h4>
      <Accordion type="single" collapsible>
        {group.description.map((item, i) => (
          <AccordionItem key={`${id}-${i}`} value={`${id}-${i}`}>
            <AccordionTrigger>{item.label}</AccordionTrigger>
            <AccordionContent className="text-foreground/80">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}

export default function FaqPage() {
  return (
    <PageShell>
      <div className="space-y-4 text-foreground">
        <div className="rounded-xl border bg-card p-5">
          <h1 className="text-2xl font-bold">คำถามที่พบบ่อย</h1>
          {(FAQ_FIRST_LIST as Group[]).map((g, i) => (
            <FaqGroup key={g.title} group={g} id={`first-${i}`} />
          ))}
        </div>
        {(FAQ_LIST as Group[]).map((g, i) => (
          <div key={g.title} className="rounded-xl border bg-card p-5">
            <FaqGroup group={g} id={`g${i}`} />
          </div>
        ))}
      </div>
    </PageShell>
  );
}
