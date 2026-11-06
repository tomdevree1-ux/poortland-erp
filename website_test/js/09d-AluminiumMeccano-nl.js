(function(){
/* Poortland — Aluminium en Meccano, de twee bouwwijzen in aluminium
   (vraag Jef 2026-10-19). Twee tabs met elk hun eigen verhaal, en eronder een
   vaste vergelijking die bij het wisselen van tab meeschuift. Zo ziet de
   bezoeker het verschil zonder heen en weer te klikken. */

const t = window.plT;

const TABS = [
  {
    sleutel: 'aluminium',
    label: 'Aluminium',
    onder: 'Gelast',
    kop: 'De klassieke manier van bouwen',
    intro: 'Een gelaste aluminium poort is de vertrouwde bouwwijze: de profielen worden aan elkaar gelast tot een massief geheel en daarna in hun geheel gelakt. Beproefd, eenvoudig van opbouw en al decennia de standaard.',
    punten: [
      ['Vertrouwd en beproefd', 'De bouwwijze die zich bij duizenden poorten bewezen heeft.'],
      ['Massief geheel', 'De gelaste verbindingen maken van de poort een gesloten constructie.'],
      ['Lichter dan staal', 'Aluminium roest niet en blijft onderhoudsarm, ook aan de kust.']
    ]
  },
  {
    sleutel: 'meccano',
    label: 'Meccano',
    onder: 'Geschroefd en modulair',
    kop: 'Een modulair systeem, zonder lassen',
    intro: 'Meccano is opgebouwd uit geëxtrudeerde systeemprofielen die wij niet lassen maar in elkaar schroeven. De verbindingen zitten inwendig en de inox schroeven blijven onzichtbaar. Elk profiel wordt eerst afzonderlijk gelakt en pas daarna gemonteerd. Poortland heeft hiervoor het exclusieve patent voor de Benelux.',
    punten: [
      ['Tot 2,5 keer sterker', 'Geen verzwakking op de plaatsen waar anders gelast wordt.'],
      ['Geen lakbreuk', 'Elk profiel is vooraf gelakt, dus uitzetting door warmte beschadigt de lak niet.'],
      ['Inwendig verstevigd', 'Waar scharnieren of een motor komen, zit er een extra verstevigingsprofiel in.'],
      ['Profiel per profiel te herstellen', 'Bij schade vervangen wij één profiel in plaats van de hele poort.']
    ]
  }
];

const VERGELIJKING = [
  ['Opbouw', 'Gelast tot een massief geheel', 'Geschroefd uit losse systeemprofielen'],
  ['Verbinding', 'Lasnaad', 'Inwendige verbinding met inox schroeven'],
  ['Lakwerk', 'Na het lassen, in zijn geheel', 'Per profiel vooraf, in een automatische lakstraat'],
  ['Bij schade', 'Plaatselijk herstellen en bijwerken', 'Het beschadigde profiel afzonderlijk vervangen']
];

function AluminiumMeccanoBlok() {
  const [actief, zetActief] = React.useState('meccano');
  const tab = TABS.find(x => x.sleutel === actief) || TABS[0];
  const kolom = actief === 'aluminium' ? 1 : 2;

  /* Een segmentkeuze in plaats van onderstreepte tabs. De gekozen helft komt
     als een witte kaart naar voren met een accentbalk, de andere blijft in de
     ingezonken baan liggen. Zo zie je zonder lezen welke van de twee aan staat. */
  const tabKnop = x => {
    const aan = x.sleutel === actief;
    return React.createElement("button", {
      key: x.sleutel,
      type: "button",
      role: "tab",
      id: 'pl-tab-' + x.sleutel,
      "aria-selected": aan ? 'true' : 'false',
      "aria-controls": 'pl-paneel-' + x.sleutel,
      onClick: () => zetActief(x.sleutel),
      style: {
        flex: '1 1 0', minWidth: 150, minHeight: 68, cursor: 'pointer', textAlign: 'left',
        padding: '13px 18px',
        border: '1px solid ' + (aan ? 'var(--line-on-light)' : 'transparent'),
        borderTop: '3px solid ' + (aan ? 'var(--accent)' : 'transparent'),
        borderRadius: 'var(--radius-sm)',
        background: aan ? 'var(--surface-card)' : 'transparent',
        boxShadow: aan ? '0 2px 10px rgba(20,28,21,0.10)' : 'none',
        opacity: aan ? 1 : 0.72,
        transition: 'background var(--dur) var(--ease-out), opacity var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)'
      }
    }, React.createElement("span", {
      style: { display: 'flex', alignItems: 'center', gap: 8 }
    }, React.createElement("span", {
      "aria-hidden": "true",
      style: {
        width: 9, height: 9, flex: 'none', borderRadius: '50%',
        background: aan ? 'var(--accent)' : 'transparent',
        border: '1.5px solid ' + (aan ? 'var(--accent)' : 'var(--text-faint)')
      }
    }), React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)', fontSize: 21, lineHeight: 1.1,
        fontWeight: aan ? 600 : 400,
        color: aan ? 'var(--text-heading)' : 'var(--text-muted)'
      }
    }, t(x.label))), React.createElement("span", {
      style: {
        display: 'block', marginTop: 4, marginLeft: 17, fontFamily: 'var(--font-label)', fontSize: 10.5,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: aan ? 'var(--accent-label, var(--accent))' : 'var(--text-faint)'
      }
    }, t(x.onder)));
  };

  const paneel = React.createElement("div", {
    role: "tabpanel",
    id: 'pl-paneel-' + tab.sleutel,
    "aria-labelledby": 'pl-tab-' + tab.sleutel,
    style: {
      background: 'var(--surface-card)', padding: '28px 30px 30px',
      borderTop: '3px solid var(--accent)',
      borderRadius: 'var(--radius-md)'
    }
  }, React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 26, lineHeight: 1.15,
      color: 'var(--text-heading)', margin: '0 0 12px'
    }
  }, t(tab.kop)), React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)', fontSize: 15.5, lineHeight: 1.75,
      color: 'var(--text-body)', margin: '0 0 22px', maxWidth: '62ch'
    }
  }, t(tab.intro)), React.createElement("div", {
    className: "pl-grid2",
    style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }
  }, tab.punten.map(([kop, tekst], i) => React.createElement("div", {
    key: i,
    style: { borderTop: '1px solid var(--accent)', paddingTop: 12 }
  }, React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 700,
      color: 'var(--text-heading)', margin: '0 0 5px'
    }
  }, t(kop)), React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: 1.6,
      color: 'var(--text-muted)', margin: 0
    }
  }, t(tekst))))));

  // De vergelijking blijft staan en markeert de kolom van de gekozen tab.
  const cel = (tekst, gemarkeerd, vet) => React.createElement("td", {
    style: {
      padding: '12px 16px', verticalAlign: 'top',
      fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: 1.55,
      color: gemarkeerd ? 'var(--text-heading)' : 'var(--text-faint)',
      fontWeight: gemarkeerd && vet ? 600 : 400,
      background: gemarkeerd ? 'var(--surface-card)' : 'transparent',
      borderLeft: gemarkeerd ? '1px solid var(--line-on-light)' : '1px solid transparent',
      borderRight: gemarkeerd ? '1px solid var(--line-on-light)' : '1px solid transparent',
      borderBottom: '1px solid var(--line-on-light-soft)'
    }
  }, t(tekst));

  const vergelijking = React.createElement("div", {
    style: { marginTop: 26, overflowX: 'auto' }
  }, React.createElement("table", {
    style: { width: '100%', borderCollapse: 'collapse', minWidth: 520 }
  }, React.createElement("caption", {
    style: {
      captionSide: 'top', textAlign: 'left', paddingBottom: 10,
      fontFamily: 'var(--font-label)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
      textTransform: 'uppercase', color: 'var(--accent-label, var(--accent))'
    }
  }, t('Het verschil in vier punten')),
    React.createElement("thead", null, React.createElement("tr", null,
      React.createElement("th", { style: { width: '22%' } }),
      [1, 2].map(k => React.createElement("th", {
        key: k, scope: "col",
        style: {
          textAlign: 'left', padding: '10px 16px',
          fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 700,
          color: kolom === k ? 'var(--text-heading)' : 'var(--text-faint)',
          background: kolom === k ? 'var(--surface-card)' : 'transparent',
          borderTop: '3px solid ' + (kolom === k ? 'var(--accent)' : 'transparent'),
          borderLeft: '1px solid ' + (kolom === k ? 'var(--line-on-light)' : 'transparent'),
          borderRight: '1px solid ' + (kolom === k ? 'var(--line-on-light)' : 'transparent'),
          borderBottom: '1px solid ' + (kolom === k ? 'var(--line-on-light)' : 'var(--line-on-light-soft)'),
          borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0'
        }
      }, t(k === 1 ? 'Aluminium' : 'Meccano')))
    )),
    React.createElement("tbody", null, VERGELIJKING.map(([rij, a, m], i) => React.createElement("tr", { key: i },
      React.createElement("th", {
        scope: "row",
        style: {
          textAlign: 'left', padding: '12px 0', verticalAlign: 'top',
          fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
          color: 'var(--text-heading)', borderBottom: '1px solid var(--line-on-light-soft)'
        }
      }, t(rij)),
      cel(a, kolom === 1, true),
      cel(m, kolom === 2, true)
    )))));

  return React.createElement("section", {
    style: { background: 'var(--surface-ground)', padding: '84px 44px' }
  }, React.createElement("div", { style: { maxWidth: 1080, margin: '0 auto' } },
    React.createElement(window.Reveal, null,
      React.createElement("p", {
        style: {
          fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--accent-label, var(--accent))', margin: '0 0 14px'
        }
      }, t('Twee bouwwijzen in aluminium')),
      React.createElement("h2", {
        style: {
          fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(28px, 5vw, 38px)',
          lineHeight: 1.12, color: 'var(--text-heading)', margin: '0 0 12px', maxWidth: '20ch'
        }
      }, t('Aluminium en Meccano')),
      React.createElement("p", {
        style: {
          fontFamily: 'var(--font-sans)', fontSize: 16.5, lineHeight: 1.7,
          color: 'var(--text-body)', margin: '0 0 28px', maxWidth: '64ch'
        }
      }, t('Beide poorten zijn uit aluminium. Het verschil zit in de manier waarop ze gebouwd worden. Kies hieronder een bouwwijze, de vergelijking eronder loopt mee.')),
      React.createElement("div", {
        role: "tablist",
        "aria-label": t('Bouwwijze in aluminium'),
        style: {
          display: 'flex', gap: 6, padding: 6, marginBottom: 14,
          background: 'rgba(20,28,21,0.045)', borderRadius: 'var(--radius-md)'
        }
      }, TABS.map(tabKnop)),
      paneel,
      vergelijking)));
}

Object.assign(window, { AluminiumMeccanoBlok });
})();
