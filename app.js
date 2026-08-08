// Audio Engine using Web Audio API
const AudioEngine = {
  ctx: null,
  // Standard Ukulele Tuning: G4 (392Hz), C4 (261.63Hz), E4 (329.63Hz), A4 (440Hz)
  stringFrequencies: [392.00, 261.63, 329.63, 440.00],

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  playPluck(freq, delay = 0, duration = 1.2) {
    this.init();
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    // Ukulele pluck timbre simulation (combination of triangle and sine)
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
    
    // Fast attack, exponential decay
    gainNode.gain.setValueAtTime(0, this.ctx.currentTime + delay);
    gainNode.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + delay + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);
    
    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    osc.start(this.ctx.currentTime + delay);
    osc.stop(this.ctx.currentTime + delay + duration);
  },

  playChord(frets, speed = 0.06) {
    this.init();
    frets.forEach((fret, stringIndex) => {
      if (fret === -1) return; // Muted string
      // Calculate frequency based on fret: freq = base * 2^(fret/12)
      const baseFreq = this.stringFrequencies[stringIndex];
      const freq = baseFreq * Math.pow(2, fret / 12);
      this.playPluck(freq, stringIndex * speed);
    });
  }
};

// Chords Database
const CHORDS = {
  'C': { name: 'C (Do)', frets: [0, 0, 0, 3], fingers: [0, 0, 0, 3] },
  'G': { name: 'G (Sol)', frets: [0, 2, 3, 2], fingers: [0, 1, 3, 2] },
  'Am': { name: 'Am (La min)', frets: [2, 0, 0, 0], fingers: [2, 0, 0, 0] },
  'F': { name: 'F (Fa)', frets: [2, 0, 1, 0], fingers: [2, 0, 1, 0] },
  'Dm': { name: 'Dm (Ré min)', frets: [2, 2, 1, 0], fingers: [2, 3, 1, 0] },
  'Em': { name: 'Em (Mi min)', frets: [0, 4, 3, 2], fingers: [0, 3, 2, 1] },
  'A': { name: 'A (La)', frets: [2, 1, 0, 0], fingers: [2, 1, 0, 0] },
  'D': { name: 'D (Ré)', frets: [2, 2, 2, 0], fingers: [1, 2, 3, 0] },
  'G7': { name: 'G7', frets: [0, 2, 1, 2], fingers: [0, 2, 1, 3] },
  'C7': { name: 'C7', frets: [0, 0, 0, 1], fingers: [0, 0, 0, 1] }
};

// Progressions Database
const PROGRESSIONS = [
  {
    title: "Balade Pop",
    genre: "Classique Pop",
    chords: ["C", "G", "Am", "F"]
  },
  {
    title: "Brise des Îles",
    genre: "Reggae / Folk",
    chords: ["C", "Am", "F", "G"]
  },
  {
    title: "Coucher de Soleil",
    genre: "Doux & Mélancolique",
    chords: ["Dm", "G7", "C", "C7"]
  },
  {
    title: "Jazz Léger",
    genre: "Jazz Débutant",
    chords: ["Am", "Dm", "G7", "C"]
  },
  {
    title: "Énergie Rock",
    genre: "Rock / Folk",
    chords: ["G", "D", "Em", "C"]
  }
];

// State Management
let currentChordKey = 'C';
let activeProgressionInterval = null;
let deferredPrompt = null;

// DOM Elements
const chordButtonsGrid = document.getElementById('chord-buttons-grid');
const currentChordName = document.getElementById('current-chord-name');
const fretboardSvg = document.getElementById('fretboard-svg');
const playChordBtn = document.getElementById('play-chord-btn');
const progressionsContainer = document.getElementById('progressions-container');
const playProgressionBtn = document.getElementById('play-progression-btn');
const stopProgressionBtn = document.getElementById('stop-progression-btn');
const themeToggle = document.getElementById('theme-toggle');
const installBtn = document.getElementById('install-btn');
const navItems = document.querySelectorAll('.nav-item');
const tabPanels = document.querySelectorAll('.tab-panel');

// Initialize App
function init() {
  renderChordButtons();
  selectChord('C');
  renderProgressions();
  setupEventListeners();
  setupTheme();
}

// Render Chord Buttons
function renderChordButtons() {
  chordButtonsGrid.innerHTML = '';
  Object.keys(CHORDS).forEach(key => {
    const btn = document.createElement('button');
    btn.className = `chord-btn ${key === currentChordKey ? 'active' : ''}`;
    btn.textContent = key;
    btn.addEventListener('click', () => selectChord(key));
    chordButtonsGrid.appendChild(btn);
  });
}

// Select and Render Chord
function selectChord(key) {
  currentChordKey = key;
  document.querySelectorAll('.chord-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === key);
  });
  
  const chord = CHORDS[key];
  currentChordName.textContent = chord.name;
  drawFretboard(chord.frets, chord.fingers);
}

// Draw SVG Fretboard
function drawFretboard(frets, fingers) {
  const width = 120;
  const height = 160;
  const numStrings = 4;
  const numFrets = 4; // We show 4 frets
  
  const xMargin = 20;
  const yMargin = 20;
  const stringSpacing = (width - xMargin * 2) / (numStrings - 1);
  const fretSpacing = (height - yMargin * 2) / numFrets;

  let svgContent = `
    <!-- Nut (Saddle) -->
    <line x1="${xMargin}" y1="${yMargin}" x2="${width - xMargin}" y2="${yMargin}" stroke="var(--fret-color)" stroke-width="4" />
  `;

  // Draw Frets
  for (let i = 1; i <= numFrets; i++) {
    const y = yMargin + i * fretSpacing;
    svgContent += `<line x1="${xMargin}" y1="${y}" x2="${width - xMargin}" y2="${y}" stroke="var(--fret-color)" stroke-width="2" />`;
  }

  // Draw Strings
  for (let i = 0; i < numStrings; i++) {
    const x = xMargin + i * stringSpacing;
    svgContent += `<line x1="${x}" y1="${yMargin}" x2="${x}" y2="${height - yMargin}" stroke="var(--string-color)" stroke-width="2" />`;
  }

  // Draw Dots (Fingering)
  frets.forEach((fret, stringIndex) => {
    const x = xMargin + stringIndex * stringSpacing;
    if (fret === 0) {
      // Open string indicator
      svgContent += `<circle cx="${x}" cy="${yMargin - 8}" r="4" fill="none" stroke="var(--primary)" stroke-width="2" />`;
    } else if (fret > 0) {
      // Pressed fret dot
      const y = yMargin + (fret - 0.5) * fretSpacing;
      svgContent += `
        <circle cx="${x}" cy="${y}" r="8" fill="var(--primary)" />
        <text x="${x}" y="${y + 3}" font-size="9" font-weight="bold" fill="white" text-anchor="middle">${fingers[stringIndex] || ''}</text>
      `;
    }
  });

  fretboardSvg.innerHTML = svgContent;
}

// Render Progressions
function renderProgressions() {
  progressionsContainer.innerHTML = '';
  PROGRESSIONS.forEach((prog, index) => {
    const card = document.createElement('div');
    card.className = `progression-card ${index === 0 ? 'active' : ''}`;
    card.dataset.index = index;
    
    let chordsHtml = '';
    prog.chords.forEach(c => {
      chordsHtml += `<span class="progression-chord-badge" data-chord="${c}">${c}</span>`;
    });

    card.innerHTML = `
      <div class="progression-info">
        <span class="progression-title">${prog.title}</span>
        <span class="progression-genre">${prog.genre}</span>
      </div>
      <div class="progression-chords">
        ${chordsHtml}
      </div>
    `;

    card.addEventListener('click', () => {
      document.querySelectorAll('.progression-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      stopProgression();
    });

    progressionsContainer.appendChild(card);
  });
}

// Play Progression Loop
function playProgression() {
  const activeCard = document.querySelector('.progression-card.active');
  if (!activeCard) return;
  
  const index = activeCard.dataset.index;
  const progression = PROGRESSIONS[index];
  const badges = activeCard.querySelectorAll('.progression-chord-badge');
  
  let currentStep = 0;
  stopProgression();

  playProgressionBtn.classList.add('hidden');
  stopProgressionBtn.classList.remove('hidden');

  const playStep = () => {
    badges.forEach(b => b.classList.remove('playing'));
    const activeBadge = badges[currentStep];
    activeBadge.classList.add('playing');
    
    const chordKey = progression.chords[currentStep];
    const chord = CHORDS[chordKey];
    if (chord) {
      AudioEngine.playChord(chord.frets);
    }
    
    currentStep = (currentStep + 1) % progression.chords.length;
  };

  playStep();
  activeProgressionInterval = setInterval(playStep, 1800); // 1.8s per chord
}

function stopProgression() {
  if (activeProgressionInterval) {
    clearInterval(activeProgressionInterval);
    activeProgressionInterval = null;
  }
  document.querySelectorAll('.progression-chord-badge').forEach(b => b.classList.remove('playing'));
  playProgressionBtn.classList.remove('hidden');
  stopProgressionBtn.classList.add('hidden');
}

// Setup Event Listeners
function setupEventListeners() {
  // Play current chord
  playChordBtn.addEventListener('click', () => {
    const chord = CHORDS[currentChordKey];
    if (chord) AudioEngine.playChord(chord.frets);
  });

  // Progression controls
  playProgressionBtn.addEventListener('click', playProgression);
  stopProgressionBtn.addEventListener('click', stopProgression);

  // Tuner pegs
  document.querySelectorAll('.peg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const note = btn.dataset.note;
      let freq = 440;
      if (note === 'G') freq = 392.00;
      if (note === 'C') freq = 261.63;
      if (note === 'E') freq = 329.63;
      if (note === 'A') freq = 440.00;
      
      btn.classList.add('playing');
      AudioEngine.playPluck(freq, 0, 1.5);
      setTimeout(() => btn.classList.remove('playing'), 1500);
    });
  });

  // Navigation Tabs
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(nav => nav.classList.remove('active'));
      tabPanels.forEach(panel => panel.classList.remove('active'));
      
      item.classList.add('active');
      const targetTab = item.dataset.tab;
      document.getElementById(targetTab).classList.add('active');
      
      // Stop progression if leaving the tab
      if (targetTab !== 'tab-progressions') {
        stopProgression();
      }
    });
  });

  // Theme Toggle
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
  });
}

// Theme Setup
function setupTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
  } else {
    document.body.classList.remove('dark');
    themeToggle.textContent = '🌙';
  }
}

// PWA Installation Prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.classList.remove('hidden');
});

installBtn.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      installBtn.classList.add('hidden');
    }
    deferredPrompt = null;
  }
});

window.addEventListener('appinstalled', () => {
  installBtn.classList.add('hidden');
  deferredPrompt = null;
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker enregistré !', reg.scope))
      .catch(err => console.log('Erreur d\'enregistrement du Service Worker :', err));
  });
}

// Run App
init();