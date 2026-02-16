// Beach scene renderer
// === BEACH ===
function drawBeachBg() {
  // === SKY: banded night ===
  bandedV(0, 0, W, [
    ['#030610', 12], ['#060C1C', 14], ['#0A1430', 14],
    ['#101C3C', 14], ['#162448', 14], ['#1C3050', 12]
  ]);

  // === SEA: banded with horizon glow ===
  fill(0, 80, W, 2, '#2A5577');
  bandedV(0, 82, W, [
    ['#0C2444', 16], ['#0A1E3A', 20], ['#081830', 22],
    ['#0A2040', 20], ['#0C2848', 20]
  ]);
  dither(0, 90, W, 15, '#0C2444', '#0A1E3A', 3);

  // === WET SAND ===
  bandedV(0, 180, 480, [
    ['#3A2818', 8], ['#4A3828', 10], ['#5A4830', 12]
  ]);
  dither(0, 180, 480, 10, '#4A3828', '#3A2818', 5);

  // === DRY SAND: banded + pixel noise ===
  bandedV(0, 210, 480, [
    ['#5A4830', 15], ['#6A5838', 20], ['#7A6848', 25],
    ['#6A5838', 20], ['#5A4830', 30]
  ]);
  dither(0, 225, 480, 50, '#7A6848', '#6A5838', 6);
  // Sand ripples
  for (let sy = 220; sy < 300; sy += 12) {
    for (let sx = 10; sx < 460; sx += 40 + (sy%8)) {
      drawLine(sx, sy, sx+15, sy, '#5A4830', 1);
    }
  }

  // === CLIFFS: banded rock layers with strata ===
  bandedV(430, 48, 210, [
    ['#5A5248', 8], ['#4A4238', 25], ['#3A3228', 40],
    ['#4A3828', 35], ['#3A2A18', 40], ['#2A2218', 50],
    ['#3A2A18', 40], ['#443322', 32]
  ]);
  // Rock face strata lines
  for (let ry = 56; ry < 310; ry += 6) {
    const indent = Math.sin(ry*0.15)*5;
    drawLine(430+indent, ry, 445+indent, ry, '#2A2218', 1);
  }
  // Vertical crack
  drawLine(480, 60, 478, 140, '#2A2218', 1);
  drawLine(478, 140, 482, 200, '#2A2218', 1);
  drawLine(540, 80, 538, 180, '#2A2218', 1);
  // Cliff top
  fill(425, 48, 215, 3, '#5A5248');
  fill(425, 48, 215, 1, '#6A6258');
  // Vegetation
  [440,465,500,535,575,600].forEach(tx => {
    fill(tx, 42, 14, 8, '#0A1A0A');
    fill(tx+2, 38, 10, 7, '#122812');
    fill(tx+4, 36, 6, 5, '#1A3A1A');
    fill(tx+5, 35, 3, 2, '#224422');
  });

  // === ROCKS on beach — layered, no ellipse outlines ===
  // Large rock cluster
  _ctx.fillStyle = '#2A2218';
  _ctx.beginPath(); _ctx.ellipse(470, 212, 30, 16, 0, 0, Math.PI*2); _ctx.fill();
  _ctx.fillStyle = '#3A3228';
  _ctx.beginPath(); _ctx.ellipse(468, 208, 26, 13, 0, 0, Math.PI*2); _ctx.fill();
  fill(455, 205, 10, 5, '#4A4238'); // highlight
  // Secondary rock
  _ctx.fillStyle = '#2A2218';
  _ctx.beginPath(); _ctx.ellipse(500, 222, 22, 12, 0, 0, Math.PI*2); _ctx.fill();
  _ctx.fillStyle = '#4A4238';
  _ctx.beginPath(); _ctx.ellipse(498, 219, 18, 10, 0, 0, Math.PI*2); _ctx.fill();
  // Small rock
  _ctx.fillStyle = '#3A3228';
  _ctx.beginPath(); _ctx.ellipse(455, 226, 16, 7, 0, 0, Math.PI*2); _ctx.fill();

  // === DRIFTWOOD — weathered ===
  fill(105, 228, 80, 4, '#4A3A28');
  fill(106, 228, 78, 1, '#5A4A38');
  fill(106, 231, 78, 1, '#3A2A18');
  fill(108, 225, 12, 5, '#3A2A18');
  fill(170, 229, 18, 3, '#4A3A28');
  fill(171, 229, 16, 1, '#5A4A38');
  // Seaweed near waterline
  fill(40, 182, 6, 8, '#0A1A0A');
  fill(120, 184, 4, 6, '#122812');
  fill(250, 181, 5, 7, '#0A1A0A');

  // === GOLDEN SHELL ===
  if (!state.flags.shellTaken) {
    _ctx.fillStyle = '#AA7711';
    _ctx.beginPath(); _ctx.ellipse(287, 248, 8, 5, 0, 0, Math.PI*2); _ctx.fill();
    _ctx.fillStyle = '#DDAA33';
    _ctx.beginPath(); _ctx.ellipse(286, 247, 6, 4, 0, 0, Math.PI*2); _ctx.fill();
    fill(284, 245, 3, 2, '#FFCC44'); // highlight
    fill(290, 245, 1, 1, '#FFFFEE'); // sparkle
    // Shell ridges
    for (let r = 0; r < 5; r++) {
      drawLine(287-4+r*2, 250, 287, 244, '#AA7711', 1);
    }
  }

  // === CAVE ENTRANCE ===
  _ctx.fillStyle = '#050508';
  _ctx.beginPath();
  _ctx.arc(575, 220, 45, 0.3, Math.PI-0.3);
  _ctx.lineTo(535, 270); _ctx.lineTo(615, 270);
  _ctx.fill();
  fill(535, 220, 80, 50, '#050508');
  // Rock arch frame — banded
  _ctx.fillStyle = '#3A3228';
  _ctx.beginPath(); _ctx.arc(575, 220, 48, Math.PI+0.35, -0.35); _ctx.lineTo(618, 270); _ctx.lineTo(532, 270); _ctx.fill();
  _ctx.fillStyle = '#2A2218';
  _ctx.beginPath(); _ctx.arc(575, 220, 45, Math.PI+0.38, -0.38); _ctx.lineTo(615, 270); _ctx.lineTo(535, 270); _ctx.fill();
  _ctx.fillStyle = '#050508';
  _ctx.beginPath(); _ctx.arc(575, 220, 42, Math.PI+0.4, -0.4); _ctx.lineTo(612, 270); _ctx.lineTo(538, 270); _ctx.fill();
  // Stalactite hints at entrance
  fill(560, 180, 3, 10, '#2A2218');
  fill(585, 178, 2, 8, '#3A3228');
}

function drawBeachFx() {
  const t = state.tick;
  // --- Waves: 1px highlight lines advancing/retreating (MI2 style) ---
  for (let layer = 0; layer < 3; layer++) {
    const waveY = 170 + layer * 5;
    const speed = 0.025 - layer * 0.005;
    for (let wx = 0; wx < 430; wx += 18) {
      const phase = t * speed + wx * 0.06 + layer * 2;
      const off = Math.sin(phase) * 3;
      // Dark trough
      ctx.fillStyle = `rgba(15,40,70,${0.12 - layer * 0.03})`;
      ctx.fillRect(wx, waveY + off, 16, 1);
      // Bright crest 1px above
      ctx.fillStyle = `rgba(140,210,230,${0.18 - layer * 0.04})`;
      ctx.fillRect(wx + 1, waveY + off - 1, 14, 1);
    }
  }
  // --- Foam line at shore: sharp 1px white dashes ---
  const foamAdvance = Math.sin(t * 0.012) * 8;
  for (let fx = 10; fx < 400; fx += 12) {
    const fy = 183 + Math.sin(t * 0.018 + fx * 0.04) * 2 + foamAdvance * 0.3;
    const len = 5 + Math.sin(fx * 0.3) * 3;
    ctx.fillStyle = `rgba(255,255,255,${0.15 + Math.sin(t * 0.03 + fx) * 0.05})`;
    ctx.fillRect(fx, fy, len, 1);
  }
  // --- Wet sand shimmer: 1px highlights on wet zone ---
  for (let sx = 20; sx < 400; sx += 22) {
    const shimmer = Math.sin(t * 0.04 + sx * 0.12);
    if (shimmer > 0.5) {
      ctx.fillStyle = `rgba(180,210,220,${(shimmer - 0.5) * 0.2})`;
      ctx.fillRect(sx, 190 + Math.sin(sx) * 2, 8, 1);
    }
  }
  // --- Shell sparkle: sharp 1px pixel flashes ---
  if (!state.flags.shellTaken) {
    const sparkle = Math.sin(t * 0.1);
    if (sparkle > 0.3) {
      ctx.fillStyle = `rgba(255,255,255,${(sparkle - 0.3) * 0.9})`;
      ctx.fillRect(293, 243, 1, 1);
      ctx.fillRect(285, 246, 1, 1);
      ctx.fillRect(290, 241, 1, 1);
    }
    // Gold glint
    if (Math.sin(t * 0.07) > 0.5) {
      ctx.fillStyle = '#DDCC44';
      ctx.fillRect(289, 244, 2, 1);
    }
    // Sharp rectangular glow (not radial)
    const flare = Math.sin(t * 0.05);
    if (flare > 0.7) {
      ctx.fillStyle = `rgba(255,220,100,${(flare - 0.7) * 0.12})`;
      ctx.fillRect(282, 240, 16, 12);
      ctx.fillStyle = `rgba(255,240,180,${(flare - 0.7) * 0.18})`;
      ctx.fillRect(285, 242, 10, 8);
    }
  }
  // --- Butterflies: 1px pixel wings ---
  for (let i = 0; i < 2; i++) {
    const bx = 100 + i * 180 + Math.sin(t * 0.02 + i * 3) * 30;
    const by = 200 + Math.sin(t * 0.03 + i * 2) * 15;
    const wing = Math.abs(Math.sin(t * 0.15 + i)) * 3;
    const col = i === 0 ? '#CCCC66' : '#9966BB';
    // Wings as pixel pairs
    ctx.fillStyle = col;
    ctx.fillRect(bx - wing, by, Math.max(1, wing), 1);
    ctx.fillRect(bx + 1, by, Math.max(1, wing), 1);
    ctx.fillRect(bx - wing + 1, by + 1, Math.max(1, wing - 1), 1);
    ctx.fillRect(bx + 2, by + 1, Math.max(1, wing - 1), 1);
    // Body
    ctx.fillStyle = '#333';
    ctx.fillRect(bx, by, 1, 2);
  }
  // --- Cliff shadow on sand (sharp edge) ---
  ctx.fillStyle = 'rgba(20,15,10,0.06)';
  ctx.fillRect(432, 195, 208, 125);
}

