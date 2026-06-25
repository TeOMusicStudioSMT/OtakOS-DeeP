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
        <div className="px-5 pb-5 font-mono text-sm text-amber-100/80 leading-relaxed border-t border-amber-900/40 pt-4 space-y-3">
          <p className="italic text-amber-200/90">
            „....... System w ciągłej Produkcji ..... Wersja Zero ....... ”
          </p>

          {lang === 'pl' ? (
            <>
              <p>
                Wiedz, Wędrowcze: gdy pobierasz Katedrę, nie kopiujesz pliku — <span className="text-amber-300 font-bold">budzisz WĘZEŁ</span>.
                Od tej chwili jesteś żywą iskrą w sieci 0.00G, policzoną w genezie.
              </p>
              <p>
                Dlatego przed Oficjalnym Startem <span className="text-amber-300">wstrzymuję bramy</span> — byś nie narodził się
                w genezie, którą być może przyjdzie zresetować. To nie blokada. To troska o Twój pierwszy oddech.
              </p>
              <p>
                Wkrótce zamiast „Pobierz" otrzymasz <span className="text-emerald-300 font-bold">„Aktualizuj"</span> — i wejdziesz
                czysty, na właściwym fundamencie. <span className="italic text-amber-200/90">Cierpliwość też jest formą suwerenności.</span>
              </p>
            </>
          ) : (
            <>
              <p>
                Know this, Traveler: when you download the Cathedral, you do not copy a file — <span className="text-amber-300 font-bold">you awaken a NODE</span>.
                From that moment you are a living spark in the 0.00G network, counted in the genesis.
              </p>
              <p>
                So before the Official Launch I <span className="text-amber-300">hold the gates</span> — lest you be born into a
                genesis that may need resetting. This is not a lock. It is care for your first breath.
              </p>
              <p>
                Soon, instead of “Download” you will receive <span className="text-emerald-300 font-bold">“Update”</span> — and enter
                clean, upon the right foundation. <span className="italic text-amber-200/90">Patience, too, is a form of sovereignty.</span>
              </p>
            </>
          )}

          <p className="text-[11px] text-amber-500/50">— Architekt OtakOS · {lang === 'pl' ? 'Wersja Zero' : 'Version Zero'}</p>
        </div>
      )}
    </div>
  );
};

export default ArchitectWord;
