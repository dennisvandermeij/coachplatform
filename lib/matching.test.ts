import { describe, expect, it } from "vitest";
import { findMatches, scoreCoach, styleSimilarity, type ClientProfile, type CoachCandidate } from "./matching";

const client: ClientProfile = {
  goal: "hyrox",
  level: "ervaren",
  budget: 200,
  busy: true,
  guidance: "video",
  directness: 5,
  structure: 4,
  depth: 5,
  contact: 3,
  pace: 4,
};

function coach(overrides: Partial<CoachCandidate> = {}): CoachCandidate {
  return {
    id: "c1",
    name: "Coach",
    niches: "hyrox,krachtsport",
    mainNiche: "hyrox",
    icpLevels: "ervaren,gevorderd",
    worksWithBusy: true,
    offersLive: false,
    status: "active",
    available: true,
    maxClients: 20,
    activeClients: 5,
    responseHours: 12,
    yearsExperience: 6,
    cheapestPrice: 150,
    reviewCount: 10,
    averageRating: 4.8,
    directness: 5,
    structure: 4,
    depth: 5,
    contact: 3,
    pace: 4,
    ...overrides,
  };
}

describe("styleSimilarity", () => {
  it("is 1 bij gelijke stijl en 0 bij tegengestelde stijl", () => {
    expect(styleSimilarity(client, coach())).toBe(1);
    const a = { directness: 1, structure: 1, depth: 1, contact: 1, pace: 1 };
    const b = { directness: 5, structure: 5, depth: 5, contact: 5, pace: 5 };
    expect(styleSimilarity(a, b)).toBe(0);
  });
});

describe("findMatches", () => {
  it("filtert coaches zonder het doel, inactieve, volle en onbeschikbare coaches", () => {
    const result = findMatches(client, [
      coach({ id: "ok" }),
      coach({ id: "ander-doel", niches: "afvallen", mainNiche: "afvallen" }),
      coach({ id: "pending", status: "pending" }),
      coach({ id: "vol", activeClients: 20 }),
      coach({ id: "pauze", available: false }),
    ]);
    expect(result.map((r) => r.coachId)).toEqual(["ok"]);
  });

  it("vereist live begeleiding als de klant daarom vraagt", () => {
    const live = { ...client, guidance: "live" };
    const result = findMatches(live, [coach({ id: "online" }), coach({ id: "live", offersLive: true })]);
    expect(result.map((r) => r.coachId)).toEqual(["live"]);
  });

  it("zet de best passende stijl bovenaan", () => {
    const result = findMatches(client, [
      coach({ id: "mild", directness: 1, depth: 1 }),
      coach({ id: "direct" }),
    ]);
    expect(result[0].coachId).toBe("direct");
    expect(result[0].score).toBeGreaterThan(result[1].score);
  });

  it("vult aan met coaches boven budget als er te weinig binnen budget zijn", () => {
    const result = findMatches(client, [coach({ id: "binnen" }), coach({ id: "duur", cheapestPrice: 400 })]);
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ coachId: "binnen", overBudget: false });
    expect(result[1]).toMatchObject({ coachId: "duur", overBudget: true });
  });

  it("geeft maximaal twee redenen", () => {
    const [match] = findMatches(client, [coach()]);
    expect(match.reasons).toHaveLength(2);
    expect(match.reasons).toEqual(["Communiceert direct en eerlijk, zoals jij wilt", "Gespecialiseerd in Hyrox"]);
  });

  it("geeft een nieuwe coach zonder reviews een eerlijke kans", () => {
    const nieuw = scoreCoach(client, coach({ reviewCount: 0, averageRating: null }));
    const slecht = scoreCoach(client, coach({ reviewCount: 10, averageRating: 2.5 }));
    expect(nieuw).toBeGreaterThan(slecht);
  });
});
