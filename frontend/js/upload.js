/* ============================================================
   CloudVault DAM — Upload Page Logic
   Drag & drop, thumbnail preview, simulated progress
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  damMountLayout('upload', 'Upload Asset');

  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const browseBtn = document.getElementById('browseBtn');
  const fileQueue = document.getElementById('fileQueue');
  let queuedFiles = [];

  browseBtn.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('click', (e) => { if(e.target === dropzone) fileInput.click(); });
  dropzone.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' ') fileInput.click(); });

  ['dragenter','dragover'].forEach(evt => dropzone.addEventListener(evt, (e) => {
    e.preventDefault(); e.stopPropagation(); dropzone.classList.add('dragover');
  }));
  ['dragleave','drop'].forEach(evt => dropzone.addEventListener(evt, (e) => {
    e.preventDefault(); e.stopPropagation(); dropzone.classList.remove('dragover');
  }));
  dropzone.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files));
  fileInput.addEventListener('change', () => handleFiles(fileInput.files));

  function fileTypeIcon(file){
    if(file.type.startsWith('image/')) return {icon:'bi-image', color:'#2563EB'};
    if(file.type.startsWith('video/')) return {icon:'bi-camera-reels', color:'#8B5CF6'};
    if(file.type === 'application/pdf') return {icon:'bi-file-earmark-pdf', color:'#EF4444'};
    if(file.type.startsWith('audio/')) return {icon:'bi-file-earmark-music', color:'#16A34A'};
    return {icon:'bi-file-earmark-text', color:'#64748B'};
  }

  function handleFiles(fileList){
    Array.from(fileList).forEach(file => {
      queuedFiles.push(file);
      renderQueueItem(file);
    });
    if(fileList.length) damToast(`${fileList.length} file(s) added to the upload queue.`, 'info');
  }

  function renderQueueItem(file){
    const meta = fileTypeIcon(file);
    const sizeKb = (file.size/1024/1024).toFixed(2);
    const id = 'qf-' + Math.random().toString(36).slice(2,9);
    const isImage = file.type.startsWith('image/');

    const item = document.createElement('div');
    item.className = 'd-flex align-items-center gap-3 p-3 mb-2 rounded-3 fade-in-up';
    item.style.border = '1px solid var(--border-color)';
    item.id = id;
    item.innerHTML = `
      <div class="file-icon-thumb" style="background:${meta.color}22; color:${meta.color}; width:48px;height:48px; overflow:hidden;">
        ${isImage ? '' : `<i class="bi ${meta.icon}"></i>`}
      </div>
      <div class="flex-fill">
        <div class="fw-semibold" style="font-size:.85rem;">${file.name}</div>
        <small class="text-muted-2">${sizeKb} MB</small>
        <div class="progress mt-1" style="height:5px;"><div class="progress-bar" style="width:0%" id="${id}-bar"></div></div>
      </div>
      <button type="button" class="btn-close" aria-label="Remove file" data-remove="${id}"></button>
    `;
    fileQueue.appendChild(item);

    if(isImage){
      const reader = new FileReader();
      reader.onload = e => {
        const thumb = item.querySelector('.file-icon-thumb');
        thumb.innerHTML = `<img src="${e.target.result}" alt="" style="width:100%;height:100%;object-fit:cover;">`;
      };
      reader.readAsDataURL(file);
    }

    item.querySelector('[data-remove]').addEventListener('click', () => item.remove());

    // simulate per-file upload progress
    let pct = 0;
    const bar = document.getElementById(id+'-bar');
    const interval = setInterval(() => {
      pct += Math.random()*20 + 8;
      if(pct >= 100){ pct = 100; clearInterval(interval); }
      bar.style.width = pct + '%';
    }, 220);
  }

  document.getElementById('cancelUploadBtn').addEventListener('click', () => {
    damConfirm('This will discard the current upload and clear the file queue. Continue?', () => {
      fileQueue.innerHTML = '';
      queuedFiles = [];
      document.getElementById('uploadForm').reset();
      damToast('Upload cancelled.', 'warning');
    }, {title:'Cancel upload?'});
  });

  document.getElementById('uploadForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('assetName').value.trim();
    const category = document.getElementById('assetCategory').value;

    if(!name || !category){
      damToast('Please fill in the asset name and category.', 'danger', 'Missing information');
      return;
    }
    if(queuedFiles.length === 0){
      damToast('Please add at least one file before submitting.', 'warning', 'No files selected');
      return;
    }

    const wrap = document.getElementById('uploadProgressWrap');
    const bar = document.getElementById('uploadProgressBar');
    const pctLabel = document.getElementById('uploadPercent');
    const submitBtn = document.getElementById('submitUploadBtn');
    wrap.classList.remove('d-none');
    submitBtn.disabled = true;

    let pct = 0;
    const interval = setInterval(() => {
      pct += Math.random()*15 + 5;
      if(pct >= 100){
        pct = 100;
        clearInterval(interval);
        setTimeout(() => {
          damToast(`"${name}" was uploaded successfully.`, 'success', 'Upload complete');
          document.getElementById('uploadForm').reset();
          document.getElementById('fileQueue').innerHTML = '';
          queuedFiles = [];
          wrap.classList.add('d-none');
          bar.style.width = '0%';
          submitBtn.disabled = false;
        }, 400);
      }
      bar.style.width = pct + '%';
      pctLabel.textContent = Math.floor(pct) + '%';
    }, 200);
  });
});
