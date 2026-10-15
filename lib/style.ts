// De vijf dimensies waarop klant en coach elkaar moeten passen. De klant en de
// coach beantwoorden elk één stelling per dimensie op een schaal van 1 tot 5.
export const DIMENSIONS = [
  {
    key: "directness",
    name: "Directheid",
    low: "Mild en bemoedigend",
    high: "Recht voor zijn raap",
    client: "Ik wil dat mijn coach eerlijk zegt wanneer ik er een potje van maak.",
    coach: "Ik zeg klanten direct en eerlijk waar het op staat.",
    reasonHigh: "Communiceert direct en eerlijk, zoals jij wilt",
    reasonLow: "Coacht mild en bemoedigend, zoals jij wilt",
  },
  {
    key: "structure",
    name: "Structuur",
    low: "Flexibel, in overleg",
    high: "Strak schema",
    client: "Ik werk het best met een precies plan per dag.",
    coach: "Ik werk met strakke schema's en duidelijke regels.",
    reasonHigh: "Werkt met een strak en duidelijk plan",
    reasonLow: "Werkt flexibel en past het plan aan op jouw week",
  },
  {
    key: "depth",
    name: "Diepgang",
    low: "Gewoon doen",
    high: "Uitleg en wetenschap",
    client: "Ik wil weten waarom iets werkt, niet alleen wat ik moet doen.",
    coach: "Ik leg klanten uit waarom iets werkt, met de wetenschap erachter.",
    reasonHigh: "Legt uit waarom iets werkt, niet alleen wat",
    reasonLow: "Houdt het praktisch en simpel",
  },
  {
    key: "contact",
    name: "Contact",
    low: "Zelfstandig",
    high: "Dagelijks contact",
    client: "Ik heb iemand nodig die me dagelijks scherp houdt.",
    coach: "Ik heb dagelijks contact met mijn klanten.",
    reasonHigh: "Houdt dagelijks contact en houdt je scherp",
    reasonLow: "Geeft je ruimte om zelfstandig te werken",
  },
  {
    key: "pace",
    name: "Tempo",
    low: "Rustig opbouwen",
    high: "Maximaal pushen",
    client: "Ik wil zo snel mogelijk resultaat, ook als het zwaar is.",
    coach: "Ik push klanten naar hun grens voor snel resultaat.",
    reasonHigh: "Gaat voor snel resultaat en pusht je",
    reasonLow: "Bouwt rustig en duurzaam op",
  },
] as const;

export type DimensionKey = (typeof DIMENSIONS)[number]["key"];

export type StyleScores = Record<DimensionKey, number>;

export function parseScore(value: FormDataEntryValue | null): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 5) throw new Error("Ongeldige score");
  return n;
}
