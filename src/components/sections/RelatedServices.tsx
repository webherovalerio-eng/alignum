import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SERVICES, SERVICE_HUB, type Service } from "@/data/services";
import { PHOTOS } from "@/data/photos";

export function RelatedServices({ exclude }: { exclude?: string }) {
  const others: Service[] = SERVICES.filter((s) => s.slug !== exclude).slice(0, 3);
  return (
    <section className="relative py-24">
      <div className="container-prose">
        <Reveal className="mb-12 max-w-2xl">
          <p className="text-sm tracking-widest uppercase text-primary font-medium mb-4">
            Weitere Leistungen
          </p>
          <h2 className="font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.1] tracking-tight">
            Auch interessant
          </h2>
        </Reveal>
        <div className="grid sm:grid-cols-3 gap-4">
          {others.map((s) => {
            const cover = PHOTOS[s.imageCategory]?.[0];
            return (
              <Link
                key={s.slug}
                href={`/${SERVICE_HUB}/${s.slug}/`}
                className="group relative overflow-hidden rounded-xl border border-border aspect-[4/5]"
              >
                {cover && (
                  <Image
                    src={cover}
                    alt={s.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5 text-background">
                  <h3 className="font-display text-2xl">{s.name}</h3>
                  <p className="text-sm text-background/75 mt-1">{s.short}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-primary text-sm">
                    Ansehen <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
