// Cave scene renderer
function drawCaveBg() {
  const lit = state.flags.caveIlluminated;

  // MI2-grade cave palette
  const P = {
    // Rock (8-tone warm brown)
    R1: '#0A0804', R2: '#1A1208', R3: '#2A1E10', R4: '#3A2A18',
    R5: '#4A3A22', R6: '#5A4A30', R7: '#6A5A3E', R8: '#7A6A4E',
    // Cave warm (lantern-lit tones)
    CW1: '#2A2010', CW2: '#3A3018', CW3: '#4A4022', CW4: '#5A502E',
    // Pool water (bioluminescent)
    PL1: '#0A1A33', PL2: '#0E2244', PL3: '#1A3366', PL4: '#2A4488',
    PLG: '#44AAAA', // glow
    // Treasure gold
    GD1: '#5A4008', GD2: '#7A6011', GD3: '#AA8822', GD4: '#CCAA33', GD5: '#DDCC44',
    // Entrance sky
    ES1: '#223355', ES2: '#334466', ES3: '#445577', ES4: '#556688',
    // Stalactite mineral
    ST1: '#4A4438', ST2: '#5A5448', ST3: '#6A6458', ST4: '#7A7468',
    OL: '#080604',
  };

  if (!lit) {
    fill(0, 0, W, H, '#030305');
    // Faint entrance light: 4-band horizontal fade
    bandedH(480, 180, 140, [
      ['#060610', 40], ['#0C0C1A', 30], ['#151525', 40], ['#1E2040', 30], [P.ES1, 20]
    ]);
    // Exit opening: banded sky
    bandedV(555, 215, 85, [
      [P.ES3, 15], [P.ES2, 25], [P.ES1, 30], ['#1A2844', 35]
    ]);
    // Faint cave outline visible near entrance
    fill(545, 210, 2, 110, '#0E0E18');
    fill(540, 200, 3, 10, '#0A0A14');
    // Help text
    _ctx.fillStyle = '#333355';
    _ctx.font = '14px Courier New';
    _ctx.textAlign = 'center';
    _ctx.fillText("Είναι πολύ σκοτεινά...", W / 2, 160);
    _ctx.fillText("Χρειάζεσαι φως.", W / 2, 180);
    _ctx.textAlign = 'left';
    return;
  }

  // --- CEILING: 4-band dark rock ---
  bandedV(0, 0, W, [
    [P.R1, 15], [P.R2, 25], [P.R3, 30], [P.R4, 30]
  ]);
  dither(0, 0, W, 100, P.R2, P.R3, 6);

  // --- STALACTITES: self-shaded mineral fingers ---
  [80, 150, 240, 310, 360, 430, 510].forEach(sx => {
    const sh = 25 + Math.sin(sx * 0.8) * 12;
    // 3-band vertical (dark tip → light base)
    const bh1 = Math.floor(sh * 0.3);
    const bh2 = Math.floor(sh * 0.4);
    const bh3 = sh - bh1 - bh2;
    bandedV(sx - 3, 0, 6, [[P.ST1, bh1], [P.ST2, bh2], [P.ST3, bh3]]);
    // Drip tip (bright 2px)
    fill(sx - 1, sh - 2, 2, 3, P.ST4);
    // Highlight stripe (1px left edge)
    fill(sx - 3, 0, 1, sh, P.ST3);
    // Shadow stripe (1px right edge)
    fill(sx + 2, 2, 1, sh - 2, P.R2);
  });

  // --- WALLS: warm banded rock with texture ---
  bandedV(0, 100, W, [
    [P.CW1, 20], [P.CW2, 30], [P.CW3, 35], [P.CW4, 20], [P.CW3, 15]
  ]);
  // Rock face texture: horizontal ledge lines
  for (let ry = 108; ry < 220; ry += 14) {
    const ledgeColor = ry % 28 === 0 ? P.R5 : P.R3;
    fill(0, ry, W, 1, ledgeColor);
  }
  // Irregular rock bumps
  for (let ry = 110; ry < 220; ry += 15) {
    for (let rx = 8; rx < W - 8; rx += 28) {
      const w = 10 + Math.sin(rx * 0.4 + ry * 0.3) * 5;
      fill(rx, ry, w, 4, P.CW2);
      fill(rx, ry, w, 1, P.CW4); // highlight top
    }
  }
  dither(0, 100, W, 120, P.CW3, P.CW2, 6);

  // --- FLOOR: 3-band with scattered pebbles ---
  bandedV(0, 220, W, [
    [P.CW2, 15], [P.CW3, 25], [P.CW2, 20], [P.R3, 20], [P.R2, 20]
  ]);
  dither(0, 250, W, 70, P.CW2, P.R3, 4);
  // Pebbles (1-3px self-shaded)
  [[30,248],[90,260],[200,255],[340,252],[450,265],[520,250],[580,262]].forEach(([px,py]) => {
    fill(px, py, 4, 2, P.R4);
    fill(px, py, 4, 1, P.R6); // highlight
  });

  // --- TIDAL POOL: banded water, no ellipses ---
  // Pool outline (irregular rectangle)
  fill(40, 228, 140, 30, P.PL1);
  // Water bands
  bandedV(42, 230, 136, [
    [P.PL2, 6], [P.PL3, 10], [P.PL4, 6], [P.PL3, 6]
  ], false);
  // Shore edge (1px highlight)
  fill(42, 228, 136, 1, P.R5);
  fill(42, 258, 136, 1, P.R4);
  // Bio-luminescent reflections (1px bright dashes)
  fill(60, 234, 12, 1, P.PLG);
  fill(100, 240, 15, 1, P.PLG);
  fill(135, 237, 10, 1, '#55AACC');
  fill(80, 245, 8, 1, P.PLG);

  // --- TREASURE ALCOVE: recessed niche ---
  // Dark recess
  fill(238, 188, 105, 58, P.R1);
  bandedV(240, 190, 101, [
    [P.R2, 15], [P.R1, 25], [P.R2, 14]
  ], false);
  // Alcove arch top
  fill(238, 186, 105, 3, P.R4);
  fill(239, 186, 103, 1, P.R6); // highlight

  if (!state.flags.treasureFound) {
    // Treasure chest: self-shaded
    fill(265, 215, 65, 28, P.GD1);
    // Body: 3-band horizontal
    bandedH(267, 217, 24, [
      [P.GD2, 8], [P.GD3, 24], [P.GD4, 6], [P.GD3, 18], [P.GD2, 5]
    ]);
    // Lid (top 4px)
    fill(265, 215, 65, 4, P.GD3);
    fill(266, 215, 63, 2, P.GD4); // highlight
    // Iron bands
    fill(265, 222, 65, 2, '#3A3A44');
    fill(265, 234, 65, 2, '#3A3A44');
    // Side shading
    fill(265, 215, 2, 28, P.GD4); // left highlight
    fill(328, 215, 2, 28, P.GD1); // right shadow
    // Lock
    fill(295, 223, 8, 8, P.GD4);
    fill(296, 224, 6, 6, P.GD3);
    fill(298, 226, 2, 2, P.OL); // keyhole
    // Chest glow: sharp rectangular (NOT radial)
    _ctx.fillStyle = 'rgba(200,160,40,0.04)';
    _ctx.fillRect(255, 200, 85, 50);
    _ctx.fillStyle = 'rgba(200,160,40,0.06)';
    _ctx.fillRect(265, 210, 65, 35);
  } else {
    // Open lid
    fill(265, 205, 65, 12, P.GD2);
    fill(266, 206, 63, 10, P.GD3);
    // Open chest interior
    fill(265, 217, 65, 28, P.GD1);
    bandedV(267, 219, 61, [['#3A2A10', 8], ['#2A1E08', 10], ['#1A1404', 6]]);
    // Gold coins (pixel rectangles, not ellipses)
    [[272,225],[282,228],[290,224],[300,227],[310,226],[285,230]].forEach(([gx,gy]) => {
      fill(gx, gy, 5, 3, P.GD4);
      fill(gx, gy, 5, 1, P.GD5); // highlight
    });
    // Ancient compass
    fill(313, 226, 8, 6, '#886633');
    fill(314, 227, 6, 4, '#BBBBBB');
    fill(316, 228, 2, 2, '#AA2222'); // needle
    // Letter
    fill(270, 222, 10, 7, '#DDCC88');
    fill(271, 223, 8, 5, '#CCBB77');
    fill(271, 223, 8, 1, '#EEDD99'); // highlight
  }

  // --- WARM LANTERN GLOW: 3-layer sharp rectangular ambient ---
  _ctx.fillStyle = 'rgba(255,200,100,0.02)';
  _ctx.fillRect(100, 100, 440, 200);
  _ctx.fillStyle = 'rgba(255,200,100,0.03)';
  _ctx.fillRect(200, 150, 240, 120);
  _ctx.fillStyle = 'rgba(255,200,100,0.04)';
  _ctx.fillRect(280, 180, 100, 70);

  // --- EXIT OPENING: banded sky ---
  bandedV(555, 215, 85, [
    [P.ES4, 12], [P.ES3, 15], [P.ES2, 25], [P.ES1, 53]
  ]);
  // Exit frame (rock edges)
  fill(553, 210, 3, 110, P.R5);
  fill(553, 210, 3, 2, P.R7); // top highlight
}

function drawCaveFx() {
  const t = state.tick;
  if (!state.flags.caveIlluminated) {
    // Entrance light shimmer: 1px highlights
    const flicker = Math.sin(t * 0.02) * 0.02 + 0.03;
    ctx.fillStyle = `rgba(80,120,180,${flicker})`;
    ctx.fillRect(560, 220, 75, 90);
    // 1px bright edge on opening
    ctx.fillStyle = `rgba(120,160,200,${flicker + 0.02})`;
    ctx.fillRect(555, 215, 1, 100);
    return;
  }

  // --- Lantern glow: sharp 3-layer rectangular pool following character ---
  const cx = state.charX;
  const cy = state.charY - 15;
  const flickerA = Math.sin(t * 0.07) * 0.01;
  // Outer
  ctx.fillStyle = `rgba(255,200,100,${0.02 + flickerA})`;
  ctx.fillRect(cx - 120, cy - 80, 240, 180);
  // Middle
  ctx.fillStyle = `rgba(255,190,90,${0.04 + flickerA})`;
  ctx.fillRect(cx - 60, cy - 40, 120, 100);
  // Inner
  ctx.fillStyle = `rgba(255,210,120,${0.06 + flickerA})`;
  ctx.fillRect(cx - 25, cy - 20, 50, 50);

  // --- Bioluminescent pool shimmer ---
  for (let wx = 44; wx < 176; wx += 8) {
    const off = Math.sin(t * 0.04 + wx * 0.07);
    if (off > 0.2) {
      ctx.fillStyle = `rgba(68,170,170,${0.1 + off * 0.12})`;
      ctx.fillRect(wx, 232 + off * 2, 6, 1);
    }
    // Bio dots: 1px
    if (Math.sin(t * 0.06 + wx * 0.2) > 0.75) {
      ctx.fillStyle = `rgba(100,255,255,${0.2 + Math.sin(t * 0.1 + wx) * 0.1})`;
      ctx.fillRect(wx + 3, 236 + Math.sin(wx) * 2, 1, 1);
    }
  }

  // --- Treasure glow: sharp pulsing rectangle ---
  if (!state.flags.treasureFound) {
    const pulse = Math.sin(t * 0.04) * 0.02 + 0.03;
    ctx.fillStyle = `rgba(200,160,40,${pulse})`;
    ctx.fillRect(250, 195, 100, 55);
    ctx.fillStyle = `rgba(220,180,50,${pulse + 0.02})`;
    ctx.fillRect(265, 210, 65, 35);
    // Gold sparkles: 1px flashes
    for (let i = 0; i < 4; i++) {
      const sx = 270 + Math.sin(t * 0.03 + i * 1.8) * 25;
      const sy = 212 + Math.cos(t * 0.025 + i * 2.3) * 10;
      const sa = Math.sin(t * 0.08 + i * 2.5);
      if (sa > 0.4) {
        ctx.fillStyle = sa > 0.7 ? '#FFFFFF' : '#DDCC44';
        ctx.fillRect(sx, sy, 1, 1);
      }
    }
  }

  // --- Dripping water: 1px drops ---
  const dripCycle = t % 120;
  if (dripCycle < 25) {
    const dropY = dripCycle * 3.5 + 20;
    if (dropY < 235) {
      ctx.fillStyle = '#55AACC';
      ctx.fillRect(310, dropY, 1, 2);
      // Stretch as it falls
      if (dripCycle > 10) {
        ctx.fillRect(310, dropY + 2, 1, 1);
      }
    }
  }
  // Splash: 1px dots expanding
  if (dripCycle >= 25 && dripCycle < 30) {
    const sp = dripCycle - 25;
    ctx.fillStyle = `rgba(85,170,200,${0.3 - sp * 0.06})`;
    ctx.fillRect(308 - sp * 2, 236, 1, 1);
    ctx.fillRect(312 + sp * 2, 236, 1, 1);
    ctx.fillRect(310, 234 - sp, 1, 1);
  }
  // Second drip
  const drip2 = (t + 60) % 150;
  if (drip2 < 20) {
    const dy = drip2 * 3 + 40;
    if (dy < 230) {
      ctx.fillStyle = 'rgba(80,160,200,0.4)';
      ctx.fillRect(160, dy, 1, 2);
    }
  }

  // --- Entrance light shimmer ---
  const entranceF = Math.sin(t * 0.015) * 0.01;
  ctx.fillStyle = `rgba(100,140,200,${0.03 + entranceF})`;
  ctx.fillRect(540, 210, 100, 110);
}

