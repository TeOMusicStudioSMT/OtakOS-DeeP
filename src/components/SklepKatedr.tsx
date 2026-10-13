/**
 * 💳🐾 Wsparcie i Sklep Mini (2026-10-13) — darowizny i pakiety Mini-TeOgochi z Katedr online (`sklep` w /api/katedry,
 * oczyszczone w server/rejestr.mjs `sklepZWizytowki`). Darowizna = link Stripe Katedry (buy.stripe.com). Zakup pakietu:
 * strona prosi MOST TEJ Katedry (`<adres>/wizytowka/sklep/<id>/kup`) o sesję płatności — cenę liczy Katedra, płaci się
 * na stronie Stripe, plik wydaje Katedra dopiero po opłacie. Strona nie widzi kart ani kluczy.
 */
import React, { useEffect, useState } from 'react';
import { HeartHandshake } from 'lucide-react';
import { katedryOnline, type KatedraOnline, type PakietMini, type Rzadkosc } from '../katedry/wizytowka';

const TEKST = {
    pl: {
        tytul: 'Wsparcie i Sklep Mini',
        wstep: 'Mini-TeOgochi z Katedr: bryła z teksturami i szkieletem, ruchy i akcje, plus trzy propozycje wariantów do wytworzenia w Twojej Katedrze.',
        brak: 'Rejestr Katedr nie odpowiada — nie pokażę sklepu, którego nie znam.',
        pusto: 'Żadna Katedra online nie przyjmuje teraz darowizn ani nie wystawia Mini.',
        wesprzyj: 'Wesprzyj',
        kup: 'Kup',
        laczy: 'łączę z Katedrą…',
        test: 'TRYB TESTOWY — karty testowe Stripe, bez prawdziwych pieniędzy',
        klipow: 'klipów ruchu', obrazow: 'warianty',
        rz: { pospolity: 'pospolity', rzadki: 'rzadki', epicki: 'epicki', legendarny: 'legendarny', mityczny: 'mityczny' } as Record<Rzadkosc, string>,
        uczciwie: 'Płatność obsługuje Stripe (strona nie widzi karty). Pakiet wydaje Katedra po opłacie — musi być wtedy online; link do pobrania działa 5 razy.',
        bladKupna: 'Katedra nie odpowiedziała',
    },
    en: {
        tytul: 'Support & Mini Shop',
        wstep: 'Mini-TeOgochi from the Cathedrals: textured, rigged model, moves and actions, plus three variant proposals to create in your own Cathedral.',
        brak: 'The Cathedral registry is not responding — no made-up shop here.',
        pusto: 'No Cathedral online accepts donations or offers Minis right now.',
        wesprzyj: 'Support',
        kup: 'Buy',
        laczy: 'connecting to the Cathedral…',
        test: 'TEST MODE — Stripe test cards, no real money',
        klipow: 'motion clips', obrazow: 'variants',
        rz: { pospolity: 'common', rzadki: 'rare', epicki: 'epic', legendarny: 'legendary', mityczny: 'mythic' } as Record<Rzadkosc, string>,
        uczciwie: 'Payment is handled by Stripe (this site never sees your card). The Cathedral releases the pack after payment — it must be online then; the download link works 5 times.',
        bladKupna: 'The Cathedral did not respond',
    },
};
const KOLOR: Record<Rzadkosc, string> = { pospolity: '#9ca3af', rzadki: '#38bdf8', epicki: '#a78bfa', legendarny: '#f59e0b', mityczny: '#f472b6' };
const CHECKOUT = /^https:\/\/checkout\.stripe\.com\//;
const cena = (k: number, w: string, lang: 'pl' | 'en') => new Intl.NumberFormat(lang === 'pl' ? 'pl-PL' : 'en-US', { style: 'currency', currency: w.toUpperCase() }).format(k);

export const SklepKatedr: React.FC<{ lang: 'pl' | 'en'; kawaii?: boolean }> = ({ lang, kawaii }) => {
    const t = TEKST[lang];
    const [lista, setLista] = useState<KatedraOnline[] | null | undefined>(undefined);
    const [kupuje, setKupuje] = useState<string | null>(null);
    const [blad, setBlad] = useState<string | null>(null);
    useEffect(() => {
        let zyje = true;
        const pobierz = () => katedryOnline().then((l) => { if (zyje) setLista(l); });
        void pobierz();
        const i = setInterval(pobierz, 60_000);
        return () => { zyje = false; clearInterval(i); };
    }, []);
    const sklepy = (lista ?? []).filter((k) => k.sklep);
    const akcent = kawaii ? 'text-pink-400' : 'text-amber-300';

    const kup = async (k: KatedraOnline, p: PakietMini) => {
        setKupuje(p.id); setBlad(null);
        try {
            const r = await fetch(`${k.adres}/wizytowka/sklep/${p.id}/kup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ powrot: window.location.href }), signal: AbortSignal.timeout(20_000) });
            const d = await r.json().catch(() => null);
            if (!r.ok || !CHECKOUT.test(String(d?.url ?? ''))) throw new Error(d?.message || `HTTP ${r.status}`);
            window.location.href = d.url;
        } catch (e) { setBlad(`${t.bladKupna} (${k.nick}): ${(e as Error).message}`); setKupuje(null); }
    };

    return (
        <div className="w-full mt-6 p-6 bg-[#040407] border border-zinc-800/80 rounded-xl max-w-5xl text-left font-mono">
            <div className="flex items-center gap-2">
                <HeartHandshake className={`h-4 w-4 ${akcent}`} />
                <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-bold">💳 {t.tytul}</span>
            </div>
            <p className="mt-2 text-[11px] text-zinc-400 font-sans">{t.wstep}</p>
            {lista === null && <p className="mt-3 text-[11px] text-amber-300/80 font-sans">{t.brak}</p>}
            {lista && sklepy.length === 0 && <p className="mt-3 text-[11px] text-zinc-500 font-sans">{t.pusto}</p>}
            {blad && <p className="mt-3 text-[11px] text-rose-300 font-sans">{blad}</p>}
            {sklepy.map((k) => (
                <section key={k.nick} className="mt-4">
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <b className="text-zinc-200">{k.nick}</b>
                        {k.sklep!.tryb === 'test' && <span className="rounded border border-amber-500/40 px-2 py-0.5 text-[10px] text-amber-300">{t.test}</span>}
                        {k.sklep!.darowizny && (
                            <a href={k.sklep!.darowizny.link} target="_blank" rel="noreferrer" className="ml-auto rounded-lg border border-amber-400/50 bg-amber-400/10 px-3 py-1.5 text-amber-200 hover:bg-amber-400/20">
                                💛 {t.wesprzyj} {k.nick}
                            </a>
                        )}
                    </div>
                    {!!k.sklep!.mini?.length && (
                        <ul className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                            {k.sklep!.mini!.map((p) => (
                                <li key={p.id} className="flex flex-col overflow-hidden rounded-lg border bg-[#07070b]" style={{ borderColor: `${KOLOR[p.rzadkosc]}66` }}>
                                    {p.obraz ? <img src={p.obraz} alt={p.nazwa} loading="lazy" className="aspect-square w-full bg-white object-contain" /> : <div className="aspect-square w-full bg-zinc-900" />}
                                    <div className="flex flex-1 flex-col gap-1 p-2 font-sans">
                                        <span className="text-[12px] font-bold text-zinc-100">{p.nazwa}</span>
                                        <span className="text-[10px]" style={{ color: KOLOR[p.rzadkosc] }}>{t.rz[p.rzadkosc]}</span>
                                        <span className="line-clamp-3 text-[10px] text-zinc-400">{p.opis}</span>
                                        <span className="text-[10px] text-zinc-500">{p.klipow} {t.klipow} · {p.obrazow} {t.obrazow} · {(p.bajtow / 1e6).toFixed(1)} MB</span>
                                        <button disabled={!!kupuje} onClick={() => void kup(k, p)} className="mt-auto rounded-md border border-fuchsia-400/50 bg-fuchsia-500/10 px-2 py-1 text-[11px] text-fuchsia-100 hover:bg-fuchsia-500/20 disabled:opacity-50">
                                            {kupuje === p.id ? t.laczy : `${t.kup} · ${cena(p.cena, p.waluta, lang)}`}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            ))}
            <p className="mt-4 text-[10px] text-zinc-600 font-sans">{t.uczciwie}</p>
        </div>
    );
};
