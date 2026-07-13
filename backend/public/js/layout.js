/* ============================================================
   CloudVault DAM — Layout Injector
   Builds the sidebar + topnav shell so every page shares one
   source of truth (no server / fetch() needed, works on file://)
   ============================================================ */

const DAM_NAV = [
  {section:"Main", items:[
    {href:"dashboard.html",  icon:"bi-grid-1x2-fill", label:"Dashboard", key:"dashboard"},
    {href:"gallery.html",    icon:"bi-images",        label:"Assets",    key:"gallery"},
    {href:"upload.html",     icon:"bi-cloud-arrow-up-fill", label:"Upload Asset", key:"upload"}
  ]},
  {section:"Manage", items:[
    {href:"categories.html", icon:"bi-tags-fill",     label:"Categories", key:"categories"},
    {href:"users.html",      icon:"bi-people-fill",   label:"Users",      key:"users"},
    {href:"reports.html",    icon:"bi-bar-chart-fill",label:"Reports",    key:"reports"},
    {href:"activity-log.html", icon:"bi-clock-history", label:"Activity Logs", key:"activity-log"}
  ]},
  {section:"Account", items:[
    {href:"profile.html",  icon:"bi-person-circle", label:"Profile",  key:"profile"},
    {href:"settings.html", icon:"bi-gear-fill",      label:"Settings", key:"settings"}
  ]}
];

function damRenderSidebar(activeKey){
  const user = DAM_DATA.currentUser;
  let navHtml = DAM_NAV.map(sec => `
    <div class="nav-section-title">${sec.section}</div>
    ${sec.items.map(it => `
      <a href="${it.href}" class="nav-link ${it.key===activeKey?'active':''}">
        <i class="bi ${it.icon}"></i>
        <span class="nav-label">${it.label}</span>
        ${it.badge ? `<span class="badge-dot">${it.badge}</span>` : ''}
      </a>
    `).join('')}
  `).join('');

  return `
  <aside class="sidebar" aria-label="Primary navigation">
    <a href="dashboard.html" class="sidebar-brand text-decoration-none">
      <div class="brand-icon"><i class="bi bi-hexagon-fill"></i></div>
      <div class="brand-text">CloudVault DAM<small>Marketing Workspace</small></div>
    </a>
    <nav class="sidebar-nav">${navHtml}</nav>
    <div class="sidebar-footer">
      <a href="login.html" class="nav-link"><i class="bi bi-box-arrow-right"></i><span class="nav-label">Logout</span></a>
    </div>
  </aside>
  <div class="sidebar-backdrop" onclick="damToggleMobileSidebar()"></div>
  `;
}

function damRenderTopnav(pageTitle){
  const user = DAM_DATA.currentUser;
  return `
  <header class="topnav">
    <button class="sidebar-toggle-btn d-none d-lg-flex" onclick="damToggleSidebar()" aria-label="Collapse sidebar">
      <i class="bi bi-layout-sidebar-inset"></i>
    </button>
    <button class="sidebar-toggle-btn d-lg-none" onclick="damToggleMobileSidebar()" aria-label="Open menu">
      <i class="bi bi-list"></i>
    </button>

    <h1 class="h5 mb-0 d-none d-md-block" style="font-weight:600;">${pageTitle||''}</h1>

    <div class="topnav-search d-none d-sm-block">
      <i class="bi bi-search"></i>
      <input type="search" class="form-control" placeholder="Search assets, categories, users..." aria-label="Search">
    </div>

    <div class="topnav-actions">
      <button class="theme-switch" onclick="damToggleTheme()" aria-label="Toggle dark mode" title="Toggle dark mode"></button>

      <div class="dropdown">
        <button class="icon-btn" data-bs-toggle="dropdown" aria-label="Notifications">
          <i class="bi bi-bell"></i><span class="ping"></span>
        </button>
        <div class="dropdown-menu dropdown-menu-end p-2" style="width:320px;">
          <div class="px-2 py-1 fw-semibold small-caps">Notifications</div>
          <a class="dropdown-item rounded-3 py-2" href="#"><i class="bi bi-cloud-upload text-primary me-2"></i>Karan Mehta uploaded a new video</a>
          <a class="dropdown-item rounded-3 py-2" href="#"><i class="bi bi-person-plus text-success me-2"></i>Vikram Desai joined the workspace</a>
          <a class="dropdown-item rounded-3 py-2" href="#"><i class="bi bi-exclamation-triangle text-warning me-2"></i>Storage is 43% full</a>
          <hr class="my-2">
          <a class="dropdown-item text-center rounded-3 py-2 text-primary fw-semibold" href="activity-log.html">View all activity</a>
        </div>
      </div>

      <div class="dropdown">
        <button class="profile-menu-btn dropdown-toggle" data-bs-toggle="dropdown" aria-label="Profile menu">
          <img src="${user.avatar}" alt="${user.name}">
          <span class="d-none d-md-block text-start">
            <span class="pname d-block">${user.name}</span>
            <span class="prole d-block">${user.role}</span>
          </span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="profile.html"><i class="bi bi-person me-2"></i>My Profile</a></li>
          <li><a class="dropdown-item" href="settings.html"><i class="bi bi-gear me-2"></i>Settings</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="login.html"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
        </ul>
      </div>
    </div>
  </header>
  `;
}

/**
 * Mounts the shared shell into a page.
 * Expects containers: #sidebar-mount, #topnav-mount and wraps content already
 * inside <div class="main-content"> ... <div id="topnav-mount"></div><div class="page-body">...
 */
function damMountLayout(activeKey, pageTitle){
  const sidebarMount = document.getElementById('sidebar-mount');
  const topnavMount = document.getElementById('topnav-mount');
  if(sidebarMount) sidebarMount.outerHTML = damRenderSidebar(activeKey);
  if(topnavMount) topnavMount.outerHTML = damRenderTopnav(pageTitle);

  // restore saved UI state
  const collapsed = localStorage.getItem('dam_sidebar_collapsed') === '1';
  if(collapsed) document.querySelector('.app-shell')?.classList.add('sidebar-collapsed');

  const theme = localStorage.getItem('dam_theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);
}

function damToggleSidebar(){
  const shell = document.querySelector('.app-shell');
  shell.classList.toggle('sidebar-collapsed');
  localStorage.setItem('dam_sidebar_collapsed', shell.classList.contains('sidebar-collapsed') ? '1' : '0');
}

function damToggleMobileSidebar(){
  document.querySelector('.app-shell').classList.toggle('sidebar-mobile-open');
}

function damToggleTheme(){
  const root = document.documentElement;
  const isDark = root.getAttribute('data-theme') === 'dark';
  root.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('dam_theme', isDark ? 'light' : 'dark');
}

// apply theme immediately on load (before shell mounts) to avoid flash
(function damApplyStoredTheme(){
  const theme = localStorage.getItem('dam_theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);
})();
