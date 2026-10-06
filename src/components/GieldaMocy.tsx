/**
 * ⚡ Giełda Master Flow (TeOkoP GRV, dawniej „Giełda mocy”) — PRAWDZIWE liczby z rejestru Katedr (2026-10-04;
 * nazwa i zlecenia 2026-10-06: Katedry ogłaszają też, czego SZUKAJĄ — zadanie albo cały projekt).
 *
 * Wcześniej stał tu wymyślony licznik („18 342 948 GB VRAM” rosnący losowo, 1024 „peerów” w losowym spacerze, suwak
 * „wnieś VRAM”, który tylko dodawał liczbę w przeglądarce). Suweren: wymiana mocy ma być prawdziwa → etap 1:
 * Katedra ogłasza ofertę w wizytówce (Hub → Wystawa → ⚡ Giełda mocy), rejestr ją niesie w /api/katedry, a tu widać
 * tylko to, co Katedry online naprawdę ogłosiły. Bez wykonywania zadań i bez przelewów GRV — mówimy to wprost.
 */
import React, { useEffect, useState } from 'react';
import { Cpu } from 'lucide-react';
import { katedryOnline, type KatedraOnline } from '../katedry/wizytowka';

const TEKST = {
    pl: {
        tytul: 'Giełda Master Flow · TeOkoP GRV',
        suma: 'VRAM udostępniony przez Katedry online',
        online: 'Katedry online', zOferta: 'z ofertą mocy',
        brakRejestru: 'Rejestr Katedr nie odpowiada — nie pokażę liczb, których nie znam.',
        pusto: 'Żadna Katedra online nie ogłosiła jeszcze mocy. Bądź pierwsza.',
        jak: 'Udostępnij moc swojej Katedry: Hub → karta Wystawy → ⚡ Giełda Master Flow (VRAM, modele z Ollamy, cena w GRV). Zlecenie (zadanie albo cały projekt) ogłaszasz w TeO Games Studio → Reżyser i GDD. Oferty i zlecenia idą w wizytówce, gdy Katedra jest online i nick zatwierdzony.',
        zlecenia: 'Zlecenia — czego szukają Katedry', zadanie: 'zadanie', projekt: 'projekt',
        etap: 'Etap 1 = ogłoszenia. Wykonywanie zleceń między Katedrami i rozliczenie w GRV dopiero przyjdą (etap 2).',
        siec: '🔮 sieć 3D Twojej Katedry',
    },
    en: {
        tytul: 'Master Flow Exchange · TeOkoP GRV',
        suma: 'VRAM offered by Cathedrals online',
        online: 'Cathedrals online', zOferta: 'offering power',
        brakRejestru: 'The Cathedral registry is not responding — no made-up numbers here.',
        pusto: 'No Cathedral online has announced power yet. Be the first.',
        jak: 'Offer your Cathedral’s power: Hub → Exhibition card → ⚡ Master Flow Exchange (VRAM, Ollama models, price in GRV). Post a job (a task or a whole project) in TeO Games Studio → Director & GDD. Offers and jobs travel in your card while the Cathedral is online and its nick approved.',
        zlecenia: 'Jobs — what Cathedrals are looking for', zadanie: 'task', projekt: 'project',
        etap: 'Stage 1 = announcements. Running jobs between Cathedrals and settling in GRV come later (stage 2).',
        siec: '🔮 your Cathedral’s 3D net',
    },
};

export const GieldaMocy: React.FC<{ lang: 'pl' | 'en'; kawaii?: boolean; onSiec?: () => void; onOnline?: (n: number | null) => void }> = ({ lang, kawaii, onSiec, onOnline }) => {
    const t = TEKST[lang];
    const [lista, setLista] = useState<KatedraOnline[] | null | undefined>(undefined);
    useEffect(() => {
        let zyje = true;
        const pobierz = () => katedryOnline().then((l) => { if (!zyje) return; setLista(l); onOnline?.(l ? l.length : null); });
        void pobierz();
        const i = setInterval(pobierz, 60_000);
        return () => { zyje = false; clearInterval(i); };
    }, [onOnline]);

    const oferty = (lista ?? []).filter((k) => k.moc && k.moc.modele?.length);
    const zlecenia = (lista ?? []).flatMap((k) => (k.zlecenia ?? []).map((z) => ({ ...z, nick: k.nick })));
    const vram = oferty.reduce((s, k) => s + (k.moc?.vramGB ?? 0), 0);
    const akcent = kawaii ? 'text-pink-400' : 'text-emerald-400';

    return (
        <div className="w-full mt-10 p-6 bg-[#040407] border border-zinc-800/80 rounded-xl max-w-5xl text-left font-mono">
            <div className="flex items-center gap-2">
                <Cpu className={`h-4 w-4 ${akcent}`} />
                <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-bold">{t.tytul}</span>
                {onSiec && <button onClick={onSiec} className="ml-auto text-[10px] text-zinc-500 hover:text-zinc-300">{t.siec}</button>}
            </div>
            {lista === null ? (
                <p className="mt-4 text-[11px] text-amber-300/80 font-sans">{t.brakRejestru}</p>
            ) : (
                <>
                    <div className="mt-4 flex flex-wrap items-end gap-x-8 gap-y-3">
                        <div>
                            <div className="text-[10px] text-zinc-500 uppercase">{t.suma}</div>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-2xl sm:text-3xl font-bold ${akcent}`}>{lista === undefined ? '…' : vram.toLocaleString(lang === 'pl' ? 'pl-PL' : 'en-US')}</span>
                                <span className="text-zinc-500 text-xs">GB VRAM</span>
                            </div>
                        </div>
                        <div className="text-xs text-zinc-400">{t.online}: <b className="text-zinc-200">{lista?.length ?? '…'}</b></div>
                        <div className="text-xs text-zinc-400">{t.zOferta}: <b className="text-zinc-200">{lista ? oferty.length : '…'}</b></div>
                    </div>
                    {lista && oferty.length === 0 && <p className="mt-4 text-[11px] text-zinc-500 font-sans">{t.pusto}</p>}
                    {oferty.length > 0 && (
                        <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                            {oferty.map((k) => (
                                <li key={k.nick} className="rounded-lg border border-zinc-900 bg-[#07070b] p-3 text-xs min-w-0">
                                    <div className="flex flex-wrap items-baseline gap-2">
                                        <b className="text-zinc-200">{k.nick}</b>
                                        <span className="text-zinc-500">{k.moc!.gpu || 'GPU'} · {k.moc!.vramGB} GB</span>
                                        <span className={`ml-auto font-bold ${akcent}`}>{k.moc!.cenaGRV} GRV / {lang === 'en' && k.moc!.jednostka === '1000 tokenów' ? '1000 tokens' : k.moc!.jednostka}</span>
                                    </div>
                                    <div className="mt-1 text-[10px] text-zinc-400 break-words">{k.moc!.modele.join(' · ')}</div>
                                    {(k.moc!.opis || k.moc!.godziny) && <div className="mt-1 text-[10px] text-zinc-500 font-sans">{[k.moc!.opis, k.moc!.godziny].filter(Boolean).join(' — ')}</div>}
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
            {zlecenia.length > 0 && (
                <>
                    <div className="mt-5 text-[10px] tracking-widest text-zinc-500 uppercase font-bold">{t.zlecenia}</div>
                    <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {zlecenia.map((z) => (
                            <li key={`${z.nick}-${z.id}`} className="rounded-lg border border-zinc-900 bg-[#07070b] p-3 text-xs min-w-0">
                                <div className="flex flex-wrap items-baseline gap-2">
                                    <b className="text-zinc-200">{z.nick}</b>
                                    <span className="text-zinc-400">{z.rodzaj === 'projekt' ? t.projekt : t.zadanie}: {z.tytul}</span>
                                    {z.budzetGRV > 0 && <span className={`ml-auto font-bold ${akcent}`}>{z.budzetGRV} GRV</span>}
                                </div>
                                {z.opis && <div className="mt-1 text-[10px] text-zinc-500 font-sans break-words">{z.opis}</div>}
                                {z.modele.length > 0 && <div className="mt-1 text-[10px] text-zinc-400 break-words">{z.modele.join(' · ')}</div>}
                            </li>
                        ))}
                    </ul>
                </>
            )}
            <p className="mt-4 text-[11px] text-zinc-500 font-sans leading-relaxed">{t.jak}</p>
            <p className="mt-1 text-[10px] text-zinc-600 font-sans">{t.etap}</p>
        </div>
    );
};
