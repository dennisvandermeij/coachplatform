import { db } from "./db";
import type { CoachCandidate } from "./matching";

const withRelations = { packages: true, reviews: true } as const;

type CoachWithRelations = Awaited<ReturnType<typeof loadActiveCoaches>>[number];

export async function loadActiveCoaches(niche?: string) {
  return db.coach.findMany({
    where: { status: "active", ...(niche ? { niches: { contains: niche } } : {}) },
    include: withRelations,
    orderBy: { createdAt: "asc" },
  });
}

export function coachStats(coach: CoachWithRelations) {
  const reviewCount = coach.reviews.length;
  const averageRating = reviewCount ? coach.reviews.reduce((s, r) => s + r.rating, 0) / reviewCount : null;
  const cheapestPrice = coach.packages.length ? Math.min(...coach.packages.map((p) => p.pricePerMonth)) : null;
  const full = !coach.available || coach.activeClients >= coach.maxClients;
  return { reviewCount, averageRating, cheapestPrice, full };
}

export function toCandidate(coach: CoachWithRelations): CoachCandidate {
  const { reviewCount, averageRating, cheapestPrice } = coachStats(coach);
  return { ...coach, reviewCount, averageRating, cheapestPrice };
}

export function formatRating(rating: number): string {
  return rating.toFixed(1).replace(".", ",");
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
