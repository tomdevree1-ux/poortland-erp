(function(){
/* Poortland — Nederlandse website. Productpagina (poorttype). */
const {
  Button: PrButton,
  Tag: PrTag,
  Eyebrow: PrEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function ProductNL({
  onNav,
  productKey
}) {
  const {
    GateImage,
    Reveal,
    FAQ,
    CTASectie,
    SectieKop,
    ProjectKaart
  } = window;
  const {
    PRODUCTEN,
    PRODUCT_VOLGORDE,
    PROJECTEN,
    WERKWIJZE
  } = window;
  const key = PRODUCTEN[productKey] ? productKey : 'houten';
  const p = PRODUCTEN[key];
  const relevant = (p.materiaalFilter ? PROJECTEN.filter(x => x.materiaal === p.materiaalFilter) : PROJECTEN).slice(0, 3);
  const shownProjects = relevant.length >= 3 ? relevant : PROJECTEN.slice(0, 3);
  const procesKort = WERKWIJZE.slice(0, 4);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '48px 44px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      marginBottom: 40
    }
  }, PRODUCT_VOLGORDE.map(k => {
    const active = k === key;
    return /*#__PURE__*/React.createElement("button", {
      key: k,
      onClick: () => onNav('product', {
        productKey: k
      }),
      style: {
        fontFamily: 'var(--font-label)',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        padding: '8px 14px',
        borderRadius: 'var(--radius-xs)',
        cursor: 'pointer',
        background: active ? 'var(--bronze-500)' : 'transparent',
        color: active ? 'var(--forest-950)' : 'var(--text-on-dark-muted)',
        border: `1px solid ${active ? 'var(--bronze-500)' : 'var(--line-on-dark-soft)'}`,
        transition: 'all var(--dur) var(--ease-out)'
      }
    }, PRODUCTEN[k].naam);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 56,
      alignItems: 'center',
      paddingBottom: 56
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(PrEyebrow, {
    dark: true,
    style: {
      marginBottom: 18
    }
  }, p.kicker, " · op maat"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 60,
      color: 'var(--stone-100)',
      margin: 0,
      lineHeight: 1.03,
      letterSpacing: '-0.01em'
    }
  }, p.naam), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 18,
      lineHeight: 1.6,
      color: 'var(--stone-300)',
      maxWidth: '46ch',
      margin: '22px 0 32px'
    }
  }, p.intro), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(PrButton, {
    variant: "primary",
    arrow: true,
    onClick: () => onNav('contact')
  }, "Plan een adviesgesprek"), /*#__PURE__*/React.createElement(PrButton, {
    variant: "ghost",
    dark: true,
    arrow: true,
    onClick: () => onNav('metalen')
  }, "Bekijk onze modellen"))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 90
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      boxShadow: 'var(--shadow-lg)',
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: p.tone,
    ratio: "4 / 3",
    label: p.naam,
    radius: 8,
    zoom: true,
    slats: key === 'hekwerk' ? 14 : 9
  })))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '88px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.1fr 0.9fr',
      gap: 72,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(PrEyebrow, {
    style: {
      marginBottom: 16
    }
  }, "Het materiaal"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: 28,
      lineHeight: 1.35,
      color: 'var(--text-heading)',
      margin: 0
    }
  }, p.lead)), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper-2)',
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-md)',
      padding: '30px 30px 32px'
    }
  }, /*#__PURE__*/React.createElement(PrEyebrow, {
    style: {
      marginBottom: 18
    }
  }, "Voor wie"), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, p.voorWie.map((v, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
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
      fontSize: 15.5,
      lineHeight: 1.55,
      color: 'var(--text-body)'
    }
  }, v)))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '88px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    dark: true,
    eyebrow: "Belangrijkste voordelen",
    titel: "Waarom dit type.",
    max: "14ch"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 1,
      marginTop: 44,
      background: 'var(--line-on-dark-soft)',
      border: '1px solid var(--line-on-dark-soft)'
    }
  }, p.voordelen.map(([t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: t,
    delay: i % 2 * 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--forest-900)',
      padding: '30px 32px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 26,
      color: 'var(--stone-100)',
      marginBottom: 8
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      lineHeight: 1.65,
      color: 'var(--text-on-dark-muted)',
      margin: 0,
      maxWidth: '46ch'
    }
  }, d))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '88px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 56
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-md)',
      padding: '32px 32px 36px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(PrEyebrow, {
    style: {
      marginBottom: 20
    }
  }, "Materialen"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10
    }
  }, p.materialen.map(m => /*#__PURE__*/React.createElement("span", {
    key: m,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-heading)',
      padding: '9px 16px',
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-paper-2)'
    }
  }, m))))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-md)',
      padding: '32px 32px 36px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(PrEyebrow, {
    style: {
      marginBottom: 20
    }
  }, "Afwerkingsmogelijkheden"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10
    }
  }, p.afwerking.map(m => /*#__PURE__*/React.createElement("span", {
    key: m,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-heading)',
      padding: '9px 16px',
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-paper-2)'
    }
  }, m))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper-2)',
      padding: '88px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    eyebrow: "Mogelijke stijlen",
    titel: "Eén type, vele beelden.",
    max: "16ch"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24,
      marginTop: 44
    }
  }, p.stijlen.map(([t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: t,
    delay: i * 80
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(GateImage, {
    tone: p.tone,
    ratio: "4 / 3",
    label: t,
    radius: 6,
    zoom: true,
    slats: 6 + i * 3
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 23,
      color: 'var(--text-heading)',
      margin: '16px 0 6px'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      lineHeight: 1.6,
      color: 'var(--text-muted)',
      margin: 0,
      maxWidth: '40ch'
    }
  }, d))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '88px 44px'
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
    eyebrow: "Van advies tot plaatsing",
    titel: "Hoe uw poort tot stand komt.",
    max: "16ch"
  }), /*#__PURE__*/React.createElement(PrButton, {
    variant: "secondary",
    arrow: true,
    onClick: () => onNav('werkwijze')
  }, "Volledige werkwijze"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 1,
      background: 'var(--line-on-light)',
      border: '1px solid var(--line-on-light)'
    }
  }, procesKort.map(([n, t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: n,
    delay: i * 70
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)',
      padding: '28px 24px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 32,
      color: 'var(--accent)',
      lineHeight: 0.9,
      marginBottom: 14
    }
  }, n), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 20,
      color: 'var(--text-heading)',
      margin: '0 0 7px',
      lineHeight: 1.15
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      lineHeight: 1.55,
      color: 'var(--text-muted)',
      margin: 0
    }
  }, d))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '88px 44px',
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
      marginBottom: 38,
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(SectieKop, {
    dark: true,
    eyebrow: "Relevante realisaties",
    titel: "Dit type, gerealiseerd.",
    max: "16ch"
  }), /*#__PURE__*/React.createElement(PrButton, {
    variant: "secondary",
    dark: true,
    onClick: () => onNav('metalen')
  }, "Alle modellen"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, shownProjects.map((pr, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: pr.id,
    delay: i * 80
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('metalen'),
    style: {
      textAlign: 'left',
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: pr.tone,
    ratio: "4 / 3",
    label: pr.materiaal,
    radius: 6,
    zoom: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 21,
      color: 'var(--stone-100)',
      marginTop: 14
    }
  }, pr.naam), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-on-dark-muted)',
      marginTop: 4
    }
  }, pr.regio, " · ", pr.poorttype))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper-2)',
      padding: '88px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    align: "center",
    eyebrow: "Veelgestelde vragen",
    titel: `Over ${p.naam.toLowerCase()}.`
  })), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 44
    }
  }, /*#__PURE__*/React.createElement(FAQ, {
    items: p.faq
  }))))), /*#__PURE__*/React.createElement(CTASectie, {
    onNav: onNav,
    dark: true
  }));
}
window.ProductNL = ProductNL;
})();
