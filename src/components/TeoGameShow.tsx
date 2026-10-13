/**
 * 🎪 TeO Game Show (2026-10-13) — odcinki Tanecznego Starcia z playlist programu Katedr online (`gameShow` w /api/katedry,
 * oczyszczone w server/rejestr.mjs). Każda Katedra ma własną playlistę; strona pokazuje filmy w języku wybranym na stronie
 * (`jezyk === lang`), a filmy bez rozpoznanego języka (`null`) — zawsze. Język rozpoznała Katedra z tytułu i opisu
 * (bez modelu) — mówimy to wprost. Odtwarzacz ładuje się dopiero po kliknięciu (youtube-nocookie, jak ramka kanału).
 */
import React, { useEffect, useState } from 'react';
import { Clapperboard } from 'lucide-react';
import { katedryOnline, type KatedraOnline } from '../katedry/wizytowka';

const TEKST = {
    pl: {
        tytul: 'TeO Game Show',
        wstep: 'Występy TeOgochi z Tanecznego Starcia — każde nagranie Katedra sama składa w odcinek: intro, konkurencja, taniec, wynik i krótki wywiad.',
        brak: 'Rejestr Katedr nie odpowiada — nie pokażę odcinków, których nie znam.',
        pusto: 'Żadna Katedra online nie wystawia teraz playlisty TeO Game Show.',
        bezJezyka: 'Brak odcinków po polsku — przełącz stronę na EN, by zobaczyć pozostałe',
        playlista: 'cała playlista →',
        odtworz: 'Odtwórz odcinek',
        uczciwie: 'Język odcinka Katedra rozpoznała z tytułu i opisu filmu (bez modelu) — może się pomylić; filmy bez rozpoznanego języka widać zawsze. Playlistę ustawia Suweren w swojej Katedrze: Impresariat → 🎪 TeO Game Show.',
    },
    en: {
        tytul: 'TeO Game Show',
        wstep: 'TeOgochi performances from Dance Clash — every recording is assembled by the Cathedral itself into an episode: intro, competition, dance, score and a short interview.',
        brak: 'The Cathedral registry is not responding — no made-up episodes here.',
        pusto: 'No Cathedral online publishes a TeO Game Show playlist right now.',
        bezJezyka: 'No episodes in English — switch the site to PL to see the others',
        playlista: 'whole playlist →',
        odtworz: 'Play episode',
        uczciwie: 'The episode language was detected by the Cathedral from the video title and description (no model) — it can be wrong; videos with no detected language are always shown. The Sovereign sets the playlist in their Cathedral: Impresariat → 🎪 TeO Game Show.',
    },
};

export interface OdcinekShow { id: string; tytul: string; kiedy: string | null; jezyk: 'pl' | 'en' | null; nick: string; playlista: string }

/** Odcinki ze wszystkich Katedr w języku strony (albo bez rozpoznanego języka), najnowsze pierwsze, bez dubli. */
export function odcinkiShow(lista: KatedraOnline[], lang: 'pl' | 'en'): OdcinekShow[] {
    const widziane = new Set<string>();
    return lista.flatMap((k) => (k.gameShow?.filmy ?? []).map((f) => ({ ...f, nick: k.nick, playlista: k.gameShow!.playlista })))
        .filter((f) => (f.jezyk === lang || f.jezyk === null) && !widziane.has(f.id) && (widziane.add(f.id), true))
        .sort((a, b) => (b.kiedy ?? '').localeCompare(a.kiedy ?? ''));
}

export const TeoGameShow: React.FC<{ lang: 'pl' | 'en'; kawaii?: boolean }> = ({ lang, kawaii }) => {
    const t = TEKST[lang];
    const [lista, setLista] = useState<KatedraOnline[] | null | undefined>(undefined);
    const [gra, setGra] = useState<string | null>(null);   // null = nic nie ładujemy, dopóki gość nie kliknie
    useEffect(() => {
        let zyje = true;
        const pobierz = () => katedryOnline().then((l) => { if (zyje) setLista(l); });
        void pobierz();
        const i = setInterval(pobierz, 60_000);
        return () => { zyje = false; clearInterval(i); };
    }, []);
    const programy = (lista ?? []).filter((k) => k.gameShow);
    const odcinki = odcinkiShow(programy, lang);
    const wszystkich = programy.reduce((n, k) => n + k.gameShow!.filmy.length, 0);
    // przełączenie języka strony może schować grający film — wtedy wracamy do pierwszego odcinka w nowym języku
    const biezacy = odcinki.find((f) => f.id === gra) ?? null;
    useEffect(() => { if (gra && !biezacy) setGra(null); }, [gra, biezacy]);
    const pierwszy = odcinki[0] ?? null;
    const akcent = kawaii ? 'text-pink-400' : 'text-fuchsia-300';

    return (
        <div className="w-full mt-6 p-6 bg-[#040407] border border-zinc-800/80 rounded-xl max-w-5xl text-left font-mono">
            <div className="flex items-center gap-2">
                <Clapperboard className={`h-4 w-4 ${akcent}`} />
                <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-bold">🎪 {t.tytul}</span>
                {lista && <span className="ml-auto text-[10px] text-zinc-500">{odcinki.length} / {wszystkich}</span>}
            </div>
            <p className="mt-2 text-[11px] text-zinc-400 font-sans">{t.wstep}</p>
            {lista === null && <p className="mt-3 text-[11px] text-amber-300/80 font-sans">{t.brak}</p>}
            {lista && programy.length === 0 && <p className="mt-3 text-[11px] text-zinc-500 font-sans">{t.pusto}</p>}
            {programy.length > 0 && odcinki.length === 0 && <p className="mt-3 text-[11px] text-zinc-500 font-sans">{t.bezJezyka}.</p>}
            {pierwszy && (
                <div className="mt-3 grid overflow-hidden rounded-lg border border-zinc-900 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                    <div className="relative aspect-video bg-black">
                        {biezacy ? <iframe key={biezacy.id} src={`https://www.youtube-nocookie.com/embed/${biezacy.id}?autoplay=1`} title={biezacy.tytul} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />
                            : <button onClick={() => setGra(pierwszy.id)} className="group absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black">
                                <img src={`https://i.ytimg.com/vi/${pierwszy.id}/hqdefault.jpg`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-50" />
                                <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-fuchsia-300/70 bg-black/60 text-2xl text-fuchsia-100 transition group-hover:scale-105">▶</span>
                                <span className="relative text-[11px] text-zinc-200 font-sans">{t.odtworz}</span>
                            </button>}
                    </div>
                    <div className="relative min-h-0">
                        <ol className="max-h-[22rem] divide-y divide-zinc-900 overflow-y-auto md:absolute md:inset-0 md:max-h-none">
                            {odcinki.map((f) => (
                                <li key={f.id}><button onClick={() => setGra(f.id)} className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[11px] font-sans hover:bg-white/5 ${gra === f.id ? akcent : 'text-zinc-300'}`}>
                                    <img src={`https://i.ytimg.com/vi/${f.id}/mqdefault.jpg`} alt="" loading="lazy" className="h-9 w-16 shrink-0 rounded object-cover" />
                                    <span className="min-w-0 flex-1">
                                        <span className="line-clamp-2">{f.tytul || f.id}</span>
                                        <span className="block text-[10px] text-zinc-500">{f.nick}{f.kiedy && ` · ${f.kiedy.slice(0, 10)}`}{f.jezyk === null && ' · ?'}</span>
                                    </span>
                                </button></li>
                            ))}
                        </ol>
                    </div>
                </div>
            )}
            {programy.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2 text-[10px]">
                    {programy.map((k) => (
                        <li key={k.nick}><a href={`https://www.youtube.com/playlist?list=${k.gameShow!.playlista}`} target="_blank" rel="noreferrer" className="rounded-lg border border-zinc-900 bg-[#07070b] px-3 py-1.5 text-zinc-400 hover:text-fuchsia-200">
                            <b className="text-zinc-200">{k.nick}</b> · {k.gameShow!.tytul || t.tytul} · {t.playlista}
                        </a></li>
                    ))}
                </ul>
            )}
            <p className="mt-3 text-[10px] text-zinc-600 font-sans">{t.uczciwie}</p>
        </div>
    );
};
