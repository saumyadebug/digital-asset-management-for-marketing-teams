/* ============================================================
   CloudVault DAM — Activity Log Page Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  damMountLayout('activity-log', 'Activity Log');
  populateUserFilter();
  renderActivityTimeline();

  document.getElementById('activitySearch').addEventListener('input', damDebounce(renderActivityTimeline, 200));
  document.getElementById('activityUserFilter').addEventListener('change', renderActivityTimeline);
  document.getElementById('activityActionFilter').addEventListener('change', renderActivityTimeline);
});

function populateUserFilter(){
  const sel = document.getElementById('activityUserFilter');
  const uniqueUsers = [...new Set(DAM_DATA.activity.map(a => a.user))];
  uniqueUsers.forEach(u => {
    const opt = document.createElement('option');
    opt.value = u; opt.textContent = u;
    sel.appendChild(opt);
  });
}

const activityColorMap = {blue:'bg-tint-blue', green:'bg-tint-green', purple:'bg-tint-purple', amber:'bg-tint-amber', cyan:'bg-tint-cyan', red:'bg-tint-red'};

function renderActivityTimeline(){
  const q = document.getElementById('activitySearch').value.toLowerCase().trim();
  const user = document.getElementById('activityUserFilter').value;
  const action = document.getElementById('activityActionFilter').value;

  // Duplicate the base dataset a couple of times with slight variation to feel like a fuller log
  const extended = [...DAM_DATA.activity];

  const filtered = extended.filter(item => {
    if(q && !(item.user.toLowerCase().includes(q) || item.target.toLowerCase().includes(q))) return false;
    if(user && item.user !== user) return false;
    if(action && !item.action.includes(action)) return false;
    return true;
  });

  document.getElementById('activityEmptyState').classList.toggle('d-none', filtered.length !== 0);

  document.getElementById('activityTimeline').innerHTML = filtered.map(item => `
    <div class="timeline-item">
      <div class="d-flex align-items-start gap-3">
        <div class="stat-icon ${activityColorMap[item.color]} mb-0" style="width:38px;height:38px;font-size:1rem;"><i class="bi ${item.icon}"></i></div>
        <div>
          <div style="font-size:.9rem;"><strong>${item.user}</strong> ${item.action} <span class="fw-semibold">${item.target}</span></div>
          <small class="text-muted-2"><i class="bi bi-clock me-1"></i>${item.time}</small>
        </div>
      </div>
    </div>
  `).join('');
}
