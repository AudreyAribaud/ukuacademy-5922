// UkuAcademy - Application Logic

// Audio Context & Synthesizer Setup
let audioCtx = null;
let micStream = null;
let analyser = null;
let sourceNode = null;
let isMicTuning = false;
let animationFrameId = null;

// Ukulele Standard Tuning Target Frequencies
const UKE_STRINGS = [
  { note: 'G', freq: 392.00, label: 'Sol (Corde 4)' },
  { note: 'C', freq: 261.63, label: 'Do (Corde 3)' },
  { note: 'E', freq: 329.63, label: 'Mi (Corde 2)' },
  { note: 'A', freq: 440.00, label: 'La (Corde 1)' }
];

// Chord Dictionary Data
const CHORDS = {
  'C': { name: 'Do Majeur', frets: [0, 0, 0, 3], midi: [67, 60, 64, 72] },
  'G': { name: 'Sol Majeur', frets: [0, 2, 3, 2], midi: [67, 62, 67, 71] },
  'Am': { name: 'La Mineur', frets: [2, 0, 0, 0], midi: [69, 60, 64, 69] },
  'F': { name: 'Fa Majeur', frets: [2, 0, 1, 0], midi: [69, 60, 65, 69] },
  'Dm': { name: 'Ré Mineur', frets: [2, 2, 1, 0], midi: [69, 62, 65, 69] },
  'G7': { name: 'Sol Septième', frets: [0, 2, 1, 2], midi: [67, 62, 65, 71] },
  'C7': { name: 'Do Septième', frets: [0, 0, 0, 1], midi: [67, 60, 64, 70] },
  'Em': { name: 'Mi Mineur', frets: [0, 4, 3, 2], midi: [67, 64, 67, 71] }
};

// Chord Progressions Data
const PROGRESSIONS = [
  {
    title: "L'Incontournable Pop",
    description: "La suite d'accords la plus célèbre au monde. Joyeuse, entraînante et parfaite pour débuter.",
    chords: ['C', 'G', 'Am', 'F'],
    difficulty: "Facile",
    tempo: 100
  },
  {
    title: "La Ballade Douce (50s)",
    description: "Une ambiance rétro et nostalgique, idéale pour chanter des mélodies romantiques.",
    chords: ['C', 'Am', 'F', 'G'],
    difficulty: "Facile",
    tempo: 90
  },
  {
    title: "L'Ambiance Épique",
    description: "Une progression mineure puissante qui apporte de l'émotion et de la profondeur à votre jeu.",
    chords: ['Am', 'F', 'C', 'G'],
    difficulty: "Intermédiaire",
    tempo: 110
  },
  {
    title: "Le Reggae Chill",
    description: "Sentez la brise des îles avec ce rythme ensoleillé et décontracté.",
    chords: ['C', 'F', 'G', 'F'],
    difficulty: "Facile",
    tempo: 85
  },
  {
    title: "Le Folk Mélancolique",
    description: "Un enchaînement doux et introspectif qui met en valeur la résonance du ukulélé.",
    chords: ['Em', 'C', 'G', 'D7'],
    difficulty: "Avancé",
    // Custom chord definition inline for D7 if needed, but we can map it
    customChords: {
      'D7': { name: 'Ré Septième', frets: [2, 0, 2, 0], midi: [69, 60, 66, 69] }
    }
  }
];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  renderChordDictionary();
  renderProgressions();
  setupMicTuner();
  registerServiceWorker();
});

// Navigation Logic
function switchView(viewId) {
  document.querySelectorAll('.view-section').forEach(section => {
    section.classList.add('hidden');
  });
  document.getElementById(`view-${viewId}`).classList.remove('hidden');

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.classList.add('text-slate-400');
  });
  document.getElementById(`nav-${viewId}`).classList.add('active');
  document.getElementById(`nav-${viewId}`).classList.remove('text-slate-400');

  // Stop mic if leaving tuner view
  if (viewId !== 'tuner' && isMicTuning) {
    stopMicTuning();
  }
}

function initNavigation() {
  // Set initial active nav
  document.getElementById('nav-tuner').classList.add('active');
}

// Audio Context Lazy Initializer
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Play Reference Note (Tuner)
function playReferenceNote(noteName, frequency) {
  const ctx = getAudioContext();
  
  // Visual feedback on button
  const buttons = document.querySelectorAll('.ref-note-btn');
  buttons.forEach(btn => {
    if (btn.querySelector('span').innerText === noteName) {
      btn.classList.add('bg-orange-100', 'border-orange-300');
      setTimeout(() => btn.classList.remove('bg-orange-100', 'border-orange-300'), 500);
    }
  });

  // Synthesize Ukulele Pluck
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  
  // Envelope
  gainNode.gain.setValueAtTime(0.8, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
  
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  osc.start();
  osc.stop(ctx.currentTime + 1.5);
}

// Microphone Tuner Logic
function setupMicTuner() {
  const btnMic = document.getElementById('btn-mic-toggle');
  btnMic.addEventListener('click', async () => {
    if (isMicTuning) {
      stopMicTuning();
    } else {
      await startMicTuning();
    }
  });
}

async function startMicTuning() {
  const btnMic = document.getElementById('btn-mic-toggle');
  try {
    const ctx = getAudioContext();
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    
    analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    
    sourceNode = ctx.createMediaStreamSource(micStream);
    sourceNode.connect(analyser);
    
    isMicTuning = true;
    btnMic.classList.add('mic-active');
    btnMic.querySelector('span').innerText = "Désactiver le micro";
    btnMic.querySelector('i').classList.remove('animate-pulse');
    
    updateTunerLoop();
  } catch (err) {
    console.error("Accès micro refusé ou non supporté:", err);
    alert("Impossible d'accéder au micro. Veuillez autoriser l'accès pour utiliser l'accordeur.");
  }
}

function stopMicTuning() {
  const btnMic = document.getElementById('btn-mic-toggle');
  isMicTuning = false;
  if (micStream) {
    micStream.getTracks().forEach(track => track.stop());
  }
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  btnMic.classList.remove('mic-active');
  btnMic.querySelector('span').innerText = "Activer l'accordage micro";
  
  // Reset UI
  document.getElementById('tuner-needle').style.transform = 'translateY(-50%) rotate(0deg)';
  document.getElementById('detected-note').innerText = '--';
  document.getElementById('detected-freq').innerText = '0.0 Hz';
  document.getElementById('tuning-hint').innerText = 'Activez le micro';
  document.getElementById('tune-glow').style.opacity = '0';
}

function updateTunerLoop() {
  if (!isMicTuning) return;
  
  const bufferLength = analyser.fftSize;
  const buffer = new Float32Array(bufferLength);
  analyser.getFloatTimeDomainData(buffer);
  
  const sampleRate = audioCtx.sampleRate;
  const frequency = autoCorrelate(buffer, sampleRate);
  
  if (frequency !== -1 && frequency > 150 && frequency < 600) {
    // Find closest ukulele string
    let closestString = UKE_STRINGS[0];
    let minDiff = Math.abs(frequency - UKE_STRINGS[0].freq);
    
    for (let i = 1; i < UKE_STRINGS.length; i++) {
      const diff = Math.abs(frequency - UKE_STRINGS[i].freq);
      if (diff < minDiff) {
        minDiff = diff;
        closestString = UKE_STRINGS[i];
      }
    }
    
    // Calculate deviation in cents
    // cents = 1200 * log2(f2 / f1)
    const cents = 1200 * Math.log2(frequency / closestString.freq);
    
    // Update UI
    document.getElementById('detected-note').innerText = closestString.note;
    document.getElementById('detected-freq').innerText = `${frequency.toFixed(1)} Hz`;
    
    // Rotate needle (-45deg to +45deg based on -50 to +50 cents)
    const angle = Math.max(-45, Math.min(45, cents));
    document.getElementById('tuner-needle').style.transform = `translateY(-50%) rotate(${angle}deg)`;
    
    // Tuning helper text
    const hintEl = document.getElementById('tuning-hint');
    const glowEl = document.getElementById('tune-glow');
    
    if (Math.abs(cents) < 3) {
      hintEl.innerText = "Parfait !";
      hintEl.className = "text-sm font-bold text-emerald-500 mt-2";
      glowEl.style.opacity = '1';
    } else if (cents < 0) {
      hintEl.innerText = "Trop bas (tendez la corde)";
      hintEl.className = "text-sm font-semibold text-amber-500 mt-2";
      glowEl.style.opacity = '0';
    } else {
      hintEl.innerText = "Trop haut (détendez la corde)";
      hintEl.className = "text-sm font-semibold text-amber-500 mt-2";
      glowEl.style.opacity = '0';
    }
  }
  
  animationFrameId = requestAnimationFrame(updateTunerLoop);
}

// Autocorrelation Pitch Detection Algorithm
function autoCorrelate(buffer, sampleRate) {
  const SIZE = buffer.length;
  let rms = 0;
  
  for (let i = 0; i < SIZE; i++) {
    const val = buffer[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return -1; // Not enough signal
  
  let r1 = 0, r2 = SIZE - 1, thres = 0.2;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) < thres) { r1 = i; break; }
  }
  for (let i = SIZE - 1; i >= SIZE / 2; i--) {
    if (Math.abs(buffer[i]) < thres) { r2 = i; break; }
  }
  
  const slicedBuffer = buffer.slice(r1, r2);
  const slicedSize = slicedBuffer.length;
  
  const c = new Float32Array(slicedSize);
  for (let i = 0; i < slicedSize; i++) {
    for (let j = 0; j < slicedSize - i; j++) {
      c[i] = c[i] + slicedBuffer[j] * slicedBuffer[j + i];
    }
  }
  
  let d = 0;
  while (c[d] > c[d + 1]) d++;
  
  let maxval = -1, maxpos = -1;
  for (let i = d; i < slicedSize; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  
  let T0 = maxpos;
  const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);
  
  return sampleRate / T0;
}

// Render Chord SVG Diagram
function generateChordSVG(frets) {
  const width = 80;
  const height = 100;
  const stringsCount = 4;
  const fretsCount = 4;
  
  let svg = `<svg class="chord-svg mx-auto" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  
  // Draw Fretboard Grid
  // Strings (vertical lines)
  for (let i = 0; i < stringsCount; i++) {
    const x = 10 + i * 20;
    svg += `<line x1="${x}" y1="20" x2="${x}" y2="90" stroke="#cbd5e1" stroke-width="1.5"/>`;
  }
  
  // Frets (horizontal lines)
  for (let i = 0; i <= fretsCount; i++) {
    const y = 20 + i * 17.5;
    const widthStr = i === 0 ? "3" : "1";
    const colorStr = i === 0 ? "#0f4c5c" : "#cbd5e1";
    svg += `<line x1="10" y1="${y}" x2="70" y2="${y}" stroke="${colorStr}" stroke-width="${widthStr}"/>`;
  }
  
  // Draw Dots for Fretted Notes
  frets.forEach((fret, stringIdx) => {
    const x = 10 + stringIdx * 20;
    if (fret === 0) {
      // Open string circle at top
      svg += `<circle cx="${x}" cy="12" r="3" fill="none" stroke="#0f4c5c" stroke-width="1.5"/>`;
    } else if (fret > 0) {
      // Fretted note dot
      const y = 20 + (fret - 0.5) * 17.5;
      svg += `<circle cx="${x}" cy="${y}" r="5" fill="#e36414"/>`;
    }
  });
  
  svg += `</svg>`;
  return svg;
}

// Render Chord Dictionary
function renderChordDictionary() {
  const grid = document.getElementById('chord-dictionary-grid');
  grid.innerHTML = '';
  
  Object.keys(CHORDS).forEach(chordKey => {
    const chord = CHORDS[chordKey];
    const card = document.createElement('div');
    card.className = "bg-slate-50 hover:bg-orange-50/30 border border-slate-100 hover:border-orange-200 rounded-2xl p-4 text-center cursor-pointer transition-all transform hover:-translate-y-1 active:scale-95";
    card.onclick = () => playChord(chord.midi);
    
    card.innerHTML = `
      <h3 class="font-bold text-lg text-[#0f4c5c] mb-2">${chordKey}</h3>
      <div class="mb-3">${generateChordSVG(chord.frets)}</div>
      <p class="text-xs text-slate-400">${chord.name}</p>
    `;
    grid.appendChild(card);
  });
}

// Play Chord (Strumming Effect)
function playChord(midiNotes, delayOffset = 0) {
  const ctx = getAudioContext();
  const now = ctx.currentTime + delayOffset;
  
  midiNotes.forEach((midi, index) => {
    const freq = Math.pow(2, (midi - 69) / 12) * 440;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + index * 0.03); // Strum delay
    
    gainNode.gain.setValueAtTime(0.4, now + index * 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + index * 0.03 + 1.2);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now + index * 0.03);
    osc.stop(now + index * 0.03 + 1.2);
  });
}

// Render Chord Progressions
function renderProgressions() {
  const container = document.getElementById('progressions-container');
  container.innerHTML = '';
  
  PROGRESSIONS.forEach((prog, idx) => {
    const card = document.createElement('div');
    card.className = "bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-orange-100 transition-all";
    
    // Generate Chord Diagrams HTML for this progression
    let diagramsHTML = '';
    prog.chords.forEach(chordKey => {
      const chord = CHORDS[chordKey] || (prog.customChords && prog.customChords[chordKey]);
      if (chord) {
        diagramsHTML += `
          <div class="text-center bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
            <span class="font-bold text-sm text-[#0f4c5c] block mb-1">${chordKey}</span>
            ${generateChordSVG(chord.frets)}
          </div>
        `;
      }
    });
    
    card.innerHTML = `
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-[#e36414]">${prog.difficulty}</span>
            <span class="text-xs text-slate-400"><i class="fa-solid fa-gauge-high mr-1"></i> ${prog.tempo || 90} BPM</span>
          </div>
          <h3 class="font-bold text-lg text-[#0f4c5c]">${prog.title}</h3>
          <p class="text-sm text-slate-500 mt-1">${prog.description}</p>
        </div>
        <button onclick="playProgression(${idx})" class="flex items-center justify-center gap-2 bg-[#0f4c5c] hover:bg-[#156174] text-white px-5 py-3 rounded-xl font-bold transition-all active:scale-95 self-start md:self-center">
          <i class="fa-solid fa-play"></i> Écouter la suite
        </button>
      </div>
      <div class="grid grid-cols-4 gap-2 max-w-md">
        ${diagramsHTML}
      </div>
    `;
    container.appendChild(card);
  });
}

// Play Full Chord Progression
function playProgression(progIdx) {
  const prog = PROGRESSIONS[progIdx];
  const beatDuration = 1.5; // seconds per chord
  
  prog.chords.forEach((chordKey, index) => {
    const chord = CHORDS[chordKey] || (prog.customChords && prog.customChords[chordKey]);
    if (chord) {
      playChord(chord.midi, index * beatDuration);
    }
  });
}

// Register Service Worker for PWA Offline Support
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('Service Worker enregistré avec succès !', reg.scope))
        .catch(err => console.warn('Échec de l\'enregistrement du Service Worker:', err));
    });
  }
}