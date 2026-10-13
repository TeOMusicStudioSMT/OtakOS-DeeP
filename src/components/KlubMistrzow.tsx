/**
 * 🏛️ Globalny Klub Mistrzów (2026-10-09) — PRAWDZIWE dane z rejestru Katedr (`mistrz` w /api/katedry, oczyszczone
 * w server/rejestr.mjs). Każda Katedra online wystawia tu swojego JaJa Mistrza (etap, event dnia jej Teterhii),
 * turnieje globalne, które ogłosiła, i swoje wyniki. Ranking liczymy tutaj z wyników Katedr — wyniki DEKLARUJE
 * Katedra (tożsamość potwierdza podpisany meldunek), za udział nie płyną GRV. Mówimy to wprost.
 */
import React, { useEffect, useState } from 'react';
import { Crown } from 'lucide-react';
import { katedryOnline, type KatedraOnline, type TanecKlubu } from '../katedry/wizytowka';

const DZIEDZINY: Record<string, { pl: string; en: string; plD: string; ikona: string }> = {
    takt: { pl: 'Takt', en: 'Rhythm', plD: 'Taktu', ikona: '🎵' },
    zwinnosc: { pl: 'Zwinność', en: 'Agility', plD: 'Zwinności', ikona: '🌀' },
    spryt: { pl: 'Spryt', en: 'Wit', plD: 'Sprytu', ikona: '🧩' },
    urok: { pl: 'Urok', en: 'Charm', plD: 'Uroku', ikona: '✨' },
};
const ETAP: Record<string, { ikona: string; en: string }> = { jajo: { ikona: '🥚', en: 'egg' }, 'drży': { ikona: '🥚', en: 'trembling' }, 'pęka': { ikona: '🐣', en: 'cracking' }, wykluty: { ikona: '🐥', en: 'hatched' } };

const TEKST = {
    pl: {
        tytul: 'Globalny Klub Mistrzów',
        wstep: 'Każda Katedra ma swojego JaJa Mistrza — uczy się stylu Suwerena, sędziuje w jej Teterhii i przedstawia ją tutaj.',
        brak: 'Rejestr Katedr nie odpowiada — nie pokażę Klubu, którego nie znam.',
        pusto: 'Żaden Mistrz nie jest teraz w sieci. Klub ożyje, gdy Katedry z JaJem Mistrza zameldują się online.',
        turnieje: 'Turnieje Klubu', bezTurniejow: 'Żaden turniej Klubu teraz nie trwa.',
        organizuje: 'ogłasza', do: 'do', jeszczeNikt: 'jeszcze nikt nie zagrał',
        jak: 'Turniej ogłaszasz w swojej Katedrze: Hub → Kwantowy Inkubator → 🏛️ Klub Mistrzów. Gracze każdej Katedry grają go w swojej Teterhii (K → 🏛️).',
        uczciwie: 'Wyniki deklarują Katedry — tożsamość potwierdza podpisany meldunek, liczb nikt niezależnie nie sprawdza. Za udział nie płyną GRV.',
        teterhia: 'w Teterhii',
        tance: '🩰 Turnieje taneczne', bezTancow: 'jeszcze nikt nie zatańczył',
        tanceJak: 'Choreografię układasz i zgłaszasz w swojej Katedrze: apka Taneczne Starcie → 🩰 Choreografia. Okresy liczymy z doby UTC (tydzień ISO); Mistrzostwa Świata trwają cały grudzień.',
        tanceUczciwie: 'Ocenę rejestr liczy od nowa z układu, który Katedra wystawia — arytmetyka (takt, dopasowanie energii, różnorodność) jest sprawdzalna. Energię fraz utworu i moc ruchów deklaruje Katedra. Za miejsce nie płyną GRV.',
        mistrzostwaOd: 'Mistrzostwa Świata ruszają 1 grudnia',
    },
    en: {
        tytul: 'Global Masters’ Club',
        wstep: 'Every Cathedral has its Master’s Egg — it learns the Sovereign’s style, referees its Teterhia and represents it here.',
        brak: 'The Cathedral registry is not responding — no made-up Club here.',
        pusto: 'No Master is online right now. The Club comes alive when Cathedrals with a Master’s Egg check in.',
        turnieje: 'Club tournaments', bezTurniejow: 'No Club tournament is running now.',
        organizuje: 'hosts', do: 'until', jeszczeNikt: 'nobody has played yet',
        jak: 'Announce a tournament in your Cathedral: Hub → Quantum Incubator → 🏛️ Masters’ Club. Players of every Cathedral play it in their own Teterhia (K → 🏛️).',
        uczciwie: 'Results are declared by the Cathedrals — identity is confirmed by a signed check-in, the numbers are not independently verified. No GRV changes hands.',
        teterhia: 'in Teterhia',
        tance: '🩰 Dance tournaments', bezTancow: 'nobody has danced yet',
        tanceJak: 'Choreographies are made and entered in your own Cathedral: the Dance Clash app → 🩰 Choreography. Periods follow the UTC day (ISO week); the World Championship runs all December.',
        tanceUczciwie: 'The registry recomputes every score from the routine the Cathedral publishes — the arithmetic (timing, energy match, variety) is verifiable. Phrase energy and move power are declared by the Cathedral. No GRV changes hands.',
        mistrzostwaOd: 'The World Championship starts on 1 December',
    },
};

interface Turniej { klucz: string; organizator: string; dziedzina: string; opis: string; do: string; wyniki: { nick: string; wygrane: number; starc: number; kiedy: string }[] }

export function turniejeKlubu(lista: KatedraOnline[]): Turniej[] {
    const t = lista.flatMap((k) => (k.mistrz?.eventy ?? []).map((e) => ({ klucz: `${k.nick}:${e.id}`, organizator: k.nick, dziedzina: e.dziedzina, opis: e.opis, do: e.do, wyniki: [] as Turniej['wyniki'] })));
    for (const k of lista) for (const w of k.mistrz?.wyniki ?? []) t.find((x) => x.klucz === w.event)?.wyniki.push({ nick: k.nick, wygrane: w.wygrane, starc: w.starc, kiedy: w.kiedy });
    for (const x of t) x.wyniki.sort((a, b) => b.wygrane - a.wygrane || a.kiedy.localeCompare(b.kiedy));
    return t;
}

const OKRESY_TANCA: { okres: TanecKlubu['okres']; pl: string; en: string }[] = [
    { okres: 'dzien', pl: 'Taniec Dnia', en: 'Dance of the Day' },
    { okres: 'tydzien', pl: 'Taniec Tygodnia', en: 'Dance of the Week' },
    { okres: 'miesiac', pl: 'Taniec Miesiąca', en: 'Dance of the Month' },
    { okres: 'rok', pl: 'Taniec Roku', en: 'Dance of the Year' },
    { okres: 'mistrzostwa', pl: 'Mistrzostwa Świata', en: 'World Championship' },
];
/** Tydzień ISO 8601 („2026-W42”) — jak services/Choreografie.js Katedry i server/rejestr.mjs. */
export function tydzienISO(t: number): string {
    const d = new Date(t);
    const dzien = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    dzien.setUTCDate(dzien.getUTCDate() + 4 - (dzien.getUTCDay() || 7));
    const rok = dzien.getUTCFullYear();
    return `${rok}-W${String(Math.ceil(((dzien.getTime() - Date.UTC(rok, 0, 1)) / 86_400_000 + 1) / 7)).padStart(2, '0')}`;
}
/** Okresy, które trwają teraz (doba UTC); Mistrzostwa Świata tylko w grudniu. */
export function okresyTanca(teraz = Date.now()): { okres: TanecKlubu['okres']; klucz: string }[] {
    const d = new Date(teraz).toISOString().slice(0, 10);
    const out: { okres: TanecKlubu['okres']; klucz: string }[] = [
        { okres: 'dzien', klucz: d }, { okres: 'tydzien', klucz: tydzienISO(teraz) }, { okres: 'miesiac', klucz: d.slice(0, 7) }, { okres: 'rok', klucz: d.slice(0, 4) },
    ];
    if (d.slice(5, 7) === '12') out.push({ okres: 'mistrzostwa', klucz: `MS-${d.slice(0, 4)}` });
    return out;
}
export interface MiejsceTanca { nick: string; wynik: number; mini: string; utwor: string; kiedy: string; bpm: number }
/** Ranking każdego trwającego okresu: najlepszy występ każdej Katedry, wyżej ocena, przy remisie wcześniejszy. */
export function rankingiTanca(lista: KatedraOnline[], teraz = Date.now()) {
    return okresyTanca(teraz).map(({ okres, klucz }) => {
        const naj = new Map<string, MiejsceTanca>();
        for (const k of lista) for (const x of k.mistrz?.tance ?? []) {
            if (x.okres !== okres || x.klucz !== klucz) continue;
            const m = { nick: k.nick, wynik: x.ocena.wynik, mini: x.mini, utwor: x.utwor, kiedy: x.kiedy, bpm: x.dane?.okresSek > 0 ? Math.round(60 / x.dane.okresSek) : 0 };
            const b = naj.get(k.nick);
            if (!b || m.wynik > b.wynik || (m.wynik === b.wynik && m.kiedy < b.kiedy)) naj.set(k.nick, m);
        }
        return { okres, klucz, miejsca: [...naj.values()].sort((a, b) => b.wynik - a.wynik || a.kiedy.localeCompare(b.kiedy)) };
    });
}

export const KlubMistrzow: React.FC<{ lang: 'pl' | 'en'; kawaii?: boolean }> = ({ lang, kawaii }) => {
    const t = TEKST[lang];
    const [lista, setLista] = useState<KatedraOnline[] | null | undefined>(undefined);
    useEffect(() => {
        let zyje = true;
        const pobierz = () => katedryOnline().then((l) => { if (zyje) setLista(l); });
        void pobierz();
        const i = setInterval(pobierz, 60_000);
        return () => { zyje = false; clearInterval(i); };
    }, []);
    const mistrzowie = (lista ?? []).filter((k) => k.mistrz);
    const turnieje = turniejeKlubu(mistrzowie);
    const tance = rankingiTanca(mistrzowie);
    const grudzien = tance.some((x) => x.okres === 'mistrzostwa');
    const akcent = kawaii ? 'text-pink-400' : 'text-amber-300';

    return (
        <div className="w-full mt-6 p-6 bg-[#040407] border border-zinc-800/80 rounded-xl max-w-5xl text-left font-mono">
            <div className="flex items-center gap-2">
                <Crown className={`h-4 w-4 ${akcent}`} />
                <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-bold">{t.tytul}</span>
                {lista && <span className="ml-auto text-[10px] text-zinc-500">{mistrzowie.length} / {lista.length}</span>}
            </div>
            <p className="mt-2 text-[11px] text-zinc-400 font-sans">{t.wstep}</p>
            {lista === null && <p className="mt-3 text-[11px] text-amber-300/80 font-sans">{t.brak}</p>}
            {lista && mistrzowie.length === 0 && <p className="mt-3 text-[11px] text-zinc-500 font-sans">{t.pusto}</p>}
            {mistrzowie.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                    {mistrzowie.map((k) => {
                        const e = ETAP[k.mistrz!.etap] ?? ETAP.jajo;
                        return (
                            <li key={k.nick} className="rounded-lg border border-zinc-900 bg-[#07070b] px-3 py-2 text-xs">
                                <span className="mr-1">{e.ikona}</span><b className="text-zinc-200">{k.nick}</b>
                                <span className="text-zinc-500"> · {lang === 'en' ? e.en : k.mistrz!.etap}</span>
                                {k.mistrz!.teterhia && <div className="text-[10px] text-zinc-500 font-sans">🎲 {t.teterhia}: {k.mistrz!.teterhia}</div>}
                            </li>
                        );
                    })}
                </ul>
            )}
            {lista && (
                <>
                    <div className="mt-5 text-[10px] tracking-widest text-zinc-500 uppercase font-bold">{t.turnieje}</div>
                    {turnieje.length === 0 ? <p className="mt-2 text-[11px] text-zinc-500 font-sans">{t.bezTurniejow}</p> : (
                        <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                            {turnieje.map((x) => {
                                const d = DZIEDZINY[x.dziedzina];
                                return (
                                    <li key={x.klucz} className="rounded-lg border border-zinc-900 bg-[#07070b] p-3 text-xs min-w-0">
                                        <div className="flex flex-wrap items-baseline gap-2">
                                            <b className={akcent}>{d.ikona} {lang === 'en' ? `${d.en} Tournament` : `Turniej ${d.plD}`}</b>
                                            <span className="text-zinc-500">· {x.organizator} {t.organizuje} · {t.do} {x.do}</span>
                                        </div>
                                        {x.opis && <div className="mt-1 text-[10px] text-zinc-400 font-sans break-words">{x.opis}</div>}
                                        {x.wyniki.length === 0 ? <div className="mt-1 text-[10px] text-zinc-600 font-sans">{t.jeszczeNikt}</div> : (
                                            <ol className="mt-1 list-decimal pl-4 text-[10px] text-zinc-300">{x.wyniki.slice(0, 5).map((w) => <li key={w.nick}>{w.nick} — {w.wygrane}/{w.starc}</li>)}</ol>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </>
            )}
            <p className="mt-4 text-[11px] text-zinc-500 font-sans leading-relaxed">{t.jak}</p>
            <p className="mt-1 text-[10px] text-zinc-600 font-sans">{t.uczciwie}</p>
            {lista && (
                <>
                    <div className="mt-6 text-[10px] tracking-widest text-zinc-500 uppercase font-bold">{t.tance}</div>
                    <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {tance.map((x) => {
                            const o = OKRESY_TANCA.find((y) => y.okres === x.okres)!;
                            return (
                                <li key={x.okres} className="rounded-lg border border-zinc-900 bg-[#07070b] p-3 text-xs min-w-0">
                                    <div className="flex flex-wrap items-baseline gap-2">
                                        <b className={akcent}>{lang === 'en' ? o.en : o.pl}</b>
                                        <span className="text-zinc-500">· {x.klucz}</span>
                                    </div>
                                    {x.miejsca.length === 0 ? <div className="mt-1 text-[10px] text-zinc-600 font-sans">{t.bezTancow}</div> : (
                                        <ol className="mt-1 list-decimal pl-4 text-[10px] text-zinc-300">
                                            {x.miejsca.slice(0, 5).map((m) => (
                                                <li key={m.nick} className="break-words">
                                                    <b>{m.nick}</b> — {m.wynik}/100
                                                    <span className="text-zinc-500 font-sans">{m.mini && ` · ${m.mini}`}{m.utwor && ` · ♪ ${m.utwor}`}{m.bpm > 0 && ` · ${m.bpm} BPM`}</span>
                                                </li>
                                            ))}
                                        </ol>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                    {!grudzien && <p className="mt-2 text-[10px] text-zinc-500 font-sans">🏆 {t.mistrzostwaOd}.</p>}
                    <p className="mt-2 text-[11px] text-zinc-500 font-sans leading-relaxed">{t.tanceJak}</p>
                    <p className="mt-1 text-[10px] text-zinc-600 font-sans">{t.tanceUczciwie}</p>
                </>
            )}
        </div>
    );
};
