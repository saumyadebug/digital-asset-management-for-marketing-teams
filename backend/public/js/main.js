/* ============================================================
   CloudVault DAM — Shared UI Behaviours
   Toasts, page loader, tooltips, animated counters, confirm modal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Bootstrap tooltips
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));

  // Animated counters (elements with data-counter="1234")
  document.querySelectorAll('[data-counter]').forEach(el => {
    const target = parseInt(el.getAttribute('data-counter'), 10) || 0;
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const tick = () => {
      cur += step;
      if(cur >= target){ el.textContent = target.toLocaleString(); return; }
      el.textContent = cur.toLocaleString();
      requestAnimationFrame(() => setTimeout(tick, 16));
    };
    tick();
  });

  // page loader fade-out
  const loader = document.getElementById('pageLoader');
  if(loader){
    setTimeout(() => { loader.classList.add('d-none'); }, 450);
  }
});

/* Toast helper — call damToast('Asset uploaded successfully', 'success') */
function damToast(message, type='success', title=''){
  const icons = { success:'bi-check-circle-fill text-success', danger:'bi-x-circle-fill text-danger', warning:'bi-exclamation-triangle-fill text-warning', info:'bi-info-circle-fill text-primary' };
  const titles = { success:'Success', danger:'Error', warning:'Warning', info:'Notice' };
  let container = document.getElementById('damToastContainer');
  if(!container){
    container = document.createElement('div');
    container.id = 'damToastContainer';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = 1080;
    document.body.appendChild(container);
  }
  const id = 'toast-' + Date.now();
  const html = `
    <div id="${id}" class="toast align-items-center fade-in-up" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body d-flex align-items-center gap-2">
          <i class="bi ${icons[type]||icons.info}"></i>
          <div><strong class="d-block">${title||titles[type]||'Notice'}</strong><span class="text-muted-2">${message}</span></div>
        </div>
        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>`;
  container.insertAdjacentHTML('beforeend', html);
  const toastEl = document.getElementById(id);
  const toast = new bootstrap.Toast(toastEl, {delay:3800});
  toast.show();
  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

/* Confirmation dialog helper — damConfirm('Delete this asset?', onConfirm) */
function damConfirm(message, onConfirm, opts={}){
  let modalEl = document.getElementById('damConfirmModal');
  if(!modalEl){
    document.body.insertAdjacentHTML('beforeend', `
    <div class="modal fade" id="damConfirmModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="border-radius:var(--radius-lg); border:none;">
          <div class="modal-body p-4 text-center">
            <div class="bg-tint-red rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width:56px;height:56px;">
              <i class="bi bi-exclamation-triangle-fill fs-4"></i>
            </div>
            <h5 id="damConfirmTitle">Are you sure?</h5>
            <p class="text-muted-2 mb-4" id="damConfirmMsg"></p>
            <div class="d-flex gap-2 justify-content-center">
              <button class="btn btn-outline-secondary px-4" data-bs-dismiss="modal">Cancel</button>
              <button class="btn btn-danger px-4" id="damConfirmBtn">Yes, Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>`);
    modalEl = document.getElementById('damConfirmModal');
  }
  document.getElementById('damConfirmTitle').textContent = opts.title || 'Are you sure?';
  document.getElementById('damConfirmMsg').textContent = message;
  const modal = new bootstrap.Modal(modalEl);
  const btn = document.getElementById('damConfirmBtn');
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);
  newBtn.addEventListener('click', () => { modal.hide(); onConfirm && onConfirm(); });
  modal.show();
}

/* Simple debounce for search inputs */
function damDebounce(fn, wait=250){
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}
