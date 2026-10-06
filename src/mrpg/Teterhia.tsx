/**
 * 🌍 Teterhia — MRPG, wspólny świat Katedr (2026-10-06).
 *
 * Suweren: „na stronie otakos.wtf moduł podobny do strumienia Katedr, co jest w prawo… to w lewo będzie MRPG… budowa
 * wspólnego świata Katedr w grze”. Lustro modułu Katedry: tam przesunięcie w LEWO otwiera wizytówki, tu przesunięcie
 * w PRAWO (albo zakładka „‹ Teterhia” przy lewej krawędzi) otwiera wspólną mapę. Adres: #teterhia, #teterhia/<nick>.
 *
 * PRAWDA, NIE ATRAPA: krainy to Katedry ONLINE z rejestru tej domeny (/api/katedry) — ta sama lista co w strumieniu
 * wizytówek. Żywioł krainy liczy się z nicka (ten sam hash i te same żywioły co gra TGS), miejsce na mapie — ze spirali
 * w kolejności nicków, więc mapa jest stała. Graczy, rajdów i wymiany jeszcze NIE MA — strona mówi to wprost.
 * Saga: „Teterhia — Wieczna Saga” (Katedra → Game Studio → Reżyser i GDD).
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { katedryOnline, type KatedraOnline } from '../katedry/wizytowka';

/** Ten sam hash co w grze TGS (src/gra/rdzen.ts, FNV-1a 32-bit). */
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}

/** Żywioły z gry TGS (src/gra/postac.ts) — barwa i charakter krainy. */
const ZYWIOLY = [
  { id: 'ogien', pl: 'Ogień', en: 'Fire', hue: 12, opis: { pl: 'ostre grzbiety i żar', en: 'sharp ridges and embers' } },
  { id: 'woda', pl: 'Woda', en: 'Water', hue: 200, opis: { pl: 'strumienie i zatoki', en: 'streams and bays' } },
  { id: 'ziemia', pl: 'Ziemia', en: 'Earth', hue: 96, opis: { pl: 'gęste gaje i płaskowyże', en: 'dense groves and plateaus' } },
  { id: 'powietrze', pl: 'Powietrze', en: 'Air', hue: 168, opis: { pl: 'rozległe równiny, dużo nieba', en: 'open plains, wide sky' } },
  { id: 'eter', pl: 'Eter', en: 'Ether', hue: 280, opis: { pl: 'świat „pomiędzy”, bogaty w sekrety', en: 'the world “between”, rich in secrets' } },
] as const;

export interface Kraina { k: KatedraOnline; zywiol: (typeof ZYWIOLY)[number]; x: number; y: number; r: number }

/** Mapa: spirala złotego kąta w kolejności nicków (stała dla tej samej listy), środek = (0,0). Czysta — testowalna. */
export function ulozKrainy(lista: KatedraOnline[]): Kraina[] {
  const kat = Math.PI * (3 - Math.sqrt(5));
  return [...lista].sort((a, b) => a.nick.localeCompare(b.nick)).map((k, i) => {
    const h = hash(k.nick);
    const promien = i === 0 ? 0 : 36 * Math.sqrt(i);   // Vogel: odstęp ≈ 36·√π/2 > dwa największe promienie (2 × 15 × 1,18)
    return { k, zywiol: ZYWIOLY[h % ZYWIOLY.length], x: Math.cos(i * kat) * promien, y: Math.sin(i * kat) * promien, r: 11 + (h % 5) };
  });
}

/** Wyspa krainy: nieregularny wielokąt z hasha nicka (ten sam nick = ten sam kształt). */
function ksztalt(kr: Kraina): string {
  const h = hash(kr.k.nick + '#brzeg');
  const n = 9;
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const r = kr.r * (0.78 + (((h >>> (i * 3)) & 7) / 7) * 0.4);
    return `${(kr.x + Math.cos(a) * r).toFixed(1)},${(kr.y + Math.sin(a) * r).toFixed(1)}`;
  }).join(' ');
}

/** Jeden gest = jedna zmiana: zamknięcie panelu (Teterhia albo Katedry) blokuje otwarcie drugiego tym samym ruchem palca. */
export const oznaczGest = () => { (window as unknown as { __otakosGest?: number }).__otakosGest = Date.now(); };
export const gestSwiezy = () => Date.now() - ((window as unknown as { __otakosGest?: number }).__otakosGest ?? 0) < 400;

const czyTeterhia = () => /^#teterhia(\/|$)/.test(window.location.hash);
const nickZHasha = () => window.location.hash.match(/^#teterhia\/([a-z0-9-]{3,32})$/)?.[1] ?? null;

export const Teterhia: React.FC<{ lang?: 'pl' | 'en' }> = ({ lang = 'pl' }) => {
  const pl = lang === 'pl';
  const [otwarte, setOtwarte] = useState(czyTeterhia);
  const [lista, setLista] = useState<KatedraOnline[] | null | 'laduje'>('laduje');
  const [wybrana, setWybrana] = useState<string | null>(nickZHasha);

  useEffect(() => {
    const zmiana = () => { setOtwarte(czyTeterhia()); setWybrana(nickZHasha()); };
    window.addEventListener('hashchange', zmiana);
    return () => window.removeEventListener('hashchange', zmiana);
  }, []);
  useEffect(() => {
    if (!otwarte) return;
    let zyje = true;
    const pobierz = () => katedryOnline().then((l) => { if (zyje) setLista(l); });
    void pobierz();
    const t = setInterval(pobierz, 60_000);
    const stary = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') zamknij(); };
    window.addEventListener('keydown', esc);
    return () => { zyje = false; clearInterval(t); document.body.style.overflow = stary; window.removeEventListener('keydown', esc); };
  }, [otwarte]);

  const otworz = useCallback(() => { if (!czyTeterhia()) window.location.hash = 'teterhia'; }, []);
  const zamknij = useCallback(() => { history.pushState(null, '', window.location.pathname + window.location.search); setOtwarte(false); }, []);

  // Gest strony: przesunięcie palcem w PRAWO otwiera Teterhię (w lewo — Katedry). W otwartej: w lewo wraca.
  useEffect(() => {
    let x0 = 0, y0 = 0, aktywny = false;
    const start = (e: TouchEvent) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; aktywny = true; };
    const koniec = (e: TouchEvent) => {
      if (!aktywny) return; aktywny = false;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) <= 90 || Math.abs(dy) >= 60) return;
      if (!otwarte && dx > 0 && !/^#katedry/.test(window.location.hash) && !gestSwiezy()) { oznaczGest(); otworz(); }
      else if (otwarte && dx < 0) { oznaczGest(); zamknij(); }
    };
    document.addEventListener('touchstart', start, { passive: true });
    document.addEventListener('touchend', koniec, { passive: true });
    return () => { document.removeEventListener('touchstart', start); document.removeEventListener('touchend', koniec); };
  }, [otwarte, otworz, zamknij]);

  const krainy = useMemo(() => (Array.isArray(lista) ? ulozKrainy(lista) : []), [lista]);
  const zasieg = Math.max(60, ...krainy.map((k) => Math.hypot(k.x, k.y) + k.r + 14));
  const biezaca = krainy.find((k) => k.k.nick === wybrana) ?? null;
  const wybierz = (nick: string | null) => { setWybrana(nick); history.replaceState(null, '', nick ? `#teterhia/${nick}` : '#teterhia'); };

  if (!otwarte) {
    return (
      <button onClick={otworz} title={pl ? 'Teterhia — wspólny świat Katedr (MRPG)' : 'Teterhia — shared world of Cathedrals (MRPG)'}
        className="fixed left-0 top-1/2 z-[60] -translate-y-1/2 rounded-r-xl border border-l-0 border-emerald-400/40 bg-[#06140f]/90 px-1.5 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-200 shadow-lg shadow-emerald-900/30 hover:bg-emerald-900/40 [writing-mode:vertical-rl] rotate-180">
        {pl ? 'Teterhia ›' : 'Teterhia ›'}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-[#040807] text-slate-200">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2 font-mono text-[11px]">
        <span className="hidden w-24 sm:block" />
        <div className="mx-auto text-center">
          <span className="text-emerald-200">🌍 Teterhia</span> <span className="text-slate-500">— {pl ? 'wspólny świat Katedr · MRPG' : 'shared world of Cathedrals · MRPG'}</span>
        </div>
        <button onClick={zamknij} className="shrink-0 text-right text-slate-400 hover:text-white sm:w-24">otakos.wtf →</button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="relative min-h-[45vh] flex-1">
          {lista === 'laduje' && <p className="pt-24 text-center text-sm text-slate-500">{pl ? 'Pytam rejestr, które Katedry są online…' : 'Asking the registry which Cathedrals are online…'}</p>}
          {lista === null && <p className="mx-auto max-w-md px-6 pt-24 text-center text-sm text-slate-400">{pl ? 'Rejestr Katedr jest teraz nieosiągalny — mapy nie zbuduję z niczego. Spróbuj za chwilę.' : 'The Cathedral registry is unreachable — no map without data. Try again shortly.'}</p>}
          {Array.isArray(lista) && !lista.length && <p className="mx-auto max-w-md px-6 pt-24 text-center text-sm text-slate-400">{pl ? 'Żadna Katedra nie jest teraz online, więc Teterhia jest pusta. Pierwsza kraina może być Twoja.' : 'No Cathedral is online right now, so Teterhia is empty. The first land could be yours.'}</p>}
          {krainy.length > 0 && (
            <svg viewBox={`${-zasieg} ${-zasieg} ${zasieg * 2} ${zasieg * 2}`} className="absolute inset-0 h-full w-full" role="img" aria-label={pl ? 'Mapa krain Teterhii' : 'Map of Teterhia lands'}>
              <defs>
                <radialGradient id="morze" cx="50%" cy="50%" r="60%"><stop offset="0%" stopColor="#0b2a2a" /><stop offset="100%" stopColor="#040807" /></radialGradient>
              </defs>
              <circle cx={0} cy={0} r={zasieg} fill="url(#morze)" />
              {krainy.map((kr) => {
                const zazn = kr.k.nick === wybrana;
                return (
                  <g key={kr.k.nick} onClick={() => wybierz(zazn ? null : kr.k.nick)} className="cursor-pointer">
                    <polygon points={ksztalt(kr)} fill={`hsl(${kr.zywiol.hue} 55% ${zazn ? 42 : 30}%)`} stroke={`hsl(${kr.zywiol.hue} 80% ${zazn ? 75 : 55}%)`} strokeWidth={zazn ? 1.4 : 0.6} />
                    <circle cx={kr.x} cy={kr.y} r={1.6} fill="#fef3c7" />
                    <text x={kr.x} y={kr.y + kr.r + 6} textAnchor="middle" fontSize={5} fontFamily="monospace" fill={zazn ? '#ecfdf5' : '#a7f3d0'}>{kr.k.nick}</text>
                    {kr.k.moc && <text x={kr.x + kr.r * 0.7} y={kr.y - kr.r * 0.6} fontSize={6}>⚡</text>}
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        <aside className="max-h-[50vh] w-full space-y-3 overflow-y-auto border-t border-white/10 p-4 text-sm lg:max-h-none lg:w-[360px] lg:border-l lg:border-t-0">
          {biezaca ? (
            <div className="space-y-2 rounded-xl border border-emerald-400/30 bg-emerald-950/20 p-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-300/70">{pl ? 'kraina' : 'land'}</p>
              <h3 className="font-mono text-2xl font-black text-white">{biezaca.k.nick}</h3>
              {biezaca.k.motto && <p className="text-xs italic text-amber-200/90">„{biezaca.k.motto}”</p>}
              <p className="text-xs text-slate-300">{pl ? 'Żywioł' : 'Element'}: <b style={{ color: `hsl(${biezaca.zywiol.hue} 80% 70%)` }}>{pl ? biezaca.zywiol.pl : biezaca.zywiol.en}</b> — {pl ? biezaca.zywiol.opis.pl : biezaca.zywiol.opis.en}</p>
              {biezaca.k.moc && <p className="text-xs text-slate-300">⚡ {pl ? 'Kuźnia mocy' : 'Power forge'}: {biezaca.k.moc.vramGB} GB VRAM · {biezaca.k.moc.modele.slice(0, 3).join(', ')}</p>}
              <a href={`#katedry/${biezaca.k.nick}`} className="inline-block rounded-lg border border-fuchsia-400/40 px-3 py-1 text-xs text-fuchsia-200 hover:bg-fuchsia-900/30">{pl ? 'Odwiedź wizytówkę Katedry →' : 'Visit the Cathedral card →'}</a>
            </div>
          ) : (
            <p className="text-xs text-slate-400">{pl ? 'Kliknij krainę na mapie. Każda kraina to Katedra online w rejestrze otakos.wtf, a jej żywioł wynika z nicka.' : 'Click a land on the map. Each land is a Cathedral online in the otakos.wtf registry; its element comes from the nick.'}</p>
          )}
          {Array.isArray(lista) && <p className="font-mono text-[10px] text-slate-500">{pl ? `krain online: ${lista.length}` : `lands online: ${lista.length}`}</p>}

          <div className="space-y-1 rounded-xl border border-white/10 p-3 text-xs text-slate-300">
            <p className="font-semibold text-emerald-200">{pl ? 'Teterhia — Wieczna Saga' : 'Teterhia — Eternal Saga'}</p>
            <p>{pl ? 'Świat, który nie istnieje, dopóki go nie wyśpiewasz. Gracz przechodzi przez Bramę „To Get Sauce”, szuka Sosu rozbitego na Siedem Nut, a autentyczne wybory nasycają świat barwą.' : 'A world that does not exist until you sing it. The player passes the “To Get Sauce” Gate and seeks the Sauce, shattered into Seven Notes; authentic choices fill the world with colour.'}</p>
          </div>
          <div className="space-y-1 rounded-xl border border-white/10 p-3 text-xs">
            <p className="font-semibold text-slate-200">{pl ? 'Gdzie jesteśmy — uczciwie' : 'Where we are — honestly'}</p>
            <p className="text-emerald-300">✓ {pl ? 'Gra dla jednego gracza rośnie w Katedrze: TeO Games Studio (Reżyser → Dyrygent → Obrazy → 3D → Ruch → Krajobrazy → Kodeks).' : 'The single-player game grows in the Cathedral: TeO Games Studio (Director → Conductor → Images → 3D → Motion → Landscapes → Codex).'}</p>
            <p className="text-emerald-300">✓ {pl ? 'Wspólna mapa: krainy to prawdziwe Katedry online.' : 'Shared map: lands are real Cathedrals online.'}</p>
            <p className="text-amber-300">… {pl ? 'Wspólna rozgrywka (wędrówka między krainami, rajdy na Zgrzyt, wymiana) — jeszcze nie ma.' : 'Shared play (travel between lands, raids on the Grind, trade) — not yet.'}</p>
          </div>
          <div className="space-y-1 rounded-xl border border-white/10 p-3 text-xs text-slate-400">
            <p className="font-semibold text-slate-200">{pl ? 'Jak dodać swoją krainę' : 'How to add your land'}</p>
            <p>{pl ? 'Katedra OtakOS → Kwantowy Tunel → meldunek w karcie Wystawy → zatwierdzenie przez Stół zarządcy rejestru. Twoja Katedra pojawi się wtedy na mapie, gdy będzie online.' : 'OtakOS Cathedral → Quantum Tunnel → check-in in the Wystawa card → approval by the registry steward’s Table. Your Cathedral appears on the map whenever it is online.'}</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Teterhia;
