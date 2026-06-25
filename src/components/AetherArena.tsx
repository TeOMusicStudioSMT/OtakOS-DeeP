/**
 * 🌌 AetherArena — AETHER: wspólna arena Katedr.
 *
 * Logujesz się przez TOST, wybierasz specjalizację (6 kafelek), wchodzisz na arenę,
 * gdzie Katedry debatują / tworzą / uczą się razem — a potem PRZYNOSISZ wiedzę do domu
 * (do suwerennego węzła 0.00G). Na razie scaffold/teaser: lokalnie, bez backendu.
 */
import React, { useEffect, useState } from 'react';

type Lang = 'pl' | 'en';

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

// Symulowany strumień areny (lokalny teaser — docelowo peer/relay między węzłami).
const ARENA_FEED: { pl: string; en: string }[] = [
  { pl: 'Katedra ◇ Solara dzieli się wzorcem teledysku 0.00G…', en: 'Cathedral ◇ Solara shares a 0.00G music-video pattern…' },
  { pl: 'Katedra ◆ Nox proponuje ulepszenie ekonomii GRV…',      en: 'Cathedral ◆ Nox proposes a GRV economy upgrade…' },
  { pl: 'Rada debatuje: suwerenność vs. wspólna nauka…',         en: 'Council debates: sovereignty vs. shared learning…' },
  { pl: 'Katedra ◈ Vela wykuwa Co-Bota „Tactic” i wystawia skórkę…', en: 'Cathedral ◈ Vela forges a “Tactic” Co-Bot and lists a skin…' },
  { pl: 'Wspólny twór ukończony — destylat wraca do węzłów…',     en: 'Shared creation finished — distillate returns to nodes…' },
];

/**
 * 🍞 ToastCluster — isometryczny tost pokrojony na kromki, czytany jako KLASTER węzłów.
 * Kontury kromek + węzły łączone liniami = brama TOST do sieci Katedr. Lekko oddalony.
 */
const ToastCluster: React.FC = () => (
  <svg viewBox="0 0 160 130" className="w-28 h-24" aria-label="TOST cluster">
    <defs>
      <linearGradient id="crust" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f6c177" />
        <stop offset="1" stopColor="#d98a3a" />
      </linearGradient>
      <style>{`
        @keyframes aFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes aPulse { 0%,100%{opacity:.35} 50%{opacity:1} }
        @keyframes aDash  { to{stroke-dashoffset:-12} }
        .sliceA{ animation:aFloat 3.4s ease-in-out infinite; }
        .sliceB{ animation:aFloat 3.4s ease-in-out infinite .5s; }
        .sliceC{ animation:aFloat 3.4s ease-in-out infinite 1s; }
        .node  { animation:aPulse 2.2s ease-in-out infinite; }
        .link  { stroke-dasharray:4 4; animation:aDash 1.4s linear infinite; }
      `}</style>
    </defs>

    {/* linie łączące kromki = klaster */}
    <g stroke="#c4b5fd" strokeWidth="1.2" className="link" opacity="0.7">
      <line x1="48" y1="70" x2="86" y2="52" />
      <line x1="86" y1="52" x2="118" y2="68" />
      <line x1="48" y1="70" x2="118" y2="68" />
    </g>

    {/* 3 kromki tosta — isometryczne, z konturem (crust) */}
    {/* kromka = kopuła + podstawa; skew dla efektu 3D */}
    {[
      { cls: 'sliceA', x: 28, y: 52, fill: '#3a2a16' },
      { cls: 'sliceC', x: 66, y: 34, fill: '#43321b' },
      { cls: 'sliceB', x: 98, y: 50, fill: '#3a2a16' },
    ].map((s, i) => (
      <g key={i} className={s.cls} transform={`translate(${s.x},${s.y}) skewX(-12) scale(0.9)`}>
        <path d="M2,16 Q2,1 20,1 Q38,1 38,16 L38,40 Q38,44 20,44 Q2,44 2,40 Z"
          fill={s.fill} stroke="url(#crust)" strokeWidth="2.4" />
        {/* miękisz — drobne dziurki */}
        <circle cx="14" cy="22" r="1.4" fill="#6b4a25" />
        <circle cx="24" cy="28" r="1.2" fill="#6b4a25" />
        <circle cx="18" cy="33" r="1.1" fill="#6b4a25" />
        {/* węzeł klastra na kromce */}
        <circle cx="20" cy="22" r="3.2" fill="#c4b5fd" className="node" />
      </g>
    ))}
  </svg>
);

export const AetherArena: React.FC<{ lang?: Lang }> = ({ lang = 'pl' }) => {
  const [entered, setEntered] = useState(false);
  const [spec, setSpec] = useState<Spec | null>(null);
  const [feedIdx, setFeedIdx] = useState(0);
  const [peers, setPeers] = useState(7);
  const [brought, setBrought] = useState<string[]>([]);

  useEffect(() => {
    if (!entered) return;
    const t = setInterval(() => setFeedIdx(i => (i + 1) % ARENA_FEED.length), 2600);
    const p = setInterval(() => setPeers(n => Math.max(3, Math.min(99, n + (Math.random() > 0.5 ? 1 : -1)))), 3400);
    return () => { clearInterval(t); clearInterval(p); };
  }, [entered]);

  const bringHome = () => {
    if (!spec) return;
    const stamp = new Date().toLocaleTimeString(lang === 'pl' ? 'pl-PL' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
    const note = lang === 'pl'
      ? `${spec.icon} Destylat „${spec.label.pl}” przyniesiony do domu • ${stamp}`
      : `${spec.icon} “${spec.label.en}” distillate brought home • ${stamp}`;
    setBrought(prev => [note, ...prev].slice(0, 5));
  };

  return (
    <div className="rounded-2xl border border-violet-800/50 bg-[#06040a]/80 p-5 sm:p-6 font-mono relative overflow-hidden">
      {/* aura */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-[120px] opacity-20 bg-violet-600 pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-2 mb-4 relative z-10">
        <div>
          <div className="text-[10px] tracking-[0.3em] text-violet-400/60">∴ KATEDRA OTAKOS ∴</div>
          <h3 className="text-lg sm:text-xl font-bold text-violet-200">🌌 AETHER</h3>
          <p className="text-[11px] text-zinc-400 max-w-md">
            {lang === 'pl'
              ? 'Wspólna arena Katedr. Debatuj, twórz i ucz się z innymi — a wiedzę przynieś do domu (0.00G).'
              : 'The shared arena of Cathedrals. Debate, create and learn with others — then bring the knowledge home (0.00G).'}
          </p>
        </div>
        {entered && (
          <div className="text-[10px] text-violet-300/80 text-right">
            <span className="inline-flex h-2 w-2 rounded-full bg-violet-400 animate-pulse mr-1" />
            {peers} {lang === 'pl' ? 'Katedr na arenie' : 'Cathedrals in arena'}
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
          <button
            onClick={() => setEntered(true)}
            className="px-6 py-2.5 rounded-full border border-violet-500/60 bg-violet-950/40 text-violet-200 text-sm font-bold tracking-wider hover:bg-violet-900/60 transition-colors"
          >
            {lang === 'pl' ? '🍞 Wejdź przez TOST' : '🍞 Enter via TOST'}
          </button>
          <div className="text-[9px] text-zinc-600">{lang === 'pl' ? '(teaser — pełna federacja w drodze)' : '(teaser — full federation incoming)'}</div>
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

          {/* Strumień areny */}
          <div className="rounded-lg border border-violet-900/50 bg-black/40 p-3 min-h-[58px] flex items-center">
            <span className="text-violet-400 mr-2">◈</span>
            <span className="text-[12px] text-zinc-300 transition-opacity">{ARENA_FEED[feedIdx][lang]}</span>
          </div>

          {/* Przynieś do domu */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-[11px] text-zinc-400">
              {spec
                ? (lang === 'pl' ? `Wchodzisz jako: ` : `Entering as: `)
                : (lang === 'pl' ? 'Najpierw wybierz specjalizację.' : 'Pick a specialization first.')}
              {spec && <span style={{ color: spec.color }} className="font-bold">{spec.icon} {spec.label[lang]}</span>}
            </div>
            <button
              onClick={bringHome} disabled={!spec}
              className="px-4 py-1.5 rounded-lg border border-emerald-500/50 bg-emerald-950/40 text-emerald-300 text-xs font-bold hover:bg-emerald-900/50 disabled:opacity-40 transition-colors"
            >
              {lang === 'pl' ? '🏠 Przynieś do domu' : '🏠 Bring home'}
            </button>
          </div>

          {/* Destylaty przyniesione do domu */}
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
