// Boat scene renderer
function drawBoatBg() {
  // MI2-grade boat palette
  const P = {
    // Sky (5-band)
    SK1: '#060812', SK2: '#0C1222', SK3: '#121A32', SK4: '#182242', SK5: '#1E2A50',
    // Sea (6-band deep ocean)
    SE1: '#040A1A', SE2: '#081428', SE3: '#0E1E38', SE4: '#142848', SE5: '#1A3258', SE6: '#224068',
    // Wood deck (8-tone)
    DK1: '#1A1008', DK2: '#2A1E10', DK3: '#3A2A18', DK4: '#4A3A22',
    DK5: '#5A4A2E', DK6: '#6A5A38', DK7: '#7A6A48', DK8: '#8A7A58',
    // Sail (4-tone cream)
    SL1: '#8A8070', SL2: '#AA9A88', SL3: '#CCBBAA', SL4: '#DDCCBB',
    // Rope
    RP1: '#5A4A28', RP2: '#6A5A38',
    // Metal (wheel hub, cleats)
    MT1: '#3A3A40', MT2: '#5A5A60', MT3: '#6A6A70',
    // Net
    NT1: '#5A4422', NT2: '#6A5432', NT3: '#7A6442',
    // Cork
    CK1: '#8A4A0A', CK2: '#AA6A1A', CK3: '#CC8A2A',
    // Mountains
    MN1: '#2A3848', MN2: '#3A4858',
    // Foam
    FM: '#88AACC',
    OL: '#080604',
  };

  // --- SKY: 5-band night ---
  bandedV(0, 0, W, [
    [P.SK1, 18], [P.SK2, 20], [P.SK3, 22], [P.SK4, 20], [P.SK5, 20]
  ]);
  // Stars
  [[40,6],[130,12],[250,4],[370,8],[480,10],[560,5],[90,18],[420,3],[600,14]].forEach(([sx,sy]) => {
    _ctx.fillStyle = `rgba(200,210,240,${0.3 + Math.sin(sx * 0.5) * 0.2})`;
    _ctx.fillRect(sx, sy, 1, 1);
  });
  // Clouds: flat pixel clusters (not ellipses)
  [[100, 22], [300, 16], [500, 26]].forEach(([cx, cy]) => {
    fill(cx - 15, cy, 30, 4, 'rgba(60,80,110,0.15)');
    fill(cx - 10, cy - 2, 20, 3, 'rgba(60,80,110,0.12)');
    fill(cx - 8, cy + 3, 16, 2, 'rgba(60,80,110,0.10)');
  });

  // --- MOUNTAINS in distance: 2-layer silhouettes ---
  _ctx.fillStyle = P.MN1;
  _ctx.beginPath(); _ctx.moveTo(0, 110);
  [[80, 92], [200, 78], [350, 88], [500, 72], [640, 98]].forEach(([x, y]) => _ctx.lineTo(x, y));
  _ctx.lineTo(640, 110); _ctx.fill();
  // Nearer range
  _ctx.fillStyle = P.MN2;
  _ctx.beginPath(); _ctx.moveTo(0, 108);
  [[60, 100], [150, 92], [280, 102], [440, 85], [580, 95], [640, 105]].forEach(([x, y]) => _ctx.lineTo(x, y));
  _ctx.lineTo(640, 110); _ctx.fill();

  // --- SEA: 6-band deep water ---
  bandedV(0, 100, W, [
    [P.SE6, 18], [P.SE5, 25], [P.SE4, 30], [P.SE3, 35], [P.SE2, 45], [P.SE1, 67]
  ]);
  // Horizon foam line
  fill(0, 100, W, 1, P.FM);
  // Wave texture: 1px horizontal highlights
  for (let wy = 105; wy < 225; wy += 18) {
    for (let wx = 0; wx < W; wx += 40) {
      fill(wx, wy, 15, 1, P.SE6);
    }
  }

  // --- BOAT DECK: self-shaded plank construction ---
  // Deck surface: 3-band warm
  bandedV(60, 228, 520, [
    [P.DK6, 15], [P.DK5, 25], [P.DK4, 25], [P.DK3, 27]
  ]);
  // Plank lines (1px dark)
  for (let px = 65; px < 575; px += 28) {
    fill(px, 228, 1, 92, P.DK2);
    // Alternate planks slightly different shade
    if ((px / 28) % 2 === 0) {
      fill(px + 1, 229, 26, 90, P.DK5);
    }
  }
  // Cross-plank nail lines
  for (let py = 238; py < H; py += 16) {
    fill(60, py, 520, 1, P.DK2);
  }
  // Hull sides: self-shaded
  fill(55, 226, 10, 94, P.DK2);
  fill(56, 227, 8, 92, P.DK3);
  fill(56, 227, 2, 92, P.DK4); // inner highlight
  fill(575, 226, 10, 94, P.DK2);
  fill(576, 227, 8, 92, P.DK3);
  fill(582, 227, 2, 92, P.DK1); // outer shadow
  // Railing: self-shaded
  fill(55, 222, 530, 6, P.DK3);
  fill(55, 222, 530, 2, P.DK7); // top highlight
  fill(55, 226, 530, 1, P.DK1); // bottom shadow
  // Railing posts
  for (let rp = 70; rp < 580; rp += 55) {
    fill(rp, 208, 4, 16, P.DK3);
    fill(rp, 208, 1, 16, P.DK6); // highlight edge
    fill(rp + 3, 208, 1, 16, P.DK1); // shadow edge
  }

  // --- MAST: self-shaded cylinder ---
  fill(299, 48, 8, 182, P.DK2);
  fill(300, 49, 2, 180, P.DK6); // left highlight
  fill(302, 49, 3, 180, P.DK4); // middle
  fill(305, 49, 1, 180, P.DK1); // right shadow
  // Crow's nest hint
  fill(294, 48, 18, 3, P.DK3);
  fill(295, 48, 16, 1, P.DK6);

  // --- SAIL: self-shaded flat triangle with fold lines ---
  _ctx.fillStyle = P.SL2;
  _ctx.beginPath();
  _ctx.moveTo(307, 58); _ctx.lineTo(307, 200); _ctx.lineTo(450, 178); _ctx.fill();
  // Sail shading: darker inner area
  _ctx.fillStyle = P.SL1;
  _ctx.beginPath();
  _ctx.moveTo(307, 68); _ctx.lineTo(307, 190); _ctx.lineTo(420, 175); _ctx.fill();
  // Sail highlight edge
  _ctx.fillStyle = P.SL3;
  _ctx.beginPath();
  _ctx.moveTo(307, 58); _ctx.lineTo(307, 200); _ctx.lineTo(315, 198); _ctx.lineTo(315, 62); _ctx.fill();
  // Fold lines (1px darker)
  drawLine(310, 65, 400, 172, P.SL1, 1);
  drawLine(312, 85, 380, 174, P.SL1, 1);
  drawLine(315, 110, 360, 176, P.SL1, 1);
  // Patch (repair detail)
  fill(340, 130, 18, 14, P.SL4);
  fill(341, 131, 16, 12, P.SL3);

  // --- ROPES ---
  drawLine(307, 53, 450, 178, P.RP1, 1);
  drawLine(299, 53, 80, 213, P.RP1, 1);
  drawLine(307, 100, 550, 210, P.RP2, 1); // extra rigging

  // --- STEERING WHEEL: pixel art, no strokes ---
  // Stand
  fill(483, 191, 5, 37, P.DK3);
  fill(484, 192, 3, 35, P.DK5);
  // Wheel ring (pixel rectangle approximation)
  fill(468, 158, 34, 34, P.DK4);
  fill(470, 160, 30, 30, P.SK2); // center cutout (sky behind)
  fill(470, 160, 30, 30, P.SE4); // sea behind
  // Wheel rim
  fill(468, 158, 34, 2, P.DK7); // top
  fill(468, 190, 34, 2, P.DK2); // bottom
  fill(468, 160, 2, 30, P.DK6); // left
  fill(500, 160, 2, 30, P.DK2); // right
  // Spokes (cross + X)
  fill(484, 160, 2, 30, P.DK4); // vertical
  fill(470, 174, 30, 2, P.DK4); // horizontal
  // Hub
  fill(482, 172, 6, 6, P.MT2);
  fill(483, 173, 4, 4, P.MT3);

  // --- FISHING NETS: dithered mesh texture ---
  fill(85, 188, 92, 37, P.NT1);
  fill(86, 189, 90, 35, P.NT2);
  dither(86, 189, 90, 35, P.NT2, P.NT1, 0);
  // Net rope crisscross
  for (let nx = 88; nx < 174; nx += 12) {
    drawLine(nx, 189, nx + 6, 224, P.NT1, 1);
    drawLine(nx + 12, 189, nx + 6, 224, P.NT1, 1);
  }
  // Cork floats: self-shaded rectangles (no circles)
  [90, 110, 130, 150, 165].forEach(fx => {
    fill(fx, 185, 7, 5, P.CK1);
    fill(fx + 1, 186, 5, 3, P.CK2);
    fill(fx + 1, 186, 5, 1, P.CK3); // highlight
  });
}

function drawBoatFx() {
  const t = state.tick;
  const rock = Math.sin(t * 0.02) * 1.5;

  // --- Waves: 1px highlight/trough lines ---
  for (let layer = 0; layer < 3; layer++) {
    const waveY = 108 + layer * 28;
    for (let wx = 0; wx < W; wx += 16 + layer * 6) {
      const phase = t * 0.035 + wx * 0.05 + layer * 1.8;
      const off = Math.sin(phase) * 2;
      // Bright crest
      ctx.fillStyle = `rgba(100,160,200,${0.12 - layer * 0.03})`;
      ctx.fillRect(wx, waveY + off + rock, 10 + layer * 3, 1);
      // Dark trough below
      ctx.fillStyle = `rgba(8,16,30,${0.10 - layer * 0.02})`;
      ctx.fillRect(wx + 1, waveY + off + rock + 1, 8 + layer * 2, 1);
    }
  }

  // --- Dolphins: pixel art (no ellipses/transforms) ---
  const dolphinCycle = t % 300;
  if (dolphinCycle < 60) {
    const dp = dolphinCycle / 60;
    const dx = Math.floor(530 + dp * 60);
    const dy = Math.floor(110 - Math.sin(dp * Math.PI) * 40);
    // Body (pixel rectangle)
    ctx.fillStyle = '#556677';
    ctx.fillRect(dx - 8, dy - 2, 16, 5);
    ctx.fillRect(dx - 6, dy - 3, 12, 1); // top curve
    ctx.fillRect(dx - 6, dy + 3, 12, 1); // bottom curve
    // Tail
    ctx.fillRect(dx - 12, dy - 3, 5, 2);
    ctx.fillRect(dx - 12, dy + 1, 5, 2);
    // Dorsal fin
    ctx.fillRect(dx, dy - 5, 3, 3);
    ctx.fillRect(dx + 1, dy - 6, 1, 1);
    // Splash on re-entry
    if (dp > 0.8) {
      ctx.fillStyle = 'rgba(180,210,240,0.25)';
      ctx.fillRect(dx - 6, 108 + rock, 12, 2);
      ctx.fillRect(dx - 3, 106 + rock, 6, 2);
    }
  }
  // Second dolphin (smaller)
  const d2 = (t + 150) % 350;
  if (d2 < 50) {
    const dp = d2 / 50;
    const dx = Math.floor(510 + dp * 50);
    const dy = Math.floor(120 - Math.sin(dp * Math.PI) * 28);
    ctx.fillStyle = '#667788';
    ctx.fillRect(dx - 6, dy - 1, 12, 3);
    ctx.fillRect(dx - 4, dy - 2, 8, 1);
    ctx.fillRect(dx - 8, dy - 2, 3, 2);
    ctx.fillRect(dx - 8, dy + 1, 3, 2);
  }

  // --- Seagulls: pixel V-shapes ---
  for (let i = 0; i < 2; i++) {
    const gx = Math.floor((t * 0.8 + i * 300) % (W + 100) - 50);
    const gy = 25 + Math.sin(t * 0.015 + i * 3) * 8;
    const wing = Math.sin(t * 0.08 + i) > 0 ? 1 : 0;
    ctx.fillStyle = '#CCCCCC';
    ctx.fillRect(gx - 4, gy - wing, 1, 1);
    ctx.fillRect(gx - 3, gy - 1, 1, 1);
    ctx.fillRect(gx - 2, gy, 1, 1);
    ctx.fillRect(gx - 1, gy - 1, 1, 1);
    ctx.fillRect(gx, gy - wing, 1, 1);
  }

  // --- Sail billow: subtle pixel shift ---
  const billowX = Math.sin(t * 0.015) * 4;
  ctx.fillStyle = 'rgba(200,190,170,0.06)';
  ctx.beginPath();
  ctx.moveTo(307, 60); ctx.lineTo(307, 200); ctx.lineTo(450 + billowX, 180); ctx.fill();

  // --- Moon sparkles on water: 1px flashes ---
  for (let i = 0; i < 12; i++) {
    const sx = (t * 0.5 + i * 55) % W;
    const sy = 108 + (i * 23) % 115;
    if (Math.sin(t * 0.1 + i * 1.3) > 0.7) {
      ctx.fillStyle = 'rgba(200,220,240,0.2)';
      ctx.fillRect(sx, sy + rock, 1, 1);
    }
  }

  // --- Lantern glow on deck (if at night) ---
  const lampF = Math.sin(t * 0.07) * 0.008;
  ctx.fillStyle = `rgba(255,200,100,${0.03 + lampF})`;
  ctx.fillRect(440, 160, 90, 68);
  ctx.fillStyle = `rgba(255,200,100,${0.05 + lampF})`;
  ctx.fillRect(460, 168, 50, 40);
}

