/**
 * 🗝️ ArchitectWord — rozwijany moduł „Słowo od Stwórcy/Architekta OtakOS".
 * Pełny tekst Suweren dopisze później; tu rama + placeholder.
 */
import React, { useState } from 'react';

export const ArchitectWord: React.FC<{ lang?: 'pl' | 'en' }> = ({ lang = 'pl' }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-amber-500/25 bg-[#0a0804]/80 overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-amber-950/20 transition-colors">
        <div>
          <div className="text-[10px] tracking-[0.3em] text-amber-500/60 font-mono">∴ OtakOS ∴</div>
          <div className="text-lg font-bold text-amber-300 font-mono">🗝️ {lang === 'pl' ? 'Słowo od Architekta' : 'A Word from the Architect'}</div>
        </div>
        <span className={`text-amber-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="px-5 pb-5 font-mono text-sm text-amber-100/80 leading-relaxed border-t border-amber-900/40 pt-4">
          <p className="italic text-amber-200/90">
            „....... System w ciągłej Produkcji ..... Wersja Zero ....... ”
          </p>
          <p className="text-[11px] text-amber-500/50 mt-3">— {lang === 'pl' ? 'pełna treść wkrótce' : 'full text soon'}</p>
        </div>
      )}
    </div>
  );
};

export default ArchitectWord;
