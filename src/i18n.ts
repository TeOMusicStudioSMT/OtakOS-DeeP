// 🌍 Języki strony otakos.wtf: polski (źródło), angielski, niemiecki.
export type Lang = 'pl' | 'en' | 'de';
export const JEZYKI: Lang[] = ['pl', 'en', 'de'];

/** Tekst w trzech językach w jednym miejscu: tr(lang, 'Pobierz', 'Download', 'Herunterladen'). */
export const tr = <T,>(lang: Lang, pl: T, en: T, de: T): T => (lang === 'pl' ? pl : lang === 'de' ? de : en);

/** Język z adresu (?lang=de), zapamiętanego wyboru albo przeglądarki (de → DE, pl → PL, reszta → EN). */
export function jezykStartowy(): Lang {
  try {
    const z = new URLSearchParams(window.location.search).get('lang')?.toLowerCase();
    if (z === 'pl' || z === 'en' || z === 'de') return z;
    const zapis = localStorage.getItem('otakos_lang');
    if (zapis === 'pl' || zapis === 'en' || zapis === 'de') return zapis;
  } catch { /* prywatne okno — bez pamięci */ }
  const n = ((typeof navigator !== 'undefined' && navigator.language) || '').toLowerCase();
  return n.startsWith('pl') ? 'pl' : n.startsWith('de') ? 'de' : 'en';
}

export const zapamietajJezyk = (l: Lang) => { try { localStorage.setItem('otakos_lang', l); } catch { /* bez pamięci */ } };

/** Ustawienia regionalne do Intl (daty, liczby, waluty). */
export const locale = (lang: Lang) => (lang === 'pl' ? 'pl-PL' : lang === 'de' ? 'de-DE' : 'en-US');
