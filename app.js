const CHORDS = {
  "C": [0, 0, 0, 3],
  "G": [0, 2, 3, 2],
  "Am": [2, 0, 0, 0],
  "F": [2, 0, 1, 0],
  "Dm": [2, 2, 1, 0],
  "Em": [0, 4, 3, 2],
  "A": [2, 1, 0, 0],
  "A7": [1, 1, 0, 0],
  "D": [2, 2, 2, 0],
  "G7": [0, 2, 1, 2],
  "C7": [0, 0, 0, 1],
  "Bb": [3, 2, 1, 1]
};

const PROGRESSIONS = [
  { name: "Pop Standard", chords: ["C", "G", "Am", "F"], desc: "Le grand classique incontournable" },
  { name: "Vibe Tropicale", chords: ["C", "Am", "F", "G"], desc: "Idéal pour la plage et s'évader" },
  { name: "Mélancolie", chords: ["Am", "F", "C", "G"], desc: "Une suite douce et profonde" },
  { name: "Jazz Débutant", chords: ["Dm", "G7", "C", "A7"], desc: "Un standard de jazz simplifié" },
  { name: "Bluesy", chords: ["C7", "F", "C7", "G7"], desc: "Un rythme blues entraînant" }
];

const BASE_FREQS = [392.00, 261.63, 329.63, 440.00]; // G4, C4, E4, A4

let audioCtx = null;
let activeChord = "C";
let selectedProgressionIndex = 0;
let progressionInterval = null;
let isPlayingProgression = false;
let activeProgChordIdx = 0;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playPluck(freq, startTime, duration = 1.0) {
  initAudio();
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, startTime);

  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(0.5, startTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1200, startTime);
  filter.frequency.exponentialRampToValueAtTime(300, startTime + duration);

  osc.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

function strumChord(frets, speed = 0.04) {
  initAudio();
  const now = audioCtx.currentTime;
  frets.forEach((fret, index) => {
    if (fret !== -1) {
      const baseFreq = BASE_FREQS[index];
      const freq = baseFreq * Math.pow(2, fret / 12);
      playPluck(freq, now + (index * speed), 1.0);
    }
  });
}

function drawChord(chordName) {
  const frets = CHORDS[chordName];
  const svg = document.getElementById('chord-svg');
  svg.innerHTML = '';

  const startX = 20;
  const startY = 20;
  const width = 60;
  const height = 80;
  const numStrings = 4;
  const numFrets = 4;

  const stringSpacing = width / (numStrings - 1);
  const fretSpacing = height / numFrets;

  const nut = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  nut.setAttribute('x1', startX);
  nut.setAttribute('y1', startY);
  nut.setAttribute('x2', startX + width);
  nut.setAttribute('y2', startY);
  nut.setAttribute('class', 'nut-line');
  svg.appendChild(nut);

  for (let i = 1; i <= numFrets; i++) {
    const y = startY + i * fretSpacing;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', startX);
    line.setAttribute('y1', y);
    line.setAttribute('x2', startX + width);
    line.setAttribute('y2', y);
    line.setAttribute('class', 'fret-line');
    svg.appendChild(line);
  }

  for (let i = 0; i < numStrings; i++) {
    const x = startX + i * stringSpacing;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x);
    line.setAttribute('y1', startY);
    line.setAttribute('x2', x);
    line.setAttribute('y2', startY + height);
    line.setAttribute('class', 'chord-line');
    svg.appendChild(line);
  }

  frets.forEach((fret, stringIdx) => {
    const x = startX + stringIdx * stringSpacing;
    if (fret === 0) {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', startY - 6);
      circle.setAttribute('r', 3.5);
      circle.setAttribute('class', 'open-string');
      svg.appendChild(circle);
    } else if (fret > 0) {
      const y = startY + (fret - 0.5) * fretSpacing;
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', 5.5);
      circle.setAttribute('class', 'chord-dot');
      svg.appendChild(circle);
    } else {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', startY - 4);
      text.setAttribute('class', 'chord-text');
      text.textContent = 'X';
      svg.appendChild(text);
    }
  });
}

function initChordsTab() {
  const selector = document.getElementById('chord-selector');
  selector.innerHTML = '';
  Object.keys(CHORDS).forEach(chord => {
    const btn = document.createElement('button');
    btn.className = `chord-btn ${chord === activeChord ? 'active' : ''}`;
    btn.textContent = chord;
    btn.addEventListener('click', () => {
      activeChord = chord;
      document.querySelectorAll('.chord-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('chord-name').textContent = chord;
      drawChord(chord);
      strumChord(CHORDS[chord]);
    });
    selector.appendChild(btn);
  });
  drawChord(activeChord);
}

function initProgressionsTab() {
  const list = document.getElementById('progression-list');
  list.innerHTML = '';
  PROGRESSIONS.forEach((prog, idx) => {
    const card = document.createElement('div');
    card.className = `prog-card ${idx === selectedProgressionIndex ? 'active' : ''}`;
    card.innerHTML = `
      <div class="prog-header">
        <span>${prog.name}</span>
      </div>
      <div class="prog-desc">${prog.desc}</div>
      <div class="prog-chords">
        ${prog.chords.map(c => `<span class="prog-chord-badge">${c}</span>`).join('')}
      </div>
    `;
    card.addEventListener('click', () => {
      stopProgression();
      selectedProgressionIndex = idx;
      document.querySelectorAll('.prog-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
    list.appendChild(card);
  });
}

function playProgression() {
  if (isPlayingProgression) {
    stopProgression();
    return;
  }

  initAudio();
  isPlayingProgression = true;
  document.getElementById('btn-play-prog').textContent = 'Arrêter ⏹️';

  const prog = PROGRESSIONS[selectedProgressionIndex];
  const tempo = parseInt(document.getElementById('tempo').value);
  const intervalMs = (60 / tempo) * 2000;

  activeProgChordIdx = 0;
  const cards = document.querySelectorAll('.prog-card');
  const activeCard = cards[selectedProgressionIndex];
  const badges = activeCard.querySelectorAll('.prog-chord-badge');

  function tick() {
    if (!isPlayingProgression) return;
    const chordName = prog.chords[activeProgChordIdx];
    strumChord(CHORDS[chordName]);

    badges.forEach((badge, idx) => {
      if (idx === activeProgChordIdx) {
        badge.classList.add('playing');
      } else {
        badge.classList.remove('playing');
      }
    });

    activeProgChordIdx = (activeProgChordIdx + 1) % prog.chords.length;
    progressionInterval = setTimeout(tick, intervalMs);
  }

  tick();
}

function stopProgression() {
  isPlayingProgression = false;
  clearTimeout(progressionInterval);
  document.getElementById('btn-play-prog').textContent = 'Jouer la Suite ▶️';
  document.querySelectorAll('.prog-chord-badge').forEach(b => b.classList.remove('playing'));
}

// Tuner logic
const tunerKeys = document.querySelectorAll('.tuner-key');
tunerKeys.forEach(key => {
  key.addEventListener('click', () => {
    const note = key.getAttribute('data-note');
    const freqs = { 'G': 392.00, 'C': 261.63, 'E': 329.63, 'A': 440.00 };
    
    tunerKeys.forEach(k => k.classList.remove('playing'));
    key.classList.add('playing');
    
    playPluck(freqs[note], audioCtx ? audioCtx.currentTime : 0, 1.5);

    const bars = document.querySelectorAll('.wave-bar');
    bars.forEach((bar, idx) => {
      bar.style.height = '30px';
      setTimeout(() => {
        bar.style.height = '4px';
      }, 800 + (idx * 100));
    });

    setTimeout(() => {
      key.classList.remove('playing');
    }, 1500);
  });
});

// Tab Navigation
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const tabId = item.getAttribute('data-tab');
    navItems.forEach(nav => nav.classList.remove('active'));
    tabContents.forEach(tab => tab.classList.remove('active'));

    item.classList.add('active');
    document.getElementById(`tab-${tabId}`).classList.add('active');

    if (tabId !== 'progressions') {
      stopProgression();
    }
  });
});

// Tempo slider
const tempoSlider = document.getElementById('tempo');
tempoSlider.addEventListener('input', (e) => {
  document.getElementById('tempo-val').textContent = `${e.target.value} BPM`;
  if (isPlayingProgression) {
    stopProgression();
    playProgression();
  }
});

// Play single chord button
document.getElementById('btn-play-chord').addEventListener('click', () => {
  strumChord(CHORDS[activeChord]);
});

// Play progression button
document.getElementById('btn-play-prog').addEventListener('click', playProgression);

// Theme Toggle
const btnTheme = document.getElementById('btn-theme');
btnTheme.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

if (localStorage.getItem('theme') === 'light') {
  document.body.classList.remove('dark-theme');
}

// PWA Install Button
let deferredPrompt;
const btnInstall = document.getElementById('btn-install');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  btnInstall.style.display = 'flex';
});

btnInstall.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      btnInstall.style.display = 'none';
    }
    deferredPrompt = null;
  }
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW registration failed:', err));
  });
}

// Init
initChordsTab();
initProgressionsTab();