// ============================================================
// AUDIO — Web Audio API sound engine
// ============================================================

// ============================================================
// SOUND ENGINE — Web Audio API (no external files needed)
// ============================================================
const AudioSystem = (() => {
  let actx = null;
  let masterGain = null;
  let sfxGain = null;
  let ambientGain = null;
  let musicGain = null;
  let currentAmbient = null;
  let initialized = false;
  let muted = false;

  function init() {
    if (initialized) return;
    try {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = actx.createGain();
      masterGain.gain.value = 0.6;
      masterGain.connect(actx.destination);
      sfxGain = actx.createGain();
      sfxGain.gain.value = 0.5;
      sfxGain.connect(masterGain);
      ambientGain = actx.createGain();
      ambientGain.gain.value = 0.25;
      ambientGain.connect(masterGain);
      musicGain = actx.createGain();
      musicGain.gain.value = 0.15;
      musicGain.connect(masterGain);
      initialized = true;
    } catch(e) { console.warn('Audio not available:', e); }
  }

  function toggleMute() {
    muted = !muted;
    if (masterGain) masterGain.gain.value = muted ? 0 : 0.6;
    return muted;
  }

  // --- Tone generators ---
  function playTone(freq, dur, type, gain, dest) {
    if (!actx || muted) return;
    const osc = actx.createOscillator();
    const g = actx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(gain || 0.15, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + dur);
    osc.connect(g);
    g.connect(dest || sfxGain);
    osc.start(actx.currentTime);
    osc.stop(actx.currentTime + dur);
  }

  function playNoise(dur, gain, filterFreq, dest) {
    if (!actx || muted) return;
    const bufSize = actx.sampleRate * dur;
    const buf = actx.createBuffer(1, bufSize, actx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src = actx.createBufferSource();
    src.buffer = buf;
    const filter = actx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = filterFreq || 800;
    const g = actx.createGain();
    g.gain.setValueAtTime(gain || 0.05, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + dur);
    src.connect(filter);
    filter.connect(g);
    g.connect(dest || sfxGain);
    src.start();
  }

  // --- Sound Effects ---
  function footstep() {
    playNoise(0.08, 0.06, 600);
    playTone(80 + Math.random()*40, 0.06, 'triangle', 0.03);
  }

  function itemPickup() {
    if (!actx) return;
    const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
    notes.forEach((f, i) => {
      setTimeout(() => playTone(f, 0.15, 'sine', 0.12), i * 80);
    });
  }

  function doorCreak() {
    if (!actx) return;
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        playTone(120 + i*30 + Math.random()*50, 0.12, 'sawtooth', 0.04);
      }, i * 50);
    }
  }

  function drawerOpen() {
    playNoise(0.2, 0.08, 400);
    playTone(100, 0.15, 'triangle', 0.05);
    setTimeout(() => playTone(80, 0.1, 'triangle', 0.04), 100);
  }

  function chestUnlock() {
    if (!actx) return;
    // Mechanical click
    playTone(800, 0.05, 'square', 0.1);
    setTimeout(() => playTone(600, 0.05, 'square', 0.08), 60);
    setTimeout(() => playTone(400, 0.08, 'square', 0.06), 120);
    // Creak
    setTimeout(() => {
      for (let i = 0; i < 4; i++) {
        setTimeout(() => playTone(150 + i*20, 0.1, 'sawtooth', 0.03), i * 60);
      }
    }, 200);
  }

  function treasureFanfare() {
    if (!actx) return;
    const melody = [
      [392, 0.2], [440, 0.2], [523, 0.2], [659, 0.3],
      [523, 0.15], [659, 0.15], [784, 0.5],
      [659, 0.2], [784, 0.2], [1047, 0.6]
    ];
    let t = 0;
    melody.forEach(([freq, dur]) => {
      setTimeout(() => {
        playTone(freq, dur + 0.1, 'sine', 0.15);
        playTone(freq * 0.5, dur + 0.1, 'triangle', 0.06);
      }, t * 1000);
      t += dur;
    });
  }

  function seagullCry() {
    if (!actx || muted) return;
    const osc = actx.createOscillator();
    const g = actx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, actx.currentTime);
    osc.frequency.linearRampToValueAtTime(1200, actx.currentTime + 0.15);
    osc.frequency.linearRampToValueAtTime(1600, actx.currentTime + 0.25);
    osc.frequency.linearRampToValueAtTime(900, actx.currentTime + 0.5);
    g.gain.setValueAtTime(0.04, actx.currentTime);
    g.gain.linearRampToValueAtTime(0.06, actx.currentTime + 0.15);
    g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.5);
    osc.connect(g); g.connect(sfxGain);
    osc.start(); osc.stop(actx.currentTime + 0.5);
  }

  function catMeow() {
    if (!actx || muted) return;
    const osc = actx.createOscillator();
    const g = actx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, actx.currentTime);
    osc.frequency.linearRampToValueAtTime(900, actx.currentTime + 0.15);
    osc.frequency.linearRampToValueAtTime(500, actx.currentTime + 0.4);
    g.gain.setValueAtTime(0.08, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.45);
    osc.connect(g); g.connect(sfxGain);
    osc.start(); osc.stop(actx.currentTime + 0.45);
  }

  function waterDrip() {
    playTone(1400 + Math.random()*400, 0.08, 'sine', 0.06);
    setTimeout(() => playTone(800 + Math.random()*200, 0.12, 'sine', 0.03), 50);
  }

  function textAppear() {
    playTone(440, 0.04, 'sine', 0.04);
  }

  // --- Ambient loops ---
  function stopAmbient() {
    if (currentAmbient) {
      try { currentAmbient.forEach(n => { try { n.stop(); } catch(e){} }); } catch(e){}
      currentAmbient = null;
    }
  }

  function startAmbient(scene) {
    stopAmbient();
    if (!actx || muted) return;
    const nodes = [];

    if (scene === 'port' || scene === 'beach' || scene === 'boat') {
      // Ocean waves — looping filtered noise
      const waveDur = 8;
      function makeWave() {
        if (!actx || muted) return;
        const bufSize = actx.sampleRate * waveDur;
        const buf = actx.createBuffer(1, bufSize, actx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
        const src = actx.createBufferSource();
        src.buffer = buf;
        src.loop = true;
        const lp = actx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 300;
        // Modulate filter for wave swell
        const lfo = actx.createOscillator();
        const lfoGain = actx.createGain();
        lfo.frequency.value = 0.15;
        lfoGain.gain.value = 150;
        lfo.connect(lfoGain);
        lfoGain.connect(lp.frequency);
        lfo.start();
        const g = actx.createGain();
        g.gain.value = scene === 'beach' ? 0.08 : 0.05;
        src.connect(lp); lp.connect(g); g.connect(ambientGain);
        src.start();
        nodes.push(src, lfo);
      }
      makeWave();
    }
    else if (scene === 'cave') {
      // Cave drips — periodic plinks
      const dripInterval = setInterval(() => {
        if (muted) return;
        if (Math.random() > 0.4) waterDrip();
      }, 2000 + Math.random()*3000);
      // Low rumble
      const osc = actx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 55;
      const g = actx.createGain();
      g.gain.value = 0.03;
      osc.connect(g); g.connect(ambientGain);
      osc.start();
      nodes.push(osc);
      nodes._dripInterval = dripInterval;
    }
    else if (scene === 'town') {
      // Fountain trickle
      const bufSize = actx.sampleRate * 4;
      const buf = actx.createBuffer(1, bufSize, actx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const src = actx.createBufferSource();
      src.buffer = buf; src.loop = true;
      const bp = actx.createBiquadFilter();
      bp.type = 'bandpass'; bp.frequency.value = 2000; bp.Q.value = 2;
      const g = actx.createGain();
      g.gain.value = 0.02;
      src.connect(bp); bp.connect(g); g.connect(ambientGain);
      src.start();
      nodes.push(src);
    }
    else if (scene === 'house' || scene === 'church') {
      // Gentle reverb/wind
      const bufSize = actx.sampleRate * 6;
      const buf = actx.createBuffer(1, bufSize, actx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const src = actx.createBufferSource();
      src.buffer = buf; src.loop = true;
      const lp = actx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = scene === 'church' ? 150 : 200;
      const g = actx.createGain();
      g.gain.value = scene === 'church' ? 0.02 : 0.015;
      src.connect(lp); lp.connect(g); g.connect(ambientGain);
      src.start();
      nodes.push(src);
    }
    else if (scene === 'hilltop') {
      // Strong wind
      const bufSize = actx.sampleRate * 6;
      const buf = actx.createBuffer(1, bufSize, actx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const src = actx.createBufferSource();
      src.buffer = buf; src.loop = true;
      const lp = actx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 400;
      const lfo = actx.createOscillator();
      const lfoGain = actx.createGain();
      lfo.frequency.value = 0.1;
      lfoGain.gain.value = 200;
      lfo.connect(lfoGain); lfoGain.connect(lp.frequency);
      lfo.start();
      const g = actx.createGain();
      g.gain.value = 0.04;
      src.connect(lp); lp.connect(g); g.connect(ambientGain);
      src.start();
      nodes.push(src, lfo);
    }

    currentAmbient = nodes;
  }

  // Seagull timer for port/beach
  let seagullTimer = null;
  function startSeagulls() {
    stopSeagulls();
    seagullTimer = setInterval(() => {
      if (Math.random() > 0.5) seagullCry();
    }, 4000 + Math.random()*6000);
  }
  function stopSeagulls() {
    if (seagullTimer) { clearInterval(seagullTimer); seagullTimer = null; }
  }

  function sceneAudio(scene) {
    startAmbient(scene);
    if (scene === 'port' || scene === 'beach' || scene === 'boat') startSeagulls();
    else stopSeagulls();
  }

  // Cleanup ambient intervals on stop
  const origStop = stopAmbient;
  stopAmbient = function() {
    if (currentAmbient && currentAmbient._dripInterval) {
      clearInterval(currentAmbient._dripInterval);
    }
    origStop();
  };

  // --- Background Music (Mediterranean melody) ---
  let musicPlaying = false;
  let musicNodes = [];
  let musicEnabled = true;

  function stopMusic() {
    musicNodes.forEach(n => { try { n.stop(); } catch(e){} });
    musicNodes = [];
    musicPlaying = false;
  }

  function toggleMusic() {
    musicEnabled = !musicEnabled;
    if (!musicEnabled) stopMusic();
    else startMusic();
    return musicEnabled;
  }

  function startMusic() {
    if (!actx || !musicEnabled || muted || musicPlaying) return;
    musicPlaying = true;
    // Mediterranean melody — repeating pattern with bouzouki-like tones
    const melody = [
      // A minor / Greek-ish scale: A B C D E F G# A
      392, 440, 523, 587, 659, 698, 831, 880,
      880, 831, 698, 659, 587, 523, 440, 392,
      440, 523, 659, 523, 440, 392, 349, 392,
      523, 587, 659, 698, 659, 587, 523, 440,
    ];
    const noteDur = 0.35;
    let noteIdx = 0;

    function playNextNote() {
      if (!musicEnabled || muted || !musicPlaying) return;
      const freq = melody[noteIdx % melody.length];
      // Main voice — triangle for bouzouki feel
      const osc1 = actx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.value = freq;
      const g1 = actx.createGain();
      g1.gain.setValueAtTime(0.06, actx.currentTime);
      g1.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + noteDur * 0.9);
      osc1.connect(g1); g1.connect(musicGain);
      osc1.start(); osc1.stop(actx.currentTime + noteDur);
      // Harmony — soft sine an octave below
      if (noteIdx % 2 === 0) {
        const osc2 = actx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = freq * 0.5;
        const g2 = actx.createGain();
        g2.gain.setValueAtTime(0.03, actx.currentTime);
        g2.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + noteDur * 1.5);
        osc2.connect(g2); g2.connect(musicGain);
        osc2.start(); osc2.stop(actx.currentTime + noteDur * 1.5);
      }
      noteIdx++;
      musicNodes._timer = setTimeout(playNextNote, noteDur * 1000);
    }
    playNextNote();
  }

  // Override stopAmbient cleanup to also clear music timer
  const origStop2 = stopAmbient;
  stopAmbient = function() {
    origStop2();
  };

  return {
    init, toggleMute, footstep, itemPickup, doorCreak, drawerOpen,
    chestUnlock, treasureFanfare, seagullCry, catMeow, waterDrip,
    textAppear, sceneAudio, stopAmbient, stopSeagulls,
    startMusic, stopMusic, toggleMusic,
    isMuted: () => muted, isMusicEnabled: () => musicEnabled,
  };
})();
