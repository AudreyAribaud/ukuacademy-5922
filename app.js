// --- DATABASE & CONFIGURATION ---
const CHORDS = {
  'C':  { frets: [0, 0, 0, 3], fingers: [0, 0, 0, 3] },
  'G':  { frets: [0, 2, 3, 2], fingers: [0, 1, 3, 2] },
  'Am': { frets: [2, 0, 0, 0], fingers: [2, 0, 0, 0] },
  'F':  { frets: [2, 0, 1, 0], fingers: [2, 0, 1, 0] },
  'D':  { frets: [2, 2, 2, 0], fingers: [1, 2, 3, 0] },
  'Dm': { frets: [2, 2, 1, 0], fingers: [2, 3, 1, 0] },
  'Em': { frets: [0, 4, 3, 2], fingers: [0, 3, 2, 1] },
  'A':  { frets: [2, 1, 0, 0], fingers: [2, 1, 0, 0] },
  'Bb': { frets: [3, 2, 1, 1], fingers: [3, 2, 1, 1] },
  'E7': { frets: [1, 2, 0, 2], fingers: [1, 2, 0, 3] }
};

const PROGRESSIONS = [
  {
    id: 'pop-classic',
    name: 'Pop Classique (I-V-vi-IV)',
    chords: ['C', 'G', 'Am', 'F'],
    difficulty: 'Débutant'
  },
  {
    id: 'stand-by-me',
    name: 'Stand By Me (I-vi-IV-V)',
    chords: ['C', 'Am', 'F', 'G'],
    difficulty: 'Débutant'
  },
  {
    id: 'folk-ballad',
    name: 'Folk Mélancolique',
    chords: ['Am', 'F', 'C', 'G'],
    difficulty: 'Intermédiaire'
  },
  {
    id: 'jazz-turnaround',
    name: 'Jazz Turnaround (ii-V-I)',
    chords: ['Dm', 'G', 'C', 'A'],
    difficulty: 'Avancé'
  },
  {
    id: 'island-breeze',
    name: 'Brise des Îles',
    chords: ['C', 'F', 'G', 'F'],
    difficulty: 'Débutant'
  },
  {
    id: 'andalusian-cadence',
    name: 'Cadence Andalouse',
    chords: ['Am', 'G', 'F', 'E7'],
    difficulty: 'Intermédiaire'
  }
];

const STRUMS = [
  {
    id: 'island-strum',
    name: 'Island Strum (Le Classique)',
    pattern: ['B', '_', 'B', 'H', '_', 'H', 'B', 'H'], // Down, -, Down, Up, -, Up, Down, Up
    description: 'Le rythme le plus célèbre et polyvalent pour le ukulélé.'
  },
  {
    id: 'simple-down',
    name: 'Feu de Camp (4 Bas)',
    pattern: ['B', '_', 'B', '_', 'B', '_', 'B', '_'],
    description: 'Idéal pour débuter et se concentrer sur les changements d\'accords.'
  },
  {
    id: 'pop-rock',
    name: 'Pop Rock Dynamique',
    pattern: ['B', '_', 'B', 'H', 'B', 'H', 'B', 'H'],
    description: 'Un rythme rapide et entraînant pour les morceaux modernes.'
  },
  {
    id: 'reggae-offbeat',
    name: 'Reggae (Contretemps)',
    pattern: ['_', 'B', '_', 'B', '_', 'B', '_', 'B'],
    description: 'Accentuez le contretemps pour donner un style ensoleillé.'
  },
  {
    id: 'waltz-34',
    name: 'Valse (3/4)',
    pattern: ['B', '_', 'B', 'H', 'B', 'H'],
    description: 'Rythmique ternaire classique à 3 temps.'
  }
];

// --- AUDIO SYNTHESIS (Web Audio API) ---
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

// Ukulele standard tuning frequencies (G4, C4, E4, A4)
const STRING_FREQS = [392.00, 261.63, 329.63, 440.00];

function playChord(chordName, duration = 0.8, strumSpeed = 0.03) {
  initAudio();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const chord = CHORDS[chordName];
  if (!chord) return;

  const now = audioCtx.currentTime;

  // Play each of the 4 strings with a slight delay to simulate strumming
  chord.frets.forEach((fret, stringIdx) => {
    const baseFreq = STRING_FREQS[stringIdx];
    // Calculate frequency based on fret
    const freq = baseFreq * Math.pow(2, fret / 12);

    // Create oscillator and gain node
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'triangle'; // Warm, wood-like tone
    osc.frequency.value = freq;

    // Envelope
    const strumDelay = stringIdx * strumSpeed;
    const startTime = now + strumDelay;
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  });
}

// --- SVG DIAGRAM GENERATOR ---
function createChordSVG(chordName, size = 100) {
  const chord = CHORDS[chordName];
  if (!chord) return '';

  const width = 80;
  const height = 100;
  const numStrings = 4;
  const numFrets = 4;

  // Grid coordinates
  const xStep = width / (numStrings - 1);
  const yStep = height / numFrets;
  const paddingX = 10;
  const paddingY = 15;

  let svg = `<svg width="${size}" height="${size * 1.25}" viewBox="0 0 100 125" xmlns="http://www.w3.org/2000/svg">`;
  
  // Draw Nut (top thick line)
  svg += `<line x1="${paddingX}" y1="${paddingY}" x2="${paddingX + width}" y2="${paddingY}" stroke="#2c3e50" stroke-width="4" />`;

  // Draw Frets
  for (let i = 1; i <= numFrets; i++) {
    const y = paddingY + i * yStep;
    svg += `<line x1="${paddingX}" y1="${y}" x2="${paddingX + width}" y2="${y}" stroke="#bdc3c7" stroke-width="2" />`;
  }

  // Draw Strings
  for (let i = 0; i < numStrings; i++) {
    const x = paddingX + i * xStep;
    svg += `<line x1="${x}" y1="${paddingY}" x2="${x}" y2="${paddingY + height}" stroke="#7f8c8d" stroke-width="2" />`;
  }

  // Draw Fingers / Dots
  chord.frets.forEach((fret, stringIdx) => {
    if (fret > 0) {
      const cx = paddingX + stringIdx * xStep;
      const cy = paddingY + (fret - 0.5) * yStep;
      const finger = chord.fingers[stringIdx];

      // Dot
      svg += `<circle cx="${cx}" cy="${cy}" r="7" fill="#e67e22" />`;
      // Finger number
      if (finger > 0) {
        svg += `<text x="${cx}" y="${cy + 4}" font-family="sans-serif" font-size="10" font-weight="bold" fill="white" text-anchor="middle">${finger}</text>`;
      }
    } else if (fret === 0) {
      // Open string indicator
      const cx = paddingX + stringIdx * xStep;
      svg += `<circle cx="${cx}" cy="${paddingY - 6}" r="3" fill="none" stroke="#2ecc71" stroke-width="2" />`;
    }
  });

  svg += '</svg>';
  return svg;
}

// --- UI RENDERING ---
function renderChords() {
  const grid = document.getElementById('chordGrid');
  grid.innerHTML = '';
  Object.keys(CHORDS).forEach(chordName => {
    const card = document.createElement('div');
    card.className = 'chord-card';
    card.innerHTML = `
      <h3>${chordName}</h3>
      <div class="chord-diagram">${createChordSVG(chordName, 80)}</div>
    `;
    card.addEventListener('click', () => playChord(chordName));
    grid.appendChild(card);
  });
}

function renderProgressions() {
  const list = document.getElementById('progressionList');
  list.innerHTML = '';
  PROGRESSIONS.forEach(prog => {
    const card = document.createElement('div');
    card.className = 'prog-card';
    
    let chordsHtml = '';
    prog.chords.forEach((chord, idx) => {
      chordsHtml += `<div class="prog-chord-bubble" onclick="playChord('${chord}')">${chord}</div>`;
      if (idx < prog.chords.length - 1) {
        chordsHtml += `<span class="prog-arrow">➔</span>`;
      }
    });

    card.innerHTML = `
      <div class="card-header">
        <span class="card-title">${prog.name}</span>
        <span class="card-badge">${prog.difficulty}</span>
      </div>
      <div class="prog-chords-container">
        ${chordsHtml}
      </div>
    `;
    list.appendChild(card);
  });
}

function renderStrums() {
  const list = document.getElementById('strumList');
  list.innerHTML = '';
  STRUMS.forEach(strum => {
    const card = document.createElement('div');
    card.className = 'strum-card';

    let patternHtml = '';
    strum.pattern.forEach((step, idx) => {
      const isDown = step === 'B';
      const isUp = step === 'H';
      const isMute = step === '_';
      
      patternHtml += `
        <div class="strum-arrow ${isDown ? 'down' : isUp ? 'up' : 'mute'}">
          <span>${isMute ? '•' : step}</span>
          <span class="strum-arrow-sub">${idx + 1}</span>
        </div>
      `;
    });

    card.innerHTML = `
      <div class="card-header">
        <span class="card-title">${strum.name}</span>
      </div>
      <p style="color: var(--text-light); font-size: 0.9rem;">${strum.description}</p>
      <div class="strum-pattern-display">
        ${patternHtml}
      </div>
    `;
    list.appendChild(card);
  });
}

// --- PRACTICE ENGINE (METRONOME & PLAY-ALONG) ---
let practiceInterval = null;
let isPlaying = false;
let currentStep = 0;
let currentChordIdx = 0;

function populatePracticeSelectors() {
  const progSelect = document.getElementById('practiceProgression');
  PROGRESSIONS.forEach(prog => {
    const opt = document.createElement('option');
    opt.value = prog.id;
    opt.textContent = prog.name;
    progSelect.appendChild(opt);
  });

  const strumSelect = document.getElementById('practiceStrum');
  STRUMS.forEach(strum => {
    const opt = document.createElement('option');
    opt.value = strum.id;
    opt.textContent = strum.name;
    strumSelect.appendChild(opt);
  });
}

function updatePracticeDisplay() {
  const progId = document.getElementById('practiceProgression').value;
  const strumId = document.getElementById('practiceStrum').value;
  
  const prog = PROGRESSIONS.find(p => p.id === progId);
  const strum = STRUMS.find(s => s.id === strumId);

  if (!prog || !strum) return;

  // Update Chords
  const currentChord = prog.chords[currentChordIdx];
  const nextChord = prog.chords[(currentChordIdx + 1) % prog.chords.length];

  document.getElementById('currentChordName').textContent = currentChord;
  document.getElementById('currentChordDiagram').innerHTML = createChordSVG(currentChord, 60);

  document.getElementById('nextChordName').textContent = nextChord;
  document.getElementById('nextChordDiagram').innerHTML = createChordSVG(nextChord, 60);

  // Update Strum Visualizer
  const visualizer = document.getElementById('strumVisualizer');
  visualizer.innerHTML = '';
  strum.pattern.forEach((step, idx) => {
    const isDown = step === 'B';
    const isUp = step === 'H';
    const isMute = step === '_';
    
    const arrow = document.createElement('div');
    arrow.className = `strum-arrow ${isDown ? 'down' : isUp ? 'up' : 'mute'} ${idx === currentStep ? 'active' : ''}`;
    arrow.innerHTML = `
      <span>${isMute ? '•' : step}</span>
      <span class="strum-arrow-sub">${idx + 1}</span>
    `;
    visualizer.appendChild(arrow);
  });
}

function startPractice() {
  initAudio();
  if (isPlaying) return;

  isPlaying = true;
  document.getElementById('playBtn').disabled = true;
  document.getElementById('stopBtn').disabled = false;

  const bpm = parseInt(document.getElementById('practiceBpm').value);
  // Calculate interval based on 8th notes (since patterns have 8 steps per bar)
  // 4 beats per bar -> 8 steps per bar. Interval = (60 / BPM) / 2 seconds
  const intervalMs = ((60 / bpm) / 2) * 1000;

  currentStep = 0;
  currentChordIdx = 0;

  updatePracticeDisplay();
  tick();

  practiceInterval = setInterval(tick, intervalMs);
}

function tick() {
  const progId = document.getElementById('practiceProgression').value;
  const strumId = document.getElementById('practiceStrum').value;
  
  const prog = PROGRESSIONS.find(p => p.id === progId);
  const strum = STRUMS.find(s => s.id === strumId);

  if (!prog || !strum) return;

  const currentChord = prog.chords[currentChordIdx];
  const action = strum.pattern[currentStep];

  // Play sound on active strums
  if (action === 'B' || action === 'H') {
    playChord(currentChord, 0.4, action === 'H' ? 0.015 : 0.03);
  }

  // Update Metronome Dots (4 beats)
  const dots = document.querySelectorAll('.beat-dot');
  dots.forEach(dot => dot.classList.remove('active'));
  const beatIdx = Math.floor(currentStep / 2) % 4;
  if (dots[beatIdx]) {
    dots[beatIdx].classList.add('active');
  }

  // Highlight current strum step
  updatePracticeDisplay();

  // Advance step
  currentStep = (currentStep + 1) % strum.pattern.length;
  
  // If pattern loops, change chord
  if (currentStep === 0) {
    currentChordIdx = (currentChordIdx + 1) % prog.chords.length;
  }
}

function stopPractice() {
  isPlaying = false;
  clearInterval(practiceInterval);
  document.getElementById('playBtn').disabled = false;
  document.getElementById('stopBtn').disabled = true;
  
  // Reset dots
  document.querySelectorAll('.beat-dot').forEach(dot => dot.classList.remove('active'));
  currentStep = 0;
  currentChordIdx = 0;
  updatePracticeDisplay();
}

// --- EVENT LISTENERS & TABS ---
function setupTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const target = tab.getAttribute('data-tab');
      document.getElementById(target).classList.add('active');
      
      // Stop practice if leaving the practice tab
      if (target !== 'practice' && isPlaying) {
        stopPractice();
      }
    });
  });
}

function setupEventListeners() {
  document.getElementById('practiceBpm').addEventListener('input', (e) => {
    document.getElementById('bpmVal').textContent = e.target.value;
    if (isPlaying) {
      // Restart with new tempo
      stopPractice();
      startPractice();
    }
  });

  document.getElementById('practiceProgression').addEventListener('change', () => {
    currentChordIdx = 0;
    currentStep = 0;
    updatePracticeDisplay();
  });
  
  document.getElementById('practiceStrum').addEventListener('change', () => {
    currentStep = 0;
    updatePracticeDisplay();
  });

  document.getElementById('playBtn').addEventListener('click', startPractice);
  document.getElementById('stopBtn').addEventListener('click', stopPractice);
}

// --- INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
  renderChords();
  renderProgressions();
  renderStrums();
  populatePracticeSelectors();
  setupTabs();
  setupEventListeners();
  updatePracticeDisplay();

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log('SW registration failed', err));
  }
});