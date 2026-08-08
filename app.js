// Ukulele Chord Progressions Database
const progressions = {
  pop: {
    name: "Pop/Rock",
    degrees: ["I", "V", "vi", "IV"],
    chords: {
      C: ["C", "G", "Am", "F"],
      G: ["G", "D", "Em", "C"],
      F: ["F", "C", "Dm", "Bb"]
    }
  },
  classic: {
    name: "Classic 50s",
    degrees: ["I", "vi", "IV", "V"],
    chords: {
      C: ["C", "Am", "F", "G"],
      G: ["G", "Em", "C", "D"],
      F: ["F", "Dm", "Bb", "C"]
    }
  },
  jazz: {
    name: "Jazz Turnaround",
    degrees: ["ii", "V", "I", "VI7"],
    chords: {
      C: ["Dm", "G7", "C", "A7"],
      G: ["Am", "D7", "G", "E7"],
      F: ["Gm", "C7", "F", "D7"]
    }
  },
  blues: {
    name: "Blues Basic",
    degrees: ["I", "IV", "I", "V7"],
    chords: {
      C: ["C", "F", "C", "G7"],
      G: ["G", "C", "G", "D7"],
      F: ["F", "Bb", "F", "C7"]
    }
  },
  folk: {
    name: "Folk/Alternative",
    degrees: ["vi", "IV", "I", "V"],
    chords: {
      C: ["Am", "F", "C", "G"],
      G: ["Em", "C", "G", "D"],
      F: ["Dm", "Bb", "F", "C"]
    }
  }
};

// Ukulele Chord Fingering Database
// Format: [G-string, C-string, E-string, A-string] (0 = open, number = fret, -1 = muted/not used)
const chordFingerings = {
  "C": [0, 0, 0, 3],
  "G": [0, 2, 3, 2],
  "Am": [2, 0, 0, 0],
  "F": [2, 0, 1, 0],
  "D": [2, 2, 2, 0],
  "Em": [0, 4, 3, 2],
  "Dm": [2, 2, 1, 0],
  "Bb": [3, 2, 1, 1],
  "G7": [0, 2, 1, 2],
  "A7": [1, 0, 0, 0],
  "D7": [2, 0, 2, 0],
  "E7": [1, 2, 0, 2],
  "C7": [0, 0, 0, 1],
  "Gm": [0, 2, 3, 1]
};

// Frequencies for Ukulele Strings (Standard G4-C4-E4-A4 tuning)
const stringFrequencies = [392.00, 261.63, 329.63, 440.00]; // G4, C4, E4, A4

// State Management
let currentProgression = "pop";
let currentKey = "C";
let isPlaying = false;
let playbackInterval = null;
let currentChordIndex = 0;
let tempo = 100;

// Web Audio Context
let audioCtx = null;

// DOM Elements
const progressionSelect = document.getElementById("progression-select");
const keySelect = document.getElementById("key-select");
const chordsGrid = document.getElementById("chords-grid");
const playBtn = document.getElementById("play-btn");
const tempoRange = document.getElementById("tempo-range");
const tempoVal = document.getElementById("tempo-val");

// Initialize App
function init() {
  renderChords();
  setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
  progressionSelect.addEventListener("change", (e) => {
    currentProgression = e.target.value;
    stopPlayback();
    renderChords();
  });

  keySelect.addEventListener("change", (e) => {
    currentKey = e.target.value;
    stopPlayback();
    renderChords();
  });

  tempoRange.addEventListener("input", (e) => {
    tempo = parseInt(e.target.value);
    tempoVal.textContent = tempo;
    if (isPlaying) {
      restartPlayback();
    }
  });

  playBtn.addEventListener("click", () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  });
}

// Render Chord Cards with SVG Diagrams
function renderChords() {
  chordsGrid.innerHTML = "";
  const prog = progressions[currentProgression];
  const chordList = prog.chords[currentKey];
  const degrees = prog.degrees;

  chordList.forEach((chordName, index) => {
    const card = document.createElement("div");
    card.className = "chord-card";
    card.dataset.index = index;
    card.dataset.chord = chordName;

    const header = document.createElement("div");
    header.className = "chord-header";
    
    const nameSpan = document.createElement("span");
    nameSpan.className = "chord-name";
    nameSpan.textContent = chordName;

    const degreeSpan = document.createElement("span");
    degreeSpan.className = "chord-degree";
    degreeSpan.textContent = degrees[index];

    header.appendChild(nameSpan);
    header.appendChild(degreeSpan);
    card.appendChild(header);

    // Generate SVG Diagram
    const svgContainer = document.createElement("div");
    svgContainer.className = "chord-diagram-svg";
    svgContainer.innerHTML = generateChordSVG(chordName);
    card.appendChild(svgContainer);

    // Click to play individual chord
    card.addEventListener("click", () => {
      playChordSound(chordName);
      highlightCard(index);
    });

    chordsGrid.appendChild(card);
  });
}

// Generate SVG for Ukulele Chord
function generateChordSVG(chordName) {
  const frets = chordFingerings[chordName] || [0, 0, 0, 0];
  const maxFret = Math.max(...frets, 3); // Always show at least 4 frets
  const numFrets = maxFret > 4 ? maxFret : 4;
  
  // SVG Dimensions
  const width = 100;
  const height = 120;
  const paddingLeft = 20;
  const paddingTop = 15;
  const gridWidth = 60;
  const gridHeight = 80;
  
  const stringSpacing = gridWidth / 3;
  const fretSpacing = gridHeight / numFrets;

  let svgHtml = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;

  // Draw Nut (thick top line)
  svgHtml += `<line x1="${paddingLeft}" y1="${paddingTop}" x2="${paddingLeft + gridWidth}" y2="${paddingTop}" stroke="#fff" stroke-width="4" />`;

  // Draw Frets
  for (let i = 1; i <= numFrets; i++) {
    const y = paddingTop + i * fretSpacing;
    svgHtml += `<line x1="${paddingLeft}" y1="${y}" x2="${paddingLeft + gridWidth}" y2="${y}" stroke="#555" stroke-width="1" />`;
  }

  // Draw Strings (G, C, E, A)
  for (let i = 0; i < 4; i++) {
    const x = paddingLeft + i * stringSpacing;
    svgHtml += `<line x1="${x}" y1="${paddingTop}" x2="${x}" y2="${paddingTop + gridHeight}" stroke="#aaa" stroke-width="1.5" />`;
  }

  // Draw Dots (Fingering)
  frets.forEach((fret, stringIndex) => {
    const x = paddingLeft + stringIndex * stringSpacing;
    if (fret === 0) {
      // Open string circle above nut
      svgHtml += `<circle cx="${x}" cy="${paddingTop - 6}" r="3" fill="none" stroke="#2ecc71" stroke-width="1.5" />`;
    } else if (fret > 0) {
      // Pressed fret dot
      const y = paddingTop + (fret - 0.5) * fretSpacing;
      svgHtml += `<circle cx="${x}" cy="${y}" r="5" fill="#e67e22" />`;
      // Add fret number inside dot if needed, or just keep it clean
    }
  });

  svgHtml += `</svg>`;
  return svgHtml;
}

// Audio Engine using Web Audio API
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

function playChordSound(chordName) {
  initAudio();
  const frets = chordFingerings[chordName] || [0, 0, 0, 0];
  const now = audioCtx.currentTime;

  // Strumming effect: play each string with a tiny delay
  frets.forEach((fret, stringIndex) => {
    if (fret === -1) return; // Muted
    
    // Calculate frequency based on string base frequency and fret
    const baseFreq = stringFrequencies[stringIndex];
    const freq = baseFreq * Math.pow(2, fret / 12);
    
    // Strum delay (approx 30ms between strings)
    const strumDelay = stringIndex * 0.03;
    playStringTone(freq, now + strumDelay);
  });
}

function playStringTone(frequency, startTime) {
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  // Ukulele-like timbre: combination of triangle and sine
  osc.type = "triangle";
  osc.frequency.setValueAtTime(frequency, startTime);
  
  // Pluck envelope
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.005); // Fast attack
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8); // Natural decay
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  osc.start(startTime);
  osc.stop(startTime + 0.8);
}

// Playback Loop
function startPlayback() {
  initAudio();
  isPlaying = true;
  playBtn.classList.add("active");
  playBtn.querySelector(".btn-icon").textContent = "■";
  playBtn.querySelector(".btn-text").textContent = "Arrêter";
  
  currentChordIndex = 0;
  playStep();
  
  const intervalMs = (60 / tempo) * 1000 * 2; // 2 beats per chord
  playbackInterval = setInterval(playStep, intervalMs);
}

function playStep() {
  const cards = document.querySelectorAll(".chord-card");
  const prog = progressions[currentProgression];
  const chordList = prog.chords[currentKey];
  const chordName = chordList[currentChordIndex];

  // Highlight current card
  highlightCard(currentChordIndex);
  
  // Play sound
  playChordSound(chordName);

  // Advance index
  currentChordIndex = (currentChordIndex + 1) % chordList.length;
}

function highlightCard(index) {
  const cards = document.querySelectorAll(".chord-card");
  cards.forEach((card, i) => {
    if (i === index) {
      card.classList.add("playing");
    } else {
      card.classList.remove("playing");
    }
  });
}

function stopPlayback() {
  isPlaying = false;
  clearInterval(playbackInterval);
  playbackInterval = null;
  playBtn.classList.remove("active");
  playBtn.querySelector(".btn-icon").textContent = "▶";
  playBtn.querySelector(".btn-text").textContent = "Jouer la suite";
  
  // Remove all highlights
  const cards = document.querySelectorAll(".chord-card");
  cards.forEach(card => card.classList.remove("playing"));
}

function restartPlayback() {
  stopPlayback();
  startPlayback();
}

// Service Worker Registration for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js")
      .then(reg => console.log("Service Worker enregistré !", reg.scope))
      .catch(err => console.log("Échec d'enregistrement du Service Worker", err));
  });
}

// Run on load
window.addEventListener("DOMContentLoaded", init);