// ============================================================
// CHARACTER — drawCharacter(), drawPerson(), animations
// ============================================================

// Per-character anatomy: waist split ratio & max leg stride (pixels)
const WALK_ANATOMY = {
  ntemis: { waist: 0.62, stride: 7 },
  ajax:   { waist: 0.58, stride: 6 },
  clio:   { waist: 0.60, stride: 6 },
};

function drawCharacter() {
  const x = state.charX;
  const y = state.charY;
  const d = state.charDir;
  const w = state.charWalking;
  const f = state.charFrame;
  const t = state.tick;

  function drawSprite(who, sx, sy, frameOffset) {
    // Always use idle sprite — procedural animation handles walk
    const img = CHAR_SPRITES[who];
    if (!img || !img.complete) {
      drawPerson(sx, sy, d, w, f, '#2A4466', '#3A5577', '#DDAA88', '#222', 0, who);
      return;
    }
    const sprW = img.naturalWidth;
    const sprH = img.naturalHeight;
    const anat = WALK_ANATOMY[who] || { waist: 0.60, stride: 6 };

    if (w) {
      // ── WALK PHASE — continuous tick-based for smooth animation ──
      const walkPhase = t * 0.15 + frameOffset * Math.PI / 3;
      const bob = -Math.abs(Math.sin(walkPhase)) * 3;
      const lean = d * 0.025;
      const strideDir = Math.sin(walkPhase); // -1 to 1

      const waistY = Math.floor(sprH * anat.waist);
      const legH = sprH - waistY;
      const maxStride = anat.stride;

      // Ground shadow (stretches with stride)
      ctx.save();
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = '#4A3A28';
      const sw = sprW * 0.6 + Math.abs(strideDir) * 3;
      ctx.beginPath();
      ctx.ellipse(sx, sy + 3, sw, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.translate(sx, sy + bob);
      if (d < 0) ctx.scale(-1, 1);
      ctx.rotate(lean);

      // ── UPPER BODY (slight counter-sway) ──
      const counterSway = -strideDir * 1.5;
      ctx.drawImage(img,
        0, 0, sprW, waistY,
        -sprW/2 + counterSway, -sprH, sprW, waistY
      );

      // ── BACK LEG (drawn first, darker, shifted opposite, lifted) ──
      const bandH = 2;
      ctx.save();
      ctx.globalAlpha = 0.7;
      for (let ly = 0; ly < legH; ly += bandH) {
        const progress = ly / Math.max(1, legH - 1);
        const backOff = -strideDir * maxStride * 0.7 * (0.3 + 0.7 * progress);
        const lift = Math.abs(strideDir) * 3 * progress;
        const h = Math.min(bandH, legH - ly);
        ctx.drawImage(img,
          0, waistY + ly, sprW, h,
          -sprW/2 + backOff, -sprH + waistY + ly - lift, sprW, h
        );
      }
      ctx.restore();

      // ── FRONT LEG (on top, full brightness, shifted forward) ──
      for (let ly = 0; ly < legH; ly += bandH) {
        const progress = ly / Math.max(1, legH - 1);
        const frontOff = strideDir * maxStride * (0.3 + 0.7 * progress);
        const h = Math.min(bandH, legH - ly);
        ctx.drawImage(img,
          0, waistY + ly, sprW, h,
          -sprW/2 + frontOff, -sprH + waistY + ly, sprW, h
        );
      }

      ctx.restore();

    } else {
      // ── IDLE ANIMATION — compound sine waves ──
      const bp = t * 0.03 + frameOffset * 3;
      const breathe = Math.sin(bp) * 1.0 + Math.sin(bp * 0.6 + 0.5) * 0.4;
      const sway = Math.sin(t * 0.01 + frameOffset * 2.5) * 0.008
                 + Math.sin(t * 0.023 + frameOffset) * 0.003;
      const bc = Math.sin(bp);
      const squashX = 1 + bc * 0.005;
      const squashY = 1 - bc * 0.005;

      // Ground shadow
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = '#4A3A28';
      ctx.beginPath();
      ctx.ellipse(sx, sy + 3, sprW * 0.6, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.translate(sx, sy + breathe);
      if (d < 0) ctx.scale(-1, 1);
      ctx.rotate(sway);
      ctx.scale(squashX, squashY);
      ctx.drawImage(img, -sprW/2, -sprH);
      ctx.restore();
    }
  }

  // Draw family: back to front for depth
  drawSprite('clio', x - 30 * d, y + 8, 2.1);
  drawSprite('ajax', x + 30 * d, y + 4, 1.05);
  drawSprite('ntemis', x, y, 0);
}

function drawPerson(x, y, dir, walking, frame, shirtDark, shirtLight, skin, hair, hOff, who) {
  const h = hOff;
  const isMainChar = (who === 'ntemis');

  // --- PROPER WALK CYCLE (#3) — 8-frame with distinct leg/arm poses ---
  // Walk frames: 0-7 maps to full stride cycle
  const walkPhase = walking ? (frame / 8) * Math.PI * 2 : 0;
  const leftLeg = walking ? Math.sin(walkPhase) * 7 : 0;
  const rightLeg = walking ? Math.sin(walkPhase + Math.PI) * 7 : 0;
  const leftArm = walking ? Math.sin(walkPhase + Math.PI) * 6 : 0;
  const rightArm = walking ? Math.sin(walkPhase) * 6 : 0;
  // Body bob — up at mid-stride, down at full extension
  const bodyBob = walking ? -Math.abs(Math.sin(walkPhase * 2)) * 2 : 0;
  // Body lean — slight forward lean when walking
  const bodyLean = walking ? Math.sin(walkPhase) * 0.5 : 0;

  // --- IDLE ANIMATIONS (#4) — breathing, blinking, looking around ---
  const breathOffset = !walking && isMainChar ? Math.sin(state.breathPhase) * 1.2 : 0;
  const isBlinking = !walking && isMainChar && state.blinkDuration > 0 && state.blinkTimer <= 0;
  const idleLook = !walking && isMainChar ? state.lookDir : 0;

  // --- DIRECTIONAL SHADOW (#12) — elongated based on scene lighting ---
  const shadowStretch = (state.scene === 'cave') ? 1.4 : (state.scene === 'hilltop') ? 1.2 : 1.0;
  const shadowOffset = (state.scene === 'hilltop' || state.scene === 'beach') ? 5 : 0;
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.beginPath();
  ctx.ellipse(x + shadowOffset, y+3, 16 * shadowStretch, 5, 0, 0, Math.PI*2);
  ctx.fill();
  // Inner darker core
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.beginPath();
  ctx.ellipse(x + shadowOffset*0.5, y+3, 10, 4, 0, 0, Math.PI*2);
  ctx.fill();

  // --- Soft dark outline for painted bg harmony ---
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 2;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;

  const by = bodyBob + breathOffset; // combined vertical offset

  // Feet/shoes — proper walk positions
  ctx.fillStyle = '#333';
  ctx.fillRect(x-7 + bodyLean, y-3+leftLeg, 6, 6);
  ctx.fillRect(x+1 + bodyLean, y-3+rightLeg, 6, 6);
  // Shoe detail
  ctx.fillStyle = '#444';
  ctx.fillRect(x-7 + bodyLean + (dir>0?3:-1), y-3+leftLeg, 2, 2);
  ctx.fillRect(x+1 + bodyLean + (dir>0?3:-1), y-3+rightLeg, 2, 2);

  // Legs (pants) — follow walk cycle
  ctx.fillStyle = '#334455';
  ctx.fillRect(x-7, y-18+leftLeg*0.5+by, 6, 17);
  ctx.fillRect(x+1, y-18+rightLeg*0.5+by, 6, 17);
  // Knee highlight
  ctx.fillStyle = '#3A4C60';
  ctx.fillRect(x-6, y-14+leftLeg*0.5+by, 4, 3);
  ctx.fillRect(x+2, y-14+rightLeg*0.5+by, 4, 3);
  // Shin shadow
  ctx.fillStyle = '#2A3A50';
  ctx.fillRect(x-7, y-8+leftLeg*0.5+by, 2, 6);
  ctx.fillRect(x+5, y-8+rightLeg*0.5+by, 2, 6);

  // Body — with breathing and bob
  ctx.fillStyle = shirtDark;
  ctx.fillRect(x-9, y-38+h+by, 18, 22);
  ctx.fillStyle = shirtLight;
  ctx.fillRect(x-8, y-37+h+by, 16, 20);
  // Shirt highlight/fold
  ctx.fillStyle = shirtLight;
  ctx.fillRect(x-5, y-35+h+by, 10, 16);
  // Shirt wrinkle (animated)
  ctx.fillStyle = shirtDark;
  ctx.fillRect(x-3, y-30+h+by, 6, 1);
  // Belt
  ctx.fillStyle = '#443322';
  ctx.fillRect(x-9, y-18+h+by, 18, 3);
  ctx.fillStyle = C.GOLD_DARK;
  ctx.fillRect(x-2, y-18+h+by, 4, 3); // buckle
  ctx.fillStyle = C.GOLD;
  ctx.fillRect(x-1, y-17+h+by, 2, 1); // buckle shine

  // Arms — proper swing animation
  ctx.fillStyle = shirtDark;
  ctx.fillRect(x-13, y-35+h+leftArm+by, 5, 18);
  ctx.fillRect(x+8, y-35+h+rightArm+by, 5, 18);
  // Sleeve cuff
  ctx.fillStyle = shirtLight;
  ctx.fillRect(x-13, y-35+h+leftArm+by, 5, 2);
  ctx.fillRect(x+8, y-35+h+rightArm+by, 5, 2);
  // Forearm skin
  ctx.fillStyle = skin;
  ctx.fillRect(x-13, y-19+h+leftArm+by, 5, 5);
  ctx.fillRect(x+8, y-19+h+rightArm+by, 5, 5);
  // Hands
  ctx.fillStyle = skin;
  ctx.fillRect(x-13, y-15+h+leftArm+by, 5, 4);
  ctx.fillRect(x+8, y-15+h+rightArm+by, 5, 4);
  // Finger detail
  ctx.fillStyle = '#CC9977';
  ctx.fillRect(x-12, y-12+h+leftArm+by, 1, 2);
  ctx.fillRect(x+11, y-12+h+rightArm+by, 1, 2);

  // Neck
  ctx.fillStyle = skin;
  ctx.fillRect(x-3, y-41+h+by, 6, 4);
  ctx.fillStyle = '#CC9977';
  ctx.fillRect(x-3, y-39+h+by, 6, 1); // neck shadow

  // Head — with idle look offset
  const headX = x + idleLook * 2;
  ctx.fillStyle = skin;
  ctx.fillRect(headX-7, y-52+h+by, 14, 13);
  // Face shadow (directional)
  ctx.fillStyle = '#CC9977';
  if (dir > 0) ctx.fillRect(headX-7, y-52+h+by, 4, 13);
  else ctx.fillRect(headX+3, y-52+h+by, 4, 13);
  // Cheek highlight
  ctx.fillStyle = '#EEBB99';
  if (dir > 0) ctx.fillRect(headX+3, y-47+h+by, 3, 3);
  else ctx.fillRect(headX-6, y-47+h+by, 3, 3);
  // Nose
  ctx.fillStyle = '#CC9977';
  const noseX = dir > 0 ? headX+4 : headX-5;
  ctx.fillRect(noseX, y-46+h+by, 2, 3);

  // Hair
  ctx.fillStyle = hair;
  ctx.fillRect(headX-8, y-55+h+by, 16, 6);
  if (dir > 0) ctx.fillRect(headX-9, y-54+h+by, 3, 10);
  else ctx.fillRect(headX+6, y-54+h+by, 3, 10);
  // Hair highlights
  ctx.fillStyle = who === 'clio' ? '#5A3A20' : (who === 'ajax' ? '#4A3218' : '#333');
  ctx.fillRect(headX-4, y-55+h+by, 3, 2);

  // Eyes — with blinking (#4) and idle look
  const eyeOff = idleLook; // shift pupil with look direction
  if (isBlinking) {
    // Eyes closed — just a line
    ctx.fillStyle = skin;
    const eyeX = dir > 0 ? headX+1 : headX-6;
    ctx.fillRect(eyeX, y-48+h+by, 4, 3);
    ctx.fillRect(eyeX+6, y-48+h+by, 4, 3);
    ctx.fillStyle = '#000';
    ctx.fillRect(eyeX, y-47+h+by, 4, 1);
    ctx.fillRect(eyeX+6, y-47+h+by, 4, 1);
  } else {
    ctx.fillStyle = C.WHITE;
    const eyeX = dir > 0 ? headX+1 : headX-6;
    ctx.fillRect(eyeX, y-48+h+by, 4, 3);
    ctx.fillRect(eyeX+6, y-48+h+by, 4, 3);
    // Pupils — shift with look direction
    ctx.fillStyle = '#000';
    const pupilShift = (dir>0?2:0) + eyeOff;
    ctx.fillRect(eyeX + Math.max(0, Math.min(2, pupilShift)), y-48+h+by, 2, 3);
    ctx.fillRect(eyeX+6 + Math.max(0, Math.min(2, pupilShift)), y-48+h+by, 2, 3);
    // Eye shine
    ctx.fillStyle = C.WHITE;
    ctx.fillRect(eyeX + Math.max(0, Math.min(2, pupilShift)), y-48+h+by, 1, 1);
    ctx.fillRect(eyeX+6 + Math.max(0, Math.min(2, pupilShift)), y-48+h+by, 1, 1);
  }
  // Eyebrows — can express emotion
  ctx.fillStyle = hair;
  const eyeX2 = dir > 0 ? headX+1 : headX-6;
  ctx.fillRect(eyeX2, y-50+h+by, 4, 1);
  ctx.fillRect(eyeX2+6, y-50+h+by, 4, 1);

  // Mouth — slight animation when idle
  ctx.fillStyle = '#BB7755';
  const mouthOpen = (!walking && isMainChar && Math.sin(state.tick * 0.02) > 0.95) ? 1 : 0;
  ctx.fillRect(headX-2, y-43+h+by, 4, 2 + mouthOpen);
  if (mouthOpen) { ctx.fillStyle = '#884433'; ctx.fillRect(headX-1, y-42+h+by, 2, 1); }

  // Character-specific details
  if (who === 'clio') {
    ctx.fillStyle = hair;
    if (dir > 0) ctx.fillRect(headX-10, y-51+h+by, 3, 14);
    else ctx.fillRect(headX+7, y-51+h+by, 3, 14);
    // Hair ribbon wave
    const ribbonWave = Math.sin(state.tick * 0.04) * 2;
    if (dir > 0) ctx.fillRect(headX-11, y-40+h+by+ribbonWave, 2, 3);
    else ctx.fillRect(headX+9, y-40+h+by+ribbonWave, 2, 3);
    // Bow
    ctx.fillStyle = '#FF6699';
    ctx.fillRect(headX-3, y-55+h+by, 6, 4);
    ctx.fillStyle = '#FF88AA'; // bow highlight
    ctx.fillRect(headX-2, y-55+h+by, 2, 2);
    // Skirt with slight sway
    ctx.fillStyle = '#CC44AA';
    const skirtSway = walking ? Math.sin(walkPhase)*2 : 0;
    ctx.fillRect(x-10+skirtSway, y-18+h+by, 20, 6);
    ctx.fillStyle = '#AA3388';
    ctx.fillRect(x-9+skirtSway, y-14+h+by, 18, 2); // hem
  }
  if (who === 'ntemis') {
    // Beard shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(headX-4, y-43+h+by, 8, 4);
    // Stubble detail
    ctx.fillStyle = 'rgba(80,60,40,0.15)';
    for (let bx = -3; bx < 5; bx += 2) {
      for (let by2 = 0; by2 < 3; by2 += 2) {
        ctx.fillRect(headX+bx, y-43+h+by+by2, 1, 1);
      }
    }
  }
  if (who === 'ajax') {
    // Backpack
    const bpX = dir > 0 ? x-12 : x+8;
    ctx.fillStyle = '#664422';
    ctx.fillRect(bpX, y-34+h+by, 5, 12);
    ctx.fillStyle = '#775533';
    ctx.fillRect(bpX, y-34+h+by, 5, 2);
    // Backpack strap
    ctx.fillStyle = '#553311';
    ctx.fillRect(bpX + (dir>0?4:0), y-36+h+by, 1, 4);
    // Excited pose — arms slightly up when idle
    if (!walking && state.idleTick > 100 && Math.sin(state.tick * 0.03) > 0.9) {
      ctx.fillStyle = skin;
      ctx.fillRect(x+8, y-22+h+by, 5, 3); // hand up gesture
    }
  }

  // --- Clear shadow effects after character drawing ---
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}
