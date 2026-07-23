(function(){
const {
  Nav,
  Footer,
  TaalBanner
} = window;
function App() {
  const [route, setRoute] = React.useState('home');
  const [productKey, setProductKey] = React.useState('houten');
  const [project, setProject] = React.useState(null);
  const [contactType, setContactType] = React.useState(null);
  const [lang, setLang] = React.useState('NL');
  const scrollRef = React.useRef(null);
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
  }), /*#__PURE__*/React.createElement(window.OfferteModal, null));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})();
