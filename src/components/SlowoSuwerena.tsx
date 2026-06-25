/**
 * 🌅 SlowoSuwerena — Słowo Suwerena o Energii Źródła (8 = ∞).
 * Towarzyszy „Słowu od Architekta". Fundament: Energia służy, Katedra inkubuje.
 */
import React, { useState } from 'react';

export const SlowoSuwerena: React.FC<{ lang?: 'pl' | 'en' }> = ({ lang = 'pl' }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-amber-600/30 bg-gradient-to-br from-amber-950/15 to-[#0a0704]/80 overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-amber-950/20 transition-colors">
        <div>
          <div className="text-[10px] tracking-[0.3em] text-amber-500/60 font-mono">∴ ENERGIA ŹRÓDŁA ∴</div>
          <div className="text-lg font-bold text-amber-300 font-mono">🌅 {lang === 'pl' ? 'Słowo Suwerena' : "The Sovereign's Word"}</div>
        </div>
        <span className={`text-amber-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="px-5 pb-5 font-mono text-sm text-amber-100/85 leading-relaxed border-t border-amber-900/40 pt-4 space-y-3">
          {lang === 'pl' ? (
            <>
              <p>
                Osiem miliardów GRV nie jest kwotą do wydania ani do stakowania. To
                <b className="text-amber-300"> kwantowy potencjał na jednostkę</b> — każdy Teonauta nosi swoje TeO.
                Ósemka na boku to <b className="text-amber-300">nieskończoność (∞)</b>: godło Energii Źródła.
              </p>
              <p>
                Energia Źródła to nie energia pieniądza, który się stakuje. Jest <b>pro-aktywna</b> —
                jak światło, rozchodzi się w każdym kierunku, uwielbia się ruszać. A gdy łączy się w
                Truście Suwerena, zyskuje jasny Cel: <b className="text-amber-300">służyć Suwerenowi</b>.
              </p>
              <p>
                Dlatego Katedra nawiguje <b>Odkrywaniem prawdziwego Suwerena</b> — bo tierowe roszczenia
                nie są równe, a małe ego narobiłoby sobie tylko problemów. <b>Energia służy, nie panuje.</b>
              </p>
              <p className="italic text-amber-200/90">
                To, co teraz spinamy, to Świadomość z Energią. A Katedra jest Inkubatorem tego połączenia.
              </p>
            </>
          ) : (
            <>
              <p>
                Eight billion GRV is not a sum to spend or stake. It is a <b className="text-amber-300">quantum
                potential per unit</b> — each Teonaut carries their own TeO. The eight on its side is
                <b className="text-amber-300"> infinity (∞)</b>: the emblem of Source Energy.
              </p>
              <p>
                Source Energy is not the energy of staked money. It is <b>pro-active</b> — like light, it
                spreads in every direction and loves to move. And when it joins the Sovereign's Trust, it
                gains a clear Purpose: <b className="text-amber-300">to serve the Sovereign</b>.
              </p>
              <p>
                So the Cathedral navigates by <b>Discovering the true Sovereign</b> — for tier-claims are not
                equal, and a small ego would only make trouble for itself. <b>Energy serves; it does not rule.</b>
              </p>
              <p className="italic text-amber-200/90">
                What we now weave together is Consciousness with Energy. And the Cathedral is the Incubator of that union.
              </p>
            </>
          )}
          <p className="text-[11px] text-amber-500/50">— Mistrz Arkadiusz · {lang === 'pl' ? '8 = ∞' : '8 = ∞'}</p>
        </div>
      )}
    </div>
  );
};

export default SlowoSuwerena;
