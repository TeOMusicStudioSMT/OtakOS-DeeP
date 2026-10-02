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
 *   3. adres to https na *.trycloudflare.com albo stała domena wpisana przy nicku
 *      (rejestr nie puka pod dowolne adresy — żadnego SSRF),
 *   4. pod adresem naprawdę odpowiada wizytówka z tym nickiem i kluczem.
 * Lista (z kluczem publicznym — TOST między Katedrami weryfikuje nim nadawcę) żyje w pamięci: kto milczy dłużej niż 3 minuty, znika. Restart serwera = pusta lista,
 * która wraca w ciągu minuty (Katedry meldują się same).
 */
import crypto from 'node:crypto';

export const NICK = /^[a-z0-9][a-z0-9-]{2,31}$/;
export const trescMeldunku = ({ nick, adres, czas }) => `otakos-meldunek\n${nick}\n${adres}\n${czas}`;
const ZYWOTNOSC_MS = 3 * 60_000;
const SWIEZOSC_MS = 5 * 60_000;
const PONOWNA_WERYFIKACJA_MS = 5 * 60_000;
const MAX_WIZYTOWKA = 512 * 1024;

/** Czy adres wolno odpytać: https, bez portu i ścieżki, host z trycloudflare albo stała domena nicka. */
export function adresDozwolony(adres, domena) {
    let u;
    try { u = new URL(adres); } catch { return false; }
    if (u.protocol !== 'https:' || u.port || u.username || u.password || (u.pathname !== '/' && u.pathname !== '') || u.search || u.hash) return false;
    const h = u.hostname.toLowerCase();
    if (/^[a-z0-9-]+\.trycloudflare\.com$/.test(h)) return true;
    return !!domena && h === String(domena).toLowerCase();
}

async function pobierzWizytowke(fetchFn, adres) {
    const r = await fetchFn(`${adres}/api/wizytowka`, { redirect: 'error', signal: AbortSignal.timeout(8_000), headers: { 'User-Agent': 'otakos.wtf-rejestr' } });
    if (!r.ok) throw new Error(`wizytówka odpowiedziała HTTP ${r.status}`);
    const tekst = await r.text();
    if (tekst.length > MAX_WIZYTOWKA) throw new Error('wizytówka za duża');
    return JSON.parse(tekst);
}

export function utworzRejestr({ zatwierdzone = () => [], fetch: fetchFn = fetch, teraz = () => Date.now() } = {}) {
    const online = new Map();   // nick → { nick, adres, motto, widziano, sprawdzono }

    async function meldunek(cialo) {
        const { nick, adres, czas, klucz, podpis } = cialo ?? {};
        const odp = (status, wiadomosc) => ({ status, wiadomosc });
        if (!NICK.test(String(nick ?? ''))) return odp(400, 'Zły nick.');
        if (typeof adres !== 'string' || typeof czas !== 'string' || typeof klucz !== 'string' || typeof podpis !== 'string') return odp(400, 'Meldunek niekompletny.');
        const wpis = zatwierdzone().find((z) => z.nick === nick);
        if (!wpis || wpis.klucz !== klucz) {
            return odp(403, `Nick „${nick}" czeka na zatwierdzenie na otakos.wtf — wyślij Suwerenowi strony nick i klucz publiczny z karty Wystawy.`);
        }
        const t = Date.parse(czas);
        if (!Number.isFinite(t) || Math.abs(teraz() - t) > SWIEZOSC_MS) return odp(400, 'Meldunek nieświeży — sprawdź zegar komputera.');
        let ok = false;
        try {
            const pub = crypto.createPublicKey({ key: Buffer.from(klucz, 'base64'), format: 'der', type: 'spki' });
            ok = crypto.verify(null, Buffer.from(trescMeldunku({ nick, adres, czas }), 'utf8'), pub, Buffer.from(podpis, 'base64'));
        } catch { ok = false; }
        if (!ok) return odp(401, 'Podpis się nie zgadza.');
        if (!adresDozwolony(adres, wpis.domena)) return odp(400, 'Adres musi być https na *.trycloudflare.com albo stałą domeną zatwierdzoną przy nicku.');

        const byl = online.get(nick);
        let motto = byl?.motto ?? '';
        if (!byl || byl.adres !== adres || teraz() - byl.sprawdzono > PONOWNA_WERYFIKACJA_MS) {
            let w;
            try { w = await pobierzWizytowke(fetchFn, adres); }
            catch (e) { return odp(502, `Pod adresem nie odpowiada wizytówka (${e.message}).`); }
            if (w?.nick !== nick || w?.klucz !== klucz) return odp(409, 'Pod adresem jest wizytówka innej Katedry.');
            motto = String(w.motto ?? '').slice(0, 140);
            online.set(nick, { nick, adres, motto, klucz, widziano: teraz(), sprawdzono: teraz() });
        } else {
            online.set(nick, { ...byl, widziano: teraz() });
        }
        return odp(200, 'Zameldowana — wizytówka widoczna na otakos.wtf.');
    }

    function lista() {
        const granica = teraz() - ZYWOTNOSC_MS;
        const dozwolone = new Map(zatwierdzone().map((z) => [z.nick, z.klucz]));
        for (const [nick, w] of online) if (w.widziano < granica || !dozwolone.has(nick)) online.delete(nick);
        return [...online.values()].sort((a, b) => a.nick.localeCompare(b.nick)).map(({ nick, adres, motto, klucz, widziano }) => ({ nick, adres, motto, klucz, widziano: new Date(widziano).toISOString() }));   // klucz: TOST sprawdza nim nadawcę
    }

    return { meldunek, lista };
}
