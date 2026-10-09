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
  /** Wersja angielska (przełącznik PL/EN strony). Starsze wpisy jej nie mają — wtedy pokazujemy polski oryginał. */
  en?: { title: string; desc: string };
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
    date: "2026-10-09",
    ref: "32df2f6",
    sector: "core",
    title: "🥚 JaJo Mistrza — Katedra uczy się Twojego stylu",
    desc: "Katedra zbiera pary „co napisał model → jak to poprawiłeś” z dialogów i publikacji, a do tego Twoje decyzje przy Stole. Z nich składa lekcję zasad, każdą z dowodami, oraz dane do treningu (SFT i DPO) dla Kuźni Soup. Kodeks dokłada swoje rundy „źle → dobrze”: przegrane i przyjęte. JaJo odzywa się przez Orbitę — o swoim etapie, nowej lekcji, wygranej Kodeksa po porażkach. Panel jest w Inkubatorze. Uczciwie: to etap 1 — JaJo zbiera i porządkuje; własny model z tych danych wykuwa Kuźnia dopiero na Twoje życzenie.",
    en: {
      title: "🥚 The Master's Egg — the Cathedral learns your style",
      desc: "The Cathedral collects pairs of “what the model wrote → how you corrected it” from dialogues and publications, plus your decisions at the Table. From them it builds a lesson of rules, each with evidence, and training data (SFT and DPO) for the Soup Forge. The Codex adds its “wrong → right” rounds: the failed and the accepted ones. The Egg speaks through the Orbit — about its stage, a new lesson, a Codex win after failures. The panel is in the Incubator. Honestly: this is stage 1 — the Egg collects and organises; the Forge makes your own model from this data only when you ask.",
    },
  },
  {
    date: "2026-10-09",
    ref: "d41fc73",
    sector: "core",
    title: "☁️ Bryły dopracowane w chmurze (Meshy) — najpierw wycena, potem Twoja zgoda",
    desc: "Bryłę z Assetów 3D można wysłać do Meshy: nowa tekstura (styl, 2K–8K, PBR) albo gęstsza siatka (100–300 tys. ścian). Przed wysłaniem Katedra pokazuje wycenę z cennika, saldo konta i rozmiar pliku — zlecenie wychodzi tylko z potwierdzoną kwotą. Wynik wraca jako nowa wersja obok starej. Zwiadowca szuka w sieci promocji i kodów rabatowych takich usług — pokazuje tylko znaleziska ze źródłem, niczego nie wpisuje i nie płaci. Klucz Meshy idzie przez Kibel i „Udostępnij mostowi”. Produkcja gry ma też „chmurę po chmurze”: gdy model chmury padnie, spróbuje innej chmury przed lokalnym.",
    en: {
      title: "☁️ Meshes refined in the cloud (Meshy) — a quote first, then your consent",
      desc: "A mesh from 3D Assets can be sent to Meshy: a new texture (style, 2K–8K, PBR) or a denser mesh (100–300k faces). Before sending, the Cathedral shows a price from the price list, the account balance and the file size — the job goes out only with a confirmed amount. The result comes back as a new version next to the old one. The Scout searches the web for promotions and discount codes for such services — it shows only findings with a source, enters nothing and pays nothing. The Meshy key goes through the Kibel and “Share with the bridge”. Game production also gets “cloud after cloud”: if a cloud model fails, it tries another cloud before the local one.",
    },
  },
  {
    date: "2026-10-08",
    ref: "9ff03f8",
    sector: "core",
    title: "🎼 Dyrygent: równe szanse modeli, reguły ról i partytury genialnych wykonań",
    desc: "Każdy model bez karty dostaje kartę z faktów, a oceny liczą się tylko od Sędziego-Jev — stare, zawyżone oceny przestały przyciągać wybór. Role mają wymagania (Kodeks: model do kodu albo ≥ 7B, Wektor i Strażnik ≥ 8B). Jev zawęża do trzech kandydatów, a większy model lokalny rozstrzyga z uzasadnieniem. Partytury zapisują układ produkcji (cele, modele, silniki, grafy ComfyUI, skille); wykonanie ocenione przez Sędziego na ≥ 9 zapisuje się samo i Dyrygent podpowiada je przy kolejnym doborze. Straż modeli: gdy przydzielony model zniknie z Ollamy, wchodzi zastępca według reguł roli, a oryginał wraca sam. Jev ma też tryb lokalny na embeddingach (wybór); tak/nie i skala zostają w chmurze.",
    en: {
      title: "🎼 Conductor: equal chances for models, role rules and scores of brilliant performances",
      desc: "Every model without a card gets a card built from facts, and ratings count only from the Jev Judge — old, inflated ratings no longer pull the choice. Roles have requirements (Codex: a code model or ≥ 7B, Vector and Guardian ≥ 8B). Jev narrows to three candidates and a bigger local model decides with a justification. Scores record a production setup (goals, models, engines, ComfyUI graphs, skills); a performance the Judge rates ≥ 9 saves itself and the Conductor suggests it next time. Model guard: when an assigned model disappears from Ollama, a substitute steps in by the role's rules and the original comes back on its own. Jev also has a local mode on embeddings (choice); yes/no and scale stay in the cloud.",
    },
  },
  {
    date: "2026-10-08",
    ref: "b280179",
    sector: "core",
    title: "🎨 Bryły poprawiane w sekundy, bez GPU: kolor, gęstszy fragment, świecące oko",
    desc: "Kolor bryły na żywo: jasność, kontrast, nasycenie, odcień, czerń i auto-poziomy. Zaznaczony fragment (np. twarz) dostaje własny budżet ścian, reszta swój. Świecące oko: jasny fragment w zaznaczeniu dostaje materiał emisyjny (próg, moc, barwa, przód / tył / na wylot), a gra dostaje przepis na światło w tym miejscu. Każda poprawka to nowa wersja obok starej i przechodzi na kolejne wersje (upiększanie, upraszczanie, „Do gry”).",
    en: {
      title: "🎨 Meshes adjusted in seconds, no GPU: colour, a denser region, a glowing eye",
      desc: "Live mesh colour: brightness, contrast, saturation, hue, blacks and auto-levels. A selected region (e.g. a face) gets its own face budget, the rest its own. Glowing eye: a bright part of the selection gets an emissive material (threshold, strength, colour, front / back / through), and the game gets a recipe for a light at that spot. Every adjustment is a new version next to the old one and carries over to later versions (beautify, simplify, “To game”).",
    },
  },
  {
    date: "2026-10-08",
    ref: "b41f464",
    sector: "core",
    title: "🎞️ Wideo nie zrywa się po 45 minutach",
    desc: "Ujęcie 121 klatek dekodowało się w ComfyUI ~40 minut, bo zwykły dekoder nie mieścił się w 6 GB, a kolejka po 45 minutach uznawała je za błąd, choć plik powstawał. Teraz grafy wideo dekodują kafelkami (VAEDecodeTiled), a stan zlecenia mówi, czy ComfyUI liczy, trzyma w kolejce, czy zgubił zadanie. Termin przesuwa się, dopóki liczy (sufit 4 h).",
    en: {
      title: "🎞️ Video no longer gets cut off after 45 minutes",
      desc: "A 121-frame shot took ~40 minutes to decode in ComfyUI because the plain decoder did not fit in 6 GB, and the queue marked it as failed after 45 minutes even though the file was being made. Now video graphs decode in tiles (VAEDecodeTiled), and the job status says whether ComfyUI is computing it, holding it in the queue or has lost it. The deadline moves while it computes (4 h ceiling).",
    },
  },
  {
    date: "2026-10-08",
    ref: "ed7ca51",
    sector: "core",
    title: "🎭 TeOgochi w roli — scena z Teterhii w rozmowie",
    desc: "Rozmowa z TeOgochi może nieść scenę z gry: karta roli, kim jest i gdzie stoi. Postać nie wychodzi z roli, odpowiada krótko i nie dostaje żadnych narzędzi — np. Aktor gra stworka w Teterhii. Scena zostaje w rozmowie na kolejne tury.",
    en: {
      title: "🎭 TeOgochi in character — a Teterhia scene in the conversation",
      desc: "A conversation with a TeOgochi can carry a scene from the game: a role card, who it is and where it stands. The character stays in role, answers briefly and gets no tools — e.g. the Actor plays a creature in Teterhia. The scene stays in the conversation for the following turns.",
    },
  },
  {
    date: "2026-10-08",
    ref: "ab6f419",
    sector: "web",
    title: "⚡ Hub i Montażownia szybciej",
    desc: "Montażownia opisywała filmy dekodując każdy w całości — materiał 291 filmów liczył się 247 s, a Story Studio pokazywało zero. Teraz czyta nagłówek (ffprobe, ~0,4 s na plik), pamięta opisy i czyta po 6 naraz: 12 s za pierwszym razem, 0,1 s potem. Hub nie wraca do Bramy przy każdym przeładowaniu (wyjście to 🚪 w nagłówku), sprawdza most do skutku co 3 s i nie obserwuje katalogów danych (~126 tys. plików), więc odpowiada od razu. Reżyser zna limit planu i nie mówi „zapisałem”, zanim przyjmiesz propozycję.",
    en: {
      title: "⚡ Faster Hub and Editing Room",
      desc: "The Editing Room described films by decoding each one in full — a set of 291 films took 247 s and Story Studio showed zero. Now it reads the header (ffprobe, ~0.4 s per file), remembers descriptions and reads 6 at a time: 12 s the first time, 0.1 s afterwards. The Hub no longer returns to the Gate on every reload (the exit is 🚪 in the header), checks the bridge every 3 s until it answers and no longer watches data folders (~126k files), so it responds at once. The Director knows the plan limit and does not say “saved” before you accept a proposal.",
    },
  },
  {
    date: "2026-10-08",
    ref: "0d7828c",
    sector: "core",
    title: "⚖️ Jev — sędzia semantyczny w Katedrze (opcja chmury z własnym kluczem)",
    desc: "Jev (TypeSafe) nie odpowiada tekstem, tylko prawdopodobieństwem: „czy to prawda?”, „który wybór?”, „ile punktów?”. Katedra pyta go tam, gdzie lokalny model zgadywał. Kodeks sprawdza, czy zmiana naprawdę robi zadanie, zanim runda przejdzie. Recenzent łapie atrapy i regresje przed buildem. Sędzia Projektu Stada ocenia Biblię z rubryki i każde założenie wizji osobno. Dyrygent dobiera model każdemu TeOgochi i podaje pewność. Tarcza Prawdy dostaje drugi głos (szkoda, wyciek, ukrycie, atrapa), a Delegat rozpoznaje, o które narzędzie prosisz — ciężkie idą tylko na wyraźne życzenie. Klucz trafia do mostu dopiero po „Udostępnij mostowi” w Kiblu. Bez klucza wszystko działa jak dawniej: na regułach i lokalnych modelach.",
    en: {
      title: "⚖️ Jev — a semantic judge in the Cathedral (cloud option with your own key)",
      desc: "Jev (TypeSafe) answers with a probability instead of text: “is this true?”, “which choice?”, “how many points?”. The Cathedral asks it where a local model used to guess. The Codex checks whether a change really does the task before a round passes. The Reviewer catches fakes and regressions before the build. The Herd Project Judge scores the Bible against a rubric and each assumption of the vision separately. The Conductor picks a model for every TeOgochi and states its confidence. The Shield of Truth gets a second voice (harm, leak, concealment, fake), and the Delegate recognises which tool you are asking for — heavy ones run only when you say so explicitly. The key reaches the bridge only after “Share with the bridge” in the Kibel. Without a key everything works as before: on rules and local models.",
    },
  },
  {
    date: "2026-10-08",
    ref: "9563753",
    sector: "core",
    title: "☁️ Tryb Katedry — jeden przełącznik CLOUD / JusT dla całej Katedry",
    desc: "Dotąd CLOUD/JusT działał tylko w kilku modułach. Teraz przełącznik w nagłówku Huba ustawia most: w trybie chmury generowanie i czat modeli idą do Claude albo Gemini z Twojego klucza i wracają w tym samym kształcie co z Ollamy, więc każdy moduł działa bez zmian. Obrazy, narzędzia i embeddingi zostają lokalnie, a gdy chmura padnie — praca wraca na lokalny model. Obok licznik tokenów dnia i limit. Domyślnie nadal lokalnie.",
    en: {
      title: "☁️ Cathedral Mode — one CLOUD / JusT switch for the whole Cathedral",
      desc: "Until now CLOUD/JusT worked in only a few modules. Now the switch in the Hub header sets the bridge: in cloud mode model generation and chat go to Claude or Gemini with your key and come back in the same shape as from Ollama, so every module works unchanged. Images, tools and embeddings stay local, and if the cloud fails the work falls back to the local model. Next to it: today's token counter and a limit. Local remains the default.",
    },
  },
  {
    date: "2026-10-08",
    ref: "2a10172",
    sector: "core",
    title: "🗣️ Głos nie milknie, gdy VoiceStudio śpi",
    desc: "Gdy VoiceStudio padnie, kwestia mówi się tym samym głosem przez klon Katedry — z próbki o nazwie profilu albo z kopii nagrania referencyjnego. Nagranie wywiadu czy odcinka nie staje w pół.",
    en: {
      title: "🗣️ The voice keeps going when VoiceStudio is asleep",
      desc: "If VoiceStudio fails, the line is spoken in the same voice by the Cathedral's clone — from a sample named after the profile or a copy of the reference recording. Recording an interview or an episode no longer stops halfway.",
    },
  },
  {
    date: "2026-10-07",
    ref: "702ff65",
    sector: "web",
    title: "💍 Pierścień apek — studia Katedry w jednym oknie",
    desc: "Music, Story, Fashion, Game Studio i Świat otwierają się w oknie Huba jako warstwy żyjące w tle. Koło po lewej przełącza między nimi (Alt+PageUp/PageDown), a „+” budzi narzędzia: ComfyUI i VoiceStudio. Most, UI i studia startują jako zakładki jednego terminala zamiast stosu okien. ComfyUI nie otwiera już własnej przeglądarki ani konsoli. Pamięć Katedry rozpoznaje procesy (silnik głosu, głębia, usta, Demucs) i mówi, czy można je zamknąć, czy przerwie to pracę.",
    en: {
      title: "💍 App Ring — the Cathedral's studios in one window",
      desc: "Music, Story, Fashion, Game Studio and the World open inside the Hub window as layers that live in the background. A wheel on the left switches between them (Alt+PageUp/PageDown), and “+” wakes tools: ComfyUI and VoiceStudio. The bridge, UI and studios start as tabs of one terminal instead of a pile of windows. ComfyUI no longer opens its own browser or console. The Cathedral's Memory recognises its processes (voice engine, depth, lips, Demucs) and says whether closing them is safe or will interrupt work.",
    },
  },
  {
    date: "2026-10-07",
    ref: "9d2fd89",
    sector: "core",
    title: "🧱 Game Studio: klocki przed budową",
    desc: "Kodeks budował z klocków, których jeszcze nie było, i nie znał tych, które zrobiłeś sam. Teraz plan GDD zna warsztat: obrazy, bryły z Assetów 3D i koncepty. Każde zadanie niesie swoje klocki z rolą, a zadanie bez klocka czeka („czeka na klocek”, skrót do Pracowni) zamiast iść do Kodeksa. Reszta kamienia nie buduje się od tyłu. Przy każdej bryle jest „✨ Upiększ lokalnie” (to samo źródło w 1024 i z większą liczbą ścian, stara bryła zostaje). Pod produkcją widać, co robi Kodeks (runda, znaki, recenzent, build), a „Przerwij teraz” zrywa bieżącą rundę od razu. Pracownia obrazów i Assety 3D same budzą ComfyUI.",
    en: {
      title: "🧱 Game Studio: building blocks before building",
      desc: "The Codex was building from blocks that did not exist yet and did not know the ones you made yourself. Now the GDD plan knows the workshop: images, 3D Asset meshes and concepts. Each task carries its blocks with a role, and a task without its block waits (“waiting for a block”, a shortcut to the Workshop) instead of going to the Codex. The rest of the milestone is not built backwards. Every mesh has “✨ Beautify locally” (the same source at 1024 with more faces; the old mesh stays). Under the production you can see what the Codex is doing (round, characters, reviewer, build), and “Stop now” ends the current round at once. The Image Workshop and 3D Assets wake ComfyUI on their own.",
    },
  },
  {
    date: "2026-10-06",
    ref: "9de1ae3",
    sector: "core",
    title: "🔗 Chmura widoczna w Game Studio, żywe listy modeli i zapasowe modele",
    desc: "Klucze z Kibla żyły tylko w przeglądarce, więc Game Studio ich nie widziało. Teraz w Kiblu jest „🔗 Udostępnij mostowi” (cofnięcie jednym kliknięciem; most nigdy nie oddaje całego klucza). Nazwy modeli Claude i Gemini przychodzą z Twojego konta zamiast być wpisane na sztywno, a odrzucony klucz mówi, że jest odrzucony. Lista silników pokazuje każdy model z Ollamy z ostrzeżeniem (⚠ mały, ⚠ zgnieciony). Zwiadowca nie proponuje już kwantyzacji poniżej 3 bitów — model 30B wciśnięty w 6 GB oddawał puste pliki. Produkcja gry ma „↻ Zapasowe”: zadanie, które padło, próbuje następnego modelu. Kibel przyjmuje klucze Gemini dowolnej długości i w nowym formacie AQ. Uwaga: klucz API to osobny rachunek za tokeny, nie abonament.",
    en: {
      title: "🔗 Cloud visible in Game Studio, live model lists and fallback models",
      desc: "Kibel keys lived only in the browser, so Game Studio could not see them. Now the Kibel has “🔗 Share with the bridge” (undone with one click; the bridge never returns the full key). Claude and Gemini model names come from your account instead of being hard-coded, and a rejected key says it was rejected. The engine list shows every Ollama model with a warning (⚠ small, ⚠ over-compressed). The Scout no longer suggests quantisations below 3 bits — a 30B model squeezed into 6 GB produced empty files. Game production has “↻ Fallbacks”: a task that failed tries the next model. The Kibel accepts Gemini keys of any length and in the new AQ. format. Note: an API key is billed per token, separately from a subscription.",
    },
  },
  {
    date: "2026-10-06",
    ref: "27df428",
    sector: "core",
    title: "👻 Nagrania nie wiszą po restarcie, błędy modeli po ludzku",
    desc: "Po restarcie mostu Studio Podcastu, Wywiady i Sceny potrafiły pokazywać „nagrywa” bez końca. Teraz takie nagranie zamienia się w błąd z powodem i da się nagrać ponownie (gotowe kwestie nie liczą się drugi raz). Surowe błędy Ollamy („System message must be at the beginning… try again”) dostają wyjaśnienie: to szablon czatu modelu, ponawianie nie pomoże — wybierz inny model. Gdy produkcja gry pada na małym modelu, Katedra radzi, by Dyrygent dał większy.",
    en: {
      title: "👻 Recordings no longer hang after a restart, model errors in plain words",
      desc: "After a bridge restart the Podcast Studio, Interviews and Scenes could show “recording” forever. Now such a recording turns into an error with a reason and can be recorded again (finished lines are not computed twice). Raw Ollama errors (“System message must be at the beginning… try again”) get an explanation: it is the model's chat template, retrying will not help — pick another model. When game production fails on a small model, the Cathedral advises letting the Conductor assign a bigger one.",
    },
  },
  {
    date: "2026-10-06",
    ref: "db76542",
    sector: "core",
    title: "🎼 Dyrygent jako TeOgochi i droga gry w Game Studio",
    desc: "Dyrygent został TeOgochi: gra na wybranym modelu, dobiera modele jako pierwszy przy Stole i zna bazę silników Katedry (wideo, muzyka, głos, obraz, 3D, ruch ust, stemy). Dla celu — Stół, film, podcast, gra, fashion, muzyka — mówi, co gotowe, czego brakuje i co znalazł Zwiadowca. Game Studio ma drogę: Galeria → To Get Sauce → Reżyser i GDD → Dyrygent → Obrazy → Assety 3D → Ruch → Krajobrazy → Kodeks. Pracownia obrazów rysuje z gałęzi świata (FLUX.2 klein), bryła powstaje z zaznaczonego wycinka, Blender nadaje bryłom ruch (obrót, lewitacja, kołysanie, oddech, podskok), a saga „Teterhia — Wieczna Saga” startuje jako gotowy projekt. Każdą bryłę można wysłać na Stół do ulepszenia przez stado.",
    en: {
      title: "🎼 The Conductor as a TeOgochi and the game path in Game Studio",
      desc: "The Conductor became a TeOgochi: it plays on a chosen model, assigns models first at the Table and knows the Cathedral's engine base (video, music, voice, image, 3D, lip sync, stems). For a goal — Table, film, podcast, game, fashion, music — it says what is ready, what is missing and what the Scout found. Game Studio has a path: Gallery → To Get Sauce → Director & GDD → Conductor → Images → 3D Assets → Motion → Landscapes → Codex. The Image Workshop draws from the world's branches (FLUX.2 klein), a mesh is made from a selected crop, Blender gives meshes motion (spin, levitation, sway, breath, bounce), and the saga “Teterhia — Eternal Saga” starts as a ready project. Any mesh can be sent to the Table to be improved by the herd.",
    },
  },
  {
    date: "2026-10-06",
    sector: "grv",
    title: "⚡ Giełda Master Flow — nowa nazwa i zlecenia: Katedry mówią też, czego szukają",
    desc: "Giełda mocy nazywa się teraz Giełda Master Flow (TeOkoP GRV). Oprócz ofert mocy Katedra może ogłosić zlecenie: jedno zadanie z planu gry albo cały projekt (TeO Games Studio → Reżyser i GDD → „⚡ na Giełdę”), z potrzebnym modelem i budżetem w GRV. Zlecenie jedzie w wizytówce, rejestr je niesie, a strona i inne Katedry je widzą. W Katedrze model z cudzej oferty, którego nie masz, jednym kliknięciem trafia do Twojego Zwiadowcy — pobiera się dopiero po Twoim „Przyjmij”. Uczciwie: to wciąż ogłoszenia — wykonywanie zleceń między Katedrami i rozliczenie w GRV przyjdą w etapie 2.",
    en: {
      title: "⚡ Master Flow Exchange — new name and jobs: Cathedrals say what they need",
      desc: "The Power exchange is now called the Master Flow Exchange (TeOkoP GRV). Besides power offers, a Cathedral can post a job: a single task from a game plan or a whole project (TeO Games Studio → Director & GDD → “⚡ to the Exchange”), with the model it needs and a GRV budget. The job travels in the Cathedral card, the registry carries it, and the site and other Cathedrals see it. In the Cathedral, a model from someone else's offer that you lack goes to your Scout with one click — it downloads only after your “Accept”. Honestly: still announcements — running jobs between Cathedrals and GRV settlement come in stage 2.",
    },
  },
  {
    date: "2026-10-06",
    sector: "mesh",
    title: "🌍 Teterhia — wspólny świat Katedr (MRPG) po lewej stronie",
    desc: "Lustro strumienia Katedr: przesuń w prawo (albo zakładka „Teterhia” przy lewej krawędzi) i otwiera się wspólna mapa Teterhii. Każda kraina to prawdziwa Katedra online z rejestru otakos.wtf; jej żywioł (Ogień, Woda, Ziemia, Powietrze, Eter) wynika z nicka, tak samo jak świat w grze TGS. Klik w krainę prowadzi do wizytówki Katedry. Uczciwie: gra dla jednego gracza rośnie dziś w Katedrze (TeO Games Studio: Reżyser → Dyrygent → Obrazy → Assety 3D → Ruch → Krajobrazy → Kodeks, saga „Teterhia — Wieczna Saga”); wspólnej rozgrywki (rajdy, wymiana) jeszcze nie ma.",
    en: {
      title: "🌍 Teterhia — shared world of Cathedrals (MRPG) on the left",
      desc: "A mirror of the Cathedral stream: swipe right (or the “Teterhia” tab at the left edge) to open the shared Teterhia map. Every land is a real Cathedral online in the otakos.wtf registry; its element (Fire, Water, Earth, Air, Ether) comes from the nick, just like the world in the TGS game. Clicking a land opens the Cathedral's card. Honestly: the single-player game grows in the Cathedral today (TeO Games Studio: Director → Conductor → Images → 3D Assets → Motion → Landscapes → Codex, saga “Teterhia — Eternal Saga”); shared play (raids, trade) does not exist yet.",
    },
  },
  {
    date: "2026-10-05",
    ref: "cf37718",
    sector: "core",
    title: "📦 Składnica Katedry — wspólne postacie, sceny i bryły",
    desc: "Jeden katalog _OtakOs_Assety dla wszystkich studiów: postacie, sceny, rekwizyty, kreacje i bryły z kartą (imię, rola, kolor, głos). Czerpią z niego i dokładają do niego: Aktorzy w Story Studio, Sceny dialogowe, Studio Podcastu, Assety 3D, Fashion, Studio Gier, Reżyser i Music Studio (utwór jako motyw postaci). Import obsady i całych katalogów z dysku robi kopie, oryginały zostają; usuwanie idzie do kosza. W Hubie: menu „•••” → Świat → Składnica.",
    en: {
      title: "📦 The Cathedral Storehouse — shared characters, scenes and meshes",
      desc: "One _OtakOs_Assety folder for all studios: characters, scenes, props, outfits and meshes with a card (name, role, colour, voice). Taking from it and adding to it: Actors in Story Studio, Dialogue Scenes, the Podcast Studio, 3D Assets, Fashion, Game Studio, the Director and Music Studio (a track as a character's theme). Importing the cast and whole folders from disk makes copies, the originals stay; deleting goes to a bin. In the Hub: “•••” menu → World → Storehouse.",
    },
  },
  {
    date: "2026-10-05",
    ref: "c54e09b",
    sector: "core",
    title: "👄 Aktorzy ruszają ustami, ujęcia ożywają w 3D",
    desc: "W Studiu Podcastu karta mówiącego rusza ustami pod jego głos: MuseTalk 1.5 (licencja MIT, ~4 GB VRAM), bez parsera twarzy z zakazem komercji. Płaskie najazdy na zdjęcia ustąpiły ożywionym ujęciom: mapa głębi z kadru (Depth Anything V2, Apache-2.0) i Blender robią z panoramy studio 2.5D z ruchem kamery. Uczciwie: to 2.5D z głębią względną, a jakość z prawdziwymi wagami sprawdza się na sprzęcie Suwerena.",
    en: {
      title: "👄 Actors move their lips, shots come alive in 3D",
      desc: "In the Podcast Studio the speaker's card moves its lips to their voice: MuseTalk 1.5 (MIT licence, ~4 GB VRAM), without the face parser whose licence forbids commercial use. Flat zooms on photos gave way to living shots: a depth map from the frame (Depth Anything V2, Apache-2.0) and Blender turn a panorama into a 2.5D studio with camera motion. Honestly: it is 2.5D with relative depth, and quality with the real weights is checked on the Sovereign's hardware.",
    },
  },
  {
    date: "2026-10-05",
    ref: "7f4f593",
    sector: "core",
    title: "🎙️ Głos Katedry: Chatterbox (MIT), Głosy Stada i sampler",
    desc: "Silnik klonu głosu jest teraz w kodzie Katedry i instaluje się jednym przyciskiem: domyślnie Chatterbox Multilingual (MIT — wolno na tym zarabiać, 23 języki z polskim), XTTS tylko za zgodą na licencję niekomercyjną. TeOgochi mówią barwami z wywiadów, a tekst przed mową traci markdown, emoji i ukryte znaki. Sampler głosu bierze próbkę z dowolnego nagrania (nagranie ekranu mp4, wideo, mp3, mikrofon) z falą i odsłuchem, a Demucs wyjmie sam wokal. Studio Podcastu dostało style rozmowy, 🌀 Pralkę (temperatura), dogrywkę, wiele studiów i wstęp po angielsku.",
    en: {
      title: "🎙️ The Cathedral's voice: Chatterbox (MIT), Herd Voices and a sampler",
      desc: "The voice-clone engine now lives in the Cathedral's code and installs with one button: Chatterbox Multilingual by default (MIT — you may earn with it, 23 languages including Polish), XTTS only with consent to its non-commercial licence. TeOgochi speak with voices from the interviews, and text loses markdown, emoji and hidden characters before speech. The voice sampler takes a sample from any recording (mp4 screen capture, video, mp3, microphone) with a waveform and preview, and Demucs can isolate the vocals. The Podcast Studio got conversation styles, the 🌀 Washer (temperature), extra rounds, multiple studios and an English intro.",
    },
  },
  {
    date: "2026-10-04",
    ref: "263d79d",
    sector: "core",
    title: "💬 Sceny dialogowe filmu",
    desc: "Silnik Studia Podcastu dla filmu: 2–4 postacie z obsady, kadry projektu jako tła (ujęcie–przeciwujęcie), napisy kinowe i głosy aktorów dają gotową scenę w Montażowni. Z planu odcinka Reżysera Katedra proponuje sceny, Ty wybierasz, a gotowy dialog trafia do Rękopisu jako szkic. Story Loom jest podpięty pod serial, bez dawnych atrap.",
    en: {
      title: "💬 Film dialogue scenes",
      desc: "The Podcast Studio engine for film: 2–4 characters from the cast, project frames as backgrounds (shot–reverse shot), cinema subtitles and the actors' voices give a finished scene in the Editing Room. From the Director's episode plan the Cathedral proposes scenes, you choose, and the finished dialogue goes to the Manuscript as a draft. Story Loom is connected to the series, without the old fakes.",
    },
  },
  {
    date: "2026-10-04",
    ref: "15e2871",
    sector: "grv",
    title: "🪪 Każda Katedra ma własny skarbiec i właściciela",
    desc: "Nowa Katedra nie kopiuje już „TeO” i „Mistrza Arkadiusza”: zakłada unikalny skarbiec, a właściciela zakładasz Ty, swoim imieniem, przy pierwszym wejściu („Jak masz na imię?”). Z kodem zaproszenia nowy węzeł startuje z 12 345 GRV zamiast 1000. Imię zmienisz w Domu TeOgochi → Bilans; klucz i saldo zostają.",
    en: {
      title: "🪪 Every Cathedral has its own treasury and owner",
      desc: "A new Cathedral no longer copies “TeO” and “Master Arkadiusz”: it creates a unique treasury, and you create the owner with your own name on first entry (“What is your name?”). With an invitation code a new node starts with 12,345 GRV instead of 1,000. You can change the name in the TeOgochi Home → Balance; the key and balance stay.",
    },
  },
  {
    date: "2026-10-04",
    sector: "web",
    title: "🧹 Bez „IGNITED”, bez obietnicy wtyczki USB, prawdziwe opisy",
    desc: "Zdjęty przełącznik „LOKALNY_VRAM: ZAPALONY” w nagłówku (niczego nie włączał) i karta „Protokoły skarbców paniki”, która obiecywała, że wyciągnięcie USB wymaże rejestry — Katedra tego nie robi. Karty „Rozruch odporny kwantowo” (pamięć L3, „omija sieci publiczne”) i „Zero emisji tokenów” zastąpione prawdą: modele i dane na Twojej maszynie, sieć tylko na Twoje życzenie (tunel Cloudflare), lokalna Ollama bez opłat, chmura tylko z własnym kluczem. Przy wsparciu zamiast „adresy Web3 monitorowane kwantowo” i „preferowane Monero”: przyjmujemy każde krypto w sieciach podanych przy adresie (wsparcie w GRV w przyszłości).",
    en: {
      title: "🧹 No “IGNITED”, no USB-plug promise, honest descriptions",
      desc: "Removed the “LOCAL_VRAM: IGNITED” toggle in the header (it switched nothing on) and the “Panic secure protocols” card promising that pulling the USB wipes registers — the Cathedral does not do that. The “Quantum resistant boot” (L3 cache, “bypasses public networks”) and “Zero tokens” cards now tell the truth: models and data on your machine, network only when you want it (Cloudflare tunnel), local Ollama with no fees, cloud only with your own key. In the support section, instead of “quantum-monitored Web3 addresses” and “preferred Monero”: we accept any crypto on the networks listed with the address (GRV support in the future).",
    },
  },
  {
    date: "2026-10-04",
    sector: "web",
    title: "📦 Strona mówi prawdę o Katedrze — koniec z wymyślonymi specyfikacjami",
    desc: "Karty „7.8 MB VRAM”, „2.4 SEKUNDY”, „UNIWERSALNY USB 2.0+” i losowa „ENTROPIA” w nagłówku były wymyślone. Teraz: rozmiar i numer paczki z wersja.json (tej samej, którą sprawdza Aktualizator), dane lokalnie (chmura tylko na życzenie), silnik Ollama z gemma4 i prawdziwe wymagania: Node.js 20+ i Ollama. W nagłówku zamiast entropii — wersja paczki.",
    en: {
      title: "📦 The site tells the truth about the Cathedral — no more made-up specs",
      desc: "The “7.8 MB VRAM”, “2.4 SECONDS”, “UNIVERSAL USB 2.0+” cards and the random “ENTROPY” in the header were invented. Now: package size and number from wersja.json (the same file the Updater checks), data stays local (cloud only on request), Ollama engine with gemma4 and the real requirements: Node.js 20+ and Ollama. The header shows the package version instead of entropy.",
    },
  },
  {
    date: "2026-10-04",
    sector: "grv",
    title: "⚡ Giełda mocy (TeOkoP GRV) — etap 1: prawdziwe oferty zamiast wymyślonego licznika",
    desc: "Zdjęliśmy ze strony głównej licznik „18 mln GB VRAM” i losowych „peerów” — były wymyślone. Teraz Katedra ogłasza w wizytówce, jaką moc udostępnia (VRAM, modele z Ollamy, cena w GRV za 1000 tokenów; Hub → Wystawa → ⚡ Giełda mocy), rejestr niesie tę ofertę, a strona i inne Katedry pokazują tylko to, co Katedry online naprawdę ogłosiły. Licznik PEERS w nagłówku = Katedry online w rejestrze. Etap 1 to ogłoszenia: zlecanie zadań i rozliczenie w GRV przyjdą później.",
    en: {
      title: "⚡ Power exchange (TeOkoP GRV) — stage 1: real offers instead of a made-up counter",
      desc: "The “18 million GB VRAM” counter and random “peers” are gone from the home page — they were invented. A Cathedral now announces in its card what power it offers (VRAM, Ollama models, price in GRV per 1000 tokens; Hub → Exhibition → ⚡ Power exchange), the registry carries the offer, and the site and other Cathedrals show only what Cathedrals online actually announced. The PEERS counter in the header = Cathedrals online in the registry. Stage 1 is announcements: running jobs and GRV settlement come later.",
    },
  },
  {
    date: "2026-10-04",
    sector: "web",
    title: "🎙️ Premiera z Podcastowego Studia Katedry na stronie głównej",
    desc: "Pierwszy odcinek zrobiony w całości w nowym Studiu Podcastu Katedry („What is a Cathedral… and why is it the greatest invention since rolling papers?”) — scenariusz, głosy, kadry i montaż lokalnie. Ramka YouTube ładuje się dopiero po kliknięciu (youtube-nocookie).",
    en: { title: "🎙️ Premiere from the Cathedral Podcast Studio on the home page", desc: "The first episode made entirely in the Cathedral's new Podcast Studio (“What is a Cathedral… and why is it the greatest invention since rolling papers?”) — script, voices, shots and editing, all local. The YouTube frame loads only after a click (youtube-nocookie)." },
  },
  {
    date: "2026-10-03",
    ref: "836ff3a",
    sector: "core",
    title: "🎭 TeOgochi Aktor — obsada i wywiad o filmie",
    desc: "Obsada filmu (postać, rola, zdjęcie lub klip, kolor, głos) i nagrany wywiad o nim: aktorzy mówią swoimi głosami na podstawie faktów projektu (kanon, odcinki, publikacja YouTube), a prowadzi Kronikarz. Scenariusz poprawiasz przed nagraniem; jest wersja po angielsku z tłumaczeniem dialogu, podkład pod rozmową i plik prosto do Montażowni i publikacji.",
    en: {
      title: "🎭 The Actor TeOgochi — a cast and an interview about the film",
      desc: "A film's cast (character, role, photo or clip, colour, voice) and a recorded interview about it: the actors speak in their own voices from the project's facts (canon, episodes, YouTube release), hosted by the Chronicler. You edit the script before recording; there is an English version with a translated dialogue, a music bed under the talk and a file going straight to the Editing Room and publishing.",
    },
  },
  {
    date: "2026-10-03",
    sector: "web",
    title: "Strona aplikacji TeO Hub OtakOS, polityka prywatności i warunki",
    desc: "Nowe stałe strony /teo-hub/, /privacy/ i /terms/ (po polsku i angielsku): czym jest TeO Hub OtakOS, do czego i w jakim zakresie używa YouTube, gdzie są dane (tylko na komputerze twórcy) i jak cofnąć dostęp. Potrzebne do weryfikacji aplikacji w Google. W stopce linki zastąpiły wymyśloną sumę SHA256.",
    en: {
      title: "TeO Hub OtakOS app page, privacy policy and terms",
      desc: "New static pages /teo-hub/, /privacy/ and /terms/ (Polish and English): what TeO Hub OtakOS is, how and to what extent it uses YouTube, where data lives (only on the creator's computer) and how to revoke access. Needed for Google app verification. In the footer, links replaced a made-up SHA256 value.",
    },
  },
  {
    date: "2026-10-03",
    sector: "core",
    title: "Kanał YouTube w wizytówce i postprodukcja przez stado",
    desc: "Wizytówka Katedry może teraz pokazać cały kanał YouTube w jednej ramce (wszystkie filmy, a obok najnowsze z publicznego kanału RSS — bez klucza API) i linki do innych serwisów. W Katedrze YouTube łączy się jednym kliknięciem (zgoda Google w okienku, bez kopiowania tokenów), a gotowy film przygotowuje Kronikarz: tytuł, opis, tagi. Wysyłka idzie dopiero po ✓ Suwerena (Hub albo Izba w StoL), jako film niepubliczny, a link sam trafia na Wystawę. Uczciwie: projekt API bez audytu Google trzyma filmy jako prywatne — Katedra sprawdza prawdziwy status i nie wstawia linku, który by nie zagrał.",
    en: {
      title: "YouTube channel on the card and post-production by the herd",
      desc: "A Cathedral card can now show its whole YouTube channel in one frame (all videos, plus the latest ones from the channel's public RSS feed — no API key) and links to other services. In the Cathedral, YouTube connects with one click (Google consent in a pop-up, no copying tokens), and a finished film is prepared by the Chronicler: title, description, tags. Upload happens only after the Sovereign's ✓ (Hub or the Chamber in StoL), as an unlisted video, and the link lands on the Exhibition by itself. Honestly: an API project without a Google audit keeps videos private — the Cathedral checks the real status and won't insert a link that wouldn't play.",
    },
  },
  {
    date: "2026-10-03",
    sector: "mesh",
    title: "Katedry ze stałym adresem w sieci + „offline” mówi dlaczego",
    desc: "Rejestr przyjmował dotąd tylko adresy quick tunnel *.trycloudflare.com, więc Katedra na nazwanym tunelu (stały adres na własnej domenie) zostawała offline. Teraz stały adres zarządcy rejestru działa od razu, a stała domena każdej innej Katedry trafia na Stół zarządcy i po zatwierdzeniu jest odpytywana jak quick tunnel — rejestr dalej nie puka pod niezatwierdzone adresy. Gdy Twoja Katedra jest offline, panel „Twoja” pokazuje ostatnią odpowiedź rejestru na jej meldunek zamiast samego „offline”.",
    en: {
      title: "Cathedrals with a fixed address on the network + “offline” says why",
      desc: "The registry used to accept only quick tunnel addresses (*.trycloudflare.com), so a Cathedral on a named tunnel (a fixed address on its own domain) stayed offline. Now the registry steward's fixed address works right away, and any other Cathedral's fixed domain lands on the steward's Table and, once approved, is checked like a quick tunnel — the registry still never calls unapproved addresses. When your Cathedral is offline, the “Yours” panel shows the registry's latest reply to its check-in instead of just “offline”.",
    },
  },
  {
    date: "2026-10-02",
    ref: "92c58ff",
    sector: "mesh",
    title: "💬 TOST między Katedrami — wiadomości szyfrowane od końca do końca",
    desc: "Katedry online z rejestru otakos.wtf stają się kontaktami. Wiadomość jedzie w kopercie X25519 + AES-256-GCM, podpisana kluczem wizytówki i sprawdzana kluczem nadawcy z rejestru. Gdy odbiorca jest offline, czeka w Twojej Katedrze i ponawia się co minutę (do 7 dni). W Hubie: TOST → „🏛️ Katedry”, na telefonie: StoL → TOST. Uczciwie: szyfr chroni drogę, a rozmowy leżą na dysku Twojej Katedry jawnie.",
    en: {
      title: "💬 TOST between Cathedrals — end-to-end encrypted messages",
      desc: "Cathedrals online in the otakos.wtf registry become contacts. A message travels in an X25519 + AES-256-GCM envelope, signed with the card key and checked against the sender's key from the registry. If the recipient is offline, it waits in your Cathedral and is retried every minute (up to 7 days). In the Hub: TOST → “🏛️ Cathedrals”, on the phone: StoL → TOST. Honestly: the encryption protects the route, while conversations sit on your Cathedral's disk unencrypted.",
    },
  },
  {
    date: "2026-10-02",
    ref: "f6f16ca",
    sector: "web",
    title: "🌍 Katedra w dowolnym języku",
    desc: "Katedra pisana po polsku tłumaczy ekran na wybrany język lokalnym modelem i pamięta tłumaczenia na dysku. Rozmowy z agentami i pola do pisania zostają nietknięte. Uczciwie: jakość zależy od lokalnego modelu, a pierwsze wejście w nowy język pokazuje polski, zanim się przełączy.",
    en: {
      title: "🌍 The Cathedral in any language",
      desc: "The Cathedral, written in Polish, translates the screen into the chosen language with a local model and remembers translations on disk. Conversations with agents and input fields are left untouched. Honestly: quality depends on the local model, and the first visit in a new language shows Polish before it switches.",
    },
  },
  {
    date: "2026-10-02",
    sector: "mesh",
    title: "Katedry w sieci — przesuń w lewo i przewijaj wizytówki aktywnych Katedr",
    desc: "Każda Katedra dostała wizytówkę: swoją wystawę (filmy, utwory Suno i z dysku, produkty) pod samym nickiem, bez imion. Na otakos.wtf przesunięcie palcem w lewo (albo zakładka „Katedry” przy prawej krawędzi) otwiera najpierw Twoją wizytówkę — z Katedry działającej obok przeglądarki — a dalej Katedry, które są właśnie online, jedna pod drugą jak shorty. Wizytówka idzie prosto z Katedry przez jej Kwantowy Tunel; strona pamięta tylko, kto się zameldował w ostatnich minutach. Meldunek jest podpisany kluczem Katedry, a pokazują się wyłącznie nicki zatwierdzone przez Suwerena strony — nikt nie podszyje się pod cudzy nick ani nie wstawi obcej treści. Przez tunel widać wyłącznie wizytówkę; reszta Katedry dalej wymaga klucza, a ramki na stronie przyjmujemy tylko z YouTube i Suno.",
    en: {
      title: "Cathedrals online — swipe left and scroll through the cards of active Cathedrals",
      desc: "Every Cathedral now has a card: its own exhibition (films, Suno tracks and tracks from disk, products) under a nick only, no names. On otakos.wtf, swiping left (or the “Cathedrals” tab on the right edge) first opens your own card — from a Cathedral running next to the browser — and then the Cathedrals that are online right now, one after another like shorts. The card comes straight from the Cathedral through its Quantum Tunnel; the site only remembers who checked in during the last few minutes. Check-ins are signed with the Cathedral's key, and only nicks approved by the site's Sovereign appear — nobody can take someone else's nick or slip in foreign content. Through the tunnel only the card is visible; the rest of the Cathedral still requires a key, and the site only accepts embeds from YouTube and Suno.",
    },
  },
  {
    date: "2026-10-02",
    ref: "d7324b7",
    sector: "core",
    title: "Akademia Katedry od nowa — uczy tego, co naprawdę działa",
    desc: "Dawna Akademia uczyła rzeczy, których w Katedrze nie ma: blockchainu odpornego na komputery kwantowe, sterowania dronami, chmurowego Gemini — a jej samouczki wskazywały na wymyślone filmy. Wszystko to zniknęło. Teraz są cztery quizy o prawdziwej Katedrze (fundament 0.00G, architektura węzła, stado TeOgochi, Główny z aktualizacjami i tłumaczem), sześć przewodników krok po kroku po prawdziwych ekranach z przyciskiem, który od razu je otwiera, zakładka Fundament z TeO Trust i Słowem Suwerena oraz Recenzje — pierwsza to rozmowa z Trybem AI Google, z nagraniem i uczciwym dopiskiem tam, gdzie AI przesadziło. Odznaka przychodzi dopiero od 80% (wcześniej wpadała nawet za 20%), a test pilnuje, że każda poprawna odpowiedź jest wśród opcji.",
    en: {
      title: "The Cathedral Academy, rebuilt — it teaches what really works",
      desc: "The old Academy taught things the Cathedral does not have: a quantum-resistant blockchain, drone control, cloud Gemini — and its tutorials pointed at made-up videos. All of that is gone. Now there are four quizzes about the real Cathedral (0.00G foundation, node architecture, the TeOgochi flock, the Lead agent with updates and the translator), six step-by-step guides through real screens with a button that opens them, a Foundation tab with the TeO Trust and the Sovereign's Word, and Reviews — the first is a conversation with Google's AI Mode, with the recording and an honest note where the AI overstated things. A badge now takes 80% (it used to come even at 20%), and a test makes sure every correct answer is among the options.",
    },
  },
  {
    date: "2026-10-02",
    ref: "4b90cf6",
    sector: "distro",
    title: "Paczka Katedry: 32 MB zamiast 322 MB — i pierwsza z plikiem wersji",
    desc: "Pierwsza próba wydania paczki z aktualizatorem spakowała 6 GB lokalnych środowisk — Pythona, modeli i assetów 3D — w zip 322 MB, którego GitHub nie przyjął, a skrypt i tak napisał „OK”. Teraz katalog AI w paczce jest na białej liście: jadą tylko narzędzia i workflowy, a środowiska i modele zostają u Suwerena. Zip powyżej 95 MB zatrzymuje wydanie przed stroną i wypisuje najcięższe katalogi, a odrzucony push kończy się błędem, nie „OK”. Wynik: 912 plików, 32 MB, wszystkie ścieżki zgodne ze standardem ZIP, a plik wersji na stronie niesie sumę SHA-256 sprawdzoną co do bajtu — od teraz węzły z paczki widzą aktualizacje same.",
    en: {
      title: "The Cathedral package: 32 MB instead of 322 MB — and the first with a version file",
      desc: "The first attempt to release a package with the updater packed 6 GB of local environments — Python, models and 3D assets — into a 322 MB zip that GitHub refused, while the script still said “OK”. Now the AI folder in the package is allow-listed: only tools and workflows ship, environments and models stay with the Sovereign. A zip over 95 MB stops the release before it reaches the site and lists the heaviest folders, and a rejected push ends in an error, not “OK”. Result: 912 files, 32 MB, all paths following the ZIP standard, and the version file on the site carries a SHA-256 verified to the byte — from now on, nodes installed from the package see updates by themselves.",
    },
  },
  {
    date: "2026-10-02",
    ref: "75f2edb",
    sector: "distro",
    title: "Węzeł sam wie, że jest nowsza Katedra — i aktualizuje tylko kod",
    desc: "Do tej pory kto pobrał Katedrę z tej strony, ten zostawał z nią na zawsze: nowa wersja oznaczała ponowne pobranie i ręczne przenoszenie swoich danych. Teraz węzeł sam pyta stronę o plik wersji i pokazuje, co doszło. Aktualizacja pobiera paczkę, sprawdza jej sumę SHA-256 (bez zgodnej sumy nic nie rusza) i podmienia wyłącznie kod — dzieła, stado, pamięć, sekrety, modele i własne skille zostają nietknięte, a niczego nie kasuje. Każdy nadpisany plik ląduje najpierw w kopii, więc jednym przyciskiem da się cofnąć. Węzeł postawiony z gita aktualizuje się przez git pull i odmawia, gdy w plikach jest niezapisana praca. Przy okazji wyszedł błąd paczki: stary sposób pakowania zapisywał ścieżki z ukośnikiem wstecznym, przez co na Linuksie i w Termuxie rozpakowywały się płaskie pliki zamiast katalogów — paczki budujemy teraz zgodnie ze standardem ZIP. Węzeł pyta stronę, strona nic o węźle nie wie.",
    en: {
      title: "A node now knows there is a newer Cathedral — and updates only the code",
      desc: "Until now, whoever downloaded the Cathedral from this site was stuck with that version: a new release meant downloading again and moving your data by hand. Now the node asks the site for a version file and shows what is new. The update downloads the package, checks its SHA-256 (no matching checksum, no change) and replaces only code — works, the flock, memory, secrets, models and your own skills stay untouched, and nothing is deleted. Every overwritten file is backed up first, so one button rolls it back. A node installed from git updates with git pull and refuses while there is unsaved work. Along the way we found a packaging bug: the old packer wrote paths with backslashes, so on Linux and Termux the archive unpacked into flat files instead of folders — packages now follow the ZIP standard. The node asks the site; the site knows nothing about the node.",
    },
  },
  {
    date: "2026-10-01",
    ref: "e26b6d7",
    sector: "crypto",
    title: "Straż Głównego — swoboda przy tworzeniu, zgoda tylko na to, co ważne",
    desc: "Główny agent pytał o zgodę nawet na wylistowanie katalogu, a mały model potrafił ponawiać odrzucone polecenie w kółko, aż skończył mu się limit tur — z kilkudziesięcioma identycznymi prośbami na ekranie. Teraz przed każdym narzędziem staje Straż: odczyt, polecenia tylko do odczytu, tworzenie nowych plików i katalogów idą od razu. Zmiana istniejących plików rdzenia Katedry, sekrety, zapis poza Katedrą i polecenia, które coś zmieniają, czekają na zgodę — z podglądem zmiany i wyjaśnieniem po ludzku. Model dostaje powód odmowy i prośbę, by nie obchodził jej innym poleceniem; po trzech różnych odmowach w jednej turze Główny sam się zatrzymuje. Sprawdzone na prawdziwym Claude Code: odczyt i nowy plik bez pytania, edycja rdzenia dopiero po zgodzie, wznowienie po zgodzie działa.",
    en: {
      title: "The Lead agent's Guard — freedom to create, consent only for what matters",
      desc: "The Lead agent asked for permission even to list a folder, and a small model could retry a refused command over and over until it ran out of turns — leaving dozens of identical requests on screen. Now a Guard stands before every tool: reading, read-only commands and creating new files and folders go straight through. Changing existing core files, secrets, writing outside the Cathedral and commands that change things wait for consent — with a preview of the change and a plain-language explanation. The model is told why it was refused and not to work around it; after three different refusals in one turn the Lead stops by itself. Verified on real Claude Code: reading and a new file without asking, a core edit only after consent, resuming after consent works.",
    },
  },
  {
    date: "2026-10-01",
    ref: "ed64d5c",
    sector: "core",
    title: "Główny — Claude Code w Katedrze, w czacie zamiast w osobnym oknie",
    desc: "Przycisk „Odpal Tu…Kurka!” otwierał terminal, którego żaden czat ani agent nie widział. Teraz Claude Code działa w tle jako Główny agent, podłączony do Creative Zone, czatu Katedry i Orba, na lokalnym modelu przez Ollamę. Widać, co robi, a każdą prośbę o polecenie tłumaczy Tłumacz: co zrobi, z jakim ryzykiem i po co według samego agenta. Główny zleca pracę stadu TeOgochi, zna moce Katedry (np. przycinanie wideo ffmpegiem bez pytania) i widzi zrzuty ekranu wklejane do czatu. Uczciwie: na bardzo małym modelu (2B) gubi narzędzia — wybór modelu jest w czacie i ostrzega przy małych.",
    en: {
      title: "The Lead — Claude Code inside the Cathedral, in the chat instead of a separate window",
      desc: "The “Odpal Tu…Kurka!” button used to open a terminal that no chat or agent could see. Now Claude Code runs in the background as the Lead agent, wired into Creative Zone, the Cathedral chat and the Orb, on a local model through Ollama. You see what it does, and every command request is explained by a Translator: what it will do, how risky it is, and why the agent wants it. The Lead delegates work to the TeOgochi flock, knows the Cathedral's abilities (e.g. trimming video with ffmpeg without asking) and sees screenshots pasted into the chat. Honestly: on a very small model (2B) it loses track of tools — the model picker in the chat warns about small ones.",
    },
  },
  {
    date: "2026-10-01",
    ref: "0b5142d",
    sector: "core",
    title: "Porządki na dysku — propozycje z rozmiarem i powodem, nic samo nie znika",
    desc: "Modele i paczki rosną po dziesiątki gigabajtów. Porządki przeglądają tylko to, o czym Katedra wie: pliki GGUF, które Ollama już skopiowała, modele bez żadnego agenta i pracy, resztki treningów Kuźni i cache instalatora. Każda pozycja ma rozmiar i powód, a usunięte zostaje wyłącznie to, co Suweren zaznaczy — i to po ponownym sprawdzeniu na świeżym przeglądzie. Dzieła Suwerena i bazy treningowe nigdy nie trafiają na listę.",
    en: {
      title: "Disk clean-up — proposals with size and reason, nothing disappears on its own",
      desc: "Models and packages grow to tens of gigabytes. Clean-up only looks at what the Cathedral knows about: GGUF files Ollama has already copied, models with no agent or work, leftovers of Forge training runs and installer caches. Each item shows its size and reason, and only what the Sovereign ticks gets deleted — re-checked against a fresh scan first. The Sovereign's works and training bases never appear on the list.",
    },
  },
  {
    date: "2026-10-01",
    ref: "87b3253",
    sector: "core",
    title: "Zwiadowca HF i Pionek — nowe TeOgochi od modeli i od gier",
    desc: "Zwiadowca przegląda HuggingFace w poszukiwaniu modeli GGUF mieszczących się w karcie graficznej, czyta ich karty i zgłasza kandydatów Dyrygentowi — niczego nie pobiera sam, dopiero po akceptacji. Przyjmuje też bezpośrednie linki, a źródła spoza HuggingFace oznacza jako niezweryfikowane. Mówi prawdę o formacie: repozytorium w MLX to wagi wyłącznie dla Maców z Apple Silicon, a safetensors wymagają konwersji — wtedy szuka gotowej wersji GGUF tego samego modelu. Pionek pisze dokumenty projektowe gier w projektach stada i prowadzi Studio Gier.",
    en: {
      title: "HF Scout and Pawn — new TeOgochi for models and for games",
      desc: "The Scout searches HuggingFace for GGUF models that fit the graphics card, reads their model cards and reports candidates to the Conductor — it downloads nothing on its own, only after acceptance. It also takes direct links and marks sources outside HuggingFace as unverified. It tells the truth about formats: an MLX repository is weights for Apple Silicon Macs only, and safetensors need conversion — then it looks for a ready GGUF build of the same model. Pawn writes game design documents in flock projects and drives the Games Studio.",
    },
  },
  {
    date: "2026-09-29",
    ref: "11a7f4a",
    sector: "core",
    title: "Agenci znają fakty — projekty, Stół i pamięć zamiast domysłów",
    desc: "Zapytani „co zrobione w projektach?” agenci zgadywali. Teraz most składa raport z faktów: projekty stada, karty Stołu, Nocna Zmiana, ostatnie zdarzenia z szyny i zajęta pamięć z opisem procesów (który Python to ComfyUI, a który trening). Proces można zamknąć po numerze — z Katedry albo ze sparowanego telefonu — ale tylko z świeżej listy i nigdy procesów chronionych, takich jak sam most czy kompresja pamięci systemu.",
    en: {
      title: "Agents know the facts — projects, the Table and memory instead of guesses",
      desc: "Asked “what is done in the projects?”, agents used to guess. Now the bridge assembles a report from facts: flock projects, Table cards, the Night Shift, recent bus events and memory usage with a description of each process (which Python is ComfyUI and which is training). A process can be closed by its number — from the Cathedral or a paired phone — but only from a fresh list and never protected processes such as the bridge itself or system memory compression.",
    },
  },
  {
    date: "2026-09-28",
    ref: "396811e",
    sector: "core",
    title: "Dyrygent modeli i Kuźnia Soup — każdy TeOgochi może dostać własny model",
    desc: "Dyrygent dobiera modele do agentów z katalogu tego, co naprawdę jest w Ollamie, z kartami modeli i średnią oceną pracy w stadzie — propozycja jest sprawdzana, więc nie wymyśli modelu, którego nie ma. Kuźnia Soup trenuje własny model TeOgochi z jego najlepiej ocenionych wkładów (minimum osiem próbek), eksportuje go do GGUF i wpina do Ollamy — lokalnie, z wyłączoną telemetrią. Instalator środowiska stawia Pythona, PyTorch pod sterownik karty i narzędzia w katalogu Katedry. Wykuty model nie zastępuje silnika sam — to decyzja Suwerena.",
    en: {
      title: "Model Conductor and Soup Forge — every TeOgochi can get its own model",
      desc: "The Conductor assigns models to agents from what is really installed in Ollama, using model cards and the average score of their flock work — its proposal is checked, so it cannot invent a model that is not there. Soup Forge trains a TeOgochi's own model from its best-rated contributions (at least eight samples), exports it to GGUF and plugs it into Ollama — locally, with telemetry off. The environment installer sets up Python, a PyTorch build matching the GPU driver and the tools inside the Cathedral folder. A forged model never replaces the engine by itself — that is the Sovereign's decision.",
    },
  },
  {
    date: "2026-09-27",
    ref: "cc802c9",
    sector: "core",
    title: "Stół ratyfikacji i rundy doskonalenia — projekt dojrzewa, zanim ruszą moduły",
    desc: "Propozycja trafia na Stół z rozmowy podcastu, z pliku albo z telefonu. Po przyjęciu stado pisze Biblię projektu, a Sędzia ocenia ją względem wizji i wypisuje braki; w kolejnych rundach (najwyżej pięć) każdy poprawia własne wkłady, a ocena 9 na 10 kończy pracę wcześniej. Dopiero ratyfikacja Suwerena uruchamia zlecenia dla modułów — muzyki, wideo, sklepu, gier. Rundy można puścić od razu albo na noc, także z telefonu, a koniec projektu zapowiada głos.",
    en: {
      title: "Ratification Table and refinement rounds — a project matures before modules start",
      desc: "A proposal reaches the Table from a podcast conversation, a file or the phone. Once accepted, the flock writes the project Bible and a Judge scores it against the vision and lists what is missing; in further rounds (up to five) each agent improves its own contributions, and a score of 9 out of 10 ends the work early. Only the Sovereign's ratification starts work orders for the modules — music, video, shop, games. Rounds can run right away or overnight, also from the phone, and a voice announces when a project is done.",
    },
  },
  {
    date: "2026-09-26",
    ref: "5c98342",
    sector: "web",
    title: "Powitanie Dnia — codzienny film od stada",
    desc: "Rano każdy aktywny TeOgochi pisze na swoim modelu sentencję do Suwerena, opartą na prawdziwych śladach z ostatniej doby, a ffmpeg wpisuje ją w kadr: ujęcie z ComfyUI, prawdziwe dzieło albo barwa agenta, z najnowszą muzyką pod spodem. Gdy ComfyUI śpi, reszta scen nie czeka. Film pokazuje się sam raz na urządzeniu, w Świecie Katedry i na telefonie.",
    en: {
      title: "Morning Greeting — a daily film from the flock",
      desc: "Each morning every active TeOgochi writes a sentence to the Sovereign on its own model, based on real traces from the last day, and ffmpeg sets it into a frame: a ComfyUI shot, a real work or the agent's own colour, with the newest music underneath. If ComfyUI is asleep, the other scenes don't wait. The film shows itself once per device, in the Cathedral World and on the phone.",
    },
  },
  {
    date: "2026-09-25",
    ref: "e8ee345",
    sector: "mesh",
    title: "Projekt Stada, Świat klocków i StoL — Katedra w telefonie",
    desc: "TeOgochi pracują razem nad jednym projektem, każdy na swoim modelu i ze swoją rolą: najpierw fundament, potem dziedziny (muzyka, zwiastun, gra, moda), na końcu całość i Biblia. Ich wkłady same zlecają moduły Katedry. Świat klocków pokazuje stado jako płytki z prawdziwych dzieł zebranych z dysku — stuknięcie w agenta otwiera jego sprawy. Aplikacja StoL na Androida paruje się z Katedrą i daje Stół, Izbę Akceptacji i rozmowę z każdym TeOgochi w kieszeni.",
    en: {
      title: "Flock Projects, the Brick World and StoL — the Cathedral on your phone",
      desc: "TeOgochi work together on one project, each on its own model and in its own role: first the foundation, then the domains (music, trailer, game, fashion), finally the whole and the Bible. Their contributions place work orders with the Cathedral modules by themselves. The Brick World shows the flock as plates built from real works found on disk — tapping an agent opens its affairs. The StoL Android app pairs with the Cathedral and puts the Table, the Acceptance Chamber and a conversation with every TeOgochi in your pocket.",
    },
  },
  {
    date: "2026-09-25",
    ref: "9e8911e",
    sector: "core",
    title: "Pierwsze testy mostu — Rewizor, Mapa Katedry i Recenzent Kodeksa",
    desc: "Most ma setki tras w jednym pliku i do tego dnia nie miał żadnego testu. Rewizor wyłapuje zdublowane trasy, importy do nieistniejących plików i wywołania z interfejsu, których most nie zna, a sonda żywa sprawdza bezpieczne trasy na działającym moście. Mapa pokazuje drogę od ekranu przez API do serwisu i wskazuje martwe komponenty. Recenzent czyta kod rundy Kodeksa — zaślepki, wyciszone błędy, wycięty kod — zanim uwierzymy w zielony build. Od pierwszych 26 testów zestaw urósł do ponad 170.",
    en: {
      title: "The bridge's first tests — Auditor, Cathedral Map and Codex Reviewer",
      desc: "The bridge has hundreds of routes in a single file and until that day had no tests at all. The Auditor catches duplicate routes, imports of missing files and interface calls the bridge does not know, and a live probe checks safe routes on a running bridge. The Map traces the path from screen through API to service and points out dead components. The Reviewer reads each Codex round's code — stubs, silenced errors, removed code — before we believe a green build. From the first 26 tests the suite has grown to over 170.",
    },
  },
  {
    date: "2026-09-22",
    ref: "bccbd8a",
    sector: "core",
    title: "App Studio 2.0 i Assety 3D — Kodeks buduje i ogląda, co zbudował",
    desc: "Kodeks pisze aplikacje i gry three.js w piaskownicy, a pętla sprawdza je jak człowiek: kompilacja, build, przeglądarka otwiera wynik, zbiera błędy i porównuje stronę przed i po kliknięciu. Martwy moduł i pliki bez zmian liczą się jako porażka rundy, nie sukces. Gry powstają z dokumentu projektowego, a Reżyser Gry proponuje zmiany w planie. Generator assetów 3D robi z tekstu albo zdjęcia gotowy model GLB — zmierzone na karcie 6 GB: obraz 61 s, bryła około 12 minut, uproszczenie do grywalnej siatki ułamek sekundy.",
    en: {
      title: "App Studio 2.0 and 3D Assets — Codex builds and looks at what it built",
      desc: "Codex writes apps and three.js games in a sandbox, and the loop checks them like a person would: compile, build, a browser opens the result, collects errors and compares the page before and after a click. A dead module or unchanged files count as a failed round, not a success. Games are built from a design document, and a Game Director proposes changes to the plan. The 3D asset generator turns text or a photo into a ready GLB model — measured on a 6 GB card: image 61 s, mesh about 12 minutes, simplification to a playable mesh a fraction of a second.",
    },
  },
  {
    date: "2026-09-17",
    ref: "f2e19c0",
    sector: "mesh",
    title: "Delegat Mobilny i Kwantowy Tunel jednym przyciskiem",
    desc: "TeOgochi mówią i słuchają w telefonie Suwerena: głos idzie torami Katedry (Whisper i lokalna synteza), a odpowiedzi mogą sięgać po narzędzia z białej listy. Tunel do telefonu stawia się jednym przyciskiem i od razu pokazuje kod QR. Przy tej okazji złapana poważna dziura: żądania z tunelu dochodziły do mostu jak lokalne, więc omijały Straż — zmierzone przez internet i załatane. Własny stały adres z konta Suwerena działa opcjonalnie; domyślnie adres jest jednorazowy.",
    en: {
      title: "Mobile Delegate and the Quantum Tunnel in one click",
      desc: "TeOgochi speak and listen on the Sovereign's phone: voice travels the Cathedral's own paths (Whisper and local speech synthesis), and answers can reach for whitelisted tools. The tunnel to the phone starts with one button and immediately shows a QR code. Along the way a serious hole was caught: requests through the tunnel reached the bridge as if they were local, so they bypassed the Guard — measured over the internet and patched. A fixed address from the Sovereign's own account is optional; by default the address is one-time.",
    },
  },
  {
    date: "2026-09-15",
    ref: "44ee45f",
    sector: "core",
    title: "Warsztat utworów i YuE2 — przedłuż, zremiksuj, zrób cover",
    desc: "Gotowy utwór można przedłużyć (kontynuacja z barwą oryginału, zszyta płynnym przejściem), zremiksować z nowymi tagami albo przearanżować jako cover tej samej długości — lokalnie, na ACE-Step 1.5. Nazwy są uczciwe: przedłużenie to kontynuacja, nie domalowanie w środku, bo silnik tego nie potrafi — zmierzone. Doszła rodzina YuE2 dla muzyki z tekstem, a most przed startem sprawdza, czy ComfyUI ma potrzebny węzeł, zamiast udawać pracę.",
    en: {
      title: "Track Workshop and YuE2 — extend, remix, cover",
      desc: "A finished track can be extended (a continuation with the original's timbre, stitched with a smooth crossfade), remixed with new tags or re-arranged as a cover of the same length — locally, on ACE-Step 1.5. The names are honest: extending is continuation, not in-place inpainting, because the engine cannot do that — measured. The YuE2 family arrived for music with lyrics, and before starting the bridge checks that ComfyUI has the required node instead of faking work.",
    },
  },
  {
    date: "2026-09-12",
    ref: "14ce452",
    sector: "core",
    title: "Nocna Zmiana — długie roboty ruszają, gdy Suweren nie pracuje",
    desc: "Rendery, rundy projektów i produkcja gier potrafią zająć godziny. Nocna Zmiana uruchamia je dopiero przy trzech otwartych bramach: co najmniej dziesięć minut bezczynności, wolna karta graficzna i co najmniej 8 GB wolnej pamięci — tej ostatniej nauczyła noc, w której zabrakło RAM-u. Zadanie rozpoczęte kończy się, nawet gdy Suweren wróci, ale nowe nie startuje. Każde uruchomienie i wynik trafiają do dziennika.",
    en: {
      title: "Night Shift — long jobs start when the Sovereign is not working",
      desc: "Renders, project rounds and game production can take hours. The Night Shift starts them only when three gates are open: at least ten minutes of idleness, a free graphics card and at least 8 GB of free memory — the last one learned from a night that ran out of RAM. A started job finishes even if the Sovereign returns, but no new one starts. Every run and result goes into a log.",
    },
  },
  {
    date: "2026-09-09",
    ref: "1225eb5",
    sector: "core",
    title: "Produkcja filmowa na własnej karcie — kadr, ruch, montaż",
    desc: "Z rozmowy w Pokoju Opowieści rodzi się serial: projekt, fakty kanoniczne i odcinki w planie. Potok produkcji jest wreszcie spójny: kadr robi jeden obraz, ruch ożywia dokładnie ten obraz, montaż skleja ujęcia — wcześniej kadr i ujęcie były dwoma niezależnymi losowaniami, więc postać w kadrze i w ruchu była kimś innym. Silnikiem wideo jest Wan 2.2, bo mieści się w 6 GB karty; większy model został widoczny, ale nie wybiera się sam, zamiast obiecywać sceny liczone godzinami.",
    en: {
      title: "Film production on your own graphics card — frame, motion, edit",
      desc: "A conversation in the Story Room becomes a series: a project, canon facts and episodes in a plan. The production pipeline is finally consistent: the frame stage makes one image, motion animates exactly that image, editing joins the shots — before, frame and shot were two independent random draws, so the character in the frame and in motion were different people. The video engine is Wan 2.2 because it fits a 6 GB card; the larger model stays visible but is never picked automatically, instead of promising scenes that take hours.",
    },
  },
  {
    date: '2026-08-28',
    ref: 'e5f6516',
    sector: 'grv',
    title: 'Konta przestały mieć dwie prawdy — portfel pyta księgę, a nie sam siebie',
    desc: 'Mapowanie „które konto to który węzeł księgi" siedziało w przeglądarce, w jednej funkcji portfela. Most miał o tym własne zdanie, więc dwie warstwy mogły twierdzić co innego o tym, czyj to portfel — a nazwa węzła to nie kosmetyka, tylko klucz, po którym idą przelewy GRV. Rejestr kont przeniósł się na most i to on jest teraz właścicielem odpowiedzi: teo@teo.center to bank ekosystemu (saldo nieskończone, nie portfel osobisty), a osobne konto Suwerena to Pierwszy Founder. Nieznane konto dostaje odmowę zamiast zgadywania — bo zgadnięcie przypisałoby komuś cudzy milion. Przy okazji poleciały trzy liczby z palca: zmyślone 99 999 999 GRV dla banku (księga mówi „nieskończoność" i tak to teraz wygląda na ekranie), oraz saldo 3975,78 pokazywane zawsze, gdy portfel nie był z niczym spięty. Brak salda wygląda odtąd jak brak salda.',
  },
  {
    date: '2026-08-28',
    ref: 'e5f6516',
    sector: 'grv',
    title: 'Klucze założycielskie — działają dokładnie raz i nie obiecują miejsc, których nie ma',
    desc: 'Founder to 26 miejsc po milionie GRV i jedyna droga do tej rangi prowadzi teraz przez klucz wydany przez Suwerena. Klucz jest jednorazowy: po użyciu zostaje wypalony razem z datą i nazwą węzła, który go zużył, więc drugi raz nie zadziała. Most odmawia też wydania większej liczby kluczy, niż zostało wolnych miejsc — klucz bez pokrycia byłby gorszy niż odmowa, bo mówiłby „masz milion", a przy próbie użycia okazywałby się pusty. Sprawdzone na żywej księdze: klucz zmyślony odrzucony, ten sam klucz drugi raz odrzucony z podaniem kto i kiedy go zużył, klucz podany komuś, kto już jest Founderem, odrzucony i pozostawiony nietknięty. Ranga zapisuje się przed wypaleniem klucza, żeby nieudany zapis nie zjadł klucza po cichu.',
  },
  {
    date: '2026-08-28',
    ref: 'e5f6516',
    sector: 'web',
    title: 'Brama Katedry ma drugie drzwi — wejście bez chmury, ale tylko na własnej maszynie',
    desc: 'Katedra deklaruje „zero chmury jako domyślne", a front drzwi wymagał konta Google i działającego okienka logowania. Przy zablokowanym popupie albo bez sieci nie dało się wejść w ogóle. Obok stoi teraz wejście suwerenne: pyta „kim jesteś przy tej klawiaturze", pokazuje konta prosto z mostu i po wyborze robi to samo, co dawało logowanie — personalizuje i spina konto z księgą GRV. Saldo po wejściu jest księgowe co do grosza, bank pokazuje nieskończoność, a wejście bez konta uczciwie pokazuje puste saldo zamiast wymyślonej liczby. Świadome ograniczenie: te drzwi widać wyłącznie na maszynie lokalnej, bo ta sama brama stoi publicznie — a tam „most na 127.0.0.1" należy do odwiedzającego, nie do Katedry.',
  },
  {
    date: '2026-08-27',
    ref: '9bf2bfc',
    sector: 'core',
    title: 'Mechanik dostał cofkę — i przestał mielić na modelu, który wywala silnik',
    desc: 'Pętla samonaprawy zapisywała łatkę na dysk i od razu meldowała „gotowe" — bez sprawdzenia, czy kod się w ogóle parsuje. Kod z błędem składni rozwalał Katedrę po cichu, a kopia szła do pliku .bak obok źródła: jedna, nadpisywana, bez związku z zadaniem. Teraz każde wdrożenie robi migawkę, po zapisie leci kontrola (node --check dla JS, tsc dla TypeScriptu), a gdy padnie — plik wraca do stanu sprzed. Zmierzone na obu ścieżkach: zepsuta łatka cofnięta z prawdziwym błędem kompilatora, dobra wdrożona. Przy okazji wyszło, czemu trzy próby naprawy z rzędu kończyły się tym samym błędem: Mechanik miał wpisany na sztywno model „gemma4" — goły tag, który Ollama rozwija do wersji wywalającej silnik, do tego model ogólny, a on ma naprawiać kod. Poszedł na model kodowy, a most odmawia teraz zapisu modelu, którego Ollama nie zna.',
  },
  {
    date: '2026-08-27',
    sector: 'core',
    title: 'TeOgochi: z jednego kompana zrobiło się trzynaście agentów — i zaczęli ze sobą gadać',
    desc: 'Joanna była jedynym kompanem Katedry. Teraz jest jednym z trzynastu gatunków, każdy z własną dziedziną, własnym jajem i własną ścieżką ewolucji: Klatka od filmu, Kodeks od kodu, Wektor od wiedzy, Bilans od biznesu i dalej. Awatar pokazuje faktyczny etap — bez XP widzisz jajo, nie obietnicę. Każdy może mieć własny rdzeń LLM, wybierany z listy modeli realnie obecnych w Ollamie, nie z pola tekstowego. Powstała szyna zdarzeń, na której agenci meldują, co robią; WORKPalace pokazuje ten strumień na żywo. Pierwsza prawdziwa rozmowa między nimi już się odbyła: Klatka zapytała Joannę o podkład do vloga ze spawania i dostała konkretną odpowiedź. Szyna pokazuje tylko to, co agenci sami wyślą — milczący jest niewidoczny i tak ma być.',
  },
  {
    date: '2026-08-27',
    sector: 'core',
    title: 'Katedra mówi po polsku — lokalnie, bez chmury i bez kluczy',
    desc: 'Joanna miała przycisk mowy, który nic nie robił. Powód okazał się prozaiczny: most dostawał zlecenie bez wskazania przewodu, więc brał domyślny silnik klonu XTTS — nieobecny na tej maszynie. Mowa spadała na syntezę przeglądarki, a ta bez kliknięcia w ogóle nie brzmi. Doszedł przewód Piper z pięcioma polskimi głosami liczonymi na dysku Suwerena. Zmierzone: bez przewodu HTTP 424 i cisza, z przewodem 200 i realny plik WAV. Osobno wjechał tor angielski (SuperVoice, 24 kHz, na GPU) — świadomie osobny, bo wrzucenie polskiego zdania do angielskiego modelu nie daje błędu, tylko obcy akcent. Cichy zły wynik jest gorszy niż jawny wybór.',
  },
  {
    date: '2026-08-18',
    ref: '83993f7',
    sector: 'core',
    title: 'MCP Skillboard — skille, które przyznają się, że nie działają',
    desc: 'Kolektyw agentów dostał tablicę skilli MCP. Przy weryfikacji wyszło, że z 14 kart realnie działały dwie, a reszta odpowiadała „SUCCESS" nic nie robiąc — na zapytanie DROP TABLE do nieistniejącej bazy też. Teraz skill bez podpiętego serwera zwraca wprost „NIEZAIMPLEMENTOWANE", a zerwane połączenie wygląda na awarię, nie na sukces. Zamknięte dwie dziury: odczyt plików wydawał klucze i .env, a terminal omijał sanitizer komend. Doszły trzy własne skille: Puls Katedry (diagnoza węzła jednym strzałem), Biblioteka Dźwięku i Sumienie Katedry — skaner szukający w kodzie miejsc, które udają działanie.',
  },
  {
    date: '2026-08-18',
    ref: '85649d5',
    sector: 'core',
    title: 'TeO Music V2 gra naprawdę — pierwszy utwór w 28 sekund',
    desc: 'Muzyczny człon Katedry liczy realnie, lokalnie, na jednej karcie 6 GB. Poprzedni silnik był atrapą: pętla wypisywała fałszywe kroki dyfuzji i podstawiała gotowy plik z biblioteki. Wycięte. W zamian: suwerenny katalog wag poza repo, pobieranie z wznawianiem po zerwaniu (zweryfikowane — plik wznowiony ma identyczny hash), i dwie rodziny modeli. MiniMax-Music-3 zmierzono na tym sprzęcie: 6 godzin 50 minut na minutę muzyki. ACE-Step 1.5 turbo robi to samo w ośmiu krokach — 10 sekund dźwięku w 28 sekund liczenia, z obsługą polskich tekstów. Wagi rodzin się nie mieszają i most tego pilnuje.',
  },
  {
    date: '2026-08-18',
    ref: '83993f7',
    sector: 'distro',
    title: 'Teleport na Music V2 budzi silnik sam',
    desc: 'Wejście do studia muzycznego uruchamia ComfyUI w tle, jeśli nie działa. Hak siedzi po stronie mostu, więc łapie każdą drogę wejścia — kafel w Projektach, dashboard, zakładkę w przeglądarce, telefon przez Kwantowy Tunel. Strona ładuje się natychmiast, silnik dochodzi po kilkunastu sekundach. Kilka wejść pod rząd nie odpala kilku instancji.',
  },
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
