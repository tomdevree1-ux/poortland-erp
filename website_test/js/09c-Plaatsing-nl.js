(function(){
/* Poortland — Plaatsing. Hoe wij een schuifpoortrail en poortpalen plaatsen,
   met de technische details die deze pagina onderscheiden (tekst Tom
   2026-10-19). De fotorijen houden plaats vrij voor beelden die nog volgen. */

const t = window.plT;
const offerte = () => window.dispatchEvent(new CustomEvent('pl-offerte-open'));

const sectie = (donker, extra) => Object.assign({
  background: donker ? 'var(--surface-paper-2)' : 'var(--surface-paper)',
  padding: '76px 44px'
}, extra || {});
const binnen = { maxWidth: 980, margin: '0 auto' };

function Eyebrow({ children }) {
  return React.createElement("p", {
    style: {
      fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.18em',
      textTransform: 'uppercase', color: 'var(--accent-label, var(--accent))', margin: '0 0 14px'
    }
  }, children);
}
function H2({ children }) {
  return React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(26px, 4vw, 36px)',
      lineHeight: 1.12, color: 'var(--text-heading)', margin: '0 0 10px'
    }
  }, children);
}
function H3({ children }) {
  return React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 22,
      lineHeight: 1.2, color: 'var(--text-heading)', margin: '26px 0 8px'
    }
  }, children);
}
function Lead({ children }) {
  return React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)', fontSize: 17, lineHeight: 1.7,
      color: 'var(--text-body)', margin: '0 0 18px', maxWidth: '66ch'
    }
  }, children);
}
function P({ children }) {
  return React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)', fontSize: 15.5, lineHeight: 1.75,
      color: 'var(--text-body)', margin: '0 0 14px', maxWidth: '66ch'
    }
  }, children);
}

// Een rij van drie beelden. Ontbreekt er een foto, dan blijft de plek open met
// een stippelkader en de omschrijving van wat daar hoort te komen.
function Fotorij({ beelden }) {
  return React.createElement("div", {
    className: "pl-grid3",
    style: {
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: 16, margin: '26px 0 6px'
    }
  }, beelden.map((b, i) => b.src
    ? React.createElement("figure", { key: i, style: { margin: 0 } },
        React.createElement("img", {
          src: b.src, alt: t(b.alt), loading: "lazy",
          style: {
            width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', display: 'block',
            borderRadius: 'var(--radius-md)', background: 'var(--surface-paper-2)'
          }
        }),
        React.createElement("figcaption", {
          style: {
            fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)', marginTop: 8
          }
        }, t(b.bijschrift)))
    : React.createElement("div", {
        key: i,
        style: {
          aspectRatio: '4 / 3', border: '1.5px dashed var(--line-on-light)',
          borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: 18, textAlign: 'center'
        }
      }, React.createElement("span", {
        style: { fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.6, color: 'var(--text-faint)' }
      }, t('Foto volgt'), React.createElement("br"), t(b.bijschrift)))));
}

function Wistudat({ children }) {
  return React.createElement("aside", {
    style: {
      borderLeft: '3px solid var(--accent)', background: 'var(--surface-card)',
      borderRadius: '0 var(--radius-md) var(--radius-md) 0', padding: '20px 24px', margin: '28px 0 0'
    }
  }, React.createElement("p", {
    style: {
      fontFamily: 'var(--font-label)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
      textTransform: 'uppercase', color: 'var(--accent-label, var(--accent))', margin: '0 0 8px'
    }
  }, t('Wist u dat?')), React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.75,
      color: 'var(--text-body)', margin: 0, maxWidth: '64ch'
    }
  }, children));
}

function PlaatsingNL({ onNav }) {
  const { Reveal, FAQ, CTASectie } = window;

  const hero = React.createElement("section", { style: sectie(false, { padding: '72px 44px 40px' }) },
    React.createElement("div", { style: binnen },
      React.createElement(Reveal, null,
        React.createElement(Eyebrow, null, t('Plaatsing')),
        React.createElement("h1", {
          style: {
            fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(32px, 6vw, 46px)',
            lineHeight: 1.1, color: 'var(--text-heading)', margin: '0 0 14px', maxWidth: '18ch'
          }
        }, t('Professionele plaatsing van uw poort op maat')),
        React.createElement("p", {
          style: {
            fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.3,
            color: 'var(--accent-label, var(--accent))', margin: '0 0 24px'
          }
        }, t('Een stevige basis voor jarenlang gebruiksgemak')),
        React.createElement(Lead, null, t('Een kwalitatieve poort verdient een vakkundige plaatsing. Bij Poortland zorgen wij voor een poort die perfect aansluit bij uw woning. Daar hoort een even stevige en duurzame installatie bij. Van de betonfundering tot de laatste afwerking van uw oprit: elk detail telt.')),
        React.createElement(P, null, t('Onze ervaren plaatsers werken met hoogwaardige materialen en doordachte plaatsingstechnieken. Zo bent u verzekerd van een stabiele, veilige en duurzame poort. De afwerking is verzorgd. Funderingen en bevestigingen blijven zoveel mogelijk uit het zicht.')),
        React.createElement(P, null, t('Ontdek hieronder hoe wij uw poort plaatsen en waarom een goede fundering het verschil maakt.')),
        React.createElement("figure", { style: { margin: '30px 0 0' } },
          React.createElement("img", {
            src: 'media/plaatsing-montage-poort.jpg', loading: "lazy",
            alt: t('Twee plaatsers van Poortland monteren een zwarte draaipoort aan een gemetselde paal'),
            style: {
              width: '100%', borderRadius: 'var(--radius-lg)', display: 'block',
              aspectRatio: '16 / 9', objectFit: 'cover'
            }
          }),
          React.createElement("figcaption", {
            style: { fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }
          }, t('Plaatsing door onze eigen ploeg, van de fundering tot de afregeling.'))))));

  const rail = React.createElement("section", { style: sectie(true) },
    React.createElement("div", { style: binnen },
      React.createElement(Reveal, null,
        React.createElement(H2, null, t('Plaatsing van een schuifpoort op rail')),
        React.createElement("p", {
          style: {
            fontFamily: 'var(--font-display)', fontSize: 20, lineHeight: 1.3,
            color: 'var(--accent-label, var(--accent))', margin: '0 0 20px'
          }
        }, t('Een roestvrijstalen rail als stevige basis')),
        React.createElement(P, null, t('Bij een schuifpoort op rail vormt de geleiderail de basis voor een soepele en betrouwbare werking. Daarom kiest Poortland uitsluitend voor rails uit roestvrij staal. Dat materiaal is bestand tegen corrosie en weersinvloeden en garandeert een lange levensduur.')),
        React.createElement(P, null, t('Onze instortrails maken wij bovendien in ons eigen atelier. Dankzij hun hoogte van 145 mm kan de betonfundering tot 9 cm onder het maaiveld blijven. Zo blijft het beton na de plaatsing volledig uit het zicht en sluit de rail mooi aan op uw oprit.')),
        React.createElement(H3, null, t('Hoe plaatsen wij een schuifpoortrail?')),
        React.createElement(P, null, t('Een correcte plaatsing begint bij een nauwkeurige voorbereiding van de ondergrond. Onze plaatsers verwijderen eerst de nodige bestrating en graven over de volledige lengte van de rail een geul van ongeveer 25 cm breed en 50 cm diep.')),
        React.createElement(P, null, t('Vervolgens wordt de roestvrijstalen rail op steunen geplaatst en zorgvuldig waterpas afgesteld. Zodra alles correct staat, storten wij de betonfundering die voor de nodige stabiliteit zorgt.')),
        React.createElement(H3, null, t('Een naadloze afwerking van uw oprit')),
        React.createElement(P, null, t('Na het uitharden van het beton, doorgaans de volgende dag of later die week, werken onze plaatsers de bestrating opnieuw aan. De verwijderde klinkers of tegels worden nauwkeurig op maat geslepen en netjes tegen de rail geplaatst.')),
        React.createElement(P, null, t('Zo ontstaat een strakke overgang tussen uw schuifpoort en de bestaande oprit, zonder zichtbaar funderingsbeton. Het resultaat is een stabiele schuifpoort die jarenlang soepel werkt en perfect in uw buitenomgeving past.')),
        React.createElement(Fotorij, {
          beelden: [
            { bijschrift: 'De uitgegraven geul over de volledige lengte van de rail.' },
            { src: 'media/plaatsing-rail-lassen.jpg',
              alt: 'Plaatsing van een roestvrijstalen schuifpoortrail in een betonfundering door Poortland',
              bijschrift: 'De rvs rail wordt waterpas afgesteld en vastgezet voor het storten.' },
            { bijschrift: 'De afgewerkte rail, strak aangesloten op de bestrating.' }
          ]
        }),
        React.createElement(Wistudat, null, t('De rail van een schuifpoort is doorgaans anderhalve keer zo lang als de poort zelf. Dat heeft te maken met de positie van de rolwielen onderaan de poort, die volgens een verhouding van een vierde, een helft en een vierde verdeeld worden. Die opstelling zorgt voor een goede ondersteuning en een stabiele beweging.')))));

  const palen = React.createElement("section", { style: sectie(false) },
    React.createElement("div", { style: binnen },
      React.createElement(Reveal, null,
        React.createElement(H2, null, t('Plaatsing van poortpalen')),
        React.createElement("p", {
          style: {
            fontFamily: 'var(--font-display)', fontSize: 20, lineHeight: 1.3,
            color: 'var(--accent-label, var(--accent))', margin: '0 0 20px'
          }
        }, t('Een solide verankering voor elke poort')),
        React.createElement(P, null, t('Of u nu kiest voor een enkele draaipoort, een dubbele draaipoort of een andere constructie: stevige poortpalen zijn essentieel voor een veilige en duurzame installatie. Wij stemmen de fundering en de verankering zorgvuldig af op het formaat en het gewicht van uw poort.')),
        React.createElement(H3, null, t('Kleinere en lichtere poorten')),
        React.createElement(P, null, t('Bij kleinere, lichtere poorten plaatsen wij de poortpalen rechtstreeks in een betonfundering van ongeveer 70 cm diep. Laat het gewicht van de poort het toe, dan gebruiken wij snelbeton. Daardoor kunnen onze plaatsers de poortvleugel vaak nog dezelfde dag monteren, zonder in te boeten op stabiliteit.')),
        React.createElement(H3, null, t('Grotere en zwaardere poorten')),
        React.createElement(P, null, t('Grotere of zwaardere poorten vragen een extra stevige fundering. Daarom voorzien wij afzonderlijke betonfunderingen van minstens 50 bij 50 bij 75 cm. Het beton blijft minstens 15 cm onder het maaiveld, zodat de fundering na afwerking niet zichtbaar is.')),
        React.createElement(P, null, t('Na een uithardingstijd van ongeveer een week monteren wij de poortpalen. Die zijn uitgerust met een voetplaat van 15 mm dik en worden stevig bevestigd met roestvrijstalen draadstangen en chemische verankering. Dankzij een systeem met moer en tegenmoer stelt onze plaatser elke paal uiterst nauwkeurig op hoogte af.')),
        React.createElement(H3, null, t('Een verzorgde afwerking zonder zichtbaar beton')),
        React.createElement(P, null, t('Een professioneel geplaatste poort moet stevig staan en mooi aansluiten op de bestaande omgeving. Voor de betonfunderingen verwijderen wij waar nodig een deel van de boordstenen en de bestrating.')),
        React.createElement(P, null, t('Zodra de poortpalen staan, slijpen onze vakmensen de verwijderde klinkers of tegels zorgvuldig op maat en werken zij de bestrating netjes aan tot tegen de palen. Na de plaatsing blijft er geen funderingsbeton zichtbaar en vormt uw nieuwe poort een geheel met uw oprit.')),
        React.createElement(Fotorij, {
          beelden: [
            { bijschrift: 'De voorbereide betonfundering voor de poortpaal.' },
            { bijschrift: 'De bevestiging met voetplaat en chemische verankering.' },
            { bijschrift: 'De afgewerkte poortpaal, zonder zichtbaar beton.' }
          ]
        }),
        React.createElement(H3, null, t('Levering met eigen kraanwagen')),
        React.createElement(P, null, t('Een poort op maat is zwaar en kwetsbaar. Wij leveren ze met een eigen kraanwagen tot bij de oprit, zodat ze zonder schade op haar plaats komt.')),
        React.createElement(Fotorij, {
          beelden: [
            { src: 'media/plaatsing-levering-hout.jpg',
              alt: 'Een houten poort van Poortland wordt met de kraan van de vrachtwagen getild',
              bijschrift: 'Een massief houten poort wordt met de kraan afgeladen.' },
            { src: 'media/plaatsing-levering-kraan.jpg',
              alt: 'De kraanwagen van Poortland levert een groene schuifpoort aan een woning',
              bijschrift: 'Levering tot bij de oprit, ook op smalle toegangen.' },
            { bijschrift: 'Het plaatsen van de poortvleugel aan de paal.' }
          ]
        }))));

  const waarom = React.createElement("section", { style: sectie(true) },
    React.createElement("div", { style: binnen },
      React.createElement(Reveal, null,
        React.createElement(H2, null, t('Waarom kiezen voor de plaatsing door Poortland?')),
        React.createElement(P, null, t('Een poort op maat is een investering waar u jarenlang van wilt genieten. Daarom besteden wij aan de plaatsing evenveel aandacht als aan de kwaliteit van de poort zelf. Van de eerste graafwerken tot de laatste afwerking rekent u op onze eigen ervaren plaatsers.')),
        React.createElement("ul", {
          style: {
            margin: '18px 0 0', paddingLeft: 0, listStyle: 'none',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14
          }
        }, [
          ['Duurzame materialen', 'Roestvrijstalen rails en bevestigingen voor een lange levensduur.'],
          ['Funderingen op maat', 'Afgestemd op het type, de afmetingen en het gewicht van uw poort.'],
          ['Nauwkeurige plaatsing', 'Zorgvuldig uitgelijnde rails en palen voor een optimale werking.'],
          ['Verzorgde afwerking', 'De bestaande bestrating wordt netjes aangepast, zonder zichtbaar beton.'],
          ['Eigen vakmensen', 'Een professionele uitvoering met oog voor detail.']
        ].map(([kop, uitleg], i) => React.createElement("li", {
          key: i,
          style: {
            background: 'var(--surface-card)', border: '1px solid var(--line-on-light)',
            borderRadius: 'var(--radius-md)', padding: '18px 20px'
          }
        }, React.createElement("p", {
          style: {
            fontFamily: 'var(--font-label)', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--accent-label, var(--accent))', margin: '0 0 7px'
          }
        }, t(kop)), React.createElement("p", {
          style: { fontFamily: 'var(--font-sans)', fontSize: 14.5, lineHeight: 1.65, color: 'var(--text-body)', margin: 0 }
        }, t(uitleg))))))));

  const vragen = React.createElement("section", { style: sectie(false) },
    React.createElement("div", { style: binnen },
      React.createElement(Reveal, null,
        React.createElement(Eyebrow, null, t('Veelgestelde vragen')),
        React.createElement(H2, null, t('Vragen over de plaatsing')),
        React.createElement("div", { style: { marginTop: 22 } },
          React.createElement(FAQ, {
            items: [
              [t('Hoe diep moet de fundering van een poort zijn?'),
               t('Dat hangt af van het type poort, de afmetingen en het gewicht. Lichtere poortpalen plaatsen wij doorgaans in een fundering van ongeveer 70 cm diep. Voor grotere poorten voorzien wij afzonderlijke betonfunderingen van minstens 50 bij 50 bij 75 cm.')],
              [t('Hoe lang duurt het om een poort te plaatsen?'),
               t('Dat hangt af van het type poort en van de funderingswerken. Bij kleinere poorten kunnen wij dankzij snelbeton soms nog dezelfde dag de poortvleugel monteren. Bij grotere constructies rekenen wij op een uithardingstijd van ongeveer een week voor de palen bevestigd worden.')],
              [t('Is de betonfundering zichtbaar na de plaatsing?'),
               t('Nee. Wij werken de funderingen onder het maaiveld af. Onze plaatsers passen de bestaande bestrating zorgvuldig aan, zodat uw poort mooi aansluit op de oprit en er geen funderingsbeton zichtbaar blijft.')],
              [t('Waarom gebruikt Poortland roestvrijstalen rails voor schuifpoorten?'),
               t('Roestvrij staal is uitstekend bestand tegen corrosie en weersinvloeden. Daardoor blijft de rail duurzaam en betrouwbaar, ook bij langdurige blootstelling aan regen en vocht.')]
            ]
          })))));

  return React.createElement("div", null, hero, rail, palen, waarom, vragen,
    React.createElement(CTASectie, { onNav: onNav }));
}

Object.assign(window, { PlaatsingNL });
})();
