function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// gms/other.jsx — Attendance, Enquiries, Expenses, Reports, Trainers, PT Sessions
var _window = window,
  React = _window.React;
var useState = React.useState,
  useMemo = React.useMemo;

// ── CSV Export utility ───────────────────────────────────────
function exportCSV(rows, cols, filename) {
  if (!rows.length) {
    window.showToast('No data to export.', 'info');
    return;
  }
  var header = cols.map(function (c) {
    return "\"".concat(c.label, "\"");
  }).join(',');
  var body = rows.map(function (r) {
    return cols.map(function (c) {
      var _r$c$key;
      return "\"".concat(String((_r$c$key = r[c.key]) !== null && _r$c$key !== void 0 ? _r$c$key : '').replace(/"/g, '""'), "\"");
    }).join(',');
  }).join('\n');
  var blob = new Blob([header + '\n' + body], {
    type: 'text/csv;charset=utf-8;'
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = filename + '.csv';
  a.click();
  URL.revokeObjectURL(url);
  window.showToast('CSV downloaded.', 'success');
}
window.exportCSV = exportCSV;

// ── Attendance ───────────────────────────────────────────────
function AttendancePage(_ref) {
  var attendance = _ref.attendance,
    members = _ref.members,
    setAttendance = _ref.setAttendance;
  var Icons = window.GmsIcons;
  var _useState = useState(''),
    _useState2 = _slicedToArray(_useState, 2),
    checkinQ = _useState2[0],
    setCheckinQ = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    showSug = _useState4[0],
    setShowSug = _useState4[1];
  var now = new Date();
  var todayStr = now.toISOString().split('T')[0];
  var todayRecords = attendance.filter(function (a) {
    return a.date === todayStr;
  }).sort(function (a, b) {
    return a.checkIn.localeCompare(b.checkIn);
  });
  var suggestions = members.filter(function (m) {
    return checkinQ.length > 0 && (m.status === 'active' || m.status === 'expiring') && m.name.toLowerCase().includes(checkinQ.toLowerCase());
  }).slice(0, 6);
  function markCheckIn(m) {
    var t = now.toTimeString().slice(0, 5);
    setAttendance(function (prev) {
      return [].concat(_toConsumableArray(prev), [{
        id: Date.now(),
        memberId: m.id,
        memberName: m.name,
        date: todayStr,
        checkIn: t,
        checkOut: null
      }]);
    });
    setCheckinQ('');
    setShowSug(false);
    window.showToast("".concat(m.name, " checked in at ").concat(t), 'success');
  }
  var last7 = Array.from({
    length: 7
  }, function (_, i) {
    var d = new Date(now);
    d.setDate(d.getDate() - 6 + i);
    var key = d.toISOString().split('T')[0];
    return {
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()],
      count: attendance.filter(function (a) {
        return a.date === key;
      }).length,
      isToday: i === 6
    };
  });
  var maxC = Math.max.apply(Math, _toConsumableArray(last7.map(function (d) {
    return d.count;
  })).concat([1]));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(window.PageHeader, {
    title: "Attendance",
    sub: "".concat(todayRecords.length, " check-ins today")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.1fr 0.9fr',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-1)',
      border: '1.5px solid var(--border)',
      borderRadius: 16,
      padding: 24,
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--t-1)',
      marginBottom: 4
    }
  }, "Mark Check-in"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--t-3)',
      marginBottom: 16
    }
  }, "Search for the member who has arrived"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 13,
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--t-3)',
      display: 'flex',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement(Icons.Search, {
    size: 16
  })), /*#__PURE__*/React.createElement("input", {
    value: checkinQ,
    onChange: function onChange(e) {
      setCheckinQ(e.target.value);
      setShowSug(true);
    },
    onFocus: function onFocus(e) {
      setShowSug(true);
      e.target.style.borderColor = 'var(--accent)';
      e.target.style.boxShadow = '0 0 0 3px var(--accent-muted)';
    },
    onBlur: function onBlur(e) {
      e.target.style.borderColor = 'var(--border)';
      e.target.style.boxShadow = 'none';
      setTimeout(function () {
        return setShowSug(false);
      }, 150);
    },
    placeholder: "Type member name\u2026",
    style: {
      width: '100%',
      background: 'var(--bg-3)',
      border: '1.5px solid var(--border)',
      borderRadius: 10,
      padding: '11px 14px 11px 42px',
      fontSize: 15,
      color: 'var(--t-1)',
      fontFamily: 'inherit',
      outline: 'none',
      minHeight: 46
    }
  }), showSug && suggestions.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      background: 'var(--bg-1)',
      border: '1.5px solid var(--border)',
      borderRadius: 12,
      zIndex: 50,
      marginTop: 4,
      overflow: 'hidden',
      boxShadow: 'var(--shadow-md)'
    }
  }, suggestions.map(function (m) {
    return /*#__PURE__*/React.createElement("div", {
      key: m.id,
      onClick: function onClick() {
        return markCheckIn(m);
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '13px 16px',
        cursor: 'pointer',
        transition: 'background 0.12s'
      },
      onMouseEnter: function onMouseEnter(e) {
        return e.currentTarget.style.background = 'var(--bg-3)';
      },
      onMouseLeave: function onMouseLeave(e) {
        return e.currentTarget.style.background = 'transparent';
      }
    }, /*#__PURE__*/React.createElement(window.Avatar, {
      name: m.name,
      size: 34
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 500,
        color: 'var(--t-1)'
      }
    }, m.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--t-3)'
      }
    }, m.id, " \xB7 ", window.getPlan(m.plan).name)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: 'var(--accent)',
        fontWeight: 600,
        background: 'var(--accent-muted)',
        padding: '4px 10px',
        borderRadius: 20
      }
    }, "Check In"));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--t-1)',
      marginBottom: 10
    }
  }, "Today (", todayRecords.length, ")"), todayRecords.length === 0 ? /*#__PURE__*/React.createElement(window.EmptyState, {
    icon: Icons.Calendar,
    title: "No check-ins yet",
    sub: "Use the search above to mark a member present."
  }) : todayRecords.map(function (a) {
    var m = window.getMember(a.memberId);
    return /*#__PURE__*/React.createElement("div", {
      key: a.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '11px 0',
        borderBottom: '1px solid var(--border)'
      }
    }, /*#__PURE__*/React.createElement(window.Avatar, {
      name: a.memberName,
      color: m === null || m === void 0 ? void 0 : m.color,
      size: 36
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 500,
        color: 'var(--t-1)'
      }
    }, a.memberName), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--t-3)'
      }
    }, "In: ", a.checkIn, a.checkOut ? " \xB7 Out: ".concat(a.checkOut) : '')), !a.checkOut ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        padding: '4px 10px',
        borderRadius: 20,
        background: 'rgba(5,150,105,0.10)',
        color: '#059669',
        fontWeight: 600
      }
    }, "In Gym") : /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: 'var(--t-3)'
      }
    }, "Left ", a.checkOut));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-1)',
      border: '1.5px solid var(--border)',
      borderRadius: 16,
      padding: 24,
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--t-1)',
      marginBottom: 4
    }
  }, "Last 7 Days"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--t-3)',
      marginBottom: 20
    }
  }, "Members per day"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 10,
      height: 120,
      marginBottom: 8
    }
  }, last7.map(function (d, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: d.isToday ? 'var(--accent)' : 'var(--t-3)',
        minHeight: 18
      }
    }, d.count || ''), /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        borderRadius: 6,
        background: d.isToday ? 'var(--accent)' : d.count > 0 ? 'var(--accent-muted)' : 'var(--bg-3)',
        border: d.isToday ? 'none' : '1.5px solid var(--border)',
        minHeight: 6,
        height: Math.max(6, d.count / maxC * 96),
        transition: 'height 0.4s ease'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: d.isToday ? 'var(--accent)' : 'var(--t-3)'
      }
    }, d.day));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 14px',
      background: 'var(--bg-3)',
      borderRadius: 10,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--t-3)'
    }
  }, "Week Average"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 600,
      color: 'var(--t-1)',
      marginTop: 2
    }
  }, (last7.reduce(function (s, d) {
    return s + d.count;
  }, 0) / 7).toFixed(1), " per day")))));
}

// ── Add Enquiry Modal ────────────────────────────────────────
function AddEnquiryModal(_ref2) {
  var onClose = _ref2.onClose,
    onAdd = _ref2.onAdd;
  var _useState5 = useState({
      name: '',
      phone: '',
      source: 'Walk-in',
      interest: 'Monthly Plan',
      notes: ''
    }),
    _useState6 = _slicedToArray(_useState5, 2),
    form = _useState6[0],
    setForm = _useState6[1];
  var set = function set(k) {
    return function (v) {
      return setForm(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, k, v));
      });
    };
  };
  function handleAdd() {
    if (!form.name || !form.phone) return;
    onAdd({
      id: "ENQ-".concat(String(Date.now()).slice(-5)),
      name: form.name,
      phone: form.phone,
      source: form.source,
      interest: form.interest,
      status: 'new',
      date: new Date().toISOString().split('T')[0],
      notes: form.notes
    });
  }
  return /*#__PURE__*/React.createElement(window.Modal, {
    onClose: onClose,
    width: 480,
    title: "Add Enquiry",
    subtitle: "Record a new lead or walk-in"
  }, /*#__PURE__*/React.createElement(window.Input, {
    label: "Full Name",
    value: form.name,
    onChange: set('name'),
    placeholder: "e.g. Rohan Patel",
    required: true
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Phone Number",
    value: form.phone,
    onChange: set('phone'),
    placeholder: "+91 98765 43210",
    required: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0 16px'
    }
  }, /*#__PURE__*/React.createElement(window.Input, {
    label: "How They Heard",
    as: "select",
    value: form.source,
    onChange: set('source'),
    options: ['Walk-in', 'Instagram', 'Referral', 'Facebook', 'Google', 'Other']
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Interested In",
    as: "select",
    value: form.interest,
    onChange: set('interest'),
    options: ['Monthly Plan', 'Quarterly', 'Half-Yearly', 'Annual Plan', 'PT Sessions']
  })), /*#__PURE__*/React.createElement(window.Input, {
    label: "Notes",
    as: "textarea",
    value: form.notes,
    onChange: set('notes'),
    placeholder: "Any additional notes\u2026",
    rows: 2
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(window.Btn, {
    variant: "secondary",
    size: "md",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement(window.Btn, {
    size: "md",
    onClick: handleAdd,
    disabled: !form.name || !form.phone
  }, "Add Enquiry")));
}

// ── Enquiries ────────────────────────────────────────────────
var ENQ_LABELS = {
  "new": 'New Lead',
  followup: 'Follow-up',
  demo: 'Demo Scheduled',
  converted: 'Joined',
  lost: 'Not Interested'
};
function EnquiriesPage(_ref3) {
  var enquiries = _ref3.enquiries,
    setEnquiries = _ref3.setEnquiries;
  var Icons = window.GmsIcons;
  var _useState7 = useState(''),
    _useState8 = _slicedToArray(_useState7, 2),
    search = _useState8[0],
    setSearch = _useState8[1];
  var _useState9 = useState(false),
    _useState0 = _slicedToArray(_useState9, 2),
    showAdd = _useState0[0],
    setShowAdd = _useState0[1];
  var filtered = enquiries.filter(function (e) {
    return !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.phone.includes(search);
  });
  function updateStatus(id, status) {
    setEnquiries(function (prev) {
      return prev.map(function (e) {
        return e.id === id ? _objectSpread(_objectSpread({}, e), {}, {
          status: status
        }) : e;
      });
    });
    window.showToast('Status updated.', 'success');
  }
  function deleteEnq(_x, _x2) {
    return _deleteEnq.apply(this, arguments);
  }
  function _deleteEnq() {
    _deleteEnq = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(id, name) {
      var ok;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            _context.n = 1;
            return window.gmsConfirm("Remove enquiry for ".concat(name, "?"), 'Delete Enquiry?', 'Yes, Delete', 'Cancel');
          case 1:
            ok = _context.v;
            if (ok) {
              setEnquiries(function (prev) {
                return prev.filter(function (e) {
                  return e.id !== id;
                });
              });
              window.showToast('Enquiry removed.', 'info');
            }
          case 2:
            return _context.a(2);
        }
      }, _callee);
    }));
    return _deleteEnq.apply(this, arguments);
  }
  return /*#__PURE__*/React.createElement("div", null, showAdd && /*#__PURE__*/React.createElement(AddEnquiryModal, {
    onClose: function onClose() {
      return setShowAdd(false);
    },
    onAdd: function onAdd(e) {
      setEnquiries(function (p) {
        return [e].concat(_toConsumableArray(p));
      });
      setShowAdd(false);
      window.showToast('Enquiry added.', 'success');
    }
  }), /*#__PURE__*/React.createElement(window.PageHeader, {
    title: "Enquiries",
    sub: "".concat(enquiries.length, " total \xB7 ").concat(enquiries.filter(function (e) {
      return e.status === 'new';
    }).length, " new"),
    actions: /*#__PURE__*/React.createElement(window.Btn, {
      size: "md",
      onClick: function onClick() {
        return setShowAdd(true);
      }
    }, /*#__PURE__*/React.createElement(Icons.Plus, {
      size: 14
    }), " Add Enquiry")
  }), /*#__PURE__*/React.createElement(window.FilterBar, {
    search: search,
    onSearch: setSearch,
    placeholder: "Search by name or phone\u2026"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-1)',
      border: '1.5px solid var(--border)',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement(window.Table, {
    cols: [{
      key: 'name',
      label: 'Name'
    }, {
      key: 'phone',
      label: 'Phone'
    }, {
      key: 'source',
      label: 'Source'
    }, {
      key: 'interest',
      label: 'Interest'
    }, {
      key: 'status',
      label: 'Status'
    }, {
      key: 'date',
      label: 'Date'
    }, {
      key: 'actions',
      label: ''
    }],
    empty: "No enquiries yet",
    emptyIcon: Icons.MessageSquare,
    rows: filtered.map(function (e) {
      return /*#__PURE__*/React.createElement("tr", {
        key: e.id,
        style: {
          borderBottom: '1px solid var(--border)',
          transition: 'background 0.1s'
        },
        onMouseEnter: function onMouseEnter(f) {
          return f.currentTarget.style.background = 'var(--bg-2)';
        },
        onMouseLeave: function onMouseLeave(f) {
          return f.currentTarget.style.background = 'transparent';
        }
      }, /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 14,
          fontWeight: 500,
          color: 'var(--t-1)'
        }
      }, e.name), e.notes && /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          color: 'var(--t-3)',
          marginTop: 2
        }
      }, e.notes)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px',
          fontSize: 13,
          color: 'var(--t-2)'
        }
      }, e.phone), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px',
          fontSize: 13,
          color: 'var(--t-2)'
        }
      }, e.source), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px',
          fontSize: 13,
          color: 'var(--t-1)',
          fontWeight: 500
        }
      }, e.interest), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px'
        }
      }, /*#__PURE__*/React.createElement(window.Badge, {
        status: e.status,
        label: ENQ_LABELS[e.status]
      })), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px',
          fontSize: 13,
          color: 'var(--t-3)'
        }
      }, window.formatDate(e.date)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 6,
          alignItems: 'center'
        }
      }, /*#__PURE__*/React.createElement("select", {
        value: e.status,
        onChange: function onChange(f) {
          return updateStatus(e.id, f.target.value);
        },
        style: {
          background: 'var(--bg-3)',
          border: '1.5px solid var(--border)',
          borderRadius: 8,
          padding: '6px 10px',
          fontSize: 12.5,
          color: 'var(--t-1)',
          fontFamily: 'inherit',
          cursor: 'pointer',
          outline: 'none'
        }
      }, Object.entries(ENQ_LABELS).map(function (_ref4) {
        var _ref5 = _slicedToArray(_ref4, 2),
          v = _ref5[0],
          l = _ref5[1];
        return /*#__PURE__*/React.createElement("option", {
          key: v,
          value: v
        }, l);
      })), /*#__PURE__*/React.createElement(window.IconBtn, {
        icon: Icons.Trash,
        danger: true,
        title: "Delete",
        onClick: function onClick() {
          return deleteEnq(e.id, e.name);
        }
      }))));
    })
  })));
}

// ── Add Expense Modal ────────────────────────────────────────
function AddExpenseModal(_ref6) {
  var onClose = _ref6.onClose,
    onAdd = _ref6.onAdd;
  var _useState1 = useState({
      date: new Date().toISOString().split('T')[0],
      category: 'Electricity',
      desc: '',
      amount: '',
      paidBy: 'Owner'
    }),
    _useState10 = _slicedToArray(_useState1, 2),
    form = _useState10[0],
    setForm = _useState10[1];
  var set = function set(k) {
    return function (v) {
      return setForm(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, k, v));
      });
    };
  };
  function handleAdd() {
    if (!form.desc || !form.amount) return;
    onAdd({
      id: "EXP-".concat(String(Date.now()).slice(-5)),
      date: form.date,
      category: form.category,
      desc: form.desc,
      amount: Number(form.amount),
      paidBy: form.paidBy
    });
  }
  return /*#__PURE__*/React.createElement(window.Modal, {
    onClose: onClose,
    width: 480,
    title: "Add Expense",
    subtitle: "Record money spent on running the gym"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0 16px'
    }
  }, /*#__PURE__*/React.createElement(window.Input, {
    label: "Date",
    type: "date",
    value: form.date,
    onChange: set('date'),
    required: true
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Category",
    as: "select",
    value: form.category,
    onChange: set('category'),
    options: ['Electricity', 'Equipment', 'Staff Salary', 'Maintenance', 'Supplies', 'Rent', 'Other']
  })), /*#__PURE__*/React.createElement(window.Input, {
    label: "Description",
    value: form.desc,
    onChange: set('desc'),
    placeholder: "e.g. June electricity bill",
    required: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0 16px'
    }
  }, /*#__PURE__*/React.createElement(window.Input, {
    label: "Amount (\u20B9)",
    type: "number",
    value: form.amount,
    onChange: set('amount'),
    placeholder: "0",
    required: true
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Paid By",
    as: "select",
    value: form.paidBy,
    onChange: set('paidBy'),
    options: ['Owner', 'Manager']
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(window.Btn, {
    variant: "secondary",
    size: "md",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement(window.Btn, {
    size: "md",
    onClick: handleAdd,
    disabled: !form.desc || !form.amount
  }, "Add Expense")));
}

// ── Expenses ─────────────────────────────────────────────────
var EXP_CATS = ['Electricity', 'Equipment', 'Staff Salary', 'Maintenance', 'Supplies', 'Rent', 'Other'];
var EXP_COLORS = {
  Electricity: '#d97706',
  Equipment: '#2563eb',
  'Staff Salary': '#7c3aed',
  Maintenance: '#059669',
  Supplies: '#dc2626',
  Rent: '#f59e0b',
  Other: '#71717a'
};
function ExpensesPage(_ref7) {
  var expenses = _ref7.expenses,
    setExpenses = _ref7.setExpenses;
  var Icons = window.GmsIcons;
  var _useState11 = useState(false),
    _useState12 = _slicedToArray(_useState11, 2),
    showAdd = _useState12[0],
    setShowAdd = _useState12[1];
  var totalExp = expenses.reduce(function (s, e) {
    return s + e.amount;
  }, 0);
  var byCat = EXP_CATS.map(function (c) {
    return {
      cat: c,
      total: expenses.filter(function (e) {
        return e.category === c;
      }).reduce(function (s, e) {
        return s + e.amount;
      }, 0)
    };
  }).filter(function (x) {
    return x.total > 0;
  });
  function deleteExp(_x3) {
    return _deleteExp.apply(this, arguments);
  }
  function _deleteExp() {
    _deleteExp = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(id) {
      var ok;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            _context2.n = 1;
            return window.gmsConfirm('Delete this expense entry?', 'Delete Expense?', 'Yes, Delete', 'Cancel');
          case 1:
            ok = _context2.v;
            if (ok) {
              setExpenses(function (p) {
                return p.filter(function (e) {
                  return e.id !== id;
                });
              });
              window.showToast('Expense deleted.', 'info');
            }
          case 2:
            return _context2.a(2);
        }
      }, _callee2);
    }));
    return _deleteExp.apply(this, arguments);
  }
  var expCols = [{
    key: 'date',
    label: 'Date'
  }, {
    key: 'category',
    label: 'Category'
  }, {
    key: 'desc',
    label: 'Description'
  }, {
    key: 'amount',
    label: 'Amount'
  }, {
    key: 'paidBy',
    label: 'Paid By'
  }];
  return /*#__PURE__*/React.createElement("div", null, showAdd && /*#__PURE__*/React.createElement(AddExpenseModal, {
    onClose: function onClose() {
      return setShowAdd(false);
    },
    onAdd: function onAdd(e) {
      setExpenses(function (p) {
        return [e].concat(_toConsumableArray(p));
      });
      setShowAdd(false);
      window.showToast('Expense added.', 'success');
    }
  }), /*#__PURE__*/React.createElement(window.PageHeader, {
    title: "Expenses",
    sub: "".concat(expenses.length, " entries \xB7 ").concat(window.fmtCurrency(totalExp), " total"),
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(window.Btn, {
      variant: "secondary",
      size: "md",
      onClick: function onClick() {
        return exportCSV(expenses, expCols, 'expenses');
      }
    }, /*#__PURE__*/React.createElement(Icons.Download, {
      size: 14
    }), " Export"), /*#__PURE__*/React.createElement(window.Btn, {
      size: "md",
      onClick: function onClick() {
        return setShowAdd(true);
      }
    }, /*#__PURE__*/React.createElement(Icons.Plus, {
      size: 14
    }), " Add Expense"))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-1)',
      border: '1.5px solid var(--border)',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement(window.Table, {
    cols: [{
      key: 'date',
      label: 'Date'
    }, {
      key: 'cat',
      label: 'Category'
    }, {
      key: 'desc',
      label: 'Description'
    }, {
      key: 'amt',
      label: 'Amount',
      right: true
    }, {
      key: 'by',
      label: 'Paid By'
    }, {
      key: 'del',
      label: ''
    }],
    empty: "No expenses recorded",
    emptyIcon: Icons.TrendingDown,
    rows: _toConsumableArray(expenses).sort(function (a, b) {
      return b.date.localeCompare(a.date);
    }).map(function (e) {
      return /*#__PURE__*/React.createElement("tr", {
        key: e.id,
        style: {
          borderBottom: '1px solid var(--border)',
          transition: 'background 0.1s'
        },
        onMouseEnter: function onMouseEnter(f) {
          return f.currentTarget.style.background = 'var(--bg-2)';
        },
        onMouseLeave: function onMouseLeave(f) {
          return f.currentTarget.style.background = 'transparent';
        }
      }, /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px',
          fontSize: 13,
          color: 'var(--t-3)',
          whiteSpace: 'nowrap'
        }
      }, window.formatDate(e.date)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 12,
          fontWeight: 600,
          padding: '4px 10px',
          borderRadius: 20,
          background: "".concat(EXP_COLORS[e.category] || '#888', "18"),
          color: EXP_COLORS[e.category] || 'var(--t-2)'
        }
      }, e.category)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px',
          fontSize: 14,
          color: 'var(--t-1)',
          fontWeight: 400
        }
      }, e.desc), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px',
          textAlign: 'right',
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--t-1)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, window.fmtCurrency(e.amount)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px',
          fontSize: 13,
          color: 'var(--t-3)'
        }
      }, e.paidBy), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px'
        }
      }, /*#__PURE__*/React.createElement(window.IconBtn, {
        icon: Icons.Trash,
        danger: true,
        title: "Delete",
        onClick: function onClick() {
          return deleteExp(e.id);
        }
      })));
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-1)',
      border: '1.5px solid var(--border)',
      borderRadius: 16,
      padding: 22,
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--t-1)',
      marginBottom: 4
    }
  }, "By Category"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--t-3)',
      marginBottom: 18
    }
  }, "Where money is going"), byCat.map(function (x) {
    return /*#__PURE__*/React.createElement("div", {
      key: x.cat,
      style: {
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: 'var(--t-1)',
        fontWeight: 400
      }
    }, x.cat), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--t-1)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, window.fmtCurrency(x.total))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 5,
        background: 'var(--bg-3)',
        borderRadius: 3
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: "".concat(Math.round(x.total / totalExp * 100), "%"),
        height: '100%',
        background: EXP_COLORS[x.cat] || 'var(--accent)',
        borderRadius: 3
      }
    })));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      paddingTop: 14,
      borderTop: '1.5px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--t-3)'
    }
  }, "Total"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      color: 'var(--t-1)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, window.fmtCurrency(totalExp))))));
}

// ── Reports ──────────────────────────────────────────────────
function ReportsPage(_ref8) {
  var payments = _ref8.payments,
    members = _ref8.members;
  var Icons = window.GmsIcons;
  var totalRev = payments.reduce(function (s, p) {
    return s + p.amount;
  }, 0);
  var planDist = window.PLANS.map(function (pl) {
    return {
      name: pl.name,
      color: pl.color,
      count: members.filter(function (m) {
        return m.plan === pl.id;
      }).length
    };
  });
  var topMembers = _toConsumableArray(members).sort(function (a, b) {
    var ra = payments.filter(function (p) {
      return p.memberId === a.id;
    }).reduce(function (s, p) {
      return s + p.amount;
    }, 0);
    var rb = payments.filter(function (p) {
      return p.memberId === b.id;
    }).reduce(function (s, p) {
      return s + p.amount;
    }, 0);
    return rb - ra;
  }).slice(0, 5);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(window.PageHeader, {
    title: "Reports",
    sub: "Revenue and membership analytics"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 14,
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement(window.StatCard, {
    label: "Total Revenue (All Time)",
    value: window.fmtCurrency(totalRev),
    icon: Icons.Dollar,
    accent: "#7c3aed"
  }), /*#__PURE__*/React.createElement(window.StatCard, {
    label: "Total Members",
    value: members.length,
    icon: Icons.Users,
    accent: "#059669"
  }), /*#__PURE__*/React.createElement(window.StatCard, {
    label: "Avg. Revenue per Member",
    value: window.fmtCurrency(members.length ? Math.round(totalRev / members.length) : 0),
    icon: Icons.TrendingUp,
    accent: "var(--accent)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-1)',
      border: '1.5px solid var(--border)',
      borderRadius: 16,
      padding: 22,
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--t-1)',
      marginBottom: 4
    }
  }, "Plan Popularity"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--t-3)',
      marginBottom: 20
    }
  }, "Members on each plan"), planDist.map(function (p) {
    return /*#__PURE__*/React.createElement("div", {
      key: p.name,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: p.color,
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: 'var(--t-1)',
        fontWeight: 400
      }
    }, p.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: 'var(--t-2)',
        fontWeight: 500
      }
    }, p.count, " ", p.count === 1 ? 'member' : 'members')), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 5,
        background: 'var(--bg-3)',
        borderRadius: 3
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: "".concat(members.length ? Math.round(p.count / members.length * 100) : 0, "%"),
        height: '100%',
        background: p.color,
        borderRadius: 3
      }
    }))));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-1)',
      border: '1.5px solid var(--border)',
      borderRadius: 16,
      padding: 22,
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--t-1)',
      marginBottom: 4
    }
  }, "Top Members by Revenue"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--t-3)',
      marginBottom: 20
    }
  }, "Highest contributing members"), topMembers.map(function (m, i) {
    var rev = payments.filter(function (p) {
      return p.memberId === m.id;
    }).reduce(function (s, p) {
      return s + p.amount;
    }, 0);
    return /*#__PURE__*/React.createElement("div", {
      key: m.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 13
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: 'var(--t-3)',
        width: 20,
        textAlign: 'center',
        fontWeight: 500
      }
    }, "#", i + 1), /*#__PURE__*/React.createElement(window.Avatar, {
      name: m.name,
      color: m.color,
      size: 34
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 500,
        color: 'var(--t-1)'
      }
    }, m.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--t-3)'
      }
    }, window.getPlan(m.plan).name)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: 'var(--t-1)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, window.fmtCurrency(rev)));
  }))));
}

// ── Add Trainer Modal ────────────────────────────────────────
function AddTrainerModal(_ref9) {
  var onClose = _ref9.onClose,
    onAdd = _ref9.onAdd;
  var _useState13 = useState({
      name: '',
      specialization: 'Strength & Conditioning',
      phone: '',
      email: '',
      salary: '',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active'
    }),
    _useState14 = _slicedToArray(_useState13, 2),
    form = _useState14[0],
    setForm = _useState14[1];
  var set = function set(k) {
    return function (v) {
      return setForm(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, k, v));
      });
    };
  };
  function handleAdd() {
    if (!form.name || !form.phone) return;
    onAdd({
      id: "TRN-".concat(String(Date.now()).slice(-4)),
      name: form.name,
      specialization: form.specialization,
      phone: form.phone,
      email: form.email,
      salary: Number(form.salary) || 0,
      joinDate: form.joinDate,
      status: form.status
    });
  }
  return /*#__PURE__*/React.createElement(window.Modal, {
    onClose: onClose,
    width: 500,
    title: "Add Trainer"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0 16px'
    }
  }, /*#__PURE__*/React.createElement(window.Input, {
    label: "Full Name",
    value: form.name,
    onChange: set('name'),
    placeholder: "e.g. Ravi Shankar",
    required: true
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Phone",
    value: form.phone,
    onChange: set('phone'),
    placeholder: "+91 98765 43210",
    required: true
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Specialization",
    as: "select",
    value: form.specialization,
    onChange: set('specialization'),
    options: ['Strength & Conditioning', 'Yoga & Flexibility', 'Cardio & HIIT', 'Crossfit', 'Zumba', 'Bodybuilding', 'General Fitness']
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Email",
    type: "email",
    value: form.email,
    onChange: set('email'),
    placeholder: "trainer@gym.com"
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Monthly Salary (\u20B9)",
    type: "number",
    value: form.salary,
    onChange: set('salary'),
    placeholder: "15000"
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Join Date",
    type: "date",
    value: form.joinDate,
    onChange: set('joinDate')
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(window.Btn, {
    variant: "secondary",
    size: "md",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement(window.Btn, {
    size: "md",
    onClick: handleAdd,
    disabled: !form.name || !form.phone
  }, "Add Trainer")));
}

// ── Trainers ─────────────────────────────────────────────────
function TrainersPage(_ref0) {
  var trainers = _ref0.trainers,
    setTrainers = _ref0.setTrainers,
    members = _ref0.members;
  var Icons = window.GmsIcons;
  var _useState15 = useState(false),
    _useState16 = _slicedToArray(_useState15, 2),
    showAdd = _useState16[0],
    setShowAdd = _useState16[1];
  function deleteTrainer(_x4, _x5) {
    return _deleteTrainer.apply(this, arguments);
  }
  function _deleteTrainer() {
    _deleteTrainer = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(id, name) {
      var ok;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            _context3.n = 1;
            return window.gmsConfirm("Remove ".concat(name, " from your trainer list? Their session history will remain."), 'Remove Trainer?', 'Yes, Remove', 'Cancel');
          case 1:
            ok = _context3.v;
            if (ok) {
              setTrainers(function (p) {
                return p.filter(function (t) {
                  return t.id !== id;
                });
              });
              window.showToast("".concat(name, " removed."), 'info');
            }
          case 2:
            return _context3.a(2);
        }
      }, _callee3);
    }));
    return _deleteTrainer.apply(this, arguments);
  }
  return /*#__PURE__*/React.createElement("div", null, showAdd && /*#__PURE__*/React.createElement(AddTrainerModal, {
    onClose: function onClose() {
      return setShowAdd(false);
    },
    onAdd: function onAdd(t) {
      setTrainers(function (p) {
        return [].concat(_toConsumableArray(p), [t]);
      });
      setShowAdd(false);
      window.showToast('Trainer added.', 'success');
    }
  }), /*#__PURE__*/React.createElement(window.PageHeader, {
    title: "Trainers",
    sub: "".concat(trainers.length, " trainer").concat(trainers.length === 1 ? '' : 's', " on staff"),
    actions: /*#__PURE__*/React.createElement(window.Btn, {
      size: "md",
      onClick: function onClick() {
        return setShowAdd(true);
      }
    }, /*#__PURE__*/React.createElement(Icons.UserPlus, {
      size: 14
    }), " Add Trainer")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-1)',
      border: '1.5px solid var(--border)',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement(window.Table, {
    cols: [{
      key: 'name',
      label: 'Trainer'
    }, {
      key: 'spec',
      label: 'Specialization'
    }, {
      key: 'phone',
      label: 'Phone'
    }, {
      key: 'salary',
      label: 'Salary',
      right: true
    }, {
      key: 'joined',
      label: 'Joined'
    }, {
      key: 'status',
      label: 'Status'
    }, {
      key: 'actions',
      label: '',
      right: true
    }],
    empty: "No trainers added yet",
    emptyIcon: Icons.User,
    rows: trainers.map(function (t) {
      return /*#__PURE__*/React.createElement("tr", {
        key: t.id,
        style: {
          borderBottom: '1px solid var(--border)',
          transition: 'background 0.1s'
        },
        onMouseEnter: function onMouseEnter(e) {
          return e.currentTarget.style.background = 'var(--bg-2)';
        },
        onMouseLeave: function onMouseLeave(e) {
          return e.currentTarget.style.background = 'transparent';
        }
      }, /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 11
        }
      }, /*#__PURE__*/React.createElement(window.Avatar, {
        name: t.name,
        size: 38
      }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 14,
          fontWeight: 500,
          color: 'var(--t-1)'
        }
      }, t.name), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          color: 'var(--t-3)'
        }
      }, t.id)))), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px',
          fontSize: 13,
          color: 'var(--t-2)'
        }
      }, t.specialization), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px',
          fontSize: 13,
          color: 'var(--t-2)'
        }
      }, t.phone), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px',
          textAlign: 'right',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--t-1)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, window.fmtCurrency(t.salary), "/mo"), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px',
          fontSize: 13,
          color: 'var(--t-3)'
        }
      }, window.formatDate(t.joinDate)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px'
        }
      }, /*#__PURE__*/React.createElement(window.Badge, {
        status: t.status
      })), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px',
          textAlign: 'right'
        }
      }, /*#__PURE__*/React.createElement(window.IconBtn, {
        icon: Icons.Trash,
        danger: true,
        title: "Remove trainer",
        onClick: function onClick() {
          return deleteTrainer(t.id, t.name);
        }
      })));
    })
  })));
}

// ── Add PT Session Modal ─────────────────────────────────────
function AddPTSessionModal(_ref1) {
  var _trainers$;
  var onClose = _ref1.onClose,
    onAdd = _ref1.onAdd,
    members = _ref1.members,
    trainers = _ref1.trainers;
  var _useState17 = useState(''),
    _useState18 = _slicedToArray(_useState17, 2),
    memberId = _useState18[0],
    setMemberId = _useState18[1];
  var _useState19 = useState(((_trainers$ = trainers[0]) === null || _trainers$ === void 0 ? void 0 : _trainers$.id) || ''),
    _useState20 = _slicedToArray(_useState19, 2),
    trainerId = _useState20[0],
    setTrainerId = _useState20[1];
  var _useState21 = useState(new Date().toISOString().split('T')[0]),
    _useState22 = _slicedToArray(_useState21, 2),
    date = _useState22[0],
    setDate = _useState22[1];
  var _useState23 = useState('07:00'),
    _useState24 = _slicedToArray(_useState23, 2),
    time = _useState24[0],
    setTime = _useState24[1];
  var _useState25 = useState('60'),
    _useState26 = _slicedToArray(_useState25, 2),
    duration = _useState26[0],
    setDuration = _useState26[1];
  var _useState27 = useState('1000'),
    _useState28 = _slicedToArray(_useState27, 2),
    amount = _useState28[0],
    setAmount = _useState28[1];
  var activeMembers = members.filter(function (m) {
    return m.status === 'active' || m.status === 'expiring';
  });
  function handleAdd() {
    if (!memberId || !trainerId) return;
    var m = window.getMember(memberId);
    var t = trainers.find(function (x) {
      return x.id === trainerId;
    });
    onAdd({
      id: "PTS-".concat(String(Date.now()).slice(-5)),
      memberId: memberId,
      memberName: (m === null || m === void 0 ? void 0 : m.name) || '',
      trainerId: trainerId,
      trainerName: (t === null || t === void 0 ? void 0 : t.name) || '',
      date: date,
      time: time,
      duration: Number(duration),
      status: 'scheduled',
      amount: Number(amount)
    });
  }
  return /*#__PURE__*/React.createElement(window.Modal, {
    onClose: onClose,
    width: 480,
    title: "Schedule PT Session"
  }, /*#__PURE__*/React.createElement(window.Input, {
    label: "Member",
    as: "select",
    value: memberId,
    onChange: setMemberId,
    required: true,
    options: [{
      value: '',
      label: '-- Select Member --'
    }].concat(_toConsumableArray(activeMembers.map(function (m) {
      return {
        value: m.id,
        label: m.name
      };
    })))
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Trainer",
    as: "select",
    value: trainerId,
    onChange: setTrainerId,
    options: trainers.map(function (t) {
      return {
        value: t.id,
        label: t.name
      };
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0 16px'
    }
  }, /*#__PURE__*/React.createElement(window.Input, {
    label: "Date",
    type: "date",
    value: date,
    onChange: setDate
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Time",
    type: "time",
    value: time,
    onChange: setTime
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Duration",
    as: "select",
    value: duration,
    onChange: setDuration,
    options: [{
      value: '30',
      label: '30 min'
    }, {
      value: '45',
      label: '45 min'
    }, {
      value: '60',
      label: '60 min'
    }, {
      value: '90',
      label: '90 min'
    }]
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Amount (\u20B9)",
    type: "number",
    value: amount,
    onChange: setAmount,
    placeholder: "1000"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(window.Btn, {
    variant: "secondary",
    size: "md",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement(window.Btn, {
    size: "md",
    onClick: handleAdd,
    disabled: !memberId || !trainerId
  }, "Schedule Session")));
}

// ── PT Sessions ──────────────────────────────────────────────
var PTS_STATUS_COLOR = {
  scheduled: '#2563eb',
  completed: '#059669',
  cancelled: '#dc2626'
};
function PTSessionsPage(_ref10) {
  var ptSessions = _ref10.ptSessions,
    setPtSessions = _ref10.setPtSessions,
    members = _ref10.members,
    trainers = _ref10.trainers;
  var Icons = window.GmsIcons;
  var _useState29 = useState(false),
    _useState30 = _slicedToArray(_useState29, 2),
    showAdd = _useState30[0],
    setShowAdd = _useState30[1];
  var _useState31 = useState('all'),
    _useState32 = _slicedToArray(_useState31, 2),
    filter = _useState32[0],
    setFilter = _useState32[1];
  var filtered = filter === 'all' ? ptSessions : ptSessions.filter(function (s) {
    return s.status === filter;
  });
  function updateStatus(id, status) {
    setPtSessions(function (p) {
      return p.map(function (s) {
        return s.id === id ? _objectSpread(_objectSpread({}, s), {}, {
          status: status
        }) : s;
      });
    });
    window.showToast('Session updated.', 'success');
  }
  function deleteSession(_x6) {
    return _deleteSession.apply(this, arguments);
  }
  function _deleteSession() {
    _deleteSession = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(id) {
      var ok;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            _context4.n = 1;
            return window.gmsConfirm('Remove this PT session?', 'Delete Session?', 'Yes, Delete', 'Cancel');
          case 1:
            ok = _context4.v;
            if (ok) {
              setPtSessions(function (p) {
                return p.filter(function (s) {
                  return s.id !== id;
                });
              });
              window.showToast('Session removed.', 'info');
            }
          case 2:
            return _context4.a(2);
        }
      }, _callee4);
    }));
    return _deleteSession.apply(this, arguments);
  }
  var totals = {
    all: ptSessions.length,
    scheduled: ptSessions.filter(function (s) {
      return s.status === 'scheduled';
    }).length,
    completed: ptSessions.filter(function (s) {
      return s.status === 'completed';
    }).length,
    cancelled: ptSessions.filter(function (s) {
      return s.status === 'cancelled';
    }).length
  };
  return /*#__PURE__*/React.createElement("div", null, showAdd && /*#__PURE__*/React.createElement(AddPTSessionModal, {
    onClose: function onClose() {
      return setShowAdd(false);
    },
    members: members,
    trainers: trainers,
    onAdd: function onAdd(s) {
      setPtSessions(function (p) {
        return [s].concat(_toConsumableArray(p));
      });
      setShowAdd(false);
      window.showToast('Session scheduled.', 'success');
    }
  }), /*#__PURE__*/React.createElement(window.PageHeader, {
    title: "PT Sessions",
    sub: "".concat(ptSessions.length, " sessions \xB7 ").concat(window.fmtCurrency(ptSessions.filter(function (s) {
      return s.status === 'completed';
    }).reduce(function (x, s) {
      return x + s.amount;
    }, 0)), " earned"),
    actions: /*#__PURE__*/React.createElement(window.Btn, {
      size: "md",
      onClick: function onClick() {
        return setShowAdd(true);
      }
    }, /*#__PURE__*/React.createElement(Icons.Plus, {
      size: 14
    }), " Schedule Session")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 18,
      flexWrap: 'wrap'
    }
  }, ['all', 'scheduled', 'completed', 'cancelled'].map(function (f) {
    return /*#__PURE__*/React.createElement("button", {
      key: f,
      onClick: function onClick() {
        return setFilter(f);
      },
      style: {
        padding: '7px 16px',
        borderRadius: 20,
        fontSize: 13,
        fontWeight: filter === f ? 600 : 500,
        cursor: 'pointer',
        fontFamily: 'inherit',
        border: "1.5px solid ".concat(filter === f ? 'var(--accent)' : 'var(--border)'),
        background: filter === f ? 'var(--accent-muted)' : 'var(--bg-1)',
        color: filter === f ? 'var(--accent)' : 'var(--t-2)',
        transition: 'all 0.15s'
      }
    }, f.charAt(0).toUpperCase() + f.slice(1), " (", totals[f], ")");
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-1)',
      border: '1.5px solid var(--border)',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement(window.Table, {
    cols: [{
      key: 'member',
      label: 'Member'
    }, {
      key: 'trainer',
      label: 'Trainer'
    }, {
      key: 'datetime',
      label: 'Date & Time'
    }, {
      key: 'duration',
      label: 'Duration'
    }, {
      key: 'amount',
      label: 'Amount',
      right: true
    }, {
      key: 'status',
      label: 'Status'
    }, {
      key: 'actions',
      label: ''
    }],
    empty: "No PT sessions recorded",
    emptyIcon: Icons.Clock,
    rows: filtered.sort(function (a, b) {
      return b.date.localeCompare(a.date);
    }).map(function (s) {
      return /*#__PURE__*/React.createElement("tr", {
        key: s.id,
        style: {
          borderBottom: '1px solid var(--border)',
          transition: 'background 0.1s'
        },
        onMouseEnter: function onMouseEnter(e) {
          return e.currentTarget.style.background = 'var(--bg-2)';
        },
        onMouseLeave: function onMouseLeave(e) {
          return e.currentTarget.style.background = 'transparent';
        }
      }, /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }
      }, /*#__PURE__*/React.createElement(window.Avatar, {
        name: s.memberName,
        size: 34
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 14,
          fontWeight: 500,
          color: 'var(--t-1)'
        }
      }, s.memberName))), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px',
          fontSize: 13,
          color: 'var(--t-2)'
        }
      }, s.trainerName), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13,
          color: 'var(--t-1)',
          fontWeight: 500
        }
      }, window.formatDate(s.date)), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          color: 'var(--t-3)'
        }
      }, s.time)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px',
          fontSize: 13,
          color: 'var(--t-2)'
        }
      }, s.duration, " min"), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px',
          textAlign: 'right',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--t-1)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, window.fmtCurrency(s.amount)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 12,
          fontWeight: 600,
          padding: '4px 10px',
          borderRadius: 20,
          background: "".concat(PTS_STATUS_COLOR[s.status] || '#888', "15"),
          color: PTS_STATUS_COLOR[s.status] || 'var(--t-2)'
        }
      }, s.status.charAt(0).toUpperCase() + s.status.slice(1))), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 6
        }
      }, s.status === 'scheduled' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(window.Btn, {
        variant: "secondary",
        size: "sm",
        onClick: function onClick() {
          return updateStatus(s.id, 'completed');
        }
      }, "Done"), /*#__PURE__*/React.createElement(window.Btn, {
        variant: "secondary",
        size: "sm",
        onClick: function onClick() {
          return updateStatus(s.id, 'cancelled');
        }
      }, "Cancel")), /*#__PURE__*/React.createElement(window.IconBtn, {
        icon: Icons.Trash,
        danger: true,
        title: "Delete",
        onClick: function onClick() {
          return deleteSession(s.id);
        }
      }))));
    })
  })));
}
Object.assign(window, {
  AttendancePage: AttendancePage,
  EnquiriesPage: EnquiriesPage,
  AddEnquiryModal: AddEnquiryModal,
  ExpensesPage: ExpensesPage,
  AddExpenseModal: AddExpenseModal,
  ReportsPage: ReportsPage,
  TrainersPage: TrainersPage,
  AddTrainerModal: AddTrainerModal,
  PTSessionsPage: PTSessionsPage,
  AddPTSessionModal: AddPTSessionModal
});