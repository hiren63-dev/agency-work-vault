// gms/data.js — Sample data for GMS prototype

const PLANS = [
  { id: 'monthly',    name: 'Monthly Gym Only',      price: 1770,  duration: 30,  color: '#60a5fa' },
  { id: 'quarterly',  name: 'Quarterly Full Access',  price: 4800,  duration: 90,  color: '#34d399' },
  { id: 'halfyearly', name: 'Half-Yearly Access',     price: 9200,  duration: 180, color: '#a78bfa' },
  { id: 'annual',     name: 'Annual Full Access',     price: 16520, duration: 365, color: '#f43f5e', popular: true },
];

const MEMBERS = [
  { id: 'GMS-1001', name: 'Rahul Kumar',     initials: 'RK', color: '#3b82f6', phone: '+91 99999 88888', email: 'rahul@example.com',   area: 'Bopal',       dob: '1992-05-14', gender: 'Male',   bloodGroup: 'B+', weight: '78 kg', height: "5'10\"", emergencyContact: '+91 98765 43210', joinDate: '2024-01-15', plan: 'annual',     status: 'expired',   startDate: '2024-01-15', endDate: '2024-12-31', goals: 'Weight loss' },
  { id: 'GMS-1002', name: 'Priya Sharma',    initials: 'PS', color: '#ec4899', phone: '+91 88888 77777', email: 'priya@example.com',   area: 'Satellite',   dob: '1995-11-22', gender: 'Female', bloodGroup: 'A+', weight: '58 kg', height: "5'4\"",  emergencyContact: '+91 87654 32109', joinDate: '2024-03-01', plan: 'monthly',    status: 'expired',   startDate: '2024-03-01', endDate: '2024-03-31', goals: 'Toning' },
  { id: 'GMS-1003', name: 'Amit Patel',      initials: 'AP', color: '#f59e0b', phone: '+91 77777 66666', email: 'amit@example.com',    area: 'Navrangpura', dob: '1988-07-30', gender: 'Male',   bloodGroup: 'O+', weight: '82 kg', height: "5'8\"",  emergencyContact: '+91 76543 21098', joinDate: '2024-04-01', plan: 'annual',     status: 'expired',   startDate: '2024-04-01', endDate: '2025-04-01', goals: 'Muscle gain' },
  { id: 'GMS-1004', name: 'Hiren Chhaniyara',initials: 'HC', color: '#0ea5e9', phone: '+91 91234 56789', email: 'hiren@gmail.com',     area: 'Maninagar',   dob: '1997-03-18', gender: 'Male',   bloodGroup: 'B-', weight: '70 kg', height: "5'9\"",  emergencyContact: '+91 91234 00000', joinDate: '2026-06-03', plan: 'monthly',    status: 'active',    startDate: '2026-06-03', endDate: '2026-07-03', goals: 'Fitness' },
  { id: 'GMS-1005', name: 'Lalit Mohan',     initials: 'LM', color: '#8b5cf6', phone: '+91 87523 10000', email: 'lalit@gmail.com',     area: 'Ahmedabad',   dob: '1990-12-01', gender: 'Male',   bloodGroup: 'AB+',weight: '88 kg', height: "6'0\"",  emergencyContact: '+91 87500 00001', joinDate: '2026-06-08', plan: 'annual',     status: 'active',    startDate: '2026-06-08', endDate: '2027-06-08', goals: 'Strength' },
  { id: 'GMS-1006', name: 'Kavya Singh',     initials: 'KS', color: '#10b981', phone: '+91 98765 11223', email: 'kavya@gmail.com',     area: 'Paldi',       dob: '2000-08-25', gender: 'Female', bloodGroup: 'O-', weight: '55 kg', height: "5'5\"",  emergencyContact: '+91 99999 11111', joinDate: '2026-05-20', plan: 'quarterly',  status: 'expiring',  startDate: '2026-05-20', endDate: '2026-06-18', goals: 'Flexibility' },
  { id: 'GMS-1007', name: 'Dev Mehta',       initials: 'DM', color: '#f43f5e', phone: '+91 80001 22334', email: 'dev@example.com',     area: 'Thaltej',     dob: '1994-01-09', gender: 'Male',   bloodGroup: 'A-', weight: '75 kg', height: "5'11\"", emergencyContact: '+91 80002 33445', joinDate: '2026-05-01', plan: 'halfyearly', status: 'active',    startDate: '2026-05-01', endDate: '2026-11-01', goals: 'Endurance' },
  { id: 'GMS-1008', name: 'Neha Gupta',      initials: 'NG', color: '#6366f1', phone: '+91 99001 55678', email: 'neha@gmail.com',      area: 'Bodakdev',    dob: '1998-06-14', gender: 'Female', bloodGroup: 'B+', weight: '62 kg', height: "5'6\"",  emergencyContact: '+91 99001 00000', joinDate: '2026-01-10', plan: 'annual',     status: 'frozen',    startDate: '2026-01-10', endDate: '2027-01-10', goals: 'Weight loss' },
];

const PAYMENTS = [
  { id: 'RCP-001', memberId: 'GMS-1005', memberName: 'Lalit Mohan',      category: 'Membership', amount: 16520, discount: 0,    mode: 'UPI',  txnId: 'TXN9823761', date: '2026-06-08', collectedBy: 'Owner' },
  { id: 'RCP-002', memberId: 'GMS-1004', memberName: 'Hiren Chhaniyara', category: 'Membership', amount: 1770,  discount: 0,    mode: 'Cash', txnId: '',           date: '2026-06-03', collectedBy: 'Owner' },
  { id: 'RCP-003', memberId: 'GMS-1006', memberName: 'Kavya Singh',      category: 'Membership', amount: 4320,  discount: 480,  mode: 'UPI',  txnId: 'TXN8831254', date: '2026-05-20', collectedBy: 'Owner' },
  { id: 'RCP-004', memberId: 'GMS-1007', memberName: 'Dev Mehta',        category: 'Membership', amount: 9200,  discount: 0,    mode: 'Card', txnId: '',           date: '2026-05-01', collectedBy: 'Manager' },
  { id: 'RCP-005', memberId: 'GMS-1008', memberName: 'Neha Gupta',       category: 'Membership', amount: 16520, discount: 1000, mode: 'UPI',  txnId: 'TXN7741209', date: '2026-01-10', collectedBy: 'Owner' },
  { id: 'RCP-006', memberId: 'GMS-1003', memberName: 'Amit Patel',       category: 'PT Session', amount: 2500,  discount: 0,    mode: 'Cash', txnId: '',           date: '2025-03-15', collectedBy: 'Trainer' },
  { id: 'RCP-007', memberId: 'GMS-1001', memberName: 'Rahul Kumar',      category: 'Membership', amount: 16520, discount: 0,    mode: 'UPI',  txnId: 'TXN6612099', date: '2024-01-15', collectedBy: 'Owner' },
  { id: 'RCP-008', memberId: 'GMS-1002', memberName: 'Priya Sharma',     category: 'Membership', amount: 1770,  discount: 0,    mode: 'Cash', txnId: '',           date: '2024-03-01', collectedBy: 'Owner' },
];

const TODAY = new Date();
function dStr(d) { return d.toISOString().split('T')[0]; }
const ATTENDANCE = [
  { id: 1, memberId: 'GMS-1004', memberName: 'Hiren Chhaniyara', date: dStr(TODAY), checkIn: '06:32', checkOut: null },
  { id: 2, memberId: 'GMS-1005', memberName: 'Lalit Mohan',      date: dStr(TODAY), checkIn: '07:15', checkOut: null },
  { id: 3, memberId: 'GMS-1007', memberName: 'Dev Mehta',        date: dStr(TODAY), checkIn: '08:00', checkOut: '09:10' },
  { id: 4, memberId: 'GMS-1006', memberName: 'Kavya Singh',      date: dStr(new Date(TODAY - 86400000)), checkIn: '07:00', checkOut: '08:30' },
  { id: 5, memberId: 'GMS-1004', memberName: 'Hiren Chhaniyara', date: dStr(new Date(TODAY - 86400000)), checkIn: '06:45', checkOut: '08:00' },
  { id: 6, memberId: 'GMS-1005', memberName: 'Lalit Mohan',      date: dStr(new Date(TODAY - 2*86400000)), checkIn: '07:30', checkOut: '09:00' },
  { id: 7, memberId: 'GMS-1007', memberName: 'Dev Mehta',        date: dStr(new Date(TODAY - 2*86400000)), checkIn: '06:55', checkOut: '08:15' },
];

const ENQUIRIES = [
  { id: 'ENQ-001', name: 'Rohan Joshi',   phone: '+91 97001 23456', source: 'Instagram',  interest: 'Annual Plan',  status: 'new',       date: '2026-06-07', notes: 'Wants to start next week' },
  { id: 'ENQ-002', name: 'Seema Verma',   phone: '+91 98002 34567', source: 'Walk-in',    interest: 'Monthly Plan', status: 'followup',  date: '2026-06-05', notes: 'Called once, no answer' },
  { id: 'ENQ-003', name: 'Arjun Rao',     phone: '+91 99003 45678', source: 'Referral',   interest: 'PT Sessions',  status: 'demo',      date: '2026-06-03', notes: 'Demo scheduled 10 Jun' },
  { id: 'ENQ-004', name: 'Meera Nair',    phone: '+91 91004 56789', source: 'Instagram',  interest: 'Annual Plan',  status: 'converted', date: '2026-05-28', notes: 'Joined as GMS-1006' },
  { id: 'ENQ-005', name: 'Vikram Shah',   phone: '+91 92005 67890', source: 'Walk-in',    interest: 'Monthly Plan', status: 'lost',      date: '2026-05-20', notes: 'Joined competitor gym' },
  { id: 'ENQ-006', name: 'Pooja Desai',   phone: '+91 93006 78901', source: 'Instagram',  interest: 'Quarterly',    status: 'new',       date: '2026-06-08', notes: '' },
];

const EXPENSES = [
  { id: 'EXP-001', date: '2026-06-05', category: 'Electricity',    desc: 'June electricity bill',       amount: 8200,  paidBy: 'Owner' },
  { id: 'EXP-002', date: '2026-06-03', category: 'Equipment',      desc: 'Treadmill belt replacement',  amount: 3500,  paidBy: 'Owner' },
  { id: 'EXP-003', date: '2026-06-01', category: 'Staff Salary',   desc: 'May salary – Trainer Ravi',   amount: 18000, paidBy: 'Owner' },
  { id: 'EXP-004', date: '2026-05-28', category: 'Maintenance',    desc: 'AC servicing – 2 units',      amount: 2200,  paidBy: 'Manager' },
  { id: 'EXP-005', date: '2026-05-15', category: 'Supplies',       desc: 'Cleaning supplies + towels',  amount: 1400,  paidBy: 'Owner' },
  { id: 'EXP-006', date: '2026-05-01', category: 'Staff Salary',   desc: 'April salary – Trainer Ravi', amount: 18000, paidBy: 'Owner' },
];

const TRAINERS = [
  { id:'TRN-001', name:'Ravi Shankar', specialization:'Strength & Conditioning', phone:'+91 98001 11111', email:'ravi@gym.com',  salary:18000, joinDate:'2025-01-15', status:'active' },
  { id:'TRN-002', name:'Meena Patel',  specialization:'Yoga & Flexibility',      phone:'+91 97002 22222', email:'meena@gym.com', salary:15000, joinDate:'2025-03-01', status:'active' },
];

const PT_SESSIONS = [
  { id:'PTS-001', memberId:'GMS-1005', memberName:'Lalit Mohan',       trainerId:'TRN-001', trainerName:'Ravi Shankar', date:'2026-06-10', time:'07:00', duration:60, status:'scheduled', amount:1000 },
  { id:'PTS-002', memberId:'GMS-1007', memberName:'Dev Mehta',         trainerId:'TRN-001', trainerName:'Ravi Shankar', date:'2026-06-08', time:'08:00', duration:60, status:'completed', amount:1000 },
  { id:'PTS-003', memberId:'GMS-1006', memberName:'Kavya Singh',       trainerId:'TRN-002', trainerName:'Meena Patel',  date:'2026-06-09', time:'09:00', duration:45, status:'completed', amount:800 },
  { id:'PTS-004', memberId:'GMS-1004', memberName:'Hiren Chhaniyara',  trainerId:'TRN-001', trainerName:'Ravi Shankar', date:'2026-06-12', time:'06:30', duration:60, status:'scheduled', amount:1000 },
];

function getTrainer(id) { return TRAINERS.find(t=>t.id===id); }

// ── Staff accounts ───────────────────────────────────────────
const USERS = [
  { id:'USR-001', name:'Gym Owner',    role:'owner',        email:'owner@gym.com',       password:'owner123',     color:'#7c3aed' },
  { id:'USR-002', name:'Raj Patel',    role:'manager',      email:'manager@gym.com',     password:'manager123',   color:'#2563eb' },
  { id:'USR-003', name:'Ravi Shankar', role:'trainer',      email:'trainer@gym.com',     password:'trainer123',   color:'#059669' },
  { id:'USR-004', name:'Priya Mehta',  role:'receptionist', email:'reception@gym.com',   password:'reception123', color:'#d97706' },
];

// ── All pages & default role permissions ─────────────────────
const ALL_PAGES = ['dashboard','members','enquiries','attendance','trainers','ptsessions','payments','expenses','reports','settings'];

const DEFAULT_PERMISSIONS = {
  manager:       ['dashboard','members','enquiries','attendance','payments','expenses','reports'],
  trainer:       ['dashboard','attendance','ptsessions'],
  receptionist:  ['dashboard','attendance','enquiries'],
};

function authenticateUser(email, password) {
  return USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password) || null;
}

function daysLeft(endDate) {
  const end = new Date(endDate);
  const now = new Date();
  return Math.max(0, Math.ceil((end - now) / 86400000));
}
function formatDate(iso) {
  if (!iso) return '—';
  const [y,m,d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
function fmtCurrency(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}
function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}
function getPlan(id) {
  return PLANS.find(p => p.id === id) || PLANS[0];
}
function getMember(id) {
  return MEMBERS.find(m => m.id === id);
}

Object.assign(window, {
  PLANS, MEMBERS, PAYMENTS, ATTENDANCE, ENQUIRIES, EXPENSES, TRAINERS, PT_SESSIONS,
  USERS, ALL_PAGES, DEFAULT_PERMISSIONS,
  daysLeft, formatDate, fmtCurrency, getInitials, getPlan, getMember, getTrainer, authenticateUser
});
