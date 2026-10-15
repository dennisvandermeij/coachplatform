import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = { title: "Privacyverklaring" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacyverklaring">
      <p>
        {SITE_NAME} gaat zorgvuldig om met je gegevens. Hier lees je welke gegevens we verwerken, waarom, en welke
        rechten je hebt. Verwerkingsverantwoordelijke is [bedrijfsnaam, adres, KvK-nummer, e-mailadres].
      </p>

      <h2>Welke gegevens we verwerken</h2>
      <ul>
        <li><strong>Quickscan</strong>: je doel, ervaring, budget, of je een drukke agenda hebt, je voorkeur voor begeleiding en je antwoorden op de stellingen over coachstijl. De quickscan is anoniem: we vragen geen naam of e-mailadres.</li>
        <li><strong>Intake inplannen</strong>: je naam, e-mailadres, optioneel je telefoonnummer en het gekozen tijdstip.</li>
        <li><strong>Coaches</strong>: naam, contactgegevens, KvK-nummer, opleiding, ervaring, profieltekst, pakketten en antwoorden over coachstijl.</li>
        <li><strong>Trajecten en reviews</strong>: welk traject je volgt, betaalgegevens via onze betaalprovider en je review.</li>
      </ul>
      <p>
        We vragen in de quickscan bewust niet naar medische gegevens, zoals het gebruik van medicatie. Bespreek
        medische zaken alleen met je coach of je arts.
      </p>

      <h2>Waarvoor we je gegevens gebruiken</h2>
      <ul>
        <li>Om coaches voor te stellen die bij je passen (uitvoering van onze dienst).</li>
        <li>Om je intake in te plannen en de coach je gegevens te geven die nodig zijn voor het gesprek.</li>
        <li>Om betalingen te verwerken en uit te betalen aan coaches (wettelijke plicht en uitvoering van de overeenkomst).</li>
        <li>Om onze matching te verbeteren op basis van geanonimiseerde uitkomsten (gerechtvaardigd belang).</li>
      </ul>

      <h2>Met wie we gegevens delen</h2>
      <p>
        Met de coach bij wie je een intake plant, met onze betaalprovider en met onze hostingpartij. Met deze partijen
        sluiten we verwerkersovereenkomsten waar nodig. We verkopen je gegevens nooit.
      </p>

      <h2>Hoe lang we gegevens bewaren</h2>
      <p>
        Quickscans zonder intake bewaren we maximaal 12 maanden. Gegevens over trajecten en betalingen bewaren we 7
        jaar vanwege de fiscale bewaarplicht. [Termijnen laten controleren.]
      </p>

      <h2>Je rechten</h2>
      <p>
        Je kunt je gegevens inzien, laten corrigeren of laten verwijderen, en bezwaar maken tegen het gebruik ervan.
        Stuur een e-mail naar [e-mailadres]. Ben je niet tevreden over hoe we met je gegevens omgaan, dan kun je een
        klacht indienen bij de Autoriteit Persoonsgegevens.
      </p>

      <h2>Cookies</h2>
      <p>
        We gebruiken alleen functionele cookies die nodig zijn om de site te laten werken. Komen er analytische of
        marketingcookies bij, dan vragen we eerst je toestemming.
      </p>
    </LegalPage>
  );
}
