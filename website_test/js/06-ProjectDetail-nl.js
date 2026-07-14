(function(){
/* Poortland — Nederlandse website. Projectdetailpagina. */
const {
  Button: DtButton,
  Tag: DtTag,
  Eyebrow: DtEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function ProjectDetailNL({
  project,
  onNav
}) {
  const {
    GateImage,
    Reveal,
    CTASectie
  } = window;
  const {
    PROJECTEN
  } = window;
  const p = project || PROJECTEN[0];
  const meer = PROJECTEN.filter(x => x.id !== p.id).slice(0, 3);
  const specs = [['Regio', p.regio], ['Type woning', p.woningtype], ['Materiaal', p.materiaal], ['Poorttype', p.poorttype], ['Stijl', p.stijl], ['Automatisatie', p.automatisatie], ['Breedte', p.span], ['Opgeleverd', p.jaar]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      padding: '36px 44px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('realisaties'),
    style: {
      background: 'none',
      border: 0,
      cursor: 'pointer',
      padding: 0,
      marginBottom: 22,
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-on-dark-muted)'
    }
  }, "← Terug naar realisaties"), /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(GateImage, {
    tone: p.tone,
    ratio: "21 / 9",
    slats: 13,
    label: `${p.naam} · ${p.regio}`,
    radius: 8
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '52px 44px 84px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.25fr 0.75fr',
      gap: 64
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(DtEyebrow, {
    style: {
      marginBottom: 16
    }
  }, p.regio, " · ", p.jaar), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 54,
      color: 'var(--text-heading)',
      margin: 0,
      letterSpacing: '-0.01em',
      lineHeight: 1.03
    }
  }, p.naam), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 20,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(DtTag, {
    variant: "solid"
  }, p.materiaal), /*#__PURE__*/React.createElement(DtTag, null, p.poorttype), /*#__PURE__*/React.createElement(DtTag, {
    variant: "olive"
  }, p.woningtype)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 36
    }
  }, /*#__PURE__*/React.createElement(DtEyebrow, {
    style: {
      marginBottom: 12
    }
  }, "De vraag van de klant"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.7,
      color: 'var(--text-body)',
      margin: 0,
      maxWidth: '58ch'
    }
  }, p.vraag)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 30
    }
  }, /*#__PURE__*/React.createElement(DtEyebrow, {
    style: {
      marginBottom: 12
    }
  }, "De oplossing van Poortland"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.7,
      color: 'var(--text-body)',
      margin: 0,
      maxWidth: '58ch'
    }
  }, p.oplossing)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 30
    }
  }, /*#__PURE__*/React.createElement(DtEyebrow, {
    style: {
      marginBottom: 12
    }
  }, "Details van afwerking"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      lineHeight: 1.7,
      color: 'var(--text-muted)',
      margin: 0,
      maxWidth: '58ch'
    }
  }, p.afwerking, " Gesneden, gelast en met de hand afgewerkt in ons atelier in Mechelen, en daarna ter plaatse geplaatst met verdoken automatisatie."))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("aside", null, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }
  }, specs.map(([k, v], i) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 18,
      padding: '14px 18px',
      borderBottom: i < specs.length - 1 ? '1px solid var(--line-on-light-soft)' : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-faint)'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-heading)',
      fontWeight: 500,
      textAlign: 'right'
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(DtButton, {
    variant: "primary",
    arrow: true,
    onClick: () => onNav('contact')
  }, "Vergelijkbaar project bespreken"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '52px auto 0'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(DtEyebrow, {
    style: {
      marginBottom: 18
    }
  }, "Fotogalerij"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: p.tone,
    ratio: "3 / 2",
    slats: 11,
    label: "Vooraanzicht",
    radius: 6,
    zoom: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateRows: '1fr 1fr',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: "stone",
    ratio: "auto",
    slats: 5,
    label: "Detail · profiel",
    radius: 6,
    zoom: true
  }), /*#__PURE__*/React.createElement(GateImage, {
    tone: "corten",
    ratio: "auto",
    slats: 7,
    label: "Detail · afwerking",
    radius: 6,
    zoom: true
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 820,
      margin: '64px auto 0',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontStyle: 'italic',
      fontSize: 28,
      lineHeight: 1.35,
      color: 'var(--text-heading)',
      margin: 0
    }
  }, "Een toegang die past bij de woning, het landschap en het dagelijks gebruik. Precies dat is maatwerk.")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '78px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(DtEyebrow, {
    dark: true,
    style: {
      marginBottom: 28
    }
  }, "Meer uit het atelier")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, meer.map((m, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: m.id,
    delay: i * 80
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('project', {
      project: m
    }),
    style: {
      textAlign: 'left',
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: m.tone,
    ratio: "4 / 3",
    label: m.materiaal,
    radius: 6,
    zoom: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 21,
      color: 'var(--stone-100)',
      marginTop: 13
    }
  }, m.naam), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-on-dark-muted)',
      marginTop: 4
    }
  }, m.regio, " · ", m.materiaal))))))), /*#__PURE__*/React.createElement(CTASectie, {
    onNav: onNav,
    dark: false
  }));
}
window.ProjectDetailNL = ProjectDetailNL;
})();