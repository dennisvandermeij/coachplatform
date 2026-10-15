"use client";

type Props = {
  name: string;
  statement: string;
  low: string;
  high: string;
  value?: number;
  onChange?: (value: number) => void;
};

// Stelling met een schaal van 1 (helemaal oneens) tot 5 (helemaal eens).
export function ScaleQuestion({ name, statement, low, high, value, onChange }: Props) {
  return (
    <fieldset className="card">
      <legend className="sr-only">{statement}</legend>
      <p className="text-lg font-medium">{statement}</p>
      <div className="mt-4 grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={n}
              required
              checked={value === undefined ? undefined : value === n}
              onChange={() => onChange?.(n)}
              className="peer sr-only"
            />
            <span className="flex h-12 items-center justify-center rounded-xl border border-line font-semibold transition peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand hover:border-brand">
              {n}
            </span>
          </label>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-ink-soft">
        <span>Oneens · {low}</span>
        <span className="text-right">Eens · {high}</span>
      </div>
    </fieldset>
  );
}
