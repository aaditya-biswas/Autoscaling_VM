'use strict';

// ─── DATA ────────────────────────────────────────────────────────
const INITIAL_DESIGNS = [
  { id:1, name:'Obsidian Gown',    category:'dress',   fabric:'Velvet',  color:'#1A3A4A', season:'AW 2026', fav:true,  silhouette:'Flared',   neckline:'V-Neck' },
  { id:2, name:'Ivory Reverie',    category:'dress',   fabric:'Silk',    color:'#F5E6D0', season:'SS 2026', fav:false, silhouette:'A-line',   neckline:'Off-Shoulder' },
  { id:3, name:'Sand Minimalist',  category:'coat',    fabric:'Linen',   color:'#D4C5A9', season:'SS 2026', fav:false, silhouette:'Straight', neckline:'Crew' },
  { id:4, name:'Crimson Hour',     category:'dress',   fabric:'Satin',   color:'#8B1A1A', season:'AW 2026', fav:true,  silhouette:'Fitted',   neckline:'Halter' },
  { id:5, name:'Midnight Draped',  category:'coat',    fabric:'Wool',    color:'#2C2C2C', season:'AW 2026', fav:false, silhouette:'Draped',   neckline:'V-Neck' },
  { id:6, name:'Mauve Dream',      category:'top',     fabric:'Chiffon', color:'#C9B8D8', season:'SS 2026', fav:true,  silhouette:'A-line',   neckline:'Off-Shoulder' },
  { id:7, name:'Espresso Trench',  category:'coat',    fabric:'Leather', color:'#3D2B1F', season:'AW 2026', fav:false, silhouette:'Straight', neckline:'Crew' },
  { id:8, name:'Mint Ghost',       category:'top',     fabric:'Organza', color:'#E8F4F0', season:'SS 2026', fav:false, silhouette:'Flared',   neckline:'V-Neck' },
];

const MOODS = [
  { id:1, label:'Colour Story',  bg:'linear-gradient(135deg,#F5E6D0,#C9B8D8)', cls:'tall', text:'Soft Palettes' },
  { id:2, label:'Textile',       bg:'linear-gradient(160deg,#2C2C2C,#4A3728)', cls:'',     text:'Raw Texture' },
  { id:3, label:'Silhouette',    bg:'linear-gradient(120deg,#D4C5A9,#8B7355)', cls:'wide', text:'The Line' },
  { id:4, label:'Architecture',  bg:'linear-gradient(180deg,#1A3A4A,#0D1F26)', cls:'tall', text:'Structure' },
  { id:5, label:'Nature',        bg:'linear-gradient(145deg,#C9D8C8,#8BA888)', cls:'',     text:'Organic' },
  { id:6, label:'Drama',         bg:'linear-gradient(135deg,#8B1A1A,#3D0A0A)', cls:'',     text:'Passion' },
  { id:7, label:'Minimalism',    bg:'linear-gradient(180deg,#F7F2EC,#C4B8AC)', cls:'',     text:'Essence' },
  { id:8, label:'Movement',      bg:'linear-gradient(110deg,#C9B8D8,#8B6FA8)', cls:'',     text:'Flow' },
];

const LOOKS = [
  { num:'01', title:'Nocturne',       sub:'Velvet & Wool',   bg:'linear-gradient(160deg,#1A1A2E,#16213E,#0F3460)' },
  { num:'02', title:'Desert Light',   sub:'Linen & Silk',    bg:'linear-gradient(160deg,#D4A87A,#C4956A,#A67C52)' },
  { num:'03', title:'Ivory Tower',    sub:'Organza & Satin', bg:'linear-gradient(160deg,#F7F2EC,#EDE5D8,#D4C9BC)' },
  { num:'04', title:'Crimson Rite',   sub:'Satin & Chiffon', bg:'linear-gradient(160deg,#6B1111,#8B1A1A,#A52020)' },
  { num:'05', title:'Smoke & Steel',  sub:'Wool & Leather',  bg:'linear-gradient(160deg,#2C2C2C,#3D3D3D,#1A1A1A)' },
  { num:'06', title:'Mauve Season',   sub:'Chiffon & Silk',  bg:'linear-gradient(160deg,#9B8AAB,#C9B8D8,#8070A0)' },
];

// ─── STATE ───────────────────────────────────────────────────────
let designs = [...INITIAL_DESIGNS];
let activeFilter = 'all';
let isListView = false;
let atelierState = { silhouette:'A-line', neckline:'V-Neck', fabric:'Silk', color:'#F5E6D0', fabricName:'Ivory Silk' };
let nextId = 100;

// ─── CURSOR ──────────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function animFollower() {
  fx += (mx - fx) * .12;
  fy += (my - fy) * .12;
  cursorFollower.style.left = fx + 'px';
  cursorFollower.style.top  = fy + 'px';
  requestAnimationFrame(animFollower);
})();

// ─── NAVIGATION ──────────────────────────────────────────────────
function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const sec = document.getElementById('section-' + name);
  if (sec) { sec.classList.add('active'); }
  document.querySelector(`[data-section="${name}"]`)?.classList.add('active');
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => showSection(item.dataset.section));
});

// ─── COLLECTION ──────────────────────────────────────────────────
function getGarmentShape(sil) {
  switch(sil) {
    case 'A-line':   return 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)';
    case 'Straight': return 'polygon(10% 0%, 90% 0%, 88% 100%, 12% 100%)';
    case 'Fitted':   return 'polygon(15% 0%, 85% 0%, 75% 50%, 80% 100%, 20% 100%, 25% 50%)';
    case 'Flared':   return 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)';
    case 'Draped':   return 'polygon(10% 0%, 90% 0%, 95% 60%, 100% 100%, 0% 100%, 5% 60%)';
    default:         return 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)';
  }
}

function renderCollection() {
  const grid = document.getElementById('collectionGrid');
  const filtered = activeFilter === 'all' ? designs : designs.filter(d => d.category === activeFilter);
  grid.className = 'collection-grid' + (isListView ? ' list-view' : '');

  grid.innerHTML = filtered.map((d, i) => `
    <div class="design-card" style="animation-delay:${i * .06}s" data-id="${d.id}">
      <div class="card-image">
        <div class="card-figure">
          <div class="card-garment" style="background:${d.color}; clip-path:${getGarmentShape(d.silhouette)};"></div>
        </div>
        <span class="card-tag">${d.category}</span>
        <button class="card-fav ${d.fav ? 'active' : ''}" data-fav="${d.id}" title="Favourite">♥</button>
      </div>
      <div class="card-body">
        <p class="card-name">${d.name}</p>
        <p class="card-meta">${d.fabric} · ${d.season}</p>
        <div class="card-actions">
          <button class="card-btn" data-edit="${d.id}">Edit</button>
          <button class="card-btn" data-del="${d.id}">Delete</button>
        </div>
      </div>
    </div>
  `).join('');

  // Favourite toggle
  grid.querySelectorAll('[data-fav]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const d = designs.find(x => x.id == btn.dataset.fav);
      if (d) { d.fav = !d.fav; renderCollection(); showToast(d.fav ? '♥ Added to favourites' : 'Removed from favourites'); }
    });
  });

  // Delete
  grid.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      designs = designs.filter(x => x.id != btn.dataset.del);
      renderCollection();
      showToast('Design removed');
    });
  });

  // Edit → open in atelier
  grid.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const d = designs.find(x => x.id == btn.dataset.edit);
      if (d) {
        atelierState = { silhouette: d.silhouette, neckline: d.neckline, fabric: d.fabric, color: d.color, fabricName: d.fabric };
        document.getElementById('designNameInput').value = d.name;
        showSection('atelier');
        refreshAtelierPreview();
      }
    });
  });
}

// Filters
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    activeFilter = btn.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCollection();
  });
});

// View toggle
document.getElementById('gridView').addEventListener('click', () => {
  isListView = false;
  document.getElementById('gridView').classList.add('active');
  document.getElementById('listView').classList.remove('active');
  renderCollection();
});
document.getElementById('listView').addEventListener('click', () => {
  isListView = true;
  document.getElementById('listView').classList.add('active');
  document.getElementById('gridView').classList.remove('active');
  renderCollection();
});

// ─── ATELIER ─────────────────────────────────────────────────────
function refreshAtelierPreview() {
  const top   = document.getElementById('apTop');
  const skirt = document.getElementById('apSkirt');
  const spec  = document.getElementById('apSpec');

  // Map silhouette to shapes
  const silShapes = {
    'A-line':   { top:'polygon(12% 0%,88% 0%,100% 100%,0% 100%)', skirt:'polygon(5% 0%,95% 0%,100% 100%,0% 100%)', sw:160 },
    'Straight': { top:'polygon(10% 0%,90% 0%,90% 100%,10% 100%)', skirt:'polygon(8% 0%,92% 0%,90% 100%,10% 100%)', sw:130 },
    'Fitted':   { top:'polygon(12% 0%,88% 0%,80% 100%,20% 100%)', skirt:'polygon(20% 0%,80% 0%,90% 100%,10% 100%)', sw:125 },
    'Flared':   { top:'polygon(15% 0%,85% 0%,92% 100%,8% 100%)',  skirt:'polygon(2% 0%,98% 0%,100% 100%,0% 100%)',  sw:170 },
    'Draped':   { top:'polygon(8% 0%,92% 0%,96% 50%,100% 100%,0% 100%,4% 50%)', skirt:'polygon(5% 0%,95% 0%,98% 100%,2% 100%)', sw:150 },
  };
  const shape = silShapes[atelierState.silhouette] || silShapes['A-line'];
  top.style.background     = atelierState.color;
  top.style.clipPath       = shape.top;
  skirt.style.background   = atelierState.color;
  skirt.style.clipPath     = shape.skirt;
  skirt.style.width        = shape.sw + 'px';

  spec.textContent = `${atelierState.silhouette} · ${atelierState.neckline} · ${atelierState.fabricName}`;
}

// Silhouette buttons
document.getElementById('silOptions').querySelectorAll('.sil-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#silOptions .sil-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    atelierState.silhouette = btn.dataset.sil;
    refreshAtelierPreview();
  });
});

// Neckline buttons
document.querySelectorAll('[data-neck]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-neck]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    atelierState.neckline = btn.dataset.neck;
    refreshAtelierPreview();
  });
});

// Fabric swatches
document.getElementById('fabricSwatches').querySelectorAll('.swatch').forEach(sw => {
  sw.addEventListener('click', () => {
    document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    sw.classList.add('active');
    atelierState.color      = sw.dataset.color;
    atelierState.fabric     = sw.dataset.fabric;
    atelierState.fabricName = sw.title;
    refreshAtelierPreview();
  });
});

// Save design
document.getElementById('saveDesignBtn').addEventListener('click', () => {
  const name = document.getElementById('designNameInput').value.trim() || 'Untitled Design';
  designs.push({
    id: ++nextId, name, category: 'dress',
    fabric: atelierState.fabric, color: atelierState.color,
    season: 'SS 2026', fav: false,
    silhouette: atelierState.silhouette, neckline: atelierState.neckline,
  });
  showToast('✓ Saved to Collection');
  document.getElementById('designNameInput').value = '';
  document.getElementById('apName').textContent = 'Untitled Design';
});

// Live name update
document.getElementById('designNameInput').addEventListener('input', e => {
  document.getElementById('apName').textContent = e.target.value || 'Untitled Design';
});

// ─── MOODBOARD ───────────────────────────────────────────────────
let moods = [...MOODS];

function renderMoodboard() {
  const grid = document.getElementById('moodboardGrid');
  grid.innerHTML = moods.map((m, i) => `
    <div class="mood-item ${m.cls}" style="animation-delay:${i * .05}s" data-mid="${m.id}">
      <div class="mood-inner" style="background:${m.bg}">
        <span style="color:rgba(255,255,255,.5);font-size:1.8rem;">${m.text}</span>
        <span class="mood-label">${m.label}</span>
        <button class="mood-delete" data-mdel="${m.id}">✕</button>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('[data-mdel]').forEach(btn => {
    btn.addEventListener('click', () => {
      moods = moods.filter(x => x.id != btn.dataset.mdel);
      renderMoodboard();
      showToast('Removed from moodboard');
    });
  });
}

const PALETTE_COMBOS = [
  ['#B8860B','#3D2B1F'], ['#C9B8D8','#2C2C2C'], ['#1A3A4A','#D4C5A9'],
  ['#8B1A1A','#F5E6D0'], ['#E8F4F0','#6B5D52'], ['#4A3728','#D4C5A9'],
];
const MOOD_LABELS = ['Chromatic','Fluidity','Void','Ethereal','Edge','Grain','Contrast','Raw','Glow','Depth'];

document.getElementById('addMoodItem').addEventListener('click', () => {
  const combo = PALETTE_COMBOS[Math.floor(Math.random() * PALETTE_COMBOS.length)];
  const angle = Math.floor(Math.random() * 360);
  const cls = Math.random() > .7 ? 'tall' : Math.random() > .6 ? 'wide' : '';
  moods.push({
    id: Date.now(),
    label: MOOD_LABELS[Math.floor(Math.random() * MOOD_LABELS.length)],
    bg: `linear-gradient(${angle}deg, ${combo[0]}, ${combo[1]})`,
    cls, text: '',
  });
  renderMoodboard();
  showToast('Added to moodboard');
});

// ─── LOOKBOOK ────────────────────────────────────────────────────
function renderLookbook() {
  const strip = document.getElementById('lookbookStrip');
  strip.innerHTML = LOOKS.map(l => `
    <div class="look-item">
      <div class="look-bg" style="background:${l.bg}">
        <span style="font-family:'Bebas Neue';font-size:8rem;color:rgba(255,255,255,.06);user-select:none;">${l.num}</span>
      </div>
      <div class="look-overlay">
        <span class="look-num">${l.num}</span>
        <p class="look-title">${l.title}</p>
        <p class="look-sub">${l.sub}</p>
      </div>
    </div>
  `).join('');
}

// ─── MODAL ───────────────────────────────────────────────────────
document.getElementById('newDesignBtn').addEventListener('click', () => {
  document.getElementById('modalOverlay').classList.add('open');
});
document.getElementById('modalClose').addEventListener('click', () => {
  document.getElementById('modalOverlay').classList.remove('open');
});
document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modalOverlay'))
    document.getElementById('modalOverlay').classList.remove('open');
});
document.getElementById('createDesignConfirm').addEventListener('click', () => {
  const name   = document.getElementById('newDesignName').value.trim() || 'Untitled Design';
  const cat    = document.getElementById('newDesignCat').value.toLowerCase();
  const season = document.getElementById('newDesignSeason').value;
  const colors = ['#F5E6D0','#2C2C2C','#C9B8D8','#1A3A4A','#D4C5A9','#8B1A1A','#E8F4F0'];
  designs.push({
    id: ++nextId, name, category: cat,
    fabric: 'Silk', color: colors[Math.floor(Math.random() * colors.length)],
    season, fav: false, silhouette: 'A-line', neckline: 'V-Neck',
  });
  document.getElementById('modalOverlay').classList.remove('open');
  document.getElementById('newDesignName').value = '';
  renderCollection();
  showSection('collection');
  showToast(`✓ "${name}" created`);
});

// ─── TAGS ────────────────────────────────────────────────────────
document.getElementById('tagAddBtn').addEventListener('click', addTag);
document.getElementById('tagInput').addEventListener('keydown', e => { if (e.key === 'Enter') addTag(); });
function addTag() {
  const input = document.getElementById('tagInput');
  const val   = input.value.trim();
  if (!val) return;
  const span  = document.createElement('span');
  span.className = 'tag';
  span.textContent = val;
  span.addEventListener('click', () => span.remove());
  document.getElementById('tagsList').appendChild(span);
  input.value = '';
}

// ─── TOAST ───────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

// ─── HERO GARMENT ANIMATE ────────────────────────────────────────
(function heroGarmentPulse() {
  const overlay = document.getElementById('garmentOverlay');
  const colors  = ['rgba(245,230,208,.35)', 'rgba(201,184,216,.35)', 'rgba(139,26,26,.25)', 'rgba(26,58,74,.3)'];
  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % colors.length;
    overlay.style.transition = 'background 3s ease';
    overlay.style.background = colors[idx];
  }, 4000);
})();

// ─── INIT ────────────────────────────────────────────────────────
renderCollection();
renderMoodboard();
renderLookbook();
refreshAtelierPreview();
