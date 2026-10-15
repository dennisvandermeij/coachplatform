import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatSlotDay, formatSlotTime } from "@/lib/slots";

export default async function IntakeConfirmedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const appointment = await db.appointment.findUnique({ where: { id }, include: { coach: true } });
  if (!appointment) notFound();

  const firstName = appointment.coach.name.split(" ")[0];

  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <p className="chip">Intake ingepland</p>
      <h1 className="heading mt-4 text-3xl font-semibold sm:text-4xl">
        Je gesprek met {appointment.coach.name} staat gepland
      </h1>
      <div className="card mt-8">
        <p className="text-lg font-semibold first-letter:uppercase">
          {formatSlotDay(appointment.startsAt)} om {formatSlotTime(appointment.startsAt)}
        </p>
        <p className="mt-1 text-ink-soft">
          {appointment.mode === "platform"
            ? "Videogesprek via ons platform. Je ontvangt de link per e-mail."
            : `${firstName} neemt contact met je op via Zoom, WhatsApp of telefoon.`}
        </p>
      </div>
      <h2 className="heading mt-10 text-xl font-semibold">Wat gebeurt er nu?</h2>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-ink-soft">
        <li>Je krijgt een bevestiging op {appointment.clientEmail}.</li>
        <li>In het gesprek bespreek je je doel en kijk je of het klikt.</li>
        <li>Klikt het? Dan stuurt {firstName} je een voorstel en start je traject veilig via ons platform.</li>
      </ol>
      <Link href="/" className="btn-ghost mt-10">
        Terug naar de homepage
      </Link>
    </section>
  );
}
