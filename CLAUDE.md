# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

HomeDir is a self-hosted personal service navigation page (Next.js 16 App Router + React 19 + Tailwind v4 + shadcn/ui). It stores sites, categories, hotkeys, and config in a single SQLite file, and each site holds both an internal (LAN) and an external URL so the same dashboard works from either network.

UI strings, comments, and commit messages are in Chinese. Match that when adding user-facing text.

## Commands

```bash
pnpm install          # pnpm@9.15.9 is the pinned package manager
pnpm dev              # http://localhost:3000 (admin at /dash)
pnpm build            # next build, output: "standalone"
pnpm start
pnpm lint             # BROKEN — see below
```

`pnpm lint` runs `next lint`, which Next 16 removed; the arg is parsed as a directory, so it fails with `no such directory: <root>/lint`. There is also no ESLint config file (`eslint` and `eslint-config-next` are installed but not wired up). Fixing it means adding an `eslint.config.mjs` and changing the script to `eslint .`.

There is no test framework and no test script. Don't invent a test command. `pnpm build` type-checks the whole project (`Running TypeScript` runs as a build step), so it is the primary verification gate — run it and say what you did and did not verify.

Docker: `docker compose up -d` builds from the local `Dockerfile` and serves on port 4027 with `./data` mounted. The container listens on `PORT=4027`, dev on 3000.

## Data layer

`data/` is gitignored and created at runtime — `data/sites.db` (SQLite via `better-sqlite3`) and `data/icons/` (uploaded/fetched favicon files). Both paths resolve from `process.cwd()`, so the working directory matters.

[src/lib/db.ts](src/lib/db.ts) is the only module that touches SQLite. It lazily opens the DB on first call and runs `CREATE TABLE IF NOT EXISTS` for all three tables inline in `getDb()` — that function *is* the schema. There are no migration files, so a schema change means editing the `CREATE TABLE` there plus an additive `ALTER TABLE` path for existing databases.

Tables: `sites`, `shortcuts` (FK to `sites` with `ON DELETE CASCADE`), and `config` — a key/value table, not columns. `getConfig()` projects it into the `SiteConfig` shape with defaults; `updateConfig()` takes a partial record and upserts in a transaction. Adding a setting means adding a field to `SiteConfig` + `defaultConfig` + the mapping in `getConfig()`.

`better-sqlite3` is listed in `serverExternalPackages` in [next.config.ts](next.config.ts); it must stay there.

Row shape vs. client shape differ deliberately: DB rows use flat `url_internal` / `url_external` ([src/lib/db.ts:5](src/lib/db.ts#L5)), while the client-facing `SiteData` nests them as `url: { internal, external }` ([src/lib/types.ts](src/lib/types.ts)). [src/lib/sites.ts](src/lib/sites.ts) does that mapping and also derives `categories` — categories are not a table, just the distinct `category` values across sites. So "rename category" and "delete category" are bulk updates/deletes over `sites` ([src/lib/db.ts:235](src/lib/db.ts#L235)).

## Server boundary and auth

`src/lib/auth.ts` and `src/lib/sites.ts` are marked `import "server-only"`. `db.ts` is not, but it's Node-only in practice — never import it from a `"use client"` file.

Auth is single-password and session-in-config: the SHA-256 password hash and the *current* session token both live in the `config` table, and the token is compared against an `admin_session` cookie ([src/lib/auth.ts](src/lib/auth.ts)). One token at a time, so a new login invalidates the previous session. First visit to `/dash/login` sets up the password when none exists.

Every mutation is a Server Action in [src/app/dash/actions.ts](src/app/dash/actions.ts), and each one starts with `requireAuth()` then returns the discriminated `ActionResult` union (`{success: true, data?}` | `{success: false, error}`) — never throws to the client. New mutations must follow that shape and end with `revalidatePath("/")` + `revalidatePath("/dash")`. Login/logout actions live separately in [src/app/dash/login/actions.ts](src/app/dash/login/actions.ts) and use the `useActionState` signature (`(prevState, formData)`) plus `redirect()`.

`/dash/page.tsx` strips `admin_password` and `admin_session` into a `safeConfig` before passing config to the client panel — keep doing that when adding config fields. `safeConfig` is an explicit allowlist, so a new config field that the admin UI must edit has to be added there *and* to the `SafeConfig` type in [src/components/admin-panel.tsx](src/components/admin-panel.tsx).

Both `/` and `/dash` set `export const dynamic = "force-dynamic"` since they read SQLite per request.

## Icons

Two independent icon systems:

- **Lucide name** — `site.icon` is a string looked up at runtime in [src/lib/icons.ts](src/lib/icons.ts) `getIcon()`, falling back to `Globe`. `commonIcons` is the admin picker list.
- **Uploaded/fetched file** — `site.icon_url` is a bare filename in `data/icons/`. [src/lib/icons-fs.ts](src/lib/icons-fs.ts) content-hashes the buffer (md5, 12 chars) and sniffs the extension from magic bytes, so identical images dedupe. Served by [src/app/api/icons/[name]/route.ts](src/app/api/icons/[name]/route.ts) with immutable caching; `path.basename()` guards traversal.

`icon_url` wins over the Lucide icon when both are set. `fetchFaviconAction` tries the HTML `<link rel="icon">`, then `/favicon.ico` and `/apple-touch-icon.png`, then falls back to Google's favicon service — but only for non-private hostnames ([src/app/dash/actions.ts:176](src/app/dash/actions.ts#L176)), so LAN addresses never leak outward.

The `site_logo` (header) and `site_icon` (browser favicon) config fields reuse the same store: both hold a bare `data/icons/` filename written by `uploadIconAction`. The browser favicon is emitted **only** from `generateMetadata` in [src/app/layout.tsx](src/app/layout.tsx), falling back to `/icon.svg` in `public/`. Do not add `src/app/icon.*` back — Next's file-based metadata convention outranks `metadata.icons` and would silently pin the favicon, making the setting a no-op.

## Social card

The header's social links are config-driven, not hardcoded. `config.social_links` is a JSON array string; [src/lib/social.ts](src/lib/social.ts) owns the platform registry (label, brand SVG path or Lucide fallback, URL placeholder, prefix) plus `parseSocialLinks()` / `serializeSocialLinks()`. Parsing is defensive — malformed JSON yields `[]` rather than throwing at render.

`saveSocialLinksAction` validates separately from `updateConfigAction` (per-entry URL protocol allowlist, so `javascript:` and friends are rejected server-side; `mailto:` is permitted only for the email platform). Adding a platform means one entry in the registry — [src/components/social-icon.tsx](src/components/social-icon.tsx) and the admin editor pick it up automatically. Because the card has its own action, the basic-settings save path must exclude `social_links` from its payload or it will clobber the card with stale form state.

## Client-side behavior

[src/app/page.tsx](src/app/page.tsx) stays a Server Component (header/footer, 0 JS) and delegates all interaction to [src/components/home-page.tsx](src/components/home-page.tsx).

Internal/external selection lives in `HomePage` as `isInternal` and threads down to the grid, search dialog, and hotkeys. URL resolution is always `(isInternal ? internal : external) || internal || external`. When `auto_detect_network` is on, `detectNetwork()` races `fetch(..., {mode: "no-cors"})` against a 2s timeout on up to 3 internal URLs and treats a *fast* failure as reachable ([src/components/home-page.tsx:135](src/components/home-page.tsx#L135)); a manual toggle sets `manualOverride` and permanently stops probing for that session.

Hotkeys are `Mod+<key>` ([src/components/shortcut-hints.tsx](src/components/shortcut-hints.tsx)) — `Meta` on Mac, `Control` elsewhere, and holding the modifier shows the overlay. `K` is reserved for search and rejected server-side in `createShortcutAction`.

Components that read `window`/`navigator`/theme gate on a `mounted` flag and render a skeleton first to avoid hydration mismatch (`admin-panel.tsx`, `theme-toggle.tsx`, the `CategoryTabs` sliding indicator, `Clock`). Keep that pattern. The admin panel keeps its active tab in `window.location.hash`.

`footer_text` is rendered with `dangerouslySetInnerHTML` so the default value can carry a link — it's admin-authored config, but treat it as such when editing.

## Conventions

- `@/*` maps to `src/*`.
- shadcn/ui, `style: "radix-nova"`, baseColor neutral, CSS variables, no `tailwind.config` (Tailwind v4 — theme lives in [src/app/globals.css](src/app/globals.css)). Add primitives under `src/components/ui/`, feature components at `src/components/`, admin tabs under `src/components/admin/`.
- Feedback is `toast()` from `sonner`; the `<Toaster>` is mounted in the root layout.
- Global `font-mono` (Geist Mono) — the monospace look is intentional.
- Each route segment has its own `loading.tsx` / `error.tsx`.
