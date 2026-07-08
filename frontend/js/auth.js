/* ============================================================
   CloudVault DAM — Auth Logic (Login & Register)
   Client-side only demo validation (no real backend)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Password visibility toggles ---------------- */
  document.querySelectorAll('[id^="togglePassword"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.input-group').querySelector('input');
      const icon = btn.querySelector('i');
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      icon.className = show ? 'bi bi-eye-slash' : 'bi bi-eye';
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
  });

  /* ---------------- LOGIN ---------------- */
  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    const emailInput = document.getElementById('loginEmail');
    const passInput = document.getElementById('loginPassword');
    const emailFeedback = document.getElementById('emailFeedback');
    const passFeedback = document.getElementById('passwordFeedback');
    const errorAlert = document.getElementById('loginError');
    const successAlert = document.getElementById('loginSuccess');
    const btnText = document.getElementById('loginBtnText');
    const spinner = document.getElementById('loginSpinner');
    const submitBtn = document.getElementById('loginSubmitBtn');

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      errorAlert.classList.add('d-none');
      successAlert.classList.add('d-none');

      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
      const passValid = passInput.value.trim().length >= 6;

      emailFeedback.classList.toggle('d-none', emailValid);
      emailInput.classList.toggle('is-invalid', !emailValid);
      passFeedback.classList.toggle('d-none', passValid);
      passInput.classList.toggle('is-invalid', !passValid);

      if(!emailValid || !passValid){
        errorAlert.classList.remove('d-none');
        errorAlert.querySelector('span').textContent = 'Please fix the highlighted fields and try again.';
        return;
      }

      // simulate authentication
      btnText.textContent = 'Signing in...';
      spinner.classList.remove('d-none');
      submitBtn.disabled = true;

      setTimeout(() => {
        successAlert.classList.remove('d-none');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 900);
      }, 1100);
    });

    document.getElementById('forgotPasswordLink')?.addEventListener('click', (e) => {
      e.preventDefault();
      damToast('Password reset link sent to your work email.', 'info', 'Check your inbox');
    });
  }

  /* ---------------- REGISTER ---------------- */
  const registerForm = document.getElementById('registerForm');
  if(registerForm){
    // role picker
    document.querySelectorAll('.role-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.role-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        document.getElementById('selectedRole').value = opt.dataset.role;
      });
    });

    // avatar preview
    const avatarInput = document.getElementById('avatarInput');
    const avatarPreview = document.getElementById('avatarPreview');
    avatarInput?.addEventListener('change', () => {
      const file = avatarInput.files[0];
      if(file){
        const reader = new FileReader();
        reader.onload = e => { avatarPreview.innerHTML = `<img src="${e.target.result}" alt="Profile preview">`; };
        reader.readAsDataURL(file);
      }
    });

    // password strength
    const pw = document.getElementById('regPassword');
    const bar = document.getElementById('pwStrengthBar');
    pw?.addEventListener('input', () => {
      const v = pw.value;
      let score = 0;
      if(v.length >= 6) score++;
      if(v.length >= 10) score++;
      if(/[A-Z]/.test(v) && /[0-9]/.test(v)) score++;
      if(/[^A-Za-z0-9]/.test(v)) score++;
      const pct = (score/4)*100;
      bar.style.width = pct + '%';
      bar.style.background = pct < 40 ? 'var(--danger)' : pct < 75 ? 'var(--warning)' : 'var(--success)';
    });

    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const confirm = document.getElementById('regConfirmPassword').value;
      const role = document.getElementById('selectedRole').value;

      let valid = true;
      if(!name){ valid = false; }
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ valid = false; }
      if(pw.value.length < 6){ valid = false; }
      if(pw.value !== confirm){
        document.getElementById('confirmFeedback').classList.remove('d-none');
        valid = false;
      } else {
        document.getElementById('confirmFeedback').classList.add('d-none');
      }
      if(!role){
        damToast('Please select a role to continue.', 'warning');
        valid = false;
      }

      if(!valid){
        damToast('Please review the highlighted fields.', 'danger', 'Something needs attention');
        return;
      }

      const btnText = document.getElementById('registerBtnText');
      const spinner = document.getElementById('registerSpinner');
      btnText.textContent = 'Creating account...';
      spinner.classList.remove('d-none');

      setTimeout(() => {
        damToast('Account created! Redirecting to sign in...', 'success');
        setTimeout(() => window.location.href = 'login.html', 1000);
      }, 1100);
    });
  }
});
