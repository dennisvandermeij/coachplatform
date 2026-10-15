"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createCoach, type CoachFormState } from "@/app/actions";
import { LEVELS, NICHES } from "@/lib/niches";
import { DIMENSIONS } from "@/lib/style";
import { ScaleQuestion } from "@/components/ScaleQuestion";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="mt-10 space-y-4">
      <legend className="heading mb-2 text-xl font-semibold">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({ label, name, ...rest }: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <input id={name} name={name} className="input" {...rest} />
    </div>
  );
}

function YesNo({ name, question }: { name: string; question: string }) {
  return (
    <div>
      <span className="label">{question}</span>
      <div className="flex gap-6">
        <label className="flex items-center gap-2"><input type="radio" name={name} value="ja" required /> Ja</label>
        <label className="flex items-center gap-2"><input type="radio" name={name} value="nee" /> Nee</label>
      </div>
    </div>
  );
}

export function CoachSignupForm() {
  const [state, action, pending] = useActionState<CoachFormState, FormData>(createCoach, {});

  return (
    <form action={action}>
      <Section title="1. Over jou">
        <Field label="Volledige naam" name="name" required minLength={2} autoComplete="name" />
        <Field label="E-mailadres" name="email" type="email" required autoComplete="email" />
        <Field label="Telefoon (optioneel)" name="phone" type="tel" autoComplete="tel" />
        <Field label="Woonplaats (optioneel)" name="city" autoComplete="address-level2" />
        <Field label="KvK-nummer" name="kvkNumber" required inputMode="numeric" pattern="\d{8}" title="8 cijfers" />
        <Field label="Jaren ervaring als coach" name="yearsExperience" type="number" min={0} max={50} required />
        <Field
          label="Certificaten en opleidingen"
          name="certificates"
          required
          placeholder="Bijvoorbeeld: Fitnesstrainer A, Voedingscoach (HAN)"
        />
        <div>
          <label className="label" htmlFor="bio">Over mij (minimaal 40 tekens)</label>
          <textarea
            id="bio"
            name="bio"
            required
            minLength={40}
            rows={5}
            className="input"
            placeholder="Voor wie ben je de beste coach, en waarom?"
          />
        </div>
      </Section>

      <Section title="2. Je specialisaties">
        <div>
          <label className="label" htmlFor="mainNiche">Je hoofdspecialisatie</label>
          <select id="mainNiche" name="mainNiche" required className="input" defaultValue="">
            <option value="" disabled>Kies een specialisatie</option>
            {NICHES.map((n) => (
              <option key={n.key} value={n.key}>{n.label}</option>
            ))}
          </select>
        </div>
        <div>
          <span className="label">Waar heb je nog meer ervaring mee?</span>
          <div className="grid gap-2 sm:grid-cols-2">
            {NICHES.map((n) => (
              <label key={n.key} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="niches" value={n.key} /> {n.label}
              </label>
            ))}
          </div>
        </div>
      </Section>

      <Section title="3. Je ideale klant">
        <div>
          <span className="label">Met welk niveau werk je het liefst?</span>
          <div className="flex flex-wrap gap-4">
            {LEVELS.map((l) => (
              <label key={l.key} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="icpLevels" value={l.key} /> {l.label}
              </label>
            ))}
          </div>
        </div>
        <YesNo name="worksWithBusy" question="Werk je graag met ondernemers en mensen met een drukke agenda?" />
        <YesNo name="offersLive" question="Bied je ook live trainingen aan?" />
        <Field label="Hoeveel klanten kun je maximaal tegelijk begeleiden?" name="maxClients" type="number" min={1} max={200} required />
      </Section>

      <Section title="4. Je coachstijl">
        <p className="text-sm text-ink-soft">
          Klanten beantwoorden dezelfde stellingen over hoe zij gecoacht willen worden. Hoe eerlijker je antwoordt, hoe
          beter je matches.
        </p>
        {DIMENSIONS.map((d) => (
          <ScaleQuestion key={d.key} name={d.key} statement={d.coach} low={d.low} high={d.high} />
        ))}
      </Section>

      <Section title="5. Je eerste pakket">
        <p className="text-sm text-ink-soft">Je bepaalt zelf je prijs. Meer pakketten kun je later toevoegen.</p>
        <Field label="Naam van het pakket" name="packageName" required placeholder="Bijvoorbeeld: 12 weken transformatie" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Prijs per maand (€)" name="packagePrice" type="number" min={10} max={5000} required />
          <Field label="Looptijd (maanden)" name="packageMonths" type="number" min={1} max={24} required />
        </div>
        <div>
          <label className="label" htmlFor="packageDescription">Wat zit erin?</label>
          <textarea
            id="packageDescription"
            name="packageDescription"
            required
            minLength={10}
            rows={3}
            className="input"
            placeholder="Bijvoorbeeld: trainingsschema, voedingsplan, wekelijkse check-in via video"
          />
        </div>
      </Section>

      {state.error && <p className="mt-8 rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}

      <p className="mt-8 text-sm text-ink-soft">
        Door je aan te melden ga je akkoord met de{" "}
        <Link href="/voorwaarden" className="text-brand underline">voorwaarden</Link> en de{" "}
        <Link href="/privacy" className="text-brand underline">privacyverklaring</Link>.
      </p>
      <button type="submit" className="btn mt-4 w-full sm:w-auto" disabled={pending}>
        {pending ? "Bezig met aanmelden..." : "Aanmelding versturen"}
      </button>
    </form>
  );
}
