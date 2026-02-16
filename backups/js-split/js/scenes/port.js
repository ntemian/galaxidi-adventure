// Port scene renderer
function drawPortBg() {
  // === SKY: 6-band night sky ===
  bandedV(0, 0, W, [
    ['#030610', 15], ['#060C1C', 15], ['#0A1430', 15],
    ['#101C3C', 15], ['#162448', 15], ['#1A3050', 15]
  ]);
  // Clouds — banded, not ellipses
  [[60,18,50,10],[190,12,40,8],[380,16,45,9],[540,22,35,8]].forEach(([cx,cy,cw,ch]) => {
    fill(cx, cy, cw, ch, '#0C1828');
    dither(cx, cy, cw, ch, '#0C1828', '#081420', 5);
    fill(cx+3, cy+1, cw-6, 2, '#101C30'); // highlight
  });

  // === MOUNTAINS: 2-layer silhouettes with dithered edges ===
  _ctx.fillStyle = '#121E38';
  _ctx.beginPath(); _ctx.moveTo(0,125);
  [[40,82],[100,62],[180,78],[260,48],[340,58],[420,42],[500,62],[580,52],[640,92]].forEach(([x,y])=>_ctx.lineTo(x,y));
  _ctx.lineTo(640,125); _ctx.fill();
  // Nearer range
  _ctx.fillStyle = '#0E1830';
  _ctx.beginPath(); _ctx.moveTo(0,128);
  [[60,100],[150,85],[280,95],[400,72],[520,88],[640,100]].forEach(([x,y])=>_ctx.lineTo(x,y));
  _ctx.lineTo(640,128); _ctx.fill();
  dither(0, 70, W, 60, '#121E38', '#0A1228', 6);

  // === SEA: 5-band with horizon glow ===
  fill(0, 128, W, 2, '#2A5577'); // horizon line
  bandedV(0, 130, W, [
    ['#0C2444', 18], ['#0A1E3A', 22], ['#081830', 26],
    ['#061430', 28], ['#0A1838', 16]
  ]);
  // Wave texture
  dither(0, 140, W, 20, '#0C2444', '#0A1E3A', 3);

  // === QUAY: cobblestones with self-shaded volume ===
  fill(0, 238, W, 82, '#2A2218');
  // Quay edge — stepped stone
  fill(0, 236, W, 4, '#5A5248');
  fill(0, 236, W, 1, '#6A6258'); // highlight
  fill(0, 239, W, 1, '#3A3228'); // shadow
  // Cobblestones
  for (let sy = 242; sy < H; sy += 13) {
    const rowOff = (Math.floor((sy-242)/13) % 2) * 11;
    for (let sx = -11 + rowOff; sx < W + 11; sx += 22) {
      const shade = ((sx*7+sy*3) % 30) - 15;
      const r = 58+shade, g = 48+shade, b = 38+shade;
      fill(sx, sy, 20, 11, `rgb(${r},${g},${b})`);
      fill(sx+1, sy+1, 18, 1, `rgb(${r+15},${g+15},${b+15})`); // top highlight
      fill(sx+1, sy+9, 18, 1, `rgb(${r-10},${g-10},${b-10})`); // bottom shadow
      fill(sx+1, sy+1, 1, 9, `rgb(${r+8},${g+8},${b+8})`); // left
    }
  }

  // === FISHING BOAT — hull with planking detail ===
  _ctx.fillStyle = '#1A3388';
  _ctx.beginPath();
  _ctx.moveTo(68,210); _ctx.lineTo(215,210); _ctx.lineTo(225,188); _ctx.lineTo(60,188);
  _ctx.fill();
  // Hull planks
  bandedV(65, 190, 155, [
    ['#2244AA', 5], ['#1E3C96', 5], ['#2244AA', 5], ['#1A3888', 5]
  ], false);
  // Waterline stripe
  fill(65, 206, 155, 3, '#CC3333');
  fill(66, 207, 153, 1, '#AA2222');
  // Gunwale
  fill(62, 188, 162, 3, '#1A3080');
  fill(63, 188, 160, 1, '#2A4098');
  // Name painted on hull
  _ctx.fillStyle = '#DDDDCC'; _ctx.font = '8px sans-serif';
  _ctx.fillText('ΕΛΠΙΔΑ', 120, 204);
  // Mast
  fill(130, 152, 5, 52, '#5A3818');
  fill(131, 152, 2, 52, '#7A5A2A');
  fill(125, 148, 15, 4, '#4A2A10');

  // === SAILBOAT — layered hull + rigging ===
  // Hull body
  _ctx.fillStyle = '#6A3818';
  _ctx.beginPath();
  _ctx.moveTo(350,215); _ctx.lineTo(500,215); _ctx.lineTo(510,193); _ctx.lineTo(340,193);
  _ctx.fill();
  bandedV(345, 195, 160, [
    ['#7A4820', 5], ['#6A3818', 5], ['#5A2810', 5], ['#7A4820', 5]
  ], false);
  fill(345, 210, 160, 3, '#CC3333'); // waterline
  // Mast
  fill(412, 128, 5, 80, '#5A3818');
  fill(413, 128, 2, 80, '#7A5A2A');
  // Sail — 3-band with shadow fold
  _ctx.fillStyle = '#DDD0BB';
  _ctx.beginPath(); _ctx.moveTo(417,133); _ctx.lineTo(417,198); _ctx.lineTo(478,188); _ctx.fill();
  _ctx.fillStyle = '#CCBFAA';
  _ctx.beginPath(); _ctx.moveTo(417,142); _ctx.lineTo(417,192); _ctx.lineTo(465,184); _ctx.fill();
  _ctx.fillStyle = '#BBB099';
  _ctx.beginPath(); _ctx.moveTo(417,155); _ctx.lineTo(417,185); _ctx.lineTo(450,178); _ctx.fill();
  // Rigging lines
  drawLine(415, 130, 478, 188, '#665544', 1);
  drawLine(412, 130, 350, 210, '#665544', 1);

  // === BOLLARD ===
  fill(262, 224, 24, 4, '#444');
  fill(264, 218, 20, 8, '#555');
  fill(265, 218, 18, 2, '#666'); // highlight
  fill(267, 214, 14, 5, '#666');
  fill(268, 214, 12, 1, '#777');
  // Rope to boat
  drawLine(274, 220, 195, 200, '#6A5A3A', 1);

  // === FISHERMAN: volumetric shading ===
  // Legs
  fill(524, 220, 7, 22, '#2A3C5A');
  fill(525, 221, 2, 20, '#3A4C6A'); // highlight
  fill(536, 220, 7, 22, '#2A3C5A');
  fill(537, 221, 2, 20, '#3A4C6A');
  // Body — banded
  bandedH(520, 190, 32, [
    ['#1A3050', 5], ['#2A4466', 10], ['#1A3355', 9]
  ]);
  // Arms
  fill(516, 195, 6, 18, '#2A4466');
  fill(517, 196, 2, 16, '#3A5476');
  fill(542, 195, 6, 15, '#2A4466');
  // Hands
  fill(516, 212, 5, 4, '#BB8866');
  fill(542, 209, 5, 4, '#BB8866');
  // Head
  fill(524, 176, 16, 16, '#DDAA88');
  fill(525, 177, 5, 5, '#CC9977'); // shadow
  // Eyes
  fill(527, 179, 3, 2, '#222');
  fill(528, 179, 1, 2, '#DDDDCC');
  fill(537, 179, 3, 2, '#222');
  fill(538, 179, 1, 2, '#DDDDCC');
  // Nose
  fill(532, 182, 2, 2, '#CC9977');
  // Beard
  fill(524, 188, 16, 6, '#999');
  dither(525, 189, 14, 4, '#999', '#777', 0);
  // Captain hat
  fill(520, 170, 24, 8, '#1A1A28');
  fill(521, 171, 22, 2, '#2A2A38');
  fill(524, 164, 16, 8, '#1A1A28');
  fill(520, 176, 24, 2, '#2A2A38'); // brim highlight
  // Fishing rod
  drawLine(548, 200, 595, 145, '#6A4A20', 1);
  drawLine(595, 145, 595, 220, '#666', 1);

  // === STONE STEPS TO TOWN ===
  fill(280, 228, 80, 14, '#6A6258');
  fill(282, 228, 76, 2, '#7A7268'); // highlight
  fill(280, 240, 80, 2, '#4A4238'); // shadow
  fill(285, 222, 70, 7, '#5A5248');
  fill(287, 222, 66, 2, '#6A6258');
  fill(290, 218, 60, 5, '#4A4238');
  fill(292, 218, 56, 1, '#5A5248');
  // Sign
  fill(317, 208, 5, 14, '#5A3818');
  fill(304, 204, 32, 9, '#7A5A2A');
  fill(305, 205, 30, 1, '#9A7A3A');
  _ctx.fillStyle = '#DDDDCC'; _ctx.font = '6px sans-serif'; _ctx.textAlign = 'center';
  _ctx.fillText('ΠΟΛΗ', 320, 211);
  _ctx.textAlign = 'left';

  // Trees
  drawTree(30, 130, 0.8, true);
  drawTree(620, 125, 0.9, true);
}

function drawPortFx() {
  const t = state.tick;
  // Wave highlights — 1px bands
  for (let layer = 0; layer < 3; layer++) {
    for (let wx = 0; wx < W; wx += 16+layer*8) {
      const off = Math.sin(t*(0.03+layer*0.01)+wx*0.06+layer*2)*2.5;
      const yBase = 148 + layer*28;
      const alpha = 0.10 - layer*0.02 + Math.sin(t*0.025+wx*0.04)*0.04;
      ctx.fillStyle = `rgba(100,180,200,${Math.max(0.02,alpha)})`;
      ctx.fillRect(wx, yBase+off, 12+layer*4, 1);
      if (layer === 0 && Math.sin(t*0.02+wx*0.1) > 0.7) {
        ctx.fillStyle = 'rgba(220,240,255,0.12)';
        ctx.fillRect(wx+2, yBase+off-1, 6, 1);
      }
    }
  }
  // Moonlight sparkles — 1px pixels
  for (let i = 0; i < 8; i++) {
    const sx = (t*0.4+i*79) % W;
    const sy = 135 + (i*31)%75;
    const sparkle = Math.sin(t*0.08+i*1.7);
    if (sparkle > 0.7) {
      ctx.fillStyle = `rgba(180,210,240,${(sparkle-0.7)*0.35})`;
      ctx.fillRect(Math.round(sx), Math.round(sy), 1, 1);
    }
  }
  // Seagulls
  const drawGull = (offset, speed) => {
    const gx = (t*speed+offset) % (W+200) - 100;
    const gy = 18+Math.sin(t*0.02+offset)*10;
    const wing = Math.sin(t*0.08+offset)*4;
    ctx.strokeStyle = '#CCCCBB'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(gx-8, gy+wing); ctx.quadraticCurveTo(gx, gy-2, gx+8, gy+wing);
    ctx.stroke();
    ctx.fillStyle = '#CCCCBB';
    ctx.fillRect(gx-1, gy, 2, 1);
  };
  drawGull(0, 1.2); drawGull(300, 0.9); drawGull(550, 0.7);
  // Fishing line bob
  const bobY = 220 + Math.sin(t*0.05)*3;
  ctx.fillStyle = '#CCCCBB';
  ctx.fillRect(594, Math.round(bobY), 2, 2);
  // Character reflection
  if (state.charY < 250) {
    ctx.save();
    ctx.globalAlpha = 0.06;
    const reflY = 238 + (238 - state.charY) * 0.3;
    const distort = Math.sin(t*0.04)*2;
    ctx.fillStyle = '#0A1C38';
    ctx.fillRect(state.charX - 7 + distort, reflY, 14, 18);
    ctx.restore();
  }
}

