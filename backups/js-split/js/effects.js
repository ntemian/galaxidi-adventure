// ============================================================
// EFFECTS — Parallax, color cycling, water, lighting, particles,
// portraits, iris wipe transition
// ============================================================

// ============================================================
// PARALLAX SYSTEM (#1) — layered depth like Monkey Island
// ============================================================
function drawParallax() {
  const t = state.tick;
  const px = state.parallaxX;
  const scene = state.scene;
  if (scene === 'house' || scene === 'church') return; // indoor scenes — no parallax

  // Stars — twinkling night sky (Monkey Island style)
  if (scene !== 'cave') {
    ctx.save();
    const starSeed = [
      [15,8],[52,3],[88,18],[120,6],[155,22],[190,4],[228,12],[265,20],
      [295,7],[330,15],[365,3],[398,10],[430,22],[468,5],[505,18],[540,8],
      [575,14],[610,3],[35,25],[78,28],[142,30],[210,26],[280,29],[350,24],
      [420,27],[490,30],[560,25],[625,28],[45,12],[170,9],[310,5],[480,11],
      [105,15],[390,8],[550,20],[62,20],[240,16],[440,14],[580,10],[320,25],
    ];
    starSeed.forEach(([sx, sy], i) => {
      const twinkle = Math.sin(t * 0.03 + i * 1.7) * 0.4 + 0.6;
      const size = (i % 3 === 0) ? 2 : 1;
      ctx.globalAlpha = twinkle * (size > 1 ? 0.9 : 0.7);
      ctx.fillStyle = (i % 7 === 0) ? '#AACCFF' : (i % 5 === 0) ? '#FFDDAA' : '#FFFFFF';
      ctx.fillRect(sx, sy, size, size);
      if (size > 1 && twinkle > 0.8) {
        ctx.globalAlpha = (twinkle - 0.8) * 2;
        ctx.fillRect(sx - 1, sy, 1, 1);
        ctx.fillRect(sx + 2, sy, 1, 1);
        ctx.fillRect(sx, sy - 1, 1, 1);
        ctx.fillRect(sx, sy + 1, 1, 1);
      }
    });
    ctx.restore();
  }

  // Layer 1: Far clouds — very faint for night
  const cloudAlpha = scene === 'cave' ? 0 : 0.1;
  if (cloudAlpha > 0) {
    ctx.save();
    ctx.globalAlpha = cloudAlpha;
    const co = state.cloudOffset;
    [[co % W - W, 15, 50, 20], [(co + 200) % W - W/2, 22, 40, 15],
     [(co + 450) % W, 10, 55, 18], [(co + 650) % W - 100, 28, 35, 12]
    ].forEach(([cx, cy, rx, ry]) => {
      ctx.fillStyle = 'rgba(140,160,180,0.4)';
      ctx.beginPath(); ctx.ellipse(cx + px*0.2, cy, rx, ry, 0, 0, Math.PI*2); ctx.fill();
    });
    ctx.restore();
  }
}

// ============================================================
// COLOR CYCLING (#13) — animated palette for water/sky (classic MI trick)
// ============================================================
function drawColorCycling() {
  const scene = state.scene;
  const t = state.tick;
  if (scene === 'house' || scene === 'church') return;
  const hasWater = ['port','beach','boat','hilltop','cave'].includes(scene);
  if (!hasWater) return;

  // Cycle water highlights — shifting horizontal bands
  const phase = state.waterCyclePhase;
  const waterY = scene === 'port' ? 130 : scene === 'beach' ? 80 : scene === 'boat' ? 100 : scene === 'hilltop' ? 120 : 220;
  const waterH = scene === 'cave' ? 40 : 80;

  ctx.save();
  for (let i = 0; i < 6; i++) {
    const y = waterY + (i * waterH/6);
    const shift = Math.sin(phase + i * 0.8) * 0.03;
    const hue = 190 + Math.sin(phase + i) * 15; // cycle between cyan-blue
    const light = 30 + Math.sin(phase * 0.7 + i * 1.2) * 8;
    ctx.fillStyle = `hsla(${hue},60%,${light}%,${0.02 + shift * 0.3})`;
    ctx.fillRect(0, y, W, waterH/6 + 2);
  }
  ctx.restore();
}

// ============================================================
// FOREGROUND OBJECTS (#10) — depth layering, drawn OVER character
// ============================================================
function drawForeground() {
  const t = state.tick;
  switch (state.scene) {
    case 'port': {
      // Foreground rope and bollard posts
      ctx.fillStyle = '#555';
      ctx.fillRect(15, 270, 8, 50);
      ctx.fillRect(610, 270, 8, 50);
      ctx.fillStyle = '#666';
      ctx.fillRect(16, 268, 6, 4);
      ctx.fillRect(611, 268, 6, 4);
      // Rope draped between
      ctx.strokeStyle = '#886';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(19, 270);
      ctx.quadraticCurveTo(100, 290 + Math.sin(t*0.02)*2, 614, 270);
      ctx.stroke();
      break;
    }
    case 'beach': {
      // Foreground grass tufts
      for (let gx = 0; gx < 80; gx += 12) {
        const sway = Math.sin(t*0.025 + gx*0.3)*3;
        ctx.strokeStyle = '#4A8833';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(gx, H);
        ctx.quadraticCurveTo(gx + sway, H - 18, gx + sway*1.5, H - 25);
        ctx.stroke();
      }
      break;
    }
    case 'town': {
      // Foreground flower pot
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(8, 275, 24, 20);
      ctx.fillStyle = '#6B3410';
      ctx.fillRect(6, 273, 28, 4);
      // Flowers
      ctx.fillStyle = '#FF6688';
      ctx.beginPath(); ctx.arc(14, 268, 4, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#FFDD44';
      ctx.beginPath(); ctx.arc(22, 265, 3, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#AA66FF';
      ctx.beginPath(); ctx.arc(28, 269, 3, 0, Math.PI*2); ctx.fill();
      // Leaves
      ctx.fillStyle = C.LEAF_MID;
      ctx.fillRect(12, 262, 2, 8);
      ctx.fillRect(20, 259, 2, 8);
      ctx.fillRect(26, 263, 2, 8);
      break;
    }
    case 'cave': {
      // Foreground stalactites (close to camera, bigger)
      if (state.flags.caveIlluminated) {
        ctx.fillStyle = '#3A2818';
        [[20, 0, 12, 45], [590, 0, 15, 55], [50, 0, 8, 30]].forEach(([x,y,w,h]) => {
          ctx.beginPath();
          ctx.moveTo(x, y); ctx.lineTo(x+w, y); ctx.lineTo(x+w/2, y+h);
          ctx.fill();
        });
      }
      break;
    }
    case 'boat': {
      // Foreground railing section (closer, slightly bigger)
      ctx.fillStyle = C.WOOD_MID;
      ctx.fillRect(0, 255, 55, 65);
      ctx.fillStyle = C.WOOD_LIGHT;
      ctx.fillRect(0, 253, 55, 4);
      // Coiled rope
      ctx.strokeStyle = '#998866';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(25, 285, 12, 0, Math.PI*1.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(25, 285, 7, 0.5, Math.PI*1.8);
      ctx.stroke();
      break;
    }
    case 'hilltop': {
      // Foreground wildflower stalks
      for (let i = 0; i < 5; i++) {
        const gx = 520 + i * 25;
        const sway = Math.sin(t*0.02 + i)*4;
        ctx.strokeStyle = '#3A6628';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(gx, H);
        ctx.quadraticCurveTo(gx + sway, H - 25, gx + sway*1.3, H - 35);
        ctx.stroke();
        ctx.fillStyle = ['#FF6688','#FFDD44','#AA66FF','#FF8844','#66CCFF'][i];
        ctx.beginPath(); ctx.arc(gx + sway*1.3, H - 37, 3, 0, Math.PI*2); ctx.fill();
      }
      break;
    }
  }
}

// ============================================================
// WATER REFLECTIONS (#6) — mirrored, distorted reflections in port water
// ============================================================
function drawWaterReflections() {
  if (state.scene !== 'port' && state.scene !== 'boat') return;
  const t = state.tick;

  if (state.scene === 'port') {
    ctx.save();
    ctx.globalAlpha = 0.12;
    // Reflect fishing boat (inverted, wavey)
    for (let ry = 0; ry < 30; ry++) {
      const distort = Math.sin(t*0.03 + ry*0.3) * 3;
      ctx.fillStyle = '#1A3388';
      ctx.fillRect(80 + distort, 215 + ry, 130, 1);
    }
    // Reflect sailboat
    for (let ry = 0; ry < 25; ry++) {
      const distort = Math.sin(t*0.025 + ry*0.4) * 4;
      ctx.fillStyle = '#663311';
      ctx.fillRect(360 + distort, 220 + ry, 130, 1);
    }
    // Reflect fisherman
    for (let ry = 0; ry < 20; ry++) {
      const distort = Math.sin(t*0.04 + ry*0.5) * 2;
      ctx.fillStyle = '#1A3355';
      ctx.fillRect(522 + distort, 242 + ry, 20, 1);
    }
    ctx.restore();
  }
}

// ============================================================
// DYNAMIC LIGHTING (#5) — radial glow halos for light sources
// ============================================================
function drawDynamicLighting() {
  const t = state.tick;
  const scene = state.scene;

  if (scene === 'port' || scene === 'beach' || scene === 'hilltop') {
    // Moonlight from sky — cool blue-white glow
    const moonGlow = ctx.createRadialGradient(W*0.75, -10, 20, W*0.75, -10, 180);
    moonGlow.addColorStop(0, `rgba(180,200,255,${0.05 + Math.sin(t*0.008)*0.015})`);
    moonGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = moonGlow;
    ctx.fillRect(0, 0, W, H/2);
  }

  if (scene === 'house') {
    // Window moonlight — cool blue ambient on wall near window
    const wf = Math.sin(t*0.008)*0.004;
    ctx.fillStyle = `rgba(180,200,230,${0.012+wf})`;
    ctx.fillRect(200, 10, 160, 210);
  }

  if (scene === 'church') {
    // Stained glass colored light pools
    ctx.save();
    ctx.globalAlpha = 0.04 + Math.sin(t*0.006)*0.01;
    const sgGlow = ctx.createRadialGradient(200, 150, 10, 200, 150, 80);
    sgGlow.addColorStop(0, 'rgba(255,180,80,0.2)');
    sgGlow.addColorStop(0.5, 'rgba(200,80,60,0.1)');
    sgGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sgGlow;
    ctx.fillRect(140, 80, 120, 160);
    ctx.restore();
  }
}

// ============================================================
// ATMOSPHERIC PARTICLES (#9) — fireflies, leaves, dust, sparks
// ============================================================
function drawAtmosphericParticles() {
  const t = state.tick;
  const scene = state.scene;

  // Fireflies — outdoor evening scenes
  if (scene === 'town' || scene === 'hilltop') {
    for (let i = 0; i < 3; i++) {
      const fx = 50 + Math.sin(t*0.008 + i*2.1) * 200 + i*80;
      const fy = 180 + Math.sin(t*0.012 + i*1.5) * 40;
      const glow = Math.sin(t*0.06 + i*1.8);
      if (glow > 0.2) {
        ctx.fillStyle = `rgba(200,255,100,${(glow-0.2)*0.25})`;
        ctx.beginPath(); ctx.arc(fx, fy, 2, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = `rgba(200,255,100,${(glow-0.2)*0.08})`;
        ctx.beginPath(); ctx.arc(fx, fy, 6, 0, Math.PI*2); ctx.fill();
      }
    }
  }

  // Falling leaves — outdoor scenes with trees
  if (scene === 'port' || scene === 'town' || scene === 'hilltop') {
    for (let i = 0; i < 3; i++) {
      const lx = (t*0.4 + i*220) % (W+50) - 25;
      const ly = (t*0.6 + i*110) % (H - 100) + 20;
      const rot = Math.sin(t*0.03 + i) * 0.5;
      const sw = 3 + Math.sin(t*0.04 + i)*1;
      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(rot);
      ctx.fillStyle = ['#AA6633','#CC8844','#88AA33'][i];
      ctx.fillRect(-sw, -1, sw*2, 2);
      ctx.restore();
    }
  }

  // Cave sparkles — mineral glints
  if (scene === 'cave' && state.flags.caveIlluminated) {
    for (let i = 0; i < 8; i++) {
      const sx = 50 + (i*83) % 500;
      const sy = 100 + (i*47) % 130;
      const sparkle = Math.sin(t*0.08 + i*2.3);
      if (sparkle > 0.85) {
        ctx.fillStyle = `rgba(255,255,255,${(sparkle-0.85)*4})`;
        ctx.fillRect(sx, sy, 1, 1);
      }
    }
  }
}

// ============================================================
// DIALOG PORTRAITS (#7) — character face close-ups during conversation
// ============================================================
const portraitCanvas = document.getElementById('portrait-box');
const pCtx = portraitCanvas.getContext('2d');

function drawPortrait(speaker) {
  if (!speaker || speaker === 'narrator') {
    portraitCanvas.style.display = 'none';
    return;
  }
  portraitCanvas.style.display = 'block';
  pCtx.clearRect(0, 0, 72, 72);

  // Background gradient per character
  const bgColors = {
    ntemis: ['#1A2844','#2A3866'], ajax: ['#441118','#662233'],
    clio: ['#441144','#663366'], fisherman: ['#1A3355','#2A4466'],
    monk: ['#1A2A1A','#2A3A2A'], cat: ['#332211','#443322']
  };
  const bg = bgColors[speaker] || ['#222','#333'];
  const grad = pCtx.createLinearGradient(0,0,0,72);
  grad.addColorStop(0, bg[0]); grad.addColorStop(1, bg[1]);
  pCtx.fillStyle = grad;
  pCtx.fillRect(0,0,72,72);

  const cx = 36, cy = 36;

  switch(speaker) {
    case 'ntemis':
      // Head
      pCtx.fillStyle = C.SKIN; pCtx.fillRect(cx-12, cy-10, 24, 22);
      pCtx.fillStyle = '#CC9977'; pCtx.fillRect(cx-12, cy-10, 5, 22); // shadow
      // Hair
      pCtx.fillStyle = '#222'; pCtx.fillRect(cx-14, cy-14, 28, 8);
      pCtx.fillRect(cx-15, cy-12, 4, 16);
      // Eyes
      pCtx.fillStyle = C.WHITE; pCtx.fillRect(cx-6, cy-4, 6, 5); pCtx.fillRect(cx+2, cy-4, 6, 5);
      pCtx.fillStyle = '#336'; pCtx.fillRect(cx-4, cy-3, 3, 4); pCtx.fillRect(cx+4, cy-3, 3, 4);
      pCtx.fillStyle = '#000'; pCtx.fillRect(cx-3, cy-2, 2, 3); pCtx.fillRect(cx+5, cy-2, 2, 3);
      // Eyebrows
      pCtx.fillStyle = '#222'; pCtx.fillRect(cx-7, cy-6, 7, 2); pCtx.fillRect(cx+1, cy-6, 7, 2);
      // Nose
      pCtx.fillStyle = '#CC9977'; pCtx.fillRect(cx-1, cy+1, 4, 5);
      // Mouth
      pCtx.fillStyle = '#BB7755'; pCtx.fillRect(cx-3, cy+8, 8, 3);
      // Beard shadow
      pCtx.fillStyle = 'rgba(0,0,0,0.15)'; pCtx.fillRect(cx-8, cy+8, 18, 5);
      // Shirt collar
      pCtx.fillStyle = '#2A4466'; pCtx.fillRect(cx-14, cy+14, 28, 22);
      break;
    case 'ajax':
      pCtx.fillStyle = C.SKIN; pCtx.fillRect(cx-10, cy-8, 20, 20);
      pCtx.fillStyle = '#3A2A18'; pCtx.fillRect(cx-12, cy-12, 24, 7); // hair
      pCtx.fillStyle = C.WHITE; pCtx.fillRect(cx-5, cy-2, 5, 4); pCtx.fillRect(cx+2, cy-2, 5, 4);
      pCtx.fillStyle = '#000'; pCtx.fillRect(cx-3, cy-1, 2, 3); pCtx.fillRect(cx+4, cy-1, 2, 3);
      pCtx.fillStyle = '#BB7755'; pCtx.fillRect(cx-2, cy+6, 6, 2);
      // Big grin
      pCtx.strokeStyle = '#BB7755'; pCtx.lineWidth = 1;
      pCtx.beginPath(); pCtx.arc(cx, cy+7, 5, 0, Math.PI); pCtx.stroke();
      pCtx.fillStyle = '#AA2233'; pCtx.fillRect(cx-12, cy+14, 24, 22);
      break;
    case 'clio':
      pCtx.fillStyle = C.SKIN; pCtx.fillRect(cx-10, cy-8, 20, 18);
      pCtx.fillStyle = '#442A18'; pCtx.fillRect(cx-12, cy-12, 24, 7);
      // Long hair sides
      pCtx.fillRect(cx-13, cy-10, 4, 22); pCtx.fillRect(cx+9, cy-10, 4, 22);
      // Bow
      pCtx.fillStyle = '#FF6699'; pCtx.fillRect(cx-4, cy-14, 8, 5);
      // Eyes (big, cute)
      pCtx.fillStyle = C.WHITE; pCtx.fillRect(cx-6, cy-3, 6, 5); pCtx.fillRect(cx+1, cy-3, 6, 5);
      pCtx.fillStyle = '#228'; pCtx.fillRect(cx-4, cy-2, 3, 4); pCtx.fillRect(cx+3, cy-2, 3, 4);
      pCtx.fillStyle = '#000'; pCtx.fillRect(cx-3, cy-1, 2, 3); pCtx.fillRect(cx+4, cy-1, 2, 3);
      // Eyelashes
      pCtx.fillStyle = '#000'; pCtx.fillRect(cx-6, cy-4, 1, 2); pCtx.fillRect(cx+6, cy-4, 1, 2);
      pCtx.fillStyle = '#CC6688'; pCtx.fillRect(cx-2, cy+5, 5, 2); // smile
      pCtx.fillStyle = '#CC44AA'; pCtx.fillRect(cx-12, cy+12, 24, 22);
      break;
    case 'fisherman':
      pCtx.fillStyle = C.SKIN; pCtx.fillRect(cx-12, cy-8, 24, 20);
      pCtx.fillStyle = '#AAAAAA'; pCtx.fillRect(cx-12, cy+6, 24, 10); // beard
      pCtx.fillStyle = '#888888'; pCtx.fillRect(cx-10, cy+8, 20, 8); // beard detail
      pCtx.fillStyle = '#222233'; pCtx.fillRect(cx-14, cy-16, 28, 10); // hat
      pCtx.fillRect(cx-10, cy-10, 20, 6);
      pCtx.fillStyle = C.WHITE; pCtx.fillRect(cx-5, cy-4, 4, 3); pCtx.fillRect(cx+3, cy-4, 4, 3);
      pCtx.fillStyle = '#000'; pCtx.fillRect(cx-4, cy-3, 2, 2); pCtx.fillRect(cx+5, cy-3, 2, 2);
      pCtx.fillStyle = '#2A4466'; pCtx.fillRect(cx-14, cy+16, 28, 20);
      break;
    case 'monk':
      pCtx.fillStyle = C.SKIN; pCtx.fillRect(cx-10, cy-6, 20, 16);
      pCtx.fillStyle = '#888'; pCtx.fillRect(cx-10, cy+6, 20, 10); // beard
      pCtx.fillStyle = '#222'; pCtx.fillRect(cx-12, cy-14, 24, 10); // hat
      pCtx.fillRect(cx-8, cy-8, 16, 5);
      pCtx.fillStyle = C.GOLD_DARK; pCtx.fillRect(cx-2, cy-16, 4, 4); // cross on hat
      pCtx.fillStyle = C.WHITE; pCtx.fillRect(cx-4, cy-2, 3, 3); pCtx.fillRect(cx+3, cy-2, 3, 3);
      pCtx.fillStyle = '#000'; pCtx.fillRect(cx-3, cy-1, 2, 2); pCtx.fillRect(cx+4, cy-1, 2, 2);
      pCtx.fillStyle = '#222'; pCtx.fillRect(cx-14, cy+16, 28, 20);
      break;
    case 'cat':
      // Orange cat face
      pCtx.fillStyle = C.ORANGE;
      pCtx.beginPath(); pCtx.arc(cx, cy+4, 18, 0, Math.PI*2); pCtx.fill();
      // Ears
      pCtx.beginPath(); pCtx.moveTo(cx-16,cy-10); pCtx.lineTo(cx-10,cy-24); pCtx.lineTo(cx-4,cy-10); pCtx.fill();
      pCtx.beginPath(); pCtx.moveTo(cx+4,cy-10); pCtx.lineTo(cx+10,cy-24); pCtx.lineTo(cx+16,cy-10); pCtx.fill();
      // Inner ears
      pCtx.fillStyle = '#FFBB88';
      pCtx.beginPath(); pCtx.moveTo(cx-14,cy-10); pCtx.lineTo(cx-10,cy-20); pCtx.lineTo(cx-6,cy-10); pCtx.fill();
      pCtx.beginPath(); pCtx.moveTo(cx+6,cy-10); pCtx.lineTo(cx+10,cy-20); pCtx.lineTo(cx+14,cy-10); pCtx.fill();
      // Eyes
      pCtx.fillStyle = '#55CC55'; pCtx.fillRect(cx-10, cy-2, 7, 6); pCtx.fillRect(cx+3, cy-2, 7, 6);
      pCtx.fillStyle = '#000'; pCtx.fillRect(cx-7, cy-1, 2, 5); pCtx.fillRect(cx+6, cy-1, 2, 5);
      // Nose
      pCtx.fillStyle = '#FF8888'; pCtx.beginPath(); pCtx.arc(cx, cy+6, 3, 0, Math.PI*2); pCtx.fill();
      // Whiskers
      pCtx.strokeStyle = '#DDD'; pCtx.lineWidth = 1;
      pCtx.beginPath(); pCtx.moveTo(cx-8,cy+7); pCtx.lineTo(cx-22,cy+4); pCtx.stroke();
      pCtx.beginPath(); pCtx.moveTo(cx-8,cy+9); pCtx.lineTo(cx-22,cy+10); pCtx.stroke();
      pCtx.beginPath(); pCtx.moveTo(cx+8,cy+7); pCtx.lineTo(cx+22,cy+4); pCtx.stroke();
      pCtx.beginPath(); pCtx.moveTo(cx+8,cy+9); pCtx.lineTo(cx+22,cy+10); pCtx.stroke();
      break;
  }

  // Border glow in character color
  pCtx.strokeStyle = SPEECH_COLORS[speaker] || '#FFCC00';
  pCtx.lineWidth = 2;
  pCtx.strokeRect(1, 1, 70, 70);

  // Name label
  const names = { ntemis:'Ντέμης', ajax:'Αίαντας', clio:'Κλειώ', fisherman:'Ψαράς', monk:'Παπα-Νικόλας', cat:'Γάτα' };
  pCtx.fillStyle = 'rgba(0,0,0,0.7)';
  pCtx.fillRect(0, 58, 72, 14);
  pCtx.fillStyle = SPEECH_COLORS[speaker];
  pCtx.font = '8px Courier New';
  pCtx.textAlign = 'center';
  pCtx.fillText(names[speaker] || speaker, 36, 68);
  pCtx.textAlign = 'left';
}

// ============================================================
// IRIS WIPE TRANSITION (#14) — classic Monkey Island scene change
// ============================================================
const irisCanvas = document.getElementById('iris-wipe');
const irisCtx = irisCanvas.getContext('2d');

function irisWipeTransition(callback) {
  if (state.fading) return;
  state.fading = true;
  irisCanvas.style.display = 'block';

  let radius = Math.max(W, H);
  const cx = W/2 * (800/640); // scale to CSS size
  const cy = H/2 * (400/320);
  const maxR = radius;
  const closeSpeed = maxR / 20; // close in 20 frames
  let phase = 'close'; // close then open

  function animate() {
    irisCtx.clearRect(0, 0, 800, 400);
    // Draw black with circular hole
    irisCtx.fillStyle = '#000';
    irisCtx.fillRect(0, 0, 800, 400);
    irisCtx.save();
    irisCtx.globalCompositeOperation = 'destination-out';
    irisCtx.beginPath();
    irisCtx.arc(cx, cy, Math.max(0, radius), 0, Math.PI*2);
    irisCtx.fill();
    irisCtx.restore();

    if (phase === 'close') {
      radius -= closeSpeed;
      if (radius <= 0) {
        radius = 0;
        phase = 'open';
        callback(); // execute scene change at full black
        setTimeout(() => {
          const openSpeed = maxR / 15;
          function openAnim() {
            irisCtx.clearRect(0, 0, 800, 400);
            irisCtx.fillStyle = '#000';
            irisCtx.fillRect(0, 0, 800, 400);
            irisCtx.save();
            irisCtx.globalCompositeOperation = 'destination-out';
            irisCtx.beginPath();
            irisCtx.arc(cx, cy, radius, 0, Math.PI*2);
            irisCtx.fill();
            irisCtx.restore();
            radius += openSpeed;
            if (radius >= maxR) {
              irisCanvas.style.display = 'none';
              state.fading = false;
              return;
            }
            requestAnimationFrame(openAnim);
          }
          requestAnimationFrame(openAnim);
        }, 100);
        return;
      }
      requestAnimationFrame(animate);
    }
  }
  requestAnimationFrame(animate);
}

