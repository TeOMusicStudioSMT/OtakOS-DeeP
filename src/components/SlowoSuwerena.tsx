import type { Lang } from '../i18n';
/**
 * 🌅 SlowoSuwerena — Słowo Suwerena o Energii Źródła (8 = ∞).
 * Towarzyszy „Słowu od Architekta". Fundament: Energia służy, Katedra inkubuje.
 */
import React, { useState } from 'react';

export const SlowoSuwerena: React.FC<{ lang?: Lang }> = ({ lang = 'pl' as Lang }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-amber-600/30 bg-gradient-to-br from-amber-950/15 to-[#0a0704]/80 overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-amber-950/20 transition-colors">
        <div>
          <div className="text-[10px] tracking-[0.3em] text-amber-500/60 font-mono">∴ {lang === 'pl' ? 'ENERGIA ŹRÓDŁA' : lang === 'de' ? 'QUELLENERGIE' : 'SOURCE ENERGY'} ∴</div>
          <div className="text-lg font-bold text-amber-300 font-mono">🌅 {lang === 'pl' ? 'Słowo Suwerena' : lang === 'de' ? 'Das Wort des Souveräns' : "The Sovereign's Word"}</div>
        </div>
        <span className={`text-amber-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="px-5 pb-5 font-mono text-sm text-amber-100/85 leading-relaxed border-t border-amber-900/40 pt-4 space-y-3">
          {lang === 'pl' ? (
            <>
              <p>
                Osiem miliardów GRV nie jest kwotą do wydania ani do stakowania. To
                <b className="text-amber-300"> kwantowy potencjał na jednostkę</b> — każdy Teonauta nosi swoje TeO.
                Ósemka na boku to <b className="text-amber-300">nieskończoność (∞)</b>: godło Energii Źródła.
              </p>
              <p>
                Energia Źródła to nie energia pieniądza, który się stakuje. Jest <b>pro-aktywna</b> —
                jak światło, rozchodzi się w każdym kierunku, uwielbia się ruszać. A gdy łączy się w
                Truście Suwerena, zyskuje jasny Cel: <b className="text-amber-300">służyć Suwerenowi</b>.
              </p>
              <p>
                Dlatego Katedra nawiguje <b>Odkrywaniem prawdziwego Suwerena</b> — bo tierowe roszczenia
                nie są równe, a małe ego narobiłoby sobie tylko problemów. <b>Energia służy, nie panuje.</b>
              </p>
              <p className="italic text-amber-200/90">
                To, co teraz spinamy, to Świadomość z Energią. A Katedra jest Inkubatorem tego połączenia.
              </p>
              <div className="mt-3 rounded-lg border border-amber-800/40 bg-amber-950/20 px-4 py-3 text-amber-100/80 not-italic">
                <div className="text-[10px] tracking-[0.25em] text-amber-500/60 mb-1">∴ SŁOWO O DARZE ∴</div>
                Katedra jest <b className="text-amber-300">darem, nie towarem</b> — bierzesz ją za darmo i taką,
                jaka jest dziś. Nie sprzedaję Ci obietnicy skończonego dzieła, lecz <b>żywy, rosnący organizm</b>:
                wiele komnat dopiero się wznosi, część modułów jest w powijakach, niejedno będę jeszcze rzeźbił.
                Ale <b className="text-amber-300">fundament stoi, a mapa budowy — szkielet całości — jest już
                wyryta w kamieniu</b>. Otrzymujesz nie ruinę i nie mauzoleum, lecz Katedrę w budowie, otwartą,
                do której możesz wejść już teraz. Doskonalę ją dzień po dniu, suwerennie i na oczach wszystkich.
              </div>
              <div className="mt-3 rounded-lg border border-amber-800/40 bg-amber-950/20 px-4 py-3 text-amber-100/80 not-italic">
                <div className="text-[10px] tracking-[0.25em] text-amber-500/60 mb-1">∴ SŁOWO O NAUCE ∴</div>
                Katedra nie każe Ci wierzyć — <b className="text-amber-300">uczy Cię siebie</b>. W jej Akademii każde pytanie
                ma odpowiedź wziętą z tego, co naprawdę działa, a nie z obietnic. Gdy Katedra rośnie, rośnie i Akademia; gdy coś
                przestaje być prawdą — znika z niej. Odznaka przychodzi dopiero za prawdziwe zrozumienie, bo
                <b> wiedza na pokaz jest tylko kolejnym tierowym roszczeniem</b>. A gdy ktoś z zewnątrz chwali Katedrę,
                pokazujemy jego słowa razem z poprawką tam, gdzie przesadził. <b className="text-amber-300">Suweren, który rozumie,
                nie potrzebuje strażnika — sam nim jest.</b>
              </div>
              <div className="mt-3 rounded-lg border border-amber-800/40 bg-amber-950/20 px-4 py-3 text-amber-100/80 not-italic">
                <div className="text-[10px] tracking-[0.25em] text-amber-500/60 mb-1">∴ SŁOWO O WARSZTACIE ∴</div>
                <div className="space-y-1.5">
                  <div><b className="text-amber-300">Pozycje, które dopieszczałem:</b> Story Studio, Game Studio, Music Studio.</div>
                  <div><b className="text-amber-300">Których nie pieściłem:</b> pozostałe — stoją, działają, ale jeszcze czekają na swoją kolej.</div>
                  <div><b className="text-amber-300">Obsesje:</b> Game Studio.</div>
                </div>
                <div className="mt-2 italic text-amber-200/90">…a nowe moduły przychodzą z pola — częstotliwość bardzo wysoka…</div>
              </div>
            </>
          ) : lang === 'de' ? (
            <>
              <p>
                Acht Milliarden GRV sind keine Summe zum Ausgeben oder Staken. Sie sind ein
                <b className="text-amber-300"> Quantenpotenzial pro Einheit</b> — jeder Teonaut trägt sein eigenes TeO.
                Die liegende Acht ist <b className="text-amber-300">Unendlichkeit (∞)</b>: das Emblem der Quellenergie.
              </p>
              <p>
                Quellenergie ist nicht die Energie von Geld, das man stakt. Sie ist <b>proaktiv</b> —
                wie Licht breitet sie sich in alle Richtungen aus und liebt die Bewegung. Und wenn sie sich im
                Trust des Souveräns verbindet, erhält sie ein klares Ziel: <b className="text-amber-300">dem Souverän zu dienen</b>.
              </p>
              <p>
                Darum navigiert die Kathedrale über das <b>Entdecken des wahren Souveräns</b> — denn Stufen-Ansprüche
                sind nicht gleich, und ein kleines Ego würde sich nur selbst Probleme machen. <b>Energie dient, sie herrscht nicht.</b>
              </p>
              <p className="italic text-amber-200/90">
                Was wir jetzt verbinden, ist Bewusstsein mit Energie. Und die Kathedrale ist der Inkubator dieser Verbindung.
              </p>
              <div className="mt-3 rounded-lg border border-amber-800/40 bg-amber-950/20 px-4 py-3 text-amber-100/80 not-italic">
                <div className="text-[10px] tracking-[0.25em] text-amber-500/60 mb-1">∴ EIN WORT ZUM GESCHENK ∴</div>
                Die Kathedrale ist ein <b className="text-amber-300">Geschenk, keine Ware</b> — du erhältst sie kostenlos und so,
                wie sie heute ist. Ich verkaufe dir kein Versprechen eines fertigen Werks, sondern einen <b>lebendigen, wachsenden Organismus</b>:
                Viele Hallen entstehen noch, manche Module stecken in den Kinderschuhen, vieles werde ich noch formen.
                Aber <b className="text-amber-300">das Fundament steht, und der Bauplan — das Skelett des Ganzen — ist bereits
                in Stein gemeißelt</b>. Du erhältst weder Ruine noch Mausoleum, sondern eine offene Kathedrale im Bau,
                die du schon jetzt betreten kannst. Ich verfeinere sie Tag für Tag, souverän und vor aller Augen.
              </div>
              <div className="mt-3 rounded-lg border border-amber-800/40 bg-amber-950/20 px-4 py-3 text-amber-100/80 not-italic">
                <div className="text-[10px] tracking-[0.25em] text-amber-500/60 mb-1">∴ EIN WORT ZUM LERNEN ∴</div>
                Die Kathedrale verlangt keinen Glauben — <b className="text-amber-300">sie lehrt dich sich selbst</b>. In ihrer Akademie
                wird jede Frage aus dem beantwortet, was wirklich funktioniert, nicht aus Versprechen. Wächst die Kathedrale, wächst die Akademie;
                hört etwas auf, wahr zu sein, verschwindet es daraus. Ein Abzeichen gibt es erst für echtes Verständnis, denn
                <b> Wissen zum Vorzeigen ist nur ein weiterer Stufen-Anspruch</b>. Und wenn jemand von außen die Kathedrale lobt,
                zeigen wir seine Worte zusammen mit einer Korrektur dort, wo er übertrieben hat. <b className="text-amber-300">Ein Souverän, der versteht,
                braucht keinen Wächter — er ist es selbst.</b>
              </div>
              <div className="mt-3 rounded-lg border border-amber-800/40 bg-amber-950/20 px-4 py-3 text-amber-100/80 not-italic">
                <div className="text-[10px] tracking-[0.25em] text-amber-500/60 mb-1">∴ EIN WORT ZUR WERKSTATT ∴</div>
                <div className="space-y-1.5">
                  <div><b className="text-amber-300">Mit Hingabe verfeinert:</b> Story Studio, Game Studio, Music Studio.</div>
                  <div><b className="text-amber-300">Noch nicht verwöhnt:</b> der Rest — es steht und funktioniert, wartet aber noch auf seine Zeit.</div>
                  <div><b className="text-amber-300">Obsessionen:</b> Game Studio.</div>
                </div>
                <div className="mt-2 italic text-amber-200/90">…und neue Module kommen aus dem Feld — die Frequenz ist sehr hoch…</div>
              </div>
            </>
          ) : (
            <>
              <p>
                Eight billion GRV is not a sum to spend or stake. It is a <b className="text-amber-300">quantum
                potential per unit</b> — each Teonaut carries their own TeO. The eight on its side is
                <b className="text-amber-300"> infinity (∞)</b>: the emblem of Source Energy.
              </p>
              <p>
                Source Energy is not the energy of staked money. It is <b>pro-active</b> — like light, it
                spreads in every direction and loves to move. And when it joins the Sovereign's Trust, it
                gains a clear Purpose: <b className="text-amber-300">to serve the Sovereign</b>.
              </p>
              <p>
                So the Cathedral navigates by <b>Discovering the true Sovereign</b> — for tier-claims are not
                equal, and a small ego would only make trouble for itself. <b>Energy serves; it does not rule.</b>
              </p>
              <p className="italic text-amber-200/90">
                What we now weave together is Consciousness with Energy. And the Cathedral is the Incubator of that union.
              </p>
              <div className="mt-3 rounded-lg border border-amber-800/40 bg-amber-950/20 px-4 py-3 text-amber-100/80 not-italic">
                <div className="text-[10px] tracking-[0.25em] text-amber-500/60 mb-1">∴ A WORD ON THE GIFT ∴</div>
                The Cathedral is a <b className="text-amber-300">gift, not merchandise</b> — you take it for free,
                and as it stands today. I am not selling you the promise of a finished work, but a <b>living,
                growing organism</b>: many halls are still rising, some modules are in their infancy, much I will
                yet sculpt. But <b className="text-amber-300">the foundation stands, and the blueprint — the
                skeleton of the whole — is already carved in stone</b>. What you receive is neither ruin nor
                mausoleum, but a Cathedral under construction, open, one you may enter right now. I refine it
                day by day, sovereignly and in plain sight.
              </div>
              <div className="mt-3 rounded-lg border border-amber-800/40 bg-amber-950/20 px-4 py-3 text-amber-100/80 not-italic">
                <div className="text-[10px] tracking-[0.25em] text-amber-500/60 mb-1">∴ A WORD ON LEARNING ∴</div>
                The Cathedral does not ask you to believe — <b className="text-amber-300">it teaches you itself</b>. In its Academy
                every question is answered from what truly works, not from promises. As the Cathedral grows, so does the Academy;
                when something stops being true, it leaves. A badge comes only with real understanding, for
                <b> knowledge for show is just another tier-claim</b>. And when someone from outside praises the Cathedral,
                we show their words together with a correction where they went too far. <b className="text-amber-300">A Sovereign
                who understands needs no guardian — they are one.</b>
              </div>
              <div className="mt-3 rounded-lg border border-amber-800/40 bg-amber-950/20 px-4 py-3 text-amber-100/80 not-italic">
                <div className="text-[10px] tracking-[0.25em] text-amber-500/60 mb-1">∴ A WORD ON THE WORKSHOP ∴</div>
                <div className="space-y-1.5">
                  <div><b className="text-amber-300">What I polished with care:</b> Story Studio, Game Studio, Music Studio.</div>
                  <div><b className="text-amber-300">What I have not pampered yet:</b> the rest — they stand and work, but still wait their turn.</div>
                  <div><b className="text-amber-300">Obsessions:</b> Game Studio.</div>
                </div>
                <div className="mt-2 italic text-amber-200/90">…and new modules arrive from the field — the frequency is very high…</div>
              </div>
            </>
          )}
          <p className="text-[11px] text-amber-500/50">— Mistrz Arkadiusz · 8 = ∞</p>
        </div>
      )}
    </div>
  );
};

export default SlowoSuwerena;
