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
function App() {
  const [route, setRoute] = React.useState('home');
  const [productKey, setProductKey] = React.useState('houten');
  const [project, setProject] = React.useState(null);
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
    if (payload && payload.productKey) setProductKey(payload.productKey);
    if (payload && payload.project) setProject(payload.project);
    if (r === 'contact') setContactType(payload && payload.type ? payload.type : null);
    setRoute(r);
    if (scrollRef.current) scrollRef.current.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  };
  const navRoute = route === 'project' ? 'realisaties' : route;
  let Screen;
  switch (route) {
    case 'product':
      Screen = /*#__PURE__*/React.createElement(window.ProductNL, {
        onNav: onNav,
        productKey: productKey
      });
      break;
    case 'realisaties':
      Screen = /*#__PURE__*/React.createElement(window.CollectionNL, {
        onNav: onNav
      });
      break;
    case 'project':
      Screen = /*#__PURE__*/React.createElement(window.ProjectDetailNL, {
        onNav: onNav,
        project: project
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
    case 'poorten':
      Screen = /*#__PURE__*/React.createElement(window.PaginaNL, {
        onNav: onNav,
        content: window.PAGINAS['poorten']
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
    case 'service':
      Screen = /*#__PURE__*/React.createElement(window.PaginaNL, {
        onNav: onNav,
        content: window.PAGINAS['service']
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
  const routeKey = route + (route === 'product' ? productKey : '') + (route === 'project' && project ? project.id : '');
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
  }), /*#__PURE__*/React.createElement(window.OfferteModal, null), /*#__PURE__*/React.createElement(Lightbox, {
    src: lightbox && lightbox.src,
    alt: lightbox && lightbox.alt,
    onClose: () => setLightbox(null)
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})();
