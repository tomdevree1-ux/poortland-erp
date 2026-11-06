(function(){
/* Poortland — Koopjes uit voorraad en Jobs.
   Beide lezen window.POORTLAND_ERP.contentUrl, hetzelfde contract als de rest
   van de door het ERP beheerde inhoud. Jef beheert ze in het ERP, de site leest
   alleen (overleg 2026-10-05). */

const t = window.plT;

function gebruikInhoud() {
  const [inhoud, zetInhoud] = React.useState(null);
  const [staat, zetStaat] = React.useState('laden');
  React.useEffect(() => {
    const url = window.POORTLAND_ERP && window.POORTLAND_ERP.contentUrl;
    if (!url) { zetStaat('fout'); return; }
    let levend = true;
    fetch(url, { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : null))
      .then(json => { if (!levend) return; zetInhoud(json); zetStaat(json ? 'klaar' : 'fout'); })
      .catch(() => { if (levend) zetStaat('fout'); });
    return () => { levend = false; };
  }, []);
  return { inhoud, staat };
}

// Bedragen volgen de taal van de bezoeker: nl-BE 1.950, fr-BE 1 950, de-DE 1.950.
const LOCALES = { NL: 'nl-BE', FR: 'fr-BE', EN: 'en-BE', DE: 'de-DE' };
const euro = n => {
  if (n == null) return null;
  const locale = LOCALES[window.PL_TAAL] || 'nl-BE';
  try { return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n); }
  catch (e) { return '€ ' + n; }
};

function Kop({ eyebrow, titel, intro }) {
  return /*#__PURE__*/React.createElement("div", {
    style: { maxWidth: 720, margin: '0 auto 40px', textAlign: 'center' }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.18em',
      textTransform: 'uppercase', color: 'var(--accent-label, var(--accent))', margin: '0 0 14px'
    }
  }, t(eyebrow)), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(32px, 6vw, 46px)',
      lineHeight: 1.1, color: 'var(--text-heading)', margin: '0 0 16px'
    }
  }, t(titel)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)', fontSize: 16.5, lineHeight: 1.7,
      color: 'var(--text-body)', margin: 0
    }
  }, t(intro)));
}

const sectieStijl = { padding: '72px 44px 96px', background: 'var(--surface-paper)' };
const kaartStijl = {
  display: 'flex', flexDirection: 'column', textAlign: 'left', padding: 0, cursor: 'pointer',
  background: 'var(--surface-card)', border: '1px solid var(--line-on-light)',
  borderRadius: 'var(--radius-lg)', overflow: 'hidden', font: 'inherit', color: 'inherit'
};

/* ---------------------------------- Koopjes --------------------------------- */

function titelVan(k) {
  return [k.materiaal, k.model].filter(Boolean).join(' · ');
}

function KoopjeKaart({ koopje, onOpen }) {
  const foto = (koopje.fotos || [])[0];
  return /*#__PURE__*/React.createElement("button", {
    type: "button", onClick: onOpen, style: kaartStijl
  }, /*#__PURE__*/React.createElement("div", {
    style: { position: 'relative', aspectRatio: '4 / 3', background: 'var(--surface-paper-2)' }
  }, foto ? /*#__PURE__*/React.createElement("img", {
    src: foto.thumb || foto.url, alt: foto.alt || titelVan(koopje), loading: "lazy",
    style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' }
  }) : null, koopje.verkocht ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute', top: 12, left: 12, background: 'var(--accent-rust, #A85638)', color: '#fff',
      fontFamily: 'var(--font-label)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
      textTransform: 'uppercase', padding: '6px 12px', borderRadius: 999
    }
  }, t('Verkocht')) : null, (koopje.fotos || []).length > 1 ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute', right: 12, bottom: 12, background: 'rgba(20,28,21,.72)', color: '#F4EEE1',
      fontFamily: 'var(--font-sans)', fontSize: 12, padding: '4px 9px', borderRadius: 999
    }
  }, koopje.fotos.length + ' ' + t("foto's")) : null), /*#__PURE__*/React.createElement("div", {
    style: { padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 23, lineHeight: 1.15,
      color: 'var(--text-heading)', margin: 0
    }
  }, titelVan(koopje)), /*#__PURE__*/React.createElement("p", {
    style: { fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', margin: 0 }
  }, [koopje.breedte && koopje.hoogte ? koopje.breedte + ' × ' + koopje.hoogte + ' cm' : null,
    koopje.ral ? 'RAL ' + koopje.ral : null].filter(Boolean).join(' · ')),
    koopje.prijs != null ? /*#__PURE__*/React.createElement("p", {
      style: {
        marginTop: 'auto', paddingTop: 10, fontFamily: 'var(--font-display)', fontSize: 26,
        color: 'var(--text-heading)', margin: '8px 0 0'
      }
    }, euro(koopje.prijs), /*#__PURE__*/React.createElement("span", {
      style: { fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--text-faint)', marginLeft: 8 }
    }, t('incl. btw'))) : null));
}

function KoopjeDetail({ koopje, onSluit }) {
  const [i, zetI] = React.useState(0);
  const fotos = koopje.fotos || [];
  React.useEffect(() => {
    const opToets = e => { if (e.key === 'Escape') onSluit(); };
    window.addEventListener('keydown', opToets);
    return () => window.removeEventListener('keydown', opToets);
  }, [onSluit]);

  const regel = (label, waarde) => {
    if (waarde == null || waarde === '') return null;
    return React.createElement("div", {
      key: label,
      style: { display: 'flex', justifyContent: 'space-between', gap: 16, padding: '9px 0', borderBottom: '1px solid var(--line-on-light-soft)' }
    }, React.createElement("dt", {
      style: { fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)' }
    }, t(label)), React.createElement("dd", {
      style: { fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--text-heading)', margin: 0, textAlign: 'right' }
    }, waarde));
  };

  const knopStijl = vol => ({
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 44,
    padding: '12px 22px', borderRadius: 'var(--radius-sm)',
    background: vol ? 'var(--accent)' : 'transparent',
    border: vol ? '1px solid var(--accent)' : '1px solid var(--accent)',
    color: vol ? '#FAF6EE' : 'var(--accent-label, var(--accent))',
    fontFamily: 'var(--font-label)', fontSize: 13, fontWeight: 600,
    letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none'
  });

  const label = koopje.verkocht ? React.createElement("p", {
    style: {
      display: 'inline-block', background: 'var(--accent-rust, #A85638)', color: '#fff',
      fontFamily: 'var(--font-label)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
      textTransform: 'uppercase', padding: '6px 12px', borderRadius: 999, margin: '0 0 12px'
    }
  }, t('Verkocht')) : null;

  const groteFoto = fotos[i] ? React.createElement("img", {
    src: fotos[i].url, alt: fotos[i].alt || titelVan(koopje),
    style: { width: '100%', borderRadius: 'var(--radius-md)', display: 'block', background: 'var(--surface-paper-2)' }
  }) : null;

  const strip = fotos.length > 1 ? React.createElement("div", {
    style: { display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }
  }, fotos.map((f, n) => React.createElement("button", {
    key: n, type: "button", onClick: () => zetI(n),
    "aria-label": t('Foto') + ' ' + (n + 1),
    "aria-current": n === i ? 'true' : undefined,
    style: {
      width: 72, height: 54, padding: 0, borderRadius: 6, overflow: 'hidden', cursor: 'pointer',
      border: n === i ? '2px solid var(--accent)' : '1px solid var(--line-on-light)', background: 'none'
    }
  }, React.createElement("img", {
    src: f.thumb || f.url, alt: "", loading: "lazy",
    style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' }
  })))) : null;

  const kenmerken = React.createElement("dl", { style: { margin: '0 0 20px' } }, [
    regel('Materiaal', koopje.materiaal),
    regel('Model', koopje.model),
    regel('RAL kleur', koopje.ral),
    regel('Afmetingen', koopje.breedte && koopje.hoogte ? koopje.breedte + ' \u00d7 ' + koopje.hoogte + ' cm' : null),
    regel('Prijs', koopje.prijs != null ? euro(koopje.prijs) + ' ' + t('incl. btw') : null)
  ]);

  const extra = koopje.extra ? React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.7,
      color: 'var(--text-body)', whiteSpace: 'pre-wrap', margin: '0 0 22px'
    }
  }, koopje.extra) : null;

  const contact = React.createElement("div", {
    style: { borderTop: '1px solid var(--line-on-light)', paddingTop: 18 }
  }, React.createElement("p", {
    style: { fontFamily: 'var(--font-sans)', fontSize: 14.5, lineHeight: 1.65, color: 'var(--text-body)', margin: '0 0 14px' }
  }, t('Interesse of een vraag over dit stuk? Bel ons even, dan weet u meteen of het nog beschikbaar is.')),
    React.createElement("div", { style: { display: 'flex', flexWrap: 'wrap', gap: 10 } },
      React.createElement("a", { href: "tel:+3215432111", style: knopStijl(true) }, t('Bel 015 43 21 11')),
      React.createElement("a", {
        href: 'mailto:info@poortland.be?subject=' + encodeURIComponent(t('Vraag over een koopje') + ': ' + titelVan(koopje)),
        style: knopStijl(false)
      }, t('Mail ons'))));

  const sluitRij = React.createElement("div", {
    style: { display: 'flex', justifyContent: 'flex-end', padding: '10px 10px 0' }
  }, React.createElement("button", {
    type: "button", onClick: onSluit, "aria-label": t('Sluiten'),
    style: {
      border: 0, background: 'none', cursor: 'pointer', fontSize: 24, lineHeight: 1,
      color: 'var(--text-muted)', minWidth: 44, minHeight: 44
    }
  }, "\u00d7"));

  const inhoud = React.createElement("div", {
    className: "pl-koopje-detail",
    style: { display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 28, padding: '0 28px 28px' }
  }, React.createElement("div", null, groteFoto, strip),
     React.createElement("div", null, label, React.createElement("h2", {
       style: {
         fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 30, lineHeight: 1.1,
         color: 'var(--text-heading)', margin: '0 0 16px'
       }
     }, titelVan(koopje)), kenmerken, extra, contact));

  return React.createElement("div", {
    role: "dialog", "aria-modal": "true", "aria-label": titelVan(koopje),
    onClick: e => { if (e.target === e.currentTarget) onSluit(); },
    style: {
      position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(20,28,21,.62)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, overflowY: 'auto'
    }
  }, React.createElement("div", {
    style: {
      background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', maxWidth: 940, width: '100%',
      maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(15,22,15,.3)'
    }
  }, sluitRij, inhoud));
}

function KoopjesNL() {
  const { inhoud, staat } = gebruikInhoud();
  const [open, zetOpen] = React.useState(null);
  const koopjes = (inhoud && inhoud.koopjes) || [];
  const huidig = koopjes.find(k => k.id === open);

  return /*#__PURE__*/React.createElement("section", { style: sectieStijl },
    /*#__PURE__*/React.createElement("div", { style: { maxWidth: 1180, margin: '0 auto' } },
      /*#__PURE__*/React.createElement(Kop, {
        eyebrow: 'Uit voorraad',
        titel: 'Koopjes',
        intro: 'Poorten en overkappingen die klaar staan in ons atelier, met een scherpe prijs. Vaak een annulatie, een showmodel of een stuk dat net niet geplaatst raakte. Op is op, en wat weg is komt niet terug.'
      }),
      staat === 'laden' ? /*#__PURE__*/React.createElement("p", {
        style: { textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }
      }, t('Bezig met laden…')) : null,
      staat === 'klaar' && !koopjes.length ? /*#__PURE__*/React.createElement("div", {
        style: {
          textAlign: 'center', border: '1px dashed var(--line-on-light)', borderRadius: 'var(--radius-lg)',
          padding: '48px 24px', maxWidth: 620, margin: '0 auto'
        }
      }, /*#__PURE__*/React.createElement("p", {
        style: { fontFamily: 'var(--font-sans)', fontSize: 15.5, lineHeight: 1.7, color: 'var(--text-body)', margin: 0 }
      }, t('Op dit moment staat er niets in de aanbieding. Kom gerust eens terug of laat ons weten waarnaar u op zoek bent.'))) : null,
      staat === 'fout' ? /*#__PURE__*/React.createElement("p", {
        style: { textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }
      }, t('De aanbiedingen konden niet geladen worden. Probeer de pagina te herladen.')) : null,
      koopjes.length ? /*#__PURE__*/React.createElement("div", {
        className: "pl-cards3",
        style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 22 }
      }, koopjes.map(k => /*#__PURE__*/React.createElement(KoopjeKaart, {
        key: k.id, koopje: k, onOpen: () => zetOpen(k.id)
      }))) : null),
    huidig ? /*#__PURE__*/React.createElement(KoopjeDetail, { koopje: huidig, onSluit: () => zetOpen(null) }) : null);
}

/* ----------------------------------- Jobs ----------------------------------- */

/* Niet elke bezoeker heeft een mailprogramma aan zijn browser gekoppeld. Dan
   doet een mailto link gewoon niets en staat de sollicitant stil. Daarom het
   adres er altijd leesbaar bij, met een knop die het kopieert. */
function AdresVangnet() {
  const [gekopieerd, zetGekopieerd] = React.useState(false);
  const adres = 'info@poortland.be';
  const kopieer = () => {
    const klaar = () => { zetGekopieerd(true); setTimeout(() => zetGekopieerd(false), 2200); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(adres).then(klaar, () => {});
      return;
    }
    const hulp = document.createElement('textarea');
    hulp.value = adres;
    hulp.setAttribute('readonly', '');
    hulp.style.position = 'absolute';
    hulp.style.left = '-9999px';
    document.body.appendChild(hulp);
    hulp.select();
    try { document.execCommand('copy'); klaar(); } catch (e) { /* stil */ }
    document.body.removeChild(hulp);
  };
  return React.createElement("p", {
    style: {
      display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10,
      fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-body)', margin: '14px 0 0'
    }
  }, React.createElement("span", { style: { color: 'var(--text-muted)' } },
    t('Opent er niets? Mail dan rechtstreeks naar')),
    React.createElement("a", {
      href: 'mailto:' + adres,
      style: { color: 'var(--text-heading)', fontWeight: 600, textDecoration: 'underline' }
    }, adres),
    React.createElement("button", {
      type: "button",
      onClick: kopieer,
      style: {
        minHeight: 32, padding: '5px 12px', cursor: 'pointer',
        border: '1px solid var(--line-on-light)', borderRadius: 'var(--radius-sm)',
        background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 13,
        color: gekopieerd ? 'var(--accent-label, var(--accent))' : 'var(--text-muted)'
      }
    }, gekopieerd ? t('Gekopieerd') : t('Kopieer adres')));
}

function VacatureKaart({ vacature }) {
  const blokken = Array.isArray(vacature.blokken) ? vacature.blokken : [];
  return /*#__PURE__*/React.createElement("article", {
    style: {
      background: 'var(--surface-card)', border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-lg)', padding: '32px 34px', marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 30, lineHeight: 1.1,
      color: 'var(--text-heading)', margin: '0 0 12px'
    }
  }, vacature.titel), vacature.intro ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)', fontSize: 15.5, lineHeight: 1.7,
      color: 'var(--text-body)', margin: '0 0 22px', maxWidth: '68ch', whiteSpace: 'pre-wrap'
    }
  }, vacature.intro) : null, /*#__PURE__*/React.createElement("div", {
    className: "pl-grid2",
    style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 26 }
  }, blokken.map((b, i) => /*#__PURE__*/React.createElement("div", { key: i },
    /*#__PURE__*/React.createElement("h3", {
      style: {
        fontFamily: 'var(--font-label)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: 'var(--accent-label, var(--accent))', margin: '0 0 10px'
      }
    }, b.kop),
    /*#__PURE__*/React.createElement("ul", {
      style: {
        margin: 0, paddingLeft: 18, fontFamily: 'var(--font-sans)', fontSize: 15,
        lineHeight: 1.75, color: 'var(--text-body)'
      }
    }, (b.punten || []).map((p, j) => /*#__PURE__*/React.createElement("li", { key: j }, p)))))),
    /*#__PURE__*/React.createElement("div", {
      style: { marginTop: 26, borderTop: '1px solid var(--line-on-light)', paddingTop: 20 }
    }, /*#__PURE__*/React.createElement("a", {
      href: 'mailto:info@poortland.be?subject=' + encodeURIComponent(t('Sollicitatie') + ': ' + vacature.titel),
      style: {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 44,
        padding: '13px 24px', borderRadius: 'var(--radius-sm)', background: 'var(--accent)',
        color: '#FAF6EE', fontFamily: 'var(--font-label)', fontSize: 13, fontWeight: 600,
        letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none'
      }
    }, t('Solliciteer per mail')), /*#__PURE__*/React.createElement(AdresVangnet, null), /*#__PURE__*/React.createElement("p", {
      style: { fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--text-muted)', margin: '12px 0 0' }
    }, t('Stuur gerust een korte motivatie mee. Liever telefonisch? Bel 015 43 21 11 en vraag naar Jef.'))));
}

function JobsNL() {
  const { inhoud, staat } = gebruikInhoud();
  const vacatures = (inhoud && inhoud.vacatures) || [];
  return /*#__PURE__*/React.createElement("section", { style: sectieStijl },
    /*#__PURE__*/React.createElement("div", { style: { maxWidth: 980, margin: '0 auto' } },
      /*#__PURE__*/React.createElement(Kop, {
        eyebrow: 'Werken bij Poortland',
        titel: 'Jobs',
        intro: 'Wij maken alles in eigen atelier en plaatsen met een eigen ploeg. Dat vraagt mensen die graag degelijk werk afleveren en hun handen uit de mouwen steken.'
      }),
      staat === 'laden' ? /*#__PURE__*/React.createElement("p", {
        style: { textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }
      }, t('Bezig met laden…')) : null,
      staat === 'klaar' && !vacatures.length ? /*#__PURE__*/React.createElement("div", {
        style: {
          textAlign: 'center', border: '1px dashed var(--line-on-light)', borderRadius: 'var(--radius-lg)',
          padding: '48px 24px'
        }
      }, /*#__PURE__*/React.createElement("p", {
        style: { fontFamily: 'var(--font-sans)', fontSize: 15.5, lineHeight: 1.7, color: 'var(--text-body)', margin: 0 }
      }, t('Op dit moment staat er geen vacature open. Denkt u dat u bij ons past? Stuur gerust een spontane sollicitatie naar info@poortland.be.'))) : null,
      vacatures.map(v => /*#__PURE__*/React.createElement(VacatureKaart, { key: v.id, vacature: v }))));
}

Object.assign(window, { KoopjesNL, JobsNL });
})();
