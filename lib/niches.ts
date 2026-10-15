export const NICHES = [
  { key: "afslankmedicatie", label: "Begeleiding bij afslankmedicatie", short: "afslankmedicatie" },
  { key: "afvallen", label: "Afvallen", short: "afvallen" },
  { key: "spiermassa", label: "Spiermassa opbouwen", short: "spiermassa" },
  { key: "bodybuilding", label: "Bodybuilding en wedstrijdvoorbereiding", short: "bodybuilding" },
  { key: "hyrox", label: "Hyrox", short: "Hyrox" },
  { key: "triathlon", label: "Triathlon en duursport", short: "triathlon" },
  { key: "krachtsport", label: "Krachtsport", short: "krachtsport" },
  { key: "gezond-leven", label: "Gezond leven zonder calorieën tellen", short: "gezond leven" },
] as const;

export type NicheKey = (typeof NICHES)[number]["key"];

export function nicheLabel(key: string): string {
  return NICHES.find((n) => n.key === key)?.label ?? key;
}

export function nicheShort(key: string): string {
  return NICHES.find((n) => n.key === key)?.short ?? key;
}

export const LEVELS = [
  { key: "beginner", label: "Beginner" },
  { key: "ervaren", label: "Enige ervaring" },
  { key: "gevorderd", label: "Gevorderd" },
] as const;

export const BUDGETS = [
  { value: 100, label: "Tot € 100 per maand" },
  { value: 200, label: "Tot € 200 per maand" },
  { value: 300, label: "Tot € 300 per maand" },
  { value: 10000, label: "Meer dan € 300 per maand" },
] as const;

export const GUIDANCE = [
  { key: "online", label: "Alleen online (app, chat, check-ins)" },
  { key: "video", label: "Online met videobellen" },
  { key: "live", label: "Ook af en toe live trainen" },
] as const;

export function splitList(value: string): string[] {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}
