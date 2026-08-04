(function(){
/* Poortland — Nederlandse website. Contact, aanvraagformulier en bedankpagina. */
const {
  Button: CoButton,
  Input: CoInput,
  Eyebrow: CoEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
const t = window.plT;
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
  }, t(children));
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
  }, t(o.label)))), /*#__PURE__*/React.createElement("span", {
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
  onNav,
  voorselectie
}) {
  const {
    Reveal
  } = window;
  const [sent, setSent] = React.useState(false);
  const [types, setTypes] = React.useState(voorselectie ? [voorselectie] : []);
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
    label: 'Vraag'
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
  }, t('Plan een adviesgesprek')), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 54,
      color: 'var(--stone-100)',
      margin: 0,
      lineHeight: 1.03,
      letterSpacing: '-0.01em'
    }
  }, t('Bespreek uw project.')), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16.5,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      maxWidth: '42ch',
      marginTop: 22
    }
  }, t("Vertel kort waarnaar u op zoek bent. Heeft u al een bepaalde stijl of materiaalkeuze in gedachten? Voeg zeker de gewenste afmetingen toe en upload enkele foto's als u die beschikbaar heeft."), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), t('Wij nemen persoonlijk contact op en plannen een adviesgesprek met plaatsbezoek en opmeting.')), /*#__PURE__*/React.createElement("div", {
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
  }, t(k)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      color: 'var(--stone-200)',
      whiteSpace: 'pre-line'
    }
  }, t(v)))))), /*#__PURE__*/React.createElement(Reveal, {
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
  }, t('Bedankt voor uw aanvraag')), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 34,
      color: 'var(--stone-100)',
      margin: 0,
      lineHeight: 1.1
    }
  }, t('Uw aanvraag is in behandeling.')), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15.5,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      marginTop: 14,
      maxWidth: '40ch'
    }
  }, t('Wij nemen binnen twee werkdagen persoonlijk contact op om uw adviesgesprek en plaatsbezoek in te plannen. De volgende stap is een rustige opmeting bij u ter plaatse.')), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(CoButton, {
    variant: "primary",
    arrow: true,
    onClick: () => onNav('metalen')
  }, t('Bekijk onze modellen')), /*#__PURE__*/React.createElement(CoButton, {
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
  }, t('Nieuwe aanvraag')))) : /*#__PURE__*/React.createElement("form", {
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
          btwNummer: klantType === 'bedrijf' ? fd.get('btwNummer') || '' : '',
          naam: fd.get('naam') || '',
          voornaam: fd.get('voornaam') || '',
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
  }, t('Type aanvraag'), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      textTransform: 'none',
      letterSpacing: 0,
      color: 'var(--text-on-dark-muted)',
      fontWeight: 400
    }
  }, t('(meerdere mogelijk)'))), /*#__PURE__*/React.createElement("div", {
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
        fontSize: 13.5,
        cursor: 'pointer',
        padding: '8px 14px',
        borderRadius: 999,
        whiteSpace: 'nowrap',
        transition: 'all var(--dur) var(--ease-out)',
        background: aan ? 'var(--accent)' : 'transparent',
        color: aan ? '#fff' : 'var(--stone-200)',
        border: '1px solid ' + (aan ? 'var(--accent)' : 'var(--line-on-dark)')
      }
    }, t(o.label));
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
  }, t('Type klant')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      padding: 4,
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--line-on-dark)'
    }
  }, ['particulier', 'bedrijf'].map(kt => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: kt,
    onClick: () => setKlantType(kt),
    style: {
      flex: 1,
      padding: '10px 12px',
      borderRadius: 4,
      border: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      fontWeight: 600,
      transition: 'all var(--dur) var(--ease-out)',
      background: klantType === kt ? 'var(--accent)' : 'transparent',
      color: klantType === kt ? '#fff' : 'var(--stone-200)'
    }
  }, kt === 'particulier' ? t('Particulier') : t('Bedrijf'))))), klantType === 'bedrijf' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(CoInput, {
    label: t('Bedrijfsnaam'),
    name: "bedrijfsnaam",
    dark: true,
    placeholder: t('Uw bedrijfsnaam'),
    required: true
  }), /*#__PURE__*/React.createElement(CoInput, {
    label: t('Btw nummer'),
    name: "btwNummer",
    dark: true,
    placeholder: "BE 0123 456 789",
    required: true
  })) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(CoInput, {
    label: t('Voornaam'),
    name: "voornaam",
    dark: true,
    placeholder: t('Uw voornaam'),
    required: true
  }), /*#__PURE__*/React.createElement(CoInput, {
    label: t('Naam'),
    name: "naam",
    dark: true,
    placeholder: t('Uw naam'),
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(CoInput, {
    label: t('Email'),
    name: "email",
    dark: true,
    type: "email",
    placeholder: "u@voorbeeld.be",
    required: true
  }), /*#__PURE__*/React.createElement(CoInput, {
    label: t('Telefoon'),
    name: "telefoon",
    dark: true,
    type: "tel",
    placeholder: "+32 ..."
  })), /*#__PURE__*/React.createElement(CoInput, {
    label: t('Straat en huisnummer'),
    name: "straat",
    dark: true,
    placeholder: t('bv. Dorpsstraat 12')
  }), /*#__PURE__*/React.createElement(CoInput, {
    label: t('Omschrijving van uw project'),
    name: "vraag",
    dark: true,
    as: "textarea",
    placeholder: t('De opening is ongeveer 4 meter, een schuifpoort voor de oprit ...')
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
  }, bestand || t('Sleep een foto van de plek of het schetsontwerp hierheen')), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--accent)',
      flex: '0 0 auto'
    }
  }, t('Kies bestand'), " ↗"), /*#__PURE__*/React.createElement("input", {
    type: "file",
    name: "fotos",
    accept: "image/*",
    multiple: true,
    onChange: e => setBestand(e.target.files && e.target.files.length ? `${e.target.files.length} ${t('bestand(en) geselecteerd')}` : ''),
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
  }, t('Ik ga akkoord met de verwerking van mijn gegevens om mijn aanvraag te behandelen, volgens het privacybeleid.'))), fout ? /*#__PURE__*/React.createElement("div", {
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
  }, t('Vrijblijvend · antwoord binnen twee werkdagen')), /*#__PURE__*/React.createElement(CoButton, {
    variant: "primary",
    arrow: true,
    as: "button",
    type: "submit",
    disabled: !akkoord || bezig
  }, bezig ? t('Bezig met verzenden') : t('Verstuur aanvraag')))))))));
}
window.ContactNL = ContactNL;
})();
