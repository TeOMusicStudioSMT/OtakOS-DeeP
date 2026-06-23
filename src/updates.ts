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
