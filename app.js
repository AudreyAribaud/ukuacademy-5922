// --- AUDIO ENGINE (Web Audio API) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Ukulele Standard Tuning: G4 (392.00 Hz), C4 (261.63 Hz), E4 (329.63 Hz), A4 (440.00 Hz)
const stringPitches = [392.00, 261.63, 329.63, 440.00];

function playPluck(frequency, delay = 0, duration = 1.2) {
  if (frequency === -1) return; // Muted string

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  // Nylon string simulation (fast attack, exponential decay, rich harmonics)
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime + delay);

  // Add a subtle second harmonic for warmth
  const harmonic = audioCtx.createOscillator();
  const harmonicGain = audioCtx.createGain();
  harmonic.type = 'sine';
  harmonic.frequency.setValueAtTime(frequency * 2, audioCtx.currentTime + delay);
  harmonic.connect(harmonicGain);
  harmonicGain.connect(audioCtx.destination);

  // Envelope
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime + delay);
  gainNode.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + delay + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);

  harmonicGain.gain.setValueAtTime(0, audioCtx.currentTime + delay);
  harmonicGain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + delay + 0.01);
  harmonicGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration * 0.5);

  osc.start(audioCtx.currentTime + delay);
  osc.stop(audioCtx.currentTime + delay + duration);
  harmonic.start(audioCtx.currentTime + delay);
  harmonic.stop(audioCtx.currentTime + delay + duration);
}

function playChord(frets) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  // Strum strings sequentially with a slight delay (arpeggio effect)
  frets.forEach((fret, stringIndex) => {
    if (fret !== -1) {
      // Calculate pitch based on fret: pitch * 2^(fret/12)
      const pitch = stringPitches[stringIndex] * Math.pow(2, fret / 12);
      const strumDelay = stringIndex * 0.035; // 35ms delay between strings
      playPluck(pitch, strumDelay);
    }
  });
}

// --- CHORD DATA ---
const chords = {
  'C': { name: 'C', frets: [0, 0, 0, 3], difficulty: 'Facile' },
  'Am': { name: 'Am', frets: [2, 0, 0, 0], difficulty: 'Facile' },
  'F': { name: 'F', frets: [2, 0, 1, 0], difficulty: 'Facile' },
  'G': { name: 'G', frets: [0, 2, 3, 2], difficulty: 'Moyen' },
  'C7': { name: 'C7', frets: [0, 0, 0, 1], difficulty: 'Facile' },
  'G7': { name: 'G7', frets: [0, 2, 1, 2], difficulty: 'Moyen' },
  'Dm': { name: 'Dm', frets: [2, 2, 1, 0], difficulty: 'Moyen' },
  'Em': { name: 'Em', frets: [0, 4, 3, 2], difficulty: 'Moyen' },
  'D': { name: 'D', frets: [2, 2, 2, 0], difficulty: 'Moyen' },
  'A': { name: 'A', frets: [2, 1, 0, 0], difficulty: 'Moyen' },
  'E7': { name: 'E7', frets: [1, 2, 0, 2], difficulty: 'Moyen' },
  'Bm': { name: 'Bm', frets: [4, 2, 2, 2], difficulty: 'Difficile' }
};

const progressions = {
  pop: {
    title: "Pop Classique (Do / C)",
    desc: "La suite d'accords magique par excellence, utilisée dans des centaines de tubes mondiaux.",
    chords: ["C", "G", "Am", "F"]
  },
  island: {
    title: "Vibe des Îles (La min / Am)",
    desc: "Une ambiance chaleureuse, relaxante et typiquement hawaïenne.",
    chords: ["Am", "F", "C", "G"]
  },
  jazz: {
    title: "Jazz Doux (Sol / G)",
    desc: "Une progression sophistiquée mais accessible pour donner une touche feutrée à vos morceaux.",
    chords: ["G", "Em", "Am", "D"]
  },
  blues: {
    title: "Blues Traditionnel (Do / C)",
    desc: "Le rythme entraînant du blues classique en 12 mesures simplifié.",
    chords: ["C", "F", "C", "G7"]
  }
};

// --- SVG CHORD DIAGRAM GENERATOR ---
function generateChordSVG(frets) {
  const width = 100;
  const height = 120;
  const numStrings = 4;
  const numFrets = 5;
  
  let svg = `<svg viewBox="0 0 ${width} ${height}" class="chord-diagram-svg" xmlns="http://www.w3.org/2000/svg">`;
  
  // Draw Fretboard lines
  const startX = 20;
  const endX = 80;
  const startY = 20;
  const endY = 110;
  const stringSpacing = (endX - startX) / (numStrings - 1);
  const fretSpacing = (endY - startY) / numFrets;

  // Nut (thick top line)
  svg += `<line x1="${startX}" y1="${startY}" x2="${endX}" y2="${startY}" stroke="#2c3e50" stroke-width="4" />`;

  // Strings (vertical lines)
  for (let i = 0; i < numStrings; i++) {
    const x = startX + i * stringSpacing;
    svg += `<line x1="${x}" y1="${startY}" x2="${x}" y2="${endY}" stroke="#bdc3c7" stroke-width="2" />`;
  }

  // Frets (horizontal lines)
  for (let i = 1; i <= numFrets; i++) {
    const y = startY + i * fretSpacing;
    svg += `<line x1="${startX}" y1="${y}" x2="${endX}" y2="${y}" stroke="#bdc3c7" stroke-width="1.5" />`;
  }

  // Draw Dots (fingering)
  frets.forEach((fret, stringIdx) => {
    const x = startX + stringIdx * stringSpacing;
    if (fret === 0) {
      // Open string circle above nut
      svg += `<circle cx="${x}" cy="${startY - 7}" r="4" fill="none" stroke="#2ecc71" stroke-width="2" />`;
    } else if (fret > 0) {
      // Pressed fret dot
      const y = startY + (fret - 0.5) * fretSpacing;
      svg += `<circle cx="${x}" cy="${y}" r="6" fill="#e67e22" />`;
    } else if (fret === -1) {
      // Muted string (X)
      svg += `<text x="${x - 4}" y="${startY - 4}" font-family="sans-serif" font-size="10" fill="#e74c3c">X</text>`;
    }
  });

  svg += `</svg>`;
  return svg;
}

// --- UI RENDERING ---
function renderChordCard(chordKey, container, isInteractive = true) {
  const chord = chords[chordKey];
  if (!chord) return;

  const card = document.createElement('div');
  card.className = 'chord-card';
  card.dataset.chord = chordKey;
  card.innerHTML = `
    <h4>${chord.name}</h4>
    <div class="chord-diagram">${generateChordSVG(chord.frets)}</div>
    <span class="play-hint">${isInteractive ? '👉 Cliquer pour jouer' : ''}</span>
  `;

  if (isInteractive) {
    card.addEventListener('click', () => {
      playChord(chord.frets);
      card.classList.add('playing');
      setTimeout(() => card.classList.remove('playing'), 300);
    });
  }

  container.appendChild(card);
}

function loadProgression(progKey) {
  const prog = progressions[progKey];
  document.getElementById('prog-title').innerText = prog.title;
  document.getElementById('prog-desc').innerText = prog.desc;

  const container = document.getElementById('progression-chords-container');
  container.innerHTML = '';
  prog.chords.forEach(chordKey => {
    renderChordCard(chordKey, container, true);
  });
}

function initDictionary() {
  const container = document.getElementById('dictionary-chords-container');
  container.innerHTML = '';
  Object.keys(chords).forEach(chordKey => {
    renderChordCard(chordKey, container, true);
  });
}

// --- METRONOME ENGINE ---
let metronomeInterval = null;
let isMetronomePlaying = false;
let bpm = 100;
let currentBeat = 0;
let tapTimes = [];

function playMetronomeSound(beat) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const soundType = document.getElementById('metro-sound').value;

  if (soundType === 'woodblock') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(beat === 0 ? 1200 : 800, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.06);
  } else if (soundType === 'beep') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(beat === 0 ? 1000 : 500, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  } else if (soundType === 'snap') {
    // Noise-based snap simulation
    const bufferSize = audioCtx.sampleRate * 0.05;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = beat === 0 ? 2000 : 1500;
    
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.gain.setValueAtTime(0.6, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
    noise.start();
    noise.stop(audioCtx.currentTime + 0.05);
  }
}

function updateMetronomeVisuals() {
  const dots = document.querySelectorAll('.beat-dot');
  dots.forEach((dot, idx) => {
    dot.className = 'beat-dot';
    if (idx === currentBeat) {
      dot.classList.add('active');
      if (idx === 0) dot.classList.add('accent');
    }
  });
}

function startMetronome() {
  if (isMetronomePlaying) return;
  isMetronomePlaying = true;
  document.getElementById('metro-toggle').innerText = 'Arrêter';
  document.getElementById('metro-toggle').classList.add('btn-secondary');
  document.getElementById('metro-toggle').classList.remove('btn-primary');
  
  currentBeat = 0;
  const intervalMs = (60 / bpm) * 1000;
  
  // Play first beat immediately
  playMetronomeSound(currentBeat);
  updateMetronomeVisuals();
  currentBeat = (currentBeat + 1) % 4;

  metronomeInterval = setInterval(() => {
    playMetronomeSound(currentBeat);
    updateMetronomeVisuals();
    currentBeat = (currentBeat + 1) % 4;
  }, intervalMs);
}

function stopMetronome() {
  if (!isMetronomePlaying) return;
  isMetronomePlaying = false;
  clearInterval(metronomeInterval);
  document.getElementById('metro-toggle').innerText = 'Démarrer';
  document.getElementById('metro-toggle').classList.add('btn-primary');
  document.getElementById('metro-toggle').classList.remove('btn-secondary');
  
  // Reset dots
  document.querySelectorAll('.beat-dot').forEach(dot => dot.className = 'beat-dot');
}

// --- AUTOMATIC PROGRESSION PLAYER ---
let progressionInterval = null;
let isProgressionPlaying = false;
let currentProgChordIdx = 0;

function startProgressionPlayback() {
  if (isProgressionPlaying) return;
  isProgressionPlaying = true;
  
  const activeFilter = document.querySelector('.prog-filter.active');
  const progKey = activeFilter ? activeFilter.dataset.prog : 'pop';
  const prog = progressions[progKey];
  const tempo = parseInt(document.getElementById('prog-tempo').value) || 100;
  
  document.getElementById('play-prog-btn').style.display = 'none';
  document.getElementById('stop-prog-btn').style.display = 'inline-block';

  currentProgChordIdx = 0;
  const intervalMs = (60 / tempo) * 1000 * 4; // 4 beats per chord

  const playStep = () => {
    const chordKey = prog.chords[currentProgChordIdx];
    const chordCards = document.querySelectorAll('#progression-chords-container .chord-card');
    
    // Highlight active chord card
    chordCards.forEach((card, idx) => {
      if (idx === currentProgChordIdx) {
        card.classList.add('playing');
        // Play chord sound
        playChord(chords[chordKey].frets);
      } else {
        card.classList.remove('playing');
      }
    });

    currentProgChordIdx = (currentProgChordIdx + 1) % prog.chords.length;
  };

  playStep(); // Play first immediately
  progressionInterval = setInterval(playStep, intervalMs);
}

function stopProgressionPlayback() {
  if (!isProgressionPlaying) return;
  isProgressionPlaying = false;
  clearInterval(progressionInterval);
  
  document.getElementById('play-prog-btn').style.display = 'inline-block';
  document.getElementById('stop-prog-btn').style.display = 'none';

  // Clear highlights
  document.querySelectorAll('#progression-chords-container .chord-card').forEach(card => {
    card.classList.remove('playing');
  });
}

// --- EVENT LISTENERS & NAVIGATION ---

// Tab Switching
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
    
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    
    // Stop any running playbacks when switching tabs
    stopMetronome();
    stopProgressionPlayback();
  });
});

// Progression Filters
document.querySelectorAll('.prog-filter').forEach(filter => {
  filter.addEventListener('click', () => {
    document.querySelectorAll('.prog-filter').forEach(f => f.classList.remove('active'));
    filter.classList.add('active');
    stopProgressionPlayback();
    loadProgression(filter.dataset.prog);
  });
});

// Progression Playback Controls
document.getElementById('play-prog-btn').addEventListener('click', startProgressionPlayback);
document.getElementById('stop-prog-btn').addEventListener('click', stopProgressionPlayback);

// Dictionary Search
document.getElementById('chord-search').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();
  const cards = document.querySelectorAll('#dictionary-chords-container .chord-card');
  
  cards.forEach(card => {
    const chordName = card.dataset.chord.toLowerCase();
    if (chordName.includes(query)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
});

// Metronome Controls
const tempoSlider = document.getElementById('tempo-slider');
const bpmValue = document.getElementById('bpm-value');

function updateBpm(newBpm) {
  bpm = Math.max(40, Math.min(220, newBpm));
  tempoSlider.value = bpm;
  bpmValue.innerText = bpm;
  if (isMetronomePlaying) {
    stopMetronome();
    startMetronome();
  }
}

tempoSlider.addEventListener('input', (e) => updateBpm(parseInt(e.target.value)));
document.getElementById('tempo-minus').addEventListener('click', () => updateBpm(bpm - 1));
document.getElementById('tempo-plus').addEventListener('click', () => updateBpm(bpm + 1));

document.getElementById('metro-toggle').addEventListener('click', () => {
  if (isMetronomePlaying) {
    stopMetronome();
  } else {
    startMetronome();
  }
});

// Tap Tempo
document.getElementById('tap-tempo-btn').addEventListener('click', () => {
  const now = performance.now();
  tapTimes.push(now);
  if (tapTimes.length > 4) tapTimes.shift();

  if (tapTimes.length > 1) {
    const intervals = [];
    for (let i = 1; i < tapTimes.length; i++) {
      intervals.push(tapTimes[i] - tapTimes[i - 1]);
    }
    const averageInterval = intervals.reduce((a, b) => a + b) / intervals.length;
    const calculatedBpm = Math.round(60000 / averageInterval);
    updateBpm(calculatedBpm);
  }
});

// --- INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
  loadProgression('pop');
  initDictionary();
});

// --- SERVICE WORKER REGISTRATION ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker enregistré !', reg.scope))
      .catch(err => console.log('Erreur d\'enregistrement du SW:', err));
  });
}

// Install PWA Prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const installBtn = document.getElementById('install-btn');
  installBtn.style.display = 'block';

  installBtn.addEventListener('click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('L\'utilisateur a accepté l\'installation');
      }
      installBtn.style.display = 'none';
    });
  });
});
