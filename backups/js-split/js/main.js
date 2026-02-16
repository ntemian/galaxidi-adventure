// ============================================================
// MAIN — Game loop, drawScene, title screen, event listeners
// ============================================================

// ============================================================
// SCENE DRAWING — Monkey Island style
// ============================================================

function drawScene() {
  renderBackgroundIfDirty();
  ctx.drawImage(bgCanvas, 0, 0);
  // Skip parallax — painted backgrounds have their own skies
  // Subtle color cycling only
  drawColorCycling();
  // Animated overlays (keep these — they add life)
  switch (state.scene) {
    case 'house': drawHouseFx(); break;
    case 'port': drawPortFx(); break;
    case 'beach': drawBeachFx(); break;
    case 'town': drawTownFx(); break;
    case 'cave': drawCaveFx(); break;
    case 'church': drawChurchFx(); break;
    case 'hilltop': drawHilltopFx(); break;
    case 'boat': drawBoatFx(); break;
  }
  // Keep atmospheric particles (subtle dust motes etc)
  drawAtmosphericParticles();
}


canvas.addEventListener('click', e => {
  if (!state.started) return;
  const rect = canvas.getBoundingClientRect();
  const mx = (e.clientX-rect.left)*(W/rect.width);
  const my = (e.clientY-rect.top)*(H/rect.height);
  handleClick(mx, my);
});

canvas.addEventListener('mousemove', e => {
  if (!state.started) return;
  const rect = canvas.getBoundingClientRect();
  const mx = (e.clientX-rect.left)*(W/rect.width);
  const my = (e.clientY-rect.top)*(H/rect.height);
  const s = scenes[state.scene];
  const hit = s.hotspots().find(h => mx>=h.x && mx<h.x+h.w && my>=h.y && my<h.y+h.h);
  if (hit) {
    updateSentence(hit.label);
  } else {
    updateSentence();
  }
});

function update() {
  state.tick++;
  // Parallax & color cycling
  state.cloudOffset += 0.3;
  state.waterCyclePhase += 0.02;
  state.breathPhase += 0.04;

  if (state.charWalking) {
    state.idleTick = 0;
    const dx=state.charTargetX-state.charX, dy=state.charTargetY-state.charY;
    const dist=Math.sqrt(dx*dx+dy*dy);
    if (dist<2) {
      state.charWalking=false;
      state.charX=state.charTargetX; state.charY=state.charTargetY;
    } else {
      const speed=2.5;
      state.charX+=(dx/dist)*speed; state.charY+=(dy/dist)*speed;
      state.charDir = dx>0?1:-1;
      state.charFrameTimer++;
      if (state.charFrameTimer>5) { state.charFrame=(state.charFrame+1)%8; state.charFrameTimer=0; AudioSystem.footstep(); }
    }
    // Parallax follows character
    state.parallaxX = (state.charX - W/2) * 0.1;
  } else {
    // Idle animations
    state.idleTick++;
    // Blinking
    if (state.blinkTimer <= 0) {
      state.blinkTimer = 120 + Math.random() * 200;
      state.blinkDuration = 6 + Math.random() * 4;
    }
    state.blinkTimer--;
    if (state.blinkDuration > 0) state.blinkDuration--;
    // Random look direction changes
    if (state.lookTimer <= 0) {
      state.lookTimer = 80 + Math.random() * 160;
      state.lookDir = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
    }
    state.lookTimer--;
  }
  if (state.textTimer>0) { state.textTimer--; if (state.textTimer===0) clearText(); }
  state.speechBubbles.forEach(b => { if (b.timer > 0) b.timer--; });
  state.speechBubbles = state.speechBubbles.filter(b => b.timer > 0);
}

function render() {
  if (!state.started) return;
  drawScene();
  drawCharacter();
  drawForeground(); // (#10) foreground objects OVER character for depth
  drawSpeechBubbles();
}

function gameLoop() { update(); render(); requestAnimationFrame(gameLoop); }

// --- TITLE SCREEN ---
document.getElementById('title-screen').addEventListener('click', ()=>{
  AudioSystem.init();
  document.getElementById('title-screen').style.display='none';
  state.started=true;
  changeScene('house', true);
  drawMiniMap();
  setTimeout(() => AudioSystem.startMusic(), 500);
});

// Title background
(function() {
  const tc = document.getElementById('title-screen');
  const cv = document.createElement('canvas');
  cv.width=800; cv.height=500;
  cv.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;z-index:-1';
  const c = cv.getContext('2d');
  // Night sky gradient
  const skyGrad = c.createLinearGradient(0,0,0,200);
  skyGrad.addColorStop(0,'#080818'); skyGrad.addColorStop(0.3,'#101830');
  skyGrad.addColorStop(0.6,'#1A2848'); skyGrad.addColorStop(1,'#2A4060');
  c.fillStyle=skyGrad; c.fillRect(0,0,640,200);
  // Stars
  for (let i=0;i<80;i++){
    const brightness = Math.random()*0.7+0.3;
    c.fillStyle=`rgba(255,255,${200+Math.random()*55},${brightness})`;
    c.fillRect(Math.random()*640,Math.random()*160,1+Math.random(),1+Math.random());
  }
  // Moon
  c.fillStyle='#FFEEAA';
  c.beginPath(); c.arc(480,60,22,0,Math.PI*2); c.fill();
  c.fillStyle='#FFEEBB';
  c.beginPath(); c.arc(478,58,20,0,Math.PI*2); c.fill();
  // Moon glow
  const moonGlow = c.createRadialGradient(480,60,20,480,60,80);
  moonGlow.addColorStop(0,'rgba(255,238,170,0.15)');
  moonGlow.addColorStop(1,'rgba(0,0,0,0)');
  c.fillStyle=moonGlow; c.fillRect(400,0,160,140);
  // Sea
  const seaGrad = c.createLinearGradient(0,200,0,340);
  seaGrad.addColorStop(0,'#1A3050'); seaGrad.addColorStop(0.5,'#0A2040');
  seaGrad.addColorStop(1,'#051828');
  c.fillStyle=seaGrad; c.fillRect(0,200,640,140);
  // Moon reflection
  for (let ry=205;ry<310;ry+=4) {
    const spread=Math.sin(ry*0.3)*12;
    c.fillStyle=`rgba(255,238,170,${0.03+Math.random()*0.04})`;
    c.fillRect(470+spread,ry,20-Math.abs(spread)*0.3,3);
  }
  // Town silhouette
  c.fillStyle='#050A15';
  c.beginPath(); c.moveTo(0,280);
  [[40,260],[80,255],[120,262],[160,248],[200,255],[230,240],[260,250],
   [280,238],[310,235],[320,220],[330,235],[340,238],
   [360,248],[400,255],[440,258],[480,252],[520,260],[560,256],[600,262],[640,270]
  ].forEach(([x,y])=>c.lineTo(x,y));
  c.lineTo(640,420); c.lineTo(0,420); c.fill();
  // Warm windows
  c.fillStyle='#FFAA44';
  [[70,258],[150,250],[260,248],[300,240],[390,256],[470,255],[540,258],[580,260]].forEach(([wx,wy])=>{
    c.fillRect(wx,wy,5,4);
    // Window glow
    c.fillStyle=`rgba(255,170,68,0.15)`;
    c.beginPath(); c.arc(wx+2,wy+2,8,0,Math.PI*2); c.fill();
    c.fillStyle='#FFAA44';
  });
  // Cross on church silhouette
  c.fillStyle='#FFCC66';
  c.fillRect(318,212,4,10); c.fillRect(314,216,12,3);
  tc.insertBefore(cv,tc.firstChild);
})();

gameLoop();
