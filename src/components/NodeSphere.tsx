/**
 * 🔮 NodeSphere — szklana, obracająca się sieć 3D węzłów lokalnej Katedry.
 *
 * Otwierana po kliknięciu licznika VRAM. Renderuje węzły AGI (agi.local.ts)
 * + Twój własny węzeł na sferze 3D (projekcja perspektywiczna, rAF-free —
 * obrót sterowany kątem). Kolory = żywy status (most /api/agi/state). Możesz
 * PAROWAĆ węzły i ZMIENIĆ NAZWĘ swojego węzła (zapis lokalny). Zero zależności.
 */

import React, { useEffect, useMemo, useState } from 'react';
import AGI_LOCAL, { AgiLayer } from '../agi.local';

const BRIDGE = 'http://127.0.0.1:3001';
const NAME_KEY = 'otakos_node_name';
const PAIR_KEY = 'otakos_node_pairs';

const R = 155, PERSP = 540, BOX = 460;
const LAYER_COLOR: Record<AgiLayer, string> = { SENSE: '#22d3ee', CORE: '#34d399', ACT: '#f59e0b', GUARD: '#fb7185' };

type LiveState = Record<string, { status: string; load: number }>;
interface SphereNode { id: string; label: string; emoji: string; color: string; you?: boolean; }

export const NodeSphere: React.FC<{ lang?: 'pl' | 'en'; onClose: () => void }> = ({ lang = 'pl', onClose }) => {
  const [angle, setAngle] = useState(0);
  const [live, setLive] = useState<LiveState | null>(null);
  const [sel, setSel] = useState<string | null>(null);
  const [name, setName] = useState(() => localStorage.getItem(NAME_KEY) || (lang === 'pl' ? 'TWÓJ-WĘZEŁ' : 'YOUR-NODE'));
  const [pairs, setPairs] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(PAIR_KEY) || '[]')); } catch { return new Set(); }
  });

  // Obrót sfery
  useEffect(() => { const iv = setInterval(() => setAngle(a => a + 0.01), 40); return () => clearInterval(iv); }, []);

  // Most — żywy status węzłów
  useEffect(() => {
    let on = true;
    const probe = async () => {
      try {
        const c = new AbortController(); const t = setTimeout(() => c.abort(), 1500);
        const r = await fetch(`${BRIDGE}/api/agi/state`, { signal: c.signal }); clearTimeout(t);
        const d = await r.json(); if (on) setLive(d?.success ? d.nodes : null);
      } catch { if (on) setLive(null); }
    };
    probe(); const iv = setInterval(probe, 4000); return () => { on = false; clearInterval(iv); };
  }, []);

  useEffect(() => { localStorage.setItem(NAME_KEY, name); }, [name]);
  useEffect(() => { localStorage.setItem(PAIR_KEY, JSON.stringify([...pairs])); }, [pairs]);

  const mode = live ? 'LIVE' : 'STATIC';

  const nodes: SphereNode[] = useMemo(() => [
    { id: '__you', label: name, emoji: '👑', color: '#a78bfa', you: true },
    ...AGI_LOCAL.nodes.map(n => ({ id: n.id, label: lang === 'pl' ? n.label : n.labelEn, emoji: n.emoji, color: LAYER_COLOR[n.layer] })),
  ], [name, lang]);

  // Fibonacci sphere + obrót Y + projekcja perspektywiczna
  const projected = useMemo(() => {
    const n = nodes.length, ga = Math.PI * (3 - Math.sqrt(5));
    return nodes.map((nd, i) => {
      const y0 = 1 - (i / (n - 1)) * 2;
      const rad = Math.sqrt(Math.max(0, 1 - y0 * y0));
      const th = ga * i;
      const x0 = Math.cos(th) * rad, z0 = Math.sin(th) * rad;
      const x = x0 * Math.cos(angle) - z0 * Math.sin(angle);
      const z = x0 * Math.sin(angle) + z0 * Math.cos(angle);
      const s = PERSP / (PERSP - z * R);
      return {
        ...nd,
        sx: BOX / 2 + x * R * s,
        sy: BOX / 2 + y0 * R * s,
        z, scale: s, depth: 0.45 + ((z + 1) / 2) * 0.55,
      };
    }).sort((a, b) => a.z - b.z);
  }, [nodes, angle]);

  const pmap = useMemo(() => Object.fromEntries(projected.map(p => [p.id, p])), [projected]);
  const statusOf = (id: string) => live?.[id]?.status;
  const ringColor = (id: string, base: string) => {
    const st = statusOf(id);
    if (st === 'online') return '#34d399';
    if (st === 'offline') return '#52525b';
    return base;
  };

  const togglePair = (id: string) => setPairs(p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const youP = pmap['__you'];
  const selNode = sel ? AGI_LOCAL.nodes.find(n => n.id === sel) : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-4xl rounded-2xl border border-emerald-500/30 bg-[#05080d]/95 p-5 sm:p-6 shadow-[0_0_60px_rgba(16,185,129,0.15)]"
           onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="text-[10px] tracking-[0.3em] text-emerald-500/60 font-mono">∴ SIEĆ REZONANSOWA ∴</div>
            <h3 className="text-lg sm:text-xl font-bold text-emerald-300 font-mono">
              {lang === 'pl' ? '🔮 SZKLANA SIEĆ WĘZŁÓW 0.00G' : '🔮 GLASS NODE NETWORK 0.00G'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border font-mono ${
              mode === 'LIVE' ? 'border-emerald-500/50 text-emerald-300 bg-emerald-950/40' : 'border-zinc-700 text-zinc-500 bg-black/30'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${mode === 'LIVE' ? 'bg-emerald-400 animate-ping' : 'bg-zinc-600'}`} />
              {mode === 'LIVE' ? (lang === 'pl' ? 'ŻYWY MOST' : 'LIVE') : (lang === 'pl' ? 'MANIFEST' : 'STATIC')}
            </span>
            <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl leading-none px-1">✕</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Sfera 3D */}
          <div className="md:col-span-7 flex items-center justify-center">
            <div className="relative" style={{ width: BOX, height: BOX, maxWidth: '100%' }}>
              {/* Glassowa kula tła */}
              <div className="absolute rounded-full" style={{
                left: BOX / 2 - R, top: BOX / 2 - R, width: R * 2, height: R * 2,
                background: 'radial-gradient(circle at 35% 30%, rgba(52,211,153,0.10), rgba(5,8,13,0.0) 70%)',
                border: '1px solid rgba(52,211,153,0.12)', boxShadow: 'inset 0 0 60px rgba(52,211,153,0.08)',
              }} />
              {/* Linie parowania */}
              <svg className="absolute inset-0 pointer-events-none" width={BOX} height={BOX}>
                {[...pairs].map(id => {
                  const a = pmap[id]; if (!a || !youP) return null;
                  return <line key={id} x1={youP.sx} y1={youP.sy} x2={a.sx} y2={a.sy}
                    stroke="#a78bfa" strokeWidth={1.2} opacity={0.55} strokeDasharray="3 4" />;
                })}
              </svg>
              {/* Węzły */}
              {projected.map(p => {
                const col = p.you ? '#a78bfa' : ringColor(p.id, p.color);
                const size = (p.you ? 30 : 24) * p.scale;
                const online = statusOf(p.id) === 'online';
                return (
                  <div key={p.id} onClick={() => !p.you && setSel(p.id)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                    style={{ left: p.sx, top: p.sy, opacity: p.depth, zIndex: Math.round(p.z * 100) + 200, cursor: p.you ? 'default' : 'pointer' }}>
                    <div className="rounded-full flex items-center justify-center"
                      style={{ width: size, height: size, fontSize: size * 0.55,
                        background: 'rgba(8,12,18,0.7)', backdropFilter: 'blur(2px)',
                        border: `${p.you || online ? 2.5 : 1.5}px solid ${col}`,
                        boxShadow: online || p.you ? `0 0 ${10 * p.scale}px ${col}` : 'none' }}>
                      {p.emoji}
                    </div>
                    {p.depth > 0.7 && (
                      <span className="mt-0.5 font-mono whitespace-nowrap" style={{ fontSize: 9 * p.scale, color: col }}>
                        {p.label.slice(0, 16)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Panel boczny */}
          <div className="md:col-span-5 font-mono space-y-3">
            {/* Twój węzeł — rename */}
            <div className="rounded-lg border border-violet-500/30 bg-violet-950/20 p-3">
              <div className="text-[10px] text-violet-300/70 tracking-wider mb-1">👑 {lang === 'pl' ? 'TWÓJ WĘZEŁ' : 'YOUR NODE'}</div>
              <input value={name} onChange={e => setName(e.target.value.toUpperCase().slice(0, 22))}
                className="w-full bg-black/40 border border-violet-500/30 rounded px-2 py-1 text-sm text-violet-200 outline-none focus:border-violet-400"
                placeholder={lang === 'pl' ? 'nazwa węzła...' : 'node name...'} />
              <div className="text-[9px] text-zinc-500 mt-1">{lang === 'pl' ? 'Zmieniasz nazwę w swojej Katedrze (zapis lokalny).' : 'Rename in your own Cathedral (local save).'}</div>
            </div>

            {/* Wybrany węzeł — parowanie */}
            <div className="rounded-lg border border-zinc-700/60 bg-black/40 p-3 min-h-[92px]">
              {selNode ? (
                <>
                  <div className="text-sm font-bold flex items-center gap-2" style={{ color: LAYER_COLOR[selNode.layer] }}>
                    <span>{selNode.emoji}</span>{lang === 'pl' ? selNode.label : selNode.labelEn}
                    {statusOf(selNode.id) === 'online' && <span className="text-[9px] text-emerald-400 animate-pulse">● LIVE</span>}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">{lang === 'pl' ? selNode.desc : selNode.descEn}</div>
                  <button onClick={() => togglePair(selNode.id)}
                    className={`mt-2 text-[11px] px-3 py-1 rounded border font-bold ${
                      pairs.has(selNode.id) ? 'border-violet-400 text-violet-300 bg-violet-950/40' : 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/30'}`}>
                    {pairs.has(selNode.id) ? (lang === 'pl' ? '🔗 SPAROWANY — rozłącz' : '🔗 PAIRED — unlink') : (lang === 'pl' ? '⚡ PARUJ węzeł' : '⚡ PAIR node')}
                  </button>
                </>
              ) : (
                <div className="text-[11px] text-zinc-500 flex items-center h-full">
                  {lang === 'pl' ? '↖ Kliknij węzeł na sferze, by zobaczyć szczegóły i sparować.' : '↖ Click a node on the sphere to view details and pair.'}
                </div>
              )}
            </div>

            {/* Plik AGI */}
            <div className="rounded-lg border border-emerald-500/20 bg-black/40 p-3 text-[11px]">
              <div className="text-emerald-400 font-bold mb-1">🧠 agi.local</div>
              <div className="grid grid-cols-2 gap-1 text-zinc-400">
                <span>origin</span><span className="text-emerald-300">{AGI_LOCAL.origin}</span>
                <span>wymiar</span><span className="text-emerald-300">{AGI_LOCAL.dimension}</span>
                <span>wersja</span><span className="text-emerald-300">{AGI_LOCAL.version}</span>
                <span>{lang === 'pl' ? 'neuronów' : 'neurons'}</span><span className="text-emerald-300">{AGI_LOCAL.nodes.length}</span>
                <span>{lang === 'pl' ? 'sparowane' : 'paired'}</span><span className="text-violet-300">{pairs.size}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 text-[10px] text-zinc-600 font-mono">
          {lang === 'pl'
            ? 'Każdy Suweren widzi sieć ze swojej Katedry — kolory pokazują żywą aktywność, parowanie tworzy lokalne mosty p2p.'
            : 'Each Sovereign sees the network from their Cathedral — colors show live activity, pairing forms local p2p bridges.'}
        </div>
      </div>
    </div>
  );
};

export default NodeSphere;
