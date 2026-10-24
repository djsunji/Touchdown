# Touchdown

Touchdown ist die Knowledge Base für Crew-Nightstops: Kolleg:innen legen Tipps (Restaurants, Aktivitäten, ÖPNV, Shopping …) pro Destination an, bewerten sie mit 1–5 Sternen und markieren Favoriten. Login mit dem Firmen-Account über Microsoft Entra ID (Azure AD).

Destinationen: MUC, OSL, MXP, LJU, BUD, VCE, FLR, TLV, NCE, GOT, ZRH, BRN. Admins legen weitere direkt in der App an oder entfernen sie (`/admin`), ohne Code-Änderung. Für rund 140 weitere europäische Städte (z. B. LIS, BCN, FCO, AMS, BER, CDG, VIE, PRG, ATH, IST, LHR, GVA, ARN, KEF) ist bereits eine gezeichnete Kachel mit dem echten Wahrzeichen hinterlegt: Code eintippen, Stadt, Land, Zeitzone und Grafik werden übernommen. Für unbekannte Codes wird eine Grafik erzeugt (per Würfel neu würfelbar).

## Vorschau

Eine klickbare Vorschau mit Beispieldaten (ohne Login und Datenbank) liegt in `index.html` und wird über GitHub Pages angezeigt: https://djsunji.github.io/touchdown/

Die echte App ist eine Server-Anwendung (Next.js + PostgreSQL + Azure-Login) und läuft nicht auf GitHub Pages, siehe Abschnitt „Produktion“.

## Funktionen

- Startseite mit einer Karte pro Stadt (eigene Farbe und Wahrzeichen-Silhouette, `src/lib/cityArt.ts`)
- Pro Stadt vier grosse Hauptkategorien (Bars & Restaurants, Shopping, Wellness, Touren & ÖPNV) mit den bestbewerteten Tipps, darunter die weiteren Kategorien
- 12 Kategorien: Touren & ÖPNV, Sport, Sehenswürdigkeiten, Bars & Restaurants, Airport F&B, Wellness, Shopping, Lebensmittel, Hilfsorganisationen, Sprachtipps, Geld & ATM, Informationen (anpassbar in `src/lib/categories.ts`)
- Einträge mit Titel, Beschreibung, Adresse, Telefon, Google-Maps-Link und Website
- 5-Sterne-Bewertung pro Person, Anzeige von Durchschnitt und Anzahl; nochmal auf die eigene Bewertung tippen entfernt sie
- Kommentare zu jedem Tipp (mit der Sternebewertung der kommentierenden Person), eigene Kommentare löschen; die Suche findet auch Text in Kommentaren
- Sortierung A–Z, nach Bewertung, Neueste, Nähe zum Crew-Hotel, Filter auf eigene Favoriten, Preis (€/€€/€€€), „jetzt offen“ und vegetarisch, Suche
- Eigene Einträge bearbeiten und löschen
- **Karte** pro Stadt mit Crew-Hotel und allen Tipps, Gehzeit vom Hotel bei jedem Tipp. Position per Tipp auf die Karte, Adresssuche oder Google-Maps-Link
- **Fotos** zu Tipps (max. 4): werden im Browser verkleinert, auf dem Server neu kodiert, gedreht und von EXIF/GPS-Daten befreit, in der Datenbank gespeichert und nur angemeldeten Personen ausgeliefert
- **Öffnungszeiten** (auch über Mitternacht) mit „jetzt offen“ in der Zeitzone der Destination, Ruhetage, Preisniveau, vegetarisch
- **Praktische Infos** pro Stadt: Transfer, Währung, Trinkgeld, Apotheke, Arzt, Notfallnummern (von Admins gepflegt)
- **Crew-Treffpunkte** („Heute 19:00 Abendessen, wer kommt?“) mit Zusagen; verschwinden 24 Stunden nach Beginn automatisch
- **Crew-Chat** pro Stadt
- **Melden**: Tipps, Kommentare, Chat-Nachrichten und Fotos lassen sich melden (veraltet, falsch, unpassend …)
- **Admin-Bereich** (`/admin`): Meldungen prüfen und Inhalte löschen, Admins ernennen, Destinationen anlegen, Crew-Hotel setzen, Destinationen ausblenden
- **Meine Nightstops**: eigene nächste Nightstops eintragen; neue Tipps dafür erscheinen dort bei jedem Nightstop und auf Wunsch im Wochen-Digest per Mail
- **Offline & installierbar** (PWA): „Zum Startbildschirm hinzufügen“, besuchte Seiten und „Für offline speichern“ funktionieren ohne Netz. Beim Abmelden wird alles Gespeicherte gelöscht
- Funktioniert auf Handy, Tablet und Desktop

## Technik

Next.js 15 (App Router, Server Actions) · Auth.js v5 mit Microsoft-Entra-ID-Provider · PostgreSQL mit Prisma · Tailwind CSS.

## Lokal starten

```bash
cp .env.example .env          # Werte eintragen, für lokale Tests AUTH_DEV_LOGIN="true"
docker compose up -d          # lokale PostgreSQL-Datenbank
npm install
npx prisma migrate dev        # Tabellen anlegen
npm run db:seed               # Destinationen anlegen
npm run dev                   # http://localhost:3000
```

Mit `AUTH_DEV_LOGIN="true"` erscheint auf der Login-Seite ein Test-Login ohne Azure. In Produktions-Builds ist er immer deaktiviert.

## Microsoft Entra ID einrichten

Das muss jemand mit Rechten im Azure-Portal eurer Firma machen (meist die IT).

1. **Azure-Portal → Microsoft Entra ID → App-Registrierungen → Neue Registrierung**
   - Name: `Touchdown`
   - Unterstützte Kontotypen: **Nur Konten in diesem Organisationsverzeichnis (Single Tenant)**. Damit können sich nur Firmen-Accounts anmelden.
   - Umleitungs-URI: Plattform **Web**, URI `https://<eure-domain>/api/auth/callback/microsoft-entra-id`
     (für lokale Tests zusätzlich `http://localhost:3000/api/auth/callback/microsoft-entra-id`)
2. Auf der Übersichtsseite der App notieren:
   - **Anwendungs-ID (Client-ID)** → `AUTH_MICROSOFT_ENTRA_ID_ID`
   - **Verzeichnis-ID (Mandanten-ID)** → in `AUTH_MICROSOFT_ENTRA_ID_ISSUER="https://login.microsoftonline.com/<Mandanten-ID>/v2.0"`
3. **Zertifikate & Geheimnisse → Neuer geheimer Clientschlüssel** → den *Wert* (nicht die ID) als `AUTH_MICROSOFT_ENTRA_ID_SECRET` speichern. Ablaufdatum notieren und rechtzeitig erneuern.
4. **API-Berechtigungen**: `Microsoft Graph → User.Read` (delegiert) ist standardmässig vorhanden; dazu `openid`, `profile`, `email`. Falls Benutzer:innen nicht selbst zustimmen dürfen: **Administratorzustimmung erteilen**.
5. Optional, um den Zugriff auf eine Gruppe (z. B. nur Cabin/Cockpit Crew) einzuschränken: **Unternehmensanwendungen → Touchdown → Eigenschaften → Zuweisung erforderlich = Ja**, dann unter *Benutzer und Gruppen* die gewünschten Gruppen zuweisen.

Zusätzlich lässt sich mit `ALLOWED_EMAIL_DOMAINS="firma.ch"` die erlaubte E-Mail-Domain festlegen (empfohlen).

## Sicherheit

- **Nur euer Tenant:** Die App akzeptiert nur Logins aus dem Mandanten in `AUTH_MICROSOFT_ENTRA_ID_ISSUER`. Fehlt dort die Mandanten-ID (oder steht `common`), werden alle Microsoft-Logins abgelehnt.
- **Keine Gäste:** Gast-Accounts (B2B), die in euren Tenant eingeladen wurden, werden abgelehnt. Mit `ALLOW_GUEST_ACCOUNTS="true"` lassen sie sich zulassen.
- **Sitzungen** laufen nach 24 Stunden ab. Wer die Firma verlässt und in Entra deaktiviert wird, verliert damit spätestens nach einem Tag den Zugriff.
- **Schutz im Browser:** Content-Security-Policy, kein Einbetten in fremde Seiten (Clickjacking), HSTS, nosniff.
- **Spam-Bremse:** max. 20 Chat-Nachrichten und 10 Kommentare pro Minute, 10 neue Tipps pro 10 Minuten pro Person.
- **Spam-Bremse** auch für Treffpunkte (5 pro Stunde), Meldungen und Adresssuche.
- **Rechte:** Bearbeiten und Löschen nur für eigene Inhalte, Admins dürfen alles. Links in Tipps nur mit http(s).
- **Fotos:** nur Bilddateien bis 10 MB, werden serverseitig mit `sharp` neu kodiert (keine Metadaten, kein Standort), nur für angemeldete Personen abrufbar.
- **Offline-Kopien** liegen nur im Browser der Person und werden beim Abmelden gelöscht.
- **Betrieb:** Nur über HTTPS betreiben, `AUTH_SECRET` mit `npx auth secret` erzeugen und geheim halten, die Datenbank nicht öffentlich erreichbar machen (z. B. Azure „Private Access“ oder Firewall nur für die App).

## Externe Dienste (alle optional und konfigurierbar)

Touchdown braucht keinen kostenpflichtigen Dienst. Alles Externe lässt sich umstellen oder abschalten:

| Funktion | Standard | Variable | Abschalten |
|---|---|---|---|
| Kartenkacheln | OpenStreetMap (`tile.openstreetmap.org`, gratis bei moderater Nutzung, [Nutzungsregeln](https://operations.osmfoundation.org/policies/tiles/)) | `MAP_TILE_URL`, `MAP_ATTRIBUTION` | `MAP_TILE_URL="off"` |
| Adresssuche | OpenStreetMap Nominatim (max. 1 Anfrage/s, [Nutzungsregeln](https://operations.osmfoundation.org/policies/nominatim/)) | `GEOCODER_URL` (Basis-URL eines Nominatim-kompatiblen Dienstes) | `GEOCODER_URL="off"` |
| Wochen-Digest per Mail | aus | `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM`, `CRON_SECRET` | SMTP leer lassen |

Für viele Nutzer:innen empfiehlt sich ein eigener Kachel-Server oder ein Anbieter nach Wahl (z. B. eigener Tileserver, MapTiler, Stadia); dann nur `MAP_TILE_URL` und `MAP_ATTRIBUTION` setzen. Ohne Karte funktioniert alles andere weiter, die Gehzeit zum Hotel wird trotzdem berechnet.

### Wochen-Digest einrichten

1. SMTP-Zugang eintragen (z. B. der Firmen-Mailserver oder Microsoft 365 SMTP-Relay), `MAIL_FROM="Touchdown <touchdown@firma.ch>"`.
2. `CRON_SECRET` setzen (mindestens 16 Zeichen, z. B. `openssl rand -hex 24`).
3. Einmal pro Woche aufrufen, z. B. per Cron, Azure Logic App oder GitHub Actions:

```bash
curl -X POST -H "Authorization: Bearer $CRON_SECRET" https://<eure-domain>/api/cron/digest
```

Es bekommen nur Personen Post, die den Digest unter „Meine Nightstops“ eingeschaltet haben und für deren Nightstops der nächsten 14 Tage es neue Tipps gibt.

## Admins

- Personen in `ADMIN_EMAILS` sind immer Admins (Start-Admins, können in der App nicht entfernt werden).
- Unter `/admin → Rollen` können sie weitere Personen zu Admins machen.
- Admins bearbeiten Meldungen, löschen Inhalte, pflegen praktische Infos und legen Destinationen samt Crew-Hotel an.

## Produktion

Benötigt werden ein Node.js-Hosting und eine PostgreSQL-Datenbank, zum Beispiel:

- **Azure App Service (Linux, Node 22 oder Container)** + **Azure Database for PostgreSQL Flexible Server**, oder
- jeder Docker-Host: `docker build -t nightstop .` und mit den Umgebungsvariablen aus `.env.example` starten. Der Container führt beim Start die Migrationen und das Seed (idempotent) aus.

Pflicht-Variablen in Produktion: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL` (öffentliche URL), die drei `AUTH_MICROSOFT_ENTRA_ID_*` (Issuer mit Mandanten-ID!) und je nach Hosting `AUTH_TRUST_HOST=true`. Empfohlen: `ALLOWED_EMAIL_DOMAINS`, `ADMIN_EMAILS`. Optional: siehe „Externe Dienste“.

Fotos werden in der Datenbank gespeichert (ca. 200–400 KB pro Foto); das Backup der Datenbank deckt sie also mit ab. Die App muss über HTTPS laufen, sonst funktionieren Offline-Modus und Installation nicht.

Ohne Docker:

```bash
npm ci && npm run build
npx prisma migrate deploy && npm run db:seed
npm start
```

## Anpassen

- Farben: `--brand`, `--brand-light` und `--accent` in `src/app/globals.css`
- Logo: `public/logo.png` (Login), `public/logo-icon.png` (Header), `src/app/icon.png` und `src/app/apple-icon.png` (Favicon)
- Neue Destination: in der App unter `/admin → Destinationen`, die Grafik entsteht automatisch. Eine neue von Hand gezeichnete Skyline kommt als Eintrag in eine der Dateien unter `src/lib/skylines/` (Konventionen in `shared.ts`)
- Kategorien: `src/lib/categories.ts` (der `slug` wird in der Datenbank gespeichert, also nach dem Livegang nicht mehr ändern)
- Start-Destinationen und Notfallnummern: `prisma/seed.ts`. Jede Seed-Version läuft pro Datenbank nur einmal; in der App gelöschte Destinationen kommen also nicht zurück. Für neue Start-Städte `SEED_VERSION` erhöhen
- App-Icon: `public/icon-192.png`, `public/icon-512.png`, `public/icon-maskable-512.png`
