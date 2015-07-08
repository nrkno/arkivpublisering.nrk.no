## Om arkivpublisering.nrk.no

Arkivpublisering.nrk.no er veldig enkel side med én enkel oppgave. Her vil NRKs Arkiv & Research-avdeling dele hvilke serier/episoder fra arkivet som har blitt digitalisert.

> Hæ? Hvorfor ligger ikke dette direkte i tv.nrk.no??

Kort svar: Jo, vi er på vei dit - men vi er ikke helt i mål. Utfordringene rundt å frigjøre så mye arkivmateriale vil gå utover presentasjonen slik tv.nrk.no er idag, så inntil vi har løst hvordan brukerne skal kunne finne "Arkivgull" på tv.nrk.no, så har vi denne enkle applikasjonen som et kommunikasjonsledd mellom Arkiv & Research og publikum. 

## Teknisk om applikasjonen
Applikasjonen er en node.js-applikasjon som henter data fra et konfigurerbart Google Doc. Hvilket dokument applikasjonen henter data fra finnes i appconfig.js

### Kjøre applikasjonen lokalt
For å kjøre applikasjonen lokalt:

1. Clone repository'et
2. Installer sails via npm med : npm install -g sails
3. Kjør "sails lift"

Dette vil kjøre opp applikasjonen på port 1337 (takk, Sails.js).


