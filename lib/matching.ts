import { DIMENSIONS, type StyleScores } from "./style";
import { nicheShort, splitList } from "./niches";

export type ClientProfile = StyleScores & {
  goal: string;
  level: string;
  budget: number;
  busy: boolean;
  guidance: string;
};

export type CoachCandidate = StyleScores & {
  id: string;
  name: string;
  niches: string;
  mainNiche: string;
  icpLevels: string;
  worksWithBusy: boolean;
  offersLive: boolean;
  status: string;
  available: boolean;
  maxClients: number;
  activeClients: number;
  responseHours: number;
  yearsExperience: number;
  cheapestPrice: number | null;
  reviewCount: number;
  averageRating: number | null;
};

export type MatchResult = {
  coachId: string;
  score: number;
  reasons: string[];
  overBudget: boolean;
};

// Startgewichten (som = 1). Bijstellen zodra we zien welke matches tot deals leiden.
export const WEIGHTS = {
  style: 0.35,
  goal: 0.25,
  icp: 0.15,
  quality: 0.15,
  availability: 0.1,
} as const;

const NEW_COACH_QUALITY = 0.7;

export function styleSimilarity(a: StyleScores, b: StyleScores): number {
  const maxDistance = DIMENSIONS.length * 4;
  const distance = DIMENSIONS.reduce((sum, d) => sum + Math.abs(a[d.key] - b[d.key]), 0);
  return 1 - distance / maxDistance;
}

function passesHardFilters(client: ClientProfile, coach: CoachCandidate): boolean {
  if (coach.status !== "active" || !coach.available) return false;
  if (coach.activeClients >= coach.maxClients) return false;
  if (!splitList(coach.niches).includes(client.goal)) return false;
  if (client.guidance === "live" && !coach.offersLive) return false;
  if (coach.cheapestPrice === null) return false;
  return true;
}

function withinBudget(client: ClientProfile, coach: CoachCandidate): boolean {
  return coach.cheapestPrice !== null && coach.cheapestPrice <= client.budget;
}

function qualityScore(coach: CoachCandidate): number {
  if (coach.reviewCount === 0 || coach.averageRating === null) return NEW_COACH_QUALITY;
  return coach.averageRating / 5;
}

function availabilityScore(coach: CoachCandidate): number {
  if (coach.responseHours <= 12) return 1;
  if (coach.responseHours <= 24) return 0.8;
  return 0.5;
}

function icpScore(client: ClientProfile, coach: CoachCandidate): number {
  const levelFit = splitList(coach.icpLevels).includes(client.level) ? 0.7 : 0.2;
  const busyFit = !client.busy || coach.worksWithBusy ? 0.3 : 0;
  return levelFit + busyFit;
}

// Twee redenen: de sterkste stijlreden (persoonlijkheid is onze belofte) en de
// sterkste overige reden. Zonder stijlreden worden het twee overige redenen.
function buildReasons(client: ClientProfile, coach: CoachCandidate): string[] {
  const style: { weight: number; text: string }[] = [];
  const reasons: { weight: number; text: string }[] = [];

  for (const d of DIMENSIONS) {
    const c = client[d.key];
    const k = coach[d.key];
    // Alleen uitgesproken voorkeuren zijn een reden; een 3 is neutraal.
    if (c === 3 || Math.abs(c - k) > 1) continue;
    const text = c > 3 ? d.reasonHigh : d.reasonLow;
    style.push({ weight: Math.abs(c - 3) - Math.abs(c - k), text });
  }

  if (coach.mainNiche === client.goal) {
    reasons.push({ weight: 3.5, text: `Gespecialiseerd in ${nicheShort(client.goal)}` });
  } else {
    reasons.push({ weight: 1.5, text: `Heeft ervaring met ${nicheShort(client.goal)}` });
  }

  if (coach.reviewCount >= 3 && coach.averageRating !== null && coach.averageRating >= 4.5) {
    const rating = coach.averageRating.toFixed(1).replace(".", ",");
    reasons.push({ weight: 3, text: `${rating} sterren uit ${coach.reviewCount} geverifieerde reviews` });
  }

  if (client.busy && coach.worksWithBusy) {
    reasons.push({ weight: 2.5, text: "Werkt veel met ondernemers en drukke agenda's" });
  }

  if (splitList(coach.icpLevels).includes(client.level) && client.level === "beginner") {
    reasons.push({ weight: 2, text: "Begeleidt graag beginners" });
  }

  if (coach.yearsExperience >= 5) {
    reasons.push({ weight: 1.8, text: `${coach.yearsExperience} jaar ervaring als coach` });
  }

  const byWeight = (a: { weight: number }, b: { weight: number }) => b.weight - a.weight;
  const [bestStyle] = style.sort(byWeight);
  const others = reasons.sort(byWeight).map((r) => r.text);
  return bestStyle ? [bestStyle.text, ...others] : others;
}

export function scoreCoach(client: ClientProfile, coach: CoachCandidate): number {
  const goal = coach.mainNiche === client.goal ? 1 : 0.5;
  const total =
    WEIGHTS.style * styleSimilarity(client, coach) +
    WEIGHTS.goal * goal +
    WEIGHTS.icp * icpScore(client, coach) +
    WEIGHTS.quality * qualityScore(coach) +
    WEIGHTS.availability * availabilityScore(coach);
  return Math.round(total * 100);
}

/**
 * Geeft de beste coaches voor een klant. Eerst harde filters, dan een score van
 * 0 tot 100. Zijn er minder dan `limit` coaches binnen budget, dan vullen we aan
 * met coaches die net boven budget zitten (gemarkeerd), zodat de klant nooit een
 * lege pagina krijgt. Betaalde zichtbaarheid speelt hier bewust geen rol.
 */
export function findMatches(client: ClientProfile, coaches: CoachCandidate[], limit = 3): MatchResult[] {
  const eligible = coaches.filter((c) => passesHardFilters(client, c));

  const rank = (list: CoachCandidate[], overBudget: boolean): MatchResult[] =>
    list
      .map((coach) => ({
        coachId: coach.id,
        score: scoreCoach(client, coach),
        reasons: buildReasons(client, coach).slice(0, 2),
        overBudget,
      }))
      .sort((a, b) => b.score - a.score);

  const inBudget = rank(eligible.filter((c) => withinBudget(client, c)), false);
  if (inBudget.length >= limit) return inBudget.slice(0, limit);

  const overBudget = rank(eligible.filter((c) => !withinBudget(client, c)), true);
  return [...inBudget, ...overBudget].slice(0, limit);
}
