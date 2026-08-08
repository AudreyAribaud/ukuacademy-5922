// Ukulele Chord Library Fingerings (G-C-E-A strings)
const CHORD_LIBRARY = {
  'C': [0, 0, 0, 3],
  'G': [0, 2, 3, 2],
  'Am': [2, 0, 0, 0],
  'F': [2, 0, 1, 0],
  'D': [2, 2, 2, 0],
  'Em': [0, 4, 3, 2],
  'Dm7': [2, 2, 1, 3],
  'G7': [0, 2, 1, 2],
  'Cmaj7': [0, 0, 0, 2],
  'A': [2, 1, 0, 0],
  'D7': [2, 0, 2, 0],
  'E7': [1, 2, 0, 2]
};

// Chord Progressions
const PROGRESSIONS = {
  'pop-c': {
    chords: ['C', 'G', 'Am', 'F'],
    tip: "L'enchaînement le plus célèbre de la musique pop ! Transition clé : gardez l'index pivot pour passer de Am à F."
  },
  'folk-g': {
    chords: ['G', 'D', 'Em', 'C'],
    tip: "Idéal pour les ballades folk. Pour le G (Sol), formez un triangle bien stable avec vos doigts."
  },
  'sad-am': {
    chords: ['Am', 'F', 'C', 'G'],
    tip: "Une ambiance mélancolique et puissante. Parfait pour s'entraîner à enchaîner rapidement."
  },
  'jazz-c': {
    chords: ['Cmaj7', 'Dm7', 'G7', 'C'],
    tip: "Un son jazzy et chaleureux. Le Dm7 demande de barrer légèrement ou d'utiliser trois doigts serrés."
  },
  'blues-a': {
    chords: ['A', 'D7', 'E7', 'A'],
    tip: "Un blues classique en La. Accentuez bien le deuxième et le quatrième temps pour donner du swing !"
  }
};

// Strumming Patterns
const STRUM_PATTERNS = {
  'island': [
    { action: '↓', label: 'Bas', duration: 1 },
    { action: '-', label: 'pause', duration: 0.5 },
    { action: '↓', label: 'Bas', duration: 0.5 },
    { action: '↑', label: 'Haut', duration: 0.5 },
    { action: '-', label: 'pause', duration: 0.5 },
    { action: '↑', label: 'Haut', duration: 1 },
    { action: '↓', label: 'Bas', duration: 0.5 },
    { action: '↑', label: 'Haut', duration: 0.5 }
  ],
  'simple-4': [
    { action: '↓', label: 'Bas', duration: 1 },
    { action: '↓', label: 'Bas', duration: 1 },
    { action: '↓', label: 'Bas', duration: 1 },
    { action: '↓', label: 'Bas', duration: 1 }
  ],
  'folk': [
    { action: '↓', label: 'Bas', duration: 1 },
    { action: '↓', label: 'Bas', duration: 0.5 },
    { action: '↑', label: 'Haut', duration: 0.5 },
    { action: '↓', label: 'Bas', duration: 1 },
    { action: '↓', label: 'Bas', duration: 0.5 },
    { action: '↑', label: 'Haut', duration: 0.5 }
  ],
  'reggae': [
    { action: '-', label: 'Chut', duration: 1 },
    { action: '↑', label: 'Haut', duration: 1 },
    { action: '-', label: 'Chut', duration: 1 },
    { action: '↑', label: 'Haut', duration: 1 }
  ],
  'waltz': [
    { action: '↓', label: 'Bas', duration: 1 },
    { action: '↑', label: 'Haut', duration: 1 },
    { action: '↑', label: 'Haut', duration: 1 }
  ]
};

// State Variables
let audioCtx = null;
let isPlaying = false;
let bpm = 100;
let currentBeat = 0;
let nextNoteTime = 0.0;
let timerID = null;
const lookahead = 25.0; // ms
const scheduleAheadTime = 0.1; // sec

// DOM Elements
const progressionSelect = document.getElementById('progression-select');
const chordsContainer = document.getElementById('chords-container');
const strumSelect = document.getElementById('strum-select');
const strumPatternDisplay = document.getElementById('strum-pattern-display');
const tipText = document.getElementById('tip-text');
const metroToggle = document.getElementById('metro-toggle');
const bpmSlider = document.getElementById('bpm-slider');
const bpmDisplay = document.getElementById('bpm-display');
const beatIndicators = [
  document.getElementById('beat-1'),
  document.getElementById('beat-2'),
  document.getElementById('beat-3'),
  document.getElementById('beat-4')
];

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  loadProgression(progressionSelect.value);
  loadStrumPattern(strumSelect.value);
});

function setupEventListeners() {
  progressionSelect.addEventListener('change', (e) => {
    loadProgression(e.target.value);
  });

  strumSelect.addEventListener('change', (e) => {
    loadStrumPattern(e.target.value);
  });

  bpmSlider.addEventListener('input', (e) => {
    bpm = parseInt(e.target.value);
    bpmDisplay.textContent = `${bpm} BPM`;
  });

  metroToggle.addEventListener('click', toggleMetronome);
}

// Load & Render Chords
function loadProgression(key) {
  const data = PROGRESSIONS[key];
  if (!data) return;

  chordsContainer.innerHTML = '';
  data.chords.forEach(chordName => {
    const frets = CHORD_LIBRARY[chordName] || [0, 0, 0, 0];
    const card = createChordCard(chordName, frets);
    chordsContainer.appendChild(card);
  });

  tipText.textContent = data.tip;
}

function createChordCard(name, frets) {
  const card = document.createElement('div');
  card.className = 'chord-card';

  const title = document.createElement('div');
  title.className = 'chord-name';
  title.textContent = name;
  card.appendChild(title);

  // Generate SVG for Ukulele Chord
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 120');
  svg.setAttribute('class', 'chord-svg');

  // Draw Nut (Saddle)
  const nut = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  nut.setAttribute('x1', '20');
  nut.setAttribute('y1', '20');
  nut.setAttribute('x2', '80');
  nut.setAttribute('y2', '20');
  nut.setAttribute('stroke', '#f5ebe0');
  nut.setAttribute('stroke-width', '4');
  svg.appendChild(nut);

  // Draw 4 Strings (G, C, E, A)
  for (let i = 0; i < 4; i++) {
    const x = 20 + i * 20;
    const string = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    string.setAttribute('x1', x);
    string.setAttribute('y1', '20');
    string.setAttribute('x2', x);
    string.setAttribute('y2', '110');
    string.setAttribute('stroke', '#d5bdaf');
    string.setAttribute('stroke-width', '2');
    svg.appendChild(string);
  }

  // Draw 5 Frets
  for (let i = 1; i <= 5; i++) {
    const y = 20 + i * 18;
    const fret = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    fret.setAttribute('x1', '20');
    fret.setAttribute('y1', y);
    fret.setAttribute('x2', '80');
    fret.setAttribute('y2', y);
    fret.setAttribute('stroke', '#5c4033');
    fret.setAttribute('stroke-width', '1.5');
    svg.appendChild(fret);
  }

  // Draw Finger Dots
  frets.forEach((fretVal, stringIdx) => {
    const x = 20 + stringIdx * 20;
    if (fretVal > 0) {
      // Dot on fret
      const y = 20 + (fretVal - 0.5) * 18;
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', x);
      dot.setAttribute('cy', y);
      dot.setAttribute('r', '6');
      dot.setAttribute('fill', '#e58f24');
      svg.appendChild(dot);
    } else if (fretVal === 0) {
      // Open string indicator (circle above nut)
      const openCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      openCircle.setAttribute('cx', x);
      openCircle.setAttribute('cy', '10');
      openCircle.setAttribute('r', '3');
      openCircle.setAttribute('fill', 'none');
      openCircle.setAttribute('stroke', '#2ec4b6');
      openCircle.setAttribute('stroke-width', '1.5');
      svg.appendChild(openCircle);
    }
  });

  card.appendChild(svg);
  return card;
}

// Load & Render Strumming Pattern
function loadStrumPattern(key) {
  const pattern = STRUM_PATTERNS[key];
  if (!pattern) return;

  strumPatternDisplay.innerHTML = '';
  pattern.forEach((beat, index) => {
    const beatEl = document.createElement('div');
    beatEl.className = 'strum-beat';
    beatEl.id = `strum-beat-${index}`;

    const arrow = document.createElement('span');
    arrow.className = 'strum-arrow';
    if (beat.action === '↓') {
      arrow.textContent = '↓';
      arrow.classList.add('arrow-up');
    } else if (beat.action === '↑') {
      arrow.textContent = '↑';
      arrow.classList.add('arrow-down');
    } else {
      arrow.textContent = '•';
      arrow.classList.add('arrow-mute');
    }

    const label = document.createElement('span');
    label.className = 'strum-label';
    label.textContent = beat.label;

    beatEl.appendChild(arrow);
    beatEl.appendChild(label);
    strumPatternDisplay.appendChild(beatEl);
  });
}

// Metronome Engine (Web Audio API)
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function scheduler() {
  while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
    scheduleNextBeat(currentBeat, nextNoteTime);
    advanceBeat();
  }
  timerID = setTimeout(scheduler, lookahead);
}

function scheduleNextBeat(beatNumber, time) {
  // Play click sound
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  // Accent on beat 0 (first beat of measure)
  if (beatNumber === 0) {
    osc.frequency.value = 1000;
  } else {
    osc.frequency.value = 600;
  }

  gainNode.gain.setValueAtTime(0.15, time);
  gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

  osc.start(time);
  osc.stop(time + 0.1);

  // Sync visual flash with audio thread
  const delay = (time - audioCtx.currentTime) * 1000;
  setTimeout(() => {
    triggerVisualBeat(beatNumber);
  }, Math.max(0, delay));
}

function advanceBeat() {
  const secondsPerBeat = 60.0 / bpm;
  nextNoteTime += secondsPerBeat;
  currentBeat = (currentBeat + 1) % 4; // 4/4 time signature
}

function triggerVisualBeat(beatNumber) {
  // Update Metronome Indicators
  beatIndicators.forEach((indicator, idx) => {
    if (idx === beatNumber) {
      indicator.classList.add('active');
      if (idx === 0) indicator.classList.add('accent');
    } else {
      indicator.classList.remove('active', 'accent');
    }
  });

  // Highlight active strumming beat dynamically
  const pattern = STRUM_PATTERNS[strumSelect.value];
  if (pattern) {
    const totalStrums = pattern.length;
    // Map the 4 beats to the strumming pattern elements
    const activeStrumIdx = Math.floor((beatNumber / 4) * totalStrums);
    
    for (let i = 0; i < totalStrums; i++) {
      const strumEl = document.getElementById(`strum-beat-${i}`);
      if (strumEl) {
        if (i === activeStrumIdx) {
          strumEl.classList.add('active');
        } else {
          strumEl.classList.remove('active');
        }
      }
    }
  }
}

function toggleMetronome() {
  initAudio();
  
  if (isPlaying) {
    isPlaying = false;
    clearTimeout(timerID);
    metroToggle.textContent = '▶ Démarrer';
    metroToggle.classList.remove('btn-active');
    // Reset visual indicators
    beatIndicators.forEach(ind => ind.classList.remove('active', 'accent'));
    document.querySelectorAll('.strum-beat').forEach(el => el.classList.remove('active'));
  } else {
    isPlaying = true;
    currentBeat = 0;
    nextNoteTime = audioCtx.currentTime + 0.05;
    metroToggle.textContent = '⏹ Arrêter';
    scheduler();
  }
}