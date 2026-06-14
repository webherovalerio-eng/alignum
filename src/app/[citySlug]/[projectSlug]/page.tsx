import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Check, MapPin, Hammer, Trees, Calendar, ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal, MaskWords } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { CTA } from "@/components/sections/CTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { PROJECTS, getProject, projectPath } from "@/data/projects";
import { CITIES } from "@/data/cities";
import { SERVICES, SERVICE_HUB } from "@/data/services";
import { MATERIALS } from "@/data/materials";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/data/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ citySlug: p.city, projectSlug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ citySlug: string; projectSlug: string }>;
}) {
  const { citySlug, projectSlug } = await params;
  const p = getProject(projectSlug);
  if (!p || p.city !== citySlug) return {};
  return buildMetadata({
    title: p.metaTitle,
    description: p.metaDescription,
    path: projectPath(p),
    image: p.cover,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ citySlug: string; projectSlug: string }>;
}) {
  const { citySlug, projectSlug } = await params;
  const project = getProject(projectSlug);
  // Projekt muss existieren UND unter der korrekten City-URL liegen
  if (!project || project.city !== citySlug) notFound();

  const city = CITIES.find((c) => c.slug === project.city);
  const service = SERVICES.find((s) => s.slug === project.service);
  const material = MATERIALS.find((m) => m.slug === project.material);

  // Weitere Projekte (gleiche Stadt ODER gleiche Disziplin), ohne dieses
  const related = PROJECTS.filter(
    (p) =>
      p.slug !== project.slug &&
      (p.city === project.city || p.service === project.service),
  ).slice(0, 3);

  const ld = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.metaDescription,
    image: project.images.map((i) => `${SITE.url}${i}`),
    url: `${SITE.url}${projectPath(project)}`,
    creator: {
      "@type": "LocalBusiness",
      name: "Alignum Möbelbau",
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.address.street,
        postalCode: SITE.address.zip,
        addressLocality: SITE.address.city,
        addressCountry: "DE",
      },
    },
    ...(project.year && { dateCreated: String(project.year) }),
    ...(city && {
      locationCreated: {
        "@type": "Place",
        name: city.name,
      },
    }),
    ...(material && { material: material.name }),
  };

  return (
    <>
      {/* HERO */}
      <section className="relative pt-32 sm:pt-40 pb-12">
        <div className="container-prose">
          {/* Breadcrumbs — Stadt ist die übergeordnete Ebene */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 text-sm text-muted-foreground flex flex-wrap items-center gap-1.5"
          >
            <Link href="/" className="hover:text-primary">
              Start
            </Link>
            <ChevronRight className="size-3.5" />
            <Link href="/projekte/" className="hover:text-primary">
              Projekte
            </Link>
            {city && (
              <>
                <ChevronRight className="size-3.5" />
                <Link href={`/${city.slug}/`} className="hover:text-primary">
                  {city.name}
                </Link>
              </>
            )}
            <ChevronRight className="size-3.5" />
            <span className="text-foreground">{project.title}</span>
          </nav>

          <Reveal>
            <Badge variant="outline" className="mb-5">
              <span className="size-1.5 rounded-full bg-primary" />
              Referenzprojekt {city ? `· ${city.name}` : ""}
              {project.year ? ` · ${project.year}` : ""}
            </Badge>
            <h1 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.05] tracking-tight max-w-[22ch]">
              <MaskWords text={project.title} />
            </h1>
            <p className="mt-6 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
              {project.summary}
            </p>
          </Reveal>
        </div>
      </section>

      {/* COVER */}
      <section className="relative pb-12">
        <div className="container-prose">
          <Reveal>
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-elev)]">
              <Image
                src={project.cover}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* META + BODY */}
      <section className="relative py-16">
        <div className="container-prose grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Meta-Sidebar */}
          <Reveal className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 space-y-5">
              <p className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
                Projekt-Eckdaten
              </p>

              {city && (
                <MetaRow Icon={MapPin} label="Standort" value={city.name} link={`/${city.slug}/`} />
              )}
              {service && (
                <MetaRow
                  Icon={Hammer}
                  label="Disziplin"
                  value={service.name}
                  link={`/${SERVICE_HUB}/${service.slug}/`}
                />
              )}
              {material && (
                <MetaRow
                  Icon={Trees}
                  label="Hauptmaterial"
                  value={material.name}
                  link="/#hoelzer"
                />
              )}
              {project.year && (
                <MetaRow Icon={Calendar} label="Realisiert" value={String(project.year)} />
              )}

              <div className="pt-5 border-t border-border">
                <LinkButton
                  href={`/anfrage/?service=${project.service}`}
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  Ähnliches Projekt anfragen
                </LinkButton>
              </div>
            </div>
          </Reveal>

          {/* Body + Features */}
          <div className="lg:col-span-8 space-y-6">
            {project.body.map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p
                  className={
                    i === 0
                      ? "text-xl sm:text-2xl font-display leading-snug text-foreground"
                      : "text-base sm:text-lg leading-relaxed text-foreground/85"
                  }
                >
                  {p}
                </p>
              </Reveal>
            ))}

            {project.features.length > 0 && (
              <Reveal className="pt-6">
                <p className="text-xs uppercase tracking-[0.25em] text-primary font-medium mb-4">
                  Was wir gebaut haben
                </p>
                <ul className="space-y-3">
                  {project.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-3" />
                      </span>
                      <span className="text-foreground/90">{f}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {/* Querverlinkung: Material · weitere Projekte · City-Page */}
            <Reveal className="pt-8">
              <div className="flex flex-wrap gap-3">
                {material && (
                  <Link
                    href="/#hoelzer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm hover:border-primary/50 transition-colors"
                  >
                    <Trees className="size-4 text-primary" />
                    Mehr zu {material.name}
                  </Link>
                )}
                <Link
                  href="/projekte/"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm hover:border-primary/50 transition-colors"
                >
                  Weitere Projekte
                  <ArrowUpRight className="size-4 text-primary" />
                </Link>
                {city && (
                  <Link
                    href={`/${city.slug}/`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm hover:border-primary/50 transition-colors"
                  >
                    <MapPin className="size-4 text-primary" />
                    Schreinerei {city.name}
                  </Link>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* IMAGE GALLERY */}
      {project.images.length > 1 && (
        <section className="relative py-16">
          <div className="container-prose">
            <Reveal className="mb-10">
              <p className="text-xs uppercase tracking-[0.25em] text-primary font-medium mb-3">
                Bildergalerie
              </p>
              <h2 className="font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.1] tracking-tight">
                Detailaufnahmen
              </h2>
            </Reveal>

            <div className="grid grid-cols-12 gap-3 sm:gap-4 auto-rows-[200px] sm:auto-rows-[260px]">
              {project.images.slice(1).map((src, i) => {
                const span = pickSpan(i);
                return (
                  <Reveal
                    key={src}
                    delay={(i % 6) * 0.05}
                    className={`relative overflow-hidden rounded-xl border border-border bg-card ${span}`}
                  >
                    <Image
                      src={src}
                      alt={`${project.title} — Detail ${i + 2}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* RELATED */}
      {related.length > 0 && (
        <section className="relative py-20 border-t border-border">
          <div className="container-prose">
            <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-primary font-medium mb-3">
                  Auch interessant
                </p>
                <h2 className="font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.1] tracking-tight">
                  Weitere Projekte
                </h2>
              </div>
              <Link
                href="/projekte/"
                className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:gap-2.5 transition-all"
              >
                Alle Projekte ansehen <ArrowRight className="size-4" />
              </Link>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={projectPath(p)}
                  className="group block overflow-hidden rounded-xl border border-border bg-card hover:shadow-[var(--shadow-elev)] transition-shadow"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={p.cover}
                      alt={p.title}
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-primary mb-1">
                      {CITIES.find((c) => c.slug === p.city)?.name ?? "Region"}
                    </p>
                    <p className="font-display text-lg leading-snug">{p.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTA
        heading={
          city
            ? `Ein eigenes Projekt in ${city.name}?`
            : "Ein eigenes Projekt im Sinn?"
        }
        body={`Wir kommen aus ${SITE.address.city} zu Ihnen, vermessen den Raum und skizzieren das Möbel, das Sie bisher nirgends gefunden haben.`}
      />

      <JsonLd id={`ld-project-${project.slug}`} data={ld} />
    </>
  );
}

function MetaRow({
  Icon,
  label,
  value,
  link,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  link?: string;
}) {
  const inner = (
    <div className="flex items-start gap-3">
      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
  if (link) {
    return (
      <Link
        href={link}
        className="block -m-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
      >
        {inner}
      </Link>
    );
  }
  return inner;
}

function pickSpan(i: number) {
  const patterns = [
    "col-span-12 sm:col-span-6 row-span-2",
    "col-span-6 sm:col-span-3",
    "col-span-6 sm:col-span-3",
    "col-span-6 sm:col-span-4",
    "col-span-6 sm:col-span-4",
    "col-span-12 sm:col-span-4",
  ];
  return patterns[i % patterns.length];
}
