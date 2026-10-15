import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { coachStats } from "@/lib/coaches";
import { nicheShort } from "@/lib/niches";
import { CoachCard } from "@/components/CoachCard";

export default async function MatchesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const intake = await db.intake.findUnique({
    where: { id },
    include: {
      matches: {
        orderBy: { rank: "asc" },
        include: { coach: { include: { packages: true, reviews: true } } },
      },
    },
  });
  if (!intake) notFound();

  const { matches } = intake;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <p className="chip">Jouw matches</p>
      <h1 className="heading mt-4 text-3xl font-semibold sm:text-4xl">
        {matches.length > 0
          ? `Deze ${matches.length === 1 ? "coach past" : `${matches.length} coaches passen`} het best bij jou`
          : "We hebben nog geen passende coach gevonden"}
      </h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Op basis van je doel ({nicheShort(intake.goal)}), je situatie en hoe jij gecoacht wilt worden. Plan een gratis
        intake om kennis te maken; je zit nergens aan vast.
      </p>

      {matches.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {matches.map((m) => {
            const reasons: string[] = JSON.parse(m.reasons);
            const stats = coachStats(m.coach);
            return (
              <CoachCard
                key={m.id}
                {...m.coach}
                {...stats}
                href={`/coaches/${m.coach.slug}?intake=${intake.id}#intake`}
                ctaLabel="Plan gratis intake"
              >
                <div className="mt-5 rounded-xl bg-brand-soft p-4">
                  <p className="text-2xl font-semibold text-brand-dark">{m.score}% match</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {reasons.map((r) => (
                      <li key={r}>✓ {r}</li>
                    ))}
                  </ul>
                </div>
                {m.overBudget && <p className="mt-3 text-sm text-accent">Iets boven je opgegeven budget</p>}
              </CoachCard>
            );
          })}
        </div>
      ) : (
        <div className="card mt-10 max-w-2xl">
          <p>
            Er zijn op dit moment nog geen coaches beschikbaar voor dit doel. We breiden het aanbod snel uit. Bekijk
            alvast alle coaches, of probeer de quickscan opnieuw met een ander doel.
          </p>
        </div>
      )}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href={`/coaches?niche=${intake.goal}&intake=${intake.id}`} className="btn-ghost">
          Bekijk alle coaches voor {nicheShort(intake.goal)}
        </Link>
        <Link href="/quickscan" className="btn-ghost">
          Quickscan opnieuw doen
        </Link>
      </div>
    </section>
  );
}
