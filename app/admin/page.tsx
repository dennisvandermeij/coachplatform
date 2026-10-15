import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { nicheLabel } from "@/lib/niches";
import { formatSlotDay, formatSlotTime } from "@/lib/slots";
import { isAdmin, logout, setAppointmentStatus, setCoachStatus, toggleAvailability } from "./actions";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Beheer", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="heading text-3xl font-semibold">Beheer</h1>
        <LoginForm />
      </section>
    );
  }

  const [pending, active, appointments, intakeCount] = await Promise.all([
    db.coach.findMany({ where: { status: "pending" }, include: { packages: true }, orderBy: { createdAt: "asc" } }),
    db.coach.findMany({ where: { status: "active" }, orderBy: { name: "asc" } }),
    db.appointment.findMany({
      where: { startsAt: { gt: new Date(Date.now() - 7 * 86400000) } },
      include: { coach: true },
      orderBy: { startsAt: "asc" },
    }),
    db.intake.count(),
  ]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="heading text-3xl font-semibold">Beheer</h1>
        <form action={logout}><button className="text-sm text-ink-soft hover:text-brand">Uitloggen</button></form>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {[
          ["Quickscans", intakeCount],
          ["Actieve coaches", active.length],
          ["Wachten op controle", pending.length],
          ["Intakes (vanaf 7 dagen terug)", appointments.length],
        ].map(([label, value]) => (
          <div key={label} className="card">
            <p className="text-sm text-ink-soft">{label}</p>
            <p className="text-3xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <h2 className="heading mt-12 text-2xl font-semibold">Nieuwe aanmeldingen</h2>
      {pending.length === 0 && <p className="mt-3 text-ink-soft">Geen aanmeldingen om te controleren.</p>}
      <div className="mt-4 space-y-4">
        {pending.map((c) => (
          <div key={c.id} className="card">
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div className="space-y-1 text-sm">
                <p className="text-lg font-semibold">{c.name}</p>
                <p>{c.email}{c.phone ? ` · ${c.phone}` : ""}</p>
                <p>KvK: <strong>{c.kvkNumber}</strong> · {c.yearsExperience} jaar ervaring · {nicheLabel(c.mainNiche)}</p>
                <p>Certificaten: {c.certificates}</p>
                <p className="text-ink-soft">{c.bio}</p>
                {c.packages.map((p) => (
                  <p key={p.id}>Pakket: {p.name}, € {p.pricePerMonth} per maand, {p.months} mnd</p>
                ))}
              </div>
              <div className="flex shrink-0 gap-2 sm:flex-col">
                <form action={setCoachStatus}>
                  <input type="hidden" name="coachId" value={c.id} />
                  <button name="status" value="active" className="btn px-4 py-2 text-sm">Goedkeuren</button>
                </form>
                <form action={setCoachStatus}>
                  <input type="hidden" name="coachId" value={c.id} />
                  <button name="status" value="rejected" className="btn-ghost px-4 py-2 text-sm">Afwijzen</button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="heading mt-12 text-2xl font-semibold">Intakes</h2>
      {appointments.length === 0 ? (
        <p className="mt-3 text-ink-soft">Nog geen intakes.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-ink-soft">
              <tr>
                <th className="py-2 pr-4">Moment</th>
                <th className="py-2 pr-4">Klant</th>
                <th className="py-2 pr-4">Coach</th>
                <th className="py-2 pr-4">Vorm</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-t border-line">
                  <td className="py-2 pr-4 first-letter:uppercase">{formatSlotDay(a.startsAt)} {formatSlotTime(a.startsAt)}</td>
                  <td className="py-2 pr-4">{a.clientName}<br /><span className="text-ink-soft">{a.clientEmail}</span></td>
                  <td className="py-2 pr-4">{a.coach.name}</td>
                  <td className="py-2 pr-4">{a.mode === "platform" ? "Platform" : "Eigen tool"}</td>
                  <td className="py-2">
                    <form action={setAppointmentStatus} className="flex gap-1">
                      <input type="hidden" name="appointmentId" value={a.id} />
                      {["gepland", "gehouden", "no-show", "geannuleerd"].map((s) => (
                        <button
                          key={s}
                          name="status"
                          value={s}
                          className={`rounded-full px-2 py-1 text-xs ${a.status === s ? "bg-brand text-white" : "border border-line"}`}
                        >
                          {s}
                        </button>
                      ))}
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="heading mt-12 text-2xl font-semibold">Actieve coaches</h2>
      <div className="mt-4 space-y-2">
        {active.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-xl border border-line bg-card px-4 py-3 text-sm">
            <Link href={`/coaches/${c.slug}`} className="font-medium hover:text-brand">{c.name}</Link>
            <div className="flex items-center gap-3">
              <span className="text-ink-soft">{c.activeClients}/{c.maxClients} klanten</span>
              <form action={toggleAvailability}>
                <input type="hidden" name="coachId" value={c.id} />
                <button className={`rounded-full px-3 py-1 text-xs ${c.available ? "bg-brand-soft text-brand-dark" : "border border-line text-ink-soft"}`}>
                  {c.available ? "Beschikbaar" : "Gepauzeerd"}
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
