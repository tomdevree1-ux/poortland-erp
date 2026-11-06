(function(){
/* Poortland — Nederlandse website. Over Poortland en atelier. */
const {
  Button: AbButton,
  Eyebrow: AbEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function AboutNL({
  onNav
}) {
  const {
    GateImage,
    Reveal,
    ClaimBalk,
    CTASectie,
    SectieKop
  } = window;
  const vakmanschap = [['Maatwerk', 'Elke poort wordt op maat getekend, gelast en afgewerkt. Geen samengesteld pakket, maar één object.'], ['Belgische productie', 'Alles gebeurt in ons eigen atelier in Mechelen. Geen import, geen tussenschakels.'], ['Materiaalkennis', 'Wij kennen het gedrag van eik, aluminium, staal en cortenstaal, en kiezen wat past bij uw woning.'], ['Detailzorg', 'Verhouding, ritme en afwerking worden tot in het detail uitgewerkt en gecontroleerd.'], ['Eigen plaatsers', 'Onze eigen techniekers plaatsen en stellen af. Zij kennen de poort die zij monteren.'], ['Automatisatie', 'Wij integreren betrouwbare, verdoken aandrijving en blijven beschikbaar voor de opvolging.']];
  const cijfers = [['1999', 'Opgericht'], ['100%', 'Eigen atelier'], ['5000+', 'Projecten'], ['4', 'Materialen']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)'
    }
  }, /*#__PURE__*/React.createElement("section", {
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
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 860
    }
  }, /*#__PURE__*/React.createElement(AbEyebrow, {
    dark: true,
    style: {
      marginBottom: 22
    }
  }, "Over Poortland"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 60,
      color: 'var(--stone-100)',
      margin: 0,
      lineHeight: 1.05,
      letterSpacing: '-0.01em'
    }
  }, "Een poort is de eerste indruk van het huis."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 19,
      lineHeight: 1.6,
      color: 'var(--stone-300)',
      maxWidth: '52ch',
      marginTop: 24
    }
  }, "Sinds 1999 ontwerpt, maakt en plaatst Poortland handgemaakte toegangspoorten en overkappingen op maat. Voor woningen waar uitstraling, veiligheid en afwerking samenkomen, en voor mensen die kwaliteit boven snelheid verkiezen."))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 56,
      paddingBottom: 0
    }
  }, /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: "dusk",
    ratio: "21 / 9",
    slats: 15,
    label: "Atelier en showroom · Gent",
    radius: 8
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 0,
      paddingTop: 56,
      paddingBottom: 0
    }
  }, /*#__PURE__*/React.createElement(ClaimBalk, {
    dark: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4
    }
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '90px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 72,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    eyebrow: "Wie wij zijn",
    titel: "Belgisch vakmanschap, generatie na generatie.",
    max: "18ch"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16.5,
      lineHeight: 1.75,
      color: 'var(--text-body)',
      margin: '24px 0 0',
      maxWidth: '56ch'
    }
  }, "Poortland groeide van een klein smederijatelier tot een gespecialiseerde maker van architecturale poorten. Wat onveranderd bleef, is de overtuiging dat een toegang met de hand hoort te worden gemaakt, afgestemd op de woning en gebouwd om te blijven."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16.5,
      lineHeight: 1.75,
      color: 'var(--text-body)',
      margin: '18px 0 0',
      maxWidth: '56ch'
    }
  }, "Wij werken voor villa eigenaars, renovatieklanten en eigenaars van landelijke en moderne woningen, en zijn een betrouwbare uitvoerende partner voor architecten, tuinarchitecten en aannemers.")), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: "corten",
    ratio: "4 / 5",
    slats: 7,
    label: "Smeedwerk · detail",
    radius: 8,
    zoom: true
  })))), /*#__PURE__*/React.createElement("section", {
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
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    dark: true,
    align: "center",
    eyebrow: "Atelier en vakmanschap",
    titel: "Hoe een Poortland poort ontstaat.",
    intro: "Geen import, maar maatwerk onder één dak. Van de eerste tekening tot de laatste afwerking blijft elke stap in eigen handen."
  })), /*#__PURE__*/React.createElement("div", {
    className: "pl-grid3",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 1,
      marginTop: 48,
      background: 'var(--line-on-dark-soft)',
      border: '1px solid var(--line-on-dark-soft)'
    }
  }, vakmanschap.map(([t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: t,
    delay: i % 3 * 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--forest-900)',
      padding: '30px 30px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 25,
      color: 'var(--stone-100)',
      marginBottom: 8
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14.5,
      lineHeight: 1.65,
      color: 'var(--text-on-dark-muted)',
      margin: 0
    }
  }, d))))), /*#__PURE__*/React.createElement("div", {
    className: "pl-grid4",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 24,
      marginTop: 56
    }
  }, cijfers.map(([n, l], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: l,
    delay: i * 70
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 50,
      color: 'var(--stone-100)',
      lineHeight: 1
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 10.5,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--text-on-dark-muted)',
      marginTop: 10
    }
  }, l))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '90px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '0.9fr 1.1fr',
      gap: 64,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(GateImage, {
    tone: "morning",
    ratio: "4 / 3",
    slats: 9,
    label: "Plaatsing · ter plaatse",
    radius: 8,
    zoom: true
  })), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement(SectieKop, {
    eyebrow: "Service na verkoop",
    titel: "Zekerheid op lange termijn.",
    max: "18ch"
  }), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: '24px 0 0',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, ['Poortland blijft bereikbaar na de plaatsing.', 'Service is voor ons een onderdeel van kwaliteit.', 'Onderhoud en herstellingen worden professioneel opgevolgd.', 'Automatisatie houden wij betrouwbaar in gebruik.'].map(t => /*#__PURE__*/React.createElement("li", {
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
      fontSize: 16,
      flex: '0 0 auto'
    }
  }, "—"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      lineHeight: 1.55,
      color: 'var(--text-body)'
    }
  }, t))))))), /*#__PURE__*/React.createElement("section", {
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
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(AbEyebrow, {
    dark: true,
    style: {
      marginBottom: 18
    }
  }, "Showroom"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 44,
      color: 'var(--stone-100)',
      margin: '0 auto 18px',
      maxWidth: '20ch',
      lineHeight: 1.08
    }
  }, "Ervaar de materialen van dichtbij."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      maxWidth: '50ch',
      margin: '0 auto 32px'
    }
  }, "In onze showroom in Mechelen ziet en voelt u de materialen, afwerkingen en bewegingen. Een bezoek gebeurt op afspraak, zodat wij rustig de tijd voor u nemen."), /*#__PURE__*/React.createElement(AbButton, {
    variant: "primary",
    size: "lg",
    arrow: true,
    onClick: () => onNav('contact')
  }, "Bezoek onze showroom")))), /*#__PURE__*/React.createElement(CTASectie, {
    onNav: onNav,
    dark: false
  }));
}
window.AboutNL = AboutNL;
})();
