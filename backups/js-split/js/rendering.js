// ============================================================
// RENDERING — Canvas primitives, gradients, banding, drawTree
// ============================================================

// --- OFFSCREEN BG ---
const bgCanvas = document.createElement('canvas');
bgCanvas.width = W; bgCanvas.height = H;
const bgCtx = bgCanvas.getContext('2d');
let _ctx = ctx;
let bgHash = '';

function getBgHash() {
  const f = state.flags;
  return `${state.scene}|${JSON.stringify(f)}`;
}
function renderBackgroundIfDirty() {
  const hash = getBgHash();
  if (hash === bgHash) return;
  bgHash = hash;
  const img = SCENE_IMAGES[state.scene];
  if (img && img.complete) {
    bgCtx.drawImage(img, 0, 0, W, H);
  } else {
    // Fallback: draw original pixel art if image not loaded
    _ctx = bgCtx;
    _ctx.clearRect(0, 0, W, H);
    switch (state.scene) {
      case 'house': drawHouseBg(); break;
      case 'port': drawPortBg(); break;
      case 'beach': drawBeachBg(); break;
      case 'town': drawTownBg(); break;
      case 'cave': drawCaveBg(); break;
      case 'church': drawChurchBg(); break;
      case 'hilltop': drawHilltopBg(); break;
      case 'boat': drawBoatBg(); break;
    }
    _ctx = ctx;
  }
}
function invalidateBg() { bgHash = ''; }

// --- EXTENDED PALETTE (Monkey Island NIGHT style — dark, moody) ---
const C = {
  // Sky — NIGHT (deep dark blues like MI)
  SKY_TOP: '#050818', SKY_MID: '#0A1430', SKY_LOW: '#152040', SKY_HORIZON: '#1A3050',
  // Sea — DARK NIGHT water
  SEA_DEEP: '#040C20', SEA_MID: '#081830', SEA_LIGHT: '#0C2444', SEA_FOAM: '#2A5577',
  SEA_HIGHLIGHT: '#4488AA',
  // Sand — night muted
  SAND_DARK: '#5A4830', SAND_MID: '#6A5838', SAND_LIGHT: '#7A6848', SAND_WET: '#4A3828',
  // Stone — darker night
  STONE_DARK: '#2A2218', STONE_MID: '#3A3228', STONE_LIGHT: '#4A4238', STONE_BRIGHT: '#5A5248',
  // Wood — dark night wood
  WOOD_DARK: '#1A1008', WOOD_MID: '#2A1A10', WOOD_LIGHT: '#3A2A18', WOOD_BRIGHT: '#4A3A28',
  // Foliage — dark night
  LEAF_DARK: '#0A1A0A', LEAF_MID: '#122812', LEAF_LIGHT: '#1A3A1A', LEAF_BRIGHT: '#224422',
  // Building — night, dark with warm window glow
  WALL_CREAM: '#3A3428', WALL_SHADOW: '#2A2418', WALL_WHITE: '#4A4438',
  ROOF_RED: '#3A1810', ROOF_DARK: '#2A1008', ROOF_TILE: '#4A2018',
  // Cave
  CAVE_DARK: '#0A0808', CAVE_MID: '#2A2018', CAVE_LIGHT: '#4A3828', CAVE_WARM: '#5A4830',
  // Misc
  GOLD: '#DDAA33', GOLD_BRIGHT: '#FFCC44', GOLD_DARK: '#AA7711',
  BLACK: '#000000', WHITE: '#FFFFFF',
  RED: '#CC3333', BLUE: '#3366BB', GREEN: '#33AA44',
  YELLOW: '#FFDD44', ORANGE: '#DD8833', CYAN: '#55BBCC',
  SKIN: '#DDAA88', SKIN_SHADOW: '#BB8866',
  WATER_GLOW: '#4499BB',
};

// --- GRADIENT FILL (smooth, Monkey Island style) ---
function gradientV(x, y, w, h, colors) {
  const grad = _ctx.createLinearGradient(x, y, x, y+h);
  colors.forEach(([stop, color]) => grad.addColorStop(stop, color));
  _ctx.fillStyle = grad;
  _ctx.fillRect(x, y, w, h);
}
function gradientH(x, y, w, h, colors) {
  const grad = _ctx.createLinearGradient(x, y, x+w, y);
  colors.forEach(([stop, color]) => grad.addColorStop(stop, color));
  _ctx.fillStyle = grad;
  _ctx.fillRect(x, y, w, h);
}

// --- BANDED GRADIENT (MI-style stepped color bands with dithered transitions) ---
function bandedV(x, y, w, bands, ditherBetween) {
  if (ditherBetween === undefined) ditherBetween = true;
  let cy = y;
  for (let i = 0; i < bands.length; i++) {
    const [color, h] = bands[i];
    fill(x, cy, w, h, color);
    if (ditherBetween && i < bands.length - 1) {
      const nextColor = bands[i+1][0];
      const ditherH = Math.min(3, Math.floor(h/3));
      if (ditherH > 0) dither(x, cy + h - ditherH, w, ditherH * 2, color, nextColor, 0);
    }
    cy += h;
  }
}
function bandedH(x, y, h, bands, ditherBetween) {
  if (ditherBetween === undefined) ditherBetween = true;
  let cx = x;
  for (let i = 0; i < bands.length; i++) {
    const [color, w] = bands[i];
    fill(cx, y, w, h, color);
    if (ditherBetween && i < bands.length - 1) {
      const nextColor = bands[i+1][0];
      const ditherW = Math.min(3, Math.floor(w/3));
      if (ditherW > 0) dither(cx + w - ditherW, y, ditherW * 2, h, color, nextColor, 0);
    }
    cx += w;
  }
}

// --- OUTLINE helper (1px dark outline around filled rect) ---
function outline(x, y, w, h, fillColor, outlineColor) {
  fill(x, y, w, h, outlineColor || '#1A0A00');
  fill(x+1, y+1, w-2, h-2, fillColor);
}

// --- DITHERING (used sparingly for texture) ---
const rgbCache = {};
function getRgb(hex) {
  if (rgbCache[hex]) return rgbCache[hex];
  const rgb = [parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)];
  rgbCache[hex] = rgb;
  return rgb;
}
function dither(x, y, w, h, c1, c2, pattern) {
  x=Math.round(x); y=Math.round(y); w=Math.round(w); h=Math.round(h);
  if (w<=0||h<=0) return;
  const imgData = _ctx.createImageData(w, h);
  const data = imgData.data;
  const rgb1=getRgb(c1), rgb2=getRgb(c2);
  for (let py=0; py<h; py++) {
    for (let px=0; px<w; px++) {
      let useC2;
      const ax=x+px, ay=y+py;
      switch(pattern||0) {
        case 0: useC2=(ax+ay)&1; break;
        case 1: useC2=!(ax&1)&&!(ay&1); break;
        case 2: useC2=(ax&1)||(ay&1); break;
        case 3: useC2=!(ay&1); break;
        case 4: useC2=!(ax&1); break;
        case 5: useC2=(ax+ay)%3===0; break;
        case 6: useC2=(ax+ay)%4===0; break;
      }
      const c=useC2?rgb2:rgb1;
      const i=(py*w+px)<<2;
      data[i]=c[0]; data[i|1]=c[1]; data[i|2]=c[2]; data[i|3]=255;
    }
  }
  _ctx.putImageData(imgData, x, y);
}

function fill(x,y,w,h,c) {
  _ctx.fillStyle=c;
  _ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));
}
function drawLine(x0,y0,x1,y1,c,lw) {
  _ctx.strokeStyle=c; _ctx.lineWidth=lw||1;
  _ctx.beginPath();
  _ctx.moveTo(Math.round(x0)+0.5,Math.round(y0)+0.5);
  _ctx.lineTo(Math.round(x1)+0.5,Math.round(y1)+0.5);
  _ctx.stroke();
}
function drawEllipse(cx,cy,rx,ry,c) {
  _ctx.fillStyle=c;
  _ctx.beginPath();
  _ctx.ellipse(Math.round(cx),Math.round(cy),rx,ry,0,0,Math.PI*2);
  _ctx.fill();
}
function drawArc(cx,cy,r,a0,a1,c) {
  _ctx.fillStyle=c;
  _ctx.beginPath();
  _ctx.arc(cx,cy,r,a0,a1);
  _ctx.fill();
}

// --- TREE DRAWING (#2 enhanced — animated sway) ---
function drawTree(x, y, size, animated) {
  const s = size || 1;
  const t = state ? state.tick : 0;
  // Trunk — with texture (#8)
  fill(x-3*s, y-20*s, 6*s, 22*s, C.WOOD_MID);
  fill(x-2*s, y-20*s, 2*s, 22*s, C.WOOD_LIGHT);
  // Bark texture
  for (let by = 0; by < 20*s; by += 4*s) {
    fill(x-3*s, y-20*s+by, 1, 2*s, C.WOOD_DARK);
  }
  // Foliage layers — with sway if animated
  const sway = animated ? Math.sin(t*0.015 + x*0.01) * 3 * s : 0;
  drawEllipse(x+sway, y-30*s, 18*s, 14*s, C.LEAF_DARK);
  drawEllipse(x-4*s+sway*0.8, y-34*s, 14*s, 12*s, C.LEAF_MID);
  drawEllipse(x+3*s+sway*1.2, y-32*s, 12*s, 10*s, C.LEAF_LIGHT);
  drawEllipse(x-2*s+sway*0.6, y-38*s, 10*s, 8*s, C.LEAF_MID);
  // Highlights
  fill(x+2*s+sway, y-40*s, 4*s, 3*s, C.LEAF_BRIGHT);
  fill(x-6*s+sway*0.5, y-30*s, 3*s, 3*s, C.LEAF_BRIGHT);
  // Shadow under tree
  if (animated) {
    _ctx.fillStyle = 'rgba(0,0,0,0.08)';
    _ctx.beginPath(); _ctx.ellipse(x, y+2, 20*s, 4*s, 0, 0, Math.PI*2); _ctx.fill();
  }
}
