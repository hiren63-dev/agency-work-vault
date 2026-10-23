function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// gms/payments.jsx — Payments page + Collect Payment modal (novice-friendly)
var _window = window,
  React = _window.React;
var useState = React.useState,
  useMemo = React.useMemo;
function CollectPaymentModal(_ref) {
  var members = _ref.members,
    onClose = _ref.onClose,
    onCollect = _ref.onCollect;
  var Icons = window.GmsIcons;
  var _useState = useState(''),
    _useState2 = _slicedToArray(_useState, 2),
    memberQ = _useState2[0],
    setMemberQ = _useState2[1];
  var _useState3 = useState(null),
    _useState4 = _slicedToArray(_useState3, 2),
    selectedMember = _useState4[0],
    setSelected = _useState4[1];
  var _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    showSugg = _useState6[0],
    setShowSugg = _useState6[1];
  var _useState7 = useState('Membership'),
    _useState8 = _slicedToArray(_useState7, 2),
    category = _useState8[0],
    setCategory = _useState8[1];
  var _useState9 = useState(''),
    _useState0 = _slicedToArray(_useState9, 2),
    amount = _useState0[0],
    setAmount = _useState0[1];
  var _useState1 = useState('0'),
    _useState10 = _slicedToArray(_useState1, 2),
    discount = _useState10[0],
    setDiscount = _useState10[1];
  var _useState11 = useState('UPI'),
    _useState12 = _slicedToArray(_useState11, 2),
    mode = _useState12[0],
    setMode = _useState12[1];
  var _useState13 = useState(''),
    _useState14 = _slicedToArray(_useState13, 2),
    txnId = _useState14[0],
    setTxnId = _useState14[1];
  var _useState15 = useState(''),
    _useState16 = _slicedToArray(_useState15, 2),
    note = _useState16[0],
    setNote = _useState16[1];
  var suggestions = members.filter(function (m) {
    return memberQ.length > 0 && (m.name.toLowerCase().includes(memberQ.toLowerCase()) || m.id.toLowerCase().includes(memberQ.toLowerCase()));
  }).slice(0, 5);
  var finalAmount = Math.max(0, Number(amount) - Number(discount));
  function selectMember(m) {
    setSelected(m);
    setMemberQ(m.name);
    setShowSugg(false);
    if (category === 'Membership') setAmount(String(window.getPlan(m.plan).price));
  }
  function handleCollect() {
    if (!selectedMember || !amount) return;
    onCollect({
      id: "RCP-".concat(String(Date.now()).slice(-4)),
      memberId: selectedMember.id,
      memberName: selectedMember.name,
      category: category,
      amount: finalAmount,
      discount: Number(discount),
      mode: mode,
      txnId: txnId,
      date: new Date().toISOString().split('T')[0],
      collectedBy: 'Owner'
    });
  }
  var modeColors = {
    UPI: '#059669',
    Cash: '#d97706',
    Card: '#2563eb',
    'Net Banking': '#7c3aed',
    Cheque: '#dc2626'
  };
  return /*#__PURE__*/React.createElement(window.Modal, {
    onClose: onClose,
    width: 500,
    title: "Collect Payment",
    subtitle: "Record a new payment from a member"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--t-1)',
      marginBottom: 6
    }
  }, "Member ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#dc2626'
    }
  }, "*")), /*#__PURE__*/React.createElement("input", {
    value: memberQ,
    onChange: function onChange(e) {
      setMemberQ(e.target.value);
      setShowSugg(true);
      setSelected(null);
      setAmount('');
    },
    onFocus: function onFocus(e) {
      setShowSugg(true);
      e.target.style.borderColor = 'var(--accent)';
      e.target.style.boxShadow = '0 0 0 3px var(--accent-muted)';
    },
    onBlur: function onBlur(e) {
      e.target.style.borderColor = 'var(--border)';
      e.target.style.boxShadow = 'none';
      setTimeout(function () {
        return setShowSugg(false);
      }, 150);
    },
    placeholder: "Type member name or ID to search\u2026",
    style: {
      width: '100%',
      background: 'var(--bg-2)',
      border: '1.5px solid var(--border)',
      borderRadius: 10,
      padding: '12px 14px',
      fontSize: 15,
      color: 'var(--t-1)',
      fontFamily: 'inherit',
      outline: 'none',
      minHeight: 48
    }
  }), selectedMember && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginTop: 10,
      padding: '10px 14px',
      background: 'var(--accent-muted)',
      borderRadius: 10,
      border: '1.5px solid var(--accent-hover)'
    }
  }, /*#__PURE__*/React.createElement(window.Avatar, {
    name: selectedMember.name,
    color: selectedMember.color,
    size: 32
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--t-1)'
    }
  }, selectedMember.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--t-3)',
      fontWeight: 600
    }
  }, selectedMember.id, " \xB7 ", window.getPlan(selectedMember.plan).name)), /*#__PURE__*/React.createElement(window.Badge, {
    status: selectedMember.status
  })), showSugg && suggestions.length > 0 && /*#__PURE__*/React.createElement("div", {
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
        return selectMember(m);
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
      color: m.color,
      size: 34
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 700,
        color: 'var(--t-1)'
      }
    }, m.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: 'var(--t-3)',
        fontWeight: 600
      }
    }, m.id, " \xB7 ", window.getPlan(m.plan).name)), /*#__PURE__*/React.createElement(window.Badge, {
      status: m.status
    }));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0 18px'
    }
  }, /*#__PURE__*/React.createElement(window.Input, {
    label: "Payment Category",
    as: "select",
    value: category,
    onChange: function onChange(v) {
      setCategory(v);
      if (v === 'Membership' && selectedMember) setAmount(String(window.getPlan(selectedMember.plan).price));
    },
    options: ['Membership', 'PT Session', 'Personal Training', 'Supplement', 'Other']
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Amount (\u20B9)",
    type: "number",
    value: amount,
    onChange: setAmount,
    placeholder: "0",
    required: true,
    hint: "Enter the full amount before discount"
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Discount (\u20B9)",
    type: "number",
    value: discount,
    onChange: setDiscount,
    placeholder: "0",
    hint: "Enter 0 if no discount"
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Payment Method",
    as: "select",
    value: mode,
    onChange: setMode,
    options: ['UPI', 'Cash', 'Card', 'Net Banking', 'Cheque']
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 18,
      flexWrap: 'wrap'
    }
  }, ['UPI', 'Cash', 'Card', 'Net Banking', 'Cheque'].map(function (m) {
    return /*#__PURE__*/React.createElement("button", {
      key: m,
      onClick: function onClick() {
        return setMode(m);
      },
      style: {
        padding: '7px 16px',
        borderRadius: 20,
        fontSize: 13,
        fontWeight: 700,
        cursor: 'pointer',
        border: "2px solid ".concat(mode === m ? modeColors[m] || 'var(--accent)' : 'var(--border)'),
        background: mode === m ? "".concat(modeColors[m] || 'var(--accent)', "15") : 'var(--bg-3)',
        color: mode === m ? modeColors[m] || 'var(--accent)' : 'var(--t-2)',
        fontFamily: 'inherit',
        transition: 'all 0.15s'
      }
    }, m);
  })), (mode === 'UPI' || mode === 'Card' || mode === 'Net Banking') && /*#__PURE__*/React.createElement(window.Input, {
    label: "Transaction ID / Reference Number",
    value: txnId,
    onChange: setTxnId,
    placeholder: "e.g. TXN123456789",
    hint: "The reference number from the payment app or bank"
  }), /*#__PURE__*/React.createElement(window.Input, {
    label: "Note (optional)",
    as: "textarea",
    value: note,
    onChange: setNote,
    placeholder: "Any extra notes about this payment\u2026",
    rows: 2
  }), amount && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-3)',
      borderRadius: 12,
      padding: '16px 18px',
      marginBottom: 20,
      border: '1.5px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: 'var(--t-3)',
      marginBottom: 10,
      textTransform: 'uppercase',
      letterSpacing: '0.06em'
    }
  }, "Payment Summary"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 14,
      color: 'var(--t-2)',
      marginBottom: 6,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("span", null, "Subtotal"), /*#__PURE__*/React.createElement("span", null, window.fmtCurrency(amount))), Number(discount) > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 14,
      color: '#059669',
      marginBottom: 6,
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement("span", null, "Discount"), /*#__PURE__*/React.createElement("span", null, "\u2212 ", window.fmtCurrency(discount))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 17,
      fontWeight: 600,
      color: 'var(--t-1)',
      paddingTop: 10,
      borderTop: '1.5px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Total to Collect"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--accent)'
    }
  }, window.fmtCurrency(finalAmount)))), /*#__PURE__*/React.createElement("div", {
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
    variant: "success",
    size: "md",
    onClick: handleCollect,
    disabled: !selectedMember || !amount || finalAmount <= 0
  }, /*#__PURE__*/React.createElement(window.GmsIcons.Check, {
    size: 15
  }), " Collect ", amount ? window.fmtCurrency(finalAmount) : 'Payment')));
}
function PaymentsPage(_ref2) {
  var payments = _ref2.payments,
    setPayments = _ref2.setPayments,
    members = _ref2.members,
    onModal = _ref2.onModal;
  var _useState17 = useState(''),
    _useState18 = _slicedToArray(_useState17, 2),
    search = _useState18[0],
    setSearch = _useState18[1];
  var _useState19 = useState('all'),
    _useState20 = _slicedToArray(_useState19, 2),
    modeFilter = _useState20[0],
    setModeFilter = _useState20[1];
  var Icons = window.GmsIcons;
  var paymentCols = [{
    key: 'id',
    label: 'Receipt'
  }, {
    key: 'memberName',
    label: 'Member'
  }, {
    key: 'category',
    label: 'Category'
  }, {
    key: 'amount',
    label: 'Amount'
  }, {
    key: 'discount',
    label: 'Discount'
  }, {
    key: 'mode',
    label: 'Method'
  }, {
    key: 'txnId',
    label: 'Txn ID'
  }, {
    key: 'date',
    label: 'Date'
  }, {
    key: 'collectedBy',
    label: 'Collected By'
  }];
  var totalRevenue = payments.reduce(function (s, p) {
    return s + p.amount;
  }, 0);
  var now = new Date();
  var monthStr = "".concat(now.getFullYear(), "-").concat(String(now.getMonth() + 1).padStart(2, '0'));
  var thisMonth = payments.filter(function (p) {
    return p.date.startsWith(monthStr);
  }).reduce(function (s, p) {
    return s + p.amount;
  }, 0);
  var digitalTxns = payments.filter(function (p) {
    return p.mode !== 'Cash';
  }).length;
  var cashTxns = payments.filter(function (p) {
    return p.mode === 'Cash';
  }).length;
  var filtered = useMemo(function () {
    return payments.filter(function (p) {
      var matchMode = modeFilter === 'all' || p.mode.toLowerCase() === modeFilter;
      var q = search.toLowerCase();
      var matchSearch = !q || p.memberName.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      return matchMode && matchSearch;
    }).sort(function (a, b) {
      return b.date.localeCompare(a.date);
    });
  }, [payments, search, modeFilter]);
  var modeColor = {
    UPI: '#059669',
    Cash: '#d97706',
    Card: '#2563eb',
    'Net Banking': '#7c3aed',
    Cheque: '#dc2626'
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(window.PageHeader, {
    title: "Payments",
    sub: "".concat(payments.length, " transactions recorded \xB7 ").concat(window.fmtCurrency(totalRevenue), " total collected"),
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(window.Btn, {
      variant: "secondary",
      size: "md",
      onClick: function onClick() {
        return window.exportCSV(filtered, paymentCols, 'payments');
      }
    }, /*#__PURE__*/React.createElement(Icons.Download, {
      size: 14
    }), " Export CSV"), /*#__PURE__*/React.createElement(window.Btn, {
      size: "md",
      onClick: function onClick() {
        return onModal({
          type: 'collectPayment'
        });
      }
    }, /*#__PURE__*/React.createElement(Icons.Dollar, {
      size: 14
    }), " Collect Payment"))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 16,
      marginBottom: 26
    }
  }, /*#__PURE__*/React.createElement(window.StatCard, {
    label: "Total Revenue Collected",
    value: window.fmtCurrency(totalRevenue),
    icon: Icons.Dollar,
    accent: "#7c3aed"
  }), /*#__PURE__*/React.createElement(window.StatCard, {
    label: "This Month",
    value: window.fmtCurrency(thisMonth),
    icon: Icons.Calendar,
    accent: "#059669"
  }), /*#__PURE__*/React.createElement(window.StatCard, {
    label: "Online Payments",
    value: "".concat(digitalTxns, " txns"),
    icon: Icons.CreditCard,
    accent: "var(--accent)"
  }), /*#__PURE__*/React.createElement(window.StatCard, {
    label: "Cash Payments",
    value: "".concat(cashTxns, " txns"),
    icon: Icons.Receipt,
    accent: "#d97706"
  })), /*#__PURE__*/React.createElement(window.FilterBar, {
    search: search,
    onSearch: setSearch,
    placeholder: "Search by member name, receipt number, or category\u2026",
    right: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap'
      }
    }, ['all', 'upi', 'cash', 'card'].map(function (f) {
      return /*#__PURE__*/React.createElement("button", {
        key: f,
        onClick: function onClick() {
          return setModeFilter(f);
        },
        style: {
          padding: '8px 14px',
          borderRadius: 9,
          fontSize: 13,
          fontWeight: modeFilter === f ? 600 : 500,
          cursor: 'pointer',
          border: "2px solid ".concat(modeFilter === f ? 'var(--accent)' : 'var(--border)'),
          background: modeFilter === f ? 'var(--accent-muted)' : 'var(--bg-1)',
          color: modeFilter === f ? 'var(--accent)' : 'var(--t-2)',
          fontFamily: 'inherit',
          transition: 'all 0.15s',
          minHeight: 44
        }
      }, f === 'all' ? 'All' : f.toUpperCase());
    }))
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
      key: 'receipt',
      label: 'Receipt No.'
    }, {
      key: 'member',
      label: 'Member'
    }, {
      key: 'category',
      label: 'Category'
    }, {
      key: 'amount',
      label: 'Amount',
      right: true
    }, {
      key: 'mode',
      label: 'Method'
    }, {
      key: 'date',
      label: 'Date'
    }, {
      key: 'by',
      label: 'Collected By'
    }],
    empty: "No transactions found",
    emptyIcon: Icons.Receipt,
    rows: filtered.map(function (p) {
      var m = window.getMember(p.memberId);
      return /*#__PURE__*/React.createElement("tr", {
        key: p.id,
        style: {
          borderBottom: '1px solid var(--border)',
          transition: 'background 0.12s'
        },
        onMouseEnter: function onMouseEnter(e) {
          return e.currentTarget.style.background = 'var(--bg-2)';
        },
        onMouseLeave: function onMouseLeave(e) {
          return e.currentTarget.style.background = 'transparent';
        }
      }, /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '13px 16px',
          fontSize: 12.5,
          color: 'var(--t-3)',
          fontFamily: 'monospace'
        }
      }, p.id), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '14px 16px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }
      }, /*#__PURE__*/React.createElement(window.Avatar, {
        name: p.memberName,
        color: m === null || m === void 0 ? void 0 : m.color,
        size: 34
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 14,
          fontWeight: 500,
          color: 'var(--t-1)'
        }
      }, p.memberName))), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '14px 16px',
          fontSize: 14,
          color: 'var(--t-2)',
          fontWeight: 600
        }
      }, p.category), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '14px 16px',
          textAlign: 'right'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 15,
          fontWeight: 600,
          color: 'var(--t-1)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, window.fmtCurrency(p.amount)), p.discount > 0 && /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          color: '#059669',
          fontWeight: 500
        }
      }, "\u2212", window.fmtCurrency(p.discount), " disc.")), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '14px 16px'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 12.5,
          fontWeight: 600,
          padding: '4px 10px',
          borderRadius: 20,
          background: "".concat(modeColor[p.mode] || '#888', "18"),
          color: modeColor[p.mode] || 'var(--t-2)'
        }
      }, p.mode)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '14px 16px',
          fontSize: 14,
          color: 'var(--t-2)',
          fontWeight: 600
        }
      }, window.formatDate(p.date)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '14px 16px',
          fontSize: 13.5,
          color: 'var(--t-3)',
          fontWeight: 600
        }
      }, p.collectedBy));
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px',
      borderTop: '1.5px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'var(--bg-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--t-3)',
      fontWeight: 600
    }
  }, "Showing ", filtered.length, " of ", payments.length, " transactions"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--t-1)'
    }
  }, "Total shown: ", window.fmtCurrency(filtered.reduce(function (s, p) {
    return s + p.amount;
  }, 0))))));
}
Object.assign(window, {
  PaymentsPage: PaymentsPage,
  CollectPaymentModal: CollectPaymentModal
});