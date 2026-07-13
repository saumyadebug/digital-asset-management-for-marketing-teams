/* ============================================================
   CloudVault DAM — User Management Logic
   ============================================================ */

let usersLocal = [...DAM_DATA.users];
let userModalInstance;
const USER_PAGE_SIZE = 5;
let userPage = 1;

document.addEventListener('DOMContentLoaded', () => {
  damMountLayout('users', 'User Management');
  userModalInstance = new bootstrap.Modal(document.getElementById('userModal'));

  renderUserTable();

  document.getElementById('userSearch').addEventListener('input', damDebounce(() => { userPage = 1; renderUserTable(); }, 200));
  document.getElementById('saveUserBtn').addEventListener('click', addUser);
});

function getFilteredUsers(){
  const q = document.getElementById('userSearch').value.toLowerCase().trim();
  return usersLocal.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));
}

function renderUserTable(){
  const filtered = getFilteredUsers();
  document.getElementById('userCount').textContent = `${filtered.length} users`;

  const totalPages = Math.max(1, Math.ceil(filtered.length / USER_PAGE_SIZE));
  if(userPage > totalPages) userPage = totalPages;
  const items = filtered.slice((userPage-1)*USER_PAGE_SIZE, userPage*USER_PAGE_SIZE);

  const statusChip = {Active:'chip-success', Inactive:'chip-danger', Pending:'chip-warning'};

  document.getElementById('userTableBody').innerHTML = items.map(u => `
    <tr>
      <td>
        <div class="d-flex align-items-center gap-2">
          <img src="${u.avatar}" class="avatar-sm" alt="${u.name}">
          <span class="fw-semibold">${u.name}</span>
        </div>
      </td>
      <td class="text-muted-2">${u.email}</td>
      <td><span class="chip chip-neutral">${u.role}</span></td>
      <td><span class="chip ${statusChip[u.status]}">${u.status}</span></td>
      <td>${u.assets}</td>
      <td>
        <div class="d-flex gap-1">
          <button class="btn btn-outline-secondary btn-icon-sm" title="${u.status==='Active' ? 'Deactivate' : 'Activate'}" onclick="toggleUserStatus(${u.id})">
            <i class="bi ${u.status==='Active' ? 'bi-pause-circle' : 'bi-play-circle'}"></i>
          </button>
          <button class="btn btn-outline-danger btn-icon-sm" title="Delete" onclick="deleteUser(${u.id})"><i class="bi bi-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('') || `<tr><td colspan="6" class="text-center text-muted-2 py-4">No users match your search.</td></tr>`;

  renderUserPagination(totalPages);
}

function renderUserPagination(totalPages){
  const pag = document.getElementById('userPagination');
  let html = `<li class="page-item ${userPage===1?'disabled':''}"><a class="page-link" href="#" data-page="${userPage-1}">Prev</a></li>`;
  for(let i=1;i<=totalPages;i++){
    html += `<li class="page-item ${i===userPage?'active':''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
  }
  html += `<li class="page-item ${userPage===totalPages?'disabled':''}"><a class="page-link" href="#" data-page="${userPage+1}">Next</a></li>`;
  pag.innerHTML = html;
  pag.querySelectorAll('a').forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault();
    const p = parseInt(a.dataset.page,10);
    if(p>=1 && p<=totalPages){ userPage = p; renderUserTable(); }
  }));
}

function toggleUserStatus(id){
  const u = usersLocal.find(x => x.id === id);
  const goingActive = u.status !== 'Active';
  damConfirm(`${goingActive ? 'Activate' : 'Deactivate'} ${u.name}'s account?`, () => {
    u.status = goingActive ? 'Active' : 'Inactive';
    renderUserTable();
    damToast(`${u.name} was ${goingActive ? 'activated' : 'deactivated'}.`, goingActive ? 'success' : 'warning');
  }, {title: goingActive ? 'Activate user?' : 'Deactivate user?'});
}

function deleteUser(id){
  const u = usersLocal.find(x => x.id === id);
  damConfirm(`Permanently delete ${u.name}'s account? This cannot be undone.`, () => {
    usersLocal = usersLocal.filter(x => x.id !== id);
    renderUserTable();
    damToast(`${u.name} was deleted.`, 'danger');
  }, {title:'Delete user?'});
}

function addUser(){
  const name = document.getElementById('newUserName').value.trim();
  const email = document.getElementById('newUserEmail').value.trim();
  const role = document.getElementById('newUserRole').value;

  if(!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    damToast('Please enter a valid name and email.', 'danger', 'Missing information');
    return;
  }

  usersLocal.unshift({id: Date.now(), name, email, role, status:'Pending', avatar:`https://i.pravatar.cc/150?img=${Math.floor(Math.random()*60)}`, assets:0});
  userPage = 1;
  renderUserTable();
  userModalInstance.hide();
  document.getElementById('userForm').reset();
  damToast(`Invitation sent to ${email}.`, 'success');
}
