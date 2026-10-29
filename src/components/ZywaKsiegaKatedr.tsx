/**
 * 📖 Żywa Księga (2026-10-29) — poranne Iskry Suwerenów Katedr online: ich słowa, nagranie twarzy, odpowiedź stada
 * (Kronikarz) i ilustracja (Paleta, FLUX). Strona NIE trzyma wpisów: czyta je prosto z tunelu Katedry
 * (`<adres>/wizytowka/ksiega`, tylko wpisy oznaczone „dla świata”) — gdy Katedra śpi, jej Księgi nie ma.
 * Słowa zostają w języku Suwerena (nie tłumaczymy ich). Żywa kreska: jedna klatka drga sama, kilka gra po kolei.
 */
import React, { useEffect, useRef, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { katedryOnline } from '../katedry/wizytowka';

const TEKST = {
    pl: {
        tytul: 'Żywa Księga', wstep: 'Poranne Iskry Suwerenów — kilka słów z przepływu, czasem nagranie znad stołu, a stado TeOgochi dopisuje odpowiedź i maluje obraz.',
        brak: 'Rejestr Katedr nie odpowiada — nie pokażę wpisów, których nie znam.', pusto: 'Żadna Katedra online nie wystawia teraz wpisów Żywej Księgi.',
        kronikarz: '📜 Kronikarz stada', paleta: '🎨 Paleta', rysunek: '✒️ żywa kreska', wiecej: 'starsze wpisy', mniej: 'zwiń',
        uczciwie: 'Wpisy czytamy prosto z Katedr (ich tunel) — strona niczego nie przechowuje. Odpowiedź i obraz tworzy lokalnie stado TeOgochi tej Katedry; słowa Suwerena są w jego języku.',
    },
    en: {
        tytul: 'Living Book', wstep: 'Morning Sparks of the Sovereigns — a few words from the flow, sometimes a recording from the table, and the TeOgochi herd writes a reply and paints a picture.',
        brak: 'The Cathedral registry is not responding — no made-up entries here.', pusto: 'No Cathedral online publishes Living Book entries right now.',
        kronikarz: '📜 Herd Chronicler', paleta: '🎨 Palette', rysunek: '✒️ living line', wiecej: 'older entries', mniej: 'collapse',
        uczciwie: 'Entries are read directly from the Cathedrals (their tunnel) — this site stores nothing. The reply and picture are made locally by that Cathedral’s TeOgochi herd; the Sovereign’s words stay in their own language.',
    },
};

type Kreska = { kolor: string; grubosc: number; punkty: [number, number][] };
interface WpisKsiegi {
    id: string; kiedy: string; tekst: string; nick: string; adres: string;
    slowo: { tekst: string } | null; zdjecie: { url: string } | null; ilustracja: { url: string } | null; nagranie: { url: string } | null;
    rysunki: { id: string; tytul: string | null; klatki: Kreska[][] }[];
}

const KOLOR = /^#[0-9a-f]{6}$/i;
const sciezka = (x: unknown) => (typeof x === 'string' && /^\/wizytowka\/ksiega\/k-\d{8}-[0-9a-f]{6}\/(zdjecie\.jpg|ilustracja\.png|nagranie\.mp4)(\?v=[\w%.:-]*)?$/.test(x) ? x : null);
/** Wpis z cudzej Katedry — tylko pola, które znamy, adresy plików tylko z jej własnego tunelu. */
function oczyscWpis(x: any, nick: string, adres: string): WpisKsiegi | null {
    if (!x || typeof x.id !== 'string' || !/^k-\d{8}-[0-9a-f]{6}$/.test(x.id) || typeof x.tekst !== 'string' || !x.tekst.trim()) return null;
    const il = sciezka(x.ilustracja?.url), fot = sciezka(x.zdjecie?.url), nag = sciezka(x.nagranie?.url);
    return {
        id: x.id, nick, adres, kiedy: typeof x.kiedy === 'string' ? x.kiedy : '', tekst: x.tekst.slice(0, 4000),
        slowo: typeof x.slowo?.tekst === 'string' ? { tekst: x.slowo.tekst.slice(0, 900) } : null,
        zdjecie: fot ? { url: `${adres}${fot}` } : null,
        ilustracja: il ? { url: `${adres}${il}` } : null, nagranie: nag ? { url: `${adres}${nag}` } : null,
        rysunki: (Array.isArray(x.rysunki) ? x.rysunki : []).slice(0, 6).map((r: any) => ({
            id: String(r?.id ?? ''), tytul: typeof r?.tytul === 'string' ? r.tytul.slice(0, 80) : null,
            klatki: (Array.isArray(r?.klatki) ? r.klatki : []).slice(0, 3).map((k: any) => (Array.isArray(k) ? k : []).slice(0, 400).map((s: any) => ({
                kolor: KOLOR.test(String(s?.kolor)) ? s.kolor : '#2c1810', grubosc: Math.max(1, Math.min(20, Number(s?.grubosc) || 3)),
                punkty: (Array.isArray(s?.punkty) ? s.punkty : []).slice(0, 2000).filter((p: any) => Number.isFinite(p?.[0]) && Number.isFinite(p?.[1])),
            }))),
        })).filter((r: { klatki: Kreska[][] }) => r.klatki.some((k) => k.length)),
    };
}

function ZywaKreska({ klatki }: { klatki: Kreska[][] }) {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const c = ref.current; const ctx = c?.getContext('2d'); if (!c || !ctx) return;
        let id = 0, nr = 0, ost = 0;
        const krok = (t: number) => {
            if (t - ost > 140) {
                nr++; ost = t;
                const g = ctx.createRadialGradient(c.width / 2, c.height / 2, 10, c.width / 2, c.height / 2, c.width * 0.7);
                g.addColorStop(0, '#f8ecd4'); g.addColorStop(1, '#c4a168'); ctx.fillStyle = g; ctx.fillRect(0, 0, c.width, c.height);
                const drg = klatki.length === 1 ? (nr % 3) + 1 : 0;
                ctx.lineCap = 'round'; ctx.lineJoin = 'round';
                for (const k of klatki.length === 1 ? klatki[0] : klatki[nr % klatki.length]) {
                    ctx.beginPath(); ctx.strokeStyle = k.kolor; ctx.lineWidth = k.grubosc;
                    k.punkty.forEach(([x, y], i) => { const px = x * c.width + (drg ? Math.sin(i * 1.7 + drg * 2.3) * 1.6 : 0), py = y * c.height + (drg ? Math.cos(i * 2.1 + drg * 1.9) * 1.6 : 0); if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); });
                    ctx.stroke();
                }
            }
            id = requestAnimationFrame(krok);
        };
        id = requestAnimationFrame(krok);
        return () => cancelAnimationFrame(id);
    }, [klatki]);
    return <canvas ref={ref} width={480} height={240} className="block h-32 w-full" />;
}

export const ZywaKsiegaKatedr: React.FC<{ lang: 'pl' | 'en'; kawaii?: boolean }> = ({ lang, kawaii }) => {
    const t = TEKST[lang];
    const [wpisy, setWpisy] = useState<WpisKsiegi[] | null | undefined>(undefined);
    const [wszystkie, setWszystkie] = useState(false);
    useEffect(() => {
        let zyje = true;
        const pobierz = async () => {
            const lista = await katedryOnline();
            if (lista === null) { if (zyje) setWpisy(null); return; }
            const z = await Promise.all(lista.map(async (k) => {
                try {
                    const r = await fetch(`${k.adres}/wizytowka/ksiega`, { signal: AbortSignal.timeout(6000) });
                    const d = r.ok ? await r.json() : null;
                    return (Array.isArray(d?.wpisy) ? d.wpisy : []).slice(0, 30).map((w: unknown) => oczyscWpis(w, k.nick, k.adres)).filter(Boolean) as WpisKsiegi[];
                } catch { return []; }   // Katedra bez Księgi (starszy most) albo śpi — po prostu jej nie ma
            }));
            if (zyje) setWpisy(z.flat().sort((a, b) => b.kiedy.localeCompare(a.kiedy)));
        };
        void pobierz();
        const i = setInterval(pobierz, 120_000);
        return () => { zyje = false; clearInterval(i); };
    }, []);
    const akcent = kawaii ? 'text-pink-400' : 'text-amber-300';
    const widoczne = (wpisy ?? []).slice(0, wszystkie ? 30 : 3);
    const data = (k: string) => { try { return new Date(k).toLocaleString(lang === 'pl' ? 'pl-PL' : 'en-GB', { dateStyle: 'long', timeStyle: 'short' }); } catch { return k; } };

    return (
        <div className="w-full mt-6 p-6 bg-[#040407] border border-zinc-800/80 rounded-xl max-w-5xl text-left font-mono">
            <div className="flex items-center gap-2">
                <BookOpen className={`h-4 w-4 ${akcent}`} />
                <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-bold">📖 {t.tytul}</span>
                {wpisy && <span className="ml-auto text-[10px] text-zinc-500">{wpisy.length}</span>}
            </div>
            <p className="mt-2 text-[11px] text-zinc-400 font-sans">{t.wstep}</p>
            {wpisy === null && <p className="mt-3 text-[11px] text-amber-300/80 font-sans">{t.brak}</p>}
            {wpisy && wpisy.length === 0 && <p className="mt-3 text-[11px] text-zinc-500 font-sans">{t.pusto}</p>}
            <div className="mt-4 space-y-5">
                {widoczne.map((w) => (
                    <article key={`${w.nick}-${w.id}`} className="relative overflow-hidden rounded-xl border-4 border-[#3b2314] bg-[#1c120a] p-1">
                        <div className="rounded-lg bg-[#f3e4c4] p-4 text-[#2c1810] font-sans">
                            <div className="mb-2 text-[11px] text-[#7a5230]"><b>{w.nick}</b> · {data(w.kiedy)}</div>
                            {w.zdjecie && <img src={w.zdjecie.url} alt={w.nick} loading="lazy" className="float-right mb-2 ml-3 max-h-56 w-auto max-w-[45%] rounded-lg border-2 border-[#5c3a21] object-cover shadow-md" />}
                            <p className="whitespace-pre-wrap font-serif text-base leading-relaxed">{w.tekst}</p>
                            <div className="clear-both" />
                            {w.nagranie && <video src={w.nagranie.url} controls preload="metadata" className="mt-3 max-h-80 w-full rounded-lg border-2 border-[#5c3a21] bg-black" />}
                            {(w.slowo || w.ilustracja) && <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                {w.slowo && <div className="rounded-lg border border-[#c4a168] bg-[#efdcb4] p-3 text-sm">
                                    <div className="mb-1 text-[11px] font-bold text-[#7a5230]">{t.kronikarz}</div>
                                    <p className="font-serif italic">{w.slowo.tekst}</p>
                                </div>}
                                {w.ilustracja && <div className="overflow-hidden rounded-lg border border-[#c4a168] bg-[#efdcb4]">
                                    <div className="px-3 pt-2 text-[11px] font-bold text-[#7a5230]">{t.paleta}</div>
                                    <img src={w.ilustracja.url} alt="" loading="lazy" className="mt-1 w-full" />
                                </div>}
                            </div>}
                            {w.rysunki.length > 0 && <div className="mt-3 grid gap-2 sm:grid-cols-2">{w.rysunki.map((r) => (
                                <figure key={r.id} className="overflow-hidden rounded-lg border-2 border-[#5c3a21]"><ZywaKreska klatki={r.klatki} /><figcaption className="bg-[#2a1a0e] px-2 py-1 text-[10px] text-amber-200">{t.rysunek}{r.tytul ? ` · ${r.tytul}` : ''}</figcaption></figure>
                            ))}</div>}
                        </div>
                    </article>
                ))}
            </div>
            {(wpisy?.length ?? 0) > 3 && <button onClick={() => setWszystkie(!wszystkie)} className={`mt-3 text-[11px] ${akcent} hover:underline font-sans`}>{wszystkie ? t.mniej : `${t.wiecej} (${wpisy!.length - 3})`}</button>}
            <p className="mt-3 text-[10px] text-zinc-600 font-sans">{t.uczciwie}</p>
        </div>
    );
};
