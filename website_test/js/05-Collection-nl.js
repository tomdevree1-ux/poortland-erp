(function(){
/* Poortland — Nederlandse website. Realisaties overzicht met filters. */
const {
  Button: ClButton,
  Eyebrow: ClEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function CollectionNL({
  onNav
}) {
  const {
    Reveal,
    ProjectKaart,
    SectieKop
  } = window;
  const {
    PROJECTEN
  } = window;
  const materialen = ['Alle', 'Metaal', 'Hout', 'Combinatie hout en metaal'];
  const types = ['Alle', 'Schuifpoort', 'Draaipoort'];
  const [mat, setMat] = React.useState('Alle');
  const [type, setType] = React.useState('Alle');
  const shown = PROJECTEN.filter(p => (mat === 'Alle' || (p.materiaal === 'Hout' ? 'Hout' : p.materiaal === 'Staal en hout' ? 'Combinatie hout en metaal' : 'Metaal') === mat) && (type === 'Alle' || p.poorttype === type));
  const FilterRij = ({
    label,
    opties,
    waarde,
    onKies
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--text-faint)',
      minWidth: 78
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, opties.map(m => {
    const active = waarde === m;
    return /*#__PURE__*/React.createElement("button", {
      key: m,
      onClick: () => onKies(m),
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
        color: active ? 'var(--forest-950)' : 'var(--text-body)',
        border: `1px solid ${active ? 'var(--bronze-500)' : 'var(--line-on-light)'}`,
        transition: 'all var(--dur) var(--ease-out)'
      }
    }, m);
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)',
      minHeight: '70vh'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '68px 44px 60px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(ClEyebrow, {
    dark: true,
    style: {
      marginBottom: 16
    }
  }, "Realisaties"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 60,
      color: 'var(--stone-100)',
      margin: 0,
      letterSpacing: '-0.01em',
      lineHeight: 1.02
    }
  }, "Elke poort vertelt een adres."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      color: 'var(--stone-300)',
      maxWidth: '56ch',
      marginTop: 20,
      lineHeight: 1.6
    }
  }, "Een selectie van recente projecten in Vlaanderen en de rand van Brussel. Filter op materiaal en poorttype, en open een project voor de details.")))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '40px 44px 28px',
      borderBottom: '1px solid var(--line-on-light-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(FilterRij, {
    label: "Materiaal",
    opties: materialen,
    waarde: mat,
    onKies: setMat
  }), /*#__PURE__*/React.createElement(FilterRij, {
    label: "Poorttype",
    opties: types,
    waarde: type,
    onKies: setType
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '36px 44px 92px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-muted)',
      marginBottom: 26
    }
  }, shown.length, " ", shown.length === 1 ? 'realisatie' : 'realisaties'), shown.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '60px 0',
      textAlign: 'center',
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      color: 'var(--text-muted)'
    }
  }, "Geen realisaties met deze combinatie. ", /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setMat('Alle');
      setType('Alle');
    },
    style: {
      background: 'none',
      border: 0,
      color: 'var(--accent)',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: 'inherit'
    }
  }, "Toon alles")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, shown.map((p, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: p.id,
    delay: i % 3 * 80
  }, /*#__PURE__*/React.createElement(ProjectKaart, {
    project: p,
    onNav: onNav
  })))))));
}
window.CollectionNL = CollectionNL;
})();