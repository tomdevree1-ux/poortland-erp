(function(){
const {
  Nav,
  Footer,
  TaalBanner
} = window;
function Lightbox({
  src,
  alt,
  onClose
}) {
  React.useEffect(() => {
    if (!src) return;
    const onKey = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const vorige = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = vorige;
    };
  }, [src, onClose]);
  if (!src) return null;
  return /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-label": alt || 'Foto',
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 300,
      background: 'rgba(15,22,15,0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(16px, 4vw, 48px)',
      cursor: 'zoom-out'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    "aria-label": "Sluiten",
    style: {
      position: 'absolute',
      top: 16,
      right: 20,
      background: 'none',
      border: 0,
      color: '#fff',
      fontSize: 40,
      lineHeight: 1,
      cursor: 'pointer',
      padding: '4px 10px'
    }
  }, "×"), /*#__PURE__*/React.createElement("figure", {
    style: {
      margin: 0,
      maxWidth: '100%',
      maxHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt || '',
    onClick: e => e.stopPropagation(),
    style: {
      maxWidth: '92vw',
      maxHeight: alt ? '80vh' : '86vh',
      width: 'auto',
      height: 'auto',
      objectFit: 'contain',
      borderRadius: 8,
      boxShadow: '0 24px 70px rgba(0,0,0,0.55)',
      cursor: 'default'
    }
  }), alt ? /*#__PURE__*/React.createElement("figcaption", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'rgba(255,255,255,0.85)',
      textAlign: 'center'
    }
  }, alt) : null));
}

/* Echte adressen per pagina (slugtabel goedgekeurd 2026-07-24). De oude
   slugs van poortland.be blijven behouden waar de inhoud overeenkomt. */
const SLUGS = {
  home: '/',
  metalen: '/metalen-poorten/',
  houten: '/houten-poorten/',
  combinatie: '/combinatie-staal-hout/',
  overkappingen: '/overkappingen/',
  werkwijze: '/werkwijze/',
  atelier: '/over-ons/',
  automatisering: '/automatisering/',
  onderhoud: '/onderhoud/',
  plaatsing: '/plaatsing-poorten/',
  garantie: '/garantie/',
  faq: '/faq/',
  koopjes: '/koopjes/',
  jobs: '/jobs/',
  contact: '/contact/',
  voorwaarden: '/algemene-voorwaarden/',
  privacy: '/privacybeleid/',
  cookie: '/cookiebeleid/'
};
function padVoorRoute(route) {
  return SLUGS[route] || '/';
}
// De oude productpagina's onder /poorten/ zijn verwijderd; wie er nog op landt
// via een oude link wordt door de server doorverwezen naar de categoriepagina.
function routeUitPad(pad) {
  if (!pad || pad === '/') return {
    route: 'home'
  };
  const p = pad.replace(/\/+$/, '') + '/';
  for (const r in SLUGS) {
    if (SLUGS[r] === p) return {
      route: r
    };
  }
  // Onbekend pad: de server geeft hier al een echte 404 mee. Toon ook een
  // echte 404 in beeld in plaats van stilletjes de homepagina (audit 2026-10-04).
  return {
    route: 'nietgevonden'
  };
}
// De taal staat in de link als ?taal=fr. Zo opent een gedeelde of gemailde
// link altijd in de bedoelde taal en blijft de keuze zichtbaar in de URL,
// zonder dat er per taal een aparte site nodig is (audit 2026-10-04).
const TAALCODES = { nl: 'NL', fr: 'FR', en: 'EN', de: 'DE' };
function taalUitUrl() {
  try {
    const p = new URLSearchParams(window.location.search).get('taal');
    return p ? TAALCODES[p.toLowerCase()] : null;
  } catch (e) { return null; }
}
function zetTaalInUrl(l) {
  try {
    const u = new URL(window.location.href);
    if (l === 'NL') u.searchParams.delete('taal');
    else u.searchParams.set('taal', l.toLowerCase());
    window.history.replaceState({}, '', u.pathname + u.search + u.hash);
  } catch (e) {}
}

// 404 in de huisstijl: rustige kop, uitleg en de weg terug.
function NietGevonden({ onNav }) {
  const t = window.plT || (x => x);
  const link = (label, route) => /*#__PURE__*/React.createElement("button", {
    key: route,
    type: "button",
    onClick: () => onNav(route),
    style: {
      background: 'none', border: 0, padding: '8px 0', minHeight: 32, cursor: 'pointer',
      fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--accent-label, var(--accent))',
      textAlign: 'left', textDecoration: 'underline', textUnderlineOffset: '3px'
    }
  }, t(label));
  return /*#__PURE__*/React.createElement("section", {
    style: { maxWidth: 680, margin: '0 auto', padding: '96px 24px 120px' }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.18em',
      textTransform: 'uppercase', color: 'var(--accent-label, var(--accent))', margin: '0 0 14px'
    }
  }, t('Pagina niet gevonden')), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(32px, 6vw, 46px)',
      lineHeight: 1.1, color: 'var(--text-heading)', margin: '0 0 16px'
    }
  }, t('Deze pagina bestaat niet meer.')), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.7,
      color: 'var(--text-body)', margin: '0 0 28px', maxWidth: '60ch'
    }
  }, t('Mogelijk is de link verouderd of staat er een tikfout in het adres. Hieronder vindt u de weg terug.')), /*#__PURE__*/React.createElement("div", {
    style: { display: 'flex', flexDirection: 'column', gap: 2 }
  }, [['Naar de homepagina', 'home'], ['Onze poorten', 'metalen'], ['Overkappingen', 'overkappingen'], ['Veelgestelde vragen', 'faq'], ['Contact', 'contact']].map(([l, r]) => link(l, r))));
}

function App() {
  const startRoute = routeUitPad(window.location.pathname);
  const [route, setRoute] = React.useState(startRoute.route);
  const [productKey, setProductKey] = React.useState(startRoute.productKey || 'houten');
  const [contactType, setContactType] = React.useState(null);
  const startTaal = taalUitUrl() || window.PL_TAAL || 'NL';
  const [lang, setLang] = React.useState(startTaal);
  const kiesTaal = l => {
    if (window.plZetTaal) window.plZetTaal(l);
    zetTaalInUrl(l);
    setLang(l);
  };
  React.useEffect(() => {
    if (window.plZetTaal) window.plZetTaal(lang);
    if (taalUitUrl()) zetTaalInUrl(lang);
  }, []);
  const [lightbox, setLightbox] = React.useState(null);
  const scrollRef = React.useRef(null);

  // Klik op een contentfoto opent de viewer. Navigatiekaarten (foto in een
  // knop of link) en modale vensters blijven ongemoeid.
  React.useEffect(() => {
    const onDocClick = e => {
      const img = e.target;
      if (!img || img.tagName !== 'IMG') return;
      const src = img.getAttribute('src') || '';
      if (src.indexOf('media/') === -1) return;
      if (img.closest('button, a, [role="dialog"]')) return;
      e.preventDefault();
      setLightbox({
        src: img.currentSrc || img.src,
        alt: img.alt || ''
      });
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);
  const onNav = (r, payload) => {
    if (r === 'contact') setContactType(payload && payload.type ? payload.type : null);
    setRoute(r);
    const pad = padVoorRoute(r);
    if (window.location.pathname !== pad) window.history.pushState({}, '', pad);
    if (scrollRef.current) scrollRef.current.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  };

  // Terug- en vooruitknop van de browser.
  React.useEffect(() => {
    const onPop = () => {
      const doel = routeUitPad(window.location.pathname);
      setRoute(doel.route);
      if (scrollRef.current) scrollRef.current.scrollTo({
        top: 0,
        behavior: 'auto'
      });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Canonical en og:url per pagina bijwerken. De head bevat één statische
  // canonical naar de homepage; zonder deze stap zou elke subpagina zichzelf
  // als kopie van de homepage aanmelden en zou Google alleen de homepage
  // indexeren. Googlebot voert JavaScript uit en leest deze bijgewerkte waarde.
  React.useEffect(() => {
    // Een 404 krijgt geen canonical naar de homepagina: dat zou een zachte 404
    // zijn. De server stuurt hier al X-Robots-Tag noindex mee.
    if (route === 'nietgevonden') {
      document.title = (window.plT || (x => x))('Pagina niet gevonden | Poortland');
      return;
    }
    const url = 'https://poortland.be' + padVoorRoute(route);
    const can = document.querySelector('link[rel="canonical"]');
    if (can) can.setAttribute('href', url);
    const og = document.querySelector('meta[property="og:url"]');
    if (og) og.setAttribute('content', url);
    // Titel per route. Elke route staat hier, ook de homepagina: zonder die
    // regel bleef na een klik binnen de app de titel van de vorige pagina
    // staan (audit 2026-10-04). De titels lopen door de vertaalmotor, zodat
    // een Franse of Duitse bezoeker geen Nederlandse tabtitel ziet.
    const vertaal = window.plT || (x => x);
    const TITELS = {
      home: 'Poorten en overkappingen op maat | Poortland Mechelen',
      metalen: 'Metalen poorten op maat | Poortland Mechelen',
      houten: 'Massief houten poorten op maat | Poortland Mechelen',
      combinatie: 'Poorten in hout en metaal op maat | Poortland',
      overkappingen: 'Overkappingen op maat | Poortland Mechelen',
      werkwijze: 'Onze werkwijze van ontwerp tot plaatsing | Poortland',
      atelier: 'Over Poortland | vakmanschap in eigen beheer',
      automatisering: 'Automatisering van poorten | Poortland Mechelen',
      onderhoud: 'Onderhoud van poorten | Poortland Mechelen',
      plaatsing: 'Poort plaatsen op maat | Schuifpoorten en draaipoorten | Poortland',
      garantie: 'Garantie en kwaliteit | Poortland',
      faq: 'Veelgestelde vragen over poorten | Poortland',
      koopjes: 'Koopjes uit voorraad | Poortland Mechelen',
      jobs: 'Jobs bij Poortland | Mechelen',
      contact: 'Contact en prijsraming | Poortland Mechelen',
      voorwaarden: 'Algemene voorwaarden | Poortland',
      privacy: 'Privacybeleid | Poortland',
      cookie: 'Cookiebeleid | Poortland'
    };
    if (TITELS[route]) document.title = vertaal(TITELS[route]);

    // Taalvarianten aanmelden. De site wisselt van taal zonder de URL te
    // veranderen; met ?taal= blijft een gedeelde link in de juiste taal openen
    // en kunnen zoekmachines de varianten uit elkaar houden.
    const basis = 'https://poortland.be' + padVoorRoute(route);
    const codes = { NL: 'nl', FR: 'fr', EN: 'en', DE: 'de' };
    document.querySelectorAll('link[data-i18n-alt]').forEach(n => n.remove());
    Object.keys(codes).forEach(code => {
      const l = document.createElement('link');
      l.rel = 'alternate';
      l.hreflang = codes[code];
      l.href = code === 'NL' ? basis : basis + '?taal=' + codes[code];
      l.setAttribute('data-i18n-alt', '1');
      document.head.appendChild(l);
    });
    const x = document.createElement('link');
    x.rel = 'alternate'; x.hreflang = 'x-default'; x.href = basis;
    x.setAttribute('data-i18n-alt', '1');
    document.head.appendChild(x);
    const ogL = document.querySelector('meta[property="og:locale"]');
    const nuTaal = codes[window.PL_TAAL] || 'nl';
    if (ogL) ogL.setAttribute('content', nuTaal === 'nl' ? 'nl_BE' : nuTaal);
    // og:title en og:description volgen de pagina zodra die haar titel zette
    setTimeout(() => {
      const ogT = document.querySelector('meta[property="og:title"]');
      if (ogT) ogT.setAttribute('content', document.title);
      const desc = document.querySelector('meta[name="description"]');
      const ogD = document.querySelector('meta[property="og:description"]');
      if (desc && ogD && desc.getAttribute('content')) ogD.setAttribute('content', desc.getAttribute('content'));
    }, 0);
  }, [route, lang]);
  const navRoute = route === 'nietgevonden' ? 'home' : route;
  let Screen;
  switch (route) {
    case 'plaatsing':
      Screen = /*#__PURE__*/React.createElement(window.PlaatsingNL, {
        onNav: onNav
      });
      break;
    case 'koopjes':
      Screen = /*#__PURE__*/React.createElement(window.KoopjesNL, {
        onNav: onNav
      });
      break;
    case 'jobs':
      Screen = /*#__PURE__*/React.createElement(window.JobsNL, {
        onNav: onNav
      });
      break;
    case 'nietgevonden':
      Screen = /*#__PURE__*/React.createElement(NietGevonden, {
        onNav: onNav
      });
      break;
    case 'werkwijze':
      Screen = /*#__PURE__*/React.createElement(window.ProcessNL, {
        onNav: onNav
      });
      break;
    case 'voorwaarden':
      Screen = /*#__PURE__*/React.createElement(window.VoorwaardenNL, {
        onNav: onNav
      });
      break;
    case 'privacy':
      Screen = /*#__PURE__*/React.createElement(window.PrivacyNL, {
        onNav: onNav
      });
      break;
    case 'cookie':
      Screen = /*#__PURE__*/React.createElement(window.CookieNL, {
        onNav: onNav
      });
      break;
    case 'atelier':
      Screen = /*#__PURE__*/React.createElement(window.OverOnsNL, {
        onNav: onNav
      });
      break;
    case 'contact':
      Screen = /*#__PURE__*/React.createElement(window.ContactNL, {
        onNav: onNav,
        voorselectie: contactType
      });
      break;
    case 'metalen':
      Screen = /*#__PURE__*/React.createElement(window.CategoriePagina, {
        onNav: onNav,
        data: window.CATEGORIEEN['metalen']
      });
      break;
    case 'houten':
      Screen = /*#__PURE__*/React.createElement(window.CategoriePagina, {
        onNav: onNav,
        data: window.CATEGORIEEN['houten']
      });
      break;
    case 'combinatie':
      Screen = /*#__PURE__*/React.createElement(window.CategoriePagina, {
        onNav: onNav,
        data: window.CATEGORIEEN['combinatie']
      });
      break;
    case 'overkappingen':
      Screen = /*#__PURE__*/React.createElement(window.OverkappingenNL, {
        onNav: onNav
      });
      break;
    case 'automatisering':
      Screen = /*#__PURE__*/React.createElement(window.AutomatiseringNL, {
        onNav: onNav
      });
      break;
    case 'onderhoud':
      Screen = /*#__PURE__*/React.createElement(window.OnderhoudNL, {
        onNav: onNav
      });
      break;
    case 'garantie':
      Screen = /*#__PURE__*/React.createElement(window.GarantieNL, {
        onNav: onNav
      });
      break;
    case 'faq':
      Screen = /*#__PURE__*/React.createElement(window.PaginaNL, {
        onNav: onNav,
        content: window.PAGINAS['faq']
      });
      break;
    default:
      Screen = /*#__PURE__*/React.createElement(window.HomeNL, {
        onNav: onNav
      });
  }
  const routeKey = route + (route === 'product' ? productKey : '');
  return /*#__PURE__*/React.createElement("div", {
    ref: scrollRef,
    style: {
      height: '100vh',
      overflowY: 'auto',
      background: 'var(--surface-ground)'
    }
  }, /*#__PURE__*/React.createElement(TaalBanner, {
    lang: lang
  }), /*#__PURE__*/React.createElement(Nav, {
    route: navRoute,
    onNav: onNav,
    lang: lang,
    onLang: kiesTaal
  }), /*#__PURE__*/React.createElement("main", {
    key: routeKey,
    id: "inhoud",
    tabIndex: -1,
    className: "pl-page",
    "data-route": route
  }, Screen), /*#__PURE__*/React.createElement(Footer, {
    onNav: onNav,
    lang: lang,
    onLang: kiesTaal
  }), /*#__PURE__*/React.createElement(window.OfferteModal, null), /*#__PURE__*/React.createElement(window.PoortAdviesModal, null), /*#__PURE__*/React.createElement(Lightbox, {
    src: lightbox && lightbox.src,
    alt: lightbox && lightbox.alt,
    onClose: () => setLightbox(null)
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})();
