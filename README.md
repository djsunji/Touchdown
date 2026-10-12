# Touchdown

Touchdown ist die Knowledge Base für Crew-Nightstops: Kolleg:innen legen Tipps (Restaurants, Aktivitäten, ÖPNV, Shopping …) pro Destination an, bewerten sie mit 1–5 Sternen und markieren Favoriten. Login mit dem Firmen-Account über Microsoft Entra ID (Azure AD).

Destinationen: MUC, OSL, MXP, LJU, BUD, VCE, FLR, TLV, NCE, GOT (in `prisma/seed.ts` erweiterbar).

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
- Sortierung A–Z, nach Bewertung, Neueste, Filter auf eigene Favoriten, Suche
- Eigene Einträge bearbeiten und löschen; Admins (`ADMIN_EMAILS`) dürfen alle Einträge verwalten und pro Destination einen Info-Text (z. B. Crew-Hotel) pflegen
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

Zusätzlich lässt sich mit `ALLOWED_EMAIL_DOMAINS="firma.ch"` die erlaubte E-Mail-Domain festlegen.

## Produktion

Benötigt werden ein Node.js-Hosting und eine PostgreSQL-Datenbank, zum Beispiel:

- **Azure App Service (Linux, Node 22 oder Container)** + **Azure Database for PostgreSQL Flexible Server**, oder
- jeder Docker-Host: `docker build -t nightstop .` und mit den Umgebungsvariablen aus `.env.example` starten. Der Container führt beim Start die Migrationen und das Seed (idempotent) aus.

Pflicht-Variablen in Produktion: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL` (öffentliche URL), die drei `AUTH_MICROSOFT_ENTRA_ID_*` und je nach Hosting `AUTH_TRUST_HOST=true`.

Ohne Docker:

```bash
npm ci && npm run build
npx prisma migrate deploy && npm run db:seed
npm start
```

## Anpassen

- Farben: `--brand`, `--brand-light` und `--accent` in `src/app/globals.css`
- Logo: `public/logo.png` (Login), `public/logo-icon.png` (Header), `src/app/icon.png` und `src/app/apple-icon.png` (Favicon)
- Neue Destination mit eigener Skyline: Eintrag in `prisma/seed.ts` und in `CITY_STYLE`/`SKYLINE` in `src/lib/cityArt.ts`; ohne eigene Skyline wird eine allgemeine verwendet
- Kategorien: `src/lib/categories.ts` (der `slug` wird in der Datenbank gespeichert, also nach dem Livegang nicht mehr ändern)
- Destinationen: `prisma/seed.ts`, danach `npm run db:seed`
