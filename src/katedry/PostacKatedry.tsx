/**
 * 🏛️ Postać Katedry — avatar Suwerena przy jego wyspie (2026-10-09).
 *
 * Dane z rejestru (/api/katedry → `postac`, oczyszczone w server/rejestr.mjs i drugi raz w wizytowka.ts `postacZ`).
 * Podgląd 3D TYLKO na kliknięcie: three.js dociąga się wtedy osobnym kawałkiem, a w całej stronie żyje najwyżej JEDEN
 * podgląd naraz (otwarcie drugiego zamyka pierwszy). Zamknięcie zwalnia geometrie, materiały, tekstury i kontekst WebGL
 * (dispose + forceContextLoss) — żadnego automatycznego ładowania wielu GLB.
 */
import React, { useEffect, useRef, useState } from 'react';
import type { PostacKatedry } from './wizytowka';

const MAX_GLB = 40 * 1024 * 1024;

export const ZNAK_PLCI: Record<string, string> = { kobieta: '♀', mezczyzna: '♂', inna: '⚥' };
export const ZYWIOL_POSTACI: Record<string, { pl: string; en: string; hue: number }> = {
  ogien: { pl: 'Ogień', en: 'Fire', hue: 12 }, woda: { pl: 'Woda', en: 'Water', hue: 200 }, ziemia: { pl: 'Ziemia', en: 'Earth', hue: 96 },
  powietrze: { pl: 'Powietrze', en: 'Air', hue: 168 }, eter: { pl: 'Eter', en: 'Ether', hue: 280 },
};
const DROGA: Record<string, { pl: string; en: string }> = {
  tworca: { pl: 'Twórca', en: 'Maker' }, opiekun: { pl: 'Opiekun', en: 'Guardian' }, wedrowiec: { pl: 'Wędrowiec', en: 'Wanderer' }, badacz: { pl: 'Badacz', en: 'Seeker' },
};

/** Jeden podgląd w całej stronie: otwarcie nowego zamyka poprzedni. */
let zamknijAktywny: (() => void) | null = null;

/** Scena three.js w danym elemencie; zwraca funkcję sprzątającą wszystko (także kontekst WebGL). */
async function pokazGlb(el: HTMLDivElement, url: string, naBlad: (m: string) => void, czyZyje: () => boolean, przerwij: AbortSignal): Promise<() => void> {
  const r = await fetch(url, { cache: 'force-cache', signal: AbortSignal.any([przerwij, AbortSignal.timeout(30_000)]) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const dl = Number(r.headers.get('content-length') ?? 0);
  if (dl > MAX_GLB) throw new Error('plik postaci za duży');
  const bufor = await r.arrayBuffer();
  if (bufor.byteLength > MAX_GLB) throw new Error('plik postaci za duży');
  const THREE = await import('three');
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
  if (!czyZyje()) return () => {};
  const gltf = await new GLTFLoader().parseAsync(bufor, '');
  if (!czyZyje()) return () => {};

  const szer = el.clientWidth || 300, wys = el.clientHeight || 300;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setSize(szer, wys);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  el.appendChild(renderer.domElement);
  const utrata = (e: Event) => { e.preventDefault(); naBlad('karta graficzna odebrała kontekst WebGL — zamknij i otwórz podgląd ponownie'); };
  renderer.domElement.addEventListener('webglcontextlost', utrata);

  const scena = new THREE.Scene();
  scena.add(new THREE.HemisphereLight(0xffffff, 0x223344, 1.6));
  const slonce = new THREE.DirectionalLight(0xffffff, 2);
  slonce.position.set(2, 4, 3);
  scena.add(slonce);

  // Postać na środku, stopy na zero, kamera z wysokości bryły.
  const obrot = new THREE.Group();
  const model = gltf.scene;
  const box = new THREE.Box3().setFromObject(model);
  const rozmiar = box.getSize(new THREE.Vector3()), srodek = box.getCenter(new THREE.Vector3());
  model.position.set(-srodek.x, -box.min.y, -srodek.z);
  obrot.add(model);
  scena.add(obrot);
  const h = Math.max(rozmiar.y, rozmiar.x, rozmiar.z, 0.001);
  const kamera = new THREE.PerspectiveCamera(35, szer / wys, h / 100, h * 50);
  kamera.position.set(0, rozmiar.y * 0.6, h * 2.4);
  kamera.lookAt(0, rozmiar.y * 0.5, 0);

  let mixer: InstanceType<typeof THREE.AnimationMixer> | null = null;
  if (gltf.animations.length) { mixer = new THREE.AnimationMixer(model); mixer.clipAction(gltf.animations[0]).play(); }

  // Przeciąganie obraca postać; bez dotyku — powoli sama.
  let ciagnie = false, x0 = 0, recznie = 0;
  const dol = (e: PointerEvent) => { ciagnie = true; x0 = e.clientX; recznie = performance.now(); };
  const ruch = (e: PointerEvent) => { if (!ciagnie) return; obrot.rotation.y += (e.clientX - x0) * 0.01; x0 = e.clientX; recznie = performance.now(); };
  const gora = () => { ciagnie = false; };
  renderer.domElement.addEventListener('pointerdown', dol);
  window.addEventListener('pointermove', ruch);
  window.addEventListener('pointerup', gora);

  const zegar = new THREE.Clock();
  let klatka = 0;
  const petla = () => {
    klatka = requestAnimationFrame(petla);
    const dt = Math.min(0.1, zegar.getDelta());
    mixer?.update(dt);
    if (!ciagnie && performance.now() - recznie > 2500) obrot.rotation.y += dt * 0.5;
    renderer.render(scena, kamera);
  };
  petla();

  return () => {
    cancelAnimationFrame(klatka);
    renderer.domElement.removeEventListener('pointerdown', dol);
    window.removeEventListener('pointermove', ruch);
    window.removeEventListener('pointerup', gora);
    renderer.domElement.removeEventListener('webglcontextlost', utrata);
    mixer?.stopAllAction();
    mixer?.uncacheRoot(model);
    scena.traverse((o) => {
      const m = o as unknown as { geometry?: { dispose(): void }; material?: unknown };
      m.geometry?.dispose();
      for (const mat of (Array.isArray(m.material) ? m.material : m.material ? [m.material] : []) as Record<string, unknown>[]) {
        for (const v of Object.values(mat)) if (v && typeof v === 'object' && (v as { isTexture?: boolean }).isTexture) (v as { dispose(): void }).dispose();
        (mat as unknown as { dispose(): void }).dispose();
      }
    });
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  };
}

const PodgladGlb: React.FC<{ url: string; pl: boolean; onZamknij: () => void }> = ({ url, pl, onZamknij }) => {
  const el = useRef<HTMLDivElement>(null);
  const [stan, setStan] = useState<'laduje' | 'gra' | string>('laduje');
  useEffect(() => {
    let zyje = true, sprzatnij: (() => void) | null = null;
    const stop = new AbortController();
    zamknijAktywny?.();
    zamknijAktywny = onZamknij;
    pokazGlb(el.current!, url, (m) => zyje && setStan(m), () => zyje, stop.signal)
      .then((s) => { if (zyje) { sprzatnij = s; setStan('gra'); } else s(); })
      .catch((e) => { if (zyje) setStan(String(e?.message ?? e)); });
    return () => { zyje = false; stop.abort(); sprzatnij?.(); if (zamknijAktywny === onZamknij) zamknijAktywny = null; };
  }, [url, onZamknij]);
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-slate-900 to-black">
      <div ref={el} className="absolute inset-0 touch-none" />
      {stan === 'laduje' && <p className="absolute inset-0 flex items-center justify-center text-[11px] text-slate-400">{pl ? 'Wczytuję postać z Katedry…' : 'Loading the character from the Cathedral…'}</p>}
      {stan !== 'laduje' && stan !== 'gra' && <p className="absolute inset-0 flex items-center justify-center px-4 text-center text-[11px] text-rose-300">{pl ? `Postać się nie wczytała: ${stan}. Tunel Katedry mógł właśnie zniknąć.` : `The character did not load: ${stan}. The Cathedral tunnel may have just gone away.`}</p>}
      <button onClick={onZamknij} className="absolute right-2 top-2 rounded-full border border-white/20 bg-black/60 px-2 py-0.5 text-[10px] text-slate-300 hover:text-white">✕ {pl ? 'zamknij 3D' : 'close 3D'}</button>
    </div>
  );
};

/** Linijka postaci: znak płci, imię, żywioł, droga. */
export const LiniaPostaci: React.FC<{ p: PostacKatedry; pl: boolean; nick: string }> = ({ p, pl, nick }) => {
  const z = ZYWIOL_POSTACI[p.zywiol], d = DROGA[p.droga];
  return (
    <span className="inline-flex flex-wrap items-center gap-x-1.5">
      <span title={p.plec}>{ZNAK_PLCI[p.plec] ?? '⚥'}</span>
      <b className="text-slate-100">{p.imie || nick}</b>
      {z && <span style={{ color: `hsl(${z.hue} 80% 70%)` }}>· {pl ? z.pl : z.en}</span>}
      {d && <span className="text-slate-400">· {pl ? d.pl : d.en}</span>}
    </span>
  );
};

export const KartaPostaci: React.FC<{ p: PostacKatedry; pl: boolean; nick: string }> = ({ p, pl, nick }) => {
  const [otwarty, setOtwarty] = useState(false);
  const zamknij = React.useCallback(() => setOtwarty(false), []);
  useEffect(() => { setOtwarty(false); }, [p.glb]);
  return (
    <div className="space-y-2 rounded-xl border border-amber-300/25 bg-amber-950/10 p-3 text-xs text-slate-300">
      <p className="text-[10px] uppercase tracking-[0.3em] text-amber-200/70">{pl ? 'postać Katedry' : 'Cathedral character'}</p>
      <p className="text-sm"><LiniaPostaci p={p} pl={pl} nick={nick} /></p>
      {p.opis && <p className="line-clamp-4 leading-relaxed text-slate-400">{p.opis}</p>}
      {otwarty ? <PodgladGlb url={p.glb} pl={pl} onZamknij={zamknij} /> : (
        <button onClick={() => setOtwarty(true)} className="rounded-lg border border-amber-300/40 px-3 py-1 text-amber-100 hover:bg-amber-900/30">
          🧍 {pl ? 'Zobacz postać w 3D' : 'View the character in 3D'}{p.ruch ? (pl ? ' (z chodem)' : ' (walking)') : ''}
        </button>
      )}
      {otwarty && <p className="text-[10px] text-slate-500">{pl ? 'Plik idzie prosto z tunelu tej Katedry. Przeciągnij, by obrócić.' : 'The file comes straight from this Cathedral’s tunnel. Drag to rotate.'}</p>}
    </div>
  );
};

export default KartaPostaci;
