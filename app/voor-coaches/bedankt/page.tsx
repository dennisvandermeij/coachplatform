import Link from "next/link";

export default function CoachThanksPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <p className="chip">Aanmelding ontvangen</p>
      <h1 className="heading mt-4 text-3xl font-semibold sm:text-4xl">Bedankt voor je aanmelding</h1>
      <p className="mt-4 text-ink-soft">
        We controleren je KvK-inschrijving, certificaten en profiel. Is alles in orde, dan zetten we je profiel live en
        laten we het je per e-mail weten. Vanaf dat moment kunnen passende klanten een intake bij je inplannen.
      </p>
      <Link href="/" className="btn-ghost mt-8">Terug naar de homepage</Link>
    </section>
  );
}
