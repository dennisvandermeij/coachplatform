import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = { title: "Algemene voorwaarden" };

export default function TermsPage() {
  return (
    <LegalPage title="Algemene voorwaarden">
      <h2>1. Wie wij zijn en wat wij doen</h2>
      <p>
        {SITE_NAME} is een online platform dat klanten in contact brengt met zelfstandige online coaches. Wij zijn zelf
        geen coach en geven geen trainings-, voedings- of medisch advies. De overeenkomst voor een coachtraject komt tot
        stand tussen de klant en de coach. {SITE_NAME} bemiddelt, verwerkt de betaling en houdt een vergoeding in.
      </p>
      <p>[Bedrijfsnaam, KvK-nummer, vestigingsadres en contactgegevens invullen.]</p>

      <h2>2. Begrippen</h2>
      <ul>
        <li><strong>Klant</strong>: iemand die via het platform een coach zoekt of een traject afneemt.</li>
        <li><strong>Coach</strong>: een ondernemer met een KvK-inschrijving die via het platform coaching aanbiedt.</li>
        <li><strong>Quickscan</strong>: de vragenlijst waarmee wij coaches voorstellen die bij de klant passen.</li>
        <li><strong>Intake</strong>: het gratis kennismakingsgesprek tussen klant en coach.</li>
        <li><strong>Traject</strong>: een betaald coachpakket dat de klant via het platform afneemt.</li>
      </ul>

      <h2>3. Matches en aanbevelingen</h2>
      <p>
        Onze matches zijn gebaseerd op de antwoorden van de klant en de gegevens van de coach. Een match is een
        aanbeveling, geen garantie op resultaat. Betaalde zichtbaarheid wordt altijd herkenbaar als gesponsord
        getoond en heeft geen invloed op de matchscore.
      </p>

      <h2>4. Voorwaarden voor coaches</h2>
      <ul>
        <li>De coach heeft een geldige KvK-inschrijving en geeft juiste informatie over opleiding en ervaring.</li>
        <li>Wij controleren aanmeldingen en mogen een aanmelding of profiel zonder opgaaf van redenen weigeren of pauzeren.</li>
        <li>De coach bepaalt zelf zijn prijzen en houdt zijn beschikbaarheid actueel.</li>
        <li>
          Trajecten met klanten die de coach via het platform heeft leren kennen, worden via het platform afgerekend.
          [Termijn en eventuele boete bij omzeiling bepalen.]
        </li>
        <li>De coach is zelf verantwoordelijk voor de inhoud van de begeleiding, zijn verzekeringen en zijn belastingen.</li>
        <li>De coach geeft geen medisch advies en verwijst klanten bij medische vragen door naar een arts.</li>
      </ul>

      <h2>5. Betalingen en vergoeding</h2>
      <p>
        Klanten betalen een traject via het platform, per maand of in één keer vooraf. Betalingen lopen via een
        erkende betaalprovider. Wij houden onze vergoeding in en betalen het restant uit aan de coach.
        [Hoogte van de vergoeding, uitbetalingstermijn en wie de vergoeding draagt invullen. In de startfase is het
        platform gratis voor coaches.]
      </p>

      <h2>6. Annuleren, stoppen en terugbetalen</h2>
      <p>
        Een intake kan tot 24 uur van tevoren kosteloos worden verzet of geannuleerd. [Regels voor tussentijds stoppen
        met een traject en terugbetaling nog uitwerken in overleg met coaches. Let op de wettelijke bedenktijd van 14
        dagen bij aankopen op afstand voor consumenten.]
      </p>

      <h2>7. Reviews</h2>
      <ul>
        <li>Alleen klanten die via het platform een traject hebben gevolgd, kunnen een review schrijven.</li>
        <li>Reviews moeten eerlijk zijn en mogen geen beledigingen of persoonsgegevens van anderen bevatten.</li>
        <li>Coaches kunnen reageren op reviews, maar kunnen ze niet verwijderen. Wij verwijderen alleen reviews die deze regels overtreden.</li>
      </ul>

      <h2>8. Aansprakelijkheid</h2>
      <p>
        {SITE_NAME} is niet aansprakelijk voor de begeleiding die een coach geeft of voor de resultaten daarvan.
        Onze aansprakelijkheid is beperkt tot het bedrag van de vergoeding die wij voor het betreffende traject
        hebben ontvangen, behalve bij opzet of grove nalatigheid.
      </p>

      <h2>9. Klachten en geschillen</h2>
      <p>
        Klachten kun je melden via [e-mailadres]. Wij reageren binnen 14 dagen. Op deze voorwaarden is Nederlands
        recht van toepassing.
      </p>
    </LegalPage>
  );
}
