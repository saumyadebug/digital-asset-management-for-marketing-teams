/* ============================================================
   CloudVault DAM — Profile Page Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  damMountLayout('profile', 'My Profile');

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
