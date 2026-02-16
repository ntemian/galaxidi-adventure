// House scene renderer
// === HOUSE (warm Mediterranean interior) ===
function drawHouseBg() {
  // MI2-grade palette — warm Greek island kitchen at night
  // More color steps, warm/cool contrast, NO pure black outlines on most things
  const P = {
    // Plaster walls — 8 warm tones for smooth banding
    W1: '#8A7A60', W2: '#9A8A70', W3: '#AA9A80', W4: '#B8A88A',
    W5: '#C4B496', W6: '#CCBCA0', W7: '#D4C8A8', W8: '#C0B090',
    // Warm shadow / cool shadow for walls
    WS: '#7A6A50', WC: '#6A6058',
    // Terracotta floor — 6 tones + grout
    T1: '#7A3818', T2: '#8A4420', T3: '#9A5028', T4: '#AA5C30',
    T5: '#B46838', T6: '#9A5828', TG: '#5A2810',
    // Wood — 8 tones from dark to bright
    D1: '#3A2008', D2: '#4A2A10', D3: '#5A3818', D4: '#6A4820',
    D5: '#7A5A2A', D6: '#8A6A34', D7: '#9A7A40', D8: '#AA8A50',
    // Curtain — deep burgundy to bright red, 5 tones
    F1: '#401018', F2: '#581420', F3: '#701828', F4: '#882030', F5: '#A02838',
    // Metal
    M1: '#888890', M2: '#9898A0', M3: '#A8A8B0', M4: '#B8B8C0', M5: '#C8C8D0',
    // Gold
    G1: '#6A5008', G2: '#8A6A10', G3: '#AA8820', G4: '#C8A830', G5: '#E0C840',
    // Iron
    IR1: '#2A2A30', IR2: '#3A3A44', IR3: '#4A4A55',
    // Accent colors
    SKN: '#CCAA77', CRM: '#E8E0D0',
  };

  // === WALLS: 8-band plaster with warm light zone near window ===
  // Left wall (cooler, away from window)
  bandedV(0, 10, 200, [
    [P.WS, 20], [P.W1, 25], [P.W2, 35], [P.W3, 40],
    [P.W4, 35], [P.W3, 30], [P.W2, 20], [P.WS, 10]
  ]);
  // Center wall (warmest, window light)
  bandedV(200, 10, 200, [
    [P.W2, 15], [P.W4, 25], [P.W5, 35], [P.W7, 45],
    [P.W6, 35], [P.W5, 25], [P.W3, 20], [P.W2, 15]
  ]);
  // Right wall (moderate warmth)
  bandedV(400, 10, 240, [
    [P.W1, 18], [P.W3, 25], [P.W4, 40], [P.W5, 40],
    [P.W4, 35], [P.W3, 25], [P.W2, 22], [P.WS, 10]
  ]);
  // Plaster texture — sparse pixel noise (not uniform)
  dither(0, 10, 180, 100, P.W2, P.WC, 6);
  dither(420, 60, 220, 80, P.W3, P.WS, 6);
  // Water stain near ceiling left
  dither(30, 15, 40, 25, P.WS, P.WC, 5);
  // Plaster patch (repaired area)
  fill(110, 100, 20, 18, P.W6);
  dither(110, 100, 20, 18, P.W6, P.W4, 0);
  // Wall crack lines (organic, not straight)
  drawLine(92, 28, 96, 55, P.WS, 1);
  drawLine(96, 55, 94, 72, P.WC, 1);
  drawLine(94, 72, 91, 82, P.WS, 1);
  drawLine(555, 15, 558, 40, P.WC, 1);
  drawLine(558, 40, 560, 48, P.WS, 1);
  // Baseboard — wood moulding with highlight/shadow
  fill(0, 217, W, 8, P.D4);
  fill(0, 217, W, 2, P.D7); // top highlight
  fill(0, 223, W, 2, P.D2); // bottom shadow
  dither(0, 219, W, 3, P.D5, P.D3, 5);

  // === FLOOR: terracotta with perspective, richer tiles ===
  fill(0, 225, W, 95, P.TG); // grout base
  for (let ty = 226; ty < H; ty += 16) {
    const row = Math.floor((ty - 226) / 16);
    const rowOff = (row % 2) * 20;
    // Tiles get slightly darker toward back (perspective)
    const depthDarken = row * 0.08;
    for (let tx = -20 + rowOff; tx < W + 20; tx += 40) {
      // Each tile: 3-band vertical shading for volume
      const tBase = ((tx + ty) % 80 < 40) ? 3 : 1;
      const tc = [P.T1, P.T2, P.T3, P.T4, P.T5, P.T6];
      const topC = tc[Math.min(5, tBase + 1)];
      const midC = tc[tBase];
      const botC = tc[Math.max(0, tBase - 1)];
      // Tile body (grout acts as outline — no black!)
      fill(tx + 1, ty + 1, 38, 2, topC);
      fill(tx + 1, ty + 3, 38, 9, midC);
      fill(tx + 1, ty + 12, 38, 3, botC);
      // Occasional worn/chipped tile
      if ((tx * 13 + ty * 7) % 200 < 15) {
        dither(tx + 8, ty + 4, 10, 6, midC, P.T1, 5);
      }
    }
  }

  // === RUG: woven pattern with fringe ===
  // Rug shadow
  dither(152, 276, 146, 4, P.TG, P.T1, 0);
  fill(155, 230, 140, 48, P.F2);
  // Border stripes
  fill(155, 230, 140, 3, P.G3);
  fill(155, 275, 140, 3, P.G3);
  fill(155, 230, 3, 48, P.G3);
  fill(292, 230, 3, 48, P.G3);
  // Inner field with diamond weave
  bandedV(158, 233, 134, [
    [P.F3, 6], [P.F4, 10], [P.F3, 12], [P.F4, 10], [P.F3, 6]
  ]);
  dither(160, 235, 130, 40, P.F3, P.F2, 3); // weave texture
  // Diamond motifs
  for (let rx = 170; rx < 285; rx += 22) {
    fill(rx + 7, 242, 2, 2, P.G4);
    fill(rx + 5, 244, 6, 2, P.G3);
    fill(rx + 7, 246, 2, 2, P.G4);
    fill(rx + 7, 256, 2, 2, P.G4);
    fill(rx + 5, 258, 6, 2, P.G3);
    fill(rx + 7, 260, 2, 2, P.G4);
  }
  // Fringe
  for (let fx = 157; fx < 293; fx += 2) {
    fill(fx, 278, 1, 3 + (fx % 4 === 0 ? 1 : 0), P.F4);
  }

  // === CEILING BEAMS: thick, weathered wood ===
  // Main beam across top
  fill(0, 0, W, 12, P.D3);
  fill(0, 0, W, 3, P.D6); // top highlight
  fill(0, 9, W, 3, P.D1); // underside shadow
  dither(0, 3, W, 6, P.D4, P.D2, 5); // grain texture
  // Secondary beam grain detail
  for (let gx = 8; gx < W; gx += 14 + (gx % 7)) {
    drawLine(gx, 3, gx + 3, 9, P.D2, 1);
  }
  // Knot holes
  fill(200, 4, 3, 3, P.D1);
  fill(450, 5, 2, 2, P.D1);
  // Iron brackets (subtle, no black outline)
  [160, 480].forEach(bx => {
    fill(bx, 12, 5, 6, P.IR2);
    fill(bx - 1, 12, 7, 2, P.IR3);
    fill(bx + 1, 12, 1, 6, P.IR3); // highlight
  });

  // === WINDOW: deep reveal, arched, atmospheric night view ===
  // Deep stone reveal (shows wall thickness)
  fill(210, 8, 140, 124, P.D3); // outer frame
  fill(213, 10, 134, 120, P.D2);
  // Reveal sides — 3-band depth
  bandedH(213, 14, 106, [
    [P.WS, 4], [P.WC, 3]
  ]);
  bandedH(340, 14, 106, [
    [P.WC, 3], [P.WS, 4]
  ]);
  // Window glass area
  fill(220, 18, 120, 104, '#081828');
  // Night sky — 5 smooth-ish bands
  bandedV(220, 18, 120, [
    ['#040810', 8], ['#081420', 12], ['#0C1C30', 14],
    ['#102840', 10], ['#183050', 8]
  ]);
  // Moon (small, high)
  fill(305, 22, 5, 5, '#AABBCC');
  fill(306, 23, 3, 3, '#CCDDEE');
  fill(307, 24, 1, 1, '#EEEEFF');
  // Stars
  [[230,20],[248,25],[262,19],[290,22],[315,28],[330,21],[325,32],[240,30]].forEach(([sx,sy]) => {
    fill(sx, sy, 1, 1, '#8899BB');
  });
  // Horizon glow
  dither(220, 48, 120, 6, '#183050', '#1A3858', 0);
  // Sea — banded with subtle wave highlights
  bandedV(220, 54, 120, [
    ['#0C2444', 14], ['#102838', 16], ['#081C30', 16], ['#0A2040', 12]
  ]);
  // Moonlight on water
  fill(300, 58, 8, 1, '#2A5577');
  fill(296, 62, 12, 1, '#1A4466');
  fill(302, 66, 6, 1, '#2A5577');
  fill(298, 70, 3, 1, '#1A4466');
  // Distant boat silhouette
  fill(248, 64, 10, 2, '#040C20');
  fill(250, 62, 6, 2, '#040C20');
  fill(253, 58, 1, 5, '#040C20');
  // Window frame mullions (wood color, not black)
  fill(277, 18, 5, 104, P.W4);
  fill(278, 18, 3, 104, P.W6); // highlight
  fill(220, 66, 120, 4, P.W4);
  fill(220, 67, 120, 2, P.W6);
  // Arch
  _ctx.fillStyle = P.D3;
  _ctx.beginPath(); _ctx.arc(280, 26, 62, Math.PI, 2 * Math.PI); _ctx.fill();
  _ctx.fillStyle = P.D2;
  _ctx.beginPath(); _ctx.arc(280, 26, 60, Math.PI, 2 * Math.PI); _ctx.fill();
  _ctx.fillStyle = '#081420';
  _ctx.beginPath(); _ctx.arc(280, 26, 58, Math.PI, 2 * Math.PI); _ctx.fill();
  // Arch mullion
  fill(278, 8, 4, 18, P.W5);

  // === CURTAINS: rich folds with proper light/shadow ===
  // Left curtain — 6 vertical fold bands
  fill(204, 8, 20, 124, P.F2);
  bandedH(204, 10, 120, [
    [P.F1, 2], [P.F3, 4], [P.F5, 3], [P.F4, 4], [P.F2, 3], [P.F1, 2]
  ]);
  dither(204, 10, 18, 120, P.F3, P.F1, 4); // fabric texture
  // Right curtain
  fill(336, 8, 20, 124, P.F2);
  bandedH(336, 10, 120, [
    [P.F1, 2], [P.F2, 3], [P.F4, 4], [P.F5, 3], [P.F3, 4], [P.F1, 2]
  ]);
  dither(338, 10, 16, 120, P.F3, P.F1, 4);
  // Curtain rod
  fill(202, 7, 154, 4, P.IR2);
  fill(202, 7, 154, 1, P.IR3); // highlight
  // Finials
  fill(199, 5, 5, 8, P.IR2);
  fill(200, 6, 3, 2, P.IR3);
  fill(354, 5, 5, 8, P.IR2);
  fill(355, 6, 3, 2, P.IR3);
  // Tie-backs with tassels
  fill(220, 90, 2, 4, P.G2);
  fill(219, 94, 4, 6, P.G3);
  fill(219, 100, 1, 3, P.G2);
  fill(222, 100, 1, 3, P.G2);
  fill(339, 90, 2, 4, P.G2);
  fill(338, 94, 4, 6, P.G3);
  fill(338, 100, 1, 3, P.G2);
  fill(341, 100, 1, 3, P.G2);

  // === TABLE: proper 3D volume with thick top, turned legs ===
  // Table shadow on floor
  dither(142, 227, 168, 6, P.TG, P.T1, 0);
  // Table top — thick slab with rounded front edge
  fill(134, 148, 184, 4, P.D7); // top surface highlight
  fill(134, 152, 184, 5, P.D5); // front face
  fill(134, 157, 184, 3, P.D3); // underside shadow
  // Wood grain on top
  for (let gx = 138; gx < 316; gx += 8 + (gx % 5)) {
    drawLine(gx, 148, gx + 2, 152, P.D4, 1);
  }
  dither(136, 149, 180, 2, P.D6, P.D5, 5);
  // Table apron (front skirt)
  fill(136, 160, 180, 5, P.D3);
  fill(136, 160, 180, 1, P.D5); // top edge
  fill(136, 164, 180, 1, P.D1); // bottom shadow
  // Turned legs — thicker, shaped
  // Left leg
  fill(140, 165, 8, 60, P.D4);
  fill(141, 165, 2, 60, P.D6); // highlight
  fill(146, 165, 2, 60, P.D2); // shadow
  fill(138, 175, 12, 3, P.D5); // bulge
  fill(138, 200, 12, 3, P.D5); // bulge
  // Right leg
  fill(304, 165, 8, 60, P.D4);
  fill(305, 165, 2, 60, P.D6);
  fill(310, 165, 2, 60, P.D2);
  fill(302, 175, 12, 3, P.D5);
  fill(302, 200, 12, 3, P.D5);
  // Stretcher bar
  fill(148, 208, 156, 2, P.D3);
  fill(148, 208, 156, 1, P.D5);

  // Tablecloth runner — draped, not flat
  fill(180, 147, 90, 2, P.F4);
  fill(180, 147, 90, 1, P.F5); // highlight
  // Hanging ends of runner
  fill(180, 149, 8, 12, P.F3);
  fill(181, 149, 2, 12, P.F4); // fold
  fill(262, 149, 8, 12, P.F3);
  fill(264, 149, 2, 12, P.F4);
  dither(182, 152, 4, 8, P.F3, P.F2, 3);
  dither(264, 152, 4, 8, P.F3, P.F2, 3);

  // === TABLE ITEMS: more volume, less outline ===
  // Plate — ceramic with glaze
  _ctx.fillStyle = P.D2;
  _ctx.beginPath(); _ctx.ellipse(200, 146, 15, 4, 0, 0, Math.PI * 2); _ctx.fill();
  _ctx.fillStyle = P.CRM;
  _ctx.beginPath(); _ctx.ellipse(200, 146, 14, 3.5, 0, 0, Math.PI * 2); _ctx.fill();
  _ctx.fillStyle = '#D8D0C0';
  _ctx.beginPath(); _ctx.ellipse(200, 146, 10, 2.5, 0, 0, Math.PI * 2); _ctx.fill();
  // Blue rim pattern
  _ctx.strokeStyle = '#6688AA';
  _ctx.lineWidth = 0.5;
  _ctx.beginPath(); _ctx.ellipse(200, 146, 12, 3, 0, 0, Math.PI * 2); _ctx.stroke();
  // Bread on plate
  fill(195, 141, 10, 4, '#C8A050');
  fill(196, 141, 8, 1, '#DDBB66'); // crust highlight
  dither(196, 142, 8, 2, '#C8A050', '#B89040', 5);

  // Wine glass
  fill(228, 143, 1, 5, P.D5); // stem
  fill(226, 148, 5, 1, P.D5); // base
  fill(225, 136, 7, 7, '#551133'); // bowl
  fill(226, 137, 2, 5, '#772244'); // highlight
  fill(230, 137, 1, 4, '#441028'); // shadow
  fill(227, 135, 3, 1, '#661133'); // rim

  // Olive oil bottle — glass with golden liquid
  fill(255, 130, 8, 16, '#667744');
  fill(256, 131, 6, 14, '#88AA44'); // body
  fill(257, 132, 2, 12, '#AACC66'); // highlight
  fill(262, 132, 1, 10, '#556633'); // shadow
  fill(257, 127, 4, 4, '#556633'); // neck
  fill(258, 125, 2, 3, '#444433'); // cork

  // Fruit bowl — terracotta bowl with fruits piled
  _ctx.fillStyle = '#7A5A30';
  _ctx.beginPath(); _ctx.ellipse(290, 146, 16, 5, 0, 0, Math.PI * 2); _ctx.fill();
  _ctx.fillStyle = '#8A6A3A';
  _ctx.beginPath(); _ctx.ellipse(290, 146, 14, 4, 0, 0, Math.PI * 2); _ctx.fill();
  // Apple
  fill(283, 138, 6, 6, '#44AA44');
  fill(284, 139, 2, 3, '#66CC66'); // highlight
  fill(286, 137, 1, 2, '#336622'); // stem
  // Orange
  fill(291, 137, 7, 7, '#CC6622');
  fill(292, 138, 3, 3, '#DD8833'); // highlight
  // Grapes cluster
  fill(299, 140, 3, 3, '#664488');
  fill(301, 141, 3, 3, '#664488');
  fill(300, 138, 3, 3, '#7755AA');

  // Knife
  fill(310, 146, 10, 1, '#AAAABC');
  fill(310, 147, 10, 1, '#888898');
  fill(306, 145, 5, 3, P.D4);
  fill(307, 146, 3, 1, P.D6);

  // === DRAWER ===
  if (state.flags.drawerOpen) {
    fill(165, 208, 85, 24, P.D2);
    fill(167, 210, 81, 20, '#1A0C04');
    fill(167, 210, 81, 1, P.D4); // inner edge
    if (!state.flags.letterTaken) {
      fill(185, 213, 20, 14, '#DDCC88');
      fill(186, 214, 18, 1, '#EEDD99'); // highlight
      fill(193, 213, 4, 4, '#AA2222'); // wax seal
      fill(194, 214, 2, 2, '#CC3333');
    }
  } else {
    fill(165, 208, 85, 24, P.D4);
    fill(166, 209, 83, 1, P.D7); // top highlight
    fill(166, 230, 83, 2, P.D2); // bottom shadow
    dither(168, 212, 79, 14, P.D4, P.D3, 5);
    // Handle — brass
    fill(198, 217, 20, 5, P.G2);
    fill(199, 218, 18, 1, P.G4); // highlight
    fill(199, 221, 18, 1, P.G1); // shadow
  }

  // === SHELF + LANTERN ===
  // Wall shadow under shelf
  dither(434, 176, 64, 8, P.WS, P.WC, 5);
  // Shelf board
  fill(433, 168, 68, 6, P.D4);
  fill(434, 168, 66, 2, P.D7); // top surface
  fill(434, 174, 66, 1, P.D1); // underside shadow
  dither(436, 170, 62, 2, P.D5, P.D3, 5);
  // Brackets (triangular supports)
  fill(437, 174, 3, 12, P.D3);
  fill(437, 174, 12, 2, P.D3);
  fill(496, 174, 3, 12, P.D3);
  fill(487, 174, 12, 2, P.D3);

  // Pottery jug on shelf
  fill(441, 155, 10, 13, '#886644');
  fill(442, 156, 3, 11, '#9A7855'); // highlight
  fill(449, 157, 2, 9, '#6A5030'); // shadow
  fill(444, 153, 4, 3, '#886644'); // rim
  fill(450, 159, 4, 6, '#7A5A3A'); // handle

  if (!state.flags.lanternTaken) {
    // Lantern — glass + brass + warm glow
    fill(459, 138, 3, 10, P.IR2); // handle
    fill(453, 147, 14, 3, P.G2); // top cap
    fill(454, 147, 12, 1, P.G4); // cap highlight
    // Glass body — warm glow from within
    fill(454, 150, 12, 17, '#DDBB55');
    fill(455, 151, 10, 15, '#EEDD77');
    fill(457, 153, 6, 11, '#FFEE99');
    fill(459, 155, 2, 7, '#FFFFCC'); // bright center
    fill(453, 167, 14, 3, P.G2); // bottom cap
    fill(454, 167, 12, 1, P.G4);
  }

  // Blue ceramic jar
  fill(485, 156, 8, 12, '#3A5A7A');
  fill(486, 157, 3, 10, '#4A7A9A'); // highlight
  fill(491, 158, 2, 8, '#2A4A6A'); // shadow
  fill(486, 154, 6, 3, '#3A5A7A'); // lid
  fill(487, 153, 4, 2, '#4A6A8A');

  // === FRIDGE: proper appliance feel ===
  // Body
  fill(528, 48, 80, 180, P.M3);
  fill(529, 49, 78, 2, P.M5); // top highlight
  fill(529, 49, 2, 176, P.M4); // left highlight
  fill(605, 49, 2, 176, P.M1); // right shadow
  fill(529, 226, 78, 2, P.M1); // bottom shadow
  // Rubber seal line
  fill(530, 134, 76, 3, P.M1);
  // Upper door surface
  dither(532, 52, 72, 80, P.M3, P.M2, 6);
  // Lower door surface
  dither(532, 140, 72, 84, P.M3, P.M2, 6);
  // Handles — chrome-like
  fill(602, 85, 5, 22, P.M1);
  fill(603, 86, 3, 20, P.M4);
  fill(604, 87, 1, 18, P.M5); // highlight
  fill(602, 155, 5, 22, P.M1);
  fill(603, 156, 3, 20, P.M4);
  fill(604, 157, 1, 18, P.M5);
  // Photo magnet on upper door
  fill(545, 60, 14, 16, '#3A3A44'); // shadow behind
  fill(544, 59, 14, 16, '#CCBB99'); // photo
  fill(545, 60, 12, 1, '#DDCCAA'); // highlight
  dither(546, 62, 10, 10, '#CCBB99', '#BBAA88', 5);
  fill(548, 63, 3, 3, '#AA6644'); // tiny face in photo
  // Magnet
  fill(548, 75, 6, 3, '#CC3333');

  // === WALL CLOCK ===
  fill(575, 18, 28, 30, P.D3);
  fill(576, 19, 26, 28, P.D5);
  fill(577, 20, 24, 26, P.CRM);
  dither(578, 21, 22, 24, P.CRM, '#DDD8C8', 6);
  // Face circle
  _ctx.strokeStyle = P.D3;
  _ctx.lineWidth = 1.5;
  _ctx.beginPath(); _ctx.arc(589, 33, 10, 0, Math.PI * 2); _ctx.stroke();
  // Hour dots
  for (let h = 0; h < 12; h++) {
    const a = h * Math.PI / 6 - Math.PI / 2;
    const hx = 589 + Math.cos(a) * 8;
    const hy = 33 + Math.sin(a) * 8;
    fill(Math.round(hx), Math.round(hy), 1, 1, P.D2);
  }
  // Hands
  drawLine(589, 33, 589, 26, P.D1, 1);
  drawLine(589, 33, 595, 31, P.D2, 1);
  fill(588, 32, 2, 2, P.G3); // center

  // === PAINTING: rich seascape in ornate frame ===
  // Frame — 3 layers of moulding
  fill(366, 26, 90, 69, P.G1); // outer
  fill(368, 28, 86, 65, P.D2); // middle
  fill(370, 30, 82, 61, P.G2); // inner
  fill(371, 31, 80, 1, P.G4); // inner highlight
  // Canvas
  fill(373, 33, 76, 56, '#1A3060');
  // Painted sky — sunset bands
  bandedV(373, 33, 76, [
    ['#1A2850', 8], ['#2A3868', 7], ['#3A5080', 6],
    ['#4A6898', 5], ['#3A5070', 4]
  ], true);
  // Painted sea
  bandedV(373, 63, 76, [
    ['#1A4060', 8], ['#183858', 8], ['#1A3050', 10]
  ], true);
  // Painted headland/trees
  fill(373, 58, 30, 8, '#1A3A18');
  fill(380, 55, 15, 5, '#1A3A18');
  // Painted boats — white sails catching light
  fill(400, 50, 8, 3, '#CCCCBB');
  fill(403, 47, 1, 4, '#CCCCBB'); // mast
  fill(403, 46, 4, 1, '#CCCCBB'); // flag
  fill(420, 52, 6, 2, '#CC4433');
  fill(422, 49, 1, 4, '#AA8866'); // mast
  // Sunset glow on water
  fill(410, 65, 15, 1, '#4A6888');
  fill(405, 70, 8, 1, '#3A5878');
  // Painted moon
  fill(438, 36, 3, 3, '#AABBCC');
  fill(439, 37, 1, 1, '#CCDDEE');

  // === BOOKSHELF: deep recessed shelves ===
  fill(458, 26, 66, 98, P.D3); // frame
  fill(459, 27, 64, 96, P.D4);
  fill(460, 28, 62, 94, P.D1); // deep interior shadow
  [35, 55, 75, 95].forEach(sy => {
    // Shelf board
    fill(459, sy, 64, 3, P.D5);
    fill(460, sy, 62, 1, P.D7); // highlight
    fill(460, sy + 2, 62, 1, P.D3); // underside
    // Books — varied, with spine detail
    const books = [
      ['#AA2222', 6, 14], ['#223388', 5, 16], ['#228833', 7, 13],
      ['#774422', 5, 15], ['#883388', 6, 12], ['#2266AA', 7, 17], ['#997722', 5, 14]
    ];
    let bx = 462;
    books.forEach(([c, bw, bh]) => {
      if (bx + bw > 518) return;
      fill(bx, sy - bh, bw, bh, c);
      // Lighter spine edge (volume)
      fill(bx, sy - bh, 1, bh, '#FFFFFF18');
      // Darker far edge
      fill(bx + bw - 1, sy - bh, 1, bh, '#00000030');
      // Title mark on some
      if (bw > 5) fill(bx + 1, sy - bh + 3, bw - 2, 1, '#FFFFFF20');
      bx += bw + 1;
    });
  });

  // === DOOR: heavy wood with iron hardware ===
  // Frame reveal — shows wall depth
  fill(4, 92, 70, 150, P.D1);
  fill(6, 94, 66, 146, P.D2);
  // Door surface — rich vertical banding
  bandedH(8, 96, 140, [
    [P.D6, 6], [P.D5, 12], [P.D7, 8], [P.D6, 10],
    [P.D5, 8], [P.D4, 6], [P.D3, 6]
  ]);
  dither(10, 98, 54, 136, P.D5, P.D3, 5); // grain
  // Upper panels — recessed
  fill(15, 105, 24, 52, P.D3);
  fill(16, 106, 22, 50, P.D4);
  fill(17, 107, 20, 1, P.D6); // panel highlight
  fill(41, 105, 24, 52, P.D3);
  fill(42, 106, 22, 50, P.D4);
  fill(43, 107, 20, 1, P.D6);
  // Lower panels
  fill(15, 164, 24, 62, P.D3);
  fill(16, 165, 22, 60, P.D4);
  fill(17, 166, 20, 1, P.D6);
  fill(41, 164, 24, 62, P.D3);
  fill(42, 165, 22, 60, P.D4);
  fill(43, 166, 20, 1, P.D6);
  // Hinges — iron, substantial
  [[108, 3], [188, 3]].forEach(([hy]) => {
    fill(6, hy, 14, 5, P.IR1);
    fill(7, hy + 1, 12, 1, P.IR3); // highlight
    fill(8, hy + 1, 2, 3, P.IR3); // pin
  });
  // Handle — ornate brass
  _ctx.fillStyle = P.G1;
  _ctx.beginPath(); _ctx.arc(60, 180, 5, 0, Math.PI * 2); _ctx.fill();
  _ctx.fillStyle = P.G3;
  _ctx.beginPath(); _ctx.arc(60, 180, 4, 0, Math.PI * 2); _ctx.fill();
  _ctx.fillStyle = P.G5;
  _ctx.beginPath(); _ctx.arc(60, 180, 2, 0, Math.PI * 2); _ctx.fill();
  // Keyhole escutcheon
  fill(56, 185, 6, 8, P.G2);
  fill(57, 186, 4, 6, P.G3);
  fill(58, 188, 2, 3, '#0A0808');
  // Light under door — warm, dithered edge
  fill(10, 236, 58, 4, '#FFE8B8');
  dither(10, 234, 58, 3, '#FFE8B8', P.T3, 0);
  fill(12, 237, 54, 2, '#FFEEDD');

  // === COAT HOOKS + HANGING ITEMS ===
  // Hooks (iron)
  fill(80, 114, 3, 8, P.IR2);
  fill(79, 113, 5, 2, P.IR3);
  fill(80, 139, 3, 8, P.IR2);
  fill(79, 138, 5, 2, P.IR3);
  // Sailor's jacket — proper folds
  fill(74, 121, 14, 24, '#2A3848');
  fill(75, 122, 4, 22, '#3A4858'); // fold highlight
  fill(84, 122, 3, 22, '#1A2838'); // fold shadow
  dither(76, 125, 10, 16, '#2A3848', '#1A2838', 4);
  // Collar
  fill(76, 121, 10, 3, '#3A4858');
  // Cap
  fill(76, 107, 10, 7, '#4A3828');
  fill(77, 108, 8, 2, '#5A4838'); // band highlight
  fill(74, 113, 14, 2, '#4A3828'); // brim

  // === HANGING OIL LAMP (repositioned — not over window) ===
  // Chain from beam
  for (let ch = 12; ch < 38; ch += 3) {
    fill(175, ch, 2, 2, P.IR2);
    if (ch % 6 === 0) fill(175, ch, 2, 1, P.IR3);
  }
  // Brass lamp body
  fill(170, 38, 12, 4, P.G2);
  fill(171, 38, 10, 1, P.G4);
  fill(168, 42, 16, 10, P.G3);
  fill(169, 43, 14, 8, P.G4);
  // Glass globe — warm glow
  fill(170, 44, 12, 6, '#FFEE88');
  fill(172, 45, 8, 4, '#FFFFBB');
  fill(174, 46, 4, 2, '#FFFFDD');
  fill(168, 52, 16, 2, P.G2);
  fill(169, 52, 14, 1, P.G4);

  // === WALL DETAILS: icon corner, small shelf ===
  // Small icon/religious picture (Greek house detail)
  fill(105, 30, 22, 28, P.G2); // frame
  fill(106, 31, 20, 26, P.G3);
  fill(108, 33, 16, 22, '#554433');
  bandedV(109, 34, 14, [
    ['#776655', 5], ['#665544', 8], ['#554433', 7]
  ], false);
  // Halo
  _ctx.fillStyle = P.G4;
  _ctx.beginPath(); _ctx.arc(116, 40, 4, Math.PI, 2 * Math.PI); _ctx.fill();
  // Figure
  fill(113, 43, 6, 10, '#553322');
  fill(114, 41, 4, 3, P.SKN);
  // Kandili (oil lamp) below icon
  fill(115, 60, 2, 6, P.IR2); // chain
  fill(112, 66, 8, 4, P.G2);
  fill(114, 67, 4, 2, '#FFAA33'); // flame

  // Small wall shelf near fridge
  fill(530, 28, 40, 4, P.D5);
  fill(531, 28, 38, 1, P.D7);
  fill(531, 32, 38, 1, P.D2);
  fill(534, 32, 2, 8, P.D3);
  fill(564, 32, 2, 8, P.D3);
  // Ceramic jug
  fill(540, 16, 10, 12, '#886644');
  fill(541, 17, 3, 10, '#9A7855');
  fill(548, 18, 2, 8, '#6A5030');
  fill(543, 14, 4, 3, '#886644');
  fill(549, 19, 3, 5, '#7A5A3A'); // handle
  // Glass bottle
  fill(556, 18, 6, 10, '#336644');
  fill(557, 19, 2, 8, '#448855');
  fill(557, 15, 4, 4, '#2A5533');
  fill(558, 14, 2, 2, '#3A5540');
}

function drawHouseFx() {
  const t = state.tick;

  // === MOONLIGHT BEAM: layered trapezoid with cool tint ===
  // Outer beam (faint)
  ctx.save();
  ctx.globalAlpha = 0.018 + Math.sin(t * 0.008) * 0.006;
  ctx.fillStyle = '#AABBDD';
  ctx.beginPath();
  ctx.moveTo(215, 18); ctx.lineTo(345, 18);
  ctx.lineTo(390, 225); ctx.lineTo(170, 225);
  ctx.fill();
  ctx.restore();
  // Inner beam (brighter)
  ctx.save();
  ctx.globalAlpha = 0.03 + Math.sin(t * 0.012) * 0.008;
  ctx.fillStyle = '#CCDDEE';
  ctx.beginPath();
  ctx.moveTo(230, 18); ctx.lineTo(330, 18);
  ctx.lineTo(355, 225); ctx.lineTo(200, 225);
  ctx.fill();
  ctx.restore();
  // Core beam (brightest, narrow)
  ctx.save();
  ctx.globalAlpha = 0.02 + Math.sin(t * 0.015) * 0.005;
  ctx.fillStyle = '#DDEEFF';
  ctx.beginPath();
  ctx.moveTo(250, 18); ctx.lineTo(310, 18);
  ctx.lineTo(330, 225); ctx.lineTo(230, 225);
  ctx.fill();
  ctx.restore();

  // === OIL LAMP GLOW: warm pool radiating down ===
  const lf = Math.sin(t * 0.07) * 0.008;
  // Wide warm zone
  ctx.fillStyle = `rgba(255,220,140,${0.02 + lf})`;
  ctx.fillRect(130, 30, 100, 140);
  // Medium zone
  ctx.fillStyle = `rgba(255,210,120,${0.035 + lf})`;
  ctx.fillRect(150, 38, 60, 90);
  // Bright core
  ctx.fillStyle = `rgba(255,230,160,${0.06 + lf})`;
  ctx.fillRect(165, 40, 22, 20);

  // === KANDILI (icon lamp) GLOW ===
  const kf = Math.sin(t * 0.05 + 1) * 0.01;
  ctx.fillStyle = `rgba(255,180,80,${0.03 + kf})`;
  ctx.fillRect(100, 55, 30, 35);
  ctx.fillStyle = `rgba(255,200,100,${0.05 + kf})`;
  ctx.fillRect(108, 62, 14, 16);

  // === LANTERN GLOW (if on shelf) ===
  if (!state.flags.lanternTaken) {
    const ltf = Math.sin(t * 0.06 + 2) * 0.012;
    ctx.fillStyle = `rgba(255,220,100,${0.025 + ltf})`;
    ctx.fillRect(430, 120, 65, 70);
    ctx.fillStyle = `rgba(255,230,130,${0.05 + ltf})`;
    ctx.fillRect(442, 135, 36, 45);
    ctx.fillStyle = `rgba(255,240,160,${0.07 + ltf})`;
    ctx.fillRect(450, 145, 20, 28);
  }

  // === DUST MOTES: varied sizes, slow float, in-beam highlight ===
  for (let i = 0; i < 16; i++) {
    const mx = 200 + Math.sin(t * 0.005 + i * 1.3) * 65;
    const my = 20 + (t * 0.12 + i * 25) % 200;
    const inBeam = mx > 210 && mx < 340 && my < 220;
    const alpha = inBeam ? 0.15 + Math.sin(t * 0.01 + i) * 0.08 : 0.03;
    ctx.fillStyle = inBeam ? `rgba(220,230,255,${alpha})` : `rgba(255,240,200,${alpha})`;
    ctx.fillRect(Math.round(mx), Math.round(my), 1, 1);
  }

  // === CLOCK PENDULUM ===
  const pend = Math.sin(t * 0.03) * 3;
  ctx.fillStyle = '#5A3A18';
  ctx.fillRect(Math.round(588 + pend), 49, 2, 13);
  ctx.fillStyle = C.GOLD;
  ctx.beginPath(); ctx.arc(589 + pend, 63, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = C.GOLD_BRIGHT;
  ctx.beginPath(); ctx.arc(589 + pend, 62, 1, 0, Math.PI * 2); ctx.fill();

  // === DOOR LIGHT: warm flicker ===
  const df = Math.sin(t * 0.025) * 0.04;
  ctx.fillStyle = `rgba(255,235,190,${0.35 + df})`;
  ctx.fillRect(10, 237, 58, 2);
  ctx.fillStyle = `rgba(255,240,200,${0.15 + df})`;
  ctx.fillRect(12, 234, 54, 3);
}

