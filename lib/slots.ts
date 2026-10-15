// Intakeslots: werkdagen, 09:00 tot 17:00 (Nederlandse tijd), per heel uur, de
// komende 10 dagen vanaf morgen. Later vervangen door de echte agenda van de coach.
const TIMEZONE = "Europe/Amsterdam";

function amsterdamOffsetMinutes(date: Date): number {
  const local = new Date(date.toLocaleString("en-US", { timeZone: TIMEZONE }));
  const utc = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  return (local.getTime() - utc.getTime()) / 60000;
}

export function upcomingSlots(now: Date, taken: Date[], days = 10): Date[] {
  const takenSet = new Set(taken.map((d) => d.getTime()));
  const slots: Date[] = [];
  for (let i = 1; i <= days; i++) {
    const day = new Date(now.getTime() + i * 86400000);
    const ymd = day.toLocaleDateString("en-CA", { timeZone: TIMEZONE });
    const weekday = new Date(`${ymd}T12:00:00Z`).getUTCDay();
    if (weekday === 0 || weekday === 6) continue;
    for (let hour = 9; hour < 17; hour++) {
      const naive = new Date(`${ymd}T${String(hour).padStart(2, "0")}:00:00Z`);
      const slot = new Date(naive.getTime() - amsterdamOffsetMinutes(naive) * 60000);
      if (!takenSet.has(slot.getTime())) slots.push(slot);
    }
  }
  return slots;
}

export function formatSlotDay(date: Date): string {
  return date.toLocaleDateString("nl-NL", { timeZone: TIMEZONE, weekday: "long", day: "numeric", month: "long" });
}

export function formatSlotTime(date: Date): string {
  return date.toLocaleTimeString("nl-NL", { timeZone: TIMEZONE, hour: "2-digit", minute: "2-digit" });
}
