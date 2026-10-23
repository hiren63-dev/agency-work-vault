function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var _React = React,
  useState = _React.useState,
  useEffect = _React.useEffect;
function hexToRgba(hex, alpha) {
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  return "rgba(".concat(r, ",").concat(g, ",").concat(b, ",").concat(alpha, ")");
}
window.hexToRgba = hexToRgba;
function applySettings(s) {
  var root = document.documentElement;
  root.style.setProperty('--accent', s.accentColor);
  root.style.setProperty('--accent-muted', hexToRgba(s.accentColor, 0.09));
  root.style.setProperty('--accent-hover', hexToRgba(s.accentColor, 0.17));
  root.setAttribute('data-theme', s.bgMode || 'light');
  var sizes = {
    normal: '16px',
    large: '18px',
    xl: '20px'
  };
  root.style.setProperty('--base-font-size', sizes[s.fontSize] || '16px');
}
var DEFAULT_SETTINGS = {
  accentColor: '#2563eb',
  bgMode: 'light',
  fontSize: 'normal',
  gymName: 'Pulse Studio',
  gymTagline: 'Ahmedabad · Sample workspace'
};
var ErrorBoundary = /*#__PURE__*/function (_React$Component) {
  "use strict";

  function ErrorBoundary(props) {
    var _this;
    _classCallCheck(this, ErrorBoundary);
    _this = _callSuper(this, ErrorBoundary, [props]);
    _this.state = {
      err: null
    };
    return _this;
  }
  _inherits(ErrorBoundary, _React$Component);
  return _createClass(ErrorBoundary, [{
    key: "componentDidCatch",
    value: function componentDidCatch(err, info) {
      console.error('Page error caught by boundary:', err, info);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prev) {
      if (prev.resetKey !== this.props.resetKey && this.state.err) this.setState({
        err: null
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      if (this.state.err) {
        return /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '64px 24px',
            maxWidth: 520,
            margin: '24px auto'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            width: 64,
            height: 64,
            borderRadius: 18,
            background: 'rgba(220,38,38,0.10)',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 18
          }
        }, React.createElement(window.GmsIcons.AlertTriangle, {
          size: 30
        })), /*#__PURE__*/React.createElement("h2", {
          style: {
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--t-1)',
            marginBottom: 8
          }
        }, "Something went wrong on this page"), /*#__PURE__*/React.createElement("p", {
          style: {
            fontSize: 14,
            color: 'var(--t-3)',
            lineHeight: 1.6,
            marginBottom: 24,
            maxWidth: 380
          }
        }, "The rest of the app is still working. Try going back to the dashboard or reloading this page."), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 10
          }
        }, /*#__PURE__*/React.createElement(window.Btn, {
          variant: "secondary",
          size: "md",
          onClick: function onClick() {
            _this2.setState({
              err: null
            });
            window.__gmsNav && window.__gmsNav('dashboard');
          }
        }, "Back to Dashboard"), /*#__PURE__*/React.createElement(window.Btn, {
          size: "md",
          onClick: function onClick() {
            return window.location.reload();
          }
        }, "Reload Page")));
      }
      return this.props.children;
    }
  }], [{
    key: "getDerivedStateFromError",
    value: function getDerivedStateFromError(err) {
      return {
        err: err
      };
    }
  }]);
}(React.Component);
function App() {
  var _useState = useState(true),
    _useState2 = _slicedToArray(_useState, 2),
    isLoggedIn = _useState2[0],
    setLoggedIn = _useState2[1];
  var _useState3 = useState({ id: 'DEMO-OWNER', name: 'Aarav Shah', role: 'owner', email: 'aarav@pulse.studio' }),
    _useState4 = _slicedToArray(_useState3, 2),
    currentUser = _useState4[0],
    setCurrentUser = _useState4[1];
  var _useState5 = useState('dashboard'),
    _useState6 = _slicedToArray(_useState5, 2),
    page = _useState6[0],
    setPage = _useState6[1];
  var _useState7 = useState(null),
    _useState8 = _slicedToArray(_useState7, 2),
    modal = _useState8[0],
    setModal = _useState8[1];
  var _useState9 = useState(window.MEMBERS),
    _useState0 = _slicedToArray(_useState9, 2),
    members = _useState0[0],
    setMembers = _useState0[1];
  var _useState1 = useState(window.PAYMENTS),
    _useState10 = _slicedToArray(_useState1, 2),
    payments = _useState10[0],
    setPayments = _useState10[1];
  var _useState11 = useState(window.ATTENDANCE),
    _useState12 = _slicedToArray(_useState11, 2),
    attendance = _useState12[0],
    setAttendance = _useState12[1];
  var _useState13 = useState(window.ENQUIRIES),
    _useState14 = _slicedToArray(_useState13, 2),
    enquiries = _useState14[0],
    setEnquiries = _useState14[1];
  var _useState15 = useState(window.EXPENSES),
    _useState16 = _slicedToArray(_useState15, 2),
    expenses = _useState16[0],
    setExpenses = _useState16[1];
  var _useState17 = useState(window.TRAINERS || []),
    _useState18 = _slicedToArray(_useState17, 2),
    trainers = _useState18[0],
    setTrainers = _useState18[1];
  var _useState19 = useState(window.PT_SESSIONS || []),
    _useState20 = _slicedToArray(_useState19, 2),
    ptSessions = _useState20[0],
    setPtSessions = _useState20[1];
  var _useState21 = useState(function () {
      try {
        return _objectSpread(_objectSpread({}, DEFAULT_SETTINGS), JSON.parse(localStorage.getItem('portfolio-pulse-settings') || '{}'));
      } catch (_unused) {
        return DEFAULT_SETTINGS;
      }
    }),
    _useState22 = _slicedToArray(_useState21, 2),
    settings = _useState22[0],
    setSettings = _useState22[1];
  var _useState23 = useState(function () {
      try {
        return _objectSpread(_objectSpread({}, window.DEFAULT_PERMISSIONS), JSON.parse(localStorage.getItem('portfolio-pulse-permissions') || '{}'));
      } catch (_unused2) {
        return _objectSpread({}, window.DEFAULT_PERMISSIONS);
      }
    }),
    _useState24 = _slicedToArray(_useState23, 2),
    permissions = _useState24[0],
    setPermissions = _useState24[1];
  useEffect(function () {
    applySettings(settings);
    localStorage.setItem('portfolio-pulse-settings', JSON.stringify(settings));
  }, [settings]);
  useEffect(function () {
    localStorage.setItem('portfolio-pulse-permissions', JSON.stringify(permissions));
  }, [permissions]);
  var allowedPages = !currentUser || currentUser.role === 'owner' ? window.ALL_PAGES : permissions[currentUser.role] || ['dashboard'];
  useEffect(function () {
    if (isLoggedIn && currentUser && !allowedPages.includes(page)) setPage('dashboard');
  }, [permissions, currentUser, page]);
  window.__gmsNav = setPage;
  window.__gmsLogout = function () {
    return window.location.reload();
  };
  window.__gmsGymInfo = {
    name: settings.gymName || 'My Gym',
    tagline: settings.gymTagline || 'Gym Management System'
  };
  window.__gmsCheckIn = function (m) {
    var now = new Date();
    var todayStr = now.toISOString().split('T')[0];
    var t = now.toTimeString().slice(0, 5);
    if (attendance.some(function (a) {
      return a.memberId === m.id && a.date === todayStr;
    })) {
      window.showToast("".concat(m.name, " is already checked in today."), 'info');
      return;
    }
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
    window.showToast("".concat(m.name, " checked in at ").concat(t), 'success');
  };
  useEffect(function () {
    var h = function h(e) {
      if (e.key === 'Escape' && modal) setModal(null);
    };
    window.addEventListener('keydown', h);
    return function () {
      return window.removeEventListener('keydown', h);
    };
  }, [modal]);
  if (!isLoggedIn) {
    if (!currentUser) setCurrentUser({ id: 'DEMO-OWNER', name: 'Aarav Shah', role: 'owner', email: 'aarav@pulse.studio' });
    setLoggedIn(true);
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AppShell, {
    page: page,
    onNav: setPage,
    onModal: setModal,
    gymName: settings.gymName || 'My Gym',
    gymTagline: settings.gymTagline || 'Gym Management System',
    members: members,
    enquiries: enquiries,
    currentUser: currentUser,
    allowedPages: allowedPages
  }, /*#__PURE__*/React.createElement(ErrorBoundary, {
    resetKey: page
  }, page === 'dashboard' && /*#__PURE__*/React.createElement(DashboardPage, {
    members: members,
    payments: payments,
    attendance: attendance,
    onModal: setModal,
    currentUser: currentUser
  }), page === 'members' && /*#__PURE__*/React.createElement(MembersPage, {
    members: members,
    setMembers: setMembers,
    onModal: setModal,
    payments: payments
  }), page === 'payments' && /*#__PURE__*/React.createElement(PaymentsPage, {
    payments: payments,
    setPayments: setPayments,
    members: members,
    onModal: setModal
  }), page === 'attendance' && /*#__PURE__*/React.createElement(AttendancePage, {
    attendance: attendance,
    members: members,
    setAttendance: setAttendance
  }), page === 'enquiries' && /*#__PURE__*/React.createElement(EnquiriesPage, {
    enquiries: enquiries,
    setEnquiries: setEnquiries
  }), page === 'expenses' && /*#__PURE__*/React.createElement(ExpensesPage, {
    expenses: expenses,
    setExpenses: setExpenses
  }), page === 'reports' && /*#__PURE__*/React.createElement(ReportsPage, {
    payments: payments,
    members: members,
    attendance: attendance
  }), page === 'trainers' && /*#__PURE__*/React.createElement(TrainersPage, {
    trainers: trainers,
    setTrainers: setTrainers,
    members: members
  }), page === 'ptsessions' && /*#__PURE__*/React.createElement(PTSessionsPage, {
    ptSessions: ptSessions,
    setPtSessions: setPtSessions,
    members: members,
    trainers: trainers
  }), page === 'settings' && /*#__PURE__*/React.createElement(SettingsPage, {
    settings: settings,
    onSave: setSettings,
    currentUser: currentUser,
    permissions: permissions,
    setPermissions: setPermissions
  })), (modal === null || modal === void 0 ? void 0 : modal.type) === 'addMember' && /*#__PURE__*/React.createElement(AddMemberModal, {
    onClose: function onClose() {
      return setModal(null);
    },
    onAdd: function onAdd(m) {
      setMembers(function (p) {
        return [m].concat(_toConsumableArray(p));
      });
      setModal(null);
      window.showToast('Member added successfully!', 'success');
    }
  }), (modal === null || modal === void 0 ? void 0 : modal.type) === 'editMember' && /*#__PURE__*/React.createElement(EditMemberModal, {
    member: modal.member,
    onClose: function onClose() {
      return setModal(null);
    },
    onUpdate: function onUpdate(m) {
      setMembers(function (p) {
        return p.map(function (x) {
          return x.id === m.id ? m : x;
        });
      });
      setModal(null);
      window.showToast('Member updated.', 'success');
    }
  }), (modal === null || modal === void 0 ? void 0 : modal.type) === 'memberDetail' && /*#__PURE__*/React.createElement(MemberDetailModal, {
    member: modal.member,
    payments: payments,
    onClose: function onClose() {
      return setModal(null);
    },
    onModal: setModal
  }), (modal === null || modal === void 0 ? void 0 : modal.type) === 'collectPayment' && /*#__PURE__*/React.createElement(CollectPaymentModal, {
    members: members,
    onClose: function onClose() {
      return setModal(null);
    },
    onCollect: function onCollect(p) {
      setPayments(function (prev) {
        return [p].concat(_toConsumableArray(prev));
      });
      setModal(null);
      window.showToast('Payment recorded successfully!', 'success');
    }
  })), /*#__PURE__*/React.createElement(window.ToastContainer, null), /*#__PURE__*/React.createElement(window.ConfirmDialogHost, null));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));