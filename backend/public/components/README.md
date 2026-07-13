# Components

This project renders shared UI components (Navbar, Sidebar, Footer) with plain
JavaScript instead of server-side includes, because the site is meant to run
directly from the file system (double-click `index.html` — no build step, no
local server required).

- `js/layout.js` — builds the **Sidebar** and **Topnav** (navbar) HTML and mounts
  them into every dashboard page via `<div id="sidebar-mount">` / `<div id="topnav-mount">`.
- `js/main.js` — shared **Toast Notifications**, **Confirmation Dialog** and
  **Loading Spinner** helpers, usable from any page (`damToast()`, `damConfirm()`).
- `js/charts.js` — dependency-free canvas **Bar / Line / Donut chart** components.
- Reusable markup patterns (**Cards**, **Buttons**, **Tables**, **Forms**, **Modals**,
  **Breadcrumb**, **Pagination**, **Search Box**, **Filter Panel**, **File Upload
  Component**) live as CSS classes in `css/style.css` (`.card-surface`, `.stat-card`,
  `.table-surface`, `.chip`, `.dropzone`, `.filter-panel`, `.timeline`, etc.) so they
  can be reused across pages by applying the same class names.

If you later move this project to a real backend / templating engine (Node,
.NET, PHP, etc.), `damRenderSidebar()` and `damRenderTopnav()` in `js/layout.js`
are the two functions to port into server-side partials.
