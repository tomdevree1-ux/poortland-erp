(function(){
/* Poortland — Nederlandse website. Gedeelde bouwstenen.
   Nav met productmenu en taalwisselaar, footer, beeldplaceholder, reveal animatie. */

const {
  Button: SButton,
  Tag: STag,
  Eyebrow: SEyebrow
} = window.PoortlandDesignSystem_6dcc8b;

/* ---- Veldvalidatie in huisstijl: geen browserballonnen ----
   plToonVeldfouten(form): toont foutregels in de huisstijl onder de velden,
   schuift het eerste foute veld in beeld en geeft het een subtiele
   schud-animatie (buzzer). plSchudVeld(naam) doet hetzelfde voor een veld
   met data-veld (gebruikt door de offertewizard met eigen validatie). ---- */
function plSchud(el) {
  if (!el) return;
  try {
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  } catch (f) {}
  if (el.animate) el.animate([{
    transform: 'translateX(0)'
  }, {
    transform: 'translateX(-7px)'
  }, {
    transform: 'translateX(7px)'
  }, {
    transform: 'translateX(-5px)'
  }, {
    transform: 'translateX(5px)'
  }, {
    transform: 'translateX(-2px)'
  }, {
    transform: 'translateX(0)'
  }], {
    duration: 420,
    easing: 'ease-in-out'
  });
}
window.plSchudVeld = function (naam) {
  plSchud(document.querySelector('[data-veld="' + naam + '"]'));
};
window.plToonVeldfouten = function (form) {
  Array.prototype.forEach.call(form.querySelectorAll('.pl-veldfout'), function (n) {
    n.remove();
  });
  var ongeldig = Array.prototype.filter.call(form.querySelectorAll('input, textarea, select'), function (el) {
    return el.willValidate && !el.checkValidity();
  });
  ongeldig.forEach(function (el) {
    var m = document.createElement('div');
    m.className = 'pl-veldfout';
    m.textContent = el.validity.valueMissing ? 'Vul dit veld in.' : el.type === 'email' ? 'Vul een geldig emailadres in.' : 'Controleer dit veld.';
    m.style.cssText = 'font-family:var(--font-sans);font-size:13px;color:#C27A57;margin-top:6px';
    (el.parentElement || el).appendChild(m);
  });
  if (ongeldig.length) {
    var eerste = ongeldig[0];
    plSchud(eerste.parentElement || eerste);
    try {
      eerste.focus({
        preventScroll: true
      });
    } catch (f) {
      eerste.focus();
    }
    return false;
  }
  return true;
};

/* ---- Reveal: zachte fade en lichte verschuiving bij het in beeld komen ---- */
function Reveal({
  children,
  delay = 0,
  y = 18,
  style
}) {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(!!window.__PRINT__);
  React.useEffect(() => {
    if (window.__PRINT__) {
      setShown(true);
      return;
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      opacity: shown ? 1 : 0,
      transform: shown ? 'none' : `translateY(${y}px)`,
      transition: `opacity 620ms var(--ease-out) ${delay}ms, transform 620ms var(--ease-out) ${delay}ms`,
      ...style
    }
  }, children);
}

/* ---- Gestileerde poort als beeldplaceholder. Staat in voor echte fotografie. ---- */
function GateImage({
  tone = 'dusk',
  ratio = '4 / 3',
  label,
  radius = 6,
  slats = 9,
  zoom = false
}) {
  const grounds = {
    dusk: 'linear-gradient(165deg,#26312a 0%,#1a231c 45%,#10160f 100%)',
    stone: 'linear-gradient(165deg,#3a4038 0%,#2a302a 55%,#1c211b 100%)',
    corten: 'linear-gradient(165deg,#5a3422 0%,#3c2418 55%,#1f1611 100%)',
    morning: 'linear-gradient(165deg,#48504a 0%,#333b34 50%,#222a23 100%)'
  };
  const slatPattern = `repeating-linear-gradient(90deg,
      rgba(236,227,210,0.00) 0, rgba(236,227,210,0.00) calc(100%/${slats} - 7px),
      rgba(236,227,210,0.10) calc(100%/${slats} - 7px), rgba(236,227,210,0.10) calc(100%/${slats} - 3px),
      rgba(15,22,15,0.55) calc(100%/${slats} - 3px), rgba(15,22,15,0.55) calc(100%/${slats}))`;
  const inner = /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: ratio,
      borderRadius: radius,
      overflow: 'hidden',
      background: grounds[tone] || grounds.dusk,
      height: '100%',
      transition: 'transform 620ms var(--ease-out)'
    },
    className: zoom ? 'pl-zoom-img' : undefined
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: '22% 9% 0 9%',
      background: slatPattern,
      opacity: 0.9
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: '6%',
      height: 1,
      background: 'rgba(236,227,210,0.18)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(120% 80% at 70% 10%, rgba(194,163,107,0.16), transparent 60%)'
    }
  }), label && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 14,
      bottom: 12,
      fontFamily: 'var(--font-label)',
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'rgba(236,227,210,0.72)'
    }
  }, label));
  if (!zoom) return inner;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'hidden',
      borderRadius: radius,
      height: '100%'
    },
    className: "pl-zoom-wrap"
  }, inner);
}

/* ---- Monogram (richting 02) ---- */
function Monogram({
  size = 32,
  dark = true
}) {
  const ink = dark ? 'var(--stone-200)' : 'var(--text-heading)';
  const inset = dark ? 'var(--line-on-dark)' : 'var(--line-on-light)';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: size,
      height: size,
      flex: '0 0 auto',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `1.5px solid ${ink}`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      inset: Math.max(2, size * 0.09),
      border: `1px solid ${inset}`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: size * 0.62,
      color: ink,
      lineHeight: 1,
      marginTop: size * 0.05
    }
  }, "P"));
}

/* ---- Taalwisselaar ---- */
function TaalWisselaar({
  lang,
  onLang,
  dark = true
}) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  const talen = ['NL', 'FR', 'DE', 'EN'];
  const faint = dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)';
  const active = dark ? 'var(--stone-100)' : 'var(--text-heading)';
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    style: {
      position: 'relative',
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement("button", {
    "aria-haspopup": "listbox",
    "aria-expanded": open,
    onClick: () => setOpen(v => !v),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      background: 'none',
      border: 0,
      cursor: 'pointer',
      padding: '5px 7px',
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.12em',
      color: active
    }
  }, lang, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      fontSize: 8,
      color: faint,
      transform: open ? 'rotate(180deg)' : 'none',
      transition: 'transform var(--dur) var(--ease-out)',
      display: 'inline-block'
    }
  }, "▾")), /*#__PURE__*/React.createElement("div", {
    role: "listbox",
    style: {
      position: 'absolute',
      top: '100%',
      right: 0,
      minWidth: 58,
      background: 'var(--surface-paper)',
      border: '1px solid var(--line-on-light-soft)',
      borderRadius: 'var(--radius-sm)',
      boxShadow: 'var(--shadow-md)',
      padding: 4,
      marginTop: 4,
      opacity: open ? 1 : 0,
      visibility: open ? 'visible' : 'hidden',
      transform: open ? 'translateY(0)' : 'translateY(-4px)',
      transition: 'opacity var(--dur) var(--ease-out), transform var(--dur) var(--ease-out)',
      zIndex: 50
    }
  }, talen.map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    onClick: () => {
      onLang(t);
      setOpen(false);
    },
    "aria-selected": lang === t,
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      background: lang === t ? 'var(--surface-paper-2)' : 'none',
      border: 0,
      cursor: 'pointer',
      padding: '7px 12px',
      borderRadius: 'var(--radius-xs)',
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.12em',
      color: lang === t ? 'var(--text-heading)' : 'var(--text-muted)'
    }
  }, t))));
}

/* ---- Hoofdnavigatie (structuur volgens contentspecs) ---- */
function useIsMobile(bp) {
  const [m, setM] = React.useState(typeof window !== 'undefined' && window.innerWidth <= bp);
  React.useEffect(() => {
    const on = () => setM(window.innerWidth <= bp);
    window.addEventListener('resize', on);
    on();
    return () => window.removeEventListener('resize', on);
  }, [bp]);
  return m;
}
var MENU = [{
  label: 'Poorten',
  kinderen: [{
    label: 'Metalen poorten',
    route: 'metalen',
    desc: 'Sterk en strak'
  }, {
    label: 'Houten poorten',
    route: 'houten',
    desc: 'Warm en tijdloos'
  }, {
    label: 'Combinatie hout en metaal',
    route: 'combinatie',
    desc: 'Stevig en warm'
  }]
}, {
  label: 'Overkappingen',
  route: 'overkappingen'
}, {
  label: 'Realisaties',
  route: 'realisaties'
}, {
  label: 'Service',
  kinderen: [{
    label: 'Automatisering',
    route: 'automatisering',
    desc: 'Automatische poorten'
  }, {
    label: 'Onderhoud',
    route: 'onderhoud',
    desc: 'Nazorg en herstellingen'
  }]
}, {
  label: 'Over',
  kinderen: [{
    label: 'Over ons',
    route: 'atelier',
    desc: 'Ons atelier in Mechelen'
  }, {
    label: 'Garantie',
    route: 'garantie',
    desc: 'Onze waarborgen'
  }, {
    label: 'FAQ',
    route: 'faq',
    desc: 'Veelgestelde vragen'
  }]
}, {
  label: 'Contact',
  route: 'contact'
}];
function MobileNav({
  route,
  onNav,
  _forceOpen
}) {
  const [open, setOpen] = React.useState(!!_forceOpen);
  const [exp, setExp] = React.useState('Poorten');
  React.useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  const go = r => {
    onNav(r);
    setOpen(false);
  };
  const bigItem = {
    width: '100%',
    textAlign: 'left',
    display: 'block',
    padding: '22px',
    background: 'none',
    border: 0,
    borderBottom: '1px solid var(--line-on-light-soft)',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    fontSize: 26,
    color: 'var(--text-heading)'
  };
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 60,
      background: 'rgba(247,243,235,0.97)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--line-on-dark-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 20px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => go('home'),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: 'none',
      border: 0,
      cursor: 'pointer',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(Monogram, {
    size: 28,
    dark: true
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: '0.3em',
      textTransform: 'uppercase',
      color: 'var(--text-heading)',
      paddingLeft: '0.3em'
    }
  }, "Poortland")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(true),
    "aria-label": "Menu openen",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      background: 'none',
      border: 0,
      padding: 10,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 3,
      background: 'var(--text-heading)',
      borderRadius: 2
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 3,
      background: 'var(--text-heading)',
      borderRadius: 2
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 3,
      background: 'var(--text-heading)',
      borderRadius: 2
    }
  }))), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: 'var(--surface-paper)',
      zIndex: 100,
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 20px',
      borderBottom: '1px solid var(--line-on-light-soft)',
      position: 'sticky',
      top: 0,
      background: 'var(--surface-paper)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: '0.3em',
      textTransform: 'uppercase',
      color: 'var(--text-heading)'
    }
  }, "Poortland"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(false),
    "aria-label": "Menu sluiten",
    style: {
      background: 'none',
      border: 0,
      cursor: 'pointer',
      fontSize: 36,
      lineHeight: 1,
      color: 'var(--text-heading)',
      padding: '0 6px'
    }
  }, "×")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 0 32px'
    }
  }, MENU.map(item => item.kinderen ? /*#__PURE__*/React.createElement("div", {
    key: item.label,
    style: {
      borderBottom: '1px solid var(--line-on-light-soft)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setExp(e => e === item.label ? null : item.label),
    "aria-expanded": exp === item.label,
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '22px',
      background: 'none',
      border: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-display)',
      fontSize: 26,
      color: 'var(--text-heading)'
    }
  }, /*#__PURE__*/React.createElement("span", null, item.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 26,
      color: 'var(--accent)',
      transform: exp === item.label ? 'rotate(90deg)' : 'none',
      transition: 'transform var(--dur)'
    }
  }, "›")), exp === item.label && /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 10
    }
  }, item.kinderen.map(k => /*#__PURE__*/React.createElement("button", {
    key: k.route,
    onClick: () => go(k.route),
    style: {
      width: '100%',
      textAlign: 'left',
      display: 'block',
      padding: '16px 22px 16px 34px',
      background: 'var(--surface-paper-2)',
      border: 0,
      borderTop: '1px solid var(--line-on-light-soft)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 21,
      color: 'var(--text-heading)'
    }
  }, k.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14.5,
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, k.desc))))) : /*#__PURE__*/React.createElement("button", {
    key: item.label,
    onClick: () => go(item.route),
    style: bigItem
  }, item.label)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '26px 22px 0'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      window.dispatchEvent(new CustomEvent('pl-offerte-open'));
      setOpen(false);
    },
    style: {
      width: '100%',
      background: 'var(--accent)',
      color: '#fff',
      border: 0,
      borderRadius: 'var(--radius-md)',
      padding: '18px',
      fontFamily: 'var(--font-sans)',
      fontSize: 18,
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Vraag een offerte aan"), /*#__PURE__*/React.createElement("a", {
    href: "tel:+3215432111",
    style: {
      display: 'block',
      textAlign: 'center',
      marginTop: 18,
      fontFamily: 'var(--font-sans)',
      fontSize: 19,
      fontWeight: 600,
      color: 'var(--text-heading)',
      textDecoration: 'none'
    }
  }, "Bel ons: 015 43 21 11")))));
}
function Nav(props) {
  if (useIsMobile(880)) return /*#__PURE__*/React.createElement(MobileNav, {
    route: props.route,
    onNav: props.onNav
  });
  return /*#__PURE__*/React.createElement(DesktopNav, props);
}
function DesktopNav({
  route,
  onNav,
  lang,
  onLang
}) {
  const [openMenu, setOpenMenu] = React.useState(null); // 'poorten' | 'service' | 'over'
  const [activePoort, setActivePoort] = React.useState('metalen');
  const [hoverPoort, setHoverPoort] = React.useState(null);
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const fg = 'var(--stone-200)';
  const faint = 'var(--text-on-dark-muted)';
  const POORTEN = [['metalen', 'Metalen poorten', 'Sterk en strak', 'media/stalen-poort.jpg', '(staal, metaal en aluminium)'], ['houten', 'Houten poorten', 'Warm en tijdloos', 'media/houten-poort.jpg'], ['combinatie', 'Combinatie hout en metaal', 'Stevig en warm', 'media/staal-hout.jpg']];
  const actPoort = POORTEN.find(p => p[0] === activePoort) || POORTEN[0];
  const SERVICE = [['automatisering', 'Automatisering', 'Automatische poorten'], ['onderhoud', 'Onderhoud', 'Nazorg en herstellingen']];
  const OVER = [['atelier', 'Over ons', 'Ons atelier in Mechelen'], ['garantie', 'Garantie', 'Onze waarborgen'], ['faq', 'FAQ', 'Veelgestelde vragen']];
  const linkStyle = active => ({
    background: 'none',
    border: 0,
    cursor: 'pointer',
    padding: '4px 0',
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    fontWeight: active ? 600 : 400,
    color: active ? fg : faint,
    borderBottom: active ? '1px solid var(--accent)' : '1px solid transparent'
  });
  const Caret = ({
    open
  }) => /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      fontSize: 22,
      color: 'var(--accent)',
      lineHeight: 1,
      transition: 'transform var(--dur) var(--ease-out)',
      transform: open ? 'rotate(180deg)' : 'none',
      display: 'inline-block'
    }
  }, "▾");
  const poortenActive = ['metalen', 'houten', 'combinatie'].indexOf(route) >= 0 || openMenu === 'poorten';
  const serviceActive = ['service', 'automatisering', 'onderhoud'].indexOf(route) >= 0 || openMenu === 'service';
  const overActive = ['atelier', 'garantie', 'faq'].indexOf(route) >= 0 || openMenu === 'over';
  const simpleMenu = (key, items) => /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement(SEyebrow, {
    dark: true,
    tone: "muted",
    style: {
      marginBottom: 12
    }
  }, key === 'service' ? 'Service en nazorg' : 'Over Poortland'), /*#__PURE__*/React.createElement("div", null, items.map(([k, label, desc]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    onClick: () => {
      onNav(k);
      setOpenMenu(null);
    },
    style: {
      width: '100%',
      textAlign: 'left',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 20,
      background: 'none',
      border: 0,
      cursor: 'pointer',
      padding: '15px 14px',
      borderRadius: 'var(--radius-md)',
      transition: 'background var(--dur) var(--ease-out)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--forest-800)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-display)',
      fontSize: 23,
      color: 'var(--text-heading)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      color: 'var(--text-on-dark-muted)',
      marginTop: 1
    }
  }, desc)), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)',
      fontSize: 20
    }
  }, "→")))));
  return /*#__PURE__*/React.createElement("header", {
    onMouseLeave: () => setOpenMenu(null),
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 40,
      background: 'rgba(247,243,235,0.86)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--line-on-dark-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 44px',
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      onNav('home');
      setOpenMenu(null);
    },
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 13,
      background: 'none',
      border: 0,
      cursor: 'pointer',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(Monogram, {
    size: 30,
    dark: true
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 13.5,
      fontWeight: 600,
      letterSpacing: '0.34em',
      textTransform: 'uppercase',
      color: fg,
      paddingLeft: '0.34em'
    }
  }, "Poortland")), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("button", {
    onMouseEnter: () => setOpenMenu('poorten'),
    onClick: () => setOpenMenu(v => v === 'poorten' ? null : 'poorten'),
    "aria-expanded": openMenu === 'poorten',
    style: {
      ...linkStyle(poortenActive),
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, "Poorten ", /*#__PURE__*/React.createElement(Caret, {
    open: openMenu === 'poorten'
  })), /*#__PURE__*/React.createElement("button", {
    onMouseEnter: () => setOpenMenu(null),
    onClick: () => {
      onNav('overkappingen');
      setOpenMenu(null);
    },
    style: linkStyle(route === 'overkappingen')
  }, "Overkappingen"), /*#__PURE__*/React.createElement("button", {
    onMouseEnter: () => setOpenMenu(null),
    onClick: () => {
      onNav('realisaties');
      setOpenMenu(null);
    },
    style: linkStyle(route === 'realisaties')
  }, "Realisaties"), /*#__PURE__*/React.createElement("button", {
    onMouseEnter: () => setOpenMenu('service'),
    onClick: () => setOpenMenu(v => v === 'service' ? null : 'service'),
    "aria-expanded": openMenu === 'service',
    style: {
      ...linkStyle(serviceActive),
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, "Service ", /*#__PURE__*/React.createElement(Caret, {
    open: openMenu === 'service'
  })), /*#__PURE__*/React.createElement("button", {
    onMouseEnter: () => setOpenMenu('over'),
    onClick: () => setOpenMenu(v => v === 'over' ? null : 'over'),
    "aria-expanded": openMenu === 'over',
    style: {
      ...linkStyle(overActive),
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, "Over ", /*#__PURE__*/React.createElement(Caret, {
    open: openMenu === 'over'
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 18,
      background: 'var(--line-on-dark-soft)'
    }
  }), /*#__PURE__*/React.createElement(SButton, {
    variant: "primary",
    size: "sm",
    arrow: true,
    as: "button",
    onClick: () => {
      window.dispatchEvent(new CustomEvent('pl-offerte-open'));
      setOpenMenu(null);
    }
  }, "Vraag een offerte aan"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      onNav('contact');
      setOpenMenu(null);
    },
    style: {
      background: 'none',
      border: '1.5px solid var(--text-heading)',
      borderRadius: 'var(--radius-sm)',
      cursor: 'pointer',
      padding: '11px 20px',
      fontFamily: 'var(--font-label)',
      fontSize: 12.5,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-heading)',
      transition: 'background var(--dur) var(--ease-out), color var(--dur) var(--ease-out)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--text-heading)';
      e.currentTarget.style.color = 'var(--surface-paper)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'none';
      e.currentTarget.style.color = 'var(--text-heading)';
    }
  }, "Contact"), /*#__PURE__*/React.createElement(TaalWisselaar, {
    lang: lang,
    onLang: onLang,
    dark: true
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'hidden',
      maxHeight: openMenu === 'poorten' ? 470 : openMenu ? 340 : 0,
      transition: 'max-height 360ms var(--ease-out)',
      borderTop: openMenu ? '1px solid var(--line-on-dark-soft)' : '1px solid transparent',
      borderBottom: openMenu ? '1px solid var(--line-on-light-soft)' : 'none',
      boxShadow: openMenu ? '0 22px 34px rgba(15,22,15,0.15)' : 'none',
      background: 'rgba(248,244,236,0.98)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      padding: '26px 44px 30px'
    }
  }, openMenu === 'poorten' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.05fr',
      gap: 36,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SEyebrow, {
    dark: true,
    tone: "muted",
    style: {
      marginBottom: 10
    }
  }, "Poorten op maat"), POORTEN.map(([key, label, desc, img, sub]) => {
    const on = hoverPoort === key;
    return /*#__PURE__*/React.createElement("button", {
      key: key,
      onMouseEnter: () => {
        setActivePoort(key);
        setHoverPoort(key);
      },
      onMouseLeave: () => setHoverPoort(null),
      onClick: () => {
        onNav(key);
        setOpenMenu(null);
      },
      style: {
        width: '100%',
        textAlign: 'left',
        background: 'none',
        border: 0,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '13px 6px',
        paddingLeft: on ? 14 : 6,
        borderBottom: '1px solid var(--line-on-light-soft)',
        fontFamily: 'var(--font-display)',
        fontSize: 25,
        color: on ? 'var(--text-heading)' : 'var(--stone-200)',
        transition: 'padding-left var(--dur) var(--ease-out), color var(--dur) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement("span", null, label, sub ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 13,
        color: 'var(--stone-500)',
        marginLeft: 9,
        whiteSpace: 'nowrap'
      }
    }, sub) : null), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 13,
        letterSpacing: '0.04em',
        color: 'var(--accent)',
        opacity: on ? 1 : 0,
        transition: 'opacity var(--dur) var(--ease-out)',
        whiteSpace: 'nowrap'
      }
    }, "Bekijk ↗"));
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      onNav(actPoort[0]);
      setOpenMenu(null);
    },
    style: {
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer',
      position: 'relative',
      borderRadius: 6,
      overflow: 'hidden',
      height: 300,
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: actPoort[3],
    alt: actPoort[1],
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, rgba(15,22,15,0) 50%, rgba(15,22,15,0.62) 100%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 18,
      right: 18,
      bottom: 16,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'rgba(236,227,210,0.92)'
    }
  }, actPoort[1]), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--bronze-300)',
      background: 'rgba(15,22,15,0.4)',
      padding: '5px 10px',
      borderRadius: 3
    }
  }, actPoort[2])))), openMenu === 'service' && simpleMenu('service', SERVICE), openMenu === 'over' && simpleMenu('over', OVER))));
}

/* ---- Taalbanner voor versies in voorbereiding ---- */
function TaalBanner({
  lang
}) {
  if (lang === 'NL') return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bronze-500)',
      color: 'var(--forest-950)',
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      textAlign: 'center',
      padding: '9px 20px'
    }
  }, "Deze taalversie is in voorbereiding · u bekijkt de Nederlandse versie");
}

/* ---- Vertrouwensbalk ---- */
function ClaimBalk({
  dark = false
}) {
  const claims = window.CLAIMS;
  const line = dark ? 'var(--line-on-dark-soft)' : 'var(--line-on-light-soft)';
  const fg = dark ? 'var(--stone-300)' : 'var(--text-body)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(${claims.length}, 1fr)`,
      borderTop: `1px solid ${line}`,
      borderBottom: `1px solid ${line}`
    }
  }, claims.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: c,
    style: {
      padding: '20px 22px',
      borderLeft: i > 0 ? `1px solid ${line}` : 0,
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      color: 'var(--accent)',
      fontFamily: 'var(--font-display)',
      fontSize: 18,
      lineHeight: 1
    }
  }, "—"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      lineHeight: 1.4,
      color: fg
    }
  }, c))));
}

/* ---- FAQ accordeon ---- */
function FAQ({
  items,
  dark = false
}) {
  const [open, setOpen] = React.useState(0);
  const line = dark ? 'var(--line-on-dark)' : 'var(--line-on-light)';
  const head = dark ? 'var(--stone-100)' : 'var(--text-heading)';
  const body = dark ? 'var(--stone-300)' : 'var(--text-body)';
  return /*#__PURE__*/React.createElement("div", null, items.map(([q, a], i) => {
    const isOpen = open === i;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        borderTop: `1px solid ${line}`,
        borderBottom: i === items.length - 1 ? `1px solid ${line}` : 0
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setOpen(isOpen ? -1 : i),
      "aria-expanded": isOpen,
      style: {
        width: '100%',
        textAlign: 'left',
        background: 'none',
        border: 0,
        cursor: 'pointer',
        padding: '22px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 23,
        color: head,
        lineHeight: 1.2
      }
    }, q), /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        color: 'var(--accent)',
        fontSize: 22,
        fontFamily: 'var(--font-sans)',
        flex: '0 0 auto',
        transition: 'transform var(--dur) var(--ease-out)',
        transform: isOpen ? 'rotate(45deg)' : 'none'
      }
    }, "+")), /*#__PURE__*/React.createElement("div", {
      style: {
        overflow: 'hidden',
        maxHeight: isOpen ? 240 : 0,
        transition: 'max-height 380ms var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 15.5,
        lineHeight: 1.7,
        color: body,
        margin: '0 0 24px',
        maxWidth: '62ch'
      }
    }, a)));
  }));
}

/* ---- Afsluitende oproep ---- */
function CTASectie({
  onNav,
  dark = true
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: dark ? 'var(--surface-deep)' : 'var(--surface-paper)',
      padding: '96px 44px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SEyebrow, {
    dark: dark,
    style: {
      marginBottom: 18
    }
  }, "Bespreek uw project"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 52,
      color: dark ? 'var(--stone-100)' : 'var(--text-heading)',
      margin: '0 auto 18px',
      maxWidth: '18ch',
      lineHeight: 1.06,
      letterSpacing: '-0.01em'
    }
  }, "Bespreek uw project met Poortland."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.65,
      color: dark ? 'var(--stone-300)' : 'var(--text-muted)',
      maxWidth: '46ch',
      margin: '0 auto 34px'
    }
  }, "Wilt u een poort of hekwerk dat past bij uw woning en jarenlang vertrouwen geeft. Plan een adviesgesprek of bezoek de showroom."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(SButton, {
    variant: "primary",
    size: "lg",
    arrow: true,
    onClick: () => onNav('contact')
  }, "Plan een adviesgesprek"), /*#__PURE__*/React.createElement(SButton, {
    variant: "secondary",
    size: "lg",
    dark: dark,
    arrow: true,
    onClick: () => window.dispatchEvent(new CustomEvent('pl-offerte-open'))
  }, "Vraag uw offerte aan"))));
}

/* ---- Footer ---- */
function Footer({
  onNav,
  lang,
  onLang
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--surface-deep)',
      color: 'var(--text-on-dark-muted)',
      padding: '64px 44px 36px',
      borderTop: '1px solid var(--line-on-dark-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
      gap: 40,
      borderBottom: '1px solid var(--line-on-dark-soft)',
      paddingBottom: 44
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 320
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 18,
      flexWrap: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement(Monogram, {
    size: 34,
    dark: true
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 14,
      fontWeight: 600,
      letterSpacing: '0.34em',
      textTransform: 'uppercase',
      color: 'var(--stone-100)',
      paddingLeft: '0.34em'
    }
  }, "Poortland")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      lineHeight: 1.7,
      margin: '0 0 20px'
    }
  }, "Handgemaakte toegangspoorten, overkappingen en automatisatie op maat. Ontworpen, gemaakt en geplaatst in België."), /*#__PURE__*/React.createElement(TaalWisselaar, {
    lang: lang,
    onLang: onLang,
    dark: true
  })), /*#__PURE__*/React.createElement(FooterKol, {
    title: "Poorten",
    links: [['Metalen poorten', () => onNav('metalen')], ['Houten poorten', () => onNav('houten')], ['Combinatie hout en metaal', () => onNav('combinatie')], ['Overkappingen', () => onNav('overkappingen')]]
  }), /*#__PURE__*/React.createElement(FooterKol, {
    title: "Service en info",
    links: [['Automatisering', () => onNav('automatisering')], ['Onderhoud', () => onNav('onderhoud')], ['Over ons', () => onNav('atelier')], ['Garantie', () => onNav('garantie')], ['FAQ', () => onNav('faq')]]
  }), /*#__PURE__*/React.createElement(FooterKol, {
    title: "Atelier en showroom",
    links: [[/*#__PURE__*/React.createElement("span", null, "Hombeeksesteenweg 164-166", /*#__PURE__*/React.createElement("br", null), "2800\xA0Mechelen")], ['+32 (0)15 432 111'], ['info@poortland.be'], ['Open op afspraak']]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 22,
      flexWrap: 'wrap',
      gap: 12,
      fontFamily: 'var(--font-sans)',
      fontSize: 11.5,
      color: 'var(--text-on-dark-faint)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "© 2026 Poortland — Handgemaakt in België sinds 1999"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 22,
      letterSpacing: '0.06em'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('voorwaarden'),
    style: {
      background: 'none',
      border: 0,
      color: 'inherit',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: 'inherit'
    }
  }, "Algemene voorwaarden"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('privacy'),
    style: {
      background: 'none',
      border: 0,
      color: 'inherit',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: 'inherit'
    }
  }, "Privacybeleid"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('cookie'),
    style: {
      background: 'none',
      border: 0,
      color: 'inherit',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: 'inherit'
    }
  }, "Cookiebeleid"), /*#__PURE__*/React.createElement("span", null, "BTW BE 0464 838 351")))));
}
function FooterKol({
  title,
  links
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SEyebrow, {
    dark: true,
    tone: "muted",
    style: {
      marginBottom: 16
    }
  }, title), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 11
    }
  }, links.map(([label, fn], i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => fn && fn(),
    style: {
      background: 'none',
      border: 0,
      padding: 0,
      cursor: fn ? 'pointer' : 'default',
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      color: 'var(--stone-300)',
      textAlign: 'left',
      transition: 'color var(--dur) var(--ease-out)'
    },
    onMouseEnter: e => {
      if (fn) e.currentTarget.style.color = 'var(--accent)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.color = 'var(--stone-300)';
    }
  }, label)))));
}

/* ---- Sectiekop ---- */
function SectieKop({
  eyebrow,
  titel,
  intro,
  dark = false,
  align = 'left',
  max = '20ch'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: align,
      maxWidth: align === 'center' ? 760 : undefined,
      margin: align === 'center' ? '0 auto' : undefined
    }
  }, eyebrow && /*#__PURE__*/React.createElement(SEyebrow, {
    dark: dark,
    style: {
      marginBottom: 16
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 42,
      color: dark ? 'var(--stone-100)' : 'var(--text-heading)',
      margin: 0,
      letterSpacing: '-0.01em',
      lineHeight: 1.08,
      maxWidth: align === 'left' ? max : undefined
    }
  }, titel), intro && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16.5,
      lineHeight: 1.65,
      color: dark ? 'var(--stone-300)' : 'var(--text-muted)',
      marginTop: 18,
      maxWidth: '54ch',
      marginLeft: align === 'center' ? 'auto' : 0,
      marginRight: align === 'center' ? 'auto' : 0
    }
  }, intro));
}

/* ---- Doorlopende fotobanner (marquee) ---- */
function FotoBanner({
  fotos,
  onNav
}) {
  const rij = [...fotos, ...fotos];
  return /*#__PURE__*/React.createElement("div", {
    className: "pl-marquee",
    style: {
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      cursor: onNav ? 'pointer' : 'default'
    },
    onClick: () => onNav && onNav('realisaties')
  }, /*#__PURE__*/React.createElement("div", {
    className: "pl-marquee-track",
    style: {
      display: 'flex',
      width: 'max-content'
    }
  }, rij.map((f, i) => /*#__PURE__*/React.createElement("figure", {
    key: i,
    style: {
      margin: 0,
      marginRight: 18,
      flex: '0 0 auto',
      width: 420,
      position: 'relative',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '3 / 2',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: f.src,
    alt: f.label,
    loading: "lazy",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, rgba(15,22,15,0) 58%, rgba(15,22,15,0.6) 100%)'
    }
  }), /*#__PURE__*/React.createElement("figcaption", {
    style: {
      position: 'absolute',
      left: 16,
      bottom: 13,
      fontFamily: 'var(--font-label)',
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'rgba(236,227,210,0.92)'
    }
  }, f.label)))));
}

/* ---- Generieke contentpagina (spec content) ---- */
function PaginaNL({
  onNav,
  content
}) {
  const {
    SectieKop,
    CTASectie,
    Reveal
  } = window;
  const c = content || {};
  React.useEffect(() => {
    if (c.title) document.title = c.title;
  }, [c]);
  const secties = c.secties || [];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '84px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: c.beeld ? '1.05fr 0.95fr' : '1fr',
      gap: 60,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SEyebrow, {
    dark: true,
    style: {
      marginBottom: 20
    }
  }, c.eyebrow), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 58,
      lineHeight: 1.04,
      letterSpacing: '-0.01em',
      color: 'var(--stone-100)',
      margin: 0
    }
  }, c.h1), c.intro && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 18,
      lineHeight: 1.6,
      color: 'var(--stone-300)',
      maxWidth: '48ch',
      margin: '24px 0 32px'
    }
  }, c.intro), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(SButton, {
    variant: "primary",
    arrow: true,
    onClick: () => onNav(c.cta && c.cta.route || 'contact', c.cta && c.cta.params)
  }, c.cta && c.cta.label || 'Vraag een offerte aan'), c.cta2 && /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    dark: true,
    arrow: true,
    onClick: () => onNav(c.cta2.route)
  }, c.cta2.label))), c.beeld && /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 8,
      overflow: 'hidden',
      aspectRatio: '3 / 2',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: c.beeld,
    alt: c.h1,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '80px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 920,
      margin: '0 auto'
    }
  }, secties.map((s, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: i,
    delay: i % 3 * 60
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 44
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 30,
      color: 'var(--text-heading)',
      margin: '0 0 12px',
      letterSpacing: '-0.01em'
    }
  }, s.h2), s.tekst && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16.5,
      lineHeight: 1.72,
      color: 'var(--text-body)',
      margin: 0,
      maxWidth: '64ch'
    }
  }, s.tekst), s.faq && s.faq.map((qa, j) => /*#__PURE__*/React.createElement("div", {
    key: j,
    style: {
      marginTop: 18,
      borderTop: '1px solid var(--line-on-light-soft)',
      paddingTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      fontWeight: 600,
      color: 'var(--text-heading)'
    }
  }, qa.q), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15.5,
      lineHeight: 1.7,
      color: 'var(--text-muted)',
      margin: '5px 0 0',
      maxWidth: '64ch'
    }
  }, qa.a))), s.kaarten && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(' + s.kaarten.length + ', 1fr)',
      gap: 18,
      marginTop: 20
    }
  }, s.kaarten.map((k, j) => /*#__PURE__*/React.createElement("button", {
    key: j,
    onClick: () => onNav(k.route),
    style: {
      textAlign: 'left',
      background: 'var(--surface-card)',
      border: '1px solid var(--line-on-light-soft)',
      borderRadius: 'var(--radius-md)',
      padding: 0,
      cursor: 'pointer',
      overflow: 'hidden'
    }
  }, k.beeld && /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '3 / 2',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: k.beeld,
    alt: k.titel,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 18px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 21,
      color: 'var(--text-heading)'
    }
  }, k.titel), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      color: 'var(--text-muted)',
      marginTop: 5
    }
  }, k.tekst, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)'
    }
  }, "↗"))))))))))), /*#__PURE__*/React.createElement(CTASectie, {
    onNav: onNav,
    dark: true
  }));
}
var PAGINAS = {
  poorten: {
    title: 'Poorten op maat in Mechelen | Poortland',
    eyebrow: 'Poorten',
    h1: 'Poorten op maat in Mechelen',
    beeld: 'media/hero.jpg',
    intro: 'Poortland ontwerpt, maakt en plaatst tuinpoorten volledig op maat. Alles gebeurt in eigen atelier in Mechelen, van het eerste ontwerp tot de plaatsing.',
    cta: {
      label: 'Vraag een offerte aan',
      route: 'contact'
    },
    cta2: {
      label: 'Bekijk realisaties',
      route: 'realisaties'
    },
    secties: [{
      h2: 'Tuinpoorten op maat voor elke woning',
      tekst: 'Van een strakke schuifpoort tot een klassieke draaipoort, elke poort past bij uw woning, uw oprit en uw dagelijks gebruik.'
    }, {
      h2: 'Kies uw type poort',
      kaarten: [{
        titel: 'Metalen poorten',
        tekst: 'Sterk en onderhoudsarm',
        route: 'metalen',
        beeld: 'media/stalen-poort.jpg'
      }, {
        titel: 'Houten poorten',
        tekst: 'Warm en natuurlijk',
        route: 'houten',
        beeld: 'media/houten-poort.jpg'
      }, {
        titel: 'Combinatie hout en metaal',
        tekst: 'Stevig en warm',
        route: 'combinatie',
        beeld: 'media/staal-hout.jpg'
      }]
    }, {
      h2: 'Van ontwerp tot plaatsing',
      tekst: 'Elk project start met advies en een opmeting ter plaatse. Wij tekenen uw poort op maat, maken ze in eigen atelier en plaatsen ze met een eigen team.'
    }, {
      h2: 'Poort automatiseren?',
      tekst: 'Bijna elke poort kan geautomatiseerd worden, met FAAC aandrijvingen en eventueel parlofoon of video.'
    }]
  },
  metalen: {
    title: 'Metalen poorten op maat | Poortland Mechelen',
    eyebrow: 'Metalen poorten',
    h1: 'Metalen poorten op maat',
    beeld: 'media/stalen-poort.jpg',
    intro: 'Poortland maakt metalen poorten volledig op maat, in staal van hoge kwaliteit. Sterk, strak en jarenlang betrouwbaar.',
    cta: {
      label: 'Vraag een offerte aan',
      route: 'contact'
    },
    cta2: {
      label: 'Laat automatiseren',
      route: 'automatisering'
    },
    secties: [{
      h2: 'Sterke metalen poorten voor oprit en tuin',
      tekst: 'Een metalen poort is de stevige en strakke toegang tot uw oprit of tuin, volledig op maat gemaakt.'
    }, {
      h2: 'Klassiek, modern of volledig op maat',
      tekst: 'Van klassiek met sierpunten tot strak en modern, elk model bestaat in de maat en de stijl die bij uw woning past.'
    }, {
      h2: 'Beschermd tegen roest en weersinvloeden',
      tekst: 'Elke metalen poort wordt warm verzinkt en gemetalliseerd, daarna afgewerkt met poederlak. Zo blijft ze jarenlang mooi.'
    }, {
      h2: 'Draaipoort of schuifpoort?',
      tekst: 'Een draaipoort opent naar binnen of buiten, een schuifpoort schuift opzij en is ideaal bij een korte oprit.'
    }]
  },
  houten: {
    title: 'Houten poorten op maat | Poortland Mechelen',
    eyebrow: 'Houten poorten',
    h1: 'Houten poorten op maat',
    beeld: 'media/houten-poort.jpg',
    intro: 'Een houten poort geeft uw woning een warme, natuurlijke uitstraling. Poortland maakt houten poorten volledig op maat.',
    cta: {
      label: 'Vraag een offerte aan',
      route: 'contact'
    },
    cta2: {
      label: 'Laat automatiseren',
      route: 'automatisering'
    },
    secties: [{
      h2: 'Natuurlijke houten poorten met karakter',
      tekst: 'Wij maken houten poorten met oog voor detail en afwerking, afgestemd op uw woning.'
    }, {
      h2: 'Duurzame houtsoorten zoals Padouk en Iroko',
      tekst: 'Wij werken met Padouk en Iroko, hardhoutsoorten die bekend staan om hun stabiliteit en lange levensduur.'
    }, {
      h2: 'Enkele en dubbele draaipoorten',
      tekst: 'Houten poorten zijn er als enkele of dubbele draaipoort met vaste panelen waar nodig.'
    }, {
      h2: 'Manueel of automatisch bediend',
      tekst: 'U bedient uw houten poort manueel of laat ze automatiseren met een aangepaste aandrijving.'
    }]
  },
  combinatie: {
    title: 'Poorten in hout en metaal op maat | Poortland',
    eyebrow: 'Combinatie hout en metaal',
    h1: 'Poorten in hout en metaal',
    beeld: 'media/staal-hout.jpg',
    intro: 'Een combinatiepoort verenigt een stevige metalen structuur met een warme houten invulling.',
    cta: {
      label: 'Vraag een offerte aan',
      route: 'contact'
    },
    cta2: {
      label: 'Bekijk realisaties',
      route: 'realisaties'
    },
    secties: [{
      h2: 'De sterkte van metaal, de uitstraling van hout',
      tekst: 'Zo krijgt u een poort die sterk oogt en toch natuurlijk aanvoelt.'
    }, {
      h2: 'Volledig op maat gemaakt',
      tekst: 'Wij tekenen en maken elke combinatiepoort op maat van uw woning, van de metalen structuur tot de houtsoort.'
    }, {
      h2: 'Houten bekleding of ingewerkte houtstructuur',
      tekst: 'U kiest voor houten panelen op een metalen frame of voor hout dat in de structuur verwerkt zit.'
    }, {
      h2: 'Duurzame afwerking',
      tekst: 'Het metaal wordt beschermd tegen roest en het hout wordt verzorgd afgewerkt, zodat de poort jarenlang mooi blijft.'
    }]
  },
  overkappingen: {
    title: 'Overkappingen op maat | Poortland Mechelen',
    eyebrow: 'Overkappingen',
    h1: 'Overkappingen op maat',
    beeld: 'media/hero.jpg',
    intro: 'Een overkapping beschermt uw buitenruimte tegen regen, zon en wind. Poortland denkt met u mee voor een oplossing op maat.',
    cta: {
      label: 'Vraag advies',
      route: 'contact'
    },
    secties: [{
      h2: 'Bescherming en comfort voor uw buitenruimte',
      tekst: 'Zo verlengt een overkapping het comfort van uw terras of oprit, het hele jaar door.'
    }, {
      h2: 'Afgestemd op uw woning',
      tekst: 'Elke overkapping wordt afgestemd op de stijl van uw woning, uw tuin of uw oprit.'
    }, {
      h2: 'Maatwerk in stijl en afwerking',
      tekst: 'Poortland maakt overkappingen op maat, onder meer in aluminium, in dezelfde stijl en met dezelfde zorg als onze poorten.'
    }, {
      h2: 'Advies, opmeting en plaatsing',
      tekst: 'Zoals bij onze poorten begeleiden wij het volledige traject, van advies en opmeting tot een verzorgde plaatsing door een eigen team.'
    }]
  },
  service: {
    title: 'Service voor poorten en automatisering | Poortland',
    eyebrow: 'Service',
    h1: 'Service voor poorten en automatisering',
    intro: 'Bij Poortland stopt het niet bij de plaatsing. Wij blijven bereikbaar voor de automatisering, het onderhoud en de herstelling van uw poort.',
    cta: {
      label: 'Vraag service aan',
      route: 'contact'
    },
    secties: [{
      h2: 'Onze diensten',
      kaarten: [{
        titel: 'Automatisering',
        tekst: 'Automatische poorten',
        route: 'automatisering'
      }, {
        titel: 'Onderhoud',
        tekst: 'Nazorg en herstellingen',
        route: 'onderhoud'
      }]
    }, {
      h2: 'Betrouwbare nazorg',
      tekst: 'U werkt met een eigen dienst na verkoop, geen onderaanneming. Zo weet u bij wie u terecht kunt, ook jaren na de plaatsing.'
    }]
  },
  automatisering: {
    title: 'Automatisering van poorten | Poortland Mechelen',
    eyebrow: 'Automatisering',
    h1: 'Automatisering van poorten',
    intro: 'Open en sluit uw poort comfortabel met een druk op de knop of op afstand. Poortland automatiseert nieuwe en bestaande poorten.',
    cta: {
      label: 'Vraag een offerte aan',
      route: 'contact'
    },
    cta2: {
      label: 'Plan onderhoud',
      route: 'onderhoud'
    },
    secties: [{
      h2: 'Voor draaipoorten, schuifpoorten en garagepoorten',
      tekst: 'Voor elk type kiezen wij de aandrijving die past bij het gewicht en het gebruik van uw poort.'
    }, {
      h2: 'Parlofoon en video installatie',
      tekst: 'Combineer uw automatisering met een parlofoon of een video installatie, zodat u ziet en beslist wie u binnenlaat.'
    }, {
      h2: 'Kwalitatieve aandrijvingen',
      tekst: 'Poortland werkt met FAAC aandrijvingen, een gekende naam voor duurzame en veilige poortmotoren.'
    }]
  },
  onderhoud: {
    title: 'Onderhoud van poorten | Poortland Mechelen',
    eyebrow: 'Onderhoud',
    h1: 'Onderhoud van poorten',
    intro: 'Een poort die dagelijks opengaat verdient af en toe onderhoud. Zo blijft ze veilig, soepel en betrouwbaar.',
    cta: {
      label: 'Vraag onderhoud aan',
      route: 'contact',
      params: {
        type: 'onderhoud'
      }
    },
    secties: [{
      h2: 'Onderhoud van automatische poorten',
      tekst: 'Bij een nazicht controleren wij de motor, de scharnieren, de veiligheid en de bediening. Waar nodig stellen wij bij of vervangen wij onderdelen.'
    }, {
      h2: 'Herstellingen en nazorg',
      tekst: 'Werkt uw poort niet meer zoals het hoort? Wij herstellen poorten en aandrijvingen met een eigen dienst na verkoop.'
    }, {
      h2: 'Wanneer onderhoud aanvragen?',
      tekst: 'Wij raden een jaarlijks nazicht aan, bij voorkeur voor de winter. Met een onderhoudscontract plannen wij het nazicht automatisch in.'
    }]
  },
  garantie: {
    title: 'Garantie op uw poort | Poortland',
    eyebrow: 'Garantie',
    h1: 'Garantie op uw poort',
    intro: 'Poortland staat achter zijn werk. Op uw poort en de afwerking geven wij een duidelijke garantie.',
    cta: {
      label: 'Vraag naar uw garantie',
      route: 'contact'
    },
    secties: [{
      h2: 'Garantie op lakkwaliteit en roestvorming',
      tekst: 'Dankzij het warm verzinken, metalliseren en poederlakken beschermen wij uw metalen poort tegen roest.'
    }, {
      h2: 'Garantie op automatisering',
      tekst: 'Op de FAAC aandrijvingen en de elektronische onderdelen geldt de fabrieksgarantie.'
    }, {
      h2: 'Onderhoud en correcte plaatsing',
      tekst: 'Een correcte plaatsing en regelmatig onderhoud houden de garantie geldig en verlengen de levensduur van uw poort.'
    }]
  },
  faq: {
    title: 'Veelgestelde vragen over poorten | Poortland',
    eyebrow: 'FAQ',
    h1: 'Veelgestelde vragen over poorten',
    intro: 'Antwoorden over poorten op maat, materialen, automatisering, onderhoud en garantie.',
    cta: {
      label: 'Vraag een offerte aan',
      route: 'contact'
    },
    secties: [{
      h2: 'Poorten op maat',
      faq: [{
        q: 'Welke soorten poorten maakt Poortland?',
        a: 'Poortland maakt tuinpoorten op maat in metaal, hout en een combinatie van hout en metaal, als draaipoort of schuifpoort, ontworpen en gemaakt in eigen atelier in Mechelen.'
      }, {
        q: 'Wat is het verschil tussen een draaipoort en een schuifpoort?',
        a: 'Een draaipoort opent zoals een deur en vraagt vrije ruimte. Een schuifpoort schuift opzij langs de oprit en is ideaal wanneer er weinig plaats is.'
      }]
    }, {
      h2: 'Materialen',
      faq: [{
        q: 'Welke materialen kan ik kiezen?',
        a: 'U kiest uit metaal, hout of een combinatie van beide. Wij adviseren u graag op basis van uw woning en uw voorkeur.'
      }]
    }, {
      h2: 'Automatisering en onderhoud',
      faq: [{
        q: 'Kan mijn poort geautomatiseerd worden?',
        a: 'In de meeste gevallen wel. Poortland automatiseert draaipoorten, schuifpoorten en garagepoorten met FAAC aandrijvingen, zowel nieuwe als bestaande poorten.'
      }, {
        q: 'Bieden jullie onderhoud aan?',
        a: 'Ja. Poortland heeft een eigen dienst na verkoop voor onderhoud en herstellingen. Een onderhoudscontract is mogelijk.'
      }]
    }]
  }
};

/* ---- Offerte aanvraag modal (meerstappenformulier) ---- */
function OfferteModal({
  _forceOpen,
  _startStep,
  _startService
}) {
  const [open, setOpen] = React.useState(!!_forceOpen);
  const [step, setStep] = React.useState(_startStep || 1);
  const [service, setService] = React.useState(_startService || null);
  const [data, setData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [bezig, setBezig] = React.useState(false);
  const [fout, setFout] = React.useState('');
  const [fotos, setFotos] = React.useState([]);
  React.useEffect(() => {
    const on = e => {
      const svc = e && e.detail && e.detail.service;
      setStep(svc ? 2 : 1);
      setService(svc || null);
      setData({});
      setErrors({});
      setFout('');
      setBezig(false);
      setFotos([]);
      setOpen(true);
    };
    window.addEventListener('pl-offerte-open', on);
    return () => window.removeEventListener('pl-offerte-open', on);
  }, []);
  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = e => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);
  const close = () => setOpen(false);
  const closeReset = () => {
    setOpen(false);
    setStep(1);
    setService(null);
    setData({});
    setErrors({});
    setFout('');
    setBezig(false);
    setFotos([]);
  };
  const set = (k, v) => setData(d => Object.assign({}, d, {
    [k]: v
  }));
  const kies = s => {
    setService(s);
    setStep(2);
  };
  const labelSt = {
    display: 'block',
    fontFamily: 'var(--font-sans)',
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--text-heading)',
    marginBottom: 8
  };
  const inputSt = {
    width: '100%',
    fontFamily: 'var(--font-sans)',
    fontSize: 16,
    color: 'var(--text-body)',
    padding: '13px 14px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--line-on-light)',
    background: '#fff',
    boxSizing: 'border-box'
  };
  const errSt = {
    fontFamily: 'var(--font-sans)',
    fontSize: 13.5,
    color: 'var(--accent-rust)',
    marginTop: 6
  };
  const titelSt = {
    fontFamily: 'var(--font-display)',
    fontWeight: 500,
    fontSize: 27,
    color: 'var(--text-heading)',
    margin: 0,
    lineHeight: 1.15
  };
  const primair = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 0,
    background: 'var(--accent)',
    color: '#fff',
    fontFamily: 'var(--font-sans)',
    fontSize: 16,
    fontWeight: 600,
    padding: '15px 26px',
    borderRadius: 'var(--radius-md)'
  };
  const terugSt = {
    cursor: 'pointer',
    background: 'none',
    border: '1px solid var(--line-on-light)',
    color: 'var(--text-heading)',
    fontFamily: 'var(--font-sans)',
    fontSize: 15,
    fontWeight: 600,
    padding: '15px 24px',
    borderRadius: 'var(--radius-md)'
  };
  const Field = p => /*#__PURE__*/React.createElement("div", {
    key: p.name,
    "data-veld": p.name,
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: labelSt
  }, p.label, p.required ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)'
    }
  }, " *") : null), /*#__PURE__*/React.createElement("input", {
    type: p.type || 'text',
    inputMode: p.inputMode,
    value: data[p.name] || '',
    placeholder: p.placeholder,
    onChange: e => set(p.name, e.target.value),
    style: Object.assign({}, inputSt, {
      borderColor: errors[p.name] ? 'var(--accent-rust)' : 'var(--line-on-light)'
    })
  }), errors[p.name] ? /*#__PURE__*/React.createElement("div", {
    style: errSt
  }, errors[p.name]) : null);
  const Area = p => /*#__PURE__*/React.createElement("div", {
    key: p.name,
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: labelSt
  }, p.label), /*#__PURE__*/React.createElement("textarea", {
    rows: p.rows || 4,
    value: data[p.name] || '',
    placeholder: p.placeholder,
    onChange: e => set(p.name, e.target.value),
    style: Object.assign({}, inputSt, {
      minHeight: 96,
      resize: 'vertical',
      lineHeight: 1.5
    })
  }));
  const Keuze = p => /*#__PURE__*/React.createElement("div", {
    key: p.name,
    "data-veld": p.name,
    style: {
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: labelSt
  }, p.label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(' + (p.min || 190) + 'px, 1fr))',
      gap: 10
    }
  }, p.options.map(o => {
    const val = Array.isArray(o) ? o[0] : o;
    const sub = Array.isArray(o) ? o[1] : null;
    const sel = data[p.name] === val;
    return /*#__PURE__*/React.createElement("button", {
      key: val,
      type: "button",
      onClick: () => set(p.name, val),
      style: {
        textAlign: 'left',
        cursor: 'pointer',
        padding: '14px 16px',
        borderRadius: 'var(--radius-md)',
        border: sel ? '2px solid var(--accent)' : '1px solid var(--line-on-light)',
        background: sel ? 'rgba(138,106,60,0.08)' : '#fff',
        fontFamily: 'var(--font-sans)',
        fontSize: 15.5,
        fontWeight: sel ? 600 : 400,
        color: 'var(--text-heading)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block'
      }
    }, val), sub ? /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        fontFamily: 'var(--font-sans)',
        fontSize: 12.5,
        fontWeight: 400,
        color: 'var(--text-muted)',
        marginTop: 3
      }
    }, sub) : null);
  })));
  const verzend = () => {
    const req = {
      voornaam: 'Gelieve uw voornaam in te vullen.',
      naam: 'Gelieve uw naam in te vullen.',
      email: 'Gelieve uw emailadres in te vullen.',
      telefoon: 'Gelieve uw telefoonnummer in te vullen.',
      adres: 'Gelieve uw straat en huisnummer in te vullen.',
      stad: 'Gelieve uw stad of gemeente in te vullen.',
      postcode: 'Gelieve uw postcode in te vullen.'
    };
    if (data.klantType === 'bedrijf') {
      req.bedrijfsnaam = 'Gelieve de bedrijfsnaam in te vullen.';
      req.btwNummer = 'Gelieve het btw nummer in te vullen.';
    }
    const e = {};
    Object.keys(req).forEach(k => {
      if (!data[k] || !String(data[k]).trim()) e[k] = req[k];
    });
    if (data.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) e.email = 'Gelieve een geldig emailadres in te vullen.';
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const eerste = Object.keys(req).find(k => e[k]);
      if (window.plSchudVeld && eerste) window.plSchudVeld(eerste);
      return;
    }
    const contactKeys = ['voornaam', 'naam', 'email', 'telefoon', 'adres', 'stad', 'postcode'];
    const specifiek = {};
    Object.keys(data).forEach(k => {
      if (contactKeys.indexOf(k) < 0 && k !== 'opmerkingen' && k !== 'timing' && k !== 'klantType' && k !== 'bedrijfsnaam' && k !== 'btwNummer') specifiek[k] = data[k];
    });
    const aanvraag = {
      dienst: service,
      specifiek: specifiek,
      opmerkingen: data.opmerkingen || '',
      contact: {
        voornaam: data.voornaam,
        naam: data.naam,
        email: data.email,
        telefoon: data.telefoon,
        adres: data.adres,
        stad: data.stad,
        postcode: data.postcode
      },
      datum: new Date().toISOString()
    };
    /* ====== KOPPELPUNT: verstuur naar het Poortland ERP leadendpoint via poortland_erp_lead.js. ====== */
    const wizardGegevens = {
      stappen: [{
        titel: 'Type aanvraag',
        velden: [{
          label: 'Dienst',
          waarde: String(service || '')
        }]
      }, {
        titel: 'Details',
        velden: Object.keys(specifiek).map(k => ({
          label: k,
          waarde: String(specifiek[k])
        }))
      }]
    };
    const timingCodes = {
      'Zo snel mogelijk': 'zo-snel',
      'Binnen drie maanden': '3-maand',
      'Binnen zes maanden': '6-maand',
      'Nog in oriëntatie': 'orientatie'
    };
    const velden = {
      klantType: data.klantType || 'particulier',
      bedrijfsnaam: data.klantType === 'bedrijf' ? data.bedrijfsnaam || '' : '',
      btwNummer: data.klantType === 'bedrijf' ? data.btwNummer || '' : '',
      naam: data.naam || '',
      voornaam: data.voornaam || '',
      email: data.email || '',
      telefoon: data.telefoon || '',
      straat: data.adres || '',
      postcode: data.postcode || '',
      gemeente: data.stad || '',
      typeAanvraag: service === 'automatisering' ? 'automatisatie' : service || '',
      gewensteTiming: timingCodes[data.timing] || '',
      vraag: ['Adres: ' + [data.adres, data.postcode, data.stad].filter(Boolean).join(' '), aanvraag.opmerkingen || ''].filter(Boolean).join('\n')
    };
    const eind = (window.POORTLAND_ERP || {}).leadEndpoint;
    if (!eind || !window.poortlandVerstuurLead) {
      if (window.console) console.log('Poortland offerte aanvraag', aanvraag);
      setStep(4);
      return;
    }
    setBezig(true);
    setFout('');
    window.poortlandVerstuurLead({
      endpoint: eind,
      soort: 'offerteaanvraag',
      velden: velden,
      wizardGegevens: wizardGegevens,
      fotos: fotos
    }).then(() => {
      setStep(4);
    }).catch(err => {
      setFout(err && err.message || 'Versturen mislukt. Probeer later opnieuw of bel ons op 015 43 21 11.');
    }).then(() => {
      setBezig(false);
    });
  };
  if (!open) return null;
  const stapNr = step <= 3 ? step : 3;
  return /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    onClick: close,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(15,22,15,0.55)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: 660,
      maxHeight: '90vh',
      background: 'var(--surface-paper)',
      borderRadius: 12,
      boxShadow: 'var(--shadow-lg)',
      margin: 'auto',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 24px',
      borderBottom: '1px solid var(--line-on-light-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--accent)'
    }
  }, step <= 3 ? 'Stap ' + stapNr + ' van 3' : 'Klaar'), /*#__PURE__*/React.createElement("button", {
    onClick: close,
    "aria-label": "Sluiten",
    style: {
      background: 'none',
      border: 0,
      cursor: 'pointer',
      fontSize: 30,
      lineHeight: 1,
      color: 'var(--text-muted)',
      padding: '0 4px'
    }
  }, "×")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 auto',
      overflowY: 'auto',
      padding: '26px 24px 28px'
    }
  }, step === 1 ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: titelSt
  }, "Waarvoor wenst u een offerte aan te vragen?"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15.5,
      color: 'var(--text-muted)',
      margin: '10px 0 22px'
    }
  }, "Kies hieronder waarvoor u ons wil contacteren."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 14
    }
  }, [['poorten', 'Poorten', 'Nieuwe poort op maat'], ['overkappingen', 'Overkapping', 'Terras, carport of pergola'], ['automatisering', 'Automatisering', 'Bestaande poort automatiseren'], ['onderhoud', 'Onderhoud', 'Nazorg en herstelling']].map(([k, t, d, uit]) => uit ? /*#__PURE__*/React.createElement("div", {
    key: k,
    "aria-disabled": "true",
    style: {
      position: 'relative',
      textAlign: 'left',
      background: 'rgba(20,28,21,0.05)',
      border: '1px dashed var(--line-on-light)',
      borderRadius: 'var(--radius-md)',
      padding: '20px',
      cursor: 'not-allowed'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      marginBottom: 12,
      background: 'var(--accent)',
      color: '#fff',
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      padding: '5px 11px',
      borderRadius: 999,
      whiteSpace: 'nowrap'
    }
  }, "Binnenkort online"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      color: 'var(--text-muted)',
      opacity: 0.75
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      color: 'var(--text-muted)',
      marginTop: 5,
      opacity: 0.75
    }
  }, d)) : /*#__PURE__*/React.createElement("button", {
    key: k,
    onClick: () => kies(k),
    style: {
      textAlign: 'left',
      cursor: 'pointer',
      background: '#fff',
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-md)',
      padding: '20px',
      transition: 'border-color var(--dur), transform var(--dur)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = 'var(--accent)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'var(--line-on-light)';
      e.currentTarget.style.transform = 'none';
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      color: 'var(--text-heading)'
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      color: 'var(--text-muted)',
      marginTop: 5
    }
  }, d))))) : null, step === 2 && service === 'poorten' ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: titelSt
  }, "Offerte voor een poort"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 18
    }
  }), Keuze({
    label: 'Type poort',
    name: 'typePoort',
    options: ['Houten poort', ['Metalen poort', '(staal, metaal en aluminium)'], 'Combinatie hout en metaal']
  }), Keuze({
    label: 'Type opening',
    name: 'typeOpening',
    options: ['Draaipoort', 'Schuifpoort', 'Ik weet het niet']
  }), Field({
    label: 'Totale opening breedte in cm',
    name: 'breedte',
    placeholder: 'Bijvoorbeeld: 350',
    inputMode: 'numeric'
  }), Field({
    label: 'Zijhoogte in cm',
    name: 'zijhoogte',
    placeholder: 'Bijvoorbeeld: 180',
    inputMode: 'numeric'
  }), Keuze({
    label: 'Type bediening',
    name: 'bediening',
    options: ['Manueel', 'Automatisch']
  }), Area({
    label: 'Heeft u nog extra informatie of wensen?',
    name: 'opmerkingen',
    placeholder: 'Bijvoorbeeld: bestaande situatie, gewenste kleur, timing, enz.'
  })) : null, step === 2 && service === 'overkappingen' ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: titelSt
  }, "Offerte voor een overkapping"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 18
    }
  }), /*#__PURE__*/React.createElement("div", {
    "data-veld": "uitvoering",
    style: {
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: labelSt
  }, "Uitvoering"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
      gap: 10
    }
  }, [['Aanbouw', 'Tegen de woning of een gebouw', /*#__PURE__*/React.createElement("svg", {
    key: "a",
    viewBox: "0 0 64 44",
    width: "76",
    height: "52",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 4 V40",
    stroke: "var(--accent-rust)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 12 L54 18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M52 18 V40"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 40 H60",
    opacity: "0.35"
  }))], ['Vrijstaand', 'Los in de tuin of op het terras', /*#__PURE__*/React.createElement("svg", {
    key: "v",
    viewBox: "0 0 64 44",
    width: "76",
    height: "52",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 14 H56"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 14 V40"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M52 14 V40"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 40 H60",
    opacity: "0.35"
  }))]].map(([naam, sub, figuur]) => {
    const sel = data.uitvoering === naam;
    return /*#__PURE__*/React.createElement("button", {
      key: naam,
      type: "button",
      onClick: () => {
        set('uitvoering', naam);
        if (naam === 'Aanbouw' && data.wanden === '3') set('wanden', '');
      },
      style: {
        textAlign: 'center',
        cursor: 'pointer',
        padding: '18px 16px 16px',
        borderRadius: 'var(--radius-md)',
        border: sel ? '2px solid var(--accent)' : '1px solid var(--line-on-light)',
        background: sel ? 'rgba(138,106,60,0.08)' : '#fff',
        color: sel ? 'var(--accent)' : 'var(--text-muted)'
      }
    }, figuur, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        fontFamily: 'var(--font-sans)',
        fontSize: 15.5,
        fontWeight: sel ? 600 : 500,
        color: 'var(--text-heading)',
        marginTop: 10
      }
    }, naam), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        fontFamily: 'var(--font-sans)',
        fontSize: 12.5,
        color: 'var(--text-muted)',
        marginTop: 3
      }
    }, sub));
  }))), Field({
    label: 'Lengte in cm',
    name: 'lengte',
    placeholder: 'Bijvoorbeeld: 500',
    inputMode: 'numeric'
  }), Field({
    label: 'Breedte in cm',
    name: 'breedte',
    placeholder: 'Bijvoorbeeld: 300',
    inputMode: 'numeric'
  }), Field({
    label: 'Hoogte in cm',
    name: 'hoogte',
    placeholder: 'Bijvoorbeeld: 250',
    inputMode: 'numeric'
  }), Keuze({
    label: 'Aantal wanden',
    name: 'wanden',
    min: 100,
    options: data.uitvoering === 'Vrijstaand' ? ['Geen', '1', '2', '3'] : ['Geen', '1', '2']
  }), Keuze({
    label: 'Glazen schuifwand',
    name: 'glazenSchuifwand',
    options: ['Ja', 'Nee']
  }), Keuze({
    label: 'Zonnewerend glas',
    name: 'zonnewerendGlas',
    options: ['Ja', 'Nee']
  }), Area({
    label: 'Heeft u nog extra informatie of wensen?',
    name: 'opmerkingen',
    placeholder: 'Bijvoorbeeld: gewenste kleur, materiaal, plaatsing, bestaande situatie, enz.'
  })) : null, step === 2 && service === 'automatisering' ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: titelSt
  }, "Offerte voor automatisering van een bestaande poort"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      lineHeight: 1.6,
      color: 'var(--text-body)',
      margin: '12px 0 20px'
    }
  }, "U wenst een bestaande poort te laten automatiseren. Vul hieronder zoveel mogelijk gegevens in over uw poort. We nemen daarna contact met u op voor verdere informatie."), Area({
    label: 'Gegevens van uw poort',
    name: 'autoBeschrijving',
    rows: 3,
    placeholder: 'Bijvoorbeeld: waar de poort staat, afmetingen, materiaal, huidige bediening, enz.'
  }), Keuze({
    label: 'Type poort indien gekend',
    name: 'typePoort',
    options: ['Schuifpoort', 'Draaipoort', 'Sectionale poort']
  }), Area({
    label: 'Heeft u nog extra informatie of wensen?',
    name: 'opmerkingen',
    placeholder: 'Bijvoorbeeld: afmetingen, leeftijd van de poort, bestaande motor, problemen, gewenste bediening, enz.'
  })) : null, step === 2 && service === 'onderhoud' ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: titelSt
  }, "Onderhoud aanvragen"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(138,106,60,0.08)',
      borderLeft: '3px solid var(--accent)',
      padding: '12px 16px',
      margin: '14px 0 20px',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      lineHeight: 1.55,
      color: 'var(--text-body)'
    }
  }, "Onderhoud aan automatisering is enkel mogelijk bij geautomatiseerde poorten. Heeft u een manuele poort zonder motor, dan is een onderhoud niet van toepassing."), Field({
    label: 'Bouwjaar van de poort indien gekend',
    name: 'bouwjaar',
    placeholder: 'Bijvoorbeeld: 2018',
    inputMode: 'numeric'
  }), Field({
    label: 'Type of merk van de motor indien gekend',
    name: 'typeMotor',
    placeholder: 'Bijvoorbeeld: merk of type motor'
  }), Area({
    label: 'Beschrijf kort waarvoor u onderhoud wenst',
    name: 'opmerkingen',
    placeholder: 'Bijvoorbeeld: poort opent moeilijk, afstandsbediening werkt niet, jaarlijks onderhoud, lawaai, storing, enz.'
  })) : null, step === 3 ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: titelSt
  }, "Uw gegevens"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      color: 'var(--text-muted)',
      margin: '10px 0 22px'
    }
  }, "Laat hieronder uw gegevens achter. We contacteren u zo snel mogelijk om uw aanvraag te bespreken."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: labelSt
  }, "Type klant"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      padding: 4,
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--line-on-light)',
      background: '#fff'
    }
  }, ['particulier', 'bedrijf'].map(tk => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: tk,
    onClick: () => set('klantType', tk),
    style: {
      flex: 1,
      padding: '10px 12px',
      borderRadius: 'var(--radius-sm)',
      border: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      fontWeight: 600,
      background: (data.klantType || 'particulier') === tk ? 'var(--accent)' : 'transparent',
      color: (data.klantType || 'particulier') === tk ? '#fff' : 'var(--text-body)'
    }
  }, tk === 'particulier' ? 'Particulier' : 'Bedrijf')))), data.klantType === 'bedrijf' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0 16px'
    }
  }, Field({
    label: 'Bedrijfsnaam',
    name: 'bedrijfsnaam',
    required: true
  }), Field({
    label: 'Btw nummer',
    name: 'btwNummer',
    required: true,
    placeholder: 'BE 0123 456 789'
  })) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0 16px'
    }
  }, Field({
    label: 'Voornaam',
    name: 'voornaam',
    required: true
  }), Field({
    label: 'Naam',
    name: 'naam',
    required: true
  })), Field({
    label: 'Emailadres',
    name: 'email',
    type: 'email',
    required: true,
    placeholder: 'Bijvoorbeeld: naam@email.be'
  }), Field({
    label: 'Telefoonnummer',
    name: 'telefoon',
    type: 'tel',
    required: true,
    placeholder: 'Bijvoorbeeld: 0470 12 34 56'
  }), Field({
    label: 'Straat en huisnummer',
    name: 'adres',
    required: true,
    placeholder: 'Bijvoorbeeld: Kerkstraat 12'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0 16px'
    }
  }, Field({
    label: 'Postcode',
    name: 'postcode',
    required: true,
    inputMode: 'numeric',
    placeholder: 'Bijvoorbeeld: 2800'
  }), Field({
    label: 'Stad of gemeente',
    name: 'stad',
    required: true,
    placeholder: 'Bijvoorbeeld: Mechelen'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: labelSt
  }, "Gewenste timing"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: data.timing || '',
    onChange: e => set('timing', e.target.value),
    style: Object.assign({}, inputSt, {
      cursor: 'pointer',
      appearance: 'none',
      WebkitAppearance: 'none',
      backgroundImage: 'linear-gradient(45deg, transparent 50%, var(--accent) 50%), linear-gradient(135deg, var(--accent) 50%, transparent 50%)',
      backgroundPosition: 'calc(100% - 18px) 55%, calc(100% - 13px) 55%',
      backgroundSize: '5px 5px, 5px 5px',
      backgroundRepeat: 'no-repeat',
      paddingRight: 38
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Maak een keuze"), /*#__PURE__*/React.createElement("option", {
    value: "Zo snel mogelijk"
  }, "Zo snel mogelijk"), /*#__PURE__*/React.createElement("option", {
    value: "Binnen drie maanden"
  }, "Binnen drie maanden"), /*#__PURE__*/React.createElement("option", {
    value: "Binnen zes maanden"
  }, "Binnen zes maanden"), /*#__PURE__*/React.createElement("option", {
    value: "Nog in oriëntatie"
  }, "Nog in oriëntatie")))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: labelSt
  }, "Foto's toevoegen ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      fontWeight: 400,
      fontSize: 13.5
    }
  }, "(optioneel, max 5)")), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      border: '1px dashed var(--line-on-light)',
      borderRadius: 'var(--radius-md)',
      padding: '13px 14px',
      cursor: 'pointer',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      color: fotos.length ? 'var(--text-body)' : 'var(--text-muted)'
    }
  }, fotos.length ? fotos.length + " bestand(en) geselecteerd" : "Sleep of kies foto's van de plek"), /*#__PURE__*/React.createElement("span", {
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
    accept: "image/*",
    multiple: true,
    onChange: e => setFotos(e.target.files ? Array.prototype.slice.call(e.target.files, 0, 5) : []),
    style: {
      display: 'none'
    }
  })))) : null, step === 4 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '20px 0 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 60,
      height: 60,
      borderRadius: '50%',
      background: 'rgba(138,106,60,0.12)',
      color: 'var(--accent)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 30,
      margin: '0 auto 18px'
    }
  }, "✓"), /*#__PURE__*/React.createElement("h2", {
    style: titelSt
  }, "Bedankt voor uw aanvraag"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      lineHeight: 1.6,
      color: 'var(--text-body)',
      maxWidth: '46ch',
      margin: '14px auto 0'
    }
  }, "We hebben uw offerteaanvraag goed ontvangen. We nemen zo snel mogelijk contact met u op om uw aanvraag verder te bespreken.")) : null), fout ? /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto',
      padding: '12px 24px',
      color: 'var(--accent-rust)',
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      borderTop: '1px solid var(--line-on-light-soft)'
    }
  }, fout) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      padding: '18px 24px',
      borderTop: '1px solid var(--line-on-light-soft)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, step === 2 ? /*#__PURE__*/React.createElement("button", {
    onClick: () => setStep(1),
    style: terugSt
  }, "Terug") : null, step === 3 ? /*#__PURE__*/React.createElement("button", {
    onClick: () => setStep(2),
    style: terugSt
  }, "Terug") : null), /*#__PURE__*/React.createElement("div", null, step === 1 ? /*#__PURE__*/React.createElement("button", {
    onClick: close,
    style: terugSt
  }, "Annuleren") : null, step === 2 ? /*#__PURE__*/React.createElement("button", {
    onClick: () => setStep(3),
    style: primair
  }, "Volgende") : null, step === 3 ? /*#__PURE__*/React.createElement("button", {
    onClick: verzend,
    disabled: bezig,
    style: bezig ? Object.assign({}, primair, {
      opacity: 0.6
    }) : primair
  }, bezig ? 'Bezig met verzenden' : 'Aanvraag verzenden') : null, step === 4 ? /*#__PURE__*/React.createElement("button", {
    onClick: closeReset,
    style: primair
  }, "Sluiten") : null))));
}

/* ---- Premium categoriepagina (Metalen, Houten, Combinatie) ---- */
function CatIcoon({
  name
}) {
  const paden = {
    maat: /*#__PURE__*/React.createElement("path", {
      d: "M3 8h18v8H3z M7 8v3 M11 8v4 M15 8v3 M19 8v4"
    }),
    schild: /*#__PURE__*/React.createElement("path", {
      d: "M12 3l7 3v5c0 4.4-3 7.4-7 8.5-4-1.1-7-4.1-7-8.5V6z M9 12l2 2 4-4"
    }),
    atelier: /*#__PURE__*/React.createElement("path", {
      d: "M14 3l7 7-3 3-2-2-6 6-3-1-1-3 6-6-2-2z"
    }),
    afstand: /*#__PURE__*/React.createElement("path", {
      d: "M9 3h6v4H9z M12 7v3 M6 10h12v11H6z M12 15v2"
    })
  };
  return /*#__PURE__*/React.createElement("svg", {
    width: "30",
    height: "30",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--accent)",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, paden[name] || paden.maat);
}
function CatVink() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--accent)",
    strokeWidth: 2.2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12l4 4 10-11"
  }));
}
function CatChip({
  label
}) {
  // Puur informatieve stijllabels, bewust niet klikbaar.
  return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      padding: '9px 16px',
      borderRadius: 999,
      color: 'var(--stone-200)',
      border: '1px solid var(--line-on-dark-soft)',
      cursor: 'default',
      pointerEvents: 'none',
      userSelect: 'none'
    }
  }, label);
}
var CAT_TROEVEN = ['Belgisch maatwerk', 'Duurzame afwerking', 'Professionele plaatsing'];
var CAT_VOORDELEN = [{
  icon: 'maat',
  titel: 'Volledig op maat',
  tekst: 'Elke poort wordt ontworpen op maat van uw woning, oprit en dagelijks gebruik.'
}, {
  icon: 'schild',
  titel: 'Beschermd en duurzaam',
  tekst: 'Een zorgvuldige afwerking beschermt uw poort tegen weer en slijtage.'
}, {
  icon: 'atelier',
  titel: 'Eigen atelier',
  tekst: 'Ontworpen, gemaakt en met de hand afgewerkt onder een dak.'
}, {
  icon: 'afstand',
  titel: 'Manueel of automatisch',
  tekst: 'Bedien uw poort met de hand of laat ze volledig automatiseren.'
}];
var CAT_CHIPS = ['Klassiek', 'Modern', 'Landelijk', 'Minimalistisch', 'Gesloten', 'Halfopen'];
var CAT_MATERIAAL_TEKST = 'Wij stemmen elke poort af op de architectuur van uw woning, de beschikbare ruimte, de gewenste privacy en uitstraling en de manier waarop u de poort wil bedienen. Zo krijgt u geen standaardmodel maar een poort die echt bij uw thuis past.';
var CAT_TYPES = {
  draai: {
    titel: 'Draaipoort',
    punten: ['Klassieke en elegante opening', 'Opent naar binnen of naar buiten', 'Ideaal wanneer er voldoende vrije ruimte is']
  },
  schuif: {
    titel: 'Schuifpoort',
    punten: ['Schuift zijdelings open langs de oprit', 'Ideaal bij een korte of hellende oprit', 'Ruimtebesparend en praktisch in gebruik']
  }
};
var CAT_AUTO = {
  titel: 'Comfortabel en veilig automatisch openen',
  tekst: 'Bedien uw poort met een afstandsbediening, een codeklavier, de parlofoon of uw smartphone. Poortland automatiseert nieuwe en bestaande poorten met betrouwbare FAAC aandrijvingen.',
  voordelen: ['Veilige toegang tot uw oprit', 'Eenvoudige bediening voor iedereen', 'Integratie met video parlofoon', 'Onderhoud en service door een eigen team'],
  beeld: 'media/aluminium-poort.jpg'
};
var CAT_PROCES = [{
  n: '01',
  titel: 'Advies en opmeting',
  tekst: 'Wij komen ter plaatse, luisteren naar uw wensen en meten alles nauwkeurig op.'
}, {
  n: '02',
  titel: 'Ontwerp en materiaalkeuze',
  tekst: 'U ontvangt een ontwerp op maat met de juiste materialen, stijl en afwerking.'
}, {
  n: '03',
  titel: 'Productie in het atelier',
  tekst: 'Uw poort wordt in eigen atelier gemaakt, gelast en met de hand afgewerkt.'
}, {
  n: '04',
  titel: 'Plaatsing en afstelling',
  tekst: 'Onze eigen plaatsers monteren de poort en stellen alles zorgvuldig af.'
}];
var CAT_FILTERS = ['Alle', 'Modern', 'Klassiek', 'Hout', 'Metaal'];

/* Basisnaam per model voor de filters: varianten zoals "met plaat" of codes
   zoals DV en ESR vallen weg (Veluwe dubbele cirkel wordt Veluwe), maar echte
   tweedelige namen blijven heel (Loch Lomond). */
var MODEL_STOPWOORDEN = {
  met: 1,
  zonder: 1,
  recht: 1,
  ronde: 1,
  dubbele: 1,
  special: 1,
  plane: 1,
  perfo: 1,
  laser: 1,
  vlak: 1,
  volle: 1,
  combi: 1,
  glas: 1,
  ligna: 1,
  open: 1,
  type: 1,
  staal: 1,
  boog: 1,
  cirkel: 1,
  cirkels: 1,
  middenstijl: 1,
  plaat: 1,
  punt: 1,
  punten: 1,
  sides: 1,
  side: 1,
  futuris: 1
};
function modelBasisKaart(labels) {
  var tokens = {};
  labels.forEach(function (l) {
    tokens[l] = l.replace(/\s*\(\d+\)\s*$/, '').split(/\s+/).filter(Boolean);
  });
  function codeachtig(w) {
    return /^[A-Z0-9+°().\/-]+$/.test(w) || !!MODEL_STOPWOORDEN[w.toLowerCase()];
  }
  var kaart = {};
  labels.forEach(function (l) {
    var eigen = tokens[l];
    var basis = [eigen[0] || l];
    while (true) {
      var idx = basis.length;
      var pref = basis.join(' ').toLowerCase();
      var groep = labels.filter(function (a) {
        return tokens[a].slice(0, idx).join(' ').toLowerCase() === pref;
      });
      var volgend = null,
        ok = groep.length > 0 && !!eigen[idx];
      groep.forEach(function (a) {
        var t = tokens[a][idx];
        if (!t || codeachtig(t)) {
          ok = false;
          return;
        }
        if (volgend === null) volgend = t.toLowerCase();else if (t.toLowerCase() !== volgend) ok = false;
      });
      if (ok) basis.push(eigen[idx]);else break;
    }
    kaart[l] = basis.join(' ');
  });
  return kaart;
}
function CategoriePagina({
  onNav,
  data
}) {
  const d = data || {};
  const {
    Reveal,
    SectieKop,
    FAQ,
    CTASectie
  } = window;
  const [filter, setFilter] = React.useState('Alle');
  // Start op de eerste tab die al foto's heeft (lege tabs blijven bereikbaar).
  const [modelTab, setModelTab] = React.useState(() => {
    const i = (d.productenGroepen || []).findIndex(g => (g.types || []).some(t => t.foto));
    return i >= 0 ? i : 0;
  });
  const [modelType, setModelType] = React.useState('Alle');
  const modelGroep = (d.productenGroepen || [])[modelTab] || {};
  const modelTypes = modelGroep.types || [];
  const modelKaart = modelBasisKaart(modelTypes.filter(t => t.naam).map(t => t.naam));
  const modelChips = Object.keys(modelKaart).map(k => modelKaart[k]).filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a.localeCompare(b, 'nl'));
  const modelZichtbaar = modelType === 'Alle' ? modelTypes : modelTypes.filter(t => modelKaart[t.naam] === modelType);
  React.useEffect(() => {
    if (d.title) document.title = d.title;
    if (window.scrollTo) window.scrollTo(0, 0);
  }, [d]);
  const offerte = () => window.dispatchEvent(new CustomEvent('pl-offerte-open'));
  const galRef = React.useRef(null);
  const scrollGal = dir => {
    if (galRef.current) galRef.current.scrollBy({
      left: dir * 400,
      behavior: 'smooth'
    });
  };
  const troeven = d.troeven || CAT_TROEVEN;
  const voordelen = d.voordelen || CAT_VOORDELEN;
  const chips = d.chips || CAT_CHIPS;
  const types = d.poorttypes || CAT_TYPES;
  const auto = d.automatisering || CAT_AUTO;
  const proces = d.proces || CAT_PROCES;
  const filters = d.realisaties && d.realisaties.filters || CAT_FILTERS;
  const items = d.realisaties && d.realisaties.items || [];
  const zichtbaar = items.filter(it => filter === 'Alle' || (it.tags || []).indexOf(filter) !== -1);
  const bc = {
    background: 'none',
    border: 0,
    padding: 0,
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    fontSize: 13,
    color: 'var(--text-muted)'
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Kruimelpad",
    style: {
      background: 'var(--surface-paper)',
      borderBottom: '1px solid var(--line-on-light-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      padding: '15px 44px',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('home'),
    style: bc
  }, "Home"), /*#__PURE__*/React.createElement("span", {
    style: {
      margin: '0 9px',
      color: 'var(--line-on-light)'
    }
  }, "/"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('poorten'),
    style: bc
  }, "Poorten"), /*#__PURE__*/React.createElement("span", {
    style: {
      margin: '0 9px',
      color: 'var(--line-on-light)'
    }
  }, "/"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-heading)'
    }
  }, d.eyebrow))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '74px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pl-split",
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.02fr 0.98fr',
      gap: 60,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SEyebrow, {
    dark: true,
    style: {
      marginBottom: 20
    }
  }, d.eyebrow, " op maat"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 64,
      lineHeight: 1.03,
      letterSpacing: '-0.01em',
      color: 'var(--stone-100)',
      margin: 0
    }
  }, d.h1), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 18.5,
      lineHeight: 1.6,
      color: 'var(--stone-300)',
      maxWidth: '46ch',
      margin: '24px 0 30px'
    }
  }, d.introKort), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap',
      marginBottom: 30
    }
  }, /*#__PURE__*/React.createElement(SButton, {
    variant: "primary",
    arrow: true,
    as: "button",
    onClick: offerte
  }, "Vraag een offerte aan"), /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    dark: true,
    arrow: true,
    onClick: () => onNav('realisaties')
  }, "Bekijk realisaties")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 26,
      flexWrap: 'wrap'
    }
  }, troeven.map(t => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(CatVink, null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--stone-200)'
    }
  }, t))))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 10,
      overflow: 'hidden',
      aspectRatio: '3 / 2',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: d.heroBeeld,
    alt: d.h1,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 18,
      bottom: 18,
      background: 'rgba(251,248,241,0.94)',
      borderRadius: 999,
      padding: '9px 16px',
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--text-heading)'
    }
  }, d.heroLabel || 'Volledig op maat'))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '68px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pl-cards4",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 18
    }
  }, voordelen.map((v, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: v.titel,
    delay: i % 4 * 70
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--line-on-light-soft)',
      borderRadius: 'var(--radius-md)',
      padding: '26px 22px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(CatIcoon, {
    name: v.icon
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      color: 'var(--text-heading)',
      margin: '16px 0 7px'
    }
  }, v.titel), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14.5,
      lineHeight: 1.6,
      color: 'var(--text-muted)'
    }
  }, v.tekst))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '90px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      padding: '0 44px'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 640
    }
  }, /*#__PURE__*/React.createElement(SEyebrow, {
    dark: true,
    style: {
      marginBottom: 16
    }
  }, "Stijl en afwerking"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 42,
      color: 'var(--stone-100)',
      margin: 0,
      lineHeight: 1.08,
      letterSpacing: '-0.01em'
    }
  }, "Een poort die past bij uw woning"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      maxWidth: '52ch',
      margin: '20px 0 4px'
    }
  }, d.materiaalTekst || CAT_MATERIAAL_TEKST), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10,
      marginTop: 22
    }
  }, chips.map(c => /*#__PURE__*/React.createElement(CatChip, {
    key: c,
    label: c
  })))))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 1320,
      margin: '40px auto 0',
      padding: '0 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: galRef,
    className: "pl-hscroll",
    style: {
      display: 'flex',
      gap: 16,
      overflowX: 'auto',
      scrollSnapType: 'x mandatory',
      paddingBottom: 14
    }
  }, (d.materiaalFotos || []).map((src, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: '0 0 auto',
      width: 380,
      maxWidth: '82vw',
      aspectRatio: '4 / 3',
      borderRadius: 8,
      overflow: 'hidden',
      scrollSnapAlign: 'start'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    loading: "lazy",
    alt: d.eyebrow + ' voorbeeld ' + (i + 1),
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  })))), /*#__PURE__*/React.createElement("button", {
    className: "pl-galpijl",
    onClick: () => scrollGal(-1),
    "aria-label": "Vorige fotos",
    style: {
      position: 'absolute',
      left: 30,
      top: 'calc(50% - 7px)',
      transform: 'translateY(-50%)',
      width: 46,
      height: 46,
      borderRadius: '50%',
      border: '1px solid var(--line-on-light-soft)',
      background: 'var(--surface-paper)',
      color: 'var(--text-heading)',
      cursor: 'pointer',
      fontSize: 22,
      lineHeight: 1,
      boxShadow: '0 4px 14px rgba(20,28,21,0.28)'
    }
  }, "‹"), /*#__PURE__*/React.createElement("button", {
    className: "pl-galpijl",
    onClick: () => scrollGal(1),
    "aria-label": "Volgende fotos",
    style: {
      position: 'absolute',
      right: 30,
      top: 'calc(50% - 7px)',
      transform: 'translateY(-50%)',
      width: 46,
      height: 46,
      borderRadius: '50%',
      border: '1px solid var(--line-on-light-soft)',
      background: 'var(--surface-paper)',
      color: 'var(--text-heading)',
      cursor: 'pointer',
      fontSize: 22,
      lineHeight: 1,
      boxShadow: '0 4px 14px rgba(20,28,21,0.28)'
    }
  }, "›")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '88px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    align: "center",
    eyebrow: "Modellen",
    titel: d.productenTitel || 'Modellen en stijlen',
    intro: d.productenIntro || 'Van strak en modern tot klassiek en landelijk, telkens volledig op maat gemaakt.'
  })), d.productenGroepen ? /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '46px auto 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    "aria-label": d.productenTitel,
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 4,
      rowGap: 4,
      justifyContent: 'center'
    }
  }, d.productenGroepen.map((g, i) => /*#__PURE__*/React.createElement("button", {
    key: g.tab,
    role: "tab",
    type: "button",
    "aria-selected": modelTab === i,
    onClick: () => {
      setModelTab(i);
      setModelType('Alle');
    },
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      fontWeight: 600,
      cursor: 'pointer',
      padding: '12px 22px',
      border: '1px solid var(--line-on-light-soft)',
      borderBottom: 0,
      borderRadius: '8px 8px 0 0',
      position: 'relative',
      bottom: -1,
      background: modelTab === i ? 'var(--surface-card)' : 'transparent',
      color: modelTab === i ? 'var(--text-heading)' : 'var(--text-muted)'
    }
  }, g.tab))), /*#__PURE__*/React.createElement("div", {
    role: "tabpanel",
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--line-on-light-soft)',
      borderRadius: '10px',
      padding: '30px'
    }
  }, modelChips.length > 1 ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      justifyContent: 'center',
      marginBottom: 24
    }
  }, ['Alle'].concat(modelChips).map(chip => {
    const actief = modelType === chip;
    return /*#__PURE__*/React.createElement("button", {
      key: chip,
      type: "button",
      "aria-pressed": actief,
      onClick: () => setModelType(chip),
      style: {
        fontFamily: 'var(--font-label)',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        padding: '8px 14px',
        borderRadius: 999,
        cursor: 'pointer',
        transition: 'all var(--dur) var(--ease-out)',
        background: actief ? 'var(--accent)' : 'transparent',
        color: actief ? '#fff' : 'var(--text-body)',
        border: '1px solid ' + (actief ? 'var(--accent)' : 'var(--line-on-light)')
      }
    }, chip);
  })) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
      gap: 18
    }
  }, modelZichtbaar.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '4 / 3',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: 'var(--surface-paper-2)',
      border: '1px dashed var(--line-on-light)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      padding: '0 12px',
      textAlign: 'center'
    }
  }, t.naam || 'Type'), t.foto ? /*#__PURE__*/React.createElement("img", {
    src: t.foto,
    alt: t.naam || 'Metalen poort',
    loading: "lazy",
    onError: e => {
      e.currentTarget.style.display = 'none';
    },
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : null), t.naam ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-heading)',
      marginTop: 10,
      textAlign: 'center'
    }
  }, t.naam) : null)))))) : /*#__PURE__*/React.createElement("div", {
    className: "pl-cards",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 20,
      marginTop: 46
    }
  }, (d.producten || []).map((p, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: p.titel,
    delay: i % 3 * 80,
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "pl-prod-card",
    onClick: () => onNav('realisaties'),
    style: {
      width: '100%',
      textAlign: 'left',
      cursor: 'pointer',
      background: 'var(--surface-card)',
      border: '1px solid var(--line-on-light-soft)',
      borderRadius: 'var(--radius-md)',
      padding: 0,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '4 / 3',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: p.beeld,
    loading: "lazy",
    alt: p.titel,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 20px 22px',
      display: 'flex',
      flexDirection: 'column',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      color: 'var(--text-heading)',
      lineHeight: 1.15
    }
  }, p.titel), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      lineHeight: 1.6,
      color: 'var(--text-muted)',
      marginTop: 8,
      flex: 1
    }
  }, p.tekst), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--accent)',
      marginTop: 16
    }
  }, "Ontdek deze stijl →")))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '20px 44px 90px',
      borderTop: '1px solid var(--line-on-light-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    align: "center",
    eyebrow: "Type opening",
    titel: "Draaipoort of schuifpoort?",
    intro: "Twee elegante oplossingen. Welke past het best hangt af van uw oprit en de beschikbare ruimte."
  })), /*#__PURE__*/React.createElement("div", {
    className: "pl-comp",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 22,
      marginTop: 44
    }
  }, [types.draai, types.schuif].map(tp => /*#__PURE__*/React.createElement(Reveal, {
    key: tp.titel,
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      background: 'var(--surface-card)',
      border: '1px solid var(--line-on-light-soft)',
      borderRadius: 'var(--radius-md)',
      padding: '30px 30px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 26,
      color: 'var(--text-heading)',
      marginBottom: 16
    }
  }, tp.titel), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, tp.punten.map(pt => /*#__PURE__*/React.createElement("div", {
    key: pt,
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)',
      fontFamily: 'var(--font-display)',
      fontSize: 16
    }
  }, "—"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15.5,
      lineHeight: 1.55,
      color: 'var(--text-body)'
    }
  }, pt)))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 34
    }
  }, /*#__PURE__*/React.createElement(SButton, {
    variant: "primary",
    arrow: true,
    as: "button",
    onClick: offerte
  }, "Laat u adviseren over de beste oplossing")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      color: 'var(--text-on-dark)',
      padding: '92px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pl-split",
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.05fr 0.95fr',
      gap: 56,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SEyebrow, {
    dark: true,
    style: {
      marginBottom: 16
    }
  }, "Automatisering"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 40,
      color: 'var(--stone-100)',
      margin: 0,
      lineHeight: 1.1,
      letterSpacing: '-0.01em'
    }
  }, auto.titel), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16.5,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      maxWidth: '50ch',
      margin: '20px 0 26px'
    }
  }, auto.tekst), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 14,
      marginBottom: 30
    }
  }, auto.voordelen.map(v => /*#__PURE__*/React.createElement("div", {
    key: v,
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(CatVink, null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14.5,
      lineHeight: 1.45,
      color: 'var(--stone-200)'
    }
  }, v)))), /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    dark: true,
    arrow: true,
    onClick: () => onNav('automatisering')
  }, "Ontdek poortautomatisering")), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 10,
      overflow: 'hidden',
      aspectRatio: '4 / 3',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: auto.beeld,
    loading: "lazy",
    alt: "Poortautomatisering",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '90px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    align: "center",
    eyebrow: "Werkwijze",
    titel: "Van eerste advies tot perfecte plaatsing",
    intro: "Vier duidelijke stappen, telkens met persoonlijke begeleiding en eigen vakmensen."
  })), /*#__PURE__*/React.createElement("div", {
    className: "pl-proces",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 26,
      marginTop: 52
    }
  }, proces.map((s, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: s.n,
    delay: i * 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, i < proces.length - 1 ? /*#__PURE__*/React.createElement("div", {
    className: "pl-proces-lijn",
    style: {
      position: 'absolute',
      top: 26,
      left: 62,
      right: -26,
      height: 2,
      background: 'var(--line-on-light)'
    }
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 54,
      height: 54,
      borderRadius: '50%',
      background: 'var(--accent)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      position: 'relative',
      zIndex: 1
    }
  }, s.n), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 20,
      color: 'var(--text-heading)',
      margin: '18px 0 6px',
      lineHeight: 1.2
    }
  }, s.titel), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14.5,
      lineHeight: 1.6,
      color: 'var(--text-muted)',
      margin: 0
    }
  }, s.tekst))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '90px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pl-kwal pl-split",
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 56,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 10,
      overflow: 'hidden',
      aspectRatio: '4 / 5',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: d.kwaliteit && d.kwaliteit.beeld,
    loading: "lazy",
    alt: "Kwaliteit en afwerking",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement(SEyebrow, {
    style: {
      marginBottom: 16
    }
  }, "Kwaliteit en duurzaamheid"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 40,
      color: 'var(--text-heading)',
      margin: 0,
      lineHeight: 1.1,
      letterSpacing: '-0.01em'
    }
  }, d.kwaliteit && d.kwaliteit.titel || 'Gemaakt om jaren mee te gaan'), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16.5,
      lineHeight: 1.7,
      color: 'var(--text-body)',
      maxWidth: '52ch',
      margin: '18px 0 26px'
    }
  }, d.kwaliteit && d.kwaliteit.intro), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 20
    }
  }, (d.kwaliteit && d.kwaliteit.kenmerken || []).map(k => /*#__PURE__*/React.createElement("div", {
    key: k.titel,
    style: {
      borderTop: '2px solid var(--accent)',
      paddingTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-heading)'
    }
  }, k.titel), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      lineHeight: 1.55,
      color: 'var(--text-muted)',
      marginTop: 4
    }
  }, k.tekst)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      lineHeight: 1.6,
      color: 'var(--text-body)',
      margin: '0 0 14px'
    }
  }, "Bekijk ook onze garantiepagina voor meer informatie over onze garanties en de anti corrosie behandeling."), /*#__PURE__*/React.createElement(SButton, {
    variant: "secondary",
    arrow: true,
    onClick: () => onNav('garantie')
  }, "Bekijk onze garantie"))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '90px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pl-split",
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '0.85fr 1.15fr',
      gap: 54,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 10,
      overflow: 'hidden',
      aspectRatio: '4 / 3',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: d.testimonial && d.testimonial.beeld,
    loading: "lazy",
    alt: "Gerealiseerd project",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--accent)',
      letterSpacing: '3px',
      fontSize: 16,
      marginBottom: 16
    }
  }, "★★★★★"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontStyle: 'italic',
      fontSize: 30,
      lineHeight: 1.34,
      color: 'var(--stone-100)',
      margin: 0,
      letterSpacing: '-0.005em'
    }
  }, "“", d.testimonial && d.testimonial.quote, "”"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--stone-100)'
    }
  }, d.testimonial && d.testimonial.naam), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-on-dark-muted)',
      marginTop: 3
    }
  }, d.testimonial && d.testimonial.gemeente, " · ", d.testimonial && d.testimonial.project))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '90px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 860,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    align: "center",
    eyebrow: "Veelgestelde vragen",
    titel: "Goed om te weten"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 36
    }
  }, /*#__PURE__*/React.createElement(FAQ, {
    items: (d.faq || []).map(q => [q.q, q.a])
  })))), /*#__PURE__*/React.createElement(CTASectie, {
    onNav: onNav,
    dark: true
  }), /*#__PURE__*/React.createElement("button", {
    className: "pl-mobcta",
    onClick: offerte,
    style: {
      position: 'fixed',
      left: 16,
      right: 16,
      bottom: 16,
      zIndex: 60,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '15px 20px',
      borderRadius: 'var(--radius-md)',
      border: 0,
      cursor: 'pointer',
      background: 'var(--accent)',
      color: '#fff',
      fontFamily: 'var(--font-label)',
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      boxShadow: '0 6px 20px rgba(20,28,21,0.28)'
    }
  }, "Vraag een offerte aan"));
}

/* materiaalFotos is de fotolijst per poorttype voor de horizontale scroll. Later te beheren vanuit het ERP of CRM. */
var CATEGORIEEN = {
  metalen: {
    title: 'Metalen poorten op maat | Poortland Mechelen',
    eyebrow: 'Metalen poorten',
    h1: 'Metalen poorten op maat',
    introKort: 'Strak, sterk en jarenlang betrouwbaar. Poortland ontwerpt en maakt metalen poorten in staal en aluminium, volledig op maat van uw woning.',
    heroBeeld: 'media/stalen-poort.jpg',
    heroLabel: 'Volledig op maat',
    materiaalFotos: ['media/stalen-poort.jpg', 'media/realisatie-metaal-1.jpeg', 'media/aluminium-poort.jpg', 'media/realisatie-metaal-2.jpeg', 'media/realisatie-alu-1.jpeg'],
    productenTitel: 'Modellen in metaal',
    productenIntro: 'Hieronder ziet u onze verschillende soorten metalen poorten, ingedeeld per stijl. Kies een stijl en filter daarbinnen op model.',
    productenGroepen: [{
      tab: "Aluminium",
      types: [{
        naam: '',
        foto: ''
      }]
    }, {
      tab: "Modern",
      types: [{
        naam: "Allegro",
        foto: "media/metaal/Modern/Allegro%20%20.jpg"
      }, {
        naam: "Allegro",
        foto: "media/metaal/Modern/Allegro%20.jpg"
      }, {
        naam: "Allegro",
        foto: "media/metaal/Modern/Allegro.jpg"
      }, {
        naam: "Arno",
        foto: "media/metaal/Modern/Arno%20%20%20%20.jpg"
      }, {
        naam: "Arno",
        foto: "media/metaal/Modern/Arno%20%20%20.jpg"
      }, {
        naam: "Arno",
        foto: "media/metaal/Modern/Arno%20.jpg"
      }, {
        naam: "Arno",
        foto: "media/metaal/Modern/Arno.jpg"
      }, {
        naam: "Arno futuris",
        foto: "media/metaal/Modern/Arno%20futuris.jpg"
      }, {
        naam: "Boogpoort",
        foto: "media/metaal/Modern/Boogpoort%20.jpg"
      }, {
        naam: "Boogpoort",
        foto: "media/metaal/Modern/Boogpoort.jpg"
      }, {
        naam: "Contessa",
        foto: "media/metaal/Modern/Contessa.jpg"
      }, {
        naam: "Corni",
        foto: "media/metaal/Modern/Corni%20%20%20.jpg"
      }, {
        naam: "Corni",
        foto: "media/metaal/Modern/Corni%20.jpg"
      }, {
        naam: "Corni",
        foto: "media/metaal/Modern/Corni.jpg"
      }, {
        naam: "Ebro",
        foto: "media/metaal/Modern/Ebro.jpg"
      }, {
        naam: "Espoort",
        foto: "media/metaal/Modern/Espoort%20.jpg"
      }, {
        naam: "Espoort",
        foto: "media/metaal/Modern/Espoort.jpg"
      }, {
        naam: "Glen Kwai",
        foto: "media/metaal/Modern/Glen%20Kwai%20%20%20%20%20%20%20.jpg"
      }, {
        naam: "Glen Kwai",
        foto: "media/metaal/Modern/Glen%20Kwai%20%20%20%20%20%20.jpg"
      }, {
        naam: "Glen Kwai",
        foto: "media/metaal/Modern/Glen%20Kwai%20%20%20%20.jpg"
      }, {
        naam: "Glen Kwai",
        foto: "media/metaal/Modern/Glen%20Kwai%20%20%20.jpg"
      }, {
        naam: "Glen Kwai",
        foto: "media/metaal/Modern/Glen%20Kwai%20%20.jpg"
      }, {
        naam: "Glen Kwai",
        foto: "media/metaal/Modern/Glen%20Kwai%20.jpg"
      }, {
        naam: "Glen Kwai",
        foto: "media/metaal/Modern/Glen%20Kwai.jpg"
      }, {
        naam: "Glenfiddich",
        foto: "media/metaal/Modern/Glenfiddich%20%20%20%20%20%20%20%20%20%20%20%20%20.jpg"
      }, {
        naam: "Glenfiddich",
        foto: "media/metaal/Modern/Glenfiddich%20%20%20%20%20%20%20%20%20%20.jpg"
      }, {
        naam: "Glenfiddich",
        foto: "media/metaal/Modern/Glenfiddich%20%20%20%20%20%20%20%20%20.jpg"
      }, {
        naam: "Glenfiddich",
        foto: "media/metaal/Modern/Glenfiddich%20%20%20%20%20%20%20.jpg"
      }, {
        naam: "Glenfiddich",
        foto: "media/metaal/Modern/Glenfiddich%20%20%20%20%20%20.jpg"
      }, {
        naam: "Glenfiddich",
        foto: "media/metaal/Modern/Glenfiddich%20%20%20%20%20.jpg"
      }, {
        naam: "Glenfiddich",
        foto: "media/metaal/Modern/Glenfiddich%20%20%20%20.jpg"
      }, {
        naam: "Glenfiddich",
        foto: "media/metaal/Modern/Glenfiddich%20%20%20.jpg"
      }, {
        naam: "Glenfiddich",
        foto: "media/metaal/Modern/Glenfiddich%20%20.jpg"
      }, {
        naam: "Glenfiddich",
        foto: "media/metaal/Modern/Glenfiddich%20.jpg"
      }, {
        naam: "Glenfiddich",
        foto: "media/metaal/Modern/Glenfiddich.jpg"
      }, {
        naam: "Glenfiddich plane",
        foto: "media/metaal/Modern/Glenfiddich%20plane%20%20%20.jpg"
      }, {
        naam: "Glenfiddich plane",
        foto: "media/metaal/Modern/Glenfiddich%20plane%20%20.jpg"
      }, {
        naam: "Glenfiddich plane",
        foto: "media/metaal/Modern/Glenfiddich%20plane%20.jpg"
      }, {
        naam: "Glenfiddich plane",
        foto: "media/metaal/Modern/Glenfiddich%20plane.jpg"
      }, {
        naam: "Glenfiddich Verticaal",
        foto: "media/metaal/Modern/Glenfiddich%20Verticaal.jpg"
      }, {
        naam: "Japura",
        foto: "media/metaal/Modern/Japura%20.jpg"
      }, {
        naam: "Japura",
        foto: "media/metaal/Modern/Japura.jpg"
      }, {
        naam: "Kama",
        foto: "media/metaal/Modern/Kama%20%20%20%20.jpg"
      }, {
        naam: "Kama",
        foto: "media/metaal/Modern/Kama%20%20%20.jpg"
      }, {
        naam: "Kama",
        foto: "media/metaal/Modern/Kama%20%20.jpg"
      }, {
        naam: "Kama",
        foto: "media/metaal/Modern/Kama%20.jpg"
      }, {
        naam: "Kama",
        foto: "media/metaal/Modern/Kama.jpg"
      }, {
        naam: "Kama zonder middenstijl",
        foto: "media/metaal/Modern/Kama%20zonder%20middenstijl.jpg"
      }, {
        naam: "Kassai",
        foto: "media/metaal/Modern/Kassai%20.jpg"
      }, {
        naam: "Kassai",
        foto: "media/metaal/Modern/Kassai.jpg"
      }, {
        naam: "Killian",
        foto: "media/metaal/Modern/Killian.jpg"
      }, {
        naam: "Kwai",
        foto: "media/metaal/Modern/Kwai%20%20%20.jpg"
      }, {
        naam: "Kwai combi glas",
        foto: "media/metaal/Modern/Kwai%20combi%20glas%20.jpg"
      }, {
        naam: "Kwai combi glas",
        foto: "media/metaal/Modern/Kwai%20combi%20glas.jpg"
      }, {
        naam: "Kwai met boog",
        foto: "media/metaal/Modern/Kwai%20met%20boog%20%20%20.jpg"
      }, {
        naam: "Kwai met boog",
        foto: "media/metaal/Modern/Kwai%20met%20boog%20.jpg"
      }, {
        naam: "Kwai met boog",
        foto: "media/metaal/Modern/Kwai%20met%20boog.jpg"
      }, {
        naam: "Kwai perfo",
        foto: "media/metaal/Modern/Kwai%20perfo%20%20%20%20%20%20%20%20%20%20.jpg"
      }, {
        naam: "Kwai perfo",
        foto: "media/metaal/Modern/Kwai%20perfo%20%20%20%20%20%20%20%20.jpg"
      }, {
        naam: "Kwai perfo",
        foto: "media/metaal/Modern/Kwai%20perfo%20%20%20%20%20%20%20.jpg"
      }, {
        naam: "Kwai perfo",
        foto: "media/metaal/Modern/Kwai%20perfo%20%20%20%20%20%20.jpg"
      }, {
        naam: "Kwai perfo",
        foto: "media/metaal/Modern/Kwai%20perfo%20%20%20%20%20.jpg"
      }, {
        naam: "Kwai perfo",
        foto: "media/metaal/Modern/Kwai%20perfo%20%20%20%20.jpg"
      }, {
        naam: "Kwai perfo",
        foto: "media/metaal/Modern/Kwai%20perfo%20%20%20.jpg"
      }, {
        naam: "Kwai perfo",
        foto: "media/metaal/Modern/Kwai%20perfo%20.jpg"
      }, {
        naam: "Kwai perfo",
        foto: "media/metaal/Modern/Kwai%20perfo.%20.jpg"
      }, {
        naam: "Kwai perfo",
        foto: "media/metaal/Modern/Kwai%20perfo.jpg"
      }, {
        naam: "Kwai plane",
        foto: "media/metaal/Modern/Kwai%20plane%20%20%20%20.jpg"
      }, {
        naam: "Kwai plane",
        foto: "media/metaal/Modern/Kwai%20plane%20%20%20.jpg"
      }, {
        naam: "Kwai plane",
        foto: "media/metaal/Modern/Kwai%20plane%20.jpg"
      }, {
        naam: "Kwai plane",
        foto: "media/metaal/Modern/Kwai%20plane.%20.jpg"
      }, {
        naam: "Kwai plane",
        foto: "media/metaal/Modern/Kwai%20plane.jpg"
      }, {
        naam: "Kwai plane ligna",
        foto: "media/metaal/Modern/Kwai%20plane%20ligna%20%20%20%20.jpg"
      }, {
        naam: "Kwai plane ligna",
        foto: "media/metaal/Modern/Kwai%20plane%20ligna%20%20%20.jpg"
      }, {
        naam: "Kwai plane ligna",
        foto: "media/metaal/Modern/Kwai%20plane%20ligna%20%20.jpg"
      }, {
        naam: "Kwai plane ligna",
        foto: "media/metaal/Modern/Kwai%20plane%20ligna%20.jpg"
      }, {
        naam: "Kwai plane ligna",
        foto: "media/metaal/Modern/Kwai%20plane%20ligna.jpg"
      }, {
        naam: "Kwai vlak",
        foto: "media/metaal/Modern/Kwai%20vlak.jpg"
      }, {
        naam: "Kwai volle plaat",
        foto: "media/metaal/Modern/Kwai%20volle%20plaat.jpg"
      }, {
        naam: "Kwai volle plaat combi perfo",
        foto: "media/metaal/Modern/Kwai%20volle%20plaat%20combi%20perfo.jpg"
      }, {
        naam: "Notec",
        foto: "media/metaal/Modern/Notec.jpg"
      }, {
        naam: "Po",
        foto: "media/metaal/Modern/Po.jpg"
      }, {
        naam: "Puntpoort",
        foto: "media/metaal/Modern/Puntpoort%20%20.jpg"
      }, {
        naam: "Puntpoort",
        foto: "media/metaal/Modern/Puntpoort%20.jpg"
      }, {
        naam: "Puntpoort",
        foto: "media/metaal/Modern/Puntpoort.jpg"
      }, {
        naam: "Robson met plaat",
        foto: "media/metaal/Modern/Robson%20met%20plaat.jpg"
      }, {
        naam: "Spijlenpoort",
        foto: "media/metaal/Modern/Spijlenpoort%20%20%20%20%20%20.jpg"
      }, {
        naam: "Spijlenpoort",
        foto: "media/metaal/Modern/Spijlenpoort%20%20%20%20%20.jpg"
      }, {
        naam: "Spijlenpoort",
        foto: "media/metaal/Modern/Spijlenpoort%20%20%20%20.jpg"
      }, {
        naam: "Spijlenpoort",
        foto: "media/metaal/Modern/Spijlenpoort%20%20%20.jpg"
      }, {
        naam: "Spijlenpoort",
        foto: "media/metaal/Modern/Spijlenpoort%20%20.jpg"
      }, {
        naam: "Spijlenpoort",
        foto: "media/metaal/Modern/Spijlenpoort%20.jpg"
      }, {
        naam: "Spijlenpoort",
        foto: "media/metaal/Modern/Spijlenpoort.jpg"
      }, {
        naam: "Talisker",
        foto: "media/metaal/Modern/Talisker%20.jpg"
      }, {
        naam: "Talisker",
        foto: "media/metaal/Modern/Talisker.jpg"
      }, {
        naam: "Tigris",
        foto: "media/metaal/Modern/Tigris%20%20%20%20%20%20%20.jpg"
      }, {
        naam: "Tigris",
        foto: "media/metaal/Modern/Tigris%20%20%20%20%20%20.jpg"
      }, {
        naam: "Tigris",
        foto: "media/metaal/Modern/Tigris%20%20%20%20%20.jpg"
      }, {
        naam: "Tigris",
        foto: "media/metaal/Modern/Tigris%20%20%20%20.jpg"
      }, {
        naam: "Tigris",
        foto: "media/metaal/Modern/Tigris%20%20%20.jpg"
      }, {
        naam: "Tigris",
        foto: "media/metaal/Modern/Tigris%20%20.jpg"
      }, {
        naam: "Tigris",
        foto: "media/metaal/Modern/Tigris%20.jpg"
      }, {
        naam: "Tigris",
        foto: "media/metaal/Modern/Tigris.jpg"
      }]
    }, {
      tab: "Klassiek zonder sierpunten",
      types: [{
        naam: "Mississipi",
        foto: "media/metaal/Klassiek%20zonder%20punten/Mississipi%20.jpg"
      }, {
        naam: "Mississipi",
        foto: "media/metaal/Klassiek%20zonder%20punten/Mississipi.jpg"
      }, {
        naam: "Siret",
        foto: "media/metaal/Klassiek%20zonder%20punten/Siret.jpg"
      }, {
        naam: "Taag",
        foto: "media/metaal/Klassiek%20zonder%20punten/Taag%20.jpg"
      }, {
        naam: "Taag",
        foto: "media/metaal/Klassiek%20zonder%20punten/Taag.jpg"
      }, {
        naam: "Taag met plaat",
        foto: "media/metaal/Klassiek%20zonder%20punten/Taag%20met%20plaat.jpg"
      }, {
        naam: "Veluwe",
        foto: "media/metaal/Klassiek%20zonder%20punten/Veluwe%20.jpg"
      }, {
        naam: "Veluwe",
        foto: "media/metaal/Klassiek%20zonder%20punten/Veluwe.%20.jpg"
      }, {
        naam: "Veluwe",
        foto: "media/metaal/Klassiek%20zonder%20punten/Veluwe.jpg"
      }, {
        naam: "Veluwe dubbele cirkel",
        foto: "media/metaal/Klassiek%20zonder%20punten/Veluwe%20dubbele%20cirkel.jpg"
      }, {
        naam: "Veluwe recht met plaat",
        foto: "media/metaal/Klassiek%20zonder%20punten/Veluwe%20recht%20met%20plaat.jpg"
      }, {
        naam: "Veluwe ronde boog met plaat",
        foto: "media/metaal/Klassiek%20zonder%20punten/Veluwe%20ronde%20boog%20met%20plaat.jpg"
      }]
    }, {
      tab: "Klassiek met sierpunten",
      types: [{
        naam: "Amstel",
        foto: "media/metaal/Klassiek%20met%20punten/Amstel.jpg"
      }, {
        naam: "Argesj",
        foto: "media/metaal/Klassiek%20met%20punten/Argesj.jpg"
      }, {
        naam: "Aveyron",
        foto: "media/metaal/Klassiek%20met%20punten/Aveyron.jpg"
      }, {
        naam: "Beekvliet",
        foto: "media/metaal/Klassiek%20met%20punten/Beekvliet%20.jpg"
      }, {
        naam: "Beekvliet",
        foto: "media/metaal/Klassiek%20met%20punten/Beekvliet.%20.jpg"
      }, {
        naam: "Beekvliet",
        foto: "media/metaal/Klassiek%20met%20punten/Beekvliet.jpg"
      }, {
        naam: "Beekvliet met plaat",
        foto: "media/metaal/Klassiek%20met%20punten/Beekvliet%20met%20plaat.jpg"
      }, {
        naam: "Brenta",
        foto: "media/metaal/Klassiek%20met%20punten/Brenta%20%20.jpg"
      }, {
        naam: "Brenta",
        foto: "media/metaal/Klassiek%20met%20punten/Brenta%20.jpg"
      }, {
        naam: "Brenta",
        foto: "media/metaal/Klassiek%20met%20punten/Brenta.jpg"
      }, {
        naam: "Brenta met plaat",
        foto: "media/metaal/Klassiek%20met%20punten/Brenta%20met%20plaat.jpg"
      }, {
        naam: "Cumberland",
        foto: "media/metaal/Klassiek%20met%20punten/Cumberland%20.jpg"
      }, {
        naam: "Cumberland",
        foto: "media/metaal/Klassiek%20met%20punten/Cumberland.%20%20%20.jpg"
      }, {
        naam: "Cumberland",
        foto: "media/metaal/Klassiek%20met%20punten/Cumberland.%20%20.jpg"
      }, {
        naam: "Cumberland",
        foto: "media/metaal/Klassiek%20met%20punten/Cumberland.%20.jpg"
      }, {
        naam: "Cumberland",
        foto: "media/metaal/Klassiek%20met%20punten/Cumberland.jpg"
      }, {
        naam: "Cumberland met plaat",
        foto: "media/metaal/Klassiek%20met%20punten/Cumberland%20met%20plaat%20.jpg"
      }, {
        naam: "Cumberland met plaat",
        foto: "media/metaal/Klassiek%20met%20punten/Cumberland%20met%20plaat.jpg"
      }, {
        naam: "Esla",
        foto: "media/metaal/Klassiek%20met%20punten/Esla%20%20.jpg"
      }, {
        naam: "Esla",
        foto: "media/metaal/Klassiek%20met%20punten/Esla%20.jpg"
      }, {
        naam: "Esla",
        foto: "media/metaal/Klassiek%20met%20punten/Esla.jpg"
      }, {
        naam: "Esla met plaat",
        foto: "media/metaal/Klassiek%20met%20punten/Esla%20met%20plaat.jpg"
      }, {
        naam: "Esla special",
        foto: "media/metaal/Klassiek%20met%20punten/Esla%20special.jpg"
      }, {
        naam: "Lake ontario",
        foto: "media/metaal/Klassiek%20met%20punten/Lake%20ontario.jpg"
      }, {
        naam: "Manitoba",
        foto: "media/metaal/Klassiek%20met%20punten/Manitoba%20.jpg"
      }, {
        naam: "Manitoba",
        foto: "media/metaal/Klassiek%20met%20punten/Manitoba.jpg"
      }, {
        naam: "Oosterschelde",
        foto: "media/metaal/Klassiek%20met%20punten/Oosterschelde%20.jpg"
      }, {
        naam: "Oosterschelde",
        foto: "media/metaal/Klassiek%20met%20punten/Oosterschelde.jpg"
      }, {
        naam: "Oosterschelde met plaat",
        foto: "media/metaal/Klassiek%20met%20punten/Oosterschelde%20met%20plaat.jpg"
      }, {
        naam: "Rhone",
        foto: "media/metaal/Klassiek%20met%20punten/Rhone.jpg"
      }, {
        naam: "Roer",
        foto: "media/metaal/Klassiek%20met%20punten/Roer.jpg"
      }, {
        naam: "Sado",
        foto: "media/metaal/Klassiek%20met%20punten/Sado.jpg"
      }, {
        naam: "Siret",
        foto: "media/metaal/Klassiek%20met%20punten/Siret.jpg"
      }, {
        naam: "Vienne",
        foto: "media/metaal/Klassiek%20met%20punten/Vienne%20.jpg"
      }, {
        naam: "Vienne",
        foto: "media/metaal/Klassiek%20met%20punten/Vienne.jpg"
      }, {
        naam: "Westerschelde",
        foto: "media/metaal/Klassiek%20met%20punten/Westerschelde.jpg"
      }, {
        naam: "Yellowstone",
        foto: "media/metaal/Klassiek%20met%20punten/Yellowstone.jpg"
      }, {
        naam: "Yukon",
        foto: "media/metaal/Klassiek%20met%20punten/Yukon.jpg"
      }]
    }, {
      tab: "Art Deco",
      types: [{
        naam: "Apollo",
        foto: "media/metaal/Art%20Deco/Apollo.jpg"
      }, {
        naam: "Loch Lomond",
        foto: "media/metaal/Art%20Deco/Loch%20Lomond%20%20%20%20.jpg"
      }, {
        naam: "Loch Lomond",
        foto: "media/metaal/Art%20Deco/Loch%20Lomond%20%20.jpg"
      }, {
        naam: "Loch Lomond",
        foto: "media/metaal/Art%20Deco/Loch%20Lomond%20.jpg"
      }, {
        naam: "Loch Lomond",
        foto: "media/metaal/Art%20Deco/Loch%20Lomond.jpg"
      }, {
        naam: "Tweed",
        foto: "media/metaal/Art%20Deco/Tweed%20%20%20%20%20.jpg"
      }, {
        naam: "Tweed",
        foto: "media/metaal/Art%20Deco/Tweed%20%20%20%20.jpg"
      }, {
        naam: "Tweed",
        foto: "media/metaal/Art%20Deco/Tweed%20%20.jpg"
      }, {
        naam: "Tweed",
        foto: "media/metaal/Art%20Deco/Tweed%20.jpg"
      }, {
        naam: "Tweed",
        foto: "media/metaal/Art%20Deco/Tweed.jpg"
      }, {
        naam: "Vleet",
        foto: "media/metaal/Art%20Deco/Vleet%20.jpg"
      }, {
        naam: "Vleet",
        foto: "media/metaal/Art%20Deco/Vleet.jpg"
      }]
    }, {
      tab: "Cottage",
      types: [{
        naam: '',
        foto: ''
      }]
    }, {
      tab: "Uniek",
      types: [{
        naam: '',
        foto: ''
      }]
    }],
    producten: [{
      titel: 'Strak en modern',
      tekst: 'Gesloten of halfopen poorten met rustige, horizontale lijnen.',
      beeld: 'media/aluminium-poort.jpg'
    }, {
      titel: 'Klassiek sierwerk',
      tekst: 'Verticale spijlen en verfijnde details voor een tijdloze look.',
      beeld: 'media/realisatie-metaal-2.jpeg'
    }, {
      titel: 'Volledig gepersonaliseerd',
      tekst: 'Een uniek ontwerp, van patroon tot afwerking, helemaal naar uw wens.',
      beeld: 'media/stalen-poort.jpg'
    }],
    realisaties: {
      filters: ['Alle', 'Modern', 'Klassiek', 'Metaal'],
      items: [{
        beeld: 'media/realisatie-metaal-1.jpeg',
        type: 'Schuifpoort in staal',
        plaats: 'Mechelen',
        tags: ['Modern', 'Metaal'],
        ratio: '4 / 3'
      }, {
        beeld: 'media/realisatie-metaal-2.jpeg',
        type: 'Klassieke sierpoort',
        plaats: 'Bonheiden',
        tags: ['Klassiek', 'Metaal'],
        ratio: '3 / 4'
      }, {
        beeld: 'media/aluminium-poort.jpg',
        type: 'Aluminium latwerk',
        plaats: 'Kontich',
        tags: ['Modern', 'Metaal'],
        ratio: '1 / 1'
      }, {
        beeld: 'media/stalen-poort.jpg',
        type: 'Strakke staalpoort',
        plaats: 'Duffel',
        tags: ['Modern', 'Metaal'],
        ratio: '4 / 3'
      }, {
        beeld: 'media/realisatie-alu-1.jpeg',
        type: 'Aluminium draaipoort',
        plaats: 'Lier',
        tags: ['Modern', 'Metaal'],
        ratio: '4 / 3'
      }, {
        beeld: 'media/realisatie-metaal-1.jpeg',
        type: 'Poort met automatisering',
        plaats: 'Sint-Katelijne-Waver',
        tags: ['Modern', 'Metaal'],
        ratio: '3 / 4'
      }]
    },
    kwaliteit: {
      titel: 'Beschermd tegen roest en weer',
      beeld: 'media/stalen-poort.jpg',
      intro: 'Elke metalen poort krijgt een meerlaagse bescherming, zodat ze jarenlang mooi en sterk blijft, ook in weer en wind.',
      kenmerken: [{
        titel: 'Warm verzinkt',
        tekst: 'Een zinklaag beschermt het staal grondig tegen roest.'
      }, {
        titel: 'Gemetalliseerd',
        tekst: 'Een extra hechtlaag voor een duurzame afwerking.'
      }, {
        titel: 'Hoogwaardige poederlak',
        tekst: 'Een strak en slijtvast kleuroppervlak naar keuze.'
      }, {
        titel: 'Weerbestendig',
        tekst: 'Bestand tegen zon, regen en temperatuurschommelingen.'
      }]
    },
    testimonial: {
      quote: 'Onze stalen schuifpoort is strak, stevig en werkt na jaren nog perfect. Van advies tot plaatsing verliep alles verzorgd.',
      naam: 'Familie D.',
      gemeente: 'Mechelen',
      project: 'Schuifpoort in staal',
      beeld: 'media/realisatie-metaal-2.jpeg'
    },
    faq: [{
      q: 'Wat kost een metalen poort op maat?',
      a: 'De prijs hangt af van de afmetingen, het model, de afwerking en eventuele automatisering. Na een opmeting krijgt u een duidelijke offerte zonder verrassingen.'
    }, {
      q: 'Roest een metalen poort niet na verloop van tijd?',
      a: 'Dankzij het warm verzinken, metalliseren en poederlakken is uw poort grondig beschermd tegen roest en weersinvloeden.'
    }, {
      q: 'Welke poort past bij een korte oprit?',
      a: 'Bij een korte of hellende oprit is een schuifpoort vaak de beste keuze, omdat ze zijdelings opent en geen zwenkruimte nodig heeft.'
    }, {
      q: 'Kan een metalen poort geautomatiseerd worden?',
      a: 'Ja, zowel nieuwe als bestaande metalen poorten kunnen wij automatiseren met betrouwbare FAAC aandrijvingen.'
    }, {
      q: 'Hoe onderhoud ik een metalen poort?',
      a: 'Een metalen poort vraagt weinig onderhoud. Af en toe reinigen en een jaarlijks nazicht van de automatisering volstaan meestal.'
    }, {
      q: 'Is de opmeting inbegrepen?',
      a: 'Ja, wij komen steeds ter plaatse voor advies en een nauwkeurige opmeting voor we een poort maken.'
    }]
  },
  houten: {
    title: 'Houten poorten op maat | Poortland Mechelen',
    eyebrow: 'Houten poorten',
    h1: 'Houten poorten op maat',
    introKort: 'Warm, natuurlijk en vol karakter. Poortland maakt houten poorten in duurzame hardhoutsoorten, volledig op maat en met oog voor detail.',
    heroBeeld: 'media/hero.jpg',
    heroLabel: 'Natuurlijk maatwerk',
    materiaalFotos: ['media/houten-poort.jpg', 'media/realisatie-hout-1.jpeg', 'media/staal-hout.jpg', 'media/realisatie-hout-2.jpeg', 'media/hero.jpg'],
    productenTitel: 'Modellen in hout',
    producten: [{
      titel: 'Tijdloos massief hout',
      tekst: 'Volle houten panelen met een warme, natuurlijke uitstraling.',
      beeld: 'media/houten-poort.jpg'
    }, {
      titel: 'Modern horizontaal latwerk',
      tekst: 'Strakke, horizontale latten voor een eigentijdse look.',
      beeld: 'media/staal-hout.jpg'
    }, {
      titel: 'Landelijk en klassiek',
      tekst: 'Klassieke modellen die passen bij een landelijke woning.',
      beeld: 'media/realisatie-hout-2.jpeg'
    }],
    realisaties: {
      filters: ['Alle', 'Modern', 'Klassiek', 'Hout'],
      items: [{
        beeld: 'media/hero.jpg',
        type: 'Houten draaipoort',
        plaats: 'Bonheiden',
        tags: ['Klassiek', 'Hout'],
        ratio: '4 / 3'
      }, {
        beeld: 'media/realisatie-hout-1.jpeg',
        type: 'Modern latwerk',
        plaats: 'Mechelen',
        tags: ['Modern', 'Hout'],
        ratio: '3 / 4'
      }, {
        beeld: 'media/houten-poort.jpg',
        type: 'Massief houten poort',
        plaats: 'Keerbergen',
        tags: ['Klassiek', 'Hout'],
        ratio: '1 / 1'
      }, {
        beeld: 'media/staal-hout.jpg',
        type: 'Horizontaal latwerk',
        plaats: 'Duffel',
        tags: ['Modern', 'Hout'],
        ratio: '4 / 3'
      }, {
        beeld: 'media/realisatie-hout-2.jpeg',
        type: 'Landelijke poort',
        plaats: 'Putte',
        tags: ['Klassiek', 'Hout'],
        ratio: '4 / 3'
      }, {
        beeld: 'media/realisatie-hout-1.jpeg',
        type: 'Houten poort met detail',
        plaats: 'Lier',
        tags: ['Modern', 'Hout'],
        ratio: '3 / 4'
      }]
    },
    kwaliteit: {
      titel: 'Hout dat mooi veroudert',
      beeld: 'media/staal-hout.jpg',
      intro: 'Wij werken met zorgvuldig geselecteerde hardhoutsoorten die gemaakt zijn voor buitengebruik en jarenlang meegaan.',
      kenmerken: [{
        titel: 'Duurzame houtsoorten',
        tekst: 'Padouk en Iroko, gekend om hun stabiliteit en lange levensduur.'
      }, {
        titel: 'Behandeld voor buiten',
        tekst: 'Een verzorgde afwerking beschermt tegen vocht en zon.'
      }, {
        titel: 'Natuurlijke veroudering',
        tekst: 'Hout leeft en krijgt met de jaren een mooi karakter.'
      }, {
        titel: 'Stevige constructie',
        tekst: 'Massieve verbindingen zorgen voor een stabiele poort.'
      }]
    },
    testimonial: {
      quote: 'De houten poort geeft ons huis meteen warmte en karakter. Het advies over de houtsoort was echt deskundig.',
      naam: 'Familie V.',
      gemeente: 'Keerbergen',
      project: 'Houten draaipoort',
      beeld: 'media/realisatie-hout-1.jpeg'
    },
    faq: [{
      q: 'Wat kost een houten poort op maat?',
      a: 'De prijs hangt af van de houtsoort, het model, de afmetingen en eventuele automatisering. Na een opmeting krijgt u een heldere offerte.'
    }, {
      q: 'Welke houtsoorten gebruikt Poortland?',
      a: 'Wij werken vooral met Padouk en Iroko, hardhoutsoorten die bekend staan om hun stabiliteit en lange levensduur buiten.'
    }, {
      q: 'Hoeveel onderhoud vraagt een houten poort?',
      a: 'Hout leeft en verkleurt natuurlijk. Met een periodieke behandeling blijft de poort mooi. Ook zonder blijft ze stevig en functioneel.'
    }, {
      q: 'Kan een houten poort geautomatiseerd worden?',
      a: 'Ja, wij automatiseren houten draaipoorten en schuifpoorten met een aandrijving die past bij het gewicht en het gebruik.'
    }, {
      q: 'Verkleurt het hout na verloop van tijd?',
      a: 'Onbehandeld hout krijgt een natuurlijke, grijzere tint. Wenst u de originele kleur te behouden, dan adviseren wij een regelmatige behandeling.'
    }, {
      q: 'Is de opmeting inbegrepen?',
      a: 'Ja, wij komen steeds ter plaatse voor advies en een nauwkeurige opmeting.'
    }]
  },
  combinatie: {
    title: 'Poorten in hout en metaal op maat | Poortland',
    eyebrow: 'Combinatie hout en metaal',
    h1: 'Poorten in hout en metaal',
    introKort: 'De sterkte van metaal met de warmte van hout. Poortland maakt exclusieve combinatiepoorten waarin beide materialen perfect samenkomen.',
    heroBeeld: 'media/staal-hout.jpg',
    heroLabel: 'Hout en metaal op maat',
    materiaalFotos: ['media/staal-hout.jpg', 'media/hero.jpg', 'media/realisatie-hout-1.jpeg', 'media/stalen-poort.jpg', 'media/realisatie-metaal-1.jpeg'],
    productenTitel: 'Combinaties in hout en metaal',
    producten: [{
      titel: 'Warmte van hout',
      tekst: 'Houten panelen die het geheel een natuurlijke uitstraling geven.',
      beeld: 'media/staal-hout.jpg'
    }, {
      titel: 'Sterkte van metaal',
      tekst: 'Een stevige metalen structuur als betrouwbare basis.',
      beeld: 'media/stalen-poort.jpg'
    }, {
      titel: 'Unieke combinaties',
      tekst: 'Hout ingewerkt in een metalen kader, volledig op maat.',
      beeld: 'media/hero.jpg'
    }],
    realisaties: {
      filters: ['Alle', 'Modern', 'Hout', 'Metaal'],
      items: [{
        beeld: 'media/staal-hout.jpg',
        type: 'Hout in metalen kader',
        plaats: 'Mechelen',
        tags: ['Modern', 'Hout', 'Metaal'],
        ratio: '4 / 3'
      }, {
        beeld: 'media/hero.jpg',
        type: 'Combinatiepoort',
        plaats: 'Bonheiden',
        tags: ['Modern', 'Hout'],
        ratio: '3 / 4'
      }, {
        beeld: 'media/realisatie-hout-1.jpeg',
        type: 'Houten invulling',
        plaats: 'Lier',
        tags: ['Modern', 'Hout'],
        ratio: '1 / 1'
      }, {
        beeld: 'media/realisatie-metaal-1.jpeg',
        type: 'Metalen structuur',
        plaats: 'Duffel',
        tags: ['Modern', 'Metaal'],
        ratio: '4 / 3'
      }, {
        beeld: 'media/stalen-poort.jpg',
        type: 'Strak met houtaccent',
        plaats: 'Kontich',
        tags: ['Modern', 'Metaal'],
        ratio: '4 / 3'
      }, {
        beeld: 'media/realisatie-hout-2.jpeg',
        type: 'Warm en strak',
        plaats: 'Putte',
        tags: ['Modern', 'Hout'],
        ratio: '3 / 4'
      }]
    },
    kwaliteit: {
      titel: 'Twee materialen, een geheel',
      beeld: 'media/staal-hout.jpg',
      intro: 'Een combinatiepoort verenigt het beste van twee werelden. Wij stemmen structuur, hout en afwerking zorgvuldig op elkaar af.',
      kenmerken: [{
        titel: 'Stabiele draagstructuur',
        tekst: 'Een metalen frame zorgt voor kracht en stabiliteit.'
      }, {
        titel: 'Warme uitstraling',
        tekst: 'Houten panelen geven een natuurlijke, warme look.'
      }, {
        titel: 'Duurzame verbindingen',
        tekst: 'Hout en metaal worden solide en verzorgd verbonden.'
      }, {
        titel: 'Afgestemd op onderhoud',
        tekst: 'Materiaalkeuze op maat van gebruik en onderhoud.'
      }]
    },
    testimonial: {
      quote: 'De combinatie van hout en metaal maakt onze poort echt uniek. Precies wat we voor ogen hadden, tot in het detail.',
      naam: 'Familie S.',
      gemeente: 'Bonheiden',
      project: 'Combinatiepoort hout en metaal',
      beeld: 'media/realisatie-hout-1.jpeg'
    },
    faq: [{
      q: 'Wat kost een combinatiepoort in hout en metaal?',
      a: 'De prijs hangt af van de structuur, de houtsoort, de afmetingen en eventuele automatisering. Na een opmeting krijgt u een duidelijke offerte.'
    }, {
      q: 'Waarom hout en metaal combineren?',
      a: 'Zo krijgt u de kracht en stabiliteit van metaal met de warmte en uitstraling van hout, in een poort die volledig op maat is.'
    }, {
      q: 'Zit het hout op of in de structuur?',
      a: 'Beide zijn mogelijk. U kiest voor houten panelen op een metalen frame of voor hout dat in de structuur is verwerkt.'
    }, {
      q: 'Kan een combinatiepoort geautomatiseerd worden?',
      a: 'Ja, wij automatiseren combinatiepoorten met een aandrijving die past bij het gewicht en het gebruik.'
    }, {
      q: 'Hoe onderhoud ik een combinatiepoort?',
      a: 'Het metaal vraagt weinig onderhoud, het hout mag u periodiek behandelen om de kleur te behouden. Een jaarlijks nazicht houdt alles soepel.'
    }, {
      q: 'Is de opmeting inbegrepen?',
      a: 'Ja, wij komen steeds ter plaatse voor advies en een nauwkeurige opmeting.'
    }]
  }
};

/* ---- Over ons pagina ---- */
function Teller({
  eind,
  suffix,
  plat
}) {
  const [w, setW] = React.useState(0);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') {
      setW(eind);
      return;
    }
    var gedaan = false;
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !gedaan) {
          gedaan = true;
          var start = null;
          var stap = function (nu) {
            if (start === null) start = nu;
            var t = Math.min(1, (nu - start) / 1500);
            setW(Math.round(eind * (1 - Math.pow(1 - t, 3))));
            if (t < 1) requestAnimationFrame(stap);
          };
          requestAnimationFrame(stap);
        }
      });
    }, {
      threshold: 0.4
    });
    io.observe(el);
    return function () {
      io.disconnect();
    };
  }, [eind]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref
  }, (plat ? String(w) : w.toLocaleString('nl-BE')) + (suffix || ''));
}

/* ---- Overkappingen (eigen pagina in de huisstijl van de site) ---- */
function OverkappingenNL({
  onNav
}) {
  const sectieRef = React.useRef(null);
  React.useEffect(() => {
    document.title = 'Overkappingen op maat | Poortland Mechelen';
    if (window.scrollTo) window.scrollTo(0, 0);
  }, []);
  const offerte = () => window.dispatchEvent(new CustomEvent('pl-offerte-open'));
  const naarSecties = () => {
    if (sectieRef.current) sectieRef.current.scrollIntoView({
      behavior: 'smooth'
    });
  };
  const secties = [{
    eyebrow: 'Comfort',
    label: 'Terrasoverkapping',
    h2: 'Een buitenruimte die u vaker gebruikt',
    beeld: 'media/overkappingen/overkapping-2.jpg',
    alinea: ['Een overkapping beschut uw terras tegen regen en felle zon. Zo hoeft een onverwachte bui uw plannen niet te onderbreken en wordt uw buitenruimte een volwaardig verlengstuk van uw woning.', 'Van een compacte terrasoverkapping tot een ruime, vrijstaande constructie: iedere oplossing wordt op maat samengesteld.']
  }, {
    eyebrow: 'Op maat',
    label: 'Afgestemd op de woning',
    h2: 'Ontworpen voor uw woning',
    beeld: 'media/overkappingen/overkapping-6.jpg',
    alinea: ['Een overkapping moet niet alleen praktisch zijn. Ze moet ook passen bij de architectuur van uw woning en de inrichting van uw tuin.', 'Daarom kunt u kiezen uit verschillende modellen, kleuren en afwerkingen. Een strak aluminium ontwerp sluit mooi aan bij zowel moderne woningen als gerenoveerde gevels. Afhankelijk van het gekozen systeem is een uitvoering als aanbouw of als vrijstaande overkapping mogelijk.', 'Sommige modellen kunnen met slechts twee staanders een breedte tot zeven meter overspannen. Zo blijft het uitzicht open en krijgt u maximale bewegingsruimte onder de overkapping.']
  }, {
    eyebrow: 'Licht en beschutting',
    label: 'Glas of polycarbonaat',
    h2: 'Licht, beschutting en comfort op maat',
    beeld: 'media/overkappingen/overkapping-4.jpg',
    alinea: ['De dakbedekking bepaalt in grote mate de uitstraling en de lichtinval. Naargelang het model en uw voorkeur kan de overkapping worden uitgevoerd met polycarbonaat of glas.', 'Wilt u meer beschutting? Dan kan de constructie verder worden aangevuld met onder meer:'],
    lijst: ['glazen schuifwanden', 'aluminium of polycarbonaat zijwanden', 'zijwanden in steellook', 'geïntegreerde zipscreens', 'ingebouwde ledverlichting'],
    slot: 'Met beweegbare glazen wanden opent of sluit u de ruimte volgens het weer. Zo verandert uw terras in enkele ogenblikken van een open buitenruimte in een beschutte tuinkamer.'
  }, {
    eyebrow: 'Afwerking',
    label: 'Verzorgd detail',
    h2: 'Afgewerkt tot in de details',
    beeld: 'media/overkappingen/overkapping-5.jpg',
    alinea: ['De aluminium profielen combineren een strakke vormgeving met een verzorgde technische afwerking. De hemelwaterafvoer wordt in de staanders geïntegreerd, zodat regenwater discreet wordt afgevoerd.', 'Ook de bevestigingen worden zo veel mogelijk aan het zicht onttrokken. Dat zorgt voor een rustige, hoogwaardige uitstraling zonder storende montageschroeven.', 'Voor extra sfeer en comfort kan ledverlichting in de constructie worden geïntegreerd. Zo blijft uw terras ook na zonsondergang een aangename plek om samen te zitten.']
  }];
  const traject = ['Een goede overkapping begint met de juiste keuzes. Hoe groot mag de constructie worden? Welke dakbedekking past bij de gewenste lichtinval? Is een open terras voldoende, of wilt u ook bescherming tegen wind?', 'Poortland bekijkt samen met u de mogelijkheden, meet de situatie nauwkeurig op en werkt een voorstel uit dat past bij uw woning en budget. Vervolgens zorgt ons eigen team voor een zorgvuldige plaatsing en een nette oplevering.'];
  const keuzes = [['Aanbouw of vrijstaand', 'Laat de overkapping aansluiten op uw gevel of kies voor een vrijstaande constructie elders in de tuin.'], ['Glas of polycarbonaat', 'Kies de dakbedekking op basis van de gewenste uitstraling, lichtinval en het gekozen model.'], ['Open of afsluitbaar', 'Voeg glazen schuifwanden, zijwanden of screens toe voor meer beschutting, privacy en comfort.'], ['Verlichting', "Geïntegreerde ledstrips of inbouwspots zorgen 's avonds voor functioneel en sfeervol licht."]];
  const alinea = (t, i, donker) => /*#__PURE__*/React.createElement("p", {
    key: i,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16.5,
      lineHeight: 1.72,
      color: donker ? 'var(--stone-300)' : 'var(--text-body)',
      margin: i ? '14px 0 0' : 0
    }
  }, t);
  const fotoBlok = (src, label) => /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 8,
      overflow: 'hidden',
      aspectRatio: '4 / 3',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: label,
    loading: "lazy",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 16,
      bottom: 16,
      background: 'rgba(251,248,241,0.94)',
      borderRadius: 999,
      padding: '8px 15px',
      fontFamily: 'var(--font-label)',
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--text-heading)'
    }
  }, label));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '84px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pl-split",
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.02fr 0.98fr',
      gap: 60,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SEyebrow, {
    dark: true,
    style: {
      marginBottom: 20
    }
  }, "Aluminium overkappingen"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 62,
      lineHeight: 1.03,
      letterSpacing: '-0.01em',
      color: 'var(--stone-100)',
      margin: 0
    }
  }, "Meer buitenleven, in elk seizoen"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 18.5,
      lineHeight: 1.6,
      color: 'var(--stone-300)',
      maxWidth: '46ch',
      margin: '24px 0 32px'
    }
  }, "Met een aluminium overkapping geniet u langer van uw terras. Poortland stemt het ontwerp, de afmetingen en de afwerking zorgvuldig af op uw woning en uw manier van leven."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(SButton, {
    variant: "primary",
    arrow: true,
    onClick: () => window.dispatchEvent(new CustomEvent('pl-offerte-open'))
  }, "Vraag een offerte aan"), /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    dark: true,
    arrow: true,
    onClick: () => onNav('contact')
  }, "Plan een adviesgesprek")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 26,
      flexWrap: 'wrap',
      marginTop: 30
    }
  }, ['Aluminium maatwerk', 'Eigen plaatsing', 'Advies en opmeting'].map(t => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)',
      fontSize: 15
    }
  }, "✓"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--stone-200)'
    }
  }, t))))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 8,
      overflow: 'hidden',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "media/overkappingen/overkapping-1.jpg",
    alt: "Aluminium terrasoverkapping op maat",
    style: {
      width: '100%',
      height: 'auto',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 16,
      bottom: 16,
      background: 'rgba(251,248,241,0.94)',
      borderRadius: 999,
      padding: '8px 15px',
      fontFamily: 'var(--font-label)',
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--text-heading)'
    }
  }, "Terrasoverkapping op maat"))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper-2)',
      borderTop: '1px solid var(--line-on-light-soft)',
      borderBottom: '1px solid var(--line-on-light-soft)',
      padding: '40px 44px'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'center',
      gap: 56,
      flexWrap: 'wrap'
    }
  }, [[1999, 'Poortland sinds', '', true], [250, 'Tevreden Poortland klanten', '+', false], [100, 'Op maat gemaakt', '%', false]].map(([n, l, suf, plat]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      textAlign: 'center',
      minWidth: 150
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 40,
      color: 'var(--accent)',
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement(Teller, {
    eind: n,
    suffix: suf,
    plat: plat
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 10.5,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginTop: 10
    }
  }, l)))))), /*#__PURE__*/React.createElement("div", {
    ref: sectieRef
  }, secties.map((s, i) => {
    const donker = i % 2 === 1;
    const tekst = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SEyebrow, {
      dark: donker,
      style: {
        marginBottom: 14
      }
    }, s.eyebrow), /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 500,
        fontSize: 36,
        lineHeight: 1.1,
        letterSpacing: '-0.01em',
        color: donker ? 'var(--stone-100)' : 'var(--text-heading)',
        margin: '0 0 16px'
      }
    }, s.h2), s.alinea.map((t, j) => alinea(t, j, donker)), s.lijst && /*#__PURE__*/React.createElement("ul", {
      style: {
        margin: '16px 0 0',
        padding: 0,
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 9
      }
    }, s.lijst.map(li => /*#__PURE__*/React.createElement("li", {
      key: li,
      style: {
        display: 'flex',
        gap: 12,
        alignItems: 'baseline',
        fontFamily: 'var(--font-sans)',
        fontSize: 16,
        lineHeight: 1.5,
        color: donker ? 'var(--stone-300)' : 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--accent)',
        flex: '0 0 auto'
      }
    }, "—"), /*#__PURE__*/React.createElement("span", null, li)))), s.slot && alinea(s.slot, 1, donker));
    return /*#__PURE__*/React.createElement("section", {
      key: i,
      style: {
        background: donker ? 'var(--forest-900)' : 'var(--surface-paper)',
        padding: '90px 44px'
      }
    }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
      className: "pl-split",
      style: {
        maxWidth: 1220,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 56,
        alignItems: 'center'
      }
    }, donker ? /*#__PURE__*/React.createElement(React.Fragment, null, fotoBlok(s.beeld, s.label), tekst) : /*#__PURE__*/React.createElement(React.Fragment, null, tekst, fotoBlok(s.beeld, s.label)))));
  })), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '90px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 820,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    align: "center",
    eyebrow: "Traject",
    titel: "Van eerste advies tot verzorgde plaatsing."
  })), /*#__PURE__*/React.createElement(Reveal, {
    delay: 60
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, traject.map((t, j) => /*#__PURE__*/React.createElement("p", {
    key: j,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16.5,
      lineHeight: 1.72,
      color: 'var(--text-body)',
      margin: j ? '14px auto 0' : '0 auto',
      maxWidth: '60ch'
    }
  }, t)))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '90px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1220,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    dark: true,
    align: "center",
    eyebrow: "Keuzemogelijkheden",
    titel: "Stel uw overkapping samen."
  })), /*#__PURE__*/React.createElement("div", {
    className: "pl-cards4",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 18,
      marginTop: 46
    }
  }, keuzes.map(([titel, tekst], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: titel,
    delay: i % 4 * 70
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--forest-850)',
      border: '1px solid var(--line-on-dark-soft)',
      borderRadius: 'var(--radius-md)',
      padding: '26px 24px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      color: 'var(--stone-100)',
      marginBottom: 9,
      lineHeight: 1.15
    }
  }, titel), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14.5,
      lineHeight: 1.65,
      color: 'var(--text-on-dark-muted)'
    }
  }, tekst))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-deep)',
      padding: '96px 44px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SEyebrow, {
    dark: true,
    style: {
      marginBottom: 18
    }
  }, "Overkappingen op maat"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 52,
      color: 'var(--stone-100)',
      margin: '0 auto 18px',
      maxWidth: '20ch',
      lineHeight: 1.06,
      letterSpacing: '-0.01em'
    }
  }, "Maak van uw terras een plek voor elk seizoen"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.65,
      color: 'var(--stone-300)',
      maxWidth: '52ch',
      margin: '0 auto 34px'
    }
  }, "Benieuwd welke overkapping het best bij uw woning past? Bespreek uw wensen met Poortland. We begeleiden u van de eerste ideeën en de opmeting tot de uiteindelijke plaatsing."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(SButton, {
    variant: "primary",
    size: "lg",
    arrow: true,
    onClick: () => onNav('contact')
  }, "Plan een adviesgesprek"), /*#__PURE__*/React.createElement(SButton, {
    variant: "secondary",
    size: "lg",
    dark: true,
    arrow: true,
    onClick: offerte
  }, "Vraag uw offerte aan")))));
}

/* ---- Garantie en kwaliteit ---- */
function GarantieNL({
  onNav
}) {
  React.useEffect(() => {
    document.title = 'Garantie en kwaliteit | Poortland';
    if (window.scrollTo) window.scrollTo(0, 0);
  }, []);
  const faac = [['5 jaar', 'Hydraulische FAAC aandrijvingen'], ['3 jaar', 'FAAC schuifpoortmotoren'], ['2 jaar', 'Elektromechanische FAAC aandrijvingen'], ['2 jaar', 'Elektronische toebehoren']];
  const kwaliteit = [['Snel geholpen met ruilmotoren', 'Bij een defect aan een motor hoeft u niet onnodig lang op een herstelling te wachten. Poortland werkt met een systeem van ruilmotoren. Waar nodig vervangen we de motor onmiddellijk door een geschikt exemplaar, zodat uw poort zo snel mogelijk opnieuw werkt.'], ['Duurzame materialen', 'Voor de montage gebruiken wij uitsluitend bouten, schroeven en scharnieren in roestvrij staal. Zo beperken we slijtage en corrosie en verhogen we de levensduur van uw poort of hekwerk.'], ['Volledige afwerking na plaatsing', 'Onze dienstverlening stopt niet bij de installatie. Na de plaatsing zorgen wij voor een nette en volledige afwerking. Waar nodig werken we de bestrating opnieuw aan en ruimen we de werf zorgvuldig op.']];
  const [tab, setTab] = React.useState(0);
  const corrosie = [{
    titel: 'Metalliseren',
    foto: 'media/anti-corrosie-metalliseren.jpg',
    tekst: 'Het vlamverzinken of metalliseren bestaat erin het staal met een variabele beschermlaag van zink en aluminium te bedekken. Bij het metallisatieproces met zink of een legering van zink en aluminium wordt het zinkmateriaal, onder de vorm van een draad, gesmolten met een vlamspuitpistool en perslucht en op het te behandelen oppervlak gespoten. Het proces wordt steeds voorafgegaan door het stralen van het stalen oppervlak, enerzijds om elk spoor van roest of vuil te verwijderen en zo een zuiverheidsgraad gelijk aan de norm SA2,5 tot Sa3 te bereiken, en anderzijds om de ruwheidsgraad te bekomen die nodig is voor de hechting van de metallisatie.'
  }, {
    titel: 'Thermisch verzinken',
    foto: 'media/anti-corrosie-verzinken.jpg',
    tekst: 'De toepassing op industriële schaal van het thermisch verzinken is weldra 200 jaar oud. Toch blijft het een zeer efficiënte manier om staal te vrijwaren van roest. Het proces bestaat uit het onderdompelen van staal in een bad van gesmolten zink van 450 °C.'
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '84px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 900,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SEyebrow, {
    dark: true,
    style: {
      marginBottom: 18
    }
  }, "Garantie en service"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 56,
      lineHeight: 1.04,
      letterSpacing: '-0.01em',
      color: 'var(--stone-100)',
      margin: 0
    }
  }, "Garantie en kwaliteit"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 18,
      lineHeight: 1.6,
      color: 'var(--stone-300)',
      maxWidth: '58ch',
      margin: '22px 0 32px'
    }
  }, "Bij Poortland kiezen we voor duidelijke garanties, duurzame materialen en een professionele plaatsing. Zo weet u vooraf precies waarop u kunt rekenen."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(SButton, {
    variant: "primary",
    arrow: true,
    onClick: () => window.dispatchEvent(new CustomEvent('pl-offerte-open'))
  }, "Vraag een offerte aan"), /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    dark: true,
    arrow: true,
    onClick: () => onNav('voorwaarden')
  }, "Bekijk verkoopsvoorwaarden"))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '90px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pl-split",
    style: {
      maxWidth: 1160,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '0.72fr 1.28fr',
      gap: 56,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 92,
      lineHeight: 0.9,
      color: 'var(--accent)'
    }
  }, "10"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginTop: 10
    }
  }, "jaar garantie"))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SEyebrow, {
    style: {
      marginBottom: 12
    }
  }, "Lakkwaliteit en roestvorming"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 34,
      lineHeight: 1.1,
      letterSpacing: '-0.01em',
      color: 'var(--text-heading)',
      margin: '0 0 16px'
    }
  }, "10 jaar garantie op lakkwaliteit en roestvorming"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16.5,
      lineHeight: 1.72,
      color: 'var(--text-body)',
      margin: 0
    }
  }, "Op de lakkwaliteit van onze poorten en hekwerken bieden wij een effectieve garantie van 10 jaar die haar volledige waarde behoudt. De waarde van de garantie vermindert tijdens deze periode dus niet jaarlijks."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16.5,
      lineHeight: 1.72,
      color: 'var(--text-body)',
      margin: '14px 0 0'
    }
  }, "Wij vinden transparantie belangrijk. Daarom raden we aan om bij de keuze van een leverancier niet alleen naar de duur van de garantie te kijken, maar ook naar de concrete voorwaarden, de ervaring van het bedrijf en de continuïteit van de onderneming."))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper-2)',
      padding: '90px 44px',
      borderTop: '1px solid var(--line-on-light-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SEyebrow, {
    style: {
      marginBottom: 12
    }
  }, "Roestbescherming"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 34,
      lineHeight: 1.1,
      letterSpacing: '-0.01em',
      color: 'var(--text-heading)',
      margin: '0 0 16px'
    }
  }, "Anti corrosie behandeling"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16.5,
      lineHeight: 1.72,
      color: 'var(--text-body)',
      maxWidth: '68ch',
      margin: 0
    }
  }, "Om een lange levensduur te verzekeren worden alle hekwerken en poorten van Poortland tegen roest behandeld. Hiervoor gebruiken wij twee technieken, namelijk thermisch verzinken en metalliseren. Daarna worden de hekwerken en poorten met twee lagen gepoederlakt.")), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 36
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    "aria-label": "Anti corrosie technieken",
    style: {
      display: 'flex',
      gap: 4
    }
  }, corrosie.map((c, i) => /*#__PURE__*/React.createElement("button", {
    key: c.titel,
    role: "tab",
    type: "button",
    "aria-selected": tab === i,
    onClick: () => setTab(i),
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      fontWeight: 600,
      cursor: 'pointer',
      padding: '12px 22px',
      border: '1px solid var(--line-on-light-soft)',
      borderBottom: 0,
      borderRadius: '8px 8px 0 0',
      position: 'relative',
      bottom: -1,
      background: tab === i ? 'var(--surface-card)' : 'transparent',
      color: tab === i ? 'var(--text-heading)' : 'var(--text-muted)'
    }
  }, c.titel))), /*#__PURE__*/React.createElement("div", {
    role: "tabpanel",
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--line-on-light-soft)',
      borderRadius: '0 10px 10px 10px',
      padding: '32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pl-split",
    style: {
      display: 'grid',
      gridTemplateColumns: '1.25fr 0.75fr',
      gap: 36,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 24,
      color: 'var(--text-heading)',
      margin: '0 0 14px',
      lineHeight: 1.2
    }
  }, corrosie[tab].titel), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15.5,
      lineHeight: 1.75,
      color: 'var(--text-body)',
      margin: 0
    }
  }, corrosie[tab].tekst)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '4 / 3',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: 'var(--surface-paper-2)',
      border: '1px dashed var(--line-on-light)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      padding: '0 16px',
      textAlign: 'center'
    }
  }, "Foto ", corrosie[tab].titel.toLowerCase()), /*#__PURE__*/React.createElement("img", {
    src: corrosie[tab].foto,
    alt: corrosie[tab].titel,
    loading: "lazy",
    onError: e => {
      e.currentTarget.style.display = 'none';
    },
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  })))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '90px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1160,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    dark: true,
    align: "center",
    eyebrow: "Automatisatie",
    titel: "Garantie op FAAC aandrijvingen en motoren",
    intro: "Poortland werkt met betrouwbare aandrijvingen en motoren van FAAC. Afhankelijk van het type installatie gelden de volgende garantieperiodes."
  })), /*#__PURE__*/React.createElement("div", {
    className: "pl-cards4",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 18,
      marginTop: 46
    }
  }, faac.map(([jaar, wat], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: wat,
    delay: i % 4 * 70
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--forest-850)',
      border: '1px solid var(--line-on-dark-soft)',
      borderRadius: 'var(--radius-md)',
      padding: '26px 24px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 30,
      color: 'var(--accent)',
      lineHeight: 1
    }
  }, jaar), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14.5,
      lineHeight: 1.55,
      color: 'var(--text-on-dark-muted)',
      marginTop: 10
    }
  }, wat))))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15.5,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      textAlign: 'center',
      maxWidth: '60ch',
      margin: '30px auto 0'
    }
  }, "Daarnaast kunt u kiezen uit verschillende onderhoudscontracten, afgestemd op uw installatie en gebruik.")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '90px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1160,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    align: "center",
    eyebrow: "Kwaliteit en nazorg",
    titel: "Meer dan alleen een garantietermijn."
  })), /*#__PURE__*/React.createElement("div", {
    className: "pl-cards",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 20,
      marginTop: 46
    }
  }, kwaliteit.map(([titel, tekst], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: titel,
    delay: i % 3 * 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--line-on-light-soft)',
      borderRadius: 'var(--radius-md)',
      padding: '28px 26px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 22,
      color: 'var(--text-heading)',
      margin: '0 0 10px',
      lineHeight: 1.2
    }
  }, titel), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      lineHeight: 1.7,
      color: 'var(--text-muted)',
      margin: 0
    }
  }, tekst))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-deep)',
      padding: '90px 44px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SEyebrow, {
    dark: true,
    style: {
      marginBottom: 18
    }
  }, "Verkoopsvoorwaarden"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 44,
      color: 'var(--stone-100)',
      margin: '0 auto 16px',
      maxWidth: '22ch',
      lineHeight: 1.08,
      letterSpacing: '-0.01em'
    }
  }, "De volledige voorwaarden op een rij"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.65,
      color: 'var(--stone-300)',
      maxWidth: '56ch',
      margin: '0 auto 32px'
    }
  }, "De volledige garantievoorwaarden en verkoopsvoorwaarden vindt u terug in onze algemene verkoopsvoorwaarden."), /*#__PURE__*/React.createElement(SButton, {
    variant: "primary",
    size: "lg",
    arrow: true,
    onClick: () => onNav('voorwaarden')
  }, "Bekijk onze verkoopsvoorwaarden"))));
}

/* ---- Algemene voorwaarden (verkoopsvoorwaarden 2022) ---- */
function VoorwaardenNL({
  onNav
}) {
  React.useEffect(() => {
    document.title = 'Algemene voorwaarden | Poortland';
    if (window.scrollTo) window.scrollTo(0, 0);
  }, []);
  const secties = [{
    nr: '1',
    titel: 'Algemene bepalingen',
    clausules: [['1.1', "Deze algemene verkoopsvoorwaarden gelden voor alle bij ons gedane aankopen, bestellingen en/of plaatsingen. De klant aanvaardt ze door het feit van zijn aankoop en/of bestelling."], ['1.2', "Eventuele aankoopvoorwaarden van de klant binden ons enkel indien ze voorafgaand en uitdrukkelijk schriftelijk door ons aanvaard werden."], ['1.3', "Al onze opgegeven prijzen zijn exclusief BTW, tenzij anders vermeld."], ['1.4', "In geval de koper gerechtigd is de BTW niet bij de aankoop te betalen, dient de koper daarvan het wettelijke vereiste bewijs te leveren vooraleer dit afzonderlijk op de factuur verrekend zal worden."], ['1.5', "Bij een bestelling voor latere levering blijft de prijs vast gedurende 3 maanden, te tellen vanaf de datum van de bestelling. Nadien kan deze herzien worden, tenzij anders is overeengekomen."]]
  }, {
    nr: '2',
    titel: 'Bestelling',
    clausules: [['2.1', "Tenzij ons schriftelijk anders is bedongen gelden onze monsters, tekeningen, afmetingen, gewichten en andere gegevens slechts als benaderende beschrijving van onze producten en kunnen eventuele afwijkingen ervan, van welke aard dan ook, nimmer door de koper ingeroepen worden om hetzij de afneming te weigeren, hetzij de verbreking of schadevergoeding te vorderen. Evenzo kunnen wij, behoudens andersluidende en schriftelijke overeenkomst nimmer aansprakelijk gesteld worden wegens eventuele ongeschiktheid van onze producten voor speciale doeleinden waartoe ze door de koper bestemd werden."], ['2.2', "De door de koper opgegeven maten zullen bij de productie stipt gevolgd worden. In geval de opgegeven maten niet met de werkelijkheid overeenstemmen, ligt de verantwoordelijkheid uitsluitend bij de koper en kan geen schadevergoeding geëist worden."], ['2.3', "In geval de maten door onze verkopers moeten uitgerekend worden op basis van een plan door de koper ter beschikking gesteld, zal dit gebeuren op risico van de koper voor eventuele afwijkingen van de werkelijke maten t.o.v. het plan."], ['2.4', "Wanneer een opmeting gebeurd door onze diensten, is de koper verplicht elke wijziging aan de situatie onmiddellijk te melden. Kosten die teweeg worden gebracht door wijzigingen van de situatie, na opmeting, worden doorberekend aan de klant."]]
  }, {
    nr: '3',
    titel: 'Levering en afhaling',
    clausules: [['3.1', "Bij verkoop uit voorraad kunnen de goederen onmiddellijk door de koper meegenomen worden tegen contante betaling."], ['3.2', "Aan huis bestelling kan gebeuren tegen een vergoeding en op een vooraf overeengekomen datum."], ['3.3', "In geval de levering en/of plaatsing niet kan gebeuren op de afgesproken datum om redenen onafhankelijk van onze wil, zal de koper een nieuwe datum voorgesteld worden zonder bijkomende kosten."], ['3.4', "In geval de levering en/of plaatsing niet kan gebeuren op de voorziene levertijd om redenen die bij de koper of aannemers van de koper liggen, heeft de verkoper het recht om reeds het bedrag van het materiaal, vermeld in de bestelling, zonder plaatsingskosten, te factureren."], ['3.5', "De opgegeven leverings- en uitvoeringstermijnen worden opgegeven bij benadering en bij niet nakomen door ons van deze termijnen, kan de koper de bestelling niet annuleren, noch kan hij enige schadevergoeding eisen."], ['3.6', "Alle geleverde goederen blijven onze eigendom tot de factuur volledig betaald is."]]
  }, {
    nr: '4',
    titel: 'Plaatsingen',
    clausules: [['4.1', "De verkoper kan nooit verantwoordelijk gesteld worden voor het ontbreken van vergunning met betrekking tot de toelating tot plaatsen van poorten, zuilen en afsluitingen. Indien niet voldaan is aan het aanvragen van de nodige toelatingen/vergunningen en hieruit volgt dat de geplaatste werken geheel of gedeeltelijk dienen verwijderd te worden, blijft de koper de koopsom verschuldigd aan de verkoper. De eventuele kosten voor verwijdering zijn geheel voor rekening van de koper."], ['4.2', "Plaatsingen zullen uitgevoerd worden volgens het geldende tarief en op een vooraf afgesproken datum. Indien deze datum door ons niet kan gerespecteerd worden om redenen onafhankelijk van onze wil, zal de koper een nieuwe datum voorgesteld worden zonder bijkomende kosten. In geen enkel geval kan de koper bij niet naleving van deze datum door ons de bestelling annuleren, noch schadevergoeding eisen."], ['4.3', "De koper verbindt er zich toe tijdig de locatie waar de plaatsing dient te gebeuren, te ontruimen zodat het werk zonder tijdverlies kan worden uitgevoerd. Indien de plaatsers de locatie zelf moeten ontruimen, alvorens aan de werkzaamheden te kunnen beginnen, uitgezonderd indien uitdrukkelijk en schriftelijk anders is overeengekomen, zullen de kosten voor deze ontruiming aangerekend worden."], ['4.4', "De koper geeft de staat van de ondergrond op in volgende categorieën in stijgende lijn van moeilijkheidsgraad voor plaatsing: volle grond – volle grond met wortels van struiken en bomen – grond met steenafval – steenafval, stenen, beton. Op basis hiervan wordt de prijs voor plaatsing berekend door ons. Indien de werkelijke ondergrond niet overeenkomt met deze opgegeven door de koper en de moeilijkheidsgraad hoger is, zal hiervoor een extra kost worden aangerekend."], ['4.5', "In geval er door de plaatser schade wordt berokkend aan leidingen en andere voorwerpen die zich in de ondergrond bevinden en die ons vooraf niet werden meegedeeld, dan kan de koper geen enkele schadevergoeding vorderen, en is de koper verantwoordelijk voor de opgelopen schade ook indien de leidingen en/of voorwerpen toebehoren aan derden."]]
  }, {
    nr: '5',
    titel: 'Waarborg',
    clausules: [['5.1', "Alle door ons geleverde en geplaatste metalen constructies, die door ons tegen roest behandeld en nadien geverfd zijn, worden gewaarborgd tegen doorroesten en op de lakkwaliteit voor een termijn van 10 jaar, op voorwaarde dat er geen beschadigingen werden aangebracht en dat de goederen zijn onderhouden als door een goede huisvader. Oppervlakkige roestvorming en roestvorming aan scharnierpunten en sloten of ondergrondse roestvorming, vallen buiten bovenstaande waarborg."], ['5.2', "Alle door ons geplaatste elektrische leidingen en automatiseringen zijn gewaarborgd voor een periode van één jaar, tenzij anders bepaald in de offerte en/of bestelbon."], ['5.3', "Alle door ons geplaatste aandrijvingen, elektrische en elektronische materialen zijn gewaarborgd voor 2 jaar, tenzij een langere termijn op de bestelbon wordt vermeld, tenzij anders bepaald in de offerte en/of bestelbon."], ['5.4', "Bovenvermelde waarborgperiodes gelden vanaf de factuurdatum en enkel indien de factuur voldaan is."], ['5.5', "Voor elke tussenkomst door ons, die onder bovenvermelde waarborgen valt, worden evenwel de verplaatsingskost en de werkuren aangerekend na meer dan 2 jaar na de levering voor particulieren en na meer dan 1 jaar voor professionelen (factuur aan BTW nummer)."], ['5.6', "Evenwel zijn uitdrukkelijk uit onze waarborg gesloten, alle schade veroorzaakt door beschadiging, aardbeving, grondverzakking, verschuivingen, extreme storm, windhoos, orkaan, enz."], ['5.7', "Alle klachten voor zichtbare gebreken bij levering en/of plaatsing, moeten schriftelijk gebeuren en gericht worden aan onze zetel binnen de 8 dagen na uitvoering of ontvangst ervan."]]
  }, {
    nr: '6',
    titel: 'Prijzen',
    clausules: [['6.1', "De prijs voor een project wordt bepaald in de offerte en bestelbon en is bindend voor zover niet voldaan wordt aan punt 6.2 of mits onderling overleg."], ['6.2', "Indien de aankooprijzen van de grondstoffen met meer dan 10% stijgen of de lonen met meer dan 4% tussen datum bestelbon en datum oplevering, wordt de prijs aangepast volgens de door Poortland aan te tonen verhoging à rato van deze stijging."]]
  }, {
    nr: '7',
    titel: 'Betalingen',
    clausules: [['7.1', "Alle betalingen moeten gebeuren op onze bankrekening. Wij aanvaarden geen cheques."], ['7.2', "De betalingsverplichtingen van de koper worden niet geschorst door het indienen van een zelfs klaarblijkelijk gegronde klacht betreffende de kwestieuze of andere goederen."], ['7.3', "Bij het plaatsen van de bestelling is er steeds een voorschot van 30% van het totale factuurbedrag verschuldigd, tenzij anders uitdrukkelijk en schriftelijk is overeengekomen."], ['7.4', "Elk bedrag dat niet betaald is geworden binnen de 14 dagen volgend op het zenden van een aangetekende aanmaning, zal van rechtswege verhoogd worden met een forfaitair bedrag van 10% (met een minimum van 50,00 €) tot vergoeding van onze buitengerechtelijke inningskosten, onverminderd de andere vergoedingen en kosten in geval van gerechtelijke vordering. Tevens zal op alle uitstaande bedragen een intrest berekend worden gelijk aan de basisrente van het kaskrediet aangerekend door de Belgische banken, vermeerderd met 2%."], ['7.5', "Indien een factuur is opgesteld aan de klant, waarbij later zou blijken dat een foutief BTW percentage is verrekend, zijn beide partijen gehouden aan de regularisatie hiervan."], ['7.6', "Indien bij interventies de kosten onder de 150 euro (btw exclusief) liggen, zal er een administratieve kost van 15 euro (btw exclusief) worden aangerekend."]]
  }, {
    nr: '8',
    titel: 'Annulatie, verbreking, klachten en algemeen',
    clausules: [['8.1', "In geval de koper zijn bestelling geheel of gedeeltelijk annuleert is er een schadevergoeding verschuldigd gelijk aan het betaalde voorschot met een minimum 30% van het totale bedrag van de geannuleerde bestelling. Indien de bestelde goederen reeds geproduceerd zijn volgens de indicaties van de koper, kan de bestelling niet geannuleerd worden en is het volledige bedrag verschuldigd."], ['8.2', "Wij aanvaarden geen algemene voorwaarden van onze medecontractanten."], ['8.3', "In geval van betwisting zijn alleen de Rechtbanken van Mechelen of andere naar onze keuze bevoegd."]]
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '78px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 900,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SEyebrow, {
    dark: true,
    style: {
      marginBottom: 18
    }
  }, "Verkoopsvoorwaarden"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 54,
      lineHeight: 1.04,
      letterSpacing: '-0.01em',
      color: 'var(--stone-100)',
      margin: 0
    }
  }, "Algemene voorwaarden"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.6,
      color: 'var(--stone-300)',
      maxWidth: '62ch',
      margin: '22px 0 0'
    }
  }, "Deze algemene verkoopsvoorwaarden gelden voor alle aankopen, bestellingen en plaatsingen bij Poortland nv. Versie 2022.")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '68px 44px 92px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 900,
      margin: '0 auto'
    }
  }, secties.map((s, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: s.nr,
    delay: i % 3 * 40
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 40,
      paddingTop: i ? 34 : 0,
      borderTop: i ? '1px solid var(--line-on-light-soft)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 14,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 30,
      fontWeight: 500,
      color: 'var(--accent)',
      lineHeight: 1
    }
  }, s.nr), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 26,
      color: 'var(--text-heading)',
      margin: 0,
      letterSpacing: '-0.01em'
    }
  }, s.titel)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 15
    }
  }, s.clausules.map(([nr, tekst]) => /*#__PURE__*/React.createElement("div", {
    key: nr,
    style: {
      display: 'grid',
      gridTemplateColumns: '48px 1fr',
      gap: 6,
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--accent)'
    }
  }, nr), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15.5,
      lineHeight: 1.72,
      color: 'var(--text-body)',
      margin: 0
    }
  }, tekst))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      paddingTop: 28,
      borderTop: '1px solid var(--line-on-light-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--text-heading)',
      marginBottom: 10
    }
  }, "Poortland nv"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      lineHeight: 1.8,
      color: 'var(--text-muted)',
      margin: 0
    }
  }, "Hombeeksesteenweg 164-166, 2800 Mechelen · Tel +32 (0)15 432 111 · info@poortland.be", /*#__PURE__*/React.createElement("br", null), "BTW BE 0464 838 351 · KBC BE38 7330 0060 5672 · Belfius BE85 0682 4455 4306 · Reg.nr. 02.23.01")))), /*#__PURE__*/React.createElement(CTASectie, {
    onNav: onNav,
    dark: true
  }));
}
function OverOnsNL({
  onNav
}) {
  const {
    Reveal,
    SectieKop,
    CTASectie
  } = window;
  const offerte = () => window.dispatchEvent(new CustomEvent('pl-offerte-open'));
  React.useEffect(() => {
    document.title = 'Over Poortland | vakmanschap in eigen beheer sinds 1999';
    if (window.scrollTo) window.scrollTo(0, 0);
  }, []);
  const bc = {
    background: 'none',
    border: 0,
    padding: 0,
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    fontSize: 13,
    color: 'var(--text-muted)'
  };
  const stats = [{
    getal: '1999',
    label: 'Opgericht'
  }, {
    teller: 320,
    suffix: '+',
    label: 'Werven gerealiseerd'
  }, {
    getal: 'Mechelen',
    label: 'Eigen atelier'
  }, {
    getal: '6/7',
    label: 'Dagen bereikbaar'
  }, {
    getal: '100%',
    label: 'In eigen beheer'
  }];
  const mijlpalen = [['1999', 'De start van Poortland NV', 'Poortland NV gaat van start. We nemen materiaal, materieel en ervaren vakmensen over van een stopgezette zaak en zetten de dienstverlening zonder onderbreking verder. Een volledig nieuw bedrijf met een eigen visie, los van het verleden.'], ['2000', 'Eigen transport en plaatsing', 'Een eerste grote investering: een vrachtwagen met hydraulische kraan en een laadbak van 9 meter. Zo plaatsen we ook grotere poorten volledig in eigen beheer.'], ['2001–2003', 'Een sterker atelier', 'Nieuwe las- en bewerkingsmachines, van halfautomaat en TIG tot profielwals, lintzaag en freesmachine. Meer capaciteit, meer precisie en een fijnere afwerking.'], ['2004', 'Meer hefkracht', 'Een krachtiger kraanvoertuig heft 750 kilogram op 10 meter afstand, zodat ook grotere en zwaardere poorten vlot geplaatst worden.'], ['2005', 'Eigen gebouwen en FAAC', 'We kopen de gehuurde gebouwen en terreinen, samen zo\'n 3.000 m². Tegelijk breiden we de samenwerking uit met FAAC, een wereldspeler in professionele poortautomatisering.'], ['2006', 'Ontwerpen met CAD', 'Een professioneel CAD-programma doet zijn intrede. Complexe projecten worden vooraf tot in detail uitgetekend, met nauwkeurige productietekeningen voor het atelier.'], ['Vanaf 2007', 'Van staal naar aluminium', 'Geleidelijk verschuift het accent van staal naar aluminium, voor onderhoudsgemak en corrosiebestendigheid. Waar staal begin de jaren 2000 nog overheerste, is die verhouding vandaag omgekeerd. Toch blijft Poortland een van de weinige Belgische makers van klassieke sierpoorten, van landelijke stijl tot kasteelpoort.'], ['Doorlopend', 'Blijven vernieuwen', 'De atelieruitrusting wordt voortdurend vernieuwd waar nodig, zodat kwaliteit en afwerking mee blijven evolueren.'], ['2024', 'Laserlassen', 'Een laserlasser levert veel fijnere lasnaden op: een strakkere, mooiere afwerking met nauwelijks zichtbare lassen en veel minder nabewerking.'], ['2026', 'Nieuwe kraanwagen', 'Een nieuwe Euro 6 vrachtwagen met een kraan tot 11,5 meter en een mobiele werkunit. Nauwkeuriger plaatsen, ook op moeilijk bereikbare werven, en lichter werk voor het team.']];
  const beheer = [['Eigen productie', 'Poortland beschikt over een eigen atelier in Mechelen. Alle poorten en hekwerken worden er door ervaren vakmensen gemaakt, met voortdurende aandacht voor kwaliteit en afwerking.'], ['Eigen plaatsingsdienst', 'Poortland heeft een eigen plaatsingsteam en professioneel transport en plaatsingsmaterieel. Zo zetten wij onder meer een telescopische kraan in die tot 1.500 kilogram heft op 10 meter afstand. Elke poort wordt veilig en duurzaam geplaatst.'], ['Eigen techniekers', 'Onze eigen techniekers verzorgen de automatisatie van de poorten. Zij staan ook in voor technische ondersteuning, onderhoud en naverkoop.'], ['Afwerking van de werf', 'Na de plaatsing werken wij de werf netjes af. Waar nodig herstellen wij de bestrating en ruimen wij de volledige werkzone op.']];
  const kwaliteit = [['Sterke constructie', 'Poortland verwerkt staal, aluminium en inox. Voor stalen constructies gebruiken wij dikwandig staal, afhankelijk van de toepassing en de constructie van 2 tot 5 millimeter.'], ['Roestvrije bevestiging', 'Bouten, schroeven en scharnieren voert Poortland uit in roestvrij staal, zodat de bevestiging betrouwbaar blijft.'], ['Kwaliteitsgerichte leveranciers', 'Poortland kiest leveranciers op de verhouding tussen kwaliteit en prijs, niet enkel op de laagste aankoopprijs.']];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Kruimelpad",
    style: {
      background: 'var(--surface-paper)',
      borderBottom: '1px solid var(--line-on-light-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      padding: '15px 44px',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('home'),
    style: bc
  }, "Home"), /*#__PURE__*/React.createElement("span", {
    style: {
      margin: '0 9px',
      color: 'var(--line-on-light)'
    }
  }, "/"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-heading)'
    }
  }, "Over ons"))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '74px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pl-split",
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.02fr 0.98fr',
      gap: 60,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SEyebrow, {
    dark: true,
    style: {
      marginBottom: 20
    }
  }, "Over Poortland NV"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 60,
      lineHeight: 1.04,
      letterSpacing: '-0.01em',
      color: 'var(--stone-100)',
      margin: 0
    }
  }, "Vakmanschap in eigen beheer, sinds 1999"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 18,
      lineHeight: 1.65,
      color: 'var(--stone-300)',
      maxWidth: '48ch',
      margin: '24px 0 30px'
    }
  }, "Poortland NV werd opgericht in 1999. Van bij de start werkt het bedrijf met mensen die jarenlange ervaring hebben in het maken en plaatsen van poorten. Ondertussen realiseerde Poortland meer dan 3.000 poorten en hekwerken. U rekent daardoor op ruime ervaring, bewezen vakmanschap en een professionele dienstverlening."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(SButton, {
    variant: "primary",
    arrow: true,
    as: "button",
    onClick: offerte
  }, "Vraag een vrijblijvende offerte aan"), /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    dark: true,
    arrow: true,
    onClick: () => onNav('realisaties')
  }, "Bekijk realisaties"))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 10,
      overflow: 'hidden',
      aspectRatio: '3 / 2',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "media/hero.jpg",
    alt: "Poort van Poortland, gemaakt in eigen atelier",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '60px 44px',
      borderBottom: '1px solid var(--line-on-light-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pl-stats",
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: 20
    }
  }, stats.map((s, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: i,
    delay: i % 5 * 60
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderLeft: '2px solid var(--accent)',
      paddingLeft: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 38,
      color: 'var(--text-heading)',
      lineHeight: 1
    }
  }, s.teller ? /*#__PURE__*/React.createElement(Teller, {
    eind: s.teller,
    suffix: s.suffix
  }) : s.getal), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      lineHeight: 1.4,
      color: 'var(--text-muted)',
      marginTop: 8
    }
  }, s.label)))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '90px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    dark: true,
    align: "center",
    eyebrow: "Onze weg",
    titel: "Van oprichting tot vandaag",
    intro: "Een korte geschiedenis van Poortland, van 1999 tot vandaag."
  })), /*#__PURE__*/React.createElement(Reveal, {
    delay: 40
  }, /*#__PURE__*/React.createElement("div", {
    className: "pl-tlc",
    style: {
      marginTop: 56
    }
  }, mijlpalen.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: 'pl-tlc-row ' + (i % 2 === 0 ? 'links' : 'rechts')
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    className: "pl-tlc-dot"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 20,
      color: 'var(--accent)',
      marginBottom: 6
    }
  }, m[0]), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 22,
      color: 'var(--stone-100)',
      margin: '0 0 8px',
      lineHeight: 1.2
    }
  }, m[1]), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      margin: 0
    }
  }, m[2]))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '90px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    align: "center",
    eyebrow: "Alles onder een dak",
    titel: "Alles in eigen beheer",
    intro: "Van het eerste ontwerp tot de naverkoop houdt Poortland alles in eigen handen."
  })), /*#__PURE__*/React.createElement("div", {
    className: "pl-cards4",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 18,
      marginTop: 46
    }
  }, beheer.map((b, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: b[0],
    delay: i % 4 * 70
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--line-on-light-soft)',
      borderRadius: 'var(--radius-md)',
      padding: '26px 22px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      color: 'var(--text-heading)',
      marginBottom: 8
    }
  }, b[0]), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14.5,
      lineHeight: 1.6,
      color: 'var(--text-muted)'
    }
  }, b[1]))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '84px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pl-split",
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 56,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SEyebrow, {
    dark: true,
    style: {
      marginBottom: 16
    }
  }, "Bereikbaarheid en naverkoop"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 38,
      color: 'var(--stone-100)',
      margin: 0,
      lineHeight: 1.1,
      letterSpacing: '-0.01em'
    }
  }, "Zes dagen per week bereikbaar"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16.5,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      maxWidth: '48ch',
      margin: '18px 0 24px'
    }
  }, "Poortland is zes dagen per week open en bereikbaar. Ook tijdens vakantieperiodes blijft het bedrijf operationeel. Zo rekent u steeds op een snelle en betrouwbare naverkoopdienst."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map((d, i) => /*#__PURE__*/React.createElement("span", {
    key: d,
    style: {
      width: 42,
      height: 42,
      borderRadius: '50%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-label)',
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.04em',
      background: i < 6 ? 'var(--accent)' : 'transparent',
      color: i < 6 ? '#fff' : 'var(--text-on-dark-muted)',
      border: '1px solid ' + (i < 6 ? 'var(--accent)' : 'var(--line-on-dark)')
    }
  }, d)))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 10,
      overflow: 'hidden',
      aspectRatio: '4 / 3',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "media/staal-hout.jpg",
    loading: "lazy",
    alt: "Detail van een poort van Poortland",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '90px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 940,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SEyebrow, {
    style: {
      marginBottom: 16
    }
  }, "Duidelijk en transparant"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 46,
      color: 'var(--text-heading)',
      margin: '0 auto',
      maxWidth: '18ch',
      lineHeight: 1.08,
      letterSpacing: '-0.01em'
    }
  }, "Een vaste prijs, zonder verrassingen"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.7,
      color: 'var(--text-body)',
      maxWidth: '58ch',
      margin: '20px auto 8px'
    }
  }, "Poortland vermeldt in elke offerte een duidelijke totaalprijs waarin alles is inbegrepen. U wordt achteraf niet verrast door onverwachte kosten."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.7,
      color: 'var(--text-body)',
      maxWidth: '58ch',
      margin: '0 auto 30px'
    }
  }, "Wilt u eerst zien wat wij maken? Vraag gerust referentieadressen op en bekijk reeds geplaatste poorten om de kwaliteit zelf te beoordelen."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(SButton, {
    variant: "primary",
    size: "lg",
    arrow: true,
    as: "button",
    onClick: offerte
  }, "Vraag een vrijblijvende offerte aan"), /*#__PURE__*/React.createElement(SButton, {
    variant: "secondary",
    size: "lg",
    arrow: true,
    onClick: () => onNav('realisaties')
  }, "Ontdek onze realisaties"))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '90px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    dark: true,
    align: "center",
    eyebrow: "Materialen en kwaliteit",
    titel: "Gemaakt om jaren mee te gaan"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pl-split",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 18,
      marginTop: 46,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--forest-850)',
      border: '1px solid var(--line-on-dark-soft)',
      borderRadius: 'var(--radius-md)',
      padding: '28px 26px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 21,
      color: 'var(--stone-100)',
      marginBottom: 8
    }
  }, "Duurzame poederlak"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14.5,
      lineHeight: 1.65,
      color: 'var(--stone-300)',
      marginBottom: 18
    }
  }, "Elke poort krijgt twee lagen poederlak. Een grondlaag in epoxy voor een sterke hechting en een afwerklaag in polyester die UV bestendig is en zorgt voor een duurzame afwerking."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 200",
    width: "184",
    height: "184",
    fill: "none",
    "aria-hidden": "true",
    style: {
      maxWidth: '100%'
    }
  }, /*#__PURE__*/React.createElement("rect", {
    x: "26",
    y: "26",
    width: "148",
    height: "148",
    rx: "13",
    fill: "#B3A791"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "34",
    y: "34",
    width: "132",
    height: "132",
    rx: "10",
    fill: "#8C806A"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "42",
    y: "42",
    width: "116",
    height: "116",
    rx: "7",
    fill: "#3B3F3C"
  }), /*#__PURE__*/React.createElement("g", {
    stroke: "#2C302D",
    strokeWidth: 2.5
  }, /*#__PURE__*/React.createElement("line", {
    x1: "72",
    y1: "52",
    x2: "72",
    y2: "148"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "100",
    y1: "52",
    x2: "100",
    y2: "148"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "128",
    y1: "52",
    x2: "128",
    y2: "148"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9,
      width: '100%'
    }
  }, [['#B3A791', 'Afwerklaag polyester', 'UV bestendig'], ['#8C806A', 'Grondlaag epoxy', 'Sterke hechting'], ['#3B3F3C', 'Kern in staal of aluminium', 'Antraciet']].map(r => /*#__PURE__*/React.createElement("div", {
    key: r[1],
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 13,
      height: 13,
      borderRadius: 3,
      background: r[0],
      flex: '0 0 auto',
      border: '1px solid rgba(20,28,21,0.15)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      fontWeight: 600,
      color: 'var(--stone-100)'
    }
  }, r[1]), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      color: 'var(--text-on-dark-muted)',
      marginLeft: 'auto'
    }
  }, r[2]))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, kwaliteit.map((k, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: k[0],
    delay: i % 3 * 70
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--forest-850)',
      border: '1px solid var(--line-on-dark-soft)',
      borderRadius: 'var(--radius-md)',
      padding: '28px 26px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 21,
      color: 'var(--stone-100)',
      marginBottom: 8
    }
  }, k[0]), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14.5,
      lineHeight: 1.65,
      color: 'var(--stone-300)'
    }
  }, k[1])))))))), /*#__PURE__*/React.createElement(CTASectie, {
    onNav: onNav,
    dark: true
  }), /*#__PURE__*/React.createElement("button", {
    className: "pl-mobcta",
    onClick: offerte,
    style: {
      position: 'fixed',
      left: 16,
      right: 16,
      bottom: 16,
      zIndex: 60,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '15px 20px',
      borderRadius: 'var(--radius-md)',
      border: 0,
      cursor: 'pointer',
      background: 'var(--accent)',
      color: '#fff',
      fontFamily: 'var(--font-label)',
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      boxShadow: '0 6px 20px rgba(20,28,21,0.28)'
    }
  }, "Vraag een offerte aan"));
}

/* ---- Gedeelde beleidpagina (privacy en cookies) in de huisstijl ---- */
function BeleidPagina({
  eyebrow,
  titel,
  intro,
  secties,
  onNav
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '78px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 900,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SEyebrow, {
    dark: true,
    style: {
      marginBottom: 18
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 54,
      lineHeight: 1.04,
      letterSpacing: '-0.01em',
      color: 'var(--stone-100)',
      margin: 0
    }
  }, titel), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.6,
      color: 'var(--stone-300)',
      maxWidth: '62ch',
      margin: '22px 0 0'
    }
  }, intro)))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '68px 44px 92px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 900,
      margin: '0 auto'
    }
  }, secties.map((s, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: s.nr,
    delay: i % 3 * 40
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 40,
      paddingTop: i ? 34 : 0,
      borderTop: i ? '1px solid var(--line-on-light-soft)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 14,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 30,
      fontWeight: 500,
      color: 'var(--accent)',
      lineHeight: 1
    }
  }, s.nr), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 26,
      color: 'var(--text-heading)',
      margin: 0,
      letterSpacing: '-0.01em'
    }
  }, s.titel)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 15
    }
  }, s.clausules.map(([nr, tekst]) => /*#__PURE__*/React.createElement("div", {
    key: nr,
    style: {
      display: 'grid',
      gridTemplateColumns: '48px 1fr',
      gap: 6,
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--accent)'
    }
  }, nr), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15.5,
      lineHeight: 1.72,
      color: 'var(--text-body)',
      margin: 0
    }
  }, tekst))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      paddingTop: 28,
      borderTop: '1px solid var(--line-on-light-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--text-heading)',
      marginBottom: 10
    }
  }, "Poortland nv"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      lineHeight: 1.8,
      color: 'var(--text-muted)',
      margin: 0
    }
  }, "Hombeeksesteenweg 164-166, 2800 Mechelen · Tel +32 (0)15 432 111 · info@poortland.be", /*#__PURE__*/React.createElement("br", null), "BTW BE 0464 838 351")))), /*#__PURE__*/React.createElement(CTASectie, {
    onNav: onNav,
    dark: true
  }));
}
function PrivacyNL({
  onNav
}) {
  React.useEffect(() => {
    document.title = 'Privacybeleid | Poortland';
    if (window.scrollTo) window.scrollTo(0, 0);
  }, []);
  const secties = [{
    nr: '1',
    titel: 'Wie verwerkt uw gegevens',
    clausules: [['1.1', 'Poortland nv, met zetel te Hombeeksesteenweg 164-166, 2800 Mechelen, is verantwoordelijk voor de verwerking van uw persoonsgegevens. U bereikt ons via info@poortland.be of +32 (0)15 432 111.'], ['1.2', 'In dit beleid leest u welke gegevens wij verwerken, waarom, hoe lang en welke rechten u heeft. Wij verwerken uw gegevens volgens de Algemene Verordening Gegevensbescherming.']]
  }, {
    nr: '2',
    titel: 'Welke gegevens wij verwerken',
    clausules: [['2.1', 'Identiteits en contactgegevens die u zelf doorgeeft: naam, voornaam, emailadres, telefoonnummer en adres.'], ['2.2', 'Projectgegevens: uw vraag of omschrijving, het type aanvraag, de gewenste timing en eventuele fotos die u toevoegt.'], ['2.3', 'Voor bedrijven verwerken wij ook de bedrijfsnaam en het btw nummer.'], ['2.4', 'Technische gegevens die nodig zijn om uw aanvraag veilig te verwerken, zoals uw ip adres op het moment van verzending.']]
  }, {
    nr: '3',
    titel: 'Waarvoor en op welke grond',
    clausules: [['3.1', 'Wij gebruiken uw gegevens om uw aanvraag te beantwoorden, een offerte op te maken en uw project uit te voeren. De grondslag is de uitvoering van een overeenkomst of stappen op uw verzoek voor de sluiting ervan.'], ['3.2', 'Voor klantenbeheer, facturatie en boekhouding verwerken wij uw gegevens op grond van onze wettelijke verplichtingen en ons gerechtvaardigd belang bij een correcte bedrijfsvoering.'], ['3.3', 'Wij gebruiken uw gegevens niet voor geautomatiseerde besluitvorming of profilering.']]
  }, {
    nr: '4',
    titel: 'Hoe lang wij uw gegevens bewaren',
    clausules: [['4.1', 'Wij bewaren uw gegevens niet langer dan nodig voor de doeleinden hierboven.'], ['4.2', 'Aanvragen die niet tot een opdracht leiden bewaren wij maximaal twee jaar. Gegevens die verband houden met een overeenkomst of factuur bewaren wij zolang de wettelijke bewaarplicht dit vereist, voor de boekhouding zeven jaar.']]
  }, {
    nr: '5',
    titel: 'Met wie wij uw gegevens delen',
    clausules: [['5.1', 'Wij verkopen uw gegevens nooit. Wij delen ze enkel met dienstverleners die ons helpen, zoals een hostingpartij of een verzenddienst voor email, en enkel voor zover dat nodig is.'], ['5.2', 'Deze partijen verwerken uw gegevens in onze opdracht en onder een verwerkersovereenkomst, binnen de Europese Economische Ruimte.'], ['5.3', 'Wij geven gegevens enkel door aan overheden of derden wanneer een wettelijke verplichting ons daartoe verplicht.']]
  }, {
    nr: '6',
    titel: 'Hoe wij uw gegevens beveiligen',
    clausules: [['6.1', 'Wij nemen passende technische en organisatorische maatregelen om uw gegevens te beschermen tegen verlies, misbruik en ongeoorloofde toegang. Fotos worden bij verzending ontdaan van verborgen locatiegegevens.']]
  }, {
    nr: '7',
    titel: 'Uw rechten',
    clausules: [['7.1', 'U heeft recht op inzage, verbetering en verwijdering van uw gegevens. U kan de verwerking laten beperken, bezwaar maken en uw gegevens laten overdragen.'], ['7.2', 'U oefent deze rechten uit via info@poortland.be. Wij antwoorden binnen de wettelijke termijn.'], ['7.3', 'Bent u niet tevreden over hoe wij met uw gegevens omgaan, dan kan u klacht indienen bij de Gegevensbeschermingsautoriteit, Drukpersstraat 35, 1000 Brussel, via contact@apd-gba.be.']]
  }, {
    nr: '8',
    titel: 'Cookies',
    clausules: [['8.1', 'Onze website gebruikt een beperkt aantal cookies. Meer daarover leest u in ons cookiebeleid.']]
  }, {
    nr: '9',
    titel: 'Wijzigingen',
    clausules: [['9.1', 'Wij kunnen dit privacybeleid aanpassen. De meest recente versie staat steeds op deze pagina.']]
  }];
  return /*#__PURE__*/React.createElement(BeleidPagina, {
    eyebrow: "Privacy",
    titel: "Privacybeleid",
    intro: "Poortland nv respecteert uw privacy en gaat zorgvuldig om met uw persoonsgegevens. Hieronder leest u hoe wij dat doen.",
    secties: secties,
    onNav: onNav
  });
}
function CookieNL({
  onNav
}) {
  React.useEffect(() => {
    document.title = 'Cookiebeleid | Poortland';
    if (window.scrollTo) window.scrollTo(0, 0);
  }, []);
  const secties = [{
    nr: '1',
    titel: 'Wat zijn cookies',
    clausules: [['1.1', 'Een cookie is een klein tekstbestand dat een website op uw toestel plaatst wanneer u de site bezoekt. Cookies laten de site onder meer toe om te werken en uw voorkeuren te onthouden.']]
  }, {
    nr: '2',
    titel: 'Welke cookies wij gebruiken',
    clausules: [['2.1', 'Wij gebruiken enkel strikt noodzakelijke cookies die de website laten werken. Deze onthouden bijvoorbeeld uw taalkeuze en beveiligen het contactformulier tegen misbruik.'], ['2.2', 'Wij plaatsen geen cookies voor advertenties en wij volgen uw surfgedrag niet voor marketingdoeleinden.'], ['2.3', 'Voor de beveiliging van onze formulieren kan een dienst van een derde partij een technische cookie plaatsen, enkel om geautomatiseerd misbruik tegen te gaan.']]
  }, {
    nr: '3',
    titel: 'Uw cookies beheren',
    clausules: [['3.1', 'U kan cookies steeds beheren of verwijderen via de instellingen van uw browser. Het uitschakelen van noodzakelijke cookies kan de werking van de site beperken.']]
  }, {
    nr: '4',
    titel: 'Wijzigingen',
    clausules: [['4.1', 'Wij kunnen dit cookiebeleid aanpassen. De meest recente versie staat steeds op deze pagina.']]
  }, {
    nr: '5',
    titel: 'Contact',
    clausules: [['5.1', 'Heeft u vragen over dit cookiebeleid, mail dan naar info@poortland.be.']]
  }];
  return /*#__PURE__*/React.createElement(BeleidPagina, {
    eyebrow: "Cookies",
    titel: "Cookiebeleid",
    intro: "Onze website gebruikt een beperkt aantal cookies. Hieronder leest u welke en waarom.",
    secties: secties,
    onNav: onNav
  });
}

/* ---- Automatisering: techniekers, fabrikanten en foto's in de huisstijl ---- */
function AutomatiseringNL({
  onNav
}) {
  const offerte = () => window.dispatchEvent(new CustomEvent('pl-offerte-open', {
    detail: {
      service: 'automatisering'
    }
  }));
  React.useEffect(() => {
    document.title = 'Automatisering van poorten | Poortland Mechelen';
    if (window.scrollTo) window.scrollTo(0, 0);
  }, []);
  const groepenA = [['Aandrijvingen draai en schuifmotoren', ['Faac', 'Gibidi']], ['Elektronische sturingskasten', ['Faac', 'V2', 'Gibidi']], ['Garagepoortmotoren', ['Faac', 'Seip']]];
  const groepenB = [['Zenders en ontvangers', ['Faac', 'MAC', 'V2', 'Gibidi', 'Seip', 'Cardin', 'Hormann', 'Sommer', 'Nice', 'Came', 'Marantec', 'Novoferm']], ['Parlofonie en videofonie', ['Fasttel', 'Siedle', 'Aiphone', 'Bitron']]];
  const Groep = ({
    titel,
    merken
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 26
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--accent)',
      marginBottom: 12
    }
  }, titel), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, merken.map(m => /*#__PURE__*/React.createElement("span", {
    key: m,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-body)',
      background: 'var(--surface-card)',
      border: '1px solid var(--line-on-light-soft)',
      borderRadius: 999,
      padding: '6px 14px'
    }
  }, m))));
  const Foto = ({
    src,
    alt
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--line-on-light-soft)',
      boxShadow: 'var(--shadow-lg)',
      aspectRatio: '4 / 3',
      background: 'var(--surface-paper-2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      padding: '0 16px',
      textAlign: 'center'
    }
  }, alt), /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    loading: "lazy",
    onError: e => {
      e.currentTarget.style.display = 'none';
    },
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '84px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SEyebrow, {
    dark: true,
    style: {
      marginBottom: 20
    }
  }, "Automatisering"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 58,
      lineHeight: 1.04,
      letterSpacing: '-0.01em',
      color: 'var(--stone-100)',
      margin: 0
    }
  }, "Automatisering van poorten"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 18,
      lineHeight: 1.6,
      color: 'var(--stone-300)',
      maxWidth: '48ch',
      margin: '24px 0 32px'
    }
  }, "Open en sluit uw poort comfortabel met een druk op de knop of op afstand. Poortland automatiseert nieuwe en bestaande poorten."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(SButton, {
    variant: "primary",
    arrow: true,
    as: "button",
    onClick: offerte
  }, "Vraag een offerte aan"), /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    dark: true,
    arrow: true,
    onClick: () => onNav('onderhoud')
  }, "Plan onderhoud"))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '64px 44px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 900,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.75,
      color: 'var(--text-body)',
      margin: 0
    }
  }, "Poortland beschikt over twee vakkundige techniekers niveau A2 elektromechanica die uw poorten voorzien van automatische opening en sluiting op afstand, voor draaipoorten, schuifpoorten en garagepoorten. Zij installeren ook hoogwaardige installaties voor parlofonie en videofonie. Poortland werkt uitsluitend met kwalitatieve materialen die een lange levensduur garanderen, omdat een geautomatiseerde poort uw comfort hoort te verhogen. Ook het automatiseren van garagepoorten behoort tot het werkterrein van onze techniekers. Hieronder een overzicht van onze samenwerking met verschillende fabrikanten.")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '40px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pl-split",
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 56,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(Foto, {
    src: "media/automatisering-1.jpg",
    alt: "Geautomatiseerde schuifpoort van Poortland"
  })), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", null, groepenA.map(([t, m]) => /*#__PURE__*/React.createElement(Groep, {
    key: t,
    titel: t,
    merken: m
  })))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '20px 44px 84px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pl-split",
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 56,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", null, groepenB.map(([t, m]) => /*#__PURE__*/React.createElement(Groep, {
    key: t,
    titel: t,
    merken: m
  })))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement(Foto, {
    src: "media/automatisering-2.jpg",
    alt: "Automatische sierpoort in smeedijzer van Poortland"
  })))), /*#__PURE__*/React.createElement(CTASectie, {
    onNav: onNav,
    dark: true
  }));
}
Object.assign(window, {
  OfferteModal,
  PaginaNL,
  PAGINAS,
  CategoriePagina,
  CATEGORIEEN,
  OverkappingenNL,
  VoorwaardenNL,
  GarantieNL,
  AutomatiseringNL,
  PrivacyNL,
  CookieNL,
  OverOnsNL,
  Teller,
  MobileNav,
  MENU,
  DesktopNav,
  useIsMobile,
  Reveal,
  GateImage,
  Monogram,
  TaalWisselaar,
  Nav,
  TaalBanner,
  ClaimBalk,
  FAQ,
  CTASectie,
  Footer,
  FooterKol,
  SectieKop,
  FotoBanner
});
})();
