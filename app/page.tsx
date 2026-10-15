import Link from "next/link";
import { NICHES } from "@/lib/niches";

const STEPS = [
  {
    title: "Doe de quickscan",
    text: "Tien vragen over je doel, je situatie en hoe jij het liefst begeleid wordt. Gratis en zonder account.",
  },
  {
    title: "Zie je drie beste matches",
    text: "We vergelijken jouw persoonlijkheid met de stijl van elke coach en laten zien waarom een coach bij je past.",
  },
  {
    title: "Plan een gratis intake",
    text: "Kies direct een moment in de agenda van de coach. Klikt het? Dan start je traject veilig via ons.",
  },
];

const TRUST = [
  { title: "Gecontroleerde coaches", text: "We checken KvK-inschrijving, certificaten en ervaring voordat een coach live gaat." },
  { title: "Alleen echte reviews", text: "Alleen klanten die via ons een traject volgden, kunnen een review schrijven." },
  { title: "Match op persoonlijkheid", text: "Niet alleen op doel en prijs, maar op hoe jij gecoacht wilt worden." },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:pt-20">
        <div className="max-w-3xl">
          <p className="chip mb-5">Onafhankelijk advies voor het kiezen van je coach</p>
          <h1 className="heading text-4xl font-semibold leading-tight sm:text-6xl">
            Vind de online coach die écht bij je past.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft">
            Of je nu wilt afvallen, begeleiding zoekt bij afslankmedicatie of traint voor je eerste Hyrox: wij koppelen
            je aan een geverifieerde coach die past bij je doel én je persoonlijkheid.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/quickscan" className="btn text-lg">
              Doe de gratis quickscan
            </Link>
            <Link href="/coaches" className="btn-ghost text-lg">
              Bekijk alle coaches
            </Link>
          </div>
          <p className="mt-3 text-sm text-ink-soft">Duurt ongeveer 2 minuten. Geen account nodig.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap gap-2">
          {NICHES.map((n) => (
            <Link key={n.key} href={`/coaches?niche=${n.key}`} className="chip hover:bg-brand hover:text-white">
              {n.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4">
        <h2 className="heading text-3xl font-semibold">Zo werkt het</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="card">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white font-semibold">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-ink-soft">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4">
        <div className="grid gap-6 md:grid-cols-3">
          {TRUST.map((t) => (
            <div key={t.title} className="border-l-2 border-brand pl-5">
              <h3 className="font-semibold">{t.title}</h3>
              <p className="mt-2 text-ink-soft">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4">
        <div className="card flex flex-col items-start gap-5 bg-ink text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="heading text-2xl font-semibold text-white">Ben je online coach?</h2>
            <p className="mt-2 max-w-xl text-white/80">
              Stop met jagen op zichtbaarheid. Wij brengen klanten die al bij jou passen. Aanmelden is gratis.
            </p>
          </div>
          <Link href="/voor-coaches" className="btn bg-white text-ink hover:bg-brand-soft">
            Meld je aan als coach
          </Link>
        </div>
      </section>
    </>
  );
}
