// Audio Context Initialization
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Ukulele String Base Frequencies
const STRINGS = {
  G: 392.00,
  C: 261.63,
  E: 329.63,
  A: 440.00
};

// Chord Definitions (Frets: [G, C, E, A])
const CHORDS = {
  'C': [0, 0, 0, 3],
  'G': [0, 2, 3, 2],
  'Am': [2, 0, 0, 0],
  'F': [2, 0, 1, 0],
  'D': [2, 2, 2, 0],
  'Em': [0, 4, 3, 2],
  'A': [2, 1, 0, 0],
  'Dm': [2, 2, 1, 0]
};

// Songs Database
const SONGS = [
  {
    id: 1,
    title: "Riptide",
    artist: "Vance Joy",
    chords: ["Am", "G", "C"],
    lyrics: "[Am] I was scared of [G] dentists and the [C] dark\n[Am] I was scared of [G] pretty girls and [C] starting conversations\nOh, [Am] all my friends are [G] turning green\nYou're the [C] magician's assistant in their dream\n\nAh-ah-[Am]oh, [G] don't run [C] away"
  },
  {
    id: 2,
    title: "Over the Rainbow",
    artist: "Israel Kamakawiwo'ole",
    chords: ["C", "G", "Am", "F"],
    lyrics: "[C] Somewhere [G] over the rainbow [F] way up [C] high\n[F] And the [C] dreams that you dream of [G] once in a lulla[Am]by [F]\n\n[C] Somewhere [G] over the rainbow [F] blue birds [C] fly\n[F] And the [C] dreams that you dream of [G] dreams really do [Am] come [F] true"
  },
  {
    id: 3,
    title: "La Vie en Rose",
    artist: "Édith Piaf",
    chords: ["C", "Am", "F", "G"],
    lyrics: "Quand il me [C] prend dans ses bras\nIl me parle tout [Am] bas\nJe vois la vie en [F] rose [G]\n\nIl me [C] dit des mots d'amour\nDes mots de tous les [Am] jours\nEt ça me fait quelque [F] chose [G]"
  }
];

// Play a single note
function playNote(frequency, duration = 0.8, delay = 0) {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);

  gainNode.gain.setValueAtTime(0.3, ctx.currentTime + delay);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
}

// Play a full chord (strum simulation)
function playChord(chordName) {
  const frets = CHORDS[chordName];
  if (!frets) return;

  const stringBases = [STRINGS.G, STRINGS.C, STRINGS.E, STRINGS.A];
  
  stringBases.forEach((baseFreq, index) => {
    const fret = frets[index];
    // Frequency formula: f = base * 2^(fret/12)
    const freq = baseFreq * Math.pow(2, fret / 12);
    // Strum delay: 0.05s between each string
    playNote(freq, 1.2, index * 0.05);
  });
}

// Tuner Logic
let tunerInterval = null;
let activeTunerPeg = null;

function toggleTuner(stringName, button) {
  const freq = STRINGS[stringName];
  
  if (activeTunerPeg === stringName) {
    stopTuner();
    return;
  }

  stopTuner();
  activeTunerPeg = stringName;
  button.classList.add('playing');

  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gainNode.gain.setValueAtTime(0.15, ctx.currentTime);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.start();

  tunerInterval = {
    osc,
    gainNode,
    stop: () => {
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      setTimeout(() => osc.stop(), 200);
      button.classList.remove('playing');
    }
  };
}

function stopTuner() {
  if (tunerInterval) {
    tunerInterval.stop();
    tunerInterval = null;
    activeTunerPeg = null;
  }
}

// Metronome Logic
let metronomeInterval = null;
let bpm = 100;
let isMetronomePlaying = false;

function playMetronomeClick() {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1000, ctx.currentTime);
  gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.06);

  // Visual flash
  const visual = document.getElementById('metro-visual');
  visual.classList.add('flash');
  setTimeout(() => visual.classList.remove('flash'), 100);
}

function toggleMetronome() {
  const btn = document.getElementById('btn-metro-toggle');
  if (isMetronomePlaying) {
    clearInterval(metronomeInterval);
    isMetronomePlaying = false;
    btn.textContent = 'Démarrer';
  } else {
    getAudioContext();
    isMetronomePlaying = true;
    btn.textContent = 'Arrêter';
    playMetronomeClick();
    metronomeInterval = setInterval(playMetronomeClick, (60 / bpm) * 1000);
  }
}

function updateBPM(val) {
  bpm = val;
  document.getElementById('bpm-val').textContent = bpm;
  if (isMetronomePlaying) {
    clearInterval(metronomeInterval);
    metronomeInterval = setInterval(playMetronomeClick, (60 / bpm) * 1000);
  }
}

// Render Chord Diagrams
function renderChords() {
  const grid = document.getElementById('chords-grid');
  grid.innerHTML = '';

  Object.keys(CHORDS).forEach(chordName => {
    const frets = CHORDS[chordName];
    const card = document.createElement('div');
    card.className = 'chord-card';
    card.onclick = () => playChord(chordName);

    // Generate Fretboard HTML
    let fretboardHTML = `<div class="fretboard">`;
    // Frets lines
    for (let i = 1; i <= 4; i++) {
      fretboardHTML += `<div class="fret-line" style="top: ${i * 25}px;"></div>`;
    }
    // Strings lines
    for (let i = 0; i < 4; i++) {
      fretboardHTML += `<div class="string-line" style="left: ${10 + i * 20}px;"></div>`;
    }
    // Finger dots
    frets.forEach((fret, stringIndex) => {
      if (fret > 0) {
        const left = 10 + stringIndex * 20;
        const top = (fret * 25) - 12.5;
        fretboardHTML += `<div class="finger-dot" style="left: ${left}px; top: ${top}px;">${fret}</div>`;
      }
    });
    fretboardHTML += `</div>`;

    card.innerHTML = `
      <div class="chord-name">${chordName}</div>
      ${fretboardHTML}
    `;
    grid.appendChild(card);
  });
}

// Render Songs List
function renderSongs() {
  const list = document.getElementById('song-list');
  list.innerHTML = '';

  SONGS.forEach(song => {
    const card = document.createElement('div');
    card.className = 'song-card';
    card.onclick = () => showSongDetail(song);

    const badges = song.chords.map(c => `<span class="chord-badge">${c}</span>`).join(' ');

    card.innerHTML = `
      <div class="song-title">${song.title}</div>
      <div class="song-artist">${song.artist}</div>
      <div class="song-chords-used">${badges}</div>
    `;
    list.appendChild(card);
  });
}

function showSongDetail(song) {
  document.getElementById('songs-list-view').style.display = 'none';
  const detailView = document.getElementById('song-detail-view');
  detailView.classList.add('active');

  document.getElementById('detail-title').textContent = song.title;
  document.getElementById('detail-artist').textContent = song.artist;

  // Format lyrics with clickable chords
  let formattedLyrics = song.lyrics.replace(/\[([A-Za-z0-9#]+)\]/g, (match, chord) => {
    return `<span class="chord-ref" onclick="playChord('${chord}')">${chord}</span>`;
  });

  document.getElementById('lyrics-content').innerHTML = formattedLyrics;
}

function closeSongDetail() {
  document.getElementById('song-detail-view').classList.remove('active');
  document.getElementById('songs-list-view').style.display = 'block';
}

// SPA Router
function switchTab(tabId) {
  stopTuner();
  if (isMetronomePlaying) toggleMetronome();

  document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  document.querySelector(`[onclick="switchTab('${tabId}')"]`).classList.add('active');

  if (tabId === 'songs') {
    closeSongDetail();
  }
}

// Dark Mode Toggle
function initDarkMode() {
  const toggleBtn = document.getElementById('btn-theme');
  const currentTheme = localStorage.getItem('theme') || 'light';

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  toggleBtn.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#btn-theme i');
  if (theme === 'dark') {
    icon.className = 'fas fa-sun';
  } else {
    icon.className = 'fas fa-moon';
  }
}

// PWA Installation Logic
let deferredPrompt;
const installBtn = document.getElementById('btn-install');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.classList.add('visible');
});

installBtn.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    deferredPrompt = null;
    installBtn.classList.remove('visible');
  }
});

window.addEventListener('appinstalled', () => {
  installBtn.classList.remove('visible');
  console.log('PWA installed successfully');
});

// App Initialization
window.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  renderChords();
  renderSongs();

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('Service Worker Registered'))
      .catch(err => console.error('Service Worker Failed', err));
  }
});