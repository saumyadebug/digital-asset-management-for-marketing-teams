/* ============================================================
   CloudVault DAM — Settings Page Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  damMountLayout('settings', 'Settings');

  document.getElementById('twoFactorToggle')?.addEventListener('change', (e) => {
    damToast(e.target.checked ? 'Two-factor authentication enabled.' : 'Two-factor authentication disabled.', e.target.checked ? 'success' : 'warning');
  });

  document.querySelectorAll('.form-check-input').forEach(input => {
    if(input.id === 'twoFactorToggle') return;
    input.addEventListener('change', () => damToast('Preference saved.', 'success'));
  });
});
