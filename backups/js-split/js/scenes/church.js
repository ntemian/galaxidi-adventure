// Church scene renderer
function drawChurchBg() {
  // Church scene restricted palette (~24 colors)
  const P = {
    WALL_1: '#3A2818', WALL_2: '#4A3828', WALL_3: '#5A4838', WALL_4: '#6A5848',
    WALL_5: '#554030', WALL_6: '#483020',
    FLOOR_A: '#9A8A7A', FLOOR_B: '#6A5A4A', FLOOR_C: '#887868',
    STONE_DK: '#2A1A0A', STONE_MD: '#4A3A2A', STONE_LT: '#5A4A3A',
    WOOD_DK: '#3A2210', WOOD_MD: '#5A3A1A', WOOD_LT: '#7A5A2A',
    GOLD_DK: '#8A6A11', GOLD_MD: '#BBAA33', GOLD_LT: '#DDCC44',
    CLOTH_DK: '#551122', CLOTH_MD: '#882233', CLOTH_LT: '#AA3344',
    SG_BLUE: '#3366AA', SG_RED: '#AA2233', SG_GREEN: '#226633', SG_AMBER: '#CC8822',
    FLAME: '#FFAA33', FLAME_TIP: '#FFDD66', WAX: '#EEEEBB',
    OL: '#1A0A00', SKIN: '#CCAA77', BLACK: '#0A0A0A',
    IRON: '#3A3A44', IRON_LT: '#5A5A66',
  };

  // --- WALLS: 6 banded horizontal strips (dark→light→dark) ---
  bandedV(0, 0, W, [
    [P.WALL_1, 20], [P.WALL_6, 25], [P.WALL_2, 35],
    [P.WALL_3, 50], [P.WALL_4, 55], [P.WALL_5, 30], [P.WALL_3, 25]
  ]);

  // Stone block lines on walls (horizontal mortar)
  for (let my = 8; my < 240; my += 12) {
    drawLine(0, my, W, my, P.STONE_DK, 1);
  }
  // Vertical mortar (offset every other row)
  for (let my = 0; my < 240; my += 12) {
    const offset = (Math.floor(my/12) % 2) * 20;
    for (let mx = offset; mx < W; mx += 40) {
      drawLine(mx, my, mx, my+12, P.STONE_DK, 1);
    }
  }
  // Stone pixel noise texture
  dither(0, 0, W, 240, P.WALL_3, P.WALL_2, 6);

  // --- ARCHED CEILING: concentric arcs in stepped colors ---
  const archColors = [P.WALL_1, P.STONE_DK, P.WALL_6, P.WALL_2, P.WALL_1];
  for (let ai = 0; ai < archColors.length; ai++) {
    _ctx.fillStyle = archColors[ai];
    _ctx.beginPath();
    _ctx.arc(320, -40, 355 - ai*4, 0.12, Math.PI-0.12);
    _ctx.fill();
  }
  // Dither between arch bands
  dither(40, 0, 560, 20, P.WALL_1, P.STONE_DK, 0);

  // --- FLOOR: mosaic tiles with 1px outlines ---
  fill(0, 240, W, 80, P.FLOOR_C);
  for (let sy = 241; sy < H; sy += 16) {
    for (let sx = 0; sx < W; sx += 16) {
      const even = ((sx/16 + sy/16) % 2 === 0);
      outline(sx, sy, 15, 15, even ? P.FLOOR_A : P.FLOOR_B, P.STONE_DK);
      // Pixel noise on tiles
      if ((sx + sy) % 32 === 0) dither(sx+2, sy+2, 11, 11, even ? P.FLOOR_A : P.FLOOR_B, P.FLOOR_C, 6);
    }
  }
  // Floor crack lines
  drawLine(120, 245, 150, 310, P.STONE_DK, 1);
  drawLine(150, 310, 155, 320, P.STONE_DK, 1);
  drawLine(400, 250, 430, 295, P.STONE_DK, 1);
  drawLine(500, 242, 510, 280, P.STONE_DK, 1);

  // --- ALTAR: outlined with 2-band shading ---
  outline(270, 50, 100, 95, P.STONE_LT, P.OL);
  // Highlight top edge
  fill(272, 52, 96, 4, P.GOLD_LT);
  // Shadow bottom edge
  fill(272, 138, 96, 5, P.STONE_DK);
  // Body: 2 bands
  bandedV(272, 56, 96, [
    [P.GOLD_MD, 40], [P.GOLD_DK, 37]
  ]);
  // Cross on altar (outlined)
  outline(315, 58, 8, 32, P.GOLD_LT, P.OL);
  outline(305, 68, 28, 7, P.GOLD_LT, P.OL);
  // Altar cloth with banded stripes
  outline(270, 130, 100, 16, P.CLOTH_MD, P.OL);
  fill(270, 130, 100, 3, P.CLOTH_LT);
  fill(270, 143, 100, 3, P.CLOTH_DK);
  dither(272, 133, 96, 10, P.CLOTH_MD, P.CLOTH_DK, 3);
  // Fringe on cloth
  for (let fx = 272; fx < 368; fx += 4) {
    fill(fx, 146, 2, 3, P.GOLD_MD);
  }
  // Candles on altar (pixel art: 2px wide wax + 2x3 flame + 1x1 tip)
  [[280,100],[350,100]].forEach(([cx,cy]) => {
    outline(cx, cy, 5, 22, P.WAX, P.OL);
    fill(cx+1, cy+1, 1, 20, P.GOLD_LT); // highlight stripe
    fill(cx, cy-5, 5, 5, P.FLAME);
    fill(cx+1, cy-6, 3, 2, P.FLAME_TIP);
    fill(cx+2, cy-7, 1, 1, '#FFFFFF');
  });

  // --- ICONS: left wall (outlined frames with banded interiors) ---
  [[85,35,55,70],[95,115,45,55]].forEach(([ix,iy,iw,ih]) => {
    // Ornate frame: double outline
    outline(ix-3, iy-3, iw+6, ih+6, P.GOLD_DK, P.OL);
    outline(ix, iy, iw, ih, P.STONE_DK, P.GOLD_MD);
    // Interior: 3 flat bands
    bandedV(ix+2, iy+2, iw-4, [
      ['#886644', Math.floor((ih-4)/3)],
      ['#775533', Math.floor((ih-4)/3)],
      ['#664422', (ih-4) - 2*Math.floor((ih-4)/3)]
    ], false);
    // Halo — outlined circle approximation
    _ctx.fillStyle = P.GOLD_MD;
    _ctx.beginPath(); _ctx.arc(ix+iw/2, iy+15, 11, Math.PI, 2*Math.PI); _ctx.fill();
    _ctx.fillStyle = P.GOLD_LT;
    _ctx.beginPath(); _ctx.arc(ix+iw/2, iy+15, 9, Math.PI, 2*Math.PI); _ctx.fill();
    // Figure body
    outline(ix+iw/2-6, iy+20, 12, ih-30, '#663322', P.OL);
    // Face
    fill(ix+iw/2-3, iy+18, 6, 7, P.SKIN);
  });

  // --- STAINED GLASS WINDOWS: segmented solid panes with lead lines ---
  [[180,20,40,80],[420,20,40,80]].forEach(([wx,wy,ww,wh]) => {
    // Stone window frame (outlined)
    outline(wx-4, wy-4, ww+8, wh+8, P.STONE_MD, P.OL);
    outline(wx-2, wy-2, ww+4, wh+4, P.STONE_DK, P.OL);
    // Arched top in stone
    _ctx.fillStyle = P.STONE_DK;
    _ctx.beginPath(); _ctx.arc(wx+ww/2, wy+8, ww/2+2, Math.PI, 2*Math.PI); _ctx.fill();
    // 4-color segmented panes (solid, no gradient)
    const paneH = Math.floor((wh-10)/4);
    const paneColors = [P.SG_BLUE, P.SG_AMBER, P.SG_RED, P.SG_GREEN];
    // Arched top pane
    _ctx.fillStyle = P.SG_BLUE;
    _ctx.beginPath(); _ctx.arc(wx+ww/2, wy+8, ww/2-1, Math.PI, 2*Math.PI); _ctx.fill();
    // Rectangular panes
    for (let pi = 0; pi < 4; pi++) {
      fill(wx, wy+8+pi*paneH, ww, paneH, paneColors[pi]);
    }
    // Lead lines (dark grid between panes)
    for (let pi = 1; pi < 4; pi++) {
      drawLine(wx, wy+8+pi*paneH, wx+ww, wy+8+pi*paneH, P.OL, 2);
    }
    // Vertical lead line
    drawLine(wx+ww/2, wy, wx+ww/2, wy+wh, P.OL, 2);
    // Horizontal center
    drawLine(wx, wy+wh/2, wx+ww, wy+wh/2, P.OL, 2);
  });

  // --- VOTIVE CANDLE STAND (right side) ---
  // Iron stand legs
  outline(445, 165, 92, 8, P.WOOD_MD, P.OL);
  fill(447, 173, 3, 67, P.IRON);
  fill(532, 173, 3, 67, P.IRON);
  // Cross-brace
  drawLine(450, 210, 532, 210, P.IRON, 1);
  // Individual candles on rack
  for (let ci = 0; ci < 8; ci++) {
    const cx = 452 + ci * 10;
    const lit = ci < 4 || state.flags.litCandle;
    // Wax body
    outline(cx, 140, 4, 25, P.WAX, P.OL);
    fill(cx+1, 141, 1, 23, P.GOLD_LT); // highlight
    if (lit) {
      // Pixel flame: 3x4 orange + 1x2 yellow tip + 1x1 white
      fill(cx, 135, 4, 5, P.FLAME);
      fill(cx+1, 133, 2, 3, P.FLAME_TIP);
      fill(cx+1, 132, 1, 1, '#FFFFFF');
    }
  }

  // --- WALL SCONCES with iron brackets (left and right walls) ---
  [60, 580].forEach(sx => {
    // Iron bracket
    fill(sx, 80, 3, 20, P.IRON);
    fill(sx-4, 78, 11, 3, P.IRON_LT);
    // Torch/candle holder
    outline(sx-2, 68, 7, 12, P.IRON, P.OL);
    // Flame
    fill(sx-1, 62, 5, 6, P.FLAME);
    fill(sx, 60, 3, 3, P.FLAME_TIP);
    fill(sx+1, 59, 1, 1, '#FFFFFF');
  });

  // --- HANGING CENSER (center, above altar) ---
  // Chain links
  for (let ch = 0; ch < 30; ch += 4) {
    fill(319, ch, 2, 3, P.IRON);
  }
  // Censer body
  outline(314, 30, 12, 10, P.IRON_LT, P.OL);
  outline(312, 38, 16, 4, P.IRON, P.OL);
  // Smoke holes
  fill(316, 31, 1, 1, P.FLAME);
  fill(320, 33, 1, 1, P.FLAME);
  fill(318, 32, 1, 1, P.FLAME);

  // --- WALL TAPESTRY (far left) ---
  outline(15, 50, 30, 80, P.CLOTH_DK, P.OL);
  bandedV(17, 52, 26, [
    [P.CLOTH_LT, 10], [P.CLOTH_MD, 30], [P.CLOTH_DK, 20], [P.CLOTH_MD, 16]
  ]);
  // Simple cross pattern on tapestry
  fill(27, 62, 3, 20, P.GOLD_MD);
  fill(22, 70, 13, 3, P.GOLD_MD);
  // Fringe bottom
  for (let fx = 17; fx < 43; fx += 3) {
    fill(fx, 130, 1, 4, P.GOLD_DK);
  }

  // --- MONK/PRIEST: more detailed pixel art ---
  // Shadow on floor
  dither(525, 237, 30, 5, P.STONE_DK, P.FLOOR_B, 0);
  // Robe (outlined, 2-band shading)
  outline(530, 185, 22, 55, P.BLACK, P.OL);
  bandedH(532, 187, 51, [
    ['#181818', 5], ['#2A2A2A', 8], ['#181818', 5]
  ]);
  // Sleeves
  outline(524, 200, 8, 20, '#222222', P.OL);
  outline(550, 200, 8, 20, '#222222', P.OL);
  // Hands
  fill(525, 218, 6, 5, P.SKIN);
  fill(551, 218, 6, 5, P.SKIN);
  // Cross necklace
  fill(539, 192, 3, 8, P.GOLD_MD);
  fill(536, 196, 9, 2, P.GOLD_MD);
  // Head
  outline(534, 173, 14, 14, P.SKIN, P.OL);
  // Eyes
  fill(537, 177, 2, 2, P.BLACK);
  fill(543, 177, 2, 2, P.BLACK);
  // Nose
  fill(540, 180, 2, 2, '#BB8855');
  // Beard
  outline(534, 184, 14, 6, '#888888', P.OL);
  dither(535, 185, 12, 4, '#888888', '#666666', 0);
  // Hat (kamilavkion)
  outline(530, 164, 22, 12, '#1A1A1A', P.OL);
  outline(534, 158, 14, 8, '#1A1A1A', P.OL);
  fill(538, 156, 6, 4, P.GOLD_DK);
  // Small cross on hat
  fill(540, 157, 2, 3, P.GOLD_MD);
  fill(539, 158, 4, 1, P.GOLD_MD);

  // --- EXIT: church door opening with banded depth ---
  outline(278, 244, 84, 76, P.STONE_DK, P.OL);
  bandedV(280, 245, 80, [
    ['#556688', 10], ['#445577', 15], ['#334466', 20], ['#223355', 30]
  ]);
  // Door frame stone detail
  fill(278, 244, 4, 76, P.STONE_MD);
  fill(358, 244, 4, 76, P.STONE_MD);
  // Arch over door
  _ctx.fillStyle = P.STONE_MD;
  _ctx.beginPath(); _ctx.arc(320, 248, 42, Math.PI, 2*Math.PI); _ctx.fill();
  _ctx.fillStyle = '#334466';
  _ctx.beginPath(); _ctx.arc(320, 248, 38, Math.PI, 2*Math.PI); _ctx.fill();
}

function drawChurchFx() {
  const t = state.tick;

  // --- Candle light pools: sharp-edged concentric circles (3 opacity levels) ---
  // Votive candle rack glow
  for (let ci = 0; ci < 8; ci++) {
    const cx = 452 + ci * 10 + 2;
    const lit = ci < 4 || state.flags.litCandle;
    if (lit) {
      const flicker = Math.sin(t*0.15+ci*2);
      // 3-level sharp light pool
      ctx.fillStyle = `rgba(255,200,100,0.04)`;
      ctx.fillRect(cx-6, 128+flicker, 12, 12);
      ctx.fillStyle = `rgba(255,180,80,0.08)`;
      ctx.fillRect(cx-3, 131+flicker, 6, 6);
      ctx.fillStyle = `rgba(255,220,130,0.12)`;
      ctx.fillRect(cx-1, 133+flicker, 3, 3);
    }
  }

  // Altar candle glow: sharp concentric rectangles
  [[282,95],[352,95]].forEach(([cx,cy]) => {
    const f = 0.02 * Math.sin(t*0.03);
    ctx.fillStyle = `rgba(255,200,100,${0.03+f})`;
    ctx.fillRect(cx-12, cy-12, 24, 24);
    ctx.fillStyle = `rgba(255,200,100,${0.06+f})`;
    ctx.fillRect(cx-6, cy-6, 12, 12);
    ctx.fillStyle = `rgba(255,220,130,${0.10+f})`;
    ctx.fillRect(cx-3, cy-3, 6, 6);
  });

  // Wall sconce glow
  [60, 580].forEach(sx => {
    const f = Math.sin(t*0.08+sx)*0.02;
    ctx.fillStyle = `rgba(255,180,80,${0.03+f})`;
    ctx.fillRect(sx-10, 52, 20, 30);
    ctx.fillStyle = `rgba(255,200,100,${0.06+f})`;
    ctx.fillRect(sx-5, 57, 10, 16);
  });

  // --- Stained glass light: colored rectangles on floor (flat + dithered edges) ---
  const sgAlpha = 0.04 + Math.sin(t*0.008)*0.015;
  // Left window → floor projection
  ctx.save();
  ctx.globalAlpha = sgAlpha;
  ctx.fillStyle = '#DDAA55';
  ctx.fillRect(160, 245, 60, 30);
  ctx.fillStyle = '#AA3344';
  ctx.fillRect(170, 250, 40, 20);
  ctx.restore();
  // Right window → floor projection
  ctx.save();
  ctx.globalAlpha = sgAlpha;
  ctx.fillStyle = '#3366AA';
  ctx.fillRect(420, 245, 60, 30);
  ctx.fillStyle = '#226633';
  ctx.fillRect(430, 250, 40, 20);
  ctx.restore();

  // --- Light shaft from left window (sharp-edged trapezoid, flat color) ---
  ctx.save();
  ctx.globalAlpha = 0.025 + Math.sin(t*0.006)*0.01;
  ctx.fillStyle = '#FFDDAA';
  ctx.beginPath();
  ctx.moveTo(185, 25); ctx.lineTo(215, 25);
  ctx.lineTo(240, 240); ctx.lineTo(155, 240);
  ctx.fill();
  ctx.restore();

  // --- Incense particles (1x1 pixels, more of them) ---
  for (let i = 0; i < 12; i++) {
    const px = 315 + Math.sin(t*0.004+i*1.2)*35;
    const py = 80 - (t*0.08+i*15) % 90;
    const alpha = 0.08 - py*0.0006;
    if (alpha > 0 && py > -10) {
      ctx.fillStyle = `rgba(200,200,220,${alpha})`;
      ctx.fillRect(Math.round(px), Math.round(py+25), 1, 1);
    }
  }

  // Censer smoke (from hanging censer)
  for (let i = 0; i < 6; i++) {
    const px = 318 + Math.sin(t*0.006+i*0.8)*8;
    const py = 25 - (t*0.05+i*8) % 30;
    const alpha = 0.06 - (25-py)*0.003;
    if (alpha > 0 && py > -5) {
      ctx.fillStyle = `rgba(180,180,200,${alpha})`;
      ctx.fillRect(Math.round(px), Math.round(py), 1, 1);
    }
  }
}

