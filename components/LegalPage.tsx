import { SITE_NAME } from "@/lib/site";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <p className="rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm">
        <strong>Concept.</strong> Deze tekst is nog niet gecontroleerd door een jurist en is nog niet definitief.
      </p>
      <h1 className="heading mt-8 text-3xl font-semibold sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-ink-soft">{SITE_NAME} · versie 0.1</p>
      <div className="mt-8 space-y-4 leading-relaxed text-ink-soft [&_h2]:heading [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc">
        {children}
      </div>
    </article>
  );
}
