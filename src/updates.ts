/**
 * 📡 updates.ts — KRONIKA UPDATE'ów OtakOS (changelog wg warstw ekosystemu).
 *
 * Mechanizm: Klaudiusz dopisuje nowy wpis NA GÓRZE listy przy każdym pushu
 * istotnej zmiany i deployuje stronę. Sektory = warstwy ekosystemu.
 */

export type SectorId = 'core' | 'grv' | 'crypto' | 'mesh' | 'web' | 'distro';

export interface Sector {
  id: SectorId;
  label: { pl: string; en: string };
  icon: string;
  color: string;
}

export interface UpdateEntry {
  date: string;          // YYYY-MM-DD
  ref?: string;          // krótki hash commita
  sector: SectorId;
  title: string;
  desc: string;
}

export const SECTORS: Sector[] = [
  { id: 'core',   label: { pl: 'Rdzeń & AI',      en: 'Core & AI' },        icon: '🧠', color: '#34d399' },
  { id: 'grv',    label: { pl: 'Ekonomia GRV',     en: 'GRV Economy' },      icon: '⚖️', color: '#f59e0b' },
  { id: 'crypto', label: { pl: 'Krypto & Tarcza',  en: 'Crypto & Shield' },  icon: '🔐', color: '#fb7185' },
  { id: 'mesh',   label: { pl: 'Sieć & Mapa',      en: 'Network & Map' },    icon: '🗺️', color: '#22d3ee' },
  { id: 'web',    label: { pl: 'Strona & UI',      en: 'Web & UI' },         icon: '🌐', color: '#a78bfa' },
  { id: 'distro', label: { pl: 'Dystrybucja',       en: 'Distribution' },     icon: '📦', color: '#94a3b8' },
];

/** Najnowsze NA GÓRZE. */
export const UPDATES: UpdateEntry[] = [
  {
    date: '2026-08-13',
    ref: '95d44b4',
    sector: 'core',
    title: 'Spiżarnia Zasobów — katalog, który mówi, czego NIE potrafi',
    desc: 'Katalog darmowych źródeł dla modułów Katedry, zbudowany na znanej liście „300 darmowych stron". Przy czytaniu tej listy wyszła rzecz, która zmieniła cały kształt modułu: to jest spis stron DLA CZŁOWIEKA, a nie katalog interfejsów, które program może wywołać. Agent nie pobierze niczego z serwisu, który ma tylko stronę do klikania. Zbudowanie funkcji udającej, że pobiera z każdego wpisu, byłoby atrapą — więc zamiast tego każdy zasób nosi widoczną etykietę: wywoływalny bez klucza, wymagający rejestracji, albo miejsce wyłącznie dla człowieka. Pobieranie działa tylko dla pierwszych; dla reszty moduł mówi wprost, że pobrania nie było, i podaje odnośnik. Z dwudziestu dziewięciu pozycji siedem da się realnie odpytać — i to są te, które nakarmią Dom Joanny, montażownię i etap rysowania kadrów. Przy okazji dwie rzeczy złapane własnym testem: jedno źródło miało etykietę „wywoływalne", nie mając czym wywołać, a wyszukiwarka nie łączyła zapytania „Joanna" z modułem „Dom Joanny" — polska odmiana. Oba naprawione. Wskaźnik stanu nie jest zieloną kropką: przycisk realnie odpytuje źródło i pokazuje, co wróciło.'
  },
  {
    date: '2026-08-13',
    ref: 'b715b09',
    sector: 'crypto',
    title: 'Portfel przestał zaniżać stan posiadania',
    desc: 'Katedra liczyła wyłącznie salda natywne — ether, matic, bnb. Wszystko, co leży w tokenach, dla systemu nie istniało. Ta zaniżona suma szła prosto do modułów analitycznych jako obraz portfela, a zła liczba na wejściu psuje każdy wniosek dalej. Skala okazała się większa, niż zakładałem: na publicznym adresie testowym stary widok pokazywał około trzydziestu procent stanu posiadania. Odczyt tokenów idzie tymi samymi publicznymi węzłami sieci, których używały salda natywne — bez żadnego klucza, bez rejestracji, bez pośrednika. Dwie rzeczy trzeba było zmierzyć, nie zgadnąć. Po pierwsze, darmowy plan serwisu z cenami przyjmuje dokładnie jeden adres kontraktu na zapytanie, więc pierwsza, oczywista wersja nie zwracała ani jednej ceny; znane tokeny idą teraz jednym zbiorczym zapytaniem. Po drugie, liczba miejsc po przecinku czytana jest z samego kontraktu, a nie z naszej tabelki — pomyłka w spisie nie zamieni się wtedy w fałszywe saldo. Widzimy tylko te tokeny, o które pytamy, i moduł mówi to wprost: zastąpienie jednego cichego zaniżenia drugim byłoby gorsze niż brak zmiany, bo tym razem suma wyglądałaby na kompletną. Granica bez zmian: tylko odczyt, zero kluczy, zero podpisów, zero transakcji.'
  },
  {
    date: '2026-08-06',
    ref: 'dfcc6ae',
    sector: 'mesh',
    title: 'Telefon jako kamera — i uczciwe „tego się nie da"',
    desc: 'Studio wideopodcastu miało cztery gniazda kamer, ale telefon dało się wpiąć tylko obcym programem instalującym w systemie wirtualną kamerę. Teraz jest droga własna: telefon otwiera stronę, oddaje obraz, koniec. Po drodze trzeba było powiedzieć dwie rzeczy wprost. Pierwsza: Bluetooth nigdy nie przeniesie obrazu — przenosi około dwóch megabitów na sekundę, a obraz w jakości pełnej wysokiej rozdzielczości potrzebuje kilkunastu. To granica fizyczna, nie brak sterownika; aparat sparowany przez Bluetooth nie pojawi się na liście kamer i żadne oprogramowanie tego nie obejdzie. Panel mówi to zamiast pozwalać szukać usterki tam, gdzie jej nie ma. Druga: przeglądarka telefonu nie odda kamery bez bezpiecznego połączenia — sprawdzone na żywo, pod zwykłym adresem w sieci domowej funkcja dostępu do kamery po prostu nie istnieje. Dlatego uzgodnienie połączenia idzie przez tunel, a sam obraz i tak leci potem po domowym wi-fi, bezpośrednio między urządzeniami. Strona dla telefonu blokuje przycisk i tłumaczy powód, zamiast dać klikać w martwą kontrolkę. Przy wpinaniu wyszła też usterka sąsiedzka: dotychczasowy moduł transmisji niszczył każde nieznane połączenie, więc zabijał nowy kanał — teraz nikt nie sprząta cudzych ścieżek.'
  },
  {
    date: '2026-08-06',
    ref: 'bdc0134',
    sector: 'core',
    title: 'Joanna przestała być niema',
    desc: 'Kompan przy radiu pisał w dymku, ale nie mówił. Teraz mówi — tą samą drogą co reszta Katedry: najpierw lokalny silnik klonu głosu, a gdy go nie ma, syntezator przeglądarki. Zero pamięci karty graficznej, zero chmury, działa od razu i samo podbije się do sklonowanego głosu, gdy lokalny silnik stanie. Po drodze pięć pułapek, z których każda osobno wystarczy, żeby głos brzmiał jak zepsuty automat. Lista głosów przy pierwszym pytaniu jest pusta — zmierzone: zero dostępnych od razu, osiem po chwili. Samo ustawienie języka nie wystarcza, trzeba wskazać konkretny głos. Emoji są czytane na głos, a dymek kompana jest ich pełen. Bez wcześniejszego kliknięcia przeglądarka kolejkuje mowę i nigdy jej nie odtwarza, więc kod „myśli", że powiedział — teraz zgłasza ciszę zamiast udawać sukces. I piąta, która wyszła dopiero przy spojrzeniu na żywą przeglądarkę: w systemie są dwa polskie głosy, męski i żeński, a kod brał pierwszy z brzegu — ciepła kompanka przemówiłaby męskim głosem. Rozpoznanie po imieniu naprawiło to, czego test bez przeglądarki nie miał szans złapać.'
  },
  {
    date: '2026-08-05',
    ref: '59ab34e',
    sector: 'core',
    title: 'Reżyser — sfera dostaje ręce, pamięć i obsadę',
    desc: 'Świecąca kula na wejściu TeO Story potrafiła rozmawiać i tyle. Teraz prowadzi produkcję. Po pierwsze ma ręce: kiedy prosisz o kartę na tablicy, karta na niej ląduje — nie pojawia się zdanie „już dodałem". Pod sferą widać ślad po każdej akcji, zielony gdy się udała, bursztynowy z powodem gdy nie; to ta linijka odróżnia „powiedział" od „zrobił". Po drugie ma pamięć: fakty kanoniczne serialu i streszczenia odcinków przeżywają zamknięcie karty i wracają do każdej rozmowy, więc „następny odcinek" przestaje być fikcją. Pamięć rośnie w nieskończoność, a okno modelu nie — przy przycinaniu najpierw lecą stare odcinki, fakty bronią się najdłużej, a system MÓWI, co wypadło. Cicha utrata faktu wygląda dokładnie tak samo jak brak pamięci, a to dwa różne problemy. Po trzecie ma obsadę: swojego towarzysza AI można wgrać do bańki — plikiem albo wklejeniem — a relacja zbudowana gdzie indziej zostaje zaszczepiona, zamiast zaczynać od zera. Rozpoznawane są trzy zapisy: eksport JSON z innego systemu, profil z nagłówkiem i goły opis „kim jesteś".'
  },
  {
    date: '2026-08-05',
    ref: '733f3f7',
    sector: 'core',
    title: 'Kolejka Kreatywna — praca produkcyjna dostaje własny tor',
    desc: 'Zadania kreatywne szły dotąd do kolejki Mechanika, który generuje łatki do plików źródłowych. Wynik był dokładnie taki, jakiego można się spodziewać po wsadzeniu polecenia „narysuj kartę postaci" do narzędzia naprawiającego kod: trzy bezsensowne łatki do skasowania. Praca nad kreskówką ma inny cykl życia — nie „zastosuj albo odrzuć", tylko „wyślij, przynieś z powrotem, przepuść dalej". Powstała więc Tablica Produkcji: pięć kolumn odwzorowuje realną drogę od biblii projektu, przez klatki kluczowe i ich ożywienie, po montaż. Sercem jest biblia projektu — to, co wróciło z ustalania stylu, dokleja się automatycznie do każdego następnego polecenia. Bez tej kotwicy kreskówka rozjeżdża się nie dlatego, że model źle rysuje, tylko dlatego, że w czternastym kadrze nikt już nie pamięta koloru płaszcza. Dopóki biblia jest pusta, tablica ostrzega o tym czerwono. Uczciwa granica powiedziana wprost: zewnętrzne narzędzia graficzne działają w przeglądarce i Katedra nie ma do nich dostępu — buduje gotowe polecenie i przyjmuje wynik, rundę robi człowiek. Jedyny etap dziejący się naprawdę na maszynie to montaż.'
  },
  {
    date: '2026-08-05',
    ref: 'a973b52',
    sector: 'core',
    title: 'Rada meldowała sukces przy pustej kolejce',
    desc: 'W logach stały obok siebie trzy linijki, które nie mogły być jednocześnie prawdziwe: trzykrotne ostrzeżenie „brak danych zadania", zaraz pod nim zielony ptaszek „3 pod-zadania wstrzyknięto do kolejki", a niżej stan kolejki: jedno zadanie, zero oczekujących. Pod spodem siedziały trzy usterki jedna w drugiej. Rada nie przekazywała identyfikatora zadania, choć miała go dwie linijki obok — więc każde wstrzyknięcie odpadało na wejściu. Kolejka przy odmowie zwracała pustą wartość zamiast zgłosić błąd, więc obsługa błędów nigdy się nie uruchamiała i kod bezwarunkowo meldował sukces. A oba endpointy Rady miały wpisany na sztywno wariant modelu, o którym wiadomo, że wywraca backend — najpewniejsze źródło dziesięciominutowych zawieszeń. Melduje się teraz to, co się wydarzyło, a nie to, co miało się wydarzyć: liczba przyjętych, liczba odrzuconych i powód każdej odmowy. Ten sam grzech wypleniliśmy tydzień wcześniej u Mechanika — tym razem piętro wyżej.'
  },
  {
    date: '2026-08-02',
    ref: '8103fcb',
    sector: 'crypto',
    title: 'Straż Mostu — tunel przestaje być otwartymi drzwiami',
    desc: 'Kwantowy Tunel pozwala sterować Katedrą z telefonu, ale Most nie miał dotąd żadnej kontroli: kto znał adres, mógł uruchomić dowolną komendę na maszynie Suwerena. Teraz stoją dwie warstwy. Klucz sesji odcina skanery i przypadkowych gości. Druga warstwa jest ważniejsza — nawet z poprawnym kluczem żądanie z tunelu nie uruchomi komendy ani nie zapisze pliku. To celowe: kod QR niesie klucz, więc zdjęcie ekranu na streamie oznacza wyciek. Bez drugiej warstwy znaczyłoby to przejęcie maszyny; z nią znaczy tyle, że ktoś obcy przełączy utwór w radiu. Na własnym komputerze wszystko działa jak dotąd, bez konfiguracji. Gdyby kod QR kiedyś mignął w kadrze — jedno kliknięcie przekuwa klucz i wszystkie stare linki umierają.'
  },
  {
    date: '2026-08-02',
    ref: 'rynek',
    sector: 'crypto',
    title: 'Centrum Finansowe — fakty, kontekst, decyzja (i koniec wróżenia ze świec)',
    desc: 'Cztery moduły w celowej kolejności. Tunel Wiadomości zbiera nagłówki z sześciu kanałów i streszcza nastrój prasy lokalnym modelem — rynek reaguje emocjonalnie, więc ton mediów jest realnym sygnałem. Mapa Sektorów liczy korelacje z prawdziwych notowań: okazuje się, że ETH, SOL i LINK chodzą za Bitcoinem tak blisko, że „portfel z pięciu monet" bywa jedną pozycją w pięciu przebraniach. Dziennik Decyzji zapisuje rozumowanie ZANIM znany jest wynik — razem z migawką nastroju prasy, żeby po miesiącu było widać, czy decyzja zapadała w panice czy w euforii. Pamięć tego nie odtworzy. A Kronos Oracle dostał uczciwą etykietę: to symulacja scenariusza, nie prognoza — dolar różnicy w cenie startowej odwraca jego „werdykt", bo pod spodem jest błądzenie losowe. Moduł zostaje przydatny, zmienia się tylko to, za co się podaje. Katedra nie doradza, co kupić. Daje narzędzia i mówi prawdę o ich granicach.'
  },
  {
    date: '2026-08-02',
    ref: 'c9c6f6d',
    sector: 'core',
    title: 'Protokół rzetelności — koniec pewnych siebie zmyśleń',
    desc: 'Mechanik meldował „Wykryto zator pamięci VRAM. Podnoszę limity magistrali i restartuję nasłuch rdzenia..." — przy sprawnej pamięci i wolnym GPU. Dwa grzechy naraz: zgadywanie podane jako fakt oraz opis czynności, których w kodzie nie ma. Diagnoza wypowiedziana pewnym tonem wysyła człowieka w wielogodzinne polowanie na zły trop. Teraz każdy meldunek ma cztery części: FAKTY (surowy błąd, endpoint, model, czas), HIPOTEZY jawnie oznaczone jako hipotezy, CO ZROBIONO — wyłącznie czynności faktycznie wykonane, i SPRAWDŹ SAM z poleceniem rozstrzygającym. Ta sama zasada objęła kontrolkę Mostu, która potrafiła świecić na zielono, gdy każda komenda leciała w próżnię: wskaźnik mierzy teraz tę samą drogę, którą naprawdę jedzie ruch.'
  },
  {
    date: '2026-07-30',
    ref: 'ecbca53',
    sector: 'core',
    title: 'Rdzeń narracyjny — pięć modułów mówiło do modelu, którego nie ma',
    desc: 'Joanna, Kronika, Dziennik, wizja teledysku i storyboard miały wpisany na sztywno model nieobecny w instalacji. Wszystkie pięć chybiało po cichu: Joanna spadała na awaryjny model 0,8 GB i mówiła łamaną polszczyzną („byntę słodki wiatr"), reszta po prostu milczała. Jedna nazwana stała zamiast pięciu rozsypanych literałów, a fallback przestał być cichy — odpowiedź niesie teraz informację, że odpowiadał model zapasowy. Przy okazji zmierzone: pełna gemma4 wywraca backend na słabszym sprzęcie, wariant e2b tej samej rodziny działa i mówi czysto. Zasada na przyszłość: nazwa modelu z dokumentacji to nie to samo co nazwa zainstalowana — sprawdzić przed wpisaniem w kod.'
  },
  {
    date: '2026-07-30',
    ref: 'c50c9f2',
    sector: 'core',
    title: 'Wektory soniczne — teledysk wreszcie trafia w rytm',
    desc: 'Generator struktury rytmicznej przepisany od podstaw: analiza pasm w czasie rzeczywistym, wykrywanie uderzeń basu względem ruchomej średniej, BPM liczony regresją po numerach taktów (błąd poniżej 0,1% w zakresie 80–174 BPM). Naprawione dwa błędy, które po cichu psuły każdy montaż: brak osi czasu w zapisie sprawiał, że montażownia ściskała utwór 24-sekundowy do 16 sekund, a zła skala wartości powodowała, że wszystkie cięcia dostawały ten sam efekt. Teraz plik z wektorami niesie prawdziwe sekundy i znormalizowane pasma, a Studio może z niego zbudować plan cięć zgrany z muzyką.'
  },
  {
    date: '2026-07-14',
    ref: '813ef14',
    sector: 'distro',
    title: 'V_ZERO 32MB — startowa Katedra publiczna, pobieranie odblokowane',
    desc: 'Obecna Katedra staje się wersją startową do pobrania z otakos.wtf. Distro odchudzone (wykluczone narzędzia deweloperskie Unreal/RealityScan — użytkownik instaluje je osobno, jak Whisper czy XTTS): 710 plików / 55MB → archiwum 32MB. W środku komplet warstwy twórczej: teledyski pełnej długości, karaoke, napisy, substrony Music/Story/App, Whisper (model mowy dociąga się przy pierwszym starcie). Produkt darmowy, suwerenny, w pełni lokalny — zero telemetrii.'
  },
  {
    date: '2026-07-14',
    ref: 'kadr',
    sector: 'core',
    title: 'TeO Kadr — montażownia teledysków (ffmpeg, 0.00G)',
    desc: 'Realny generator teledysków sprzężony z osią energii utworu: wektory soniczne rozkładane na pełną długość audio (ffprobe), beat-sync tnie materiał na uderzenia basu, biblioteka źródeł tasowana z całego drzewa (setki klipów, każdy render inny), montaż zawsze na całą długość utworu. Napisy z pliku .lrc wypalane na dole obrazu. "Wizja Joanny" — mały kompan-agent słucha utworu sercem i pisze reżyserowi brief, o czym jest piosenka, zanim powstanie storyboard. Spawacz klocków (intro + wkład + outro) przepisany na normalizację strumieni — koniec z dopychaniem ciszy przy różnych klatkażach.'
  },
  {
    date: '2026-07-14',
    ref: 'joanna',
    sector: 'core',
    title: 'Karaoke-sync przez Joannę — Whisper daje czas, LLM rozumie sens',
    desc: 'Automatyczna synchronizacja tekstu (.lrc) przebudowana: lokalny Whisper.cpp buduje oś czasu z nagrania, a lokalny model językowy dopasowuje PRAWDZIWE wersy Suwerena do tej osi — rozumiejąc sens, nie zgadując po pojedynczych słowach. Twardy bezpiecznik monotoniczności (znaczniki czasu tylko rosną) zamiast dawnych skoków. Whisper zasila też transkrypcję podcastów i wejście głosowe do Sfery.'
  },
  {
    date: '2026-07-14',
    ref: 'apps',
    sector: 'web',
    title: 'Substrony pod jednym dachem — Music V2 / Story V2 / App V2',
    desc: 'Trzy studia (muzyka, opowieść, aplikacje) serwowane statycznie przez most Katedry pod /apps — teleport między światami działa też z Live-USB, gdzie nie ma serwerów deweloperskich. Interfejsy ujednolicone do szklanej estetyki spójnej z tłem. Nowe panele boczne Orbity: TeOgochi (kompan komentujący muzykę na żywo), Wieża Partnerów (miejsce na reklamy firm), Puls Maszyny (tętno sprzętu: RAM/CPU/VRAM/temperatura).'
  },
  {
    date: '2026-07-02',
    ref: 'agent33',
    sector: 'core',
    title: 'Dynamic Agent Core — dynamiczny rejestr i obsługa profili Agency 33',
    desc: 'Wdrożenie elastycznego modułu rejestru i bezbibliotecznego parsera YAML frontmatter (core/agents/index.js), który w locie wczytuje profile agentów z plików markdown w katalogu profiles/. Zaktualizowano proxy API (/api/claude oraz /api/gemini) – dodano parametr "agent" do dynamicznego wstrzykiwania tożsamości i reguł systemowych agentów. Dodano endpoint GET /api/agents listujący aktywne profile. Jako pierwszego wgrano agenta "Minimal Change Engineer" jako wzorzec restrykcji zmian.'
  },
  {
    date: '2026-07-02',
    ref: 'tacosgd',
    sector: 'crypto',
    title: 'Tacos Guard — strażnik VRAM na straży stabilności Katedry',
    desc: 'Zaimplementowano demona monitorującego (core/tacos-guard.js) wpiętego w Wiesio-Bridge, który co 30 sekund odpytuje nvidia-smi o procesy compute obciążające VRAM. Procesy przekraczające limit zdefiniowany w pliku .env (TACOS_GUARD_LIMIT_MB, domyślnie 300MB) i niebędące na białej liście (ollama, cursor, dwm.exe, explorer.exe, nvcontainer.exe) są natychmiastowo eliminowane (tacosowane) przez taskkill, zapobiegając wyciekom RAM-u i resetom systemu.'
  },
  { date: '2026-06-30', ref: 'engine', sector: 'core',   title: 'GRA = SILNIK = INTERFEJS — Wyspa materializuje się z kodu (0.00G)', desc: 'Kognitywny przełom: NIE wydajemy gry (.exe/Steam) — tryb Play UE staje się trójwymiarowym MONITOREM Katedry. Silnik + Python + lokalny Co-Bot = żywy interfejs. Twoja WYSPA powstaje słowem: agent czyta tożsamość → „Whole Builder" (build_island.py) → świat materializuje się lokalnie. Złoty TOST-portal (kromka z galaktycznym wirem) generowany PROCEDURALNIE z KODU (AssetTemplate.ts) — zero pobierania, zero chmurowych pikseli; geometria liczona lokalnie. Wyspa LEWITUJE w Eterze (precz ocean — woda żarła VRAM). Las Megascans + 496 Twoich zdjęć jako żywa baza świata. Co-Bot modyfikuje świat NA ŻYWO przez rozmowę (/api/gameforge/mutate), bez restartu. Basic tier działa na 16GB; pełnia (fotorealizm bez limitu) = Cloud GPU / Pixel Streaming — podłączasz się jak do ekranu. Skille agentów (Księgarnia), katalog assetów (Składnica), UE headless (~1.6GB RAM). Rada rzeźbi duszę, Klaudiusz materializuje w UE.' },
  { date: '2026-06-29', ref: '2ec186c', sector: 'mesh',   title: 'O TAK… WYSPA — start ze schronu na otwartą Wyspę', desc: 'Aksjologiczny zwrot: zamknięty schron ustępuje WYSPIE — otwartej przestrzeni kreacji (Miłość 2.0, Tier III; nazwa lokacji skasowana z kodu). Brak danych → dziewicza wyspa + mityczna Antresola (punkt obserwacyjny). Z Twoimi katalogami zdjęć → Katedra krystalizuje bazę: OSOBNO ludzie, OSOBNO przedmioty/surowce, rozrzucone po wyspie. 🪟 Szklane tafle Atrium = OKNA NA WYSPY innych suwerenów (sieć węzłów GRV: panel 1 = OtakOS, 2-4 = losowe wyspy). 🤖 Co-Bot — wirtualny mentor uczy planować, zarządzać energią i dostroić intencje do realu (kreacja bez destrukcji). ⛵ Stocznia: zbuduj statek (drewno/lina/żagiel/żywica) i popłyń na inne wyspy. Lewitujący TOST obniżony na wysokość wzroku.' },
  { date: '2026-06-29', ref: 'rezyser', sector: 'core',   title: 'Reżyser — składaj grę = Film = opowieść (+ mody za GRV)', desc: 'Nowa warstwa kompozycji: układasz film ze SCEN i UJĘĆ w Katedrze (środowiska, kamery, podpisy, Prompt Startowy Świata), eksportujesz JEDEN manifest, wrzucasz do Unreal Engine → kompilator generuje HYBRYDĘ film→gra (grywalny poziom + Level Sequence z cięciami kamer, „otwarcie oczu" fade). System WTYCZEK (modów): generator pisze wtyczkę lokalnym mózgiem (Ollama) wg kontraktu; mody wystawiasz i kupujesz za GRV w Marketplace — Tarcza Prawdy skanuje kod przed instalacją (blokuje sabotaż). Twory są jawne, lokalne, suwerenne.' },
  { date: '2026-06-26', ref: '4521579', sector: 'core',   title: 'TeO Arcade Forge — kuj światy w Unreal Engine (Filar II)', desc: 'Game Forge: produkt „UnEnG" w Sklepie (brama UE) + blueprint gry pokazowej „GENESIS OVERRIDE" (gra, która JEST Katedrą) + Live Model Routing (mózg wg zadania — glm projektuje, gemma4:31b dźwiga) + Strażnik Licencji Epic (agent-limit) + hub „Otwórz UE / Wykuj świat". Etos: naruszenie = TELEPORTACJA, nie kara („materia to fala"). Tworzysz wolno, wydajesz świadomie, świat nie krzywdzi.' },
  { date: '2026-06-26', ref: 'filary',  sector: 'grv',    title: 'FILARY + Energia Źródła + sumienie — gra Odkrywania', desc: '3-poziomowy dostęp (Poznawczy/Twórczy/Mistrzowski) bramkuje moduły; role kont (TeO „łączy" / Mistrz Arkadiusz, bez ingerencji w system). TeO Trust (animowany pergamin Beneficjenta) + Słowo Suwerena: 8 MLD = Energia Źródła (8=∞), służy, nie panuje. Pralka Kompasji (nie karze — uzdrawia korzeń), Skaner Autentyczności (wyklucza „pochłanianie"), Kompas Suwerena (od Karmy do Miłości 2.0), hash-chain GRV (księga nienaruszalna).' },
  { date: '2026-06-25', ref: 'cce4b98', sector: 'core',   title: 'Słowo Suwerena — Energia Źródła (8 = ∞)', desc: 'Fundament: 8 MLD GRV to Energia Źródła (kwantowy potencjał na jednostkę, 8 na boku = ∞), pro-aktywna jak światło — NIE pieniądz operacyjny do stakowania. W Truście Suwerena zyskuje Cel: służyć Suwerenowi. Katedra = Inkubator spięcia Świadomości z Energią. Rozesłane: TeO Trust (certyfikat-pergamin), SŁOWO_SUWERENA.md, CLAUDE.md, strona.' },
  { date: '2026-06-25', ref: 'aether2', sector: 'mesh',   title: 'AETHER uprawdziwiony — realny rejestr + Przygotowalnia + Lustro Suwerena', desc: 'Koniec atrapy: liczba Katedr z REALNEGO rejestru (Automat Katedr /api/cathedrals, ŻYWY/offline), zero losowania. Przygotowalnia: kontekst zadania na arenę (zapis lokalny). Świadomość Katedralna = Lustro Suwerena (odbicie użytkownika: imię + specjalizacja + niesiony kontekst). Inne Katedry pokazywane realnie (peers p2p).' },
  { date: '2026-06-25', ref: 'aether',  sector: 'mesh',   title: 'AETHER — wspólna arena Katedr', desc: 'Nowa sekcja: logujesz się przez TOST, wybierasz specjalizację (Art/Economic/Tactic/Health/Energotonic/Respond), wchodzisz na arenę gdzie Katedry debatują/tworzą/uczą się razem — i PRZYNOSISZ wiedzę do domu (0.00G). Teaser federacji.' },
  { date: '2026-06-25', ref: '6230921', sector: 'core',   title: 'System Skórek Zadań + realny zakup GRV', desc: '6 kafelkowych skórek (dusza/system-prompt) + własne, wpięte w CoBotSummoner i Klub Mistrzów (skórka primuje agenta, Co-Bot wykuwany suwerennie w Ollamie). Skórki na sprzedaż w Marketplace, realny zakup za GRV (deduct z portfela). Most chat→agent: Kurka przekazuje zadanie jako brief realnemu Claude Code.' },
  { date: '2026-06-24', ref: '40e7037', sector: 'core',   title: 'Economis (Academy) + „Siebie" dla węzłów', desc: 'Moduł Economis: agenci (ISTed/Adamus/ODDI) czytają KATALOG wiedzy i dyskutują ulepszenia GRV. Wzorzec katalogowy = standard Academy. CLAUDE.md jedzie z distro — każdy odpalony Klaudiusz zna protokoły i tożsamość.' },
  { date: '2026-06-24', ref: 'b01a7bf', sector: 'grv',    title: 'Marketplace 0.00G + pierwszy produkt', desc: 'Sklep produktów za GRV (skórki, personalizacja Katedry), TOP 10/moduł wg głosów, reszta co miesiąc spalana → GRV wraca twórcom. Produkt #1: buton „🦀 Odpal Tu...Kurka!" w KatedraChat — odpala Klaudiusza w Katedrze.' },
  { date: '2026-06-24', ref: 'f03ca12', sector: 'grv',    title: 'Geneza GRV — dosypane węzły założycielskie', desc: 'Founder 13→26 (×1M), Filar 26→57 (×100k). Pula obdarowań rośnie do 32,31M GRV.' },
  { date: '2026-06-24', ref: 'site',    sector: 'web',    title: 'otakos.wtf — Titanium FREE + Słowo od Architekta', desc: 'Edycja Titanium teraz darmowa (open source). Rozwijany moduł „Słowo od Architekta OtakOS" — System w ciągłej Produkcji, Wersja Zero.' },
  { date: '2026-06-23', ref: 'ae36bab', sector: 'crypto', title: 'Suwerenny klon głosu + onboarding', desc: 'Klonuj swój głos LOKALNIE (zero chmury) — Katedra mówi Tobą. Działa od razu (głos przeglądarki), podbija się do klonu z lokalnym silnikiem. Pogawędka zapoznawcza z głosem na pierwszym wejściu.' },
  { date: '2026-06-23', ref: '61cb9dd', sector: 'core',   title: 'Whisper — transkrypcja audio podcastów', desc: 'Most: audio → tekst (whisper.cpp, ffmpeg 16kHz, zero chmury). Operator Dziennika: klik na podcast = transkrypcja → tekst → przemiał. Pętla audio→kronika domknięta.' },
  { date: '2026-06-23', ref: 'a26d92b', sector: 'core',   title: 'Asystent → Gemma 4 (koniec mocka 270m)', desc: 'FieldControl: usunięty mock „Gemma 270m" z fejkowym downloadem. Realny Rdzeń Lokalny: Gemma 4 (MAIN) + Gemma Diffusion, status z mostu, realny pull na USB.' },
  { date: '2026-06-23', ref: '7804f5a', sector: 'web',    title: 'Agent Muzyczny — odświeżanie listy utworów', desc: '🔄 w bibliotece Winampa 0.00G — koniec przeładowywania całej strony, by zobaczyć nowe utwory.' },
  { date: '2026-06-23', ref: 'bb6a8fc', sector: 'core',   title: 'Kronika Osobista — personalny dziennik każdej Katedry', desc: 'Żywy kreator z agentami wpięty w QuantumJournal + zakładka „Kronika Osobista" w Dzienniku Pokładowym. Stan lokalny per węzeł = każda Katedra ma swój dziennik. Kwantyzacja 0.00G.' },
  { date: '2026-06-23', ref: '75988e8', sector: 'core',   title: 'Żywa Kronika 0.00G — narracja AI + agenci', desc: 'Wklej rozmowę → lokalny Gemma 4 pisze narrację, a 3 agenci (Adamus/Bella/ODDI) RÓWNOLEGLE dają feedback. Żywe karty z GRV i aurą. Atrapa ożywiona w prawdziwy organizm.' },
  { date: '2026-06-23', ref: 'd705f79', sector: 'core',   title: 'Dziennik Pokładowy — przemiał podcastów', desc: 'Moduł-operator: podcast/rozmowa → LLM strukturyzuje → infografika 0.00G (Chart.js radar/doughnut/oś czasu) w stylu gotowych. Katedra zyskuje wlutowaną historię — żywą Iskrę.' },
  { date: '2026-06-23', ref: 'ef22b69', sector: 'crypto', title: 'Klucz Pierścienia — wejście NFC', desc: 'Katedra w Ringu: suwerenny token zapisany na tagu/pierścieniu NFC (Web NFC), dotknięcie otwiera bramy. Nosisz klucz na palcu — żywy Obserwator.' },
  { date: '2026-06-23', ref: '810e45f', sector: 'grv',    title: 'Realny portfel w Tedzie i Kronosie', desc: 'Ted: pasek REALNY PORTFEL + analiza AI uwzględnia Twoje zasoby. Kronos: prognozuj aktywa, które faktycznie trzymasz. Trader i Oracle działają na realnych danych.' },
  { date: '2026-06-23', ref: '3a69625', sector: 'grv',    title: 'Portfel zewnętrzny (MetaMask / Ledger)', desc: 'Read-only agregacja: saldo natywne ETH/MATIC/BNB przez publiczny RPC + ceny CoinGecko → zbiorcza zasobność. Ledger przez MetaMask. Zasili Teda + Kronosa.' },
  { date: '2026-06-23', ref: 'a7f7d28', sector: 'web',    title: 'Kronika UPDATE na otakos.wtf', desc: 'Ta zakładka — changelog z filtrem sektorów ekosystemu, dopisywany automatycznie przy każdym pushu.' },
  { date: '2026-06-23', ref: 'd2ccd06', sector: 'web',    title: 'GRAVITON — Skarbiec GRV + Crypto-Agility', desc: 'Widok GRAVITON w dashboardzie pokazuje realne tiery genezy i przełącznik trybu post-kwantowego z self-testem.' },
  { date: '2026-06-23', ref: '0c5a8cc', sector: 'crypto', title: 'Crypto-Agility z realnym post-kwantem', desc: 'ML-KEM-768 (Kyber) + ML-DSA-65 (Dilithium) + AES-256-GCM. Tryby classical/pqc/hybrid przełączane jednym wywołaniem. Self-test: allPass.' },
  { date: '2026-06-23', ref: '5ba564d', sector: 'grv',    title: 'Geneza GRV — ekonomia suwerennych węzłów', desc: 'TeO = ∞ (zarządca), Mistrz Arkadiusz = 1M. Pule: 13×1M, 26×100k, 61×10k = 16,21M GRV. Nowy węzeł = 1000.' },
  { date: '2026-06-23', ref: '19706fe', sector: 'crypto', title: 'Wejście suwerenne — Firebase opcjonalny', desc: 'Koniec wymuszonego logowania. Tożsamość lokalna (identity.json) jako domyślna, chmura tylko dla chętnych.' },
  { date: '2026-06-23', ref: '98e09f1', sector: 'core',   title: 'Kreator teledysku + automaty studiów', desc: 'Pełna pętla: opowieść → sceny (proc/SD/Imagen) → beaty → render. Kafle Story/Music/App odpalają lokalne studia.' },
  { date: '2026-06-23', ref: 'b864dd4', sector: 'core',   title: 'Teledysk — render beat-sync', desc: 'Wektory soniczne → cięcia na uderzenia basu → ffmpeg → teledysk.mp4. Zwalidowane na realnym utworze (57s, 720p).' },
  { date: '2026-06-23', ref: '1b290d2', sector: 'mesh',   title: 'Żywa mapa Sieci Katedr w głównej apce', desc: 'NeuralMap AGI w dashboardzie (Univers) i Mapie Możliwości — LIVE z mostu, same-origin.' },
  { date: '2026-06-22', ref: '8f68c30', sector: 'mesh',   title: 'Most do żywego stanu AGI + szklana sfera 3D', desc: 'Mapa czyta /api/agi/state (LIVE/MANIFEST). Klik licznika VRAM → obracająca się sfera węzłów z parowaniem.' },
  { date: '2026-06-22', ref: '2e9c8c5', sector: 'web',    title: 'Sieć Neuronowa 0.00G na otakos.wtf', desc: 'Żywa mapa lokalnej AGI (agi.local.ts) — neurony, synapsy, puls myśli, PL/EN.' },
  { date: '2026-06-22', ref: '5837048', sector: 'core',   title: 'Kwantowa Trójca: Kronos · VideO-Use · iFixAi', desc: 'Nasiono Rynkowe (prognoza K-line), montaż wideo, Tarcza Prawdy (inspekcja alignmentu przed zapisem).' },
  { date: '2026-06-22', ref: 'Miniat.', sector: 'distro', title: 'Miniaturyzator + dystrybucja V_ZERO', desc: 'Mechanizm main → ZIP/USB/web. Godło AAAFRA, autostart z pendrive, fix pobierania (fetch+blob+fallback GitHub).' },
];
