import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: `${SITE_NAME} | Vind de coach die bij je past`,
  description:
    "Doe de gratis quickscan en ontdek welke online coach bij jouw doel en persoonlijkheid past. Alleen geverifieerde coaches en echte reviews.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="min-h-screen antialiased">
        <header className="border-b border-line bg-paper/90 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
            <Link href="/" className="heading text-xl font-semibold">
              {SITE_NAME}
            </Link>
            <div className="flex items-center gap-5 text-sm font-medium">
              <Link href="/coaches" className="hidden hover:text-brand sm:inline">
                Alle coaches
              </Link>
              <Link href="/voor-coaches" className="hidden hover:text-brand sm:inline">
                Voor coaches
              </Link>
              <Link href="/quickscan" className="btn px-4 py-2 text-sm">
                Doe de quickscan
              </Link>
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="mt-24 border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-ink-soft sm:flex-row sm:justify-between">
            <p>
              © {new Date().getFullYear()} {SITE_NAME}. Alleen geverifieerde coaches.
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link href="/coaches" className="hover:text-brand">Alle coaches</Link>
              <Link href="/voor-coaches" className="hover:text-brand">Voor coaches</Link>
              <Link href="/voorwaarden" className="hover:text-brand">Voorwaarden</Link>
              <Link href="/privacy" className="hover:text-brand">Privacy</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
