function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// gms/dashboard.jsx — Dashboard page (novice-friendly, larger, clearer)
var _window = window,
  React = _window.React;
var useState = React.useState,
  useMemo = React.useMemo;
function RevenueChart(_ref) {
  var payments = _ref.payments;
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var now = new Date();
  var data = Array.from({
    length: 6
  }, function (_, i) {
    var d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    var key = "".concat(d.getFullYear(), "-").concat(String(d.getMonth() + 1).padStart(2, '0'));
    var total = payments.filter(function (p) {
      return p.date.startsWith(key);
    }).reduce(function (s, p) {
      return s + p.amount;
    }, 0);
    return {
      month: months[d.getMonth()],
      total: total
    };
  });
  var max = Math.max.apply(Math, _toConsumableArray(data.map(function (d) {
    return d.total;
  })).concat([1000]));
  var W = 520,
    H = 140,
    PL = 14,
    PR = 14,
    PT = 12,
    PB = 28;
  var cW = W - PL - PR,
    cH = H - PT - PB;
  var pts = data.map(function (d, i) {
    return {
      x: PL + i / (data.length - 1) * cW,
      y: PT + cH - d.total / max * cH
    };
  });
  var polyline = pts.map(function (p) {
    return "".concat(p.x, ",").concat(p.y);
  }).join(' ');
  var area = "".concat(pts[0].x, ",").concat(PT + cH, " ").concat(polyline, " ").concat(pts[pts.length - 1].x, ",").concat(PT + cH);
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 ".concat(W, " ").concat(H),
    style: {
      width: '100%',
      height: H
    }
  }, [0.25, 0.5, 0.75, 1].map(function (f) {
    return /*#__PURE__*/React.createElement("line", {
      key: f,
      x1: PL,
      x2: W - PR,
      y1: PT + cH * (1 - f),
      y2: PT + cH * (1 - f),
      stroke: "var(--border)",
      strokeWidth: "1.5",
      strokeDasharray: "5,5"
    });
  }), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "ag",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "var(--accent)",
    stopOpacity: "0.25"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "var(--accent)",
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("polygon", {
    points: area,
    fill: "url(#ag)"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: polyline,
    fill: "none",
    stroke: "var(--accent)",
    strokeWidth: "2.5",
    strokeLinejoin: "round",
    strokeLinecap: "round"
  }), pts.map(function (p, i) {
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("circle", {
      cx: p.x,
      cy: p.y,
      r: "5",
      fill: "var(--accent)",
      stroke: "var(--bg-1)",
      strokeWidth: "2.5"
    }), /*#__PURE__*/React.createElement("text", {
      x: p.x,
      y: H - 4,
      textAnchor: "middle",
      fill: "var(--t-3)",
      fontSize: "11",
      fontFamily: "inherit",
      fontWeight: "700"
    }, data[i].month), data[i].total > 0 && /*#__PURE__*/React.createElement("text", {
      x: p.x,
      y: p.y - 10,
      textAnchor: "middle",
      fill: "var(--accent)",
      fontSize: "10",
      fontFamily: "inherit",
      fontWeight: "700"
    }, "\u20B9", Math.round(data[i].total / 1000), "k"));
  }));
}
function AttendanceCalendar(_ref2) {
  var attendance = _ref2.attendance;
  var now = new Date();
  var year = now.getFullYear(),
    month = now.getMonth();
  var days = new Date(year, month + 1, 0).getDate();
  var startDay = new Date(year, month, 1).getDay();
  var padded = (startDay + 6) % 7;
  var dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  var countMap = {};
  attendance.forEach(function (a) {
    countMap[a.date] = (countMap[a.date] || 0) + 1;
  });
  var cells = [];
  for (var i = 0; i < padded; i++) cells.push(null);
  for (var d = 1; d <= days; d++) cells.push(d);
  var todayDate = now.getDate();
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7,1fr)',
      gap: 4,
      marginBottom: 8
    }
  }, dayNames.map(function (d, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        textAlign: 'center',
        fontSize: 11,
        color: 'var(--t-3)',
        fontWeight: 800,
        padding: '2px 0'
      }
    }, d);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7,1fr)',
      gap: 4
    }
  }, cells.map(function (d, i) {
    if (!d) return /*#__PURE__*/React.createElement("div", {
      key: i
    });
    var key = "".concat(year, "-").concat(String(month + 1).padStart(2, '0'), "-").concat(String(d).padStart(2, '0'));
    var cnt = countMap[key] || 0;
    var isToday = d === todayDate;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        aspectRatio: '1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: isToday ? 900 : 700,
        background: isToday ? 'var(--accent)' : cnt > 0 ? 'rgba(5,150,105,0.12)' : 'var(--bg-3)',
        color: isToday ? '#fff' : cnt > 0 ? '#059669' : 'var(--t-2)',
        border: isToday ? 'none' : '1px solid transparent'
      }
    }, d, cnt > 0 && !isToday && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        opacity: 0.8,
        marginTop: 1
      }
    }, cnt));
  })));
}
function DashboardPage(_ref3) {
  var members = _ref3.members,
    payments = _ref3.payments,
    attendance = _ref3.attendance,
    onModal = _ref3.onModal,
    currentUser = _ref3.currentUser;
  var Icons = window.GmsIcons;
  var now = new Date();
  var todayStr = now.toISOString().split('T')[0];
  var monthStr = "".concat(now.getFullYear(), "-").concat(String(now.getMonth() + 1).padStart(2, '0'));
  var lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  var lastMonthStr = "".concat(lastMonthDate.getFullYear(), "-").concat(String(lastMonthDate.getMonth() + 1).padStart(2, '0'));
  var active = members.filter(function (m) {
    return m.status === 'active';
  }).length;
  var expiring = members.filter(function (m) {
    return m.status === 'expiring';
  }).length;
  var todayCheckins = attendance.filter(function (a) {
    return a.date === todayStr;
  }).length;
  var thisMonthRev = payments.filter(function (p) {
    return p.date.startsWith(monthStr);
  }).reduce(function (s, p) {
    return s + p.amount;
  }, 0);
  var lastMonthRev = payments.filter(function (p) {
    return p.date.startsWith(lastMonthStr);
  }).reduce(function (s, p) {
    return s + p.amount;
  }, 0);
  var revDiff = lastMonthRev > 0 ? Math.round((thisMonthRev - lastMonthRev) / lastMonthRev * 100) : null;
  var statusCounts = {
    active: 0,
    expiring: 0,
    expired: 0,
    frozen: 0
  };
  members.forEach(function (m) {
    statusCounts[m.status] = (statusCounts[m.status] || 0) + 1;
  });
  var total = members.length || 1;
  var recentActivity = _toConsumableArray(attendance).sort(function (a, b) {
    return b.date.localeCompare(a.date) || b.checkIn.localeCompare(a.checkIn);
  }).slice(0, 5);
  var hour = now.getHours();
  var greeting = hour < 12 ? 'Good morning' : 'Good afternoon';
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 22,
      fontWeight: 600,
      color: 'var(--t-1)',
      letterSpacing: '-0.025em',
      marginBottom: 5
    }
  }, greeting, ", ", ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.name) || 'Gym Owner').split(' ')[0]), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--t-3)',
      fontWeight: 400
    }
  }, now.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }))), expiring > 0 && /*#__PURE__*/React.createElement("div", {
    onClick: function onClick() {
      return window.__gmsNav && window.__gmsNav('members');
    },
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '16px 20px',
      background: 'rgba(217,119,6,0.08)',
      border: '2px solid rgba(217,119,6,0.30)',
      borderRadius: 14,
      marginBottom: 24,
      cursor: 'pointer',
      transition: 'background 0.15s'
    },
    onMouseEnter: function onMouseEnter(e) {
      return e.currentTarget.style.background = 'rgba(217,119,6,0.13)';
    },
    onMouseLeave: function onMouseLeave(e) {
      return e.currentTarget.style.background = 'rgba(217,119,6,0.08)';
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: '#d97706',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: '#d97706'
    }
  }, expiring, " member", expiring > 1 ? 's' : '', " expiring within the next 7 days"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: '#92600a',
      marginTop: 2
    }
  }, "Contact them to remind them to renew.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      color: '#d97706',
      fontWeight: 700,
      fontSize: 14,
      flexShrink: 0
    }
  }, "View Members ", /*#__PURE__*/React.createElement(Icons.ChevronRight, {
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 16,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(window.StatCard, {
    label: "Active Members",
    value: active,
    sub: expiring > 0 ? "".concat(expiring, " expiring soon") : 'All memberships in order',
    icon: Icons.Users,
    accent: "#059669",
    trend: expiring > 0 ? 'down' : null
  }), /*#__PURE__*/React.createElement(window.StatCard, {
    label: "Today's Check-ins",
    value: todayCheckins,
    sub: "Members in the gym today",
    icon: Icons.Calendar,
    accent: "var(--accent)"
  }), /*#__PURE__*/React.createElement(window.StatCard, {
    label: "This Month's Revenue",
    value: window.fmtCurrency(thisMonthRev),
    sub: revDiff !== null ? "".concat(revDiff > 0 ? '+' : '').concat(revDiff, "% vs last month") : 'No prior month data',
    icon: Icons.Dollar,
    accent: "#7c3aed",
    trend: revDiff > 0 ? 'up' : revDiff < 0 ? 'down' : null
  }), /*#__PURE__*/React.createElement(window.StatCard, {
    label: "Total Members",
    value: members.length,
    sub: "".concat(members.filter(function (m) {
      return m.status === 'expired';
    }).length, " expired memberships"),
    icon: Icons.Users,
    accent: "#d97706"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.6fr 1fr',
      gap: 18,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-1)',
      border: '1.5px solid var(--border)',
      borderRadius: 16,
      padding: '22px 24px',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 800,
      color: 'var(--t-1)'
    }
  }, "Revenue \u2014 Last 6 Months"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--t-3)',
      marginTop: 3
    }
  }, "How much money your gym collected each month")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 900,
      color: 'var(--t-1)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, window.fmtCurrency(thisMonthRev))), /*#__PURE__*/React.createElement(RevenueChart, {
    payments: payments
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-1)',
      border: '1.5px solid var(--border)',
      borderRadius: 16,
      padding: '22px 24px',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 800,
      color: 'var(--t-1)',
      marginBottom: 18
    }
  }, "Membership Health"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(window.ProgressRing, {
    pct: Math.round(active / total * 100),
    size: 96,
    color: "#059669",
    label: "".concat(Math.round(active / total * 100), "%"),
    sub: "active"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      flex: 1
    }
  }, [{
    label: 'Active',
    count: statusCounts.active || 0,
    color: '#059669'
  }, {
    label: 'Expiring',
    count: statusCounts.expiring || 0,
    color: '#d97706'
  }, {
    label: 'Expired',
    count: statusCounts.expired || 0,
    color: '#dc2626'
  }, {
    label: 'Frozen',
    count: statusCounts.frozen || 0,
    color: '#2563eb'
  }].map(function (s) {
    return /*#__PURE__*/React.createElement("div", {
      key: s.label,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: s.color,
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: 'var(--t-2)',
        flex: 1,
        fontWeight: 600
      }
    }, s.label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 15,
        fontWeight: 900,
        color: 'var(--t-1)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, s.count));
  }))))), /*#__PURE__*/React.createElement("div", {
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
      padding: '22px 24px',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 800,
      color: 'var(--t-1)'
    }
  }, now.toLocaleString('default', {
    month: 'long'
  }), " ", now.getFullYear(), " \u2014 Attendance"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--accent)',
      fontWeight: 700
    }
  }, todayCheckins, " today")), /*#__PURE__*/React.createElement(AttendanceCalendar, {
    attendance: attendance
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-1)',
      border: '1.5px solid var(--border)',
      borderRadius: 16,
      padding: '22px 24px',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 800,
      color: 'var(--t-1)',
      marginBottom: 16
    }
  }, "Recent Check-ins"), recentActivity.length === 0 ? /*#__PURE__*/React.createElement(window.EmptyState, {
    icon: Icons.Calendar,
    title: "No check-ins recorded yet",
    sub: "Go to Attendance to mark members as present."
  }) : recentActivity.map(function (a) {
    var m = window.getMember(a.memberId);
    return /*#__PURE__*/React.createElement("div", {
      key: a.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 0',
        borderBottom: '1px solid var(--border)'
      }
    }, /*#__PURE__*/React.createElement(window.Avatar, {
      name: a.memberName,
      color: m === null || m === void 0 ? void 0 : m.color,
      size: 38
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 700,
        color: 'var(--t-1)'
      }
    }, a.memberName), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: 'var(--t-3)',
        marginTop: 1
      }
    }, a.date === todayStr ? 'Today' : a.date, " \xB7 Checked in at ", a.checkIn)), a.checkOut ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: 'var(--t-3)',
        fontWeight: 600
      }
    }, "Left ", a.checkOut) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        padding: '4px 12px',
        borderRadius: 20,
        background: 'rgba(5,150,105,0.10)',
        color: '#059669',
        fontWeight: 800
      }
    }, "In Gym"));
  }))));
}
Object.assign(window, {
  DashboardPage: DashboardPage
});