/**
 * 🪪 Wizytówki Katedr — dane i ich OCZYSZCZANIE (2026-10-02).
 *
 * Wizytówka przychodzi z obcej Katedry (przez jej tunel), a wyświetla się pod otakos.wtf.
 * Dlatego nic z niej nie idzie na stronę „jak leci":
 *   · ramki tylko YouTube (id 11 znaków → youtube-nocookie) i Suno (suno.com/embed/<id>),
 *   · pliki tylko z adresu tej Katedry i tylko ścieżki /wizytowka/plik|plakat/<id>,
 *   · okładki tylko https, teksty jako tekst (React i tak nie wstrzykuje HTML).
 * Wszystko inne jest po prostu pomijane.
 */

export const MOST_LOKALNY = 'http://127.0.0.1:3001';

export interface Film { id: string; tytul: string; opis: string; projekt: string; kiedy: string; youtube: string | null; plik: string | null; plakat: string | null }
export interface Utwor { id: string; tytul: string; plik: string }
export interface SunoUtwor { id: string; tytul: string; embed: string; okladka: string | null; sekundy: number | null }
export interface Suno { id: string; typ: 'utwor' | 'playlista'; tytul: string; opis: string; url: string; embed: string | null; okladka: string | null; utwory: SunoUtwor[] }
export interface Produkt { id: string; tytul: string; opis: string; dzial: string; rodzaj: string; obraz: string | null }
export interface Wizytowka { nick: string; motto: string; opis: string; adres: string; filmy: Film[]; utwory: Utwor[]; suno: Suno[]; produkty: Produkt[] }
export interface KatedraOnline { nick: string; adres: string; motto: string; widziano: string }

const tekst = (x: unknown, max = 300) => (typeof x === 'string' ? x.slice(0, max) : '');
const https = (x: unknown) => (typeof x === 'string' && /^https:\/\/[^\s"'<>]+$/.test(x) ? x : null);
const id = (x: unknown) => (typeof x === 'string' && /^[\w-]{1,80}$/.test(x) ? x : null);
const youtube = (x: unknown) => (typeof x === 'string' && /^[\w-]{11}$/.test(x) ? x : null);
const sunoEmbed = (x: unknown) => (typeof x === 'string' && /^https:\/\/suno\.com\/embed\/[\w-]{8,}\/?$/.test(x) ? x : null);
const sunoUrl = (x: unknown) => (typeof x === 'string' && /^https:\/\/suno\.(com|ai)\/[\w/-]+$/.test(x) ? x : null);
/** Plik z Katedry: tylko jej adres + /wizytowka/(plik|plakat)/<id>. */
const plikKatedry = (adres: string, x: unknown) => (typeof x === 'string' && /^\/wizytowka\/(plik|plakat)\/[\w-]{1,80}$/.test(x) ? `${adres}${x}` : null);
const lista = (x: unknown): any[] => (Array.isArray(x) ? x : []);

/** Surowy JSON wizytówki → bezpieczna wizytówka (albo null, gdy to nie wizytówka). */
export function oczysc(d: any, adres: string): Wizytowka | null {
    if (!d || typeof d !== 'object' || !/^[a-z0-9][a-z0-9-]{2,31}$/.test(d.nick ?? '')) return null;
    const w = d.wystawa ?? {};
    return {
        nick: d.nick, motto: tekst(d.motto, 140), opis: tekst(d.opis, 600), adres,
        filmy: lista(w.filmy).slice(0, 24).flatMap((f) => (id(f?.id) ? [{ id: f.id, tytul: tekst(f.tytul, 160), opis: tekst(f.opis, 400), projekt: tekst(f.projekt, 60), kiedy: tekst(f.kiedy, 40), youtube: youtube(f.youtube), plik: plikKatedry(adres, f.plik), plakat: plikKatedry(adres, f.plakat) }] : [])).filter((f) => f.youtube || f.plik),   // film bez źródła nie ma czego grać
        utwory: lista(w.utwory).slice(0, 24).flatMap((u) => { const p = plikKatedry(adres, u?.plik); return id(u?.id) && p ? [{ id: u.id, tytul: tekst(u.tytul, 160), plik: p }] : []; }),
        suno: lista(w.suno).slice(0, 12).flatMap((s) => (id(s?.id) && sunoUrl(s?.url) ? [{
            id: s.id, typ: s.typ === 'playlista' ? 'playlista' as const : 'utwor' as const, tytul: tekst(s.tytul, 160), opis: tekst(s.opis, 300), url: sunoUrl(s.url)!, embed: sunoEmbed(s.embed), okladka: https(s.okladka),
            utwory: lista(s.utwory).slice(0, 60).flatMap((u) => (id(u?.id) && sunoEmbed(u?.embed) ? [{ id: u.id, tytul: tekst(u.tytul, 160), embed: sunoEmbed(u.embed)!, okladka: https(u.okladka), sekundy: typeof u.sekundy === 'number' ? u.sekundy : null }] : [])),
        }] : [])),
        produkty: lista(w.produkty).slice(0, 36).flatMap((p) => (id(p?.id) ? [{ id: p.id, tytul: tekst(p.tytul, 160), opis: tekst(p.opis, 300), dzial: tekst(p.dzial, 60), rodzaj: tekst(p.rodzaj, 30), obraz: plikKatedry(adres, p.obraz) }] : [])),
    };
}

async function json(url: string, ms: number): Promise<any> {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    try {
        const r = await fetch(url, { signal: ctrl.signal, cache: 'no-store' });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return await r.json();
    } finally { clearTimeout(t); }
}

/** Kto jest online — z rejestru tej domeny. null = rejestr nieosiągalny (np. strona bez serwera). */
export async function katedryOnline(): Promise<KatedraOnline[] | null> {
    try {
        const d = await json('/api/katedry', 6000);
        return lista(d?.katedry).filter((k) => typeof k?.nick === 'string' && https(k?.adres));
    } catch { return null; }
}

export async function wizytowkaZ(adres: string, ms = 8000): Promise<Wizytowka | null> {
    return oczysc(await json(`${adres}/api/wizytowka`, ms), adres);
}

/** Wizytówka Katedry na TEJ maszynie (gospodarz) — przez most na 127.0.0.1. */
export async function twojaWizytowka(): Promise<Wizytowka | null | 'brak-nicka'> {
    try {
        const r = await fetch(`${MOST_LOKALNY}/api/wizytowka`, { cache: 'no-store', signal: AbortSignal.timeout(1500) });
        if (r.status === 404) return /nick/i.test(String((await r.json().catch(() => ({})))?.message ?? '')) ? 'brak-nicka' : null;   // stary most też da 404
        if (!r.ok) return null;
        return oczysc(await r.json(), MOST_LOKALNY);
    } catch { return null; }
}
