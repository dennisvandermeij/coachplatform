"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { createIntake } from "@/app/actions";
import { BUDGETS, GUIDANCE, LEVELS, NICHES } from "@/lib/niches";
import { DIMENSIONS } from "@/lib/style";

type Option = { value: string; label: string };

type Step =
  | { kind: "choice"; name: string; question: string; options: Option[] }
  | { kind: "scale"; name: string; question: string; low: string; high: string };

const STEPS: Step[] = [
  {
    kind: "choice",
    name: "goal",
    question: "Wat is je belangrijkste doel?",
    options: NICHES.map((n) => ({ value: n.key, label: n.label })),
  },
  {
    kind: "choice",
    name: "level",
    question: "Hoeveel ervaring heb je met trainen en voeding?",
    options: LEVELS.map((l) => ({ value: l.key, label: l.label })),
  },
  {
    kind: "choice",
    name: "busy",
    question: "Heb je een eigen bedrijf of een drukke baan?",
    options: [
      { value: "ja", label: "Ja, mijn agenda zit vol" },
      { value: "nee", label: "Nee, ik heb redelijk wat ruimte" },
    ],
  },
  {
    kind: "choice",
    name: "budget",
    question: "Wat wil je per maand investeren in een coach?",
    options: BUDGETS.map((b) => ({ value: String(b.value), label: b.label })),
  },
  {
    kind: "choice",
    name: "guidance",
    question: "Hoe wil je begeleid worden?",
    options: GUIDANCE.map((g) => ({ value: g.key, label: g.label })),
  },
  ...DIMENSIONS.map(
    (d): Step => ({ kind: "scale", name: d.key, question: d.client, low: d.low, high: d.high }),
  ),
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn" disabled={pending}>
      {pending ? "Matches zoeken..." : "Toon mijn matches"}
    </button>
  );
}

export function QuickscanForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const answered = Boolean(answers[current.name]);

  function choose(name: string, value: string) {
    setAnswers((a) => ({ ...a, [name]: value }));
    // Automatisch door naar de volgende vraag: minder klikken, hogere afronding.
    if (!isLast) setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 180);
  }

  return (
    <form action={createIntake}>
      <div className="mb-8">
        <div className="flex justify-between text-sm text-ink-soft">
          <span>
            Vraag {step + 1} van {STEPS.length}
          </span>
          {step >= 5 && <span>Nu over hoe jij gecoacht wilt worden</span>}
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>

      {STEPS.map((s, i) => (
        <div key={s.name} hidden={i !== step}>
          {s.kind === "choice" ? (
            <fieldset>
              <legend className="heading text-2xl font-semibold sm:text-3xl">{s.question}</legend>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {s.options.map((o) => (
                  <label key={o.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name={s.name}
                      value={o.value}
                      checked={answers[s.name] === o.value}
                      onChange={() => choose(s.name, o.value)}
                      className="peer sr-only"
                    />
                    <span className="block rounded-xl border border-line bg-card px-5 py-4 font-medium transition hover:border-brand peer-checked:border-brand peer-checked:bg-brand-soft peer-focus-visible:ring-2 peer-focus-visible:ring-brand">
                      {o.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : (
            <div>
              <h2 className="heading mb-6 text-2xl font-semibold sm:text-3xl">In hoeverre ben je het hiermee eens?</h2>
              <ScaleStep step={s} value={answers[s.name]} onChange={(v) => choose(s.name, v)} />
            </div>
          )}
        </div>
      ))}

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          className="text-sm font-medium text-ink-soft hover:text-brand disabled:invisible"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
        >
          ← Vorige vraag
        </button>
        {isLast ? (
          answered && <SubmitButton />
        ) : (
          <button type="button" className="btn-ghost" disabled={!answered} onClick={() => setStep((s) => s + 1)}>
            Volgende
          </button>
        )}
      </div>
    </form>
  );
}

function ScaleStep({
  step,
  value,
  onChange,
}: {
  step: Extract<Step, { kind: "scale" }>;
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="card">
      <legend className="sr-only">{step.question}</legend>
      <p className="text-lg font-medium">“{step.question}”</p>
      <div className="mt-5 grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="cursor-pointer">
            <input
              type="radio"
              name={step.name}
              value={n}
              checked={value === String(n)}
              onChange={() => onChange(String(n))}
              className="peer sr-only"
            />
            <span className="flex h-12 items-center justify-center rounded-xl border border-line font-semibold transition hover:border-brand peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand">
              {n}
            </span>
          </label>
        ))}
      </div>
      <div className="mt-2 flex justify-between gap-4 text-xs text-ink-soft">
        <span>Helemaal oneens</span>
        <span className="text-right">Helemaal eens</span>
      </div>
    </fieldset>
  );
}
