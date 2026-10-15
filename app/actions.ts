"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { loadActiveCoaches, slugify, toCandidate } from "@/lib/coaches";
import { findMatches } from "@/lib/matching";
import { NICHES, LEVELS, GUIDANCE } from "@/lib/niches";
import { DIMENSIONS, parseScore } from "@/lib/style";
import { upcomingSlots } from "@/lib/slots";

const nicheKeys = NICHES.map((n) => n.key) as [string, ...string[]];
const levelKeys = LEVELS.map((l) => l.key) as [string, ...string[]];
const guidanceKeys = GUIDANCE.map((g) => g.key) as [string, ...string[]];

function styleFrom(form: FormData) {
  return Object.fromEntries(DIMENSIONS.map((d) => [d.key, parseScore(form.get(d.key))])) as Record<
    (typeof DIMENSIONS)[number]["key"],
    number
  >;
}

const intakeSchema = z.object({
  goal: z.enum(nicheKeys),
  level: z.enum(levelKeys),
  budget: z.coerce.number().int().positive(),
  busy: z.enum(["ja", "nee"]),
  guidance: z.enum(guidanceKeys),
});

export async function createIntake(form: FormData) {
  const data = intakeSchema.parse(Object.fromEntries(form));
  const style = styleFrom(form);

  const intake = await db.intake.create({
    data: { ...data, busy: data.busy === "ja", ...style },
  });

  const coaches = await loadActiveCoaches();
  const matches = findMatches({ ...intake }, coaches.map(toCandidate));

  await db.match.createMany({
    data: matches.map((m, i) => ({
      intakeId: intake.id,
      coachId: m.coachId,
      score: m.score,
      reasons: JSON.stringify(m.reasons),
      rank: i + 1,
      overBudget: m.overBudget,
    })),
  });

  redirect(`/matches/${intake.id}`);
}

const coachSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().max(30).optional(),
  kvkNumber: z.string().trim().regex(/^\d{8}$/, "Een KvK-nummer heeft 8 cijfers"),
  certificates: z.string().trim().min(2).max(500),
  bio: z.string().trim().min(40).max(1500),
  city: z.string().trim().max(80).optional(),
  offersLive: z.enum(["ja", "nee"]),
  mainNiche: z.enum(nicheKeys),
  yearsExperience: z.coerce.number().int().min(0).max(50),
  worksWithBusy: z.enum(["ja", "nee"]),
  maxClients: z.coerce.number().int().min(1).max(200),
  packageName: z.string().trim().min(2).max(80),
  packagePrice: z.coerce.number().int().min(10).max(5000),
  packageMonths: z.coerce.number().int().min(1).max(24),
  packageDescription: z.string().trim().min(10).max(500),
});

export type CoachFormState = { error?: string };

export async function createCoach(_prev: CoachFormState, form: FormData): Promise<CoachFormState> {
  const parsed = coachSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Controleer je gegevens." };
  }
  const data = parsed.data;

  const niches = form.getAll("niches").map(String).filter((n) => nicheKeys.includes(n));
  if (!niches.includes(data.mainNiche)) niches.push(data.mainNiche);
  const icpLevels = form.getAll("icpLevels").map(String).filter((l) => levelKeys.includes(l));
  if (icpLevels.length === 0) return { error: "Kies minstens één niveau van klanten." };

  let style;
  try {
    style = styleFrom(form);
  } catch {
    return { error: "Beantwoord alle stellingen over je coachstijl." };
  }

  const existing = await db.coach.findUnique({ where: { email: data.email } });
  if (existing) return { error: "Er is al een aanmelding met dit e-mailadres." };

  const base = slugify(data.name) || "coach";
  let slug = base;
  for (let i = 2; await db.coach.findUnique({ where: { slug } }); i++) slug = `${base}-${i}`;

  await db.coach.create({
    data: {
      slug,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      kvkNumber: data.kvkNumber,
      certificates: data.certificates,
      bio: data.bio,
      city: data.city || null,
      offersLive: data.offersLive === "ja",
      niches: niches.join(","),
      mainNiche: data.mainNiche,
      icpLevels: icpLevels.join(","),
      worksWithBusy: data.worksWithBusy === "ja",
      yearsExperience: data.yearsExperience,
      maxClients: data.maxClients,
      ...style,
      packages: {
        create: {
          name: data.packageName,
          pricePerMonth: data.packagePrice,
          months: data.packageMonths,
          description: data.packageDescription,
        },
      },
    },
  });

  redirect("/voor-coaches/bedankt");
}

const appointmentSchema = z.object({
  coachId: z.string().min(1),
  intakeId: z.string().optional(),
  clientName: z.string().trim().min(2).max(80),
  clientEmail: z.string().trim().toLowerCase().email(),
  clientPhone: z.string().trim().max(30).optional(),
  startsAt: z.string().datetime(),
  mode: z.enum(["platform", "eigen-tool"]),
});

export type BookingFormState = { error?: string };

export async function bookIntake(_prev: BookingFormState, form: FormData): Promise<BookingFormState> {
  const parsed = appointmentSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Vul je naam, e-mailadres en een tijdstip in." };
  const data = parsed.data;

  const coach = await db.coach.findUnique({ where: { id: data.coachId } });
  if (!coach || coach.status !== "active") return { error: "Deze coach is niet beschikbaar." };
  if (!coach.available || coach.activeClients >= coach.maxClients) {
    return { error: "Deze coach neemt op dit moment geen nieuwe klanten aan." };
  }

  const startsAt = new Date(data.startsAt);
  const validSlot = upcomingSlots(new Date(), []).some((s) => s.getTime() === startsAt.getTime());
  if (!validSlot) return { error: "Kies een van de beschikbare tijdstippen." };

  const intakeId = data.intakeId && (await db.intake.findUnique({ where: { id: data.intakeId } })) ? data.intakeId : null;

  let appointmentId: string;
  try {
    const appointment = await db.appointment.create({
      data: {
        coachId: coach.id,
        intakeId,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone || null,
        startsAt,
        mode: data.mode,
      },
    });
    appointmentId = appointment.id;
  } catch {
    return { error: "Dit tijdstip is net geboekt. Kies een ander moment." };
  }

  redirect(`/intake/${appointmentId}`);
}
