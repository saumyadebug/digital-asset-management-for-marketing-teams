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

    loginForm.addEventListener('submit', async (e) => {
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
      btnText.textContent = "Signing in...";
spinner.classList.remove("d-none");
submitBtn.disabled = true;

try {

    const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: emailInput.value.trim(),
                password: passInput.value
            })
        }
    );

    const result = await response.json();

    if (!result.success) {

        errorAlert.classList.remove("d-none");
        errorAlert.querySelector("span").textContent = result.message;

        submitBtn.disabled = false;
        spinner.classList.add("d-none");
        btnText.textContent = "Sign In";

        return;
    }

    localStorage.setItem("token", result.token);

    localStorage.setItem(
        "dam_user",
        JSON.stringify(result.user)
    );

    localStorage.setItem(
        "userId",
        result.user.id
    );

    successAlert.classList.remove("d-none");

    setTimeout(() => {

        window.location.href = "dashboard.html";

    }, 800);

}
catch (err) {

    console.log(err);

    damToast("Login failed", "danger");

    submitBtn.disabled = false;

    spinner.classList.add("d-none");

    btnText.textContent = "Sign In";

}
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

    const defaultRole = document.querySelector(".role-option.selected");

if (defaultRole) {
    document.getElementById("selectedRole").value =
        defaultRole.dataset.role;
}

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
    const pw = document.getElementById("regPassword");
const bar = document.getElementById("pwStrengthBar");

pw?.addEventListener("input", () => {

    const v = pw.value;

    let score = 0;

    let message = "";

    if (v.length >= 8) score++;

    if (/[A-Z]/.test(v)) score++;

    if (/[0-9]/.test(v)) score++;

    if (/[^A-Za-z0-9]/.test(v)) score++;

    const pct = (score / 4) * 100;

    bar.style.width = pct + "%";

    if (score <= 1) {

        bar.style.background = "#EF4444";

        message = "Weak password";

    }

    else if (score == 2) {

        bar.style.background = "#F59E0B";

        message = "Medium password";

    }

    else if (score == 3) {

        bar.style.background = "#3B82F6";

        message = "Strong password";

    }

    else {

        bar.style.background = "#22C55E";

        message = "Very strong password";

    }

    document.getElementById("passwordStrengthText").textContent = message;

});

    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const confirm = document.getElementById('regConfirmPassword').value;
      const role = document.getElementById('selectedRole').value;

      let valid = true;
      if(!name){ valid = false; }
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ valid = false; }
      if (
    pw.value.length < 8 ||
    !/[A-Z]/.test(pw.value) ||
    !/[0-9]/.test(pw.value) ||
    !/[^A-Za-z0-9]/.test(pw.value)
) {

    damToast(
        "Password must contain at least 8 characters, one uppercase letter, one number and one special character.",
        "warning",
        "Weak Password"
    );

    valid = false;
}
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
      
      console.log({
    name,
    email,
    password: pw.value,
    confirm,
    role,
    valid
});

      if(!valid){
        damToast('Please review the highlighted fields.', 'danger', 'Something needs attention');
        return;
      }

      const btnText = document.getElementById('registerBtnText');
      const spinner = document.getElementById('registerSpinner');
      btnText.textContent = 'Creating account...';
      spinner.classList.remove('d-none');

try {

    const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

                name,

                email,

                password: pw.value,

                role

            })
        }
    );

    const result = await response.json();

    if (!result.success) {

        damToast(result.message, "danger");

        spinner.classList.add("d-none");

        btnText.textContent = "Create Account";

        return;

    }

    damToast(
        "Account Created Successfully",
        "success"
    );

    localStorage.setItem(
        "token",
        result.token
    );

    localStorage.setItem(
        "dam_user",
        JSON.stringify(result.user)
    );

    setTimeout(() => {

        window.location.href = "dashboard.html";

    }, 800);

}
catch (error) {

    console.log(error);

    damToast(
        "Registration Failed",
        "danger"
    );

}
    });
  }
});
