/* ============================================================
   CloudVault DAM — Reports Page Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  damMountLayout('reports', 'Reports');
  drawReportCharts();
  renderTopContributors();

  document.addEventListener('dam:redraw-charts', drawReportCharts);
  document.querySelector('.theme-switch')?.addEventListener('click', () => setTimeout(drawReportCharts, 60));
});

function drawReportCharts(){
  damDrawLineChart('reportsUploadChart', DAM_DATA.monthlyUploads);
  damDrawDonutChart('reportsDonutChart', DAM_DATA.categoryDistribution);

  const legend = document.getElementById('reportsLegend');
  if(legend){
    legend.innerHTML = DAM_DATA.categoryDistribution.map(c => `
      <div class="legend-item"><span class="legend-dot" style="background:${c.color};"></span>${c.label} (${c.value})</div>
    `).join('');
  }

  const topDownloads = [...DAM_DATA.assets].sort((a,b)=>b.downloads-a.downloads).slice(0,6)
    .map(a => ({label: a.name.length>12 ? a.name.slice(0,11)+'…' : a.name, value:a.downloads}));
  damDrawBarChart('downloadStatsChart', topDownloads);
}

function renderTopContributors(){
  const sorted = [...DAM_DATA.users].sort((a,b)=>b.assets-a.assets);
  document.getElementById('topContributors').innerHTML = sorted.map((u,i) => `
    <div class="d-flex align-items-center gap-3 mb-3">
      <span class="fw-bold text-muted-2" style="width:20px;">#${i+1}</span>
      <img src="${u.avatar}" class="avatar-sm" alt="${u.name}">
      <div class="flex-fill">
        <div class="fw-semibold small">${u.name}</div>
        <small class="text-muted-2">${u.role}</small>
      </div>
      <span class="chip chip-info">${u.assets} assets</span>
    </div>
  `).join('');
}
