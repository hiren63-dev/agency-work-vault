# 🐾 BuddyDesk — Internal Startup Communication App

> Your team's all-in-one communication hub with an animated buddy companion.

## Features

- **🐾 Animated Buddy** — Draggable floating character that lives on your desktop
- **💬 Real-time Chat** — DMs + group channels with file/image sharing (full quality)
- **✅ Task Management** — Kanban board with subtasks, deadlines, timers & reminders  
- **📁 Resource Library** — Upload & share company docs, SOPs, templates
- **👥 Employee Directory** — One-click email copy, one-click DM
- **📊 Admin Dashboard** — Founder view with productivity metrics, task priority control
- **📢 Announcements** — One-way broadcasts + two-way group messages by department
- **⏰ Shift Tracking** — Auto login/logout recording per employee shift

## Quick Start

### Prerequisites
- Node.js 18+ ([nodejs.org](https://nodejs.org))
- Firebase account ([firebase.google.com](https://firebase.google.com))

### 1. Clone & Install
```bash
cd buddydesk
npm install
```

### 2. Set Up Firebase
Follow `firebase_setup_guide.md` — takes ~10 minutes.

### 3. Add Your Config
Open `src/renderer/src/firebase.js` and paste your Firebase config.

### 4. Run
```bash
npm run dev
```

## Project Structure

```
buddydesk/
├── src/
│   ├── main/index.js          # Electron main process
│   ├── preload/index.js       # IPC bridge
│   └── renderer/src/
│       ├── App.jsx            # Router
│       ├── firebase.js        # Firebase config ← EDIT THIS
│       ├── context/           # Auth state
│       └── components/
│           ├── Auth/          # Login + Profile setup
│           ├── Dashboard/     # Employee home
│           ├── Chat/          # Messaging + file sharing
│           ├── Tasks/         # Task management
│           ├── Resources/     # Resource library
│           ├── Directory/     # Employee directory
│           ├── Admin/         # Founder dashboard
│           └── Buddy/         # Floating widget
├── firestore.rules            # Paste into Firebase Console
└── firebase_setup_guide.md   # Step-by-step setup
```

## Tech Stack

| Layer | Tech | Cost |
|---|---|---|
| Desktop | Electron | Free |
| Frontend | React + Vite | Free |
| Database | Firebase Firestore | Free |
| Auth | Firebase Auth | Free |
| Files | Firebase Storage | Free |
| Build | electron-builder | Free |

**Total cost: $0/month** for 10–30 employees.

## Build for Distribution

```bash
npm run build
```

Outputs `dist-electron/` with `.exe` (Windows) and `.dmg` (Mac) installers.
