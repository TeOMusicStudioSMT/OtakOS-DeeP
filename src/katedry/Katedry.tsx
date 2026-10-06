/**
 * 🧭 Katedry — przewijanie wizytówek na otakos.wtf (2026-10-02).
 *
 * Suweren: „na otakos.wtf, jak przesuniesz w prawo, wyświetla się twoja wersja teo.center…
 * otakos.wtf → teo.center-twój → każdy inny dostępny w sieci (jak scroll shortów), tylko nicki
 * katedr… wszystko suwerennie, na tej jednej domenie".
 *
 *   · otakos.wtf ── przesuń w lewo (albo zakładka „Katedry ›" przy prawej krawędzi) ──▶
 *   · panel 1 „Twoja": wizytówka Katedry z TEJ maszyny (most 127.0.0.1) — albo jak ją założyć,
 *   · panel 2 „Sieć": Katedry online z rejestru (/api/katedry), jedna pod drugą jak shorty;
 *     wizytówka ładuje się z tunelu danej Katedry dopiero, gdy jej karta jest na ekranie.
 * Adres: #katedry, #katedry/<nick>. Przesunięcie w prawo na pierwszym panelu albo Esc wraca.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import KartaKatedry from './KartaKatedry';
import { gestSwiezy, oznaczGest } from '../mrpg/Teterhia';
import { katedryOnline, stanKatedry, twojaWizytowka, wizytowkaZ, type KatedraOnline, type StanKatedry, type Wizytowka } from './wizytowka';

const czyKatedry = () => /^#katedry([/?]|$)/.test(window.location.hash);
const nickZHasha = () => window.location.hash.match(/^#katedry\/([a-z0-9-]{3,32})$/)?.[1] ?? null;

/** „Moja Katedra" na urządzeniu bez Katedry (telefon): nick zapamiętany w przeglądarce.
 *  Ustawia go „⭐ To moja" na karcie albo link ze StoL: otakos.wtf/#katedry?moja=<nick>. */
const KLUCZ_MOJEJ = 'otakos_moja_katedra';
const NICK = /^[a-z0-9][a-z0-9-]{2,31}$/;
function mojaKatedra(): string | null { try { const n = localStorage.getItem(KLUCZ_MOJEJ); return n && NICK.test(n) ? n : null; } catch { return null; } }
function ustawMoja(n: string | null) { try { n ? localStorage.setItem(KLUCZ_MOJEJ, n) : localStorage.removeItem(KLUCZ_MOJEJ); } catch { /* tryb prywatny */ } }
function mojaZHasha() { const n = window.location.hash.match(/^#katedry\?moja=([a-z0-9-]{3,32})$/)?.[1]; if (n && NICK.test(n)) ustawMoja(n); }

/** Gest: poziomy ruch palca (dx) wyraźnie większy niż pionowy. */
function useGestPoziomy(cel: React.RefObject<HTMLElement | null> | null, onGest: (dx: number) => void) {
  useEffect(() => {
    const el: HTMLElement | Document = cel?.current ?? document;
    let x0 = 0, y0 = 0, aktywny = false;
    const start = (e: Event) => { const t = (e as TouchEvent).touches[0]; x0 = t.clientX; y0 = t.clientY; aktywny = true; };
    const koniec = (e: Event) => {
      if (!aktywny) return; aktywny = false;
      const t = (e as TouchEvent).changedTouches[0];
      const dx = t.clientX - x0, dy = t.clientY - y0;
      if (Math.abs(dx) > 90 && Math.abs(dy) < 60) onGest(dx);
    };
    el.addEventListener('touchstart', start, { passive: true });
    el.addEventListener('touchend', koniec, { passive: true });
    return () => { el.removeEventListener('touchstart', start); el.removeEventListener('touchend', koniec); };
  }, [cel, onGest]);
}

const TwojaPanel: React.FC<{ pl: boolean }> = ({ pl }) => {
  const [w, setW] = useState<Wizytowka | null | 'brak-nicka' | 'laduje'>('laduje');
  const [offline, setOffline] = useState<string | null>(null);
  const [powod, setPowod] = useState<StanKatedry | null | 'brak-wizytowki'>(null);
  useEffect(() => {
    void (async () => {
      const lokalna = await twojaWizytowka();
      if (lokalna) return setW(lokalna);
      // Telefon / inny komputer: Katedry obok nie ma — bierzemy zapamiętaną z sieci.
      const moja = mojaKatedra();
      if (moja) {
        const k = (await katedryOnline())?.find((x) => x.nick === moja);
        const z = k ? await wizytowkaZ(k.adres).catch(() => null) : null;
        if (z) return setW(z);
        setOffline(moja);
        // Na liście jest, a wizytówka nie przyszła = rejestr ją widzi, tylko tunel nie odpowiada tej przeglądarce.
        setPowod(k ? 'brak-wizytowki' : await stanKatedry(moja));
      }
      setW(lokalna);
    })();
  }, []);
  if (w === 'laduje') return <p className="pt-24 text-center text-sm text-slate-500">{pl ? 'Szukam Twojej Katedry…' : 'Looking for your Cathedral…'}</p>;
  if (w && w !== 'brak-nicka') return <KartaKatedry w={w} pl={pl} twoja />;
  if (offline) return (
    <div className="mx-auto max-w-xl px-6 pt-20 text-center">
      <div className="text-[10px] uppercase tracking-[0.35em] text-fuchsia-300/70">{pl ? '∴ Twoja Katedra ∴' : '∴ Your Cathedral ∴'}</div>
      <h2 className="mt-2 font-mono text-4xl font-black text-white">{offline}</h2>
      <p className="mt-4 text-sm text-slate-400">{pl ? 'Jest teraz offline — wizytówka wróci, gdy Katedra włączy tunel i meldunek.' : 'It is offline right now — the card returns once the Cathedral enables its tunnel and check-in.'}</p>
      <p className="mt-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-[11px] leading-relaxed text-slate-300">
        {powod === 'brak-wizytowki'
          ? (pl ? 'Rejestr widzi ją online, ale jej tunel nie oddał wizytówki tej przeglądarce. Spróbuj za chwilę.' : 'The registry sees it online, but its tunnel did not return the card to this browser. Try again shortly.')
          : powod?.meldunek
            ? <>{pl ? 'Ostatni meldunek' : 'Last check-in'} ({new Date(powod.meldunek.kiedy).toLocaleTimeString(pl ? 'pl-PL' : 'en-GB')}): {powod.meldunek.ok ? '✓' : '⚠'} {powod.meldunek.wiadomosc}</>
            : powod
              ? (pl ? 'Rejestr nie dostał od niej meldunku od swojego ostatniego startu. W Katedrze: Kwantowy Tunel włączony + 🪪 „Melduj w sieci” — panel 🪪 pokazuje, co odpowiada rejestr.' : 'The registry has had no check-in from it since its last start. In the Cathedral: Quantum Tunnel on + 🪪 “check in” — the 🪪 panel shows the registry reply.')
              : (pl ? 'Rejestr Katedr jest teraz nieosiągalny.' : 'The Cathedral registry is unreachable right now.')}
      </p>
      <button onClick={() => { ustawMoja(null); setOffline(null); }} className="mt-6 text-[11px] text-slate-500 underline">{pl ? 'to nie moja Katedra' : 'not my Cathedral'}</button>
    </div>
  );
  return (
    <div className="mx-auto max-w-xl px-6 pt-20 text-center">
      <div className="text-[10px] uppercase tracking-[0.35em] text-fuchsia-300/70">{pl ? '∴ Twoja Katedra ∴' : '∴ Your Cathedral ∴'}</div>
      {w === 'brak-nicka' ? (
        <p className="mt-4 text-sm leading-relaxed text-slate-300">{pl
          ? 'Twoja Katedra działa, ale nie ma jeszcze wizytówki. W Katedrze: Dashboard → „Wystawa teo.center” → 🪪 Wizytówka — wpisz nick i motto.'
          : 'Your Cathedral is running but has no card yet. In the Cathedral: Dashboard → “Wystawa teo.center” → 🪪 Wizytówka — set a nick and motto.'}</p>
      ) : (
        <>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">{pl
            ? 'Nie widzę Katedry na tej maszynie. Twoja wizytówka pokaże się tu, gdy Katedra będzie działać obok przeglądarki — a w sieci, gdy włączysz Kwantowy Tunel i meldunek.'
            : 'No Cathedral found on this machine. Your card appears here when a Cathedral runs next to this browser — and in the network once you enable the Quantum Tunnel and check-in.'}</p>
          <a href="#" onClick={(e) => { e.preventDefault(); history.replaceState(null, '', window.location.pathname); window.dispatchEvent(new HashChangeEvent('hashchange')); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="mt-6 inline-block rounded-lg border border-emerald-400/50 px-4 py-2 font-mono text-xs font-bold text-emerald-300 hover:bg-emerald-400/10">{pl ? '⬇ Pobierz Katedrę na otakos.wtf' : '⬇ Download the Cathedral on otakos.wtf'}</a>
        </>
      )}
      <p className="mt-10 text-[11px] text-slate-600">{pl ? 'Przesuń dalej → Katedry w sieci' : 'Swipe on → Cathedrals online'}</p>
    </div>
  );
};

const KartaSieci: React.FC<{ k: KatedraOnline; pl: boolean; aktywna: boolean }> = ({ k, pl, aktywna }) => {
  const [w, setW] = useState<Wizytowka | null | 'laduje' | 'blad'>(null);
  useEffect(() => {
    if (!aktywna || w) return;
    setW('laduje');
    wizytowkaZ(k.adres).then((x) => setW(x ?? 'blad')).catch(() => setW('blad'));
  }, [aktywna, w, k.adres]);
  const [moja, setMoja] = useState(() => mojaKatedra() === k.nick);
  return (
    <section data-nick={k.nick} className="relative min-h-full snap-start border-b border-white/5">
      <button onClick={() => { ustawMoja(moja ? null : k.nick); setMoja(!moja); }}
        className={`absolute right-3 top-3 z-10 rounded-full border px-2.5 py-0.5 font-mono text-[10px] ${moja ? 'border-amber-300/60 bg-amber-400/20 text-amber-100' : 'border-white/15 text-slate-500 hover:text-slate-200'}`}>
        {moja ? (pl ? '⭐ moja' : '⭐ mine') : (pl ? '☆ to moja' : '☆ this is mine')}
      </button>
      {w && w !== 'laduje' && w !== 'blad' ? <KartaKatedry w={w} pl={pl} /> : (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
          <div className="text-[10px] uppercase tracking-[0.35em] text-fuchsia-300/70">∴ Katedra ∴</div>
          <h2 className="mt-2 font-mono text-4xl font-black text-white sm:text-5xl">{k.nick}</h2>
          {k.motto && <p className="mt-2 text-sm italic text-amber-200/90">„{k.motto}”</p>}
          <p className="mt-6 text-[11px] text-slate-500">{w === 'blad' ? (pl ? 'Katedra właśnie zniknęła z sieci albo jej tunel nie odpowiada.' : 'This Cathedral just went offline or its tunnel is not responding.') : (pl ? 'Otwieram wizytówkę…' : 'Opening the card…')}</p>
        </div>
      )}
    </section>
  );
};

const SiecPanel: React.FC<{ pl: boolean; cel: string | null }> = ({ pl, cel }) => {
  const [lista, setLista] = useState<KatedraOnline[] | null | 'laduje'>('laduje');
  const [widoczne, setWidoczne] = useState<Set<string>>(new Set());
  const pojemnik = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let zyje = true;
    const pobierz = () => katedryOnline().then((l) => { if (zyje) setLista(l); });
    void pobierz();
    const t = setInterval(pobierz, 60_000);
    return () => { zyje = false; clearInterval(t); };
  }, []);

  useEffect(() => {
    const el = pojemnik.current;
    if (!el || !Array.isArray(lista)) return;
    const obs = new IntersectionObserver((wpisy) => {
      setWidoczne((s) => { const n = new Set(s); for (const w of wpisy) if (w.isIntersecting) n.add((w.target as HTMLElement).dataset.nick!); return n; });
    }, { root: el, threshold: 0.15 });
    el.querySelectorAll('section[data-nick]').forEach((x) => obs.observe(x));
    if (cel) el.querySelector(`section[data-nick="${cel}"]`)?.scrollIntoView();
    return () => obs.disconnect();
  }, [lista, cel]);

  if (lista === 'laduje') return <p className="pt-24 text-center text-sm text-slate-500">{pl ? 'Pytam sieć, kto jest online…' : 'Asking the network who is online…'}</p>;
  if (lista === null) return <p className="mx-auto max-w-md px-6 pt-24 text-center text-sm text-slate-400">{pl ? 'Rejestr Katedr jest teraz nieosiągalny. Spróbuj za chwilę.' : 'The Cathedral registry is unreachable right now. Try again shortly.'}</p>;
  if (!lista.length) return <p className="mx-auto max-w-md px-6 pt-24 text-center text-sm text-slate-400">{pl ? 'Żadna Katedra nie jest teraz online. Twoja może być pierwsza: Kwantowy Tunel + meldunek w karcie Wystawy.' : 'No Cathedral is online right now. Yours could be the first: Quantum Tunnel + check-in in the Wystawa card.'}</p>;
  return (
    <div ref={pojemnik} className="h-full snap-y snap-proximity overflow-y-auto overscroll-contain">
      {lista.map((k) => <KartaSieci key={k.nick} k={k} pl={pl} aktywna={widoczne.has(k.nick)} />)}
    </div>
  );
};

export const Katedry: React.FC<{ lang?: 'pl' | 'en' }> = ({ lang = 'pl' }) => {
  const pl = lang === 'pl';
  const [otwarte, setOtwarte] = useState(() => { mojaZHasha(); return czyKatedry(); });
  const [cel, setCel] = useState(nickZHasha);
  const [panel, setPanel] = useState(0);
  const pozioma = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const zmiana = () => { mojaZHasha(); setOtwarte(czyKatedry()); setCel(nickZHasha()); };
    window.addEventListener('hashchange', zmiana);
    return () => window.removeEventListener('hashchange', zmiana);
  }, []);
  useEffect(() => {
    if (!otwarte) return;
    const stary = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') zamknij(); };
    window.addEventListener('keydown', esc);
    return () => { document.body.style.overflow = stary; window.removeEventListener('keydown', esc); };
  }, [otwarte]);
  useEffect(() => { if (otwarte && cel) idzDo(1); }, [otwarte, cel]);

  const otworz = useCallback(() => { if (!czyKatedry()) window.location.hash = 'katedry'; }, []);
  const zamknij = useCallback(() => { history.pushState(null, '', window.location.pathname + window.location.search); setOtwarte(false); }, []);
  const idzDo = (i: number) => { const el = pozioma.current; if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' }); };

  // Na stronie: przesunięcie palcem w lewo otwiera Katedry.
  const gestStrony = useCallback((dx: number) => { if (!otwarte && dx < 0 && !/^#teterhia/.test(window.location.hash) && !gestSwiezy()) { oznaczGest(); otworz(); } }, [otwarte, otworz]);
  useGestPoziomy(null, gestStrony);
  // W Katedrach: przesunięcie w prawo na pierwszym panelu wraca na stronę.
  const gestKatedr = useCallback((dx: number) => { if (dx > 0 && (pozioma.current?.scrollLeft ?? 0) < 8) { oznaczGest(); zamknij(); } }, [zamknij]);
  useGestPoziomy(pozioma, gestKatedr);

  if (!otwarte) {
    return (
      <button onClick={otworz} title={pl ? 'Katedry w sieci — wizytówki' : 'Cathedrals online — cards'}
        className="fixed right-0 top-1/2 z-[60] -translate-y-1/2 rounded-l-xl border border-r-0 border-fuchsia-400/40 bg-[#12081f]/90 px-1.5 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-fuchsia-200 shadow-lg shadow-fuchsia-900/30 hover:bg-fuchsia-900/40 [writing-mode:vertical-rl]">
        {pl ? 'Katedry ›' : 'Cathedrals ›'}
      </button>
    );
  }
  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-[#05040a] text-slate-200">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2 font-mono text-[11px]">
        <button onClick={zamknij} className="text-slate-400 hover:text-white">← otakos.wtf</button>
        <div className="mx-auto flex gap-1">
          {[pl ? 'Twoja' : 'Yours', pl ? 'Sieć' : 'Network'].map((n, i) => (
            <button key={n} onClick={() => idzDo(i)} className={`rounded-full px-3 py-0.5 ${panel === i ? 'bg-fuchsia-500/30 text-fuchsia-100' : 'text-slate-500 hover:text-slate-300'}`}>{n}</button>
          ))}
        </div>
        <span className="w-20" />
      </div>
      <div ref={pozioma} onScroll={(e) => setPanel(Math.round(e.currentTarget.scrollLeft / Math.max(1, e.currentTarget.clientWidth)))}
        className="flex flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-contain [scrollbar-width:none]">
        <div className="h-full w-full shrink-0 snap-start overflow-y-auto"><TwojaPanel pl={pl} /></div>
        <div className="h-full w-full shrink-0 snap-start overflow-hidden"><SiecPanel pl={pl} cel={cel} /></div>
      </div>
    </div>
  );
};

export default Katedry;
