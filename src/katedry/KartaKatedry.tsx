/**
 * 🪪 KartaKatedry — szablon wizytówki jednej Katedry (z Wystawy teo.center, dla każdego TeOnauty).
 *
 * Na górze tylko NICK i motto (bez imion). Pod spodem twórczość tej Katedry: filmy (YouTube albo
 * prosto z jej dysku przez tunel), Suno, utwory z dysku i produkty. Dane są już oczyszczone
 * (wizytowka.ts → oczysc), tu tylko je pokazujemy.
 */
import React, { useState } from 'react';
import type { Film, Kanal, Suno, Wizytowka } from './wizytowka';

const czas = (s?: number | null) => (s ? `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}` : '');

const KartaFilmu: React.FC<{ f: Film; pl: boolean }> = ({ f, pl }) => {
  const [gra, setGra] = useState(false);
  const mozeGrac = !!f.youtube || !!f.plik;
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="relative aspect-video bg-black">
        {gra && f.youtube && (
          <iframe src={`https://www.youtube-nocookie.com/embed/${f.youtube}?autoplay=1`} title={f.tytul} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />
        )}
        {gra && !f.youtube && f.plik && <video src={f.plik} poster={f.plakat ?? undefined} controls autoPlay playsInline className="absolute inset-0 h-full w-full" />}
        {!gra && (
          <button onClick={() => mozeGrac && setGra(true)} className="group absolute inset-0 flex items-center justify-center" title={pl ? 'Odtwórz' : 'Play'}>
            {f.plakat ? <img src={f.plakat} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} className="absolute inset-0 h-full w-full object-cover opacity-80 transition group-hover:opacity-100" /> : <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-900/40 to-slate-900" />}
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-fuchsia-300/70 bg-black/50 text-xl text-fuchsia-100">▶</span>
            <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-[9px] text-slate-300">{f.youtube ? 'YouTube' : pl ? 'z Katedry' : 'from the Cathedral'}</span>
          </button>
        )}
      </div>
      <div className="p-3">
        {f.projekt && <div className="text-[9px] uppercase tracking-[0.25em] text-fuchsia-300/70">{f.projekt}</div>}
        <div className="mt-0.5 text-sm font-bold text-slate-100">{f.tytul}</div>
        {f.opis && <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-400">{f.opis}</p>}
      </div>
    </article>
  );
};

const SunoBlok: React.FC<{ s: Suno }> = ({ s }) => {
  const [i, setI] = useState(0);
  const u = s.utwory[i];
  const ramka = s.typ === 'playlista' ? u?.embed : s.embed;
  if (!ramka) return null;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className="mb-2 flex items-center gap-3">
        {s.okladka && <img src={s.okladka} alt="" loading="lazy" className="h-10 w-10 rounded object-cover" />}
        <div className="min-w-0"><div className="truncate text-sm font-bold text-slate-100">{s.tytul || 'Suno'}</div>{s.typ === 'playlista' && <div className="text-[10px] text-slate-500">{s.utwory.length} ♪</div>}</div>
        <a href={s.url} target="_blank" rel="noreferrer" className="ml-auto text-[10px] text-slate-500 hover:text-fuchsia-200">Suno →</a>
      </div>
      <iframe key={ramka} src={ramka} title={s.tytul || s.id} loading="lazy" allow="autoplay; encrypted-media" className="h-[200px] w-full rounded-xl border-0 bg-black" />
      {s.typ === 'playlista' && s.utwory.length > 1 && (
        <ol className="mt-2 max-h-40 divide-y divide-white/5 overflow-y-auto">
          {s.utwory.map((x, n) => (
            <li key={x.id}><button onClick={() => setI(n)} className={`flex w-full items-center gap-2 px-2 py-1 text-left text-[11px] ${n === i ? 'text-fuchsia-200' : 'text-slate-300'}`}><span className="w-4 text-right text-slate-600">{n + 1}</span><span className="flex-1 truncate">{x.tytul}</span><span className="text-slate-600">{czas(x.sekundy)}</span></button></li>
          ))}
        </ol>
      )}
    </div>
  );
};

/** Cały kanał YouTube Katedry w jednej ramce: domyślnie playlista „wszystkie filmy”, klik w listę = ten film. */
const KanalBlok: React.FC<{ k: Kanal; pl: boolean }> = ({ k, pl }) => {
  const [gra, setGra] = useState<string | null>(null);   // null = nic nie ładujemy, dopóki gość nie kliknie
  const src = gra === 'kanal' ? `https://www.youtube-nocookie.com/embed/videoseries?list=${k.playlista}&autoplay=1` : gra ? `https://www.youtube-nocookie.com/embed/${gra}?autoplay=1` : null;
  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-red-500/20 bg-white/[0.03]">
      <div className="flex items-center gap-2 px-4 py-2.5">
        <span className="text-sm">📺</span>
        <span className="truncate text-sm font-bold text-slate-100">{k.nazwa || 'YouTube'}</span>
        <a href={k.adres} target="_blank" rel="noreferrer" className="ml-auto text-[10px] text-slate-500 hover:text-red-200">{pl ? 'kanał na YouTube →' : 'channel on YouTube →'}</a>
      </div>
      <div className="grid md:grid-cols-[2fr_1fr]">
        <div className="relative aspect-video bg-black">
          {src ? <iframe key={src} src={src} title={k.nazwa} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />
            : <button onClick={() => setGra('kanal')} className="group absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-red-950/50 to-black">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-red-300/70 bg-black/50 text-2xl text-red-100 transition group-hover:scale-105">▶</span>
                <span className="text-[11px] text-slate-400">{pl ? 'Odtwórz cały kanał' : 'Play the whole channel'}</span>
              </button>}
        </div>
        {k.filmy.length > 0 && (
          <ol className="max-h-[22rem] divide-y divide-white/5 overflow-y-auto md:max-h-none">
            {k.filmy.map((f) => (
              <li key={f.id}><button onClick={() => setGra(f.id)} className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[11px] hover:bg-white/5 ${gra === f.id ? 'text-red-200' : 'text-slate-300'}`}>
                <img src={`https://i.ytimg.com/vi/${f.id}/mqdefault.jpg`} alt="" loading="lazy" className="h-9 w-16 shrink-0 rounded object-cover" />
                <span className="line-clamp-2">{f.tytul}</span>
              </button></li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
};

export const KartaKatedry: React.FC<{ w: Wizytowka; pl: boolean; twoja?: boolean }> = ({ w, pl, twoja }) => {
  const pusta = !w.filmy.length && !w.suno.length && !w.utwory.length && !w.produkty.length && !w.kanal;
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-16">
      <header className="pt-6 pb-6 text-center">
        <div className="text-[10px] uppercase tracking-[0.35em] text-fuchsia-300/70">{twoja ? (pl ? '∴ Twoja Katedra ∴' : '∴ Your Cathedral ∴') : '∴ Katedra ∴'}</div>
        <h2 className="mt-2 font-mono text-4xl font-black tracking-tight text-white sm:text-5xl">{w.nick}</h2>
        {w.motto && <p className="mt-2 text-sm italic text-amber-200/90">„{w.motto}”</p>}
        {w.opis && <p className="mx-auto mt-3 max-w-2xl text-[13px] leading-relaxed text-slate-400">{w.opis}</p>}
        {w.linki.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {w.linki.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noreferrer nofollow" className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-slate-300 hover:border-fuchsia-300/60 hover:text-fuchsia-100">{l.nazwa} ↗</a>)}
          </div>
        )}
      </header>
      {w.kanal && <KanalBlok k={w.kanal} pl={pl} />}
      {pusta && <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center text-[12px] text-slate-500">{pl ? 'Ta Katedra nie wystawiła jeszcze żadnych dzieł.' : 'This Cathedral has not exhibited any works yet.'}</p>}
      {w.filmy.length > 0 && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{w.filmy.map((f) => <KartaFilmu key={f.id} f={f} pl={pl} />)}</div>}
      {w.suno.length > 0 && <div className="mt-6 grid gap-4 md:grid-cols-2">{w.suno.map((s) => <SunoBlok key={s.id} s={s} />)}</div>}
      {w.utwory.length > 0 && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {w.utwory.map((u) => (
            <div key={u.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="truncate text-[12px] font-bold text-slate-100">{u.tytul}</div>
              <audio src={u.plik} controls preload="none" className="mt-2 w-full" />
            </div>
          ))}
        </div>
      )}
      {w.produkty.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {w.produkty.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              {p.obraz ? <img src={p.obraz} alt={p.tytul} loading="lazy" className="aspect-[4/3] w-full object-cover" /> : <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-slate-900 to-black text-3xl">✦</div>}
              <div className="p-3"><div className="text-[9px] uppercase tracking-[0.2em] text-cyan-300/70">{p.dzial}</div><div className="mt-0.5 truncate text-[12px] font-bold text-slate-100" title={p.tytul}>{p.tytul}</div></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KartaKatedry;
