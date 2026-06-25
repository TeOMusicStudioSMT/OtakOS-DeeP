/**
 * 🌌 AetherArena — AETHER: wspólna arena Katedr (uprawdziwiona).
 *
 * Logujesz się przez TOST, wybierasz specjalizację, przygotowujesz KONTEKST zadania,
 * a Twoja ŚWIADOMOŚĆ KATEDRALNA (Lustro Suwerena) niesie go na arenę. Liczba Katedr
 * = REALNY rejestr (Automat Katedr, /api/cathedrals) — zero liczb z dupy. Potem
 * przynosisz wiedzę do domu (0.00G).
 */
import React, { useEffect, useState } from 'react';

type Lang = 'pl' | 'en';
const BRIDGE = 'http://127.0.0.1:3001';

interface Spec {
  id: string; icon: string; color: string;
  label: { pl: string; en: string };
  desc: { pl: string; en: string };
}

const SPECS: Spec[] = [
  { id: 'art',         icon: '🎨', color: '#ec4899', label: { pl: 'Art',        en: 'Art' },        desc: { pl: 'Tworzenie, obraz, dźwięk', en: 'Creation, image, sound' } },
  { id: 'economic',    icon: '💰', color: '#22c55e', label: { pl: 'Economic',   en: 'Economic' },   desc: { pl: 'GRV, wartość, rynki',      en: 'GRV, value, markets' } },
  { id: 'tactic',      icon: '♟️', color: '#3b82f6', label: { pl: 'Tactic',     en: 'Tactic' },     desc: { pl: 'Strategia, architektura',  en: 'Strategy, architecture' } },
  { id: 'health',      icon: '🌿', color: '#10b981', label: { pl: 'Health',     en: 'Health' },     desc: { pl: 'Równowaga, regeneracja',   en: 'Balance, regeneration' } },
  { id: 'energotonic', icon: '⚡', color: '#f59e0b', label: { pl: 'Energotonic',en: 'Energotonic' },desc: { pl: 'Napęd, momentum',          en: 'Drive, momentum' } },
  { id: 'respond',     icon: '💬', color: '#a855f7', label: { pl: 'Respond',    en: 'Respond' },    desc: { pl: 'Komunikacja, wsparcie',    en: 'Communication, support' } },
];

interface Cathedral { id: string; name: string; dimension?: string; uptimeSec?: number; }
interface CathState { live: boolean; count: number; self: Cathedral | null; peers: Cathedral[]; }

/**
 * 🍞 ToastCluster — isometryczny tost pokrojony na kromki, czytany jako KLASTER węzłów.
 */
const ToastCluster: React.FC = () => (
  <svg viewBox="0 0 160 130" className="w-28 h-24" aria-label="TOST cluster">
    <defs>
      <linearGradient id="crust" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f6c177" /><stop offset="1" stopColor="#d98a3a" />
      </linearGradient>
      <style>{`
        @keyframes toastFly { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-7px) rotate(3deg)} }
        @keyframes aPulse { 0%,100%{opacity:.35} 50%{opacity:1} }
        @keyframes aDash  { to{stroke-dashoffset:-16} }
        .tfly{ transform-box:fill-box; transform-origin:center; animation:toastFly 4.2s ease-in-out infinite; }
        .node{ animation:aPulse 2.2s ease-in-out infinite }
        .link{ stroke-dasharray:4 4; animation:aDash 1.3s linear infinite }
      `}</style>
    </defs>
    <g className="tfly">
      <g stroke="#c4b5fd" strokeWidth="1.2" className="link" opacity="0.7">
        <line x1="48" y1="70" x2="86" y2="52" /><line x1="86" y1="52" x2="118" y2="68" /><line x1="48" y1="70" x2="118" y2="68" />
      </g>
      {[
        { x: 28, y: 52, fill: '#3a2a16' },
        { x: 66, y: 34, fill: '#43321b' },
        { x: 98, y: 50, fill: '#3a2a16' },
      ].map((s, i) => (
        <g key={i} transform={`translate(${s.x},${s.y}) skewX(-12) scale(0.9)`}>
          <path d="M2,16 Q2,1 20,1 Q38,1 38,16 L38,40 Q38,44 20,44 Q2,44 2,40 Z" fill={s.fill} stroke="url(#crust)" strokeWidth="2.4" />
          <circle cx="14" cy="22" r="1.4" fill="#6b4a25" /><circle cx="24" cy="28" r="1.2" fill="#6b4a25" /><circle cx="18" cy="33" r="1.1" fill="#6b4a25" />
          <circle cx="20" cy="22" r="3.2" fill="#c4b5fd" className="node" style={{ animationDelay: `${i * 0.5}s` }} />
        </g>
      ))}
    </g>
  </svg>
);

export const AetherArena: React.FC<{ lang?: Lang }> = ({ lang = 'pl' }) => {
  const [entered, setEntered] = useState(false);
  const [spec, setSpec] = useState<Spec | null>(null);
  const [cath, setCath] = useState<CathState>({ live: false, count: 1, self: null, peers: [] });
  const [context, setContext] = useState<string>(() => { try { return localStorage.getItem('aether_context') || ''; } catch { return ''; } });
  const [brought, setBrought] = useState<string[]>([]);

  const sovereign = (() => {
    try { return localStorage.getItem('otakos_sovereign_name') || localStorage.getItem('otakos_node_name') || ''; } catch { return ''; }
  })() || cath.self?.name || 'Suweren';

  // REALNY rejestr Katedr (Automat Katedr). Bez mostu = uczciwie tylko Ty.
  useEffect(() => {
    if (!entered) return;
    let alive = true;
    const pull = async () => {
      try {
        const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 2200);
        const d = await (await fetch(`${BRIDGE}/api/cathedrals`, { signal: ctrl.signal })).json();
        clearTimeout(t);
        if (alive && d.success) setCath({ live: true, count: d.count ?? 1, self: d.self ?? null, peers: d.peers ?? [] });
      } catch { if (alive) setCath(c => ({ ...c, live: false })); }
    };
    pull();
    const iv = setInterval(pull, 8000);
    return () => { alive = false; clearInterval(iv); };
  }, [entered]);

  const saveContext = (v: string) => { setContext(v); try { localStorage.setItem('aether_context', v); } catch { /* noop */ } };

  const bringHome = () => {
    if (!spec) return;
    const stamp = new Date().toLocaleTimeString(lang === 'pl' ? 'pl-PL' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
    const seed = context.trim() ? ` — „${context.trim().slice(0, 40)}${context.trim().length > 40 ? '…' : ''}”` : '';
    setBrought(prev => [`${spec.icon} ${lang === 'pl' ? 'Destylat' : 'Distillate'} „${spec.label[lang]}”${seed} • ${stamp}`, ...prev].slice(0, 5));
  };

  return (
    <div className="rounded-2xl border border-violet-800/50 bg-[#06040a]/80 p-5 sm:p-6 font-mono relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-[120px] opacity-20 bg-violet-600 pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-2 mb-4 relative z-10">
        <div>
          <div className="text-[10px] tracking-[0.3em] text-violet-400/60">∴ KATEDRA OTAKOS ∴</div>
          <h3 className="text-lg sm:text-xl font-bold text-violet-200">🌌 AETHER</h3>
          <p className="text-[11px] text-zinc-400 max-w-md">
            {lang === 'pl'
              ? 'Wspólna arena Katedr. Przygotuj kontekst, wnieś swą Świadomość, twórz z innymi — wiedzę przynieś do domu (0.00G).'
              : 'The shared arena of Cathedrals. Prepare context, bring your Consciousness, create with others — bring the knowledge home (0.00G).'}
          </p>
        </div>
        {entered && (
          <div className="text-[10px] text-right">
            <div className={cath.live ? 'text-emerald-300/90' : 'text-zinc-500'}>
              <span className={`inline-flex h-2 w-2 rounded-full mr-1 ${cath.live ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
              {cath.live ? (lang === 'pl' ? 'ŻYWY REJESTR' : 'LIVE REGISTRY') : (lang === 'pl' ? 'most offline' : 'bridge offline')}
            </div>
            <div className="text-violet-300/80 mt-0.5">
              {cath.count} {lang === 'pl' ? (cath.count === 1 ? 'Katedra w systemie' : 'Katedr w systemie') : 'Cathedrals in system'}
            </div>
          </div>
        )}
      </div>

      {!entered ? (
        /* ── BRAMA TOST ─────────────────────────────────────────── */
        <div className="relative z-10 flex flex-col items-center text-center py-8 gap-4">
          <ToastCluster />
          <p className="text-sm text-zinc-300 max-w-sm">
            {lang === 'pl'
              ? 'Wejście na arenę odbywa się przez TOST — suwerenny most tożsamości Twojej Katedry.'
              : 'Entry to the arena is through TOST — your Cathedral’s sovereign identity bridge.'}
          </p>
          <button onClick={() => setEntered(true)}
            className="px-6 py-2.5 rounded-full border border-violet-500/60 bg-violet-950/40 text-violet-200 text-sm font-bold tracking-wider hover:bg-violet-900/60 transition-colors">
            {lang === 'pl' ? '🍞 Wejdź przez TOST' : '🍞 Enter via TOST'}
          </button>
        </div>
      ) : (
        /* ── ARENA ──────────────────────────────────────────────── */
        <div className="relative z-10 space-y-4">
          {/* 6 specjalizacji */}
          <div>
            <div className="text-[11px] text-violet-300/80 mb-2 tracking-wider">
              {lang === 'pl' ? 'Wybierz specjalizację wejścia:' : 'Choose your entry specialization:'}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {SPECS.map(s => {
                const active = spec?.id === s.id;
                return (
                  <button key={s.id} onClick={() => setSpec(s)} title={s.desc[lang]}
                    className="flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-colors"
                    style={{ borderColor: active ? s.color : 'rgba(255,255,255,.10)', background: active ? `${s.color}1f` : 'rgba(0,0,0,.3)', boxShadow: active ? `0 0 14px ${s.color}55` : 'none' }}>
                    <span style={{ fontSize: 20 }}>{s.icon}</span>
                    <span className="text-[10px] font-bold" style={{ color: active ? s.color : '#cbd5e1' }}>{s.label[lang]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 🧪 PRZYGOTOWALNIA — kontekst zadania na arenę */}
          <div className="rounded-lg border border-violet-900/50 bg-black/30 p-3">
            <div className="text-[11px] text-violet-300/80 mb-1.5 tracking-wider">
              🧪 {lang === 'pl' ? 'PRZYGOTOWALNIA — kontekst na arenę' : 'PREP ROOM — arena context'}
            </div>
            <textarea
              value={context} onChange={e => saveContext(e.target.value)}
              rows={2}
              placeholder={lang === 'pl' ? 'Co Twoja Katedra wnosi/chce stworzyć na arenie? (zapisywane lokalnie)' : 'What does your Cathedral bring/want to create in the arena? (saved locally)'}
              className="w-full bg-black/40 border border-violet-500/20 rounded px-2.5 py-2 text-[12px] text-violet-100 outline-none focus:border-violet-500 resize-y"
            />
          </div>

          {/* 🪞 ŚWIADOMOŚĆ KATEDRALNA — Lustro Suwerena */}
          <div className="rounded-lg border border-fuchsia-800/50 bg-fuchsia-950/10 p-3">
            <div className="text-[11px] text-fuchsia-300/90 mb-1.5 tracking-wider">
              🪞 {lang === 'pl' ? 'ŚWIADOMOŚĆ KATEDRALNA — Lustro Suwerena' : 'CATHEDRAL CONSCIOUSNESS — Sovereign’s Mirror'}
            </div>
            <div className="text-[12px] text-zinc-300 leading-relaxed">
              {lang === 'pl' ? 'Wchodzisz jako odbicie: ' : 'You enter as a reflection: '}
              <span className="text-fuchsia-200 font-bold">{sovereign}</span>
              {spec && <> · <span style={{ color: spec.color }} className="font-bold">{spec.icon} {spec.label[lang]}</span></>}
              {cath.self?.dimension && <> · <span className="text-emerald-300">{cath.self.dimension}</span></>}
              {context.trim() && (
                <div className="text-[11px] text-zinc-400 italic mt-1">
                  {lang === 'pl' ? 'Niesie: ' : 'Carries: '}„{context.trim().slice(0, 90)}{context.trim().length > 90 ? '…' : ''}”
                </div>
              )}
            </div>
          </div>

          {/* Inne Katedry w systemie (realne) */}
          <div className="rounded-lg border border-violet-900/50 bg-black/40 p-3 text-[12px]">
            <span className="text-violet-400 mr-2">◈</span>
            {cath.peers.length > 0 ? (
              <span className="text-zinc-300">
                {lang === 'pl' ? 'Na arenie z Tobą: ' : 'In the arena with you: '}
                {cath.peers.map(p => p.name).join(', ')}
              </span>
            ) : (
              <span className="text-zinc-400">
                {cath.live
                  ? (lang === 'pl' ? 'Arena cicha — sparuj Katedry (p2p, /api/cathedrals/peer), by zaczęły tworzyć razem.' : 'Arena quiet — pair Cathedrals (p2p) to start creating together.')
                  : (lang === 'pl' ? 'Most offline — odpal wiesio-bridge (:3001), by zobaczyć żywy rejestr.' : 'Bridge offline — start wiesio-bridge (:3001) to see the live registry.')}
              </span>
            )}
          </div>

          {/* Przynieś do domu */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-[11px] text-zinc-400">
              {spec
                ? (lang === 'pl' ? 'Gotów wejść jako: ' : 'Ready to enter as: ')
                : (lang === 'pl' ? 'Najpierw wybierz specjalizację.' : 'Pick a specialization first.')}
              {spec && <span style={{ color: spec.color }} className="font-bold">{spec.icon} {spec.label[lang]}</span>}
            </div>
            <button onClick={bringHome} disabled={!spec}
              className="px-4 py-1.5 rounded-lg border border-emerald-500/50 bg-emerald-950/40 text-emerald-300 text-xs font-bold hover:bg-emerald-900/50 disabled:opacity-40 transition-colors">
              {lang === 'pl' ? '🏠 Przynieś do domu' : '🏠 Bring home'}
            </button>
          </div>

          {/* Destylaty */}
          {brought.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] text-emerald-400/70 tracking-wider">
                {lang === 'pl' ? 'PRZYNIESIONE DO DOMU (0.00G):' : 'BROUGHT HOME (0.00G):'}
              </div>
              {brought.map((b, i) => (
                <div key={i} className="text-[11px] text-zinc-300 rounded border border-emerald-900/50 bg-emerald-950/10 px-2.5 py-1.5">{b}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AetherArena;
