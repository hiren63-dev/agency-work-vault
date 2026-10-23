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
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// gms/members.jsx — Members page + modals (novice-friendly)
var _window = window,
  React = _window.React;
var useState = React.useState,
  useMemo = React.useMemo;

// ── Member Detail Modal ──────────────────────────────────────
function MemberDetailModal(_ref) {
  var m = _ref.member,
    onClose = _ref.onClose,
    payments = _ref.payments,
    onModal = _ref.onModal;
  var _useState = useState('personal'),
    _useState2 = _slicedToArray(_useState, 2),
    tab = _useState2[0],
    setTab = _useState2[1];
  var Icons = window.GmsIcons;
  var plan = window.getPlan(m.plan);
  var days = window.daysLeft(m.endDate);
  var totalDays = plan.duration;
  var pct = m.status === 'active' || m.status === 'expiring' ? Math.min(100, Math.round(days / totalDays * 100)) : 0;
  var memberPayments = payments.filter(function (p) {
    return p.memberId === m.id;
  });
  var fields = [{
    label: 'Phone Number',
    icon: 'Phone',
    value: m.phone
  }, {
    label: 'Email Address',
    icon: 'Mail',
    value: m.email || '—'
  }, {
    label: 'Area / Locality',
    icon: 'MapPin',
    value: m.area
  }, {
    label: 'Date of Birth',
    icon: 'Calendar',
    value: window.formatDate(m.dob)
  }, {
    label: 'Gender',
    icon: 'User',
    value: m.gender
  }, {
    label: 'Blood Group',
    icon: 'Droplet',
    value: m.bloodGroup
  }, {
    label: 'Weight / Height',
    icon: 'Activity',
    value: "".concat(m.weight, " \xB7 ").concat(m.height)
  }, {
    label: 'Emergency Contact',
    icon: 'Phone',
    value: m.emergencyContact
  }, {
    label: 'Fitness Goals',
    icon: 'Zap',
    value: m.goals || '—'
  }, {
    label: 'Join Date',
    icon: 'Calendar',
    value: window.formatDate(m.joinDate)
  }];
  return /*#__PURE__*/React.createElement(window.Modal, {
    onClose: onClose,
    width: 640
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 22,
      paddingBottom: 22,
      borderBottom: '1.5px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(window.Avatar, {
    name: m.name,
    color: m.color,
    size: 64
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 900,
      color: 'var(--t-1)'
    }
  }, m.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 8,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: 'var(--t-3)',
      background: 'var(--bg-3)',
      padding: '3px 10px',
      borderRadius: 20,
      fontWeight: 700
    }
  }, m.id), /*#__PURE__*/React.createElement(window.Badge, {
    status: m.status
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement(window.ProgressRing, {
    pct: pct,
    size: 80,
    color: m.status === 'expiring' ? '#d97706' : m.status === 'active' ? '#059669' : 'var(--border)',
    label: days,
    sub: "days left"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--t-3)',
      marginTop: 6,
      fontWeight: 600
    }
  }, "Expires ", window.formatDate(m.endDate)))), /*#__PURE__*/React.createElement(window.Tabs, {
    tabs: ['personal', 'subscription', 'payments'],
    active: tab,
    onChange: setTab
  }), tab === 'personal' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 0
    }
  }, fields.map(function (f, i) {
    var Icon = Icons[f.icon];
    return /*#__PURE__*/React.createElement("div", {
      key: f.label,
      style: {
        padding: '14px 0',
        borderBottom: i < fields.length - 2 ? '1px solid var(--border)' : 'none',
        paddingRight: i % 2 === 0 ? 18 : 0,
        paddingLeft: i % 2 === 1 ? 18 : 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        color: 'var(--t-3)',
        marginBottom: 5,
        fontWeight: 700
      }
    }, Icon && /*#__PURE__*/React.createElement(Icon, {
      size: 12
    }), " ", f.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 700,
        color: 'var(--t-1)'
      }
    }, f.value));
  })), tab === 'subscription' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-3)',
      borderRadius: 14,
      padding: 20,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 800,
      color: 'var(--t-1)'
    }
  }, plan.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--t-3)',
      marginTop: 3,
      fontWeight: 600
    }
  }, plan.duration, " days \xB7 ", window.fmtCurrency(plan.price))), /*#__PURE__*/React.createElement(window.Badge, {
    status: m.status
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 14
    }
  }, [{
    l: 'Start Date',
    v: window.formatDate(m.startDate)
  }, {
    l: 'End Date',
    v: window.formatDate(m.endDate)
  }, {
    l: 'Days Left',
    v: "".concat(days, " days")
  }].map(function (x) {
    return /*#__PURE__*/React.createElement("div", {
      key: x.l
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--t-3)',
        marginBottom: 4,
        fontWeight: 700
      }
    }, x.l), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 16,
        fontWeight: 800,
        color: 'var(--t-1)'
      }
    }, x.v));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      height: 8,
      background: 'var(--bg-2)',
      borderRadius: 4,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "".concat(pct, "%"),
      height: '100%',
      borderRadius: 4,
      background: m.status === 'expiring' ? '#d97706' : m.status === 'active' ? '#059669' : '#dc2626',
      transition: 'width 0.5s ease'
    }
  }))), /*#__PURE__*/React.createElement(window.Btn, {
    variant: "primary",
    size: "md",
    onClick: function onClick() {
      onClose();
      setTimeout(function () {
        return onModal && onModal({
          type: 'collectPayment'
        });
      }, 50);
    }
  }, /*#__PURE__*/React.createElement(Icons.ArrowRight, {
    size: 15
  }), " Renew This Membership")), tab === 'payments' && /*#__PURE__*/React.createElement("div", null, memberPayments.length === 0 ? /*#__PURE__*/React.createElement(window.EmptyState, {
    icon: Icons.Receipt,
    title: "No payments recorded yet",
    sub: "Payments for this member will appear here once collected."
  }) : memberPayments.map(function (p) {
    return /*#__PURE__*/React.createElement("div", {
      key: p.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 0',
        borderBottom: '1px solid var(--border)'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 700,
        color: 'var(--t-1)'
      }
    }, p.category), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: 'var(--t-3)',
        marginTop: 3,
        fontWeight: 600
      }
    }, p.id, " \xB7 ", window.formatDate(p.date), " \xB7 ", p.mode)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 18,
        fontWeight: 900,
        color: 'var(--t-1)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, window.fmtCurrency(p.amount)));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 24,
      paddingTop: 18,
      borderTop: '1.5px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement(window.Btn, {
    variant: "secondary",
    size: "sm",
    onClick: function onClick() {
      onClose();
      setTimeout(function () {
        return onModal && onModal({
          type: 'editMember',
          member: m
        });
      }, 60);
    }
  }, /*#__PURE__*/React.createElement(Icons.Edit, {
    size: 13
  }), " Edit Member"), /*#__PURE__*/React.createElement(window.Btn, {
    variant: "secondary",
    size: "sm",
    onClick: function onClick() {
      window.__gmsCheckIn && window.__gmsCheckIn(m);
      onClose();
    }
  }, /*#__PURE__*/React.createElement(Icons.Calendar, {
    size: 13
  }), " Mark Attended Today")));
}

// ── Add Member Modal ─────────────────────────────────────────
function AddMemberModal(_ref2) {
  var onClose = _ref2.onClose,
    onAdd = _ref2.onAdd;
  var _useState3 = useState(0),
    _useState4 = _slicedToArray(_useState3, 2),
    step = _useState4[0],
    setStep = _useState4[1];
  var _useState5 = useState({
      name: '',
      phone: '',
      email: '',
      area: '',
      dob: '',
      gender: 'Male',
      bloodGroup: '',
      weight: '',
      height: '',
      emergencyContact: '',
      goals: '',
      plan: 'monthly',
      startDate: new Date().toISOString().split('T')[0]
    }),
    _useState6 = _slicedToArray(_useState5, 2),
    form = _useState6[0],
    setForm = _useState6[1];
  var Icons = window.GmsIcons;
  var set = function set(k) {
    return function (v) {
      return setForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, _defineProperty({}, k, v));
      });
    };
  };
  function handleAdd() {
    var plan = window.getPlan(form.plan);
    var end = new Date(form.startDate);
    end.setDate(end.getDate() + plan.duration);
    onAdd({
      id: "GMS-".concat(1000 + Math.floor(Math.random() * 9000)),
      name: form.name,
      phone: form.phone,
      email: form.email,
      area: form.area,
      dob: form.dob,
      gender: form.gender,
      bloodGroup: form.bloodGroup,
      weight: form.weight,
      height: form.height,
      emergencyContact: form.emergencyContact,
      goals: form.goals,
      plan: form.plan,
      status: 'active',
      startDate: form.startDate,
      endDate: end.toISOString().split('T')[0],
      joinDate: form.startDate,
      initials: form.name.split(' ').map(function (w) {
        return w[0];
      }).join('').slice(0, 2).toUpperCase(),
      color: ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e'][Math.floor(Math.random() * 6)]
    });
  }
  return /*#__PURE__*/React.createElement(window.Modal, {
    onClose: onClose,
    width: 600,
    title: "Add New Member",
    subtitle: "Fill in the member's details step by step"
  }, /*#__PURE__*/React.createElement(window.Stepper, {
    steps: ['Personal Info', 'Health Details', 'Choose Plan'],
    current: step
  }), step === 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0 18px'
    }
  }, /*#__PURE__*/React.createElement(window.Input, {
    label: "Full Name",
    value: form.name,
    onChange: set('name'),
    placeholder: "e.g. Rajesh Kumar",
    required: true,
    hint: "Enter the member's full name as on their ID"
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Phone Number",
    value: form.phone,
    onChange: set('phone'),
    placeholder: "e.g. +91 98765 43210",
    required: true,
    hint: "We use this to contact the member"
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Email Address",
    type: "email",
    value: form.email,
    onChange: set('email'),
    placeholder: "e.g. rajesh@email.com",
    hint: "Optional \u2014 for sending receipts"
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Area / Locality",
    value: form.area,
    onChange: set('area'),
    placeholder: "e.g. Maninagar, Ahmedabad",
    required: true,
    hint: "Neighbourhood or area where they live"
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Date of Birth",
    type: "date",
    value: form.dob,
    onChange: set('dob'),
    hint: "Optional"
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Gender",
    as: "select",
    value: form.gender,
    onChange: set('gender'),
    options: ['Male', 'Female', 'Other']
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(window.Btn, {
    size: "lg",
    onClick: function onClick() {
      return setStep(1);
    },
    disabled: !form.name || !form.phone
  }, "Next: Health Details ", /*#__PURE__*/React.createElement(Icons.ChevronRight, {
    size: 16
  })))), step === 1 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0 18px'
    }
  }, /*#__PURE__*/React.createElement(window.Input, {
    label: "Weight",
    value: form.weight,
    onChange: set('weight'),
    placeholder: "e.g. 75 kg",
    hint: "Current body weight"
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Height",
    value: form.height,
    onChange: set('height'),
    placeholder: "e.g. 5'10\"",
    hint: "Member's height"
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Blood Group",
    as: "select",
    value: form.bloodGroup,
    onChange: set('bloodGroup'),
    options: ['(Not Known)', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Emergency Contact",
    value: form.emergencyContact,
    onChange: set('emergencyContact'),
    placeholder: "e.g. +91 99999 00000",
    hint: "Phone number to call in case of emergency"
  })), /*#__PURE__*/React.createElement(window.Input, {
    label: "Fitness Goals",
    as: "textarea",
    value: form.goals,
    onChange: set('goals'),
    placeholder: "e.g. Lose weight, build muscle, stay fit\u2026",
    rows: 2,
    hint: "What does the member want to achieve?"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      justifyContent: 'flex-end',
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(window.Btn, {
    variant: "secondary",
    size: "lg",
    onClick: function onClick() {
      return setStep(0);
    }
  }, /*#__PURE__*/React.createElement(Icons.ChevronLeft, {
    size: 16
  }), " Back"), /*#__PURE__*/React.createElement(window.Btn, {
    size: "lg",
    onClick: function onClick() {
      return setStep(2);
    }
  }, "Next: Choose Plan ", /*#__PURE__*/React.createElement(Icons.ChevronRight, {
    size: 16
  })))), step === 2 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(window.Input, {
    label: "Membership Start Date",
    type: "date",
    value: form.startDate,
    onChange: set('startDate'),
    required: true,
    hint: "The day the membership begins"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--t-1)',
      marginBottom: 10
    }
  }, "Membership Plan ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#dc2626'
    }
  }, "*")), window.PLANS.map(function (p) {
    return /*#__PURE__*/React.createElement("div", {
      key: p.id,
      onClick: function onClick() {
        return set('plan')(p.id);
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 18px',
        borderRadius: 12,
        border: "2px solid ".concat(form.plan === p.id ? 'var(--accent)' : 'var(--border)'),
        background: form.plan === p.id ? 'var(--accent-muted)' : 'var(--bg-3)',
        cursor: 'pointer',
        marginBottom: 10,
        transition: 'all 0.15s'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: p.color,
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 15,
        fontWeight: 700,
        color: 'var(--t-1)'
      }
    }, p.name), p.popular && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        background: 'rgba(124,58,237,0.13)',
        color: '#7c3aed',
        padding: '2px 10px',
        borderRadius: 20,
        marginLeft: 10,
        fontWeight: 800
      }
    }, "Most Popular"))), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 16,
        fontWeight: 900,
        color: 'var(--t-1)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, window.fmtCurrency(p.price)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--t-3)',
        fontWeight: 600
      }
    }, p.duration, " days")));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      justifyContent: 'flex-end',
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(window.Btn, {
    variant: "secondary",
    size: "lg",
    onClick: function onClick() {
      return setStep(1);
    }
  }, /*#__PURE__*/React.createElement(Icons.ChevronLeft, {
    size: 16
  }), " Back"), /*#__PURE__*/React.createElement(window.Btn, {
    size: "lg",
    variant: "success",
    onClick: handleAdd,
    disabled: !form.name || !form.phone || !form.plan
  }, /*#__PURE__*/React.createElement(Icons.Check, {
    size: 16
  }), " Add Member"))));
}

// ── Edit Member Modal ────────────────────────────────────────
function EditMemberModal(_ref3) {
  var m = _ref3.member,
    onClose = _ref3.onClose,
    onUpdate = _ref3.onUpdate;
  var _useState7 = useState(_objectSpread({}, m)),
    _useState8 = _slicedToArray(_useState7, 2),
    form = _useState8[0],
    setForm = _useState8[1];
  var Icons = window.GmsIcons;
  var set = function set(k) {
    return function (v) {
      return setForm(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, k, v));
      });
    };
  };
  function handleUpdate() {
    var plan = window.getPlan(form.plan);
    var end = new Date(form.startDate);
    end.setDate(end.getDate() + plan.duration);
    onUpdate(_objectSpread(_objectSpread({}, form), {}, {
      endDate: end.toISOString().split('T')[0]
    }));
  }
  return /*#__PURE__*/React.createElement(window.Modal, {
    onClose: onClose,
    width: 600,
    title: "Edit \u2014 ".concat(m.name)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0 18px'
    }
  }, /*#__PURE__*/React.createElement(window.Input, {
    label: "Full Name",
    value: form.name,
    onChange: set('name'),
    required: true
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Phone",
    value: form.phone,
    onChange: set('phone'),
    required: true
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Email",
    value: form.email || '',
    onChange: set('email'),
    type: "email"
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Area",
    value: form.area,
    onChange: set('area'),
    required: true
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Date of Birth",
    value: form.dob || '',
    onChange: set('dob'),
    type: "date"
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Gender",
    as: "select",
    value: form.gender,
    onChange: set('gender'),
    options: ['Male', 'Female', 'Other']
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Weight",
    value: form.weight || '',
    onChange: set('weight'),
    placeholder: "75 kg"
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Height",
    value: form.height || '',
    onChange: set('height'),
    placeholder: "5'10\""
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Blood Group",
    as: "select",
    value: form.bloodGroup || '',
    onChange: set('bloodGroup'),
    options: ['', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Emergency Contact",
    value: form.emergencyContact || '',
    onChange: set('emergencyContact')
  })), /*#__PURE__*/React.createElement(window.Input, {
    label: "Fitness Goals",
    as: "textarea",
    value: form.goals || '',
    onChange: set('goals'),
    rows: 2
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-3)',
      borderRadius: 12,
      padding: '14px 16px',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--t-1)',
      marginBottom: 12
    }
  }, "Membership"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '0 14px'
    }
  }, /*#__PURE__*/React.createElement(window.Input, {
    label: "Plan",
    as: "select",
    value: form.plan,
    onChange: set('plan'),
    options: window.PLANS.map(function (p) {
      return {
        value: p.id,
        label: p.name
      };
    })
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Start Date",
    type: "date",
    value: form.startDate,
    onChange: set('startDate')
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Status",
    as: "select",
    value: form.status,
    onChange: set('status'),
    options: ['active', 'expiring', 'expired', 'frozen']
  }))), /*#__PURE__*/React.createElement("div", {
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
    onClick: handleUpdate,
    disabled: !form.name || !form.phone
  }, /*#__PURE__*/React.createElement(Icons.Check, {
    size: 14
  }), " Save Changes")));
}

// ── Members Page ─────────────────────────────────────────────
function MembersPage(_ref4) {
  var members = _ref4.members,
    setMembers = _ref4.setMembers,
    onModal = _ref4.onModal,
    payments = _ref4.payments;
  var _useState9 = useState(''),
    _useState0 = _slicedToArray(_useState9, 2),
    search = _useState0[0],
    setSearch = _useState0[1];
  var _useState1 = useState('all'),
    _useState10 = _slicedToArray(_useState1, 2),
    statusFilter = _useState10[0],
    setStatusFilter = _useState10[1];
  var Icons = window.GmsIcons;
  var filtered = useMemo(function () {
    return members.filter(function (m) {
      var matchStatus = statusFilter === 'all' || m.status === statusFilter;
      var q = search.toLowerCase();
      var matchSearch = !q || m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q) || m.phone.includes(q) || m.area.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [members, search, statusFilter]);
  var tabs = [{
    id: 'all',
    label: "All (".concat(members.length, ")")
  }, {
    id: 'active',
    label: "Active (".concat(members.filter(function (m) {
      return m.status === 'active';
    }).length, ")")
  }, {
    id: 'expiring',
    label: "Expiring (".concat(members.filter(function (m) {
      return m.status === 'expiring';
    }).length, ")")
  }, {
    id: 'expired',
    label: "Expired (".concat(members.filter(function (m) {
      return m.status === 'expired';
    }).length, ")")
  }, {
    id: 'frozen',
    label: "Frozen (".concat(members.filter(function (m) {
      return m.status === 'frozen';
    }).length, ")")
  }];
  var memberCols = [{
    key: 'id',
    label: 'ID'
  }, {
    key: 'name',
    label: 'Name'
  }, {
    key: 'phone',
    label: 'Phone'
  }, {
    key: 'email',
    label: 'Email'
  }, {
    key: 'area',
    label: 'Area'
  }, {
    key: 'plan',
    label: 'Plan'
  }, {
    key: 'status',
    label: 'Status'
  }, {
    key: 'joinDate',
    label: 'Join Date'
  }, {
    key: 'endDate',
    label: 'End Date'
  }];
  function deleteMember(_x, _x2) {
    return _deleteMember.apply(this, arguments);
  }
  function _deleteMember() {
    _deleteMember = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(id, name) {
      var ok;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            _context.n = 1;
            return window.gmsConfirm("Are you sure you want to remove ".concat(name, " from the system? Their attendance and payment history will also be removed. This cannot be undone."), 'Remove Member?', 'Yes, Remove Member', 'Cancel');
          case 1:
            ok = _context.v;
            if (ok) {
              setMembers(function (prev) {
                return prev.filter(function (m) {
                  return m.id !== id;
                });
              });
              window.showToast("".concat(name, " has been removed."), 'info');
            }
          case 2:
            return _context.a(2);
        }
      }, _callee);
    }));
    return _deleteMember.apply(this, arguments);
  }
  var modeColor = {
    UPI: '#059669',
    Cash: '#d97706',
    Card: '#2563eb',
    'Net Banking': '#7c3aed',
    Cheque: '#dc2626'
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(window.PageHeader, {
    title: "Members",
    sub: "".concat(members.length, " total \xB7 ").concat(members.filter(function (m) {
      return m.status === 'active';
    }).length, " active"),
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(window.Btn, {
      variant: "secondary",
      size: "md",
      onClick: function onClick() {
        return window.exportCSV(members, memberCols, 'members');
      }
    }, /*#__PURE__*/React.createElement(Icons.Download, {
      size: 14
    }), " Export CSV"), /*#__PURE__*/React.createElement(window.Btn, {
      size: "md",
      onClick: function onClick() {
        return onModal({
          type: 'addMember'
        });
      }
    }, /*#__PURE__*/React.createElement(Icons.UserPlus, {
      size: 14
    }), " Add Member"))
  }), /*#__PURE__*/React.createElement(window.Tabs, {
    tabs: tabs,
    active: statusFilter,
    onChange: setStatusFilter
  }), /*#__PURE__*/React.createElement(window.FilterBar, {
    search: search,
    onSearch: setSearch,
    placeholder: "Search by name, phone number, member ID, or area\u2026"
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
      key: 'member',
      label: 'Member'
    }, {
      key: 'id',
      label: 'Member ID'
    }, {
      key: 'contact',
      label: 'Contact'
    }, {
      key: 'plan',
      label: 'Plan'
    }, {
      key: 'status',
      label: 'Status'
    }, {
      key: 'expiry',
      label: 'Expiry Date'
    }, {
      key: 'actions',
      label: 'Actions',
      right: true
    }],
    empty: "No members match your search filters",
    emptyIcon: Icons.Users,
    rows: filtered.map(function (m) {
      var plan = window.getPlan(m.plan);
      var days = window.daysLeft(m.endDate);
      return /*#__PURE__*/React.createElement("tr", {
        key: m.id,
        style: {
          borderBottom: '1px solid var(--border)',
          transition: 'background 0.12s',
          cursor: 'default'
        },
        onMouseEnter: function onMouseEnter(e) {
          return e.currentTarget.style.background = 'var(--bg-2)';
        },
        onMouseLeave: function onMouseLeave(e) {
          return e.currentTarget.style.background = 'transparent';
        }
      }, /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '14px 16px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }
      }, /*#__PURE__*/React.createElement(window.Avatar, {
        name: m.name,
        color: m.color,
        size: 40
      }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 14,
          fontWeight: 500,
          color: 'var(--t-1)'
        }
      }, m.name), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          color: 'var(--t-3)',
          marginTop: 1
        }
      }, m.area)))), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '14px 16px',
          fontSize: 13,
          color: 'var(--t-3)',
          fontFamily: 'monospace',
          fontWeight: 700
        }
      }, m.id), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '14px 16px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 14,
          color: 'var(--t-1)',
          fontWeight: 600
        }
      }, m.phone), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12.5,
          color: 'var(--t-3)',
          marginTop: 1
        }
      }, m.email || '—')), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '14px 16px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 7
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: plan.color,
          flexShrink: 0
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 13.5,
          color: 'var(--t-1)',
          fontWeight: 600
        }
      }, plan.name))), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '14px 16px'
        }
      }, /*#__PURE__*/React.createElement(window.Badge, {
        status: m.status
      })), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '14px 16px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 14,
          fontWeight: 700,
          color: m.status === 'expired' ? '#dc2626' : m.status === 'expiring' ? '#d97706' : 'var(--t-1)'
        }
      }, window.formatDate(m.endDate)), (m.status === 'active' || m.status === 'expiring') && /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          color: 'var(--t-3)',
          marginTop: 2,
          fontWeight: 600
        }
      }, days, " days left")), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '14px 16px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 6,
          justifyContent: 'flex-end'
        }
      }, /*#__PURE__*/React.createElement(window.IconBtn, {
        icon: Icons.Eye,
        title: "View details",
        onClick: function onClick() {
          return onModal({
            type: 'memberDetail',
            member: m
          });
        }
      }), /*#__PURE__*/React.createElement(window.IconBtn, {
        icon: Icons.Edit,
        title: "Edit member",
        onClick: function onClick() {
          return onModal({
            type: 'editMember',
            member: m
          });
        }
      }), /*#__PURE__*/React.createElement(window.IconBtn, {
        icon: Icons.Trash,
        danger: true,
        title: "Remove member",
        onClick: function onClick() {
          return deleteMember(m.id, m.name);
        }
      }))));
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderTop: '1.5px solid var(--border)',
      background: 'var(--bg-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      color: 'var(--t-3)',
      fontWeight: 600
    }
  }, "Showing ", filtered.length, " of ", members.length, " members"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, ['‹', '1', '›'].map(function (l) {
    return /*#__PURE__*/React.createElement("button", {
      key: l,
      style: {
        width: 32,
        height: 32,
        borderRadius: 8,
        border: '1.5px solid var(--border)',
        background: l === '1' ? 'var(--accent)' : 'var(--bg-1)',
        color: l === '1' ? '#fff' : 'var(--t-3)',
        cursor: 'pointer',
        fontSize: 14,
        fontFamily: 'inherit',
        fontWeight: 700
      }
    }, l);
  })))));
}
Object.assign(window, {
  MembersPage: MembersPage,
  AddMemberModal: AddMemberModal,
  EditMemberModal: EditMemberModal,
  MemberDetailModal: MemberDetailModal
});