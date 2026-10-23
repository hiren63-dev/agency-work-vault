function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
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
// gms/settings.jsx — Full colour & appearance settings
var _window = window,
  React = _window.React;
var useState = React.useState,
  useEffect = React.useEffect;
var ACCENT_PRESETS = [{
  name: 'Ocean Blue',
  value: '#2563eb'
}, {
  name: 'Royal Purple',
  value: '#7c3aed'
}, {
  name: 'Forest Green',
  value: '#059669'
}, {
  name: 'Ruby Red',
  value: '#dc2626'
}, {
  name: 'Sunset Orange',
  value: '#ea580c'
}, {
  name: 'Golden Amber',
  value: '#d97706'
}, {
  name: 'Hot Pink',
  value: '#db2777'
}, {
  name: 'Sky Teal',
  value: '#0891b2'
}, {
  name: 'Indigo',
  value: '#4f46e5'
}, {
  name: 'Lime',
  value: '#65a30d'
}];
var BG_MODES = [{
  value: 'light',
  emoji: '☀️',
  label: 'Bright Light',
  desc: 'White background. Best for daytime.'
}, {
  value: 'dark',
  emoji: '🌙',
  label: 'Dark Mode',
  desc: 'Dark screen. Easier on eyes at night.'
}, {
  value: 'warm',
  emoji: '🏵️',
  label: 'Warm Cream',
  desc: 'Warm yellowish tones, like reading paper.'
}];
var FONT_SIZES = [{
  value: 'normal',
  label: 'Normal',
  sample: 'Aa',
  px: '16px'
}, {
  value: 'large',
  label: 'Large',
  sample: 'Aa',
  px: '18px'
}, {
  value: 'xl',
  label: 'Extra Large',
  sample: 'Aa',
  px: '20px'
}];
function SettingsPage(_ref) {
  var settings = _ref.settings,
    onSave = _ref.onSave,
    currentUser = _ref.currentUser,
    permissions = _ref.permissions,
    setPermissions = _ref.setPermissions;
  var _useState = useState(settings),
    _useState2 = _slicedToArray(_useState, 2),
    local = _useState2[0],
    setLocal = _useState2[1];

  // Apply and save whenever local changes
  useEffect(function () {
    onSave(local);
  }, [local]);
  function set(key, val) {
    setLocal(function (p) {
      return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, key, val));
    });
  }
  var section = {
    background: 'var(--bg-1)',
    border: '1.5px solid var(--border)',
    borderRadius: 16,
    padding: 28,
    marginBottom: 20,
    boxShadow: 'var(--shadow-sm)'
  };
  var sTitle = {
    fontSize: 16,
    fontWeight: 600,
    color: 'var(--t-1)',
    marginBottom: 5,
    letterSpacing: '-0.02em'
  };
  var sDesc = {
    fontSize: 13.5,
    color: 'var(--t-3)',
    marginBottom: 22,
    lineHeight: 1.55,
    fontWeight: 400
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 640
    }
  }, /*#__PURE__*/React.createElement(window.PageHeader, {
    title: "Settings",
    sub: "Gym details, appearance and display preferences."
  }), /*#__PURE__*/React.createElement("div", {
    style: section
  }, /*#__PURE__*/React.createElement("h2", {
    style: sTitle
  }, "Gym Info"), /*#__PURE__*/React.createElement("p", {
    style: sDesc
  }, "Your gym's name appears in the sidebar, login screen, and throughout the system."), /*#__PURE__*/React.createElement(window.Input, {
    label: "Gym Name",
    value: local.gymName || '',
    onChange: function onChange(v) {
      return set('gymName', v);
    },
    placeholder: "e.g. Iron House Fitness",
    hint: "Shown in the sidebar and on the login page"
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Tagline",
    value: local.gymTagline || '',
    onChange: function onChange(v) {
      return set('gymTagline', v);
    },
    placeholder: "e.g. Where Champions Train",
    hint: "A short line shown below the gym name \u2014 keep it under 40 characters"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '11px 14px',
      background: 'var(--bg-3)',
      borderRadius: 9,
      borderLeft: '3px solid var(--border-strong)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--t-3)',
      lineHeight: 1.55
    }
  }, "Changes apply instantly. Refresh the page if the sidebar hasn't updated yet."))), /*#__PURE__*/React.createElement("div", {
    style: section
  }, /*#__PURE__*/React.createElement("h2", {
    style: sTitle
  }, "Accent Colour"), /*#__PURE__*/React.createElement("p", {
    style: sDesc
  }, "This colour appears on buttons, links, and highlights throughout the software."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 18
    }
  }, ACCENT_PRESETS.map(function (p) {
    var active = local.accentColor === p.value;
    return /*#__PURE__*/React.createElement("button", {
      key: p.value,
      onClick: function onClick() {
        return set('accentColor', p.value);
      },
      title: p.name,
      style: {
        width: 52,
        height: 52,
        borderRadius: 14,
        background: p.value,
        border: 'none',
        cursor: 'pointer',
        outline: active ? "3.5px solid ".concat(p.value) : '3.5px solid transparent',
        outlineOffset: 3,
        transform: active ? 'scale(1.18)' : 'scale(1)',
        transition: 'all 0.17s',
        boxShadow: active ? "0 6px 18px ".concat(p.value, "55") : '0 2px 6px rgba(0,0,0,0.12)'
      }
    });
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 16px',
      background: 'var(--bg-3)',
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--t-2)'
    }
  }, "Custom colour:"), /*#__PURE__*/React.createElement("input", {
    type: "color",
    value: local.accentColor,
    onChange: function onChange(e) {
      return set('accentColor', e.target.value);
    },
    style: {
      width: 44,
      height: 36,
      border: '1.5px solid var(--border)',
      borderRadius: 8,
      cursor: 'pointer',
      padding: 3,
      background: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--t-3)',
      fontFamily: 'monospace'
    }
  }, local.accentColor), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--t-2)',
      fontWeight: 600
    }
  }, "Preview:"), /*#__PURE__*/React.createElement(window.Btn, {
    size: "sm",
    style: {
      background: local.accentColor,
      borderColor: local.accentColor,
      color: '#fff'
    }
  }, "Sample Button")))), /*#__PURE__*/React.createElement("div", {
    style: section
  }, /*#__PURE__*/React.createElement("h2", {
    style: sTitle
  }, "Background Mode"), /*#__PURE__*/React.createElement("p", {
    style: sDesc
  }, "Choose the background style that is most comfortable for your eyes."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 14
    }
  }, BG_MODES.map(function (m) {
    var active = local.bgMode === m.value;
    return /*#__PURE__*/React.createElement("button", {
      key: m.value,
      onClick: function onClick() {
        return set('bgMode', m.value);
      },
      style: {
        padding: '20px 14px',
        borderRadius: 14,
        cursor: 'pointer',
        fontFamily: 'inherit',
        border: "2px solid ".concat(active ? 'var(--accent)' : 'var(--border)'),
        background: active ? 'var(--accent-muted)' : 'var(--bg-3)',
        textAlign: 'center',
        transition: 'all 0.15s',
        boxShadow: active ? '0 4px 14px var(--accent-muted)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 34,
        marginBottom: 10,
        lineHeight: 1
      }
    }, m.emoji), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 800,
        color: active ? 'var(--accent)' : 'var(--t-1)',
        marginBottom: 6
      }
    }, m.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--t-3)',
        lineHeight: 1.5
      }
    }, m.desc), active && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        fontSize: 12,
        fontWeight: 700,
        color: 'var(--accent)'
      }
    }, "\u2713 Current"));
  }))), /*#__PURE__*/React.createElement("div", {
    style: section
  }, /*#__PURE__*/React.createElement("h2", {
    style: sTitle
  }, "Text Size"), /*#__PURE__*/React.createElement("p", {
    style: sDesc
  }, "If the text looks too small to read comfortably, make it bigger here."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 14
    }
  }, FONT_SIZES.map(function (f) {
    var active = local.fontSize === f.value;
    var sampleSize = f.value === 'normal' ? 20 : f.value === 'large' ? 24 : 28;
    return /*#__PURE__*/React.createElement("button", {
      key: f.value,
      onClick: function onClick() {
        return set('fontSize', f.value);
      },
      style: {
        padding: '20px 14px',
        borderRadius: 14,
        cursor: 'pointer',
        fontFamily: 'inherit',
        border: "2px solid ".concat(active ? 'var(--accent)' : 'var(--border)'),
        background: active ? 'var(--accent-muted)' : 'var(--bg-3)',
        textAlign: 'center',
        transition: 'all 0.15s',
        boxShadow: active ? '0 4px 14px var(--accent-muted)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: sampleSize,
        fontWeight: 900,
        color: active ? 'var(--accent)' : 'var(--t-2)',
        marginBottom: 8,
        lineHeight: 1
      }
    }, "Aa"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 800,
        color: active ? 'var(--accent)' : 'var(--t-1)',
        marginBottom: 4
      }
    }, f.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--t-3)'
      }
    }, f.px, " text size"), active && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: 700,
        color: 'var(--accent)'
      }
    }, "\u2713 Current"));
  }))), (currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) === 'owner' && permissions && setPermissions && /*#__PURE__*/React.createElement("div", {
    style: section
  }, /*#__PURE__*/React.createElement("h2", {
    style: sTitle
  }, "Staff Permissions"), /*#__PURE__*/React.createElement("p", {
    style: sDesc
  }, "Control which pages each staff role can access. Dashboard is always on. Owner always has full access."), ['manager', 'trainer', 'receptionist'].map(function (role) {
    var ROLE_LABELS = {
      manager: 'Manager',
      trainer: 'Trainer',
      receptionist: 'Receptionist'
    };
    var ROLE_COLORS = {
      manager: '#2563eb',
      trainer: '#059669',
      receptionist: '#d97706'
    };
    var ROLE_ICONS = {
      manager: 'Users',
      trainer: 'User',
      receptionist: 'MessageSquare'
    };
    var Icon = window.GmsIcons[ROLE_ICONS[role]];
    var current = permissions[role] || [];
    var TOGGLEABLE = ['members', 'enquiries', 'attendance', 'trainers', 'ptsessions', 'payments', 'expenses', 'reports'];
    var PAGE_LABELS = {
      members: 'Members',
      enquiries: 'Enquiries',
      attendance: 'Attendance',
      trainers: 'Trainers',
      ptsessions: 'PT Sessions',
      payments: 'Payments',
      expenses: 'Expenses',
      reports: 'Reports'
    };
    function toggle(pageId) {
      var has = current.includes(pageId);
      var next = has ? current.filter(function (p) {
        return p !== pageId;
      }) : [].concat(_toConsumableArray(current), [pageId]);
      setPermissions(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, role, next));
      });
      window.showToast && window.showToast("".concat(ROLE_LABELS[role], " permissions updated."), 'success');
    }
    return /*#__PURE__*/React.createElement("div", {
      key: role,
      style: {
        marginBottom: 18,
        background: 'var(--bg-3)',
        borderRadius: 12,
        padding: '16px 18px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 30,
        height: 30,
        borderRadius: 8,
        background: "".concat(ROLE_COLORS[role], "18"),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: ROLE_COLORS[role]
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      size: 15
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 700,
        color: 'var(--t-1)'
      }
    }, ROLE_LABELS[role]), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: 'var(--t-3)',
        fontWeight: 500
      }
    }, current.length + 1, " pages accessible"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '7px 0',
        borderBottom: '1px solid var(--border)',
        opacity: 0.5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13.5,
        color: 'var(--t-1)',
        fontWeight: 500
      }
    }, "Dashboard"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: '#059669',
        fontWeight: 700,
        background: 'rgba(5,150,105,0.12)',
        padding: '2px 9px',
        borderRadius: 20
      }
    }, "Always On")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 0
      }
    }, TOGGLEABLE.map(function (pageId, i) {
      var on = current.includes(pageId);
      return /*#__PURE__*/React.createElement("button", {
        key: pageId,
        onClick: function onClick() {
          return toggle(pageId);
        },
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '9px 0',
          paddingRight: i % 2 === 0 ? 12 : 0,
          paddingLeft: i % 2 === 1 ? 12 : 0,
          borderBottom: '1px solid var(--border)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          transition: 'opacity 0.1s'
        },
        onMouseEnter: function onMouseEnter(e) {
          return e.currentTarget.style.opacity = '0.7';
        },
        onMouseLeave: function onMouseLeave(e) {
          return e.currentTarget.style.opacity = '1';
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 13.5,
          color: on ? 'var(--t-1)' : 'var(--t-3)',
          fontWeight: on ? 600 : 400
        }
      }, PAGE_LABELS[pageId]), /*#__PURE__*/React.createElement("div", {
        style: {
          width: 38,
          height: 22,
          borderRadius: 11,
          background: on ? ROLE_COLORS[role] : 'var(--bg-4)',
          position: 'relative',
          transition: 'background 0.2s',
          border: "1.5px solid ".concat(on ? ROLE_COLORS[role] : 'var(--border)'),
          flexShrink: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          top: 2,
          left: on ? 16 : 2,
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
        }
      })));
    })));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '11px 14px',
      background: 'var(--bg-3)',
      borderRadius: 9,
      borderLeft: '3px solid var(--border-strong)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--t-3)',
      lineHeight: 1.55
    }
  }, "Changes take effect immediately. Staff will see updated menus on their next navigation."))), /*#__PURE__*/React.createElement("div", {
    style: section
  }, /*#__PURE__*/React.createElement("h2", {
    style: sTitle
  }, "About"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 16,
      marginBottom: 20
    }
  }, [{
    label: 'Software',
    value: 'Pulse GMS'
  }, {
    label: 'Version',
    value: '2.0'
  }, {
    label: 'Type',
    value: 'Gym Management'
  }].map(function (x) {
    return /*#__PURE__*/React.createElement("div", {
      key: x.label,
      style: {
        padding: '14px 16px',
        background: 'var(--bg-3)',
        borderRadius: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--t-3)',
        fontWeight: 700,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: '0.06em'
      }
    }, x.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 16,
        fontWeight: 800,
        color: 'var(--t-1)'
      }
    }, x.value));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '11px 14px',
      background: 'var(--bg-3)',
      borderRadius: 9,
      borderLeft: '3px solid var(--border-strong)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--t-3)',
      lineHeight: 1.55
    }
  }, "All changes are saved automatically. Settings persist between sessions."))));
}
Object.assign(window, {
  SettingsPage: SettingsPage
});