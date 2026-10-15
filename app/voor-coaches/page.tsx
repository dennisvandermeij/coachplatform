import type { Metadata } from "next";
import { CoachSignupForm } from "./CoachSignupForm";

export const metadata: Metadata = { title: "Voor coaches | Klanten die bij je passen" };

const BENEFITS = [
  { title: "Klanten komen naar jou", text: "Geen dagelijkse contentstress. Klanten doen eerst de quickscan en komen bij jou terecht als jullie echt passen." },
  { title: "Gratis aanmelden", text: "Je betaalt niets om op het platform te staan. Je bepaalt zelf je prijzen en hoeveel klanten je aanneemt." },
  { title: "Bouw aan je reputatie", text: "Geverifieerde reviews en levels laten zien hoe goed je bent. Dat kan geen concurrent namaken." },
  { title: "Betalingen geregeld", text: "Klanten betalen via ons, jij krijgt het uitbetaald. Geen facturen meer najagen." },
];

export default function ForCoachesPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="max-w-3xl">
        <p className="chip">Voor online coaches</p>
        <h1 className="heading mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
          Stop met jagen op zichtbaarheid. Wij brengen klanten die al bij jou passen.
        </h1>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map((b) => (
          <div key={b.title} className="border-l-2 border-brand pl-5">
            <h2 className="font-semibold">{b.title}</h2>
            <p className="mt-2 text-sm text-ink-soft">{b.text}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-2xl">
        <h2 className="heading text-3xl font-semibold">Meld je aan</h2>
        <p className="mt-2 text-ink-soft">
          Duurt ongeveer 5 minuten. We controleren je gegevens en zetten je profiel daarna live.
        </p>
        <CoachSignupForm />
      </div>
    </section>
  );
}
