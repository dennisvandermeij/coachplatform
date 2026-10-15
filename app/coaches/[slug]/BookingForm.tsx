"use client";

import { useActionState, useMemo, useState } from "react";
import { bookIntake, type BookingFormState } from "@/app/actions";
import { formatSlotDay, formatSlotTime } from "@/lib/slots";

export function BookingForm({ coachId, intakeId, slots }: { coachId: string; intakeId?: string; slots: string[] }) {
  const [state, action, pending] = useActionState<BookingFormState, FormData>(bookIntake, {});
  const days = useMemo(() => {
    const byDay = new Map<string, string[]>();
    for (const s of slots) {
      const day = formatSlotDay(new Date(s));
      byDay.set(day, [...(byDay.get(day) ?? []), s]);
    }
    return [...byDay.entries()];
  }, [slots]);
  const [day, setDay] = useState(days[0]?.[0]);
  const [slot, setSlot] = useState<string>();

  if (days.length === 0) return <p className="mt-4 text-ink-soft">Er zijn op dit moment geen vrije momenten.</p>;

  return (
    <form action={action} className="mt-5 space-y-5">
      <input type="hidden" name="coachId" value={coachId} />
      {intakeId && <input type="hidden" name="intakeId" value={intakeId} />}

      <div>
        <span className="label">Kies een dag</span>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {days.map(([d]) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                setDay(d);
                setSlot(undefined);
              }}
              className={`shrink-0 rounded-xl border px-3 py-2 text-sm capitalize ${day === d ? "border-brand bg-brand-soft font-semibold" : "border-line"}`}
            >
              {d.replace(/ \w+$/, "")}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="label">Kies een tijd</span>
        <div className="grid grid-cols-4 gap-2">
          {days
            .find(([d]) => d === day)?.[1]
            .map((s) => (
              <label key={s} className="cursor-pointer">
                <input
                  type="radio"
                  name="startsAt"
                  value={s}
                  required
                  checked={slot === s}
                  onChange={() => setSlot(s)}
                  className="peer sr-only"
                />
                <span className="block rounded-lg border border-line py-2 text-center text-sm peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white">
                  {formatSlotTime(new Date(s))}
                </span>
              </label>
            ))}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="clientName">Je naam</label>
        <input id="clientName" name="clientName" required minLength={2} className="input" autoComplete="name" />
      </div>
      <div>
        <label className="label" htmlFor="clientEmail">E-mailadres</label>
        <input id="clientEmail" name="clientEmail" type="email" required className="input" autoComplete="email" />
      </div>
      <div>
        <label className="label" htmlFor="clientPhone">Telefoon (optioneel, voor een herinnering)</label>
        <input id="clientPhone" name="clientPhone" type="tel" className="input" autoComplete="tel" />
      </div>
      <fieldset>
        <legend className="label">Hoe wil je het gesprek voeren?</legend>
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" name="mode" value="platform" defaultChecked /> Videobellen via ons platform
        </label>
        <label className="mt-1 flex items-center gap-2 text-sm">
          <input type="radio" name="mode" value="eigen-tool" /> Via de coach (Zoom, WhatsApp of telefoon)
        </label>
      </fieldset>

      {state.error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}

      <button type="submit" className="btn w-full" disabled={pending || !slot}>
        {pending ? "Bezig met inplannen..." : "Plan gratis intake"}
      </button>
    </form>
  );
}
