import type { Metadata } from "next";
import { QuickscanForm } from "./QuickscanForm";

export const metadata: Metadata = { title: "Quickscan | Vind je coach" };

export default function QuickscanPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <QuickscanForm />
    </section>
  );
}
