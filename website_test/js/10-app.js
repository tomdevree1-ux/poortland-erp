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
  garantie: '/garantie/',
  faq: '/faq/',
  contact: '/contact/',
  voorwaarden: '/algemene-voorwaarden/',
  privacy: '/privacybeleid/',
  cookie: '/cookiebeleid/'
};
function padVoorRoute(route, productKey) {
  if (route === 'product') return '/poorten/' + (productKey || 'houten') + '/';
  return SLUGS[route] || '/';
}
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
  const m = p.match(/^\/poorten\/([a-z0-9-]+)\/$/);
  if (m) return {
    route: 'product',
    productKey: m[1]
  };
  return {
    route: 'home'
  };
}
function App() {
  const startRoute = routeUitPad(window.location.pathname);
  const [route, setRoute] = React.useState(startRoute.route);
  const [productKey, setProductKey] = React.useState(startRoute.productKey || 'houten');
  const [contactType, setContactType] = React.useState(null);
  const [lang, setLang] = React.useState('NL');
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
    const key = payload && payload.productKey;
    if (key) setProductKey(key);
    if (r === 'contact') setContactType(payload && payload.type ? payload.type : null);
    setRoute(r);
    const pad = padVoorRoute(r, key || productKey);
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
      if (doel.productKey) setProductKey(doel.productKey);
      if (scrollRef.current) scrollRef.current.scrollTo({
        top: 0,
        behavior: 'auto'
      });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const navRoute = route;
  let Screen;
  switch (route) {
    case 'product':
      Screen = /*#__PURE__*/React.createElement(window.ProductNL, {
        onNav: onNav,
        productKey: productKey
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
      Screen = /*#__PURE__*/React.createElement(window.PaginaNL, {
        onNav: onNav,
        content: window.PAGINAS['onderhoud']
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
    onLang: setLang
  }), /*#__PURE__*/React.createElement("main", {
    key: routeKey,
    className: "pl-page",
    "data-route": route
  }, Screen), /*#__PURE__*/React.createElement(Footer, {
    onNav: onNav,
    lang: lang,
    onLang: setLang
  }), /*#__PURE__*/React.createElement(window.OfferteModal, null), /*#__PURE__*/React.createElement(window.PoortAdviesModal, null), /*#__PURE__*/React.createElement(Lightbox, {
    src: lightbox && lightbox.src,
    alt: lightbox && lightbox.alt,
    onClose: () => setLightbox(null)
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})();
