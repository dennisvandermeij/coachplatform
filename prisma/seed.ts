// Demodata voor lokaal ontwikkelen. Niet op productie draaien: deze coaches en
// reviews zijn verzonnen.
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

type Demo = {
  name: string;
  slug: string;
  mainNiche: string;
  niches: string;
  icpLevels: string;
  worksWithBusy: boolean;
  offersLive: boolean;
  city: string;
  years: number;
  style: [number, number, number, number, number];
  bio: string;
  pkg: { name: string; price: number; months: number; description: string };
  ratings: number[];
};

const DEMO: Demo[] = [
  {
    name: "Sanne de Vries",
    slug: "sanne-de-vries",
    mainNiche: "afslankmedicatie",
    niches: "afslankmedicatie,afvallen,gezond-leven",
    icpLevels: "beginner,ervaren",
    worksWithBusy: true,
    offersLive: false,
    city: "Utrecht",
    years: 6,
    style: [3, 4, 5, 4, 2],
    bio: "Ik begeleid mensen die afslankmedicatie gebruiken. Samen zorgen we dat je spiermassa behoudt, goed eet en gewoontes opbouwt die blijven als je stopt met de medicatie.",
    pkg: { name: "Begeleiding bij afslankmedicatie", price: 149, months: 6, description: "Voedingsplan, krachttraining voor spierbehoud en een wekelijkse check-in via video." },
    ratings: [5, 5, 4, 5],
  },
  {
    name: "Mark Jansen",
    slug: "mark-jansen",
    mainNiche: "bodybuilding",
    niches: "bodybuilding,spiermassa,krachtsport",
    icpLevels: "ervaren,gevorderd",
    worksWithBusy: false,
    offersLive: true,
    city: "Eindhoven",
    years: 11,
    style: [5, 5, 5, 4, 5],
    bio: "Wedstrijdcoach met elf jaar ervaring op het podium en achter de schermen. Ik ben direct, ik werk met data en ik verwacht dat je alles geeft.",
    pkg: { name: "Wedstrijdvoorbereiding", price: 249, months: 4, description: "Volledig schema, macro's per week, posing-feedback en dagelijkse check-ins." },
    ratings: [5, 5, 5, 4, 5],
  },
  {
    name: "Lotte Bakker",
    slug: "lotte-bakker",
    mainNiche: "hyrox",
    niches: "hyrox,triathlon,krachtsport",
    icpLevels: "beginner,ervaren,gevorderd",
    worksWithBusy: true,
    offersLive: true,
    city: "Amsterdam",
    years: 4,
    style: [4, 4, 3, 3, 4],
    bio: "Van je eerste Hyrox tot een snellere tijd in de Pro-divisie. Ik combineer kracht, conditie en slim plannen rond een drukke werkweek.",
    pkg: { name: "Hyrox race-ready", price: 129, months: 3, description: "Trainingsschema per week, racestrategie en een tweewekelijkse videocall." },
    ratings: [5, 4, 5],
  },
  {
    name: "Youssef El Amrani",
    slug: "youssef-el-amrani",
    mainNiche: "afvallen",
    niches: "afvallen,gezond-leven,spiermassa",
    icpLevels: "beginner",
    worksWithBusy: true,
    offersLive: false,
    city: "Rotterdam",
    years: 3,
    style: [2, 2, 2, 4, 2],
    bio: "Afvallen zonder gedoe en zonder calorieën tellen. Ik help beginners stap voor stap, met veel steun en zonder oordeel.",
    pkg: { name: "Rustig en blijvend afvallen", price: 89, months: 3, description: "Simpele eetrichtlijnen, thuistrainingen en dagelijks contact via de app." },
    ratings: [],
  },
  {
    name: "Eva Visser",
    slug: "eva-visser",
    mainNiche: "triathlon",
    niches: "triathlon,hyrox",
    icpLevels: "ervaren,gevorderd",
    worksWithBusy: true,
    offersLive: false,
    city: "Groningen",
    years: 8,
    style: [4, 5, 5, 2, 3],
    bio: "Triathloncoach voor ambitieuze amateurs. Gestructureerde schema's op basis van hartslag en vermogen, met uitleg over het waarom.",
    pkg: { name: "Seizoensbegeleiding triathlon", price: 179, months: 6, description: "Schema in je sporthorloge, maandelijkse evaluatie en wedstrijdplanning." },
    ratings: [5, 5, 5],
  },
];

async function main() {
  await db.review.deleteMany();
  await db.booking.deleteMany();
  await db.appointment.deleteMany();
  await db.match.deleteMany();
  await db.intake.deleteMany();
  await db.package.deleteMany();
  await db.coach.deleteMany();

  for (const d of DEMO) {
    const [directness, structure, depth, contact, pace] = d.style;
    const coach = await db.coach.create({
      data: {
        slug: d.slug,
        name: d.name,
        email: `${d.slug}@voorbeeld.nl`,
        kvkNumber: "12345678",
        certificates: "Fitnesstrainer A en B, Leefstijlcoach",
        bio: d.bio,
        city: d.city,
        offersLive: d.offersLive,
        niches: d.niches,
        mainNiche: d.mainNiche,
        icpLevels: d.icpLevels,
        worksWithBusy: d.worksWithBusy,
        yearsExperience: d.years,
        directness,
        structure,
        depth,
        contact,
        pace,
        maxClients: 20,
        activeClients: d.ratings.length,
        status: "active",
        responseHours: d.years > 5 ? 12 : 24,
        packages: {
          create: { name: d.pkg.name, pricePerMonth: d.pkg.price, months: d.pkg.months, description: d.pkg.description },
        },
      },
    });

    for (const [i, rating] of d.ratings.entries()) {
      const firstName = ["Anouk", "Bas", "Fleur", "Daan", "Iris"][i % 5];
      await db.booking.create({
        data: {
          coachId: coach.id,
          clientName: firstName,
          clientEmail: `klant${i}-${d.slug}@voorbeeld.nl`,
          startedAt: new Date(Date.now() - (120 + i * 20) * 86400000),
          status: "afgerond",
          review: {
            create: {
              coachId: coach.id,
              rating,
              authorFirstName: firstName,
              text:
                rating === 5
                  ? `Precies de coach die ik nodig had. ${d.name.split(" ")[0]} snapt hoe ik in elkaar zit.`
                  : "Goede begeleiding en duidelijke afspraken. Soms wat traag met reageren.",
            },
          },
        },
      });
    }
  }

  console.log(`${DEMO.length} democoaches aangemaakt.`);
}

main().finally(() => db.$disconnect());
