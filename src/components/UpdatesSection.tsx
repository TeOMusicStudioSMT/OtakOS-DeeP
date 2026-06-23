/**
 * 📡 UpdatesSection — Kronika UPDATE'ów OtakOS, filtrowana wg sektorów ekosystemu.
 */
import React, { useState } from 'react';
import { SECTORS, UPDATES, SectorId } from '../updates';

export const UpdatesSection: React.FC<{ lang?: 'pl' | 'en' }> = ({ lang = 'pl' }) => {
  const [filter, setFilter] = useState<SectorId | 'all'>('all');
  const list = filter === 'all' ? UPDATES : UPDATES.filter(u => u.sector === filter);
  const sec = (id: SectorId) => SECTORS.find(s => s.id === id)!;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#03060a]/80 p-5 sm:p-6 font-mono">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-2 mb-4">
        <div>
          <div className="text-[10px] tracking-[0.3em] text-emerald-500/60">∴ KATEDRA OTAKOS ∴</div>
          <h3 className="text-lg sm:text-xl font-bold text-emerald-300">📡 {lang === 'pl' ? 'KRONIKA UPDATE' : 'UPDATE LOG'}</h3>
          <p className="text-[11px] text-zinc-400">{lang === 'pl' ? 'Co dodano — wg warstw ekosystemu.' : 'What was added — by ecosystem layer.'}</p>
        </div>
        <div className="text-[10px] text-zinc-500 text-right">{UPDATES.length} {lang === 'pl' ? 'wpisów' : 'entries'}</div>
      </div>

      {/* Filtry sektorów */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-colors ${filter === 'all' ? 'border-emerald-500 text-emerald-300 bg-emerald-950/40' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}>
          {lang === 'pl' ? 'Wszystko' : 'All'}
        </button>
        {SECTORS.map(s => (
          <button key={s.id} onClick={() => setFilter(s.id)}
            className="px-3 py-1 rounded-full text-[11px] font-bold border transition-colors"
            style={{ borderColor: filter === s.id ? s.color : 'rgba(255,255,255,.12)', color: filter === s.id ? s.color : 'rgba(161,161,170,.9)', background: filter === s.id ? `${s.color}1a` : 'transparent' }}>
            {s.icon} {s.label[lang]}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
        {list.map((u, i) => {
          const s = sec(u.sector);
          return (
            <div key={i} className="rounded-lg border border-zinc-800/70 bg-black/30 p-3 hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold" style={{ background: `${s.color}1f`, color: s.color, border: `1px solid ${s.color}55` }}>
                  {s.icon} {s.label[lang]}
                </span>
                <span className="text-[10px] text-zinc-500">{u.date}</span>
                {u.ref && <span className="text-[10px] text-zinc-600">· {u.ref}</span>}
              </div>
              <div className="text-sm font-bold text-zinc-100">{u.title}</div>
              <div className="text-[11px] text-zinc-400 leading-relaxed">{u.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpdatesSection;
