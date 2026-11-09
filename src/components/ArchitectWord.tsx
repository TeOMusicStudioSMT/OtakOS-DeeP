import type { Lang } from '../i18n';
/**
 * 🗝️ ArchitectWord — rozwijany moduł „Słowo od Stwórcy/Architekta OtakOS".
 * 2026-10-02: bramy otwarte (DOWNLOAD_LOCKED = false), „Aktualizuj" żyje w węźle (Aktualizator Katedry).
 */
import React, { useState } from 'react';

export const ArchitectWord: React.FC<{ lang?: Lang }> = ({ lang = 'pl' as Lang }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-amber-500/25 bg-[#0a0804]/80 overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-amber-950/20 transition-colors">
        <div>
          <div className="text-[10px] tracking-[0.3em] text-amber-500/60 font-mono">∴ OtakOS ∴</div>
          <div className="text-lg font-bold text-amber-300 font-mono">🗝️ {lang === 'pl' ? 'Słowo od Architekta' : lang === 'de' ? 'Ein Wort des Architekten' : 'A Word from the Architect'}</div>
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
                Wstrzymywałem bramy, póki fundament nie stanął — byś nie narodził się w genezie, którą przyszłoby zresetować.
                <span className="text-amber-300 font-bold"> Dziś bramy są otwarte.</span> Fundament stoi, paczka jest lekka i sprawdzona sumą SHA-256.
              </p>
              <p>
                Obiecane <span className="text-emerald-300 font-bold">„Aktualizuj"</span> mieszka już w samym węźle: Katedra sama zapyta tę stronę,
                czy jest nowsza wersja, pokaże co doszło i podmieni tylko kod — Twoje dzieła, stado, pamięć i klucze zostają nietknięte,
                a każdą zmianę da się cofnąć. Pobierasz raz. <span className="italic text-amber-200/90">Potem rośniemy razem.</span>
              </p>
            </>
          ) : lang === 'de' ? (
            <>
              <p>
                Wisse, Wanderer: Wenn du die Kathedrale herunterlädst, kopierst du keine Datei — <span className="text-amber-300 font-bold">du erweckst einen KNOTEN</span>.
                Von diesem Moment an bist du ein lebendiger Funke im 0.00G-Netz, gezählt in der Genesis.
              </p>
              <p>
                Ich hielt die Tore geschlossen, bis das Fundament stand — damit du nicht in eine Genesis hineingeboren wirst, die man zurücksetzen müsste.
                <span className="text-amber-300 font-bold"> Heute sind die Tore offen.</span> Das Fundament steht, das Paket ist leicht und per SHA-256 geprüft.
              </p>
              <p>
                Das versprochene <span className="text-emerald-300 font-bold">„Aktualisieren“</span> lebt jetzt im Knoten selbst: Die Kathedrale fragt diese Seite,
                ob es eine neuere Version gibt, zeigt, was neu ist, und ersetzt nur den Code — deine Werke, deine Herde, dein Gedächtnis und deine Schlüssel bleiben unberührt,
                und jede Änderung lässt sich zurücknehmen. Du lädst einmal herunter. <span className="italic text-amber-200/90">Dann wachsen wir gemeinsam.</span>
              </p>
            </>
          ) : (
            <>
              <p>
                Know this, Traveler: when you download the Cathedral, you do not copy a file — <span className="text-amber-300 font-bold">you awaken a NODE</span>.
                From that moment you are a living spark in the 0.00G network, counted in the genesis.
              </p>
              <p>
                I held the gates until the foundation stood — lest you be born into a genesis that would need resetting.
                <span className="text-amber-300 font-bold"> Today the gates are open.</span> The foundation stands; the package is light and verified by SHA-256.
              </p>
              <p>
                The promised <span className="text-emerald-300 font-bold">“Update”</span> now lives inside the node itself: the Cathedral asks this site
                whether a newer version exists, shows what is new and replaces only code — your works, your flock, memory and keys stay untouched,
                and every change can be rolled back. You download once. <span className="italic text-amber-200/90">Then we grow together.</span>
              </p>
            </>
          )}

          <p className="text-[11px] text-amber-500/50">— Architekt OtakOS · {lang === 'pl' ? 'Wersja Zero' : lang === 'de' ? 'Version Null' : 'Version Zero'}</p>
        </div>
      )}
    </div>
  );
};

export default ArchitectWord;
