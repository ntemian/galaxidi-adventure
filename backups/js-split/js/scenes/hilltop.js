// Hilltop scene renderer
function drawHilltopBg() {
  // MI2-grade hilltop palette
  const P = {
    // Sky (6-band dusk/dawn)
    SK1: '#080818', SK2: '#0E1228', SK3: '#141A38', SK4: '#1A2248', SK5: '#222E58', SK6: '#2A3868',
    // Mountains
    MT1: '#0C1428', MT2: '#141E38', MT3: '#1A2848',
    // Sea (4-band)
    SE1: '#0E1E44', SE2: '#142A55', SE3: '#1A3666', SE4: '#224477',
    // Hillside green (6-tone)
    HG1: '#0E1E0A', HG2: '#1A3314', HG3: '#264A1E', HG4: '#326228', HG5: '#3E7A32', HG6: '#4A8A3C',
    // Path/earth (4-tone)
    PT1: '#3A2A14', PT2: '#4A3A22', PT3: '#5A4A30', PT4: '#6A5A3E',
    // Stone (ruins, 6-tone)
    SN1: '#4A4438', SN2: '#5A5448', SN3: '#6A6458', SN4: '#7A7468', SN5: '#8A8478', SN6: '#9A9488',
    // Wood
    WD1: '#2A1E0A', WD2: '#3A2E18', WD3: '#4A3E22', WD4: '#5A4E30',
    // Gold
    GD1: '#8A7022', GD2: '#BBAA33', GD3: '#DDCC44',
    // Flowers
    FL_R: '#883344', FL_Y: '#887722', FL_P: '#553366', FL_O: '#884422', FL_B: '#336666',
    // Sun
    SUN1: '#FFDDAA', SUN2: '#FFEEBB', SUN3: '#FFFFDD',
    OL: '#080808',
  };

  // --- SKY: 6-band dusk ---
  bandedV(0, 0, W, [
    [P.SK1, 15], [P.SK2, 18], [P.SK3, 20], [P.SK4, 22], [P.SK5, 22], [P.SK6, 23]
  ]);
  // Stars (1px dots in dark upper bands)
  [[30,8],[110,5],[180,12],[280,4],[340,10],[450,7],[520,3],[590,11],[70,18],[400,15]].forEach(([sx,sy]) => {
    const twinkle = Math.sin(sx * 0.7 + sy * 1.3) * 0.3 + 0.5;
    _ctx.fillStyle = `rgba(220,220,255,${twinkle})`;
    _ctx.fillRect(sx, sy, 1, 1);
  });

  // --- MOUNTAINS: 2-layer silhouettes with banded peaks ---
  // Far range
  _ctx.fillStyle = P.MT1;
  _ctx.beginPath(); _ctx.moveTo(0, 120);
  [[50, 95], [120, 78], [200, 88], [300, 62], [400, 72], [480, 58], [560, 75], [640, 105]].forEach(([x, y]) => _ctx.lineTo(x, y));
  _ctx.lineTo(640, 120); _ctx.fill();
  // Near range (slightly brighter)
  _ctx.fillStyle = P.MT2;
  _ctx.beginPath(); _ctx.moveTo(0, 120);
  [[80, 108], [160, 92], [260, 100], [380, 80], [500, 88], [600, 98], [640, 110]].forEach(([x, y]) => _ctx.lineTo(x, y));
  _ctx.lineTo(640, 120); _ctx.fill();
  dither(0, 60, W, 60, P.MT2, P.MT1, 7);

  // --- SEA: 4-band ---
  bandedV(0, 120, W, [
    [P.SE4, 10], [P.SE3, 12], [P.SE2, 14], [P.SE1, 14]
  ]);
  // 1px wave highlights
  for (let wx = 0; wx < W; wx += 30) {
    fill(wx, 125, 12, 1, P.SE4);
    fill(wx + 15, 135, 10, 1, P.SE3);
  }

  // --- HILLSIDE: 5-band green with grass texture ---
  bandedV(0, 170, W, [
    [P.HG5, 12], [P.HG4, 18], [P.HG3, 22], [P.HG2, 20], [P.HG1, 13]
  ]);
  dither(0, 170, W, 85, P.HG4, P.HG3, 5);
  // Grass tufts (1px vertical dashes)
  for (let gx = 5; gx < W; gx += 12) {
    const gy = 178 + (gx * 3) % 48;
    _ctx.fillStyle = P.HG6;
    _ctx.fillRect(gx, gy, 1, 3);
    _ctx.fillRect(gx + 2, gy + 1, 1, 2);
  }

  // --- PATH: 3-band earth ---
  bandedV(0, 255, W, [
    [P.PT3, 15], [P.PT2, 25], [P.PT1, 25]
  ]);
  dither(0, 260, W, 60, P.PT2, P.PT1, 4);
  // Path edge stones
  for (let px = 10; px < W; px += 40) {
    fill(px, 254, 8, 3, P.SN2);
    fill(px, 254, 8, 1, P.SN4);
  }

  // --- WILDFLOWERS: 2px pixel clusters with stems ---
  const flowerColors = [P.FL_R, P.FL_Y, P.FL_P, P.FL_O, P.FL_B];
  for (let i = 0; i < 35; i++) {
    const fx = 40 + (i * 19) % 440;
    const fy = 195 + (i * 17) % 55;
    _ctx.fillStyle = flowerColors[i % 5];
    _ctx.fillRect(fx, fy, 2, 2);
    _ctx.fillRect(fx + 1, fy - 1, 1, 1); // petal
    // Stem
    _ctx.fillStyle = P.HG2;
    _ctx.fillRect(fx + 1, fy + 2, 1, 4);
  }

  // --- ANCIENT RUINS: self-shaded columns ---
  [[390, 145], [420, 140], [450, 145], [480, 142]].forEach(([rx, ry]) => {
    // Column: 3-band horizontal self-shading
    fill(rx, ry, 12, 75, P.SN2);
    fill(rx + 1, ry, 3, 75, P.SN4); // left highlight
    fill(rx + 4, ry, 5, 75, P.SN3); // middle
    fill(rx + 9, ry, 2, 75, P.SN1); // right shadow
    // Fluting lines (1px dark vertical)
    fill(rx + 3, ry + 5, 1, 65, P.SN1);
    fill(rx + 7, ry + 5, 1, 65, P.SN1);
    // Capital (top)
    fill(rx - 2, ry - 4, 16, 5, P.SN3);
    fill(rx - 2, ry - 4, 16, 2, P.SN5); // highlight
    fill(rx - 3, ry - 1, 18, 2, P.SN2); // abacus
    // Base
    fill(rx - 2, ry + 73, 16, 4, P.SN3);
    fill(rx - 2, ry + 73, 16, 1, P.SN5);
    // Cracks
    if (rx === 450) {
      fill(rx + 4, ry + 20, 1, 18, P.SN1);
    }
  });
  // Lintel (architrave)
  fill(385, 135, 112, 10, P.SN2);
  fill(386, 135, 110, 3, P.SN5); // top highlight
  fill(386, 142, 110, 2, P.SN1); // bottom shadow
  // Frieze detail (simple meander pattern)
  for (let mx = 388; mx < 494; mx += 12) {
    fill(mx, 137, 6, 2, P.SN4);
    fill(mx + 6, 139, 6, 2, P.SN4);
  }
  // Fallen column: self-shaded horizontal
  fill(420, 220, 60, 10, P.SN2);
  fill(421, 221, 58, 3, P.SN4); // top highlight
  fill(421, 226, 58, 3, P.SN1); // bottom shadow
  // Drum segments
  fill(440, 220, 1, 10, P.SN1);
  fill(460, 220, 1, 10, P.SN1);

  // --- TELESCOPE: self-shaded wood + metal ---
  // Tripod legs
  drawLine(266, 218, 250, 252, P.WD2, 2);
  drawLine(266, 218, 280, 252, P.WD2, 2);
  drawLine(266, 218, 266, 252, P.WD3, 2);
  // Main post
  fill(262, 165, 8, 55, P.WD2);
  fill(263, 166, 2, 53, P.WD4); // highlight
  fill(268, 166, 1, 53, P.WD1); // shadow
  fill(260, 163, 12, 3, P.WD1);
  // Telescope tube (metal)
  fill(254, 160, 22, 8, '#4A4A50');
  fill(255, 161, 20, 2, '#6A6A70'); // highlight
  fill(255, 165, 20, 2, '#3A3A40'); // shadow
  // Lens
  fill(252, 162, 4, 4, '#88BBCC');
  fill(253, 163, 2, 2, '#AADDEE'); // bright center

  // --- GALAXIDI BELOW: tiny self-shaded buildings ---
  [[200, 155], [215, 158], [232, 154], [248, 157], [264, 155]].forEach(([bx, by]) => {
    fill(bx, by, 9, 5, P.SN3);
    fill(bx, by, 9, 1, P.SN5); // roof edge
    fill(bx, by - 2, 9, 2, '#6A2A12'); // terracotta roof
    fill(bx, by - 2, 9, 1, '#8A3A1A'); // roof highlight
    // Tiny window
    fill(bx + 3, by + 2, 2, 2, '#AA8833');
  });
  // Church dome
  _ctx.fillStyle = P.SN5;
  _ctx.beginPath(); _ctx.arc(230, 150, 6, Math.PI, 2 * Math.PI); _ctx.fill();
  _ctx.fillStyle = P.SN3;
  _ctx.beginPath(); _ctx.arc(230, 150, 5, Math.PI, 2 * Math.PI); _ctx.fill();
  // Cross
  fill(229, 143, 2, 6, P.GD2);
  fill(227, 146, 6, 1, P.GD2);
  fill(229, 143, 1, 5, P.GD3); // highlight

  // --- SUN: concentric sharp rectangles (NOT radial gradient) ---
  // Outer halo
  _ctx.fillStyle = 'rgba(255,220,150,0.04)';
  _ctx.fillRect(510, 0, 80, 70);
  _ctx.fillStyle = 'rgba(255,230,170,0.08)';
  _ctx.fillRect(525, 8, 50, 45);
  _ctx.fillStyle = 'rgba(255,240,200,0.15)';
  _ctx.fillRect(535, 15, 30, 30);
  // Sun disc (self-shaded)
  fill(539, 19, 22, 22, P.SUN1);
  fill(540, 20, 20, 20, P.SUN2);
  fill(543, 23, 14, 14, P.SUN3);
}

function drawHilltopFx() {
  const t = state.tick;
  // --- Wind grass: 1px pixel blades swaying ---
  for (let gx = 3; gx < W; gx += 10) {
    const gy = 190 + (gx * 3) % 58;
    const sway = Math.sin(t * 0.02 + gx * 0.08) * 2;
    ctx.fillStyle = `rgba(74,138,60,0.35)`;
    ctx.fillRect(gx + sway, gy - 4, 1, 4);
    ctx.fillRect(gx + sway + 1, gy - 3, 1, 3);
  }
  // --- Birds: simple V-shapes (1px pixel) ---
  for (let i = 0; i < 3; i++) {
    const bx = (t * 0.5 + i * 220) % (W + 100) - 50;
    const by = 30 + i * 20 + Math.sin(t * 0.01 + i * 2) * 8;
    const wing = Math.sin(t * 0.06 + i) > 0 ? 1 : 0;
    ctx.fillStyle = '#222';
    ctx.fillRect(bx - 3, by - wing, 1, 1);
    ctx.fillRect(bx - 2, by - 1, 1, 1);
    ctx.fillRect(bx - 1, by, 1, 1);
    ctx.fillRect(bx, by - 1, 1, 1);
    ctx.fillRect(bx + 1, by - wing, 1, 1);
  }
  // --- Flower sway: 1px pixels shifting ---
  for (let i = 0; i < 10; i++) {
    const fx = 60 + i * 42;
    const fy = 205 + (i * 17) % 35;
    const sway = Math.sin(t * 0.03 + i) * 2;
    ctx.fillStyle = ['#AA4455', '#AA8822', '#7744AA'][i % 3];
    ctx.fillRect(fx + sway, fy, 2, 2);
  }
  // --- Sunlight: sharp rectangular warm zone ---
  const sunF = Math.sin(t * 0.008) * 0.005;
  ctx.fillStyle = `rgba(255,240,200,${0.015 + sunF})`;
  ctx.fillRect(400, 0, 240, 200);
  ctx.fillStyle = `rgba(255,240,200,${0.025 + sunF})`;
  ctx.fillRect(480, 0, 160, 120);
  // --- Sea sparkles: 1px flashing dots ---
  for (let i = 0; i < 8; i++) {
    const sx = 50 + (t * 0.4 + i * 80) % W;
    const sy = 122 + (i * 7) % 26;
    if (Math.sin(t * 0.08 + i * 1.7) > 0.7) {
      ctx.fillStyle = 'rgba(200,220,255,0.25)';
      ctx.fillRect(sx, sy, 1, 1);
    }
  }
  // --- Star twinkle (top sky only) ---
  for (let i = 0; i < 5; i++) {
    const sx = 40 + (i * 131) % 560;
    const sy = 3 + (i * 7) % 20;
    const tw = Math.sin(t * 0.05 + i * 2.3);
    if (tw > 0.6) {
      ctx.fillStyle = `rgba(220,220,255,${(tw - 0.6) * 0.5})`;
      ctx.fillRect(sx, sy, 1, 1);
    }
  }
}

