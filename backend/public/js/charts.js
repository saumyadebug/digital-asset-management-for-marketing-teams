/* ============================================================
   CloudVault DAM — Lightweight Canvas Charts
   No external chart library — pure Canvas 2D per tech stack rules
   ============================================================ */

function damGetCssVar(name){
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function damPrepCanvas(canvas){
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return {ctx, w: rect.width, h: rect.height};
}

/* ---------- Bar Chart ---------- */
function damDrawBarChart(canvasId, data){
  const canvas = document.getElementById(canvasId);
  if(!canvas) return;
  const {ctx, w, h} = damPrepCanvas(canvas);
  ctx.clearRect(0,0,w,h);

  const padding = {top:20, right:10, bottom:30, left:34};
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;
  const max = Math.max(...data.map(d => d.value)) * 1.15;
  const gridColor = damGetCssVar('--border-color') || '#E2E8F0';
  const textColor = damGetCssVar('--text-secondary') || '#64748B';
  const primary = damGetCssVar('--primary') || '#2563EB';
  const accent = damGetCssVar('--accent') || '#3B82F6';

  // gridlines
  ctx.strokeStyle = gridColor; ctx.lineWidth = 1; ctx.font = '11px Inter, sans-serif'; ctx.fillStyle = textColor;
  const gridLines = 4;
  for(let i=0;i<=gridLines;i++){
    const y = padding.top + (chartH/gridLines)*i;
    ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(w-padding.right, y); ctx.stroke();
    const val = Math.round(max - (max/gridLines)*i);
    ctx.fillText(val, 2, y+4);
  }

  const barW = chartW / data.length * 0.5;
  const gap = chartW / data.length;

  data.forEach((d,i)=>{
    const x = padding.left + gap*i + (gap-barW)/2;
    const barH = (d.value/max) * chartH;
    const y = padding.top + chartH - barH;
    const grad = ctx.createLinearGradient(0,y,0,padding.top+chartH);
    grad.addColorStop(0, accent); grad.addColorStop(1, primary);
    ctx.fillStyle = grad;
    roundRectPath(ctx, x, y, barW, barH, 6);
    ctx.fill();

    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.fillText(d.label, x+barW/2, padding.top+chartH+18);
  });
  ctx.textAlign = 'left';
}

/* ---------- Line Chart (area) ---------- */
function damDrawLineChart(canvasId, data){
  const canvas = document.getElementById(canvasId);
  if(!canvas) return;
  const {ctx, w, h} = damPrepCanvas(canvas);
  ctx.clearRect(0,0,w,h);

  const padding = {top:20, right:14, bottom:30, left:34};
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;
  const max = Math.max(...data.map(d=>d.value)) * 1.2;
  const gridColor = damGetCssVar('--border-color') || '#E2E8F0';
  const textColor = damGetCssVar('--text-secondary') || '#64748B';
  const primary = damGetCssVar('--primary') || '#2563EB';

  ctx.strokeStyle = gridColor; ctx.lineWidth = 1; ctx.font = '11px Inter, sans-serif'; ctx.fillStyle = textColor;
  for(let i=0;i<=4;i++){
    const y = padding.top + (chartH/4)*i;
    ctx.beginPath(); ctx.moveTo(padding.left,y); ctx.lineTo(w-padding.right,y); ctx.stroke();
    ctx.fillText(Math.round(max-(max/4)*i), 2, y+4);
  }

  const stepX = chartW / (data.length-1);
  const pts = data.map((d,i)=>({x: padding.left + stepX*i, y: padding.top + chartH - (d.value/max)*chartH}));

  // area fill
  const grad = ctx.createLinearGradient(0,padding.top,0,padding.top+chartH);
  grad.addColorStop(0, 'rgba(37,99,235,.28)');
  grad.addColorStop(1, 'rgba(37,99,235,0)');
  ctx.beginPath();
  ctx.moveTo(pts[0].x, padding.top+chartH);
  pts.forEach(p=>ctx.lineTo(p.x,p.y));
  ctx.lineTo(pts[pts.length-1].x, padding.top+chartH);
  ctx.closePath();
  ctx.fillStyle = grad; ctx.fill();

  // line
  ctx.beginPath();
  pts.forEach((p,i)=> i===0 ? ctx.moveTo(p.x,p.y) : ctx.lineTo(p.x,p.y));
  ctx.strokeStyle = primary; ctx.lineWidth = 2.5; ctx.lineJoin='round'; ctx.stroke();

  // points + labels
  ctx.fillStyle = textColor; ctx.textAlign = 'center';
  pts.forEach((p,i)=>{
    ctx.beginPath(); ctx.arc(p.x,p.y,4,0,Math.PI*2); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.lineWidth=2; ctx.strokeStyle = primary; ctx.stroke();
    ctx.fillStyle = textColor;
    ctx.fillText(data[i].label, p.x, padding.top+chartH+18);
  });
  ctx.textAlign = 'left';
}

/* ---------- Donut / Pie Chart ---------- */
function damDrawDonutChart(canvasId, data){
  const canvas = document.getElementById(canvasId);
  if(!canvas) return;
  const {ctx, w, h} = damPrepCanvas(canvas);
  ctx.clearRect(0,0,w,h);

  const cx = w/2, cy = h/2;
  const radius = Math.min(w,h)/2 - 6;
  const inner = radius * 0.6;
  const total = data.reduce((s,d)=>s+d.value,0);
  let start = -Math.PI/2;

  data.forEach(d=>{
    const angle = (d.value/total) * Math.PI*2;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,radius,start,start+angle);
    ctx.closePath();
    ctx.fillStyle = d.color;
    ctx.fill();
    start += angle;
  });

  // inner circle to make donut
  const cardBg = damGetCssVar('--card-bg') || '#fff';
  ctx.beginPath(); ctx.arc(cx,cy,inner,0,Math.PI*2); ctx.fillStyle = cardBg; ctx.fill();

  ctx.fillStyle = damGetCssVar('--text-primary') || '#0F172A';
  ctx.textAlign = 'center'; ctx.font = '700 20px Poppins, sans-serif';
  ctx.fillText(total, cx, cy-2);
  ctx.font = '11px Inter, sans-serif'; ctx.fillStyle = damGetCssVar('--text-muted') || '#94A3B8';
  ctx.fillText('Total Assets', cx, cy+16);
  ctx.textAlign = 'left';
}

function roundRectPath(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}

// redraw all registered charts on theme change / resize
window.addEventListener('resize', damDebounceGlobal(()=> document.dispatchEvent(new Event('dam:redraw-charts')), 200));
function damDebounceGlobal(fn,wait){ let t; return (...a)=>{clearTimeout(t); t=setTimeout(()=>fn(...a),wait);} }
