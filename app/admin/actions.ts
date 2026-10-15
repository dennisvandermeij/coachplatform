"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const COOKIE = "admin_session";

function sessionToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHash("sha256").update(`coachplatform-admin:${password}`).digest("hex");
}

export async function isAdmin(): Promise<boolean> {
  const expected = sessionToken();
  const actual = (await cookies()).get(COOKIE)?.value;
  if (!expected || !actual || actual.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}

async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin");
}

export async function login(_prev: { error?: string }, form: FormData): Promise<{ error?: string }> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return { error: "ADMIN_PASSWORD is niet ingesteld op de server." };
  const given = String(form.get("password") ?? "");
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(password).digest();
  if (!timingSafeEqual(a, b)) return { error: "Onjuist wachtwoord." };

  (await cookies()).set(COOKIE, sessionToken()!, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 12,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
  redirect("/admin");
}

export async function setCoachStatus(form: FormData) {
  await requireAdmin();
  const status = String(form.get("status"));
  if (!["active", "rejected", "pending"].includes(status)) return;
  await db.coach.update({ where: { id: String(form.get("coachId")) }, data: { status } });
  revalidatePath("/admin");
}

export async function toggleAvailability(form: FormData) {
  await requireAdmin();
  const coach = await db.coach.findUnique({ where: { id: String(form.get("coachId")) } });
  if (!coach) return;
  await db.coach.update({ where: { id: coach.id }, data: { available: !coach.available } });
  revalidatePath("/admin");
}

export async function setAppointmentStatus(form: FormData) {
  await requireAdmin();
  const status = String(form.get("status"));
  if (!["gepland", "gehouden", "no-show", "geannuleerd"].includes(status)) return;
  await db.appointment.update({ where: { id: String(form.get("appointmentId")) }, data: { status } });
  revalidatePath("/admin");
}
