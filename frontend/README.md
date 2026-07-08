# CloudVault DAM — Digital Asset Management System for Marketing Teams

A complete, front-end-only, industry-styled SaaS dashboard for a Digital Asset
Management platform, built for deployment on **Microsoft Azure**.

Built strictly with **HTML5, CSS3, Bootstrap 5, and vanilla JavaScript** — no
React/Vue/Angular, no Tailwind, no build tools required.

## How to run

**Option A — just open it (fastest)**
1. Unzip this folder.
2. Open it in VS Code.
3. Open `pages/login.html` (or `index.html`, which redirects there) directly
   in your browser — double-click it, or right-click → "Open with Live Server"
   if you have the VS Code Live Server extension.

**Option B — Live Server (recommended for the smoothest experience)**
1. Install the **Live Server** extension in VS Code.
2. Right-click `index.html` → **Open with Live Server**.
3. The app opens at `http://127.0.0.1:5500/` and redirects to the login page.

No `npm install`, no bundler, no backend — everything runs from static files.
Bootstrap 5, Bootstrap Icons, and Google Fonts (Inter/Poppins) are loaded via
CDN `<link>` tags, so an internet connection is needed the first time each
page loads its stylesheets.

## Demo login

The login form is a front-end simulation — enter **any** valid-looking email
and a password of 6+ characters and it will "sign you in" to the dashboard.

## Folder structure

```
frontend/
├── index.html                 # redirects to pages/login.html
├── pages/                     # every screen of the app
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── upload.html
│   ├── gallery.html           # Asset Gallery (grid/list, filters, pagination)
│   ├── asset-details.html
│   ├── categories.html
│   ├── users.html
│   ├── reports.html
│   ├── profile.html
│   ├── settings.html
│   ├── activity-log.html
│   ├── 404.html
│   ├── 500.html
│   └── 403.html                # Access Denied
├── css/
│   ├── style.css              # design tokens, layout shell, all shared components
│   └── auth.css                # login/register specific styling
├── js/
│   ├── data.js                  # realistic dummy dataset (assets, users, categories, activity)
│   ├── layout.js                # builds & mounts the Sidebar + Topnav (shared shell)
│   ├── main.js                  # toasts, confirm dialog, loader, animated counters
│   ├── charts.js                 # dependency-free canvas bar/line/donut charts
│   ├── auth.js                   # login & register validation
│   ├── dashboard.js
│   ├── upload.js                 # drag & drop, previews, simulated progress
│   ├── gallery.js                 # search/filter/sort/grid-list/pagination
│   ├── asset-details.js
│   ├── categories.js
│   ├── users.js
│   ├── reports.js
│   ├── profile.js
│   ├── settings.js
│   └── activity-log.js
├── images/                      # (placeholder folder — see images/README.md)
├── assets/                      # (placeholder folder — see assets/README.md)
└── components/                  # notes on the reusable component approach
```

## Design tokens

| Token       | Value      |
|-------------|-----------|
| Primary     | `#2563EB` |
| Secondary   | `#1E293B` |
| Accent      | `#3B82F6` |
| Background  | `#F8FAFC` |
| Font (display) | Poppins |
| Font (body) | Inter |

Dark mode uses a separate token set defined under `[data-theme="dark"]` in
`css/style.css`. The theme preference and sidebar collapsed state persist via
`localStorage`.

## Features implemented

- Responsive layout (desktop / tablet / mobile) with collapsible sidebar and
  a mobile off-canvas drawer
- Light/Dark mode toggle (persisted)
- Login & Register with client-side validation, loading spinner, and
  success/error alert placeholders
- Dashboard with animated counters, quick actions, recent uploads table,
  recent activity feed, storage usage bar, and two canvas charts
- Drag-and-drop asset upload with live thumbnail preview and simulated
  progress bars
- Asset Gallery with search, category/type/date filters, sorting, grid/list
  toggle, and pagination
- Asset Details page with version history, activity timeline, related
  assets, and a comments section
- Category and User management pages with add/edit/delete, search, and
  (for users) pagination and activate/deactivate
- Reports page with line/bar/donut charts and mock PDF/Excel export buttons
- Profile & Settings pages (tabs for General/Storage/Notifications/Security,
  including a Two-Factor Authentication toggle)
- Activity Log with a searchable, filterable timeline
- 404 / 500 / 403 error pages with illustrations and "Return Home" actions
- Shared components: navbar, sidebar, cards, buttons, tables, forms, modals,
  toast notifications, confirmation dialogs, loading spinner, breadcrumb,
  pagination, search box, filter panel, file upload dropzone

## Notes

- All data (assets, users, categories, activity) is realistic **mock data**
  defined in `js/data.js` — there is no backend. Wire up real API calls in
  the page-specific `js/*.js` files when you're ready to connect this to
  Azure services.
- The Sidebar/Navbar are injected via JavaScript (`js/layout.js`) rather than
  duplicated in every HTML file, so you can edit the shell once and it
  updates everywhere — see `components/README.md` for details.
