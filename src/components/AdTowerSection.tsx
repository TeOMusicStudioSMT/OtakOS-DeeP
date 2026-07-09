/**
 * 📢 AdTowerSection — Wieża Partnerów: wykup reklamy na prawym panelu Orbity.
 *
 * Przepływ (static-site, bez backendu — suwerennie):
 *  1. Firma wypełnia formularz → generujemy ID zamówienia (AD-...).
 *  2. "Opłać slot" → PayPal.me z kwotą tieru (ID zamówienia w tytule wpłaty).
 *  3. Kopia zamówienia leci mailem (mailto) do TeO — po zaksięgowaniu
 *     Suweren aktywuje slot lokalnie w Katedrze (POST /api/ads/activate).
 *  Reklama pojawia się na Wieży Partnerów (prawy panel KatedraOrbita) każdej
 *  Katedry z aktywnym rejestrem.
 */
import React, { useState } from 'react';
import { Megaphone, Check, ExternalLink, Mail } from 'lucide-react';
import { FIAT_DONATIONS_CONFIG } from '../config/wallets';

interface Props { lang: 'pl' | 'en'; }

const TIERS = [
    { id: 'standard', pln: 99,  daysLabel: { pl: '30 dni',  en: '30 days' },  name: { pl: 'Partner',        en: 'Partner' } },
    { id: 'gold',     pln: 249, daysLabel: { pl: '90 dni',  en: '90 days' },  name: { pl: 'Złoty Partner',  en: 'Gold Partner' } },
    { id: 'genesis',  pln: 777, daysLabel: { pl: '365 dni', en: '365 days' }, name: { pl: 'Partner Genesis', en: 'Genesis Partner' } },
] as const;

const T = {
    pl: {
        title: 'WIEŻA PARTNERÓW',
        sub: 'Twoja firma na prawym panelu Orbity — w każdej działającej Katedrze.',
        company: 'Nazwa firmy', slogan: 'Slogan (max 120 znaków)', url: 'Strona WWW (opcjonalnie)', email: 'E-mail kontaktowy',
        order: 'ZAMÓW SLOT', pay: 'OPŁAĆ PRZEZ PAYPAL', mail: 'WYŚLIJ ZAMÓWIENIE MAILEM',
        afterOrder: 'Zamówienie przygotowane! Dokończ 2 kroki:',
        step1: 'Opłać slot (w tytule wpłaty wklej ID zamówienia):',
        step2: 'Wyślij szczegóły zamówienia mailem (przycisk niżej) — aktywujemy slot po zaksięgowaniu.',
        idLabel: 'ID zamówienia',
        note: 'Slot aktywuje się po opłacie. Reklama renderuje się na żywo na Wieży Partnerów (prawy panel wizualizatora Katedry).',
    },
    en: {
        title: 'PARTNER TOWER',
        sub: 'Your company on the right Orbit panel — in every running Cathedral.',
        company: 'Company name', slogan: 'Slogan (max 120 chars)', url: 'Website (optional)', email: 'Contact e-mail',
        order: 'ORDER SLOT', pay: 'PAY VIA PAYPAL', mail: 'SEND ORDER BY E-MAIL',
        afterOrder: 'Order prepared! Finish 2 steps:',
        step1: 'Pay for the slot (paste the order ID in the payment title):',
        step2: 'Send order details by e-mail (button below) — we activate the slot once payment clears.',
        idLabel: 'Order ID',
        note: 'Slot activates after payment. The ad renders live on the Partner Tower (right visualizer panel of the Cathedral).',
    },
};

const inputCls = 'w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-200 font-mono focus:outline-none focus:border-amber-500/60 transition-colors placeholder:text-zinc-600';

const AdTowerSection: React.FC<Props> = ({ lang }) => {
    const t = T[lang];
    const [tier, setTier] = useState<(typeof TIERS)[number]>(TIERS[0]);
    const [company, setCompany] = useState('');
    const [slogan, setSlogan] = useState('');
    const [url, setUrl] = useState('');
    const [email, setEmail] = useState('');
    const [orderId, setOrderId] = useState<string | null>(null);

    const makeOrder = () => {
        if (!company.trim() || !slogan.trim() || !email.trim()) return;
        setOrderId(`AD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`);
    };

    const paypalUrl = `${FIAT_DONATIONS_CONFIG.PAYPAL}/${tier.pln}PLN`;
    const mailtoUrl = orderId ? `mailto:teo@teo.center?subject=${encodeURIComponent(`[WIEŻA PARTNERÓW] ${orderId} — ${company}`)}&body=${encodeURIComponent(
        `ID: ${orderId}\nTier: ${tier.name[lang]} (${tier.pln} PLN / ${tier.daysLabel[lang]})\nFirma: ${company}\nSlogan: ${slogan}\nWWW: ${url || '—'}\nE-mail: ${email}\n\n(Opłacono przez PayPal — tytuł wpłaty zawiera ID zamówienia.)`
    )}` : '#';

    return (
        <div className="bg-zinc-950/60 border border-amber-900/30 rounded-2xl p-6 md:p-10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
                <Megaphone className="h-6 w-6 text-amber-500" />
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-amber-400">{t.title}</h2>
            </div>
            <p className="text-sm text-zinc-500 font-mono mb-8">{t.sub}</p>

            {/* Tiery */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                {TIERS.map(ti => (
                    <button key={ti.id} onClick={() => setTier(ti)}
                        className={`p-4 rounded-xl border text-left transition-all ${tier.id === ti.id ? 'border-amber-500/70 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.15)]' : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'}`}>
                        <div className="flex items-center justify-between">
                            <span className={`text-sm font-bold ${tier.id === ti.id ? 'text-amber-300' : 'text-zinc-300'}`}>{ti.name[lang]}</span>
                            {tier.id === ti.id && <Check className="h-4 w-4 text-amber-400" />}
                        </div>
                        <div className="text-2xl font-black text-white mt-1">{ti.pln} <span className="text-xs font-mono text-zinc-500">PLN</span></div>
                        <div className="text-[10px] font-mono text-zinc-500 mt-1">{ti.daysLabel[lang]}</div>
                    </button>
                ))}
            </div>

            {!orderId ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input value={company} onChange={e => setCompany(e.target.value)} placeholder={t.company} className={inputCls} maxLength={60} />
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder={t.email} type="email" className={inputCls} maxLength={120} />
                    <input value={slogan} onChange={e => setSlogan(e.target.value)} placeholder={t.slogan} className={`${inputCls} md:col-span-2`} maxLength={120} />
                    <input value={url} onChange={e => setUrl(e.target.value)} placeholder={t.url} className={`${inputCls} md:col-span-2`} maxLength={200} />
                    <button onClick={makeOrder} disabled={!company.trim() || !slogan.trim() || !email.trim()}
                        className="md:col-span-2 py-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black tracking-widest text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                        {t.order}
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-sm text-emerald-400 font-bold">{t.afterOrder}</p>
                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4 font-mono">
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">{t.idLabel}</div>
                        <div className="text-lg text-amber-300 font-bold select-all">{orderId}</div>
                    </div>
                    <div className="text-xs text-zinc-400 font-mono">1. {t.step1}</div>
                    <a href={paypalUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all">
                        <ExternalLink className="h-4 w-4" /> {t.pay} — {tier.pln} PLN
                    </a>
                    <div className="text-xs text-zinc-400 font-mono">2. {t.step2}</div>
                    <a href={mailtoUrl}
                        className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-bold text-sm transition-all">
                        <Mail className="h-4 w-4" /> {t.mail}
                    </a>
                </div>
            )}

            <p className="text-[10px] text-zinc-600 font-mono mt-6 leading-relaxed">{t.note}</p>
        </div>
    );
};

export default AdTowerSection;
