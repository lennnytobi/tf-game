# Spiel-Rangliste - 8-Team Game App

Eine Next.js 14 Web-App für ein 8-Team Spiel mit Supabase Backend und Echtzeit-Updates.

## Features

- **Öffentliche Seite**: Live-Rangliste der 8 Teams (A-H) mit Quiz-Formular
- **Admin-Bereich**: Geschützter Bereich für Organisatoren zum Vergeben von Punkten
- **Echtzeit-Updates**: Live-Updates der Rangliste via Supabase Realtime
- **Quiz-System**: Benutzer können Antworten einreichen (Format: A-1 bis H-99)
- **Punktevergabe**: Organisatoren können Punkte für 7 verschiedene Spiele vergeben
- **Rückgängig-Funktion**: Negative Einträge zum Rückgängigmachen von Aktionen

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Supabase (Database + Realtime)
- PostgreSQL mit Row Level Security (RLS)

## Setup

### 1. Dependencies installieren

```bash
npm install
```

### 2. Supabase Projekt einrichten

1. Erstellen Sie ein neues Supabase Projekt
2. Kopieren Sie die Projekt-URL und API-Keys
3. Kopieren Sie `.env.local.example` zu `.env.local` und füllen Sie die Werte aus:

```bash
cp env.local.example .env.local
```

### 3. Datenbank Schema einrichten

Führen Sie die SQL-Dateien in der Supabase SQL-Konsole aus:

1. `sql/schema.sql` - Erstellt Tabellen, Views und Funktionen
2. `sql/rls.sql` - Richtet Row Level Security ein
3. `sql/seed.sql` - Fügt Testdaten ein (Teams A-H und Quiz-Fragen)

### 4. Admin-Code konfigurieren

Setzen Sie einen sicheren Admin-Code in `.env.local`:

```
ADMIN_CODE=ihr-sicherer-admin-code
```

### 5. Entwicklungsserver starten

```bash
npm run dev
```

Die App ist dann unter `http://localhost:3000` verfügbar.

## Verwendung

### Öffentliche Seite (`/`)

- Zeigt die Live-Rangliste der 8 Teams
- Quiz-Formular für Benutzer:
  - **Benutzer-ID**: Format A-1 bis H-99 (Team-Code + Spieler-Nummer)
  - **Fragen-ID**: 1-5
  - **Antwort**: Freitext-Antwort

### Admin-Bereich (`/admin`)

- Geschützt durch Admin-Code (gespeichert in localStorage)
- Formular zum Vergeben von Punkten:
  - **Team**: A-H auswählen
  - **Spiel-ID**: 1-7
  - **Punkte**: Kann negativ sein
  - **Grund**: Optional
  - **Vergeben von**: Name des Organisators

- Historie der letzten 50 Einträge mit Rückgängig-Funktion

## Datenbank Schema

### Teams
- 8 feste Teams mit Codes A-H
- Name und Sortierreihenfolge

### Quiz-Fragen
- 5 Fragen mit normalisierten Antworten
- Nur über RPC-Funktion zugänglich

### Submissions
- Benutzer-Einreichungen
- Eindeutige Einschränkung: Ein Team kann pro Frage nur einmal Punkte erhalten

### Points Ledger
- Append-only Log aller Punktevergaben
- Verschiedene Quellen: quiz, game, bonus, penalty, manual
- Echtzeit-Updates für Live-Rangliste

## API Endpoints

### `POST /api/admin/award`
Verleiht Punkte an Teams (nur mit Admin-Code).

**Request:**
```json
{
  "teamCode": "A",
  "gameId": "1",
  "points": 5,
  "reason": "Sieg im ersten Spiel",
  "createdBy": "Organisator"
}
```

**Headers:**
```
x-admin-code: ihr-admin-code
```

## Sicherheit

- Row Level Security (RLS) aktiviert
- Öffentliche Benutzer können nur Submissions einreichen
- Quiz-Antworten sind server-seitig geschützt
- Admin-Funktionen erfordern Service-Role-Key
- Admin-Code-Schutz für Organisator-Bereich

## Deployment

### Vercel (Empfohlen)

1. Verbinden Sie Ihr Repository mit Vercel
2. Fügen Sie Umgebungsvariablen hinzu:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
   - `ADMIN_CODE`
3. Deploy

### Andere Plattformen

Stellen Sie sicher, dass alle Umgebungsvariablen gesetzt sind und die Datenbank-Scripts ausgeführt wurden.

## Entwicklung

### Scripts

```bash
npm run dev          # Entwicklungsserver
npm run build        # Production Build
npm run start        # Production Server
npm run lint         # ESLint
```

### Datenbank-Updates

Bei Schema-Änderungen:
1. SQL-Dateien aktualisieren
2. In Supabase SQL-Konsole ausführen
3. Bei größeren Änderungen: Migration-Script erstellen

## Troubleshooting

### Häufige Probleme

1. **"Unknown team code" Fehler**
   - Überprüfen Sie, ob Teams korrekt in der Datenbank eingefügt wurden
   - Benutzer-ID Format: A-1 bis H-99

2. **Realtime-Updates funktionieren nicht**
   - Überprüfen Sie Supabase Realtime-Einstellungen
   - RLS-Policies für `points_ledger` überprüfen

3. **Admin-Code wird nicht akzeptiert**
   - Überprüfen Sie `.env.local` ADMIN_CODE
   - Browser-Cache leeren (localStorage)

4. **Quiz-Antworten werden nicht gewertet**
   - Überprüfen Sie `quiz_questions` Tabelle
   - Antworten müssen exakt normalisiert sein

## Support

Bei Problemen:
1. Überprüfen Sie die Browser-Konsole für Fehler
2. Überprüfen Sie Supabase Logs
3. Überprüfen Sie Umgebungsvariablen
4. Überprüfen Sie Datenbank-Schema und RLS-Policies