// --- Audio Engine (Web Audio API) ---
const AudioEngine = {
  ctx: null,
  activeOscillators: [],

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  playTone(freq, startTime, duration, volume = 0.3, type = 'triangle') {
    this.init();
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gainNode.gain.setValueAtTime(volume, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);

    this.activeOscillators.push(osc);
    setTimeout(() => {
      const index = this.activeOscillators.indexOf(osc);
      if (index > -1) this.activeOscillators.splice(index, 1);
    }, duration * 1000 + 100);
  },

  playUkuleleChord(frets, duration = 1.5) {
    this.init();
    // Standard Ukulele Tuning: G4 (392Hz), C4 (261.63Hz), E4 (329.63Hz), A4 (440Hz)
    const baseFreqs = [392.00, 261.63, 329.63, 440.00];
    const now = this.ctx.currentTime;

    frets.forEach((fret, stringIndex) => {
      if (fret !== 'x' && fret !== 'X') {
        // Frequency formula: f = base * 2^(fret/12)
        const freq = baseFreqs[stringIndex] * Math.pow(2, fret / 12);
        // Strumming effect: slight delay between strings
        const delay = stringIndex * 0.06;
        this.playTone(freq, now + delay, duration - delay, 0.25, 'triangle');
      }
    });
  },

  stopAll() {
    this.activeOscillators.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    this.activeOscillators = [];
  }
};

// --- Chord Database ---
const ChordsDB = {
  'C': [0, 0, 0, 3],
  'G': [0, 2, 3, 2],
  'Am': [2, 0, 0, 0],
  'F': [2, 0, 1, 0],
  'Dm': [2, 2, 1, 0],
  'Em': [0, 4, 3, 2],
  'A': [2, 1, 0, 0],
  'D': [2, 2, 2, 0],
  'E7': [1, 2, 0, 2],
  'G7': [0, 2, 1, 2],
  'C7': [0, 0, 0, 1],
  'A7': [1, 0, 0, 0],
  'B7': [2, 3, 2, 2],
  'Bm': [4, 2, 2, 2],
  'Cm': [0, 3, 3, 3],
  'Fm': [1, 0, 1, 3],
  'E': [4, 4, 4, 2],
  'Bb': [3, 2, 1, 1],
  'Gm': [0, 2, 3, 1],
  'D7': [2, 0, 2, 0]
};

// --- 50 Chord Progressions Dataset ---
const Progressions = [
  { title: "Pop Classique", chords: ["C", "G", "Am", "F"], genre: "pop" },
  { title: "Optimiste", chords: ["C", "F", "Am", "G"], genre: "happy" },
  { title: "Mélancolie Pop", chords: ["Am", "F", "C", "G"], genre: "sad" },
  { title: "Folk Doux", chords: ["C", "Am", "F", "G"], genre: "folk" },
  { title: "Jazz Turnaround", chords: ["C", "Am", "Dm", "G7"], genre: "jazz" },
  { title: "Blues Standard", chords: ["C", "C7", "F", "G7"], genre: "jazz" },
  { title: "Ballade Triste", chords: ["Am", "Dm", "G", "C"], genre: "sad" },
  { title: "Soleil Couchant", chords: ["F", "G", "Em", "Am"], genre: "happy" },
  { title: "Feu de Camp", chords: ["G", "D", "Em", "C"], genre: "folk" },
  { title: "Reggae Vibes", chords: ["Am", "G", "Am", "G"], genre: "happy" },
  { title: "Nostalgie 50s", chords: ["C", "Am", "Dm", "G"], genre: "folk" },
  { title: "Pop Épique", chords: ["Am", "G", "F", "E7"], genre: "pop" },
  { title: "Voyage Acoustique", chords: ["C", "Em", "Am", "F"], genre: "folk" },
  { title: "Jazz Doux", chords: ["C7", "F", "G7", "C"], genre: "jazz" },
  { title: "Espoir", chords: ["F", "C", "G", "Am"], genre: "happy" },
  { title: "Sombre & Beau", chords: ["Am", "Em", "F", "C"], genre: "sad" },
  { title: "Le Départ", chords: ["Dm", "Am", "C", "G"], genre: "sad" },
  { title: "Plage Tropicale", chords: ["C", "F", "G7", "C"], genre: "happy" },
  { title: "Rêverie", chords: ["F", "Fm", "C", "C7"], genre: "sad" },
  { title: "Salsa Simple", chords: ["Am", "Dm", "E7", "Am"], genre: "jazz" },
  { title: "Pop Moderne", chords: ["Dm", "Bb", "F", "C"], genre: "pop" },
  { title: "Folk Énergique", chords: ["G", "C", "D", "G"], genre: "folk" },
  { title: "Tristesse Infinie", chords: ["Am", "Dm", "F", "E7"], genre: "sad" },
  { title: "Route 66", chords: ["A", "D", "E7", "A"], genre: "jazz" },
  { title: "Balade d'Automne", chords: ["Am", "G", "F", "C"], genre: "folk" },
  { title: "Sourire Matinal", chords: ["C", "F", "C", "G"], genre: "happy" },
  { title: "Nuit Étoilée", chords: ["C", "Em", "F", "G"], genre: "happy" },
  { title: "Le Phare", chords: ["Am", "Em", "Dm", "Am"], genre: "sad" },
  { title: "Pop Latino", chords: ["Am", "F", "G", "Am"], genre: "pop" },
  { title: "Feu de Joie", chords: ["D", "A", "Bm", "G"], genre: "happy" },
  { title: "Mélancolie Urbaine", chords: ["Bm", "G", "D", "A"], genre: "sad" },
  { title: "Jazz Club", chords: ["Dm", "G7", "C7", "F"], genre: "jazz" },
  { title: "Ballade Country", chords: ["G", "C", "G", "D7"], genre: "folk" },
  { title: "L'Inconnu", chords: ["Em", "C", "G", "D"], genre: "pop" },
  { title: "Douce Brise", chords: ["F", "G", "C", "Am"], genre: "happy" },
  { title: "Vieux Souvenirs", chords: ["C", "G7", "Am", "Fm"], genre: "sad" },
  { title: "Ska Rythmé", chords: ["C", "F", "G", "F"], genre: "happy" },
  { title: "Légende Folk", chords: ["Am", "G", "Am", "F"], genre: "folk" },
  { title: "Pop Lumineuse", chords: ["C", "D", "G", "Em"], genre: "pop" },
  { title: "Triste Réalité", chords: ["Dm", "Gm", "A7", "Dm"], genre: "sad" },
  { title: "Jazz d'Automne", chords: ["Gm", "C7", "F", "Dm"], genre: "jazz" },
  { title: "Balade Romantique", chords: ["C", "Am", "Dm", "F"], genre: "happy" },
  { title: "Horizon Lointain", chords: ["G", "Em", "C", "D"], genre: "folk" },
  { title: "Nostalgie Pop", chords: ["F", "C", "Dm", "Bb"], genre: "pop" },
  { title: "Blues de Minuit", chords: ["A7", "D7", "A7", "E7"], genre: "jazz" },
  { title: "Le Matin", chords: ["C", "Em", "F", "C"], genre: "happy" },
  { title: "Triste Romance", chords: ["Am", "E7", "Am", "Dm"], genre: "sad" },
  { title: "L'Aventure", chords: ["D", "G", "A", "D"], genre: "folk" },
  { title: "Pop Vintage", chords: ["C", "Bb", "F", "C"], genre: "pop" },
  { title: "Dernier Souffle", chords: ["Am", "Fm", "C", "G"], genre: "sad" }
];

// --- Rhythm Patterns ---
const Rhythms = [
  { arrows: "⬇️ ⬇️⬆️ ⬆️⬇️⬆️", desc: "Feu de Camp : Bas, Bas-Haut, Haut-Bas-Haut. Très polyvalent.", pattern: [1, 0, 1, 0.5, 0, 0.5, 1, 0.5, 1, 0.5] },
  { arrows: "⬇️ ⬇️⬆️ ⬇️ ⬇️⬆️", desc: "Pop Standard : Idéal pour les morceaux rythmés.", pattern: [1, 0, 1, 0.5, 1, 0, 1, 0.5] },
  { arrows: "❌ ⬇️ ❌ ⬇️", desc: "Reggae : Jouez uniquement sur le contretemps (le 'et').", pattern: [0, 1, 0, 1] },
  { arrows: "🎵 🎵 🎵 🎵", desc: "Arpège Doux : Égrenez chaque corde l'une après l'autre.", pattern: [0.25, 0.25, 0.25, 0.25] }
];

// --- SVG Chord Generator ---
function generateChordSVG(frets) {
  const width = 140;
  const height = 170;
  const stringsCount = 4;
  const fretsCount = 5;

  // Layout coordinates
  const xStart = 25;
  const xSpacing = 30;
  const yStart = 30;
  const ySpacing = 28;

  let svg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;

  // Draw Fretboard background
  svg += `<rect x="${xStart}" y="${yStart}" width="${(stringsCount - 1) * xSpacing}" height="${fretsCount * ySpacing}" fill="none" stroke="var(--text-color)" stroke-width="2"/>`;

  // Draw Frets (horizontal lines)
  for (let i = 1; i < fretsCount; i++) {
    const y = yStart + i * ySpacing;
    svg += `<line x1="${xStart}" y1="${y}" x2="${xStart + (stringsCount - 1) * xSpacing}" y2="${y}" stroke="var(--border-color)" stroke-width="2"/>`;
  }

  // Draw Strings (vertical lines)
  for (let i = 1; i < stringsCount - 1; i++) {
    const x = xStart + i * xSpacing;
    svg += `<line x1="${x}" y1="${yStart}" x2="${x}" y2="${yStart + fretsCount * ySpacing}" stroke="var(--border-color)" stroke-width="1.5"/>`;
  }

  // Nut (thick top line)
  svg += `<line x1="${xStart - 1}" y1="${yStart}" x2="${xStart + (stringsCount - 1) * xSpacing + 1}" y2="${yStart}" stroke="var(--text-color)" stroke-width="6" stroke-linecap="round"/>`;

  // Draw Dots / Fingering
  frets.forEach((fret, stringIndex) => {
    const x = xStart + stringIndex * xSpacing;
    if (fret === 0) {
      // Open string circle above nut
      svg += `<circle cx="${x}" cy="${yStart - 10}" r="5" fill="none" stroke="var(--accent-color)" stroke-width="2"/>`;
    } else if (fret === 'x' || fret === 'X') {
      // Muted string cross
      svg += `<path d="M${x-4} ${yStart-14} L${x+4} ${yStart-6} M${x+4} ${yStart-14} L${x-4} ${yStart-6}" stroke="var(--danger-color)" stroke-width="2"/>`;
    } else if (fret > 0) {
      // Pressed fret dot
      const y = yStart + (fret - 0.5) * ySpacing;
      svg += `<circle cx="${x}" cy="${y}" r="8" fill="var(--primary-color)"/>`;
      // Fret number helper inside dot
      svg += `<text x="${x}" y="${y + 4}" font-size="10" font-weight="bold" fill="white" text-anchor="middle">${fret}</text>`;
    }
  });

  // String labels at the bottom
  const labels = ['G', 'C', 'E', 'A'];
  labels.forEach((label, i) => {
    const x = xStart + i * xSpacing;
    svg += `<text x="${x}" y="${yStart + fretsCount * ySpacing + 18}" font-size="11" font-weight="bold" fill="var(--text-muted)" text-anchor="middle">${label}</text>`;
  });

  svg += `</svg>`;
  return svg;
}

// --- App State & Controller ---
const App = {
  currentChord: 'C',
  currentGenre: 'all',
  currentRhythmIndex: 0,
  isMetronomePlaying: false,
  metronomeInterval: null,
  bpm: 120,
  beats: 4,
  currentBeat: 0,
  tunerInterval: null,

  init() {
    this.renderProgressions();
    this.selectChord('C');
    this.setupEventListeners();
    this.setupPWA();
  },

  selectChord(chordName) {
    this.currentChord = chordName;
    document.getElementById('current-chord-name').innerText = `Accord : ${chordName}`;
    const frets = ChordsDB[chordName] || [0, 0, 0, 0];
    document.getElementById('chord-svg-container').innerHTML = generateChordSVG(frets);
  },

  playCurrentChord() {
    const frets = ChordsDB[this.currentChord];
    if (frets) {
      AudioEngine.playUkuleleChord(frets);
    }
  },

  renderProgressions() {
    const container = document.getElementById('progressions-container');
    container.innerHTML = '';

    const filtered = Progressions.filter(p => this.currentGenre === 'all' || p.genre === this.currentGenre);

    filtered.forEach((prog, index) => {
      const item = document.createElement('div');
      item.className = 'progression-item';
      item.innerHTML = `
        <div class="prog-meta">
          <span class="prog-title">${prog.title}</span>
          <span>${prog.genre.toUpperCase()}</span>
        </div>
        <div class="prog-chords">
          ${prog.chords.map(c => `<span class="chord-badge" data-chord="${c}">${c}</span>`).join('')}
        </div>
      `;

      // Click on progression plays the first chord and displays it
      item.addEventListener('click', (e) => {
        // If clicked on a specific chord badge
        if (e.target.classList.contains('chord-badge')) {
          const chord = e.target.getAttribute('data-chord');
          this.selectChord(chord);
          this.playCurrentChord();
        } else {
          // Clicked on item: select first chord
          const firstChord = prog.chords[0];
          this.selectChord(firstChord);
          this.playCurrentChord();
        }
        
        document.querySelectorAll('.progression-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
      });

      container.appendChild(item);
    });
  },

  // --- Metronome Logic ---
  toggleMetronome() {
    if (this.isMetronomePlaying) {
      this.stopMetronome();
    } else {
      this.startMetronome();
    }
  },

  startMetronome() {
    AudioEngine.init();
    this.isMetronomePlaying = true;
    document.getElementById('metro-toggle-btn').innerText = 'ARRÊTER';
    document.getElementById('metro-toggle-btn').classList.add('btn-danger');

    const intervalMs = (60 / this.bpm) * 1000;
    this.currentBeat = 0;
    this.playBeat();

    this.metronomeInterval = setInterval(() => {
      this.currentBeat = (this.currentBeat + 1) % this.beats;
      this.playBeat();
    }, intervalMs);
  },

  stopMetronome() {
    this.isMetronomePlaying = false;
    document.getElementById('metro-toggle-btn').innerText = 'DÉMARRER';
    document.getElementById('metro-toggle-btn').classList.remove('btn-danger');
    clearInterval(this.metronomeInterval);
    this.resetBeatIndicators();
  },

  playBeat() {
    const now = AudioEngine.ctx.currentTime;
    const isFirstBeat = this.currentBeat === 0;
    const freq = isFirstBeat ? 1000 : 600;
    
    // Play metronome click
    AudioEngine.playTone(freq, now, 0.05, 0.4, 'sine');

    // Update visual indicators
    const dots = document.querySelectorAll('.beat-dot');
    dots.forEach((dot, idx) => {
      dot.classList.remove('active', 'accent');
      if (idx === this.currentBeat) {
        dot.classList.add('active');
        if (isFirstBeat) dot.classList.add('accent');
      }
    });
  },

  resetBeatIndicators() {
    const dots = document.querySelectorAll('.beat-dot');
    dots.forEach(dot => dot.classList.remove('active', 'accent'));
  },

  updateBeatDots() {
    const container = document.getElementById('beat-indicators');
    container.innerHTML = '';
    for (let i = 0; i < this.beats; i++) {
      const dot = document.createElement('div');
      dot.className = 'beat-dot';
      container.appendChild(dot);
    }
  },

  // --- Tuner Logic ---
  playTunerNote(note) {
    AudioEngine.stopAll();
    AudioEngine.init();
    
    const freqs = {
      'G': 392.00,
      'C': 261.63,
      'E': 329.63,
      'A': 440.00
    };

    const freq = freqs[note];
    if (freq) {
      // Play continuous tone
      const now = AudioEngine.ctx.currentTime;
      AudioEngine.playTone(freq, now, 3.0, 0.3, 'sine');

      // Visual feedback
      document.querySelectorAll('.peg-btn').forEach(btn => btn.classList.remove('playing'));
      document.querySelectorAll('.string-line').forEach(line => line.classList.remove('vibrating'));

      const activeBtn = document.querySelector(`.peg-btn[data-note="${note}"]`);
      if (activeBtn) activeBtn.classList.add('playing');

      const activeLine = document.getElementById(`string-${note.toLowerCase()}`);
      if (activeLine) activeLine.classList.add('vibrating');

      document.getElementById('stop-tuner-btn').classList.remove('hidden');

      // Auto stop vibration after 3s
      clearTimeout(this.tunerInterval);
      this.tunerInterval = setTimeout(() => {
        activeLine.classList.remove('vibrating');
        activeBtn.classList.remove('playing');
        document.getElementById('stop-tuner-btn').classList.add('hidden');
      }, 3000);
    }
  },

  stopTuner() {
    AudioEngine.stopAll();
    document.querySelectorAll('.peg-btn').forEach(btn => btn.classList.remove('playing'));
    document.querySelectorAll('.string-line').forEach(line => line.classList.remove('vibrating'));
    document.getElementById('stop-tuner-btn').classList.add('hidden');
  },

  // --- Event Listeners ---
  setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));

        item.classList.add('active');
        const target = item.getAttribute('data-target');
        document.getElementById(target).classList.add('active');

        // Stop metronome and tuner when leaving sections
        this.stopMetronome();
        this.stopTuner();
      });
    });

    // Play Chord Button
    document.getElementById('play-chord-btn').addEventListener('click', () => {
      this.playCurrentChord();
    });

    // Genre Filter
    document.getElementById('genre-filter').addEventListener('change', (e) => {
      this.currentGenre = e.target.value;
      this.renderProgressions();
    });

    // Rhythm Tabs
    document.querySelectorAll('.rhythm-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.rhythm-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentRhythmIndex = parseInt(tab.getAttribute('data-rhythm'));
        
        const rhythm = Rhythms[this.currentRhythmIndex];
        document.getElementById('rhythm-arrows-display').innerText = rhythm.arrows;
        document.getElementById('rhythm-desc').innerText = rhythm.desc;
      });
    });

    // Play Rhythm Button
    document.getElementById('play-rhythm-btn').addEventListener('click', () => {
      const rhythm = Rhythms[this.currentRhythmIndex];
      const frets = ChordsDB[this.currentChord];
      if (!frets) return;

      AudioEngine.init();
      const now = AudioEngine.ctx.currentTime;
      let timeOffset = 0;

      rhythm.pattern.forEach((stroke) => {
        if (stroke > 0) {
          setTimeout(() => {
            AudioEngine.playUkuleleChord(frets, 0.6);
          }, timeOffset * 1000);
        }
        timeOffset += 0.4; // spacing between strokes
      });
    });

    // Tuner Pegs
    document.querySelectorAll('.peg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const note = btn.getAttribute('data-note');
        this.playTunerNote(note);
      });
    });

    document.getElementById('stop-tuner-btn').addEventListener('click', () => {
      this.stopTuner();
    });

    // Metronome Controls
    const bpmSlider = document.getElementById('bpm-slider');
    const bpmValue = document.getElementById('bpm-value');

    bpmSlider.addEventListener('input', (e) => {
      this.bpm = parseInt(e.target.value);
      bpmValue.innerText = this.bpm;
      if (this.isMetronomePlaying) {
        this.stopMetronome();
        this.startMetronome();
      }
    });

    document.getElementById('tempo-minus').addEventListener('click', () => {
      if (this.bpm > 40) {
        this.bpm--;
        bpmSlider.value = this.bpm;
        bpmValue.innerText = this.bpm;
        if (this.isMetronomePlaying) {
          this.stopMetronome();
          this.startMetronome();
        }
      }
    });

    document.getElementById('tempo-plus').addEventListener('click', () => {
      if (this.bpm < 240) {
        this.bpm++;
        bpmSlider.value = this.bpm;
        bpmValue.innerText = this.bpm;
        if (this.isMetronomePlaying) {
          this.stopMetronome();
          this.startMetronome();
        }
      }
    });

    document.getElementById('metro-toggle-btn').addEventListener('click', () => {
      this.toggleMetronome();
    });

    document.querySelectorAll('input[name="time-sig"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.beats = parseInt(e.target.value);
        this.updateBeatDots();
        if (this.isMetronomePlaying) {
          this.stopMetronome();
          this.startMetronome();
        }
      });
    });

    // Theme Toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
    });
  },

  // --- PWA Installation ---
  setupPWA() {
    let deferredPrompt;
    const installBtn = document.getElementById('install-btn');

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
    });

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js')
        .then(() => console.log('Service Worker Registered'))
        .catch(err => console.error('Service Worker Registry Failed', err));
    }
  }
};

// Initialize App on Load
window.addEventListener('DOMContentLoaded', () => {
  App.init();
});
