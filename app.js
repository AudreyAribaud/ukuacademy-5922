// --- CHORD DICTIONARY (Ukulele G-C-E-A) ---
// Format: [G, C, E, A] frets. -1 or 0 for open, numbers for frets.
const CHORDS = {
  'C': [0, 0, 0, 3],
  'G': [0, 2, 3, 2],
  'Am': [2, 0, 0, 0],
  'F': [2, 0, 1, 0],
  'D': [2, 2, 2, 0],
  'Dm': [2, 2, 1, 0],
  'Em': [0, 4, 3, 2],
  'E7': [1, 2, 0, 2],
  'Am7': [0, 0, 0, 0],
  'Fmaj7': [2, 4, 1, 3],
  'G7': [0, 2, 1, 2],
  'C7': [0, 0, 0, 1],
  'A': [2, 1, 0, 0],
  'A7': [1, 0, 0, 0],
  'E': [4, 4, 4, 2],
  'Bm': [4, 2, 2, 2],
  'B7': [2, 1, 2, 0],
  'D7': [2, 0, 2, 0],
  'Fm': [1, 0, 1, 3],
  'Cm': [0, 3, 3, 3],
  'Bb': [3, 2, 1, 1],
  'Gm': [0, 2, 3, 1],
  'Ab': [5, 3, 4, 3],
  'Db': [1, 1, 1, 4],
  'F#m': [2, 1, 2, 0]
};

// --- 50 CHORD PROGRESSIONS --- 
const PROGRESSIONS = [
  { id: 1, name: "Le Classique Pop", chords: ["C", "G", "Am", "F"], genre: "Pop" },
  { id: 2, name: "Le Standard Folk", chords: ["G", "D", "Em", "C"], genre: "Folk" },
  { id: 3, name: "Le Blues de Base", chords: ["C7", "F", "C7", "G7"], genre: "Blues" },
  { id: 4, name: "La Nostalgie 50s", chords: ["C", "Am", "F", "G"], genre: "Pop" },
  { id: 5, name: "Le Voyage Épique", chords: ["Am", "F", "C", "G"], genre: "Pop" },
  { id: 6, name: "Jazz Doux", chords: ["Dm", "G7", "C", "Am"], genre: "Jazz" },
  { id: 7, name: "La Ballade Triste", chords: ["Am", "Dm", "G", "C"], genre: "Folk" },
  { id: 8, name: "Le Sunset Chill", chords: ["Fmaj7", "G7", "C", "Am7"], genre: "Jazz" },
  { id: 9, name: "Le Reggae Vibe", chords: ["C", "F", "G", "F"], genre: "Pop" },
  { id: 10, name: "Le Flamenco", chords: ["Am", "G", "F", "E7"], genre: "Classique" },
  { id: 11, name: "Le Canon", chords: ["C", "G", "Am", "Em", "F", "C", "F", "G"], genre: "Classique" },
  { id: 12, name: "L'Optimiste", chords: ["C", "F", "C", "G"], genre: "Pop" },
  { id: 13, name: "Le Mystérieux", chords: ["Am", "Em", "F", "G"], genre: "Folk" },
  { id: 14, name: "Le Jazz Turnaround", chords: ["C", "A7", "Dm", "G7"], genre: "Jazz" },
  { id: 15, name: "Le Rock n Roll", chords: ["A", "D", "A", "E7"], genre: "Blues" },
  { id: 16, name: "Le Rêveur", chords: ["F", "G", "Em", "Am"], genre: "Pop" },
  { id: 17, name: "Le Mélancolique", chords: ["Dm", "Am", "E7", "Am"], genre: "Folk" },
  { id: 18, name: "Le Feu de Camp", chords: ["G", "C", "D", "G"], genre: "Folk" },
  { id: 19, name: "Le Sophistiqué", chords: ["Cmaj7", "Fmaj7", "Dm7", "G7"], chords: ["C7", "F", "G7", "C"], genre: "Jazz" },
  { id: 20, name: "Le Road Trip", chords: ["D", "A", "Bm", "G"], genre: "Pop" },
  { id: 21, name: "Le Vintage", chords: ["C", "C7", "F", "Fm"], genre: "Pop" },
  { id: 22, name: "Le Sombre", chords: ["Am", "Dm", "E7", "Am"], genre: "Classique" },
  { id: 23, name: "Le Brise de Mer", chords: ["C", "Am", "Dm", "G7"], genre: "Pop" },
  { id: 24, name: "Le Jazzy Blues", chords: ["C7", "F7", "C7", "G7"], genre: "Blues" },
  { id: 25, name: "Le Folk Moderne", chords: ["Em", "C", "G", "D"], genre: "Folk" },
  { id: 26, name: "L'Espagnol", chords: ["Dm", "C", "Bb", "A"], genre: "Classique" },
  { id: 27, name: "Le Romantique", chords: ["C", "Em", "F", "G"], genre: "Pop" },
  { id: 28, name: "Le Groovy", chords: ["Am7", "D7", "G7", "C7"], genre: "Jazz" },
  { id: 29, name: "Le Cool Breeze", chords: ["F", "G", "C", "C"], genre: "Pop" },
  { id: 30, name: "Le Folk Mélodique", chords: ["G", "Em", "C", "D"], genre: "Folk" },
  { id: 31, name: "Le Blues Mineur", chords: ["Am", "Dm", "Am", "E7"], genre: "Blues" },
  { id: 32, name: "L'Aventurier", chords: ["D", "G", "Bm", "A"], genre: "Pop" },
  { id: 33, name: "Le Doux Matin", chords: ["C", "Fmaj7", "C", "Fmaj7"], genre: "Jazz" },
  { id: 34, name: "Le Retro Pop", chords: ["G", "Em", "Am", "D7"], genre: "Pop" },
  { id: 35, name: "Le Classique Rock", chords: ["A", "G", "D", "A"], genre: "Folk" },
  { id: 36, name: "Le Nocturne", chords: ["Am", "G", "Em", "Am"], genre: "Classique" },
  { id: 37, name: "Le Soleil Levant", chords: ["Am", "C", "D", "F"], genre: "Folk" },
  { id: 38, name: "Le Jazz Club", chords: ["Dm", "G7", "Cmaj7", "A7"], chords: ["Dm", "G7", "C", "A7"], genre: "Jazz" },
  { id: 39, name: "Le Funk Uku", chords: ["Am7", "Dm7", "Am7", "E7"], genre: "Jazz" },
  { id: 40, name: "Le Surf Rock", chords: ["C", "Am", "F", "G7"], genre: "Pop" },
  { id: 41, name: "Le Rêve Éveillé", chords: ["F", "Fm", "C", "C"], genre: "Pop" },
  { id: 42, name: "Le Folk Triste", chords: ["Em", "Am", "B7", "Em"], genre: "Folk" },
  { id: 43, name: "Le Bluesy", chords: ["A7", "D7", "A7", "E7"], genre: "Blues" },
  { id: 44, name: "Le Pop Lumineux", chords: ["D", "G", "A", "G"], genre: "Pop" },
  { id: 45, name: "Le Classique Douceur", chords: ["C", "Em", "Am", "F"], genre: "Classique" },
  { id: 46, name: "Le Jazz Swing", chords: ["C", "A7", "D7", "G7"], genre: "Jazz" },
  { id: 47, name: "L'Évasion", chords: ["Bm", "G", "D", "A"], genre: "Folk" },
  { id: 48, name: "Le Melancholia", chords: ["F#m", "D", "A", "E"], genre: "Pop" },
  { id: 49, name: "Le Blues Traditionnel", chords: ["G7", "C7", "G7", "D7"], genre: "Blues" },
  { id: 50, name: "L'Ultime Résolution", chords: ["C", "F", "G7", "C"], genre: "Pop" }
];

// --- RHYTHM PATTERNS --- 
const RHYTHMS = [
  { name: "Le Feu de Camp (Island Strum)", pattern: "D-DU-UDE", strums: ["D", "X", "D", "U", "X", "U", "D", "U"], desc: "Le rythme le plus célèbre du ukulélé. Parfait pour 90% des chansons pop/folk." },
  { name: "Le Pop Simple", pattern: "D-D-D-D", strums: ["D", "X", "D", "X", "D", "X", "D", "X"], desc: "Idéal pour débuter et se concentrer sur le changement d'accords." },
  { name: "Le Reggae Skank", pattern: "-U-U-U-U", strums: ["X", "U", "X", "U", "X", "U", "X", "U"], desc: "Accentuez le contretemps (le 'et' du temps) pour un effet reggae garanti." },
  { name: "Le Valse (3/4)", pattern: "D-DU-DU", strums: ["D", "X", "D", "U", "D", "U"], desc: "Un rythme à trois temps. Accentuez bien le premier coup vers le bas." },
  { name: "Le Folk Rapide", pattern: "D-DU-D-DU", strums: ["D", "X", "D", "U", "D", "X", "D", "U"], desc: "Donne de l'énergie et du mouvement à vos morceaux folk." }
];

// --- STATE MANAGEMENT ---
let currentTab = 'tab-progressions';
let isDarkMode = true;
let audioCtx = null;
let metronomeInterval = null;
let isMetronomePlaying = false;
let bpm = 120;
let currentBeat = 0;
let timeSignature = 4;
let activeTunerOscillator = null;
let activeRhythmInterval = null;
let isRhythmPlaying = false;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initTheme();
  initProgressions();
  initRhythms();
  initTuner();
  initMetronome();
  initPWA();
});

// --- AUDIO CONTEXT HELPER ---
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// --- TABS --- 
function initTabs() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');
      switchTab(targetTab);
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.getElementById(tabId).classList.add('active');
  currentTab = tabId;
  
  // Stop active audio when switching tabs
  stopAllAudio();
}

function stopAllAudio() {
  stopTunerSound();
  stopMetronome();
  stopRhythmPlayback();
}

// --- THEME --- 
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      themeToggle.textContent = '☀️';
    } else {
      document.body.classList.remove('dark-theme');
      themeToggle.textContent = '🌙';
    }
  });
}

// --- PROGRESSIONS & CHORDS ---
function initProgressions() {
  const listContainer = document.getElementById('progressionsList');
  const genreFilter = document.getElementById('genreFilter');
  
  function renderList(filter = 'all') {
    listContainer.innerHTML = '';
    const filtered = filter === 'all' ? PROGRESSIONS : PROGRESSIONS.filter(p => p.genre === filter);
    document.getElementById('progCount').textContent = `${filtered.length} suites`;

    filtered.forEach(prog => {
      const item = document.createElement('div');
      item.className = 'progression-item';
      item.innerHTML = `
        <div>
          <div class="prog-title">${prog.name}</div>
          <div class="prog-chords">${prog.chords.join(' - ')}</div>
        </div>
        <span class="prog-genre">${prog.genre}</span>
      `;
      item.addEventListener('click', () => {
        document.querySelectorAll('.progression-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        showProgressionDetails(prog);
      });
      listContainer.appendChild(item);
    });

    // Auto-select first
    if (filtered.length > 0) {
      listContainer.firstChild.click();
    }
  }

  genreFilter.addEventListener('change', (e) => {
    renderList(e.target.value);
  });

  renderList();
}

function showProgressionDetails(prog) {
  const infoContainer = document.getElementById('selectedProgressionInfo');
  const diagramsContainer = document.getElementById('chordDiagramsContainer');
  
  infoContainer.innerHTML = `
    <h4>${prog.name} (${prog.genre})</h4>
  `;
  
  diagramsContainer.innerHTML = '';
  prog.chords.forEach(chordName => {
    const chordCard = document.createElement('div');
    chordCard.className = 'chord-card';
    chordCard.innerHTML = `<span class="chord-name">${chordName}</span>`;
    
    const svg = createChordSVG(chordName);
    chordCard.appendChild(svg);
    diagramsContainer.appendChild(chordCard);
  });
}

// Generate Ukulele Chord SVG dynamically
function createChordSVG(chordName) {
  const frets = CHORDS[chordName] || [0, 0, 0, 0];
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "50");
  svg.setAttribute("height", "65");
  svg.setAttribute("viewBox", "0 0 50 65");

  // Draw Fretboard
  // 4 strings (vertical lines at x=10, 20, 30, 40)
  // 5 frets (horizontal lines at y=10, 22, 34, 46, 58)
  const nut = document.createElementNS(svgNS, "line");
  nut.setAttribute("x1", "10");
  nut.setAttribute("y1", "10");
  nut.setAttribute("x2", "40");
  nut.setAttribute("y2", "10");
  nut.setAttribute("stroke", "var(--text-color)");
  nut.setAttribute("stroke-width", "3");
  svg.appendChild(nut);

  for (let i = 0; i < 4; i++) {
    const string = document.createElementNS(svgNS, "line");
    const x = 10 + i * 10;
    string.setAttribute("x1", x);
    string.setAttribute("y1", "10");
    string.setAttribute("x2", x);
    string.setAttribute("y2", "58");
    string.setAttribute("stroke", "var(--text-secondary)");
    string.setAttribute("stroke-width", "1");
    svg.appendChild(string);
  }

  for (let i = 1; i <= 4; i++) {
    const fret = document.createElementNS(svgNS, "line");
    const y = 10 + i * 12;
    fret.setAttribute("x1", "10");
    fret.setAttribute("y1", y);
    fret.setAttribute("x2", "40");
    fret.setAttribute("y2", y);
    fret.setAttribute("stroke", "var(--border-color)");
    fret.setAttribute("stroke-width", "1");
    svg.appendChild(fret);
  }

  // Draw Dots
  frets.forEach((fretVal, stringIdx) => {
    const x = 10 + stringIdx * 10;
    if (fretVal > 0) {
      // Dot on fret
      const dotY = 10 + (fretVal - 0.5) * 12;
      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", dotY);
      circle.setAttribute("r", "4");
      circle.setAttribute("fill", "var(--primary-color)");
      svg.appendChild(circle);
    } else if (fretVal === 0) {
      // Open string indicator (small circle above nut)
      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", "5");
      circle.setAttribute("r", "2");
      circle.setAttribute("fill", "none");
      circle.setAttribute("stroke", "var(--text-secondary)");
      circle.setAttribute("stroke-width", "1");
      svg.appendChild(circle);
    }
  });

  return svg;
}

// --- RYTHMES ---
function initRhythms() {
  const listContainer = document.getElementById('rhythmsList');
  const visualContainer = document.getElementById('strummingVisual');
  const title = document.getElementById('rhythmTitle');
  const desc = document.getElementById('rhythmDescription');
  const playBtn = document.getElementById('playRhythmBtn');

  RHYTHMS.forEach((rhythm, index) => {
    const item = document.createElement('div');
    item.className = 'rhythm-item';
    if (index === 0) item.classList.add('active');
    item.innerHTML = `
      <div class="rhythm-name">${rhythm.name}</div>
      <div class="rhythm-pattern">${rhythm.pattern}</div>
    `;
    item.addEventListener('click', () => {
      document.querySelectorAll('.rhythm-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      selectRhythm(rhythm);
    });
    listContainer.appendChild(item);
  });

  // Select first by default
  selectRhythm(RHYTHMS[0]);

  function selectRhythm(rhythm) {
    stopRhythmPlayback();
    title.textContent = rhythm.name;
    desc.textContent = rhythm.desc;
    
    // Render visual strums
    visualContainer.innerHTML = '';
    rhythm.strums.forEach((strum, idx) => {
      const arrow = document.createElement('div');
      arrow.className = 'strum-arrow';
      if (strum === 'D') {
        arrow.innerHTML = '⬇️<span class="strum-sub">Bas</span>';
      } else if (strum === 'U') {
        arrow.innerHTML = '⬆️<span class="strum-sub">Haut</span>';
      } else {
        arrow.innerHTML = '⚪<span class="strum-sub">-</span>';
      }
      visualContainer.appendChild(arrow);
    });

    playBtn.onclick = () => {
      if (isRhythmPlaying) {
        stopRhythmPlayback();
      } else {
        startRhythmPlayback(rhythm);
      }
    };
  }

  function startRhythmPlayback(rhythm) {
    const ctx = getAudioContext();
    isRhythmPlaying = true;
    playBtn.textContent = "Arrêter";
    playBtn.classList.add('btn-secondary');
    
    let step = 0;
    const intervalMs = (60 / 120) * 1000 / 2; // 120 BPM eighth notes
    
    activeRhythmInterval = setInterval(() => {
      const strumsElements = visualContainer.querySelectorAll('.strum-arrow');
      strumsElements.forEach(el => el.classList.remove('active'));
      
      const currentStrumIdx = step % rhythm.strums.length;
      const currentStrum = rhythm.strums[currentStrumIdx];
      
      if (strumsElements[currentStrumIdx]) {
        strumsElements[currentStrumIdx].classList.add('active');
      }

      if (currentStrum !== 'X') {
        playClickSound(currentStrum === 'D' ? 800 : 1200, 0.05);
      }

      step++;
    }, intervalMs);
  }
}

function stopRhythmPlayback() {
  const playBtn = document.getElementById('playRhythmBtn');
  if (activeRhythmInterval) {
    clearInterval(activeRhythmInterval);
    activeRhythmInterval = null;
  }
  isRhythmPlaying = false;
  if (playBtn) {
    playBtn.textContent = "Écouter le tempo";
    playBtn.classList.remove('btn-secondary');
  }
  document.querySelectorAll('.strum-arrow').forEach(el => el.classList.remove('active'));
}

// --- ACCORDEUR (Tuner) ---
const NOTE_FREQS = {
  'G': 392.00, // G4
  'C': 261.63, // C4
  'E': 329.63, // E4
  'A': 440.00  // A4
};

function initTuner() {
  const pegs = document.querySelectorAll('.peg-btn');
  const stopBtn = document.getElementById('stopTunerBtn');

  pegs.forEach(peg => {
    peg.addEventListener('click', () => {
      pegs.forEach(p => p.classList.remove('playing'));
      peg.classList.add('playing');
      const note = peg.getAttribute('data-note');
      playTunerPitch(NOTE_FREQS[note]);
    });
  });

  stopBtn.addEventListener('click', () => {
    stopTunerSound();
    pegs.forEach(p => p.classList.remove('playing'));
  });
}

function playTunerPitch(frequency) {
  stopTunerSound();
  const ctx = getAudioContext();
  
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.value = frequency;
  
  gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
  // Smooth fade out after 3 seconds
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3);
  
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  osc.start();
  osc.stop(ctx.currentTime + 3);
  
  activeTunerOscillator = osc;
}

function stopTunerSound() {
  if (activeTunerOscillator) {
    try {
      activeTunerOscillator.stop();
    } catch(e) {}
    activeTunerOscillator = null;
  }
}

// --- METRONOME ---
function initMetronome() {
  const bpmSlider = document.getElementById('bpmSlider');
  const bpmValue = document.getElementById('bpmValue');
  const bpmMinus = document.getElementById('bpmMinus');
  const bpmPlus = document.getElementById('bpmPlus');
  const playBtn = document.getElementById('metroPlayBtn');
  const sigButtons = document.querySelectorAll('.sig-btn');

  function updateBPM(newBpm) {
    bpm = Math.max(40, Math.min(240, newBpm));
    bpmSlider.value = bpm;
    bpmValue.textContent = bpm;
    if (isMetronomePlaying) {
      stopMetronome();
      startMetronome();
    }
  }

  bpmSlider.addEventListener('input', (e) => updateBPM(e.target.value));
  bpmMinus.addEventListener('click', () => updateBPM(bpm - 1));
  bpmPlus.addEventListener('click', () => updateBPM(bpm + 1));

  sigButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sigButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      timeSignature = parseInt(btn.getAttribute('data-sig'));
      currentBeat = 0;
    });
  });

  playBtn.addEventListener('click', () => {
    if (isMetronomePlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
  });
}

function startMetronome() {
  const playBtn = document.getElementById('metroPlayBtn');
  isMetronomePlaying = true;
  playBtn.textContent = "ARRÊTER";
  playBtn.style.backgroundColor = "var(--text-secondary)";
  
  currentBeat = 0;
  const intervalMs = (60 / bpm) * 1000;
  
  metronomeInterval = setInterval(() => {
    triggerMetronomeBeat();
  }, intervalMs);
  
  // Trigger first beat immediately
  triggerMetronomeBeat();
}

function triggerMetronomeBeat() {
  const visual = document.getElementById('metroVisual');
  const isAccent = currentBeat === 0;
  
  // Visual flash
  visual.className = 'visual-indicator';
  void visual.offsetWidth; // Trigger reflow
  visual.classList.add(isAccent ? 'flash-accent' : 'flash');
  
  // Audio click
  playClickSound(isAccent ? 1000 : 600, 0.05);
  
  currentBeat = (currentBeat + 1) % timeSignature;
}

function stopMetronome() {
  const playBtn = document.getElementById('metroPlayBtn');
  isMetronomePlaying = false;
  if (playBtn) {
    playBtn.textContent = "DÉMARRER";
    playBtn.style.backgroundColor = "var(--primary-color)";
  }
  if (metronomeInterval) {
    clearInterval(metronomeInterval);
    metronomeInterval = null;
  }
}

function playClickSound(freq, duration) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.value = freq;
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn("Audio context not allowed yet.");
  }
}

// --- PWA INSTALLATION ---
function initPWA() {
  let deferredPrompt;
  const installBtn = document.getElementById('installBtn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'flex';
  });

  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        installBtn.style.display = 'none';
      }
      deferredPrompt = null;
    }
  });

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('Service Worker Registered'))
      .catch(err => console.error('Service Worker Failed', err));
  }
}