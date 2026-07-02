---
title: Eigenes Frontend
description: Wie dein eigenes Frontend über den Unix-Socket mit dem Arcader-Daemon (arcaderd) kommuniziert – Anfragen, Antworten und Events.
---

## Einführung

Hey! Du willst also nicht die mitgelieferte Godot-Oberfläche nutzen, sondern dein
eigenes Frontend für Arcader bauen? Sehr geil - genau darum geht es auf dieser
Seite. Hier erklären wir dir Schritt für Schritt, wie die Oberfläche mit dem
Arcader-Daemon (`arcaderd`) redet, damit du deine eigene UI in der Sprache deiner
Wahl schreiben kannst.

Kurz vorweg, damit du das große Ganze verstehst: Arcader besteht aus zwei Teilen.
Der **Daemon** (`arcaderd`) ist das Gehirn. Er kümmert sich um die Spiele, die
Emulation, den Münzschacht, USB-Sticks und die ganze Hardware. Das **Frontend**
(standardmäßig `arcaderui` in Godot) ist nur das hübsche Gesicht - es zeigt an,
was los ist, und schickt dem Daemon, was der Spieler möchte. Dein eigenes
Frontend tritt also einfach an die Stelle von `arcaderui`. Der Daemon bleibt
gleich.

## Die Verbindung

Der Daemon lauscht auf einem **Unix Domain Socket**. Den findest du hier:

```
$XDG_RUNTIME_DIR/arcaderd.sock
```

`XDG_RUNTIME_DIR` ist eine Umgebungsvariable, die dir dein System vorgibt (meist
etwas wie `/run/user/1000`). Ist sie nicht gesetzt, kann dein Frontend keine
Verbindung aufbauen - dann läuft in der Regel gerade auch kein Daemon.

Über diesen Socket läuft die komplette Kommunikation in beide Richtungen. Du
öffnest die Verbindung einmal und lässt sie offen, solange dein Frontend läuft.

## Das Nachrichtenformat

Jede Nachricht ist ein **JSON-Objekt in einer einzigen Zeile**, abgeschlossen mit
einem Zeilenumbruch (`\n`). Der Zeilenumbruch ist der Trenner zwischen zwei
Nachrichten - mehr Framing gibt es nicht. Du liest also so lange Bytes, bis du
ein `\n` findest, parst alles davor als JSON und machst mit dem Rest weiter.

:::caution[Wichtig]
Verlass dich nicht darauf, dass eine Leseoperation genau eine Nachricht
liefert. Es können mehrere Nachrichten auf einmal ankommen oder eine
Nachricht über mehrere Lesevorgänge verteilt sein. Sammle die Bytes in einem
Puffer und zerlege ihn selbst an den `\n`.
:::

Es gibt drei Arten von Nachrichten:

### 1. Anfragen (Frontend → Daemon)

Wenn dein Frontend etwas wissen oder auslösen will, schickt es eine Anfrage:

```json
{ "type": "GET_GAMES", "requestId": "req_1", "data": {} }
```

- `type` sagt, **was** du willst.
- `requestId` ist eine ID, die **du** dir ausdenkst. Der Daemon schickt sie in
  seiner Antwort unverändert zurück, damit du Antwort und Anfrage zuordnen
  kannst. Nimm einfach eine hochzählende Zahl wie `req_1`, `req_2`, ...
- `data` enthält die Parameter der Anfrage (oft einfach `{}`).

### 2. Antworten (Daemon → Frontend)

Auf eine Anfrage antwortet der Daemon mit derselben `requestId`:

```json
{ "requestId": "req_1", "type": "GET_GAMES_RESPONSE", "success": true, "data": { "games": [] } }
```

- `type` ist meist der Anfrage-Typ mit angehängtem `_RESPONSE`.
- `success` sagt dir, ob es geklappt hat.
- Ging etwas schief, bekommst du oft stattdessen ein `error`-Feld mit einer
  Klartext-Meldung.

Kommt eine völlig unbekannte oder kaputte Anfrage rein, antwortet der Daemon mit:

```json
{ "requestId": "req_1", "type": "ERROR", "success": false, "error": "Unknown message type: FOO" }
```

### 3. Events (Daemon → Frontend, unaufgefordert)

Und jetzt kommt der wichtigste Teil - der Grund, warum Arcader sich lebendig
anfühlt. Der Daemon schickt dir **von sich aus** Nachrichten, ohne dass du
gefragt hast. Diese Events haben **keine** `requestId`:

```json
{ "type": "COIN_STATUS", "data": { "credits": 1, "coinSlotEnabled": true } }
```

Immer wenn sich am Automaten etwas ändert - eine Münze fällt, der Admin schaltet
im Dashboard den Münzschacht ab, ein Spiel wird hinzugefügt - feuert der Daemon
so ein Event an **alle** verbundenen Frontends. Genau hier passiert die Magie.

## Der wichtigste Grundsatz: cachen ja, aber reagieren!

Merk dir das, das ist das A und O eines guten Arcader-Frontends:

> **Du darfst Daten cachen, aber du musst auf Events reagieren.**

Ein Beispiel: Die Spieleliste holst du dir einmal mit `GET_GAMES` und hältst sie
im Speicher, damit du nicht ständig nachfragen musst - genauso die Cover.
Vollkommen richtig so. **Aber**: Wenn im Dashboard ein Spiel hinzugefügt,
umbenannt oder gelöscht wird, schickt dir der Daemon ein `GAMES_UPDATED`-Event.
Dein Frontend muss dann seinen Cache wegwerfen und die Liste neu laden. Sonst
zeigt deine UI veraltete Daten an, bis jemand neu startet - und genau das wollen
wir nicht.

Dasselbe gilt für den Münzschacht: Schaltet ihn jemand ab, kommt ein
`COIN_STATUS`-Event, und deine UI muss sofort in den Freispiel-Modus wechseln,
statt weiter auf eine Münze zu warten.

Die Faustregel lautet also: Für jedes Event, das dich betrifft, gibt es eine
Reaktion in deiner UI. Ignorierst du die Events, ist dein Frontend "tot" und
aktualisiert sich erst beim Neustart.

## Anfragen im Detail

Hier alle Anfragen, die du an den Daemon stellen kannst.

### HELLO

Ein simpler Ping, um die Verbindung am Leben zu halten und zu prüfen, ob der
Daemon noch da ist. Schick das ruhig alle paar Sekunden.

```json
→ { "type": "HELLO", "requestId": "req_1", "data": {} }
← { "requestId": "req_1", "type": "HELLO_RESPONSE", "success": true }
```

### GET_GAMES

Holt die Liste der aktuell sichtbaren Spiele. "Sichtbar" heißt: gefiltert nach der
gerade aktiven Spieleliste (dazu unten mehr).

```json
→ { "type": "GET_GAMES", "requestId": "req_2", "data": {} }
← {
    "requestId": "req_2",
    "type": "GET_GAMES_RESPONSE",
    "success": true,
    "data": {
      "games": [
        {
          "id": "a886c2be368d83c6821f1a615b8561a9",
          "name": "Super Mario 64",
          "console": "Nintendo 64",
          "extension": "n64",
          "filename": "a886c2be368d83c6821f1a615b8561a9.n64",
          "cover_art": true
        }
      ]
    }
  }
```

Das `id`-Feld ist die eindeutige Kennung eines Spiels - die brauchst du für
`START_GAME` und `GET_COVER`. `cover_art` sagt dir nur, **ob** es überhaupt ein
Cover gibt.

### GET_COVER

Holt das Cover-Bild eines Spiels als **Base64**-String (PNG oder JPG). Ideal, um
es erst dann nachzuladen, wenn du es wirklich anzeigst.

```json
→ { "type": "GET_COVER", "requestId": "req_3", "data": { "gameId": "a886c2be..." } }
← {
    "requestId": "req_3",
    "type": "GET_COVER_RESPONSE",
    "success": true,
    "data": { "gameId": "a886c2be...", "coverData": "iVBORw0KGgo..." }
  }
```

Ist `coverData` leer, gibt es kein Cover - dann zeig einfach einen Platzhalter.

### GET_APPS

Neben Spielen kann Arcader auch **Apps** starten - das sind entweder Web-Apps
(ein Vollbild-Browser, z. B. für Jellyfin oder YouTube) oder native Programme.
`GET_APPS` holt die Liste der aktuell aktivierten Apps, in der im Dashboard
festgelegten Reihenfolge.

```json
→ { "type": "GET_APPS", "requestId": "req_6", "data": {} }
← {
    "requestId": "req_6",
    "type": "GET_APPS_RESPONSE",
    "success": true,
    "data": {
      "apps": [
        {
          "id": "45d24f0f2e37de2731373988a66bcaec",
          "name": "Jellyfin",
          "type": "web",
          "url": "https://jellyfin.example/tv",
          "userAgent": null,
          "exec": null,
          "args": [],
          "icon": true,
          "enabled": true,
          "position": 0
        }
      ]
    }
  }
```

`type` ist `"web"` oder `"native"`. Bei `web`-Apps ist `url` gesetzt (und
optional `userAgent`), bei `native`-Apps `exec` und `args`. `icon` sagt dir - wie
`cover_art` bei Spielen - nur, **ob** es ein Icon gibt. Die `id` brauchst du für
`GET_APP_ICON` und `LAUNCH_APP`.

Genau wie bei den Spielen gilt: einmal holen, cachen, und bei einem
`APPS_UPDATED`-Event neu laden.

### GET_APP_ICON

Holt das Icon einer App als **Base64**-String (PNG) - das Gegenstück zu
`GET_COVER`.

```json
→ { "type": "GET_APP_ICON", "requestId": "req_7", "data": { "appId": "45d24f0f..." } }
← {
    "requestId": "req_7",
    "type": "GET_APP_ICON_RESPONSE",
    "success": true,
    "data": { "appId": "45d24f0f...", "iconData": "iVBORw0KGgo..." }
  }
```

Ist `iconData` leer, hat die App kein Icon - dann zeig einen Platzhalter.

### START_GAME

Startet ein Spiel. Der Daemon prüft dabei selbst, ob genug Credits bzw. Zeit da
ist, zieht ggf. ein Credit ab und startet die Emulation.

```json
→ { "type": "START_GAME", "requestId": "req_4", "data": { "gameUuid": "a886c2be..." } }
← {
    "requestId": "req_4",
    "type": "START_GAME_RESPONSE",
    "data": { "success": true, "game": { "id": "a886c2be...", "name": "Super Mario 64", "filename": "..." } }
  }
```

Klappt es nicht (kein Credit, Spiel läuft schon, Datei fehlt ...), kommt
stattdessen:

```json
← { "requestId": "req_4", "type": "START_GAME_ERROR", "error": "No credits available" }
```

Nach einem erfolgreichen Start schickt der Daemon außerdem ein
`UPDATE_SCREEN`-Event mit `"LOADING"` - du musst den Bildschirmwechsel also gar
nicht selbst anstoßen (siehe Events).

### LAUNCH_APP

Startet eine App. Das läuft **genau wie `START_GAME`**: Der Daemon prüft selbst,
ob genug Credits bzw. Zeit da ist, zieht ggf. ein Credit ab und startet die App
(bei `web` einen Vollbild-Browser, bei `native` das Programm). Apps und Spiele
teilen sich denselben Lauf-Slot - es kann also immer nur **eins** gleichzeitig
laufen.

```json
→ { "type": "LAUNCH_APP", "requestId": "req_8", "data": { "appId": "45d24f0f..." } }
← {
    "requestId": "req_8",
    "type": "LAUNCH_APP_RESPONSE",
    "data": { "success": true, "app": { "id": "45d24f0f...", "name": "Jellyfin", "type": "web" } }
  }
```

Klappt es nicht (kein Credit, es läuft schon etwas, kein Browser installiert
...), kommt stattdessen:

```json
← { "requestId": "req_8", "type": "LAUNCH_APP_ERROR", "error": "No credits available" }
```

Wie beim Spielstart schickt der Daemon danach ein `UPDATE_SCREEN` →
`"LOADING"`. Beendet wird eine laufende App über dieselben Wege wie ein Spiel
(`EXIT_GAME` bzw. das Pausenmenü).

### GET_COIN_STATUS

Fragt den kompletten Zustand des Münzsystems ab. Das brauchst du vor allem, wenn
dein Frontend frisch startet und den aktuellen Stand wissen will. Danach hältst
du dich einfach an die `COIN_STATUS`-Events.

```json
→ { "type": "GET_COIN_STATUS", "requestId": "req_5", "data": {} }
← { "requestId": "req_5", "type": "GET_COIN_STATUS_RESPONSE", "success": true, "data": { ... } }
```

Die Felder im `data`-Objekt sind bei der Antwort und beim `COIN_STATUS`-Event
identisch - alle sind unten bei den [Münz-Feldern](#die-munz-felder) beschrieben.

### SET_FREE_PLAY

Schaltet den Freispiel-Modus (Free Play) an oder aus. Das ist der klassische
"Konami-Code-Trick": Nur wenn `konamiCodeEnabled` aktiv ist, darf dein Frontend
Free Play einschalten.

```json
→ { "type": "SET_FREE_PLAY", "requestId": "req_6", "data": { "enabled": true } }
← { "requestId": "req_6", "type": "SET_FREE_PLAY_RESPONSE", "success": true, "data": { ... } }
```

### RESUME_GAME / EXIT_GAME

Diese beiden steuern das Pausenmenü, das sich während eines laufenden Spiels
öffnet (siehe die `OVERLAY_*`-Events). Sie sind reine **Feuer-und-vergiss**-
Befehle: keine `requestId`, keine Antwort.

```json
→ { "type": "RESUME_GAME", "data": {} }   # weiterspielen
→ { "type": "EXIT_GAME", "data": {} }     # Spiel beenden, zurück zur Bibliothek
```

### USB-Anfragen

Arcader kann Spiele, Speicherstände, Listen und Einstellungen auf einen
USB-Stick sichern und wieder einlesen. Dafür gibt es vier Anfragen:

```json
→ { "type": "USB_STATUS", "requestId": "req_7", "data": {} }
← { "requestId": "req_7", "type": "USB_STATUS_RESPONSE", "success": true,
    "data": { "inserted": true, "mountpoint": "/media/usb", "label": "ARCADER" } }
```

```json
→ { "type": "USB_SCAN", "requestId": "req_8", "data": {} }
← { "requestId": "req_8", "type": "USB_SCAN_RESPONSE", "success": true,
    "data": { "hasBackup": true, "contents": { "games": 12, "saves": 3, "lists": 1, "settings": true } } }
```

`USB_EXPORT` (auf den Stick sichern) und `USB_IMPORT` (vom Stick laden) bekommen
eine Liste der Kategorien mit, die du übertragen willst. Erlaubt sind `games`,
`saves`, `lists` und `settings`:

```json
→ { "type": "USB_EXPORT", "requestId": "req_9", "data": { "categories": ["games", "saves"] } }
← { "requestId": "req_9", "type": "USB_EXPORT_RESPONSE", "success": true, "data": { ... } }

→ { "type": "USB_IMPORT", "requestId": "req_10", "data": { "categories": ["saves"] } }
← { "requestId": "req_10", "type": "USB_IMPORT_RESPONSE", "success": true, "data": { ... } }
```

Export und Import laufen im Hintergrund. Während sie arbeiten, schickt dir der
Daemon `USB_PROGRESS`-Events, damit du einen Fortschrittsbalken zeigen kannst.
Die `_RESPONSE`-Nachricht kommt erst, wenn alles fertig ist.

## Events im Detail

Das sind die Nachrichten, die der Daemon **von sich aus** schickt. Auf jedes für
dich relevante Event solltest du reagieren.

### Bildschirmsteuerung

| Event | Bedeutung |
|-------|-----------|
| `UPDATE_SCREEN` | Der Daemon sagt dir, welchen Bildschirm du zeigen sollst. `data.screen` ist `"LOADING"` (Spiel startet), `"SELECTION"` (Spielauswahl / Hauptmenü) oder `"COIN"` (Münzbildschirm). |

Der Daemon steuert die Bildschirmwechsel also selbst mit. Beispiel: Endet ein
Spiel und es sind keine Credits mehr da, schickt er `UPDATE_SCREEN` →
`"COIN"`. Schaltet der Admin den Münzschacht wieder ein, während der Automat im
Leerlauf ist, kommt ebenfalls `"COIN"`. Dein Frontend sollte dem einfach folgen.

### Münz-Events

| Event | Bedeutung |
|-------|-----------|
| `COIN_STATUS` | Der Münz-Zustand hat sich geändert (Konfiguration, Freispiel, Hardware ...). `data` enthält den kompletten Status. |
| `COIN_INSERTED` | Es wurde gerade eine Münze eingeworfen. `data` ist derselbe Status wie bei `COIN_STATUS`. |

<a id="die-munz-felder"></a>
**Die Münz-Felder** im `data`-Objekt von `COIN_STATUS`, `COIN_INSERTED` und
`GET_COIN_STATUS_RESPONSE`:

| Feld | Typ | Bedeutung |
|------|-----|-----------|
| `credits` | int | Anzahl der aktuell verfügbaren Credits. |
| `remainingSeconds` | int | Restspielzeit in Sekunden (im Zeitmodus). |
| `timeMode` | bool | Läuft der Automat im Zeitmodus (Zeit statt Credits)? |
| `hardwareConnected` | bool | Ist der Münzprüfer als Hardware erkannt? |
| `freePlay` | bool | Ist Freispiel aktiv? |
| `coinSlotEnabled` | bool | Ist der Münzschacht überhaupt aktiviert? Ist er `false`, soll dein Frontend den Münzbildschirm überspringen. |
| `konamiCodeEnabled` | bool | Darf der Konami-Code für Free Play genutzt werden? |
| `insertMessage` | string | Der Text, den du auf dem Münzbildschirm anzeigen sollst (z. B. "INSERT COIN"). |
| `infoMessage` | string | Der erklärende Untertext auf dem Münzbildschirm. |

Damit ist der komplette Münzbildschirm **live konfigurierbar**: Ändert der Admin
im Dashboard die Texte oder schaltet den Schacht ab, kommt ein `COIN_STATUS` mit
den neuen Werten - und deine UI aktualisiert sich sofort.

### Timer-Events (Zeitmodus)

| Event | Bedeutung |
|-------|-----------|
| `TIMER_START` | Der Countdown beginnt. `data.remainingSeconds` = Startwert. |
| `TIMER_TICK` | Jede Sekunde. `data.remainingSeconds` + `data.warning` (true, wenn die Zeit knapp wird). |
| `TIMER_STOP` | Der Countdown ist vorbei bzw. gestoppt. |

### Overlay-Events (Pausenmenü im Spiel)

Während ein Spiel läuft, kann der Spieler über eine Tastenkombination am Automaten
das Pausenmenü öffnen. Der Daemon meldet das über diese Events - dein Frontend
zeigt daraufhin ein Overlay an:

| Event | Bedeutung |
|-------|-----------|
| `OVERLAY_OPEN` | Menü öffnen. `data.timeMode` + `data.remainingSeconds`. |
| `OVERLAY_NAV` | Navigation im Menü. `data.action` ist `up`, `down`, `select` oder `back`. |
| `OVERLAY_CLOSE` | Menü schließen. |

Auf `select` bzw. `back` reagierst du dann, indem du `RESUME_GAME` oder
`EXIT_GAME` an den Daemon zurückschickst.

### Bibliotheks-Events

| Event | Bedeutung |
|-------|-----------|
| `GAMES_UPDATED` | Die Spielebibliothek hat sich geändert (Spiel hinzugefügt/gelöscht/umbenannt, Core geändert oder die aktive Liste umgestellt). Lade deine Spieleliste mit `GET_GAMES` neu. Es sind keine Daten mit dabei - das Event ist nur ein "hol dir frische Daten"-Signal. |
| `COVER_UPDATED` | Nur das Cover eines einzelnen Spiels hat sich geändert. `data.gameId` sagt dir welches. Wirf das gecachte Bild für diese ID weg und hol es mit `GET_COVER` neu - die Liste selbst musst du **nicht** neu laden. |
| `APPS_UPDATED` | Der App-Katalog hat sich geändert (App hinzugefügt/gelöscht/bearbeitet, umsortiert oder aktiviert/deaktiviert, Icon getauscht). Lade deine App-Liste mit `GET_APPS` neu - das Gegenstück zu `GAMES_UPDATED` für Apps. Keine Daten mit dabei. |

Diese beiden Events sind der Kern des "lebendigen" Verhaltens. Alles, was im
Dashboard oder in der Mobile-App an der Bibliothek geändert wird, landet so
sofort in deinem Frontend.

### USB-Events

| Event | Bedeutung |
|-------|-----------|
| `USB_INSERTED` | Ein Stick wurde eingesteckt und gemountet. `data.mountpoint` + `data.label`. |
| `USB_REMOVED` | Der Stick wurde entfernt. |
| `USB_PROGRESS` | Fortschritt eines Export/Imports. `data.stage`, `data.current`, `data.total`. |

## Ein typischer Ablauf

Damit du ein Gefühl bekommst, wie das alles zusammenspielt, hier der Lebenszyklus
eines Frontends:

1. **Verbinden.** Socket unter `$XDG_RUNTIME_DIR/arcaderd.sock` öffnen und einen
   Lese-Loop starten, der Zeilen puffert und als JSON parst.
2. **Ping.** Alle paar Sekunden `HELLO` schicken. Kommt lange keine Antwort mehr,
   ist der Daemon weg - dann versuchst du, neu zu verbinden.
3. **Grundzustand holen.** Einmal `GET_COIN_STATUS`, `GET_GAMES` und `GET_APPS`
   schicken, damit du weißt, wo du stehst.
4. **Auf Events hören.** Für jedes Event eine Reaktion:
    - `UPDATE_SCREEN` → Bildschirm wechseln.
    - `COIN_STATUS` / `COIN_INSERTED` → Münzbildschirm aktualisieren.
    - `GAMES_UPDATED` → `GET_GAMES` neu holen.
    - `APPS_UPDATED` → `GET_APPS` neu holen.
    - `COVER_UPDATED` → das eine Cover neu holen.
    - `OVERLAY_*` → Pausenmenü zeigen/steuern.
    - `TIMER_*` / `USB_*` → entsprechend anzeigen.
5. **Auf Eingaben reagieren.** Wählt der Spieler ein Spiel, schickst du
   `START_GAME`. Den Rest (Credit abziehen, Emulator starten, Bildschirm
   wechseln) macht der Daemon.

Wenn du diese fünf Punkte beherzigst - und dabei den [Grundsatz von
oben](#der-wichtigste-grundsatz-cachen-ja-aber-reagieren) nicht vergisst - hast
du ein Frontend, das sich genauso lebendig anfühlt wie die Original-Oberfläche.
Viel Spaß beim Bauen!
