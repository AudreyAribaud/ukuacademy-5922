// Web Audio API Context
let audioCtx = null;

// Ukulele String Frequencies (Standard G-C-E-A tuning)
const STRINGS = {
  G: 392.00, // G4
  C: 261.63, // C4
  E: 329.63, // E4
  A: 440.00  // A4
};

// Chord Library with Fret Positions [G, C, E, A] and Fingering Info
const CHORDS = {
  C: { frets: [0, 0, 0, 3], fingers: "Annulaire: Frette 3" },
  G: { frets: [0, 2, 3, 2], fingers: "Index: C2 | Majeur: A2 | Annulaire: E3" },
  Am: { frets: [2, 0, 0, 0], fingers: "Majeur: G2" },
  F: { frets: [2, 0, 1, 0], fingers: "Index: E1 | Majeur: G2" },
  D: { frets: [2, 2, 2, 0], fingers: "Index: G2 | Majeur: C2 | Annulaire: E2" },
  Em: { frets: [0, 4, 3, 2], fingers: "Index: A2 | Majeur: E3 | Annulaire: C4" },
  A: { frets: [2, 1, 0, 0], fingers: "Index: C1 | Majeur: G2" },
  Dm: { frets: [2, 2, 1, 0], fingers: "Index: E1 | Majeur: G2 | Annulaire: C2" },
  G7: { frets: [0, 2, 1, 2], fingers: "Index: E1 | Majeur: C2 | Annulaire: A2" },
  C7: { frets: [0, 0, 0, 1], fingers: "Index: A1" },
  E7: { frets: [1, 2, 0, 2], fingers: "Index: G1 | Majeur: C2 | Annulaire: A2" },
  Bb: { frets: [3, 2, 1, 1], fingers: "Barré Frette 1 | Majeur: E2 | Annulaire: G3" }
};

// Expanded Chord Progressions (Suites d'accords)
const PROGRESSIONS = [
  { name: "Pop Classique (I-V-vi-IV)", chords: ["C", "G", "Am", "F"] },
  { name: "Vibe Ensoleillée (Reggae)", chords: ["Am", "G", "F", "G"] },
  { name: "Nostalgie des Années 50", chords: ["C", "Am", "F", "G"] },
  { name: "Jazz Doux (Turnaround)", chords: ["C", "Am", "Dm", "G7"] },
  { name: "Mélancolie Acoustique", chords: ["Am", "F", "C", "G"] },
  { name: "Blues 12-Mesures (Intro)", chords: ["C7", "F", "C7", "G7"] },
  { name: "Ballade Folk", chords: ["G", "D", "Em", "C"] },
  { name: "Chaleur Latine", chords: ["Am", "Dm", "E7", "Am"] }
];

// Expanded Strumming Patterns (Rythmiques)
// 8-step patterns where 'D' = Down, 'U' = Up, null = Rest/Hold
const STRUMMING_PATTERNS = [
  { name: "Island Strum (D-DU-UDU)", pattern: ["D", null, "D", "U", null, "U", "D", "U"] },
  { name: "Feu de Camp Simple (D-D-D-D)", pattern: ["D", null, "D", null, "D", null, "D", null] },
  { name: "Pop Énergique (D-D-U-U-D-U)", pattern: ["D", null, "D", "U", null, "U", "D", "U"] },
  { name: "Reggae Offbeat (-U-U-U-U)", pattern: [null, "U", null, "U", null, "U", null, "U"] },
  { name: "Valse 3/4 (D-D-U)", pattern: ["D", null, "D", "U", "D", null, null, null] },
  { name: "Arpège Rapide (D-U-D-U-D-U-D-U)", pattern: ["D", "U", "D", "U", "D", "U", "D", "U"] }
];

// State Variables
let currentChord = "C";
let activeTab = "chords";
let isPlayingProgression = false;
let progressionInterval = null;
let currentProgressionIndex = 0;
let currentBeatIndex = 0;
let bpm = 100;

// Initialize Audio Context on user interaction
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Play a single string note with frequency and delay
function playString(freq, delay = 0, duration = 0.8) {
  initAudio();
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  // Ukulele-like timbre (combination of triangle and sine)
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
  
  // Envelope
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime + delay);
  gainNode.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + delay + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  osc.start(audioCtx.currentTime + delay);
  osc.stop(audioCtx.currentTime + delay + duration);
}

// Play a full chord with strumming simulation
function playChord(chordName, direction = "D", duration = 0.8) {
  const chord = CHORDS[chordName];
  if (!chord) return;

  const stringKeys = ["G", "C", "E", "A"];
  // Reverse order if strumming UP
  const orderedKeys = direction === "U" ? [...stringKeys].reverse() : stringKeys;
  
  orderedKeys.forEach((key, index) => {
    const fret = chord.frets[stringKeys.indexOf(key)];
    // Calculate frequency based on fret (each fret is a semitone)
    const baseFreq = STRINGS[key];
    const freq = baseFreq * Math.pow(2, fret / 12);
    
    // Slight delay between strings to simulate strumming
    const delay = index * 0.03;
    playString(freq, delay, duration);
  });
}

// Play Tuner Note
function playTunerNote(note) {
  initAudio();
  playString(STRINGS[note], 0, 1.5);
}

// Stop all audio (by closing context and recreating)
function stopAllAudio() {
  if (audioCtx) {
    audioCtx.close().then(() => {
      audioCtx = null;
    });
  }
}

// Draw Chord Diagram on SVG
function drawChordDiagram(chordName) {
  const chord = CHORDS[chordName];
  const svg = document.getElementById("fretboard");
  if (!svg || !chord) return;

  // Clear previous SVG contents
  svg.innerHTML = "";

  // Grid dimensions
  const width = 120;
  const height = 160;
  const topMargin = 25;
  const bottomMargin = 15;
  const leftMargin = 20;
  const rightMargin = 20;
  
  const fretCount = 4;
  const stringCount = 4;
  
  const fretSpacing = (height - topMargin - bottomMargin) / fretCount;
  const stringSpacing = (width - leftMargin - rightMargin) / (stringCount - 1);

  // Draw Nut (thick top line)
  const nut = document.createElementNS("http://www.w3.org/2000/svg", "line");
  nut.setAttribute("x1", leftMargin);
  nut.setAttribute("y1", topMargin);
  nut.setAttribute("x2", width - rightMargin);
  nut.setAttribute("y2", topMargin);
  nut.setAttribute("stroke", "#38bdf8");
  nut.setAttribute("stroke-width", "4");
  svg.appendChild(nut);

  // Draw Frets
  for (let i = 1; i <= fretCount; i++) {
    const y = topMargin + i * fretSpacing;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", leftMargin);
    line.setAttribute("y1", y);
    line.setAttribute("x2", width - rightMargin);
    line.setAttribute("y2", y);
    line.setAttribute("stroke", "#475569");
    line.setAttribute("stroke-width", "2");
    svg.appendChild(line);
  }

  // Draw Strings
  for (let i = 0; i < stringCount; i++) {
    const x = leftMargin + i * stringSpacing;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x);
    line.setAttribute("y1", topMargin);
    line.setAttribute("x2", x);
    line.setAttribute("y2", height - bottomMargin);
    line.setAttribute("stroke", "#94a3b8");
    line.setAttribute("stroke-width", "1.5");
    svg.appendChild(line);
  }

  // Draw Dots (Fingering)
  chord.frets.forEach((fret, stringIndex) => {
    const x = leftMargin + stringIndex * stringSpacing;
    if (fret > 0) {
      // Draw circle on the fret
      const y = topMargin + (fret - 0.5) * fretSpacing;
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", "8");
      circle.setAttribute("fill", "#0ea5e9");
      svg.appendChild(circle);

      // Add fret number text inside dot
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", x);
      text.setAttribute("y", y + 3);
      text.setAttribute("fill", "#0f172a");
      text.setAttribute("font-size", "10");
      text.setAttribute("font-weight", "bold");
      text.setAttribute("text-anchor", "middle");
      text.textContent = fret;
      svg.appendChild(text);
    } else {
      // Draw open string indicator (circle at top)
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", topMargin - 8);
      circle.setAttribute("r", "4");
      circle.setAttribute("fill", "none");
      circle.setAttribute("stroke", "#10b981");
      circle.setAttribute("stroke-width", "2");
      svg.appendChild(circle);
    }
  });
}

// Select Chord in Library
function selectChord(chordName) {
  currentChord = chordName;
  document.querySelectorAll(".chord-btn").forEach(btn => {
    if (btn.textContent.trim() === chordName || (chordName === "Bb" && btn.textContent.trim() === "B♭")) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  
  document.getElementById("chord-title").textContent = `Accord de ${chordName}`;
  document.getElementById("chord-fingering").textContent = CHORDS[chordName].fingers;
  drawChordDiagram(chordName);
}

function playCurrentChord() {
  playChord(currentChord, "D", 1.2);
}

// Tab Switching
function switchTab(tabId) {
  activeTab = tabId;
  document.querySelectorAll(".tab-content").forEach(tab => {
    tab.classList.add("hidden");
    tab.classList.remove("active");
  });
  document.getElementById(`tab-${tabId}`).classList.remove("hidden");
  document.getElementById(`tab-${tabId}`).classList.add("active");

  // Update Nav Buttons
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.remove("text-sky-400");
    btn.classList.add("text-slate-400");
  });
  document.getElementById(`nav-${tabId}`).classList.add("text-sky-400");
  document.getElementById(`nav-${tabId}`).classList.remove("text-slate-400");

  // Stop progression playback if switching away
  if (tabId !== "progressions" && isPlayingProgression) {
    toggleProgressionPlay();
  }
}

// Load Progressions into Select Dropdown
function populateDropdowns() {
  const progSelect = document.getElementById("progression-select");
  PROGRESSIONS.forEach((prog, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = prog.name;
    progSelect.appendChild(opt);
  });

  const strumSelect = document.getElementById("strum-select");
  STRUMMING_PATTERNS.forEach((strum, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = strum.name;
    strumSelect.appendChild(opt);
  });
}

// Load selected progression visual cards
function loadProgression() {
  const progIndex = document.getElementById("progression-select").value;
  const progression = PROGRESSIONS[progIndex];
  const container = document.getElementById("progression-chords-container");
  container.innerHTML = "";

  progression.chords.forEach((chord, index) => {
    const card = document.createElement("div");
    card.id = `prog-chord-${index}`;
    card.className = "flex-1 bg-slate-800 border border-slate-700 rounded-lg py-3 flex flex-col items-center justify-center transition-all cursor-pointer";
    card.onclick = () => playChord(chord, "D", 0.8);
    
    card.innerHTML = `
      <span class="text-lg font-black text-sky-400">${chord}</span>
      <span class="text-[9px] text-slate-500 mt-0.5">Mesure ${index + 1}</span>
    `;
    container.appendChild(card);
  });

  resetProgressionPlayback();
}

// Load selected strumming pattern visualizer
function loadStrumming() {
  const strumIndex = document.getElementById("strum-select").value;
  const strum = STRUMMING_PATTERNS[strumIndex];
  
  // Update text representation
  const textRep = strum.pattern.map(step => step || "-").join("   ");
  document.getElementById("strum-pattern-text").textContent = textRep;

  // Rebuild visualizer grid
  const visualizer = document.getElementById("strum-visualizer");
  visualizer.innerHTML = "";
  
  strum.pattern.forEach((step, index) => {
    const indicator = document.createElement("div");
    indicator.id = `beat-step-${index}`;
    indicator.className = `flex items-center justify-center rounded text-xs font-bold transition-all ${step ? 'bg-slate-700 text-sky-400 border border-sky-500/30' : 'bg-slate-800/40 text-slate-600'}`;
    indicator.textContent = step || "•";
    visualizer.appendChild(indicator);
  });

  resetProgressionPlayback();
}

// Update BPM
function updateBPM(val) {
  bpm = val;
  document.getElementById("bpm-display").textContent = `${bpm} BPM`;
  if (isPlayingProgression) {
    // Restart interval with new speed
    clearInterval(progressionInterval);
    startPlaybackLoop();
  }
}

// Playback Loop Logic
function toggleProgressionPlay() {
  const btn = document.getElementById("play-progression-btn");
  if (isPlayingProgression) {
    // Stop
    clearInterval(progressionInterval);
    isPlayingProgression = false;
    btn.innerHTML = `<i class="fa-solid fa-play text-lg ml-0.5"></i>`;
    btn.className = "w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-95 transition-all";
    resetVisuals();
  } else {
    // Start
    initAudio();
    isPlayingProgression = true;
    btn.innerHTML = `<i class="fa-solid fa-pause text-lg"></i>`;
    btn.className = "w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 active:scale-95 transition-all";
    startPlaybackLoop();
  }
}

function startPlaybackLoop() {
  // Calculate interval based on 8th notes
  // BPM is quarter notes per minute. 8th notes = (60 / BPM) / 2 seconds
  const intervalMs = (60 / bpm) / 2 * 1000;
  
  progressionInterval = setInterval(() => {
    const progIndex = document.getElementById("progression-select").value;
    const progression = PROGRESSIONS[progIndex];
    const strumIndex = document.getElementById("strum-select").value;
    const strum = STRUMMING_PATTERNS[strumIndex];

    const activeChord = progression.chords[currentProgressionIndex];
    const activeStrum = strum.pattern[currentBeatIndex];

    // Update Visuals
    updatePlaybackVisuals(progression.chords.length, strum.pattern.length);

    // Play sound if there is a strum action
    if (activeStrum) {
      playChord(activeChord, activeStrum, 0.4);
    }

    // Advance sequencer
    currentBeatIndex++;
    if (currentBeatIndex >= strum.pattern.length) {
      currentBeatIndex = 0;
      currentProgressionIndex++;
      if (currentProgressionIndex >= progression.chords.length) {
        currentProgressionIndex = 0;
      }
    }
  }, intervalMs);
}

function updatePlaybackVisuals(totalChords, totalBeats) {
  // Reset all chord cards
  for (let i = 0; i < totalChords; i++) {
    const card = document.getElementById(`prog-chord-${i}`);
    if (card) {
      if (i === currentProgressionIndex) {
        card.classList.add("prog-chord-active");
      } else {
        card.classList.remove("prog-chord-active");
      }
    }
  }

  // Reset all beat indicators
  for (let i = 0; i < totalBeats; i++) {
    const indicator = document.getElementById(`beat-step-${i}`);
    if (indicator) {
      if (i === currentBeatIndex) {
        indicator.classList.add("beat-active");
      } else {
        indicator.classList.remove("beat-active");
      }
    }
  }
}

function resetProgressionPlayback() {
  if (isPlayingProgression) {
    toggleProgressionPlay();
  }
  currentProgressionIndex = 0;
  currentBeatIndex = 0;
  resetVisuals();
}

function resetVisuals() {
  document.querySelectorAll("[id^='prog-chord-']").forEach(el => el.classList.remove("prog-chord-active"));
  document.querySelectorAll("[id^='beat-step-']").forEach(el => el.classList.remove("beat-active"));
}

// App Initialization
window.addEventListener("DOMContentLoaded", () => {
  populateDropdowns();
  selectChord("C");
  loadProgression();
  loadStrumming();

  // Register Service Worker for PWA offline capability
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(err => console.log("SW registration failed", err));
  }
});