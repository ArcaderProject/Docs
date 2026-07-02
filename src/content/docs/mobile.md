---
title: Mobile-App
description: Die Android-App, mit der du deinen Arcader bequem vom Handy aus verwaltest – Automaten im Netzwerk finden, Spiele hochladen, Münzschacht einstellen.
---

## Wozu die App?

Das [Dashboard](/dashboard/) im Browser ist super, aber manchmal willst du einfach nur schnell vom Sofa aus ein Spiel hochladen oder den Münzschacht abschalten. Genau dafür gibt es die **Arcader Mobile-App**. Sie kann alles, was das Dashboard kann, ist aber fürs Handy gemacht und findet deine Automaten von ganz allein im Netzwerk.

Die App richtet sich an dich als Betreiber des Automaten - also zum Verwalten, nicht zum Spielen. Gespielt wird nach wie vor am Automaten selbst.

## Installieren

Die App gibt's für **Android**. Du holst dir die `.apk` direkt von den [Releases auf GitHub](https://github.com/ArcaderProject/Mobile/releases/latest) und installierst sie. Weil sie nicht aus dem Play Store kommt, musst du in den Android-Einstellungen einmalig erlauben, Apps aus dieser Quelle zu installieren.

:::note[Welche APK?]
Bei den Downloads findest du mehrere `.apk`-Dateien. Wenn du unsicher bist, nimm die **universal**-Variante - die läuft auf jedem Android-Gerät. Die anderen sind auf bestimmte Prozessor-Typen zugeschnitten und etwas kleiner.
:::

## Automat verbinden

Damit die App mit deinem Automaten reden kann, müssen **beide im selben Netzwerk** sein - dein Handy also im selben WLAN wie der Automat.

Es gibt zwei Wege, den Automaten hinzuzufügen:

1. **Automatisch suchen.** Die App durchsucht dein Netzwerk selbstständig nach Arcader-Automaten und listet die gefundenen auf. Meist reicht ein Tipp und du bist verbunden.
2. **Von Hand über die IP.** Findet die Suche nichts (kommt in manchen Netzwerken vor), kannst du die IP-Adresse deines Automaten auch direkt eintippen.

Beim ersten Verbinden gibst du das Admin-Passwort ein (Standard ist `arcader`, siehe [Dashboard](/dashboard/#anmelden)). Danach merkt sich die App den Automaten, und du bist beim nächsten Mal direkt drin. Änderst du später das Passwort, verbindet sich die App automatisch neu.

## Was du damit machen kannst

Die App ist in mehrere Tabs aufgeteilt, die dir aus dem [Dashboard](/dashboard/) schon bekannt vorkommen dürften:

- **Bibliothek** - Spiele hochladen, umbenennen, löschen, den Emulator (Core) zuweisen, Cover setzen (auch automatisch per SteamGridDB) und Spiele direkt vom Handy aus am Automaten starten oder stoppen.
- **Listen** - deine Spielelisten anlegen, füllen und die aktive Liste umschalten.
- **Speicher** - die Speicher-Profile und Spielstände verwalten.
- **Konsole** - ein Live-Terminal und die Logs deines Automaten, direkt am Handy. Praktisch fürs Nachschauen unterwegs.
- **Einstellungen** - der Münzschacht (Credits oder Zeitmodus, Minuten pro Münze, die Bildschirmtexte, Konami-Code), das Admin-Passwort, der SteamGridDB-Key und die Apps.

### Live-Status vom Münzschacht

Ein nettes Extra: in den Einstellungen siehst du eine Live-Karte mit dem aktuellen Zustand des Münzsystems - wie viele Credits gerade da sind, wie viel Zeit noch übrig ist, ob Freispiel läuft und ob die Coin-Acceptor-Hardware überhaupt erkannt wurde. So prüfst du mit einem Blick, ob dein Münzschacht sauber angeschlossen ist.
