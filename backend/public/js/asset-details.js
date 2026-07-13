/* ============================================================
   CloudVault DAM — Asset Details Page Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  damMountLayout('gallery', 'Asset Details');

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10) || DAM_DATA.assets[0].id;
  const asset = DAM_DATA.assets.find(a => a.id === id) || DAM_DATA.assets[0];

  renderAsset(asset);
  renderComments();
  document.getElementById('postCommentBtn').addEventListener('click', () => postComment(asset));

  document.getElementById('copyLinkBtn')?.addEventListener('click', () => {
    const input = document.getElementById('shareLinkInput');
    input.select();
    navigator.clipboard?.writeText(input.value);
    damToast('Share link copied to clipboard.', 'success');
  });
});

function renderAsset(a){
  document.getElementById('breadcrumbAssetName').textContent = a.name;
  document.getElementById('assetTitle').textContent = a.name;
  document.title = a.name + ' · CloudVault DAM';

  const preview = document.getElementById('assetPreviewLarge');
  preview.style.background = `linear-gradient(135deg, ${a.color}, ${a.color}CC)`;
  preview.innerHTML = `<i class="bi ${a.icon}"></i>`;

  document.getElementById('assetMetaChips').innerHTML = `
    <span class="chip chip-neutral">${a.category}</span>
    <span class="chip ${a.visibility==='Public'?'chip-success':'chip-warning'}">${a.visibility}</span>
    <span class="chip chip-info">${a.ext}</span>
    ${a.tags.map(t=>`<span class="badge rounded-pill text-bg-light border">#${t}</span>`).join('')}
  `;

  document.getElementById("assetDescription").textContent =
`${a.name} belongs to the "${a.category}" category and was uploaded by ${a.by}. The asset is securely stored in Azure Blob Storage while its metadata is maintained in Azure SQL Database for efficient organization and retrieval.`;

  document.getElementById('assetInfoList').innerHTML = `
    <div class="d-flex justify-content-between py-2 border-bottom"><span class="text-muted-2">File type</span><span class="fw-semibold">${a.ext}</span></div>
    <div class="d-flex justify-content-between py-2 border-bottom"><span class="text-muted-2">File size</span><span class="fw-semibold">${a.size}</span></div>
    <div class="d-flex justify-content-between py-2 border-bottom"><span class="text-muted-2">Category</span><span class="fw-semibold">${a.category}</span></div>
    <div class="d-flex justify-content-between py-2 border-bottom"><span class="text-muted-2">Uploaded by</span><span class="fw-semibold">${a.by}</span></div>
    <div class="d-flex justify-content-between py-2 border-bottom"><span class="text-muted-2">Upload date</span><span class="fw-semibold">${a.date}</span></div>
    <div class="d-flex justify-content-between py-2"><span class="text-muted-2">Downloads</span><span class="fw-semibold">${a.downloads}</span></div>
  `;

  document.getElementById("versionHistory").innerHTML = `
<div class="d-flex justify-content-between align-items-center py-2">
    <div>
        <div class="fw-semibold small">Current Version</div>
        <small class="text-muted-2">${a.date} · ${a.by}</small>
    </div>
    <span class="chip chip-success">Latest</span>
</div>
`;

document.getElementById("assetTimeline").innerHTML = `
<div class="timeline-item">
    <div class="fw-semibold small">Asset uploaded by ${a.by}</div>
    <small class="text-muted-2">${a.date}</small>
</div>

<div class="timeline-item">
    <div class="fw-semibold small">Stored securely in Azure Blob Storage</div>
    <small class="text-muted-2">Completed</small>
</div>

<div class="timeline-item">
    <div class="fw-semibold small">Metadata stored in Azure SQL Database</div>
    <small class="text-muted-2">Completed</small>
</div>
`;

  const related = DAM_DATA.assets.filter(x => x.category===a.category && x.id!==a.id).slice(0,3);
  document.getElementById('relatedAssets').innerHTML = related.map(r => `
    <a href="asset-details.html?id=${r.id}" class="d-flex align-items-center gap-2 mb-3 text-decoration-none">
      <div class="file-icon-thumb" style="background:${r.color}22; color:${r.color};"><i class="bi ${r.icon}"></i></div>
      <div>
        <div class="fw-semibold small" style="color:var(--text-primary);">${r.name}</div>
        <small class="text-muted-2">${r.date}</small>
      </div>
    </a>
  `).join('') || '<p class="text-muted-2 small mb-0">No related assets in this category yet.</p>';
}

function renderComments(){
  const comments = [
{
    user: "Marketing Team",
    avatar: "https://ui-avatars.com/api/?name=Marketing+Team&background=2563EB&color=fff",
    text: "Asset uploaded successfully and available for team access.",
    time: "Recently"
},
{
    user: "CloudVault System",
    avatar: "https://ui-avatars.com/api/?name=CloudVault&background=0F766E&color=fff",
    text: "Metadata stored in Azure SQL Database and file secured in Azure Blob Storage.",
    time: "Recently"
}
];
  document.getElementById('commentsList').innerHTML = comments.map(c => `
    <div class="d-flex gap-2 mb-3">
      <img src="${c.avatar}" class="avatar-sm" alt="${c.user}">
      <div>
        <div class="fw-semibold small">${c.user} <span class="text-muted-2 fw-normal">· ${c.time}</span></div>
        <div class="small">${c.text}</div>
      </div>
    </div>
  `).join('');
}

function postComment(){
  const input = document.getElementById('newComment');
  if(!input.value.trim()){ damToast('Write something before posting.', 'warning'); return; }
  const list = document.getElementById('commentsList');
  list.insertAdjacentHTML('beforeend', `
    <div class="d-flex gap-2 mb-3 fade-in-up">
      <img src="https://i.pravatar.cc/150?img=47" class="avatar-sm" alt="You">
      <div>
       <div class="fw-semibold small">Current User <span class="text-muted-2 fw-normal">· just now</span></div>
        <div class="small">${input.value.trim()}</div>
      </div>
    </div>
  `);
  input.value = '';
  damToast('Comment posted.', 'success');
}
