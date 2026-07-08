/* ============================================================
   CloudVault DAM — Dashboard Page Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  damMountLayout('dashboard', 'Dashboard');

  renderRecentUploads();
  renderRecentActivity();
  drawDashboardCharts();

  document.addEventListener('dam:redraw-charts', drawDashboardCharts);
  document.querySelector('.theme-switch')?.addEventListener('click', () => setTimeout(drawDashboardCharts, 60));
});

function renderRecentUploads(){
  const tbody = document.getElementById('recentUploadsBody');
  if(!tbody) return;
  const rows = DAM_DATA.assets.slice(0,6).map(a => `
    <tr>
      <td>
        <div class="d-flex align-items-center gap-2">
          <div class="file-icon-thumb" style="background:${a.color}22; color:${a.color};"><i class="bi ${a.icon}"></i></div>
          <div>
            <div class="fw-semibold" style="font-size:.85rem;">${a.name}</div>
            <small class="text-muted-2">${a.ext} · ${a.size}</small>
          </div>
        </div>
      </td>
      <td><span class="chip chip-neutral">${a.category}</span></td>
      <td>${a.by}</td>
      <td class="text-muted-2">${a.date}</td>
      <td><span class="chip ${a.visibility==='Public' ? 'chip-success' : 'chip-warning'}">${a.visibility}</span></td>
    </tr>
  `).join('');
  tbody.innerHTML = rows;
}

function renderRecentActivity(){
  const list = document.getElementById('recentActivityList');
  if(!list) return;
  const colorMap = {blue:'bg-tint-blue', green:'bg-tint-green', purple:'bg-tint-purple', amber:'bg-tint-amber', cyan:'bg-tint-cyan', red:'bg-tint-red'};
  list.innerHTML = DAM_DATA.activity.slice(0,5).map(item => `
    <div class="d-flex align-items-start gap-3 mb-3">
      <div class="stat-icon ${colorMap[item.color]} mb-0" style="width:36px;height:36px;font-size:.95rem;"><i class="bi ${item.icon}"></i></div>
      <div>
        <div style="font-size:.83rem;"><strong>${item.user}</strong> ${item.action} <span class="fw-semibold">${item.target}</span></div>
        <small class="text-muted-2">${item.time}</small>
      </div>
    </div>
  `).join('');
}

function drawDashboardCharts(){
  damDrawBarChart('monthlyUploadsChart', DAM_DATA.monthlyUploads);
  damDrawDonutChart('categoryDonutChart', DAM_DATA.categoryDistribution);

  const legend = document.getElementById('categoryLegend');
  if(legend){
    legend.innerHTML = DAM_DATA.categoryDistribution.map(c => `
      <div class="legend-item"><span class="legend-dot" style="background:${c.color};"></span>${c.label} (${c.value})</div>
    `).join('');
  }
}
