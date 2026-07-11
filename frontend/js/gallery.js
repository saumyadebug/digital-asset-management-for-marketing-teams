/* ============================================================
   CloudVault DAM — Asset Gallery Logic
   ============================================================ */

const GALLERY_PAGE_SIZE = 8;

let galleryState = {
  page: 1,
  view: "grid"
};

let assets = [];

document.addEventListener('DOMContentLoaded', () => {
  damMountLayout('gallery', 'Asset Gallery');
  populateCategoryFilter();
  bindGalleryEvents();
  loadAssets();
});

async function loadAssets() {

  try {

    const response = await fetch("http://localhost:5000/api/assets");

    const result = await response.json();

    if (!result.success) return;

    assets = result.data.map(asset => ({

      id: asset.AssetID,

      name: asset.OriginalFileName,

      category: "General",

      type: asset.FileType,

      ext: asset.FileType.split("/")[1],

      date: new Date(asset.UploadedAt).toLocaleDateString(),

      by: "Admin",

      visibility: "Private",

      downloads: 0,

      tags: [],

      size: (asset.FileSize / 1024).toFixed(1) + " KB",

      blobUrl: asset.BlobURL,

      icon:
        asset.FileType.startsWith("image")
          ? "bi-image"
          : asset.FileType.startsWith("video")
            ? "bi-camera-video"
            : asset.FileType.includes("pdf")
              ? "bi-file-earmark-pdf"
              : "bi-file-earmark",

      color:
        asset.FileType.startsWith("image")
          ? "#0EA5E9"
          : asset.FileType.startsWith("video")
            ? "#A855F7"
            : asset.FileType.includes("pdf")
              ? "#EF4444"
              : "#64748B"

    }));

    renderGallery();

  }

  catch (error) {

    console.error(error);

  }

}

function populateCategoryFilter() {
  const sel = document.getElementById('filterCategory');
  DAM_DATA.categories.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.name; opt.textContent = c.name;
    sel.appendChild(opt);
  });
}

function bindGalleryEvents() {
  ['searchInput', 'filterCategory', 'filterType', 'filterDate', 'sortBy'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener(id === 'searchInput' ? 'input' : 'change', damDebounce(() => { galleryState.page = 1; renderGallery(); }, 200));
  });

  document.getElementById('clearFiltersBtn').addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterType').value = '';
    document.getElementById('filterDate').value = '';
    document.getElementById('sortBy').value = 'newest';
    galleryState.page = 1;
    renderGallery();
  });

  document.getElementById('gridViewBtn').addEventListener('click', () => setView('grid'));
  document.getElementById('listViewBtn').addEventListener('click', () => setView('list'));
}

function setView(view) {
  galleryState.view = view;
  document.getElementById('gridViewBtn').classList.toggle('active', view === 'grid');
  document.getElementById('listViewBtn').classList.toggle('active', view === 'list');
  document.getElementById('assetGrid').classList.toggle('d-none', view !== 'grid');
  document.getElementById('assetList').classList.toggle('d-none', view !== 'list');
  renderGallery();
}

function getFilteredAssets() {
  const q = document.getElementById('searchInput').value.toLowerCase().trim();
  const cat = document.getElementById('filterCategory').value;
  const type = document.getElementById('filterType').value;
  const dateRange = document.getElementById('filterDate').value;
  const sort = document.getElementById('sortBy').value;

  let list = assets.filter(a => {
    if (q && !(a.name.toLowerCase().includes(q) || a.tags.join(' ').toLowerCase().includes(q))) return false;
    if (cat && a.category !== cat) return false;
    if (type && a.type !== type) return false;
    if (dateRange) {
      const days = (new Date('2026-07-08') - new Date(a.date)) / 86400000;
      if (days > parseInt(dateRange, 10)) return false;
    }
    return true;
  });

  if (sort === 'newest') list.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (sort === 'oldest') list.sort((a, b) => new Date(a.date) - new Date(b.date));
  if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'downloads') list.sort((a, b) => b.downloads - a.downloads);

  return list;
}

function renderGallery() {
  const all = getFilteredAssets();
  document.getElementById('resultCount').textContent = all.length;
  renderActiveChips();

  const totalPages = Math.max(1, Math.ceil(all.length / GALLERY_PAGE_SIZE));
  if (galleryState.page > totalPages) galleryState.page = totalPages;
  const start = (galleryState.page - 1) * GALLERY_PAGE_SIZE;
  const pageItems = all.slice(start, start + GALLERY_PAGE_SIZE);

  document.getElementById('emptyState').classList.toggle('d-none', all.length !== 0);
  document.getElementById('assetGrid').classList.toggle('d-none', galleryState.view !== 'grid' || all.length === 0);
  document.getElementById('assetList').classList.toggle('d-none', galleryState.view !== 'list' || all.length === 0);

  if (galleryState.view === 'grid') { renderGrid(pageItems); } else { renderList(pageItems); }
  renderPagination(totalPages);
}

function renderActiveChips() {
  const chips = [];
  const cat = document.getElementById('filterCategory').value;
  const type = document.getElementById('filterType').value;
  const q = document.getElementById('searchInput').value;
  if (q) chips.push(`Search: "${q}"`);
  if (cat) chips.push(cat);
  if (type) chips.push(type);
  document.getElementById('activeChips').innerHTML = chips.map(c => `<span class="chip chip-info">${c}</span>`).join('');
}

function assetCardHtml(a) {
  return `
  <div class="col-sm-6 col-xl-3">
    <div class="asset-card">
      <div class="asset-thumb" style="background:linear-gradient(135deg, ${a.color}, ${a.color}CC);">
        <i class="bi ${a.icon}"></i>
        <div class="thumb-overlay">

<button class="btn-icon-sm"
title="Preview"
onclick="window.location.href='asset-details.html?id=${a.id}'">
<i class="bi bi-eye"></i>
</button>

<button class="btn-icon-sm"
title="Download"
onclick="downloadAsset(${a.id})">
<i class="bi bi-download"></i>
</button>

<button class="btn-icon-sm"
title="Delete"
onclick="deleteAsset(${a.id})">
<i class="bi bi-trash"></i>
</button>

</div>
        <span class="chip chip-neutral position-absolute" style="top:10px; left:10px; background:rgba(255,255,255,.92);">${a.ext}</span>
      </div>
      <div class="p-3">
        <div class="fw-semibold text-truncate mb-1" style="font-size:.87rem;" title="${a.name}">${a.name}</div>
        <div class="d-flex align-items-center justify-content-between mb-2">
          <span class="chip chip-neutral">${a.category}</span>
          <small class="text-muted-2">${a.date}</small>
        </div>
        <div class="d-flex flex-wrap gap-1 mb-2">
          ${a.tags.slice(0, 2).map(t => `<span class="badge rounded-pill text-bg-light border">#${t}</span>`).join('')}
        </div>
        <small class="text-muted-2 d-block mb-2"><i class="bi bi-person-circle me-1"></i>${a.by}</small>
        <div class="d-flex gap-1">
          <a href="asset-details.html?id=${a.id}" class="btn btn-outline-secondary btn-sm flex-fill"><i class="bi bi-eye"></i></a>
          <button class="btn btn-outline-secondary btn-sm flex-fill"
onclick="downloadAsset(${a.id})">
    <i class="bi bi-download"></i>
</button>
          <button class="btn btn-outline-secondary btn-sm flex-fill" onclick="damToast('Opening editor for ${a.name}...','info')"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-outline-danger btn-sm flex-fill"
onclick="deleteAsset(${a.id})">
    <i class="bi bi-trash"></i>
</button>
        </div>
      </div>
    </div>
  </div>`;
}

function renderGrid(items) {
  document.getElementById('assetGrid').innerHTML = items.map(assetCardHtml).join('');
}

function renderList(items) {
  const rows = items.map(a => `
    <tr>
      <td>
        <div class="d-flex align-items-center gap-2">
          <div class="file-icon-thumb" style="background:${a.color}22; color:${a.color};"><i class="bi ${a.icon}"></i></div>
          <div>
            <div class="fw-semibold" style="font-size:.85rem;">${a.name}</div>
            <small class="text-muted-2">${a.tags.map(t => '#' + t).join(' ')}</small>
          </div>
        </div>
      </td>
      <td><span class="chip chip-neutral">${a.category}</span></td>
      <td class="text-muted-2">${a.date}</td>
      <td>${a.by}</td>
      <td><span class="chip ${a.visibility === 'Public' ? 'chip-success' : 'chip-warning'}">${a.visibility}</span></td>
      <td>
        <div class="d-flex gap-1">
          <a href="asset-details.html?id=${a.id}" class="btn btn-outline-secondary btn-icon-sm" title="Preview"><i class="bi bi-eye"></i></a>
          <button class="btn btn-outline-secondary btn-icon-sm"
title="Download"
onclick="downloadAsset(${a.id})">
    <i class="bi bi-download"></i>
</button>
          <button class="btn btn-outline-danger btn-icon-sm"
title="Delete"
onclick="deleteAsset(${a.id})">
    <i class="bi bi-trash"></i>

        </div>
      </td>
    </tr>
  `).join('');
  document.getElementById('assetList').innerHTML = `
    <div class="table-responsive">
      <table class="table align-middle">
        <thead><tr><th>Asset</th><th>Category</th><th>Date</th><th>Uploaded By</th><th>Visibility</th><th>Actions</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function renderPagination(totalPages) {
  const pag = document.getElementById('pagination');
  let html = `<li class="page-item ${galleryState.page === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${galleryState.page - 1}">Prev</a></li>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<li class="page-item ${i === galleryState.page ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
  }
  html += `<li class="page-item ${galleryState.page === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${galleryState.page + 1}">Next</a></li>`;
  pag.innerHTML = html;
  pag.querySelectorAll('a').forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault();
    const p = parseInt(a.dataset.page, 10);
    if (p >= 1 && p <= totalPages) { galleryState.page = p; renderGallery(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  }));
}

document.addEventListener('click', (e) => {
  if (e.target.id === 'copyLinkBtn' || e.target.closest('#copyLinkBtn')) {
    const input = document.getElementById('shareLinkInput');
    input.select();
    navigator.clipboard?.writeText(input.value);
    damToast('Share link copied to clipboard.', 'success');
  }
});
async function downloadAsset(id) {

  try {

    const response = await fetch(
      `http://localhost:5000/api/assets/download/${id}`
    );

    const result = await response.json();

    if (!result.success) {

      alert("Download failed");

      return;

    }

    window.open(result.data.downloadUrl, "_blank");

  }

  catch (error) {

    console.error(error);

  }

}

async function deleteAsset(id) {

  if (!confirm("Delete this asset?")) return;

  try {

    const response = await fetch(
      `http://localhost:5000/api/assets/${id}`,
      {
        method: "DELETE"
      }
    );

    const result = await response.json();

    if (result.success) {

      loadAssets();

    }

  }

  catch (error) {

    console.error(error);

  }

}

