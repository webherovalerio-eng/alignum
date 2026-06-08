import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "./ProjectCard";
import { getProjectsByService } from "@/data/projects";
import { type Service } from "@/data/services";

/**
 * „Beispielprojekte" auf jeder Service-Detail-Page. Rendert nur, wenn
 * echte Projekte für diesen Service existieren.
 */
export function ProjectsByService({ service }: { service: Service }) {
  const projects = getProjectsByService(service.slug);
  if (projects.length === 0) return null;

  return (
    <section className="relative py-24 sm:py-32 border-t border-border">
      <div className="container-prose">
        <Reveal className="max-w-3xl mb-12">
          <p className="text-sm tracking-widest uppercase text-primary font-medium mb-4">
            Realisiert für unsere Kunden
          </p>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] tracking-tight">
            Beispielprojekte —{" "}
            <span className="italic text-primary">{service.name}</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            So sehen unsere {service.name}-Aufträge in echt aus. Jedes Projekt
            ist auf den Kunden, den Raum und das gewählte Holz zugeschnitten.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} showCity={true} />
          ))}
        </div>
      </div>
    </section>
  );
}
