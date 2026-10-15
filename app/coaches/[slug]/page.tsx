import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { coachStats } from "@/lib/coaches";
import { nicheLabel, splitList, LEVELS } from "@/lib/niches";
import { DIMENSIONS } from "@/lib/style";
import { upcomingSlots } from "@/lib/slots";
import { Initials, RatingLine } from "@/components/CoachCard";
import { BookingForm } from "./BookingForm";

async function loadCoach(slug: string) {
  return db.coach.findFirst({
    where: { slug, status: "active" },
    include: {
      packages: { orderBy: { pricePerMonth: "asc" } },
      reviews: { orderBy: { createdAt: "desc" } },
      appointments: { where: { startsAt: { gt: new Date() }, status: "gepland" }, select: { startsAt: true } },
    },
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const coach = await loadCoach((await params).slug);
  return { title: coach ? `${coach.name}, coach voor ${nicheLabel(coach.mainNiche).toLowerCase()}` : "Coach" };
}

export default async function CoachPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ intake?: string }>;
}) {
  const coach = await loadCoach((await params).slug);
  if (!coach) notFound();
  const { intake } = await searchParams;
  const stats = coachStats(coach);
  const slots = stats.full ? [] : upcomingSlots(new Date(), coach.appointments.map((a) => a.startsAt));
  const levels = splitList(coach.icpLevels).map((l) => LEVELS.find((x) => x.key === l)?.label ?? l);

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_380px]">
      <div>
        <div className="flex items-center gap-5">
          <Initials name={coach.name} />
          <div>
            <h1 className="heading text-3xl font-semibold sm:text-4xl">{coach.name}</h1>
            <p className="text-ink-soft">
              {nicheLabel(coach.mainNiche)} · {coach.yearsExperience} jaar ervaring
              {coach.city ? ` · ${coach.city}` : ""}
            </p>
            <RatingLine reviewCount={stats.reviewCount} averageRating={stats.averageRating} />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="chip">✓ Gecontroleerd door ons</span>
          {splitList(coach.niches).map((n) => (
            <span key={n} className="chip bg-white border border-line text-ink">
              {nicheLabel(n)}
            </span>
          ))}
        </div>

        <h2 className="heading mt-10 text-2xl font-semibold">Over mij</h2>
        <p className="mt-3 whitespace-pre-line text-ink-soft">{coach.bio}</p>
        <p className="mt-4 text-sm text-ink-soft">
          <strong className="text-ink">Werkt het best met:</strong> {levels.join(", ").toLowerCase()}
          {coach.worksWithBusy ? ", ook ondernemers en mensen met een drukke agenda" : ""}.
          <br />
          <strong className="text-ink">Certificaten:</strong> {coach.certificates}
        </p>

        <h2 className="heading mt-10 text-2xl font-semibold">Coachstijl</h2>
        <div className="mt-4 space-y-4">
          {DIMENSIONS.map((d) => (
            <div key={d.key}>
              <div className="flex justify-between text-sm">
                <span className="text-ink-soft">{d.low}</span>
                <span className="font-semibold">{d.name}</span>
                <span className="text-ink-soft">{d.high}</span>
              </div>
              <div className="relative mt-2 h-2 rounded-full bg-line">
                <div
                  className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-brand shadow"
                  style={{ left: `${((coach[d.key] - 1) / 4) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <h2 className="heading mt-10 text-2xl font-semibold">Pakketten</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {coach.packages.map((p) => (
            <div key={p.id} className="card">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="mt-1 text-2xl font-semibold">
                € {p.pricePerMonth}
                <span className="text-sm font-normal text-ink-soft"> per maand · {p.months} {p.months === 1 ? "maand" : "maanden"}</span>
              </p>
              <p className="mt-2 text-sm text-ink-soft">{p.description}</p>
            </div>
          ))}
        </div>

        <h2 className="heading mt-10 text-2xl font-semibold">Reviews</h2>
        <p className="mt-1 text-sm text-ink-soft">Alleen klanten die via ons een traject volgden, kunnen een review schrijven.</p>
        {coach.reviews.length === 0 ? (
          <p className="mt-4 text-ink-soft">Nog geen reviews. Deze coach is nieuw op het platform.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {coach.reviews.map((r) => (
              <figure key={r.id} className="card">
                <p className="text-accent">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
                <blockquote className="mt-2">{r.text}</blockquote>
                <figcaption className="mt-3 text-sm text-ink-soft">
                  {r.authorFirstName} · <span className="text-brand-dark">Geverifieerd traject</span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>

      <aside id="intake" className="lg:sticky lg:top-6 lg:self-start">
        <div className="card">
          <h2 className="heading text-2xl font-semibold">Plan een gratis intake</h2>
          {stats.full ? (
            <p className="mt-3 text-ink-soft">
              {coach.name} neemt op dit moment geen nieuwe klanten aan. Bekijk andere coaches of doe de quickscan.
            </p>
          ) : (
            <>
              <p className="mt-2 text-sm text-ink-soft">
                Maak kennis in een vrijblijvend gesprek van 30 minuten. Je zit nergens aan vast.
              </p>
              <BookingForm coachId={coach.id} intakeId={intake} slots={slots.map((s) => s.toISOString())} />
            </>
          )}
        </div>
      </aside>
    </section>
  );
}
