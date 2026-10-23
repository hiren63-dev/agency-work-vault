# Deploying the hosted MCP server

Puts the MCP server on your existing Vercel site so team members connect their
own Claude by clicking Connect and signing in — no repo, no install, no
password in a file.

Everything up to step 5 is tested. Step 5 is the first time a real Claude client
talks to this, so expect a round of fixing there.

---

## Before you start

**Claude plan.** Custom connectors need Claude Pro or above. On a free plan you
cannot add one, and this whole thing is unusable — check first.

**Firestore rules.** `firestore.rules` must be published, including the
`mcpSessions` section. Verified working on 2026-08-22.

**Firebase Spark plan note.** Your rules check "is this person elevated?" by
reading their profile, which costs a read on top of each data read. Every
question through the connector does several. With a small team you are nowhere
near the 50k/day free limit, but watch Firebase → Usage once people start using
it rather than being surprised by it.

---

## 1. Generate your signing key

Run this yourself. It prints a secret — do not paste the output into chat, a
ticket, or a commit.

```bash
node -e "console.log(JSON.stringify({k1:require('crypto').randomBytes(32).toString('base64')}))"
```

You get something like:

```
{"k1":"aBcD...=="}
```

Keep that line. It is the whole value of `MCP_KEYS`.

What it protects: every token the server issues. If it leaks, tokens can be
forged — so treat it like a password. If it ever does leak, see **Rotating the
key** at the bottom; you do not have to start over.

---

## 2. Find your site's URL

Vercel dashboard → your project → the Production domain. Something like
`https://zypit-communication.vercel.app`.

Your canonical MCP URL is that plus `/mcp`:

```
https://zypit-communication.vercel.app/mcp
```

It must be `https`, and it must have no trailing slash and no `#`. The server
refuses to start otherwise, because a mismatch here silently breaks token
audience checks.

---

## 3. Add four settings in Vercel

Project → **Settings** → **Environment Variables**. Add each one with the
**Production** environment ticked, and **only** Production:

| Name | Value |
|---|---|
| `MCP_KEYS` | the `{"k1":"..."}` line from step 1 |
| `MCP_ACTIVE_KID` | `k1` |
| `MCP_CANONICAL_URL` | your `https://.../mcp` from step 2 |
| `MCP_ALLOWED_EMAIL_DOMAINS` | `zypit.in,zypit.com` — whoever may connect |

Production only, deliberately. Preview deployments keep serving from old
immutable URLs with whatever values they were built with, so a retired key would
stay reachable. The server also refuses to serve `/mcp`, `/token` and
`/mcp-login` on any non-production deployment, as a second line of defence.

`VITE_FIREBASE_API_KEY` and `VITE_FIREBASE_PROJECT_ID` are already set for the
web app and are reused here.

---

## 4. Deploy and check the plumbing

Push to `master`, or hit Redeploy in Vercel. Then check the two discovery
documents — these are what Claude reads first, and if they are wrong nothing
else can work:

```bash
curl -s https://YOUR-SITE/.well-known/oauth-protected-resource
curl -s https://YOUR-SITE/.well-known/oauth-authorization-server
```

The first must report your `/mcp` URL as `resource`. The second must list
`authorization_endpoint` and `token_endpoint` on your domain.

Then confirm the MCP endpoint refuses anonymous callers properly:

```bash
curl -si -X POST https://YOUR-SITE/mcp -H 'Content-Type: application/json' -d '{}' | head -20
```

You want `401` and a `WWW-Authenticate` header mentioning
`oauth-protected-resource`. That header is how Claude discovers where to log in.

**If you get HTML instead of JSON**, the `vercel.json` routes are not in effect
— check that file deployed.

**If you get 503**, an environment variable is missing or malformed. Vercel →
your deployment → Logs will name it: the server refuses to start rather than
run half-configured.

---

## 5. Connect Claude

In Claude (claude.ai or the desktop app): **Settings → Connectors → Add custom
connector**, and give it your MCP URL:

```
https://YOUR-SITE/mcp
```

Claude will send you to a BuddyDesk sign-in page. It names the app asking for
access and the exact address it will return to — read that before typing your
password. Sign in with your normal BuddyDesk email and password.

Then ask it something:

- "summarise my BuddyDesk workspace"
- "who hasn't clocked in this week?"
- "what tasks are still open?"

### If it does not work

Vercel → Logs, filtered to your function. Failures log a specific reason
server-side while returning a deliberately vague error to the client, so the log
is where the answer is.

| Symptom | Likely cause |
|---|---|
| Claude says it cannot reach the server | `MCP_CANONICAL_URL` does not exactly match the URL you gave Claude |
| Sign-in page never appears | discovery documents returning HTML — `vercel.json` not deployed |
| "Wrong email or password" with the right password | your email domain is not in `MCP_ALLOWED_EMAIL_DOMAINS`, or the address is unverified in Firebase |
| Connects, then every question is refused | that account's role — an employee only sees their own data, which is correct |
| Works, then stops after an hour | refresh rotation failing; check the logs for `gen_mismatch` |

---

## What each person sees

Their own BuddyDesk permissions, nothing more. The server signs in as *them* and
every read goes through `firestore.rules`, so an employee asking for the team's
attendance is refused by the database, not by politeness. Admins and founders
see the workspace.

This is why there is no service-account key anywhere in this design: it would
bypass the rules entirely, and one leak would expose everything.

---

## Revoking access

**One person's connection** — delete their document from the `mcpSessions`
collection in the Firestore console. Effective immediately.

**Everyone** — change `MCP_ACTIVE_KID` to a new key (see below). Every existing
token stops working at once.

**A departing employee** — disable their Firebase Auth account. Their stored
credential stops minting, so the connector dies with the account.

---

## Rotating the key

1. Generate a new key as in step 1.
2. Set `MCP_KEYS` to hold **both**: `{"k1":"old...","k2":"new..."}`
3. Set `MCP_ACTIVE_KID` to `k2` and redeploy. New tokens use `k2`; existing ones
   still verify under `k1`, so nobody is kicked out.
4. After 7 days (the refresh-token lifetime), remove `k1` and redeploy.

To rotate *immediately* because a key leaked, skip step 3's grace period: set
`MCP_KEYS` to the new key only. Everyone reconnects, which is the point.

---

## What is deliberately not here

**No service-account key.** See above.

**No token revocation list.** Access tokens last an hour and cannot be
individually cancelled before then; deleting the session stops the *next*
refresh and every subsequent request, because each request re-reads the session.
That was judged an acceptable window given a one-hour lifetime.

**Claude's client id is hardcoded** in `mcp/lib/oauth.mjs` (`ALLOWED_CLIENTS`).
Nothing else can connect. If Claude ever changes its callback address, that list
needs updating — the symptom is "that application is not permitted to connect".
This is deliberate: fetching an arbitrary client's details would be both an SSRF
sink and a way to phish consent on your own domain.
