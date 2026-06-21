# 🏛️ Katedra OtakOS: V_ZERO

> **Zasada Punktu Zero:** 100% lokalnej suwerenności, 0% wycieku telemetrii. Twój prywatny cyber-schron (cyber-shelter) zintegrowany z lokalnymi modelami sztucznej inteligencji.

**Katedra OtakOS: V_ZERO** to kompletny, suwerenny ekosystem cognitive i finansowy skompresowany do formy mobilnego systemu Live-USB oraz wersji webowej gotowej do wdrożenia chmurowego (Google Cloud Run). Projekt stawia na całkowitą niezależność obliczeniową (lokalny VRAM) oraz suwerenność tożsamości finansowej (P2P).

---

## 💎 Główne Moduły Systemu

1. **P2P Wallet Core & GRV Economy:** Każda instancja Katedry posiada unikalny adres portfela EVM oraz ID węzła P2P, generowane całkowicie lokalnie w oparciu o kryptografię asymetryczną.
2. **Skarbiec Kryptograficzny (Sovereign Wallets & Fiat Gateways):** Obsługa suwerennych donacji krypto (MetaMask EVM, Web3 Lite Wallet) oraz tradycyjnych bramek fiat (PayPal, Buy Me a Coffee).
3. **Download Node (Live-USB):** Szybki serwer statyczny serwujący odchudzoną paczkę UEFI Portable Live-USB (~12.4 MB) z autostartem i mostem systemowym.
4. **Offline Brain (Gemma4):** Integracja z lokalnymi modelami AI Ollama/MediaPipe (model `gemma4` / `gemma2:2b`) dla zapewnienia pełnej prywatności zapytań.

---

## ⚡ Uruchomienie Lokalne (Frontend)

### Wymagania:
* [Node.js](https://nodejs.org/) (wersja 20+)

### Instrukcja startu:
1. Pobierz zależności:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Uruchom serwer deweloperski Vite:
   ```bash
   npm run dev
   ```
   Aplikacja będzie dostępna pod adresem: `http://localhost:3000`

---

## 🚀 Wdrożenie produkcyjne (Google Cloud Run)

Projekt zawiera zintegrowany plik `Dockerfile` oraz konfigurację `nginx.conf` dedykowaną pod bezproblemowe wdrożenie na Google Cloud Run z wykorzystaniem kontenera Nginx na porcie `8080`.

### Wdrożenie przez Google Cloud Console:
1. Utwórz nową usługę na [Google Cloud Run](https://console.cloud.google.com/run).
2. Połącz usługę ze swoim repozytorium GitHub (`TeOMusicStudioSMT/OtakOS-DeeP`).
3. Wybierz kompilację **Dockerfile** na gałęzi `main`.
4. Zapisz — Google Cloud Build automatycznie zbuduje kontener i udostępni aplikację pod Twoją domeną.

---

## 📱 Uruchomienie na Androidzie (np. Google Pixel 9)

Chociaż mobilne systemy operacyjne nie pozwalają na bootowanie z nośnika UEFI Live-USB, możesz uruchomić pełną instancję mostu backendowego (`wiesio-bridge.js`) oraz interfejs Katedry bezpośrednio na swoim smartfonie Pixel 9.

### Metoda A: Instalacja interfejsu (PWA) — Błyskawiczna
1. Otwórz Chrome na telefonie i wejdź na swoją wdrożoną stronę (np. `https://otakos.wtf`).
2. Kliknij ikonę menu Chrome (trzy kropki) i wybierz **Dodaj do ekranu głównego**.
3. Aplikacja otworzy się w pełnym ekranie, oferując tactile retro dźwięki, animacje i pełną responsywność bez pasków nawigacji.

### Metoda B: Uruchomienie lokalnego serwera (Termux)
Umożliwia uruchomienie lokalnego API mostu (port `3001`) bezpośrednio na procesorze ARM Twojego telefonu:
1. Pobierz i zainstaluj aplikację terminala **Termux** (zalecane instalowanie z repozytorium [F-Droid](https://f-droid.org/packages/com.termux/)).
2. Zaktualizuj pakiety i zainstaluj Node.js oraz Git:
   ```bash
   pkg update
   pkg install nodejs git
   ```
3. Sklonuj to repozytorium na telefonie:
   ```bash
   git clone https://github.com/TeOMusicStudioSMT/OtakOS-DeeP.git
   cd OtakOS-DeeP
   ```
4. Zainstaluj zależności i uruchom most systemowy:
   ```bash
   npm install --legacy-peer-deps
   node wiesio-bridge.js
   ```
Twój telefon stanie się autonomicznym, lokalnym węzłem Katedry z aktywnym API!

## ⚙️ Automatyzacja Uruchamiania (Autostart z USB)

Windows domyślnie blokuje automatyczne uruchamianie plików z pendrive'ów z przyczyn bezpieczeństwa. W pakiecie Live-USB przygotowaliśmy dwa sposoby automatyzacji uruchamiania Katedry:

### Sposób 1: Uruchomienie przy fizycznym włożeniu pendrive'a (Harmonogram Zadań - zalecane)
Ten sposób wykorzystuje systemowy dziennik zdarzeń Windows do natychmiastowego startu Katedry po wykryciu urządzenia USB:
1. Wejdź do folderu `TeO_Genesis_V_ZERO` na pendrive.
2. Kliknij prawym przyciskiem myszy na plik `INSTALL_AUTOSTART.bat` i wybierz **Uruchom jako administrator**.
3. Skrypt włączy rejestrowanie zdarzeń podłączania sterowników i utworzy zadanie harmonogramu (`Autostart_Katedra.xml`), które automatycznie przeskanuje litery dysków i uruchomi `START_KATEDRA.bat` po włożeniu nośnika.

### Sposób 2: Autostart podczas logowania do systemu Windows (Folder Autostart)
Ten sposób uruchamia Katedrę przy każdym starcie systemu (o ile pendrive jest wpięty):
1. Naciśnij skrót `Win + R`, wpisz `shell:startup` i kliknij **Enter** (otworzy to systemowy folder autostartu użytkownika).
2. Kliknij prawym przyciskiem myszy na plik `START_KATEDRA.bat` na pendrive i przeciągnij go do otwartego folderu, wybierając **Utwórz skróty tutaj**.
3. Gotowe. Przy każdym starcie komputera Windows sam odnajdzie właściwy napęd USB i uruchomi Katedrę.

---

## 🧠 Pobieranie Lokalnego Mózgu (gemma4)
Aby pobrać model do pracy lokalnej na komputerze, użyj dostarczonego skryptu PowerShell:
```powershell
.\fetch-local-brain.ps1
```
Skrypt automatycznie pobierze zoptymalizowany model `gemma4.gguf` (bazowany na `gemma2:2b-it-Q4_K_M`) do folderu `/public/models/`. Możesz go załadować bezpośrednio w lokalnej instalacji Ollama lub użyć wbudowanego mostu Wiesio-Bridge do automatycznej integracji.
