import { Award, Hammer, Leaf, ShieldCheck, Sparkles, Trees } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const SIGNALS = [
  { Icon: Hammer, label: "30+ Jahre Erfahrung" },
  { Icon: Award, label: "Tischlermeister-Betrieb" },
  { Icon: Trees, label: "Heimische Hölzer" },
  { Icon: ShieldCheck, label: "5 Jahre Garantie" },
  { Icon: Sparkles, label: "Unikate auf Maß" },
  { Icon: Leaf, label: "Ökologisch geleimt" },
];

export function TrustBar() {
  return (
    <section className="relative py-10 border-y border-border bg-card/40">
      <div className="container-prose">
        <Reveal>
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-muted-foreground">
            {SIGNALS.map(({ Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2">
                <Icon className="size-4 text-primary" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
