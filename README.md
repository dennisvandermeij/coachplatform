# Coachplatform

Marktplaats die klanten via een korte quickscan koppelt aan de online coach die past bij hun doel én hun persoonlijkheid. Werktitel: IkZoekEenCoach (naam staat nog open, aan te passen in `lib/site.ts`).

## Wat er nu in zit

- **Homepage** met de belofte, hoe het werkt en de niches.
- **Quickscan** (`/quickscan`): 10 vragen, één per scherm. Vijf over doel en situatie, vijf stellingen over coachstijl.
- **Matches** (`/matches/[id]`): top 3 coaches met matchpercentage en twee redenen waarom ze passen.
- **Alle coaches** (`/coaches`), te filteren per niche, en een **coachprofiel** met coachstijl, pakketten en geverifieerde reviews.
- **Intake boeken**: de klant kiest zelf een moment (werkdagen 09:00 tot 17:00) en ziet een bevestiging.
- **Coachaanmelding** (`/voor-coaches`): profiel, KvK-nummer, specialisaties, ideale klant, dezelfde stijlstellingen en een eerste pakket. Nieuwe coaches staan op "wacht op controle".
- **Beheer** (`/admin`): coaches goedkeuren of afwijzen, coaches pauzeren, intakes volgen.
- **Concept-voorwaarden** (`/voorwaarden`) en **privacyverklaring** (`/privacy`), nog te controleren door een jurist.

## Hoe de matching werkt

Zie `lib/matching.ts`. Eerst harde filters (actief, beschikbaar, niet vol, doet het doel van de klant, live training als de klant dat wil). Daarna een score van 0 tot 100:

| Onderdeel | Gewicht |
| --- | --- |
| Coachstijl (5 dimensies) | 35% |
| Doel = hoofdspecialisatie | 25% |
| Ideale klant (niveau, drukke agenda) | 15% |
| Kwaliteit (reviews; nieuwe coach krijgt 70%) | 15% |
| Reactiesnelheid | 10% |

Zijn er minder dan 3 coaches binnen budget, dan vullen we aan met coaches net boven budget (gemarkeerd). Betaalde zichtbaarheid telt nooit mee in de score.

## Lokaal draaien

```bash
cp .env.example .env      # zet ADMIN_PASSWORD
npm install
npm run db:push           # maakt de SQLite-database
npm run db:seed           # 5 democoaches met reviews (alleen lokaal)
npm run dev
```

Tests: `npm test`.

## Nog niet gebouwd

- Betalingen via Mollie Connect of Stripe Connect (klant betaalt traject, wij houden de fee in en betalen de coach uit).
- E-mails en WhatsApp-herinneringen bij een intake.
- Inloggen voor coaches (profiel, beschikbaarheid en pakketten zelf beheren).
- Reviews schrijven na een traject en levels.
- Videobellen op het platform.
- Productiedatabase: zet in `prisma/schema.prisma` de provider op `postgresql` en `DATABASE_URL` naar Postgres.
