# Website SG Langenzenn/Wilhermsdorf – Redaktionsleitfaden

Dieses Dokument erklärt, wie Termine und Berichte auf der Website gepflegt werden.

---

## Termine

### Wo werden Termine eingetragen?

Die Termine werden in diesem Google Sheet gepflegt:

**https://docs.google.com/spreadsheets/d/1iyj-v-hL2WlCWk5GUCAM_ZucjrTi-YPsWqe3K8NDECk/edit**

(Tab „Termine")

### Wer kann Termine eintragen?

Nur Personen, die von Henning Tschirner als **Bearbeiter** eingeladen wurden. Alle anderen können das Sheet nur ansehen.

### Wie trägt man einen Termin ein?

1. Das Sheet öffnen (Link oben)
2. In der nächsten freien Zeile die folgenden Felder ausfüllen:

| Spalte | Inhalt | Beispiel |
|--------|--------|---------|
| `datum` | Datum im Format TT.MM.JJJJ | `15.06.2026` |
| `titel` | Name des Turniers oder der Veranstaltung | `Vereinsturnier Langenzenn` |
| `ort` | Stadt oder Ort | `Langenzenn` |
| `linkUrl` | Optionaler Link zur Ausschreibung (vollständige URL mit https://) | `https://example.de/ausschreibung.pdf` |
| `linkText` | Beschriftung des Links | `Ausschreibung` |

> **Hinweis:** Wenn kein Link vorhanden ist, die Spalten `linkUrl` und `linkText` einfach leer lassen.

### Wann erscheint der Termin auf der Website?

Sobald Henning den Workflow manuell gestartet hat (siehe „Schritt 3 – Website neu bauen" im Berichte-Abschnitt). Vergangene Termine verschwinden automatisch.

---

## Berichte

### Ablauf im Überblick

```
Mitglied schreibt Bericht (Google Doc)
        ↓
Mitglied schickt Link an Henning
        ↓
Henning trägt Bericht im Sheet ein
        ↓
Henning startet den Workflow auf GitHub
        ↓
Bericht erscheint auf der Website
```

---

### Was muss ein Mitglied tun?

#### Schritt 1 – Google Doc erstellen

1. **https://docs.google.com** öffnen und mit einem Google-Konto anmelden
2. Oben links auf **+** (Leeres Dokument) klicken
3. Dem Dokument oben einen Titel geben (z. B. „Spielbericht Runde 3")
4. Den Bericht schreiben – normale Formatierung (Fettdruck, Absätze, Aufzählungen) ist möglich

#### Schritt 2 – Dokument freigeben

1. Oben rechts auf **„Freigeben"** klicken
2. Unten auf **„Linkfreigabe ändern"** klicken
3. Einstellen: **„Jeder mit dem Link"** → **„Betrachter"**
4. Auf **„Link kopieren"** klicken

#### Schritt 3 – Link an Henning schicken

Den kopierten Link zusammen mit folgenden Angaben schicken:
- **Datum** des Berichts (z. B. Datum des Spieltags)
- **Titel** (falls abweichend vom Dokumenttitel)
- **Autorname** (wie er auf der Website erscheinen soll)

---

### Was muss Henning tun?

#### Schritt 1 – Doc-ID aus dem Link herauslesen

Aus dem Link des Google Docs die ID extrahieren. Sie steht zwischen `/d/` und `/edit`:

```
https://docs.google.com/document/d/HIER_STEHT_DIE_ID/edit?usp=sharing
```

#### Schritt 2 – Bericht im Sheet eintragen

Das Berichte-Sheet öffnen:

**https://docs.google.com/spreadsheets/d/1iyj-v-hL2WlCWk5GUCAM_ZucjrTi-YPsWqe3K8NDECk/edit?gid=1561421590**

In der nächsten freien Zeile eintragen:

| Spalte | Inhalt | Beispiel |
|--------|--------|---------|
| `datum` | Datum im Format TT.MM.JJJJ | `24.05.2026` |
| `titel` | Titel des Berichts | `Spielbericht Runde 3` |
| `autor` | Name des Autors | `Herbert Jäger` |
| `doc_id` | Die ID aus dem Google-Doc-Link | `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms` |

> **Wichtig:** Das Google Doc muss öffentlich auf „Betrachter" gestellt sein (Schritt 2 beim Mitglied), sonst kann die Website es nicht laden.

#### Schritt 3 – Website neu bauen

PowerShell öffnen und folgenden Befehl ausführen:

```powershell
& "C:\Program Files\GitHub CLI\gh.exe" workflow run deploy.yml --repo htschirner/schach-langenzenn-wilhermsdorf
```

Nach etwa 2–3 Minuten ist die Website aktualisiert.

---

## Benachrichtigungen bei Änderungen

Im Google Sheet sind Benachrichtigungen eingerichtet: Henning erhält eine E-Mail, sobald jemand etwas im Sheet ändert. So behält er die Kontrolle darüber, was veröffentlicht wird.
