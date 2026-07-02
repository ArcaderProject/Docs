---
title: Dashboard
description: Das Web-Dashboard, mit dem du deinen Arcader verwaltest – Spiele hochladen, Emulatoren zuweisen, den Münzschacht einrichten und mehr.
---

## Was ist das Dashboard?

Dein Automat läuft, aber die Spielebibliothek ist noch leer? Genau dafür gibt es das **Dashboard**. Das ist eine Weboberfläche, die direkt auf deinem Arcader läuft. Von hier aus verwaltest du alles: Spiele hochladen, ihnen den richtigen Emulator zuweisen, Cover setzen, Listen bauen, Apps anlegen und den Münzschacht konfigurieren.

Das Schöne daran: du musst nichts extra installieren. Der Arcader-Daemon (`arcaderd`) bringt das Dashboard von Haus aus mit und stellt es im Netzwerk bereit. Du brauchst also nur einen Browser auf einem Gerät, das im selben Netzwerk wie dein Automat hängt.

## Draufkommen

Der Automat stellt das Dashboard auf **Port 5328** bereit. Du erreichst es also unter:

```
http://<ip-deines-automaten>:5328
```

Die IP-Adresse deines Automaten findest du entweder in deinem Router (unter den verbundenen Geräten) oder ganz bequem über die [Mobile-App](/mobile/), die den Automaten automatisch im Netzwerk sucht. Hat dein Automat zum Beispiel die `192.168.1.50`, rufst du `http://192.168.1.50:5328` auf.

:::tip[Lieber vom Handy?]
Wenn du das lieber bequem vom Smartphone aus machst, nimm einfach die [Mobile-App](/mobile/). Die kann exakt dasselbe wie das Dashboard, findet den Automaten von allein und ist fürs Handy gemacht.
:::

### Anmelden

Beim ersten Aufruf landest du auf einer Login-Seite. Das Standard-Passwort ist:

```
arcader
```

:::caution[Passwort ändern]
Solange dein Automat im Netzwerk hängt, kann jeder mit dem Standard-Passwort auf dein Dashboard. Änder das Passwort direkt nach dem ersten Login unter [Einstellungen](#einstellungen).
:::

## Die Bereiche im Überblick

Oben im Dashboard wechselst du zwischen den einzelnen Bereichen. Hier ist, was jeder davon kann.

### Bibliothek

Das ist die Startseite und dein Hauptwerkzeug. Hier lebt deine Spielesammlung.

- **Spiele hochladen.** Zieh deine ROM-Dateien rein, und Arcader legt sie in der Bibliothek ab.
- **Emulator (Core) zuweisen.** Für jedes Spiel wählst du aus, mit welchem Emulator es laufen soll. Arcader schlägt anhand der Dateiendung meist schon den passenden vor.
- **Umbenennen und löschen.** Namen anpassen oder ein Spiel wieder rauswerfen.
- **Cover setzen.** Lade ein eigenes Bild hoch oder lass Arcader über SteamGridDB automatisch ein passendes Cover suchen (dafür brauchst du einen SteamGridDB-API-Key, den du in den Einstellungen hinterlegst).
- **Läuft gerade.** Wird gerade gespielt, siehst du hier, welches Spiel aktiv ist.

### Listen

Mit Listen sortierst du deine Bibliothek in Kategorien - zum Beispiel "Beat 'em ups", "Zu zweit" oder "Klassiker". Am Automaten wird dann nur die gerade aktive Liste angezeigt. So kannst du je nach Anlass eine andere Auswahl zeigen, ohne Spiele löschen zu müssen. Du legst Listen an, benennst sie um, füllst sie mit Spielen und schaltest die aktive Liste um.

### Speicher

Hier geht es um **Speicherstände**. Arcader arbeitet mit Speicher-Profilen, sodass sich mehrere Leute nicht die Spielstände gegenseitig überschreiben. Du kannst Profile anlegen, umbenennen, aktivieren, sperren und die Speicherstände einzelner Spiele einsehen oder löschen.

### Apps

Arcader kann nicht nur Spiele starten, sondern auch **Apps**. Davon gibt es zwei Sorten:

- **Web-Apps** öffnen eine Webseite im Vollbild-Browser - zum Beispiel Jellyfin, YouTube oder einen Streaming-Dienst.
- **Native Apps** starten ein Programm, das auf dem Automaten installiert ist.

Im App-Bereich legst du solche Apps an, gibst ihnen ein Icon, sortierst sie und schaltest sie an oder aus. Am Automaten tauchen sie dann neben den Spielen auf. Und ja - auch für Apps kann ein Credit fällig werden, genau wie bei Spielen.

### Einstellungen

Der wichtigste Bereich nach der Bibliothek. Hier stellst du ein, wie sich dein Automat verhält.

**Münzschacht:**

| Einstellung | Bedeutung |
|-------------|-----------|
| Münzschacht aktiv | Schaltet den ganzen Münz-Kram an oder aus. Aus = Freispiel für alle. |
| Zeitmodus | Statt Credits gibt eine Münze **Spielzeit**. |
| Minuten pro Münze | Wie viel Zeit eine Münze im Zeitmodus bringt. |
| "INSERT COIN"-Text | Der große Text auf dem Münzbildschirm. |
| Info-Text | Der kleinere erklärende Untertext darunter. |
| Konami-Code | Erlaubt den Konami-Code als versteckten Freispiel-Trick. |

**Weitere Einstellungen:**

- **Admin-Passwort ändern** - unbedingt gleich am Anfang machen.
- **SteamGridDB-API-Key** - damit die automatische Cover-Suche funktioniert.
- **Lautstärke** des Automaten.
- **Frontends** - hier kannst du die Godot-Oberfläche aktualisieren oder auf ein anderes Frontend umstellen. Willst du dein ganz eigenes bauen, schau dir die Seite [Eigenes Frontend](/frontend/) an.

### Debug

Für die Technik-Nerds unter euch: der Debug-Bereich blendet ein echtes Terminal direkt auf dem Automaten ein - mitten im Browser. Praktisch, um mal schnell etwas nachzuschauen oder Logs zu checken, ohne Tastatur und Monitor am Automaten anschließen zu müssen.

## Live-Aktualisierung

Ein letzter Punkt, der Arcader angenehm macht: alles, was du im Dashboard änderst, landet **sofort** am Automaten. Fügst du ein Spiel hinzu, schaltest du den Münzschacht ab oder änderst du den "INSERT COIN"-Text, aktualisiert sich die Oberfläche am Automaten in Echtzeit. Du musst nichts neu starten. Genau dieses Verhalten steckt auch hinter der Seite [Eigenes Frontend](/frontend/), falls du selbst eine Oberfläche bauen willst.
