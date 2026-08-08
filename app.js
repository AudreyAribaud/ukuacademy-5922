// --- CHORD DEFINITIONS (Ukulele G-C-E-A tuning) ---
// Frets: [G, C, E, A]. -1 means muted, 0 means open.
const CHORDS = {
  "C": [0, 0, 0, 3],
  "G": [0, 2, 3, 2],
  "Am": [2, 0, 0, 0],
  "F": [2, 0, 1, 0],
  "Dm": [2, 2, 1, 0],
  "Em": [0, 4, 3, 2],
  "A": [2, 1, 0, 0],
  "D": [2, 2, 2, 0],
  "E": [4, 4, 4, 2],
  "Bm": [4, 2, 2, 2],
  "C7": [0, 0, 0, 1],
  "G7": [0, 2, 1, 2],
  "E7": [1, 2, 0, 2],
  "A7": [1, 0, 0, 0],
  "D7": [2, 0, 2, 0],
  "B7": [2, 3, 2, 2],
  "F7": [2, 3, 1, 3],
  "Fm": [1, 0, 1, 3],
  "Cm": [0, 3, 3, 3],
  "Gm": [0, 2, 3, 1],
  "Bbm": [3, 1, 1, 1],
  "Cmaj7": [0, 0, 0, 2],
  "Fmaj7": [2, 4, 1, 3],
  "G6": [0, 2, 0, 2],
  "Ddim": [1, 2, 1, 2],
  "Adim": [2, 3, 2, 3]
};

// --- 50 CHORD PROGRESSIONS ---
const PROGRESSIONS = [
  { name: "Pop Classique I", chords: ["C", "G", "Am", "F"], genre: "Pop", difficulty: "Facile", rhythm: "D-DU-UDU" },
  { name: "Pop Classique II", chords: ["Am", "F", "C", "G"], genre: "Pop", difficulty: "Facile", rhythm: "D-DU-UDU" },
  { name: "Optimiste", chords: ["C", "F", "G", "F"], genre: "Folk", difficulty: "Facile", rhythm: "D-D-D-D" },
  { name: "Mélancolique", chords: ["Am", "Dm", "G", "C"], genre: "Folk", difficulty: "Moyen", rhythm: "D-DU-UDU" },
  { name: "Blues Standard", chords: ["C", "F", "C", "G7"], genre: "Blues", difficulty: "Facile", rhythm: "D-D-D-D" },
  { name: "Jazz Turnaround", chords: ["C", "Am", "Dm", "G7"], genre: "Jazz", difficulty: "Moyen", rhythm: "D-DU-UDU" },
  { name: "Vibe Reggae", chords: ["Am", "G", "Am", "G"], genre: "Reggae", difficulty: "Facile", rhythm: "-U-U-U-U" },
  { name: "Ballade Douce", chords: ["C", "Cmaj7", "F", "G7"], genre: "Ballade", difficulty: "Moyen", rhythm: "D-DU-UDU" },
  { name: "Le Voyageur", chords: ["Em", "C", "G", "D"], genre: "Rock", difficulty: "Moyen", rhythm: "D-DU-UDU" },
  { name: "Soleil Couchant", chords: ["F", "G", "Em", "Am"], genre: "Pop", difficulty: "Moyen", rhythm: "D-DU-UDU" },
  { name: "Le Classique Espagnol", chords: ["Am", "G", "F", "E7"], genre: "Flamenco", difficulty: "Difficile", rhythm: "D-D-D-D" },
  { name: "Pop Énergique", chords: ["D", "A", "Bm", "G"], genre: "Pop", difficulty: "Moyen", rhythm: "D-DU-UDU" },
  { name: "Folk Nostalgique", chords: ["G", "D", "Em", "C"], genre: "Folk", difficulty: "Facile", rhythm: "D-DU-UDU" },
  { name: "Jazz Doux", chords: ["Cmaj7", "Am", "Dm", "G7"], genre: "Jazz", difficulty: "Moyen", rhythm: "D-DU-UDU" },
  { name: "Salsa Simple", chords: ["Am", "Dm", "E7", "Am"], genre: "Latin", difficulty: "Moyen", rhythm: "D-DU-UDU" },
  { name: "Rock Vintage", chords: ["A", "D", "E", "D"], genre: "Rock", difficulty: "Moyen", rhythm: "D-D-D-D" },
  { name: "Amour d'Été", chords: ["C", "Am", "F", "G"], genre: "Pop", difficulty: "Facile", rhythm: "D-DU-UDU" },
  { name: "Nuit Étoilée", chords: ["Dm", "Am", "E7", "Am"], genre: "Ballade", difficulty: "Moyen", rhythm: "D-DU-UDU" },
  { name: "Le Rêveur", chords: ["Fmaj7", "Cmaj7", "Fmaj7", "Cmaj7"], genre: "Indie", difficulty: "Moyen", rhythm: "D-DU-UDU" },
  { name: "Blues en La", chords: ["A7", "D7", "A7", "E7"], genre: "Blues", difficulty: "Moyen", rhythm: "D-D-D-D" },
  { name: "Pop Moderne", chords: ["F", "C", "G", "Am"], genre: "Pop", difficulty: "Facile", rhythm: "D-DU-UDU" },
  { name: "Folk Joyeux", chords: ["C", "G", "C", "F"], genre: "Folk", difficulty: "Facile", rhythm: "D-DU-UDU" },
  { name: "L'Aventurier", chords: ["Bm", "G", "D", "A"], genre: "Rock", difficulty: "Difficile", rhythm: "D-DU-UDU" },
  { name: "Jazz Cool", chords: ["Dm", "G7", "Cmaj7", "A7"], genre: "Jazz", difficulty: "Difficile", rhythm: "D-DU-UDU" },
  { name: "Reggae Sun", chords: ["C", "F", "G", "F"], genre: "Reggae", difficulty: "Facile", rhythm: "-U-U-U-U" },
  { name: "Ballade Triste", chords: ["Am", "Em", "F", "C"], genre: "Ballade", difficulty: "Facile", rhythm: "D-DU-UDU" },
  { name: "Pop Folk", chords: ["G", "C", "D", "C"], genre: "Folk", difficulty: "Facile", rhythm: "D-DU-UDU" },
  { name: "Le Mystérieux", chords: ["Am", "F", "Dm", "E7"], genre: "Indie", difficulty: "Moyen", rhythm: "D-DU-UDU" },
  { name: "Country Simple", chords: ["C", "G7", "C", "C7"], genre: "Country", difficulty: "Facile", rhythm: "D-D-D-D" },
  { name: "Soul Vibe", chords: ["F", "Fm", "C", "C7"], genre: "Soul", difficulty: "Difficile", rhythm: "D-DU-UDU" },
  { name: "Pop Lumineuse", chords: ["C", "Em", "Am", "F"], genre: "Pop", difficulty: "Facile", rhythm: "D-DU-UDU" },
  { name: "Le Vagabond", chords: ["Em", "D", "C", "G"], genre: "Folk", difficulty: "Moyen", rhythm: "D-DU-UDU" },
  { name: "Jazz Bossa", chords: ["Cmaj7", "Dm", "Em", "Dm"], genre: "Jazz", difficulty: "Moyen", rhythm: "D-DU-UDU" },
  { name: "Rock Grunge", chords: ["Am", "C", "D", "F"], genre: "Rock", difficulty: "Moyen", rhythm: "D-D-D-D" },
  { name: "Ballade Romantique", chords: ["G", "Bm", "C", "D"], genre: "Ballade", difficulty: "Moyen", rhythm: "D-DU-UDU" },
  { name: "Le Survivant", chords: ["Am", "G", "F", "G"], genre: "Rock", difficulty: "Facile", rhythm: "D-DU-UDU" },
  { name: "Pop Douce", chords: ["C", "G6", "Am", "F"], genre: "Pop", difficulty: "Moyen", rhythm: "D-DU-UDU" },
  { name: "Blues en Sol", chords: ["G7", "C7", "G7", "D7"], genre: "Blues", difficulty: "Moyen", rhythm: "D-D-D-D" },
  { name: "Indie Folk", chords: ["F", "Am", "G", "C"], genre: "Indie", difficulty: "Facile", rhythm: "D-DU-UDU" },
  { name: "Le Rêve d'Or", chords: ["C", "E7", "Am", "F"], genre: "Pop", difficulty: "Moyen", rhythm: "D-DU-UDU" },
  { name: "Salsa Caliente", chords: ["Dm", "Gm", "A7", "Dm"], genre: "Latin", difficulty: "Difficile", rhythm: "D-DU-UDU" },
  { name: "Pop Classique III", chords: ["G", "Em", "C", "D"], genre: "Pop", difficulty: "Moyen", rhythm: "D-DU-UDU" },
  { name: "Le Mélodique", chords: ["Am", "Fmaj7", "Cmaj7", "G"], genre: "Indie", difficulty: "Moyen", rhythm: "D-DU-UDU" },
  { name: "Folk Épique", chords: ["Em", "G", "D", "A"], genre: "Folk", difficulty: "Moyen", rhythm: "D-DU-UDU" },
  { name: "Jazz Swing", chords: ["C", "A7", "D7", "G7"], genre: "Jazz", difficulty: "Difficile", rhythm: "D-D-D-D" },
  { name: "Pop Nostalgie", chords: ["C", "Am", "Dm", "F"], genre: "Pop", difficulty: "Facile", rhythm: "D-DU-UDU" },
  { name: "Le Sombre", chords: ["Dm", "Bbm", "F", "C"], genre: "Indie", difficulty: "Difficile", rhythm: "D-DU-UDU" },
  { name: "Reggae Roots", chords: ["G", "Am", "G", "Am"], genre: "Reggae", difficulty: "Facile", rhythm: "-U-U-U-U" },
  { name: "Ballade Folk", chords: ["C", "G", "F", "C"], genre: "Folk", difficulty: "Facile", rhythm: "D-DU-UDU" },
  { name: "Le Grand Final", chords: ["C", "F", "G", "C"], genre: "Pop", difficulty: "Facile", rhythm: "D-D-D-D" }
];

// --- AUDIO SYNTHESIS (Web Audio API) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const openStrings = [392.00, 261.63, 329.63, 440.00]; // G4, C4, E4, A4

function playUkuleleChord(frets, duration = 1.5, delayOffset = 0) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const now = audioCtx.currentTime + delayOffset;
  
  frets.forEach((fret, stringIdx) => {
    if (fret < 0) return; // Muted string
    
    const freq = openStrings[stringIdx] * Math.pow(2, fret / 12);
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    // Triangle wave gives a warmer, nylon-string-like sound
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + stringIdx * 0.04); // Strum delay
    
    // Envelope
    gainNode.gain.setValueAtTime(0, now + stringIdx * 0.04);
    gainNode.gain.linearRampToValueAtTime(0.25, now + stringIdx * 0.04 + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + stringIdx * 0.04 + duration);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(now + stringIdx * 0.04);
    osc.stop(now + stringIdx * 0.04 + duration);
  });
}

// --- SVG CHORD DIAGRAM GENERATOR ---
function generateChordSVG(frets) {
  const width = 60;
  const height = 75;
  const numStrings = 4;
  const numFrets = 5;
  
  let svg = `<svg viewBox="0 0 ${width} ${height}" class="chord-svg" xmlns="http://www.w3.org/2000/svg">`;
  
  // Draw Fretboard lines
  // Vertical strings
  for (let i = 0; i < numStrings; i++) {
    const x = 10 + i * 13.3;
    svg += `<line x1="${x}" y1="15" x2="${x}" y2="65" stroke="var(--text-secondary)" stroke-width="1.5"/>`;
  }
  
  // Horizontal frets
  for (let i = 0; i <= numFrets; i++) {
    const y = 15 + i * 10;
    const widthStroke = i === 0 ? 3 : 1;
    svg += `<line x1="10" y1="${y}" x2="50" y2="${y}" stroke="var(--text-secondary)" stroke-width="${widthStroke}"/>`;
  }
  
  // Draw dots or open markers
  frets.forEach((fret, stringIdx) => {
    const x = 10 + stringIdx * 13.3;
    if (fret === 0) {
      // Open string circle
      svg += `<circle cx="${x}" cy="9" r="3" fill="none" stroke="var(--accent)" stroke-width="1.5"/>`;
    } else if (fret > 0) {
      // Fret dot
      const y = 15 + (fret - 0.5) * 10;
      svg += `<circle cx="${x}" cy="${y}" r="4" fill="var(--accent)"/>`;
    } else {
      // Muted string (X)
      svg += `<text x="${x - 3}" y="11" font-size="8" fill="var(--text-secondary)" font-weight="bold">X</text>`;
    }
  });
  
  svg += `</svg>`;
  return svg;
}

// --- TAB NAVIGATION ---
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(nav => nav.classList.remove('active'));
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    item.classList.add('active');
    const tabId = item.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
    
    // Stop metronome or tuner if switching away
    if (tabId !== 'metronome-tab') stopMetronome();
    if (tabId !== 'tuner-tab') stopTuner();
  });
});

// --- THEME TOGGLE ---
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// --- PROGRESSIONS VIEW LOGIC ---
const progressionSelect = document.getElementById('progressionSelect');
const chordsGrid = document.getElementById('chordsGrid');
const progGenre = document.getElementById('progGenre');
const progDifficulty = document.getElementById('progDifficulty');
const progRhythm = document.getElementById('progRhythm');
const playProgressionBtn = document.getElementById('playProgressionBtn');
const strumProgressionBtn = document.getElementById('strumProgressionBtn');

// Populate Select
PROGRESSIONS.forEach((prog, idx) => {
  const option = document.createElement('option');
  option.value = idx;
  option.textContent = `${prog.name} (${prog.genre})`;
  progressionSelect.appendChild(option);
});

function displaySelectedProgression() {
  const prog = PROGRESSIONS[progressionSelect.value];
  progGenre.textContent = prog.genre;
  progDifficulty.textContent = prog.difficulty;
  progRhythm.textContent = prog.rhythm;
  
  chordsGrid.innerHTML = '';
  prog.chords.forEach(chordName => {
    const frets = CHORDS[chordName] || [0,0,0,0];
    const card = document.createElement('div');
    card.className = 'chord-card';
    card.innerHTML = `
      <span class="chord-name">${chordName}</span>
      ${generateChordSVG(frets)}
    `;
    card.addEventListener('click', () => {
      card.classList.add('playing');
      playUkuleleChord(frets, 1.2);
      setTimeout(() => card.classList.remove('playing'), 300);
    });
    chordsGrid.appendChild(card);
  });
}

progressionSelect.addEventListener('change', displaySelectedProgression);

// Play whole progression sequentially
let progressionTimeout = null;
playProgressionBtn.addEventListener('click', () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const prog = PROGRESSIONS[progressionSelect.value];
  const cards = chordsGrid.querySelectorAll('.chord-card');
  
  cards.forEach(c => c.classList.remove('playing'));
  
  prog.chords.forEach((chordName, idx) => {
    const frets = CHORDS[chordName];
    const delay = idx * 1.5;
    
    playUkuleleChord(frets, 1.4, delay);
    
    setTimeout(() => {
      cards.forEach(c => c.classList.remove('playing'));
      if (cards[idx]) cards[idx].classList.add('playing');
    }, delay * 1000);
  });
  
  setTimeout(() => {
    cards.forEach(c => c.classList.remove('playing'));
  }, prog.chords.length * 1500);
});

// Strum all chords at once (with slight delay)
strumProgressionBtn.addEventListener('click', () => {
  const prog = PROGRESSIONS[progressionSelect.value];
  prog.chords.forEach((chordName, idx) => {
    const frets = CHORDS[chordName];
    playUkuleleChord(frets, 1.5, idx * 0.2);
  });
});

// --- METRONOME LOGIC ---
let bpm = 120;
let isMetroPlaying = false;
let metroInterval = null;
let currentBeat = 0;
let timeSignature = 4;

const bpmSlider = document.getElementById('bpmSlider');
const bpmDisplay = document.getElementById('bpmDisplay');
const bpmMinus = document.getElementById('bpmMinus');
const bpmPlus = document.getElementById('bpmPlus');
const metroPlayBtn = document.getElementById('metroPlayBtn');
const metroVisual = document.getElementById('metroVisual');
const sigButtons = document.querySelectorAll('.sig-btn');

function updateBPM(newBpm) {
  bpm = Math.max(40, Math.min(240, newBpm));
  bpmSlider.value = bpm;
  bpmDisplay.innerHTML = `${bpm} <span class="bpm-unit">BPM</span>`;
  if (isMetroPlaying) {
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

function playClick(accented) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(accented ? 1000 : 600, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.06);
}

function startMetronome() {
  isMetroPlaying = true;
  metroPlayBtn.textContent = "Arrêter";
  metroPlayBtn.style.backgroundColor = "#ef4444";
  
  const intervalMs = (60 / bpm) * 1000;
  metroInterval = setInterval(() => {
    const isAccent = currentBeat === 0;
    playClick(isAccent);
    
    // Visual Flash
    metroVisual.className = 'metro-visual-dot';
    void metroVisual.offsetWidth; // Trigger reflow
    metroVisual.classList.add(isAccent ? 'flash-accent' : 'flash');
    
    currentBeat = (currentBeat + 1) % timeSignature;
  }, intervalMs);
}

function stopMetronome() {
  isMetroPlaying = false;
  metroPlayBtn.textContent = "Démarrer";
  metroPlayBtn.style.backgroundColor = "var(--accent)";
  clearInterval(metroInterval);
  currentBeat = 0;
}

metroPlayBtn.addEventListener('click', () => {
  if (isMetroPlaying) stopMetronome();
  else startMetronome();
});

// --- TUNER LOGIC (Reference Notes & Mic Pitch Detection) ---
const refButtons = document.querySelectorAll('.ref-note-btn');
const micToggleBtn = document.getElementById('micToggleBtn');
const detectedNote = document.getElementById('detectedNote');
const detuneAmount = document.getElementById('detuneAmount');
const tunerNeedle = document.getElementById('tunerNeedle');

let activeRefOsc = null;
let activeRefGain = null;
let audioStream = null;
let analyser = null;
let isTuningMic = false;
let animationFrameId = null;

const refFrequencies = {
  'G': 392.00,
  'C': 261.63,
  'E': 329.63,
  'A': 440.00
};

refButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const note = btn.getAttribute('data-note');
    
    if (btn.classList.contains('playing')) {
      stopRefNote();
    } else {
      stopRefNote();
      stopTuner();
      btn.classList.add('playing');
      playRefNote(refFrequencies[note]);
    }
  });
});

function playRefNote(frequency) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  activeRefOsc = audioCtx.createOscillator();
  activeRefGain = audioCtx.createGain();
  
  activeRefOsc.type = 'sine';
  activeRefOsc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  
  activeRefGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  
  activeRefOsc.connect(activeRefGain);
  activeRefGain.connect(audioCtx.destination);
  
  activeRefOsc.start();
}

function stopRefNote() {
  refButtons.forEach(b => b.classList.remove('playing'));
  if (activeRefOsc) {
    activeRefOsc.stop();
    activeRefOsc.disconnect();
    activeRefOsc = null;
  }
}

// Autocorrelation Pitch Detection Algorithm
function autoCorrelate(buffer, sampleRate) {
  let SIZE = buffer.length;
  let r = new Float32Array(SIZE);
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE - i; j++) {
      r[i] = r[i] + buffer[j] * buffer[j + i];
    }
  }
  
  let d = 0;
  while (r[d] > r[d + 1]) d++;
  let maxval = -1, maxpos = -1;
  for (let i = d; i < SIZE; i++) {
    if (r[i] > maxval) {
      maxval = r[i];
      maxpos = i;
    }
  }
  let T0 = maxpos;
  
  // Refine pitch estimation
  let x1 = r[T0 - 1], x2 = r[T0], x3 = r[T0 + 1];
  let a = (x1 + x3 - 2 * x2) / 2;
  let b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);
  
  return sampleRate / T0;
}

function updateTuner() {
  const buffer = new Float32Array(2048);
  analyser.getFloatTimeDomainData(buffer);
  
  // Check signal level
  let rms = 0;
  for (let i = 0; i < buffer.length; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / buffer.length);
  
  if (rms > 0.01) { // Only detect if loud enough
    const pitch = autoCorrelate(buffer, audioCtx.sampleRate);
    if (pitch && pitch > 100 && pitch < 1000) {
      // Find closest standard ukulele note
      const notes = [
        { name: 'C', freq: 261.63 },
        { name: 'E', freq: 329.63 },
        { name: 'G', freq: 392.00 },
        { name: 'A', freq: 440.00 }
      ];
      
      let closest = notes[0];
      let minDiff = Math.abs(pitch - notes[0].freq);
      
      notes.forEach(n => {
        const diff = Math.abs(pitch - n.freq);
        if (diff < minDiff) {
          minDiff = diff;
          closest = n;
        }
      });
      
      // Calculate cents difference
      const cents = 1200 * Math.log2(pitch / closest.freq);
      
      detectedNote.textContent = closest.name;
      
      if (Math.abs(cents) < 5) {
        detuneAmount.textContent = "Parfait !";
        detuneAmount.style.color = "#10b981";
        tunerNeedle.style.transform = `translateX(-50%) rotate(0deg)`;
      } else if (cents < 0) {
        detuneAmount.textContent = "Trop bas";
        detuneAmount.style.color = "#ef4444";
        tunerNeedle.style.transform = `translateX(-50%) rotate(${Math.max(-45, cents)}deg)`;
      } else {
        detuneAmount.textContent = "Trop haut";
        detuneAmount.style.color = "#ef4444";
        tunerNeedle.style.transform = `translateX(-50%) rotate(${Math.min(45, cents)}deg)`;
      }
    }
  }
  
  animationFrameId = requestAnimationFrame(updateTuner);
}

async function startTuner() {
  stopRefNote();
  try {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    const source = audioCtx.createMediaStreamSource(audioStream);
    source.connect(analyser);
    
    isTuningMic = true;
    micToggleBtn.textContent = "🎤 Arrêter le Micro";
    micToggleBtn.style.backgroundColor = "#ef4444";
    updateTuner();
  } catch (err) {
    alert("Impossible d'accéder au micro pour l'accordeur.");
    console.error(err);
  }
}

function stopTuner() {
  isTuningMic = false;
  micToggleBtn.textContent = "🎤 Activer le Micro";
  micToggleBtn.style.backgroundColor = "var(--accent)";
  if (audioStream) {
    audioStream.getTracks().forEach(track => track.stop());
  }
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  detectedNote.textContent = "-";
  detuneAmount.textContent = "En attente...";
  detuneAmount.style.color = "var(--text-secondary)";
  tunerNeedle.style.transform = `translateX(-50%) rotate(0deg)`;
}

micToggleBtn.addEventListener('click', () => {
  if (isTuningMic) stopTuner();
  else startTuner();
});

// --- CHORD DICTIONARY VIEW LOGIC ---
const libraryGrid = document.getElementById('libraryGrid');
const chordSearch = document.getElementById('chordSearch');

function renderLibrary(filter = '') {
  libraryGrid.innerHTML = '';
  Object.keys(CHORDS).forEach(chordName => {
    if (filter && !chordName.toLowerCase().includes(filter.toLowerCase())) return;
    
    const frets = CHORDS[chordName];
    const card = document.createElement('div');
    card.className = 'chord-card';
    card.innerHTML = `
      <span class="chord-name">${chordName}</span>
      ${generateChordSVG(frets)}
    `;
    card.addEventListener('click', () => {
      card.classList.add('playing');
      playUkuleleChord(frets, 1.2);
      setTimeout(() => card.classList.remove('playing'), 300);
    });
    libraryGrid.appendChild(card);
  });
}

chordSearch.addEventListener('input', (e) => renderLibrary(e.target.value));

// --- INITIALIZATION ---
displaySelectedProgression();
renderLibrary();

// --- PWA INSTALLATION & CACHE REFRESH ---
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

// Register Service Worker and force immediate update check
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(reg => {
      // Check for updates on load
      reg.update();
    }).catch(err => console.log('Service Worker registration failed: ', err));
  });
}