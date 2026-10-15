import type { Metadata } from "next";
import Link from "next/link";
import { coachStats, loadActiveCoaches } from "@/lib/coaches";
import { NICHES, nicheLabel } from "@/lib/niches";
import { CoachCard } from "@/components/CoachCard";

export const metadata: Metadata = { title: "Alle coaches" };

export default async function CoachesPage({
  searchParams,
}: {
  searchParams: Promise<{ niche?: string; intake?: string }>;
}) {
  const { niche, intake } = await searchParams;
  const activeNiche = NICHES.some((n) => n.key === niche) ? niche : undefined;
  const coaches = (await loadActiveCoaches(activeNiche))
    .map((c) => ({ coach: c, stats: coachStats(c) }))
    // Beschikbare coaches eerst, daarna op beoordeling. Betaalde plekken komen later, apart gelabeld.
    .sort(
      (a, b) =>
        Number(a.stats.full) - Number(b.stats.full) ||
        (b.stats.averageRating ?? 0) - (a.stats.averageRating ?? 0),
    );
  const suffix = intake ? `&intake=${intake}` : "";

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="heading text-3xl font-semibold sm:text-4xl">
        {activeNiche ? `Coaches voor ${nicheLabel(activeNiche).toLowerCase()}` : "Alle coaches"}
      </h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Elke coach is door ons gecontroleerd. Twijfel je wie bij je past?{" "}
        <Link href="/quickscan" className="font-semibold text-brand hover:underline">
          Doe de quickscan
        </Link>{" "}
        en zie je drie beste matches.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link href={`/coaches${intake ? `?intake=${intake}` : ""}`} className={`chip ${!activeNiche ? "bg-brand text-white" : ""}`}>
          Alle
        </Link>
        {NICHES.map((n) => (
          <Link
            key={n.key}
            href={`/coaches?niche=${n.key}${suffix}`}
            className={`chip ${activeNiche === n.key ? "bg-brand text-white" : ""}`}
          >
            {n.label}
          </Link>
        ))}
      </div>

      {coaches.length === 0 ? (
        <p className="card mt-10 max-w-2xl">Voor dit doel zijn nog geen coaches beschikbaar. We breiden het aanbod snel uit.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coaches.map(({ coach, stats }) => (
            <CoachCard
              key={coach.id}
              {...coach}
              {...stats}
              href={`/coaches/${coach.slug}${intake ? `?intake=${intake}` : ""}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
