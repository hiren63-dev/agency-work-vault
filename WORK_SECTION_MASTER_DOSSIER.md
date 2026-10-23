# Agency Portfolio Migration & Work Section Master Dossier

This document decodes **`www.hiren.website/work`** and provides the single-source master blueprint to clone every project, database, repository, and frontend component into your new agency's portfolio, GitHub organization, and Vercel account.

All code, assets, interactive demo sandboxes, and automated deployment scripts have been gathered into your centralized local vault:
`c:\Users\zediz\Documents\Codex\2026-10-01\i-have-a-goal-for-you\outputs\website-factory\agency-work-vault`

---

## 1. Architectural Decoding: How `hiren.website/work` Operates

The Work section on `hiren.website` is an interactive showcase with a category switch, device toggle, and live iframe execution.

### Core Interactive Mechanics
1. **Category Navigation & Sliding Pill Indicator**:
   - Two categories: **Websites (03)** and **Software & Systems (02)**.
   - Smooth physical spring pill indicator using `translate3d`, `ResizeObserver`, and cubic-bezier easing.
2. **Dual-Device Frame Simulation**:
   - **Desktop Mockup**: MacBook Pro frame with aluminum chassis, camera dot, and scaled 1440px virtual viewport.
   - **Phone Mockup**: iPhone shell with dynamic island, status bar (`9:41`, signal indicators), URL address bar, and 390px virtual viewport.
3. **Hybrid Poster & Live Frame Rendering**:
   - Websites display a WebP screenshot poster initially for zero-delay loading, transitioning smoothly to live iframes when loaded or focused.
   - Software projects (`pulse`, `buddydesk`) load **interactive sandboxes directly in the frame**, allowing visitors to click tabs, test kanban boards, and inspect gym metrics without leaving the page.
4. **Doodle Annotations with SVG Curved Pointers**:
   - Four strategic callout cards flank the device frame (two on the left, two on the right).
   - Dynamic text and dashed SVG bezier arrows update instantly whenever a different project is selected.
5. **Interactive Stage Spotlight**:
   - Tracks cursor coordinates (`pointermove`) to update CSS variables `--mouse-x` and `--mouse-y`, generating an ambient glow behind the active device.

---

## 2. Master Project-by-Project Dossier

Here is the complete technical breakdown of the 5 projects featured in the work section.

### Project 1: BNPS (`bnps`)
* **Category**: Websites (01 / 03)
* **Agency Role**: Enterprise Legal, Taxation & Corporate Advisory Infrastructure Firm
* **Live Production URL**: [https://bnps.vercel.app/](https://bnps.vercel.app/)
* **Original Source Path**: `c:\Users\zediz\Downloads\Portfolio\bnps`
* **Staged Agency Path**: `agency-work-vault\migrated_projects\bnps`
* **Sector Artworks**: `c:\Users\zediz\Downloads\Portfolio\bnps-artwork` (8 custom WebP artworks for Banking, Education, Estate, Government, Healthcare, IT, Manufacturing, Retail)
* **Current Vercel Project ID**: `prj_fo7fBhmctw0UNWdUUISSfRdrNJ03` (Team: `team_kpIV5rRyjv86V0vhwI7DSY2p`)
* **Tech Stack**:
  - Pure Vanilla ES Modules + Node Static Builder (`build.mjs`)
  - Zero runtime framework weight (0 kB bundle, loads in under 200ms)
  - Custom fluid typography scale, bespoke corporate inquiry intake flows
* **Database & Backend**:
  - Pure static frontend architecture with serverless form handlers.
  - No database maintenance required, providing high stability and low overhead.
* **Vercel Deploy Configuration**:
  ```json
  {
    "buildCommand": "node build.mjs",
    "outputDirectory": "dist"
  }
  ```

---

### Project 2: Harsh Manek (`harsh`)
* **Category**: Websites (02 / 03)
* **Agency Role**: Modern High-End Financial Practice, Interactive Tax Sandbox & Portal
* **Live Production URL**: [https://harshmanek.com/](https://harshmanek.com/)
* **Original Source Path**: `c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio`
* **Staged Agency Path**: `agency-work-vault\migrated_projects\harsh-manek`
* **Git Repository**: Local repository (`master` branch), ready to push to your new GitHub account.
* **Current Vercel Project ID**: `prj_aCQk9zutrp8W1iwlf75mKpnalBA2` (and preview: `prj_DJYrc3dDuF3HYEAcMFsbnBvEsWnU`)
* **Tech Stack**:
  - Vite + React 18 + TypeScript + Tailwind CSS
  - Framer Motion / Motion for scroll-anchored kinetic reveals
  - Lucide React iconography
* **Database & Backend (Supabase)**:
  - **Supabase Host**: `https://doinjkpakrzumzchhffp.supabase.co`
  - **Tables**: `job_applicants`, `leads`, `consultations`
  - **Portal Admin**: Protected client intake portal at `/portal/dashboard` and `/portal/leads`
  - **Environment Variables**:
    ```bash
    VITE_SUPABASE_URL=https://doinjkpakrzumzchhffp.supabase.co
    VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
    ```
* **Vercel Deploy Configuration**:
  ```json
  {
    "framework": "vite",
    "buildCommand": "npm run build",
    "outputDirectory": "dist"
  }
  ```

---

### Project 3: Kadivar & Associates (`kadivar`)
* **Category**: Websites (03 / 03)
* **Agency Role**: Architectural Engineering & Tax Practice, Virtual CFO Simulator
* **Live Production URL**: [https://kadivar-redesign.vercel.app/](https://kadivar-redesign.vercel.app/)
* **Original Source Path**: `D:\Archived_Projects_and_Data\kadivar-redesign`
* **Staged Agency Path**: `agency-work-vault\migrated_projects\kadivar-associates`
* **Current Vercel Project ID**: `prj_CsX9mx8d0nexptnZbAlMJGcJxCGX`
* **Tech Stack**:
  - Next.js 15/16 App Router + React 19 + TypeScript
  - Tailwind CSS v4 + Framer Motion
  - Lenis Smooth Scrolling (`@studio-freight/react-lenis`)
  - Virtual CFO financial scenario engine & interactive lead gen
  - ICAI regulatory compliance layout
* **Database & Backend**:
  - Next.js Server Actions / API Routes for lead tracking and contact form handling (`rewrite_contact.py`, `track_leadgen.py`).
* **Vercel Deploy Configuration**:
  ```json
  {
    "framework": "nextjs",
    "buildCommand": "npm run build"
  }
  ```

---

### Project 4: Pulse Studio (`pulse`)
* **Category**: Software & Systems (01 / 02)
* **Agency Role**: Multi-tenant Gym Management System (Active in 6+ Gyms across Gujarat, BLR & Pune)
* **Portfolio Demo URL**: Embedded sandbox via `./demos/pulse/index.html` (or live `https://gms-seven-black.vercel.app`)
* **Original Source Path**: `c:\Users\zediz\Downloads\Portfolio\gym-source`
* **Staged Agency Path**: `agency-work-vault\migrated_projects\pulse-gms`
* **Public GitHub Repo**: [https://github.com/hiren63-dev/GMS.git](https://github.com/hiren63-dev/GMS.git)
* **Interactive Portfolio Sandbox**: `agency-work-vault\demos\pulse\` (Self-contained offline demo with real seed data, check-in logs, and billing charts)
* **Full System Tech Stack**:
  - React frontend with PWA Service Worker (`sw.js`, `manifest.json`)
  - Node.js & Express REST API (`gym-source/api`)
  - Real Web Push notifications (`web-push`) reaching employees without active tabs open
  - Multi-location sync, role-based access (Owner, Trainer, Front Desk), monthly subscription billing
* **Vercel Deploy Configuration**:
  ```json
  {
    "cleanUrls": true,
    "outputDirectory": "GMS-deploy"
  }
  ```

---

### Project 5: BuddyDesk (`buddydesk`)
* **Category**: Software & Systems (02 / 02)
* **Agency Role**: Startup CRM & Team Workspace Hub (In active use by 3 startups)
* **Portfolio Demo URL**: Embedded sandbox via `./demos/buddydesk/index.html` (or live `https://buddydesk-chhaniyarahiren63-6131s-projects.vercel.app`)
* **Original Source Path**: `c:\Users\zediz\Downloads\Portfolio\buddydesk-source`
* **Staged Agency Path**: `agency-work-vault\migrated_projects\buddydesk`
* **GitHub Repository**: [https://github.com/hiren63-dev/Zypit-communication.git](https://github.com/hiren63-dev/Zypit-communication.git)
* **Interactive Portfolio Sandbox**: `agency-work-vault\demos\buddydesk\`
* **Full System Tech Stack**:
  - Vite + React + React Router DOM
  - Firebase Backend (Project: `communicationapp-zypit`, Firestore, Auth, Storage)
  - Electron Desktop App wrapper (`electron-builder`)
  - Model Context Protocol (MCP) Server (`mcp/buddydesk-mcp.mjs`)
  - AI Assistant (`BuddyBot`) powered by OpenRouter / OpenAI serverless endpoint (`/api/buddy`)
  - Sprint Kanban board, live team presence directory, and activity feeds
* **Database & Backend (Firebase)**:
  - **Firebase Project ID**: `communicationapp-zypit`
  - **Security Rules**: Auth-protected domain filters in `firestore.rules` and `storage.rules`
* **Vercel Deploy Configuration**:
  ```json
  {
    "framework": "vite",
    "buildCommand": "npm run build:renderer",
    "outputDirectory": "dist"
  }
  ```

---

## 3. Agency Central Vault Structure

Everything has been consolidated into the workspace directory:
`c:\Users\zediz\Documents\Codex\2026-10-01\i-have-a-goal-for-you\outputs\website-factory\agency-work-vault`

```
agency-work-vault/
├── WORK_SECTION_MASTER_DOSSIER.md      # This comprehensive document
├── migrate_projects.py                 # Automated script staging all 5 codebases
├── deploy-to-new-vercel.ps1            # 1-click script to push to new GitHub & Vercel
├── assets/
│   └── work/                           # High-res WebP preview posters
│       ├── bnps-desktop.webp
│       ├── bnps-phone.webp
│       ├── harsh-desktop.webp
│       ├── harsh-phone.webp
│       ├── kadivar-desktop.webp
│       └── kadivar-phone.webp
├── demos/                              # Interactive offline iframes for the portfolio
│   ├── pulse/                          # Gym Management System demo
│   │   ├── index.html
│   │   ├── app.js
│   │   └── demo-seed.js
│   └── buddydesk/                      # BuddyDesk CRM demo
│       ├── index.html
│       └── assets/
├── component/                          # Drop-in code for your new agency portfolio
│   ├── work_section.html               # Clean HTML markup
│   ├── work.css                        # Complete styles with frames & animations
│   ├── work.js                         # Vanilla JS engine with pill indicator & switchers
│   └── WorkSection.tsx                 # Modern React / Next.js / Tailwind component
└── migrated_projects/                  # Complete sanitized source code for all 5 projects
    ├── bnps/                           # Full source code for BNPS
    ├── harsh-manek/                    # Full source code for Harsh Manek
    ├── kadivar-associates/             # Full source code for Kadivar Associates
    ├── pulse-gms/                      # Full source code for Pulse GMS
    └── buddydesk/                      # Full source code for BuddyDesk
```

---

## 4. Turnkey Migration Playbook: Deploying to New GitHub & Vercel

### Step 1: Push Repositories to Your New GitHub Account
Run the included PowerShell migration script:
```powershell
cd "c:\Users\zediz\Documents\Codex\2026-10-01\i-have-a-goal-for-you\outputs\website-factory\agency-work-vault"

# Example: Push all 5 projects to your new GitHub organization / user
.\deploy-to-new-vercel.ps1 -NewGithubOrg "YOUR_NEW_AGENCY_GITHUB_USER"
```

The script automatically:
1. Loops through each project in `migrated_projects/`.
2. Re-initializes a clean `main` branch.
3. Sets the remote to `https://github.com/YOUR_NEW_AGENCY_GITHUB_USER/<project-name>.git`.
4. Commits all production source code.

### Step 2: Deploy to Your New Vercel Account
1. Open PowerShell and log in to your new Vercel account:
   ```powershell
   vercel login
   ```
2. Run deployment for all 5 projects:
   ```powershell
   .\deploy-to-new-vercel.ps1 -NewVercelScope "YOUR_NEW_VERCEL_TEAM"
   ```
3. Each project will deploy immediately and produce your new production URLs (e.g. `bnps.youragency.com`, `harshmanek.youragency.com`, etc.).

### Step 3: Database Continuity & Credentials
* **BNPS**: No database setup required. Deploys statically out of the box.
* **Kadivar**: No external database required. Serverless actions handle incoming requests.
* **Harsh Manek**:
  - To continue using the existing Supabase instance: leave `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as set in `.env`.
  - To migrate to a new Supabase project: Create a new project in the Supabase Dashboard, run the `job_applicants` table migration, and update the environment variables in your new Vercel project settings.
* **BuddyDesk**:
  - Existing client SDK connects to Firebase project `communicationapp-zypit`.
  - To deploy under your own Firebase project: Create a project at [console.firebase.google.com](https://console.firebase.google.com), enable Firestore, and update the keys in `.env`.
* **Pulse Studio**:
  - The portfolio demo runs in standalone seed mode (`demo-seed.js`), meaning your portfolio visitors can interact with live charts and check-ins without any active backend server dependency.

---

## 5. Ready-to-Drop Component Code for Your New Agency Site

You have two choices to integrate this Work section into your new agency website:

### Option A: Next.js / React (App Router or Pages Router)
Copy `agency-work-vault\component\WorkSection.tsx` directly into your Next.js project's `components/` directory, copy `assets/work/` and `demos/` to `public/`, and import:
```tsx
import AgencyWorkSection from '@/components/WorkSection';

export default function PortfolioPage() {
  return (
    <main>
      <AgencyWorkSection />
    </main>
  );
}
```

### Option B: HTML / CSS / Vanilla JS
1. Include `agency-work-vault\component\work.css` in your `<head>`.
2. Paste `agency-work-vault\component\work_section.html` where you want the section to appear.
3. Include `agency-work-vault\component\work.js` before `</body>`.
4. Ensure `assets/work/` and `demos/` are placed in your public root directory.

---

## Summary Checklist

| Project | Live Portfolio URL | Local Source Staged | Database / Backend | GitHub Repository |
| :--- | :--- | :--- | :--- | :--- |
| **BNPS** | [bnps.vercel.app](https://bnps.vercel.app/) | `migrated_projects/bnps` | Static ESM (Zero DB overhead) | Local Git staged (`main`) |
| **Harsh Manek** | [harshmanek.com](https://harshmanek.com/) | `migrated_projects/harsh-manek` | Supabase (`job_applicants`) | Local Git staged (`master`) |
| **Kadivar** | [kadivar-redesign.vercel.app](https://kadivar-redesign.vercel.app/) | `migrated_projects/kadivar-associates` | Next.js Server Actions | Local Git staged (`main`) |
| **Pulse Studio** | Embedded / [gms-seven-black.vercel.app](https://gms-seven-black.vercel.app) | `migrated_projects/pulse-gms` | Express + Web Push + Offline Demo | [hiren63-dev/GMS](https://github.com/hiren63-dev/GMS.git) |
| **BuddyDesk** | Embedded / [buddydesk.vercel.app](https://buddydesk-chhaniyarahiren63-6131s-projects.vercel.app) | `migrated_projects/buddydesk` | Firebase + MCP Server + AI Bot | [hiren63-dev/Zypit-communication](https://github.com/hiren63-dev/Zypit-communication.git) |
