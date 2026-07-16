(function(){
/* Poortland — Nederlandse website. Contact, aanvraagformulier en bedankpagina. */
const {
  Button: CoButton,
  Input: CoInput,
  Eyebrow: CoEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function VeldLabel({
  children
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.16em',
      color: 'var(--text-on-dark-muted)'
    }
  }, children);
}
function Select({
  label,
  value,
  onChange,
  opties
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(VeldLabel, null, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: value,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      width: '100%',
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      color: value ? 'var(--stone-200)' : 'var(--text-on-dark-faint)',
      background: 'transparent',
      border: 0,
      borderBottom: `1.5px solid ${focus ? 'var(--bronze-500)' : 'var(--line-on-dark)'}`,
      padding: '10px 24px 10px 2px',
      outline: 'none',
      cursor: 'pointer',
      transition: 'border-color var(--dur) var(--ease-out)'
    }
  }, opties.map((o, i) => /*#__PURE__*/React.createElement("option", {
    key: i,
    value: o.value,
    disabled: o.value === '',
    style: {
      color: '#141C15',
      background: '#FAF6EE'
    }
  }, o.label))), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      right: 4,
      top: '50%',
      transform: 'translateY(-40%)',
      color: 'var(--accent)',
      fontSize: 11,
      pointerEvents: 'none'
    }
  }, "▾")));
}
function ContactNL({
  onNav
}) {
  const {
    Reveal
  } = window;
  const [sent, setSent] = React.useState(false);
  const [types, setTypes] = React.useState([]);
  const [akkoord, setAkkoord] = React.useState(false);
  const [bestand, setBestand] = React.useState('');
  const [timing, setTiming] = React.useState('');
  const [bezig, setBezig] = React.useState(false);
  const [fout, setFout] = React.useState('');
  const [klantType, setKlantType] = React.useState('particulier');
  const typeOpties = [{
    value: 'poorten',
    label: 'Poorten'
  }, {
    value: 'overkappingen',
    label: 'Overkapping'
  }, {
    value: 'automatisatie',
    label: 'Automatisatie'
  }, {
    value: 'onderhoud',
    label: 'Onderhoud'
  }, {
    value: 'andere',
    label: 'Andere vraag'
  }];
  const timingOpties = [{
    value: '',
    label: 'Gewenste timing'
  }, {
    value: 'zo-snel',
    label: 'Zo snel mogelijk'
  }, {
    value: '3-maand',
    label: 'Binnen drie maanden'
  }, {
    value: '6-maand',
    label: 'Binnen zes maanden'
  }, {
    value: 'orientatie',
    label: 'Nog in oriëntatie'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '70px 44px 96px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '0.92fr 1.08fr',
      gap: 72,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(CoEyebrow, {
    dark: true,
    style: {
      marginBottom: 20
    }
  }, "Plan een adviesgesprek"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 54,
      color: 'var(--stone-100)',
      margin: 0,
      lineHeight: 1.03,
      letterSpacing: '-0.01em'
    }
  }, "Bespreek uw project."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16.5,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      maxWidth: '42ch',
      marginTop: 22
    }
  }, "Vertel kort waarnaar u op zoek bent. Heeft u al een bepaalde stijl of materiaalkeuze in gedachten? Voeg zeker de gewenste afmetingen toe en upload enkele foto's als u die beschikbaar heeft.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), "Wij nemen persoonlijk contact op en plannen een adviesgesprek met plaatsbezoek en opmeting."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 42,
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, [['Atelier en showroom', 'Hombeeksesteenweg 164-166\n2800 Mechelen'], ['Telefoon', '+32 (0)15 432 111'], ['Email', 'info@poortland.be'], ['Openingsuren', 'Open op afspraak, maandag tot zaterdag']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: 'var(--accent)',
      marginBottom: 6
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      color: 'var(--stone-200)',
      whiteSpace: 'pre-line'
    }
  }, v))))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 90
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--forest-850)',
      borderRadius: 'var(--radius-lg)',
      padding: '36px 36px 40px',
      border: '1px solid var(--line-on-dark-soft)'
    }
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: 440,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/mono-on-light.png",
    width: "44",
    height: "44",
    alt: "",
    style: {
      marginBottom: 22
    }
  }), /*#__PURE__*/React.createElement(CoEyebrow, {
    dark: true,
    style: {
      marginBottom: 14
    }
  }, "Bedankt voor uw aanvraag"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 34,
      color: 'var(--stone-100)',
      margin: 0,
      lineHeight: 1.1
    }
  }, "Uw aanvraag is in behandeling."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15.5,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      marginTop: 14,
      maxWidth: '40ch'
    }
  }, "Wij nemen binnen twee werkdagen persoonlijk contact op om uw adviesgesprek en plaatsbezoek in te plannen. De volgende stap is een rustige opmeting bij u ter plaatse."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(CoButton, {
    variant: "primary",
    arrow: true,
    onClick: () => onNav('realisaties')
  }, "Bekijk onze realisaties"), /*#__PURE__*/React.createElement(CoButton, {
    variant: "secondary",
    dark: true,
    onClick: () => {
      setSent(false);
      setTypes([]);
      setAkkoord(false);
      setBestand('');
      setTiming('');
      setFout('');
    }
  }, "Nieuwe aanvraag"))) : /*#__PURE__*/React.createElement("form", {
    noValidate: true,
    onSubmit: e => {
      e.preventDefault();
      if (!akkoord || bezig) return;
      if (window.plToonVeldfouten ? !window.plToonVeldfouten(e.currentTarget) : !e.currentTarget.reportValidity()) return;
      var fd = new FormData(e.currentTarget);
      var eind = (window.POORTLAND_ERP || {}).leadEndpoint;
      var vraag = fd.get('vraag') || '';
      if (!eind || !window.poortlandVerstuurLead) {
        setSent(true);
        return;
      }
      setBezig(true);
      setFout('');
      window.poortlandVerstuurLead({
        endpoint: eind,
        soort: 'contact',
        velden: {
          klantType: klantType,
          bedrijfsnaam: klantType === 'bedrijf' ? fd.get('bedrijfsnaam') || '' : '',
          btwNummer: klantType === 'bedrijf' ? fd.get('btw') || '' : '',
          voornaam: fd.get('voornaam') || '',
          naam: fd.get('naam') || '',
          email: fd.get('email') || '',
          telefoon: fd.get('telefoon') || '',
          straat: fd.get('straat') || '',
          gewensteTiming: timing,
          typeAanvraag: types.join(','),
          vraag: vraag
        },
        fotos: fd.getAll('fotos')
      }).then(function () {
        setSent(true);
      }).catch(function (err) {
        setFout(err && err.message || 'Versturen mislukt. Probeer later opnieuw of bel ons.');
      }).then(function () {
        setBezig(false);
      });
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-label)',
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: 'var(--accent)',
      marginBottom: 12
    }
  }, "Type aanvraag ", /*#__PURE__*/React.createElement("span", {
    style: {
      textTransform: 'none',
      letterSpacing: 0,
      color: 'var(--text-on-dark-muted)',
      fontWeight: 400
    }
  }, "(meerdere mogelijk)")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'nowrap',
      gap: 7
    }
  }, typeOpties.map(o => {
    const aan = types.indexOf(o.value) !== -1;
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      key: o.value,
      onClick: () => setTypes(prev => aan ? prev.filter(v => v !== o.value) : prev.concat(o.value)),
      "aria-pressed": aan,
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 12.5,
        cursor: 'pointer',
        padding: '8px 12px',
        borderRadius: 999,
        whiteSpace: 'nowrap',
        transition: 'all var(--dur) var(--ease-out)',
        background: aan ? 'var(--accent)' : 'transparent',
        color: aan ? '#fff' : 'var(--stone-200)',
        border: '1px solid ' + (aan ? 'var(--accent)' : 'var(--line-on-dark)')
      }
    }, o.label);
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-label)',
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: 'var(--accent)',
      marginBottom: 12
    }
  }, "Type klant"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      border: '1px solid var(--line-on-dark)',
      borderRadius: 'var(--radius-sm)',
      padding: 4,
      maxWidth: 320
    }
  }, ['particulier', 'bedrijf'].map(t => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: t,
    onClick: () => setKlantType(t),
    style: {
      flex: 1,
      cursor: 'pointer',
      padding: '9px 12px',
      borderRadius: 5,
      border: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      fontWeight: 600,
      background: klantType === t ? 'var(--bronze-500)' : 'transparent',
      color: klantType === t ? 'var(--forest-950)' : 'var(--stone-200)',
      transition: 'all var(--dur) var(--ease-out)'
    }
  }, t === 'particulier' ? 'Particulier' : 'Bedrijf')))), klantType === 'bedrijf' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(CoInput, {
    label: "Bedrijfsnaam",
    name: "bedrijfsnaam",
    dark: true,
    placeholder: "Uw bedrijfsnaam",
    required: true
  }), /*#__PURE__*/React.createElement(CoInput, {
    label: "Btw nummer",
    name: "btw",
    dark: true,
    placeholder: "BE0123456789",
    required: true
  })) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(CoInput, {
    label: "Voornaam",
    name: "voornaam",
    dark: true,
    placeholder: "Uw voornaam",
    required: true
  }), /*#__PURE__*/React.createElement(CoInput, {
    label: "Naam",
    name: "naam",
    dark: true,
    placeholder: "Uw naam",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(CoInput, {
    label: "Email",
    name: "email",
    dark: true,
    type: "email",
    placeholder: "u@voorbeeld.be",
    required: true
  }), /*#__PURE__*/React.createElement(CoInput, {
    label: "Telefoon",
    name: "telefoon",
    dark: true,
    type: "tel",
    placeholder: "+32 ..."
  })), /*#__PURE__*/React.createElement(CoInput, {
    label: "Straat en huisnummer",
    name: "straat",
    dark: true,
    placeholder: "bv. Dorpsstraat 12"
  }), /*#__PURE__*/React.createElement(CoInput, {
    label: "Omschrijving van uw project",
    name: "vraag",
    dark: true,
    as: "textarea",
    placeholder: "De opening is ongeveer 4 meter, een schuifpoort voor de oprit ..."
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Gewenste timing",
    value: timing,
    onChange: e => setTiming(e.target.value),
    opties: timingOpties
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(VeldLabel, null, "Foto's toevoegen"), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      border: '1px dashed var(--line-on-dark)',
      borderRadius: 'var(--radius-sm)',
      padding: '14px 16px',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: bestand ? 'var(--stone-200)' : 'var(--text-on-dark-faint)'
    }
  }, bestand || 'Sleep een foto van de plek of het schetsontwerp hierheen'), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--accent)',
      flex: '0 0 auto'
    }
  }, "Kies bestand ↗"), /*#__PURE__*/React.createElement("input", {
    type: "file",
    name: "fotos",
    accept: "image/*",
    multiple: true,
    onChange: e => setBestand(e.target.files && e.target.files.length ? `${e.target.files.length} bestand(en) geselecteerd` : ''),
    style: {
      display: 'none'
    }
  }))), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.preventDefault();
      setAkkoord(!akkoord);
    },
    style: {
      width: 20,
      height: 20,
      flex: '0 0 auto',
      marginTop: 1,
      borderRadius: 3,
      border: `1.5px solid ${akkoord ? 'var(--bronze-500)' : 'var(--line-on-dark)'}`,
      background: akkoord ? 'var(--bronze-500)' : 'transparent',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--forest-950)',
      fontSize: 12,
      fontWeight: 700,
      transition: 'all var(--dur) var(--ease-out)'
    }
  }, akkoord ? '✓' : ''), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: akkoord,
    onChange: e => setAkkoord(e.target.checked),
    style: {
      display: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      lineHeight: 1.55,
      color: 'var(--stone-300)'
    }
  }, "Ik ga akkoord met de verwerking van mijn gegevens om mijn aanvraag te behandelen, volgens het privacybeleid.")), fout ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      color: 'var(--accent-rust)'
    }
  }, fout) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      marginTop: 4,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      color: 'var(--text-on-dark-faint)'
    }
  }, "Vrijblijvend · antwoord binnen twee werkdagen"), /*#__PURE__*/React.createElement(CoButton, {
    variant: "primary",
    arrow: true,
    as: "button",
    type: "submit",
    disabled: !akkoord || bezig
  }, bezig ? 'Bezig met verzenden' : 'Verstuur aanvraag'))))))));
}
window.ContactNL = ContactNL;
})();