/* ============================================================
   CloudVault DAM — Profile Page Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  damMountLayout('profile', 'My Profile');

  // Populate profile fields
  const user = DAM_DATA.currentUser;
  if(user){
    document.getElementById('profileHeaderName').textContent = user.name;
    document.getElementById('profileHeaderAvatar').src = user.avatar;
    document.getElementById('profileHeaderRole').textContent = `${user.role} · ${user.department || ''}`;
    
    document.getElementById('profileName').value = user.name;
    document.getElementById('profileEmail').value = user.email;
    
    // update role select
    const roleSelect = document.getElementById('profileRole');
    if(roleSelect){
      for(let opt of roleSelect.options){
        if(opt.text === user.role) opt.selected = true;
      }
    }
  }

  document.getElementById('profileForm').addEventListener('submit', (e) => {
    e.preventDefault();
    damToast('Profile information updated successfully.', 'success');
  });

  document.getElementById('passwordForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const current = document.getElementById('currentPassword').value;
    const next = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmNewPassword').value;

    if(!current || !next || !confirm){
      damToast('Please fill in all password fields.', 'danger', 'Missing information');
      return;
    }
    if(next.length < 6){
      damToast('New password must be at least 6 characters.', 'danger');
      return;
    }
    if(next !== confirm){
      damToast('New password and confirmation do not match.', 'danger');
      return;
    }
    damToast('Password updated successfully.', 'success');
    e.target.reset();
  });
});
