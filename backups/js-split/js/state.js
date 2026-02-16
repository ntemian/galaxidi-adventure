// ============================================================
// STATE — Game state, save/load, transitions
// ============================================================

// --- GAME STATE ---
const state = {
  scene: 'house', verb: 'walk', inventory: [], flags: {
    drawerOpen: false, letterTaken: false, letterRead: false,
    lanternTaken: false, talkedFisherman: false, compassTaken: false,
    shellTaken: false, chestOpen: false, mapTaken: false,
    caveIlluminated: false, treasureFound: false,
    visitedChurch: false, litCandle: false, talkedMonk: false,
    visitedHilltop: false, visitedBoat: false,
  },
  selectedInvItem: null,
  charX: 300, charY: 260,
  charTargetX: 300, charTargetY: 260,
  charWalking: false, charDir: 1, charFrame: 0, charFrameTimer: 0,
  textTimer: 0, won: false, started: false, tick: 0,
  fading: false, dialogActive: false,
  // Speech bubble system
  speechBubbles: [], // [{text, speaker, timer, color, x, y}]
  // Idle & animation system
  idleTick: 0,        // ticks since last movement
  blinkTimer: 0,      // countdown to next blink
  blinkDuration: 0,   // how long current blink lasts
  breathPhase: 0,     // breathing sine phase
  lookDir: 0,         // -1/0/1 for idle look direction
  lookTimer: 0,       // countdown to next look change
  // Parallax
  parallaxX: 0,       // horizontal offset for parallax layers
  cloudOffset: 0,     // cloud layer offset
  // Color cycling
  waterCyclePhase: 0, // water color shift
  // Portrait
  currentSpeaker: null,
};

// --- FADE TRANSITION ---
const fadeEl = document.getElementById('fade-overlay');
function fadeTransition(callback) {
  if (state.fading) return;
  state.fading = true;
  fadeEl.classList.add('active');
  setTimeout(() => {
    callback();
    setTimeout(() => {
      fadeEl.classList.remove('active');
      state.fading = false;
    }, 100);
  }, 400);
}

// --- SAVE / LOAD ---
function saveGame() {
  const save = { scene: state.scene, inventory: [...state.inventory], flags: {...state.flags},
    charX: state.charX, charY: state.charY, won: state.won };
  localStorage.setItem('galaxidi_save', JSON.stringify(save));
  showText("Παιχνίδι αποθηκεύτηκε!");
}
function loadGame() {
  const raw = localStorage.getItem('galaxidi_save');
  if (!raw) { showText("Δεν υπάρχει αποθηκευμένο παιχνίδι."); return; }
  try {
    const save = JSON.parse(raw);
    Object.assign(state.flags, save.flags);
    state.inventory = save.inventory;
    state.charX = save.charX; state.charY = save.charY;
    state.charTargetX = save.charX; state.charTargetY = save.charY;
    state.won = save.won;
    state.selectedInvItem = null;
    state.charWalking = false;
    changeScene(save.scene);
    renderInventory();
    showText("Παιχνίδι φορτώθηκε!");
  } catch(e) { showText("Σφάλμα φόρτωσης."); }
}
// expose for HTML onclick
window.saveGame = saveGame;
window.loadGame = loadGame;

