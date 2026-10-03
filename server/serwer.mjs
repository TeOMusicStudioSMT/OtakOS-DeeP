/**
 * 🌐 Serwer otakos.wtf — statyczna strona (dist/) + rejestr Katedr (server/rejestr.mjs).
 *
 * Zastępuje samego nginx (2026-10-02): strona dalej jest statyczna, a jedyny kawałek „żywy"
 * to /api/katedry — kto jest online. Bez zależności, sam Node. Cloud Run podaje PORT (8080).
 *
 *   GET  /api/katedry           → { katedry: [{ nick, adres, motto, widziano }] }
 *   POST /api/katedry/meldunek  → meldunek Katedry (podpisany ed25519, patrz rejestr.mjs)
 *   reszta                      → pliki z dist/, nieznane ścieżki → index.html (SPA)
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { utworzRejestr } from './rejestr.mjs';

const KORZEN = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(KORZEN, 'dist');
const PLIK_ZATWIERDZONYCH = path.join(KORZEN, 'katedry-zatwierdzone.json');

const TYPY = {
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.ico': 'image/x-icon',
    '.mp4': 'video/mp4', '.webm': 'video/webm', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.zip': 'application/zip',
    '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2',
};
// Te pliki zmieniają się pod tą samą nazwą — nie wolno ich trzymać rok w pamięci przeglądarki
// (stary nginx dawał zipowi „expires 1y", a suma w wersja.json mówiła już o nowym).
const ZAWSZE_SWIEZE = new Set(['/index.html', '/wersja.json', '/V_ZERO_archive.zip', '/sitemap.xml', '/robots.txt']);

let zatwierdzone = [];
let zarzadca = null;
function wczytajZatwierdzone() {
    try {
        const d = JSON.parse(fs.readFileSync(PLIK_ZATWIERDZONYCH, 'utf8'));
        zatwierdzone = (Array.isArray(d?.katedry) ? d.katedry : []).filter((z) => z && typeof z.nick === 'string' && typeof z.klucz === 'string');
        zarzadca = d?.zarzadca && typeof d.zarzadca.nick === 'string' && typeof d.zarzadca.klucz === 'string' ? d.zarzadca : null;
    } catch { zatwierdzone = []; zarzadca = null; }
}
wczytajZatwierdzone();
setInterval(wczytajZatwierdzone, 60_000).unref();

const rejestr = utworzRejestr({ zatwierdzone: () => zatwierdzone, zarzadca: () => zarzadca });

function json(res, status, dane) {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(JSON.stringify(dane));
}

function cialoJson(req, max = 4096) {
    return new Promise((ok, zle) => {
        let n = 0; const kawalki = [];
        req.on('data', (c) => { n += c.length; if (n > max) { zle(new Error('za duże')); req.destroy(); } else kawalki.push(c); });
        req.on('end', () => { try { ok(JSON.parse(Buffer.concat(kawalki).toString('utf8') || '{}')); } catch { zle(new Error('zły JSON')); } });
        req.on('error', zle);
    });
}

function plikStatyczny(req, res, sciezkaUrl) {
    let p;
    try { p = decodeURIComponent(sciezkaUrl); } catch { p = '/'; }
    let plik = path.join(DIST, path.normalize(p).replace(/^([/\\])+/, ''));
    if (!plik.startsWith(DIST)) plik = path.join(DIST, 'index.html');
    let st = fs.statSync(plik, { throwIfNoEntry: false });
    if (st?.isDirectory()) { plik = path.join(plik, 'index.html'); st = fs.statSync(plik, { throwIfNoEntry: false }); }
    if (!st?.isFile()) { plik = path.join(DIST, 'index.html'); st = fs.statSync(plik, { throwIfNoEntry: false }); p = '/index.html'; }
    if (!st) { res.writeHead(404); return res.end('Brak dist/ — zbuduj stronę (npm run build).'); }
    const wzgl = '/' + path.relative(DIST, plik).split(path.sep).join('/');
    const naglowki = {
        'Content-Type': TYPY[path.extname(plik).toLowerCase()] || 'application/octet-stream',
        'Content-Length': st.size,
        'Cache-Control': ZAWSZE_SWIEZE.has(wzgl) ? 'no-cache' : wzgl.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'public, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
    };
    res.writeHead(200, naglowki);
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(plik).pipe(res);
}

export const serwer = http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', 'http://otakos.wtf');
    try {
        if (url.pathname === '/api/katedry' && req.method === 'GET') return json(res, 200, { katedry: rejestr.lista() });
        if (url.pathname === '/api/katedry/meldunek' && req.method === 'POST') {
            let cialo;
            try { cialo = await cialoJson(req); } catch (e) { return json(res, 400, { wiadomosc: `Meldunek: ${e.message}.` }); }
            const w = await rejestr.meldunek(cialo);
            return json(res, w.status, { wiadomosc: w.wiadomosc });
        }
        // Zatwierdzanie przez Stół: Katedra zarządcy czyta oczekujące i wysyła podpisaną listę zatwierdzonych.
        if (url.pathname === '/api/katedry/oczekujace' && req.method === 'GET') return json(res, 200, { oczekujace: rejestr.oczekujace(), ...rejestr.stanZarzadcy() });
        if (url.pathname === '/api/katedry/zarzadca' && req.method === 'GET') return json(res, 200, rejestr.stanZarzadcy());
        if (url.pathname === '/api/katedry/zarzadca' && req.method === 'POST') {
            let cialo;
            try { cialo = await cialoJson(req, 64 * 1024); } catch (e) { return json(res, 400, { wiadomosc: `Lista: ${e.message}.` }); }
            const w = rejestr.ustawZatwierdzone(cialo);
            return json(res, w.status, { wiadomosc: w.wiadomosc });
        }
        if (url.pathname.startsWith('/api/')) return json(res, 404, { wiadomosc: 'Nie ma takiej trasy.' });
        if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
        return plikStatyczny(req, res, url.pathname);
    } catch (e) {
        return json(res, 500, { wiadomosc: e.message });
    }
});

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const port = Number(process.env.PORT) || 8080;
    serwer.listen(port, () => console.log(`otakos.wtf na :${port} · zatwierdzonych Katedr w pliku: ${zatwierdzone.length} · zarządca: ${zarzadca?.nick ?? 'brak'}`));
}
