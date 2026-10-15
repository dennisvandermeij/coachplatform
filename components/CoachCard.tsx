import Link from "next/link";
import { formatRating } from "@/lib/coaches";
import { nicheLabel } from "@/lib/niches";

type Props = {
  slug: string;
  name: string;
  mainNiche: string;
  city: string | null;
  yearsExperience: number;
  cheapestPrice: number | null;
  reviewCount: number;
  averageRating: number | null;
  full: boolean;
  href?: string;
  ctaLabel?: string;
  children?: React.ReactNode;
};

export function Initials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-soft font-serif text-xl font-semibold text-brand-dark">
      {initials}
    </div>
  );
}

export function RatingLine({ reviewCount, averageRating }: { reviewCount: number; averageRating: number | null }) {
  if (!reviewCount || averageRating === null) return <span className="text-sm text-ink-soft">Nieuw op het platform</span>;
  return (
    <span className="text-sm">
      <span className="text-accent">★</span> <strong>{formatRating(averageRating)}</strong>{" "}
      <span className="text-ink-soft">({reviewCount} geverifieerde reviews)</span>
    </span>
  );
}

export function CoachCard(props: Props) {
  return (
    <article className="card flex h-full flex-col">
      <div className="flex items-start gap-4">
        <Initials name={props.name} />
        <div>
          <h3 className="text-lg font-semibold">{props.name}</h3>
          <p className="text-sm text-ink-soft">
            {nicheLabel(props.mainNiche)}
            {props.city ? ` · ${props.city}` : ""}
          </p>
          <RatingLine reviewCount={props.reviewCount} averageRating={props.averageRating} />
        </div>
      </div>
      {props.children}
      <div className="mt-auto flex items-end justify-between gap-3 pt-5">
        <p className="text-sm text-ink-soft">
          {props.cheapestPrice !== null ? (
            <>
              Vanaf <strong className="text-ink">€ {props.cheapestPrice}</strong> per maand
            </>
          ) : (
            "Prijs op aanvraag"
          )}
          <br />
          {props.yearsExperience} jaar ervaring
        </p>
        <div className="flex flex-col items-end gap-1">
          {props.full && <span className="text-xs font-medium text-ink-soft">Neemt nu geen klanten aan</span>}
          <Link href={props.href ?? `/coaches/${props.slug}`} className="btn px-4 py-2 text-sm">
            {props.ctaLabel ?? "Bekijk profiel"}
          </Link>
        </div>
      </div>
    </article>
  );
}
