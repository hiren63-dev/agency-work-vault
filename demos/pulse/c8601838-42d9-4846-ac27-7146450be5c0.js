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
// gms/layout.jsx — White-label sidebar with collapse toggle
var _window = window,
  React = _window.React;
var useState = React.useState;
var PAGE_INFO = {
  dashboard: {
    label: 'Dashboard',
    sub: 'Your gym\'s daily summary'
  },
  members: {
    label: 'Members',
    sub: 'Manage all gym members'
  },
  enquiries: {
    label: 'Enquiries',
    sub: 'Track leads and walk-ins'
  },
  attendance: {
    label: 'Attendance',
    sub: 'Daily check-in records'
  },
  trainers: {
    label: 'Trainers',
    sub: 'Manage your gym trainers'
  },
  ptsessions: {
    label: 'PT Sessions',
    sub: 'Personal training sessions'
  },
  payments: {
    label: 'Payments',
    sub: 'Transactions and receipts'
  },
  expenses: {
    label: 'Expenses',
    sub: 'Track gym running costs'
  },
  reports: {
    label: 'Reports',
    sub: 'Revenue and membership analytics'
  },
  settings: {
    label: 'Settings',
    sub: 'Appearance and gym details'
  }
};
var NAV_GROUPS = [{
  label: 'Overview',
  items: [{
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'Dashboard'
  }]
}, {
  label: 'Members',
  items: [{
    id: 'members',
    label: 'Members',
    icon: 'Users'
  }, {
    id: 'enquiries',
    label: 'Enquiries',
    icon: 'MessageSquare'
  }]
}, {
  label: 'Day to Day',
  items: [{
    id: 'attendance',
    label: 'Attendance',
    icon: 'Calendar'
  }, {
    id: 'trainers',
    label: 'Trainers',
    icon: 'User'
  }, {
    id: 'ptsessions',
    label: 'PT Sessions',
    icon: 'Clock'
  }]
}, {
  label: 'Money',
  items: [{
    id: 'payments',
    label: 'Payments',
    icon: 'Dollar'
  }, {
    id: 'expenses',
    label: 'Expenses',
    icon: 'TrendingDown'
  }, {
    id: 'reports',
    label: 'Reports',
    icon: 'BarChart'
  }]
}, {
  label: 'System',
  items: [{
    id: 'settings',
    label: 'Settings',
    icon: 'Settings'
  }]
}];
function gymMonogram(name) {
  return (name || 'GY').trim().split(/\s+/).map(function (w) {
    return w[0];
  }).join('').slice(0, 2).toUpperCase();
}
function Sidebar(_ref) {
  var page = _ref.page,
    onNav = _ref.onNav,
    onLogout = _ref.onLogout,
    gymName = _ref.gymName,
    gymTagline = _ref.gymTagline,
    collapsed = _ref.collapsed,
    currentUser = _ref.currentUser,
    allowedPages = _ref.allowedPages;
  var Icons = window.GmsIcons;
  var mono = gymMonogram(gymName || 'My Gym');
  var role = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) || 'owner';
  var ROLE_COLOR = {
    owner: '#7c3aed',
    manager: '#2563eb',
    trainer: '#059669',
    receptionist: '#d97706'
  };
  var ROLE_LABEL = {
    owner: 'Owner',
    manager: 'Manager',
    trainer: 'Trainer',
    receptionist: 'Receptionist'
  };
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: collapsed ? 64 : 272,
      minHeight: '100vh',
      background: 'var(--bg-1)',
      borderRight: '1.5px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: 100,
      boxShadow: '2px 0 10px rgba(0,0,0,0.04)',
      transition: 'width 0.25s cubic-bezier(0.25,0.46,0.45,0.94)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: collapsed ? '18px 0' : '20px 18px',
      borderBottom: '1.5px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      justifyContent: collapsed ? 'center' : 'flex-start',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 10,
      background: 'var(--accent)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      color: '#fff',
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      userSelect: 'none'
    }
  }, mono), !collapsed && /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'hidden',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--t-1)',
      letterSpacing: '-0.02em',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, gymName || 'My Gym'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--t-3)',
      fontWeight: 400,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      marginTop: 1
    }
  }, gymTagline || 'Gym Management'))), /*#__PURE__*/React.createElement("nav", {
    style: {
      flex: 1,
      padding: collapsed ? '10px 6px' : '12px 8px',
      overflowY: 'auto',
      overflowX: 'hidden'
    }
  }, NAV_GROUPS.map(function (g) {
    var visibleItems = g.items.filter(function (item) {
      return (allowedPages || []).includes(item.id);
    });
    if (!visibleItems.length) return null;
    return /*#__PURE__*/React.createElement("div", {
      key: g.label,
      style: {
        marginBottom: collapsed ? 0 : 2
      }
    }, !collapsed && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 800,
        color: 'var(--t-3)',
        textTransform: 'uppercase',
        letterSpacing: '0.10em',
        padding: '10px 14px 4px'
      }
    }, g.label), collapsed && /*#__PURE__*/React.createElement("div", {
      style: {
        height: 10
      }
    }), visibleItems.map(function (item) {
      var Icon = Icons[item.icon];
      var active = page === item.id;
      return /*#__PURE__*/React.createElement("button", {
        key: item.id,
        onClick: function onClick() {
          return onNav(item.id);
        },
        title: collapsed ? item.label : undefined,
        className: "nav-btn".concat(active ? ' nav-active' : ''),
        style: {
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '10px 0' : '10px 14px'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        size: 19
      }), !collapsed && item.label);
    }));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: collapsed ? '10px 6px' : '12px 8px',
      borderTop: '1.5px solid var(--border)',
      flexShrink: 0
    }
  }, !collapsed && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '9px 12px',
      marginBottom: 4,
      borderRadius: 10,
      background: 'var(--bg-3)'
    }
  }, /*#__PURE__*/React.createElement(window.Avatar, {
    name: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.name) || 'Owner',
    color: ROLE_COLOR[role],
    size: 34
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'hidden',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 600,
      color: 'var(--t-1)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, (currentUser === null || currentUser === void 0 ? void 0 : currentUser.name) || 'Gym Owner'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: ROLE_COLOR[role] || 'var(--t-3)',
      fontWeight: 600
    }
  }, ROLE_LABEL[role] || 'Staff'))), collapsed && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(window.Avatar, {
    name: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.name) || 'Owner',
    color: ROLE_COLOR[role],
    size: 34
  })), /*#__PURE__*/React.createElement("button", {
    onClick: onLogout,
    className: "nav-btn",
    title: collapsed ? 'Sign Out' : undefined,
    style: {
      color: '#dc2626',
      marginBottom: 0,
      justifyContent: collapsed ? 'center' : 'flex-start',
      padding: collapsed ? '10px 0' : '10px 14px'
    },
    onMouseEnter: function onMouseEnter(e) {
      return e.currentTarget.style.background = 'rgba(220,38,38,0.07)';
    },
    onMouseLeave: function onMouseLeave(e) {
      return e.currentTarget.style.background = 'transparent';
    }
  }, /*#__PURE__*/React.createElement(Icons.LogOut, {
    size: 18
  }), !collapsed && 'Sign Out')));
}
function Header(_ref2) {
  var page = _ref2.page,
    onModal = _ref2.onModal,
    onToggle = _ref2.onToggle,
    onNav = _ref2.onNav,
    _ref2$members = _ref2.members,
    members = _ref2$members === void 0 ? [] : _ref2$members,
    _ref2$enquiries = _ref2.enquiries,
    enquiries = _ref2$enquiries === void 0 ? [] : _ref2$enquiries,
    currentUser = _ref2.currentUser;
  var info = PAGE_INFO[page] || {
    label: page,
    sub: ''
  };
  var Icons = window.GmsIcons;
  var ROLE_COLOR = {
    owner: '#7c3aed',
    manager: '#2563eb',
    trainer: '#059669',
    receptionist: '#d97706'
  };
  var role = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) || 'owner';
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    notifOpen = _useState2[0],
    setNotifOpen = _useState2[1];
  var notifRef = React.useRef(null);
  var notifications = [].concat(_toConsumableArray(members.filter(function (m) {
    return m.status === 'expiring';
  }).map(function (m) {
    return {
      id: 'exp-' + m.id,
      color: '#d97706',
      icon: 'AlertTriangle',
      title: "".concat(m.name, "'s membership is expiring soon"),
      sub: "Expires ".concat(window.formatDate(m.endDate), " \xB7 ").concat(window.daysLeft(m.endDate), " days left"),
      go: 'members'
    };
  })), _toConsumableArray(members.filter(function (m) {
    return m.status === 'expired';
  }).map(function (m) {
    return {
      id: 'exd-' + m.id,
      color: '#dc2626',
      icon: 'AlertTriangle',
      title: "".concat(m.name, "'s membership has expired"),
      sub: "Expired ".concat(window.formatDate(m.endDate), " \u2014 follow up to renew"),
      go: 'members'
    };
  })), _toConsumableArray(enquiries.filter(function (e) {
    return e.status === 'new';
  }).map(function (e) {
    return {
      id: 'enq-' + e.id,
      color: 'var(--accent)',
      icon: 'MessageSquare',
      title: "New enquiry from ".concat(e.name),
      sub: "".concat(e.source, " \xB7 interested in ").concat(e.interest),
      go: 'enquiries'
    };
  })));
  var count = notifications.length;
  React.useEffect(function () {
    function onDoc(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    if (notifOpen) document.addEventListener('mousedown', onDoc);
    return function () {
      return document.removeEventListener('mousedown', onDoc);
    };
  }, [notifOpen]);
  function openNotif(n) {
    setNotifOpen(false);
    onNav && onNav(n.go);
  }
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: 60,
      background: 'var(--bg-1)',
      borderBottom: '1.5px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onToggle,
    style: {
      width: 34,
      height: 34,
      borderRadius: 8,
      background: 'var(--bg-3)',
      border: '1.5px solid var(--border)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--t-2)',
      flexShrink: 0,
      transition: 'all 0.15s'
    },
    onMouseEnter: function onMouseEnter(e) {
      return e.currentTarget.style.background = 'var(--bg-4)';
    },
    onMouseLeave: function onMouseLeave(e) {
      return e.currentTarget.style.background = 'var(--bg-3)';
    }
  }, /*#__PURE__*/React.createElement(Icons.Menu, {
    size: 15
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      color: 'var(--t-1)',
      letterSpacing: '-0.02em'
    }
  }, info.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--t-3)',
      marginTop: 1,
      fontWeight: 400
    }
  }, info.sub))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, page === 'members' && /*#__PURE__*/React.createElement(window.Btn, {
    size: "md",
    onClick: function onClick() {
      return onModal({
        type: 'addMember'
      });
    }
  }, /*#__PURE__*/React.createElement(Icons.UserPlus, {
    size: 15
  }), " Add Member"), page === 'payments' && /*#__PURE__*/React.createElement(window.Btn, {
    size: "md",
    onClick: function onClick() {
      return onModal({
        type: 'collectPayment'
      });
    }
  }, /*#__PURE__*/React.createElement(Icons.Dollar, {
    size: 15
  }), " Collect Payment"), /*#__PURE__*/React.createElement("div", {
    ref: notifRef,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setNotifOpen(function (o) {
        return !o;
      });
    },
    title: "Notifications",
    style: {
      width: 38,
      height: 38,
      borderRadius: 9,
      background: notifOpen ? 'var(--bg-4)' : 'var(--bg-3)',
      border: '1.5px solid var(--border)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--t-2)',
      position: 'relative',
      transition: 'all 0.15s'
    }
  }, /*#__PURE__*/React.createElement(Icons.Bell, {
    size: 16
  }), count > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -5,
      right: -5,
      minWidth: 17,
      height: 17,
      padding: '0 4px',
      borderRadius: 9,
      background: '#dc2626',
      color: '#fff',
      fontSize: 10.5,
      fontWeight: 800,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid var(--bg-1)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, count)), notifOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'calc(100% + 10px)',
      right: 0,
      width: 340,
      maxHeight: 420,
      overflowY: 'auto',
      background: 'var(--bg-1)',
      border: '1.5px solid var(--border)',
      borderRadius: 14,
      zIndex: 200,
      boxShadow: 'var(--shadow-md)',
      animation: 'fadeUp 0.18s ease'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      borderBottom: '1.5px solid var(--border)',
      position: 'sticky',
      top: 0,
      background: 'var(--bg-1)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--t-1)'
    }
  }, "Notifications"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: 'var(--t-3)',
      background: 'var(--bg-3)',
      padding: '2px 9px',
      borderRadius: 20
    }
  }, count, " new")), count === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '36px 24px',
      textAlign: 'center',
      color: 'var(--t-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 10,
      color: 'var(--t-3)'
    }
  }, /*#__PURE__*/React.createElement(Icons.Bell, {
    size: 26
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--t-2)'
    }
  }, "You're all caught up"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      marginTop: 4
    }
  }, "No new alerts right now.")) : notifications.map(function (n) {
    var NIcon = Icons[n.icon];
    return /*#__PURE__*/React.createElement("button", {
      key: n.id,
      onClick: function onClick() {
        return openNotif(n);
      },
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        width: '100%',
        textAlign: 'left',
        padding: '13px 16px',
        borderBottom: '1px solid var(--border)',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'background 0.12s'
      },
      onMouseEnter: function onMouseEnter(e) {
        return e.currentTarget.style.background = 'var(--bg-2)';
      },
      onMouseLeave: function onMouseLeave(e) {
        return e.currentTarget.style.background = 'transparent';
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 34,
        height: 34,
        borderRadius: 9,
        flexShrink: 0,
        marginTop: 1,
        background: "color-mix(in srgb, ".concat(n.color, " 15%, transparent)"),
        color: n.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(NIcon, {
      size: 16
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13.5,
        fontWeight: 600,
        color: 'var(--t-1)',
        lineHeight: 1.4
      }
    }, n.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--t-3)',
        marginTop: 2,
        lineHeight: 1.4
      }
    }, n.sub)), /*#__PURE__*/React.createElement(Icons.ChevronRight, {
      size: 15,
      style: {
        color: 'var(--t-3)',
        flexShrink: 0,
        marginTop: 3
      }
    }));
  }))), /*#__PURE__*/React.createElement(window.Avatar, {
    name: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.name) || 'Owner',
    color: ROLE_COLOR[role],
    size: 36
  })));
}
function AppShell(_ref3) {
  var children = _ref3.children,
    page = _ref3.page,
    onNav = _ref3.onNav,
    onModal = _ref3.onModal,
    gymName = _ref3.gymName,
    gymTagline = _ref3.gymTagline,
    members = _ref3.members,
    enquiries = _ref3.enquiries,
    currentUser = _ref3.currentUser,
    allowedPages = _ref3.allowedPages;
  var _useState3 = useState(function () {
      try {
        return localStorage.getItem('portfolio-pulse-sidebar') === 'true';
      } catch (_unused) {
        return false;
      }
    }),
    _useState4 = _slicedToArray(_useState3, 2),
    collapsed = _useState4[0],
    setCollapsed = _useState4[1];
  function toggle() {
    var next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem('portfolio-pulse-sidebar', String(next));
    } catch (_unused2) {}
  }
  var sidebarW = collapsed ? 64 : 272;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      minHeight: '100vh'
    }
  }, /*#__PURE__*/React.createElement(Sidebar, {
    page: page,
    onNav: onNav,
    onLogout: function onLogout() {
      return window.__gmsLogout && window.__gmsLogout();
    },
    gymName: gymName,
    gymTagline: gymTagline,
    collapsed: collapsed,
    currentUser: currentUser,
    allowedPages: allowedPages
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: sidebarW,
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      transition: 'margin-left 0.25s cubic-bezier(0.25,0.46,0.45,0.94)'
    }
  }, /*#__PURE__*/React.createElement(Header, {
    page: page,
    onModal: onModal,
    onToggle: toggle,
    onNav: onNav,
    members: members,
    enquiries: enquiries,
    currentUser: currentUser
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      padding: '28px 30px',
      overflowY: 'auto'
    }
  }, children)));
}
Object.assign(window, {
  Sidebar: Sidebar,
  Header: Header,
  AppShell: AppShell
});