# BuddyDesk MCP server

Lets you ask your own Claude (Claude Desktop or Claude Code) about the
BuddyDesk workspace — team, tasks, attendance, timesheets, announcements — and
create tasks. The thinking happens on your Claude subscription, so there is no
model API key and no per-question cost.

## Important: this runs on your own machine

There is no shared server to connect to. Each person installs and runs their
own copy locally, and signs in with **their own** BuddyDesk account.

That is deliberate. The server authenticates as a normal user, so
`firestore.rules` still applies — it can only read what that account is allowed
to read. An employee sees their own data; a founder or admin sees the
workspace. Nobody gets a master key.

## Setup (per person, about 5 minutes)

You need [Node.js](https://nodejs.org) 20 or newer.

**1. Get the code and install**

```bash
git clone https://github.com/hiren63-dev/Zypit-communication.git
cd Zypit-communication
npm install
```

**2. Create `.env` in the project root**

`.env` is gitignored, so it never leaves your machine. Ask whoever set up the
Firebase project for the six `VITE_FIREBASE_*` values (they are the same for
everyone — they ship in the client app anyway), then add **your own** BuddyDesk
login for the last two:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

BUDDYDESK_EMAIL=you@zypit.in
BUDDYDESK_PASSWORD=your-password
```

Use the account you normally sign in to BuddyDesk with. Never commit this file.

**3. Check it starts**

```bash
npm run mcp
```

It should print `[buddydesk-mcp] ready on stdio` and then sit there waiting —
that is correct, it talks over stdin/stdout, not a port. Press Ctrl+C. If it
exits with a message about missing config, re-read step 2.

**4. Register it with your Claude client**

**Claude Code** — from inside the project folder:

```bash
claude mcp add buddydesk -- node "<full path to repo>/mcp/buddydesk-mcp.mjs"
```

Check it with `claude mcp list` — you want `✔ Connected`.

**Claude Desktop** — add this to `claude_desktop_config.json`
(Windows: `%APPDATA%\Claude\`, macOS:
`~/Library/Application Support/Claude/`), then restart the app:

```json
{
  "mcpServers": {
    "buddydesk": {
      "command": "node",
      "args": ["<full path to repo>/mcp/buddydesk-mcp.mjs"]
    }
  }
}
```

No `cwd` is needed — the server finds `.env` relative to its own file.

## Using it

Just ask normally:

- "who hasn't clocked in this week?"
- "what tasks are still open, and who has the most?"
- "summarise the workspace"
- "how many hours did the team log last week?"
- "assign 'fix the login bug' to Hiren"

## Tools

| Tool | Reads or writes |
|---|---|
| `workspace_summary` | read — headcount, present today, task counts, pulse, insights |
| `list_team` | read — directory with roles, departments, shifts |
| `list_tasks` | read — filter by status or assignee |
| `get_attendance` | read — any day: sessions and totals per person |
| `get_timesheet` | read — hours per person per day over a window |
| `list_announcements` | read — recent announcements |
| `create_task` | **write** — assigns a task |

`create_task` is the only one that changes anything. It refuses ambiguous
names rather than guessing who you meant.

The figures come from the same `utils/insights.js` the founder dashboard uses,
so what Claude tells you and what the app shows cannot drift apart.

## Troubleshooting

**"Missing required config"** — `.env` is absent or a key is blank. It must sit
in the project root, not in `mcp/`.

**"BuddyDesk sign-in failed"** — wrong email or password, or Email/Password
sign-in is disabled in the Firebase console.

**Empty results, or permission errors** — expected if your account lacks
access. Attendance and timesheets for the whole team need an admin or founder
role.

**Claude does not see the tools** — restart the Claude client after
registering. Claude Desktop only reads its config at startup.

## If you want one shared server instead

This uses stdio, which means local-only, one process per person. A single
server the whole team points at would need the SDK's Streamable HTTP transport,
somewhere to host it, and per-user authentication so it cannot become a way
around `firestore.rules`. That is a real piece of work, not a config change —
worth it only if per-machine setup becomes the bottleneck.
