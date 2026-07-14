(function(){
/* Poortland — Nederlandse website. Werkwijze. */
const {
  Button: WeButton,
  Eyebrow: WeEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function ProcessNL({
  onNav
}) {
  const {
    GateImage,
    Reveal,
    CTASectie,
    SectieKop
  } = window;
  const {
    WERKWIJZE
  } = window;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '72px 44px 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 0.82fr',
      gap: 60,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(WeEyebrow, {
    dark: true,
    style: {
      marginBottom: 20
    }
  }, "Werkwijze"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 62,
      color: 'var(--stone-100)',
      margin: 0,
      lineHeight: 1.02,
      letterSpacing: '-0.01em'
    }
  }, "Van eerste advies tot ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: 'var(--accent)'
    }
  }, "perfecte"), " plaatsing."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 18,
      lineHeight: 1.65,
      color: 'var(--stone-300)',
      maxWidth: '48ch',
      marginTop: 24
    }
  }, "Een poort op maat vraagt meer dan een mooie tekening. Daarom start elk project met persoonlijk advies, een plaatsbezoek en een nauwkeurige opmeting. Daarna volgt een voorstel dat rekening houdt met stijl, gebruik, veiligheid en afwerking.")), /*#__PURE__*/React.createElement(Reveal, {
    delay: 90
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: "corten",
    ratio: "4 / 5",
    slats: 6,
    label: "Atelier · Mechelen",
    radius: 8,
    zoom: true
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '88px 44px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto'
    }
  }, WERKWIJZE.map(([n, t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: n,
    delay: i % 2 * 70
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '120px 1fr',
      gap: 40,
      alignItems: 'start',
      padding: '36px 0',
      borderTop: '1px solid var(--line-on-light)',
      borderBottom: i === WERKWIJZE.length - 1 ? '1px solid var(--line-on-light)' : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 56,
      color: 'var(--accent)',
      lineHeight: 0.9
    }
  }, n), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 30,
      color: 'var(--text-heading)',
      margin: 0
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      lineHeight: 1.7,
      color: 'var(--text-body)',
      margin: '12px 0 0',
      maxWidth: '62ch'
    }
  }, d))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '40px 44px 90px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--forest-900)',
      borderRadius: 'var(--radius-lg)',
      padding: '48px 52px',
      color: 'var(--text-on-dark)',
      display: 'grid',
      gridTemplateColumns: '0.7fr 1.3fr',
      gap: 48,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 64,
      color: 'var(--stone-100)',
      lineHeight: 1
    }
  }, "6 — 8"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--accent)',
      marginTop: 10
    }
  }, "weken gemiddeld")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(WeEyebrow, {
    dark: true,
    style: {
      marginBottom: 12
    }
  }, "Wat u mag verwachten"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16.5,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      margin: 0,
      maxWidth: '52ch'
    }
  }, "Er is altijd een plaatsbezoek en een adviesgesprek met opmeting. Het traject van eerste contact tot plaatsing duurt gemiddeld zes tot acht weken. Wij bevestigen een realistische planning bij het voorstel, en houden u onderweg op de hoogte.")))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '84px 44px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontStyle: 'italic',
      fontSize: 34,
      color: 'var(--stone-100)',
      maxWidth: '26ch',
      margin: '0 auto 28px',
      lineHeight: 1.25
    }
  }, "“Een poort op maat begint bij luisteren. Pas daarna pakken wij het potlood.”"), /*#__PURE__*/React.createElement(WeEyebrow, {
    dark: true,
    tone: "muted",
    style: {
      marginBottom: 34
    }
  }, "Het team van Poortland · Gent"), /*#__PURE__*/React.createElement(WeButton, {
    variant: "primary",
    size: "lg",
    arrow: true,
    onClick: () => onNav('contact')
  }, "Plan een adviesgesprek"))), /*#__PURE__*/React.createElement(CTASectie, {
    onNav: onNav,
    dark: false
  }));
}
window.ProcessNL = ProcessNL;
})();