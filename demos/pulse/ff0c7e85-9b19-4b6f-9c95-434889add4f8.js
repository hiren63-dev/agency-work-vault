function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// gms/ui.jsx — Base UI components (novice-friendly, larger, clearer)
var _window = window,
  React = _window.React;
var useState = React.useState,
  useEffect = React.useEffect,
  useRef = React.useRef;

// ── Toast System ─────────────────────────────────────────────
var _setToasts = null;
function showToast(msg) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'success';
  if (!_setToasts) return;
  var id = Date.now() + Math.random();
  _setToasts(function (prev) {
    return [].concat(_toConsumableArray(prev), [{
      id: id,
      msg: msg,
      type: type
    }]);
  });
  setTimeout(function () {
    return _setToasts(function (prev) {
      return prev.filter(function (t) {
        return t.id !== id;
      });
    });
  }, 3800);
}
window.showToast = showToast;
function ToastContainer() {
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    toasts = _useState2[0],
    setToasts = _useState2[1];
  useEffect(function () {
    _setToasts = setToasts;
    return function () {
      _setToasts = null;
    };
  }, []);
  var colors = {
    success: '#059669',
    error: '#dc2626',
    info: '#2563eb',
    warning: '#d97706'
  };
  var accents = {
    success: 'rgba(255,255,255,0.25)',
    error: 'rgba(255,255,255,0.25)',
    info: 'rgba(255,255,255,0.25)',
    warning: 'rgba(255,255,255,0.25)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 28,
      right: 28,
      display: 'flex',
      flexDirection: 'column-reverse',
      gap: 10,
      zIndex: 9999,
      pointerEvents: 'none'
    }
  }, toasts.map(function (t) {
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '13px 20px',
        borderRadius: 12,
        background: colors[t.type] || colors.success,
        color: '#fff',
        fontSize: 14,
        fontWeight: 600,
        fontFamily: 'inherit',
        letterSpacing: '-0.01em',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        animation: 'toastIn 0.25s ease',
        minWidth: 260,
        maxWidth: 400,
        pointerEvents: 'all'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.6)',
        flexShrink: 0
      }
    }), t.msg);
  }));
}

// ── Confirm Dialog ────────────────────────────────────────────
var _confirmResolve = null;
var _setConfirmState = null;
function gmsConfirm(message) {
  var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Are you sure?';
  var confirmLabel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Yes, Delete';
  var cancelLabel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'No, Go Back';
  return new Promise(function (resolve) {
    _confirmResolve = resolve;
    if (_setConfirmState) _setConfirmState({
      message: message,
      title: title,
      confirmLabel: confirmLabel,
      cancelLabel: cancelLabel
    });
  });
}
window.gmsConfirm = gmsConfirm;
function ConfirmDialogHost() {
  var _useState3 = useState(null),
    _useState4 = _slicedToArray(_useState3, 2),
    state = _useState4[0],
    setState = _useState4[1];
  useEffect(function () {
    _setConfirmState = setState;
    return function () {
      _setConfirmState = null;
    };
  }, []);
  if (!state) return null;
  function answer(val) {
    if (_confirmResolve) {
      _confirmResolve(val);
      _confirmResolve = null;
    }
    setState(null);
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 500,
      backdropFilter: 'blur(4px)',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-1)',
      borderRadius: 20,
      padding: 40,
      maxWidth: 400,
      width: '100%',
      textAlign: 'center',
      animation: 'modalIn 0.2s ease',
      boxShadow: '0 24px 64px rgba(0,0,0,0.2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 52,
      marginBottom: 18,
      lineHeight: 1
    }
  }, "\u26A0\uFE0F"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      color: 'var(--t-1)',
      marginBottom: 12
    }
  }, state.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      color: 'var(--t-2)',
      lineHeight: 1.65,
      marginBottom: 32
    }
  }, state.message), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "secondary",
    size: "lg",
    onClick: function onClick() {
      return answer(false);
    }
  }, state.cancelLabel), /*#__PURE__*/React.createElement(Btn, {
    variant: "danger",
    size: "lg",
    onClick: function onClick() {
      return answer(true);
    }
  }, state.confirmLabel))));
}

// ── Avatar ────────────────────────────────────────────────────
var _AVATAR_PALETTE = ['#4A7CC4', '#7A5DC8', '#3A9E7A', '#C47A35', '#C4556A', '#3A9BB5', '#B45DA0', '#5461C5', '#3DA898', '#A87048'];
function Avatar(_ref) {
  var name = _ref.name,
    color = _ref.color,
    _ref$size = _ref.size,
    size = _ref$size === void 0 ? 36 : _ref$size,
    src = _ref.src;
  var firstName = (name || '?').trim().split(' ')[0];
  var letter = (firstName[0] || '?').toUpperCase();
  var idx = Math.abs(letter.charCodeAt(0) - 65 + 26) % _AVATAR_PALETTE.length;
  var bg = color || _AVATAR_PALETTE[idx];
  var s = {
    width: size,
    height: size,
    borderRadius: '50%',
    background: bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 500,
    fontSize: Math.round(size * 0.40),
    flexShrink: 0,
    letterSpacing: '-0.01em',
    overflow: 'hidden',
    userSelect: 'none',
    boxShadow: "inset 0 -1px 3px rgba(0,0,0,0.18), inset 0 1px 1px rgba(255,255,255,0.22)"
  };
  if (src) return /*#__PURE__*/React.createElement("div", {
    style: s
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    alt: name
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: s
  }, letter);
}

// ── Badge ─────────────────────────────────────────────────────
var BADGE_MAP = {
  active: {
    bg: 'rgba(5,150,105,0.10)',
    color: '#059669',
    dot: '#059669',
    text: 'Active'
  },
  expired: {
    bg: 'rgba(220,38,38,0.10)',
    color: '#dc2626',
    dot: '#dc2626',
    text: 'Expired'
  },
  expiring: {
    bg: 'rgba(217,119,6,0.12)',
    color: '#d97706',
    dot: '#d97706',
    text: 'Expiring Soon'
  },
  frozen: {
    bg: 'rgba(37,99,235,0.10)',
    color: '#2563eb',
    dot: '#2563eb',
    text: 'Frozen'
  },
  "new": {
    bg: 'rgba(37,99,235,0.10)',
    color: '#2563eb',
    dot: '#2563eb',
    text: 'New'
  },
  followup: {
    bg: 'rgba(217,119,6,0.12)',
    color: '#d97706',
    dot: '#d97706',
    text: 'Follow-up'
  },
  demo: {
    bg: 'rgba(124,58,237,0.10)',
    color: '#7c3aed',
    dot: '#7c3aed',
    text: 'Demo Scheduled'
  },
  converted: {
    bg: 'rgba(5,150,105,0.10)',
    color: '#059669',
    dot: '#059669',
    text: 'Converted'
  },
  lost: {
    bg: 'rgba(113,113,122,0.10)',
    color: '#71717a',
    dot: '#71717a',
    text: 'Lost'
  }
};
function Badge(_ref2) {
  var status = _ref2.status,
    label = _ref2.label;
  var m = BADGE_MAP[status] || BADGE_MAP.frozen;
  var text = label || m.text;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '5px 12px',
      borderRadius: 30,
      fontSize: 13,
      fontWeight: 700,
      background: m.bg,
      color: m.color
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: m.dot,
      flexShrink: 0
    }
  }), text);
}

// ── Button ────────────────────────────────────────────────────
function Btn(_ref3) {
  var children = _ref3.children,
    _ref3$variant = _ref3.variant,
    variant = _ref3$variant === void 0 ? 'primary' : _ref3$variant,
    _ref3$size = _ref3.size,
    size = _ref3$size === void 0 ? 'md' : _ref3$size,
    _ref3$full = _ref3.full,
    full = _ref3$full === void 0 ? false : _ref3$full,
    onClick = _ref3.onClick,
    disabled = _ref3.disabled,
    _ref3$style = _ref3.style,
    style = _ref3$style === void 0 ? {} : _ref3$style,
    _ref3$type = _ref3.type,
    type = _ref3$type === void 0 ? 'button' : _ref3$type;
  var sizes = {
    sm: {
      padding: '7px 14px',
      fontSize: 13,
      borderRadius: 8,
      gap: 5
    },
    md: {
      padding: '10px 20px',
      fontSize: 14.5,
      borderRadius: 10,
      gap: 7
    },
    lg: {
      padding: '13px 26px',
      fontSize: 16,
      borderRadius: 12,
      gap: 8
    }
  };
  var gloss = 'linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.02) 45%, rgba(0,0,0,0.11) 100%)';
  var variants = {
    primary: {
      background: "".concat(gloss, ", var(--accent)"),
      color: '#fff',
      borderColor: 'var(--accent)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.30), 0 1px 3px rgba(0,0,0,0.18), 0 4px 18px var(--accent-muted)'
    },
    secondary: {
      background: 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, var(--bg-3) 100%)',
      color: 'var(--t-1)',
      borderColor: 'var(--border)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65), 0 1px 2px rgba(0,0,0,0.07)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--t-2)',
      borderColor: 'transparent'
    },
    danger: {
      background: 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(0,0,0,0.04) 100%), rgba(220,38,38,0.09)',
      color: '#dc2626',
      borderColor: 'rgba(220,38,38,0.22)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 1px 2px rgba(0,0,0,0.06)'
    },
    success: {
      background: "".concat(gloss, ", #059669"),
      color: '#fff',
      borderColor: '#059669',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.28), 0 1px 3px rgba(0,0,0,0.18), 0 4px 18px rgba(5,150,105,0.32)'
    }
  };
  var sz = sizes[size] || sizes.md;
  var vr = variants[variant] || variants.primary;
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    style: _objectSpread(_objectSpread(_objectSpread({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: sz.gap,
      fontFamily: 'inherit',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      cursor: disabled ? 'not-allowed' : 'pointer',
      border: "1.5px solid ".concat(vr.borderColor),
      borderRadius: sz.borderRadius,
      padding: sz.padding,
      fontSize: sz.fontSize,
      transition: 'all 0.16s cubic-bezier(0.25,0.46,0.45,0.94)',
      opacity: disabled ? 0.5 : 1,
      outline: 'none',
      whiteSpace: 'nowrap'
    }, full ? {
      width: '100%'
    } : {}), vr), style),
    onClick: onClick,
    disabled: disabled,
    onMouseEnter: function onMouseEnter(e) {
      if (!disabled) {
        e.currentTarget.style.filter = 'brightness(0.93)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }
    },
    onMouseLeave: function onMouseLeave(e) {
      e.currentTarget.style.filter = 'none';
      e.currentTarget.style.transform = 'none';
    }
  }, children);
}

// ── Input ─────────────────────────────────────────────────────
function Input(_ref4) {
  var label = _ref4.label,
    value = _ref4.value,
    _onChange = _ref4.onChange,
    placeholder = _ref4.placeholder,
    _ref4$type = _ref4.type,
    type = _ref4$type === void 0 ? 'text' : _ref4$type,
    required = _ref4.required,
    icon = _ref4.icon,
    _ref4$as = _ref4.as,
    as = _ref4$as === void 0 ? 'input' : _ref4$as,
    _ref4$options = _ref4.options,
    options = _ref4$options === void 0 ? [] : _ref4$options,
    _ref4$rows = _ref4.rows,
    rows = _ref4$rows === void 0 ? 3 : _ref4$rows,
    hint = _ref4.hint,
    error = _ref4.error;
  var base = {
    width: '100%',
    background: 'var(--bg-2)',
    border: "1.5px solid ".concat(error ? '#dc2626' : 'var(--border)'),
    borderRadius: 10,
    padding: icon ? '12px 14px 12px 44px' : '12px 14px',
    fontSize: 15,
    color: 'var(--t-1)',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    minHeight: as === 'textarea' ? undefined : 48
  };
  var id = 'inp-' + (label || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      display: 'block',
      fontSize: 13.5,
      fontWeight: 500,
      color: 'var(--t-2)',
      marginBottom: 6,
      letterSpacing: '-0.005em'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#dc2626',
      marginLeft: 4
    }
  }, "*")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 13,
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--t-3)',
      display: 'flex',
      pointerEvents: 'none'
    }
  }, icon), as === 'select' ? /*#__PURE__*/React.createElement("select", {
    id: id,
    value: value,
    onChange: function onChange(e) {
      return _onChange(e.target.value);
    },
    style: _objectSpread(_objectSpread({}, base), {}, {
      cursor: 'pointer',
      appearance: 'none',
      WebkitAppearance: 'none',
      paddingRight: 36
    })
  }, options.map(function (o) {
    return /*#__PURE__*/React.createElement("option", {
      key: o.value || o,
      value: o.value || o
    }, o.label || o);
  })) : as === 'textarea' ? /*#__PURE__*/React.createElement("textarea", {
    id: id,
    value: value,
    onChange: function onChange(e) {
      return _onChange(e.target.value);
    },
    placeholder: placeholder,
    rows: rows,
    style: _objectSpread(_objectSpread({}, base), {}, {
      resize: 'vertical'
    })
  }) : /*#__PURE__*/React.createElement("input", {
    id: id,
    type: type,
    value: value,
    onChange: function onChange(e) {
      return _onChange(e.target.value);
    },
    placeholder: placeholder,
    style: base,
    onFocus: function onFocus(e) {
      e.target.style.borderColor = 'var(--accent)';
      e.target.style.boxShadow = "0 0 0 3px var(--accent-muted)";
    },
    onBlur: function onBlur(e) {
      e.target.style.borderColor = error ? '#dc2626' : 'var(--border)';
      e.target.style.boxShadow = 'none';
    }
  })), hint && !error && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12.5,
      color: 'var(--t-3)',
      marginTop: 5,
      lineHeight: 1.4
    }
  }, hint), error && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12.5,
      color: '#dc2626',
      marginTop: 5
    }
  }, error));
}

// ── Modal ─────────────────────────────────────────────────────
function Modal(_ref5) {
  var children = _ref5.children,
    onClose = _ref5.onClose,
    _ref5$width = _ref5.width,
    width = _ref5$width === void 0 ? 600 : _ref5$width,
    title = _ref5.title,
    subtitle = _ref5.subtitle;
  useEffect(function () {
    var h = function h(e) {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', h);
    return function () {
      return window.removeEventListener('keydown', h);
    };
  }, [onClose]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 300,
      padding: 20,
      backdropFilter: 'blur(6px)'
    },
    onClick: function onClick(e) {
      if (e.target === e.currentTarget) onClose();
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-1)',
      border: '1.5px solid var(--border)',
      borderRadius: 20,
      width: '100%',
      maxWidth: width,
      maxHeight: '92vh',
      overflowY: 'auto',
      padding: 32,
      position: 'relative',
      animation: 'modalIn 0.2s ease',
      boxShadow: '0 24px 64px rgba(0,0,0,0.16)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: title || subtitle ? 24 : 0
    }
  }, /*#__PURE__*/React.createElement("div", null, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 800,
      color: 'var(--t-1)'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--t-3)',
      marginTop: 4
    }
  }, subtitle)), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'var(--bg-3)',
      border: '1.5px solid var(--border)',
      borderRadius: 10,
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'var(--t-2)',
      flexShrink: 0,
      marginLeft: 16
    }
  }, React.createElement(window.GmsIcons.X, {
    size: 15
  }))), children));
}

// ── StatCard ──────────────────────────────────────────────────
function StatCard(_ref6) {
  var label = _ref6.label,
    value = _ref6.value,
    sub = _ref6.sub,
    icon = _ref6.icon,
    accent = _ref6.accent,
    trend = _ref6.trend;
  var Icon = icon;
  var c = accent || 'var(--accent)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-1)',
      border: '1.5px solid var(--border)',
      borderRadius: 16,
      padding: '22px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      boxShadow: 'var(--shadow-sm)',
      animation: 'fadeUp 0.3s ease'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--t-2)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 12,
      background: "".concat(c, "18"),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: c
    }
  }, Icon && /*#__PURE__*/React.createElement(Icon, {
    size: 22
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32,
      fontWeight: 700,
      color: 'var(--t-1)',
      letterSpacing: '-0.03em',
      fontVariantNumeric: 'tabular-nums',
      lineHeight: 1
    }
  }, value), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: trend === 'up' ? '#059669' : trend === 'down' ? '#dc2626' : 'var(--t-3)',
      marginTop: 8,
      fontWeight: 500,
      letterSpacing: '-0.005em'
    }
  }, sub)));
}

// ── EmptyState ────────────────────────────────────────────────
function EmptyState(_ref7) {
  var icon = _ref7.icon,
    title = _ref7.title,
    sub = _ref7.sub,
    action = _ref7.action,
    onAction = _ref7.onAction;
  var Icon = icon;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '72px 24px',
      gap: 14,
      color: 'var(--t-3)'
    }
  }, Icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 64,
      borderRadius: 18,
      background: 'var(--bg-3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    size: 28
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 800,
      color: 'var(--t-2)',
      textAlign: 'center'
    }
  }, title), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      textAlign: 'center',
      maxWidth: 320,
      lineHeight: 1.6
    }
  }, sub), action && /*#__PURE__*/React.createElement(Btn, {
    variant: "secondary",
    size: "md",
    onClick: onAction,
    style: {
      marginTop: 8
    }
  }, action));
}

// ── Tabs ──────────────────────────────────────────────────────
function Tabs(_ref8) {
  var tabs = _ref8.tabs,
    active = _ref8.active,
    onChange = _ref8.onChange;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      borderBottom: '2px solid var(--border)',
      marginBottom: 22,
      gap: 0,
      overflowX: 'auto'
    }
  }, tabs.map(function (t) {
    return /*#__PURE__*/React.createElement("button", {
      key: t.id || t,
      onClick: function onClick() {
        return onChange(t.id || t);
      },
      style: {
        padding: '10px 4px',
        marginRight: 22,
        fontSize: 14.5,
        fontWeight: active === (t.id || t) ? 700 : 600,
        color: active === (t.id || t) ? 'var(--accent)' : 'var(--t-3)',
        background: 'none',
        border: 'none',
        borderBottom: "2.5px solid ".concat(active === (t.id || t) ? 'var(--accent)' : 'transparent'),
        marginBottom: -2,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap'
      }
    }, t.label || t);
  }));
}

// ── Table ─────────────────────────────────────────────────────
function Table(_ref9) {
  var cols = _ref9.cols,
    rows = _ref9.rows,
    empty = _ref9.empty,
    emptyIcon = _ref9.emptyIcon;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, cols.map(function (c) {
    return /*#__PURE__*/React.createElement("th", {
      key: c.key,
      style: {
        padding: '13px 16px',
        textAlign: c.right ? 'right' : 'left',
        fontSize: 12,
        fontWeight: 800,
        color: 'var(--t-3)',
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        background: 'var(--bg-3)',
        borderBottom: '1.5px solid var(--border)',
        whiteSpace: 'nowrap'
      }
    }, c.label);
  }))), /*#__PURE__*/React.createElement("tbody", null, rows.length === 0 ? /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: cols.length,
    style: {
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(EmptyState, {
    icon: emptyIcon,
    title: empty || 'No records found',
    sub: "Once you add records here, they will show up in this list."
  }))) : rows)));
}

// ── FilterBar ─────────────────────────────────────────────────
function FilterBar(_ref0) {
  var search = _ref0.search,
    onSearch = _ref0.onSearch,
    _ref0$placeholder = _ref0.placeholder,
    placeholder = _ref0$placeholder === void 0 ? 'Search...' : _ref0$placeholder,
    right = _ref0.right;
  var _window2 = window,
    GmsIcons = _window2.GmsIcons;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 14,
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--t-3)',
      display: 'flex',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement(GmsIcons.Search, {
    size: 16
  })), /*#__PURE__*/React.createElement("input", {
    value: search,
    onChange: function onChange(e) {
      return onSearch(e.target.value);
    },
    placeholder: placeholder,
    style: {
      width: '100%',
      background: 'var(--bg-1)',
      border: '1.5px solid var(--border)',
      borderRadius: 10,
      padding: '11px 14px 11px 42px',
      fontSize: 15,
      color: 'var(--t-1)',
      fontFamily: 'inherit',
      outline: 'none',
      minHeight: 48
    },
    onFocus: function onFocus(e) {
      e.target.style.borderColor = 'var(--accent)';
      e.target.style.boxShadow = '0 0 0 3px var(--accent-muted)';
    },
    onBlur: function onBlur(e) {
      e.target.style.borderColor = 'var(--border)';
      e.target.style.boxShadow = 'none';
    }
  })), right);
}

// ── PageHeader ────────────────────────────────────────────────
function PageHeader(_ref1) {
  var title = _ref1.title,
    sub = _ref1.sub,
    actions = _ref1.actions;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 24,
      fontWeight: 600,
      color: 'var(--t-1)',
      margin: 0,
      letterSpacing: '-0.025em'
    }
  }, title), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13.5,
      color: 'var(--t-3)',
      marginTop: 5,
      fontWeight: 400,
      letterSpacing: '-0.005em'
    }
  }, sub)), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      flexShrink: 0
    }
  }, actions));
}

// ── IconBtn ───────────────────────────────────────────────────
function IconBtn(_ref10) {
  var icon = _ref10.icon,
    danger = _ref10.danger,
    onClick = _ref10.onClick,
    title = _ref10.title;
  var Icon = icon;
  var _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    hov = _useState6[0],
    setHov = _useState6[1];
  return /*#__PURE__*/React.createElement("button", {
    title: title,
    onClick: onClick,
    onMouseEnter: function onMouseEnter() {
      return setHov(true);
    },
    onMouseLeave: function onMouseLeave() {
      return setHov(false);
    },
    style: {
      width: 36,
      height: 36,
      borderRadius: 9,
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.15s',
      fontFamily: 'inherit',
      background: hov ? danger ? 'rgba(220,38,38,0.10)' : 'var(--bg-3)' : 'var(--bg-3)',
      color: hov ? danger ? '#dc2626' : 'var(--t-1)' : 'var(--t-2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    size: 16
  }));
}

// ── ProgressRing ──────────────────────────────────────────────
function ProgressRing(_ref11) {
  var pct = _ref11.pct,
    _ref11$size = _ref11.size,
    size = _ref11$size === void 0 ? 80 : _ref11$size,
    _ref11$stroke = _ref11.stroke,
    stroke = _ref11$stroke === void 0 ? 8 : _ref11$stroke,
    _ref11$color = _ref11.color,
    color = _ref11$color === void 0 ? 'var(--accent)' : _ref11$color,
    label = _ref11.label,
    sub = _ref11.sub;
  var r = (size - stroke) / 2;
  var circ = 2 * Math.PI * r;
  var dash = pct / 100 * circ;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: size,
      height: size,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    style: {
      transform: 'rotate(-90deg)'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "var(--bg-3)",
    strokeWidth: stroke
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: color,
    strokeWidth: stroke,
    strokeDasharray: "".concat(dash, " ").concat(circ),
    strokeLinecap: "round"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: size * 0.22,
      fontWeight: 900,
      color: 'var(--t-1)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, label), sub && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: size * 0.14,
      color: 'var(--t-3)',
      fontWeight: 600
    }
  }, sub)));
}

// ── Stepper ───────────────────────────────────────────────────
function Stepper(_ref12) {
  var steps = _ref12.steps,
    current = _ref12.current;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: 30
    }
  }, steps.map(function (s, i) {
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: s
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        fontWeight: 800,
        flexShrink: 0,
        background: i < current ? '#059669' : i === current ? 'var(--accent)' : 'var(--bg-3)',
        color: i < current ? '#fff' : i === current ? '#fff' : 'var(--t-3)',
        border: i > current ? '2px solid var(--border)' : 'none'
      }
    }, i < current ? React.createElement(window.GmsIcons.Check, {
      size: 15
    }) : i + 1), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: i === current ? 'var(--accent)' : 'var(--t-3)',
        fontWeight: 700,
        whiteSpace: 'nowrap'
      }
    }, s)), i < steps.length - 1 && /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 2.5,
        background: i < current ? '#059669' : 'var(--border)',
        marginBottom: 20,
        margin: '0 10px 20px'
      }
    }));
  }));
}

// ── HelpBox ───────────────────────────────────────────────────
function HelpBox(_ref13) {
  var children = _ref13.children;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '11px 14px',
      background: 'var(--bg-3)',
      borderRadius: 9,
      marginBottom: 16,
      borderLeft: '3px solid var(--border-strong)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--t-3)',
      lineHeight: 1.55,
      fontWeight: 400
    }
  }, children));
}
Object.assign(window, {
  Avatar: Avatar,
  Badge: Badge,
  Btn: Btn,
  Input: Input,
  Modal: Modal,
  StatCard: StatCard,
  EmptyState: EmptyState,
  Tabs: Tabs,
  Table: Table,
  FilterBar: FilterBar,
  PageHeader: PageHeader,
  IconBtn: IconBtn,
  ProgressRing: ProgressRing,
  Stepper: Stepper,
  ToastContainer: ToastContainer,
  ConfirmDialogHost: ConfirmDialogHost,
  HelpBox: HelpBox,
  showToast: showToast
});