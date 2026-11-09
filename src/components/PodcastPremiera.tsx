import type { Lang } from '../i18n';
/**
 * 🎙️ PodcastPremiera — film z Podcastowego Studia Katedry na głównej stronie.
 *
 * Suweren (2026-10-04): odcinek odpowiada na pytanie „What is a Cathedral… and why is it the greatest invention
 * since rolling papers?” — w całości zrobiony w nowym Studiu Podcastu Katedry (scenariusz, głosy, kadry, montaż).
 *
 * Ramka YouTube ładuje się dopiero po kliknięciu (youtube-nocookie, jak karta Katedry) — bez kliknięcia strona nie
 * łączy się z Google. Nowy odcinek = zmień FILM poniżej.
 */
import React, { useState } from 'react';
import { tr } from '../i18n';

const FILM = {
  youtube: 's8tIMYSTfq8',
  pytanie: {
    en: 'What is a Cathedral… and why is it the greatest invention since rolling papers?',
    pl: 'Czym jest Katedra… i dlaczego to największy wynalazek od czasów bibułek?',
    de: 'Was ist eine Kathedrale… und warum ist sie die größte Erfindung seit dem Zigarettenpapier?',
  },
};

export const PodcastPremiera: React.FC<{ lang?: Lang }> = ({ lang = 'pl' as Lang }) => {
  const [gra, setGra] = useState(false);
  const T = (p: string, e: string, d: string) => tr(lang, p, e, d);
  return (
    <div className="rounded-2xl border border-fuchsia-500/30 bg-[#0b0510]/85 overflow-hidden shadow-[0_0_30px_rgba(217,70,239,0.12)]">
      <div className="px-5 pt-4 pb-3">
        <div className="text-[10px] tracking-[0.3em] text-fuchsia-400/70 font-mono">
          🎙️ {T('PREMIERA · PODCASTOWE STUDIO KATEDRY', 'PREMIERE · THE CATHEDRAL PODCAST STUDIO', 'PREMIERE · DAS PODCAST-STUDIO DER KATHEDRALE')}
        </div>
        <h2 className="mt-1 text-lg md:text-xl font-bold text-fuchsia-200 font-mono leading-snug">
          {FILM.pytanie.en}
        </h2>
        {lang !== 'en' && <p className="mt-1 text-xs text-fuchsia-100/60 font-mono italic">{lang === 'de' ? FILM.pytanie.de : FILM.pytanie.pl}</p>}
      </div>

      <div className="relative w-full bg-black" style={{ aspectRatio: '16 / 9' }}>
        {gra ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${FILM.youtube}?autoplay=1&rel=0`}
            title={FILM.pytanie.en}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            onClick={() => setGra(true)}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_center,rgba(217,70,239,0.18),transparent_70%)] hover:bg-[radial-gradient(ellipse_at_center,rgba(217,70,239,0.3),transparent_70%)] transition-colors"
            aria-label={T('Odtwórz film', 'Play the video', 'Video abspielen')}
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-fuchsia-300/80 bg-fuchsia-500/20 text-3xl text-fuchsia-100 group-hover:scale-110 transition-transform">▶</span>
            <span className="text-[11px] font-mono text-fuchsia-200/80">
              {T('Odtwórz — film z YouTube (ładuje się po kliknięciu)', 'Play — YouTube video (loads on click)', 'Abspielen — YouTube-Video (lädt erst nach dem Klick)')}
            </span>
          </button>
        )}
      </div>

      <div className="px-5 py-3 text-[11px] font-mono text-fuchsia-100/60 leading-relaxed">
        {T('Cały odcinek powstał w nowym Studiu Podcastu Katedry — scenariusz, głosy, kadry i montaż na sprzęcie Suwerena, lokalnie.',
          'The whole episode was made in the Cathedral’s new Podcast Studio — script, voices, shots and editing, locally on the Sovereign’s own machine.',
          'Die gesamte Folge entstand im neuen Podcast-Studio der Kathedrale — Drehbuch, Stimmen, Bilder und Schnitt, lokal auf der eigenen Hardware des Souveräns.')}
        {' '}
        <a href={`https://www.youtube.com/watch?v=${FILM.youtube}`} target="_blank" rel="noopener noreferrer" className="text-fuchsia-300 underline hover:text-fuchsia-200">
          {T('Otwórz na YouTube ↗', 'Open on YouTube ↗', 'Auf YouTube öffnen ↗')}
        </a>
      </div>
    </div>
  );
};

export default PodcastPremiera;
