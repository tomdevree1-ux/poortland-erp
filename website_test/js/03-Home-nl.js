(function(){
/* Poortland — Nederlandse website. Homepage. */
const {
  Button: HButton,
  Tag: HTag,
  Eyebrow: HEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function HomeNL({
  onNav
}) {
  const {
    GateImage,
    Reveal,
    ClaimBalk,
    FAQ,
    CTASectie,
    SectieKop
  } = window;
  const {
    PROJECTEN,
    PRODUCTEN,
    WERKWIJZE,
    HOME_FAQ,
    ADVIES
  } = window;
  const uitgelicht = PROJECTEN.filter(p => p.uitgelicht).slice(0, 3);
  const routes = [['houten', 'Houten poorten', 'Warm en tijdloos', 'media/houten-poort.jpg'], ['aluminium', 'Aluminium poorten', 'Strak en onderhoudsarm', 'media/aluminium-poort.jpg'], ['staalhout', 'Combinatie staal en hout', 'Kracht en warmte', 'media/staal-hout.jpg']];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '72px 44px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.05fr 0.95fr',
      gap: 60,
      alignItems: 'center',
      paddingBottom: 64
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(HEyebrow, {
    dark: true,
    style: {
      marginBottom: 22
    }
  }, "Toegangspoorten · België"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 72,
      lineHeight: 1.02,
      letterSpacing: '-0.01em',
      color: 'var(--stone-100)',
      margin: 0
    }
  }, "Handgemaakte poorten en overkappingen op maat.")), /*#__PURE__*/React.createElement(Reveal, {
    delay: 120
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 19,
      lineHeight: 1.6,
      color: 'var(--stone-300)',
      maxWidth: '48ch',
      margin: '26px 0 34px'
    }
  }, "Poortland ontwerpt, maakt en plaatst architecturale poorten en overkappingen voor woningen waar uitstraling, veiligheid en afwerking samenkomen."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(HButton, {
    variant: "primary",
    arrow: true,
    onClick: () => onNav('contact')
  }, "Plan een adviesgesprek"), /*#__PURE__*/React.createElement(HButton, {
    variant: "ghost",
    dark: true,
    arrow: true,
    onClick: () => onNav('realisaties')
  }, "Ontdek onze realisaties")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 44,
      marginTop: 54
    }
  }, [[1999, 'Sinds', '', true], [100, 'Handgemaakt', '%', false], [320, 'Werven', '+', false]].map(([n, l, suf, plat]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 34,
      color: 'var(--stone-100)',
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement(window.Teller, {
    eind: n,
    suffix: suf,
    plat: plat
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 10,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--text-on-dark-muted)',
      marginTop: 7
    }
  }, l)))))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 8,
      overflow: 'hidden',
      position: 'relative',
      aspectRatio: '3 / 2',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "media/hero.jpg",
    alt: "Handgemaakte poort van Poortland in hout en staal",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, rgba(15,22,15,0) 55%, rgba(15,22,15,0.55) 100%)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 16,
      bottom: 14,
      fontFamily: 'var(--font-label)',
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'rgba(236,227,210,0.92)'
    }
  }, "Handgemaakt in België")))), /*#__PURE__*/React.createElement(ClaimBalk, {
    dark: true
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '92px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(HEyebrow, {
    style: {
      marginBottom: 20
    }
  }, "Over Poortland"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: 34,
      lineHeight: 1.32,
      color: 'var(--text-heading)',
      margin: 0,
      letterSpacing: '-0.005em'
    }
  }, "Poortland maakt toegangspoorten en overkappingen op maat voor woningen waar afwerking, veiligheid en uitstraling ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: 'var(--accent)'
    }
  }, "even belangrijk"), " zijn. Geen importproduct, maar Belgisch handwerk dat past bij de woning, de omgeving en het dagelijks gebruik.")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '90px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 40,
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(SectieKop, {
    dark: true,
    eyebrow: "Wat wij maken",
    titel: "Poorten, hekwerken en automatisatie.",
    max: "16ch"
  }), /*#__PURE__*/React.createElement(HButton, {
    variant: "secondary",
    dark: true,
    onClick: () => onNav('product', {
      productKey: 'houten'
    })
  }, "Alle poorten"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 18
    }
  }, routes.map(([key, naam, sub, img], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: key,
    delay: i * 80
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('product', {
      productKey: key
    }),
    style: {
      width: '100%',
      textAlign: 'left',
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--line-on-dark-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pl-zoom-wrap",
    style: {
      position: 'relative',
      aspectRatio: '3 / 2',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    className: "pl-zoom-img",
    src: img,
    alt: naam,
    loading: "lazy",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      transition: 'transform 620ms var(--ease-out)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, rgba(15,22,15,0) 52%, rgba(15,22,15,0.55) 100%)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 14,
      bottom: 12,
      fontFamily: 'var(--font-label)',
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'rgba(236,227,210,0.86)'
    }
  }, naam)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 18px 22px',
      background: 'var(--forest-850)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      color: 'var(--stone-100)',
      lineHeight: 1.1
    }
  }, naam), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-on-dark-muted)',
      marginTop: 6
    }
  }, sub, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)'
    }
  }, "↗")))))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '92px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 40,
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(SectieKop, {
    eyebrow: "Uitgelichte realisaties",
    titel: "Elke poort heeft een unieke aanpak.",
    max: "16ch"
  }), /*#__PURE__*/React.createElement(HButton, {
    variant: "secondary",
    onClick: () => onNav('realisaties')
  }, "Alle realisaties"))), /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(window.FotoBanner, {
    onNav: onNav,
    fotos: [{
      src: 'media/realisatie-metaal-1.jpeg',
      label: 'Smeedijzer · landelijke woning'
    }, {
      src: 'media/realisatie-hout-2.jpeg',
      label: 'Hout · moderne woning'
    }, {
      src: 'media/realisatie-alu-1.jpeg',
      label: 'Aluminium · schuifpoort'
    }, {
      src: 'media/realisatie-metaal-2.jpeg',
      label: 'Smeedijzer · draaipoort'
    }, {
      src: 'media/realisatie-hout-1.jpeg',
      label: 'Hout · schuifpoort'
    }]
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      padding: '0 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pl-split",
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '0.82fr 1fr',
      alignItems: 'stretch',
      minHeight: 540
    }
  }, /*#__PURE__*/React.createElement(Reveal, {
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '90px 56px 90px 0'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(HEyebrow, {
    dark: true,
    style: {
      marginBottom: 18
    }
  }, "Handwerk uit België"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 46,
      color: 'var(--stone-100)',
      margin: 0,
      lineHeight: 1.06,
      letterSpacing: '-0.01em'
    }
  }, "Geen standaardpoort", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: 'var(--accent)'
    }
  }, "maar maatwerk met karakter"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      maxWidth: '46ch',
      margin: '22px 0 28px'
    }
  }, "Elke poort van Poortland wordt ontworpen, gemaakt en geplaatst met aandacht voor verhouding, materiaal en afwerking. Geen importoplossing, maar maatwerk dat past bij de woning, de omgeving en het dagelijks gebruik."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      marginBottom: 32
    }
  }, [['Eigen atelier', 'Ontwerp, maatwerk en afwerking onder één dak.'], ['Eigen plaatsers', 'Geen onderaanneming, wel ervaren techniekers op locatie.'], ['Duurzame materialen', 'Staal, aluminium en hout van hoge kwaliteit.']].map(([t, d]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)',
      fontFamily: 'var(--font-display)',
      fontSize: 16
    }
  }, "—"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--stone-100)'
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      color: 'var(--text-on-dark-muted)',
      marginTop: 2
    }
  }, d))))), /*#__PURE__*/React.createElement(HButton, {
    variant: "primary",
    arrow: true,
    onClick: () => window.dispatchEvent(new CustomEvent('pl-offerte-open'))
  }, "Vraag een offerte aan"))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 100,
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pl-atelierbeeld pl-zoom-wrap",
    style: {
      position: 'relative',
      width: '100%',
      aspectRatio: '3 / 2',
      margin: '40px 0',
      borderRadius: 8,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    className: "pl-zoom-img",
    src: "media/staal-hout.jpg",
    alt: "Afgewerkte poort op maat van Poortland",
    style: {
      display: 'block',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 620ms var(--ease-out)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 22,
      bottom: 22,
      background: 'rgba(15,22,15,0.62)',
      borderLeft: '2px solid var(--accent)',
      padding: '14px 18px',
      maxWidth: 260
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--bronze-300)',
      marginBottom: 5
    }
  }, "Poortland"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 17,
      color: 'var(--stone-200)',
      lineHeight: 1.3
    }
  }, "Ontworpen, gemaakt en geplaatst door Poortland.")))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '90px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pl-split",
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '0.72fr 1.28fr',
      gap: 54,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    dark: true,
    eyebrow: "Materialen en afwerking",
    titel: /*#__PURE__*/React.createElement(React.Fragment, null, "Hout en metaal,", /*#__PURE__*/React.createElement("br", null), "eindeloos gecombineerd."),
    max: "26ch",
    intro: "Elke poort begint bij de juiste verhouding tussen materiaal, stijl en omgeving. Poortland werkt met hout en metaal als basis, afzonderlijk of gecombineerd, telkens op maat van de woning en het dagelijks gebruik."
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "pl-cards",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 14
    }
  }, [['metalen', 'Metalen poorten', 'Staal of aluminium, strak afgewerkt en gemaakt voor jarenlang gebruik.'], ['houten', 'Houten poorten', 'Een warme, natuurlijke uitstraling met aandacht voor detail en verhouding.'], ['combinatie', 'Combinatie hout en metaal', 'De kracht van metaal met de uitstraling van hout, volledig op maat gemaakt.']].map(([r, m, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: r,
    delay: i * 70,
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav(r),
    style: {
      width: '100%',
      textAlign: 'left',
      cursor: 'pointer',
      background: 'var(--surface-card)',
      border: '1px solid var(--line-on-light-soft)',
      borderRadius: 'var(--radius-md)',
      padding: '22px 20px 20px',
      display: 'flex',
      flexDirection: 'column',
      transition: 'border-color var(--dur) var(--ease-out), transform var(--dur) var(--ease-out)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = 'var(--accent)';
      e.currentTarget.style.transform = 'translateY(-3px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'var(--line-on-light-soft)';
      e.currentTarget.style.transform = 'none';
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      color: 'var(--text-heading)',
      lineHeight: 1.15
    }
  }, m), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      lineHeight: 1.6,
      color: 'var(--text-muted)',
      marginTop: 8,
      flex: 1
    }
  }, d), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--accent)',
      marginTop: 16
    }
  }, "Bekijk →"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26
    }
  }, /*#__PURE__*/React.createElement(HButton, {
    variant: "secondary",
    arrow: true,
    onClick: () => onNav('poorten')
  }, "Ontdek onze poorten"))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '92px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    align: "center",
    eyebrow: "Werkwijze",
    titel: "Van eerste advies tot perfecte plaatsing.",
    intro: "Een poort op maat vraagt meer dan een mooie tekening. Daarom start elk project met persoonlijk advies, een plaatsbezoek en een nauwkeurige opmeting."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 860,
      margin: '52px auto 0'
    }
  }, WERKWIJZE.map(([n, t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: n,
    delay: i % 2 * 70
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 28,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      alignSelf: 'stretch'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto',
      width: 58,
      height: 58,
      borderRadius: '50%',
      background: 'var(--accent)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      fontSize: 25,
      fontWeight: 500,
      boxShadow: '0 2px 8px rgba(20,28,21,0.12)'
    }
  }, n), i < WERKWIJZE.length - 1 ? /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 auto',
      width: 2,
      minHeight: 30,
      background: 'var(--line-on-light)',
      marginTop: 4
    }
  }) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 8,
      paddingBottom: i < WERKWIJZE.length - 1 ? 40 : 0
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 27,
      color: 'var(--text-heading)',
      margin: '0 0 10px',
      lineHeight: 1.15
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.75,
      color: 'var(--text-muted)',
      margin: 0,
      maxWidth: '52ch'
    }
  }, d)))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '84px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(HEyebrow, {
    dark: true,
    style: {
      marginBottom: 18
    }
  }, "Service na verkoop"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontStyle: 'italic',
      fontSize: 32,
      color: 'var(--stone-100)',
      margin: '0 auto 14px',
      maxWidth: '26ch',
      lineHeight: 1.3
    }
  }, "“Een poort is de eerste indruk van het huis. Wij zorgen dat die jarenlang klopt.”"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      maxWidth: '52ch',
      margin: '0 auto'
    }
  }, "Poortland blijft bereikbaar na de plaatsing. Onderhoud en herstellingen worden professioneel opgevolgd, en automatisatie houden wij betrouwbaar in gebruik. Zekerheid op lange termijn hoort bij kwaliteit.")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '92px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 38,
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(SectieKop, {
    eyebrow: "Adviescentrum",
    titel: "Helder advies voor uw keuze.",
    max: "16ch"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, ADVIES.slice(0, 3).map(([titel, cat, sub], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: titel,
    delay: i * 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-md)',
      padding: '26px 26px 28px',
      height: '100%',
      background: 'var(--surface-card)',
      transition: 'box-shadow var(--dur) var(--ease-out), transform var(--dur) var(--ease-out)',
      cursor: 'pointer'
    },
    onMouseEnter: e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      e.currentTarget.style.transform = 'translateY(-3px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'none';
    },
    onClick: () => onNav('contact')
  }, /*#__PURE__*/React.createElement(HEyebrow, {
    style: {
      marginBottom: 14
    }
  }, cat), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 24,
      color: 'var(--text-heading)',
      margin: '0 0 10px',
      lineHeight: 1.18
    }
  }, titel), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      lineHeight: 1.6,
      color: 'var(--text-muted)',
      margin: 0
    }
  }, sub))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper-2)',
      padding: '92px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    align: "center",
    eyebrow: "Veelgestelde vragen",
    titel: "Wat klanten vaak vragen."
  })), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 44
    }
  }, /*#__PURE__*/React.createElement(FAQ, {
    items: HOME_FAQ
  }))))), /*#__PURE__*/React.createElement(CTASectie, {
    onNav: onNav,
    dark: true
  }));
}

/* Gedeelde realisatiekaart */
function ProjectKaart({
  project: p,
  onNav
}) {
  const {
    GateImage
  } = window;
  const {
    Eyebrow: KEyebrow
  } = window.PoortlandDesignSystem_6dcc8b;
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('project', {
      project: p
    }),
    style: {
      textAlign: 'left',
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--line-on-light-soft)',
      background: 'var(--surface-card)',
      transition: 'box-shadow var(--dur) var(--ease-out), transform var(--dur) var(--ease-out)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      e.currentTarget.style.transform = 'translateY(-3px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'none';
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: p.tone,
    ratio: "4 / 3",
    label: p.materiaal,
    radius: 0,
    zoom: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '17px 19px 21px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement(KEyebrow, null, p.regio), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      color: 'var(--text-faint)'
    }
  }, p.jaar)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      color: 'var(--text-heading)',
      lineHeight: 1.1,
      marginTop: 8
    }
  }, p.naam), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-muted)',
      marginTop: 6
    }
  }, p.poorttype, " · ", p.span))));
}
Object.assign(window, {
  HomeNL,
  ProjectKaart
});
})();
