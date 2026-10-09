// 🛰️ Rejestr Katedr: tylko zatwierdzony nick z tym samym kluczem, świeży podpis, bezpieczny adres
// i prawdziwa wizytówka pod adresem. Kto milczy 3 minuty — znika.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { utworzRejestr, adresDozwolony, trescMeldunku, mocZWizytowki, zleceniaZWizytowki, mistrzZWizytowki } from './rejestr.mjs';

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
    assert.deepEqual(r.lista(), [{ nick: 'teo-center', adres: ADRES, motto: 'Tu ta chwila', klucz: KLUCZ, widziano: new Date(zegar).toISOString() }]);
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

test('zatwierdzanie przez Stół: niezatwierdzona Katedra → oczekujące; podpisana lista zarządcy ją wpuszcza; cudza lista odrzucona', async () => {
    const { trescListyZarzadcy } = await import('./rejestr.mjs');
    const zarz = crypto.generateKeyPairSync('ed25519');
    const ZK = zarz.publicKey.export({ format: 'der', type: 'spki' }).toString('base64');
    const pukniecia = [];
    const r = utworzRejestr({
        zatwierdzone: () => [], zarzadca: () => ({ nick: 'teo', klucz: ZK }), teraz,
        fetch: async (url) => { pukniecia.push(url); return { ok: true, status: 200, text: async () => JSON.stringify({ nick: 'teo-center', klucz: KLUCZ, motto: 'm' }) }; },
    });
    // nowa Katedra z ważnym podpisem → 403 + oczekuje (bez adresu, bez pukania pod adres)
    const w = await r.meldunek(meldunek());
    assert.equal(w.status, 403);
    assert.deepEqual(r.oczekujace().map((o) => [o.nick, o.klucz, o.powod, 'adres' in o]), [['teo-center', KLUCZ, 'nowa Katedra', false]]);
    assert.equal(pukniecia.length, 0);
    // śmieciowy podpis nie trafia do oczekujących
    await r.meldunek({ ...meldunek({ nick: 'smiec' }), podpis: 'AAAA' });
    assert.equal(r.oczekujace().length, 1);

    const czas = new Date(zegar).toISOString();
    const lista = [{ nick: 'teo-center', klucz: KLUCZ }];
    const podpisz = (k, c = czas, l = lista) => crypto.sign(null, Buffer.from(trescListyZarzadcy({ czas: c, zatwierdzone: l })), k).toString('base64');
    assert.equal(r.ustawZatwierdzone({ czas, zatwierdzone: lista, podpis: podpisz(obca.privateKey) }).status, 401, 'nie zarządca');
    assert.equal(r.ustawZatwierdzone({ czas, zatwierdzone: lista, podpis: podpisz(zarz.privateKey) }).status, 200);
    assert.deepEqual(r.oczekujace(), [], 'zatwierdzona znika z oczekujących');
    assert.equal(r.stanZarzadcy().odZarzadcy, 1);
    assert.equal((await r.meldunek(meldunek())).status, 200);
    assert.deepEqual(r.lista().map((x) => x.nick), ['teo-center']);
    // starsza albo ta sama lista nie nadpisze nowszej; cofnięcie zatwierdzenia (pusta lista) zdejmuje ze strony
    assert.match(r.ustawZatwierdzone({ czas, zatwierdzone: [], podpis: podpisz(zarz.privateKey, czas, []) }).wiadomosc, /Już mam/);
    zegar += 1000;
    const pozniej = new Date(zegar).toISOString();
    assert.equal(r.ustawZatwierdzone({ czas: pozniej, zatwierdzone: [], podpis: podpisz(zarz.privateKey, pozniej, []) }).status, 200);
    assert.deepEqual(r.lista(), []);
});

test('nazwany tunel: zarządca melduje się ze stałej domeny od razu; inna Katedra czeka, aż zarządca zatwierdzi domenę', async () => {
    const { trescListyZarzadcy } = await import('./rejestr.mjs');
    const zarz = crypto.generateKeyPairSync('ed25519');
    const ZK = zarz.publicKey.export({ format: 'der', type: 'spki' }).toString('base64');
    const pukniecia = [];
    const r = utworzRejestr({
        zatwierdzone: () => [{ nick: 'teo-center', klucz: KLUCZ }], zarzadca: () => ({ nick: 'teo-mas', klucz: ZK }), teraz,
        fetch: async (url) => {
            pukniecia.push(url);
            const w = url.startsWith('https://katedra.teo.pl') ? { nick: 'teo-mas', klucz: ZK } : { nick: 'teo-center', klucz: KLUCZ };
            return { ok: true, status: 200, text: async () => JSON.stringify(w) };
        },
    });
    // zarządca ze stałego adresu — bez niczyjej zgody
    const mz = meldunek({ nick: 'teo-mas', adres: 'https://katedra.teo.pl', klucz: ZK, prywatny: zarz.privateKey });
    assert.equal((await r.meldunek(mz)).status, 200);
    assert.deepEqual(r.lista().map((k) => k.nick), ['teo-mas']);
    assert.equal(r.stanKatedry('teo-mas').online, true);

    // zatwierdzona Katedra ze stałym adresem → 403 + oczekująca z domeną, rejestr nie puka pod obcy host
    const mk = meldunek({ adres: 'https://moja.domena.pl' });
    const w = await r.meldunek(mk);
    assert.equal(w.status, 403);
    assert.match(w.wiadomosc, /moja\.domena\.pl czeka na zatwierdzenie/);
    assert.equal(r.oczekujace()[0].domena, 'moja.domena.pl');
    assert.ok(!pukniecia.some((u) => u.includes('moja.domena.pl')));
    const s = r.stanKatedry('teo-center');
    assert.equal(s.online, false);
    assert.match(s.meldunek.wiadomosc, /czeka na zatwierdzenie/);

    // zarządca zatwierdza nick z domeną → meldunek przechodzi, oczekująca znika
    const czas = new Date(zegar).toISOString();
    const zatwierdzone = [{ nick: 'teo-center', klucz: KLUCZ, domena: 'moja.domena.pl' }];
    const podpis = crypto.sign(null, Buffer.from(trescListyZarzadcy({ czas, zatwierdzone })), zarz.privateKey).toString('base64');
    assert.equal(r.ustawZatwierdzone({ czas, zatwierdzone, podpis }).status, 200);
    assert.deepEqual(r.oczekujace(), []);
    assert.equal((await r.meldunek(meldunek({ adres: 'https://moja.domena.pl' }))).status, 200);
    assert.equal(r.stanKatedry('teo-center').online, true);

    // podszywka pod nick nie zmienia powodu właściciela
    const obcyKlucz = obca.publicKey.export({ format: 'der', type: 'spki' }).toString('base64');
    await r.meldunek(meldunek({ klucz: obcyKlucz, prywatny: obca.privateKey }));
    assert.equal(r.stanKatedry('teo-center').meldunek.ok, true);
    assert.equal(r.stanKatedry('ZŁY'), null);
});

test('⚡ Giełda mocy: oferta z wizytówki idzie na listę oczyszczona; śmieci i brak modeli = bez oferty', async () => {
    assert.equal(mocZWizytowki(null), null);
    assert.equal(mocZWizytowki({ vramGB: 24, modele: [] }), null, 'bez modelu nie ma oferty');
    assert.equal(mocZWizytowki({ vramGB: 'dużo', modele: ['gemma4'], cenaGRV: 1 }), null);
    assert.deepEqual(mocZWizytowki({ vramGB: 9999, gpu: ' RTX  4090 ', modele: ['gemma4', '<script>', 'gemma4'], cenaGRV: 1.234, sekret: 'x' }),
        { vramGB: 512, gpu: 'RTX 4090', modele: ['gemma4'], cenaGRV: 1.23, jednostka: '1000 tokenów', godziny: '', opis: '' });
    const moc = { vramGB: 12, gpu: 'RTX 4070', modele: ['gemma4'], cenaGRV: 1, jednostka: '1000 tokenów', godziny: 'wieczorem', opis: 'pl' };
    const { r } = rejestr({ wizytowka: { nick: 'teo-center', klucz: KLUCZ, motto: 'm', moc } });
    assert.equal((await r.meldunek(meldunek())).status, 200);
    assert.deepEqual(r.lista()[0].moc, moc);
});

test('zlecenia Giełdy Master Flow z wizytówki: tylko poprawne, najwyżej 10, budżet w granicach', () => {
    const z = zleceniaZWizytowki([
        { id: 'zl-abc1', rodzaj: 'projekt', tytul: '  Teterhia —  Wieczna Saga ', opis: 'RPG', modele: ['qwen3-coder:30b', 'zły model!'], budzetGRV: 2e9, od: '2026-10-06T07:00:00Z', projekt: 'tajny' },
        { id: 'x', rodzaj: 'zadanie', tytul: 'krótkie id' },
        { id: 'zl-def2', rodzaj: 'hack', tytul: 'zły rodzaj' },
        'śmieć',
    ]);
    assert.deepEqual(z, [{ id: 'zl-abc1', rodzaj: 'projekt', tytul: 'Teterhia — Wieczna Saga', opis: 'RPG', modele: ['qwen3-coder:30b'], budzetGRV: 1_000_000, od: '2026-10-06T07:00:00Z' }]);
    assert.deepEqual(zleceniaZWizytowki(null), []);
    assert.equal(zleceniaZWizytowki(Array.from({ length: 15 }, (_, i) => ({ id: `zl-x${i}aa`, rodzaj: 'zadanie', tytul: `Zadanie ${i}` }))).length, 10);
});

test('🏛️ Klub Mistrzów: mistrz z wizytówki — znane pola, trwające turnieje, wyniki 0–3 z 3', () => {
    const t = Date.parse('2026-10-09T12:00:00Z');
    const m = mistrzZWizytowki({
        etap: 'pęka', obserwacji: 42.7, zasad: 99, teterhia: 'Turniej: Takt', wlam: '<script>',
        eventy: [
            { id: 'g-0a1b2c3d', typ: 'turniej', dziedzina: 'takt', od: '2026-10-08', do: '2026-10-10', opis: '  Kto   upadł, wstaje  ' },
            { id: 'g-11112222', typ: 'turniej', dziedzina: 'takt', od: '2026-10-01', do: '2026-10-02' },   // skończony
            { id: '../../x', typ: 'turniej', dziedzina: 'takt', od: '2026-10-08', do: '2026-10-10' },
            { id: 'g-33334444', typ: 'wojna', dziedzina: 'takt', od: '2026-10-08', do: '2026-10-10' },
        ],
        wyniki: [{ event: 'wyspa-ola:g-11112222', wygrane: 3, starc: 3, kiedy: '2026-10-09T11:00:00Z', mini: ['Iskra'] }, { event: 'x:g-1', wygrane: 9, starc: 3 }],
    }, t);
    assert.deepEqual(m, { etap: 'pęka', obserwacji: 43, zasad: 15, teterhia: 'Turniej: Takt',
        eventy: [{ id: 'g-0a1b2c3d', typ: 'turniej', dziedzina: 'takt', opis: 'Kto upadł, wstaje', od: '2026-10-08', do: '2026-10-10' }],
        wyniki: [{ event: 'wyspa-ola:g-11112222', wygrane: 3, starc: 3, kiedy: '2026-10-09T11:00:00Z', mini: ['Iskra'] }] });
    assert.equal(mistrzZWizytowki('nie'), null);
    assert.equal(mistrzZWizytowki({ etap: 'smok' }).etap, 'jajo');
});

test('🏛️ Klub Mistrzów: rejestr niesie mistrza w /api/katedry, Katedra bez mistrza — bez pola', async () => {
    const { r } = rejestr({ wizytowka: { nick: 'teo-center', klucz: KLUCZ, motto: 'x', mistrz: { etap: 'drży', obserwacji: 21, eventy: [], wyniki: [] } } });
    assert.equal((await r.meldunek(meldunek())).status, 200);
    assert.deepEqual(r.lista()[0].mistrz, { etap: 'drży', obserwacji: 21, zasad: 0, teterhia: null, eventy: [], wyniki: [] });
    const bez = rejestr();
    await bez.r.meldunek(meldunek());
    assert.equal('mistrz' in bez.r.lista()[0], false);
});
