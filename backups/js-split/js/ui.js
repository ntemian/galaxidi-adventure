// ============================================================
// UI — Dialog, mini-map, narrator, inventory, verbs, hints
// ============================================================

// --- DIALOG SYSTEM ---
const dialogOverlay = document.getElementById('dialog-overlay');
function showDialog(options) {
  // options: [{text, callback}, ...]
  dialogOverlay.innerHTML = '';
  dialogOverlay.style.display = 'flex';
  state.dialogActive = true;
  options.forEach(opt => {
    const btn = document.createElement('div');
    btn.className = 'dialog-option';
    btn.textContent = '> ' + opt.text;
    btn.addEventListener('click', () => {
      dialogOverlay.style.display = 'none';
      state.dialogActive = false;
      opt.callback();
    });
    dialogOverlay.appendChild(btn);
  });
}

// --- MINI-MAP ---
const miniMapCanvas = document.getElementById('mini-map');
const miniCtx = miniMapCanvas.getContext('2d');
const MAP_LOCATIONS = {
  house:   { x:15, y:35, label:'Σπίτι' },
  port:    { x:40, y:50, label:'Λιμάνι' },
  beach:   { x:75, y:45, label:'Παραλία' },
  town:    { x:35, y:20, label:'Πόλη' },
  cave:    { x:85, y:30, label:'Σπηλιά' },
  church:  { x:45, y:10, label:'Εκκλησία' },
  hilltop: { x:20, y:8, label:'Λόφος' },
  boat:    { x:55, y:55, label:'Βάρκα' },
};
const MAP_PATHS = [
  ['house','port'],['port','beach'],['port','town'],['beach','cave'],
  ['town','church'],['town','hilltop'],['port','boat'],
];
function drawMiniMap() {
  miniCtx.clearRect(0,0,100,70);
  // Sea background
  miniCtx.fillStyle = '#0A2848';
  miniCtx.fillRect(0,0,100,70);
  // Land
  miniCtx.fillStyle = '#2A5533';
  miniCtx.beginPath();
  miniCtx.moveTo(0,15); miniCtx.lineTo(30,5); miniCtx.lineTo(60,10);
  miniCtx.lineTo(90,20); miniCtx.lineTo(100,25); miniCtx.lineTo(100,70);
  miniCtx.lineTo(0,70); miniCtx.fill();
  // Paths
  miniCtx.strokeStyle = '#886';
  miniCtx.lineWidth = 1;
  MAP_PATHS.forEach(([a,b]) => {
    const la = MAP_LOCATIONS[a], lb = MAP_LOCATIONS[b];
    miniCtx.beginPath(); miniCtx.moveTo(la.x,la.y); miniCtx.lineTo(lb.x,lb.y); miniCtx.stroke();
  });
  // Location dots
  Object.entries(MAP_LOCATIONS).forEach(([id, loc]) => {
    miniCtx.fillStyle = id === state.scene ? '#FFCC00' : '#888';
    miniCtx.beginPath(); miniCtx.arc(loc.x, loc.y, id === state.scene ? 4 : 2.5, 0, Math.PI*2); miniCtx.fill();
    if (id === state.scene) {
      miniCtx.fillStyle = '#FFCC00';
      miniCtx.font = '6px sans-serif';
      miniCtx.textAlign = 'center';
      miniCtx.fillText(loc.label, loc.x, loc.y - 6);
    }
  });
}

// --- SOUND & NARRATION BUTTONS ---
document.getElementById('sound-btn').addEventListener('click', () => {
  const m = AudioSystem.toggleMute();
  document.getElementById('sound-btn').style.color = m ? '#884444' : '#55DD55';
});
document.getElementById('narrate-btn').addEventListener('click', () => {
  const on = Narrator.toggle();
  document.getElementById('narrate-btn').style.color = on ? '#55DD55' : '#884444';
});
document.getElementById('music-btn').addEventListener('click', () => {
  const on = AudioSystem.toggleMusic();
  document.getElementById('music-btn').style.color = on ? '#55DD55' : '#884444';
});

// --- NARRATION (Web Speech API — Greek voice) ---
const Narrator = (() => {
  let greekVoice = null;
  let enabled = true;
  let speaking = false;

  function findGreekVoice() {
    const voices = speechSynthesis.getVoices();
    greekVoice = voices.find(v => v.lang.startsWith('el')) ||
                 voices.find(v => v.lang.includes('el')) || null;
  }
  if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.onvoiceschanged = findGreekVoice;
    findGreekVoice();
  }

  function speak(text) {
    if (!enabled || !speechSynthesis || !text) return;
    speechSynthesis.cancel();
    // Clean text for speech
    const clean = text.replace(/[!?.]{2,}/g, '.').replace(/\n/g, ' ').substring(0, 300);
    const utt = new SpeechSynthesisUtterance(clean);
    utt.lang = 'el-GR';
    if (greekVoice) utt.voice = greekVoice;
    utt.rate = 0.9;
    utt.pitch = 1.0;
    utt.volume = 0.8;
    speaking = true;
    utt.onend = () => { speaking = false; };
    utt.onerror = () => { speaking = false; };
    speechSynthesis.speak(utt);
  }

  function toggle() { enabled = !enabled; if (!enabled) speechSynthesis.cancel(); return enabled; }
  return { speak, toggle, isEnabled: () => enabled };
})();

// --- TEXT & SPEECH BUBBLE SYSTEM ---
// Character speech colors (Monkey Island style — each character has their own color)
const SPEECH_COLORS = {
  ntemis: '#FFCC00',    // Gold — Ntemis
  ajax: '#FF6644',      // Orange-red — Ajax
  clio: '#FF88CC',      // Pink — Clio
  fisherman: '#88CCFF', // Light blue — Fisherman
  monk: '#AADDAA',      // Soft green — Monk
  cat: '#FFAA44',       // Orange — Cat
  narrator: '#FFCC00',  // Gold — Narrator/description
};

function detectSpeaker(msg) {
  // Detect who's talking based on text patterns
  if (msg.includes("Αίαντας") || msg.includes("'Είμαι ο καπετάνιος") || msg.includes("'Αυτό είναι σαν"))
    return 'ajax';
  if (msg.includes("Κλειώ") || msg.includes("'Μπαμπά") || msg.includes("'Μυρίζει"))
    return 'clio';
  if (msg.includes("ψαράς") || msg.includes("'Καλημέρα") || msg.includes("Γαλαξειδιώτης") || msg.includes("Ψαρεύω"))
    return 'fisherman';
  if (msg.includes("Παπα-Νικόλα") || msg.includes("παιδί μου") || msg.includes("Θεός"))
    return 'monk';
  if (msg.includes("Μιααου") || msg.includes("γουργουρ"))
    return 'cat';
  if (msg.includes("Ντέμης") || msg.includes("'Αυτό ζωγραφίστηκε") || msg.includes("'Χιλιάδες"))
    return 'ntemis';
  // Check for quoted speech
  if (msg.startsWith("'") || msg.includes("λέει ο Αίαντας")) return 'ajax';
  if (msg.includes("λέει η Κλειώ") || msg.includes("ουρλιάζει η Κλειώ")) return 'clio';
  return 'narrator';
}

function getSpeakerPosition(speaker) {
  const x = Math.round(state.charX);
  const y = Math.round(state.charY);
  const d = state.charDir;
  switch(speaker) {
    case 'ntemis': return { x: x, y: y - 65 };
    case 'ajax': return { x: x + 28*d, y: y - 55 };
    case 'clio': return { x: x - 26*d, y: y - 45 };
    case 'fisherman': return { x: 540, y: 155 };
    case 'monk': return { x: 540, y: 155 };
    case 'cat': return { x: 383, y: 200 };
    default: return { x: W/2, y: 30 };
  }
}

function showText(msg) {
  textOverlay.textContent = msg;
  state.textTimer = 350;
  AudioSystem.textAppear();
  Narrator.speak(msg);

  // Create speech bubble
  const speaker = detectSpeaker(msg);
  const color = SPEECH_COLORS[speaker] || '#FFCC00';
  const pos = getSpeakerPosition(speaker);
  // Split long text into short bubble text
  const bubbleText = msg.length > 60 ? msg.substring(0, 57) + '...' : msg;
  state.speechBubbles = [{ text: bubbleText, speaker, color, x: pos.x, y: pos.y, timer: 250 }];
  updateTextOverlayColor(color);
  // Dialog portrait (#7)
  state.currentSpeaker = speaker;
  drawPortrait(speaker);
}
function clearText() {
  textOverlay.textContent = '';
  state.speechBubbles = [];
  state.currentSpeaker = null;
  portraitCanvas.style.display = 'none';
}

function drawSpeechBubbles() {
  state.speechBubbles.forEach(bubble => {
    if (bubble.timer <= 0) return;
    const x = Math.max(80, Math.min(W - 80, bubble.x));
    const y = Math.max(20, bubble.y);

    // Word wrap
    ctx.font = '9px Courier New';
    const maxW = 160;
    const words = bubble.text.split(' ');
    const lines = [];
    let line = '';
    words.forEach(w => {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxW) {
        if (line) lines.push(line);
        line = w;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    if (lines.length > 3) lines.length = 3;

    const lineH = 12;
    const padX = 8, padY = 5;
    const bw = Math.min(maxW + padX*2, lines.reduce((max, l) => Math.max(max, ctx.measureText(l).width), 0) + padX*2);
    const bh = lines.length * lineH + padY*2;
    const bx = x - bw/2;
    const by = y - bh - 8;

    // Fade out near end
    const alpha = bubble.timer < 40 ? bubble.timer / 40 : 1;
    ctx.save();
    ctx.globalAlpha = alpha;

    // Bubble background
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.beginPath();
    const r = 4;
    ctx.moveTo(bx+r, by);
    ctx.lineTo(bx+bw-r, by); ctx.arcTo(bx+bw, by, bx+bw, by+r, r);
    ctx.lineTo(bx+bw, by+bh-r); ctx.arcTo(bx+bw, by+bh, bx+bw-r, by+bh, r);
    ctx.lineTo(bx+r, by+bh); ctx.arcTo(bx, by+bh, bx, by+bh-r, r);
    ctx.lineTo(bx, by+r); ctx.arcTo(bx, by, bx+r, by, r);
    ctx.fill();

    // Tail pointing down to character
    ctx.beginPath();
    ctx.moveTo(x-5, by+bh);
    ctx.lineTo(x, by+bh+8);
    ctx.lineTo(x+5, by+bh);
    ctx.fill();

    // Border
    ctx.strokeStyle = bubble.color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(bx+r, by);
    ctx.lineTo(bx+bw-r, by); ctx.arcTo(bx+bw, by, bx+bw, by+r, r);
    ctx.lineTo(bx+bw, by+bh-r); ctx.arcTo(bx+bw, by+bh, bx+bw-r, by+bh, r);
    ctx.lineTo(bx+r, by+bh); ctx.arcTo(bx, by+bh, bx, by+bh-r, r);
    ctx.lineTo(bx, by+r); ctx.arcTo(bx, by, bx+r, by, r);
    ctx.stroke();

    // Text
    ctx.fillStyle = bubble.color;
    ctx.font = '9px Courier New';
    ctx.textAlign = 'center';
    lines.forEach((l, i) => {
      ctx.fillText(l, x, by + padY + (i+1)*lineH - 2);
    });
    ctx.textAlign = 'left';

    ctx.restore();
  });
}

// Also color the text overlay based on speaker
function updateTextOverlayColor(color) {
  textOverlay.style.color = color;
}

// --- INVENTORY ---
function addItem(id) {
  if (!state.inventory.includes(id)) { state.inventory.push(id); renderInventory(); AudioSystem.itemPickup(); }
}
function removeItem(id) {
  state.inventory = state.inventory.filter(i=>i!==id);
  if (state.selectedInvItem===id) state.selectedInvItem=null;
  renderInventory();
}
function hasItem(id) { return state.inventory.includes(id); }

const ITEM_NAMES = {
  letter:"Παλιό Γράμμα", lantern:"Φανάρι", compass:"Πυξίδα",
  shell:"Χρυσό Κοχύλι", map:"Χάρτης Θησαυρού",
};
const ITEM_DESCS = {
  letter: 'Ένα παλιό κιτρινισμένο γράμμα. Γράφει: "Ο θησαυρός του Καπετάν Γαλαξειδιώτη βρίσκεται εκεί που το χρυσό κοχύλι ανοίγει το σεντούκι, και η πυξίδα δείχνει τη σπηλιά στη θάλασσα."',
  lantern: 'Ένα γερό φανάρι λαδιού από το σπίτι. Έχει ακόμα καύσιμο — τέλειο για σκοτεινά μέρη.',
  compass: 'Μια παλιά μπρούτζινη πυξίδα από τον ψαρά. Η βελόνα δείχνει πάντα προς τους δυτικούς βράχους.',
  shell: 'Ένα πανέμορφο χρυσαφί κοχύλι σε σχήμα κλειδιού. Πολύ ασυνήθιστο.',
  map: 'Ένας χειροποίητος χάρτης με την ακτογραμμή του Γαλαξειδίου. Ένα κόκκινο Χ δείχνει μια σπηλιά δυτικά!',
};

function renderInventory() {
  inventoryPanel.querySelectorAll('.inv-slot').forEach(s=>s.remove());
  state.inventory.forEach(id => {
    const slot = document.createElement('div');
    slot.className = 'inv-slot' + (state.selectedInvItem===id?' selected':'');
    slot.title = ITEM_NAMES[id]||id;
    const c = document.createElement('canvas');
    c.width=48; c.height=48;
    drawItemIcon(c.getContext('2d'), id, 24, 24);
    slot.appendChild(c);
    slot.addEventListener('click', ()=>{
      if (state.verb==='use') {
        state.selectedInvItem = state.selectedInvItem===id ? null : id;
        renderInventory();
        if (state.selectedInvItem) hoverLabel.textContent = `Χρησιμοποίησε ${ITEM_NAMES[id]} σε...`;
        else hoverLabel.textContent = '';
      } else {
        showText(ITEM_DESCS[id] || `Εξετάζεις: ${ITEM_NAMES[id]}.`);
      }
    });
    inventoryPanel.appendChild(slot);
  });
}

function drawItemIcon(c, id, cx, cy) {
  c.imageSmoothingEnabled = false;
  switch(id) {
    case 'letter':
      c.fillStyle='#DDCC88'; c.fillRect(cx-8,cy-10,16,20);
      c.fillStyle='#CCBB77'; c.fillRect(cx-7,cy-9,14,18);
      c.fillStyle=C.WOOD_MID;
      c.fillRect(cx-5,cy-6,10,1); c.fillRect(cx-5,cy-3,9,1);
      c.fillRect(cx-5,cy,8,1); c.fillRect(cx-5,cy+3,7,1); c.fillRect(cx-5,cy+6,6,1);
      // Seal
      c.fillStyle=C.RED; c.beginPath(); c.arc(cx,cy+10,3,0,Math.PI*2); c.fill();
      break;
    case 'lantern':
      c.fillStyle=C.WOOD_MID; c.fillRect(cx-2,cy-12,4,4); // handle top
      c.fillStyle='#AA8833'; c.fillRect(cx-6,cy-8,12,3); // top cap
      c.fillStyle=C.YELLOW;  c.fillRect(cx-5,cy-5,10,12); // glass
      c.fillStyle='#FFAA33'; c.fillRect(cx-3,cy-3,6,8); // flame glow
      c.fillStyle=C.WHITE;   c.fillRect(cx-1,cy-2,2,4); // flame
      c.fillStyle='#AA8833'; c.fillRect(cx-6,cy+7,12,3); // bottom cap
      c.fillStyle=C.WOOD_MID; c.fillRect(cx-4,cy+10,8,3);
      break;
    case 'compass':
      c.fillStyle='#886633'; c.beginPath(); c.arc(cx,cy,10,0,Math.PI*2); c.fill();
      c.fillStyle='#CCBB88'; c.beginPath(); c.arc(cx,cy,8,0,Math.PI*2); c.fill();
      c.fillStyle=C.WHITE; c.beginPath(); c.arc(cx,cy,7,0,Math.PI*2); c.fill();
      // Cardinal marks
      c.fillStyle='#333'; c.font='6px sans-serif'; c.textAlign='center';
      c.fillText('N',cx,cy-3); c.fillText('S',cx,cy+7);
      // Needle
      c.fillStyle=C.RED; c.fillRect(cx-1,cy-6,2,5);
      c.fillStyle='#336'; c.fillRect(cx-1,cy,2,5);
      c.fillStyle='#333'; c.beginPath(); c.arc(cx,cy,1.5,0,Math.PI*2); c.fill();
      break;
    case 'shell':
      c.fillStyle=C.GOLD_DARK; c.beginPath(); c.ellipse(cx,cy,9,7,0,0,Math.PI*2); c.fill();
      c.fillStyle=C.GOLD; c.beginPath(); c.ellipse(cx,cy,7,5,0,0,Math.PI*2); c.fill();
      c.fillStyle=C.GOLD_BRIGHT; c.beginPath(); c.ellipse(cx-2,cy-1,4,3,0,0,Math.PI*2); c.fill();
      // Ridges
      c.strokeStyle=C.GOLD_DARK; c.lineWidth=0.5;
      for (let a=0; a<Math.PI*2; a+=Math.PI/5) {
        c.beginPath(); c.moveTo(cx,cy);
        c.lineTo(cx+Math.cos(a)*8, cy+Math.sin(a)*6); c.stroke();
      }
      // Key tooth
      c.fillStyle=C.GOLD_DARK; c.fillRect(cx+7,cy-2,5,4);
      c.fillRect(cx+10,cy+1,3,2);
      break;
    case 'map':
      c.fillStyle='#DDCC88'; c.fillRect(cx-9,cy-8,18,16);
      c.fillStyle='#CCBB77';
      c.fillRect(cx-8,cy-7,16,14);
      // Mini coastline
      c.fillStyle=C.SEA_MID;
      c.fillRect(cx-6,cy-1,12,8);
      c.fillStyle=C.LEAF_MID;
      c.beginPath(); c.moveTo(cx-6,cy+2); c.lineTo(cx-2,cy-2);
      c.lineTo(cx+2,cy); c.lineTo(cx+6,cy-3); c.lineTo(cx+6,cy+2); c.fill();
      // X mark
      c.strokeStyle=C.RED; c.lineWidth=1.5;
      c.beginPath(); c.moveTo(cx+2,cy+2); c.lineTo(cx+5,cy+5); c.stroke();
      c.beginPath(); c.moveTo(cx+5,cy+2); c.lineTo(cx+2,cy+5); c.stroke();
      break;
  }
}

// --- VERB SYSTEM (MI-style with sentence line) ---
const verbBtns = document.querySelectorAll('.verb-btn');
const sentenceLine = document.getElementById('sentence-line');
const VERB_NAMES = {
  walk:'Πήγαινε', look:'Κοίτα', take:'Πάρε', use:'Χρησιμοποίησε',
  talk:'Μίλα σε', open:'Άνοιξε', close:'Κλείσε', push:'Σπρώξε', pull:'Τράβα'
};
function updateSentence(extra) {
  const vn = VERB_NAMES[state.verb] || state.verb;
  const sel = state.selectedInvItem ? ` ${ITEM_NAMES[state.selectedInvItem]} σε` : '';
  sentenceLine.textContent = vn + sel + (extra ? ' ' + extra : '');
}
verbBtns.forEach(btn => {
  btn.addEventListener('click', ()=>{
    // Map new verbs to existing handlers
    const v = btn.dataset.verb;
    if (v === 'close' || v === 'push' || v === 'pull') {
      state.verb = v; // these will show text but use generic handler
    } else {
      state.verb = v;
    }
    state.selectedInvItem = null;
    setActiveVerb(v);
    renderInventory();
    updateSentence();
  });
});
function setActiveVerb(v) {
  verbBtns.forEach(b=>b.classList.toggle('active', b.dataset.verb===v));
  canvas.className = 'cursor-' + v;
  updateSentence();
}
setActiveVerb('walk');

// --- DYNAMIC HINT SYSTEM ---
function getNextHint() {
  const f = state.flags;
  if (!f.drawerOpen)
    return "Ψάξε μέσα στο σπίτι. Δοκίμασε να ανοίξεις (Άνοιξε) το συρτάρι κάτω από το τραπέζι της κουζίνας!";
  if (!f.letterTaken)
    return "Υπάρχει ένα γράμμα μέσα στο ανοιχτό συρτάρι — πάρε το (Πάρε)!";
  if (!f.lanternTaken)
    return "Πάρε το φανάρι από το ράφι δεξιά. Θα το χρειαστείς αργότερα σε σκοτεινά μέρη!";
  if (!f.talkedFisherman)
    return "Πήγαινε στο λιμάνι (από την Εξώπορτα) και δείξε το γράμμα στον ψαρά. Πάτα «Χρησ.», κλικ στο Γράμμα, μετά κλικ στον Ψαρά!";
  if (!f.shellTaken)
    return "Πήγαινε στην παραλία (δεξιά από το λιμάνι). Ψάξε για κάτι λαμπερό στην άμμο και πάρε το!";
  if (!f.chestOpen)
    return "Πήγαινε στην Παλιά Πόλη (σκαλιά στο κέντρο του λιμανιού). Χρησιμοποίησε το Χρυσό Κοχύλι στο Πέτρινο Σεντούκι!";
  if (!f.mapTaken)
    return "Πάρε τον χάρτη μέσα από το ανοιχτό σεντούκι στην πλατεία!";
  if (!f.caveIlluminated)
    return "Πήγαινε στη σπηλιά (από την παραλία, δεξιά). Μέσα, χρησιμοποίησε το Φανάρι σε οτιδήποτε για να δεις!";
  if (!f.treasureFound)
    return "Ο θησαυρός είναι εκεί μέσα! Πάρε τον (Πάρε) από την Εσοχή στο Βράχο!";
  return "Βρήκατε τον θησαυρό! Μπράβο σε όλη την οικογένεια!";
}

// --- HELP ---
document.getElementById('help-btn').addEventListener('click', ()=>{
  document.getElementById('dynamic-hint').textContent = getNextHint();
  document.getElementById('help-overlay').style.display='flex';
});
document.getElementById('help-overlay').addEventListener('click', ()=>{
  document.getElementById('help-overlay').style.display='none';
});

