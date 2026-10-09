/**
 * 🛰️ Rejestr Katedr — które Katedry są TERAZ online i pokazują wizytówkę (2026-10-02).
 *
 * Suweren: na otakos.wtf przewijamy wizytówki aktywnych Katedr (tylko nicki), suwerennie,
 * na tej jednej domenie; pokazują się tylko te, które Suweren zatwierdził.
 *
 * Katedra (services/Wizytowka.js w teo-app-hub) co minutę wysyła meldunek: nick + adres tunelu
 * + czas, podpisane kluczem ed25519. Rejestr przyjmuje meldunek tylko gdy:
 *   1. nick jest na liście zatwierdzonych (katedry-zatwierdzone.json) Z TYM SAMYM kluczem,
 *   2. podpis się zgadza, a czas jest świeży (±5 min — stary meldunek nie wróci),
 *   3. adres to https na *.trycloudflare.com albo stała domena zatwierdzona przy nicku (nazwany tunel; zarządca
 *      Stołem — oczekujące niosą domenę; własną domenę zarządcy rejestr przyjmuje od razu)
 *      (rejestr nie puka pod dowolne adresy — żadnego SSRF),
 *   4. pod adresem naprawdę odpowiada wizytówka z tym nickiem i kluczem.
 * Lista (z kluczem publicznym — TOST między Katedrami weryfikuje nim nadawcę) żyje w pamięci: kto milczy dłużej niż 3 minuty, znika. Restart serwera = pusta lista,
 * która wraca w ciągu minuty (Katedry meldują się same).
 */
import crypto from 'node:crypto';

export const NICK = /^[a-z0-9][a-z0-9-]{2,31}$/;
export const trescMeldunku = ({ nick, adres, czas }) => `otakos-meldunek\n${nick}\n${adres}\n${czas}`;
/** Lista zatwierdzonych od zarządcy — podpisana jego kluczem (services/ZarzadcaRejestru.js w Katedrze). */
export const trescListyZarzadcy = ({ czas, zatwierdzone }) => `otakos-zarzadca\n${czas}\n${JSON.stringify(zatwierdzone)}`;
const MAX_OCZEKUJACYCH = 200;
const OCZEKUJACY_MS = 24 * 3600_000;
const ZYWOTNOSC_MS = 3 * 60_000;
const SWIEZOSC_MS = 5 * 60_000;
const PONOWNA_WERYFIKACJA_MS = 5 * 60_000;
const MAX_WIZYTOWKA = 512 * 1024;

const QUICK = /^[a-z0-9-]+\.trycloudflare\.com$/;
/** Host adresu tunelu, gdy adres ma bezpieczną postać (https, nazwa domenowa, bez portu, ścieżki i IP) — inaczej null. */
export function hostAdresu(adres) {
    let u;
    try { u = new URL(adres); } catch { return null; }
    if (u.protocol !== 'https:' || u.port || u.username || u.password || (u.pathname !== '/' && u.pathname !== '') || u.search || u.hash) return null;
    const h = u.hostname.toLowerCase();
    if (!/^([a-z0-9-]+\.)+[a-z]{2,}$/.test(h) || h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.local') || h.endsWith('.internal')) return null;
    return h;
}
/** Czy adres wolno odpytać: host z trycloudflare albo stała domena zatwierdzona przy nicku. */
export function adresDozwolony(adres, domena) {
    const h = hostAdresu(adres);
    if (!h) return false;
    if (QUICK.test(h)) return true;
    return !!domena && h === String(domena).toLowerCase();
}

/**
 * ⚡ Giełda Master Flow (dawniej „Giełda mocy”), etap 1 (2026-10-04): oferta mocy z wizytówki Katedry (`moc`: VRAM, karta, modele, cena GRV za jednostkę)
 * → bezpieczna postać do listy, albo null. Tylko OGŁOSZENIE — rejestr niczego nie zleca i nie liczy GRV.
 */
const MODEL = /^[a-zA-Z0-9._:/-]{1,80}$/;
export function mocZWizytowki(moc) {
    if (!moc || typeof moc !== 'object' || Array.isArray(moc)) return null;
    const tekst = (v, n) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, n);
    const liczba = (v, min, max) => { const x = Number(v); return Number.isFinite(x) ? Math.min(max, Math.max(min, x)) : null; };
    const modele = [...new Set((Array.isArray(moc.modele) ? moc.modele : []).map((m) => String(m).trim()).filter((m) => MODEL.test(m)))].slice(0, 12);
    const vramGB = liczba(moc.vramGB, 1, 512);
    const cenaGRV = liczba(moc.cenaGRV, 0, 1_000_000);
    if (!modele.length || vramGB === null || cenaGRV === null) return null;
    return {
        vramGB: Math.round(vramGB), gpu: tekst(moc.gpu, 80), modele, cenaGRV: Math.round(cenaGRV * 100) / 100,
        jednostka: tekst(moc.jednostka, 30) || '1000 tokenów', godziny: tekst(moc.godziny, 60), opis: tekst(moc.opis, 300),
    };
}

/**
 * 📋 Giełda Master Flow (2026-10-06): zlecenia z wizytówki — czego Katedra SZUKA (zadanie albo projekt, potrzebne modele,
 * budżet GRV). Tylko OGŁOSZENIE, jak oferty: rejestr niczego nie zleca. Śmieci odpadają, najwyżej 10.
 */
export function zleceniaZWizytowki(lista) {
    if (!Array.isArray(lista)) return [];
    const tekst = (v, n) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, n);
    return lista.slice(0, 10).map((z) => {
        if (!z || typeof z !== 'object') return null;
        const id = String(z.id ?? ''), rodzaj = z.rodzaj, tytul = tekst(z.tytul, 120);
        if (!/^[a-z0-9-]{4,24}$/.test(id) || !['zadanie', 'projekt'].includes(rodzaj) || tytul.length < 3) return null;
        const budzet = Number(z.budzetGRV);
        return {
            id, rodzaj, tytul, opis: tekst(z.opis, 600),
            modele: [...new Set((Array.isArray(z.modele) ? z.modele : []).map((m) => String(m).trim()).filter((m) => MODEL.test(m)))].slice(0, 6),
            budzetGRV: Number.isFinite(budzet) ? Math.round(Math.min(1_000_000, Math.max(0, budzet)) * 100) / 100 : 0,
            od: typeof z.od === 'string' ? z.od.slice(0, 40) : null,
        };
    }).filter(Boolean);
}

/**
 * 🏛️ Globalny Klub Mistrzów (2026-10-09, Suweren: „robimy rejestr na otakos.wtf”): przedstawicielstwo Katedry z wizytówki
 * (`mistrz`, teo-app-hub services/KlubMistrzow.js) — etap JaJa Mistrza, event dnia Teterhii, turnieje globalne, które
 * Katedra ogłasza, i jej wyniki. Rejestr niesie to w /api/katedry, strona pokazuje Klub i rankingi, a Katedry nie muszą
 * pukać do każdej wizytówki. Wyniki DEKLARUJE Katedra (tożsamość potwierdza meldunek) — strona mówi to wprost.
 */
export const ETAPY_JAJA = ['jajo', 'drży', 'pęka', 'wykluty'];
export const DZIEDZINY = ['takt', 'zwinnosc', 'spryt', 'urok'];
const DATA = /^\d{4}-\d{2}-\d{2}$/;
export function mistrzZWizytowki(m, teraz = Date.now()) {
    if (!m || typeof m !== 'object' || Array.isArray(m)) return null;
    const tekst = (v, n) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, n);
    const calk = (v, min, max) => { const x = Math.round(Number(v)); return Number.isFinite(x) ? Math.min(max, Math.max(min, x)) : min; };
    const dzis = new Date(teraz).toISOString().slice(0, 10);
    const eventy = (Array.isArray(m.eventy) ? m.eventy : []).slice(0, 3).map((e) => {
        if (!e || typeof e !== 'object' || !/^g-[0-9a-f]{8}$/.test(String(e.id)) || e.typ !== 'turniej' || !DZIEDZINY.includes(e.dziedzina)) return null;
        const od = String(e.od ?? ''), do_ = String(e.do ?? '');
        if (!DATA.test(od) || !DATA.test(do_) || od > do_ || do_ < dzis) return null;
        return { id: e.id, typ: 'turniej', dziedzina: e.dziedzina, opis: tekst(e.opis, 200), od, do: do_ };
    }).filter(Boolean);
    const wyniki = (Array.isArray(m.wyniki) ? m.wyniki : []).slice(0, 10).map((w) => {
        if (!w || typeof w !== 'object' || !/^[a-z0-9][a-z0-9-]{2,31}:g-[0-9a-f]{8}$/.test(String(w.event)) || Number(w.starc) !== 3) return null;
        const wygrane = Math.round(Number(w.wygrane));
        if (!(wygrane >= 0 && wygrane <= 3)) return null;
        return { event: w.event, wygrane, starc: 3, kiedy: tekst(w.kiedy, 30), mini: (Array.isArray(w.mini) ? w.mini : []).map((x) => tekst(x, 30)).filter(Boolean).slice(0, 3) };
    }).filter(Boolean);
    return {
        etap: ETAPY_JAJA.includes(m.etap) ? m.etap : 'jajo',
        obserwacji: calk(m.obserwacji, 0, 1_000_000), zasad: calk(m.zasad, 0, 15),
        teterhia: tekst(m.teterhia, 80) || null, eventy, wyniki,
    };
}

async function pobierzWizytowke(fetchFn, adres) {
    const r = await fetchFn(`${adres}/api/wizytowka`, { redirect: 'error', signal: AbortSignal.timeout(8_000), headers: { 'User-Agent': 'otakos.wtf-rejestr' } });
    if (!r.ok) throw new Error(`wizytówka odpowiedziała HTTP ${r.status}`);
    const tekst = await r.text();
    if (tekst.length > MAX_WIZYTOWKA) throw new Error('wizytówka za duża');
    return JSON.parse(tekst);
}

/**
 * ZATWIERDZANIE PRZEZ STÓŁ (2026-10-03, Suweren: „niech też będzie możliwość zatwierdzenia przez Stół”):
 *   · `zatwierdzone()` — plik w repo (start, wpisuje się ręcznie) + ZARZĄDCA (`zarzadca()`: nick i klucz z pliku),
 *   · Katedra z ważnym podpisem, ale bez zatwierdzenia → trafia do OCZEKUJĄCYCH (nick, klucz, kiedy — bez adresu),
 *   · Katedra zarządcy pokazuje oczekujące na Stole (Hub / StoL), a zatwierdzoną listę wysyła tu podpisaną swoim
 *     kluczem (co minutę i po każdej zmianie). Źródło prawdy leży w Katedrze zarządcy — restart strony nic nie gubi
 *     na dłużej niż do jej następnego wysłania.
 */
export function utworzRejestr({ zatwierdzone = () => [], zarzadca = () => null, fetch: fetchFn = fetch, teraz = () => Date.now() } = {}) {
    const online = new Map();   // nick → { nick, adres, motto, moc, widziano, sprawdzono }
    const oczekujace = new Map();   // nick → { nick, klucz, kiedy, powod }
    const ostatnie = new Map();   // nick → { kiedy, ok, wiadomosc } — ostatni meldunek z WŁAŚCIWYM kluczem (powód „offline” dla strony)
    let odZarzadcy = { czas: 0, katedry: [] };

    /** Plik ∪ sam zarządca ∪ lista od zarządcy (wpis z pliku wygrywa; domenę bez wpisu w pliku bierze z listy zarządcy). */
    function wszystkieZatwierdzone() {
        const m = new Map();
        for (const z of odZarzadcy.katedry) m.set(z.nick, z);
        const zDomena = (z) => {
            const odZ = m.get(z.nick);
            return { ...z, domena: z.domena ?? (odZ && odZ.klucz === z.klucz ? odZ.domena : null) ?? null };
        };
        const zr = zarzadca();
        if (zr?.nick && zr?.klucz) m.set(zr.nick, zDomena({ nick: zr.nick, klucz: zr.klucz, domena: zr.domena ?? null }));
        for (const z of zatwierdzone()) m.set(z.nick, zDomena(z));
        return [...m.values()];
    }

    function ustawZatwierdzone(cialo) {
        const odp = (status, wiadomosc) => ({ status, wiadomosc });
        const zr = zarzadca();
        if (!zr?.klucz) return odp(503, 'Rejestr nie ma zarządcy (katedry-zatwierdzone.json → "zarzadca").');
        const { czas, zatwierdzone: lista_, podpis } = cialo ?? {};
        if (typeof czas !== 'string' || !Array.isArray(lista_) || typeof podpis !== 'string' || lista_.length > 500) return odp(400, 'Lista niekompletna.');
        const t = Date.parse(czas);
        if (!Number.isFinite(t) || Math.abs(teraz() - t) > SWIEZOSC_MS) return odp(400, 'Lista nieświeża — sprawdź zegar komputera.');
        if (t <= odZarzadcy.czas) return odp(200, 'Już mam tę albo nowszą listę.');
        let ok = false;
        try { ok = crypto.verify(null, Buffer.from(trescListyZarzadcy({ czas, zatwierdzone: lista_ }), 'utf8'), crypto.createPublicKey({ key: Buffer.from(zr.klucz, 'base64'), format: 'der', type: 'spki' }), Buffer.from(podpis, 'base64')); } catch { ok = false; }
        if (!ok) return odp(401, 'To nie jest podpis zarządcy rejestru.');
        const katedry = lista_.filter((z) => NICK.test(String(z?.nick ?? '')) && typeof z.klucz === 'string' && z.klucz.length < 200)
            .map((z) => ({ nick: z.nick, klucz: z.klucz, domena: typeof z.domena === 'string' ? hostAdresu(`https://${z.domena}`) : null }));
        odZarzadcy = { czas: t, katedry };
        for (const z of katedry) { const o = oczekujace.get(z.nick); if (o?.klucz === z.klucz && (!o.domena || o.domena === z.domena)) oczekujace.delete(z.nick); }
        return odp(200, `Zatwierdzonych od zarządcy: ${katedry.length}.`);
    }

    function listaOczekujacych() {
        const granica = teraz() - OCZEKUJACY_MS;
        for (const [n, o] of oczekujace) if (o.kiedy < granica) oczekujace.delete(n);
        return [...oczekujace.values()].sort((a, b) => b.kiedy - a.kiedy).map((o) => ({ ...o, kiedy: new Date(o.kiedy).toISOString() }));
    }
    function stanZarzadcy() {
        const zr = zarzadca();
        return { zarzadca: zr?.nick ?? null, lista: odZarzadcy.czas ? new Date(odZarzadcy.czas).toISOString() : null, odZarzadcy: odZarzadcy.katedry.length, zPliku: zatwierdzone().length };
    }

    async function meldunek(cialo) {
        const w = await meldunek_(cialo);
        if (w.nick) ostatnie.set(w.nick, { kiedy: teraz(), ok: w.status === 200, wiadomosc: w.wiadomosc });
        return { status: w.status, wiadomosc: w.wiadomosc };
    }
    /** `nick` w odpowiedzi = zapamiętaj powód dla tego nicka (tylko podpis zgodny z kluczem właściciela albo nowa Katedra). */
    async function meldunek_(cialo) {
        const { nick, adres, czas, klucz, podpis } = cialo ?? {};
        const odp = (status, wiadomosc, n = null) => ({ status, wiadomosc, nick: n });
        if (!NICK.test(String(nick ?? ''))) return odp(400, 'Zły nick.');
        if (typeof adres !== 'string' || typeof czas !== 'string' || typeof klucz !== 'string' || typeof podpis !== 'string') return odp(400, 'Meldunek niekompletny.');
        const t = Date.parse(czas);
        if (!Number.isFinite(t) || Math.abs(teraz() - t) > SWIEZOSC_MS) return odp(400, 'Meldunek nieświeży — sprawdź zegar komputera.');
        let ok = false;
        try {
            const pub = crypto.createPublicKey({ key: Buffer.from(klucz, 'base64'), format: 'der', type: 'spki' });
            ok = crypto.verify(null, Buffer.from(trescMeldunku({ nick, adres, czas }), 'utf8'), pub, Buffer.from(podpis, 'base64'));
        } catch { ok = false; }
        if (!ok) return odp(401, 'Podpis się nie zgadza.');
        // Podpis prawdziwy — dopiero teraz pytamy o zatwierdzenie (oczekujące to tylko Katedry z własnym kluczem).
        const wpis = wszystkieZatwierdzone().find((z) => z.nick === nick);
        const host = hostAdresu(adres);
        // Stały adres (nazwany tunel Cloudflare na domenie Suwerena) — zarządca rejestru zatwierdza go razem z nickiem.
        const domena = host && !QUICK.test(host) ? host : null;
        const czekaj = (powod) => {
            if (oczekujace.size < MAX_OCZEKUJACYCH || oczekujace.has(nick)) oczekujace.set(nick, { nick, klucz, ...(domena ? { domena } : {}), kiedy: teraz(), powod });
        };
        if (!wpis || wpis.klucz !== klucz) {
            czekaj(wpis ? 'inny klucz niż zatwierdzony przy tym nicku' : domena ? `nowa Katedra · stały adres ${domena}` : 'nowa Katedra');
            return odp(403, `Nick „${nick}" czeka na zatwierdzenie — zarządca rejestru widzi go teraz na swoim Stole.`, wpis ? null : nick);
        }
        if (!host) return odp(400, 'Adres tunelu musi być https z nazwą domenową — bez portu, ścieżki i IP.', nick);
        // Zarządca sam podpisuje swój adres (to jego rejestr) — jego stała domena nie potrzebuje niczyjej zgody.
        const jestZarzadca = zarzadca()?.nick === nick && zarzadca()?.klucz === klucz;
        if (!adresDozwolony(adres, wpis.domena) && !jestZarzadca) {
            czekaj(`stały adres ${domena} — do zatwierdzenia przy nicku`);
            return odp(403, `Stały adres ${domena} czeka na zatwierdzenie u zarządcy rejestru (Stół). Do tego czasu działa quick tunnel *.trycloudflare.com.`, nick);
        }

        const byl = online.get(nick);
        let motto = byl?.motto ?? '';
        if (!byl || byl.adres !== adres || teraz() - byl.sprawdzono > PONOWNA_WERYFIKACJA_MS) {
            let w;
            try { w = await pobierzWizytowke(fetchFn, adres); }
            catch (e) { return odp(502, `Rejestr nie dostał wizytówki spod ${adres}/api/wizytowka (${e.message}).`, nick); }
            if (w?.nick !== nick || w?.klucz !== klucz) return odp(409, 'Pod adresem jest wizytówka innej Katedry.', nick);
            motto = String(w.motto ?? '').slice(0, 140);
            online.set(nick, { nick, adres, motto, klucz, moc: mocZWizytowki(w.moc), zlecenia: zleceniaZWizytowki(w.zlecenia), mistrz: mistrzZWizytowki(w.mistrz, teraz()), widziano: teraz(), sprawdzono: teraz() });
        } else {
            online.set(nick, { ...byl, widziano: teraz() });
        }
        return odp(200, 'Zameldowana — wizytówka widoczna na otakos.wtf.', nick);
    }

    /** Dla strony „offline”: czy nick jest online i co rejestr odpowiedział na jego ostatni meldunek. */
    function stanKatedry(nick) {
        if (!NICK.test(String(nick ?? ''))) return null;
        const jest = lista().some((k) => k.nick === nick);
        const o = ostatnie.get(nick);
        return { nick, online: jest, meldunek: o ? { ...o, kiedy: new Date(o.kiedy).toISOString() } : null };
    }

    function lista() {
        const granica = teraz() - ZYWOTNOSC_MS;
        const dozwolone = new Map(wszystkieZatwierdzone().map((z) => [z.nick, z.klucz]));
        for (const [nick, w] of online) if (w.widziano < granica || dozwolone.get(nick) !== w.klucz) online.delete(nick);
        return [...online.values()].sort((a, b) => a.nick.localeCompare(b.nick)).map(({ nick, adres, motto, klucz, moc, zlecenia, mistrz, widziano }) => ({ nick, adres, motto, klucz, ...(moc ? { moc } : {}), ...(zlecenia?.length ? { zlecenia } : {}), ...(mistrz ? { mistrz } : {}), widziano: new Date(widziano).toISOString() }));   // klucz: TOST sprawdza nim nadawcę
    }

    return { meldunek, lista, oczekujace: listaOczekujacych, ustawZatwierdzone, stanZarzadcy, stanKatedry };
}
