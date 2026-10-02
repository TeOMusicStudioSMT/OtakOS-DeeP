// 🛰️ Rejestr Katedr: tylko zatwierdzony nick z tym samym kluczem, świeży podpis, bezpieczny adres
// i prawdziwa wizytówka pod adresem. Kto milczy 3 minuty — znika.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { utworzRejestr, adresDozwolony, trescMeldunku } from './rejestr.mjs';

const para = crypto.generateKeyPairSync('ed25519');
const KLUCZ = para.publicKey.export({ format: 'der', type: 'spki' }).toString('base64');
const obca = crypto.generateKeyPairSync('ed25519');
const ADRES = 'https://ala-ma-kota.trycloudflare.com';
let zegar = Date.parse('2026-10-02T22:00:00Z');
const teraz = () => zegar;

function meldunek({ nick = 'teo-center', adres = ADRES, czas = new Date(zegar).toISOString(), klucz = KLUCZ, prywatny = para.privateKey } = {}) {
    const podpis = crypto.sign(null, Buffer.from(trescMeldunku({ nick, adres, czas })), prywatny).toString('base64');
    return { nick, adres, czas, klucz, podpis };
}
function rejestr({ wizytowka = { nick: 'teo-center', klucz: KLUCZ, motto: 'Tu ta chwila' }, zatwierdzone = [{ nick: 'teo-center', klucz: KLUCZ }] } = {}) {
    const pukniecia = [];
    const r = utworzRejestr({
        zatwierdzone: () => zatwierdzone, teraz,
        fetch: async (url) => { pukniecia.push(url); return { ok: true, status: 200, text: async () => JSON.stringify(wizytowka) }; },
    });
    return { r, pukniecia };
}

test('adres: tylko https trycloudflare albo stała domena nicka — bez portu, ścieżki i IP', () => {
    assert.ok(adresDozwolony('https://abc-def.trycloudflare.com'));
    assert.ok(adresDozwolony('https://katedra.przyklad.pl', 'katedra.przyklad.pl'));
    for (const a of ['http://abc.trycloudflare.com', 'https://abc.trycloudflare.com:8443', 'https://abc.trycloudflare.com/x', 'https://169.254.169.254', 'https://localhost', 'https://trycloudflare.com.zla.pl', 'https://katedra.przyklad.pl', 'nie-url']) {
        assert.ok(!adresDozwolony(a), a);
    }
});

test('zatwierdzony nick z dobrym podpisem i żywą wizytówką → na liście (tylko nick, adres, motto)', async () => {
    const { r, pukniecia } = rejestr();
    const w = await r.meldunek(meldunek());
    assert.equal(w.status, 200, w.wiadomosc);
    assert.deepEqual(pukniecia, [`${ADRES}/api/wizytowka`]);
    assert.deepEqual(r.lista(), [{ nick: 'teo-center', adres: ADRES, motto: 'Tu ta chwila', widziano: new Date(zegar).toISOString() }]);
    // kolejny meldunek w ciągu 5 min z tym samym adresem nie puka ponownie
    zegar += 60_000;
    assert.equal((await r.meldunek(meldunek())).status, 200);
    assert.equal(pukniecia.length, 1);
    // 3 minuty ciszy → znika
    zegar += 3 * 60_000 + 1;
    assert.deepEqual(r.lista(), []);
});

test('odrzuca: niezatwierdzony nick, cudzy klucz, zły podpis, stary meldunek, obcy adres, cudza wizytówka', async () => {
    const { r } = rejestr();
    assert.equal((await r.meldunek(meldunek({ nick: 'obcy' }))).status, 403);
    assert.match((await r.meldunek(meldunek({ nick: 'obcy' }))).wiadomosc, /czeka na zatwierdzenie/);
    const podszywka = meldunek({ klucz: obca.publicKey.export({ format: 'der', type: 'spki' }).toString('base64'), prywatny: obca.privateKey });
    assert.equal((await r.meldunek(podszywka)).status, 403, 'nick zatwierdzony z innym kluczem');
    assert.equal((await r.meldunek({ ...meldunek(), adres: 'https://inny.trycloudflare.com' })).status, 401, 'podpis nie obejmuje zmienionego adresu');
    assert.equal((await r.meldunek(meldunek({ czas: new Date(zegar - 6 * 60_000).toISOString() }))).status, 400);
    assert.equal((await r.meldunek(meldunek({ adres: 'https://169.254.169.254' }))).status, 400);
    const { r: r2 } = rejestr({ wizytowka: { nick: 'ktos-inny', klucz: KLUCZ } });
    assert.equal((await r2.meldunek(meldunek())).status, 409);
    assert.deepEqual(r.lista(), []);
});

test('cofnięcie zatwierdzenia usuwa Katedrę z listy', async () => {
    const zatw = [{ nick: 'teo-center', klucz: KLUCZ }];
    const { r } = rejestr({ zatwierdzone: zatw });
    assert.equal((await r.meldunek(meldunek())).status, 200);
    zatw.length = 0;
    assert.deepEqual(r.lista(), []);
});
