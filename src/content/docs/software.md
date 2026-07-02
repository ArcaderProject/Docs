---
title: Software
description: Die verschiedenen Wege, Arcader zu installieren – ob auf dem Automaten, einem gängigen Gerät oder als Bootstick.
---

## Installationsart
Ok du willst Arcader also installieren? Dann Schauen wir zunächt mal was hier der richtige Weg für dich ist!

1. Du kommst grader von der [Aufbau](/hardware/) Seite und willst nun wissen wie du Arcader auf deine Maschiene bekommst? Das siehst du unter [Installation für den Arcader Automat](/software/#installation-für-den-arcader-automat).
2. Willst du Arcader auf zb. einen alten PC installieren, schau dir [Installation für gängige Geräte](/software/#installation-für-gängige-geräte) an.
3. Willst du eine mobile Maschiene die du in der Hosentasche mitnehmen kannst, nimm die [Installation als Bootstick](/software/#installation-als-bootstick).

Bevor wir loslegen, kurz zum großen Ganzen, damit du weißt was da eigentlich passiert. Arcader kommt als fertiges Betriebssystem, wir nennen es **Arcader OS**. Das ist ein schlankes Debian Linux, das direkt in Arcader hochbootet - kein Desktop, kein Login, einfach an und zocken. Auf dem System läuft im Hintergrund der **Arcader-Daemon** (`arcaderd`), der sich um Spiele, Emulation, den Münzschacht und den ganzen Rest kümmert, und davor die Godot-Oberfläche (`arcaderui`), die du am Bildschirm siehst.

Es gibt zwei Wege, an Arcader OS zu kommen:

- Der **Arcader Imager** - unser kleines Tool für Windows, macOS und Linux. Es lädt Arcader OS und schreibt es auf einen USB-Stick. Das ist der einfachste Weg und den empfehlen wir jedem.
- Der **manuelle Weg über APT** - für alle, die schon ein Debian oder Ubuntu laufen haben und Arcader einfach dazu installieren wollen, ohne alles neu aufzusetzen. Dazu unten mehr.

:::note[Internet beim ersten Start]
Beim allerersten Booten lädt sich Arcader RetroArch und die Emulator-Cores selbst nach. Häng den Automaten also fürs erste Hochfahren ans Internet (LAN oder WLAN). Danach läuft alles offline.
:::

## Der Arcader Imager
Egal ob Automat oder Bootstick - der Startpunkt ist fast immer der **Arcader Imager**. Der lädt automatisch die neueste Version von Arcader OS herunter und schreibt sie startfähig auf einen USB-Stick oder eine SD-Karte. Du musst dich also um nichts kümmern, kein manuelles ISO-Suchen, kein `dd`.

Den Imager gibt's für dein System direkt auf der [Startseite](/) zum Download, oder du holst ihn dir von den [Releases auf GitHub](https://github.com/ArcaderProject/Imager/releases/latest).

So läuft das Flashen ab:

1. **Imager öffnen.** Er prüft im Hintergrund, welche Version von Arcader OS gerade aktuell ist, und zeigt sie dir oben unter *Image* an.
2. **Image wählen.** Standardmäßig ist "Arcader OS" in der 64-Bit-Variante ausgewählt. Hast du einen älteren Rechner, kannst du auf **32-Bit** umstellen. Über *Local image…* kannst du auch eine eigene `.iso`/`.img`-Datei nehmen, falls du eine hast.
3. **Speicher wählen.** Unter *Storage* steckst du deinen USB-Stick rein und wählst ihn aus. Der Imager zeigt dir nur Wechseldatenträger an, damit du nicht ausversehen deine Festplatte erwischst.
4. **Write drücken.** Es kommt eine Sicherheitsabfrage (der Stick wird komplett gelöscht!) und danach eine Passwort- bzw. Admin-Abfrage von deinem System - das braucht der Imager, um direkt auf den Stick schreiben zu dürfen.
5. **Warten.** Der Imager lädt, schreibt und prüft am Ende noch mal jedes Byte gegen. Wenn oben "Write complete" steht, kannst du den Stick abziehen.

:::caution[Achtung, der Stick wird gelöscht]
Beim Schreiben wird der komplette Inhalt des gewählten Sticks überschrieben. Zieh vorher alles runter, was du noch brauchst, und wähl wirklich den richtigen Datenträger aus.
:::

## Installation für den Arcader Automat
Du hast also deinen Automaten fertig gebaut, ein Rechner oder Board steckt drin, und jetzt soll Arcader drauf. Perfekt, das ist der Standardfall.

### Schritt 1: Stick erstellen
Nimm dir einen USB-Stick (8 GB reichen locker) und flash Arcader OS mit dem [Arcader Imager](/software/#der-arcader-imager) drauf, wie oben beschrieben.

### Schritt 2: Vom Stick booten
Steck den Stick in den Rechner deines Automaten und starte ihn. Damit er auch vom Stick startet und nicht von der internen Platte, musst du meist einmal ins BIOS/UEFI (oft mit `F2`, `F12`, `Entf` oder `Esc` direkt beim Einschalten) und dort den USB-Stick als erstes Bootgerät wählen bzw. das Bootmenü aufrufen.

### Schritt 3: Auf die Platte installieren
Arcader OS bootet erst mal komplett vom Stick. Beim allerersten Start meldet sich automatisch der **Arcader-Installer** und fragt dich, auf welche Festplatte du Arcader installieren willst. Wähl die interne Platte deines Automaten aus und bestätige.

Der Installer richtet dann alles ein: er partitioniert die Platte, kopiert das System rüber, installiert den Bootloader und macht den Automaten startklar. Steht dein Bildschirm auf dem Kopf (bei manchen Einbauten dreht man den Monitor), kannst du im Installer die **Bildschirmausrichtung** direkt mit umstellen.

:::tip
Der Installer installiert bewusst **nicht** auf den USB-Stick selbst, sondern nur auf eine interne Platte. So kann nichts schiefgehen und du überschreibst dir nicht ausversehen deinen Boot-Stick.
:::

### Schritt 4: Stick raus, fertig
Nach der Installation fährst du den Automaten runter, ziehst den Stick ab und startest neu. Ab jetzt bootet dein Automat direkt in Arcader - ohne Login, ohne Desktop, direkt ins Menü.

### Und der Münzschacht?
Hast du beim [Aufbau](/hardware/#coin-acceptor) einen Coin Acceptor mit Arduino verbaut, brauchst du nichts weiter zu tun. Arcader erkennt den Arduino automatisch über USB, spielt bei Bedarf sogar selbst die passende Firmware auf und schaltet den Münzschacht scharf. Ob die Hardware erkannt wurde, siehst du später im [Dashboard](/dashboard/) oder in der [Mobile-App](/mobile/).

## Installation für gängige Geräte
Du willst Arcader nicht auf einen selbstgebauten Automaten packen, sondern auf einen alten PC, Laptop oder Mini-Rechner? Auch gut. Hier hast du zwei Wege.

### Weg A: Arcader OS installieren (empfohlen)
Das läuft **genau wie beim Automaten**: Stick mit dem [Imager](/software/#der-arcader-imager) erstellen, vom Stick booten und mit dem Arcader-Installer auf die interne Platte installieren (siehe die [Schritte oben](/software/#installation-für-den-arcader-automat)). Danach ist das Gerät ein reinrassiger Arcader und macht sonst nichts mehr. Ideal, wenn der Rechner eh nur noch fürs Retro-Gaming da sein soll.

### Weg B: Arcader auf ein bestehendes Linux dazu installieren
Du hast schon ein Debian oder Ubuntu am Laufen und willst dein System **nicht** platt machen? Dann installier Arcader einfach als Paket dazu. Ein Befehl reicht:

```sh
curl -fsSL https://raw.githubusercontent.com/ArcaderProject/Arcader/main/scripts/install.sh | sudo bash
```

Das Skript hängt unsere Paketquelle (APT-Repository) ein, installiert das Paket `arcader` und richtet alles fürs Kiosk-Verhalten ein: Autologin, den Grafik-Kram (X, Openbox) und automatische Updates. Nach einem Neustart bootet auch dieses Gerät direkt in Arcader.

Wenn du die Paketquelle lieber selbst einträgst und nur das Paket haben willst, geht auch der klassische Weg:

```sh
sudo apt install arcader
```

:::note[Paketname vs. Programm]
Kleiner Stolperstein: das **Paket** heißt `arcader`, der laufende **Dienst** dahinter aber `arcaderd`. Du installierst also `arcader`, verwaltest den Hintergrunddienst später aber über `systemctl --user status arcaderd`.
:::

Unterstützt werden die Architekturen **amd64** (64-Bit) und **i386** (32-Bit) - also so ziemlich jeder normale PC oder Laptop. Ein Raspberry Pi wird aktuell noch **nicht** unterstützt.

## Installation als Bootstick
Du willst keinen festen Automaten, sondern einen Arcader zum Mitnehmen? Einen Stick, den du in jeden beliebigen Rechner steckst, kurz bootest und losspielst? Kein Problem, genau dafür ist Arcader OS ein **Live-System**.

Der Trick: du machst einfach **Schritt 1 und 2** von oben - Stick mit dem [Imager](/software/#der-arcader-imager) flashen, vom Stick booten - und lässt **Schritt 3 (die Installation) einfach weg**. Wenn sich der Installer meldet, brichst du ihn ab bzw. lässt die Platte in Ruhe. Arcader läuft dann komplett vom Stick, ohne irgendwas auf dem Rechner zu verändern.

So hast du deinen Arcader immer in der Hosentasche und machst aus jedem PC für ein paar Runden einen Arcade-Automaten.

:::caution[Live heißt: nichts wird gespeichert]
Ein reiner Bootstick ist ein Live-System und merkt sich **nichts** über einen Neustart hinweg. Neu hinzugefügte Spiele, Speicherstände oder Einstellungen sind nach dem Ausschalten wieder weg. Willst du deine Bibliothek dauerhaft behalten, installier Arcader lieber auf eine Platte (Weg A) - oder sichere deine Sachen per [USB-Export](/mobile/) auf einen zweiten Stick.
:::

## Wie geht's weiter?
Arcader läuft - und jetzt? Ohne Spiele ist ja noch nicht viel los. Zum Befüllen und Einstellen deines Automaten hast du zwei Werkzeuge, beide brauchen nur, dass dein Handy oder dein Laptop im selben Netzwerk wie der Automat hängt:

- Das **[Dashboard](/dashboard/)** - eine Weboberfläche, die direkt auf dem Automaten läuft. Du rufst sie im Browser auf und lädst Spiele hoch, ordnest ihnen Emulatoren zu, richtest den Münzschacht ein und mehr.
- Die **[Mobile-App](/mobile/)** - dasselbe bequem vom Handy aus, inklusive automatischer Suche nach Automaten im Netzwerk.

Und wenn dir die mitgelieferte Oberfläche nicht reicht, kannst du dir sogar dein [eigenes Frontend](/frontend/) bauen.
