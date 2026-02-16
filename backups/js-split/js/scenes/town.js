// Town scene renderer
function drawTownBg() {
  // MI2-grade town square palette
  const P = {
    // Sky (narrow strip)
    SK1: '#0E1830', SK2: '#142040', SK3: '#1A2850',
    // Plaster walls (8-tone ramp warm cream)
    WL1: '#2A2018', WL2: '#3A3020', WL3: '#4A3C2A', WL4: '#5A4C38',
    WL5: '#6A5C48', WL6: '#7A6C58', WL7: '#8A7C68', WL8: '#9A8C78',
    // White church walls
    CW1: '#5A5A5A', CW2: '#7A7A7A', CW3: '#9A9A9A', CW4: '#BABABA', CW5: '#D0D0D0',
    // Roof terracotta
    RF1: '#3A1A0A', RF2: '#5A2A12', RF3: '#7A3A1A', RF4: '#8A4A22',
    // Cobblestones (6-tone)
    CB1: '#1A1408', CB2: '#2A2418', CB3: '#3A3428', CB4: '#4A4438',
    CB5: '#5A5448', CB6: '#3A3020',
    // Wood
    WD1: '#2A1A0A', WD2: '#3A2A14', WD3: '#4A3A1E', WD4: '#5A4A28',
    // Shutters (green, 3-tone)
    SH1: '#0A2A14', SH2: '#1A3A22', SH3: '#2A4A30',
    // Gold
    GD1: '#6A5011', GD2: '#8A7022', GD3: '#BBAA33', GD4: '#DDCC44',
    // Bougainvillea
    BV1: '#6A1838', BV2: '#8A2848', BV3: '#AA3858', BV4: '#CC4878',
    // Fountain stone
    FN1: '#6A7A88', FN2: '#8A9AA8', FN3: '#AABBCC', FN4: '#BBCCDD',
    // Cat orange
    CT1: '#6A3A0A', CT2: '#8A5A1A', CT3: '#AA7A2A', CT4: '#CC9A3A',
    // Misc
    OL: '#0A0804', BLACK: '#080808',
  };

  // --- SKY: 3 narrow bands ---
  bandedV(0, 0, W, [[P.SK1, 8], [P.SK2, 10], [P.SK3, 12]]);

  // --- LEFT BUILDING: 3-band self-shaded wall ---
  bandedH(0, 20, 220, [[P.WL3, 15], [P.WL5, 40], [P.WL6, 30], [P.WL5, 10], [P.WL3, 10]]);
  // Plaster texture
  dither(0, 20, 105, 220, P.WL5, P.WL4, 7);
  // Roof: 3-band terracotta with tile lines
  bandedV(0, 12, 108, [[P.RF3, 3], [P.RF2, 3], [P.RF1, 3]]);
  for (let tx = 2; tx < 108; tx += 8) {
    fill(tx, 12, 7, 2, P.RF4); // highlight tile tops
  }
  // Windows with shutters — self-shaded
  [[10,45,28,35],[10,110,28,35],[60,60,28,35]].forEach(([wx,wy,ww,wh]) => {
    // Window recess
    fill(wx, wy, ww, wh, P.WL2);
    // Warm interior glow (banded, not gradient)
    bandedV(wx + 1, wy + 1, ww - 2, [['#AA8833', 10], ['#886622', wh - 12]]);
    // Mullion
    fill(wx + 12, wy, 3, wh, P.WL4);
    // Sill (1px highlight)
    fill(wx, wy + wh - 2, ww, 2, P.WL7);
    // Lintel
    fill(wx - 1, wy - 3, ww + 2, 3, P.WL3);
    // Shutters — self-shaded green panels
    // Left shutter
    fill(wx - 6, wy, 7, wh, P.SH1);
    fill(wx - 5, wy + 1, 5, wh - 2, P.SH2);
    fill(wx - 4, wy + 2, 1, wh - 4, P.SH3); // highlight edge
    // Right shutter
    fill(wx + ww - 1, wy, 7, wh, P.SH1);
    fill(wx + ww, wy + 1, 5, wh - 2, P.SH2);
    fill(wx + ww + 1, wy + 2, 1, wh - 4, P.SH3);
  });

  // --- RIGHT BUILDING: cool white-blue tint ---
  bandedH(520, 35, 205, [[P.WL3, 15], [P.WL6, 50], [P.WL7, 35], [P.WL5, 15], [P.WL3, 5]]);
  dither(520, 35, 120, 205, P.WL6, P.WL5, 7);
  bandedV(520, 27, 125, [[P.RF3, 3], [P.RF2, 3], [P.RF1, 3]]);
  for (let tx = 522; tx < 645; tx += 8) {
    fill(tx, 27, 7, 2, P.RF4);
  }
  [[540,65,26,30],[540,135,26,30],[590,75,26,30]].forEach(([wx,wy,ww,wh]) => {
    fill(wx, wy, ww, wh, P.WL2);
    bandedV(wx + 1, wy + 1, ww - 2, [['#BB9933', 8], ['#997722', wh - 10]]);
    fill(wx - 5, wy, 6, wh, P.SH1);
    fill(wx - 4, wy + 1, 4, wh - 2, P.SH2);
    fill(wx + ww - 1, wy, 6, wh, P.SH1);
    fill(wx + ww, wy + 1, 4, wh - 2, P.SH2);
  });

  // --- BOUGAINVILLEA: pixel clusters, no ellipses ---
  const bvClumps = [[90,78],[96,86],[88,96],[102,74],[84,90],[98,100],[94,72]];
  bvClumps.forEach(([bx,by], i) => {
    const c = [P.BV1, P.BV2, P.BV3, P.BV4][i % 4];
    // Irregular pixel cluster (5-8px)
    fill(bx, by, 8, 5, c);
    fill(bx + 2, by - 2, 6, 3, P.BV4);
    fill(bx - 1, by + 3, 4, 2, P.BV2);
  });
  // Vine stem
  fill(99, 95, 2, 55, '#1A3318');
  fill(97, 100, 2, 40, '#1A3318');

  // --- CHURCH: center, self-shaded white walls ---
  // Walls: 4 vertical zones (shadow-light-light-shadow)
  bandedH(210, 25, 210, [[P.CW1, 15], [P.CW3, 30], [P.CW4, 120], [P.CW3, 30], [P.CW1, 15]]);
  dither(210, 25, 220, 210, P.CW4, P.CW3, 8);
  // Dome: 4-band concentric arcs
  const domeColors = [P.CW1, '#5A2A12', '#7A3A1A', '#6A3018'];
  for (let di = 0; di < domeColors.length; di++) {
    _ctx.fillStyle = domeColors[di];
    _ctx.beginPath(); _ctx.arc(320, 28, 55 - di * 3, Math.PI, 2 * Math.PI); _ctx.fill();
  }
  // Dome highlight
  fill(290, 0, 40, 4, P.RF4);
  // Cross (self-shaded gold)
  fill(317, -30, 6, 25, P.GD2);
  fill(311, -22, 18, 5, P.GD2);
  fill(318, -29, 4, 23, P.GD3);
  fill(312, -21, 16, 3, P.GD3);
  fill(319, -28, 2, 4, P.GD4); // bright tip
  // Church door — self-shaded arched
  fill(288, 140, 64, 95, P.WD1);
  // Door panels: 3 vertical bands
  bandedH(290, 145, 88, [[P.WD2, 8], [P.WD3, 20], [P.WD4, 4], [P.WD3, 20], [P.WD2, 8]]);
  // Arch
  _ctx.fillStyle = P.WD1;
  _ctx.beginPath(); _ctx.arc(320, 148, 31, Math.PI, 2 * Math.PI); _ctx.fill();
  _ctx.fillStyle = P.WD3;
  _ctx.beginPath(); _ctx.arc(320, 148, 29, Math.PI, 2 * Math.PI); _ctx.fill();
  _ctx.fillStyle = P.WD4;
  _ctx.beginPath(); _ctx.arc(320, 148, 26, Math.PI, 2 * Math.PI); _ctx.fill();
  fill(318, 142, 4, 90, P.WD1); // center line
  // Door hardware
  fill(310, 185, 3, 3, P.GD2);
  fill(327, 185, 3, 3, P.GD2);
  // Rose windows: segmented panes with lead
  [[245,70],[380,70]].forEach(([wx,wy]) => {
    // Stone frame
    _ctx.fillStyle = P.CW1;
    _ctx.beginPath(); _ctx.arc(wx, wy, 18, 0, Math.PI * 2); _ctx.fill();
    // Pane segments (4 solid color quadrants)
    const pColors = ['#3366AA', '#CC8822', '#AA2233', '#226633'];
    for (let qi = 0; qi < 4; qi++) {
      _ctx.fillStyle = pColors[qi];
      _ctx.beginPath();
      _ctx.moveTo(wx, wy);
      _ctx.arc(wx, wy, 15, qi * Math.PI / 2, (qi + 1) * Math.PI / 2);
      _ctx.fill();
    }
    // Lead lines (cross pattern)
    drawLine(wx - 15, wy, wx + 15, wy, P.OL, 2);
    drawLine(wx, wy - 15, wx, wy + 15, P.OL, 2);
    // Ring frame
    _ctx.strokeStyle = P.CW1; _ctx.lineWidth = 2;
    _ctx.beginPath(); _ctx.arc(wx, wy, 15, 0, Math.PI * 2); _ctx.stroke();
  });
  // Bell tower
  fill(300, -5, 40, 35, P.CW3);
  fill(301, -4, 38, 33, P.CW4);
  fill(305, 0, 30, 25, P.OL);
  // Bell arches (two openings)
  fill(307, 2, 11, 18, P.SK2);
  fill(322, 2, 11, 18, P.SK2);
  // Bells
  fill(310, 5, 6, 10, P.GD2);
  fill(311, 6, 4, 8, P.GD3);
  fill(325, 5, 6, 10, P.GD2);
  fill(326, 6, 4, 8, P.GD3);

  // --- COBBLESTONES: self-shaded individual stones ---
  fill(0, 240, W, 80, P.CB2);
  for (let sy = 241; sy < H; sy += 11) {
    for (let sx = 0; sx < W; sx += 18) {
      const off = (Math.floor(sy / 11) % 2) * 9;
      const v = ((sx * 7 + sy * 13) % 17) - 8; // pseudo-random variation
      // Stone body (3-tone self-shaded)
      const x = sx + off;
      fill(x, sy, 16, 9, P.CB3);
      fill(x + 1, sy + 1, 14, 7, `rgb(${58+v},${52+v},${42+v})`);
      fill(x + 1, sy + 1, 14, 2, `rgb(${68+v},${62+v},${52+v})`); // top highlight
      fill(x + 1, sy + 6, 14, 2, P.CB1); // bottom shadow
      // Mortar gap (dark line between stones)
      fill(x - 1, sy, 1, 9, P.CB1);
    }
    // Horizontal mortar line
    fill(0, sy - 1, W, 1, P.CB1);
  }

  // --- STONE CHEST ---
  if (!state.flags.chestOpen) {
    // Chest body: self-shaded stone
    fill(58, 197, 90, 45, P.CB1);
    bandedV(60, 199, 86, [[P.CB4, 8], [P.CB3, 20], [P.CB2, 11]]);
    // Lid highlight
    fill(60, 197, 86, 3, P.CB5);
    // Iron bands
    fill(60, 210, 86, 2, '#3A3A44');
    fill(60, 225, 86, 2, '#3A3A44');
    // Shell lock: pixel art
    fill(100, 215, 8, 8, P.GD1);
    fill(101, 216, 6, 6, P.GD2);
    fill(102, 217, 4, 4, P.GD3);
    fill(103, 219, 2, 2, P.OL); // keyhole
  } else {
    // Open lid
    fill(58, 186, 90, 14, P.CB4);
    fill(59, 187, 88, 12, P.CB3);
    // Open chest interior
    fill(58, 200, 90, 42, P.CB1);
    bandedV(60, 202, 86, [['#2A1E10', 12], ['#221A0C', 14], ['#1A1408', 12]]);
    if (!state.flags.mapTaken) {
      // Rolled map
      fill(80, 210, 22, 14, '#CCBB77');
      fill(81, 211, 20, 12, '#DDCC88');
      fill(81, 211, 20, 3, '#EEDD99'); // highlight
      // Seal
      fill(88, 218, 5, 4, '#882222');
    }
  }

  // --- FOUNTAIN: self-shaded stone tiers ---
  // Base basin
  fill(470, 195, 68, 40, P.FN1);
  fill(472, 197, 64, 36, P.FN2);
  fill(472, 197, 64, 4, P.FN3); // rim highlight
  fill(472, 229, 64, 4, P.FN1); // shadow bottom
  // Middle tier
  fill(478, 185, 52, 12, P.FN2);
  fill(479, 186, 50, 10, P.FN3);
  fill(479, 186, 50, 2, P.FN4);
  // Top spout column
  fill(497, 170, 14, 16, P.FN2);
  fill(498, 171, 12, 14, P.FN3);
  fill(498, 171, 2, 14, P.FN4); // left highlight
  // Spout cap
  fill(495, 167, 18, 4, P.FN2);
  fill(496, 167, 16, 2, P.FN4);
  // Water in basin: 2-band
  bandedV(474, 208, 60, [['#2A5578', 8], ['#1A4568', 8]]);
  // Water highlight pixels
  fill(480, 210, 8, 1, '#5599BB');
  fill(510, 212, 6, 1, '#5599BB');

  // --- CAT: pixel art, no ellipses ---
  // Shadow
  fill(370, 234, 28, 3, P.CB1);
  dither(370, 234, 28, 3, P.CB1, P.CB2, 0);
  // Body
  fill(378, 224, 18, 10, P.CT2);
  fill(379, 225, 16, 8, P.CT3);
  fill(379, 225, 16, 2, P.CT4); // top highlight
  // Head
  fill(369, 220, 12, 10, P.CT2);
  fill(370, 221, 10, 8, P.CT3);
  // Ears (pixel triangles)
  fill(369, 217, 3, 4, P.CT3);
  fill(370, 218, 1, 2, '#CC8866'); // inner ear
  fill(377, 217, 3, 4, P.CT3);
  fill(378, 218, 1, 2, '#CC8866');
  // Eyes
  fill(371, 223, 2, 2, '#44AA44');
  fill(376, 223, 2, 2, '#44AA44');
  fill(372, 223, 1, 2, P.BLACK);
  fill(377, 223, 1, 2, P.BLACK);
  // Nose
  fill(374, 226, 1, 1, '#CC7766');
  // Whiskers: 1px lines
  drawLine(367, 225, 360, 224, '#AAA', 1);
  drawLine(367, 226, 359, 227, '#AAA', 1);
  drawLine(381, 225, 388, 224, '#AAA', 1);
  drawLine(381, 226, 389, 227, '#AAA', 1);
  // Tail
  fill(396, 222, 2, 3, P.CT3);
  fill(398, 219, 2, 4, P.CT3);
  fill(400, 215, 2, 5, P.CT2);
  fill(402, 212, 2, 4, P.CT2);
  fill(403, 210, 2, 3, P.CT1); // tip darker

  // --- PATH TO HILLTOP ---
  bandedV(610, 190, 30, [[P.CB4, 6], [P.CB3, 8], [P.CB2, 6]]);
  fill(615, 185, 25, 6, P.CB3);
  // Arrow sign: self-shaded wood
  fill(625, 176, 4, 16, P.WD2);
  fill(626, 177, 2, 14, P.WD3);
  fill(616, 173, 20, 8, P.WD3);
  fill(617, 174, 18, 6, P.WD4);
  fill(617, 174, 18, 1, '#6A5A38'); // highlight
  _ctx.fillStyle = '#EEDDCC'; _ctx.font = '5px sans-serif'; _ctx.textAlign = 'center';
  _ctx.fillText('ΛΟΦΟΣ', 627, 179);
  _ctx.textAlign = 'left';

  // --- LAMP POST (new detail) ---
  fill(165, 170, 3, 70, '#3A3A44');
  fill(166, 171, 1, 68, '#5A5A66'); // iron highlight
  fill(158, 167, 17, 5, '#3A3A44');
  fill(159, 163, 15, 5, '#2A2A34');
  // Glass lamp
  fill(162, 155, 9, 9, '#4A4A22');
  fill(163, 156, 7, 7, '#6A6A33');
}

function drawTownFx() {
  const t = state.tick;
  // --- Window glow: sharp rectangular pools (MI2 style) ---
  const glow = 0.5 + Math.sin(t * 0.02) * 0.08;
  // Left building windows
  [[10,45,28,35],[10,110,28,35],[60,60,28,35]].forEach(([wx,wy,ww,wh]) => {
    // Inner glow
    ctx.fillStyle = `rgba(255,200,80,${glow * 0.5})`;
    ctx.fillRect(wx + 1, wy + 1, ww - 2, wh - 2);
    // Sharp rectangular light spill below (NOT radial)
    ctx.fillStyle = `rgba(255,180,60,${glow * 0.06})`;
    ctx.fillRect(wx - 8, wy + wh, ww + 16, 25);
    ctx.fillStyle = `rgba(255,180,60,${glow * 0.03})`;
    ctx.fillRect(wx - 15, wy + wh + 25, ww + 30, 15);
  });
  // Right building windows
  [[540,65,26,30],[540,135,26,30],[590,75,26,30]].forEach(([wx,wy,ww,wh]) => {
    ctx.fillStyle = `rgba(255,210,100,${glow * 0.45})`;
    ctx.fillRect(wx + 1, wy + 1, ww - 2, wh - 2);
    ctx.fillStyle = `rgba(255,180,60,${glow * 0.05})`;
    ctx.fillRect(wx - 6, wy + wh, ww + 12, 20);
  });

  // --- Lamp post glow: sharp 3-layer pool ---
  const lampF = Math.sin(t * 0.09) * 0.01;
  ctx.fillStyle = `rgba(255,200,100,${0.04 + lampF})`;
  ctx.fillRect(148, 150, 38, 90);
  ctx.fillStyle = `rgba(255,200,100,${0.08 + lampF})`;
  ctx.fillRect(155, 155, 24, 20);
  ctx.fillStyle = `rgba(255,220,130,${0.12 + lampF})`;
  ctx.fillRect(160, 157, 14, 10);

  // --- Fountain water: 1px pixel drops falling ---
  for (let d = 0; d < 6; d++) {
    const cycle = (t * 0.8 + d * 20) % 30;
    const dx = 502 + Math.sin(d * 2.1) * 6;
    const dy = 168 + cycle;
    if (dy < 208) {
      ctx.fillStyle = `rgba(150,210,240,${0.3 - cycle * 0.008})`;
      ctx.fillRect(dx, dy, 1, 2);
    }
  }
  // Basin ripples: 1px highlights
  for (let rx = 476; rx < 530; rx += 7) {
    const shimmer = Math.sin(t * 0.04 + rx * 0.12);
    if (shimmer > 0.3) {
      ctx.fillStyle = `rgba(140,200,230,${(shimmer - 0.3) * 0.3})`;
      ctx.fillRect(rx, 210 + Math.sin(t * 0.03 + rx) * 1, 5, 1);
    }
  }

  // --- Cat tail animation (pixel segments) ---
  const tailSway = Math.sin(t * 0.04) * 3;
  ctx.fillStyle = '#AA7A2A';
  ctx.fillRect(396, 222 + tailSway * 0.2, 2, 3);
  ctx.fillRect(398, 219 + tailSway * 0.4, 2, 4);
  ctx.fillRect(400, 215 + tailSway * 0.6, 2, 5);
  ctx.fillRect(402, 212 + tailSway * 0.8, 2, 4);
  ctx.fillRect(403, 210 + tailSway, 2, 3);
  // Cat blink
  if (t % 200 > 195) {
    ctx.fillStyle = '#AA7A2A';
    ctx.fillRect(371, 223, 2, 2);
    ctx.fillRect(376, 223, 2, 2);
  }

  // --- Church bell sway ---
  const bellSwing = Math.sin(t * 0.015) * 2;
  ctx.fillStyle = '#8A7022';
  ctx.fillRect(309 + bellSwing, 6, 7, 9);
  ctx.fillStyle = '#BBAA33';
  ctx.fillRect(310 + bellSwing, 7, 5, 7);

  // --- Pigeons: 1px pixel birds on church ---
  if (Math.sin(t * 0.005) > 0.85) {
    ctx.fillStyle = '#BBBBBB';
    ctx.fillRect(250 + Math.sin(t * 0.02) * 3, 22, 2, 2);
    ctx.fillRect(272, 24, 2, 2);
  }

  // --- Cobblestone moonlight shimmer ---
  for (let sx = 50; sx < 600; sx += 35) {
    const s = Math.sin(t * 0.008 + sx * 0.05);
    if (s > 0.6) {
      ctx.fillStyle = `rgba(180,190,210,${(s - 0.6) * 0.06})`;
      ctx.fillRect(sx, 245, 20, 12);
    }
  }
}

