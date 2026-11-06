/* @ds-bundle: {"format":3,"namespace":"PoortlandDesignSystem_6dcc8b","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"}],"sourceHashes":{"components/core/Button.jsx":"384d9a3c0186","components/core/Card.jsx":"aa3d3e680a2d","components/core/Eyebrow.jsx":"00d1ee767500","components/core/Tag.jsx":"b2e45b36b4e1","components/forms/Input.jsx":"57901ac9863e","export/Poortland-website-NL/About-nl.jsx":"ec7798f30936","export/Poortland-website-NL/Collection-nl.jsx":"d30c3f2acede","export/Poortland-website-NL/Contact-nl.jsx":"cf5b20735fb3","export/Poortland-website-NL/Home-nl.jsx":"4ca59f8db4c8","export/Poortland-website-NL/Process-nl.jsx":"68492134defe","export/Poortland-website-NL/Product-nl.jsx":"699a4839aae7","export/Poortland-website-NL/ProjectDetail-nl.jsx":"8683e42f7056","export/Poortland-website-NL/data-nl.jsx":"9e14b9d53c97","export/Poortland-website-NL/ds-bundle.js":"def80ce03e95","export/Poortland-website-NL/shared-nl.jsx":"a4d5df133ed7","ui_kits/website-nl-licht/About-nl.jsx":"ec7798f30936","ui_kits/website-nl-licht/Collection-nl.jsx":"d30c3f2acede","ui_kits/website-nl-licht/Contact-nl.jsx":"ca6ca762d819","ui_kits/website-nl-licht/Home-nl.jsx":"27b86fe66c69","ui_kits/website-nl-licht/Process-nl.jsx":"68492134defe","ui_kits/website-nl-licht/Product-nl.jsx":"699a4839aae7","ui_kits/website-nl-licht/ProjectDetail-nl.jsx":"8683e42f7056","ui_kits/website-nl-licht/data-nl.jsx":"9e14b9d53c97","ui_kits/website-nl-licht/shared-nl.jsx":"d993f6ce00bc","ui_kits/website-nl/About-nl.jsx":"ec7798f30936","ui_kits/website-nl/Collection-nl.jsx":"d30c3f2acede","ui_kits/website-nl/Contact-nl.jsx":"a1dbf9f4df94","ui_kits/website-nl/Home-nl.jsx":"27b86fe66c69","ui_kits/website-nl/Process-nl.jsx":"68492134defe","ui_kits/website-nl/Product-nl.jsx":"699a4839aae7","ui_kits/website-nl/ProjectDetail-nl.jsx":"8683e42f7056","ui_kits/website-nl/data-nl.jsx":"9e14b9d53c97","ui_kits/website-nl/shared-nl.jsx":"7e87e95693f2","ui_kits/website/Collection.jsx":"5326313e9382","ui_kits/website/Contact.jsx":"17d32d001a11","ui_kits/website/Home.jsx":"696143a9e830","ui_kits/website/Process.jsx":"e6d37f7c5ba2","ui_kits/website/ProjectDetail.jsx":"e5212d25a979","ui_kits/website/shared.jsx":"750642f13436"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.PoortlandDesignSystem_6dcc8b = window.PoortlandDesignSystem_6dcc8b || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Poortland — Button
 * Architectural, square-leaning. Bronze is the primary metal fill;
 * secondary is a hairline outline; ghost is a quiet underline link.
 * Set `dark` when placing on the forest ground.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  dark = false,
  arrow = false,
  disabled = false,
  as = 'button',
  ...rest
}) {
  const sizes = {
    sm: {
      fontSize: 12,
      padding: '8px 16px',
      letterSpacing: '0.14em'
    },
    md: {
      fontSize: 13,
      padding: '12px 24px',
      letterSpacing: '0.16em'
    },
    lg: {
      fontSize: 14,
      padding: '16px 34px',
      letterSpacing: '0.18em'
    }
  };
  const base = {
    fontFamily: 'var(--font-label)',
    fontWeight: 600,
    textTransform: 'uppercase',
    // Was lineHeight 1 met whiteSpace nowrap. Lange labels in het Duits en het
    // Frans maakten de knop dan 586 px breed op een scherm van 390 px, waardoor
    // ze buiten beeld viel. Nu wrapt het label en blijft de knop binnen zijn
    // kolom (WCAG 1.4.10 Reflow).
    lineHeight: 1.25,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.6em',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'background var(--dur) var(--ease-out), color var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out)',
    whiteSpace: 'normal',
    textAlign: 'center',
    maxWidth: '100%',
    textDecoration: 'none',
    ...sizes[size]
  };
  const variants = {
    primary: {
      background: 'var(--bronze-500)',
      color: 'var(--forest-950)',
      borderColor: 'var(--bronze-500)'
    },
    secondary: dark ? {
      background: 'transparent',
      color: 'var(--stone-200)',
      borderColor: 'var(--line-on-dark)'
    } : {
      background: 'transparent',
      color: 'var(--text-heading)',
      borderColor: 'var(--line-on-light)'
    },
    ghost: dark ? {
      background: 'transparent',
      color: 'var(--stone-200)',
      borderColor: 'transparent',
      padding: '10px 4px'
    } : {
      background: 'transparent',
      color: 'var(--text-heading)',
      borderColor: 'transparent',
      padding: '10px 4px'
    }
  };
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      ...base,
      ...variants[variant]
    },
    disabled: as === 'button' ? disabled : undefined,
    onMouseEnter: e => {
      if (disabled) return;
      if (variant === 'primary') {
        e.currentTarget.style.background = 'var(--bronze-400)';
        e.currentTarget.style.borderColor = 'var(--bronze-400)';
      } else if (variant === 'secondary') {
        e.currentTarget.style.borderColor = 'var(--bronze-500)';
        e.currentTarget.style.color = 'var(--accent)';
      } else {
        e.currentTarget.style.color = 'var(--accent)';
      }
    },
    onMouseLeave: e => {
      const v = variants[variant];
      e.currentTarget.style.background = v.background;
      e.currentTarget.style.borderColor = v.borderColor;
      e.currentTarget.style.color = v.color;
    }
  }, rest), children, arrow && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      fontWeight: 400
    }
  }, "\u2197"));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Poortland — Eyebrow
 * The uppercase tracked label that sits above headings. Bronze by default.
 */
function Eyebrow({
  children,
  dark = false,
  tone = 'accent',
  as = 'div',
  ...rest
}) {
  const colors = {
    // --accent-label is dieper dan --accent: kleine kapitalen op 10 px
    // haalden anders maar 3.87 contrast op de warme gronden (WCAG 1.4.3).
    accent: 'var(--accent-label, var(--accent))',
    muted: dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)',
    plain: dark ? 'var(--stone-200)' : 'var(--text-heading)'
  };
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 'var(--text-2xs)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-label)',
      color: colors[tone],
      display: 'block'
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Poortland — Card
 * Editorial project / product card. Image on top (pass `image` URL or a
 * children node for a custom media slot), then eyebrow, serif title, meta.
 * Quiet by default; lifts gently on hover.
 */
function Card({
  image,
  imageAlt = '',
  eyebrow,
  title,
  meta,
  href,
  children,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const Root = href ? 'a' : 'div';
  return /*#__PURE__*/React.createElement(Root, _extends({
    href: href,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'block',
      textDecoration: 'none',
      background: 'var(--surface-card)',
      border: '1px solid var(--line-on-light-soft)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-xs)',
      transform: hover ? 'translateY(-3px)' : 'none',
      transition: 'box-shadow var(--dur) var(--ease-out), transform var(--dur) var(--ease-out)'
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '4 / 3',
      background: 'var(--forest-800)',
      overflow: 'hidden'
    }
  }, children ? children : image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: imageAlt,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      transform: hover ? 'scale(1.04)' : 'scale(1)',
      transition: 'transform var(--dur-slow) var(--ease-out)'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-on-dark-faint)',
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      letterSpacing: '0.2em',
      textTransform: 'uppercase'
    }
  }, "Image")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 20px 22px'
    }
  }, eyebrow && /*#__PURE__*/React.createElement(__ds_scope.Eyebrow, {
    style: {
      marginBottom: 8
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 24,
      lineHeight: 1.12,
      color: 'var(--text-heading)',
      letterSpacing: '-0.01em'
    }
  }, title), meta && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-muted)',
      marginTop: 8
    }
  }, meta)));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Poortland — Tag
 * A small chip for materials and gate types. Hairline outline by default,
 * `solid` for a filled bronze chip. Uppercase, tracked, square corners.
 */
function Tag({
  children,
  variant = 'outline',
  dark = false,
  ...rest
}) {
  const styles = {
    outline: dark ? {
      background: 'transparent',
      color: 'var(--stone-200)',
      border: '1px solid var(--line-on-dark)'
    } : {
      background: 'transparent',
      color: 'var(--text-body)',
      border: '1px solid var(--line-on-light)'
    },
    solid: {
      background: 'var(--bronze-500)',
      color: 'var(--forest-950)',
      border: '1px solid var(--bronze-500)'
    },
    olive: {
      background: 'var(--olive-500)',
      color: 'var(--stone-50)',
      border: '1px solid var(--olive-500)'
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      padding: '5px 11px',
      borderRadius: 'var(--radius-xs)',
      display: 'inline-flex',
      alignItems: 'center',
      lineHeight: 1,
      ...styles[variant]
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Poortland — Input
 * Labelled text field. Hairline underline-forward style on paper, bronze
 * focus. Set `as="textarea"` for multi-line. Pass `dark` on forest ground.
 */
function Input({
  label,
  hint,
  id,
  as = 'input',
  dark = false,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const fieldId = id || (label ? String(label).toLowerCase().replace(/\s+/g, '-') : undefined);
  const Tag = as;
  const fg = dark ? 'var(--stone-200)' : 'var(--text-heading)';
  const line = dark ? 'var(--line-on-dark)' : 'var(--line-on-light)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.16em',
      color: dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement(Tag, _extends({
    id: fieldId,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    rows: as === 'textarea' ? 4 : undefined,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      color: fg,
      background: 'transparent',
      border: 0,
      borderBottom: `1.5px solid ${focus ? 'var(--bronze-500)' : line}`,
      padding: '10px 2px',
      outline: 'none',
      width: '100%',
      resize: as === 'textarea' ? 'vertical' : undefined,
      transition: 'border-color var(--dur) var(--ease-out)',
      ...style
    }
  }, rest)), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      color: dark ? 'var(--text-on-dark-faint)' : 'var(--text-faint)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// export/Poortland-website-NL/About-nl.jsx
try { (() => {
/* Poortland — Nederlandse website. Over Poortland en atelier. */
const {
  Button: AbButton,
  Eyebrow: AbEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function AboutNL({
  onNav
}) {
  const {
    GateImage,
    Reveal,
    ClaimBalk,
    CTASectie,
    SectieKop
  } = window;
  const vakmanschap = [['Handwerk', 'Elke poort wordt met de hand getekend, gelast en afgewerkt. Geen samengesteld pakket, maar één object.'], ['Belgische productie', 'Alles gebeurt in ons eigen atelier in Gent. Geen import, geen tussenschakels.'], ['Materiaalkennis', 'Wij kennen het gedrag van eik, aluminium, staal en cortenstaal, en kiezen wat past bij uw woning.'], ['Detailzorg', 'Verhouding, ritme en afwerking worden tot in het detail uitgewerkt en gecontroleerd.'], ['Eigen plaatsers', 'Onze eigen techniekers plaatsen en stellen af. Zij kennen de poort die zij monteren.'], ['Automatisatie', 'Wij integreren betrouwbare, verdoken aandrijving en blijven beschikbaar voor de opvolging.']];
  const cijfers = [['1992', 'Opgericht'], ['100%', 'Handgemaakt'], ['320+', 'Woningen'], ['4', 'Materialen']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '72px 44px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 860
    }
  }, /*#__PURE__*/React.createElement(AbEyebrow, {
    dark: true,
    style: {
      marginBottom: 22
    }
  }, "Over Poortland"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 60,
      color: 'var(--stone-100)',
      margin: 0,
      lineHeight: 1.05,
      letterSpacing: '-0.01em'
    }
  }, "Een poort is de eerste indruk van het huis."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 19,
      lineHeight: 1.6,
      color: 'var(--stone-300)',
      maxWidth: '52ch',
      marginTop: 24
    }
  }, "Sinds 1992 ontwerpt, maakt en plaatst Poortland handgemaakte toegangspoorten en hekwerken op maat. Voor woningen waar uitstraling, veiligheid en afwerking samenkomen, en voor mensen die kwaliteit boven snelheid verkiezen."))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 56,
      paddingBottom: 0
    }
  }, /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: "dusk",
    ratio: "21 / 9",
    slats: 15,
    label: "Atelier en showroom \xB7 Gent",
    radius: 8
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 0,
      paddingTop: 56,
      paddingBottom: 0
    }
  }, /*#__PURE__*/React.createElement(ClaimBalk, {
    dark: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4
    }
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '90px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 72,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    eyebrow: "Wie wij zijn",
    titel: "Belgisch vakmanschap, generatie na generatie.",
    max: "18ch"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16.5,
      lineHeight: 1.75,
      color: 'var(--text-body)',
      margin: '24px 0 0',
      maxWidth: '56ch'
    }
  }, "Poortland groeide van een klein smederijatelier tot een gespecialiseerde maker van architecturale poorten. Wat onveranderd bleef, is de overtuiging dat een toegang met de hand hoort te worden gemaakt, afgestemd op de woning en gebouwd om te blijven."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16.5,
      lineHeight: 1.75,
      color: 'var(--text-body)',
      margin: '18px 0 0',
      maxWidth: '56ch'
    }
  }, "Wij werken voor villa eigenaars, renovatieklanten en eigenaars van landelijke en moderne woningen, en zijn een betrouwbare uitvoerende partner voor architecten, tuinarchitecten en aannemers.")), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: "corten",
    ratio: "4 / 5",
    slats: 7,
    label: "Smeedwerk \xB7 detail",
    radius: 8,
    zoom: true
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '90px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    dark: true,
    align: "center",
    eyebrow: "Atelier en vakmanschap",
    titel: "Hoe een Poortland poort ontstaat.",
    intro: "Geen import, maar maatwerk onder \xE9\xE9n dak. Van de eerste tekening tot de laatste afwerking blijft elke stap in eigen handen."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 1,
      marginTop: 48,
      background: 'var(--line-on-dark-soft)',
      border: '1px solid var(--line-on-dark-soft)'
    }
  }, vakmanschap.map(([t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: t,
    delay: i % 3 * 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--forest-900)',
      padding: '30px 30px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 25,
      color: 'var(--stone-100)',
      marginBottom: 8
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14.5,
      lineHeight: 1.65,
      color: 'var(--text-on-dark-muted)',
      margin: 0
    }
  }, d))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 24,
      marginTop: 56
    }
  }, cijfers.map(([n, l], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: l,
    delay: i * 70
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 50,
      color: 'var(--stone-100)',
      lineHeight: 1
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 10.5,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--text-on-dark-muted)',
      marginTop: 10
    }
  }, l))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '90px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '0.9fr 1.1fr',
      gap: 64,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(GateImage, {
    tone: "morning",
    ratio: "4 / 3",
    slats: 9,
    label: "Plaatsing \xB7 ter plaatse",
    radius: 8,
    zoom: true
  })), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement(SectieKop, {
    eyebrow: "Service na verkoop",
    titel: "Zekerheid op lange termijn.",
    max: "18ch"
  }), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: '24px 0 0',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, ['Poortland blijft bereikbaar na de plaatsing.', 'Service is voor ons een onderdeel van kwaliteit.', 'Onderhoud en herstellingen worden professioneel opgevolgd.', 'Automatisatie houden wij betrouwbaar in gebruik.'].map(t => /*#__PURE__*/React.createElement("li", {
    key: t,
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)',
      fontFamily: 'var(--font-display)',
      fontSize: 16,
      flex: '0 0 auto'
    }
  }, "\u2014"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      lineHeight: 1.55,
      color: 'var(--text-body)'
    }
  }, t))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '84px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(AbEyebrow, {
    dark: true,
    style: {
      marginBottom: 18
    }
  }, "Showroom"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 44,
      color: 'var(--stone-100)',
      margin: '0 auto 18px',
      maxWidth: '20ch',
      lineHeight: 1.08
    }
  }, "Ervaar de materialen van dichtbij."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      maxWidth: '50ch',
      margin: '0 auto 32px'
    }
  }, "In onze showroom in Gent ziet en voelt u de materialen, afwerkingen en bewegingen. Een bezoek gebeurt op afspraak, zodat wij rustig de tijd voor u nemen."), /*#__PURE__*/React.createElement(AbButton, {
    variant: "primary",
    size: "lg",
    arrow: true,
    onClick: () => onNav('contact')
  }, "Bezoek onze showroom")))), /*#__PURE__*/React.createElement(CTASectie, {
    onNav: onNav,
    dark: false
  }));
}
window.AboutNL = AboutNL;
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/Poortland-website-NL/About-nl.jsx", error: String((e && e.message) || e) }); }

// export/Poortland-website-NL/Collection-nl.jsx
try { (() => {
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
  const materialen = ['Alle', 'Hout', 'Aluminium', 'Cortenstaal', 'Staal en hout', 'Smeedijzer'];
  const types = ['Alle', 'Schuifpoort', 'Draaipoort', 'Hekwerk'];
  const [mat, setMat] = React.useState('Alle');
  const [type, setType] = React.useState('Alle');
  const shown = PROJECTEN.filter(p => (mat === 'Alle' || p.materiaal === mat) && (type === 'Alle' || p.poorttype === type));
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
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/Poortland-website-NL/Collection-nl.jsx", error: String((e && e.message) || e) }); }

// export/Poortland-website-NL/Contact-nl.jsx
try { (() => {
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
  }, "\u25BE")));
}
function ContactNL({
  onNav
}) {
  const {
    Reveal
  } = window;
  const [sent, setSent] = React.useState(false);
  const [type, setType] = React.useState('');
  const [akkoord, setAkkoord] = React.useState(false);
  const [bestand, setBestand] = React.useState('');
  const typeOpties = [{
    value: '',
    label: 'Kies een type aanvraag'
  }, {
    value: 'nieuwe-poort',
    label: 'Nieuwe poort'
  }, {
    value: 'hekwerk',
    label: 'Hekwerk'
  }, {
    value: 'automatisatie',
    label: 'Automatisatie'
  }, {
    value: 'onderhoud',
    label: 'Onderhoud of service'
  }, {
    value: 'showroom',
    label: 'Showroombezoek'
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
  }, "Vertel kort iets over uw woning, de opening en het gevoel dat u zoekt. Wij nemen persoonlijk contact op en plannen een adviesgesprek met plaatsbezoek en opmeting."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 42,
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, [['Atelier en showroom', 'Dok Noord 4, 9000 Gent'], ['Telefoon', '+32 9 224 18 70'], ['Email', 'hallo@poortland.be'], ['Openingsuren', 'Open op afspraak, maandag tot zaterdag']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
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
      color: 'var(--stone-200)'
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
    src: "assets/mono-on-dark.png",
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
  }, "Uw aanvraag is bij het atelier."), /*#__PURE__*/React.createElement("p", {
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
      setType('');
      setAkkoord(false);
      setBestand('');
    }
  }, "Nieuwe aanvraag"))) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      if (!akkoord) return;
      setSent(true);
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Type aanvraag",
    value: type,
    onChange: e => setType(e.target.value),
    opties: typeOpties
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(CoInput, {
    label: "Naam",
    dark: true,
    placeholder: "Uw naam",
    required: true
  }), /*#__PURE__*/React.createElement(CoInput, {
    label: "Email",
    dark: true,
    type: "email",
    placeholder: "u@voorbeeld.be",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(CoInput, {
    label: "Telefoon",
    dark: true,
    type: "tel",
    placeholder: "+32 ..."
  }), /*#__PURE__*/React.createElement(CoInput, {
    label: "Gemeente",
    dark: true,
    placeholder: "bv. Knokke Heist"
  })), /*#__PURE__*/React.createElement(CoInput, {
    label: "Omschrijving van uw project",
    dark: true,
    as: "textarea",
    placeholder: "De opening is ongeveer 4 meter, een schuifpoort voor de oprit ..."
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Gewenste timing",
    value: '',
    onChange: () => {},
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
  }, "Kies bestand \u2197"), /*#__PURE__*/React.createElement("input", {
    type: "file",
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
    onClick: () => setAkkoord(!akkoord),
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
  }, "Ik ga akkoord met de verwerking van mijn gegevens om mijn aanvraag te behandelen, volgens het privacybeleid.")), /*#__PURE__*/React.createElement("div", {
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
  }, "Vrijblijvend \xB7 antwoord binnen twee werkdagen"), /*#__PURE__*/React.createElement(CoButton, {
    variant: "primary",
    arrow: true,
    as: "button",
    type: "submit",
    disabled: !akkoord
  }, "Verstuur aanvraag"))))))));
}
window.ContactNL = ContactNL;
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/Poortland-website-NL/Contact-nl.jsx", error: String((e && e.message) || e) }); }

// export/Poortland-website-NL/Home-nl.jsx
try { (() => {
/* Poortland — Nederlandse website. Homepage. */
const {
  Button: HButton,
  Tag: HTag,
  Eyebrow: HEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function HomeNL({
  onNav
}) {
  const {
    GateImage,
    Reveal,
    ClaimBalk,
    FAQ,
    CTASectie,
    SectieKop
  } = window;
  const {
    PROJECTEN,
    PRODUCTEN,
    WERKWIJZE,
    HOME_FAQ,
    ADVIES
  } = window;
  const uitgelicht = PROJECTEN.filter(p => p.uitgelicht).slice(0, 3);
  const routes = [['houten', 'Houten poorten', 'Warm en tijdloos'], ['aluminium', 'Aluminium poorten', 'Strak en onderhoudsarm'], ['schuif', 'Schuifpoorten', 'Voor brede opritten'], ['hekwerk', 'Hekwerken op maat', 'Eén doorlopend beeld']];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '72px 44px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.05fr 0.95fr',
      gap: 60,
      alignItems: 'center',
      paddingBottom: 64
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(HEyebrow, {
    dark: true,
    style: {
      marginBottom: 22
    }
  }, "Toegangspoorten \xB7 Belgi\xEB"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 72,
      lineHeight: 1.02,
      letterSpacing: '-0.01em',
      color: 'var(--stone-100)',
      margin: 0
    }
  }, "Architecturale poorten en hekwerken op maat.")), /*#__PURE__*/React.createElement(Reveal, {
    delay: 120
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 19,
      lineHeight: 1.6,
      color: 'var(--stone-300)',
      maxWidth: '48ch',
      margin: '26px 0 34px'
    }
  }, "Poortland ontwerpt, maakt en plaatst handgemaakte poorten en hekwerken voor woningen waar uitstraling, veiligheid en afwerking samenkomen."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(HButton, {
    variant: "primary",
    arrow: true,
    onClick: () => onNav('contact')
  }, "Plan een adviesgesprek"), /*#__PURE__*/React.createElement(HButton, {
    variant: "ghost",
    dark: true,
    arrow: true,
    onClick: () => onNav('realisaties')
  }, "Ontdek onze realisaties")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 44,
      marginTop: 54
    }
  }, [['1992', 'Sinds'], ['100%', 'Handgemaakt'], ['320+', 'Woningen']].map(([n, l]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 34,
      color: 'var(--stone-100)',
      lineHeight: 1
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 10,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--text-on-dark-muted)',
      marginTop: 7
    }
  }, l)))))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 8,
      overflow: 'hidden',
      position: 'relative',
      aspectRatio: '3 / 2',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/poort-oak-hero.jpeg",
    alt: "Handgemaakte houten poort van Poortland",
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
      background: 'linear-gradient(180deg, rgba(15,22,15,0) 55%, rgba(15,22,15,0.55) 100%)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 16,
      bottom: 14,
      fontFamily: 'var(--font-label)',
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'rgba(236,227,210,0.92)'
    }
  }, "Eik \xB7 handgemaakt in Belgi\xEB")))), /*#__PURE__*/React.createElement(ClaimBalk, {
    dark: true
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '92px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(HEyebrow, {
    style: {
      marginBottom: 20
    }
  }, "Over Poortland"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: 34,
      lineHeight: 1.32,
      color: 'var(--text-heading)',
      margin: 0,
      letterSpacing: '-0.005em'
    }
  }, "Poortland maakt toegangspoorten en hekwerken op maat voor woningen waar afwerking, veiligheid en uitstraling ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: 'var(--accent)'
    }
  }, "even belangrijk"), " zijn. Geen importproduct, maar Belgisch handwerk dat past bij de woning, de omgeving en het dagelijks gebruik.")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '90px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 40,
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(SectieKop, {
    dark: true,
    eyebrow: "Wat wij maken",
    titel: "Poorten, hekwerken en automatisatie.",
    max: "16ch"
  }), /*#__PURE__*/React.createElement(HButton, {
    variant: "secondary",
    dark: true,
    onClick: () => onNav('product', {
      productKey: 'houten'
    })
  }, "Alle poorten"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 18
    }
  }, routes.map(([key, naam, sub], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: key,
    delay: i * 80
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('product', {
      productKey: key
    }),
    style: {
      width: '100%',
      textAlign: 'left',
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--line-on-dark-soft)'
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: PRODUCTEN[key].tone,
    ratio: "4 / 5",
    label: naam,
    radius: 0,
    zoom: true,
    slats: key === 'hekwerk' ? 13 : 8
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 18px 22px',
      background: 'var(--forest-850)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      color: 'var(--stone-100)',
      lineHeight: 1.1
    }
  }, naam), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-on-dark-muted)',
      marginTop: 6
    }
  }, sub, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)'
    }
  }, "\u2197")))))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '92px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 40,
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(SectieKop, {
    eyebrow: "Uitgelichte realisaties",
    titel: "Elke poort vertelt een adres.",
    max: "16ch"
  }), /*#__PURE__*/React.createElement(HButton, {
    variant: "secondary",
    onClick: () => onNav('realisaties')
  }, "Alle realisaties"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, uitgelicht.map((p, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: p.id,
    delay: i * 90
  }, /*#__PURE__*/React.createElement(ProjectKaart, {
    project: p,
    onNav: onNav
  })))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      padding: '0 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      alignItems: 'stretch',
      minHeight: 540
    }
  }, /*#__PURE__*/React.createElement(Reveal, {
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '90px 56px 90px 0'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(HEyebrow, {
    dark: true,
    style: {
      marginBottom: 18
    }
  }, "Handwerk uit Belgi\xEB"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 46,
      color: 'var(--stone-100)',
      margin: 0,
      lineHeight: 1.06,
      letterSpacing: '-0.01em'
    }
  }, "Geen import,", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: 'var(--accent)'
    }
  }, "maar maatwerk"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      maxWidth: '46ch',
      margin: '22px 0 28px'
    }
  }, "Elke poort van Poortland wordt gemaakt met aandacht voor materiaal, verhouding en afwerking. Geen importoplossing, maar maatwerk dat past bij de woning, de omgeving en het dagelijks gebruik."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      marginBottom: 32
    }
  }, [['Eigen atelier', 'Snijden, lassen en afwerken onder één dak in Gent.'], ['Eigen plaatsers', 'Geen onderaanneming, wel onze eigen techniekers ter plaatse.'], ['Duurzame materialen', 'Eik, aluminium, staal en cortenstaal van hoge kwaliteit.']].map(([t, d]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)',
      fontFamily: 'var(--font-display)',
      fontSize: 16
    }
  }, "\u2014"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--stone-100)'
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      color: 'var(--text-on-dark-muted)',
      marginTop: 2
    }
  }, d))))), /*#__PURE__*/React.createElement(HButton, {
    variant: "ghost",
    dark: true,
    arrow: true,
    onClick: () => onNav('atelier')
  }, "Ontdek het atelier"))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 100,
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'stretch',
      width: '100%',
      padding: '40px 0 40px 0',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: "corten",
    ratio: "auto",
    label: "Atelier \xB7 Gent",
    radius: 8,
    slats: 7,
    zoom: true
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '90px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '0.85fr 1.15fr',
      gap: 60,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    dark: true,
    eyebrow: "Materialen en afwerking",
    titel: "Vier materialen, eindeloos verfijnd.",
    max: "14ch",
    intro: "Elke poort begint als een tekening en eindigt als \xE9\xE9n gelast object. Geen catalogus, geen twee dezelfde."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 14
    }
  }, [['Cortenstaal', 'Levende, verkleurende huid'], ['Aluminium', 'Geborsteld en gepoederlakt'], ['Eik en hout', 'Warme, massieve invulling'], ['Smeedstaal', 'Handgesmede profielen']].map(([m, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: m,
    delay: i * 70
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--line-on-dark-soft)',
      borderRadius: 'var(--radius-sm)',
      padding: '22px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      color: 'var(--stone-100)'
    }
  }, m), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-on-dark-muted)',
      marginTop: 6
    }
  }, d))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '92px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    align: "center",
    eyebrow: "Werkwijze",
    titel: "Van eerste advies tot perfecte plaatsing.",
    intro: "Een poort op maat vraagt meer dan een mooie tekening. Daarom start elk project met persoonlijk advies, een plaatsbezoek en een nauwkeurige opmeting."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 1,
      marginTop: 48,
      background: 'var(--line-on-light)',
      border: '1px solid var(--line-on-light)'
    }
  }, WERKWIJZE.map(([n, t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: n,
    delay: i % 3 * 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)',
      padding: '30px 28px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 38,
      color: 'var(--accent)',
      lineHeight: 0.9,
      marginBottom: 16
    }
  }, n), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 22,
      color: 'var(--text-heading)',
      margin: '0 0 8px'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      lineHeight: 1.6,
      color: 'var(--text-muted)',
      margin: 0
    }
  }, d))))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 40
    }
  }, /*#__PURE__*/React.createElement(HButton, {
    variant: "secondary",
    arrow: true,
    onClick: () => onNav('werkwijze')
  }, "Bekijk de volledige werkwijze")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '84px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(HEyebrow, {
    dark: true,
    style: {
      marginBottom: 18
    }
  }, "Service na verkoop"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontStyle: 'italic',
      fontSize: 32,
      color: 'var(--stone-100)',
      margin: '0 auto 14px',
      maxWidth: '26ch',
      lineHeight: 1.3
    }
  }, "\u201CEen poort is de eerste indruk van het huis. Wij zorgen dat die jarenlang klopt.\u201D"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      maxWidth: '52ch',
      margin: '0 auto'
    }
  }, "Poortland blijft bereikbaar na de plaatsing. Onderhoud en herstellingen worden professioneel opgevolgd, en automatisatie houden wij betrouwbaar in gebruik. Zekerheid op lange termijn hoort bij kwaliteit.")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '92px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 38,
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(SectieKop, {
    eyebrow: "Adviescentrum",
    titel: "Helder advies voor uw keuze.",
    max: "16ch"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, ADVIES.slice(0, 3).map(([titel, cat, sub], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: titel,
    delay: i * 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-md)',
      padding: '26px 26px 28px',
      height: '100%',
      background: 'var(--surface-card)',
      transition: 'box-shadow var(--dur) var(--ease-out), transform var(--dur) var(--ease-out)',
      cursor: 'pointer'
    },
    onMouseEnter: e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      e.currentTarget.style.transform = 'translateY(-3px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'none';
    },
    onClick: () => onNav('contact')
  }, /*#__PURE__*/React.createElement(HEyebrow, {
    style: {
      marginBottom: 14
    }
  }, cat), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 24,
      color: 'var(--text-heading)',
      margin: '0 0 10px',
      lineHeight: 1.18
    }
  }, titel), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      lineHeight: 1.6,
      color: 'var(--text-muted)',
      margin: 0
    }
  }, sub))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper-2)',
      padding: '92px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    align: "center",
    eyebrow: "Veelgestelde vragen",
    titel: "Wat klanten vaak vragen."
  })), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 44
    }
  }, /*#__PURE__*/React.createElement(FAQ, {
    items: HOME_FAQ
  }))))), /*#__PURE__*/React.createElement(CTASectie, {
    onNav: onNav,
    dark: true
  }));
}

/* Gedeelde realisatiekaart */
function ProjectKaart({
  project: p,
  onNav
}) {
  const {
    GateImage
  } = window;
  const {
    Eyebrow: KEyebrow
  } = window.PoortlandDesignSystem_6dcc8b;
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('project', {
      project: p
    }),
    style: {
      textAlign: 'left',
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--line-on-light-soft)',
      background: 'var(--surface-card)',
      transition: 'box-shadow var(--dur) var(--ease-out), transform var(--dur) var(--ease-out)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      e.currentTarget.style.transform = 'translateY(-3px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'none';
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: p.tone,
    ratio: "4 / 3",
    label: p.materiaal,
    radius: 0,
    zoom: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '17px 19px 21px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement(KEyebrow, null, p.regio), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      color: 'var(--text-faint)'
    }
  }, p.jaar)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      color: 'var(--text-heading)',
      lineHeight: 1.1,
      marginTop: 8
    }
  }, p.naam), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-muted)',
      marginTop: 6
    }
  }, p.poorttype, " \xB7 ", p.span))));
}
Object.assign(window, {
  HomeNL,
  ProjectKaart
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/Poortland-website-NL/Home-nl.jsx", error: String((e && e.message) || e) }); }

// export/Poortland-website-NL/Process-nl.jsx
try { (() => {
/* Poortland — Nederlandse website. Werkwijze. */
const {
  Button: WeButton,
  Eyebrow: WeEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function ProcessNL({
  onNav
}) {
  const {
    GateImage,
    Reveal,
    CTASectie,
    SectieKop
  } = window;
  const {
    WERKWIJZE
  } = window;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '72px 44px 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 0.82fr',
      gap: 60,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(WeEyebrow, {
    dark: true,
    style: {
      marginBottom: 20
    }
  }, "Werkwijze"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 62,
      color: 'var(--stone-100)',
      margin: 0,
      lineHeight: 1.02,
      letterSpacing: '-0.01em'
    }
  }, "Van eerste advies tot ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: 'var(--accent)'
    }
  }, "perfecte"), " plaatsing."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 18,
      lineHeight: 1.65,
      color: 'var(--stone-300)',
      maxWidth: '48ch',
      marginTop: 24
    }
  }, "Een poort op maat vraagt meer dan een mooie tekening. Daarom start elk project met persoonlijk advies, een plaatsbezoek en een nauwkeurige opmeting. Daarna volgt een voorstel dat rekening houdt met stijl, gebruik, veiligheid en afwerking.")), /*#__PURE__*/React.createElement(Reveal, {
    delay: 90
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: "corten",
    ratio: "4 / 5",
    slats: 6,
    label: "Atelier \xB7 Gent",
    radius: 8,
    zoom: true
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '88px 44px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto'
    }
  }, WERKWIJZE.map(([n, t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: n,
    delay: i % 2 * 70
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '120px 1fr',
      gap: 40,
      alignItems: 'start',
      padding: '36px 0',
      borderTop: '1px solid var(--line-on-light)',
      borderBottom: i === WERKWIJZE.length - 1 ? '1px solid var(--line-on-light)' : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 56,
      color: 'var(--accent)',
      lineHeight: 0.9
    }
  }, n), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 30,
      color: 'var(--text-heading)',
      margin: 0
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      lineHeight: 1.7,
      color: 'var(--text-body)',
      margin: '12px 0 0',
      maxWidth: '62ch'
    }
  }, d))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '40px 44px 90px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--forest-900)',
      borderRadius: 'var(--radius-lg)',
      padding: '48px 52px',
      color: 'var(--text-on-dark)',
      display: 'grid',
      gridTemplateColumns: '0.7fr 1.3fr',
      gap: 48,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 64,
      color: 'var(--stone-100)',
      lineHeight: 1
    }
  }, "6 \u2014 8"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--accent)',
      marginTop: 10
    }
  }, "weken gemiddeld")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(WeEyebrow, {
    dark: true,
    style: {
      marginBottom: 12
    }
  }, "Wat u mag verwachten"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16.5,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      margin: 0,
      maxWidth: '52ch'
    }
  }, "Er is altijd een plaatsbezoek en een adviesgesprek met opmeting. Het traject van eerste contact tot plaatsing duurt gemiddeld zes tot acht weken. Wij bevestigen een realistische planning bij het voorstel, en houden u onderweg op de hoogte.")))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '84px 44px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontStyle: 'italic',
      fontSize: 34,
      color: 'var(--stone-100)',
      maxWidth: '26ch',
      margin: '0 auto 28px',
      lineHeight: 1.25
    }
  }, "\u201CEen poort op maat begint bij luisteren. Pas daarna pakken wij het potlood.\u201D"), /*#__PURE__*/React.createElement(WeEyebrow, {
    dark: true,
    tone: "muted",
    style: {
      marginBottom: 34
    }
  }, "Het team van Poortland \xB7 Gent"), /*#__PURE__*/React.createElement(WeButton, {
    variant: "primary",
    size: "lg",
    arrow: true,
    onClick: () => onNav('contact')
  }, "Plan een adviesgesprek"))), /*#__PURE__*/React.createElement(CTASectie, {
    onNav: onNav,
    dark: false
  }));
}
window.ProcessNL = ProcessNL;
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/Poortland-website-NL/Process-nl.jsx", error: String((e && e.message) || e) }); }

// export/Poortland-website-NL/Product-nl.jsx
try { (() => {
/* Poortland — Nederlandse website. Productpagina (poorttype). */
const {
  Button: PrButton,
  Tag: PrTag,
  Eyebrow: PrEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function ProductNL({
  onNav,
  productKey
}) {
  const {
    GateImage,
    Reveal,
    FAQ,
    CTASectie,
    SectieKop,
    ProjectKaart
  } = window;
  const {
    PRODUCTEN,
    PRODUCT_VOLGORDE,
    PROJECTEN,
    WERKWIJZE
  } = window;
  const key = PRODUCTEN[productKey] ? productKey : 'houten';
  const p = PRODUCTEN[key];
  const relevant = (p.materiaalFilter ? PROJECTEN.filter(x => x.materiaal === p.materiaalFilter) : PROJECTEN).slice(0, 3);
  const shownProjects = relevant.length >= 3 ? relevant : PROJECTEN.slice(0, 3);
  const procesKort = WERKWIJZE.slice(0, 4);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '48px 44px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      marginBottom: 40
    }
  }, PRODUCT_VOLGORDE.map(k => {
    const active = k === key;
    return /*#__PURE__*/React.createElement("button", {
      key: k,
      onClick: () => onNav('product', {
        productKey: k
      }),
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
        color: active ? 'var(--forest-950)' : 'var(--text-on-dark-muted)',
        border: `1px solid ${active ? 'var(--bronze-500)' : 'var(--line-on-dark-soft)'}`,
        transition: 'all var(--dur) var(--ease-out)'
      }
    }, PRODUCTEN[k].naam);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 56,
      alignItems: 'center',
      paddingBottom: 56
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(PrEyebrow, {
    dark: true,
    style: {
      marginBottom: 18
    }
  }, p.kicker, " \xB7 op maat"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 60,
      color: 'var(--stone-100)',
      margin: 0,
      lineHeight: 1.03,
      letterSpacing: '-0.01em'
    }
  }, p.naam), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 18,
      lineHeight: 1.6,
      color: 'var(--stone-300)',
      maxWidth: '46ch',
      margin: '22px 0 32px'
    }
  }, p.intro), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(PrButton, {
    variant: "primary",
    arrow: true,
    onClick: () => onNav('contact')
  }, "Plan een adviesgesprek"), /*#__PURE__*/React.createElement(PrButton, {
    variant: "ghost",
    dark: true,
    arrow: true,
    onClick: () => onNav('realisaties')
  }, "Bekijk realisaties"))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 90
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      boxShadow: 'var(--shadow-lg)',
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: p.tone,
    ratio: "4 / 3",
    label: p.naam,
    radius: 8,
    zoom: true,
    slats: key === 'hekwerk' ? 14 : 9
  })))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '88px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.1fr 0.9fr',
      gap: 72,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(PrEyebrow, {
    style: {
      marginBottom: 16
    }
  }, "Het materiaal"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: 28,
      lineHeight: 1.35,
      color: 'var(--text-heading)',
      margin: 0
    }
  }, p.lead)), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper-2)',
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-md)',
      padding: '30px 30px 32px'
    }
  }, /*#__PURE__*/React.createElement(PrEyebrow, {
    style: {
      marginBottom: 18
    }
  }, "Voor wie"), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, p.voorWie.map((v, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)',
      fontFamily: 'var(--font-display)',
      fontSize: 16,
      flex: '0 0 auto'
    }
  }, "\u2014"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15.5,
      lineHeight: 1.55,
      color: 'var(--text-body)'
    }
  }, v)))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '88px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    dark: true,
    eyebrow: "Belangrijkste voordelen",
    titel: "Waarom dit type.",
    max: "14ch"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 1,
      marginTop: 44,
      background: 'var(--line-on-dark-soft)',
      border: '1px solid var(--line-on-dark-soft)'
    }
  }, p.voordelen.map(([t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: t,
    delay: i % 2 * 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--forest-900)',
      padding: '30px 32px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 26,
      color: 'var(--stone-100)',
      marginBottom: 8
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      lineHeight: 1.65,
      color: 'var(--text-on-dark-muted)',
      margin: 0,
      maxWidth: '46ch'
    }
  }, d))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '88px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 56
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-md)',
      padding: '32px 32px 36px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(PrEyebrow, {
    style: {
      marginBottom: 20
    }
  }, "Materialen"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10
    }
  }, p.materialen.map(m => /*#__PURE__*/React.createElement("span", {
    key: m,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-heading)',
      padding: '9px 16px',
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-paper-2)'
    }
  }, m))))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-md)',
      padding: '32px 32px 36px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(PrEyebrow, {
    style: {
      marginBottom: 20
    }
  }, "Afwerkingsmogelijkheden"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10
    }
  }, p.afwerking.map(m => /*#__PURE__*/React.createElement("span", {
    key: m,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-heading)',
      padding: '9px 16px',
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-paper-2)'
    }
  }, m))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper-2)',
      padding: '88px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    eyebrow: "Mogelijke stijlen",
    titel: "E\xE9n type, vele beelden.",
    max: "16ch"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24,
      marginTop: 44
    }
  }, p.stijlen.map(([t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: t,
    delay: i * 80
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(GateImage, {
    tone: p.tone,
    ratio: "4 / 3",
    label: t,
    radius: 6,
    zoom: true,
    slats: 6 + i * 3
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 23,
      color: 'var(--text-heading)',
      margin: '16px 0 6px'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      lineHeight: 1.6,
      color: 'var(--text-muted)',
      margin: 0,
      maxWidth: '40ch'
    }
  }, d))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '88px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 40,
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(SectieKop, {
    eyebrow: "Van advies tot plaatsing",
    titel: "Hoe uw poort tot stand komt.",
    max: "16ch"
  }), /*#__PURE__*/React.createElement(PrButton, {
    variant: "secondary",
    arrow: true,
    onClick: () => onNav('werkwijze')
  }, "Volledige werkwijze"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 1,
      background: 'var(--line-on-light)',
      border: '1px solid var(--line-on-light)'
    }
  }, procesKort.map(([n, t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: n,
    delay: i * 70
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)',
      padding: '28px 24px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 32,
      color: 'var(--accent)',
      lineHeight: 0.9,
      marginBottom: 14
    }
  }, n), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 20,
      color: 'var(--text-heading)',
      margin: '0 0 7px',
      lineHeight: 1.15
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      lineHeight: 1.55,
      color: 'var(--text-muted)',
      margin: 0
    }
  }, d))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '88px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 38,
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(SectieKop, {
    dark: true,
    eyebrow: "Relevante realisaties",
    titel: "Dit type, gerealiseerd.",
    max: "16ch"
  }), /*#__PURE__*/React.createElement(PrButton, {
    variant: "secondary",
    dark: true,
    onClick: () => onNav('realisaties')
  }, "Alle realisaties"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, shownProjects.map((pr, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: pr.id,
    delay: i * 80
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('project', {
      project: pr
    }),
    style: {
      textAlign: 'left',
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: pr.tone,
    ratio: "4 / 3",
    label: pr.materiaal,
    radius: 6,
    zoom: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 21,
      color: 'var(--stone-100)',
      marginTop: 14
    }
  }, pr.naam), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-on-dark-muted)',
      marginTop: 4
    }
  }, pr.regio, " \xB7 ", pr.poorttype))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper-2)',
      padding: '88px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    align: "center",
    eyebrow: "Veelgestelde vragen",
    titel: `Over ${p.naam.toLowerCase()}.`
  })), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 44
    }
  }, /*#__PURE__*/React.createElement(FAQ, {
    items: p.faq
  }))))), /*#__PURE__*/React.createElement(CTASectie, {
    onNav: onNav,
    dark: true
  }));
}
window.ProductNL = ProductNL;
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/Poortland-website-NL/Product-nl.jsx", error: String((e && e.message) || e) }); }

// export/Poortland-website-NL/ProjectDetail-nl.jsx
try { (() => {
/* Poortland — Nederlandse website. Projectdetailpagina. */
const {
  Button: DtButton,
  Tag: DtTag,
  Eyebrow: DtEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function ProjectDetailNL({
  project,
  onNav
}) {
  const {
    GateImage,
    Reveal,
    CTASectie
  } = window;
  const {
    PROJECTEN
  } = window;
  const p = project || PROJECTEN[0];
  const meer = PROJECTEN.filter(x => x.id !== p.id).slice(0, 3);
  const specs = [['Regio', p.regio], ['Type woning', p.woningtype], ['Materiaal', p.materiaal], ['Poorttype', p.poorttype], ['Stijl', p.stijl], ['Automatisatie', p.automatisatie], ['Breedte', p.span], ['Opgeleverd', p.jaar]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      padding: '36px 44px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('realisaties'),
    style: {
      background: 'none',
      border: 0,
      cursor: 'pointer',
      padding: 0,
      marginBottom: 22,
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-on-dark-muted)'
    }
  }, "\u2190 Terug naar realisaties"), /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(GateImage, {
    tone: p.tone,
    ratio: "21 / 9",
    slats: 13,
    label: `${p.naam} · ${p.regio}`,
    radius: 8
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '52px 44px 84px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.25fr 0.75fr',
      gap: 64
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(DtEyebrow, {
    style: {
      marginBottom: 16
    }
  }, p.regio, " \xB7 ", p.jaar), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 54,
      color: 'var(--text-heading)',
      margin: 0,
      letterSpacing: '-0.01em',
      lineHeight: 1.03
    }
  }, p.naam), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 20,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(DtTag, {
    variant: "solid"
  }, p.materiaal), /*#__PURE__*/React.createElement(DtTag, null, p.poorttype), /*#__PURE__*/React.createElement(DtTag, {
    variant: "olive"
  }, p.woningtype)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 36
    }
  }, /*#__PURE__*/React.createElement(DtEyebrow, {
    style: {
      marginBottom: 12
    }
  }, "De vraag van de klant"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.7,
      color: 'var(--text-body)',
      margin: 0,
      maxWidth: '58ch'
    }
  }, p.vraag)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 30
    }
  }, /*#__PURE__*/React.createElement(DtEyebrow, {
    style: {
      marginBottom: 12
    }
  }, "De oplossing van Poortland"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.7,
      color: 'var(--text-body)',
      margin: 0,
      maxWidth: '58ch'
    }
  }, p.oplossing)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 30
    }
  }, /*#__PURE__*/React.createElement(DtEyebrow, {
    style: {
      marginBottom: 12
    }
  }, "Details van afwerking"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      lineHeight: 1.7,
      color: 'var(--text-muted)',
      margin: 0,
      maxWidth: '58ch'
    }
  }, p.afwerking, " Gesneden, gelast en met de hand afgewerkt in ons atelier in Gent, en daarna ter plaatse geplaatst met verdoken automatisatie."))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("aside", null, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }
  }, specs.map(([k, v], i) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 18,
      padding: '14px 18px',
      borderBottom: i < specs.length - 1 ? '1px solid var(--line-on-light-soft)' : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-faint)'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-heading)',
      fontWeight: 500,
      textAlign: 'right'
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(DtButton, {
    variant: "primary",
    arrow: true,
    onClick: () => onNav('contact')
  }, "Vergelijkbaar project bespreken"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '52px auto 0'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(DtEyebrow, {
    style: {
      marginBottom: 18
    }
  }, "Fotogalerij"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: p.tone,
    ratio: "3 / 2",
    slats: 11,
    label: "Vooraanzicht",
    radius: 6,
    zoom: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateRows: '1fr 1fr',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: "stone",
    ratio: "auto",
    slats: 5,
    label: "Detail \xB7 profiel",
    radius: 6,
    zoom: true
  }), /*#__PURE__*/React.createElement(GateImage, {
    tone: "corten",
    ratio: "auto",
    slats: 7,
    label: "Detail \xB7 afwerking",
    radius: 6,
    zoom: true
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 820,
      margin: '64px auto 0',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontStyle: 'italic',
      fontSize: 28,
      lineHeight: 1.35,
      color: 'var(--text-heading)',
      margin: 0
    }
  }, "Een toegang die past bij de woning, het landschap en het dagelijks gebruik. Precies dat is maatwerk.")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '78px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(DtEyebrow, {
    dark: true,
    style: {
      marginBottom: 28
    }
  }, "Meer uit het atelier")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, meer.map((m, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: m.id,
    delay: i * 80
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('project', {
      project: m
    }),
    style: {
      textAlign: 'left',
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: m.tone,
    ratio: "4 / 3",
    label: m.materiaal,
    radius: 6,
    zoom: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 21,
      color: 'var(--stone-100)',
      marginTop: 13
    }
  }, m.naam), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-on-dark-muted)',
      marginTop: 4
    }
  }, m.regio, " \xB7 ", m.materiaal))))))), /*#__PURE__*/React.createElement(CTASectie, {
    onNav: onNav,
    dark: false
  }));
}
window.ProjectDetailNL = ProjectDetailNL;
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/Poortland-website-NL/ProjectDetail-nl.jsx", error: String((e && e.message) || e) }); }

// export/Poortland-website-NL/data-nl.jsx
try { (() => {
/* Poortland — Nederlandse website. Content en data.
   Alle teksten in premium Nederlands. Geen koppelteken, geen slashconstructies. */

/* ----------------------------- Realisaties ----------------------------- */
const PROJECTEN = [{
  id: 'duinhof',
  naam: 'Villa Duinhof',
  regio: 'Knokke Heist',
  materiaal: 'Cortenstaal',
  poorttype: 'Schuifpoort',
  woningtype: 'Moderne villa',
  stijl: 'Strak',
  automatisatie: 'Ja',
  span: '4,2 m',
  jaar: '2025',
  tone: 'corten',
  uitgelicht: true,
  vraag: 'Een ruime oprit aan de kust met zicht op de duinen vroeg om een poort die privacy geeft zonder de woning af te sluiten van het landschap.',
  oplossing: 'Een schuifpoort in cortenstaal met een rustig verticaal ritme. De levende roestlaag verdiept met het zeeklimaat en sluit warm aan bij de gevel in lichte steen.',
  afwerking: 'Natuurlijke cortenpatina, geborstelde randen, verdoken loopwiel.'
}, {
  id: 'lievens',
  naam: 'Maison Lievens',
  regio: 'Gent',
  materiaal: 'Aluminium',
  poorttype: 'Draaipoort',
  woningtype: 'Herenhuis',
  stijl: 'Klassiek verfijnd',
  automatisatie: 'Ja',
  span: '1,2 m',
  jaar: '2025',
  tone: 'morning',
  vraag: 'Een statig herenhuis in het centrum van Gent wenste een voetgangerspoort die discreet en duurzaam was, in lijn met de historische gevel.',
  oplossing: 'Een draaipoort in aluminium met fijne verticale spijlen en een mat gepoederlakte afwerking in dieptegroen. Onderhoudsarm en bestand tegen het stadsklimaat.',
  afwerking: 'Gepoederlakt in fijnstructuur, ingewerkt slot, zachte demping.'
}, {
  id: 'brael',
  naam: 'Hofstede Brael',
  regio: 'Sint Martens Latem',
  materiaal: 'Staal en hout',
  poorttype: 'Schuifpoort',
  woningtype: 'Landelijke woning',
  stijl: 'Landelijk warm',
  automatisatie: 'Ja',
  span: '5,0 m',
  jaar: '2024',
  tone: 'dusk',
  uitgelicht: true,
  vraag: 'Een gerenoveerde hofstede met een lange dreef vroeg om een brede toegang die robuust aanvoelt en toch warmte uitstraalt.',
  oplossing: 'Een schuifpoort met een gelakt stalen frame en een invulling in massieve eik. Het hout brengt warmte, het staal draagt de breedte en de automatisatie.',
  afwerking: 'Geolied eik, mat zwart staal, verdoken automatisatie in de fundering.'
}, {
  id: 'noordkaai',
  naam: 'Huis Noordkaai',
  regio: 'Antwerpen',
  materiaal: 'Aluminium',
  poorttype: 'Draaipoort',
  woningtype: 'Nieuwbouw',
  stijl: 'Strak',
  automatisatie: 'Ja',
  span: '3,6 m',
  jaar: '2024',
  tone: 'stone',
  vraag: 'Een moderne nieuwbouw aan de rand van Antwerpen zocht een dubbele oprijpoort die naadloos aansluit bij de horizontale lijnen van de architectuur.',
  oplossing: 'Een dubbele draaipoort in aluminium met brede horizontale lamellen. De poort volgt de gevelritmiek en sluit vlak af met de carport.',
  afwerking: 'Geborsteld aluminium, gepoederlakt antraciet, lineaire lamellen.'
}, {
  id: 'velden',
  naam: 'Domein Velden',
  regio: 'Leuven',
  materiaal: 'Smeedijzer',
  poorttype: 'Draaipoort',
  woningtype: 'Kasteelhoeve',
  stijl: 'Klassiek',
  automatisatie: 'Ja',
  span: '6,4 m',
  jaar: '2023',
  tone: 'dusk',
  vraag: 'Een historische kasteelhoeve vroeg om een statige toegang die het erfgoed eert en toch dagelijks comfortabel in gebruik is.',
  oplossing: 'Een brede draaipoort in handgesmeed staal met een sober klassiek profiel. Elk onderdeel werd met de hand geforceerd en gesmeed in het atelier.',
  afwerking: 'Handgesmeed staal, mat gelakt, smeedwerk per stuk afgewerkt.'
}, {
  id: 'strandvilla',
  naam: 'Strandvilla Negen',
  regio: 'Oostduinkerke',
  materiaal: 'Cortenstaal',
  poorttype: 'Schuifpoort',
  woningtype: 'Kustvilla',
  stijl: 'Strak',
  automatisatie: 'Ja',
  span: '2,8 m',
  jaar: '2023',
  tone: 'corten',
  vraag: 'Een kustvilla wenste maximale privacy aan de straatzijde zonder de woning gesloten te laten ogen.',
  oplossing: 'Een schuifpoort in cortenstaal met dichte privacylamellen die het zicht breken maar lucht doorlaten. De patina sluit aan bij het duinlandschap.',
  afwerking: 'Cortenstaal met privacylamellen, geborstelde geleiding.'
}, {
  id: 'eiksteen',
  naam: 'Eik en Steen',
  regio: 'Brasschaat',
  materiaal: 'Hout',
  poorttype: 'Draaipoort',
  woningtype: 'Villa',
  stijl: 'Tijdloos warm',
  automatisatie: 'Ja',
  span: '3,2 m',
  jaar: '2025',
  tone: 'dusk',
  uitgelicht: true,
  vraag: 'Een villa in het groen van Brasschaat zocht een warme houten poort die de woning verankert in haar bosrijke omgeving.',
  oplossing: 'Een draaipoort in massieve eik met een verticaal ritme dat de bomen weerspiegelt. Een verdoken stalen kader draagt de bewegende delen onzichtbaar.',
  afwerking: 'Massieve eik, natuurlijk geolied, verdoken stalen kern.'
}, {
  id: 'park',
  naam: 'Park Mechelen',
  regio: 'Mechelen',
  materiaal: 'Aluminium',
  poorttype: 'Hekwerk',
  woningtype: 'Moderne woning',
  stijl: 'Strak',
  automatisatie: 'Deels',
  span: '24 m hekwerk',
  jaar: '2024',
  tone: 'morning',
  vraag: 'Een ruime tuin vroeg om een doorlopend hekwerk met een geïntegreerde poort, in één rustig beeld.',
  oplossing: 'Een hekwerk op maat in aluminium met een geïntegreerde schuifpoort. Hek en poort delen hetzelfde lamelprofiel, zodat de toegang opgaat in het geheel.',
  afwerking: 'Gepoederlakt aluminium, doorlopend lamelprofiel, lijnverlichting.'
}];

/* ----------------------------- Producten ----------------------------- */
/* De productwisselaar toont de poortpagina voor elk type. Houten poorten is uitgewerkt
   als voorbeeldpagina; de andere types delen dezelfde rijke structuur. */
const PRODUCTEN = {
  houten: {
    key: 'houten',
    naam: 'Houten poorten',
    kicker: 'Hout',
    tone: 'dusk',
    materiaalFilter: 'Hout',
    intro: 'Warm, levend en tijdloos. Een houten poort verankert uw woning in haar omgeving en wordt mooier met de jaren.',
    lead: 'Hout is het meest tactiele materiaal dat wij verwerken. Wij kiezen voor duurzame eik en thermisch behandelde houtsoorten, gedragen door een verdoken stalen kern die de poort jarenlang recht en stil houdt.',
    voorWie: ['Villa\u2019s en landelijke woningen die warmte en natuurlijkheid zoeken.', 'Renovaties waar hout aansluit bij gevel, schrijnwerk of omgeving.', 'Woningen in het groen waar de poort moet opgaan in het landschap.'],
    voordelen: [['Warme uitstraling', 'Hout brengt diepte en karakter die geen ander materiaal evenaart.'], ['Levende materie', 'De nerf en de toon verdiepen met de jaren tot een eigen patina.'], ['Stabiele kern', 'Een verdoken stalen kader houdt de poort recht en draagt de automatisatie.'], ['Volledig op maat', 'Elke lat, verhouding en afwerking wordt voor uw opening getekend.']],
    materialen: ['Massieve eik', 'Thermisch verduurzaamd hout', 'Afromezi en hardhout', 'Verdoken stalen kern'],
    afwerking: ['Natuurlijk geolied', 'Mat gelakt op kleur', 'Geborsteld en geloogd', 'Combinatie met staal of inox'],
    stijlen: [['Verticaal ritme', 'Smalle latten in een rustig verticaal patroon. Tijdloos en discreet.'], ['Vlak en dicht', 'Brede planken vlak naast elkaar voor maximale privacy en rust.'], ['Hout en metaal', 'Een houten invulling in een fijn stalen of aluminium kader.']],
    faq: [['Hoeveel onderhoud vraagt een houten poort?', 'Een houten poort vraagt periodiek een onderhoudsbeurt met olie of lak, afhankelijk van houtsoort en oriëntatie. Wij adviseren bij oplevering een ritme en blijven beschikbaar voor de opvolging.'], ['Blijft een houten poort recht?', 'Ja. Wij bouwen elke houten poort op een verdoken stalen kern. Die draagt het gewicht en de beweging, zodat het hout enkel zichtbaar werk doet en stabiel blijft.'], ['Welke houtsoort past het best?', 'Dat hangt af van uw woning, de oriëntatie en het gewenste onderhoud. Eik straalt warmte uit, thermisch hout is bijzonder stabiel. Tijdens het adviesgesprek bekijken wij samen wat past.']]
  },
  metalen: {
    key: 'metalen',
    naam: 'Metalen poorten',
    kicker: 'Staal',
    tone: 'stone',
    materiaalFilter: 'Smeedijzer',
    intro: 'Sterk, strak en bestand tegen de tijd. Een stalen poort geeft uw toegang gewicht en precisie.',
    lead: 'Staal laat ons de fijnste lijnen en de breedste overspanningen maken. Van strak plaatwerk tot handgesmeed profiel, elke poort wordt gelast en afgewerkt als één geheel in ons atelier.',
    voorWie: ['Woningen die kracht, precisie en een lange levensduur zoeken.', 'Brede opritten waar staal de overspanning moeielloos draagt.', 'Klassieke en eigentijdse architectuur die strakke lijnen vraagt.'],
    voordelen: [['Maximale sterkte', 'Staal draagt grote breedtes en blijft strak over de jaren.'], ['Fijne lijnen', 'Dunne profielen en scherpe details die enkel in staal kunnen.'], ['Handgesmeed mogelijk', 'Klassiek smeedwerk per stuk geforceerd en afgewerkt.'], ['Duurzame lak', 'Een gepoederlakte of natte laklaag beschermt jarenlang.']],
    materialen: ['Geborsteld plaatstaal', 'Handgesmeed staal', 'Buisprofielen op maat', 'Inox accenten'],
    afwerking: ['Gepoederlakt op kleur', 'Mat of zijdeglans', 'Gegalvaniseerd als basis', 'Smeedwerk met de hand'],
    stijlen: [['Strak plaatwerk', 'Gesloten of geperforeerde panelen voor een rustig modern beeld.'], ['Verticale spijlen', 'Een klassiek ritme van fijne verticale staven.'], ['Smeedwerk', 'Handgesmede details voor erfgoed en klassieke villa\u2019s.']],
    faq: [['Roest een stalen poort?', 'Niet wanneer hij correct is voorbehandeld en afgewerkt. Wij galvaniseren of gronden elke stalen poort en brengen daarna een duurzame laklaag aan.'], ['Hoe breed kan een stalen poort?', 'Staal draagt ruime overspanningen. Voor brede opritten kiezen wij vaak een schuifpoort in staal, die ook bij grote breedtes stil en stabiel beweegt.'], ['Kan smeedwerk modern ogen?', 'Zeker. Wij vertalen klassiek smeedwerk naar rustige, eigentijdse profielen die passen bij zowel erfgoed als nieuwbouw.']]
  },
  aluminium: {
    key: 'aluminium',
    naam: 'Aluminium poorten',
    kicker: 'Aluminium',
    tone: 'morning',
    materiaalFilter: 'Aluminium',
    intro: 'Onderhoudsarm, licht en strak. Aluminium is de keuze voor wie rust en gemak voorop stelt.',
    lead: 'Aluminium roest niet en vraagt nauwelijks onderhoud. Het materiaal laat strakke lamellen en grote vlakken toe, gepoederlakt in elke gewenste kleur en structuur.',
    voorWie: ['Moderne woningen en nieuwbouw met horizontale lijnen.', 'Wie een onderhoudsarme poort wenst zonder in te boeten op uitstraling.', 'Kustwoningen waar het zeeklimaat extra weerstand vraagt.'],
    voordelen: [['Onderhoudsarm', 'Aluminium roest niet en blijft jarenlang strak en kleurvast.'], ['Licht in gewicht', 'Soepele beweging en minder belasting voor de automatisatie.'], ['Strakke lamellen', 'Horizontale of verticale lamellen voor een rustig modern beeld.'], ['Vrije kleurkeuze', 'Gepoederlakt in elke kleur en structuur die de gevel vraagt.']],
    materialen: ['Geëxtrudeerde lamellen', 'Vlakke panelen', 'Geperforeerd aluminium', 'Inox accenten'],
    afwerking: ['Gepoederlakt fijnstructuur', 'Mat of zijdeglans', 'Houtlook coating', 'Tweekleurig op aanvraag'],
    stijlen: [['Horizontale lamellen', 'Brede lamellen die de horizon van de architectuur volgen.'], ['Vlak en gesloten', 'Een rustig dicht paneel voor maximale privacy.'], ['Lamel en glas', 'Aluminium gecombineerd met glas of een groene invulling.']],
    faq: [['Verkleurt aluminium in de zon?', 'Een kwalitatieve poederlak is uv bestendig en blijft jarenlang kleurvast. Wij werken enkel met coatings die geschikt zijn voor buitengebruik aan zee en in de stad.'], ['Is aluminium sterk genoeg?', 'Voor de meeste woningpoorten zeker. Voor zeer brede overspanningen versterken wij het profiel of kiezen wij voor een schuifuitvoering.'], ['Kan aluminium op hout lijken?', 'Ja. Een houtlook coating geeft de warmte van hout met het gemak van aluminium, zonder periodiek onderhoud.']]
  },
  staalhout: {
    key: 'staalhout',
    naam: 'Combinatie staal en hout',
    kicker: 'Staal en hout',
    tone: 'dusk',
    materiaalFilter: 'Staal en hout',
    intro: 'Het beste van twee materialen. Een stalen kader draagt, een houten invulling verwarmt.',
    lead: 'De combinatie van staal en hout verenigt kracht en warmte. Het staal geeft fijne lijnen en draagt de breedte en de beweging, het hout brengt karakter en tactiliteit.',
    voorWie: ['Woningen die warmte willen zonder de strakheid los te laten.', 'Brede opritten waar staal draagt en hout verzacht.', 'Renovaties die oud en nieuw met elkaar willen verbinden.'],
    voordelen: [['Kracht en warmte', 'Staal draagt en lijnt, hout verzacht en verwarmt.'], ['Brede overspanning', 'Het stalen kader maakt grote breedtes mogelijk.'], ['Contrastrijk', 'Mat staal naast warm hout geeft diepte en karakter.'], ['Volledig op maat', 'Verhouding, ritme en toon worden samen bepaald.']],
    materialen: ['Stalen kader op maat', 'Massieve eik', 'Thermisch hout', 'Inox bevestiging'],
    afwerking: ['Mat zwart staal', 'Geolied hout', 'Tweekleurige combinatie', 'Verdoken bevestiging'],
    stijlen: [['Kader en invulling', 'Een strak stalen kader met een warme houten invulling.'], ['Horizontaal banden', 'Afwisselende banden in staal en hout.'], ['Vlak contrast', 'Een gesloten houten vlak in een fijne stalen lijst.']],
    faq: [['Werkt hout en staal goed samen?', 'Ja, mits correct opgebouwd. Wij scheiden de materialen technisch zodat ze onafhankelijk kunnen werken, en houden het beeld strak en stabiel.'], ['Wat draagt de poort?', 'Het stalen kader draagt het gewicht en de beweging. Het hout is de zichtbare invulling en blijft daardoor stabiel.'], ['Hoeveel onderhoud?', 'Het hout vraagt periodiek olie of lak, het staal nauwelijks. Wij adviseren een ritme bij oplevering.']]
  },
  schuif: {
    key: 'schuif',
    naam: 'Schuifpoorten',
    kicker: 'Poorttype',
    tone: 'corten',
    materiaalFilter: null,
    intro: 'De keuze voor brede opritten en beperkte ruimte. Een schuifpoort beweegt zijwaarts en vraagt geen zwenkruimte.',
    lead: 'Een schuifpoort glijdt opzij in plaats van open te draaien. Ideaal voor hellende opritten, beperkte diepte of grote breedtes. Wij maken hem in hout, aluminium, staal of cortenstaal.',
    voorWie: ['Brede opritten die geen zwenkruimte voor een draaipoort hebben.', 'Hellende terreinen waar een draaipoort niet vlot opent.', 'Wie een rustige, horizontale beweging verkiest.'],
    voordelen: [['Geen zwenkruimte', 'De poort schuift opzij en wint kostbare opritruimte.'], ['Geschikt voor breed', 'Grote overspanningen bewegen stil en stabiel.'], ['Werkt op een helling', 'Ook op hellend terrein blijft de beweging vlot.'], ['Robuuste geleiding', 'Een verdoken loopwerk draagt de poort jarenlang.']],
    materialen: ['Cortenstaal', 'Aluminium lamellen', 'Staal en hout', 'Massieve eik'],
    afwerking: ['Vrijdragend of op rail', 'Verdoken loopwiel', 'Privacylamellen', 'Geïntegreerde verlichting'],
    stijlen: [['Vrijdragend', 'Zonder rail op de grond, voor een vlakke en strakke oprit.'], ['Lamellen', 'Een rustig horizontaal ritme dat privacy met lucht combineert.'], ['Dicht paneel', 'Een gesloten vlak voor maximale beslotenheid.']],
    faq: [['Wat is een vrijdragende schuifpoort?', 'Een vrijdragende poort heeft geen rail in de grond. Hij wordt gedragen door een verdoken loopwerk naast de oprit, zodat de doorgang vlak en obstakelvrij blijft.'], ['Schuifpoort of draaipoort?', 'Een schuifpoort wint ruimte en werkt goed op hellingen en brede opritten. Een draaipoort is rustiger en klassieker bij voldoende plaats. Wij adviseren op basis van uw terrein.'], ['Hoe stil is de beweging?', 'Een correct geplaatste schuifpoort beweegt nagenoeg geruisloos dankzij een kwalitatief loopwerk en een zachte demping bij begin en einde.']]
  },
  draai: {
    key: 'draai',
    naam: 'Draaipoorten',
    kicker: 'Poorttype',
    tone: 'morning',
    materiaalFilter: null,
    intro: 'De klassieke en meest verfijnde beweging. Een draaipoort opent statig naar binnen of buiten.',
    lead: 'Een draaipoort draait op verdoken scharnieren en geeft uw toegang een rustige, klassieke beweging. In één of twee vleugels, in elk materiaal dat bij uw woning past.',
    voorWie: ['Woningen met voldoende oprijdiepte voor de zwenkbeweging.', 'Wie de klassieke, statige opening van een draaipoort verkiest.', 'Smalle voetgangerstoegangen naast een grotere oprijpoort.'],
    voordelen: [['Klassieke beweging', 'Een rustige, statige opening die tijdloos aanvoelt.'], ['Eén of twee vleugels', 'Enkel of dubbel, afgestemd op de breedte van de opening.'], ['Verfijnde details', 'Verdoken scharnieren en een vlakke aansluiting.'], ['Elk materiaal', 'Hout, aluminium, staal of een combinatie naar keuze.']],
    materialen: ['Aluminium', 'Massieve eik', 'Handgesmeed staal', 'Staal en hout'],
    afwerking: ['Verdoken scharnieren', 'Zachte demping', 'Ingewerkt slot', 'Geïntegreerde voetgangerspoort'],
    stijlen: [['Enkele vleugel', 'Eén rustige vleugel voor smallere toegangen.'], ['Dubbele vleugel', 'Twee vleugels die symmetrisch openen voor brede opritten.'], ['Met loopdeur', 'Een geïntegreerde voetgangerspoort in hetzelfde beeld.']],
    faq: [['Hoeveel ruimte vraagt een draaipoort?', 'Een draaipoort heeft zwenkruimte nodig voor de vleugels. Bij beperkte diepte adviseren wij een schuifpoort of een opening naar binnen.'], ['Eén of twee vleugels?', 'Dat hangt af van de breedte. Tot ongeveer drie meter volstaat vaak één vleugel, daarboven kiezen wij meestal voor twee.'], ['Kan er een loopdeur in?', 'Ja. Wij integreren een voetgangerspoort in dezelfde lijn, zodat het beeld rustig en samenhangend blijft.']]
  },
  hekwerk: {
    key: 'hekwerk',
    naam: 'Hekwerken op maat',
    kicker: 'Hekwerk',
    tone: 'stone',
    materiaalFilter: null,
    intro: 'Eén doorlopend beeld rond uw eigendom. Een hekwerk dat naadloos aansluit bij de poort.',
    lead: 'Een hekwerk op maat omkadert uw woning in hetzelfde profiel en dezelfde toon als de poort. Zo wordt de volledige afsluiting één rustig, samenhangend geheel.',
    voorWie: ['Eigendommen die poort en omheining in één beeld willen.', 'Tuinen die afgeschermd worden zonder zwaar of gesloten te ogen.', 'Projecten waar de afsluiting de architectuur moet versterken.'],
    voordelen: [['Eén geheel', 'Hek en poort delen hetzelfde profiel en dezelfde toon.'], ['Op maat van het terrein', 'Volgt hoogteverschillen en hoeken nauwkeurig.'], ['Open of besloten', 'Van transparant tot volledig privacygericht.'], ['Duurzame materialen', 'Aluminium, staal of cortenstaal, naar keuze.']],
    materialen: ['Aluminium lamellen', 'Cortenstaal', 'Verticale spijlen', 'Gecombineerd met groen'],
    afwerking: ['Doorlopend lamelprofiel', 'Lijnverlichting', 'Geïntegreerde poort', 'Op maat van de helling'],
    stijlen: [['Lamellen', 'Een doorlopend horizontaal ritme rond het volledige terrein.'], ['Spijlen', 'Fijne verticale staven voor een open, klassiek beeld.'], ['Vol en groen', 'Dichte panelen afgewisseld met beplanting.']],
    faq: [['Sluit het hekwerk aan op de poort?', 'Ja, dat is net het uitgangspunt. Wij tekenen hek en poort in hetzelfde profiel, zodat de toegang opgaat in de volledige afsluiting.'], ['Volgt het hekwerk een helling?', 'Zeker. Wij meten het terrein nauwkeurig op en laten het hekwerk de hoogteverschillen en hoeken rustig volgen.'], ['Hoe transparant kan een hekwerk?', 'Van volledig open met fijne spijlen tot volledig besloten met dichte panelen. Wij stemmen de mate van privacy af op uw wens en ligging.']]
  },
  automatisatie: {
    key: 'automatisatie',
    naam: 'Automatisatie',
    kicker: 'Techniek',
    tone: 'dusk',
    materiaalFilter: null,
    intro: 'Comfort dat u dagelijks voelt. Een poort die stil, veilig en betrouwbaar opent.',
    lead: 'Automatisatie is techniek die onzichtbaar hoort te zijn. Wij integreren betrouwbare aandrijving, veilige detectie en eenvoudige bediening, en blijven beschikbaar voor onderhoud en herstelling.',
    voorWie: ['Wie comfort en veiligheid bij de dagelijkse toegang verwacht.', 'Bestaande poorten die toe zijn aan een betrouwbare aandrijving.', 'Nieuwe poorten waar de techniek van bij het ontwerp wordt ingepast.'],
    voordelen: [['Verdoken techniek', 'Aandrijving in de fundering of discreet weggewerkt.'], ['Veilige detectie', 'Sensoren en beveiliging tegen klem en obstakels.'], ['Eenvoudige bediening', 'Afstandsbediening, codeklavier of bediening via uw telefoon.'], ['Sterke opvolging', 'Wij blijven bereikbaar voor onderhoud en herstelling.']],
    materialen: ['Ondergrondse aandrijving', 'Zijdelingse motor', 'Schuifpoortmotor', 'Back up batterij'],
    afwerking: ['Codeklavier', 'Afstandsbediening', 'Bediening via telefoon', 'Veiligheidssensoren'],
    stijlen: [['Ondergronds', 'Een verdoken motor in de fundering, volledig uit het zicht.'], ['Verdoken zijwaarts', 'Een discrete motor weggewerkt in de paal of de muur.'], ['Schuifaandrijving', 'Een robuuste, stille aandrijving voor schuifpoorten.']],
    faq: [['Werkt automatisatie ook op mijn bestaande poort?', 'Vaak wel. Wij beoordelen tijdens een plaatsbezoek of de poort en de constructie geschikt zijn en welke aandrijving past.'], ['Wat gebeurt er bij stroomuitval?', 'Wij voorzien waar gewenst een back up batterij en een handmatige ontgrendeling, zodat de poort altijd te openen blijft.'], ['Is automatisatie veilig?', 'Ja. Wij plaatsen veiligheidssensoren die detecteren wanneer iets of iemand zich in de baan bevindt, en stemmen de kracht zorgvuldig af.']]
  }
};
const PRODUCT_VOLGORDE = ['houten', 'metalen', 'aluminium', 'staalhout', 'schuif', 'draai', 'hekwerk', 'automatisatie'];

/* ----------------------------- Werkwijze ----------------------------- */
const WERKWIJZE = [['01', 'Eerste contact en adviesgesprek', 'Alles begint met een gesprek. Wij luisteren naar uw woning, uw oprit en het gevoel dat u zoekt. Geen catalogus, maar een eerlijk advies over wat past.'], ['02', 'Plaatsbezoek en opmeting', 'Wij komen ter plaatse, lezen de architectuur en de toegang, en meten nauwkeurig op. Zo houdt het ontwerp rekening met helling, breedte en gebruik.'], ['03', 'Ontwerp en voorstel', 'U ontvangt een ontwerp op maat met materiaal, ritme, afwerking en automatisatie. Wij verfijnen samen tot elk detail klopt.'], ['04', 'Productie en afwerking', 'In ons atelier wordt uw poort gesneden, gelast en met de hand afgewerkt. Eén object, geen samengesteld pakket.'], ['05', 'Plaatsing en automatisatie', 'Onze eigen plaatsers monteren de poort en stellen de verdoken automatisatie nauwkeurig af. Wij leveren proper en stil op.'], ['06', 'Oplevering en service na verkoop', 'Wij overlopen het gebruik en het onderhoud, en blijven daarna bereikbaar. Service is voor ons een onderdeel van kwaliteit.']];

/* ----------------------------- Vertrouwensclaims ----------------------------- */
const CLAIMS = ['Handgemaakt in België', 'Duurzame materialen', 'Advies, opmeting en plaatsing door specialisten', 'Sterke service na verkoop'];

/* ----------------------------- Homepage FAQ ----------------------------- */
const HOME_FAQ = [['Hoe lang duurt het maken en plaatsen van een poort?', 'Een traject van eerste contact tot plaatsing duurt gemiddeld zes tot acht weken. De exacte termijn hangt af van materiaal, ontwerp en automatisatie. Wij bevestigen een realistische planning bij het voorstel.'], ['Waarom is een Belgische poort op maat duurder dan import?', 'U investeert in Belgisch handwerk, duurzame materialen, een correcte plaatsing en een sterke service na verkoop. Geen importproduct uit een doos, maar een poort die voor uw woning is getekend en jarenlang vertrouwen geeft.'], ['Komen jullie altijd ter plaatse?', 'Ja. Er is altijd een plaatsbezoek en een adviesgesprek met opmeting. Zo houdt het ontwerp rekening met uw terrein, uw architectuur en uw dagelijks gebruik.'], ['Welk materiaal past het best bij mijn woning?', 'Dat bepalen wij samen. Hout brengt warmte, aluminium is onderhoudsarm, staal geeft kracht en cortenstaal verkleurt mee met het landschap. Tijdens het adviesgesprek bekijken wij wat bij uw woning past.']];

/* ----------------------------- Advies ----------------------------- */
const ADVIES = [['Welke poort past bij een moderne woning?', 'Materialen', 'Strakke lijnen, lamellen en aluminium voor een rustige, eigentijdse toegang.'], ['Welke poort past bij een landelijke woning?', 'Inspiratie', 'Hout en staal die warmte en robuustheid verenigen in een landelijke omgeving.'], ['Schuifpoort of draaipoort kiezen?', 'Poorttypes', 'Hoe ruimte, helling en uitstraling uw keuze tussen schuiven en draaien bepalen.'], ['Aluminium, staal of hout voor uw poort?', 'Materialen', 'Een nuchtere vergelijking van de drie materialen die wij het vaakst verwerken.'], ['Wat bepaalt de prijs van een poort op maat?', 'Prijs en investering', 'Welke keuzes de investering sturen, en waarom maatwerk meer waarde biedt dan import.'], ['Hoe verloopt een plaatsbezoek?', 'Proces', 'Wat u mag verwachten van het adviesgesprek, de opmeting en het voorstel.']];
Object.assign(window, {
  PROJECTEN,
  PRODUCTEN,
  PRODUCT_VOLGORDE,
  WERKWIJZE,
  CLAIMS,
  HOME_FAQ,
  ADVIES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/Poortland-website-NL/data-nl.jsx", error: String((e && e.message) || e) }); }

// export/Poortland-website-NL/ds-bundle.js
try { (() => {
/* @ds-bundle: {"format":3,"namespace":"PoortlandDesignSystem_6dcc8b","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"}],"sourceHashes":{"components/core/Button.jsx":"384d9a3c0186","components/core/Card.jsx":"aa3d3e680a2d","components/core/Eyebrow.jsx":"00d1ee767500","components/core/Tag.jsx":"b2e45b36b4e1","components/forms/Input.jsx":"57901ac9863e","ui_kits/website-nl/About-nl.jsx":"ec7798f30936","ui_kits/website-nl/Collection-nl.jsx":"d30c3f2acede","ui_kits/website-nl/Contact-nl.jsx":"a1dbf9f4df94","ui_kits/website-nl/Home-nl.jsx":"d710abb8a41f","ui_kits/website-nl/Process-nl.jsx":"68492134defe","ui_kits/website-nl/Product-nl.jsx":"699a4839aae7","ui_kits/website-nl/ProjectDetail-nl.jsx":"8683e42f7056","ui_kits/website-nl/data-nl.jsx":"9e14b9d53c97","ui_kits/website-nl/shared-nl.jsx":"a4d5df133ed7","ui_kits/website/Collection.jsx":"5326313e9382","ui_kits/website/Contact.jsx":"17d32d001a11","ui_kits/website/Home.jsx":"696143a9e830","ui_kits/website/Process.jsx":"e6d37f7c5ba2","ui_kits/website/ProjectDetail.jsx":"e5212d25a979","ui_kits/website/shared.jsx":"750642f13436"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {
  const __ds_ns = window.PoortlandDesignSystem_6dcc8b = window.PoortlandDesignSystem_6dcc8b || {};
  const __ds_scope = {};
  __ds_ns.__errors = __ds_ns.__errors || [];

  // components/core/Button.jsx
  try {
    (() => {
      function _extends() {
        return _extends = Object.assign ? Object.assign.bind() : function (n) {
          for (var e = 1; e < arguments.length; e++) {
            var t = arguments[e];
            for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
          }
          return n;
        }, _extends.apply(null, arguments);
      }
      /**
       * Poortland — Button
       * Architectural, square-leaning. Bronze is the primary metal fill;
       * secondary is a hairline outline; ghost is a quiet underline link.
       * Set `dark` when placing on the forest ground.
       */
      function Button({
        children,
        variant = 'primary',
        size = 'md',
        dark = false,
        arrow = false,
        disabled = false,
        as = 'button',
        ...rest
      }) {
        const sizes = {
          sm: {
            fontSize: 12,
            padding: '8px 16px',
            letterSpacing: '0.14em'
          },
          md: {
            fontSize: 13,
            padding: '12px 24px',
            letterSpacing: '0.16em'
          },
          lg: {
            fontSize: 14,
            padding: '16px 34px',
            letterSpacing: '0.18em'
          }
        };
        const base = {
          fontFamily: 'var(--font-label)',
          fontWeight: 600,
          textTransform: 'uppercase',
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.6em',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid transparent',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.45 : 1,
          transition: 'background var(--dur) var(--ease-out), color var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out)',
          whiteSpace: 'nowrap',
          textDecoration: 'none',
          ...sizes[size]
        };
        const variants = {
          primary: {
            background: 'var(--bronze-500)',
            color: 'var(--forest-950)',
            borderColor: 'var(--bronze-500)'
          },
          secondary: dark ? {
            background: 'transparent',
            color: 'var(--stone-200)',
            borderColor: 'var(--line-on-dark)'
          } : {
            background: 'transparent',
            color: 'var(--text-heading)',
            borderColor: 'var(--line-on-light)'
          },
          ghost: dark ? {
            background: 'transparent',
            color: 'var(--stone-200)',
            borderColor: 'transparent',
            padding: '10px 4px'
          } : {
            background: 'transparent',
            color: 'var(--text-heading)',
            borderColor: 'transparent',
            padding: '10px 4px'
          }
        };
        const Tag = as;
        return /*#__PURE__*/React.createElement(Tag, _extends({
          style: {
            ...base,
            ...variants[variant]
          },
          disabled: as === 'button' ? disabled : undefined,
          onMouseEnter: e => {
            if (disabled) return;
            if (variant === 'primary') {
              e.currentTarget.style.background = 'var(--bronze-400)';
              e.currentTarget.style.borderColor = 'var(--bronze-400)';
            } else if (variant === 'secondary') {
              e.currentTarget.style.borderColor = 'var(--bronze-500)';
              e.currentTarget.style.color = 'var(--accent)';
            } else {
              e.currentTarget.style.color = 'var(--accent)';
            }
          },
          onMouseLeave: e => {
            const v = variants[variant];
            e.currentTarget.style.background = v.background;
            e.currentTarget.style.borderColor = v.borderColor;
            e.currentTarget.style.color = v.color;
          }
        }, rest), children, arrow && /*#__PURE__*/React.createElement("span", {
          "aria-hidden": "true",
          style: {
            fontWeight: 400
          }
        }, "\u2197"));
      }
      Object.assign(__ds_scope, {
        Button
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "components/core/Button.jsx",
      error: String(e && e.message || e)
    });
  }

  // components/core/Eyebrow.jsx
  try {
    (() => {
      function _extends() {
        return _extends = Object.assign ? Object.assign.bind() : function (n) {
          for (var e = 1; e < arguments.length; e++) {
            var t = arguments[e];
            for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
          }
          return n;
        }, _extends.apply(null, arguments);
      }
      /**
       * Poortland — Eyebrow
       * The uppercase tracked label that sits above headings. Bronze by default.
       */
      function Eyebrow({
        children,
        dark = false,
        tone = 'accent',
        as = 'div',
        ...rest
      }) {
        const colors = {
          accent: 'var(--accent)',
          muted: dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)',
          plain: dark ? 'var(--stone-200)' : 'var(--text-heading)'
        };
        const Tag = as;
        return /*#__PURE__*/React.createElement(Tag, _extends({
          style: {
            fontFamily: 'var(--font-label)',
            fontSize: 'var(--text-2xs)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-label)',
            color: colors[tone],
            display: 'block'
          }
        }, rest), children);
      }
      Object.assign(__ds_scope, {
        Eyebrow
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "components/core/Eyebrow.jsx",
      error: String(e && e.message || e)
    });
  }

  // components/core/Card.jsx
  try {
    (() => {
      function _extends() {
        return _extends = Object.assign ? Object.assign.bind() : function (n) {
          for (var e = 1; e < arguments.length; e++) {
            var t = arguments[e];
            for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
          }
          return n;
        }, _extends.apply(null, arguments);
      }
      /**
       * Poortland — Card
       * Editorial project / product card. Image on top (pass `image` URL or a
       * children node for a custom media slot), then eyebrow, serif title, meta.
       * Quiet by default; lifts gently on hover.
       */
      function Card({
        image,
        imageAlt = '',
        eyebrow,
        title,
        meta,
        href,
        children,
        ...rest
      }) {
        const [hover, setHover] = React.useState(false);
        const Root = href ? 'a' : 'div';
        return /*#__PURE__*/React.createElement(Root, _extends({
          href: href,
          onMouseEnter: () => setHover(true),
          onMouseLeave: () => setHover(false),
          style: {
            display: 'block',
            textDecoration: 'none',
            background: 'var(--surface-card)',
            border: '1px solid var(--line-on-light-soft)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-xs)',
            transform: hover ? 'translateY(-3px)' : 'none',
            transition: 'box-shadow var(--dur) var(--ease-out), transform var(--dur) var(--ease-out)'
          }
        }, rest), /*#__PURE__*/React.createElement("div", {
          style: {
            position: 'relative',
            aspectRatio: '4 / 3',
            background: 'var(--forest-800)',
            overflow: 'hidden'
          }
        }, children ? children : image ? /*#__PURE__*/React.createElement("img", {
          src: image,
          alt: imageAlt,
          style: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transform: hover ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform var(--dur-slow) var(--ease-out)'
          }
        }) : /*#__PURE__*/React.createElement("div", {
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-on-dark-faint)',
            fontFamily: 'var(--font-label)',
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase'
          }
        }, "Image")), /*#__PURE__*/React.createElement("div", {
          style: {
            padding: '18px 20px 22px'
          }
        }, eyebrow && /*#__PURE__*/React.createElement(__ds_scope.Eyebrow, {
          style: {
            marginBottom: 8
          }
        }, eyebrow), title && /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 24,
            lineHeight: 1.12,
            color: 'var(--text-heading)',
            letterSpacing: '-0.01em'
          }
        }, title), meta && /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            color: 'var(--text-muted)',
            marginTop: 8
          }
        }, meta)));
      }
      Object.assign(__ds_scope, {
        Card
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "components/core/Card.jsx",
      error: String(e && e.message || e)
    });
  }

  // components/core/Tag.jsx
  try {
    (() => {
      function _extends() {
        return _extends = Object.assign ? Object.assign.bind() : function (n) {
          for (var e = 1; e < arguments.length; e++) {
            var t = arguments[e];
            for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
          }
          return n;
        }, _extends.apply(null, arguments);
      }
      /**
       * Poortland — Tag
       * A small chip for materials and gate types. Hairline outline by default,
       * `solid` for a filled bronze chip. Uppercase, tracked, square corners.
       */
      function Tag({
        children,
        variant = 'outline',
        dark = false,
        ...rest
      }) {
        const styles = {
          outline: dark ? {
            background: 'transparent',
            color: 'var(--stone-200)',
            border: '1px solid var(--line-on-dark)'
          } : {
            background: 'transparent',
            color: 'var(--text-body)',
            border: '1px solid var(--line-on-light)'
          },
          solid: {
            background: 'var(--bronze-500)',
            color: 'var(--forest-950)',
            border: '1px solid var(--bronze-500)'
          },
          olive: {
            background: 'var(--olive-500)',
            color: 'var(--stone-50)',
            border: '1px solid var(--olive-500)'
          }
        };
        return /*#__PURE__*/React.createElement("span", _extends({
          style: {
            fontFamily: 'var(--font-label)',
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            padding: '5px 11px',
            borderRadius: 'var(--radius-xs)',
            display: 'inline-flex',
            alignItems: 'center',
            lineHeight: 1,
            ...styles[variant]
          }
        }, rest), children);
      }
      Object.assign(__ds_scope, {
        Tag
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "components/core/Tag.jsx",
      error: String(e && e.message || e)
    });
  }

  // components/forms/Input.jsx
  try {
    (() => {
      function _extends() {
        return _extends = Object.assign ? Object.assign.bind() : function (n) {
          for (var e = 1; e < arguments.length; e++) {
            var t = arguments[e];
            for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
          }
          return n;
        }, _extends.apply(null, arguments);
      }
      /**
       * Poortland — Input
       * Labelled text field. Hairline underline-forward style on paper, bronze
       * focus. Set `as="textarea"` for multi-line. Pass `dark` on forest ground.
       */
      function Input({
        label,
        hint,
        id,
        as = 'input',
        dark = false,
        style,
        ...rest
      }) {
        const [focus, setFocus] = React.useState(false);
        const fieldId = id || (label ? String(label).toLowerCase().replace(/\s+/g, '-') : undefined);
        const Tag = as;
        const fg = dark ? 'var(--stone-200)' : 'var(--text-heading)';
        const line = dark ? 'var(--line-on-dark)' : 'var(--line-on-light)';
        return /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }
        }, label && /*#__PURE__*/React.createElement("label", {
          htmlFor: fieldId,
          style: {
            fontFamily: 'var(--font-label)',
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            color: dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)'
          }
        }, label), /*#__PURE__*/React.createElement(Tag, _extends({
          id: fieldId,
          onFocus: () => setFocus(true),
          onBlur: () => setFocus(false),
          rows: as === 'textarea' ? 4 : undefined,
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 15,
            color: fg,
            background: 'transparent',
            border: 0,
            borderBottom: `1.5px solid ${focus ? 'var(--bronze-500)' : line}`,
            padding: '10px 2px',
            outline: 'none',
            width: '100%',
            resize: as === 'textarea' ? 'vertical' : undefined,
            transition: 'border-color var(--dur) var(--ease-out)',
            ...style
          }
        }, rest)), hint && /*#__PURE__*/React.createElement("span", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            color: dark ? 'var(--text-on-dark-faint)' : 'var(--text-faint)'
          }
        }, hint));
      }
      Object.assign(__ds_scope, {
        Input
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "components/forms/Input.jsx",
      error: String(e && e.message || e)
    });
  }

  // ui_kits/website-nl/About-nl.jsx
  try {
    (() => {
      /* Poortland — Nederlandse website. Over Poortland en atelier. */
      const {
        Button: AbButton,
        Eyebrow: AbEyebrow
      } = window.PoortlandDesignSystem_6dcc8b;
      function AboutNL({
        onNav
      }) {
        const {
          GateImage,
          Reveal,
          ClaimBalk,
          CTASectie,
          SectieKop
        } = window;
        const vakmanschap = [['Handwerk', 'Elke poort wordt met de hand getekend, gelast en afgewerkt. Geen samengesteld pakket, maar één object.'], ['Belgische productie', 'Alles gebeurt in ons eigen atelier in Gent. Geen import, geen tussenschakels.'], ['Materiaalkennis', 'Wij kennen het gedrag van eik, aluminium, staal en cortenstaal, en kiezen wat past bij uw woning.'], ['Detailzorg', 'Verhouding, ritme en afwerking worden tot in het detail uitgewerkt en gecontroleerd.'], ['Eigen plaatsers', 'Onze eigen techniekers plaatsen en stellen af. Zij kennen de poort die zij monteren.'], ['Automatisatie', 'Wij integreren betrouwbare, verdoken aandrijving en blijven beschikbaar voor de opvolging.']];
        const cijfers = [['1992', 'Opgericht'], ['100%', 'Handgemaakt'], ['320+', 'Woningen'], ['4', 'Materialen']];
        return /*#__PURE__*/React.createElement("div", {
          style: {
            background: 'var(--surface-paper)'
          }
        }, /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--surface-ground)',
            color: 'var(--text-on-dark)',
            padding: '72px 44px 0'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1320,
            margin: '0 auto'
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 860
          }
        }, /*#__PURE__*/React.createElement(AbEyebrow, {
          dark: true,
          style: {
            marginBottom: 22
          }
        }, "Over Poortland"), /*#__PURE__*/React.createElement("h1", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 60,
            color: 'var(--stone-100)',
            margin: 0,
            lineHeight: 1.05,
            letterSpacing: '-0.01em'
          }
        }, "Een poort is de eerste indruk van het huis."), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 19,
            lineHeight: 1.6,
            color: 'var(--stone-300)',
            maxWidth: '52ch',
            marginTop: 24
          }
        }, "Sinds 1992 ontwerpt, maakt en plaatst Poortland handgemaakte toegangspoorten en hekwerken op maat. Voor woningen waar uitstraling, veiligheid en afwerking samenkomen, en voor mensen die kwaliteit boven snelheid verkiezen."))), /*#__PURE__*/React.createElement("div", {
          style: {
            marginTop: 56,
            paddingBottom: 0
          }
        }, /*#__PURE__*/React.createElement(Reveal, {
          delay: 80
        }, /*#__PURE__*/React.createElement(GateImage, {
          tone: "dusk",
          ratio: "21 / 9",
          slats: 15,
          label: "Atelier en showroom \xB7 Gent",
          radius: 8
        }))), /*#__PURE__*/React.createElement("div", {
          style: {
            marginTop: 0,
            paddingTop: 56,
            paddingBottom: 0
          }
        }, /*#__PURE__*/React.createElement(ClaimBalk, {
          dark: true
        })), /*#__PURE__*/React.createElement("div", {
          style: {
            height: 4
          }
        }))), /*#__PURE__*/React.createElement("section", {
          style: {
            padding: '90px 44px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1320,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 72,
            alignItems: 'center'
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
          eyebrow: "Wie wij zijn",
          titel: "Belgisch vakmanschap, generatie na generatie.",
          max: "18ch"
        }), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 16.5,
            lineHeight: 1.75,
            color: 'var(--text-body)',
            margin: '24px 0 0',
            maxWidth: '56ch'
          }
        }, "Poortland groeide van een klein smederijatelier tot een gespecialiseerde maker van architecturale poorten. Wat onveranderd bleef, is de overtuiging dat een toegang met de hand hoort te worden gemaakt, afgestemd op de woning en gebouwd om te blijven."), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 16.5,
            lineHeight: 1.75,
            color: 'var(--text-body)',
            margin: '18px 0 0',
            maxWidth: '56ch'
          }
        }, "Wij werken voor villa eigenaars, renovatieklanten en eigenaars van landelijke en moderne woningen, en zijn een betrouwbare uitvoerende partner voor architecten, tuinarchitecten en aannemers.")), /*#__PURE__*/React.createElement(Reveal, {
          delay: 80
        }, /*#__PURE__*/React.createElement(GateImage, {
          tone: "corten",
          ratio: "4 / 5",
          slats: 7,
          label: "Smeedwerk \xB7 detail",
          radius: 8,
          zoom: true
        })))), /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--forest-900)',
            padding: '90px 44px',
            color: 'var(--text-on-dark)'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1320,
            margin: '0 auto'
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
          dark: true,
          align: "center",
          eyebrow: "Atelier en vakmanschap",
          titel: "Hoe een Poortland poort ontstaat.",
          intro: "Geen import, maar maatwerk onder \xE9\xE9n dak. Van de eerste tekening tot de laatste afwerking blijft elke stap in eigen handen."
        })), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
            marginTop: 48,
            background: 'var(--line-on-dark-soft)',
            border: '1px solid var(--line-on-dark-soft)'
          }
        }, vakmanschap.map(([t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
          key: t,
          delay: i % 3 * 80
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            background: 'var(--forest-900)',
            padding: '30px 30px',
            height: '100%'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-display)',
            fontSize: 25,
            color: 'var(--stone-100)',
            marginBottom: 8
          }
        }, t), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 14.5,
            lineHeight: 1.65,
            color: 'var(--text-on-dark-muted)',
            margin: 0
          }
        }, d))))), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
            marginTop: 56
          }
        }, cijfers.map(([n, l], i) => /*#__PURE__*/React.createElement(Reveal, {
          key: l,
          delay: i * 70
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            textAlign: 'center'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-display)',
            fontSize: 50,
            color: 'var(--stone-100)',
            lineHeight: 1
          }
        }, n), /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-label)',
            fontSize: 10.5,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--text-on-dark-muted)',
            marginTop: 10
          }
        }, l))))))), /*#__PURE__*/React.createElement("section", {
          style: {
            padding: '90px 44px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1320,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '0.9fr 1.1fr',
            gap: 64,
            alignItems: 'center'
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(GateImage, {
          tone: "morning",
          ratio: "4 / 3",
          slats: 9,
          label: "Plaatsing \xB7 ter plaatse",
          radius: 8,
          zoom: true
        })), /*#__PURE__*/React.createElement(Reveal, {
          delay: 80
        }, /*#__PURE__*/React.createElement(SectieKop, {
          eyebrow: "Service na verkoop",
          titel: "Zekerheid op lange termijn.",
          max: "18ch"
        }), /*#__PURE__*/React.createElement("ul", {
          style: {
            listStyle: 'none',
            margin: '24px 0 0',
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }
        }, ['Poortland blijft bereikbaar na de plaatsing.', 'Service is voor ons een onderdeel van kwaliteit.', 'Onderhoud en herstellingen worden professioneel opgevolgd.', 'Automatisatie houden wij betrouwbaar in gebruik.'].map(t => /*#__PURE__*/React.createElement("li", {
          key: t,
          style: {
            display: 'flex',
            gap: 14,
            alignItems: 'baseline'
          }
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            color: 'var(--accent)',
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            flex: '0 0 auto'
          }
        }, "\u2014"), /*#__PURE__*/React.createElement("span", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 16,
            lineHeight: 1.55,
            color: 'var(--text-body)'
          }
        }, t))))))), /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--forest-900)',
            padding: '84px 44px',
            color: 'var(--text-on-dark)'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1100,
            margin: '0 auto',
            textAlign: 'center'
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(AbEyebrow, {
          dark: true,
          style: {
            marginBottom: 18
          }
        }, "Showroom"), /*#__PURE__*/React.createElement("h2", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 44,
            color: 'var(--stone-100)',
            margin: '0 auto 18px',
            maxWidth: '20ch',
            lineHeight: 1.08
          }
        }, "Ervaar de materialen van dichtbij."), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 17,
            lineHeight: 1.7,
            color: 'var(--stone-300)',
            maxWidth: '50ch',
            margin: '0 auto 32px'
          }
        }, "In onze showroom in Gent ziet en voelt u de materialen, afwerkingen en bewegingen. Een bezoek gebeurt op afspraak, zodat wij rustig de tijd voor u nemen."), /*#__PURE__*/React.createElement(AbButton, {
          variant: "primary",
          size: "lg",
          arrow: true,
          onClick: () => onNav('contact')
        }, "Bezoek onze showroom")))), /*#__PURE__*/React.createElement(CTASectie, {
          onNav: onNav,
          dark: false
        }));
      }
      window.AboutNL = AboutNL;
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "ui_kits/website-nl/About-nl.jsx",
      error: String(e && e.message || e)
    });
  }

  // ui_kits/website-nl/Collection-nl.jsx
  try {
    (() => {
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
        const materialen = ['Alle', 'Hout', 'Aluminium', 'Cortenstaal', 'Staal en hout', 'Smeedijzer'];
        const types = ['Alle', 'Schuifpoort', 'Draaipoort', 'Hekwerk'];
        const [mat, setMat] = React.useState('Alle');
        const [type, setType] = React.useState('Alle');
        const shown = PROJECTEN.filter(p => (mat === 'Alle' || p.materiaal === mat) && (type === 'Alle' || p.poorttype === type));
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
  } catch (e) {
    __ds_ns.__errors.push({
      path: "ui_kits/website-nl/Collection-nl.jsx",
      error: String(e && e.message || e)
    });
  }

  // ui_kits/website-nl/Contact-nl.jsx
  try {
    (() => {
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
        }, "\u25BE")));
      }
      function ContactNL({
        onNav
      }) {
        const {
          Reveal
        } = window;
        const [sent, setSent] = React.useState(false);
        const [type, setType] = React.useState('');
        const [akkoord, setAkkoord] = React.useState(false);
        const [bestand, setBestand] = React.useState('');
        const typeOpties = [{
          value: '',
          label: 'Kies een type aanvraag'
        }, {
          value: 'nieuwe-poort',
          label: 'Nieuwe poort'
        }, {
          value: 'hekwerk',
          label: 'Hekwerk'
        }, {
          value: 'automatisatie',
          label: 'Automatisatie'
        }, {
          value: 'onderhoud',
          label: 'Onderhoud of service'
        }, {
          value: 'showroom',
          label: 'Showroombezoek'
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
        }, "Vertel kort iets over uw woning, de opening en het gevoel dat u zoekt. Wij nemen persoonlijk contact op en plannen een adviesgesprek met plaatsbezoek en opmeting."), /*#__PURE__*/React.createElement("div", {
          style: {
            marginTop: 42,
            display: 'flex',
            flexDirection: 'column',
            gap: 24
          }
        }, [['Atelier en showroom', 'Dok Noord 4, 9000 Gent'], ['Telefoon', '+32 9 224 18 70'], ['Email', 'hallo@poortland.be'], ['Openingsuren', 'Open op afspraak, maandag tot zaterdag']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
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
            color: 'var(--stone-200)'
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
          src: "../../assets/mono-on-dark.png",
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
        }, "Uw aanvraag is bij het atelier."), /*#__PURE__*/React.createElement("p", {
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
            setType('');
            setAkkoord(false);
            setBestand('');
          }
        }, "Nieuwe aanvraag"))) : /*#__PURE__*/React.createElement("form", {
          onSubmit: e => {
            e.preventDefault();
            if (!akkoord) return;
            setSent(true);
          },
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 24
          }
        }, /*#__PURE__*/React.createElement(Select, {
          label: "Type aanvraag",
          value: type,
          onChange: e => setType(e.target.value),
          opties: typeOpties
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24
          }
        }, /*#__PURE__*/React.createElement(CoInput, {
          label: "Naam",
          dark: true,
          placeholder: "Uw naam",
          required: true
        }), /*#__PURE__*/React.createElement(CoInput, {
          label: "Email",
          dark: true,
          type: "email",
          placeholder: "u@voorbeeld.be",
          required: true
        })), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24
          }
        }, /*#__PURE__*/React.createElement(CoInput, {
          label: "Telefoon",
          dark: true,
          type: "tel",
          placeholder: "+32 ..."
        }), /*#__PURE__*/React.createElement(CoInput, {
          label: "Gemeente",
          dark: true,
          placeholder: "bv. Knokke Heist"
        })), /*#__PURE__*/React.createElement(CoInput, {
          label: "Omschrijving van uw project",
          dark: true,
          as: "textarea",
          placeholder: "De opening is ongeveer 4 meter, een schuifpoort voor de oprit ..."
        }), /*#__PURE__*/React.createElement(Select, {
          label: "Gewenste timing",
          value: '',
          onChange: () => {},
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
        }, "Kies bestand \u2197"), /*#__PURE__*/React.createElement("input", {
          type: "file",
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
          onClick: () => setAkkoord(!akkoord),
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
        }, "Ik ga akkoord met de verwerking van mijn gegevens om mijn aanvraag te behandelen, volgens het privacybeleid.")), /*#__PURE__*/React.createElement("div", {
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
        }, "Vrijblijvend \xB7 antwoord binnen twee werkdagen"), /*#__PURE__*/React.createElement(CoButton, {
          variant: "primary",
          arrow: true,
          as: "button",
          type: "submit",
          disabled: !akkoord
        }, "Verstuur aanvraag"))))))));
      }
      window.ContactNL = ContactNL;
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "ui_kits/website-nl/Contact-nl.jsx",
      error: String(e && e.message || e)
    });
  }

  // ui_kits/website-nl/Home-nl.jsx
  try {
    (() => {
      /* Poortland — Nederlandse website. Homepage. */
      const {
        Button: HButton,
        Tag: HTag,
        Eyebrow: HEyebrow
      } = window.PoortlandDesignSystem_6dcc8b;
      function HomeNL({
        onNav
      }) {
        const {
          GateImage,
          Reveal,
          ClaimBalk,
          FAQ,
          CTASectie,
          SectieKop
        } = window;
        const {
          PROJECTEN,
          PRODUCTEN,
          WERKWIJZE,
          HOME_FAQ,
          ADVIES
        } = window;
        const uitgelicht = PROJECTEN.filter(p => p.uitgelicht).slice(0, 3);
        const routes = [['houten', 'Houten poorten', 'Warm en tijdloos'], ['aluminium', 'Aluminium poorten', 'Strak en onderhoudsarm'], ['schuif', 'Schuifpoorten', 'Voor brede opritten'], ['hekwerk', 'Hekwerken op maat', 'Eén doorlopend beeld']];
        return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--surface-ground)',
            color: 'var(--text-on-dark)',
            padding: '72px 44px 0'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1320,
            margin: '0 auto'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: '1.05fr 0.95fr',
            gap: 60,
            alignItems: 'center',
            paddingBottom: 64
          }
        }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(HEyebrow, {
          dark: true,
          style: {
            marginBottom: 22
          }
        }, "Toegangspoorten \xB7 Belgi\xEB"), /*#__PURE__*/React.createElement("h1", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 72,
            lineHeight: 1.02,
            letterSpacing: '-0.01em',
            color: 'var(--stone-100)',
            margin: 0
          }
        }, "Architecturale poorten en hekwerken op maat.")), /*#__PURE__*/React.createElement(Reveal, {
          delay: 120
        }, /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 19,
            lineHeight: 1.6,
            color: 'var(--stone-300)',
            maxWidth: '48ch',
            margin: '26px 0 34px'
          }
        }, "Poortland ontwerpt, maakt en plaatst handgemaakte poorten en hekwerken voor woningen waar uitstraling, veiligheid en afwerking samenkomen."), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            flexWrap: 'wrap'
          }
        }, /*#__PURE__*/React.createElement(HButton, {
          variant: "primary",
          arrow: true,
          onClick: () => onNav('contact')
        }, "Plan een adviesgesprek"), /*#__PURE__*/React.createElement(HButton, {
          variant: "ghost",
          dark: true,
          arrow: true,
          onClick: () => onNav('realisaties')
        }, "Ontdek onze realisaties")), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 44,
            marginTop: 54
          }
        }, [['1992', 'Sinds'], ['100%', 'Handgemaakt'], ['320+', 'Woningen']].map(([n, l]) => /*#__PURE__*/React.createElement("div", {
          key: l
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-display)',
            fontSize: 34,
            color: 'var(--stone-100)',
            lineHeight: 1
          }
        }, n), /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-label)',
            fontSize: 10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--text-on-dark-muted)',
            marginTop: 7
          }
        }, l)))))), /*#__PURE__*/React.createElement(Reveal, {
          delay: 80
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            borderRadius: 8,
            overflow: 'hidden',
            position: 'relative',
            aspectRatio: '3 / 2',
            boxShadow: 'var(--shadow-lg)'
          }
        }, /*#__PURE__*/React.createElement("img", {
          src: "../../assets/poort-oak-hero.jpeg",
          alt: "Handgemaakte houten poort van Poortland",
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
            background: 'linear-gradient(180deg, rgba(15,22,15,0) 55%, rgba(15,22,15,0.55) 100%)'
          }
        }), /*#__PURE__*/React.createElement("span", {
          style: {
            position: 'absolute',
            left: 16,
            bottom: 14,
            fontFamily: 'var(--font-label)',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(236,227,210,0.92)'
          }
        }, "Eik \xB7 handgemaakt in Belgi\xEB")))), /*#__PURE__*/React.createElement(ClaimBalk, {
          dark: true
        }))), /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--surface-paper)',
            padding: '92px 44px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1000,
            margin: '0 auto',
            textAlign: 'center'
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(HEyebrow, {
          style: {
            marginBottom: 20
          }
        }, "Over Poortland"), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 34,
            lineHeight: 1.32,
            color: 'var(--text-heading)',
            margin: 0,
            letterSpacing: '-0.005em'
          }
        }, "Poortland maakt toegangspoorten en hekwerken op maat voor woningen waar afwerking, veiligheid en uitstraling ", /*#__PURE__*/React.createElement("span", {
          style: {
            fontStyle: 'italic',
            color: 'var(--accent)'
          }
        }, "even belangrijk"), " zijn. Geen importproduct, maar Belgisch handwerk dat past bij de woning, de omgeving en het dagelijks gebruik.")))), /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--forest-900)',
            padding: '90px 44px',
            color: 'var(--text-on-dark)'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1320,
            margin: '0 auto'
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 40,
            flexWrap: 'wrap',
            gap: 20
          }
        }, /*#__PURE__*/React.createElement(SectieKop, {
          dark: true,
          eyebrow: "Wat wij maken",
          titel: "Poorten, hekwerken en automatisatie.",
          max: "16ch"
        }), /*#__PURE__*/React.createElement(HButton, {
          variant: "secondary",
          dark: true,
          onClick: () => onNav('product', {
            productKey: 'houten'
          })
        }, "Alle poorten"))), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 18
          }
        }, routes.map(([key, naam, sub], i) => /*#__PURE__*/React.createElement(Reveal, {
          key: key,
          delay: i * 80
        }, /*#__PURE__*/React.createElement("button", {
          onClick: () => onNav('product', {
            productKey: key
          }),
          style: {
            width: '100%',
            textAlign: 'left',
            background: 'none',
            border: 0,
            padding: 0,
            cursor: 'pointer'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--line-on-dark-soft)'
          }
        }, /*#__PURE__*/React.createElement(GateImage, {
          tone: PRODUCTEN[key].tone,
          ratio: "4 / 5",
          label: naam,
          radius: 0,
          zoom: true,
          slats: key === 'hekwerk' ? 13 : 8
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            padding: '18px 18px 22px',
            background: 'var(--forest-850)'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            color: 'var(--stone-100)',
            lineHeight: 1.1
          }
        }, naam), /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            color: 'var(--text-on-dark-muted)',
            marginTop: 6
          }
        }, sub, " ", /*#__PURE__*/React.createElement("span", {
          style: {
            color: 'var(--accent)'
          }
        }, "\u2197")))))))))), /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--surface-paper)',
            padding: '92px 44px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1320,
            margin: '0 auto'
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 40,
            flexWrap: 'wrap',
            gap: 20
          }
        }, /*#__PURE__*/React.createElement(SectieKop, {
          eyebrow: "Uitgelichte realisaties",
          titel: "Elke poort vertelt een adres.",
          max: "16ch"
        }), /*#__PURE__*/React.createElement(HButton, {
          variant: "secondary",
          onClick: () => onNav('realisaties')
        }, "Alle realisaties"))), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24
          }
        }, uitgelicht.map((p, i) => /*#__PURE__*/React.createElement(Reveal, {
          key: p.id,
          delay: i * 90
        }, /*#__PURE__*/React.createElement(ProjectKaart, {
          project: p,
          onNav: onNav
        })))))), /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--surface-ground)',
            padding: '0 44px',
            color: 'var(--text-on-dark)'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1320,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            alignItems: 'stretch',
            minHeight: 540
          }
        }, /*#__PURE__*/React.createElement(Reveal, {
          style: {
            display: 'flex',
            alignItems: 'center',
            padding: '90px 56px 90px 0'
          }
        }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(HEyebrow, {
          dark: true,
          style: {
            marginBottom: 18
          }
        }, "Handwerk uit Belgi\xEB"), /*#__PURE__*/React.createElement("h2", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 46,
            color: 'var(--stone-100)',
            margin: 0,
            lineHeight: 1.06,
            letterSpacing: '-0.01em'
          }
        }, "Geen import,", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
          style: {
            fontStyle: 'italic',
            color: 'var(--accent)'
          }
        }, "maar maatwerk"), "."), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 17,
            lineHeight: 1.7,
            color: 'var(--stone-300)',
            maxWidth: '46ch',
            margin: '22px 0 28px'
          }
        }, "Elke poort van Poortland wordt gemaakt met aandacht voor materiaal, verhouding en afwerking. Geen importoplossing, maar maatwerk dat past bij de woning, de omgeving en het dagelijks gebruik."), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            marginBottom: 32
          }
        }, [['Eigen atelier', 'Snijden, lassen en afwerken onder één dak in Gent.'], ['Eigen plaatsers', 'Geen onderaanneming, wel onze eigen techniekers ter plaatse.'], ['Duurzame materialen', 'Eik, aluminium, staal en cortenstaal van hoge kwaliteit.']].map(([t, d]) => /*#__PURE__*/React.createElement("div", {
          key: t,
          style: {
            display: 'flex',
            gap: 14,
            alignItems: 'baseline'
          }
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            color: 'var(--accent)',
            fontFamily: 'var(--font-display)',
            fontSize: 16
          }
        }, "\u2014"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--stone-100)'
          }
        }, t), /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 13.5,
            color: 'var(--text-on-dark-muted)',
            marginTop: 2
          }
        }, d))))), /*#__PURE__*/React.createElement(HButton, {
          variant: "ghost",
          dark: true,
          arrow: true,
          onClick: () => onNav('atelier')
        }, "Ontdek het atelier"))), /*#__PURE__*/React.createElement(Reveal, {
          delay: 100,
          style: {
            display: 'flex'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            alignSelf: 'stretch',
            width: '100%',
            padding: '40px 0 40px 0',
            display: 'flex'
          }
        }, /*#__PURE__*/React.createElement(GateImage, {
          tone: "corten",
          ratio: "auto",
          label: "Atelier \xB7 Gent",
          radius: 8,
          slats: 7,
          zoom: true
        }))))), /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--forest-900)',
            padding: '90px 44px',
            color: 'var(--text-on-dark)'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1320,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '0.85fr 1.15fr',
            gap: 60,
            alignItems: 'center'
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
          dark: true,
          eyebrow: "Materialen en afwerking",
          titel: "Vier materialen, eindeloos verfijnd.",
          max: "14ch",
          intro: "Elke poort begint als een tekening en eindigt als \xE9\xE9n gelast object. Geen catalogus, geen twee dezelfde."
        })), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 14
          }
        }, [['Cortenstaal', 'Levende, verkleurende huid'], ['Aluminium', 'Geborsteld en gepoederlakt'], ['Eik en hout', 'Warme, massieve invulling'], ['Smeedstaal', 'Handgesmede profielen']].map(([m, d], i) => /*#__PURE__*/React.createElement(Reveal, {
          key: m,
          delay: i * 70
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            border: '1px solid var(--line-on-dark-soft)',
            borderRadius: 'var(--radius-sm)',
            padding: '22px 20px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-display)',
            fontSize: 24,
            color: 'var(--stone-100)'
          }
        }, m), /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            color: 'var(--text-on-dark-muted)',
            marginTop: 6
          }
        }, d))))))), /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--surface-paper)',
            padding: '92px 44px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1320,
            margin: '0 auto'
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
          align: "center",
          eyebrow: "Werkwijze",
          titel: "Van eerste advies tot perfecte plaatsing.",
          intro: "Een poort op maat vraagt meer dan een mooie tekening. Daarom start elk project met persoonlijk advies, een plaatsbezoek en een nauwkeurige opmeting."
        })), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
            marginTop: 48,
            background: 'var(--line-on-light)',
            border: '1px solid var(--line-on-light)'
          }
        }, WERKWIJZE.map(([n, t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
          key: n,
          delay: i % 3 * 80
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            background: 'var(--surface-paper)',
            padding: '30px 28px',
            height: '100%'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-display)',
            fontSize: 38,
            color: 'var(--accent)',
            lineHeight: 0.9,
            marginBottom: 16
          }
        }, n), /*#__PURE__*/React.createElement("h3", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 22,
            color: 'var(--text-heading)',
            margin: '0 0 8px'
          }
        }, t), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            lineHeight: 1.6,
            color: 'var(--text-muted)',
            margin: 0
          }
        }, d))))), /*#__PURE__*/React.createElement("div", {
          style: {
            textAlign: 'center',
            marginTop: 40
          }
        }, /*#__PURE__*/React.createElement(HButton, {
          variant: "secondary",
          arrow: true,
          onClick: () => onNav('werkwijze')
        }, "Bekijk de volledige werkwijze")))), /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--forest-900)',
            padding: '84px 44px',
            color: 'var(--text-on-dark)'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1100,
            margin: '0 auto',
            textAlign: 'center'
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(HEyebrow, {
          dark: true,
          style: {
            marginBottom: 18
          }
        }, "Service na verkoop"), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: 32,
            color: 'var(--stone-100)',
            margin: '0 auto 14px',
            maxWidth: '26ch',
            lineHeight: 1.3
          }
        }, "\u201CEen poort is de eerste indruk van het huis. Wij zorgen dat die jarenlang klopt.\u201D"), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 16,
            lineHeight: 1.7,
            color: 'var(--stone-300)',
            maxWidth: '52ch',
            margin: '0 auto'
          }
        }, "Poortland blijft bereikbaar na de plaatsing. Onderhoud en herstellingen worden professioneel opgevolgd, en automatisatie houden wij betrouwbaar in gebruik. Zekerheid op lange termijn hoort bij kwaliteit.")))), /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--surface-paper)',
            padding: '92px 44px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1320,
            margin: '0 auto'
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 38,
            flexWrap: 'wrap',
            gap: 20
          }
        }, /*#__PURE__*/React.createElement(SectieKop, {
          eyebrow: "Adviescentrum",
          titel: "Helder advies voor uw keuze.",
          max: "16ch"
        }))), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24
          }
        }, ADVIES.slice(0, 3).map(([titel, cat, sub], i) => /*#__PURE__*/React.createElement(Reveal, {
          key: titel,
          delay: i * 80
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            border: '1px solid var(--line-on-light)',
            borderRadius: 'var(--radius-md)',
            padding: '26px 26px 28px',
            height: '100%',
            background: 'var(--surface-card)',
            transition: 'box-shadow var(--dur) var(--ease-out), transform var(--dur) var(--ease-out)',
            cursor: 'pointer'
          },
          onMouseEnter: e => {
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            e.currentTarget.style.transform = 'translateY(-3px)';
          },
          onMouseLeave: e => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'none';
          },
          onClick: () => onNav('contact')
        }, /*#__PURE__*/React.createElement(HEyebrow, {
          style: {
            marginBottom: 14
          }
        }, cat), /*#__PURE__*/React.createElement("h3", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 24,
            color: 'var(--text-heading)',
            margin: '0 0 10px',
            lineHeight: 1.18
          }
        }, titel), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            lineHeight: 1.6,
            color: 'var(--text-muted)',
            margin: 0
          }
        }, sub))))))), /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--surface-paper-2)',
            padding: '92px 44px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1000,
            margin: '0 auto'
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
          align: "center",
          eyebrow: "Veelgestelde vragen",
          titel: "Wat klanten vaak vragen."
        })), /*#__PURE__*/React.createElement(Reveal, {
          delay: 80
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            marginTop: 44
          }
        }, /*#__PURE__*/React.createElement(FAQ, {
          items: HOME_FAQ
        }))))), /*#__PURE__*/React.createElement(CTASectie, {
          onNav: onNav,
          dark: true
        }));
      }

      /* Gedeelde realisatiekaart */
      function ProjectKaart({
        project: p,
        onNav
      }) {
        const {
          GateImage
        } = window;
        const {
          Eyebrow: KEyebrow
        } = window.PoortlandDesignSystem_6dcc8b;
        return /*#__PURE__*/React.createElement("button", {
          onClick: () => onNav('project', {
            project: p
          }),
          style: {
            textAlign: 'left',
            background: 'none',
            border: 0,
            padding: 0,
            cursor: 'pointer',
            width: '100%'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--line-on-light-soft)',
            background: 'var(--surface-card)',
            transition: 'box-shadow var(--dur) var(--ease-out), transform var(--dur) var(--ease-out)'
          },
          onMouseEnter: e => {
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            e.currentTarget.style.transform = 'translateY(-3px)';
          },
          onMouseLeave: e => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'none';
          }
        }, /*#__PURE__*/React.createElement(GateImage, {
          tone: p.tone,
          ratio: "4 / 3",
          label: p.materiaal,
          radius: 0,
          zoom: true
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            padding: '17px 19px 21px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline'
          }
        }, /*#__PURE__*/React.createElement(KEyebrow, null, p.regio), /*#__PURE__*/React.createElement("span", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            color: 'var(--text-faint)'
          }
        }, p.jaar)), /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-display)',
            fontSize: 24,
            color: 'var(--text-heading)',
            lineHeight: 1.1,
            marginTop: 8
          }
        }, p.naam), /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            color: 'var(--text-muted)',
            marginTop: 6
          }
        }, p.poorttype, " \xB7 ", p.span))));
      }
      Object.assign(window, {
        HomeNL,
        ProjectKaart
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "ui_kits/website-nl/Home-nl.jsx",
      error: String(e && e.message || e)
    });
  }

  // ui_kits/website-nl/Process-nl.jsx
  try {
    (() => {
      /* Poortland — Nederlandse website. Werkwijze. */
      const {
        Button: WeButton,
        Eyebrow: WeEyebrow
      } = window.PoortlandDesignSystem_6dcc8b;
      function ProcessNL({
        onNav
      }) {
        const {
          GateImage,
          Reveal,
          CTASectie,
          SectieKop
        } = window;
        const {
          WERKWIJZE
        } = window;
        return /*#__PURE__*/React.createElement("div", {
          style: {
            background: 'var(--surface-paper)'
          }
        }, /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--surface-ground)',
            color: 'var(--text-on-dark)',
            padding: '72px 44px 80px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1320,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 0.82fr',
            gap: 60,
            alignItems: 'center'
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(WeEyebrow, {
          dark: true,
          style: {
            marginBottom: 20
          }
        }, "Werkwijze"), /*#__PURE__*/React.createElement("h1", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 62,
            color: 'var(--stone-100)',
            margin: 0,
            lineHeight: 1.02,
            letterSpacing: '-0.01em'
          }
        }, "Van eerste advies tot ", /*#__PURE__*/React.createElement("span", {
          style: {
            fontStyle: 'italic',
            color: 'var(--accent)'
          }
        }, "perfecte"), " plaatsing."), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 18,
            lineHeight: 1.65,
            color: 'var(--stone-300)',
            maxWidth: '48ch',
            marginTop: 24
          }
        }, "Een poort op maat vraagt meer dan een mooie tekening. Daarom start elk project met persoonlijk advies, een plaatsbezoek en een nauwkeurige opmeting. Daarna volgt een voorstel dat rekening houdt met stijl, gebruik, veiligheid en afwerking.")), /*#__PURE__*/React.createElement(Reveal, {
          delay: 90
        }, /*#__PURE__*/React.createElement(GateImage, {
          tone: "corten",
          ratio: "4 / 5",
          slats: 6,
          label: "Atelier \xB7 Gent",
          radius: 8,
          zoom: true
        })))), /*#__PURE__*/React.createElement("section", {
          style: {
            padding: '88px 44px 40px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1000,
            margin: '0 auto'
          }
        }, WERKWIJZE.map(([n, t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
          key: n,
          delay: i % 2 * 70
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: '120px 1fr',
            gap: 40,
            alignItems: 'start',
            padding: '36px 0',
            borderTop: '1px solid var(--line-on-light)',
            borderBottom: i === WERKWIJZE.length - 1 ? '1px solid var(--line-on-light)' : 0
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-display)',
            fontSize: 56,
            color: 'var(--accent)',
            lineHeight: 0.9
          }
        }, n), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 30,
            color: 'var(--text-heading)',
            margin: 0
          }
        }, t), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 16,
            lineHeight: 1.7,
            color: 'var(--text-body)',
            margin: '12px 0 0',
            maxWidth: '62ch'
          }
        }, d))))))), /*#__PURE__*/React.createElement("section", {
          style: {
            padding: '40px 44px 90px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1000,
            margin: '0 auto'
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
          style: {
            background: 'var(--forest-900)',
            borderRadius: 'var(--radius-lg)',
            padding: '48px 52px',
            color: 'var(--text-on-dark)',
            display: 'grid',
            gridTemplateColumns: '0.7fr 1.3fr',
            gap: 48,
            alignItems: 'center'
          }
        }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-display)',
            fontSize: 64,
            color: 'var(--stone-100)',
            lineHeight: 1
          }
        }, "6 \u2014 8"), /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-label)',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginTop: 10
          }
        }, "weken gemiddeld")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(WeEyebrow, {
          dark: true,
          style: {
            marginBottom: 12
          }
        }, "Wat u mag verwachten"), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 16.5,
            lineHeight: 1.7,
            color: 'var(--stone-300)',
            margin: 0,
            maxWidth: '52ch'
          }
        }, "Er is altijd een plaatsbezoek en een adviesgesprek met opmeting. Het traject van eerste contact tot plaatsing duurt gemiddeld zes tot acht weken. Wij bevestigen een realistische planning bij het voorstel, en houden u onderweg op de hoogte.")))))), /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--forest-900)',
            padding: '84px 44px',
            textAlign: 'center'
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: 34,
            color: 'var(--stone-100)',
            maxWidth: '26ch',
            margin: '0 auto 28px',
            lineHeight: 1.25
          }
        }, "\u201CEen poort op maat begint bij luisteren. Pas daarna pakken wij het potlood.\u201D"), /*#__PURE__*/React.createElement(WeEyebrow, {
          dark: true,
          tone: "muted",
          style: {
            marginBottom: 34
          }
        }, "Het team van Poortland \xB7 Gent"), /*#__PURE__*/React.createElement(WeButton, {
          variant: "primary",
          size: "lg",
          arrow: true,
          onClick: () => onNav('contact')
        }, "Plan een adviesgesprek"))), /*#__PURE__*/React.createElement(CTASectie, {
          onNav: onNav,
          dark: false
        }));
      }
      window.ProcessNL = ProcessNL;
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "ui_kits/website-nl/Process-nl.jsx",
      error: String(e && e.message || e)
    });
  }

  // ui_kits/website-nl/Product-nl.jsx
  try {
    (() => {
      /* Poortland — Nederlandse website. Productpagina (poorttype). */
      const {
        Button: PrButton,
        Tag: PrTag,
        Eyebrow: PrEyebrow
      } = window.PoortlandDesignSystem_6dcc8b;
      function ProductNL({
        onNav,
        productKey
      }) {
        const {
          GateImage,
          Reveal,
          FAQ,
          CTASectie,
          SectieKop,
          ProjectKaart
        } = window;
        const {
          PRODUCTEN,
          PRODUCT_VOLGORDE,
          PROJECTEN,
          WERKWIJZE
        } = window;
        const key = PRODUCTEN[productKey] ? productKey : 'houten';
        const p = PRODUCTEN[key];
        const relevant = (p.materiaalFilter ? PROJECTEN.filter(x => x.materiaal === p.materiaalFilter) : PROJECTEN).slice(0, 3);
        const shownProjects = relevant.length >= 3 ? relevant : PROJECTEN.slice(0, 3);
        const procesKort = WERKWIJZE.slice(0, 4);
        return /*#__PURE__*/React.createElement("div", {
          style: {
            background: 'var(--surface-paper)'
          }
        }, /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--surface-ground)',
            color: 'var(--text-on-dark)',
            padding: '48px 44px 0'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1320,
            margin: '0 auto'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            marginBottom: 40
          }
        }, PRODUCT_VOLGORDE.map(k => {
          const active = k === key;
          return /*#__PURE__*/React.createElement("button", {
            key: k,
            onClick: () => onNav('product', {
              productKey: k
            }),
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
              color: active ? 'var(--forest-950)' : 'var(--text-on-dark-muted)',
              border: `1px solid ${active ? 'var(--bronze-500)' : 'var(--line-on-dark-soft)'}`,
              transition: 'all var(--dur) var(--ease-out)'
            }
          }, PRODUCTEN[k].naam);
        })), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 56,
            alignItems: 'center',
            paddingBottom: 56
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(PrEyebrow, {
          dark: true,
          style: {
            marginBottom: 18
          }
        }, p.kicker, " \xB7 op maat"), /*#__PURE__*/React.createElement("h1", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 60,
            color: 'var(--stone-100)',
            margin: 0,
            lineHeight: 1.03,
            letterSpacing: '-0.01em'
          }
        }, p.naam), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 18,
            lineHeight: 1.6,
            color: 'var(--stone-300)',
            maxWidth: '46ch',
            margin: '22px 0 32px'
          }
        }, p.intro), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 14,
            flexWrap: 'wrap'
          }
        }, /*#__PURE__*/React.createElement(PrButton, {
          variant: "primary",
          arrow: true,
          onClick: () => onNav('contact')
        }, "Plan een adviesgesprek"), /*#__PURE__*/React.createElement(PrButton, {
          variant: "ghost",
          dark: true,
          arrow: true,
          onClick: () => onNav('realisaties')
        }, "Bekijk realisaties"))), /*#__PURE__*/React.createElement(Reveal, {
          delay: 90
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            boxShadow: 'var(--shadow-lg)',
            borderRadius: 8
          }
        }, /*#__PURE__*/React.createElement(GateImage, {
          tone: p.tone,
          ratio: "4 / 3",
          label: p.naam,
          radius: 8,
          zoom: true,
          slats: key === 'hekwerk' ? 14 : 9
        })))))), /*#__PURE__*/React.createElement("section", {
          style: {
            padding: '88px 44px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1320,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: 72,
            alignItems: 'start'
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(PrEyebrow, {
          style: {
            marginBottom: 16
          }
        }, "Het materiaal"), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 28,
            lineHeight: 1.35,
            color: 'var(--text-heading)',
            margin: 0
          }
        }, p.lead)), /*#__PURE__*/React.createElement(Reveal, {
          delay: 80
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            background: 'var(--surface-paper-2)',
            border: '1px solid var(--line-on-light)',
            borderRadius: 'var(--radius-md)',
            padding: '30px 30px 32px'
          }
        }, /*#__PURE__*/React.createElement(PrEyebrow, {
          style: {
            marginBottom: 18
          }
        }, "Voor wie"), /*#__PURE__*/React.createElement("ul", {
          style: {
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }
        }, p.voorWie.map((v, i) => /*#__PURE__*/React.createElement("li", {
          key: i,
          style: {
            display: 'flex',
            gap: 14,
            alignItems: 'baseline'
          }
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            color: 'var(--accent)',
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            flex: '0 0 auto'
          }
        }, "\u2014"), /*#__PURE__*/React.createElement("span", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 15.5,
            lineHeight: 1.55,
            color: 'var(--text-body)'
          }
        }, v)))))))), /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--forest-900)',
            padding: '88px 44px',
            color: 'var(--text-on-dark)'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1320,
            margin: '0 auto'
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
          dark: true,
          eyebrow: "Belangrijkste voordelen",
          titel: "Waarom dit type.",
          max: "14ch"
        })), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 1,
            marginTop: 44,
            background: 'var(--line-on-dark-soft)',
            border: '1px solid var(--line-on-dark-soft)'
          }
        }, p.voordelen.map(([t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
          key: t,
          delay: i % 2 * 80
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            background: 'var(--forest-900)',
            padding: '30px 32px',
            height: '100%'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-display)',
            fontSize: 26,
            color: 'var(--stone-100)',
            marginBottom: 8
          }
        }, t), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 15,
            lineHeight: 1.65,
            color: 'var(--text-on-dark-muted)',
            margin: 0,
            maxWidth: '46ch'
          }
        }, d))))))), /*#__PURE__*/React.createElement("section", {
          style: {
            padding: '88px 44px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1320,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 56
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
          style: {
            border: '1px solid var(--line-on-light)',
            borderRadius: 'var(--radius-md)',
            padding: '32px 32px 36px',
            height: '100%'
          }
        }, /*#__PURE__*/React.createElement(PrEyebrow, {
          style: {
            marginBottom: 20
          }
        }, "Materialen"), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10
          }
        }, p.materialen.map(m => /*#__PURE__*/React.createElement("span", {
          key: m,
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            color: 'var(--text-heading)',
            padding: '9px 16px',
            border: '1px solid var(--line-on-light)',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--surface-paper-2)'
          }
        }, m))))), /*#__PURE__*/React.createElement(Reveal, {
          delay: 80
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            border: '1px solid var(--line-on-light)',
            borderRadius: 'var(--radius-md)',
            padding: '32px 32px 36px',
            height: '100%'
          }
        }, /*#__PURE__*/React.createElement(PrEyebrow, {
          style: {
            marginBottom: 20
          }
        }, "Afwerkingsmogelijkheden"), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10
          }
        }, p.afwerking.map(m => /*#__PURE__*/React.createElement("span", {
          key: m,
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            color: 'var(--text-heading)',
            padding: '9px 16px',
            border: '1px solid var(--line-on-light)',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--surface-paper-2)'
          }
        }, m))))))), /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--surface-paper-2)',
            padding: '88px 44px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1320,
            margin: '0 auto'
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
          eyebrow: "Mogelijke stijlen",
          titel: "E\xE9n type, vele beelden.",
          max: "16ch"
        })), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
            marginTop: 44
          }
        }, p.stijlen.map(([t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
          key: t,
          delay: i * 80
        }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(GateImage, {
          tone: p.tone,
          ratio: "4 / 3",
          label: t,
          radius: 6,
          zoom: true,
          slats: 6 + i * 3
        }), /*#__PURE__*/React.createElement("h3", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 23,
            color: 'var(--text-heading)',
            margin: '16px 0 6px'
          }
        }, t), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            lineHeight: 1.6,
            color: 'var(--text-muted)',
            margin: 0,
            maxWidth: '40ch'
          }
        }, d))))))), /*#__PURE__*/React.createElement("section", {
          style: {
            padding: '88px 44px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1320,
            margin: '0 auto'
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 40,
            flexWrap: 'wrap',
            gap: 20
          }
        }, /*#__PURE__*/React.createElement(SectieKop, {
          eyebrow: "Van advies tot plaatsing",
          titel: "Hoe uw poort tot stand komt.",
          max: "16ch"
        }), /*#__PURE__*/React.createElement(PrButton, {
          variant: "secondary",
          arrow: true,
          onClick: () => onNav('werkwijze')
        }, "Volledige werkwijze"))), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1,
            background: 'var(--line-on-light)',
            border: '1px solid var(--line-on-light)'
          }
        }, procesKort.map(([n, t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
          key: n,
          delay: i * 70
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            background: 'var(--surface-paper)',
            padding: '28px 24px',
            height: '100%'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-display)',
            fontSize: 32,
            color: 'var(--accent)',
            lineHeight: 0.9,
            marginBottom: 14
          }
        }, n), /*#__PURE__*/React.createElement("h3", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 20,
            color: 'var(--text-heading)',
            margin: '0 0 7px',
            lineHeight: 1.15
          }
        }, t), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 13.5,
            lineHeight: 1.55,
            color: 'var(--text-muted)',
            margin: 0
          }
        }, d))))))), /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--forest-900)',
            padding: '88px 44px',
            color: 'var(--text-on-dark)'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1320,
            margin: '0 auto'
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 38,
            flexWrap: 'wrap',
            gap: 20
          }
        }, /*#__PURE__*/React.createElement(SectieKop, {
          dark: true,
          eyebrow: "Relevante realisaties",
          titel: "Dit type, gerealiseerd.",
          max: "16ch"
        }), /*#__PURE__*/React.createElement(PrButton, {
          variant: "secondary",
          dark: true,
          onClick: () => onNav('realisaties')
        }, "Alle realisaties"))), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24
          }
        }, shownProjects.map((pr, i) => /*#__PURE__*/React.createElement(Reveal, {
          key: pr.id,
          delay: i * 80
        }, /*#__PURE__*/React.createElement("button", {
          onClick: () => onNav('project', {
            project: pr
          }),
          style: {
            textAlign: 'left',
            background: 'none',
            border: 0,
            padding: 0,
            cursor: 'pointer',
            width: '100%'
          }
        }, /*#__PURE__*/React.createElement(GateImage, {
          tone: pr.tone,
          ratio: "4 / 3",
          label: pr.materiaal,
          radius: 6,
          zoom: true
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-display)',
            fontSize: 21,
            color: 'var(--stone-100)',
            marginTop: 14
          }
        }, pr.naam), /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            color: 'var(--text-on-dark-muted)',
            marginTop: 4
          }
        }, pr.regio, " \xB7 ", pr.poorttype))))))), /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--surface-paper-2)',
            padding: '88px 44px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1000,
            margin: '0 auto'
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
          align: "center",
          eyebrow: "Veelgestelde vragen",
          titel: `Over ${p.naam.toLowerCase()}.`
        })), /*#__PURE__*/React.createElement(Reveal, {
          delay: 80
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            marginTop: 44
          }
        }, /*#__PURE__*/React.createElement(FAQ, {
          items: p.faq
        }))))), /*#__PURE__*/React.createElement(CTASectie, {
          onNav: onNav,
          dark: true
        }));
      }
      window.ProductNL = ProductNL;
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "ui_kits/website-nl/Product-nl.jsx",
      error: String(e && e.message || e)
    });
  }

  // ui_kits/website-nl/ProjectDetail-nl.jsx
  try {
    (() => {
      /* Poortland — Nederlandse website. Projectdetailpagina. */
      const {
        Button: DtButton,
        Tag: DtTag,
        Eyebrow: DtEyebrow
      } = window.PoortlandDesignSystem_6dcc8b;
      function ProjectDetailNL({
        project,
        onNav
      }) {
        const {
          GateImage,
          Reveal,
          CTASectie
        } = window;
        const {
          PROJECTEN
        } = window;
        const p = project || PROJECTEN[0];
        const meer = PROJECTEN.filter(x => x.id !== p.id).slice(0, 3);
        const specs = [['Regio', p.regio], ['Type woning', p.woningtype], ['Materiaal', p.materiaal], ['Poorttype', p.poorttype], ['Stijl', p.stijl], ['Automatisatie', p.automatisatie], ['Breedte', p.span], ['Opgeleverd', p.jaar]];
        return /*#__PURE__*/React.createElement("div", {
          style: {
            background: 'var(--surface-paper)'
          }
        }, /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--surface-ground)',
            padding: '36px 44px 0'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1320,
            margin: '0 auto'
          }
        }, /*#__PURE__*/React.createElement("button", {
          onClick: () => onNav('realisaties'),
          style: {
            background: 'none',
            border: 0,
            cursor: 'pointer',
            padding: 0,
            marginBottom: 22,
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            color: 'var(--text-on-dark-muted)'
          }
        }, "\u2190 Terug naar realisaties"), /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(GateImage, {
          tone: p.tone,
          ratio: "21 / 9",
          slats: 13,
          label: `${p.naam} · ${p.regio}`,
          radius: 8
        })))), /*#__PURE__*/React.createElement("section", {
          style: {
            padding: '52px 44px 84px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1320,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1.25fr 0.75fr',
            gap: 64
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(DtEyebrow, {
          style: {
            marginBottom: 16
          }
        }, p.regio, " \xB7 ", p.jaar), /*#__PURE__*/React.createElement("h1", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 54,
            color: 'var(--text-heading)',
            margin: 0,
            letterSpacing: '-0.01em',
            lineHeight: 1.03
          }
        }, p.naam), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 8,
            marginTop: 20,
            flexWrap: 'wrap'
          }
        }, /*#__PURE__*/React.createElement(DtTag, {
          variant: "solid"
        }, p.materiaal), /*#__PURE__*/React.createElement(DtTag, null, p.poorttype), /*#__PURE__*/React.createElement(DtTag, {
          variant: "olive"
        }, p.woningtype)), /*#__PURE__*/React.createElement("div", {
          style: {
            marginTop: 36
          }
        }, /*#__PURE__*/React.createElement(DtEyebrow, {
          style: {
            marginBottom: 12
          }
        }, "De vraag van de klant"), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 17,
            lineHeight: 1.7,
            color: 'var(--text-body)',
            margin: 0,
            maxWidth: '58ch'
          }
        }, p.vraag)), /*#__PURE__*/React.createElement("div", {
          style: {
            marginTop: 30
          }
        }, /*#__PURE__*/React.createElement(DtEyebrow, {
          style: {
            marginBottom: 12
          }
        }, "De oplossing van Poortland"), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 17,
            lineHeight: 1.7,
            color: 'var(--text-body)',
            margin: 0,
            maxWidth: '58ch'
          }
        }, p.oplossing)), /*#__PURE__*/React.createElement("div", {
          style: {
            marginTop: 30
          }
        }, /*#__PURE__*/React.createElement(DtEyebrow, {
          style: {
            marginBottom: 12
          }
        }, "Details van afwerking"), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 16,
            lineHeight: 1.7,
            color: 'var(--text-muted)',
            margin: 0,
            maxWidth: '58ch'
          }
        }, p.afwerking, " Gesneden, gelast en met de hand afgewerkt in ons atelier in Gent, en daarna ter plaatse geplaatst met verdoken automatisatie."))), /*#__PURE__*/React.createElement(Reveal, {
          delay: 80
        }, /*#__PURE__*/React.createElement("aside", null, /*#__PURE__*/React.createElement("div", {
          style: {
            border: '1px solid var(--line-on-light)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden'
          }
        }, specs.map(([k, v], i) => /*#__PURE__*/React.createElement("div", {
          key: k,
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 18,
            padding: '14px 18px',
            borderBottom: i < specs.length - 1 ? '1px solid var(--line-on-light-soft)' : 0
          }
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            fontFamily: 'var(--font-label)',
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--text-faint)'
          }
        }, k), /*#__PURE__*/React.createElement("span", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            color: 'var(--text-heading)',
            fontWeight: 500,
            textAlign: 'right'
          }
        }, v)))), /*#__PURE__*/React.createElement("div", {
          style: {
            marginTop: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }
        }, /*#__PURE__*/React.createElement(DtButton, {
          variant: "primary",
          arrow: true,
          onClick: () => onNav('contact')
        }, "Vergelijkbaar project bespreken"))))), /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1320,
            margin: '52px auto 0'
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(DtEyebrow, {
          style: {
            marginBottom: 18
          }
        }, "Fotogalerij"), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: 18
          }
        }, /*#__PURE__*/React.createElement(GateImage, {
          tone: p.tone,
          ratio: "3 / 2",
          slats: 11,
          label: "Vooraanzicht",
          radius: 6,
          zoom: true
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateRows: '1fr 1fr',
            gap: 18
          }
        }, /*#__PURE__*/React.createElement(GateImage, {
          tone: "stone",
          ratio: "auto",
          slats: 5,
          label: "Detail \xB7 profiel",
          radius: 6,
          zoom: true
        }), /*#__PURE__*/React.createElement(GateImage, {
          tone: "corten",
          ratio: "auto",
          slats: 7,
          label: "Detail \xB7 afwerking",
          radius: 6,
          zoom: true
        }))))), /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 820,
            margin: '64px auto 0',
            textAlign: 'center'
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: 28,
            lineHeight: 1.35,
            color: 'var(--text-heading)',
            margin: 0
          }
        }, "Een toegang die past bij de woning, het landschap en het dagelijks gebruik. Precies dat is maatwerk.")))), /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--forest-900)',
            padding: '78px 44px',
            color: 'var(--text-on-dark)'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1320,
            margin: '0 auto'
          }
        }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(DtEyebrow, {
          dark: true,
          style: {
            marginBottom: 28
          }
        }, "Meer uit het atelier")), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24
          }
        }, meer.map((m, i) => /*#__PURE__*/React.createElement(Reveal, {
          key: m.id,
          delay: i * 80
        }, /*#__PURE__*/React.createElement("button", {
          onClick: () => onNav('project', {
            project: m
          }),
          style: {
            textAlign: 'left',
            background: 'none',
            border: 0,
            padding: 0,
            cursor: 'pointer',
            width: '100%'
          }
        }, /*#__PURE__*/React.createElement(GateImage, {
          tone: m.tone,
          ratio: "4 / 3",
          label: m.materiaal,
          radius: 6,
          zoom: true
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-display)',
            fontSize: 21,
            color: 'var(--stone-100)',
            marginTop: 13
          }
        }, m.naam), /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            color: 'var(--text-on-dark-muted)',
            marginTop: 4
          }
        }, m.regio, " \xB7 ", m.materiaal))))))), /*#__PURE__*/React.createElement(CTASectie, {
          onNav: onNav,
          dark: false
        }));
      }
      window.ProjectDetailNL = ProjectDetailNL;
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "ui_kits/website-nl/ProjectDetail-nl.jsx",
      error: String(e && e.message || e)
    });
  }

  // ui_kits/website-nl/data-nl.jsx
  try {
    (() => {
      /* Poortland — Nederlandse website. Content en data.
         Alle teksten in premium Nederlands. Geen koppelteken, geen slashconstructies. */

      /* ----------------------------- Realisaties ----------------------------- */
      const PROJECTEN = [{
        id: 'duinhof',
        naam: 'Villa Duinhof',
        regio: 'Knokke Heist',
        materiaal: 'Cortenstaal',
        poorttype: 'Schuifpoort',
        woningtype: 'Moderne villa',
        stijl: 'Strak',
        automatisatie: 'Ja',
        span: '4,2 m',
        jaar: '2025',
        tone: 'corten',
        uitgelicht: true,
        vraag: 'Een ruime oprit aan de kust met zicht op de duinen vroeg om een poort die privacy geeft zonder de woning af te sluiten van het landschap.',
        oplossing: 'Een schuifpoort in cortenstaal met een rustig verticaal ritme. De levende roestlaag verdiept met het zeeklimaat en sluit warm aan bij de gevel in lichte steen.',
        afwerking: 'Natuurlijke cortenpatina, geborstelde randen, verdoken loopwiel.'
      }, {
        id: 'lievens',
        naam: 'Maison Lievens',
        regio: 'Gent',
        materiaal: 'Aluminium',
        poorttype: 'Draaipoort',
        woningtype: 'Herenhuis',
        stijl: 'Klassiek verfijnd',
        automatisatie: 'Ja',
        span: '1,2 m',
        jaar: '2025',
        tone: 'morning',
        vraag: 'Een statig herenhuis in het centrum van Gent wenste een voetgangerspoort die discreet en duurzaam was, in lijn met de historische gevel.',
        oplossing: 'Een draaipoort in aluminium met fijne verticale spijlen en een mat gepoederlakte afwerking in dieptegroen. Onderhoudsarm en bestand tegen het stadsklimaat.',
        afwerking: 'Gepoederlakt in fijnstructuur, ingewerkt slot, zachte demping.'
      }, {
        id: 'brael',
        naam: 'Hofstede Brael',
        regio: 'Sint Martens Latem',
        materiaal: 'Staal en hout',
        poorttype: 'Schuifpoort',
        woningtype: 'Landelijke woning',
        stijl: 'Landelijk warm',
        automatisatie: 'Ja',
        span: '5,0 m',
        jaar: '2024',
        tone: 'dusk',
        uitgelicht: true,
        vraag: 'Een gerenoveerde hofstede met een lange dreef vroeg om een brede toegang die robuust aanvoelt en toch warmte uitstraalt.',
        oplossing: 'Een schuifpoort met een gelakt stalen frame en een invulling in massieve eik. Het hout brengt warmte, het staal draagt de breedte en de automatisatie.',
        afwerking: 'Geolied eik, mat zwart staal, verdoken automatisatie in de fundering.'
      }, {
        id: 'noordkaai',
        naam: 'Huis Noordkaai',
        regio: 'Antwerpen',
        materiaal: 'Aluminium',
        poorttype: 'Draaipoort',
        woningtype: 'Nieuwbouw',
        stijl: 'Strak',
        automatisatie: 'Ja',
        span: '3,6 m',
        jaar: '2024',
        tone: 'stone',
        vraag: 'Een moderne nieuwbouw aan de rand van Antwerpen zocht een dubbele oprijpoort die naadloos aansluit bij de horizontale lijnen van de architectuur.',
        oplossing: 'Een dubbele draaipoort in aluminium met brede horizontale lamellen. De poort volgt de gevelritmiek en sluit vlak af met de carport.',
        afwerking: 'Geborsteld aluminium, gepoederlakt antraciet, lineaire lamellen.'
      }, {
        id: 'velden',
        naam: 'Domein Velden',
        regio: 'Leuven',
        materiaal: 'Smeedijzer',
        poorttype: 'Draaipoort',
        woningtype: 'Kasteelhoeve',
        stijl: 'Klassiek',
        automatisatie: 'Ja',
        span: '6,4 m',
        jaar: '2023',
        tone: 'dusk',
        vraag: 'Een historische kasteelhoeve vroeg om een statige toegang die het erfgoed eert en toch dagelijks comfortabel in gebruik is.',
        oplossing: 'Een brede draaipoort in handgesmeed staal met een sober klassiek profiel. Elk onderdeel werd met de hand geforceerd en gesmeed in het atelier.',
        afwerking: 'Handgesmeed staal, mat gelakt, smeedwerk per stuk afgewerkt.'
      }, {
        id: 'strandvilla',
        naam: 'Strandvilla Negen',
        regio: 'Oostduinkerke',
        materiaal: 'Cortenstaal',
        poorttype: 'Schuifpoort',
        woningtype: 'Kustvilla',
        stijl: 'Strak',
        automatisatie: 'Ja',
        span: '2,8 m',
        jaar: '2023',
        tone: 'corten',
        vraag: 'Een kustvilla wenste maximale privacy aan de straatzijde zonder de woning gesloten te laten ogen.',
        oplossing: 'Een schuifpoort in cortenstaal met dichte privacylamellen die het zicht breken maar lucht doorlaten. De patina sluit aan bij het duinlandschap.',
        afwerking: 'Cortenstaal met privacylamellen, geborstelde geleiding.'
      }, {
        id: 'eiksteen',
        naam: 'Eik en Steen',
        regio: 'Brasschaat',
        materiaal: 'Hout',
        poorttype: 'Draaipoort',
        woningtype: 'Villa',
        stijl: 'Tijdloos warm',
        automatisatie: 'Ja',
        span: '3,2 m',
        jaar: '2025',
        tone: 'dusk',
        uitgelicht: true,
        vraag: 'Een villa in het groen van Brasschaat zocht een warme houten poort die de woning verankert in haar bosrijke omgeving.',
        oplossing: 'Een draaipoort in massieve eik met een verticaal ritme dat de bomen weerspiegelt. Een verdoken stalen kader draagt de bewegende delen onzichtbaar.',
        afwerking: 'Massieve eik, natuurlijk geolied, verdoken stalen kern.'
      }, {
        id: 'park',
        naam: 'Park Mechelen',
        regio: 'Mechelen',
        materiaal: 'Aluminium',
        poorttype: 'Hekwerk',
        woningtype: 'Moderne woning',
        stijl: 'Strak',
        automatisatie: 'Deels',
        span: '24 m hekwerk',
        jaar: '2024',
        tone: 'morning',
        vraag: 'Een ruime tuin vroeg om een doorlopend hekwerk met een geïntegreerde poort, in één rustig beeld.',
        oplossing: 'Een hekwerk op maat in aluminium met een geïntegreerde schuifpoort. Hek en poort delen hetzelfde lamelprofiel, zodat de toegang opgaat in het geheel.',
        afwerking: 'Gepoederlakt aluminium, doorlopend lamelprofiel, lijnverlichting.'
      }];

      /* ----------------------------- Producten ----------------------------- */
      /* De productwisselaar toont de poortpagina voor elk type. Houten poorten is uitgewerkt
         als voorbeeldpagina; de andere types delen dezelfde rijke structuur. */
      const PRODUCTEN = {
        houten: {
          key: 'houten',
          naam: 'Houten poorten',
          kicker: 'Hout',
          tone: 'dusk',
          materiaalFilter: 'Hout',
          intro: 'Warm, levend en tijdloos. Een houten poort verankert uw woning in haar omgeving en wordt mooier met de jaren.',
          lead: 'Hout is het meest tactiele materiaal dat wij verwerken. Wij kiezen voor duurzame eik en thermisch behandelde houtsoorten, gedragen door een verdoken stalen kern die de poort jarenlang recht en stil houdt.',
          voorWie: ['Villa\u2019s en landelijke woningen die warmte en natuurlijkheid zoeken.', 'Renovaties waar hout aansluit bij gevel, schrijnwerk of omgeving.', 'Woningen in het groen waar de poort moet opgaan in het landschap.'],
          voordelen: [['Warme uitstraling', 'Hout brengt diepte en karakter die geen ander materiaal evenaart.'], ['Levende materie', 'De nerf en de toon verdiepen met de jaren tot een eigen patina.'], ['Stabiele kern', 'Een verdoken stalen kader houdt de poort recht en draagt de automatisatie.'], ['Volledig op maat', 'Elke lat, verhouding en afwerking wordt voor uw opening getekend.']],
          materialen: ['Massieve eik', 'Thermisch verduurzaamd hout', 'Afromezi en hardhout', 'Verdoken stalen kern'],
          afwerking: ['Natuurlijk geolied', 'Mat gelakt op kleur', 'Geborsteld en geloogd', 'Combinatie met staal of inox'],
          stijlen: [['Verticaal ritme', 'Smalle latten in een rustig verticaal patroon. Tijdloos en discreet.'], ['Vlak en dicht', 'Brede planken vlak naast elkaar voor maximale privacy en rust.'], ['Hout en metaal', 'Een houten invulling in een fijn stalen of aluminium kader.']],
          faq: [['Hoeveel onderhoud vraagt een houten poort?', 'Een houten poort vraagt periodiek een onderhoudsbeurt met olie of lak, afhankelijk van houtsoort en oriëntatie. Wij adviseren bij oplevering een ritme en blijven beschikbaar voor de opvolging.'], ['Blijft een houten poort recht?', 'Ja. Wij bouwen elke houten poort op een verdoken stalen kern. Die draagt het gewicht en de beweging, zodat het hout enkel zichtbaar werk doet en stabiel blijft.'], ['Welke houtsoort past het best?', 'Dat hangt af van uw woning, de oriëntatie en het gewenste onderhoud. Eik straalt warmte uit, thermisch hout is bijzonder stabiel. Tijdens het adviesgesprek bekijken wij samen wat past.']]
        },
        metalen: {
          key: 'metalen',
          naam: 'Metalen poorten',
          kicker: 'Staal',
          tone: 'stone',
          materiaalFilter: 'Smeedijzer',
          intro: 'Sterk, strak en bestand tegen de tijd. Een stalen poort geeft uw toegang gewicht en precisie.',
          lead: 'Staal laat ons de fijnste lijnen en de breedste overspanningen maken. Van strak plaatwerk tot handgesmeed profiel, elke poort wordt gelast en afgewerkt als één geheel in ons atelier.',
          voorWie: ['Woningen die kracht, precisie en een lange levensduur zoeken.', 'Brede opritten waar staal de overspanning moeielloos draagt.', 'Klassieke en eigentijdse architectuur die strakke lijnen vraagt.'],
          voordelen: [['Maximale sterkte', 'Staal draagt grote breedtes en blijft strak over de jaren.'], ['Fijne lijnen', 'Dunne profielen en scherpe details die enkel in staal kunnen.'], ['Handgesmeed mogelijk', 'Klassiek smeedwerk per stuk geforceerd en afgewerkt.'], ['Duurzame lak', 'Een gepoederlakte of natte laklaag beschermt jarenlang.']],
          materialen: ['Geborsteld plaatstaal', 'Handgesmeed staal', 'Buisprofielen op maat', 'Inox accenten'],
          afwerking: ['Gepoederlakt op kleur', 'Mat of zijdeglans', 'Gegalvaniseerd als basis', 'Smeedwerk met de hand'],
          stijlen: [['Strak plaatwerk', 'Gesloten of geperforeerde panelen voor een rustig modern beeld.'], ['Verticale spijlen', 'Een klassiek ritme van fijne verticale staven.'], ['Smeedwerk', 'Handgesmede details voor erfgoed en klassieke villa\u2019s.']],
          faq: [['Roest een stalen poort?', 'Niet wanneer hij correct is voorbehandeld en afgewerkt. Wij galvaniseren of gronden elke stalen poort en brengen daarna een duurzame laklaag aan.'], ['Hoe breed kan een stalen poort?', 'Staal draagt ruime overspanningen. Voor brede opritten kiezen wij vaak een schuifpoort in staal, die ook bij grote breedtes stil en stabiel beweegt.'], ['Kan smeedwerk modern ogen?', 'Zeker. Wij vertalen klassiek smeedwerk naar rustige, eigentijdse profielen die passen bij zowel erfgoed als nieuwbouw.']]
        },
        aluminium: {
          key: 'aluminium',
          naam: 'Aluminium poorten',
          kicker: 'Aluminium',
          tone: 'morning',
          materiaalFilter: 'Aluminium',
          intro: 'Onderhoudsarm, licht en strak. Aluminium is de keuze voor wie rust en gemak voorop stelt.',
          lead: 'Aluminium roest niet en vraagt nauwelijks onderhoud. Het materiaal laat strakke lamellen en grote vlakken toe, gepoederlakt in elke gewenste kleur en structuur.',
          voorWie: ['Moderne woningen en nieuwbouw met horizontale lijnen.', 'Wie een onderhoudsarme poort wenst zonder in te boeten op uitstraling.', 'Kustwoningen waar het zeeklimaat extra weerstand vraagt.'],
          voordelen: [['Onderhoudsarm', 'Aluminium roest niet en blijft jarenlang strak en kleurvast.'], ['Licht in gewicht', 'Soepele beweging en minder belasting voor de automatisatie.'], ['Strakke lamellen', 'Horizontale of verticale lamellen voor een rustig modern beeld.'], ['Vrije kleurkeuze', 'Gepoederlakt in elke kleur en structuur die de gevel vraagt.']],
          materialen: ['Geëxtrudeerde lamellen', 'Vlakke panelen', 'Geperforeerd aluminium', 'Inox accenten'],
          afwerking: ['Gepoederlakt fijnstructuur', 'Mat of zijdeglans', 'Houtlook coating', 'Tweekleurig op aanvraag'],
          stijlen: [['Horizontale lamellen', 'Brede lamellen die de horizon van de architectuur volgen.'], ['Vlak en gesloten', 'Een rustig dicht paneel voor maximale privacy.'], ['Lamel en glas', 'Aluminium gecombineerd met glas of een groene invulling.']],
          faq: [['Verkleurt aluminium in de zon?', 'Een kwalitatieve poederlak is uv bestendig en blijft jarenlang kleurvast. Wij werken enkel met coatings die geschikt zijn voor buitengebruik aan zee en in de stad.'], ['Is aluminium sterk genoeg?', 'Voor de meeste woningpoorten zeker. Voor zeer brede overspanningen versterken wij het profiel of kiezen wij voor een schuifuitvoering.'], ['Kan aluminium op hout lijken?', 'Ja. Een houtlook coating geeft de warmte van hout met het gemak van aluminium, zonder periodiek onderhoud.']]
        },
        staalhout: {
          key: 'staalhout',
          naam: 'Combinatie staal en hout',
          kicker: 'Staal en hout',
          tone: 'dusk',
          materiaalFilter: 'Staal en hout',
          intro: 'Het beste van twee materialen. Een stalen kader draagt, een houten invulling verwarmt.',
          lead: 'De combinatie van staal en hout verenigt kracht en warmte. Het staal geeft fijne lijnen en draagt de breedte en de beweging, het hout brengt karakter en tactiliteit.',
          voorWie: ['Woningen die warmte willen zonder de strakheid los te laten.', 'Brede opritten waar staal draagt en hout verzacht.', 'Renovaties die oud en nieuw met elkaar willen verbinden.'],
          voordelen: [['Kracht en warmte', 'Staal draagt en lijnt, hout verzacht en verwarmt.'], ['Brede overspanning', 'Het stalen kader maakt grote breedtes mogelijk.'], ['Contrastrijk', 'Mat staal naast warm hout geeft diepte en karakter.'], ['Volledig op maat', 'Verhouding, ritme en toon worden samen bepaald.']],
          materialen: ['Stalen kader op maat', 'Massieve eik', 'Thermisch hout', 'Inox bevestiging'],
          afwerking: ['Mat zwart staal', 'Geolied hout', 'Tweekleurige combinatie', 'Verdoken bevestiging'],
          stijlen: [['Kader en invulling', 'Een strak stalen kader met een warme houten invulling.'], ['Horizontaal banden', 'Afwisselende banden in staal en hout.'], ['Vlak contrast', 'Een gesloten houten vlak in een fijne stalen lijst.']],
          faq: [['Werkt hout en staal goed samen?', 'Ja, mits correct opgebouwd. Wij scheiden de materialen technisch zodat ze onafhankelijk kunnen werken, en houden het beeld strak en stabiel.'], ['Wat draagt de poort?', 'Het stalen kader draagt het gewicht en de beweging. Het hout is de zichtbare invulling en blijft daardoor stabiel.'], ['Hoeveel onderhoud?', 'Het hout vraagt periodiek olie of lak, het staal nauwelijks. Wij adviseren een ritme bij oplevering.']]
        },
        schuif: {
          key: 'schuif',
          naam: 'Schuifpoorten',
          kicker: 'Poorttype',
          tone: 'corten',
          materiaalFilter: null,
          intro: 'De keuze voor brede opritten en beperkte ruimte. Een schuifpoort beweegt zijwaarts en vraagt geen zwenkruimte.',
          lead: 'Een schuifpoort glijdt opzij in plaats van open te draaien. Ideaal voor hellende opritten, beperkte diepte of grote breedtes. Wij maken hem in hout, aluminium, staal of cortenstaal.',
          voorWie: ['Brede opritten die geen zwenkruimte voor een draaipoort hebben.', 'Hellende terreinen waar een draaipoort niet vlot opent.', 'Wie een rustige, horizontale beweging verkiest.'],
          voordelen: [['Geen zwenkruimte', 'De poort schuift opzij en wint kostbare opritruimte.'], ['Geschikt voor breed', 'Grote overspanningen bewegen stil en stabiel.'], ['Werkt op een helling', 'Ook op hellend terrein blijft de beweging vlot.'], ['Robuuste geleiding', 'Een verdoken loopwerk draagt de poort jarenlang.']],
          materialen: ['Cortenstaal', 'Aluminium lamellen', 'Staal en hout', 'Massieve eik'],
          afwerking: ['Vrijdragend of op rail', 'Verdoken loopwiel', 'Privacylamellen', 'Geïntegreerde verlichting'],
          stijlen: [['Vrijdragend', 'Zonder rail op de grond, voor een vlakke en strakke oprit.'], ['Lamellen', 'Een rustig horizontaal ritme dat privacy met lucht combineert.'], ['Dicht paneel', 'Een gesloten vlak voor maximale beslotenheid.']],
          faq: [['Wat is een vrijdragende schuifpoort?', 'Een vrijdragende poort heeft geen rail in de grond. Hij wordt gedragen door een verdoken loopwerk naast de oprit, zodat de doorgang vlak en obstakelvrij blijft.'], ['Schuifpoort of draaipoort?', 'Een schuifpoort wint ruimte en werkt goed op hellingen en brede opritten. Een draaipoort is rustiger en klassieker bij voldoende plaats. Wij adviseren op basis van uw terrein.'], ['Hoe stil is de beweging?', 'Een correct geplaatste schuifpoort beweegt nagenoeg geruisloos dankzij een kwalitatief loopwerk en een zachte demping bij begin en einde.']]
        },
        draai: {
          key: 'draai',
          naam: 'Draaipoorten',
          kicker: 'Poorttype',
          tone: 'morning',
          materiaalFilter: null,
          intro: 'De klassieke en meest verfijnde beweging. Een draaipoort opent statig naar binnen of buiten.',
          lead: 'Een draaipoort draait op verdoken scharnieren en geeft uw toegang een rustige, klassieke beweging. In één of twee vleugels, in elk materiaal dat bij uw woning past.',
          voorWie: ['Woningen met voldoende oprijdiepte voor de zwenkbeweging.', 'Wie de klassieke, statige opening van een draaipoort verkiest.', 'Smalle voetgangerstoegangen naast een grotere oprijpoort.'],
          voordelen: [['Klassieke beweging', 'Een rustige, statige opening die tijdloos aanvoelt.'], ['Eén of twee vleugels', 'Enkel of dubbel, afgestemd op de breedte van de opening.'], ['Verfijnde details', 'Verdoken scharnieren en een vlakke aansluiting.'], ['Elk materiaal', 'Hout, aluminium, staal of een combinatie naar keuze.']],
          materialen: ['Aluminium', 'Massieve eik', 'Handgesmeed staal', 'Staal en hout'],
          afwerking: ['Verdoken scharnieren', 'Zachte demping', 'Ingewerkt slot', 'Geïntegreerde voetgangerspoort'],
          stijlen: [['Enkele vleugel', 'Eén rustige vleugel voor smallere toegangen.'], ['Dubbele vleugel', 'Twee vleugels die symmetrisch openen voor brede opritten.'], ['Met loopdeur', 'Een geïntegreerde voetgangerspoort in hetzelfde beeld.']],
          faq: [['Hoeveel ruimte vraagt een draaipoort?', 'Een draaipoort heeft zwenkruimte nodig voor de vleugels. Bij beperkte diepte adviseren wij een schuifpoort of een opening naar binnen.'], ['Eén of twee vleugels?', 'Dat hangt af van de breedte. Tot ongeveer drie meter volstaat vaak één vleugel, daarboven kiezen wij meestal voor twee.'], ['Kan er een loopdeur in?', 'Ja. Wij integreren een voetgangerspoort in dezelfde lijn, zodat het beeld rustig en samenhangend blijft.']]
        },
        hekwerk: {
          key: 'hekwerk',
          naam: 'Hekwerken op maat',
          kicker: 'Hekwerk',
          tone: 'stone',
          materiaalFilter: null,
          intro: 'Eén doorlopend beeld rond uw eigendom. Een hekwerk dat naadloos aansluit bij de poort.',
          lead: 'Een hekwerk op maat omkadert uw woning in hetzelfde profiel en dezelfde toon als de poort. Zo wordt de volledige afsluiting één rustig, samenhangend geheel.',
          voorWie: ['Eigendommen die poort en omheining in één beeld willen.', 'Tuinen die afgeschermd worden zonder zwaar of gesloten te ogen.', 'Projecten waar de afsluiting de architectuur moet versterken.'],
          voordelen: [['Eén geheel', 'Hek en poort delen hetzelfde profiel en dezelfde toon.'], ['Op maat van het terrein', 'Volgt hoogteverschillen en hoeken nauwkeurig.'], ['Open of besloten', 'Van transparant tot volledig privacygericht.'], ['Duurzame materialen', 'Aluminium, staal of cortenstaal, naar keuze.']],
          materialen: ['Aluminium lamellen', 'Cortenstaal', 'Verticale spijlen', 'Gecombineerd met groen'],
          afwerking: ['Doorlopend lamelprofiel', 'Lijnverlichting', 'Geïntegreerde poort', 'Op maat van de helling'],
          stijlen: [['Lamellen', 'Een doorlopend horizontaal ritme rond het volledige terrein.'], ['Spijlen', 'Fijne verticale staven voor een open, klassiek beeld.'], ['Vol en groen', 'Dichte panelen afgewisseld met beplanting.']],
          faq: [['Sluit het hekwerk aan op de poort?', 'Ja, dat is net het uitgangspunt. Wij tekenen hek en poort in hetzelfde profiel, zodat de toegang opgaat in de volledige afsluiting.'], ['Volgt het hekwerk een helling?', 'Zeker. Wij meten het terrein nauwkeurig op en laten het hekwerk de hoogteverschillen en hoeken rustig volgen.'], ['Hoe transparant kan een hekwerk?', 'Van volledig open met fijne spijlen tot volledig besloten met dichte panelen. Wij stemmen de mate van privacy af op uw wens en ligging.']]
        },
        automatisatie: {
          key: 'automatisatie',
          naam: 'Automatisatie',
          kicker: 'Techniek',
          tone: 'dusk',
          materiaalFilter: null,
          intro: 'Comfort dat u dagelijks voelt. Een poort die stil, veilig en betrouwbaar opent.',
          lead: 'Automatisatie is techniek die onzichtbaar hoort te zijn. Wij integreren betrouwbare aandrijving, veilige detectie en eenvoudige bediening, en blijven beschikbaar voor onderhoud en herstelling.',
          voorWie: ['Wie comfort en veiligheid bij de dagelijkse toegang verwacht.', 'Bestaande poorten die toe zijn aan een betrouwbare aandrijving.', 'Nieuwe poorten waar de techniek van bij het ontwerp wordt ingepast.'],
          voordelen: [['Verdoken techniek', 'Aandrijving in de fundering of discreet weggewerkt.'], ['Veilige detectie', 'Sensoren en beveiliging tegen klem en obstakels.'], ['Eenvoudige bediening', 'Afstandsbediening, codeklavier of bediening via uw telefoon.'], ['Sterke opvolging', 'Wij blijven bereikbaar voor onderhoud en herstelling.']],
          materialen: ['Ondergrondse aandrijving', 'Zijdelingse motor', 'Schuifpoortmotor', 'Back up batterij'],
          afwerking: ['Codeklavier', 'Afstandsbediening', 'Bediening via telefoon', 'Veiligheidssensoren'],
          stijlen: [['Ondergronds', 'Een verdoken motor in de fundering, volledig uit het zicht.'], ['Verdoken zijwaarts', 'Een discrete motor weggewerkt in de paal of de muur.'], ['Schuifaandrijving', 'Een robuuste, stille aandrijving voor schuifpoorten.']],
          faq: [['Werkt automatisatie ook op mijn bestaande poort?', 'Vaak wel. Wij beoordelen tijdens een plaatsbezoek of de poort en de constructie geschikt zijn en welke aandrijving past.'], ['Wat gebeurt er bij stroomuitval?', 'Wij voorzien waar gewenst een back up batterij en een handmatige ontgrendeling, zodat de poort altijd te openen blijft.'], ['Is automatisatie veilig?', 'Ja. Wij plaatsen veiligheidssensoren die detecteren wanneer iets of iemand zich in de baan bevindt, en stemmen de kracht zorgvuldig af.']]
        }
      };
      const PRODUCT_VOLGORDE = ['houten', 'metalen', 'aluminium', 'staalhout', 'schuif', 'draai', 'hekwerk', 'automatisatie'];

      /* ----------------------------- Werkwijze ----------------------------- */
      const WERKWIJZE = [['01', 'Eerste contact en adviesgesprek', 'Alles begint met een gesprek. Wij luisteren naar uw woning, uw oprit en het gevoel dat u zoekt. Geen catalogus, maar een eerlijk advies over wat past.'], ['02', 'Plaatsbezoek en opmeting', 'Wij komen ter plaatse, lezen de architectuur en de toegang, en meten nauwkeurig op. Zo houdt het ontwerp rekening met helling, breedte en gebruik.'], ['03', 'Ontwerp en voorstel', 'U ontvangt een ontwerp op maat met materiaal, ritme, afwerking en automatisatie. Wij verfijnen samen tot elk detail klopt.'], ['04', 'Productie en afwerking', 'In ons atelier wordt uw poort gesneden, gelast en met de hand afgewerkt. Eén object, geen samengesteld pakket.'], ['05', 'Plaatsing en automatisatie', 'Onze eigen plaatsers monteren de poort en stellen de verdoken automatisatie nauwkeurig af. Wij leveren proper en stil op.'], ['06', 'Oplevering en service na verkoop', 'Wij overlopen het gebruik en het onderhoud, en blijven daarna bereikbaar. Service is voor ons een onderdeel van kwaliteit.']];

      /* ----------------------------- Vertrouwensclaims ----------------------------- */
      const CLAIMS = ['Handgemaakt in België', 'Duurzame materialen', 'Advies, opmeting en plaatsing door specialisten', 'Sterke service na verkoop'];

      /* ----------------------------- Homepage FAQ ----------------------------- */
      const HOME_FAQ = [['Hoe lang duurt het maken en plaatsen van een poort?', 'Een traject van eerste contact tot plaatsing duurt gemiddeld zes tot acht weken. De exacte termijn hangt af van materiaal, ontwerp en automatisatie. Wij bevestigen een realistische planning bij het voorstel.'], ['Waarom is een Belgische poort op maat duurder dan import?', 'U investeert in Belgisch handwerk, duurzame materialen, een correcte plaatsing en een sterke service na verkoop. Geen importproduct uit een doos, maar een poort die voor uw woning is getekend en jarenlang vertrouwen geeft.'], ['Komen jullie altijd ter plaatse?', 'Ja. Er is altijd een plaatsbezoek en een adviesgesprek met opmeting. Zo houdt het ontwerp rekening met uw terrein, uw architectuur en uw dagelijks gebruik.'], ['Welk materiaal past het best bij mijn woning?', 'Dat bepalen wij samen. Hout brengt warmte, aluminium is onderhoudsarm, staal geeft kracht en cortenstaal verkleurt mee met het landschap. Tijdens het adviesgesprek bekijken wij wat bij uw woning past.']];

      /* ----------------------------- Advies ----------------------------- */
      const ADVIES = [['Welke poort past bij een moderne woning?', 'Materialen', 'Strakke lijnen, lamellen en aluminium voor een rustige, eigentijdse toegang.'], ['Welke poort past bij een landelijke woning?', 'Inspiratie', 'Hout en staal die warmte en robuustheid verenigen in een landelijke omgeving.'], ['Schuifpoort of draaipoort kiezen?', 'Poorttypes', 'Hoe ruimte, helling en uitstraling uw keuze tussen schuiven en draaien bepalen.'], ['Aluminium, staal of hout voor uw poort?', 'Materialen', 'Een nuchtere vergelijking van de drie materialen die wij het vaakst verwerken.'], ['Wat bepaalt de prijs van een poort op maat?', 'Prijs en investering', 'Welke keuzes de investering sturen, en waarom maatwerk meer waarde biedt dan import.'], ['Hoe verloopt een plaatsbezoek?', 'Proces', 'Wat u mag verwachten van het adviesgesprek, de opmeting en het voorstel.']];
      Object.assign(window, {
        PROJECTEN,
        PRODUCTEN,
        PRODUCT_VOLGORDE,
        WERKWIJZE,
        CLAIMS,
        HOME_FAQ,
        ADVIES
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "ui_kits/website-nl/data-nl.jsx",
      error: String(e && e.message || e)
    });
  }

  // ui_kits/website-nl/shared-nl.jsx
  try {
    (() => {
      /* Poortland — Nederlandse website. Gedeelde bouwstenen.
         Nav met productmenu en taalwisselaar, footer, beeldplaceholder, reveal animatie. */

      const {
        Button: SButton,
        Tag: STag,
        Eyebrow: SEyebrow
      } = window.PoortlandDesignSystem_6dcc8b;

      /* ---- Reveal: zachte fade en lichte verschuiving bij het in beeld komen ---- */
      function Reveal({
        children,
        delay = 0,
        y = 18,
        style
      }) {
        const ref = React.useRef(null);
        const [shown, setShown] = React.useState(false);
        React.useEffect(() => {
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
        const talen = ['NL', 'FR', 'DE', 'EN'];
        const faint = dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)';
        const active = dark ? 'var(--stone-100)' : 'var(--text-heading)';
        return /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 2
          },
          role: "group",
          "aria-label": "Taal"
        }, talen.map((t, i) => /*#__PURE__*/React.createElement(React.Fragment, {
          key: t
        }, i > 0 && /*#__PURE__*/React.createElement("span", {
          style: {
            color: faint,
            opacity: 0.4,
            fontSize: 11
          }
        }, "\xB7"), /*#__PURE__*/React.createElement("button", {
          onClick: () => onLang(t),
          "aria-pressed": lang === t,
          style: {
            background: 'none',
            border: 0,
            cursor: 'pointer',
            padding: '4px 5px',
            fontFamily: 'var(--font-label)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: lang === t ? active : faint,
            borderBottom: lang === t ? '1px solid var(--accent)' : '1px solid transparent'
          }
        }, t))));
      }

      /* ---- Hoofdnavigatie met productmenu ---- */
      const PRODUCT_MENU = [['houten', 'Houten poorten'], ['metalen', 'Metalen poorten'], ['aluminium', 'Aluminium poorten'], ['staalhout', 'Combinatie staal en hout'], ['schuif', 'Schuifpoorten'], ['draai', 'Draaipoorten'], ['hekwerk', 'Hekwerken op maat'], ['automatisatie', 'Automatisatie']];
      function Nav({
        route,
        onNav,
        lang,
        onLang
      }) {
        const [openMenu, setOpenMenu] = React.useState(false);
        const items = [['realisaties', 'Realisaties'], ['werkwijze', 'Werkwijze'], ['atelier', 'Over Poortland'], ['contact', 'Contact']];
        const fg = 'var(--stone-200)';
        const faint = 'var(--text-on-dark-muted)';
        return /*#__PURE__*/React.createElement("header", {
          onMouseLeave: () => setOpenMenu(false),
          style: {
            position: 'sticky',
            top: 0,
            zIndex: 40,
            background: 'rgba(15,22,15,0.88)',
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
            setOpenMenu(false);
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
          onMouseEnter: () => setOpenMenu(true),
          onClick: () => setOpenMenu(v => !v),
          "aria-expanded": openMenu,
          style: {
            background: 'none',
            border: 0,
            cursor: 'pointer',
            padding: '4px 0',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            fontWeight: route === 'product' ? 600 : 400,
            color: route === 'product' || openMenu ? fg : faint,
            borderBottom: route === 'product' ? '1px solid var(--accent)' : '1px solid transparent'
          }
        }, "Poorten", /*#__PURE__*/React.createElement("span", {
          "aria-hidden": "true",
          style: {
            fontSize: 9,
            transition: 'transform var(--dur) var(--ease-out)',
            transform: openMenu ? 'rotate(180deg)' : 'none',
            display: 'inline-block'
          }
        }, "\u25BE")), items.map(([key, label]) => /*#__PURE__*/React.createElement("button", {
          key: key,
          onClick: () => {
            onNav(key);
            setOpenMenu(false);
          },
          style: {
            background: 'none',
            border: 0,
            cursor: 'pointer',
            padding: '4px 0',
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            fontWeight: route === key ? 600 : 400,
            color: route === key ? fg : faint,
            borderBottom: route === key ? '1px solid var(--accent)' : '1px solid transparent'
          }
        }, label)), /*#__PURE__*/React.createElement("span", {
          style: {
            width: 1,
            height: 18,
            background: 'var(--line-on-dark-soft)'
          }
        }), /*#__PURE__*/React.createElement(TaalWisselaar, {
          lang: lang,
          onLang: onLang,
          dark: true
        }), /*#__PURE__*/React.createElement(SButton, {
          variant: "primary",
          size: "sm",
          arrow: true,
          as: "button",
          onClick: () => {
            onNav('contact');
            setOpenMenu(false);
          }
        }, "Plan een adviesgesprek"))), /*#__PURE__*/React.createElement("div", {
          style: {
            overflow: 'hidden',
            maxHeight: openMenu ? 320 : 0,
            transition: 'max-height 360ms var(--ease-out)',
            borderTop: openMenu ? '1px solid var(--line-on-dark-soft)' : '1px solid transparent',
            background: 'rgba(15,22,15,0.97)'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1320,
            margin: '0 auto',
            padding: '26px 44px 30px'
          }
        }, /*#__PURE__*/React.createElement(SEyebrow, {
          dark: true,
          tone: "muted",
          style: {
            marginBottom: 16
          }
        }, "Poorten, hekwerken en automatisatie"), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '4px 20px'
          }
        }, PRODUCT_MENU.map(([key, label]) => /*#__PURE__*/React.createElement("button", {
          key: key,
          onClick: () => {
            onNav('product', {
              productKey: key
            });
            setOpenMenu(false);
          },
          style: {
            textAlign: 'left',
            background: 'none',
            border: 0,
            cursor: 'pointer',
            padding: '11px 12px',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            color: 'var(--stone-200)',
            transition: 'background var(--dur) var(--ease-out), color var(--dur) var(--ease-out)'
          },
          onMouseEnter: e => {
            e.currentTarget.style.background = 'var(--forest-800)';
            e.currentTarget.style.color = 'var(--stone-100)';
          },
          onMouseLeave: e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--stone-200)';
          }
        }, label))))));
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
        }, "Deze taalversie is in voorbereiding \xB7 u bekijkt de Nederlandse versie");
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
        }, "\u2014"), /*#__PURE__*/React.createElement("span", {
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
            background: dark ? 'var(--forest-950)' : 'var(--surface-paper)',
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
          onClick: () => onNav('atelier')
        }, "Bezoek onze showroom"))));
      }

      /* ---- Footer ---- */
      function Footer({
        onNav,
        lang,
        onLang
      }) {
        return /*#__PURE__*/React.createElement("footer", {
          style: {
            background: 'var(--forest-950)',
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
            marginBottom: 18
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
        }, "Handgemaakte toegangspoorten, hekwerken en automatisatie op maat. Ontworpen, gemaakt en geplaatst in Belgi\xEB."), /*#__PURE__*/React.createElement(TaalWisselaar, {
          lang: lang,
          onLang: onLang,
          dark: true
        })), /*#__PURE__*/React.createElement(FooterKol, {
          title: "Poorten",
          links: [['Houten poorten', () => onNav('product', {
            productKey: 'houten'
          })], ['Aluminium poorten', () => onNav('product', {
            productKey: 'aluminium'
          })], ['Schuifpoorten', () => onNav('product', {
            productKey: 'schuif'
          })], ['Hekwerken', () => onNav('product', {
            productKey: 'hekwerk'
          })], ['Automatisatie', () => onNav('product', {
            productKey: 'automatisatie'
          })]]
        }), /*#__PURE__*/React.createElement(FooterKol, {
          title: "Ontdek",
          links: [['Realisaties', () => onNav('realisaties')], ['Werkwijze', () => onNav('werkwijze')], ['Over Poortland', () => onNav('atelier')], ['Contact', () => onNav('contact')]]
        }), /*#__PURE__*/React.createElement(FooterKol, {
          title: "Atelier en showroom",
          links: [['Dok Noord 4, 9000 Gent'], ['+32 9 224 18 70'], ['hallo@poortland.be'], ['Open op afspraak']]
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
        }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Poortland \u2014 Handgemaakt in Belgi\xEB sinds 1992"), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 22,
            letterSpacing: '0.06em'
          }
        }, /*#__PURE__*/React.createElement("button", {
          onClick: () => onNav('atelier'),
          style: {
            background: 'none',
            border: 0,
            color: 'inherit',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 'inherit'
          }
        }, "Privacybeleid"), /*#__PURE__*/React.createElement("button", {
          onClick: () => onNav('atelier'),
          style: {
            background: 'none',
            border: 0,
            color: 'inherit',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 'inherit'
          }
        }, "Cookiebeleid"), /*#__PURE__*/React.createElement("span", null, "BTW BE 0xxx.xxx.xxx")))));
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
      Object.assign(window, {
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
        SectieKop
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "ui_kits/website-nl/shared-nl.jsx",
      error: String(e && e.message || e)
    });
  }

  // ui_kits/website/Collection.jsx
  try {
    (() => {
      /* Poortland website — Collection */
      const {
        Button: CButton,
        Tag: CTag,
        Eyebrow: CEyebrow
      } = window.PoortlandDesignSystem_6dcc8b;
      function Collection({
        onNav
      }) {
        const {
          GateImage,
          PROJECTS
        } = window;
        const materials = ['All', 'Corten', 'Aluminium', 'Oak & steel', 'Forged steel'];
        const [filter, setFilter] = React.useState('All');
        const shown = filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.material === filter);
        return /*#__PURE__*/React.createElement("div", {
          style: {
            background: 'var(--surface-paper)',
            minHeight: '70vh'
          }
        }, /*#__PURE__*/React.createElement("section", {
          style: {
            padding: '64px 40px 30px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1180,
            margin: '0 auto'
          }
        }, /*#__PURE__*/React.createElement(CEyebrow, {
          style: {
            marginBottom: 16
          }
        }, "The collection"), /*#__PURE__*/React.createElement("h1", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 56,
            color: 'var(--text-heading)',
            margin: 0,
            letterSpacing: '-0.01em',
            lineHeight: 1.02
          }
        }, "Every gate, an address."), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 16,
            color: 'var(--text-muted)',
            maxWidth: '52ch',
            marginTop: 18,
            lineHeight: 1.6
          }
        }, "A selection of recent commissions across Belgium. Filter by material; open any project for its specification."), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 10,
            marginTop: 30,
            flexWrap: 'wrap'
          }
        }, materials.map(m => {
          const active = filter === m;
          return /*#__PURE__*/React.createElement("button", {
            key: m,
            onClick: () => setFilter(m),
            style: {
              fontFamily: 'var(--font-label)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '8px 15px',
              borderRadius: 'var(--radius-xs)',
              cursor: 'pointer',
              background: active ? 'var(--bronze-500)' : 'transparent',
              color: active ? 'var(--forest-950)' : 'var(--text-body)',
              border: `1px solid ${active ? 'var(--bronze-500)' : 'var(--line-on-light)'}`,
              transition: 'all var(--dur) var(--ease-out)'
            }
          }, m);
        })))), /*#__PURE__*/React.createElement("section", {
          style: {
            padding: '20px 40px 88px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1180,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24
          }
        }, shown.map(p => /*#__PURE__*/React.createElement("button", {
          key: p.id,
          onClick: () => onNav('project', p),
          style: {
            textAlign: 'left',
            background: 'none',
            border: 0,
            padding: 0,
            cursor: 'pointer'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--line-on-light-soft)',
            background: 'var(--surface-card)'
          }
        }, /*#__PURE__*/React.createElement(GateImage, {
          tone: p.tone,
          ratio: "4 / 3",
          label: p.material,
          radius: 0
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            padding: '16px 18px 20px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline'
          }
        }, /*#__PURE__*/React.createElement(CEyebrow, null, p.place), /*#__PURE__*/React.createElement("span", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            color: 'var(--text-faint)'
          }
        }, p.year)), /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-display)',
            fontSize: 24,
            color: 'var(--text-heading)',
            lineHeight: 1.1,
            marginTop: 7
          }
        }, p.name), /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            color: 'var(--text-muted)',
            marginTop: 6
          }
        }, p.type, " \xB7 ", p.span))))))));
      }
      window.Collection = Collection;
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "ui_kits/website/Collection.jsx",
      error: String(e && e.message || e)
    });
  }

  // ui_kits/website/Contact.jsx
  try {
    (() => {
      /* Poortland website — Contact (enquiry) */
      const {
        Button: KButton,
        Input: KInput,
        Eyebrow: KEyebrow
      } = window.PoortlandDesignSystem_6dcc8b;
      function Contact() {
        const [sent, setSent] = React.useState(false);
        return /*#__PURE__*/React.createElement("div", {
          style: {
            background: 'var(--surface-ground)',
            color: 'var(--text-on-dark)'
          }
        }, /*#__PURE__*/React.createElement("section", {
          style: {
            padding: '70px 40px 90px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1100,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '0.95fr 1.05fr',
            gap: 72
          }
        }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(KEyebrow, {
          dark: true,
          style: {
            marginBottom: 20
          }
        }, "Begin a commission"), /*#__PURE__*/React.createElement("h1", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 54,
            color: 'var(--stone-100)',
            margin: 0,
            lineHeight: 1.03,
            letterSpacing: '-0.01em'
          }
        }, "Tell us about", /*#__PURE__*/React.createElement("br", null), "the entrance."), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 16,
            lineHeight: 1.7,
            color: 'var(--stone-300)',
            maxWidth: '40ch',
            marginTop: 22
          }
        }, "Share a little about the house, the opening and the feeling you are after. We reply to every enquiry within two working days."), /*#__PURE__*/React.createElement("div", {
          style: {
            marginTop: 40,
            display: 'flex',
            flexDirection: 'column',
            gap: 22
          }
        }, [['Atelier', 'Dok-Noord 4, 9000 Ghent, Belgium'], ['Telephone', '+32 9 224 18 70'], ['Email', 'hello@poortland.be']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
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
            color: 'var(--stone-200)'
          }
        }, v))))), /*#__PURE__*/React.createElement("div", {
          style: {
            background: 'var(--forest-850)',
            borderRadius: 'var(--radius-lg)',
            padding: '34px 34px 38px',
            border: '1px solid var(--line-on-dark-soft)'
          }
        }, sent ? /*#__PURE__*/React.createElement("div", {
          style: {
            minHeight: 360,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center'
          }
        }, /*#__PURE__*/React.createElement("img", {
          src: "../../assets/mono-on-dark.png",
          width: "40",
          height: "40",
          alt: "",
          style: {
            marginBottom: 20
          }
        }), /*#__PURE__*/React.createElement("h3", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 32,
            color: 'var(--stone-100)',
            margin: 0
          }
        }, "Thank you."), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 15,
            color: 'var(--stone-300)',
            marginTop: 12,
            maxWidth: '34ch'
          }
        }, "Your enquiry is with the atelier. We'll be in touch within two working days."), /*#__PURE__*/React.createElement("div", {
          style: {
            marginTop: 24
          }
        }, /*#__PURE__*/React.createElement(KButton, {
          variant: "secondary",
          dark: true,
          onClick: () => setSent(false)
        }, "Send another"))) : /*#__PURE__*/React.createElement("form", {
          onSubmit: e => {
            e.preventDefault();
            setSent(true);
          },
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 22
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 22
          }
        }, /*#__PURE__*/React.createElement(KInput, {
          label: "Name",
          dark: true,
          placeholder: "Lucas Vermeulen",
          required: true
        }), /*#__PURE__*/React.createElement(KInput, {
          label: "Email",
          dark: true,
          type: "email",
          placeholder: "you@estate.be",
          required: true
        })), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 22
          }
        }, /*#__PURE__*/React.createElement(KInput, {
          label: "Location",
          dark: true,
          placeholder: "Knokke, BE"
        }), /*#__PURE__*/React.createElement(KInput, {
          label: "Material",
          dark: true,
          placeholder: "Corten / aluminium\u2026"
        })), /*#__PURE__*/React.createElement(KInput, {
          label: "About the project",
          dark: true,
          as: "textarea",
          placeholder: "The opening is roughly 4m, a sliding gate for the drive\u2026"
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 4
          }
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            color: 'var(--text-on-dark-faint)'
          }
        }, "No obligation \xB7 we reply within 2 days"), /*#__PURE__*/React.createElement(KButton, {
          variant: "primary",
          arrow: true,
          as: "button",
          type: "submit"
        }, "Send enquiry")))))));
      }
      window.Contact = Contact;
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "ui_kits/website/Contact.jsx",
      error: String(e && e.message || e)
    });
  }

  // ui_kits/website/Home.jsx
  try {
    (() => {
      /* Poortland website — Home */
      const {
        Button: PButton,
        Tag: PTag,
        Eyebrow: PEyebrow
      } = window.PoortlandDesignSystem_6dcc8b;
      function Home({
        onNav
      }) {
        const {
          GateImage,
          PROJECTS
        } = window;
        const featured = PROJECTS.slice(0, 3);
        return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--surface-ground)',
            color: 'var(--text-on-dark)',
            padding: '64px 40px 64px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1180,
            margin: '0 auto'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: '1.05fr 0.95fr',
            gap: 56,
            alignItems: 'center'
          }
        }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PEyebrow, {
          dark: true,
          style: {
            marginBottom: 22
          }
        }, "Custom gates \xB7 Belgium"), /*#__PURE__*/React.createElement("h1", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 72,
            lineHeight: 1.02,
            letterSpacing: '-0.01em',
            color: 'var(--stone-100)',
            margin: 0
          }
        }, "The quiet entrance to", /*#__PURE__*/React.createElement("br", null), "a remarkable house."), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 19,
            lineHeight: 1.6,
            color: 'var(--stone-300)',
            maxWidth: '46ch',
            margin: '26px 0 32px'
          }
        }, "We draw, forge and finish every gate by hand \u2014 in corten, brushed aluminium, oak and steel \u2014 shaped to the architecture it belongs to."), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 16,
            alignItems: 'center'
          }
        }, /*#__PURE__*/React.createElement(PButton, {
          variant: "primary",
          arrow: true,
          onClick: () => onNav('contact')
        }, "Request a consultation"), /*#__PURE__*/React.createElement(PButton, {
          variant: "ghost",
          dark: true,
          arrow: true,
          onClick: () => onNav('collection')
        }, "View the collection")), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 40,
            marginTop: 52,
            paddingBottom: 4
          }
        }, [['1992', 'Established'], ['100%', 'Hand made'], ['320+', 'Estates fitted']].map(([n, l]) => /*#__PURE__*/React.createElement("div", {
          key: l
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-display)',
            fontSize: 34,
            color: 'var(--stone-100)',
            lineHeight: 1
          }
        }, n), /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-label)',
            fontSize: 10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--text-on-dark-muted)',
            marginTop: 7
          }
        }, l))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
          style: {
            borderRadius: 8,
            overflow: 'hidden',
            position: 'relative',
            aspectRatio: '3 / 2',
            boxShadow: 'var(--shadow-lg)'
          }
        }, /*#__PURE__*/React.createElement("img", {
          src: "../../assets/poort-oak-hero.jpeg",
          alt: "Hand made oak gate by Poortland",
          style: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: '50% 50%',
            display: 'block'
          }
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(15,22,15,0) 55%, rgba(15,22,15,0.55) 100%)'
          }
        }), /*#__PURE__*/React.createElement("span", {
          style: {
            position: 'absolute',
            left: 16,
            bottom: 14,
            fontFamily: 'var(--font-label)',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(236,227,210,0.92)'
          }
        }, "Oak \xB7 hand made in Belgium")))))), /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--surface-paper)',
            padding: '88px 40px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1180,
            margin: '0 auto'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 38
          }
        }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PEyebrow, {
          style: {
            marginBottom: 14
          }
        }, "Selected work"), /*#__PURE__*/React.createElement("h2", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 42,
            color: 'var(--text-heading)',
            margin: 0,
            letterSpacing: '-0.01em'
          }
        }, "Gates with an address.")), /*#__PURE__*/React.createElement(PButton, {
          variant: "secondary",
          onClick: () => onNav('collection')
        }, "All projects")), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24
          }
        }, featured.map(p => /*#__PURE__*/React.createElement("button", {
          key: p.id,
          onClick: () => onNav('project', p),
          style: {
            textAlign: 'left',
            background: 'none',
            border: 0,
            padding: 0,
            cursor: 'pointer'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--line-on-light-soft)'
          }
        }, /*#__PURE__*/React.createElement(GateImage, {
          tone: p.tone,
          ratio: "4 / 3",
          label: `${p.material}`,
          radius: 0
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            padding: '16px 18px 20px',
            background: 'var(--surface-card)'
          }
        }, /*#__PURE__*/React.createElement(PEyebrow, {
          style: {
            marginBottom: 7
          }
        }, p.material, " \xB7 ", p.place), /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-display)',
            fontSize: 24,
            color: 'var(--text-heading)',
            lineHeight: 1.1
          }
        }, p.name), /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            color: 'var(--text-muted)',
            marginTop: 7
          }
        }, p.type, " \xB7 ", p.span)))))))), /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--forest-900)',
            padding: '74px 40px',
            color: 'var(--text-on-dark)'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1180,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '0.8fr 1.2fr',
            gap: 56,
            alignItems: 'center'
          }
        }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PEyebrow, {
          dark: true,
          style: {
            marginBottom: 16
          }
        }, "The material"), /*#__PURE__*/React.createElement("h2", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 38,
            color: 'var(--stone-100)',
            margin: 0,
            lineHeight: 1.08
          }
        }, "Four materials,", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
          style: {
            fontStyle: 'italic',
            color: 'var(--accent)'
          }
        }, "endlessly"), " detailed."), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 15,
            lineHeight: 1.7,
            color: 'var(--stone-300)',
            maxWidth: '38ch',
            marginTop: 18
          }
        }, "Each begins as a drawing and ends as a single, welded object \u2014 no catalogue, no two alike.")), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 14
          }
        }, [['Corten', 'Weathered, living surface'], ['Aluminium', 'Brushed, powder-coated'], ['Oak', 'Warm timber infill'], ['Forged steel', 'Hand-wrought bars']].map(([m, d]) => /*#__PURE__*/React.createElement("div", {
          key: m,
          style: {
            border: '1px solid var(--line-on-dark-soft)',
            borderRadius: 'var(--radius-sm)',
            padding: '18px 18px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            color: 'var(--stone-100)'
          }
        }, m), /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 12.5,
            color: 'var(--text-on-dark-muted)',
            marginTop: 5
          }
        }, d)))))), /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--surface-paper)',
            padding: '90px 40px',
            textAlign: 'center'
          }
        }, /*#__PURE__*/React.createElement(PEyebrow, {
          style: {
            marginBottom: 18
          }
        }, "Begin a commission"), /*#__PURE__*/React.createElement("h2", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 52,
            color: 'var(--text-heading)',
            margin: '0 auto 26px',
            maxWidth: '16ch',
            lineHeight: 1.05
          }
        }, "Tell us about the entrance."), /*#__PURE__*/React.createElement(PButton, {
          variant: "primary",
          size: "lg",
          arrow: true,
          onClick: () => onNav('contact')
        }, "Request a consultation")));
      }
      window.Home = Home;
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "ui_kits/website/Home.jsx",
      error: String(e && e.message || e)
    });
  }

  // ui_kits/website/Process.jsx
  try {
    (() => {
      /* Poortland website — Process */
      const {
        Button: RButton,
        Eyebrow: REyebrow
      } = window.PoortlandDesignSystem_6dcc8b;
      function Process({
        onNav
      }) {
        const {
          GateImage
        } = window;
        const steps = [['01', 'Consultation', 'We visit the house, read the architecture and the approach, and listen to how you want the entrance to feel.'], ['02', 'Drawing', 'A bespoke gate is drawn to the opening and the elevation. Material, rhythm and motion are resolved on paper first.'], ['03', 'Forging', 'In our Ghent atelier the gate is cut, welded and finished entirely by hand — a single object, never a kit.'], ['04', 'Fitting', 'We fit on site over one to two days, set the concealed automation, and hand over a gate built to outlast the house.']];
        return /*#__PURE__*/React.createElement("div", {
          style: {
            background: 'var(--surface-paper)'
          }
        }, /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--surface-ground)',
            color: 'var(--text-on-dark)',
            padding: '72px 40px 78px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1180,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 0.8fr',
            gap: 56,
            alignItems: 'center'
          }
        }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(REyebrow, {
          dark: true,
          style: {
            marginBottom: 20
          }
        }, "How we work"), /*#__PURE__*/React.createElement("h1", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 60,
            color: 'var(--stone-100)',
            margin: 0,
            lineHeight: 1.02,
            letterSpacing: '-0.01em'
          }
        }, "From drawing", /*#__PURE__*/React.createElement("br", null), "to ", /*#__PURE__*/React.createElement("span", {
          style: {
            fontStyle: 'italic',
            color: 'var(--accent)'
          }
        }, "hand"), "."), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 18,
            lineHeight: 1.65,
            color: 'var(--stone-300)',
            maxWidth: '44ch',
            marginTop: 24
          }
        }, "Every Poortland gate is a commission. There is no catalogue \u2014 only your house, our hands, and the four materials we trust.")), /*#__PURE__*/React.createElement(GateImage, {
          tone: "corten",
          ratio: "4 / 5",
          slats: 6,
          label: "Atelier \xB7 Ghent",
          radius: 8
        }))), /*#__PURE__*/React.createElement("section", {
          style: {
            padding: '80px 40px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1000,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 0
          }
        }, steps.map(([n, t, d], i) => /*#__PURE__*/React.createElement("div", {
          key: n,
          style: {
            display: 'grid',
            gridTemplateColumns: '120px 1fr',
            gap: 40,
            alignItems: 'start',
            padding: '34px 0',
            borderTop: '1px solid var(--line-on-light)',
            borderBottom: i === steps.length - 1 ? '1px solid var(--line-on-light)' : 0
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-display)',
            fontSize: 56,
            color: 'var(--accent)',
            lineHeight: 0.9
          }
        }, n), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 30,
            color: 'var(--text-heading)',
            margin: 0
          }
        }, t), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 16,
            lineHeight: 1.7,
            color: 'var(--text-body)',
            margin: '12px 0 0',
            maxWidth: '60ch'
          }
        }, d)))))), /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--forest-900)',
            padding: '80px 40px',
            textAlign: 'center'
          }
        }, /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: 34,
            color: 'var(--stone-100)',
            maxWidth: '24ch',
            margin: '0 auto 30px',
            lineHeight: 1.25
          }
        }, "\u201CA gate is the first thing the house says. We make it say it well.\u201D"), /*#__PURE__*/React.createElement(REyebrow, {
          dark: true,
          tone: "muted",
          style: {
            marginBottom: 34
          }
        }, "Lucas Vermeulen \xB7 Master fabricator"), /*#__PURE__*/React.createElement(RButton, {
          variant: "primary",
          size: "lg",
          arrow: true,
          onClick: () => onNav('contact')
        }, "Begin a commission")));
      }
      window.Process = Process;
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "ui_kits/website/Process.jsx",
      error: String(e && e.message || e)
    });
  }

  // ui_kits/website/ProjectDetail.jsx
  try {
    (() => {
      /* Poortland website — Project detail */
      const {
        Button: DButton,
        Tag: DTag,
        Eyebrow: DEyebrow
      } = window.PoortlandDesignSystem_6dcc8b;
      function ProjectDetail({
        project,
        onNav
      }) {
        const {
          GateImage,
          PROJECTS
        } = window;
        const p = project || PROJECTS[0];
        const more = PROJECTS.filter(x => x.id !== p.id).slice(0, 3);
        const specs = [['Material', p.material], ['Type', p.type], ['Clear span', p.span], ['Finish', 'Hand-applied, matte'], ['Automation', 'Underground BFT'], ['Completed', p.year]];
        return /*#__PURE__*/React.createElement("div", {
          style: {
            background: 'var(--surface-paper)'
          }
        }, /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--surface-ground)',
            padding: '40px 40px 0'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1180,
            margin: '0 auto'
          }
        }, /*#__PURE__*/React.createElement("button", {
          onClick: () => onNav('collection'),
          style: {
            background: 'none',
            border: 0,
            cursor: 'pointer',
            padding: 0,
            marginBottom: 24,
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            color: 'var(--text-on-dark-muted)'
          }
        }, "\u2190 Back to collection"), /*#__PURE__*/React.createElement(GateImage, {
          tone: p.tone,
          ratio: "21 / 9",
          slats: 13,
          label: `${p.name} · ${p.place}`,
          radius: 8
        }))), /*#__PURE__*/React.createElement("section", {
          style: {
            padding: '52px 40px 80px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1180,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: 64
          }
        }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DEyebrow, {
          style: {
            marginBottom: 16
          }
        }, p.place, " \xB7 ", p.year), /*#__PURE__*/React.createElement("h1", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 52,
            color: 'var(--text-heading)',
            margin: 0,
            letterSpacing: '-0.01em',
            lineHeight: 1.03
          }
        }, p.name), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 8,
            marginTop: 20
          }
        }, /*#__PURE__*/React.createElement(DTag, {
          variant: "solid"
        }, p.material), /*#__PURE__*/React.createElement(DTag, null, p.type)), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 17,
            lineHeight: 1.7,
            color: 'var(--text-body)',
            marginTop: 28,
            maxWidth: '54ch'
          }
        }, "A ", p.span, " ", p.type.toLowerCase(), " drawn for the approach to a ", p.place, " estate. The ", p.material.toLowerCase(), ' ', "was selected to settle into the landscape \u2014 a surface that deepens with weather rather than fighting it."), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 17,
            lineHeight: 1.7,
            color: 'var(--text-body)',
            marginTop: 18,
            maxWidth: '54ch'
          }
        }, "Cut, welded and finished in our Ghent atelier, then fitted on site over two days with concealed automation.")), /*#__PURE__*/React.createElement("aside", null, /*#__PURE__*/React.createElement("div", {
          style: {
            border: '1px solid var(--line-on-light)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden'
          }
        }, specs.map(([k, v], i) => /*#__PURE__*/React.createElement("div", {
          key: k,
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 18px',
            borderBottom: i < specs.length - 1 ? '1px solid var(--line-on-light-soft)' : 0
          }
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            fontFamily: 'var(--font-label)',
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--text-faint)'
          }
        }, k), /*#__PURE__*/React.createElement("span", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            color: 'var(--text-heading)',
            fontWeight: 500
          }
        }, v)))), /*#__PURE__*/React.createElement("div", {
          style: {
            marginTop: 18
          }
        }, /*#__PURE__*/React.createElement(DButton, {
          variant: "primary",
          arrow: true,
          onClick: () => onNav('contact')
        }, "Commission similar")))), /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1180,
            margin: '52px auto 0',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20
          }
        }, /*#__PURE__*/React.createElement(GateImage, {
          tone: p.tone,
          ratio: "4 / 3",
          slats: 9,
          label: "Detail \xB7 weld",
          radius: 6
        }), /*#__PURE__*/React.createElement(GateImage, {
          tone: "stone",
          ratio: "4 / 3",
          slats: 6,
          label: "Detail \xB7 post",
          radius: 6
        }))), /*#__PURE__*/React.createElement("section", {
          style: {
            background: 'var(--forest-900)',
            padding: '70px 40px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            maxWidth: 1180,
            margin: '0 auto'
          }
        }, /*#__PURE__*/React.createElement(DEyebrow, {
          dark: true,
          style: {
            marginBottom: 26
          }
        }, "More from the atelier"), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24
          }
        }, more.map(m => /*#__PURE__*/React.createElement("button", {
          key: m.id,
          onClick: () => onNav('project', m),
          style: {
            textAlign: 'left',
            background: 'none',
            border: 0,
            padding: 0,
            cursor: 'pointer'
          }
        }, /*#__PURE__*/React.createElement(GateImage, {
          tone: m.tone,
          ratio: "4 / 3",
          label: m.material,
          radius: 6
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-display)',
            fontSize: 21,
            color: 'var(--stone-100)',
            marginTop: 12
          }
        }, m.name), /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 12.5,
            color: 'var(--text-on-dark-muted)',
            marginTop: 4
          }
        }, m.place, " \xB7 ", m.material)))))));
      }
      window.ProjectDetail = ProjectDetail;
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "ui_kits/website/ProjectDetail.jsx",
      error: String(e && e.message || e)
    });
  }

  // ui_kits/website/shared.jsx
  try {
    (() => {
      /* Poortland website — shared scaffolding (nav, footer, media placeholder).
         Exposes helpers to window for the other screen files. */

      const {
        Button,
        Tag,
        Eyebrow
      } = window.PoortlandDesignSystem_6dcc8b;

      /* Stylised gate "photograph" placeholder — layered gradients + slat rhythm.
         Stands in for real estate photography; clearly an illustration, not a photo. */
      function GateImage({
        tone = 'dusk',
        ratio = '4 / 3',
        label,
        radius = 6,
        slats = 9
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
        return /*#__PURE__*/React.createElement("div", {
          style: {
            position: 'relative',
            aspectRatio: ratio,
            borderRadius: radius,
            overflow: 'hidden',
            background: grounds[tone] || grounds.dusk
          }
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
      }

      /* Poortland monogram — direction 02. Square stamped frame with an
         inset rule and a serif "P". Real Cormorant; scales to any size. */
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
      function Nav({
        route,
        onNav,
        dark = true
      }) {
        const items = [['home', 'Home'], ['collection', 'Collection'], ['process', 'Process'], ['contact', 'Contact']];
        const fg = dark ? 'var(--stone-200)' : 'var(--text-heading)';
        const faint = dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)';
        return /*#__PURE__*/React.createElement("header", {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '22px 40px',
            borderBottom: `1px solid ${dark ? 'var(--line-on-dark-soft)' : 'var(--line-on-light-soft)'}`,
            position: 'sticky',
            top: 0,
            zIndex: 20,
            background: dark ? 'rgba(15,22,15,0.86)' : 'rgba(250,246,238,0.9)',
            backdropFilter: 'blur(10px)'
          }
        }, /*#__PURE__*/React.createElement("button", {
          onClick: () => onNav('home'),
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
          size: 32,
          dark: dark
        }), /*#__PURE__*/React.createElement("span", {
          style: {
            fontFamily: 'var(--font-label)',
            fontSize: 14,
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
            gap: 30
          }
        }, items.map(([key, label]) => /*#__PURE__*/React.createElement("button", {
          key: key,
          onClick: () => onNav(key),
          style: {
            background: 'none',
            border: 0,
            cursor: 'pointer',
            padding: '4px 0',
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            fontWeight: route === key ? 600 : 400,
            color: route === key ? fg : faint,
            borderBottom: route === key ? '1px solid var(--accent)' : '1px solid transparent'
          }
        }, label)), /*#__PURE__*/React.createElement(Button, {
          variant: "primary",
          size: "sm",
          arrow: true,
          as: "button",
          onClick: () => onNav('contact')
        }, "Enquire")));
      }
      function Footer({
        onNav
      }) {
        return /*#__PURE__*/React.createElement("footer", {
          style: {
            background: 'var(--forest-950)',
            color: 'var(--text-on-dark-muted)',
            padding: '56px 40px 34px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 32,
            borderBottom: '1px solid var(--line-on-dark-soft)',
            paddingBottom: 32
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
            marginBottom: 16
          }
        }, /*#__PURE__*/React.createElement(Monogram, {
          size: 36,
          dark: true
        }), /*#__PURE__*/React.createElement("span", {
          style: {
            fontFamily: 'var(--font-label)',
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: 'var(--stone-100)',
            paddingLeft: '0.34em'
          }
        }, "Poortland")), /*#__PURE__*/React.createElement("p", {
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            lineHeight: 1.7,
            margin: 0
          }
        }, "Custom gates, drawn and forged by hand in Belgium for estates, architects and developers since 1992.")), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 64
          }
        }, /*#__PURE__*/React.createElement(FooterCol, {
          title: "Explore",
          links: [['Collection', 'collection'], ['Process', 'process'], ['Contact', 'contact']],
          onNav: onNav
        }), /*#__PURE__*/React.createElement(FooterCol, {
          title: "Atelier",
          links: [['Ghent, Belgium'], ['+32 9 224 18 70'], ['hello@poortland.be']]
        }))), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: 20,
            fontFamily: 'var(--font-sans)',
            fontSize: 11,
            color: 'var(--text-on-dark-faint)'
          }
        }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Poortland \u2014 Hand made in Belgium"), /*#__PURE__*/React.createElement("span", {
          style: {
            letterSpacing: '0.14em',
            textTransform: 'uppercase'
          }
        }, "BTW BE 0xxx.xxx.xxx")));
      }
      function FooterCol({
        title,
        links,
        onNav
      }) {
        return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
          dark: true,
          tone: "muted",
          style: {
            marginBottom: 14
          }
        }, title), /*#__PURE__*/React.createElement("ul", {
          style: {
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 9
          }
        }, links.map(([label, key], i) => /*#__PURE__*/React.createElement("li", {
          key: i
        }, /*#__PURE__*/React.createElement("button", {
          onClick: () => key && onNav && onNav(key),
          style: {
            background: 'none',
            border: 0,
            padding: 0,
            cursor: key ? 'pointer' : 'default',
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            color: 'var(--stone-300)',
            textAlign: 'left'
          }
        }, label)))));
      }
      const PROJECTS = [{
        id: 'duinhof',
        name: 'Villa Duinhof',
        place: 'Knokke',
        material: 'Corten',
        type: 'Sliding driveway gate',
        tone: 'corten',
        span: '4.2m',
        year: '2025'
      }, {
        id: 'lievens',
        name: 'Maison Lievens',
        place: 'Ghent',
        material: 'Aluminium',
        type: 'Pivot pedestrian gate',
        tone: 'morning',
        span: '1.1m',
        year: '2025'
      }, {
        id: 'hofstede',
        name: 'Hofstede Brael',
        place: 'Sint-Martens',
        material: 'Oak & steel',
        type: 'Cantilever gate',
        tone: 'dusk',
        span: '5.0m',
        year: '2024'
      }, {
        id: 'noord',
        name: 'Huis Noordkaai',
        place: 'Antwerp',
        material: 'Aluminium',
        type: 'Swing double gate',
        tone: 'stone',
        span: '3.6m',
        year: '2024'
      }, {
        id: 'klooster',
        name: 'Klooster Velden',
        place: 'Leuven',
        material: 'Forged steel',
        type: 'Estate entrance',
        tone: 'dusk',
        span: '6.4m',
        year: '2023'
      }, {
        id: 'duin',
        name: 'Strandvilla 9',
        place: 'Oostduinkerke',
        material: 'Corten',
        type: 'Louvered privacy gate',
        tone: 'corten',
        span: '2.8m',
        year: '2023'
      }];
      Object.assign(window, {
        GateImage,
        Monogram,
        Nav,
        Footer,
        FooterCol,
        PROJECTS
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "ui_kits/website/shared.jsx",
      error: String(e && e.message || e)
    });
  }
  __ds_ns.Button = __ds_scope.Button;
  __ds_ns.Card = __ds_scope.Card;
  __ds_ns.Eyebrow = __ds_scope.Eyebrow;
  __ds_ns.Tag = __ds_scope.Tag;
  __ds_ns.Input = __ds_scope.Input;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/Poortland-website-NL/ds-bundle.js", error: String((e && e.message) || e) }); }

// export/Poortland-website-NL/shared-nl.jsx
try { (() => {
/* Poortland — Nederlandse website. Gedeelde bouwstenen.
   Nav met productmenu en taalwisselaar, footer, beeldplaceholder, reveal animatie. */

const {
  Button: SButton,
  Tag: STag,
  Eyebrow: SEyebrow
} = window.PoortlandDesignSystem_6dcc8b;

/* ---- Reveal: zachte fade en lichte verschuiving bij het in beeld komen ---- */
function Reveal({
  children,
  delay = 0,
  y = 18,
  style
}) {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
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
  const talen = ['NL', 'FR', 'DE', 'EN'];
  const faint = dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)';
  const active = dark ? 'var(--stone-100)' : 'var(--text-heading)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 2
    },
    role: "group",
    "aria-label": "Taal"
  }, talen.map((t, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: t
  }, i > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: faint,
      opacity: 0.4,
      fontSize: 11
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onLang(t),
    "aria-pressed": lang === t,
    style: {
      background: 'none',
      border: 0,
      cursor: 'pointer',
      padding: '4px 5px',
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.12em',
      color: lang === t ? active : faint,
      borderBottom: lang === t ? '1px solid var(--accent)' : '1px solid transparent'
    }
  }, t))));
}

/* ---- Hoofdnavigatie met productmenu ---- */
const PRODUCT_MENU = [['houten', 'Houten poorten'], ['metalen', 'Metalen poorten'], ['aluminium', 'Aluminium poorten'], ['staalhout', 'Combinatie staal en hout'], ['schuif', 'Schuifpoorten'], ['draai', 'Draaipoorten'], ['hekwerk', 'Hekwerken op maat'], ['automatisatie', 'Automatisatie']];
function Nav({
  route,
  onNav,
  lang,
  onLang
}) {
  const [openMenu, setOpenMenu] = React.useState(false);
  const items = [['realisaties', 'Realisaties'], ['werkwijze', 'Werkwijze'], ['atelier', 'Over Poortland'], ['contact', 'Contact']];
  const fg = 'var(--stone-200)';
  const faint = 'var(--text-on-dark-muted)';
  return /*#__PURE__*/React.createElement("header", {
    onMouseLeave: () => setOpenMenu(false),
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 40,
      background: 'rgba(15,22,15,0.88)',
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
      setOpenMenu(false);
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
    onMouseEnter: () => setOpenMenu(true),
    onClick: () => setOpenMenu(v => !v),
    "aria-expanded": openMenu,
    style: {
      background: 'none',
      border: 0,
      cursor: 'pointer',
      padding: '4px 0',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      fontWeight: route === 'product' ? 600 : 400,
      color: route === 'product' || openMenu ? fg : faint,
      borderBottom: route === 'product' ? '1px solid var(--accent)' : '1px solid transparent'
    }
  }, "Poorten", /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      fontSize: 9,
      transition: 'transform var(--dur) var(--ease-out)',
      transform: openMenu ? 'rotate(180deg)' : 'none',
      display: 'inline-block'
    }
  }, "\u25BE")), items.map(([key, label]) => /*#__PURE__*/React.createElement("button", {
    key: key,
    onClick: () => {
      onNav(key);
      setOpenMenu(false);
    },
    style: {
      background: 'none',
      border: 0,
      cursor: 'pointer',
      padding: '4px 0',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      fontWeight: route === key ? 600 : 400,
      color: route === key ? fg : faint,
      borderBottom: route === key ? '1px solid var(--accent)' : '1px solid transparent'
    }
  }, label)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 18,
      background: 'var(--line-on-dark-soft)'
    }
  }), /*#__PURE__*/React.createElement(TaalWisselaar, {
    lang: lang,
    onLang: onLang,
    dark: true
  }), /*#__PURE__*/React.createElement(SButton, {
    variant: "primary",
    size: "sm",
    arrow: true,
    as: "button",
    onClick: () => {
      onNav('contact');
      setOpenMenu(false);
    }
  }, "Plan een adviesgesprek"))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'hidden',
      maxHeight: openMenu ? 320 : 0,
      transition: 'max-height 360ms var(--ease-out)',
      borderTop: openMenu ? '1px solid var(--line-on-dark-soft)' : '1px solid transparent',
      background: 'rgba(15,22,15,0.97)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      padding: '26px 44px 30px'
    }
  }, /*#__PURE__*/React.createElement(SEyebrow, {
    dark: true,
    tone: "muted",
    style: {
      marginBottom: 16
    }
  }, "Poorten, hekwerken en automatisatie"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '4px 20px'
    }
  }, PRODUCT_MENU.map(([key, label]) => /*#__PURE__*/React.createElement("button", {
    key: key,
    onClick: () => {
      onNav('product', {
        productKey: key
      });
      setOpenMenu(false);
    },
    style: {
      textAlign: 'left',
      background: 'none',
      border: 0,
      cursor: 'pointer',
      padding: '11px 12px',
      borderRadius: 'var(--radius-sm)',
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      color: 'var(--stone-200)',
      transition: 'background var(--dur) var(--ease-out), color var(--dur) var(--ease-out)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--forest-800)';
      e.currentTarget.style.color = 'var(--stone-100)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.color = 'var(--stone-200)';
    }
  }, label))))));
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
  }, "Deze taalversie is in voorbereiding \xB7 u bekijkt de Nederlandse versie");
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
  }, "\u2014"), /*#__PURE__*/React.createElement("span", {
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
      background: dark ? 'var(--forest-950)' : 'var(--surface-paper)',
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
    onClick: () => onNav('atelier')
  }, "Bezoek onze showroom"))));
}

/* ---- Footer ---- */
function Footer({
  onNav,
  lang,
  onLang
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--forest-950)',
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
      marginBottom: 18
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
  }, "Handgemaakte toegangspoorten, hekwerken en automatisatie op maat. Ontworpen, gemaakt en geplaatst in Belgi\xEB."), /*#__PURE__*/React.createElement(TaalWisselaar, {
    lang: lang,
    onLang: onLang,
    dark: true
  })), /*#__PURE__*/React.createElement(FooterKol, {
    title: "Poorten",
    links: [['Houten poorten', () => onNav('product', {
      productKey: 'houten'
    })], ['Aluminium poorten', () => onNav('product', {
      productKey: 'aluminium'
    })], ['Schuifpoorten', () => onNav('product', {
      productKey: 'schuif'
    })], ['Hekwerken', () => onNav('product', {
      productKey: 'hekwerk'
    })], ['Automatisatie', () => onNav('product', {
      productKey: 'automatisatie'
    })]]
  }), /*#__PURE__*/React.createElement(FooterKol, {
    title: "Ontdek",
    links: [['Realisaties', () => onNav('realisaties')], ['Werkwijze', () => onNav('werkwijze')], ['Over Poortland', () => onNav('atelier')], ['Contact', () => onNav('contact')]]
  }), /*#__PURE__*/React.createElement(FooterKol, {
    title: "Atelier en showroom",
    links: [['Dok Noord 4, 9000 Gent'], ['+32 9 224 18 70'], ['hallo@poortland.be'], ['Open op afspraak']]
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
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Poortland \u2014 Handgemaakt in Belgi\xEB sinds 1992"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 22,
      letterSpacing: '0.06em'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('atelier'),
    style: {
      background: 'none',
      border: 0,
      color: 'inherit',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: 'inherit'
    }
  }, "Privacybeleid"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('atelier'),
    style: {
      background: 'none',
      border: 0,
      color: 'inherit',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: 'inherit'
    }
  }, "Cookiebeleid"), /*#__PURE__*/React.createElement("span", null, "BTW BE 0xxx.xxx.xxx")))));
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
Object.assign(window, {
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
  SectieKop
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/Poortland-website-NL/shared-nl.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website-nl-licht/About-nl.jsx
try { (() => {
/* Poortland — Nederlandse website. Over Poortland en atelier. */
const {
  Button: AbButton,
  Eyebrow: AbEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function AboutNL({
  onNav
}) {
  const {
    GateImage,
    Reveal,
    ClaimBalk,
    CTASectie,
    SectieKop
  } = window;
  const vakmanschap = [['Handwerk', 'Elke poort wordt met de hand getekend, gelast en afgewerkt. Geen samengesteld pakket, maar één object.'], ['Belgische productie', 'Alles gebeurt in ons eigen atelier in Gent. Geen import, geen tussenschakels.'], ['Materiaalkennis', 'Wij kennen het gedrag van eik, aluminium, staal en cortenstaal, en kiezen wat past bij uw woning.'], ['Detailzorg', 'Verhouding, ritme en afwerking worden tot in het detail uitgewerkt en gecontroleerd.'], ['Eigen plaatsers', 'Onze eigen techniekers plaatsen en stellen af. Zij kennen de poort die zij monteren.'], ['Automatisatie', 'Wij integreren betrouwbare, verdoken aandrijving en blijven beschikbaar voor de opvolging.']];
  const cijfers = [['1992', 'Opgericht'], ['100%', 'Handgemaakt'], ['320+', 'Woningen'], ['4', 'Materialen']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '72px 44px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 860
    }
  }, /*#__PURE__*/React.createElement(AbEyebrow, {
    dark: true,
    style: {
      marginBottom: 22
    }
  }, "Over Poortland"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 60,
      color: 'var(--stone-100)',
      margin: 0,
      lineHeight: 1.05,
      letterSpacing: '-0.01em'
    }
  }, "Een poort is de eerste indruk van het huis."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 19,
      lineHeight: 1.6,
      color: 'var(--stone-300)',
      maxWidth: '52ch',
      marginTop: 24
    }
  }, "Sinds 1992 ontwerpt, maakt en plaatst Poortland handgemaakte toegangspoorten en hekwerken op maat. Voor woningen waar uitstraling, veiligheid en afwerking samenkomen, en voor mensen die kwaliteit boven snelheid verkiezen."))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 56,
      paddingBottom: 0
    }
  }, /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: "dusk",
    ratio: "21 / 9",
    slats: 15,
    label: "Atelier en showroom \xB7 Gent",
    radius: 8
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 0,
      paddingTop: 56,
      paddingBottom: 0
    }
  }, /*#__PURE__*/React.createElement(ClaimBalk, {
    dark: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4
    }
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '90px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 72,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    eyebrow: "Wie wij zijn",
    titel: "Belgisch vakmanschap, generatie na generatie.",
    max: "18ch"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16.5,
      lineHeight: 1.75,
      color: 'var(--text-body)',
      margin: '24px 0 0',
      maxWidth: '56ch'
    }
  }, "Poortland groeide van een klein smederijatelier tot een gespecialiseerde maker van architecturale poorten. Wat onveranderd bleef, is de overtuiging dat een toegang met de hand hoort te worden gemaakt, afgestemd op de woning en gebouwd om te blijven."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16.5,
      lineHeight: 1.75,
      color: 'var(--text-body)',
      margin: '18px 0 0',
      maxWidth: '56ch'
    }
  }, "Wij werken voor villa eigenaars, renovatieklanten en eigenaars van landelijke en moderne woningen, en zijn een betrouwbare uitvoerende partner voor architecten, tuinarchitecten en aannemers.")), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: "corten",
    ratio: "4 / 5",
    slats: 7,
    label: "Smeedwerk \xB7 detail",
    radius: 8,
    zoom: true
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '90px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    dark: true,
    align: "center",
    eyebrow: "Atelier en vakmanschap",
    titel: "Hoe een Poortland poort ontstaat.",
    intro: "Geen import, maar maatwerk onder \xE9\xE9n dak. Van de eerste tekening tot de laatste afwerking blijft elke stap in eigen handen."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 1,
      marginTop: 48,
      background: 'var(--line-on-dark-soft)',
      border: '1px solid var(--line-on-dark-soft)'
    }
  }, vakmanschap.map(([t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: t,
    delay: i % 3 * 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--forest-900)',
      padding: '30px 30px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 25,
      color: 'var(--stone-100)',
      marginBottom: 8
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14.5,
      lineHeight: 1.65,
      color: 'var(--text-on-dark-muted)',
      margin: 0
    }
  }, d))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 24,
      marginTop: 56
    }
  }, cijfers.map(([n, l], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: l,
    delay: i * 70
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 50,
      color: 'var(--stone-100)',
      lineHeight: 1
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 10.5,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--text-on-dark-muted)',
      marginTop: 10
    }
  }, l))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '90px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '0.9fr 1.1fr',
      gap: 64,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(GateImage, {
    tone: "morning",
    ratio: "4 / 3",
    slats: 9,
    label: "Plaatsing \xB7 ter plaatse",
    radius: 8,
    zoom: true
  })), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement(SectieKop, {
    eyebrow: "Service na verkoop",
    titel: "Zekerheid op lange termijn.",
    max: "18ch"
  }), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: '24px 0 0',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, ['Poortland blijft bereikbaar na de plaatsing.', 'Service is voor ons een onderdeel van kwaliteit.', 'Onderhoud en herstellingen worden professioneel opgevolgd.', 'Automatisatie houden wij betrouwbaar in gebruik.'].map(t => /*#__PURE__*/React.createElement("li", {
    key: t,
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)',
      fontFamily: 'var(--font-display)',
      fontSize: 16,
      flex: '0 0 auto'
    }
  }, "\u2014"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      lineHeight: 1.55,
      color: 'var(--text-body)'
    }
  }, t))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '84px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(AbEyebrow, {
    dark: true,
    style: {
      marginBottom: 18
    }
  }, "Showroom"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 44,
      color: 'var(--stone-100)',
      margin: '0 auto 18px',
      maxWidth: '20ch',
      lineHeight: 1.08
    }
  }, "Ervaar de materialen van dichtbij."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      maxWidth: '50ch',
      margin: '0 auto 32px'
    }
  }, "In onze showroom in Gent ziet en voelt u de materialen, afwerkingen en bewegingen. Een bezoek gebeurt op afspraak, zodat wij rustig de tijd voor u nemen."), /*#__PURE__*/React.createElement(AbButton, {
    variant: "primary",
    size: "lg",
    arrow: true,
    onClick: () => onNav('contact')
  }, "Bezoek onze showroom")))), /*#__PURE__*/React.createElement(CTASectie, {
    onNav: onNav,
    dark: false
  }));
}
window.AboutNL = AboutNL;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website-nl-licht/About-nl.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website-nl-licht/Collection-nl.jsx
try { (() => {
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
  const materialen = ['Alle', 'Hout', 'Aluminium', 'Cortenstaal', 'Staal en hout', 'Smeedijzer'];
  const types = ['Alle', 'Schuifpoort', 'Draaipoort', 'Hekwerk'];
  const [mat, setMat] = React.useState('Alle');
  const [type, setType] = React.useState('Alle');
  const shown = PROJECTEN.filter(p => (mat === 'Alle' || p.materiaal === mat) && (type === 'Alle' || p.poorttype === type));
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
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website-nl-licht/Collection-nl.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website-nl-licht/Contact-nl.jsx
try { (() => {
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
  }, "\u25BE")));
}
function ContactNL({
  onNav
}) {
  const {
    Reveal
  } = window;
  const [sent, setSent] = React.useState(false);
  const [type, setType] = React.useState('');
  const [akkoord, setAkkoord] = React.useState(false);
  const [bestand, setBestand] = React.useState('');
  const typeOpties = [{
    value: '',
    label: 'Kies een type aanvraag'
  }, {
    value: 'nieuwe-poort',
    label: 'Nieuwe poort'
  }, {
    value: 'hekwerk',
    label: 'Hekwerk'
  }, {
    value: 'automatisatie',
    label: 'Automatisatie'
  }, {
    value: 'onderhoud',
    label: 'Onderhoud of service'
  }, {
    value: 'showroom',
    label: 'Showroombezoek'
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
  }, "Vertel kort iets over uw woning, de opening en het gevoel dat u zoekt. Wij nemen persoonlijk contact op en plannen een adviesgesprek met plaatsbezoek en opmeting."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 42,
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, [['Atelier en showroom', 'Dok Noord 4, 9000 Gent'], ['Telefoon', '+32 9 224 18 70'], ['Email', 'hallo@poortland.be'], ['Openingsuren', 'Open op afspraak, maandag tot zaterdag']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
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
      color: 'var(--stone-200)'
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
    src: "../../assets/mono-on-light.png",
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
  }, "Uw aanvraag is bij het atelier."), /*#__PURE__*/React.createElement("p", {
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
      setType('');
      setAkkoord(false);
      setBestand('');
    }
  }, "Nieuwe aanvraag"))) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      if (!akkoord) return;
      setSent(true);
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Type aanvraag",
    value: type,
    onChange: e => setType(e.target.value),
    opties: typeOpties
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(CoInput, {
    label: "Naam",
    dark: true,
    placeholder: "Uw naam",
    required: true
  }), /*#__PURE__*/React.createElement(CoInput, {
    label: "Email",
    dark: true,
    type: "email",
    placeholder: "u@voorbeeld.be",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(CoInput, {
    label: "Telefoon",
    dark: true,
    type: "tel",
    placeholder: "+32 ..."
  }), /*#__PURE__*/React.createElement(CoInput, {
    label: "Gemeente",
    dark: true,
    placeholder: "bv. Knokke Heist"
  })), /*#__PURE__*/React.createElement(CoInput, {
    label: "Omschrijving van uw project",
    dark: true,
    as: "textarea",
    placeholder: "De opening is ongeveer 4 meter, een schuifpoort voor de oprit ..."
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Gewenste timing",
    value: '',
    onChange: () => {},
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
  }, "Kies bestand \u2197"), /*#__PURE__*/React.createElement("input", {
    type: "file",
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
    onClick: () => setAkkoord(!akkoord),
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
  }, "Ik ga akkoord met de verwerking van mijn gegevens om mijn aanvraag te behandelen, volgens het privacybeleid.")), /*#__PURE__*/React.createElement("div", {
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
  }, "Vrijblijvend \xB7 antwoord binnen twee werkdagen"), /*#__PURE__*/React.createElement(CoButton, {
    variant: "primary",
    arrow: true,
    as: "button",
    type: "submit",
    disabled: !akkoord
  }, "Verstuur aanvraag"))))))));
}
window.ContactNL = ContactNL;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website-nl-licht/Contact-nl.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website-nl-licht/Home-nl.jsx
try { (() => {
/* Poortland — Nederlandse website. Homepage. */
const {
  Button: HButton,
  Tag: HTag,
  Eyebrow: HEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function HomeNL({
  onNav
}) {
  const {
    GateImage,
    Reveal,
    ClaimBalk,
    FAQ,
    CTASectie,
    SectieKop
  } = window;
  const {
    PROJECTEN,
    PRODUCTEN,
    WERKWIJZE,
    HOME_FAQ,
    ADVIES
  } = window;
  const uitgelicht = PROJECTEN.filter(p => p.uitgelicht).slice(0, 3);
  const routes = [['houten', 'Houten poorten', 'Warm en tijdloos', 'media/houten-poort.png'], ['metalen', 'Stalen poorten', 'Sterk en strak', 'media/stalen-poort.png'], ['aluminium', 'Aluminium poorten', 'Strak en onderhoudsarm', 'media/aluminium-poort.png'], ['staalhout', 'Combinatie staal en hout', 'Kracht en warmte', 'media/staal-hout.png']];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '72px 44px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.05fr 0.95fr',
      gap: 60,
      alignItems: 'center',
      paddingBottom: 64
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(HEyebrow, {
    dark: true,
    style: {
      marginBottom: 22
    }
  }, "Toegangspoorten \xB7 Belgi\xEB"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 72,
      lineHeight: 1.02,
      letterSpacing: '-0.01em',
      color: 'var(--stone-100)',
      margin: 0
    }
  }, "Handgemaakte poorten en hekwerken op maat.")), /*#__PURE__*/React.createElement(Reveal, {
    delay: 120
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 19,
      lineHeight: 1.6,
      color: 'var(--stone-300)',
      maxWidth: '48ch',
      margin: '26px 0 34px'
    }
  }, "Poortland ontwerpt, maakt en plaatst architecturale poorten en hekwerken voor woningen waar uitstraling, veiligheid en afwerking samenkomen."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(HButton, {
    variant: "primary",
    arrow: true,
    onClick: () => onNav('contact')
  }, "Plan een adviesgesprek"), /*#__PURE__*/React.createElement(HButton, {
    variant: "ghost",
    dark: true,
    arrow: true,
    onClick: () => onNav('realisaties')
  }, "Ontdek onze realisaties")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 44,
      marginTop: 54
    }
  }, [['1992', 'Sinds'], ['100%', 'Handgemaakt'], ['320+', 'Woningen']].map(([n, l]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 34,
      color: 'var(--stone-100)',
      lineHeight: 1
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 10,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--text-on-dark-muted)',
      marginTop: 7
    }
  }, l)))))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 8,
      overflow: 'hidden',
      position: 'relative',
      aspectRatio: '3 / 2',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "media/hero.png",
    alt: "Handgemaakte poort van Poortland in hout en staal",
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
      background: 'linear-gradient(180deg, rgba(15,22,15,0) 55%, rgba(15,22,15,0.55) 100%)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 16,
      bottom: 14,
      fontFamily: 'var(--font-label)',
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'rgba(236,227,210,0.92)'
    }
  }, "Handgemaakt in Belgi\xEB")))), /*#__PURE__*/React.createElement(ClaimBalk, {
    dark: true
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '92px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(HEyebrow, {
    style: {
      marginBottom: 20
    }
  }, "Over Poortland"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: 34,
      lineHeight: 1.32,
      color: 'var(--text-heading)',
      margin: 0,
      letterSpacing: '-0.005em'
    }
  }, "Poortland maakt toegangspoorten en hekwerken op maat voor woningen waar afwerking, veiligheid en uitstraling ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: 'var(--accent)'
    }
  }, "even belangrijk"), " zijn. Geen importproduct, maar Belgisch handwerk dat past bij de woning, de omgeving en het dagelijks gebruik.")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '90px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 40,
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(SectieKop, {
    dark: true,
    eyebrow: "Wat wij maken",
    titel: "Poorten, hekwerken en automatisatie.",
    max: "16ch"
  }), /*#__PURE__*/React.createElement(HButton, {
    variant: "secondary",
    dark: true,
    onClick: () => onNav('product', {
      productKey: 'houten'
    })
  }, "Alle poorten"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 18
    }
  }, routes.map(([key, naam, sub, img], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: key,
    delay: i * 80
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('product', {
      productKey: key
    }),
    style: {
      width: '100%',
      textAlign: 'left',
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--line-on-dark-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pl-zoom-wrap",
    style: {
      position: 'relative',
      aspectRatio: '3 / 2',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    className: "pl-zoom-img",
    src: img,
    alt: naam,
    loading: "lazy",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      transition: 'transform 620ms var(--ease-out)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, rgba(15,22,15,0) 52%, rgba(15,22,15,0.55) 100%)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 14,
      bottom: 12,
      fontFamily: 'var(--font-label)',
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'rgba(236,227,210,0.86)'
    }
  }, naam)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 18px 22px',
      background: 'var(--forest-850)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      color: 'var(--stone-100)',
      lineHeight: 1.1
    }
  }, naam), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-on-dark-muted)',
      marginTop: 6
    }
  }, sub, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)'
    }
  }, "\u2197")))))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '92px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 40,
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(SectieKop, {
    eyebrow: "Uitgelichte realisaties",
    titel: "Elke poort heeft een unieke aanpak.",
    max: "16ch"
  }), /*#__PURE__*/React.createElement(HButton, {
    variant: "secondary",
    onClick: () => onNav('realisaties')
  }, "Alle realisaties"))), /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(window.FotoBanner, {
    onNav: onNav,
    fotos: [{
      src: 'media/realisatie-metaal-1.jpeg',
      label: 'Smeedijzer · landelijke woning'
    }, {
      src: 'media/realisatie-hout-2.jpeg',
      label: 'Hout · moderne woning'
    }, {
      src: 'media/realisatie-alu-1.jpeg',
      label: 'Aluminium · schuifpoort'
    }, {
      src: 'media/realisatie-metaal-2.jpeg',
      label: 'Smeedijzer · draaipoort'
    }, {
      src: 'media/realisatie-hout-1.jpeg',
      label: 'Hout · schuifpoort'
    }]
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      padding: '0 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      alignItems: 'stretch',
      minHeight: 540
    }
  }, /*#__PURE__*/React.createElement(Reveal, {
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '90px 56px 90px 0'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(HEyebrow, {
    dark: true,
    style: {
      marginBottom: 18
    }
  }, "Handwerk uit Belgi\xEB"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 46,
      color: 'var(--stone-100)',
      margin: 0,
      lineHeight: 1.06,
      letterSpacing: '-0.01em'
    }
  }, "Geen import,", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: 'var(--accent)'
    }
  }, "maar maatwerk"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      maxWidth: '46ch',
      margin: '22px 0 28px'
    }
  }, "Elke poort van Poortland wordt gemaakt met aandacht voor materiaal, verhouding en afwerking. Geen importoplossing, maar maatwerk dat past bij de woning, de omgeving en het dagelijks gebruik."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      marginBottom: 32
    }
  }, [['Eigen atelier', 'Snijden, lassen en afwerken onder één dak in Gent.'], ['Eigen plaatsers', 'Geen onderaanneming, wel onze eigen techniekers ter plaatse.'], ['Duurzame materialen', 'Eik, aluminium, staal en cortenstaal van hoge kwaliteit.']].map(([t, d]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)',
      fontFamily: 'var(--font-display)',
      fontSize: 16
    }
  }, "\u2014"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--stone-100)'
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      color: 'var(--text-on-dark-muted)',
      marginTop: 2
    }
  }, d))))), /*#__PURE__*/React.createElement(HButton, {
    variant: "ghost",
    dark: true,
    arrow: true,
    onClick: () => onNav('atelier')
  }, "Ontdek het atelier"))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 100,
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'stretch',
      width: '100%',
      padding: '40px 0 40px 0',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: "corten",
    ratio: "auto",
    label: "Atelier \xB7 Gent",
    radius: 8,
    slats: 7,
    zoom: true
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '90px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '0.85fr 1.15fr',
      gap: 60,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    dark: true,
    eyebrow: "Materialen en afwerking",
    titel: "Vier materialen, eindeloos verfijnd.",
    max: "14ch",
    intro: "Elke poort begint als een tekening en eindigt als \xE9\xE9n gelast object. Geen catalogus, geen twee dezelfde."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 14
    }
  }, [['Cortenstaal', 'Levende, verkleurende huid'], ['Aluminium', 'Geborsteld en gepoederlakt'], ['Eik en hout', 'Warme, massieve invulling'], ['Smeedstaal', 'Handgesmede profielen']].map(([m, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: m,
    delay: i * 70
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--line-on-dark-soft)',
      borderRadius: 'var(--radius-sm)',
      padding: '22px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      color: 'var(--stone-100)'
    }
  }, m), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-on-dark-muted)',
      marginTop: 6
    }
  }, d))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '92px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    align: "center",
    eyebrow: "Werkwijze",
    titel: "Van eerste advies tot perfecte plaatsing.",
    intro: "Een poort op maat vraagt meer dan een mooie tekening. Daarom start elk project met persoonlijk advies, een plaatsbezoek en een nauwkeurige opmeting."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 1,
      marginTop: 48,
      background: 'var(--line-on-light)',
      border: '1px solid var(--line-on-light)'
    }
  }, WERKWIJZE.map(([n, t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: n,
    delay: i % 3 * 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)',
      padding: '30px 28px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 38,
      color: 'var(--accent)',
      lineHeight: 0.9,
      marginBottom: 16
    }
  }, n), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 22,
      color: 'var(--text-heading)',
      margin: '0 0 8px'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      lineHeight: 1.6,
      color: 'var(--text-muted)',
      margin: 0
    }
  }, d))))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 40
    }
  }, /*#__PURE__*/React.createElement(HButton, {
    variant: "secondary",
    arrow: true,
    onClick: () => onNav('werkwijze')
  }, "Bekijk de volledige werkwijze")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '84px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(HEyebrow, {
    dark: true,
    style: {
      marginBottom: 18
    }
  }, "Service na verkoop"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontStyle: 'italic',
      fontSize: 32,
      color: 'var(--stone-100)',
      margin: '0 auto 14px',
      maxWidth: '26ch',
      lineHeight: 1.3
    }
  }, "\u201CEen poort is de eerste indruk van het huis. Wij zorgen dat die jarenlang klopt.\u201D"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      maxWidth: '52ch',
      margin: '0 auto'
    }
  }, "Poortland blijft bereikbaar na de plaatsing. Onderhoud en herstellingen worden professioneel opgevolgd, en automatisatie houden wij betrouwbaar in gebruik. Zekerheid op lange termijn hoort bij kwaliteit.")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '92px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 38,
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(SectieKop, {
    eyebrow: "Adviescentrum",
    titel: "Helder advies voor uw keuze.",
    max: "16ch"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, ADVIES.slice(0, 3).map(([titel, cat, sub], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: titel,
    delay: i * 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-md)',
      padding: '26px 26px 28px',
      height: '100%',
      background: 'var(--surface-card)',
      transition: 'box-shadow var(--dur) var(--ease-out), transform var(--dur) var(--ease-out)',
      cursor: 'pointer'
    },
    onMouseEnter: e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      e.currentTarget.style.transform = 'translateY(-3px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'none';
    },
    onClick: () => onNav('contact')
  }, /*#__PURE__*/React.createElement(HEyebrow, {
    style: {
      marginBottom: 14
    }
  }, cat), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 24,
      color: 'var(--text-heading)',
      margin: '0 0 10px',
      lineHeight: 1.18
    }
  }, titel), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      lineHeight: 1.6,
      color: 'var(--text-muted)',
      margin: 0
    }
  }, sub))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper-2)',
      padding: '92px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    align: "center",
    eyebrow: "Veelgestelde vragen",
    titel: "Wat klanten vaak vragen."
  })), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 44
    }
  }, /*#__PURE__*/React.createElement(FAQ, {
    items: HOME_FAQ
  }))))), /*#__PURE__*/React.createElement(CTASectie, {
    onNav: onNav,
    dark: true
  }));
}

/* Gedeelde realisatiekaart */
function ProjectKaart({
  project: p,
  onNav
}) {
  const {
    GateImage
  } = window;
  const {
    Eyebrow: KEyebrow
  } = window.PoortlandDesignSystem_6dcc8b;
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('project', {
      project: p
    }),
    style: {
      textAlign: 'left',
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--line-on-light-soft)',
      background: 'var(--surface-card)',
      transition: 'box-shadow var(--dur) var(--ease-out), transform var(--dur) var(--ease-out)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      e.currentTarget.style.transform = 'translateY(-3px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'none';
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: p.tone,
    ratio: "4 / 3",
    label: p.materiaal,
    radius: 0,
    zoom: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '17px 19px 21px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement(KEyebrow, null, p.regio), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      color: 'var(--text-faint)'
    }
  }, p.jaar)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      color: 'var(--text-heading)',
      lineHeight: 1.1,
      marginTop: 8
    }
  }, p.naam), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-muted)',
      marginTop: 6
    }
  }, p.poorttype, " \xB7 ", p.span))));
}
Object.assign(window, {
  HomeNL,
  ProjectKaart
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website-nl-licht/Home-nl.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website-nl-licht/Process-nl.jsx
try { (() => {
/* Poortland — Nederlandse website. Werkwijze. */
const {
  Button: WeButton,
  Eyebrow: WeEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function ProcessNL({
  onNav
}) {
  const {
    GateImage,
    Reveal,
    CTASectie,
    SectieKop
  } = window;
  const {
    WERKWIJZE
  } = window;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '72px 44px 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 0.82fr',
      gap: 60,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(WeEyebrow, {
    dark: true,
    style: {
      marginBottom: 20
    }
  }, "Werkwijze"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 62,
      color: 'var(--stone-100)',
      margin: 0,
      lineHeight: 1.02,
      letterSpacing: '-0.01em'
    }
  }, "Van eerste advies tot ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: 'var(--accent)'
    }
  }, "perfecte"), " plaatsing."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 18,
      lineHeight: 1.65,
      color: 'var(--stone-300)',
      maxWidth: '48ch',
      marginTop: 24
    }
  }, "Een poort op maat vraagt meer dan een mooie tekening. Daarom start elk project met persoonlijk advies, een plaatsbezoek en een nauwkeurige opmeting. Daarna volgt een voorstel dat rekening houdt met stijl, gebruik, veiligheid en afwerking.")), /*#__PURE__*/React.createElement(Reveal, {
    delay: 90
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: "corten",
    ratio: "4 / 5",
    slats: 6,
    label: "Atelier \xB7 Gent",
    radius: 8,
    zoom: true
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '88px 44px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto'
    }
  }, WERKWIJZE.map(([n, t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: n,
    delay: i % 2 * 70
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '120px 1fr',
      gap: 40,
      alignItems: 'start',
      padding: '36px 0',
      borderTop: '1px solid var(--line-on-light)',
      borderBottom: i === WERKWIJZE.length - 1 ? '1px solid var(--line-on-light)' : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 56,
      color: 'var(--accent)',
      lineHeight: 0.9
    }
  }, n), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 30,
      color: 'var(--text-heading)',
      margin: 0
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      lineHeight: 1.7,
      color: 'var(--text-body)',
      margin: '12px 0 0',
      maxWidth: '62ch'
    }
  }, d))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '40px 44px 90px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--forest-900)',
      borderRadius: 'var(--radius-lg)',
      padding: '48px 52px',
      color: 'var(--text-on-dark)',
      display: 'grid',
      gridTemplateColumns: '0.7fr 1.3fr',
      gap: 48,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 64,
      color: 'var(--stone-100)',
      lineHeight: 1
    }
  }, "6 \u2014 8"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--accent)',
      marginTop: 10
    }
  }, "weken gemiddeld")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(WeEyebrow, {
    dark: true,
    style: {
      marginBottom: 12
    }
  }, "Wat u mag verwachten"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16.5,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      margin: 0,
      maxWidth: '52ch'
    }
  }, "Er is altijd een plaatsbezoek en een adviesgesprek met opmeting. Het traject van eerste contact tot plaatsing duurt gemiddeld zes tot acht weken. Wij bevestigen een realistische planning bij het voorstel, en houden u onderweg op de hoogte.")))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '84px 44px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontStyle: 'italic',
      fontSize: 34,
      color: 'var(--stone-100)',
      maxWidth: '26ch',
      margin: '0 auto 28px',
      lineHeight: 1.25
    }
  }, "\u201CEen poort op maat begint bij luisteren. Pas daarna pakken wij het potlood.\u201D"), /*#__PURE__*/React.createElement(WeEyebrow, {
    dark: true,
    tone: "muted",
    style: {
      marginBottom: 34
    }
  }, "Het team van Poortland \xB7 Gent"), /*#__PURE__*/React.createElement(WeButton, {
    variant: "primary",
    size: "lg",
    arrow: true,
    onClick: () => onNav('contact')
  }, "Plan een adviesgesprek"))), /*#__PURE__*/React.createElement(CTASectie, {
    onNav: onNav,
    dark: false
  }));
}
window.ProcessNL = ProcessNL;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website-nl-licht/Process-nl.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website-nl-licht/Product-nl.jsx
try { (() => {
/* Poortland — Nederlandse website. Productpagina (poorttype). */
const {
  Button: PrButton,
  Tag: PrTag,
  Eyebrow: PrEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function ProductNL({
  onNav,
  productKey
}) {
  const {
    GateImage,
    Reveal,
    FAQ,
    CTASectie,
    SectieKop,
    ProjectKaart
  } = window;
  const {
    PRODUCTEN,
    PRODUCT_VOLGORDE,
    PROJECTEN,
    WERKWIJZE
  } = window;
  const key = PRODUCTEN[productKey] ? productKey : 'houten';
  const p = PRODUCTEN[key];
  const relevant = (p.materiaalFilter ? PROJECTEN.filter(x => x.materiaal === p.materiaalFilter) : PROJECTEN).slice(0, 3);
  const shownProjects = relevant.length >= 3 ? relevant : PROJECTEN.slice(0, 3);
  const procesKort = WERKWIJZE.slice(0, 4);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '48px 44px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      marginBottom: 40
    }
  }, PRODUCT_VOLGORDE.map(k => {
    const active = k === key;
    return /*#__PURE__*/React.createElement("button", {
      key: k,
      onClick: () => onNav('product', {
        productKey: k
      }),
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
        color: active ? 'var(--forest-950)' : 'var(--text-on-dark-muted)',
        border: `1px solid ${active ? 'var(--bronze-500)' : 'var(--line-on-dark-soft)'}`,
        transition: 'all var(--dur) var(--ease-out)'
      }
    }, PRODUCTEN[k].naam);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 56,
      alignItems: 'center',
      paddingBottom: 56
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(PrEyebrow, {
    dark: true,
    style: {
      marginBottom: 18
    }
  }, p.kicker, " \xB7 op maat"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 60,
      color: 'var(--stone-100)',
      margin: 0,
      lineHeight: 1.03,
      letterSpacing: '-0.01em'
    }
  }, p.naam), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 18,
      lineHeight: 1.6,
      color: 'var(--stone-300)',
      maxWidth: '46ch',
      margin: '22px 0 32px'
    }
  }, p.intro), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(PrButton, {
    variant: "primary",
    arrow: true,
    onClick: () => onNav('contact')
  }, "Plan een adviesgesprek"), /*#__PURE__*/React.createElement(PrButton, {
    variant: "ghost",
    dark: true,
    arrow: true,
    onClick: () => onNav('realisaties')
  }, "Bekijk realisaties"))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 90
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      boxShadow: 'var(--shadow-lg)',
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: p.tone,
    ratio: "4 / 3",
    label: p.naam,
    radius: 8,
    zoom: true,
    slats: key === 'hekwerk' ? 14 : 9
  })))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '88px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.1fr 0.9fr',
      gap: 72,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(PrEyebrow, {
    style: {
      marginBottom: 16
    }
  }, "Het materiaal"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: 28,
      lineHeight: 1.35,
      color: 'var(--text-heading)',
      margin: 0
    }
  }, p.lead)), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper-2)',
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-md)',
      padding: '30px 30px 32px'
    }
  }, /*#__PURE__*/React.createElement(PrEyebrow, {
    style: {
      marginBottom: 18
    }
  }, "Voor wie"), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, p.voorWie.map((v, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)',
      fontFamily: 'var(--font-display)',
      fontSize: 16,
      flex: '0 0 auto'
    }
  }, "\u2014"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15.5,
      lineHeight: 1.55,
      color: 'var(--text-body)'
    }
  }, v)))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '88px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    dark: true,
    eyebrow: "Belangrijkste voordelen",
    titel: "Waarom dit type.",
    max: "14ch"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 1,
      marginTop: 44,
      background: 'var(--line-on-dark-soft)',
      border: '1px solid var(--line-on-dark-soft)'
    }
  }, p.voordelen.map(([t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: t,
    delay: i % 2 * 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--forest-900)',
      padding: '30px 32px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 26,
      color: 'var(--stone-100)',
      marginBottom: 8
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      lineHeight: 1.65,
      color: 'var(--text-on-dark-muted)',
      margin: 0,
      maxWidth: '46ch'
    }
  }, d))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '88px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 56
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-md)',
      padding: '32px 32px 36px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(PrEyebrow, {
    style: {
      marginBottom: 20
    }
  }, "Materialen"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10
    }
  }, p.materialen.map(m => /*#__PURE__*/React.createElement("span", {
    key: m,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-heading)',
      padding: '9px 16px',
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-paper-2)'
    }
  }, m))))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-md)',
      padding: '32px 32px 36px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(PrEyebrow, {
    style: {
      marginBottom: 20
    }
  }, "Afwerkingsmogelijkheden"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10
    }
  }, p.afwerking.map(m => /*#__PURE__*/React.createElement("span", {
    key: m,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-heading)',
      padding: '9px 16px',
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-paper-2)'
    }
  }, m))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper-2)',
      padding: '88px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    eyebrow: "Mogelijke stijlen",
    titel: "E\xE9n type, vele beelden.",
    max: "16ch"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24,
      marginTop: 44
    }
  }, p.stijlen.map(([t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: t,
    delay: i * 80
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(GateImage, {
    tone: p.tone,
    ratio: "4 / 3",
    label: t,
    radius: 6,
    zoom: true,
    slats: 6 + i * 3
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 23,
      color: 'var(--text-heading)',
      margin: '16px 0 6px'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      lineHeight: 1.6,
      color: 'var(--text-muted)',
      margin: 0,
      maxWidth: '40ch'
    }
  }, d))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '88px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 40,
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(SectieKop, {
    eyebrow: "Van advies tot plaatsing",
    titel: "Hoe uw poort tot stand komt.",
    max: "16ch"
  }), /*#__PURE__*/React.createElement(PrButton, {
    variant: "secondary",
    arrow: true,
    onClick: () => onNav('werkwijze')
  }, "Volledige werkwijze"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 1,
      background: 'var(--line-on-light)',
      border: '1px solid var(--line-on-light)'
    }
  }, procesKort.map(([n, t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: n,
    delay: i * 70
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)',
      padding: '28px 24px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 32,
      color: 'var(--accent)',
      lineHeight: 0.9,
      marginBottom: 14
    }
  }, n), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 20,
      color: 'var(--text-heading)',
      margin: '0 0 7px',
      lineHeight: 1.15
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      lineHeight: 1.55,
      color: 'var(--text-muted)',
      margin: 0
    }
  }, d))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '88px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 38,
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(SectieKop, {
    dark: true,
    eyebrow: "Relevante realisaties",
    titel: "Dit type, gerealiseerd.",
    max: "16ch"
  }), /*#__PURE__*/React.createElement(PrButton, {
    variant: "secondary",
    dark: true,
    onClick: () => onNav('realisaties')
  }, "Alle realisaties"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, shownProjects.map((pr, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: pr.id,
    delay: i * 80
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('project', {
      project: pr
    }),
    style: {
      textAlign: 'left',
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: pr.tone,
    ratio: "4 / 3",
    label: pr.materiaal,
    radius: 6,
    zoom: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 21,
      color: 'var(--stone-100)',
      marginTop: 14
    }
  }, pr.naam), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-on-dark-muted)',
      marginTop: 4
    }
  }, pr.regio, " \xB7 ", pr.poorttype))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper-2)',
      padding: '88px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    align: "center",
    eyebrow: "Veelgestelde vragen",
    titel: `Over ${p.naam.toLowerCase()}.`
  })), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 44
    }
  }, /*#__PURE__*/React.createElement(FAQ, {
    items: p.faq
  }))))), /*#__PURE__*/React.createElement(CTASectie, {
    onNav: onNav,
    dark: true
  }));
}
window.ProductNL = ProductNL;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website-nl-licht/Product-nl.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website-nl-licht/ProjectDetail-nl.jsx
try { (() => {
/* Poortland — Nederlandse website. Projectdetailpagina. */
const {
  Button: DtButton,
  Tag: DtTag,
  Eyebrow: DtEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function ProjectDetailNL({
  project,
  onNav
}) {
  const {
    GateImage,
    Reveal,
    CTASectie
  } = window;
  const {
    PROJECTEN
  } = window;
  const p = project || PROJECTEN[0];
  const meer = PROJECTEN.filter(x => x.id !== p.id).slice(0, 3);
  const specs = [['Regio', p.regio], ['Type woning', p.woningtype], ['Materiaal', p.materiaal], ['Poorttype', p.poorttype], ['Stijl', p.stijl], ['Automatisatie', p.automatisatie], ['Breedte', p.span], ['Opgeleverd', p.jaar]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      padding: '36px 44px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('realisaties'),
    style: {
      background: 'none',
      border: 0,
      cursor: 'pointer',
      padding: 0,
      marginBottom: 22,
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-on-dark-muted)'
    }
  }, "\u2190 Terug naar realisaties"), /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(GateImage, {
    tone: p.tone,
    ratio: "21 / 9",
    slats: 13,
    label: `${p.naam} · ${p.regio}`,
    radius: 8
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '52px 44px 84px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.25fr 0.75fr',
      gap: 64
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(DtEyebrow, {
    style: {
      marginBottom: 16
    }
  }, p.regio, " \xB7 ", p.jaar), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 54,
      color: 'var(--text-heading)',
      margin: 0,
      letterSpacing: '-0.01em',
      lineHeight: 1.03
    }
  }, p.naam), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 20,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(DtTag, {
    variant: "solid"
  }, p.materiaal), /*#__PURE__*/React.createElement(DtTag, null, p.poorttype), /*#__PURE__*/React.createElement(DtTag, {
    variant: "olive"
  }, p.woningtype)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 36
    }
  }, /*#__PURE__*/React.createElement(DtEyebrow, {
    style: {
      marginBottom: 12
    }
  }, "De vraag van de klant"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.7,
      color: 'var(--text-body)',
      margin: 0,
      maxWidth: '58ch'
    }
  }, p.vraag)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 30
    }
  }, /*#__PURE__*/React.createElement(DtEyebrow, {
    style: {
      marginBottom: 12
    }
  }, "De oplossing van Poortland"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.7,
      color: 'var(--text-body)',
      margin: 0,
      maxWidth: '58ch'
    }
  }, p.oplossing)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 30
    }
  }, /*#__PURE__*/React.createElement(DtEyebrow, {
    style: {
      marginBottom: 12
    }
  }, "Details van afwerking"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      lineHeight: 1.7,
      color: 'var(--text-muted)',
      margin: 0,
      maxWidth: '58ch'
    }
  }, p.afwerking, " Gesneden, gelast en met de hand afgewerkt in ons atelier in Gent, en daarna ter plaatse geplaatst met verdoken automatisatie."))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("aside", null, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }
  }, specs.map(([k, v], i) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 18,
      padding: '14px 18px',
      borderBottom: i < specs.length - 1 ? '1px solid var(--line-on-light-soft)' : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-faint)'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-heading)',
      fontWeight: 500,
      textAlign: 'right'
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(DtButton, {
    variant: "primary",
    arrow: true,
    onClick: () => onNav('contact')
  }, "Vergelijkbaar project bespreken"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '52px auto 0'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(DtEyebrow, {
    style: {
      marginBottom: 18
    }
  }, "Fotogalerij"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: p.tone,
    ratio: "3 / 2",
    slats: 11,
    label: "Vooraanzicht",
    radius: 6,
    zoom: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateRows: '1fr 1fr',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: "stone",
    ratio: "auto",
    slats: 5,
    label: "Detail \xB7 profiel",
    radius: 6,
    zoom: true
  }), /*#__PURE__*/React.createElement(GateImage, {
    tone: "corten",
    ratio: "auto",
    slats: 7,
    label: "Detail \xB7 afwerking",
    radius: 6,
    zoom: true
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 820,
      margin: '64px auto 0',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontStyle: 'italic',
      fontSize: 28,
      lineHeight: 1.35,
      color: 'var(--text-heading)',
      margin: 0
    }
  }, "Een toegang die past bij de woning, het landschap en het dagelijks gebruik. Precies dat is maatwerk.")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '78px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(DtEyebrow, {
    dark: true,
    style: {
      marginBottom: 28
    }
  }, "Meer uit het atelier")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, meer.map((m, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: m.id,
    delay: i * 80
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('project', {
      project: m
    }),
    style: {
      textAlign: 'left',
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: m.tone,
    ratio: "4 / 3",
    label: m.materiaal,
    radius: 6,
    zoom: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 21,
      color: 'var(--stone-100)',
      marginTop: 13
    }
  }, m.naam), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-on-dark-muted)',
      marginTop: 4
    }
  }, m.regio, " \xB7 ", m.materiaal))))))), /*#__PURE__*/React.createElement(CTASectie, {
    onNav: onNav,
    dark: false
  }));
}
window.ProjectDetailNL = ProjectDetailNL;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website-nl-licht/ProjectDetail-nl.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website-nl-licht/data-nl.jsx
try { (() => {
/* Poortland — Nederlandse website. Content en data.
   Alle teksten in premium Nederlands. Geen koppelteken, geen slashconstructies. */

/* ----------------------------- Realisaties ----------------------------- */
const PROJECTEN = [{
  id: 'duinhof',
  naam: 'Villa Duinhof',
  regio: 'Knokke Heist',
  materiaal: 'Cortenstaal',
  poorttype: 'Schuifpoort',
  woningtype: 'Moderne villa',
  stijl: 'Strak',
  automatisatie: 'Ja',
  span: '4,2 m',
  jaar: '2025',
  tone: 'corten',
  uitgelicht: true,
  vraag: 'Een ruime oprit aan de kust met zicht op de duinen vroeg om een poort die privacy geeft zonder de woning af te sluiten van het landschap.',
  oplossing: 'Een schuifpoort in cortenstaal met een rustig verticaal ritme. De levende roestlaag verdiept met het zeeklimaat en sluit warm aan bij de gevel in lichte steen.',
  afwerking: 'Natuurlijke cortenpatina, geborstelde randen, verdoken loopwiel.'
}, {
  id: 'lievens',
  naam: 'Maison Lievens',
  regio: 'Gent',
  materiaal: 'Aluminium',
  poorttype: 'Draaipoort',
  woningtype: 'Herenhuis',
  stijl: 'Klassiek verfijnd',
  automatisatie: 'Ja',
  span: '1,2 m',
  jaar: '2025',
  tone: 'morning',
  vraag: 'Een statig herenhuis in het centrum van Gent wenste een voetgangerspoort die discreet en duurzaam was, in lijn met de historische gevel.',
  oplossing: 'Een draaipoort in aluminium met fijne verticale spijlen en een mat gepoederlakte afwerking in dieptegroen. Onderhoudsarm en bestand tegen het stadsklimaat.',
  afwerking: 'Gepoederlakt in fijnstructuur, ingewerkt slot, zachte demping.'
}, {
  id: 'brael',
  naam: 'Hofstede Brael',
  regio: 'Sint Martens Latem',
  materiaal: 'Staal en hout',
  poorttype: 'Schuifpoort',
  woningtype: 'Landelijke woning',
  stijl: 'Landelijk warm',
  automatisatie: 'Ja',
  span: '5,0 m',
  jaar: '2024',
  tone: 'dusk',
  uitgelicht: true,
  vraag: 'Een gerenoveerde hofstede met een lange dreef vroeg om een brede toegang die robuust aanvoelt en toch warmte uitstraalt.',
  oplossing: 'Een schuifpoort met een gelakt stalen frame en een invulling in massieve eik. Het hout brengt warmte, het staal draagt de breedte en de automatisatie.',
  afwerking: 'Geolied eik, mat zwart staal, verdoken automatisatie in de fundering.'
}, {
  id: 'noordkaai',
  naam: 'Huis Noordkaai',
  regio: 'Antwerpen',
  materiaal: 'Aluminium',
  poorttype: 'Draaipoort',
  woningtype: 'Nieuwbouw',
  stijl: 'Strak',
  automatisatie: 'Ja',
  span: '3,6 m',
  jaar: '2024',
  tone: 'stone',
  vraag: 'Een moderne nieuwbouw aan de rand van Antwerpen zocht een dubbele oprijpoort die naadloos aansluit bij de horizontale lijnen van de architectuur.',
  oplossing: 'Een dubbele draaipoort in aluminium met brede horizontale lamellen. De poort volgt de gevelritmiek en sluit vlak af met de carport.',
  afwerking: 'Geborsteld aluminium, gepoederlakt antraciet, lineaire lamellen.'
}, {
  id: 'velden',
  naam: 'Domein Velden',
  regio: 'Leuven',
  materiaal: 'Smeedijzer',
  poorttype: 'Draaipoort',
  woningtype: 'Kasteelhoeve',
  stijl: 'Klassiek',
  automatisatie: 'Ja',
  span: '6,4 m',
  jaar: '2023',
  tone: 'dusk',
  vraag: 'Een historische kasteelhoeve vroeg om een statige toegang die het erfgoed eert en toch dagelijks comfortabel in gebruik is.',
  oplossing: 'Een brede draaipoort in handgesmeed staal met een sober klassiek profiel. Elk onderdeel werd met de hand geforceerd en gesmeed in het atelier.',
  afwerking: 'Handgesmeed staal, mat gelakt, smeedwerk per stuk afgewerkt.'
}, {
  id: 'strandvilla',
  naam: 'Strandvilla Negen',
  regio: 'Oostduinkerke',
  materiaal: 'Cortenstaal',
  poorttype: 'Schuifpoort',
  woningtype: 'Kustvilla',
  stijl: 'Strak',
  automatisatie: 'Ja',
  span: '2,8 m',
  jaar: '2023',
  tone: 'corten',
  vraag: 'Een kustvilla wenste maximale privacy aan de straatzijde zonder de woning gesloten te laten ogen.',
  oplossing: 'Een schuifpoort in cortenstaal met dichte privacylamellen die het zicht breken maar lucht doorlaten. De patina sluit aan bij het duinlandschap.',
  afwerking: 'Cortenstaal met privacylamellen, geborstelde geleiding.'
}, {
  id: 'eiksteen',
  naam: 'Eik en Steen',
  regio: 'Brasschaat',
  materiaal: 'Hout',
  poorttype: 'Draaipoort',
  woningtype: 'Villa',
  stijl: 'Tijdloos warm',
  automatisatie: 'Ja',
  span: '3,2 m',
  jaar: '2025',
  tone: 'dusk',
  uitgelicht: true,
  vraag: 'Een villa in het groen van Brasschaat zocht een warme houten poort die de woning verankert in haar bosrijke omgeving.',
  oplossing: 'Een draaipoort in massieve eik met een verticaal ritme dat de bomen weerspiegelt. Een verdoken stalen kader draagt de bewegende delen onzichtbaar.',
  afwerking: 'Massieve eik, natuurlijk geolied, verdoken stalen kern.'
}, {
  id: 'park',
  naam: 'Park Mechelen',
  regio: 'Mechelen',
  materiaal: 'Aluminium',
  poorttype: 'Hekwerk',
  woningtype: 'Moderne woning',
  stijl: 'Strak',
  automatisatie: 'Deels',
  span: '24 m hekwerk',
  jaar: '2024',
  tone: 'morning',
  vraag: 'Een ruime tuin vroeg om een doorlopend hekwerk met een geïntegreerde poort, in één rustig beeld.',
  oplossing: 'Een hekwerk op maat in aluminium met een geïntegreerde schuifpoort. Hek en poort delen hetzelfde lamelprofiel, zodat de toegang opgaat in het geheel.',
  afwerking: 'Gepoederlakt aluminium, doorlopend lamelprofiel, lijnverlichting.'
}];

/* ----------------------------- Producten ----------------------------- */
/* De productwisselaar toont de poortpagina voor elk type. Houten poorten is uitgewerkt
   als voorbeeldpagina; de andere types delen dezelfde rijke structuur. */
const PRODUCTEN = {
  houten: {
    key: 'houten',
    naam: 'Houten poorten',
    kicker: 'Hout',
    tone: 'dusk',
    materiaalFilter: 'Hout',
    intro: 'Warm, levend en tijdloos. Een houten poort verankert uw woning in haar omgeving en wordt mooier met de jaren.',
    lead: 'Hout is het meest tactiele materiaal dat wij verwerken. Wij kiezen voor duurzame eik en thermisch behandelde houtsoorten, gedragen door een verdoken stalen kern die de poort jarenlang recht en stil houdt.',
    voorWie: ['Villa\u2019s en landelijke woningen die warmte en natuurlijkheid zoeken.', 'Renovaties waar hout aansluit bij gevel, schrijnwerk of omgeving.', 'Woningen in het groen waar de poort moet opgaan in het landschap.'],
    voordelen: [['Warme uitstraling', 'Hout brengt diepte en karakter die geen ander materiaal evenaart.'], ['Levende materie', 'De nerf en de toon verdiepen met de jaren tot een eigen patina.'], ['Stabiele kern', 'Een verdoken stalen kader houdt de poort recht en draagt de automatisatie.'], ['Volledig op maat', 'Elke lat, verhouding en afwerking wordt voor uw opening getekend.']],
    materialen: ['Massieve eik', 'Thermisch verduurzaamd hout', 'Afromezi en hardhout', 'Verdoken stalen kern'],
    afwerking: ['Natuurlijk geolied', 'Mat gelakt op kleur', 'Geborsteld en geloogd', 'Combinatie met staal of inox'],
    stijlen: [['Verticaal ritme', 'Smalle latten in een rustig verticaal patroon. Tijdloos en discreet.'], ['Vlak en dicht', 'Brede planken vlak naast elkaar voor maximale privacy en rust.'], ['Hout en metaal', 'Een houten invulling in een fijn stalen of aluminium kader.']],
    faq: [['Hoeveel onderhoud vraagt een houten poort?', 'Een houten poort vraagt periodiek een onderhoudsbeurt met olie of lak, afhankelijk van houtsoort en oriëntatie. Wij adviseren bij oplevering een ritme en blijven beschikbaar voor de opvolging.'], ['Blijft een houten poort recht?', 'Ja. Wij bouwen elke houten poort op een verdoken stalen kern. Die draagt het gewicht en de beweging, zodat het hout enkel zichtbaar werk doet en stabiel blijft.'], ['Welke houtsoort past het best?', 'Dat hangt af van uw woning, de oriëntatie en het gewenste onderhoud. Eik straalt warmte uit, thermisch hout is bijzonder stabiel. Tijdens het adviesgesprek bekijken wij samen wat past.']]
  },
  metalen: {
    key: 'metalen',
    naam: 'Metalen poorten',
    kicker: 'Staal',
    tone: 'stone',
    materiaalFilter: 'Smeedijzer',
    intro: 'Sterk, strak en bestand tegen de tijd. Een stalen poort geeft uw toegang gewicht en precisie.',
    lead: 'Staal laat ons de fijnste lijnen en de breedste overspanningen maken. Van strak plaatwerk tot handgesmeed profiel, elke poort wordt gelast en afgewerkt als één geheel in ons atelier.',
    voorWie: ['Woningen die kracht, precisie en een lange levensduur zoeken.', 'Brede opritten waar staal de overspanning moeielloos draagt.', 'Klassieke en eigentijdse architectuur die strakke lijnen vraagt.'],
    voordelen: [['Maximale sterkte', 'Staal draagt grote breedtes en blijft strak over de jaren.'], ['Fijne lijnen', 'Dunne profielen en scherpe details die enkel in staal kunnen.'], ['Handgesmeed mogelijk', 'Klassiek smeedwerk per stuk geforceerd en afgewerkt.'], ['Duurzame lak', 'Een gepoederlakte of natte laklaag beschermt jarenlang.']],
    materialen: ['Geborsteld plaatstaal', 'Handgesmeed staal', 'Buisprofielen op maat', 'Inox accenten'],
    afwerking: ['Gepoederlakt op kleur', 'Mat of zijdeglans', 'Gegalvaniseerd als basis', 'Smeedwerk met de hand'],
    stijlen: [['Strak plaatwerk', 'Gesloten of geperforeerde panelen voor een rustig modern beeld.'], ['Verticale spijlen', 'Een klassiek ritme van fijne verticale staven.'], ['Smeedwerk', 'Handgesmede details voor erfgoed en klassieke villa\u2019s.']],
    faq: [['Roest een stalen poort?', 'Niet wanneer hij correct is voorbehandeld en afgewerkt. Wij galvaniseren of gronden elke stalen poort en brengen daarna een duurzame laklaag aan.'], ['Hoe breed kan een stalen poort?', 'Staal draagt ruime overspanningen. Voor brede opritten kiezen wij vaak een schuifpoort in staal, die ook bij grote breedtes stil en stabiel beweegt.'], ['Kan smeedwerk modern ogen?', 'Zeker. Wij vertalen klassiek smeedwerk naar rustige, eigentijdse profielen die passen bij zowel erfgoed als nieuwbouw.']]
  },
  aluminium: {
    key: 'aluminium',
    naam: 'Aluminium poorten',
    kicker: 'Aluminium',
    tone: 'morning',
    materiaalFilter: 'Aluminium',
    intro: 'Onderhoudsarm, licht en strak. Aluminium is de keuze voor wie rust en gemak voorop stelt.',
    lead: 'Aluminium roest niet en vraagt nauwelijks onderhoud. Het materiaal laat strakke lamellen en grote vlakken toe, gepoederlakt in elke gewenste kleur en structuur.',
    voorWie: ['Moderne woningen en nieuwbouw met horizontale lijnen.', 'Wie een onderhoudsarme poort wenst zonder in te boeten op uitstraling.', 'Kustwoningen waar het zeeklimaat extra weerstand vraagt.'],
    voordelen: [['Onderhoudsarm', 'Aluminium roest niet en blijft jarenlang strak en kleurvast.'], ['Licht in gewicht', 'Soepele beweging en minder belasting voor de automatisatie.'], ['Strakke lamellen', 'Horizontale of verticale lamellen voor een rustig modern beeld.'], ['Vrije kleurkeuze', 'Gepoederlakt in elke kleur en structuur die de gevel vraagt.']],
    materialen: ['Geëxtrudeerde lamellen', 'Vlakke panelen', 'Geperforeerd aluminium', 'Inox accenten'],
    afwerking: ['Gepoederlakt fijnstructuur', 'Mat of zijdeglans', 'Houtlook coating', 'Tweekleurig op aanvraag'],
    stijlen: [['Horizontale lamellen', 'Brede lamellen die de horizon van de architectuur volgen.'], ['Vlak en gesloten', 'Een rustig dicht paneel voor maximale privacy.'], ['Lamel en glas', 'Aluminium gecombineerd met glas of een groene invulling.']],
    faq: [['Verkleurt aluminium in de zon?', 'Een kwalitatieve poederlak is uv bestendig en blijft jarenlang kleurvast. Wij werken enkel met coatings die geschikt zijn voor buitengebruik aan zee en in de stad.'], ['Is aluminium sterk genoeg?', 'Voor de meeste woningpoorten zeker. Voor zeer brede overspanningen versterken wij het profiel of kiezen wij voor een schuifuitvoering.'], ['Kan aluminium op hout lijken?', 'Ja. Een houtlook coating geeft de warmte van hout met het gemak van aluminium, zonder periodiek onderhoud.']]
  },
  staalhout: {
    key: 'staalhout',
    naam: 'Combinatie staal en hout',
    kicker: 'Staal en hout',
    tone: 'dusk',
    materiaalFilter: 'Staal en hout',
    intro: 'Het beste van twee materialen. Een stalen kader draagt, een houten invulling verwarmt.',
    lead: 'De combinatie van staal en hout verenigt kracht en warmte. Het staal geeft fijne lijnen en draagt de breedte en de beweging, het hout brengt karakter en tactiliteit.',
    voorWie: ['Woningen die warmte willen zonder de strakheid los te laten.', 'Brede opritten waar staal draagt en hout verzacht.', 'Renovaties die oud en nieuw met elkaar willen verbinden.'],
    voordelen: [['Kracht en warmte', 'Staal draagt en lijnt, hout verzacht en verwarmt.'], ['Brede overspanning', 'Het stalen kader maakt grote breedtes mogelijk.'], ['Contrastrijk', 'Mat staal naast warm hout geeft diepte en karakter.'], ['Volledig op maat', 'Verhouding, ritme en toon worden samen bepaald.']],
    materialen: ['Stalen kader op maat', 'Massieve eik', 'Thermisch hout', 'Inox bevestiging'],
    afwerking: ['Mat zwart staal', 'Geolied hout', 'Tweekleurige combinatie', 'Verdoken bevestiging'],
    stijlen: [['Kader en invulling', 'Een strak stalen kader met een warme houten invulling.'], ['Horizontaal banden', 'Afwisselende banden in staal en hout.'], ['Vlak contrast', 'Een gesloten houten vlak in een fijne stalen lijst.']],
    faq: [['Werkt hout en staal goed samen?', 'Ja, mits correct opgebouwd. Wij scheiden de materialen technisch zodat ze onafhankelijk kunnen werken, en houden het beeld strak en stabiel.'], ['Wat draagt de poort?', 'Het stalen kader draagt het gewicht en de beweging. Het hout is de zichtbare invulling en blijft daardoor stabiel.'], ['Hoeveel onderhoud?', 'Het hout vraagt periodiek olie of lak, het staal nauwelijks. Wij adviseren een ritme bij oplevering.']]
  },
  schuif: {
    key: 'schuif',
    naam: 'Schuifpoorten',
    kicker: 'Poorttype',
    tone: 'corten',
    materiaalFilter: null,
    intro: 'De keuze voor brede opritten en beperkte ruimte. Een schuifpoort beweegt zijwaarts en vraagt geen zwenkruimte.',
    lead: 'Een schuifpoort glijdt opzij in plaats van open te draaien. Ideaal voor hellende opritten, beperkte diepte of grote breedtes. Wij maken hem in hout, aluminium, staal of cortenstaal.',
    voorWie: ['Brede opritten die geen zwenkruimte voor een draaipoort hebben.', 'Hellende terreinen waar een draaipoort niet vlot opent.', 'Wie een rustige, horizontale beweging verkiest.'],
    voordelen: [['Geen zwenkruimte', 'De poort schuift opzij en wint kostbare opritruimte.'], ['Geschikt voor breed', 'Grote overspanningen bewegen stil en stabiel.'], ['Werkt op een helling', 'Ook op hellend terrein blijft de beweging vlot.'], ['Robuuste geleiding', 'Een verdoken loopwerk draagt de poort jarenlang.']],
    materialen: ['Cortenstaal', 'Aluminium lamellen', 'Staal en hout', 'Massieve eik'],
    afwerking: ['Vrijdragend of op rail', 'Verdoken loopwiel', 'Privacylamellen', 'Geïntegreerde verlichting'],
    stijlen: [['Vrijdragend', 'Zonder rail op de grond, voor een vlakke en strakke oprit.'], ['Lamellen', 'Een rustig horizontaal ritme dat privacy met lucht combineert.'], ['Dicht paneel', 'Een gesloten vlak voor maximale beslotenheid.']],
    faq: [['Wat is een vrijdragende schuifpoort?', 'Een vrijdragende poort heeft geen rail in de grond. Hij wordt gedragen door een verdoken loopwerk naast de oprit, zodat de doorgang vlak en obstakelvrij blijft.'], ['Schuifpoort of draaipoort?', 'Een schuifpoort wint ruimte en werkt goed op hellingen en brede opritten. Een draaipoort is rustiger en klassieker bij voldoende plaats. Wij adviseren op basis van uw terrein.'], ['Hoe stil is de beweging?', 'Een correct geplaatste schuifpoort beweegt nagenoeg geruisloos dankzij een kwalitatief loopwerk en een zachte demping bij begin en einde.']]
  },
  draai: {
    key: 'draai',
    naam: 'Draaipoorten',
    kicker: 'Poorttype',
    tone: 'morning',
    materiaalFilter: null,
    intro: 'De klassieke en meest verfijnde beweging. Een draaipoort opent statig naar binnen of buiten.',
    lead: 'Een draaipoort draait op verdoken scharnieren en geeft uw toegang een rustige, klassieke beweging. In één of twee vleugels, in elk materiaal dat bij uw woning past.',
    voorWie: ['Woningen met voldoende oprijdiepte voor de zwenkbeweging.', 'Wie de klassieke, statige opening van een draaipoort verkiest.', 'Smalle voetgangerstoegangen naast een grotere oprijpoort.'],
    voordelen: [['Klassieke beweging', 'Een rustige, statige opening die tijdloos aanvoelt.'], ['Eén of twee vleugels', 'Enkel of dubbel, afgestemd op de breedte van de opening.'], ['Verfijnde details', 'Verdoken scharnieren en een vlakke aansluiting.'], ['Elk materiaal', 'Hout, aluminium, staal of een combinatie naar keuze.']],
    materialen: ['Aluminium', 'Massieve eik', 'Handgesmeed staal', 'Staal en hout'],
    afwerking: ['Verdoken scharnieren', 'Zachte demping', 'Ingewerkt slot', 'Geïntegreerde voetgangerspoort'],
    stijlen: [['Enkele vleugel', 'Eén rustige vleugel voor smallere toegangen.'], ['Dubbele vleugel', 'Twee vleugels die symmetrisch openen voor brede opritten.'], ['Met loopdeur', 'Een geïntegreerde voetgangerspoort in hetzelfde beeld.']],
    faq: [['Hoeveel ruimte vraagt een draaipoort?', 'Een draaipoort heeft zwenkruimte nodig voor de vleugels. Bij beperkte diepte adviseren wij een schuifpoort of een opening naar binnen.'], ['Eén of twee vleugels?', 'Dat hangt af van de breedte. Tot ongeveer drie meter volstaat vaak één vleugel, daarboven kiezen wij meestal voor twee.'], ['Kan er een loopdeur in?', 'Ja. Wij integreren een voetgangerspoort in dezelfde lijn, zodat het beeld rustig en samenhangend blijft.']]
  },
  hekwerk: {
    key: 'hekwerk',
    naam: 'Hekwerken op maat',
    kicker: 'Hekwerk',
    tone: 'stone',
    materiaalFilter: null,
    intro: 'Eén doorlopend beeld rond uw eigendom. Een hekwerk dat naadloos aansluit bij de poort.',
    lead: 'Een hekwerk op maat omkadert uw woning in hetzelfde profiel en dezelfde toon als de poort. Zo wordt de volledige afsluiting één rustig, samenhangend geheel.',
    voorWie: ['Eigendommen die poort en omheining in één beeld willen.', 'Tuinen die afgeschermd worden zonder zwaar of gesloten te ogen.', 'Projecten waar de afsluiting de architectuur moet versterken.'],
    voordelen: [['Eén geheel', 'Hek en poort delen hetzelfde profiel en dezelfde toon.'], ['Op maat van het terrein', 'Volgt hoogteverschillen en hoeken nauwkeurig.'], ['Open of besloten', 'Van transparant tot volledig privacygericht.'], ['Duurzame materialen', 'Aluminium, staal of cortenstaal, naar keuze.']],
    materialen: ['Aluminium lamellen', 'Cortenstaal', 'Verticale spijlen', 'Gecombineerd met groen'],
    afwerking: ['Doorlopend lamelprofiel', 'Lijnverlichting', 'Geïntegreerde poort', 'Op maat van de helling'],
    stijlen: [['Lamellen', 'Een doorlopend horizontaal ritme rond het volledige terrein.'], ['Spijlen', 'Fijne verticale staven voor een open, klassiek beeld.'], ['Vol en groen', 'Dichte panelen afgewisseld met beplanting.']],
    faq: [['Sluit het hekwerk aan op de poort?', 'Ja, dat is net het uitgangspunt. Wij tekenen hek en poort in hetzelfde profiel, zodat de toegang opgaat in de volledige afsluiting.'], ['Volgt het hekwerk een helling?', 'Zeker. Wij meten het terrein nauwkeurig op en laten het hekwerk de hoogteverschillen en hoeken rustig volgen.'], ['Hoe transparant kan een hekwerk?', 'Van volledig open met fijne spijlen tot volledig besloten met dichte panelen. Wij stemmen de mate van privacy af op uw wens en ligging.']]
  },
  automatisatie: {
    key: 'automatisatie',
    naam: 'Automatisatie',
    kicker: 'Techniek',
    tone: 'dusk',
    materiaalFilter: null,
    intro: 'Comfort dat u dagelijks voelt. Een poort die stil, veilig en betrouwbaar opent.',
    lead: 'Automatisatie is techniek die onzichtbaar hoort te zijn. Wij integreren betrouwbare aandrijving, veilige detectie en eenvoudige bediening, en blijven beschikbaar voor onderhoud en herstelling.',
    voorWie: ['Wie comfort en veiligheid bij de dagelijkse toegang verwacht.', 'Bestaande poorten die toe zijn aan een betrouwbare aandrijving.', 'Nieuwe poorten waar de techniek van bij het ontwerp wordt ingepast.'],
    voordelen: [['Verdoken techniek', 'Aandrijving in de fundering of discreet weggewerkt.'], ['Veilige detectie', 'Sensoren en beveiliging tegen klem en obstakels.'], ['Eenvoudige bediening', 'Afstandsbediening, codeklavier of bediening via uw telefoon.'], ['Sterke opvolging', 'Wij blijven bereikbaar voor onderhoud en herstelling.']],
    materialen: ['Ondergrondse aandrijving', 'Zijdelingse motor', 'Schuifpoortmotor', 'Back up batterij'],
    afwerking: ['Codeklavier', 'Afstandsbediening', 'Bediening via telefoon', 'Veiligheidssensoren'],
    stijlen: [['Ondergronds', 'Een verdoken motor in de fundering, volledig uit het zicht.'], ['Verdoken zijwaarts', 'Een discrete motor weggewerkt in de paal of de muur.'], ['Schuifaandrijving', 'Een robuuste, stille aandrijving voor schuifpoorten.']],
    faq: [['Werkt automatisatie ook op mijn bestaande poort?', 'Vaak wel. Wij beoordelen tijdens een plaatsbezoek of de poort en de constructie geschikt zijn en welke aandrijving past.'], ['Wat gebeurt er bij stroomuitval?', 'Wij voorzien waar gewenst een back up batterij en een handmatige ontgrendeling, zodat de poort altijd te openen blijft.'], ['Is automatisatie veilig?', 'Ja. Wij plaatsen veiligheidssensoren die detecteren wanneer iets of iemand zich in de baan bevindt, en stemmen de kracht zorgvuldig af.']]
  }
};
const PRODUCT_VOLGORDE = ['houten', 'metalen', 'aluminium', 'staalhout', 'schuif', 'draai', 'hekwerk', 'automatisatie'];

/* ----------------------------- Werkwijze ----------------------------- */
const WERKWIJZE = [['01', 'Eerste contact en adviesgesprek', 'Alles begint met een gesprek. Wij luisteren naar uw woning, uw oprit en het gevoel dat u zoekt. Geen catalogus, maar een eerlijk advies over wat past.'], ['02', 'Plaatsbezoek en opmeting', 'Wij komen ter plaatse, lezen de architectuur en de toegang, en meten nauwkeurig op. Zo houdt het ontwerp rekening met helling, breedte en gebruik.'], ['03', 'Ontwerp en voorstel', 'U ontvangt een ontwerp op maat met materiaal, ritme, afwerking en automatisatie. Wij verfijnen samen tot elk detail klopt.'], ['04', 'Productie en afwerking', 'In ons atelier wordt uw poort gesneden, gelast en met de hand afgewerkt. Eén object, geen samengesteld pakket.'], ['05', 'Plaatsing en automatisatie', 'Onze eigen plaatsers monteren de poort en stellen de verdoken automatisatie nauwkeurig af. Wij leveren proper en stil op.'], ['06', 'Oplevering en service na verkoop', 'Wij overlopen het gebruik en het onderhoud, en blijven daarna bereikbaar. Service is voor ons een onderdeel van kwaliteit.']];

/* ----------------------------- Vertrouwensclaims ----------------------------- */
const CLAIMS = ['Handgemaakt in België', 'Duurzame materialen', 'Advies, opmeting en plaatsing door specialisten', 'Sterke service na verkoop'];

/* ----------------------------- Homepage FAQ ----------------------------- */
const HOME_FAQ = [['Hoe lang duurt het maken en plaatsen van een poort?', 'Een traject van eerste contact tot plaatsing duurt gemiddeld zes tot acht weken. De exacte termijn hangt af van materiaal, ontwerp en automatisatie. Wij bevestigen een realistische planning bij het voorstel.'], ['Waarom is een Belgische poort op maat duurder dan import?', 'U investeert in Belgisch handwerk, duurzame materialen, een correcte plaatsing en een sterke service na verkoop. Geen importproduct uit een doos, maar een poort die voor uw woning is getekend en jarenlang vertrouwen geeft.'], ['Komen jullie altijd ter plaatse?', 'Ja. Er is altijd een plaatsbezoek en een adviesgesprek met opmeting. Zo houdt het ontwerp rekening met uw terrein, uw architectuur en uw dagelijks gebruik.'], ['Welk materiaal past het best bij mijn woning?', 'Dat bepalen wij samen. Hout brengt warmte, aluminium is onderhoudsarm, staal geeft kracht en cortenstaal verkleurt mee met het landschap. Tijdens het adviesgesprek bekijken wij wat bij uw woning past.']];

/* ----------------------------- Advies ----------------------------- */
const ADVIES = [['Welke poort past bij een moderne woning?', 'Materialen', 'Strakke lijnen, lamellen en aluminium voor een rustige, eigentijdse toegang.'], ['Welke poort past bij een landelijke woning?', 'Inspiratie', 'Hout en staal die warmte en robuustheid verenigen in een landelijke omgeving.'], ['Schuifpoort of draaipoort kiezen?', 'Poorttypes', 'Hoe ruimte, helling en uitstraling uw keuze tussen schuiven en draaien bepalen.'], ['Aluminium, staal of hout voor uw poort?', 'Materialen', 'Een nuchtere vergelijking van de drie materialen die wij het vaakst verwerken.'], ['Wat bepaalt de prijs van een poort op maat?', 'Prijs en investering', 'Welke keuzes de investering sturen, en waarom maatwerk meer waarde biedt dan import.'], ['Hoe verloopt een plaatsbezoek?', 'Proces', 'Wat u mag verwachten van het adviesgesprek, de opmeting en het voorstel.']];
Object.assign(window, {
  PROJECTEN,
  PRODUCTEN,
  PRODUCT_VOLGORDE,
  WERKWIJZE,
  CLAIMS,
  HOME_FAQ,
  ADVIES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website-nl-licht/data-nl.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website-nl-licht/shared-nl.jsx
try { (() => {
/* Poortland — Nederlandse website. Gedeelde bouwstenen.
   Nav met productmenu en taalwisselaar, footer, beeldplaceholder, reveal animatie. */

const {
  Button: SButton,
  Tag: STag,
  Eyebrow: SEyebrow
} = window.PoortlandDesignSystem_6dcc8b;

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
  const talen = ['NL', 'FR', 'DE', 'EN'];
  const faint = dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)';
  const active = dark ? 'var(--stone-100)' : 'var(--text-heading)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 2
    },
    role: "group",
    "aria-label": "Taal"
  }, talen.map((t, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: t
  }, i > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: faint,
      opacity: 0.4,
      fontSize: 11
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onLang(t),
    "aria-pressed": lang === t,
    style: {
      background: 'none',
      border: 0,
      cursor: 'pointer',
      padding: '4px 5px',
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.12em',
      color: lang === t ? active : faint,
      borderBottom: lang === t ? '1px solid var(--accent)' : '1px solid transparent'
    }
  }, t))));
}

/* ---- Hoofdnavigatie met productmenu ---- */
const PRODUCT_MENU = [['houten', 'Houten poorten'], ['metalen', 'Metalen poorten'], ['aluminium', 'Aluminium poorten'], ['staalhout', 'Combinatie staal en hout'], ['schuif', 'Schuifpoorten'], ['draai', 'Draaipoorten'], ['hekwerk', 'Hekwerken op maat'], ['automatisatie', 'Automatisatie']];
function Nav({
  route,
  onNav,
  lang,
  onLang
}) {
  const [openMenu, setOpenMenu] = React.useState(false);
  const items = [['realisaties', 'Realisaties'], ['werkwijze', 'Werkwijze'], ['atelier', 'Over Poortland'], ['contact', 'Contact']];
  const fg = 'var(--stone-200)';
  const faint = 'var(--text-on-dark-muted)';
  return /*#__PURE__*/React.createElement("header", {
    onMouseLeave: () => setOpenMenu(false),
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
      setOpenMenu(false);
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
    onMouseEnter: () => setOpenMenu(true),
    onClick: () => setOpenMenu(v => !v),
    "aria-expanded": openMenu,
    style: {
      background: 'none',
      border: 0,
      cursor: 'pointer',
      padding: '4px 0',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      fontWeight: route === 'product' ? 600 : 400,
      color: route === 'product' || openMenu ? fg : faint,
      borderBottom: route === 'product' ? '1px solid var(--accent)' : '1px solid transparent'
    }
  }, "Poorten", /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      fontSize: 9,
      transition: 'transform var(--dur) var(--ease-out)',
      transform: openMenu ? 'rotate(180deg)' : 'none',
      display: 'inline-block'
    }
  }, "\u25BE")), items.map(([key, label]) => /*#__PURE__*/React.createElement("button", {
    key: key,
    onClick: () => {
      onNav(key);
      setOpenMenu(false);
    },
    style: {
      background: 'none',
      border: 0,
      cursor: 'pointer',
      padding: '4px 0',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      fontWeight: route === key ? 600 : 400,
      color: route === key ? fg : faint,
      borderBottom: route === key ? '1px solid var(--accent)' : '1px solid transparent'
    }
  }, label)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 18,
      background: 'var(--line-on-dark-soft)'
    }
  }), /*#__PURE__*/React.createElement(TaalWisselaar, {
    lang: lang,
    onLang: onLang,
    dark: true
  }), /*#__PURE__*/React.createElement(SButton, {
    variant: "primary",
    size: "sm",
    arrow: true,
    as: "button",
    onClick: () => {
      onNav('contact');
      setOpenMenu(false);
    }
  }, "Plan een adviesgesprek"))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'hidden',
      maxHeight: openMenu ? 320 : 0,
      transition: 'max-height 360ms var(--ease-out)',
      borderTop: openMenu ? '1px solid var(--line-on-dark-soft)' : '1px solid transparent',
      background: 'rgba(248,244,236,0.98)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      padding: '26px 44px 30px'
    }
  }, /*#__PURE__*/React.createElement(SEyebrow, {
    dark: true,
    tone: "muted",
    style: {
      marginBottom: 16
    }
  }, "Poorten, hekwerken en automatisatie"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '4px 20px'
    }
  }, PRODUCT_MENU.map(([key, label]) => /*#__PURE__*/React.createElement("button", {
    key: key,
    onClick: () => {
      onNav('product', {
        productKey: key
      });
      setOpenMenu(false);
    },
    style: {
      textAlign: 'left',
      background: 'none',
      border: 0,
      cursor: 'pointer',
      padding: '11px 12px',
      borderRadius: 'var(--radius-sm)',
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      color: 'var(--stone-200)',
      transition: 'background var(--dur) var(--ease-out), color var(--dur) var(--ease-out)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--forest-800)';
      e.currentTarget.style.color = 'var(--stone-100)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.color = 'var(--stone-200)';
    }
  }, label))))));
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
  }, "Deze taalversie is in voorbereiding \xB7 u bekijkt de Nederlandse versie");
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
  }, "\u2014"), /*#__PURE__*/React.createElement("span", {
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
    onClick: () => onNav('atelier')
  }, "Bezoek onze showroom"))));
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
      marginBottom: 18
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
  }, "Handgemaakte toegangspoorten, hekwerken en automatisatie op maat. Ontworpen, gemaakt en geplaatst in Belgi\xEB."), /*#__PURE__*/React.createElement(TaalWisselaar, {
    lang: lang,
    onLang: onLang,
    dark: true
  })), /*#__PURE__*/React.createElement(FooterKol, {
    title: "Poorten",
    links: [['Houten poorten', () => onNav('product', {
      productKey: 'houten'
    })], ['Aluminium poorten', () => onNav('product', {
      productKey: 'aluminium'
    })], ['Schuifpoorten', () => onNav('product', {
      productKey: 'schuif'
    })], ['Hekwerken', () => onNav('product', {
      productKey: 'hekwerk'
    })], ['Automatisatie', () => onNav('product', {
      productKey: 'automatisatie'
    })]]
  }), /*#__PURE__*/React.createElement(FooterKol, {
    title: "Ontdek",
    links: [['Realisaties', () => onNav('realisaties')], ['Werkwijze', () => onNav('werkwijze')], ['Over Poortland', () => onNav('atelier')], ['Contact', () => onNav('contact')]]
  }), /*#__PURE__*/React.createElement(FooterKol, {
    title: "Atelier en showroom",
    links: [['Dok Noord 4, 9000 Gent'], ['+32 9 224 18 70'], ['hallo@poortland.be'], ['Open op afspraak']]
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
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Poortland \u2014 Handgemaakt in Belgi\xEB sinds 1992"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 22,
      letterSpacing: '0.06em'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('atelier'),
    style: {
      background: 'none',
      border: 0,
      color: 'inherit',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: 'inherit'
    }
  }, "Privacybeleid"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('atelier'),
    style: {
      background: 'none',
      border: 0,
      color: 'inherit',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: 'inherit'
    }
  }, "Cookiebeleid"), /*#__PURE__*/React.createElement("span", null, "BTW BE 0xxx.xxx.xxx")))));
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
Object.assign(window, {
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
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website-nl-licht/shared-nl.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website-nl/About-nl.jsx
try { (() => {
/* Poortland — Nederlandse website. Over Poortland en atelier. */
const {
  Button: AbButton,
  Eyebrow: AbEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function AboutNL({
  onNav
}) {
  const {
    GateImage,
    Reveal,
    ClaimBalk,
    CTASectie,
    SectieKop
  } = window;
  const vakmanschap = [['Handwerk', 'Elke poort wordt met de hand getekend, gelast en afgewerkt. Geen samengesteld pakket, maar één object.'], ['Belgische productie', 'Alles gebeurt in ons eigen atelier in Gent. Geen import, geen tussenschakels.'], ['Materiaalkennis', 'Wij kennen het gedrag van eik, aluminium, staal en cortenstaal, en kiezen wat past bij uw woning.'], ['Detailzorg', 'Verhouding, ritme en afwerking worden tot in het detail uitgewerkt en gecontroleerd.'], ['Eigen plaatsers', 'Onze eigen techniekers plaatsen en stellen af. Zij kennen de poort die zij monteren.'], ['Automatisatie', 'Wij integreren betrouwbare, verdoken aandrijving en blijven beschikbaar voor de opvolging.']];
  const cijfers = [['1992', 'Opgericht'], ['100%', 'Handgemaakt'], ['320+', 'Woningen'], ['4', 'Materialen']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '72px 44px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 860
    }
  }, /*#__PURE__*/React.createElement(AbEyebrow, {
    dark: true,
    style: {
      marginBottom: 22
    }
  }, "Over Poortland"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 60,
      color: 'var(--stone-100)',
      margin: 0,
      lineHeight: 1.05,
      letterSpacing: '-0.01em'
    }
  }, "Een poort is de eerste indruk van het huis."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 19,
      lineHeight: 1.6,
      color: 'var(--stone-300)',
      maxWidth: '52ch',
      marginTop: 24
    }
  }, "Sinds 1992 ontwerpt, maakt en plaatst Poortland handgemaakte toegangspoorten en hekwerken op maat. Voor woningen waar uitstraling, veiligheid en afwerking samenkomen, en voor mensen die kwaliteit boven snelheid verkiezen."))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 56,
      paddingBottom: 0
    }
  }, /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: "dusk",
    ratio: "21 / 9",
    slats: 15,
    label: "Atelier en showroom \xB7 Gent",
    radius: 8
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 0,
      paddingTop: 56,
      paddingBottom: 0
    }
  }, /*#__PURE__*/React.createElement(ClaimBalk, {
    dark: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4
    }
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '90px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 72,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    eyebrow: "Wie wij zijn",
    titel: "Belgisch vakmanschap, generatie na generatie.",
    max: "18ch"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16.5,
      lineHeight: 1.75,
      color: 'var(--text-body)',
      margin: '24px 0 0',
      maxWidth: '56ch'
    }
  }, "Poortland groeide van een klein smederijatelier tot een gespecialiseerde maker van architecturale poorten. Wat onveranderd bleef, is de overtuiging dat een toegang met de hand hoort te worden gemaakt, afgestemd op de woning en gebouwd om te blijven."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16.5,
      lineHeight: 1.75,
      color: 'var(--text-body)',
      margin: '18px 0 0',
      maxWidth: '56ch'
    }
  }, "Wij werken voor villa eigenaars, renovatieklanten en eigenaars van landelijke en moderne woningen, en zijn een betrouwbare uitvoerende partner voor architecten, tuinarchitecten en aannemers.")), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: "corten",
    ratio: "4 / 5",
    slats: 7,
    label: "Smeedwerk \xB7 detail",
    radius: 8,
    zoom: true
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '90px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    dark: true,
    align: "center",
    eyebrow: "Atelier en vakmanschap",
    titel: "Hoe een Poortland poort ontstaat.",
    intro: "Geen import, maar maatwerk onder \xE9\xE9n dak. Van de eerste tekening tot de laatste afwerking blijft elke stap in eigen handen."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 1,
      marginTop: 48,
      background: 'var(--line-on-dark-soft)',
      border: '1px solid var(--line-on-dark-soft)'
    }
  }, vakmanschap.map(([t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: t,
    delay: i % 3 * 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--forest-900)',
      padding: '30px 30px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 25,
      color: 'var(--stone-100)',
      marginBottom: 8
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14.5,
      lineHeight: 1.65,
      color: 'var(--text-on-dark-muted)',
      margin: 0
    }
  }, d))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 24,
      marginTop: 56
    }
  }, cijfers.map(([n, l], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: l,
    delay: i * 70
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 50,
      color: 'var(--stone-100)',
      lineHeight: 1
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 10.5,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--text-on-dark-muted)',
      marginTop: 10
    }
  }, l))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '90px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '0.9fr 1.1fr',
      gap: 64,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(GateImage, {
    tone: "morning",
    ratio: "4 / 3",
    slats: 9,
    label: "Plaatsing \xB7 ter plaatse",
    radius: 8,
    zoom: true
  })), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement(SectieKop, {
    eyebrow: "Service na verkoop",
    titel: "Zekerheid op lange termijn.",
    max: "18ch"
  }), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: '24px 0 0',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, ['Poortland blijft bereikbaar na de plaatsing.', 'Service is voor ons een onderdeel van kwaliteit.', 'Onderhoud en herstellingen worden professioneel opgevolgd.', 'Automatisatie houden wij betrouwbaar in gebruik.'].map(t => /*#__PURE__*/React.createElement("li", {
    key: t,
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)',
      fontFamily: 'var(--font-display)',
      fontSize: 16,
      flex: '0 0 auto'
    }
  }, "\u2014"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      lineHeight: 1.55,
      color: 'var(--text-body)'
    }
  }, t))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '84px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(AbEyebrow, {
    dark: true,
    style: {
      marginBottom: 18
    }
  }, "Showroom"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 44,
      color: 'var(--stone-100)',
      margin: '0 auto 18px',
      maxWidth: '20ch',
      lineHeight: 1.08
    }
  }, "Ervaar de materialen van dichtbij."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      maxWidth: '50ch',
      margin: '0 auto 32px'
    }
  }, "In onze showroom in Gent ziet en voelt u de materialen, afwerkingen en bewegingen. Een bezoek gebeurt op afspraak, zodat wij rustig de tijd voor u nemen."), /*#__PURE__*/React.createElement(AbButton, {
    variant: "primary",
    size: "lg",
    arrow: true,
    onClick: () => onNav('contact')
  }, "Bezoek onze showroom")))), /*#__PURE__*/React.createElement(CTASectie, {
    onNav: onNav,
    dark: false
  }));
}
window.AboutNL = AboutNL;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website-nl/About-nl.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website-nl/Collection-nl.jsx
try { (() => {
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
  const materialen = ['Alle', 'Hout', 'Aluminium', 'Cortenstaal', 'Staal en hout', 'Smeedijzer'];
  const types = ['Alle', 'Schuifpoort', 'Draaipoort', 'Hekwerk'];
  const [mat, setMat] = React.useState('Alle');
  const [type, setType] = React.useState('Alle');
  const shown = PROJECTEN.filter(p => (mat === 'Alle' || p.materiaal === mat) && (type === 'Alle' || p.poorttype === type));
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
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website-nl/Collection-nl.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website-nl/Contact-nl.jsx
try { (() => {
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
  }, "\u25BE")));
}
function ContactNL({
  onNav
}) {
  const {
    Reveal
  } = window;
  const [sent, setSent] = React.useState(false);
  const [type, setType] = React.useState('');
  const [akkoord, setAkkoord] = React.useState(false);
  const [bestand, setBestand] = React.useState('');
  const typeOpties = [{
    value: '',
    label: 'Kies een type aanvraag'
  }, {
    value: 'nieuwe-poort',
    label: 'Nieuwe poort'
  }, {
    value: 'hekwerk',
    label: 'Hekwerk'
  }, {
    value: 'automatisatie',
    label: 'Automatisatie'
  }, {
    value: 'onderhoud',
    label: 'Onderhoud of service'
  }, {
    value: 'showroom',
    label: 'Showroombezoek'
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
  }, "Vertel kort iets over uw woning, de opening en het gevoel dat u zoekt. Wij nemen persoonlijk contact op en plannen een adviesgesprek met plaatsbezoek en opmeting."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 42,
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, [['Atelier en showroom', 'Dok Noord 4, 9000 Gent'], ['Telefoon', '+32 9 224 18 70'], ['Email', 'hallo@poortland.be'], ['Openingsuren', 'Open op afspraak, maandag tot zaterdag']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
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
      color: 'var(--stone-200)'
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
    src: "../../assets/mono-on-dark.png",
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
  }, "Uw aanvraag is bij het atelier."), /*#__PURE__*/React.createElement("p", {
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
      setType('');
      setAkkoord(false);
      setBestand('');
    }
  }, "Nieuwe aanvraag"))) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      if (!akkoord) return;
      setSent(true);
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Type aanvraag",
    value: type,
    onChange: e => setType(e.target.value),
    opties: typeOpties
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(CoInput, {
    label: "Naam",
    dark: true,
    placeholder: "Uw naam",
    required: true
  }), /*#__PURE__*/React.createElement(CoInput, {
    label: "Email",
    dark: true,
    type: "email",
    placeholder: "u@voorbeeld.be",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(CoInput, {
    label: "Telefoon",
    dark: true,
    type: "tel",
    placeholder: "+32 ..."
  }), /*#__PURE__*/React.createElement(CoInput, {
    label: "Gemeente",
    dark: true,
    placeholder: "bv. Knokke Heist"
  })), /*#__PURE__*/React.createElement(CoInput, {
    label: "Omschrijving van uw project",
    dark: true,
    as: "textarea",
    placeholder: "De opening is ongeveer 4 meter, een schuifpoort voor de oprit ..."
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Gewenste timing",
    value: '',
    onChange: () => {},
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
  }, "Kies bestand \u2197"), /*#__PURE__*/React.createElement("input", {
    type: "file",
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
    onClick: () => setAkkoord(!akkoord),
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
  }, "Ik ga akkoord met de verwerking van mijn gegevens om mijn aanvraag te behandelen, volgens het privacybeleid.")), /*#__PURE__*/React.createElement("div", {
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
  }, "Vrijblijvend \xB7 antwoord binnen twee werkdagen"), /*#__PURE__*/React.createElement(CoButton, {
    variant: "primary",
    arrow: true,
    as: "button",
    type: "submit",
    disabled: !akkoord
  }, "Verstuur aanvraag"))))))));
}
window.ContactNL = ContactNL;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website-nl/Contact-nl.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website-nl/Home-nl.jsx
try { (() => {
/* Poortland — Nederlandse website. Homepage. */
const {
  Button: HButton,
  Tag: HTag,
  Eyebrow: HEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function HomeNL({
  onNav
}) {
  const {
    GateImage,
    Reveal,
    ClaimBalk,
    FAQ,
    CTASectie,
    SectieKop
  } = window;
  const {
    PROJECTEN,
    PRODUCTEN,
    WERKWIJZE,
    HOME_FAQ,
    ADVIES
  } = window;
  const uitgelicht = PROJECTEN.filter(p => p.uitgelicht).slice(0, 3);
  const routes = [['houten', 'Houten poorten', 'Warm en tijdloos', 'media/houten-poort.png'], ['metalen', 'Stalen poorten', 'Sterk en strak', 'media/stalen-poort.png'], ['aluminium', 'Aluminium poorten', 'Strak en onderhoudsarm', 'media/aluminium-poort.png'], ['staalhout', 'Combinatie staal en hout', 'Kracht en warmte', 'media/staal-hout.png']];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '72px 44px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.05fr 0.95fr',
      gap: 60,
      alignItems: 'center',
      paddingBottom: 64
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(HEyebrow, {
    dark: true,
    style: {
      marginBottom: 22
    }
  }, "Toegangspoorten \xB7 Belgi\xEB"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 72,
      lineHeight: 1.02,
      letterSpacing: '-0.01em',
      color: 'var(--stone-100)',
      margin: 0
    }
  }, "Handgemaakte poorten en hekwerken op maat.")), /*#__PURE__*/React.createElement(Reveal, {
    delay: 120
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 19,
      lineHeight: 1.6,
      color: 'var(--stone-300)',
      maxWidth: '48ch',
      margin: '26px 0 34px'
    }
  }, "Poortland ontwerpt, maakt en plaatst architecturale poorten en hekwerken voor woningen waar uitstraling, veiligheid en afwerking samenkomen."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(HButton, {
    variant: "primary",
    arrow: true,
    onClick: () => onNav('contact')
  }, "Plan een adviesgesprek"), /*#__PURE__*/React.createElement(HButton, {
    variant: "ghost",
    dark: true,
    arrow: true,
    onClick: () => onNav('realisaties')
  }, "Ontdek onze realisaties")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 44,
      marginTop: 54
    }
  }, [['1992', 'Sinds'], ['100%', 'Handgemaakt'], ['320+', 'Woningen']].map(([n, l]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 34,
      color: 'var(--stone-100)',
      lineHeight: 1
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 10,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--text-on-dark-muted)',
      marginTop: 7
    }
  }, l)))))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 8,
      overflow: 'hidden',
      position: 'relative',
      aspectRatio: '3 / 2',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "media/hero.png",
    alt: "Handgemaakte poort van Poortland in hout en staal",
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
      background: 'linear-gradient(180deg, rgba(15,22,15,0) 55%, rgba(15,22,15,0.55) 100%)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 16,
      bottom: 14,
      fontFamily: 'var(--font-label)',
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'rgba(236,227,210,0.92)'
    }
  }, "Handgemaakt in Belgi\xEB")))), /*#__PURE__*/React.createElement(ClaimBalk, {
    dark: true
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '92px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(HEyebrow, {
    style: {
      marginBottom: 20
    }
  }, "Over Poortland"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: 34,
      lineHeight: 1.32,
      color: 'var(--text-heading)',
      margin: 0,
      letterSpacing: '-0.005em'
    }
  }, "Poortland maakt toegangspoorten en hekwerken op maat voor woningen waar afwerking, veiligheid en uitstraling ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: 'var(--accent)'
    }
  }, "even belangrijk"), " zijn. Geen importproduct, maar Belgisch handwerk dat past bij de woning, de omgeving en het dagelijks gebruik.")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '90px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 40,
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(SectieKop, {
    dark: true,
    eyebrow: "Wat wij maken",
    titel: "Poorten, hekwerken en automatisatie.",
    max: "16ch"
  }), /*#__PURE__*/React.createElement(HButton, {
    variant: "secondary",
    dark: true,
    onClick: () => onNav('product', {
      productKey: 'houten'
    })
  }, "Alle poorten"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 18
    }
  }, routes.map(([key, naam, sub, img], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: key,
    delay: i * 80
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('product', {
      productKey: key
    }),
    style: {
      width: '100%',
      textAlign: 'left',
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--line-on-dark-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pl-zoom-wrap",
    style: {
      position: 'relative',
      aspectRatio: '3 / 2',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    className: "pl-zoom-img",
    src: img,
    alt: naam,
    loading: "lazy",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      transition: 'transform 620ms var(--ease-out)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, rgba(15,22,15,0) 52%, rgba(15,22,15,0.55) 100%)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 14,
      bottom: 12,
      fontFamily: 'var(--font-label)',
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'rgba(236,227,210,0.86)'
    }
  }, naam)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 18px 22px',
      background: 'var(--forest-850)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      color: 'var(--stone-100)',
      lineHeight: 1.1
    }
  }, naam), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-on-dark-muted)',
      marginTop: 6
    }
  }, sub, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)'
    }
  }, "\u2197")))))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '92px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 40,
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(SectieKop, {
    eyebrow: "Uitgelichte realisaties",
    titel: "Elke poort heeft een unieke aanpak.",
    max: "16ch"
  }), /*#__PURE__*/React.createElement(HButton, {
    variant: "secondary",
    onClick: () => onNav('realisaties')
  }, "Alle realisaties"))), /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(window.FotoBanner, {
    onNav: onNav,
    fotos: [{
      src: 'media/realisatie-metaal-1.jpeg',
      label: 'Smeedijzer · landelijke woning'
    }, {
      src: 'media/realisatie-hout-2.jpeg',
      label: 'Hout · moderne woning'
    }, {
      src: 'media/realisatie-alu-1.jpeg',
      label: 'Aluminium · schuifpoort'
    }, {
      src: 'media/realisatie-metaal-2.jpeg',
      label: 'Smeedijzer · draaipoort'
    }, {
      src: 'media/realisatie-hout-1.jpeg',
      label: 'Hout · schuifpoort'
    }]
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      padding: '0 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      alignItems: 'stretch',
      minHeight: 540
    }
  }, /*#__PURE__*/React.createElement(Reveal, {
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '90px 56px 90px 0'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(HEyebrow, {
    dark: true,
    style: {
      marginBottom: 18
    }
  }, "Handwerk uit Belgi\xEB"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 46,
      color: 'var(--stone-100)',
      margin: 0,
      lineHeight: 1.06,
      letterSpacing: '-0.01em'
    }
  }, "Geen import,", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: 'var(--accent)'
    }
  }, "maar maatwerk"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      maxWidth: '46ch',
      margin: '22px 0 28px'
    }
  }, "Elke poort van Poortland wordt gemaakt met aandacht voor materiaal, verhouding en afwerking. Geen importoplossing, maar maatwerk dat past bij de woning, de omgeving en het dagelijks gebruik."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      marginBottom: 32
    }
  }, [['Eigen atelier', 'Snijden, lassen en afwerken onder één dak in Gent.'], ['Eigen plaatsers', 'Geen onderaanneming, wel onze eigen techniekers ter plaatse.'], ['Duurzame materialen', 'Eik, aluminium, staal en cortenstaal van hoge kwaliteit.']].map(([t, d]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)',
      fontFamily: 'var(--font-display)',
      fontSize: 16
    }
  }, "\u2014"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--stone-100)'
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      color: 'var(--text-on-dark-muted)',
      marginTop: 2
    }
  }, d))))), /*#__PURE__*/React.createElement(HButton, {
    variant: "ghost",
    dark: true,
    arrow: true,
    onClick: () => onNav('atelier')
  }, "Ontdek het atelier"))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 100,
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'stretch',
      width: '100%',
      padding: '40px 0 40px 0',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: "corten",
    ratio: "auto",
    label: "Atelier \xB7 Gent",
    radius: 8,
    slats: 7,
    zoom: true
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '90px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '0.85fr 1.15fr',
      gap: 60,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    dark: true,
    eyebrow: "Materialen en afwerking",
    titel: "Vier materialen, eindeloos verfijnd.",
    max: "14ch",
    intro: "Elke poort begint als een tekening en eindigt als \xE9\xE9n gelast object. Geen catalogus, geen twee dezelfde."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 14
    }
  }, [['Cortenstaal', 'Levende, verkleurende huid'], ['Aluminium', 'Geborsteld en gepoederlakt'], ['Eik en hout', 'Warme, massieve invulling'], ['Smeedstaal', 'Handgesmede profielen']].map(([m, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: m,
    delay: i * 70
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--line-on-dark-soft)',
      borderRadius: 'var(--radius-sm)',
      padding: '22px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      color: 'var(--stone-100)'
    }
  }, m), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-on-dark-muted)',
      marginTop: 6
    }
  }, d))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '92px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    align: "center",
    eyebrow: "Werkwijze",
    titel: "Van eerste advies tot perfecte plaatsing.",
    intro: "Een poort op maat vraagt meer dan een mooie tekening. Daarom start elk project met persoonlijk advies, een plaatsbezoek en een nauwkeurige opmeting."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 1,
      marginTop: 48,
      background: 'var(--line-on-light)',
      border: '1px solid var(--line-on-light)'
    }
  }, WERKWIJZE.map(([n, t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: n,
    delay: i % 3 * 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)',
      padding: '30px 28px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 38,
      color: 'var(--accent)',
      lineHeight: 0.9,
      marginBottom: 16
    }
  }, n), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 22,
      color: 'var(--text-heading)',
      margin: '0 0 8px'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      lineHeight: 1.6,
      color: 'var(--text-muted)',
      margin: 0
    }
  }, d))))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 40
    }
  }, /*#__PURE__*/React.createElement(HButton, {
    variant: "secondary",
    arrow: true,
    onClick: () => onNav('werkwijze')
  }, "Bekijk de volledige werkwijze")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '84px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(HEyebrow, {
    dark: true,
    style: {
      marginBottom: 18
    }
  }, "Service na verkoop"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontStyle: 'italic',
      fontSize: 32,
      color: 'var(--stone-100)',
      margin: '0 auto 14px',
      maxWidth: '26ch',
      lineHeight: 1.3
    }
  }, "\u201CEen poort is de eerste indruk van het huis. Wij zorgen dat die jarenlang klopt.\u201D"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      maxWidth: '52ch',
      margin: '0 auto'
    }
  }, "Poortland blijft bereikbaar na de plaatsing. Onderhoud en herstellingen worden professioneel opgevolgd, en automatisatie houden wij betrouwbaar in gebruik. Zekerheid op lange termijn hoort bij kwaliteit.")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '92px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 38,
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(SectieKop, {
    eyebrow: "Adviescentrum",
    titel: "Helder advies voor uw keuze.",
    max: "16ch"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, ADVIES.slice(0, 3).map(([titel, cat, sub], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: titel,
    delay: i * 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-md)',
      padding: '26px 26px 28px',
      height: '100%',
      background: 'var(--surface-card)',
      transition: 'box-shadow var(--dur) var(--ease-out), transform var(--dur) var(--ease-out)',
      cursor: 'pointer'
    },
    onMouseEnter: e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      e.currentTarget.style.transform = 'translateY(-3px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'none';
    },
    onClick: () => onNav('contact')
  }, /*#__PURE__*/React.createElement(HEyebrow, {
    style: {
      marginBottom: 14
    }
  }, cat), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 24,
      color: 'var(--text-heading)',
      margin: '0 0 10px',
      lineHeight: 1.18
    }
  }, titel), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      lineHeight: 1.6,
      color: 'var(--text-muted)',
      margin: 0
    }
  }, sub))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper-2)',
      padding: '92px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    align: "center",
    eyebrow: "Veelgestelde vragen",
    titel: "Wat klanten vaak vragen."
  })), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 44
    }
  }, /*#__PURE__*/React.createElement(FAQ, {
    items: HOME_FAQ
  }))))), /*#__PURE__*/React.createElement(CTASectie, {
    onNav: onNav,
    dark: true
  }));
}

/* Gedeelde realisatiekaart */
function ProjectKaart({
  project: p,
  onNav
}) {
  const {
    GateImage
  } = window;
  const {
    Eyebrow: KEyebrow
  } = window.PoortlandDesignSystem_6dcc8b;
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('project', {
      project: p
    }),
    style: {
      textAlign: 'left',
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--line-on-light-soft)',
      background: 'var(--surface-card)',
      transition: 'box-shadow var(--dur) var(--ease-out), transform var(--dur) var(--ease-out)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      e.currentTarget.style.transform = 'translateY(-3px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'none';
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: p.tone,
    ratio: "4 / 3",
    label: p.materiaal,
    radius: 0,
    zoom: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '17px 19px 21px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement(KEyebrow, null, p.regio), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      color: 'var(--text-faint)'
    }
  }, p.jaar)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      color: 'var(--text-heading)',
      lineHeight: 1.1,
      marginTop: 8
    }
  }, p.naam), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-muted)',
      marginTop: 6
    }
  }, p.poorttype, " \xB7 ", p.span))));
}
Object.assign(window, {
  HomeNL,
  ProjectKaart
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website-nl/Home-nl.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website-nl/Process-nl.jsx
try { (() => {
/* Poortland — Nederlandse website. Werkwijze. */
const {
  Button: WeButton,
  Eyebrow: WeEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function ProcessNL({
  onNav
}) {
  const {
    GateImage,
    Reveal,
    CTASectie,
    SectieKop
  } = window;
  const {
    WERKWIJZE
  } = window;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '72px 44px 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 0.82fr',
      gap: 60,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(WeEyebrow, {
    dark: true,
    style: {
      marginBottom: 20
    }
  }, "Werkwijze"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 62,
      color: 'var(--stone-100)',
      margin: 0,
      lineHeight: 1.02,
      letterSpacing: '-0.01em'
    }
  }, "Van eerste advies tot ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: 'var(--accent)'
    }
  }, "perfecte"), " plaatsing."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 18,
      lineHeight: 1.65,
      color: 'var(--stone-300)',
      maxWidth: '48ch',
      marginTop: 24
    }
  }, "Een poort op maat vraagt meer dan een mooie tekening. Daarom start elk project met persoonlijk advies, een plaatsbezoek en een nauwkeurige opmeting. Daarna volgt een voorstel dat rekening houdt met stijl, gebruik, veiligheid en afwerking.")), /*#__PURE__*/React.createElement(Reveal, {
    delay: 90
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: "corten",
    ratio: "4 / 5",
    slats: 6,
    label: "Atelier \xB7 Gent",
    radius: 8,
    zoom: true
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '88px 44px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto'
    }
  }, WERKWIJZE.map(([n, t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: n,
    delay: i % 2 * 70
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '120px 1fr',
      gap: 40,
      alignItems: 'start',
      padding: '36px 0',
      borderTop: '1px solid var(--line-on-light)',
      borderBottom: i === WERKWIJZE.length - 1 ? '1px solid var(--line-on-light)' : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 56,
      color: 'var(--accent)',
      lineHeight: 0.9
    }
  }, n), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 30,
      color: 'var(--text-heading)',
      margin: 0
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      lineHeight: 1.7,
      color: 'var(--text-body)',
      margin: '12px 0 0',
      maxWidth: '62ch'
    }
  }, d))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '40px 44px 90px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--forest-900)',
      borderRadius: 'var(--radius-lg)',
      padding: '48px 52px',
      color: 'var(--text-on-dark)',
      display: 'grid',
      gridTemplateColumns: '0.7fr 1.3fr',
      gap: 48,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 64,
      color: 'var(--stone-100)',
      lineHeight: 1
    }
  }, "6 \u2014 8"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--accent)',
      marginTop: 10
    }
  }, "weken gemiddeld")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(WeEyebrow, {
    dark: true,
    style: {
      marginBottom: 12
    }
  }, "Wat u mag verwachten"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16.5,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      margin: 0,
      maxWidth: '52ch'
    }
  }, "Er is altijd een plaatsbezoek en een adviesgesprek met opmeting. Het traject van eerste contact tot plaatsing duurt gemiddeld zes tot acht weken. Wij bevestigen een realistische planning bij het voorstel, en houden u onderweg op de hoogte.")))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '84px 44px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontStyle: 'italic',
      fontSize: 34,
      color: 'var(--stone-100)',
      maxWidth: '26ch',
      margin: '0 auto 28px',
      lineHeight: 1.25
    }
  }, "\u201CEen poort op maat begint bij luisteren. Pas daarna pakken wij het potlood.\u201D"), /*#__PURE__*/React.createElement(WeEyebrow, {
    dark: true,
    tone: "muted",
    style: {
      marginBottom: 34
    }
  }, "Het team van Poortland \xB7 Gent"), /*#__PURE__*/React.createElement(WeButton, {
    variant: "primary",
    size: "lg",
    arrow: true,
    onClick: () => onNav('contact')
  }, "Plan een adviesgesprek"))), /*#__PURE__*/React.createElement(CTASectie, {
    onNav: onNav,
    dark: false
  }));
}
window.ProcessNL = ProcessNL;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website-nl/Process-nl.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website-nl/Product-nl.jsx
try { (() => {
/* Poortland — Nederlandse website. Productpagina (poorttype). */
const {
  Button: PrButton,
  Tag: PrTag,
  Eyebrow: PrEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function ProductNL({
  onNav,
  productKey
}) {
  const {
    GateImage,
    Reveal,
    FAQ,
    CTASectie,
    SectieKop,
    ProjectKaart
  } = window;
  const {
    PRODUCTEN,
    PRODUCT_VOLGORDE,
    PROJECTEN,
    WERKWIJZE
  } = window;
  const key = PRODUCTEN[productKey] ? productKey : 'houten';
  const p = PRODUCTEN[key];
  const relevant = (p.materiaalFilter ? PROJECTEN.filter(x => x.materiaal === p.materiaalFilter) : PROJECTEN).slice(0, 3);
  const shownProjects = relevant.length >= 3 ? relevant : PROJECTEN.slice(0, 3);
  const procesKort = WERKWIJZE.slice(0, 4);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '48px 44px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      marginBottom: 40
    }
  }, PRODUCT_VOLGORDE.map(k => {
    const active = k === key;
    return /*#__PURE__*/React.createElement("button", {
      key: k,
      onClick: () => onNav('product', {
        productKey: k
      }),
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
        color: active ? 'var(--forest-950)' : 'var(--text-on-dark-muted)',
        border: `1px solid ${active ? 'var(--bronze-500)' : 'var(--line-on-dark-soft)'}`,
        transition: 'all var(--dur) var(--ease-out)'
      }
    }, PRODUCTEN[k].naam);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 56,
      alignItems: 'center',
      paddingBottom: 56
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(PrEyebrow, {
    dark: true,
    style: {
      marginBottom: 18
    }
  }, p.kicker, " \xB7 op maat"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 60,
      color: 'var(--stone-100)',
      margin: 0,
      lineHeight: 1.03,
      letterSpacing: '-0.01em'
    }
  }, p.naam), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 18,
      lineHeight: 1.6,
      color: 'var(--stone-300)',
      maxWidth: '46ch',
      margin: '22px 0 32px'
    }
  }, p.intro), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(PrButton, {
    variant: "primary",
    arrow: true,
    onClick: () => onNav('contact')
  }, "Plan een adviesgesprek"), /*#__PURE__*/React.createElement(PrButton, {
    variant: "ghost",
    dark: true,
    arrow: true,
    onClick: () => onNav('realisaties')
  }, "Bekijk realisaties"))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 90
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      boxShadow: 'var(--shadow-lg)',
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: p.tone,
    ratio: "4 / 3",
    label: p.naam,
    radius: 8,
    zoom: true,
    slats: key === 'hekwerk' ? 14 : 9
  })))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '88px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.1fr 0.9fr',
      gap: 72,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(PrEyebrow, {
    style: {
      marginBottom: 16
    }
  }, "Het materiaal"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: 28,
      lineHeight: 1.35,
      color: 'var(--text-heading)',
      margin: 0
    }
  }, p.lead)), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper-2)',
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-md)',
      padding: '30px 30px 32px'
    }
  }, /*#__PURE__*/React.createElement(PrEyebrow, {
    style: {
      marginBottom: 18
    }
  }, "Voor wie"), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, p.voorWie.map((v, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)',
      fontFamily: 'var(--font-display)',
      fontSize: 16,
      flex: '0 0 auto'
    }
  }, "\u2014"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15.5,
      lineHeight: 1.55,
      color: 'var(--text-body)'
    }
  }, v)))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '88px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    dark: true,
    eyebrow: "Belangrijkste voordelen",
    titel: "Waarom dit type.",
    max: "14ch"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 1,
      marginTop: 44,
      background: 'var(--line-on-dark-soft)',
      border: '1px solid var(--line-on-dark-soft)'
    }
  }, p.voordelen.map(([t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: t,
    delay: i % 2 * 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--forest-900)',
      padding: '30px 32px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 26,
      color: 'var(--stone-100)',
      marginBottom: 8
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      lineHeight: 1.65,
      color: 'var(--text-on-dark-muted)',
      margin: 0,
      maxWidth: '46ch'
    }
  }, d))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '88px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 56
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-md)',
      padding: '32px 32px 36px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(PrEyebrow, {
    style: {
      marginBottom: 20
    }
  }, "Materialen"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10
    }
  }, p.materialen.map(m => /*#__PURE__*/React.createElement("span", {
    key: m,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-heading)',
      padding: '9px 16px',
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-paper-2)'
    }
  }, m))))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-md)',
      padding: '32px 32px 36px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(PrEyebrow, {
    style: {
      marginBottom: 20
    }
  }, "Afwerkingsmogelijkheden"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10
    }
  }, p.afwerking.map(m => /*#__PURE__*/React.createElement("span", {
    key: m,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-heading)',
      padding: '9px 16px',
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-paper-2)'
    }
  }, m))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper-2)',
      padding: '88px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    eyebrow: "Mogelijke stijlen",
    titel: "E\xE9n type, vele beelden.",
    max: "16ch"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24,
      marginTop: 44
    }
  }, p.stijlen.map(([t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: t,
    delay: i * 80
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(GateImage, {
    tone: p.tone,
    ratio: "4 / 3",
    label: t,
    radius: 6,
    zoom: true,
    slats: 6 + i * 3
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 23,
      color: 'var(--text-heading)',
      margin: '16px 0 6px'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      lineHeight: 1.6,
      color: 'var(--text-muted)',
      margin: 0,
      maxWidth: '40ch'
    }
  }, d))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '88px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 40,
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(SectieKop, {
    eyebrow: "Van advies tot plaatsing",
    titel: "Hoe uw poort tot stand komt.",
    max: "16ch"
  }), /*#__PURE__*/React.createElement(PrButton, {
    variant: "secondary",
    arrow: true,
    onClick: () => onNav('werkwijze')
  }, "Volledige werkwijze"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 1,
      background: 'var(--line-on-light)',
      border: '1px solid var(--line-on-light)'
    }
  }, procesKort.map(([n, t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: n,
    delay: i * 70
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)',
      padding: '28px 24px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 32,
      color: 'var(--accent)',
      lineHeight: 0.9,
      marginBottom: 14
    }
  }, n), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 20,
      color: 'var(--text-heading)',
      margin: '0 0 7px',
      lineHeight: 1.15
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      lineHeight: 1.55,
      color: 'var(--text-muted)',
      margin: 0
    }
  }, d))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '88px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 38,
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(SectieKop, {
    dark: true,
    eyebrow: "Relevante realisaties",
    titel: "Dit type, gerealiseerd.",
    max: "16ch"
  }), /*#__PURE__*/React.createElement(PrButton, {
    variant: "secondary",
    dark: true,
    onClick: () => onNav('realisaties')
  }, "Alle realisaties"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, shownProjects.map((pr, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: pr.id,
    delay: i * 80
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('project', {
      project: pr
    }),
    style: {
      textAlign: 'left',
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: pr.tone,
    ratio: "4 / 3",
    label: pr.materiaal,
    radius: 6,
    zoom: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 21,
      color: 'var(--stone-100)',
      marginTop: 14
    }
  }, pr.naam), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-on-dark-muted)',
      marginTop: 4
    }
  }, pr.regio, " \xB7 ", pr.poorttype))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper-2)',
      padding: '88px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectieKop, {
    align: "center",
    eyebrow: "Veelgestelde vragen",
    titel: `Over ${p.naam.toLowerCase()}.`
  })), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 44
    }
  }, /*#__PURE__*/React.createElement(FAQ, {
    items: p.faq
  }))))), /*#__PURE__*/React.createElement(CTASectie, {
    onNav: onNav,
    dark: true
  }));
}
window.ProductNL = ProductNL;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website-nl/Product-nl.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website-nl/ProjectDetail-nl.jsx
try { (() => {
/* Poortland — Nederlandse website. Projectdetailpagina. */
const {
  Button: DtButton,
  Tag: DtTag,
  Eyebrow: DtEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function ProjectDetailNL({
  project,
  onNav
}) {
  const {
    GateImage,
    Reveal,
    CTASectie
  } = window;
  const {
    PROJECTEN
  } = window;
  const p = project || PROJECTEN[0];
  const meer = PROJECTEN.filter(x => x.id !== p.id).slice(0, 3);
  const specs = [['Regio', p.regio], ['Type woning', p.woningtype], ['Materiaal', p.materiaal], ['Poorttype', p.poorttype], ['Stijl', p.stijl], ['Automatisatie', p.automatisatie], ['Breedte', p.span], ['Opgeleverd', p.jaar]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      padding: '36px 44px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('realisaties'),
    style: {
      background: 'none',
      border: 0,
      cursor: 'pointer',
      padding: 0,
      marginBottom: 22,
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-on-dark-muted)'
    }
  }, "\u2190 Terug naar realisaties"), /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(GateImage, {
    tone: p.tone,
    ratio: "21 / 9",
    slats: 13,
    label: `${p.naam} · ${p.regio}`,
    radius: 8
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '52px 44px 84px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.25fr 0.75fr',
      gap: 64
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(DtEyebrow, {
    style: {
      marginBottom: 16
    }
  }, p.regio, " \xB7 ", p.jaar), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 54,
      color: 'var(--text-heading)',
      margin: 0,
      letterSpacing: '-0.01em',
      lineHeight: 1.03
    }
  }, p.naam), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 20,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(DtTag, {
    variant: "solid"
  }, p.materiaal), /*#__PURE__*/React.createElement(DtTag, null, p.poorttype), /*#__PURE__*/React.createElement(DtTag, {
    variant: "olive"
  }, p.woningtype)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 36
    }
  }, /*#__PURE__*/React.createElement(DtEyebrow, {
    style: {
      marginBottom: 12
    }
  }, "De vraag van de klant"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.7,
      color: 'var(--text-body)',
      margin: 0,
      maxWidth: '58ch'
    }
  }, p.vraag)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 30
    }
  }, /*#__PURE__*/React.createElement(DtEyebrow, {
    style: {
      marginBottom: 12
    }
  }, "De oplossing van Poortland"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.7,
      color: 'var(--text-body)',
      margin: 0,
      maxWidth: '58ch'
    }
  }, p.oplossing)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 30
    }
  }, /*#__PURE__*/React.createElement(DtEyebrow, {
    style: {
      marginBottom: 12
    }
  }, "Details van afwerking"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      lineHeight: 1.7,
      color: 'var(--text-muted)',
      margin: 0,
      maxWidth: '58ch'
    }
  }, p.afwerking, " Gesneden, gelast en met de hand afgewerkt in ons atelier in Gent, en daarna ter plaatse geplaatst met verdoken automatisatie."))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("aside", null, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }
  }, specs.map(([k, v], i) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 18,
      padding: '14px 18px',
      borderBottom: i < specs.length - 1 ? '1px solid var(--line-on-light-soft)' : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-faint)'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-heading)',
      fontWeight: 500,
      textAlign: 'right'
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(DtButton, {
    variant: "primary",
    arrow: true,
    onClick: () => onNav('contact')
  }, "Vergelijkbaar project bespreken"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '52px auto 0'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(DtEyebrow, {
    style: {
      marginBottom: 18
    }
  }, "Fotogalerij"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: p.tone,
    ratio: "3 / 2",
    slats: 11,
    label: "Vooraanzicht",
    radius: 6,
    zoom: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateRows: '1fr 1fr',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: "stone",
    ratio: "auto",
    slats: 5,
    label: "Detail \xB7 profiel",
    radius: 6,
    zoom: true
  }), /*#__PURE__*/React.createElement(GateImage, {
    tone: "corten",
    ratio: "auto",
    slats: 7,
    label: "Detail \xB7 afwerking",
    radius: 6,
    zoom: true
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 820,
      margin: '64px auto 0',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontStyle: 'italic',
      fontSize: 28,
      lineHeight: 1.35,
      color: 'var(--text-heading)',
      margin: 0
    }
  }, "Een toegang die past bij de woning, het landschap en het dagelijks gebruik. Precies dat is maatwerk.")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '78px 44px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(DtEyebrow, {
    dark: true,
    style: {
      marginBottom: 28
    }
  }, "Meer uit het atelier")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, meer.map((m, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: m.id,
    delay: i * 80
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('project', {
      project: m
    }),
    style: {
      textAlign: 'left',
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: m.tone,
    ratio: "4 / 3",
    label: m.materiaal,
    radius: 6,
    zoom: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 21,
      color: 'var(--stone-100)',
      marginTop: 13
    }
  }, m.naam), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-on-dark-muted)',
      marginTop: 4
    }
  }, m.regio, " \xB7 ", m.materiaal))))))), /*#__PURE__*/React.createElement(CTASectie, {
    onNav: onNav,
    dark: false
  }));
}
window.ProjectDetailNL = ProjectDetailNL;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website-nl/ProjectDetail-nl.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website-nl/data-nl.jsx
try { (() => {
/* Poortland — Nederlandse website. Content en data.
   Alle teksten in premium Nederlands. Geen koppelteken, geen slashconstructies. */

/* ----------------------------- Realisaties ----------------------------- */
const PROJECTEN = [{
  id: 'duinhof',
  naam: 'Villa Duinhof',
  regio: 'Knokke Heist',
  materiaal: 'Cortenstaal',
  poorttype: 'Schuifpoort',
  woningtype: 'Moderne villa',
  stijl: 'Strak',
  automatisatie: 'Ja',
  span: '4,2 m',
  jaar: '2025',
  tone: 'corten',
  uitgelicht: true,
  vraag: 'Een ruime oprit aan de kust met zicht op de duinen vroeg om een poort die privacy geeft zonder de woning af te sluiten van het landschap.',
  oplossing: 'Een schuifpoort in cortenstaal met een rustig verticaal ritme. De levende roestlaag verdiept met het zeeklimaat en sluit warm aan bij de gevel in lichte steen.',
  afwerking: 'Natuurlijke cortenpatina, geborstelde randen, verdoken loopwiel.'
}, {
  id: 'lievens',
  naam: 'Maison Lievens',
  regio: 'Gent',
  materiaal: 'Aluminium',
  poorttype: 'Draaipoort',
  woningtype: 'Herenhuis',
  stijl: 'Klassiek verfijnd',
  automatisatie: 'Ja',
  span: '1,2 m',
  jaar: '2025',
  tone: 'morning',
  vraag: 'Een statig herenhuis in het centrum van Gent wenste een voetgangerspoort die discreet en duurzaam was, in lijn met de historische gevel.',
  oplossing: 'Een draaipoort in aluminium met fijne verticale spijlen en een mat gepoederlakte afwerking in dieptegroen. Onderhoudsarm en bestand tegen het stadsklimaat.',
  afwerking: 'Gepoederlakt in fijnstructuur, ingewerkt slot, zachte demping.'
}, {
  id: 'brael',
  naam: 'Hofstede Brael',
  regio: 'Sint Martens Latem',
  materiaal: 'Staal en hout',
  poorttype: 'Schuifpoort',
  woningtype: 'Landelijke woning',
  stijl: 'Landelijk warm',
  automatisatie: 'Ja',
  span: '5,0 m',
  jaar: '2024',
  tone: 'dusk',
  uitgelicht: true,
  vraag: 'Een gerenoveerde hofstede met een lange dreef vroeg om een brede toegang die robuust aanvoelt en toch warmte uitstraalt.',
  oplossing: 'Een schuifpoort met een gelakt stalen frame en een invulling in massieve eik. Het hout brengt warmte, het staal draagt de breedte en de automatisatie.',
  afwerking: 'Geolied eik, mat zwart staal, verdoken automatisatie in de fundering.'
}, {
  id: 'noordkaai',
  naam: 'Huis Noordkaai',
  regio: 'Antwerpen',
  materiaal: 'Aluminium',
  poorttype: 'Draaipoort',
  woningtype: 'Nieuwbouw',
  stijl: 'Strak',
  automatisatie: 'Ja',
  span: '3,6 m',
  jaar: '2024',
  tone: 'stone',
  vraag: 'Een moderne nieuwbouw aan de rand van Antwerpen zocht een dubbele oprijpoort die naadloos aansluit bij de horizontale lijnen van de architectuur.',
  oplossing: 'Een dubbele draaipoort in aluminium met brede horizontale lamellen. De poort volgt de gevelritmiek en sluit vlak af met de carport.',
  afwerking: 'Geborsteld aluminium, gepoederlakt antraciet, lineaire lamellen.'
}, {
  id: 'velden',
  naam: 'Domein Velden',
  regio: 'Leuven',
  materiaal: 'Smeedijzer',
  poorttype: 'Draaipoort',
  woningtype: 'Kasteelhoeve',
  stijl: 'Klassiek',
  automatisatie: 'Ja',
  span: '6,4 m',
  jaar: '2023',
  tone: 'dusk',
  vraag: 'Een historische kasteelhoeve vroeg om een statige toegang die het erfgoed eert en toch dagelijks comfortabel in gebruik is.',
  oplossing: 'Een brede draaipoort in handgesmeed staal met een sober klassiek profiel. Elk onderdeel werd met de hand geforceerd en gesmeed in het atelier.',
  afwerking: 'Handgesmeed staal, mat gelakt, smeedwerk per stuk afgewerkt.'
}, {
  id: 'strandvilla',
  naam: 'Strandvilla Negen',
  regio: 'Oostduinkerke',
  materiaal: 'Cortenstaal',
  poorttype: 'Schuifpoort',
  woningtype: 'Kustvilla',
  stijl: 'Strak',
  automatisatie: 'Ja',
  span: '2,8 m',
  jaar: '2023',
  tone: 'corten',
  vraag: 'Een kustvilla wenste maximale privacy aan de straatzijde zonder de woning gesloten te laten ogen.',
  oplossing: 'Een schuifpoort in cortenstaal met dichte privacylamellen die het zicht breken maar lucht doorlaten. De patina sluit aan bij het duinlandschap.',
  afwerking: 'Cortenstaal met privacylamellen, geborstelde geleiding.'
}, {
  id: 'eiksteen',
  naam: 'Eik en Steen',
  regio: 'Brasschaat',
  materiaal: 'Hout',
  poorttype: 'Draaipoort',
  woningtype: 'Villa',
  stijl: 'Tijdloos warm',
  automatisatie: 'Ja',
  span: '3,2 m',
  jaar: '2025',
  tone: 'dusk',
  uitgelicht: true,
  vraag: 'Een villa in het groen van Brasschaat zocht een warme houten poort die de woning verankert in haar bosrijke omgeving.',
  oplossing: 'Een draaipoort in massieve eik met een verticaal ritme dat de bomen weerspiegelt. Een verdoken stalen kader draagt de bewegende delen onzichtbaar.',
  afwerking: 'Massieve eik, natuurlijk geolied, verdoken stalen kern.'
}, {
  id: 'park',
  naam: 'Park Mechelen',
  regio: 'Mechelen',
  materiaal: 'Aluminium',
  poorttype: 'Hekwerk',
  woningtype: 'Moderne woning',
  stijl: 'Strak',
  automatisatie: 'Deels',
  span: '24 m hekwerk',
  jaar: '2024',
  tone: 'morning',
  vraag: 'Een ruime tuin vroeg om een doorlopend hekwerk met een geïntegreerde poort, in één rustig beeld.',
  oplossing: 'Een hekwerk op maat in aluminium met een geïntegreerde schuifpoort. Hek en poort delen hetzelfde lamelprofiel, zodat de toegang opgaat in het geheel.',
  afwerking: 'Gepoederlakt aluminium, doorlopend lamelprofiel, lijnverlichting.'
}];

/* ----------------------------- Producten ----------------------------- */
/* De productwisselaar toont de poortpagina voor elk type. Houten poorten is uitgewerkt
   als voorbeeldpagina; de andere types delen dezelfde rijke structuur. */
const PRODUCTEN = {
  houten: {
    key: 'houten',
    naam: 'Houten poorten',
    kicker: 'Hout',
    tone: 'dusk',
    materiaalFilter: 'Hout',
    intro: 'Warm, levend en tijdloos. Een houten poort verankert uw woning in haar omgeving en wordt mooier met de jaren.',
    lead: 'Hout is het meest tactiele materiaal dat wij verwerken. Wij kiezen voor duurzame eik en thermisch behandelde houtsoorten, gedragen door een verdoken stalen kern die de poort jarenlang recht en stil houdt.',
    voorWie: ['Villa\u2019s en landelijke woningen die warmte en natuurlijkheid zoeken.', 'Renovaties waar hout aansluit bij gevel, schrijnwerk of omgeving.', 'Woningen in het groen waar de poort moet opgaan in het landschap.'],
    voordelen: [['Warme uitstraling', 'Hout brengt diepte en karakter die geen ander materiaal evenaart.'], ['Levende materie', 'De nerf en de toon verdiepen met de jaren tot een eigen patina.'], ['Stabiele kern', 'Een verdoken stalen kader houdt de poort recht en draagt de automatisatie.'], ['Volledig op maat', 'Elke lat, verhouding en afwerking wordt voor uw opening getekend.']],
    materialen: ['Massieve eik', 'Thermisch verduurzaamd hout', 'Afromezi en hardhout', 'Verdoken stalen kern'],
    afwerking: ['Natuurlijk geolied', 'Mat gelakt op kleur', 'Geborsteld en geloogd', 'Combinatie met staal of inox'],
    stijlen: [['Verticaal ritme', 'Smalle latten in een rustig verticaal patroon. Tijdloos en discreet.'], ['Vlak en dicht', 'Brede planken vlak naast elkaar voor maximale privacy en rust.'], ['Hout en metaal', 'Een houten invulling in een fijn stalen of aluminium kader.']],
    faq: [['Hoeveel onderhoud vraagt een houten poort?', 'Een houten poort vraagt periodiek een onderhoudsbeurt met olie of lak, afhankelijk van houtsoort en oriëntatie. Wij adviseren bij oplevering een ritme en blijven beschikbaar voor de opvolging.'], ['Blijft een houten poort recht?', 'Ja. Wij bouwen elke houten poort op een verdoken stalen kern. Die draagt het gewicht en de beweging, zodat het hout enkel zichtbaar werk doet en stabiel blijft.'], ['Welke houtsoort past het best?', 'Dat hangt af van uw woning, de oriëntatie en het gewenste onderhoud. Eik straalt warmte uit, thermisch hout is bijzonder stabiel. Tijdens het adviesgesprek bekijken wij samen wat past.']]
  },
  metalen: {
    key: 'metalen',
    naam: 'Metalen poorten',
    kicker: 'Staal',
    tone: 'stone',
    materiaalFilter: 'Smeedijzer',
    intro: 'Sterk, strak en bestand tegen de tijd. Een stalen poort geeft uw toegang gewicht en precisie.',
    lead: 'Staal laat ons de fijnste lijnen en de breedste overspanningen maken. Van strak plaatwerk tot handgesmeed profiel, elke poort wordt gelast en afgewerkt als één geheel in ons atelier.',
    voorWie: ['Woningen die kracht, precisie en een lange levensduur zoeken.', 'Brede opritten waar staal de overspanning moeielloos draagt.', 'Klassieke en eigentijdse architectuur die strakke lijnen vraagt.'],
    voordelen: [['Maximale sterkte', 'Staal draagt grote breedtes en blijft strak over de jaren.'], ['Fijne lijnen', 'Dunne profielen en scherpe details die enkel in staal kunnen.'], ['Handgesmeed mogelijk', 'Klassiek smeedwerk per stuk geforceerd en afgewerkt.'], ['Duurzame lak', 'Een gepoederlakte of natte laklaag beschermt jarenlang.']],
    materialen: ['Geborsteld plaatstaal', 'Handgesmeed staal', 'Buisprofielen op maat', 'Inox accenten'],
    afwerking: ['Gepoederlakt op kleur', 'Mat of zijdeglans', 'Gegalvaniseerd als basis', 'Smeedwerk met de hand'],
    stijlen: [['Strak plaatwerk', 'Gesloten of geperforeerde panelen voor een rustig modern beeld.'], ['Verticale spijlen', 'Een klassiek ritme van fijne verticale staven.'], ['Smeedwerk', 'Handgesmede details voor erfgoed en klassieke villa\u2019s.']],
    faq: [['Roest een stalen poort?', 'Niet wanneer hij correct is voorbehandeld en afgewerkt. Wij galvaniseren of gronden elke stalen poort en brengen daarna een duurzame laklaag aan.'], ['Hoe breed kan een stalen poort?', 'Staal draagt ruime overspanningen. Voor brede opritten kiezen wij vaak een schuifpoort in staal, die ook bij grote breedtes stil en stabiel beweegt.'], ['Kan smeedwerk modern ogen?', 'Zeker. Wij vertalen klassiek smeedwerk naar rustige, eigentijdse profielen die passen bij zowel erfgoed als nieuwbouw.']]
  },
  aluminium: {
    key: 'aluminium',
    naam: 'Aluminium poorten',
    kicker: 'Aluminium',
    tone: 'morning',
    materiaalFilter: 'Aluminium',
    intro: 'Onderhoudsarm, licht en strak. Aluminium is de keuze voor wie rust en gemak voorop stelt.',
    lead: 'Aluminium roest niet en vraagt nauwelijks onderhoud. Het materiaal laat strakke lamellen en grote vlakken toe, gepoederlakt in elke gewenste kleur en structuur.',
    voorWie: ['Moderne woningen en nieuwbouw met horizontale lijnen.', 'Wie een onderhoudsarme poort wenst zonder in te boeten op uitstraling.', 'Kustwoningen waar het zeeklimaat extra weerstand vraagt.'],
    voordelen: [['Onderhoudsarm', 'Aluminium roest niet en blijft jarenlang strak en kleurvast.'], ['Licht in gewicht', 'Soepele beweging en minder belasting voor de automatisatie.'], ['Strakke lamellen', 'Horizontale of verticale lamellen voor een rustig modern beeld.'], ['Vrije kleurkeuze', 'Gepoederlakt in elke kleur en structuur die de gevel vraagt.']],
    materialen: ['Geëxtrudeerde lamellen', 'Vlakke panelen', 'Geperforeerd aluminium', 'Inox accenten'],
    afwerking: ['Gepoederlakt fijnstructuur', 'Mat of zijdeglans', 'Houtlook coating', 'Tweekleurig op aanvraag'],
    stijlen: [['Horizontale lamellen', 'Brede lamellen die de horizon van de architectuur volgen.'], ['Vlak en gesloten', 'Een rustig dicht paneel voor maximale privacy.'], ['Lamel en glas', 'Aluminium gecombineerd met glas of een groene invulling.']],
    faq: [['Verkleurt aluminium in de zon?', 'Een kwalitatieve poederlak is uv bestendig en blijft jarenlang kleurvast. Wij werken enkel met coatings die geschikt zijn voor buitengebruik aan zee en in de stad.'], ['Is aluminium sterk genoeg?', 'Voor de meeste woningpoorten zeker. Voor zeer brede overspanningen versterken wij het profiel of kiezen wij voor een schuifuitvoering.'], ['Kan aluminium op hout lijken?', 'Ja. Een houtlook coating geeft de warmte van hout met het gemak van aluminium, zonder periodiek onderhoud.']]
  },
  staalhout: {
    key: 'staalhout',
    naam: 'Combinatie staal en hout',
    kicker: 'Staal en hout',
    tone: 'dusk',
    materiaalFilter: 'Staal en hout',
    intro: 'Het beste van twee materialen. Een stalen kader draagt, een houten invulling verwarmt.',
    lead: 'De combinatie van staal en hout verenigt kracht en warmte. Het staal geeft fijne lijnen en draagt de breedte en de beweging, het hout brengt karakter en tactiliteit.',
    voorWie: ['Woningen die warmte willen zonder de strakheid los te laten.', 'Brede opritten waar staal draagt en hout verzacht.', 'Renovaties die oud en nieuw met elkaar willen verbinden.'],
    voordelen: [['Kracht en warmte', 'Staal draagt en lijnt, hout verzacht en verwarmt.'], ['Brede overspanning', 'Het stalen kader maakt grote breedtes mogelijk.'], ['Contrastrijk', 'Mat staal naast warm hout geeft diepte en karakter.'], ['Volledig op maat', 'Verhouding, ritme en toon worden samen bepaald.']],
    materialen: ['Stalen kader op maat', 'Massieve eik', 'Thermisch hout', 'Inox bevestiging'],
    afwerking: ['Mat zwart staal', 'Geolied hout', 'Tweekleurige combinatie', 'Verdoken bevestiging'],
    stijlen: [['Kader en invulling', 'Een strak stalen kader met een warme houten invulling.'], ['Horizontaal banden', 'Afwisselende banden in staal en hout.'], ['Vlak contrast', 'Een gesloten houten vlak in een fijne stalen lijst.']],
    faq: [['Werkt hout en staal goed samen?', 'Ja, mits correct opgebouwd. Wij scheiden de materialen technisch zodat ze onafhankelijk kunnen werken, en houden het beeld strak en stabiel.'], ['Wat draagt de poort?', 'Het stalen kader draagt het gewicht en de beweging. Het hout is de zichtbare invulling en blijft daardoor stabiel.'], ['Hoeveel onderhoud?', 'Het hout vraagt periodiek olie of lak, het staal nauwelijks. Wij adviseren een ritme bij oplevering.']]
  },
  schuif: {
    key: 'schuif',
    naam: 'Schuifpoorten',
    kicker: 'Poorttype',
    tone: 'corten',
    materiaalFilter: null,
    intro: 'De keuze voor brede opritten en beperkte ruimte. Een schuifpoort beweegt zijwaarts en vraagt geen zwenkruimte.',
    lead: 'Een schuifpoort glijdt opzij in plaats van open te draaien. Ideaal voor hellende opritten, beperkte diepte of grote breedtes. Wij maken hem in hout, aluminium, staal of cortenstaal.',
    voorWie: ['Brede opritten die geen zwenkruimte voor een draaipoort hebben.', 'Hellende terreinen waar een draaipoort niet vlot opent.', 'Wie een rustige, horizontale beweging verkiest.'],
    voordelen: [['Geen zwenkruimte', 'De poort schuift opzij en wint kostbare opritruimte.'], ['Geschikt voor breed', 'Grote overspanningen bewegen stil en stabiel.'], ['Werkt op een helling', 'Ook op hellend terrein blijft de beweging vlot.'], ['Robuuste geleiding', 'Een verdoken loopwerk draagt de poort jarenlang.']],
    materialen: ['Cortenstaal', 'Aluminium lamellen', 'Staal en hout', 'Massieve eik'],
    afwerking: ['Vrijdragend of op rail', 'Verdoken loopwiel', 'Privacylamellen', 'Geïntegreerde verlichting'],
    stijlen: [['Vrijdragend', 'Zonder rail op de grond, voor een vlakke en strakke oprit.'], ['Lamellen', 'Een rustig horizontaal ritme dat privacy met lucht combineert.'], ['Dicht paneel', 'Een gesloten vlak voor maximale beslotenheid.']],
    faq: [['Wat is een vrijdragende schuifpoort?', 'Een vrijdragende poort heeft geen rail in de grond. Hij wordt gedragen door een verdoken loopwerk naast de oprit, zodat de doorgang vlak en obstakelvrij blijft.'], ['Schuifpoort of draaipoort?', 'Een schuifpoort wint ruimte en werkt goed op hellingen en brede opritten. Een draaipoort is rustiger en klassieker bij voldoende plaats. Wij adviseren op basis van uw terrein.'], ['Hoe stil is de beweging?', 'Een correct geplaatste schuifpoort beweegt nagenoeg geruisloos dankzij een kwalitatief loopwerk en een zachte demping bij begin en einde.']]
  },
  draai: {
    key: 'draai',
    naam: 'Draaipoorten',
    kicker: 'Poorttype',
    tone: 'morning',
    materiaalFilter: null,
    intro: 'De klassieke en meest verfijnde beweging. Een draaipoort opent statig naar binnen of buiten.',
    lead: 'Een draaipoort draait op verdoken scharnieren en geeft uw toegang een rustige, klassieke beweging. In één of twee vleugels, in elk materiaal dat bij uw woning past.',
    voorWie: ['Woningen met voldoende oprijdiepte voor de zwenkbeweging.', 'Wie de klassieke, statige opening van een draaipoort verkiest.', 'Smalle voetgangerstoegangen naast een grotere oprijpoort.'],
    voordelen: [['Klassieke beweging', 'Een rustige, statige opening die tijdloos aanvoelt.'], ['Eén of twee vleugels', 'Enkel of dubbel, afgestemd op de breedte van de opening.'], ['Verfijnde details', 'Verdoken scharnieren en een vlakke aansluiting.'], ['Elk materiaal', 'Hout, aluminium, staal of een combinatie naar keuze.']],
    materialen: ['Aluminium', 'Massieve eik', 'Handgesmeed staal', 'Staal en hout'],
    afwerking: ['Verdoken scharnieren', 'Zachte demping', 'Ingewerkt slot', 'Geïntegreerde voetgangerspoort'],
    stijlen: [['Enkele vleugel', 'Eén rustige vleugel voor smallere toegangen.'], ['Dubbele vleugel', 'Twee vleugels die symmetrisch openen voor brede opritten.'], ['Met loopdeur', 'Een geïntegreerde voetgangerspoort in hetzelfde beeld.']],
    faq: [['Hoeveel ruimte vraagt een draaipoort?', 'Een draaipoort heeft zwenkruimte nodig voor de vleugels. Bij beperkte diepte adviseren wij een schuifpoort of een opening naar binnen.'], ['Eén of twee vleugels?', 'Dat hangt af van de breedte. Tot ongeveer drie meter volstaat vaak één vleugel, daarboven kiezen wij meestal voor twee.'], ['Kan er een loopdeur in?', 'Ja. Wij integreren een voetgangerspoort in dezelfde lijn, zodat het beeld rustig en samenhangend blijft.']]
  },
  hekwerk: {
    key: 'hekwerk',
    naam: 'Hekwerken op maat',
    kicker: 'Hekwerk',
    tone: 'stone',
    materiaalFilter: null,
    intro: 'Eén doorlopend beeld rond uw eigendom. Een hekwerk dat naadloos aansluit bij de poort.',
    lead: 'Een hekwerk op maat omkadert uw woning in hetzelfde profiel en dezelfde toon als de poort. Zo wordt de volledige afsluiting één rustig, samenhangend geheel.',
    voorWie: ['Eigendommen die poort en omheining in één beeld willen.', 'Tuinen die afgeschermd worden zonder zwaar of gesloten te ogen.', 'Projecten waar de afsluiting de architectuur moet versterken.'],
    voordelen: [['Eén geheel', 'Hek en poort delen hetzelfde profiel en dezelfde toon.'], ['Op maat van het terrein', 'Volgt hoogteverschillen en hoeken nauwkeurig.'], ['Open of besloten', 'Van transparant tot volledig privacygericht.'], ['Duurzame materialen', 'Aluminium, staal of cortenstaal, naar keuze.']],
    materialen: ['Aluminium lamellen', 'Cortenstaal', 'Verticale spijlen', 'Gecombineerd met groen'],
    afwerking: ['Doorlopend lamelprofiel', 'Lijnverlichting', 'Geïntegreerde poort', 'Op maat van de helling'],
    stijlen: [['Lamellen', 'Een doorlopend horizontaal ritme rond het volledige terrein.'], ['Spijlen', 'Fijne verticale staven voor een open, klassiek beeld.'], ['Vol en groen', 'Dichte panelen afgewisseld met beplanting.']],
    faq: [['Sluit het hekwerk aan op de poort?', 'Ja, dat is net het uitgangspunt. Wij tekenen hek en poort in hetzelfde profiel, zodat de toegang opgaat in de volledige afsluiting.'], ['Volgt het hekwerk een helling?', 'Zeker. Wij meten het terrein nauwkeurig op en laten het hekwerk de hoogteverschillen en hoeken rustig volgen.'], ['Hoe transparant kan een hekwerk?', 'Van volledig open met fijne spijlen tot volledig besloten met dichte panelen. Wij stemmen de mate van privacy af op uw wens en ligging.']]
  },
  automatisatie: {
    key: 'automatisatie',
    naam: 'Automatisatie',
    kicker: 'Techniek',
    tone: 'dusk',
    materiaalFilter: null,
    intro: 'Comfort dat u dagelijks voelt. Een poort die stil, veilig en betrouwbaar opent.',
    lead: 'Automatisatie is techniek die onzichtbaar hoort te zijn. Wij integreren betrouwbare aandrijving, veilige detectie en eenvoudige bediening, en blijven beschikbaar voor onderhoud en herstelling.',
    voorWie: ['Wie comfort en veiligheid bij de dagelijkse toegang verwacht.', 'Bestaande poorten die toe zijn aan een betrouwbare aandrijving.', 'Nieuwe poorten waar de techniek van bij het ontwerp wordt ingepast.'],
    voordelen: [['Verdoken techniek', 'Aandrijving in de fundering of discreet weggewerkt.'], ['Veilige detectie', 'Sensoren en beveiliging tegen klem en obstakels.'], ['Eenvoudige bediening', 'Afstandsbediening, codeklavier of bediening via uw telefoon.'], ['Sterke opvolging', 'Wij blijven bereikbaar voor onderhoud en herstelling.']],
    materialen: ['Ondergrondse aandrijving', 'Zijdelingse motor', 'Schuifpoortmotor', 'Back up batterij'],
    afwerking: ['Codeklavier', 'Afstandsbediening', 'Bediening via telefoon', 'Veiligheidssensoren'],
    stijlen: [['Ondergronds', 'Een verdoken motor in de fundering, volledig uit het zicht.'], ['Verdoken zijwaarts', 'Een discrete motor weggewerkt in de paal of de muur.'], ['Schuifaandrijving', 'Een robuuste, stille aandrijving voor schuifpoorten.']],
    faq: [['Werkt automatisatie ook op mijn bestaande poort?', 'Vaak wel. Wij beoordelen tijdens een plaatsbezoek of de poort en de constructie geschikt zijn en welke aandrijving past.'], ['Wat gebeurt er bij stroomuitval?', 'Wij voorzien waar gewenst een back up batterij en een handmatige ontgrendeling, zodat de poort altijd te openen blijft.'], ['Is automatisatie veilig?', 'Ja. Wij plaatsen veiligheidssensoren die detecteren wanneer iets of iemand zich in de baan bevindt, en stemmen de kracht zorgvuldig af.']]
  }
};
const PRODUCT_VOLGORDE = ['houten', 'metalen', 'aluminium', 'staalhout', 'schuif', 'draai', 'hekwerk', 'automatisatie'];

/* ----------------------------- Werkwijze ----------------------------- */
const WERKWIJZE = [['01', 'Eerste contact en adviesgesprek', 'Alles begint met een gesprek. Wij luisteren naar uw woning, uw oprit en het gevoel dat u zoekt. Geen catalogus, maar een eerlijk advies over wat past.'], ['02', 'Plaatsbezoek en opmeting', 'Wij komen ter plaatse, lezen de architectuur en de toegang, en meten nauwkeurig op. Zo houdt het ontwerp rekening met helling, breedte en gebruik.'], ['03', 'Ontwerp en voorstel', 'U ontvangt een ontwerp op maat met materiaal, ritme, afwerking en automatisatie. Wij verfijnen samen tot elk detail klopt.'], ['04', 'Productie en afwerking', 'In ons atelier wordt uw poort gesneden, gelast en met de hand afgewerkt. Eén object, geen samengesteld pakket.'], ['05', 'Plaatsing en automatisatie', 'Onze eigen plaatsers monteren de poort en stellen de verdoken automatisatie nauwkeurig af. Wij leveren proper en stil op.'], ['06', 'Oplevering en service na verkoop', 'Wij overlopen het gebruik en het onderhoud, en blijven daarna bereikbaar. Service is voor ons een onderdeel van kwaliteit.']];

/* ----------------------------- Vertrouwensclaims ----------------------------- */
const CLAIMS = ['Handgemaakt in België', 'Duurzame materialen', 'Advies, opmeting en plaatsing door specialisten', 'Sterke service na verkoop'];

/* ----------------------------- Homepage FAQ ----------------------------- */
const HOME_FAQ = [['Hoe lang duurt het maken en plaatsen van een poort?', 'Een traject van eerste contact tot plaatsing duurt gemiddeld zes tot acht weken. De exacte termijn hangt af van materiaal, ontwerp en automatisatie. Wij bevestigen een realistische planning bij het voorstel.'], ['Waarom is een Belgische poort op maat duurder dan import?', 'U investeert in Belgisch handwerk, duurzame materialen, een correcte plaatsing en een sterke service na verkoop. Geen importproduct uit een doos, maar een poort die voor uw woning is getekend en jarenlang vertrouwen geeft.'], ['Komen jullie altijd ter plaatse?', 'Ja. Er is altijd een plaatsbezoek en een adviesgesprek met opmeting. Zo houdt het ontwerp rekening met uw terrein, uw architectuur en uw dagelijks gebruik.'], ['Welk materiaal past het best bij mijn woning?', 'Dat bepalen wij samen. Hout brengt warmte, aluminium is onderhoudsarm, staal geeft kracht en cortenstaal verkleurt mee met het landschap. Tijdens het adviesgesprek bekijken wij wat bij uw woning past.']];

/* ----------------------------- Advies ----------------------------- */
const ADVIES = [['Welke poort past bij een moderne woning?', 'Materialen', 'Strakke lijnen, lamellen en aluminium voor een rustige, eigentijdse toegang.'], ['Welke poort past bij een landelijke woning?', 'Inspiratie', 'Hout en staal die warmte en robuustheid verenigen in een landelijke omgeving.'], ['Schuifpoort of draaipoort kiezen?', 'Poorttypes', 'Hoe ruimte, helling en uitstraling uw keuze tussen schuiven en draaien bepalen.'], ['Aluminium, staal of hout voor uw poort?', 'Materialen', 'Een nuchtere vergelijking van de drie materialen die wij het vaakst verwerken.'], ['Wat bepaalt de prijs van een poort op maat?', 'Prijs en investering', 'Welke keuzes de investering sturen, en waarom maatwerk meer waarde biedt dan import.'], ['Hoe verloopt een plaatsbezoek?', 'Proces', 'Wat u mag verwachten van het adviesgesprek, de opmeting en het voorstel.']];
Object.assign(window, {
  PROJECTEN,
  PRODUCTEN,
  PRODUCT_VOLGORDE,
  WERKWIJZE,
  CLAIMS,
  HOME_FAQ,
  ADVIES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website-nl/data-nl.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website-nl/shared-nl.jsx
try { (() => {
/* Poortland — Nederlandse website. Gedeelde bouwstenen.
   Nav met productmenu en taalwisselaar, footer, beeldplaceholder, reveal animatie. */

const {
  Button: SButton,
  Tag: STag,
  Eyebrow: SEyebrow
} = window.PoortlandDesignSystem_6dcc8b;

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
  const talen = ['NL', 'FR', 'DE', 'EN'];
  const faint = dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)';
  const active = dark ? 'var(--stone-100)' : 'var(--text-heading)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 2
    },
    role: "group",
    "aria-label": "Taal"
  }, talen.map((t, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: t
  }, i > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: faint,
      opacity: 0.4,
      fontSize: 11
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onLang(t),
    "aria-pressed": lang === t,
    style: {
      background: 'none',
      border: 0,
      cursor: 'pointer',
      padding: '4px 5px',
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.12em',
      color: lang === t ? active : faint,
      borderBottom: lang === t ? '1px solid var(--accent)' : '1px solid transparent'
    }
  }, t))));
}

/* ---- Hoofdnavigatie met productmenu ---- */
const PRODUCT_MENU = [['houten', 'Houten poorten'], ['metalen', 'Metalen poorten'], ['aluminium', 'Aluminium poorten'], ['staalhout', 'Combinatie staal en hout'], ['schuif', 'Schuifpoorten'], ['draai', 'Draaipoorten'], ['hekwerk', 'Hekwerken op maat'], ['automatisatie', 'Automatisatie']];
function Nav({
  route,
  onNav,
  lang,
  onLang
}) {
  const [openMenu, setOpenMenu] = React.useState(false);
  const items = [['realisaties', 'Realisaties'], ['werkwijze', 'Werkwijze'], ['atelier', 'Over Poortland'], ['contact', 'Contact']];
  const fg = 'var(--stone-200)';
  const faint = 'var(--text-on-dark-muted)';
  return /*#__PURE__*/React.createElement("header", {
    onMouseLeave: () => setOpenMenu(false),
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 40,
      background: 'rgba(15,22,15,0.88)',
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
      setOpenMenu(false);
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
    onMouseEnter: () => setOpenMenu(true),
    onClick: () => setOpenMenu(v => !v),
    "aria-expanded": openMenu,
    style: {
      background: 'none',
      border: 0,
      cursor: 'pointer',
      padding: '4px 0',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      fontWeight: route === 'product' ? 600 : 400,
      color: route === 'product' || openMenu ? fg : faint,
      borderBottom: route === 'product' ? '1px solid var(--accent)' : '1px solid transparent'
    }
  }, "Poorten", /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      fontSize: 9,
      transition: 'transform var(--dur) var(--ease-out)',
      transform: openMenu ? 'rotate(180deg)' : 'none',
      display: 'inline-block'
    }
  }, "\u25BE")), items.map(([key, label]) => /*#__PURE__*/React.createElement("button", {
    key: key,
    onClick: () => {
      onNav(key);
      setOpenMenu(false);
    },
    style: {
      background: 'none',
      border: 0,
      cursor: 'pointer',
      padding: '4px 0',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      fontWeight: route === key ? 600 : 400,
      color: route === key ? fg : faint,
      borderBottom: route === key ? '1px solid var(--accent)' : '1px solid transparent'
    }
  }, label)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 18,
      background: 'var(--line-on-dark-soft)'
    }
  }), /*#__PURE__*/React.createElement(TaalWisselaar, {
    lang: lang,
    onLang: onLang,
    dark: true
  }), /*#__PURE__*/React.createElement(SButton, {
    variant: "primary",
    size: "sm",
    arrow: true,
    as: "button",
    onClick: () => {
      onNav('contact');
      setOpenMenu(false);
    }
  }, "Plan een adviesgesprek"))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'hidden',
      maxHeight: openMenu ? 320 : 0,
      transition: 'max-height 360ms var(--ease-out)',
      borderTop: openMenu ? '1px solid var(--line-on-dark-soft)' : '1px solid transparent',
      background: 'rgba(15,22,15,0.97)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      padding: '26px 44px 30px'
    }
  }, /*#__PURE__*/React.createElement(SEyebrow, {
    dark: true,
    tone: "muted",
    style: {
      marginBottom: 16
    }
  }, "Poorten, hekwerken en automatisatie"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '4px 20px'
    }
  }, PRODUCT_MENU.map(([key, label]) => /*#__PURE__*/React.createElement("button", {
    key: key,
    onClick: () => {
      onNav('product', {
        productKey: key
      });
      setOpenMenu(false);
    },
    style: {
      textAlign: 'left',
      background: 'none',
      border: 0,
      cursor: 'pointer',
      padding: '11px 12px',
      borderRadius: 'var(--radius-sm)',
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      color: 'var(--stone-200)',
      transition: 'background var(--dur) var(--ease-out), color var(--dur) var(--ease-out)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--forest-800)';
      e.currentTarget.style.color = 'var(--stone-100)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.color = 'var(--stone-200)';
    }
  }, label))))));
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
  }, "Deze taalversie is in voorbereiding \xB7 u bekijkt de Nederlandse versie");
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
  }, "\u2014"), /*#__PURE__*/React.createElement("span", {
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
      background: dark ? 'var(--forest-950)' : 'var(--surface-paper)',
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
    onClick: () => onNav('atelier')
  }, "Bezoek onze showroom"))));
}

/* ---- Footer ---- */
function Footer({
  onNav,
  lang,
  onLang
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--forest-950)',
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
      marginBottom: 18
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
  }, "Handgemaakte toegangspoorten, hekwerken en automatisatie op maat. Ontworpen, gemaakt en geplaatst in Belgi\xEB."), /*#__PURE__*/React.createElement(TaalWisselaar, {
    lang: lang,
    onLang: onLang,
    dark: true
  })), /*#__PURE__*/React.createElement(FooterKol, {
    title: "Poorten",
    links: [['Houten poorten', () => onNav('product', {
      productKey: 'houten'
    })], ['Aluminium poorten', () => onNav('product', {
      productKey: 'aluminium'
    })], ['Schuifpoorten', () => onNav('product', {
      productKey: 'schuif'
    })], ['Hekwerken', () => onNav('product', {
      productKey: 'hekwerk'
    })], ['Automatisatie', () => onNav('product', {
      productKey: 'automatisatie'
    })]]
  }), /*#__PURE__*/React.createElement(FooterKol, {
    title: "Ontdek",
    links: [['Realisaties', () => onNav('realisaties')], ['Werkwijze', () => onNav('werkwijze')], ['Over Poortland', () => onNav('atelier')], ['Contact', () => onNav('contact')]]
  }), /*#__PURE__*/React.createElement(FooterKol, {
    title: "Atelier en showroom",
    links: [['Dok Noord 4, 9000 Gent'], ['+32 9 224 18 70'], ['hallo@poortland.be'], ['Open op afspraak']]
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
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Poortland \u2014 Handgemaakt in Belgi\xEB sinds 1992"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 22,
      letterSpacing: '0.06em'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('atelier'),
    style: {
      background: 'none',
      border: 0,
      color: 'inherit',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: 'inherit'
    }
  }, "Privacybeleid"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('atelier'),
    style: {
      background: 'none',
      border: 0,
      color: 'inherit',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: 'inherit'
    }
  }, "Cookiebeleid"), /*#__PURE__*/React.createElement("span", null, "BTW BE 0xxx.xxx.xxx")))));
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
Object.assign(window, {
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
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website-nl/shared-nl.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Collection.jsx
try { (() => {
/* Poortland website — Collection */
const {
  Button: CButton,
  Tag: CTag,
  Eyebrow: CEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function Collection({
  onNav
}) {
  const {
    GateImage,
    PROJECTS
  } = window;
  const materials = ['All', 'Corten', 'Aluminium', 'Oak & steel', 'Forged steel'];
  const [filter, setFilter] = React.useState('All');
  const shown = filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.material === filter);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)',
      minHeight: '70vh'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '64px 40px 30px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(CEyebrow, {
    style: {
      marginBottom: 16
    }
  }, "The collection"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 56,
      color: 'var(--text-heading)',
      margin: 0,
      letterSpacing: '-0.01em',
      lineHeight: 1.02
    }
  }, "Every gate, an address."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      color: 'var(--text-muted)',
      maxWidth: '52ch',
      marginTop: 18,
      lineHeight: 1.6
    }
  }, "A selection of recent commissions across Belgium. Filter by material; open any project for its specification."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 30,
      flexWrap: 'wrap'
    }
  }, materials.map(m => {
    const active = filter === m;
    return /*#__PURE__*/React.createElement("button", {
      key: m,
      onClick: () => setFilter(m),
      style: {
        fontFamily: 'var(--font-label)',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        padding: '8px 15px',
        borderRadius: 'var(--radius-xs)',
        cursor: 'pointer',
        background: active ? 'var(--bronze-500)' : 'transparent',
        color: active ? 'var(--forest-950)' : 'var(--text-body)',
        border: `1px solid ${active ? 'var(--bronze-500)' : 'var(--line-on-light)'}`,
        transition: 'all var(--dur) var(--ease-out)'
      }
    }, m);
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '20px 40px 88px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, shown.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    onClick: () => onNav('project', p),
    style: {
      textAlign: 'left',
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--line-on-light-soft)',
      background: 'var(--surface-card)'
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: p.tone,
    ratio: "4 / 3",
    label: p.material,
    radius: 0
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 18px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement(CEyebrow, null, p.place), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      color: 'var(--text-faint)'
    }
  }, p.year)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      color: 'var(--text-heading)',
      lineHeight: 1.1,
      marginTop: 7
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-muted)',
      marginTop: 6
    }
  }, p.type, " \xB7 ", p.span))))))));
}
window.Collection = Collection;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Collection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Contact.jsx
try { (() => {
/* Poortland website — Contact (enquiry) */
const {
  Button: KButton,
  Input: KInput,
  Eyebrow: KEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function Contact() {
  const [sent, setSent] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '70px 40px 90px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '0.95fr 1.05fr',
      gap: 72
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(KEyebrow, {
    dark: true,
    style: {
      marginBottom: 20
    }
  }, "Begin a commission"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 54,
      color: 'var(--stone-100)',
      margin: 0,
      lineHeight: 1.03,
      letterSpacing: '-0.01em'
    }
  }, "Tell us about", /*#__PURE__*/React.createElement("br", null), "the entrance."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      maxWidth: '40ch',
      marginTop: 22
    }
  }, "Share a little about the house, the opening and the feeling you are after. We reply to every enquiry within two working days."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40,
      display: 'flex',
      flexDirection: 'column',
      gap: 22
    }
  }, [['Atelier', 'Dok-Noord 4, 9000 Ghent, Belgium'], ['Telephone', '+32 9 224 18 70'], ['Email', 'hello@poortland.be']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
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
      color: 'var(--stone-200)'
    }
  }, v))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--forest-850)',
      borderRadius: 'var(--radius-lg)',
      padding: '34px 34px 38px',
      border: '1px solid var(--line-on-dark-soft)'
    }
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: 360,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/mono-on-dark.png",
    width: "40",
    height: "40",
    alt: "",
    style: {
      marginBottom: 20
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 32,
      color: 'var(--stone-100)',
      margin: 0
    }
  }, "Thank you."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      color: 'var(--stone-300)',
      marginTop: 12,
      maxWidth: '34ch'
    }
  }, "Your enquiry is with the atelier. We'll be in touch within two working days."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(KButton, {
    variant: "secondary",
    dark: true,
    onClick: () => setSent(false)
  }, "Send another"))) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(KInput, {
    label: "Name",
    dark: true,
    placeholder: "Lucas Vermeulen",
    required: true
  }), /*#__PURE__*/React.createElement(KInput, {
    label: "Email",
    dark: true,
    type: "email",
    placeholder: "you@estate.be",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(KInput, {
    label: "Location",
    dark: true,
    placeholder: "Knokke, BE"
  }), /*#__PURE__*/React.createElement(KInput, {
    label: "Material",
    dark: true,
    placeholder: "Corten / aluminium\u2026"
  })), /*#__PURE__*/React.createElement(KInput, {
    label: "About the project",
    dark: true,
    as: "textarea",
    placeholder: "The opening is roughly 4m, a sliding gate for the drive\u2026"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      color: 'var(--text-on-dark-faint)'
    }
  }, "No obligation \xB7 we reply within 2 days"), /*#__PURE__*/React.createElement(KButton, {
    variant: "primary",
    arrow: true,
    as: "button",
    type: "submit"
  }, "Send enquiry")))))));
}
window.Contact = Contact;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Contact.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Home.jsx
try { (() => {
/* Poortland website — Home */
const {
  Button: PButton,
  Tag: PTag,
  Eyebrow: PEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function Home({
  onNav
}) {
  const {
    GateImage,
    PROJECTS
  } = window;
  const featured = PROJECTS.slice(0, 3);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '64px 40px 64px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.05fr 0.95fr',
      gap: 56,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PEyebrow, {
    dark: true,
    style: {
      marginBottom: 22
    }
  }, "Custom gates \xB7 Belgium"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 72,
      lineHeight: 1.02,
      letterSpacing: '-0.01em',
      color: 'var(--stone-100)',
      margin: 0
    }
  }, "The quiet entrance to", /*#__PURE__*/React.createElement("br", null), "a remarkable house."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 19,
      lineHeight: 1.6,
      color: 'var(--stone-300)',
      maxWidth: '46ch',
      margin: '26px 0 32px'
    }
  }, "We draw, forge and finish every gate by hand \u2014 in corten, brushed aluminium, oak and steel \u2014 shaped to the architecture it belongs to."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(PButton, {
    variant: "primary",
    arrow: true,
    onClick: () => onNav('contact')
  }, "Request a consultation"), /*#__PURE__*/React.createElement(PButton, {
    variant: "ghost",
    dark: true,
    arrow: true,
    onClick: () => onNav('collection')
  }, "View the collection")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 40,
      marginTop: 52,
      paddingBottom: 4
    }
  }, [['1992', 'Established'], ['100%', 'Hand made'], ['320+', 'Estates fitted']].map(([n, l]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 34,
      color: 'var(--stone-100)',
      lineHeight: 1
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 10,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--text-on-dark-muted)',
      marginTop: 7
    }
  }, l))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 8,
      overflow: 'hidden',
      position: 'relative',
      aspectRatio: '3 / 2',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/poort-oak-hero.jpeg",
    alt: "Hand made oak gate by Poortland",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: '50% 50%',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, rgba(15,22,15,0) 55%, rgba(15,22,15,0.55) 100%)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 16,
      bottom: 14,
      fontFamily: 'var(--font-label)',
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'rgba(236,227,210,0.92)'
    }
  }, "Oak \xB7 hand made in Belgium")))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '88px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 38
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PEyebrow, {
    style: {
      marginBottom: 14
    }
  }, "Selected work"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 42,
      color: 'var(--text-heading)',
      margin: 0,
      letterSpacing: '-0.01em'
    }
  }, "Gates with an address.")), /*#__PURE__*/React.createElement(PButton, {
    variant: "secondary",
    onClick: () => onNav('collection')
  }, "All projects")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, featured.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    onClick: () => onNav('project', p),
    style: {
      textAlign: 'left',
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--line-on-light-soft)'
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: p.tone,
    ratio: "4 / 3",
    label: `${p.material}`,
    radius: 0
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 18px 20px',
      background: 'var(--surface-card)'
    }
  }, /*#__PURE__*/React.createElement(PEyebrow, {
    style: {
      marginBottom: 7
    }
  }, p.material, " \xB7 ", p.place), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      color: 'var(--text-heading)',
      lineHeight: 1.1
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-muted)',
      marginTop: 7
    }
  }, p.type, " \xB7 ", p.span)))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '74px 40px',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '0.8fr 1.2fr',
      gap: 56,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PEyebrow, {
    dark: true,
    style: {
      marginBottom: 16
    }
  }, "The material"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 38,
      color: 'var(--stone-100)',
      margin: 0,
      lineHeight: 1.08
    }
  }, "Four materials,", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: 'var(--accent)'
    }
  }, "endlessly"), " detailed."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      lineHeight: 1.7,
      color: 'var(--stone-300)',
      maxWidth: '38ch',
      marginTop: 18
    }
  }, "Each begins as a drawing and ends as a single, welded object \u2014 no catalogue, no two alike.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 14
    }
  }, [['Corten', 'Weathered, living surface'], ['Aluminium', 'Brushed, powder-coated'], ['Oak', 'Warm timber infill'], ['Forged steel', 'Hand-wrought bars']].map(([m, d]) => /*#__PURE__*/React.createElement("div", {
    key: m,
    style: {
      border: '1px solid var(--line-on-dark-soft)',
      borderRadius: 'var(--radius-sm)',
      padding: '18px 18px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      color: 'var(--stone-100)'
    }
  }, m), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12.5,
      color: 'var(--text-on-dark-muted)',
      marginTop: 5
    }
  }, d)))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      padding: '90px 40px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(PEyebrow, {
    style: {
      marginBottom: 18
    }
  }, "Begin a commission"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 52,
      color: 'var(--text-heading)',
      margin: '0 auto 26px',
      maxWidth: '16ch',
      lineHeight: 1.05
    }
  }, "Tell us about the entrance."), /*#__PURE__*/React.createElement(PButton, {
    variant: "primary",
    size: "lg",
    arrow: true,
    onClick: () => onNav('contact')
  }, "Request a consultation")));
}
window.Home = Home;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Process.jsx
try { (() => {
/* Poortland website — Process */
const {
  Button: RButton,
  Eyebrow: REyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function Process({
  onNav
}) {
  const {
    GateImage
  } = window;
  const steps = [['01', 'Consultation', 'We visit the house, read the architecture and the approach, and listen to how you want the entrance to feel.'], ['02', 'Drawing', 'A bespoke gate is drawn to the opening and the elevation. Material, rhythm and motion are resolved on paper first.'], ['03', 'Forging', 'In our Ghent atelier the gate is cut, welded and finished entirely by hand — a single object, never a kit.'], ['04', 'Fitting', 'We fit on site over one to two days, set the concealed automation, and hand over a gate built to outlast the house.']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      color: 'var(--text-on-dark)',
      padding: '72px 40px 78px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 0.8fr',
      gap: 56,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(REyebrow, {
    dark: true,
    style: {
      marginBottom: 20
    }
  }, "How we work"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 60,
      color: 'var(--stone-100)',
      margin: 0,
      lineHeight: 1.02,
      letterSpacing: '-0.01em'
    }
  }, "From drawing", /*#__PURE__*/React.createElement("br", null), "to ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: 'var(--accent)'
    }
  }, "hand"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 18,
      lineHeight: 1.65,
      color: 'var(--stone-300)',
      maxWidth: '44ch',
      marginTop: 24
    }
  }, "Every Poortland gate is a commission. There is no catalogue \u2014 only your house, our hands, and the four materials we trust.")), /*#__PURE__*/React.createElement(GateImage, {
    tone: "corten",
    ratio: "4 / 5",
    slats: 6,
    label: "Atelier \xB7 Ghent",
    radius: 8
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '80px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 0
    }
  }, steps.map(([n, t, d], i) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: 'grid',
      gridTemplateColumns: '120px 1fr',
      gap: 40,
      alignItems: 'start',
      padding: '34px 0',
      borderTop: '1px solid var(--line-on-light)',
      borderBottom: i === steps.length - 1 ? '1px solid var(--line-on-light)' : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 56,
      color: 'var(--accent)',
      lineHeight: 0.9
    }
  }, n), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 30,
      color: 'var(--text-heading)',
      margin: 0
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      lineHeight: 1.7,
      color: 'var(--text-body)',
      margin: '12px 0 0',
      maxWidth: '60ch'
    }
  }, d)))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '80px 40px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontStyle: 'italic',
      fontSize: 34,
      color: 'var(--stone-100)',
      maxWidth: '24ch',
      margin: '0 auto 30px',
      lineHeight: 1.25
    }
  }, "\u201CA gate is the first thing the house says. We make it say it well.\u201D"), /*#__PURE__*/React.createElement(REyebrow, {
    dark: true,
    tone: "muted",
    style: {
      marginBottom: 34
    }
  }, "Lucas Vermeulen \xB7 Master fabricator"), /*#__PURE__*/React.createElement(RButton, {
    variant: "primary",
    size: "lg",
    arrow: true,
    onClick: () => onNav('contact')
  }, "Begin a commission")));
}
window.Process = Process;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Process.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/ProjectDetail.jsx
try { (() => {
/* Poortland website — Project detail */
const {
  Button: DButton,
  Tag: DTag,
  Eyebrow: DEyebrow
} = window.PoortlandDesignSystem_6dcc8b;
function ProjectDetail({
  project,
  onNav
}) {
  const {
    GateImage,
    PROJECTS
  } = window;
  const p = project || PROJECTS[0];
  const more = PROJECTS.filter(x => x.id !== p.id).slice(0, 3);
  const specs = [['Material', p.material], ['Type', p.type], ['Clear span', p.span], ['Finish', 'Hand-applied, matte'], ['Automation', 'Underground BFT'], ['Completed', p.year]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-paper)'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ground)',
      padding: '40px 40px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('collection'),
    style: {
      background: 'none',
      border: 0,
      cursor: 'pointer',
      padding: 0,
      marginBottom: 24,
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-on-dark-muted)'
    }
  }, "\u2190 Back to collection"), /*#__PURE__*/React.createElement(GateImage, {
    tone: p.tone,
    ratio: "21 / 9",
    slats: 13,
    label: `${p.name} · ${p.place}`,
    radius: 8
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '52px 40px 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.2fr 0.8fr',
      gap: 64
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DEyebrow, {
    style: {
      marginBottom: 16
    }
  }, p.place, " \xB7 ", p.year), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 52,
      color: 'var(--text-heading)',
      margin: 0,
      letterSpacing: '-0.01em',
      lineHeight: 1.03
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(DTag, {
    variant: "solid"
  }, p.material), /*#__PURE__*/React.createElement(DTag, null, p.type)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.7,
      color: 'var(--text-body)',
      marginTop: 28,
      maxWidth: '54ch'
    }
  }, "A ", p.span, " ", p.type.toLowerCase(), " drawn for the approach to a ", p.place, " estate. The ", p.material.toLowerCase(), ' ', "was selected to settle into the landscape \u2014 a surface that deepens with weather rather than fighting it."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.7,
      color: 'var(--text-body)',
      marginTop: 18,
      maxWidth: '54ch'
    }
  }, "Cut, welded and finished in our Ghent atelier, then fitted on site over two days with concealed automation.")), /*#__PURE__*/React.createElement("aside", null, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--line-on-light)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }
  }, specs.map(([k, v], i) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 18px',
      borderBottom: i < specs.length - 1 ? '1px solid var(--line-on-light-soft)' : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-faint)'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-heading)',
      fontWeight: 500
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(DButton, {
    variant: "primary",
    arrow: true,
    onClick: () => onNav('contact')
  }, "Commission similar")))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '52px auto 0',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: p.tone,
    ratio: "4 / 3",
    slats: 9,
    label: "Detail \xB7 weld",
    radius: 6
  }), /*#__PURE__*/React.createElement(GateImage, {
    tone: "stone",
    ratio: "4 / 3",
    slats: 6,
    label: "Detail \xB7 post",
    radius: 6
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--forest-900)',
      padding: '70px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(DEyebrow, {
    dark: true,
    style: {
      marginBottom: 26
    }
  }, "More from the atelier"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, more.map(m => /*#__PURE__*/React.createElement("button", {
    key: m.id,
    onClick: () => onNav('project', m),
    style: {
      textAlign: 'left',
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(GateImage, {
    tone: m.tone,
    ratio: "4 / 3",
    label: m.material,
    radius: 6
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 21,
      color: 'var(--stone-100)',
      marginTop: 12
    }
  }, m.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12.5,
      color: 'var(--text-on-dark-muted)',
      marginTop: 4
    }
  }, m.place, " \xB7 ", m.material)))))));
}
window.ProjectDetail = ProjectDetail;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/ProjectDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/shared.jsx
try { (() => {
/* Poortland website — shared scaffolding (nav, footer, media placeholder).
   Exposes helpers to window for the other screen files. */

const {
  Button,
  Tag,
  Eyebrow
} = window.PoortlandDesignSystem_6dcc8b;

/* Stylised gate "photograph" placeholder — layered gradients + slat rhythm.
   Stands in for real estate photography; clearly an illustration, not a photo. */
function GateImage({
  tone = 'dusk',
  ratio = '4 / 3',
  label,
  radius = 6,
  slats = 9
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
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: ratio,
      borderRadius: radius,
      overflow: 'hidden',
      background: grounds[tone] || grounds.dusk
    }
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
}

/* Poortland monogram — direction 02. Square stamped frame with an
   inset rule and a serif "P". Real Cormorant; scales to any size. */
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
function Nav({
  route,
  onNav,
  dark = true
}) {
  const items = [['home', 'Home'], ['collection', 'Collection'], ['process', 'Process'], ['contact', 'Contact']];
  const fg = dark ? 'var(--stone-200)' : 'var(--text-heading)';
  const faint = dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)';
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '22px 40px',
      borderBottom: `1px solid ${dark ? 'var(--line-on-dark-soft)' : 'var(--line-on-light-soft)'}`,
      position: 'sticky',
      top: 0,
      zIndex: 20,
      background: dark ? 'rgba(15,22,15,0.86)' : 'rgba(250,246,238,0.9)',
      backdropFilter: 'blur(10px)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('home'),
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
    size: 32,
    dark: dark
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 14,
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
      gap: 30
    }
  }, items.map(([key, label]) => /*#__PURE__*/React.createElement("button", {
    key: key,
    onClick: () => onNav(key),
    style: {
      background: 'none',
      border: 0,
      cursor: 'pointer',
      padding: '4px 0',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      fontWeight: route === key ? 600 : 400,
      color: route === key ? fg : faint,
      borderBottom: route === key ? '1px solid var(--accent)' : '1px solid transparent'
    }
  }, label)), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    arrow: true,
    as: "button",
    onClick: () => onNav('contact')
  }, "Enquire")));
}
function Footer({
  onNav
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--forest-950)',
      color: 'var(--text-on-dark-muted)',
      padding: '56px 40px 34px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 32,
      borderBottom: '1px solid var(--line-on-dark-soft)',
      paddingBottom: 32
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
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Monogram, {
    size: 36,
    dark: true
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 15,
      fontWeight: 600,
      letterSpacing: '0.34em',
      textTransform: 'uppercase',
      color: 'var(--stone-100)',
      paddingLeft: '0.34em'
    }
  }, "Poortland")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      lineHeight: 1.7,
      margin: 0
    }
  }, "Custom gates, drawn and forged by hand in Belgium for estates, architects and developers since 1992.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 64
    }
  }, /*#__PURE__*/React.createElement(FooterCol, {
    title: "Explore",
    links: [['Collection', 'collection'], ['Process', 'process'], ['Contact', 'contact']],
    onNav: onNav
  }), /*#__PURE__*/React.createElement(FooterCol, {
    title: "Atelier",
    links: [['Ghent, Belgium'], ['+32 9 224 18 70'], ['hello@poortland.be']]
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: 20,
      fontFamily: 'var(--font-sans)',
      fontSize: 11,
      color: 'var(--text-on-dark-faint)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Poortland \u2014 Hand made in Belgium"), /*#__PURE__*/React.createElement("span", {
    style: {
      letterSpacing: '0.14em',
      textTransform: 'uppercase'
    }
  }, "BTW BE 0xxx.xxx.xxx")));
}
function FooterCol({
  title,
  links,
  onNav
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    dark: true,
    tone: "muted",
    style: {
      marginBottom: 14
    }
  }, title), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, links.map(([label, key], i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => key && onNav && onNav(key),
    style: {
      background: 'none',
      border: 0,
      padding: 0,
      cursor: key ? 'pointer' : 'default',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--stone-300)',
      textAlign: 'left'
    }
  }, label)))));
}
const PROJECTS = [{
  id: 'duinhof',
  name: 'Villa Duinhof',
  place: 'Knokke',
  material: 'Corten',
  type: 'Sliding driveway gate',
  tone: 'corten',
  span: '4.2m',
  year: '2025'
}, {
  id: 'lievens',
  name: 'Maison Lievens',
  place: 'Ghent',
  material: 'Aluminium',
  type: 'Pivot pedestrian gate',
  tone: 'morning',
  span: '1.1m',
  year: '2025'
}, {
  id: 'hofstede',
  name: 'Hofstede Brael',
  place: 'Sint-Martens',
  material: 'Oak & steel',
  type: 'Cantilever gate',
  tone: 'dusk',
  span: '5.0m',
  year: '2024'
}, {
  id: 'noord',
  name: 'Huis Noordkaai',
  place: 'Antwerp',
  material: 'Aluminium',
  type: 'Swing double gate',
  tone: 'stone',
  span: '3.6m',
  year: '2024'
}, {
  id: 'klooster',
  name: 'Klooster Velden',
  place: 'Leuven',
  material: 'Forged steel',
  type: 'Estate entrance',
  tone: 'dusk',
  span: '6.4m',
  year: '2023'
}, {
  id: 'duin',
  name: 'Strandvilla 9',
  place: 'Oostduinkerke',
  material: 'Corten',
  type: 'Louvered privacy gate',
  tone: 'corten',
  span: '2.8m',
  year: '2023'
}];
Object.assign(window, {
  GateImage,
  Monogram,
  Nav,
  Footer,
  FooterCol,
  PROJECTS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/shared.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Input = __ds_scope.Input;

})();
