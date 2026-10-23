// gms/icons.jsx — SVG icon library
var _window = window,
  React = _window.React;
function Ico(_ref) {
  var children = _ref.children,
    _ref$size = _ref.size,
    size = _ref$size === void 0 ? 16 : _ref$size,
    _ref$sw = _ref.sw,
    sw = _ref$sw === void 0 ? 1.75 : _ref$sw,
    style = _ref.style;
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: sw,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: style
  }, children);
}
var GmsIcons = {
  Dashboard: function Dashboard(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "3",
      width: "7",
      height: "7",
      rx: "1.5"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "14",
      y: "3",
      width: "7",
      height: "7",
      rx: "1.5"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "14",
      width: "7",
      height: "7",
      rx: "1.5"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "14",
      y: "14",
      width: "7",
      height: "7",
      rx: "1.5"
    }));
  },
  Users: function Users(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("path", {
      d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "9",
      cy: "7",
      r: "4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M23 21v-2a4 4 0 0 0-3-3.87"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M16 3.13a4 4 0 0 1 0 7.75"
    }));
  },
  UserPlus: function UserPlus(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("path", {
      d: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "8.5",
      cy: "7",
      r: "4"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "20",
      y1: "8",
      x2: "20",
      y2: "14"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "23",
      y1: "11",
      x2: "17",
      y2: "11"
    }));
  },
  CreditCard: function CreditCard(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("rect", {
      x: "1",
      y: "4",
      width: "22",
      height: "16",
      rx: "2"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "1",
      y1: "10",
      x2: "23",
      y2: "10"
    }));
  },
  Dollar: function Dollar(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "1",
      x2: "12",
      y2: "23"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
    }));
  },
  Calendar: function Calendar(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "4",
      width: "18",
      height: "18",
      rx: "2"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "16",
      y1: "2",
      x2: "16",
      y2: "6"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "8",
      y1: "2",
      x2: "8",
      y2: "6"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "3",
      y1: "10",
      x2: "21",
      y2: "10"
    }));
  },
  Clock: function Clock(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "12 6 12 12 16 14"
    }));
  },
  User: function User(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("path", {
      d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "7",
      r: "4"
    }));
  },
  MessageSquare: function MessageSquare(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("path", {
      d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
    }));
  },
  TrendingDown: function TrendingDown(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("polyline", {
      points: "23 18 13.5 8.5 8.5 13.5 1 6"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "17 18 23 18 23 12"
    }));
  },
  TrendingUp: function TrendingUp(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("polyline", {
      points: "23 6 13.5 15.5 8.5 10.5 1 18"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "17 6 23 6 23 12"
    }));
  },
  BarChart: function BarChart(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("line", {
      x1: "18",
      y1: "20",
      x2: "18",
      y2: "10"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "20",
      x2: "12",
      y2: "4"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "6",
      y1: "20",
      x2: "6",
      y2: "14"
    }));
  },
  Settings: function Settings(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
    }));
  },
  LogOut: function LogOut(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("path", {
      d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "16 17 21 12 16 7"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "21",
      y1: "12",
      x2: "9",
      y2: "12"
    }));
  },
  Search: function Search(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("circle", {
      cx: "11",
      cy: "11",
      r: "8"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "21",
      y1: "21",
      x2: "16.65",
      y2: "16.65"
    }));
  },
  Bell: function Bell(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("path", {
      d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M13.73 21a2 2 0 0 1-3.46 0"
    }));
  },
  Plus: function Plus(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "5",
      x2: "12",
      y2: "19"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "5",
      y1: "12",
      x2: "19",
      y2: "12"
    }));
  },
  Eye: function Eye(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("path", {
      d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "3"
    }));
  },
  Edit: function Edit(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("path", {
      d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
    }));
  },
  Trash: function Trash(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("polyline", {
      points: "3 6 5 6 21 6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
    }));
  },
  X: function X(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("line", {
      x1: "18",
      y1: "6",
      x2: "6",
      y2: "18"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "6",
      y1: "6",
      x2: "18",
      y2: "18"
    }));
  },
  Check: function Check(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("polyline", {
      points: "20 6 9 17 4 12"
    }));
  },
  ChevronDown: function ChevronDown(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("polyline", {
      points: "6 9 12 15 18 9"
    }));
  },
  ChevronRight: function ChevronRight(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("polyline", {
      points: "9 18 15 12 9 6"
    }));
  },
  ChevronLeft: function ChevronLeft(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("polyline", {
      points: "15 18 9 12 15 6"
    }));
  },
  Download: function Download(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("path", {
      d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "7 10 12 15 17 10"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "15",
      x2: "12",
      y2: "3"
    }));
  },
  AlertTriangle: function AlertTriangle(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("path", {
      d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "9",
      x2: "12",
      y2: "13"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "17",
      x2: "12.01",
      y2: "17"
    }));
  },
  Phone: function Phone(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("path", {
      d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
    }));
  },
  Mail: function Mail(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("path", {
      d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "22,6 12,13 2,6"
    }));
  },
  MapPin: function MapPin(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("path", {
      d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "10",
      r: "3"
    }));
  },
  Droplet: function Droplet(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("path", {
      d: "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
    }));
  },
  Activity: function Activity(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("polyline", {
      points: "22 12 18 12 15 21 9 3 6 12 2 12"
    }));
  },
  Zap: function Zap(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("polygon", {
      points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2"
    }));
  },
  Receipt: function Receipt(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("path", {
      d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "8",
      y1: "9",
      x2: "16",
      y2: "9"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "8",
      y1: "13",
      x2: "16",
      y2: "13"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "8",
      y1: "17",
      x2: "11",
      y2: "17"
    }));
  },
  ArrowRight: function ArrowRight(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("line", {
      x1: "5",
      y1: "12",
      x2: "19",
      y2: "12"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "12 5 19 12 12 19"
    }));
  },
  ShieldCheck: function ShieldCheck(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("path", {
      d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "9 12 11 14 15 10"
    }));
  },
  Sun: function Sun(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "5"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "1",
      x2: "12",
      y2: "3"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "21",
      x2: "12",
      y2: "23"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "4.22",
      y1: "4.22",
      x2: "5.64",
      y2: "5.64"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "18.36",
      y1: "18.36",
      x2: "19.78",
      y2: "19.78"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "1",
      y1: "12",
      x2: "3",
      y2: "12"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "21",
      y1: "12",
      x2: "23",
      y2: "12"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "4.22",
      y1: "19.78",
      x2: "5.64",
      y2: "18.36"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "18.36",
      y1: "5.64",
      x2: "19.78",
      y2: "4.22"
    }));
  },
  Moon: function Moon(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("path", {
      d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
    }));
  },
  Palette: function Palette(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("circle", {
      cx: "13.5",
      cy: "6.5",
      r: ".5",
      fill: "currentColor",
      strokeWidth: "0"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "17.5",
      cy: "10.5",
      r: ".5",
      fill: "currentColor",
      strokeWidth: "0"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "8.5",
      cy: "7.5",
      r: ".5",
      fill: "currentColor",
      strokeWidth: "0"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "6.5",
      cy: "12.5",
      r: ".5",
      fill: "currentColor",
      strokeWidth: "0"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"
    }));
  },
  MoreH: function MoreH(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "1"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "19",
      cy: "12",
      r: "1"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "5",
      cy: "12",
      r: "1"
    }));
  },
  Weight: function Weight(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "5",
      r: "3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8z"
    }));
  },
  Menu: function Menu(p) {
    return /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("line", {
      x1: "3",
      y1: "6",
      x2: "21",
      y2: "6"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "3",
      y1: "12",
      x2: "21",
      y2: "12"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "3",
      y1: "18",
      x2: "21",
      y2: "18"
    }));
  }
};
Object.assign(window, {
  GmsIcons: GmsIcons,
  Ico: Ico
});