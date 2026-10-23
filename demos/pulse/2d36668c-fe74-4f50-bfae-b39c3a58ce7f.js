function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// gms/login.jsx — Real login with email/password + role hints
var _window = window,
  React = _window.React;
var useState = React.useState;
var ROLE_META = {
  owner: {
    label: 'Owner',
    color: '#7c3aed',
    icon: 'ShieldCheck',
    desc: 'Full system access'
  },
  manager: {
    label: 'Manager',
    color: '#2563eb',
    icon: 'Users',
    desc: 'Members, payments & reports'
  },
  trainer: {
    label: 'Trainer',
    color: '#059669',
    icon: 'User',
    desc: 'Attendance & PT sessions'
  },
  receptionist: {
    label: 'Receptionist',
    color: '#d97706',
    icon: 'MessageSquare',
    desc: 'Check-ins & enquiries'
  }
};
function LoginPage(_ref) {
  var onLogin = _ref.onLogin,
    gymName = _ref.gymName,
    gymTagline = _ref.gymTagline;
  var Icons = window.GmsIcons;
  var gName = gymName || 'My Gym';
  var gTag = gymTagline || 'Gym Management System';
  var mono = gName.trim().split(/\s+/).map(function (w) {
    return w[0];
  }).join('').slice(0, 2).toUpperCase();
  var _useState = useState(''),
    _useState2 = _slicedToArray(_useState, 2),
    email = _useState2[0],
    setEmail = _useState2[1];
  var _useState3 = useState(''),
    _useState4 = _slicedToArray(_useState3, 2),
    password = _useState4[0],
    setPassword = _useState4[1];
  var _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    showPass = _useState6[0],
    setShowPass = _useState6[1];
  var _useState7 = useState(''),
    _useState8 = _slicedToArray(_useState7, 2),
    error = _useState8[0],
    setError = _useState8[1];
  var _useState9 = useState(false),
    _useState0 = _slicedToArray(_useState9, 2),
    loading = _useState0[0],
    setLoading = _useState0[1];
  var _useState1 = useState(false),
    _useState10 = _slicedToArray(_useState1, 2),
    hintOpen = _useState10[0],
    setHintOpen = _useState10[1];
  function handleLogin(e) {
    e === null || e === void 0 || e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    setLoading(true);
    setError('');
    setTimeout(function () {
      var user = window.authenticateUser(email, password);
      if (user) {
        setLoading(false);
        onLogin(user);
      } else {
        setLoading(false);
        setError('Incorrect email or password.');
      }
    }, 650);
  }
  function fillCreds(u) {
    setEmail(u.email);
    setPassword(u.password);
    setError('');
    setHintOpen(false);
  }
  var labelStyle = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--t-2)',
    marginBottom: 6,
    letterSpacing: '-0.005em'
  };
  var inputBase = {
    width: '100%',
    background: 'var(--bg-2)',
    borderRadius: 10,
    padding: '12px 14px',
    fontSize: 15,
    color: 'var(--t-1)',
    fontFamily: 'inherit',
    outline: 'none',
    minHeight: 48,
    transition: 'border-color 0.15s, box-shadow 0.15s'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-0)',
      padding: '24px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 420
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 13,
      marginBottom: 36,
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 42,
      height: 42,
      borderRadius: 12,
      background: 'var(--accent)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: 14,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      boxShadow: '0 6px 20px var(--accent-muted)',
      flexShrink: 0
    }
  }, mono), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 700,
      color: 'var(--t-1)',
      letterSpacing: '-0.02em'
    }
  }, gName), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--t-3)',
      fontWeight: 400
    }
  }, gTag))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-1)',
      border: '1.5px solid var(--border)',
      borderRadius: 20,
      padding: '32px 28px',
      boxShadow: 'var(--shadow-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 26
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 22,
      fontWeight: 700,
      color: 'var(--t-1)',
      letterSpacing: '-0.025em',
      marginBottom: 5
    }
  }, "Welcome back"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13.5,
      color: 'var(--t-3)',
      fontWeight: 400,
      lineHeight: 1.55
    }
  }, "Sign in to manage your gym.")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleLogin,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: labelStyle
  }, "Email address"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    value: email,
    autoComplete: "email",
    autoFocus: true,
    onChange: function onChange(e) {
      setEmail(e.target.value);
      setError('');
    },
    placeholder: "you@gym.com",
    style: _objectSpread(_objectSpread({}, inputBase), {}, {
      border: "1.5px solid ".concat(error && !email ? '#dc2626' : 'var(--border)')
    }),
    onFocus: function onFocus(e) {
      e.target.style.borderColor = 'var(--accent)';
      e.target.style.boxShadow = '0 0 0 3px var(--accent-muted)';
    },
    onBlur: function onBlur(e) {
      e.target.style.borderColor = 'var(--border)';
      e.target.style.boxShadow = 'none';
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: labelStyle
  }, "Password"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: showPass ? 'text' : 'password',
    value: password,
    autoComplete: "current-password",
    onChange: function onChange(e) {
      setPassword(e.target.value);
      setError('');
    },
    placeholder: "Enter your password",
    style: _objectSpread(_objectSpread({}, inputBase), {}, {
      border: "1.5px solid ".concat(error && !password ? '#dc2626' : 'var(--border)'),
      paddingRight: 46
    }),
    onFocus: function onFocus(e) {
      e.target.style.borderColor = 'var(--accent)';
      e.target.style.boxShadow = '0 0 0 3px var(--accent-muted)';
    },
    onBlur: function onBlur(e) {
      e.target.style.borderColor = 'var(--border)';
      e.target.style.boxShadow = 'none';
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function onClick() {
      return setShowPass(function (v) {
        return !v;
      });
    },
    tabIndex: -1,
    style: {
      position: 'absolute',
      right: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--t-3)',
      padding: 4,
      display: 'flex',
      transition: 'color 0.15s'
    },
    onMouseEnter: function onMouseEnter(e) {
      return e.currentTarget.style.color = 'var(--t-1)';
    },
    onMouseLeave: function onMouseLeave(e) {
      return e.currentTarget.style.color = 'var(--t-3)';
    }
  }, /*#__PURE__*/React.createElement(Icons.Eye, {
    size: 17
  })))), error && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      padding: '10px 13px',
      borderRadius: 9,
      background: 'rgba(220,38,38,0.07)',
      border: '1.5px solid rgba(220,38,38,0.18)',
      color: '#dc2626',
      fontSize: 13.5,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement(Icons.AlertTriangle, {
    size: 15,
    style: {
      flexShrink: 0
    }
  }), error), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: loading,
    style: {
      width: '100%',
      padding: '13px',
      borderRadius: 10,
      fontSize: 15.5,
      fontWeight: 700,
      cursor: loading ? 'not-allowed' : 'pointer',
      fontFamily: 'inherit',
      background: 'var(--accent)',
      color: '#fff',
      border: 'none',
      boxShadow: '0 4px 18px var(--accent-muted)',
      opacity: loading ? 0.8 : 1,
      transition: 'all 0.15s',
      marginTop: 4,
      letterSpacing: '-0.01em'
    },
    onMouseEnter: function onMouseEnter(e) {
      if (!loading) e.currentTarget.style.filter = 'brightness(0.91)';
    },
    onMouseLeave: function onMouseLeave(e) {
      e.currentTarget.style.filter = 'none';
    }
  }, loading ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      border: '2px solid rgba(255,255,255,0.35)',
      borderTopColor: '#fff',
      borderRadius: '50%',
      display: 'inline-block',
      animation: 'spin 0.7s linear infinite'
    }
  }), "Signing in\u2026") : 'Sign In'))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      border: '1.5px solid var(--border)',
      borderRadius: 14,
      overflow: 'hidden',
      background: 'var(--bg-1)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setHintOpen(function (v) {
        return !v;
      });
    },
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'inherit',
      color: 'var(--t-2)',
      fontSize: 13.5,
      fontWeight: 600,
      transition: 'background 0.12s'
    },
    onMouseEnter: function onMouseEnter(e) {
      return e.currentTarget.style.background = 'var(--bg-3)';
    },
    onMouseLeave: function onMouseLeave(e) {
      return e.currentTarget.style.background = 'none';
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icons.ShieldCheck, {
    size: 14
  }), " Demo accounts"), /*#__PURE__*/React.createElement(Icons.ChevronDown, {
    size: 14,
    style: {
      transform: hintOpen ? 'rotate(180deg)' : 'rotate(0)',
      transition: 'transform 0.2s'
    }
  })), hintOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1.5px solid var(--border)',
      padding: '6px 8px 8px'
    }
  }, (window.USERS || []).map(function (u) {
    var meta = ROLE_META[u.role] || {};
    var Icon = Icons[meta.icon] || Icons.User;
    return /*#__PURE__*/React.createElement("button", {
      key: u.id,
      onClick: function onClick() {
        return fillCreds(u);
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        width: '100%',
        textAlign: 'left',
        padding: '10px 10px',
        borderRadius: 9,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'background 0.11s',
        marginBottom: 2
      },
      onMouseEnter: function onMouseEnter(e) {
        return e.currentTarget.style.background = 'var(--bg-3)';
      },
      onMouseLeave: function onMouseLeave(e) {
        return e.currentTarget.style.background = 'none';
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 34,
        height: 34,
        borderRadius: 9,
        background: "".concat(meta.color || '#888', "15"),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: meta.color || '#888',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      size: 16
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        marginBottom: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 700,
        color: 'var(--t-1)'
      }
    }, u.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: meta.color || '#888',
        background: "".concat(meta.color || '#888', "13"),
        padding: '1px 8px',
        borderRadius: 20
      }
    }, meta.label)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: 'var(--t-3)',
        fontFamily: 'monospace'
      }
    }, u.email, " \xB7 ", u.password)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: 'var(--t-3)',
        flexShrink: 0
      }
    }, "Fill \u2197"));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--t-3)',
      padding: '4px 10px 2px',
      lineHeight: 1.5
    }
  }, "Click any row to auto-fill credentials.")))));
}
Object.assign(window, {
  LoginPage: LoginPage
});