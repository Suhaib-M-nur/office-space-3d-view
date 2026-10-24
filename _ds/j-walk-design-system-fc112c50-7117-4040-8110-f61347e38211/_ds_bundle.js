/* @ds-bundle: {"format":4,"namespace":"JWALKDesignSystem_fc112c","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"IconButton","sourcePath":"components/actions/IconButton.jsx"},{"name":"Badge","sourcePath":"components/content/Badge.jsx"},{"name":"Card","sourcePath":"components/content/Card.jsx"},{"name":"FeatureCard","sourcePath":"components/content/FeatureCard.jsx"},{"name":"SectionHeading","sourcePath":"components/content/SectionHeading.jsx"},{"name":"StatCard","sourcePath":"components/content/StatCard.jsx"},{"name":"Tag","sourcePath":"components/content/Tag.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"83e60ea3537b","components/actions/IconButton.jsx":"fa11204818f3","components/content/Badge.jsx":"d531fa37f843","components/content/Card.jsx":"0a1ab4acaa49","components/content/FeatureCard.jsx":"650cbbcb5cc6","components/content/SectionHeading.jsx":"f097fc64aa27","components/content/StatCard.jsx":"4cb0195aa9e5","components/content/Tag.jsx":"423ed465a5ab","components/forms/Input.jsx":"dc454f5d283b","ui_kits/website/App.jsx":"dc61ed48c640","ui_kits/website/Footer.jsx":"73ea67afe4e4","ui_kits/website/Header.jsx":"ae8ffcd79a95","ui_kits/website/Hero.jsx":"0ea378ee7f74","ui_kits/website/Home.jsx":"a68d35f00132","ui_kits/website/data.js":"d01ca11029de"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.JWALKDesignSystem_fc112c = window.JWALKDesignSystem_fc112c || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
const SIZES = {
  sm: {
    padding: '8px 16px',
    fontSize: 'var(--fs-sm)',
    gap: '6px'
  },
  md: {
    padding: '11px 22px',
    fontSize: 'var(--fs-base)',
    gap: '8px'
  },
  lg: {
    padding: '15px 30px',
    fontSize: 'var(--fs-md)',
    gap: '10px'
  }
};
const VARIANTS = {
  primary: {
    bg: 'var(--jw-teal)',
    bgHover: 'var(--jw-teal-700)',
    fg: '#fff',
    border: 'transparent'
  },
  secondary: {
    bg: 'var(--jw-orange)',
    bgHover: 'var(--jw-orange-700)',
    fg: '#fff',
    border: 'transparent'
  },
  accent: {
    bg: 'var(--jw-amber)',
    bgHover: 'var(--jw-amber-700)',
    fg: 'var(--jw-ink)',
    fgHover: '#fff',
    border: 'transparent'
  },
  outline: {
    bg: 'transparent',
    bgHover: 'var(--jw-teal-100)',
    fg: 'var(--jw-teal-700)',
    border: 'var(--jw-teal)'
  },
  ghost: {
    bg: 'transparent',
    bgHover: 'var(--jw-mist)',
    fg: 'var(--jw-ink)',
    border: 'transparent'
  }
};

/**
 * J WALK primary action button. Pill-shaped, brand-coloured, with a gentle
 * hover lift. RTL-safe.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  shape = 'pill',
  fullWidth = false,
  disabled = false,
  leadingIcon = null,
  trailingIcon = null,
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;
  const base = {
    display: fullWidth ? 'flex' : 'inline-flex',
    width: fullWidth ? '100%' : 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    padding: s.padding,
    fontSize: s.fontSize,
    fontFamily: 'var(--font-body)',
    fontWeight: 'var(--fw-bold)',
    lineHeight: 1,
    letterSpacing: '0.01em',
    color: hover && v.fgHover ? v.fgHover : v.fg,
    background: disabled ? 'var(--jw-line)' : hover ? v.bgHover : v.bg,
    border: `2px solid ${disabled ? 'var(--jw-line)' : v.border}`,
    borderRadius: shape === 'pill' ? 'var(--radius-pill)' : 'var(--radius-md)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: !disabled && hover && (variant === 'primary' || variant === 'secondary' || variant === 'accent') ? 'var(--shadow-md)' : 'none',
    transform: !disabled && press ? 'translateY(0)' : !disabled && hover ? 'translateY(-2px)' : 'translateY(0)',
    transition: 'background var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard), box-shadow var(--dur-base) var(--ease-standard), color var(--dur-fast)',
    color: disabled ? 'var(--jw-ink-400)' : hover && v.fgHover ? v.fgHover : v.fg,
    opacity: disabled ? 0.9 : 1,
    userSelect: 'none',
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    style: base,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false)
  }, rest), leadingIcon, children, trailingIcon);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
const SIZES = {
  sm: 34,
  md: 42,
  lg: 52
};

/**
 * Icon-only button (circular, echoing the amber disc). Pair with a Lucide
 * glyph passed as children. Always give it an aria-label.
 */
function IconButton({
  children,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  onClick,
  style = {},
  'aria-label': ariaLabel,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const dim = SIZES[size] || SIZES.md;
  const fills = {
    primary: {
      bg: 'var(--jw-teal)',
      bgHover: 'var(--jw-teal-700)',
      fg: '#fff'
    },
    soft: {
      bg: 'var(--jw-teal-100)',
      bgHover: 'var(--jw-teal-300)',
      fg: 'var(--jw-teal-700)'
    },
    ghost: {
      bg: 'transparent',
      bgHover: 'var(--jw-mist)',
      fg: 'var(--jw-ink)'
    },
    outline: {
      bg: 'transparent',
      bgHover: 'var(--jw-mist)',
      fg: 'var(--jw-ink)',
      border: 'var(--jw-line)'
    }
  };
  const v = fills[variant] || fills.ghost;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": ariaLabel,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: dim,
      height: dim,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-pill)',
      background: hover ? v.bgHover : v.bg,
      color: v.fg,
      border: `1.5px solid ${v.border || 'transparent'}`,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'background var(--dur-fast) var(--ease-standard)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/content/Badge.jsx
try { (() => {
const TONES = {
  teal: {
    soft: 'var(--jw-teal-100)',
    softFg: 'var(--jw-teal-700)',
    solid: 'var(--jw-teal)',
    solidFg: '#fff'
  },
  orange: {
    soft: 'var(--jw-orange-100)',
    softFg: 'var(--jw-orange-700)',
    solid: 'var(--jw-orange)',
    solidFg: '#fff'
  },
  amber: {
    soft: 'var(--jw-amber-100)',
    softFg: 'var(--jw-amber-700)',
    solid: 'var(--jw-amber)',
    solidFg: 'var(--jw-ink)'
  },
  ocean: {
    soft: '#e2eef5',
    softFg: 'var(--jw-ocean-700)',
    solid: 'var(--jw-ocean)',
    solidFg: '#fff'
  },
  neutral: {
    soft: 'var(--jw-mist)',
    softFg: 'var(--jw-ink-600)',
    solid: 'var(--jw-ink)',
    solidFg: '#fff'
  }
};

/** Compact status/label pill. */
function Badge({
  children,
  tone = 'teal',
  variant = 'soft',
  dot = false,
  style = {}
}) {
  const t = TONES[tone] || TONES.teal;
  const solid = variant === 'solid';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 11px',
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-xs)',
      fontWeight: 'var(--fw-bold)',
      lineHeight: 1.4,
      letterSpacing: '0.01em',
      background: solid ? t.solid : t.soft,
      color: solid ? t.solidFg : t.softFg,
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: solid ? t.solidFg : t.solid
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Badge.jsx", error: String((e && e.message) || e) }); }

// components/content/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * Generic surface container. Warm-white, 20px radius. Choose elevation via
 * `border` (hairline) or `shadow` (soft) — not both heavily. `leaf` rounds one
 * diagonal pair of corners for an organic accent. `interactive` lifts on hover.
 */
function Card({
  children,
  elevation = 'border',
  // 'border' | 'shadow' | 'flat'
  leaf = false,
  interactive = false,
  padding = 'var(--space-6)',
  background = 'var(--bg-surface)',
  style = {},
  onClick,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const radius = leaf ? 'var(--radius-leaf)' : 'var(--radius-lg)';
  const boxShadow = elevation === 'shadow' ? interactive && hover ? 'var(--shadow-lg)' : 'var(--shadow-md)' : interactive && hover ? 'var(--shadow-md)' : 'none';
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background,
      borderRadius: radius,
      border: elevation === 'border' ? '1px solid var(--border-default)' : '1px solid transparent',
      boxShadow,
      padding,
      cursor: onClick ? 'pointer' : 'default',
      transform: interactive && hover ? 'translateY(-4px)' : 'translateY(0)',
      transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-standard)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Card.jsx", error: String((e && e.message) || e) }); }

// components/content/FeatureCard.jsx
try { (() => {
const {
  useState
} = React;
const TINTS = {
  teal: {
    bg: 'var(--jw-teal-100)',
    fg: 'var(--jw-teal-700)'
  },
  orange: {
    bg: 'var(--jw-orange-100)',
    fg: 'var(--jw-orange-700)'
  },
  amber: {
    bg: 'var(--jw-amber-100)',
    fg: 'var(--jw-amber-700)'
  },
  ocean: {
    bg: '#e2eef5',
    fg: 'var(--jw-ocean-700)'
  }
};

/**
 * Service / feature card: a tinted icon disc, title and short description.
 * `icon` is any node — a Lucide glyph or the brand's illustrated PNG (<img>).
 * Used across the services grid. Lifts gently on hover.
 */
function FeatureCard({
  icon,
  title,
  children,
  tone = 'teal',
  style = {}
}) {
  const [hover, setHover] = useState(false);
  const t = TINTS[tone] || TINTS.teal;
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6)',
      boxShadow: hover ? 'var(--shadow-md)' : 'none',
      transform: hover ? 'translateY(-4px)' : 'translateY(0)',
      transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-standard)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 64,
      borderRadius: '50%',
      background: t.bg,
      color: t.fg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 30,
      marginBottom: 'var(--space-4)'
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--fs-lg)',
      color: 'var(--text-primary)',
      marginBottom: 'var(--space-2)'
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-secondary)',
      lineHeight: 1.6
    }
  }, children));
}
Object.assign(__ds_scope, { FeatureCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/FeatureCard.jsx", error: String((e && e.message) || e) }); }

// components/content/SectionHeading.jsx
try { (() => {
/**
 * Section heading block: coloured eyebrow, wide display title, optional lede.
 * `align` and text direction follow the surrounding dir (RTL-safe).
 */
function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'start',
  accent = 'teal',
  style = {}
}) {
  const eyebrowColor = accent === 'orange' ? 'var(--jw-orange)' : accent === 'amber' ? 'var(--jw-amber-700)' : 'var(--jw-teal)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: align,
      maxWidth: 720,
      marginInline: align === 'center' ? 'auto' : 0,
      ...style
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-sm)',
      fontWeight: 'var(--fw-bold)',
      letterSpacing: 'var(--ls-caps)',
      textTransform: 'uppercase',
      color: eyebrowColor,
      marginBottom: 'var(--space-3)'
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-extrabold)',
      fontSize: 'var(--fs-3xl)',
      lineHeight: 1.15,
      color: 'var(--text-primary)',
      margin: 0
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-4)',
      fontSize: 'var(--fs-md)',
      color: 'var(--text-secondary)',
      lineHeight: 1.65
    }
  }, description));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/content/StatCard.jsx
try { (() => {
const ACCENTS = {
  teal: 'var(--jw-teal)',
  orange: 'var(--jw-orange)',
  amber: 'var(--jw-amber-700)',
  ocean: 'var(--jw-ocean)'
};

/**
 * Big-number stat block — the brand leans hard on stats (25k m², 1,200 m…).
 * Number is display-weight; label sits beneath. RTL-safe.
 */
function StatCard({
  value,
  label,
  unit,
  accent = 'teal',
  align = 'start',
  style = {}
}) {
  const color = ACCENTS[accent] || ACCENTS.teal;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: align,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-extrabold)',
      fontSize: 'var(--fs-4xl)',
      lineHeight: 1,
      color,
      letterSpacing: '0.01em',
      display: 'flex',
      alignItems: 'baseline',
      gap: '4px',
      justifyContent: align === 'center' ? 'center' : 'flex-start'
    }
  }, value, unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-lg)',
      fontWeight: 'var(--fw-bold)'
    }
  }, unit)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-2)',
      fontSize: 'var(--fs-sm)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-secondary)',
      lineHeight: 1.4
    }
  }, label));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/content/Tag.jsx
try { (() => {
const {
  useState
} = React;
/** Category chip / filter tag. Outlined pill; optional active state and remove. */
function Tag({
  children,
  active = false,
  tone = 'teal',
  onClick,
  onRemove,
  style = {}
}) {
  const [hover, setHover] = useState(false);
  const accent = tone === 'orange' ? 'var(--jw-orange)' : tone === 'amber' ? 'var(--jw-amber-700)' : 'var(--jw-teal)';
  const accentSoft = tone === 'orange' ? 'var(--jw-orange-100)' : tone === 'amber' ? 'var(--jw-amber-100)' : 'var(--jw-teal-100)';
  return /*#__PURE__*/React.createElement("span", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '7px',
      padding: '7px 14px',
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-sm)',
      fontWeight: 'var(--fw-semibold)',
      cursor: onClick ? 'pointer' : 'default',
      background: active ? accent : hover && onClick ? accentSoft : 'transparent',
      color: active ? '#fff' : 'var(--jw-ink)',
      border: `1.5px solid ${active ? accent : 'var(--border-default)'}`,
      transition: 'all var(--dur-fast) var(--ease-standard)',
      ...style
    }
  }, children, onRemove && /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.stopPropagation();
      onRemove();
    },
    style: {
      fontWeight: 700,
      opacity: 0.7,
      cursor: 'pointer',
      fontSize: '1.1em',
      lineHeight: 1
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Tag.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * Text input with a warm hairline that turns teal on focus. RTL-safe (label
 * and text align to the surrounding dir). Supports an optional leading icon,
 * helper/error text.
 */
function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  helper,
  error,
  disabled = false,
  leadingIcon = null,
  id,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = useState(false);
  const borderColor = error ? 'var(--jw-orange)' : focus ? 'var(--jw-teal)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      display: 'block',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 'var(--fs-sm)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-primary)',
      marginBottom: 'var(--space-2)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      background: disabled ? 'var(--jw-mist)' : 'var(--bg-surface)',
      border: `1.5px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      padding: '0 14px',
      boxShadow: focus ? '0 0 0 3px var(--focus-ring)' : 'none',
      transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)'
    }
  }, leadingIcon && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      display: 'flex'
    }
  }, leadingIcon), /*#__PURE__*/React.createElement("input", _extends({
    id: id,
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      padding: '12px 0',
      fontFamily: 'inherit',
      fontSize: 'var(--fs-base)',
      color: 'var(--text-primary)',
      width: '100%'
    }
  }, rest))), (helper || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginTop: 'var(--space-2)',
      fontSize: 'var(--fs-xs)',
      color: error ? 'var(--jw-orange)' : 'var(--text-muted)'
    }
  }, error || helper));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/App.jsx
try { (() => {
// J WALK website — app shell. Handles language/dir + header scroll state.
function App() {
  const [lang, setLang] = React.useState('ar');
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const el = document.getElementById('scrollroot');
    const onScroll = () => setScrolled((el ? el.scrollTop : window.scrollY) > 40);
    const target = el || window;
    target.addEventListener('scroll', onScroll);
    return () => target.removeEventListener('scroll', onScroll);
  }, []);
  React.useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);
  const {
    JWHeader,
    JWHero,
    JWHome,
    JWFooter
  } = window;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: lang === 'ar' ? 'var(--font-arabic)' : 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement(JWHeader, {
    lang: lang,
    setLang: setLang,
    scrolled: scrolled
  }), /*#__PURE__*/React.createElement(JWHero, {
    lang: lang
  }), /*#__PURE__*/React.createElement(JWHome, {
    lang: lang
  }), /*#__PURE__*/React.createElement(JWFooter, {
    lang: lang
  }));
}
Object.assign(window, {
  JWApp: App
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Footer.jsx
try { (() => {
// J WALK footer — brand blurb, links, contact, on the ink field.
function Footer({
  lang
}) {
  const D = window.JW_DATA;
  const t = o => typeof o === 'string' ? o : o[lang];
  const blurb = lang === 'ar' ? 'جي ووك مجمع تجاري في حديقة الجماوات بالمدينة المنورة، يقدم تجربة عصرية للتسوق تواكب رؤية ٢٠٣٠.' : 'J WALK is a retail destination in Al-Jammawat Park, Madinah — a modern shopping experience aligned with Vision 2030.';
  const linksTitle = lang === 'ar' ? 'روابط هامة' : 'Quick links';
  const addrTitle = lang === 'ar' ? 'العنوان' : 'Address';
  const addr = lang === 'ar' ? 'تقاطع طريق الإمام مسلم مع طريق الأمير نايف بن عبدالعزيز — حي الدفاع — المدينة المنورة' : 'Imam Muslim Rd × Prince Nayef bin Abdulaziz Rd — Al-Difa\u2019a — Madinah';
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--jw-ink)',
      color: 'var(--jw-cloud)',
      padding: '64px 24px 28px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.6fr 1fr 1.4fr',
      gap: 40
    },
    className: "jw-foot"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-horizontal-white.png",
    style: {
      height: 44
    },
    alt: "J WALK",
    onError: e => {
      e.target.style.display = 'none';
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 18,
      color: 'rgba(250,248,243,0.72)',
      lineHeight: 1.7,
      maxWidth: 360
    }
  }, blurb), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 20
    }
  }, ['Instagram', 'Facebook', 'Twitter'].map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    style: {
      width: 38,
      height: 38,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 12,
      fontWeight: 700
    }
  }, s[0])))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 'var(--fs-sm)',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--jw-amber)',
      marginBottom: 16
    }
  }, linksTitle), D.nav.slice(0, 5).map((n, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: '6px 0'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'rgba(250,248,243,0.82)'
    }
  }, t(n))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 'var(--fs-sm)',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--jw-amber)',
      marginBottom: 16
    }
  }, addrTitle), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(250,248,243,0.82)',
      lineHeight: 1.7
    }
  }, addr), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 14,
      color: 'rgba(250,248,243,0.82)'
    }
  }, "info@jwalksa.com \xB7 920013195"))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '40px auto 0',
      paddingTop: 20,
      borderTop: '1px solid rgba(255,255,255,0.12)',
      color: 'rgba(250,248,243,0.5)',
      fontSize: 'var(--fs-sm)'
    }
  }, lang === 'ar' ? 'جميع الحقوق محفوظة © 2026 جي ووك' : 'All rights reserved © 2026 J WALK'));
}
Object.assign(window, {
  JWFooter: Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Header.jsx
try { (() => {
// J WALK site header — logo, nav, language toggle, mobile menu.
function Header({
  lang,
  setLang,
  scrolled
}) {
  const D = window.JW_DATA;
  const [open, setOpen] = React.useState(false);
  const t = o => typeof o === 'string' ? o : o[lang];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 40,
      background: scrolled ? 'rgba(50,117,103,0.94)' : 'transparent',
      backdropFilter: scrolled ? 'saturate(140%) blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.14)' : '1px solid transparent',
      transition: 'all var(--dur-base) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-horizontal-white.png",
    style: {
      height: 40
    },
    onError: e => {
      e.target.style.display = 'none';
    },
    alt: "J WALK"
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 4,
      marginInlineStart: 'auto'
    },
    className: "jw-desktop-nav"
  }, D.nav.map((n, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    style: {
      padding: '8px 14px',
      borderRadius: 'var(--radius-pill)',
      fontSize: 'var(--fs-sm)',
      fontWeight: 600,
      color: '#fff',
      whiteSpace: 'nowrap'
    },
    onMouseEnter: e => {
      e.target.style.background = 'rgba(255,255,255,0.16)';
    },
    onMouseLeave: e => {
      e.target.style.background = 'transparent';
    }
  }, t(n)))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setLang(lang === 'ar' ? 'en' : 'ar'),
    style: {
      marginInlineStart: 'auto',
      border: '1.5px solid rgba(255,255,255,0.7)',
      background: 'transparent',
      color: '#fff',
      borderRadius: 'var(--radius-pill)',
      padding: '7px 16px',
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 13,
      cursor: 'pointer'
    }
  }, lang === 'ar' ? 'English' : 'العربية')));
}
Object.assign(window, {
  JWHeader: Header
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
// J WALK hero — full-bleed video with scrim, logo mark, tagline, CTAs.
function Hero({
  lang
}) {
  const D = window.JW_DATA;
  const {
    Button
  } = window.JWALKDesignSystem_fc112c;
  const t = o => typeof o === 'string' ? o : o[lang];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      minHeight: '92vh',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("video", {
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    poster: D.cdn + 'WhatsApp-Image-2025-02-26-at-11.15.13_b32ed53e.webp'
  }, /*#__PURE__*/React.createElement("source", {
    src: D.cdn + 'j-walk-video-1.mp4',
    type: "video/mp4"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, rgba(43,42,40,0.55) 0%, rgba(43,42,40,0.25) 40%, rgba(43,42,40,0.7) 100%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 1320,
      margin: '0 auto',
      padding: '0 24px',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 640
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "jw-display",
    style: {
      color: '#fff',
      fontSize: 'clamp(40px, 7vw, 76px)',
      fontWeight: 800,
      letterSpacing: '0.02em',
      lineHeight: 1.05
    }
  }, t(D.hero.tagline)), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(255,255,255,0.92)',
      fontSize: 'var(--fs-lg)',
      lineHeight: 1.7,
      marginTop: 20,
      maxWidth: 520
    }
  }, t(D.hero.sub)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      marginTop: 32,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg"
  }, t(D.hero.cta1)), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "lg",
    style: {
      color: '#fff',
      borderColor: 'rgba(255,255,255,0.8)'
    }
  }, t(D.hero.cta2))))));
}
Object.assign(window, {
  JWHero: Hero
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Home.jsx
try { (() => {
// J WALK home body — services, about, stats band, location.
function Section({
  children,
  bg,
  style
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: bg || 'transparent',
      padding: 'clamp(56px,8vw,100px) 24px',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, children));
}
function Home({
  lang
}) {
  const D = window.JW_DATA;
  const {
    SectionHeading,
    FeatureCard,
    StatCard,
    Button,
    Badge
  } = window.JWALKDesignSystem_fc112c;
  const t = o => typeof o === 'string' ? o : o && o[lang] || '';
  const start = lang === 'ar' ? 'start' : 'start';
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Section, {
    bg: "var(--bg-page)"
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    align: "center",
    eyebrow: lang === 'ar' ? 'خدماتنا' : 'Our services',
    title: lang === 'ar' ? 'كل ما تحتاجه العائلة في مكان واحد' : 'Everything the family needs, in one place'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
      gap: 18,
      marginTop: 44
    }
  }, D.services.map((s, i) => /*#__PURE__*/React.createElement(FeatureCard, {
    key: i,
    tone: s.tone,
    icon: /*#__PURE__*/React.createElement("img", {
      src: D.cdn + s.icon,
      style: {
        width: 40,
        height: 40,
        objectFit: 'contain'
      },
      alt: "",
      onError: e => {
        e.target.style.opacity = 0;
      }
    }),
    title: t(s)
  })))), /*#__PURE__*/React.createElement(Section, {
    bg: "var(--bg-surface)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 64
    }
  }, D.about.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 48,
      alignItems: 'center'
    },
    className: "jw-split"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      order: i % 2 === 0 ? 0 : 1
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: D.cdn + a.img,
    style: {
      width: '100%',
      height: 360,
      objectFit: 'cover',
      borderRadius: 'var(--radius-leaf)',
      boxShadow: 'var(--shadow-lg)'
    },
    alt: "",
    onError: e => {
      e.target.style.background = 'var(--jw-teal-100)';
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Badge, {
    tone: i % 2 === 0 ? 'teal' : 'amber'
  }, lang === 'ar' ? 'عن جي ووك' : 'About J WALK'), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 'var(--fs-3xl)',
      margin: '16px 0',
      lineHeight: 1.2
    }
  }, t(a.title)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--fs-md)',
      color: 'var(--text-secondary)',
      lineHeight: 1.75
    }
  }, t(a.body)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline"
  }, lang === 'ar' ? 'اقرأ المزيد' : 'Read more'))))))), /*#__PURE__*/React.createElement(Section, {
    bg: "var(--jw-teal)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
      gap: 32,
      textAlign: 'center'
    }
  }, D.stats.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 'var(--fs-5xl)',
      lineHeight: 1,
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'center',
      gap: 6
    }
  }, s.value, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-xl)'
    }
  }, t(s.unit))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontWeight: 600,
      opacity: 0.92
    }
  }, t(s.label)))))), /*#__PURE__*/React.createElement(Section, {
    bg: "var(--bg-page)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 48,
      alignItems: 'center'
    },
    className: "jw-split"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: lang === 'ar' ? 'الوصول إلينا' : 'Getting here',
    title: t(D.location.title),
    description: t(D.location.body),
    accent: "orange"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16,
      margin: '28px 0'
    }
  }, D.distances.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: D.cdn + d.icon,
    style: {
      width: 34,
      height: 34,
      objectFit: 'contain'
    },
    alt: "",
    onError: e => {
      e.target.style.opacity = 0;
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--jw-teal-700)'
    }
  }, d.v, " ", t(d.u)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-secondary)'
    }
  }, t(d)))))), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg"
  }, t(D.location.cta))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-lg)',
      minHeight: 300
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: D.cdn + 'Screenshot_32.png',
    style: {
      width: '100%',
      height: '100%',
      minHeight: 300,
      objectFit: 'cover'
    },
    alt: "map",
    onError: e => {
      e.target.style.background = 'var(--jw-aqua)';
    }
  })))));
}
Object.assign(window, {
  JWHome: Home
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/data.js
try { (() => {
// J WALK website — bilingual content model. Plain script: sets window.JW_DATA.
window.JW_DATA = {
  nav: [{
    ar: 'الرئيسية',
    en: 'Home'
  }, {
    ar: 'من نحن',
    en: 'About'
  }, {
    ar: 'خدماتنا',
    en: 'Services'
  }, {
    ar: 'المتاجر',
    en: 'Stores'
  }, {
    ar: 'المساحات التأجيرية',
    en: 'Rental Spaces'
  }, {
    ar: 'الأخبار والفعاليات',
    en: 'News & Events'
  }],
  hero: {
    tagline: {
      ar: 'مفهوم مبتكر للتسوق',
      en: 'An innovative concept for shopping'
    },
    sub: {
      ar: 'وجهة تسوق وترفيه للعائلات في حديقة الجماوات بالمدينة المنورة — طبيعة، مطاعم، ونافورة راقصة.',
      en: 'A family shopping & leisure destination in Al-Jammawat Park, Madinah — nature, dining and a dancing fountain.'
    },
    cta1: {
      ar: 'خدماتنا',
      en: 'Services'
    },
    cta2: {
      ar: 'المتاجر',
      en: 'Stores'
    }
  },
  services: [{
    icon: 'romantic-dinner-1.png',
    ar: 'مطاعم ومقاهي',
    en: 'Restaurants & cafés',
    tone: 'orange'
  }, {
    icon: 'chair.png',
    ar: 'جلسات خارجية',
    en: 'Outdoor seating',
    tone: 'teal'
  }, {
    icon: 'fountain.png',
    ar: 'نافورة راقصة',
    en: 'Dancing fountain',
    tone: 'ocean'
  }, {
    icon: 'location.png',
    ar: 'مكاتب إدارية',
    en: 'Admin offices',
    tone: 'teal'
  }, {
    icon: 'playground.png',
    ar: 'منطقة ألعاب أطفال',
    en: "Kids' playground",
    tone: 'amber'
  }, {
    icon: 'plant.png',
    ar: 'ساحات خضراء',
    en: 'Green spaces',
    tone: 'teal'
  }, {
    icon: 'shopping-store.png',
    ar: 'متاجر عالمية',
    en: 'Global stores',
    tone: 'orange'
  }],
  stats: [{
    value: '25',
    unit: {
      ar: 'ألف م²',
      en: 'k m²'
    },
    label: {
      ar: 'مسطحات خضراء',
      en: 'Green space'
    },
    accent: 'teal'
  }, {
    value: '9',
    unit: '',
    label: {
      ar: 'مناطق تأجيرية',
      en: 'Rental zones'
    },
    accent: 'orange'
  }, {
    value: '1,200',
    unit: {
      ar: 'م',
      en: 'm'
    },
    label: {
      ar: 'ممشى رياضي',
      en: 'Walking track'
    },
    accent: 'amber'
  }, {
    value: '737',
    unit: {
      ar: 'م',
      en: 'm'
    },
    label: {
      ar: 'مسار دراجات',
      en: 'Bike track'
    },
    accent: 'ocean'
  }],
  distances: [{
    icon: 'dome.png',
    v: '7',
    u: {
      ar: 'كم',
      en: 'km'
    },
    ar: 'المسجد النبوي',
    en: "Prophet's Mosque"
  }, {
    icon: 'train.png',
    v: '20',
    u: {
      ar: 'كم',
      en: 'km'
    },
    ar: 'قطار الحرمين',
    en: 'Haramain train'
  }, {
    icon: 'airplane1.png',
    v: '30',
    u: {
      ar: 'كم',
      en: 'km'
    },
    ar: 'مطار الأمير محمد',
    en: 'Prince Mohammad airport'
  }, {
    icon: 'bus.png',
    v: '100',
    u: {
      ar: 'م',
      en: 'm'
    },
    ar: 'حافلات المدينة',
    en: 'City buses'
  }],
  about: [{
    img: 'WhatsApp-Image-2025-02-26-at-11.15.10_50dfae37.webp',
    title: {
      ar: 'تجربة تسوق مثالية ومتكاملة',
      en: 'A complete shopping experience'
    },
    body: {
      ar: 'انضم إلى جي ووك وامنح عملائك تجربة مميزة. مساحات تأجيرية بجلسات خارجية مطلة على النافورة الراقصة، وأفضل العلامات التجارية العالمية.',
      en: 'Join J WALK and give your customers a memorable experience — rental spaces with outdoor seating overlooking the dancing fountain, and the best global brands.'
    }
  }, {
    img: 'WhatsApp-Image-2025-02-26-at-11.15.13_b32ed53e.webp',
    title: {
      ar: 'نافورة راقصة وتجربة لا تُنسى',
      en: 'A dancing fountain, unforgettable'
    },
    body: {
      ar: 'استمتع بجمال النوافير الراقصة الفريدة في جي ووك، وأمسية لا تُنسى مع العائلة والأصدقاء وسط أجواء ترفيهية ومشاهد خلابة.',
      en: 'Enjoy the unique dancing fountains at J WALK — an unforgettable evening with family and friends amid stunning views and a festive atmosphere.'
    }
  }],
  location: {
    title: {
      ar: 'موقع جي ووك',
      en: 'Where to find us'
    },
    body: {
      ar: 'حي الدفاع، تقاطع طريق الأمير نايف مع طريق الإمام مسلم، المدينة المنورة — بإطلالة على حديقة الجماوات.',
      en: 'Al-Difa\u2019a district, Prince Nayef Rd × Imam Muslim Rd, Madinah — overlooking Al-Jammawat Park.'
    },
    cta: {
      ar: 'التوجّه إلى جي ووك',
      en: 'Get directions'
    }
  },
  cdn: 'https://jwalksa.com/wp-content/uploads/'
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.FeatureCard = __ds_scope.FeatureCard;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Input = __ds_scope.Input;

})();
