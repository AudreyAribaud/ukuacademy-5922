// Web Audio Context Initialization
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

// App State
const state = {
    learnedChords: JSON.parse(localStorage.getItem('learnedChords')) || [],
    currentPlayingOscillator: null,
    metronomeInterval: null,
    metronomeBpm: 120,
    metronomePlaying: false,
    metronomeBeatCount: 0,
    scrollInterval: null,
    scrollPlaying: false
};

// Chord Database
const CHORDS = [
    { name: 'C', frets: [0, 0, 0, 3], notes: ['G4', 'C4', 'E4', 'C5'] },
    { name: 'Am', frets: [2, 0, 0, 0], notes: ['A4', 'C4', 'E4', 'A4'] },
    { name: 'F', frets: [2, 0, 1, 0], notes: ['A4', 'C4', 'F4', 'A4'] },
    { name: 'G', frets: [0, 2, 3, 2], notes: ['G4', 'D4', 'G4', 'B4'] },
    { name: 'C7', frets: [0, 0, 0, 1], notes: ['G4', 'C4', 'E4', 'Bb4'] },
    { name: 'D', frets: [2, 2, 2, 0], notes: ['A4', 'D4', 'F#4', 'A4'] },
    { name: 'Dm', frets: [2, 2, 1, 0], notes: ['A4', 'D4', 'F4', 'A4'] },
    { name: 'Em', frets: [0, 4, 3, 2], notes: ['G4', 'E4', 'G4', 'B4'] },
    { name: 'A', frets: [2, 1, 0, 0], notes: ['A4', 'C#4', 'E4', 'A4'] },
    { name: 'G7', frets: [0, 2, 1, 2], notes: ['G4', 'D4', 'F4', 'B4'] }
];

// Songs Database
const SONGS = [
    {
        title: "Riptide",
        artist: "Vance Joy",
        difficulty: "Facile",
        chords: ["Am", "G", "C"],
        lyrics: "[Am] I was scared of [G] dentisits and the [C] dark\n[Am] I was scared of [G] pretty girls and [C] starting conversations\n[Am] Oh, all my [G] friends are turning [C] green\n[Am] You're the magician's [G] assistant in their [C] dreams\n\n[Am] Oh, [G] oh, and they [C] come unstuck\n[Am] Lady, [G] running down to the [C] riptide\nTaken away to the [Am] dark side\n[G] I wanna be your [C] left hand man"
    },
    {
        title: "You Are My Sunshine",
        artist: "Traditionnel",
        difficulty: "Facile",
        chords: ["C", "C7", "F", "G"],
        lyrics: "The other [C] night dear, as I lay sleeping\nI dreamed I [C7] held you in my [F] arms\nBut when I [C] awoke, dear, I was mistaken\nSo I hung my [G] head and I [C] cried.\n\nYou are my [C] sunshine, my only sunshine\nYou make me [C7] happy when skies are [F] grey\nYou'll never [C] know, dear, how much I love you\nPlease don't take my [G] sunshine [C] away."
    },
    {
        title: "La Vie en Rose",
        artist: "Édith Piaf",
        difficulty: "Moyen",
        chords: ["C", "Am", "F", "G"],
        lyrics: "[C] Des yeux qui font baisser les [Am] miens\nUn rire qui se [F] perd sur sa [G] bouche\nVoilà le [C] portrait sans re[Am]touche\nDe l'homme [F] auquel j'appar[G]tiens\n\nQuand il me [C] prend dans ses bras\nIl me parle tout [Am] bas\nJe vois la vie en [F] rose [G]\nIl me [C] dit des mots d'amour\nDes mots de tous les [Am] jours\nEt ça me fait quelque [F] chose [G]"
    }
];

// Note Frequencies mapping for Tuner
const NOTE_FREQS = {
    'G4': 392.00,
    'C4': 261.63,
    'E4': 329.63,
    'A4': 440.00
};

// Navigation Router
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
        
        btn.classList.add('active');
        const target = btn.getAttribute('data-target');
        document.getElementById(target).classList.add('active');
        
        // Stop any active audio when switching views
        stopAllAudio();
    });
});

// --- TUNER LOGIC ---
const pegButtons = document.querySelectorAll('.peg-btn');
const stopTunerBtn = document.getElementById('stop-tuner-btn');

pegButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const freq = parseFloat(btn.getAttribute('data-freq'));
        playReferenceNote(freq, btn);
    });
});

stopTunerBtn.addEventListener('click', stopAllAudio);

function playReferenceNote(frequency, buttonElement) {
    stopAllAudio();
    const ctx = getAudioContext();
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
    // Soft fade out after 3 seconds
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 3);
    
    state.currentPlayingOscillator = osc;
    
    buttonElement.classList.add('playing');
    setTimeout(() => {
        buttonElement.classList.remove('playing');
    }, 3000);
}

function stopAllAudio() {
    if (state.currentPlayingOscillator) {
        try {
            state.currentPlayingOscillator.stop();
        } catch(e) {}
        state.currentPlayingOscillator = null;
    }
    document.querySelectorAll('.peg-btn').forEach(b => b.classList.remove('playing'));
    stopMetronome();
    stopAutoScroll();
}

// --- CHORDS LOGIC ---
const chordsContainer = document.getElementById('chords-container');

function renderChords() {
    chordsContainer.innerHTML = '';
    CHORDS.forEach(chord => {
        const isLearned = state.learnedChords.includes(chord.name);
        const card = document.createElement('div');
        card.className = 'chord-card';
        card.innerHTML = `
            <div class="chord-learned-badge" data-chord="${chord.name}">
                ${isLearned ? '✅' : '⬜'}
            </div>
            <h3>${chord.name}</h3>
            <div class="chord-diagram" id="diagram-${chord.name}"></div>
            <button class="btn btn-small btn-secondary">Écouter</button>
        `;
        
        // Play chord on card click (excluding badge click)
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('chord-learned-badge')) return;
            strumChord(chord.notes);
        });
        
        // Toggle learned status
        const badge = card.querySelector('.chord-learned-badge');
        badge.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleChordLearned(chord.name);
        });
        
        chordsContainer.appendChild(card);
        drawChordDiagram(`diagram-${chord.name}`, chord.frets);
    });
}

function toggleChordLearned(chordName) {
    const index = state.learnedChords.indexOf(chordName);
    if (index > -1) {
        state.learnedChords.splice(index, 1);
    } else {
        state.learnedChords.push(chordName);
    }
    localStorage.setItem('learnedChords', JSON.stringify(state.learnedChords));
    renderChords();
}

// Dynamic SVG Chord Diagram Generator
function drawChordDiagram(containerId, frets) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const width = 80;
    const height = 100;
    const numStrings = 4;
    const numFrets = 5;
    
    const xSpacing = width / (numStrings + 1);
    const ySpacing = height / (numFrets + 1);
    
    let svg = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Draw Frets (horizontal lines)
    for (let i = 1; i <= numFrets; i++) {
        const y = i * ySpacing;
        const strokeWidth = i === 1 ? 3 : 1; // Thicker nut
        svg += `<line x1="${xSpacing}" y1="${y}" x2="${xSpacing * numStrings}" y2="${y}" stroke="#2c3e50" stroke-width="${strokeWidth}" />`;
    }
    
    // Draw Strings (vertical lines)
    for (let i = 1; i <= numStrings; i++) {
        const x = i * xSpacing;
        svg += `<line x1="${x}" y1="${ySpacing}" x2="${x}" y2="${ySpacing * numFrets}" stroke="#7f8c8d" stroke-width="1.5" />`;
    }
    
    // Draw Finger Dots
    frets.forEach((fret, stringIndex) => {
        const x = (stringIndex + 1) * xSpacing;
        if (fret > 0) {
            // Dot on fret
            const y = (fret * ySpacing) + (ySpacing / 2);
            svg += `<circle cx="${x}" cy="${y}" r="5" fill="#e67e22" />`;
        } else if (fret === 0) {
            // Open string circle above nut
            const y = ySpacing - 6;
            svg += `<circle cx="${x}" cy="${y}" r="3" fill="none" stroke="#27ae60" stroke-width="1.5" />`;
        }
    });
    
    svg += '</svg>';
    container.innerHTML = svg;
}

// Synthesize a Ukulele Strum
function strumChord(notes) {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Standard frequencies for notes
    const noteFreqs = {
        'G4': 392.00, 'C4': 261.63, 'E4': 329.63, 'A4': 440.00,
        'C5': 523.25, 'F4': 349.23, 'D4': 293.66, 'B4': 493.88,
        'Bb4': 466.16, 'F#4': 369.99, 'C#4': 277.18
    };
    
    notes.forEach((note, index) => {
        const freq = noteFreqs[note] || 261.63;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'triangle'; // Warmer, acoustic-like sound
        osc.frequency.value = freq;
        
        // Strum effect: delay each string slightly
        const stringDelay = index * 0.06;
        const startTime = now + stringDelay;
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + 1.2);
    });
}

// --- SONGS LOGIC ---
const songsContainer = document.getElementById('songs-container');
const songPlayer = document.getElementById('song-player');
const closePlayerBtn = document.getElementById('close-player-btn');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const playerLyrics = document.getElementById('player-lyrics-content');
const playerChordsBadges = document.getElementById('player-chords-badges');
const scrollPlayBtn = document.getElementById('scroll-play-btn');

function renderSongs() {
    songsContainer.innerHTML = '';
    SONGS.forEach((song, index) => {
        const card = document.createElement('div');
        card.className = 'song-card';
        card.innerHTML = `
            <div class="song-info">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
            </div>
            <div class="song-meta">
                <span class="difficulty-badge ${song.difficulty === 'Facile' ? 'easy' : 'medium'}">${song.difficulty}</span>
                <span>➔</span>
            </div>
        `;
        card.addEventListener('click', () => openSong(index));
        songsContainer.appendChild(card);
    });
}

function openSong(index) {
    const song = SONGS[index];
    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;
    
    // Render chord badges
    playerChordsBadges.innerHTML = '';
    song.chords.forEach(chord => {
        const badge = document.createElement('span');
        badge.className = 'chord-badge';
        badge.textContent = chord;
        badge.addEventListener('click', () => {
            const chordData = CHORDS.find(c => c.name === chord);
            if (chordData) strumChord(chordData.notes);
        });
        playerChordsBadges.appendChild(badge);
    });
    
    // Format lyrics with inline chords
    let formattedLyrics = song.lyrics.replace(/\[([A-Za-z0-9#]+)\]/g, '<span class="chord-inline">$1</span>');
    playerLyrics.innerHTML = formattedLyrics;
    
    songPlayer.classList.remove('hidden');
}

closePlayerBtn.addEventListener('click', () => {
    songPlayer.classList.add('hidden');
    stopAutoScroll();
});

// Auto Scroll Logic
scrollPlayBtn.addEventListener('click', () => {
    if (state.scrollPlaying) {
        stopAutoScroll();
    } else {
        startAutoScroll();
    }
});

function startAutoScroll() {
    state.scrollPlaying = true;
    scrollPlayBtn.textContent = '⏸ Pause';
    scrollPlayBtn.classList.replace('btn-primary', 'btn-secondary');
    
    state.scrollInterval = setInterval(() => {
        playerLyrics.scrollBy({
            top: 1,
            behavior: 'auto'
        });
    }, 40); // Adjust speed here
}

function stopAutoScroll() {
    state.scrollPlaying = false;
    scrollPlayBtn.textContent = '▶ Démarrer';
    scrollPlayBtn.classList.replace('btn-secondary', 'btn-primary');
    if (state.scrollInterval) {
        clearInterval(state.scrollInterval);
    }
}

// --- METRONOME LOGIC ---
const metroBpmDisplay = document.getElementById('metro-bpm-display');
const metroSlider = document.getElementById('metro-slider');
const metroMinus = document.getElementById('metro-minus');
const metroPlus = document.getElementById('metro-plus');
const metroToggle = document.getElementById('metro-toggle');
const metroVisual = document.getElementById('metro-visual-indicator');

function updateBpm(val) {
    state.metronomeBpm = Math.max(40, Math.min(240, val));
    metroBpmDisplay.textContent = state.metronomeBpm;
    metroSlider.value = state.metronomeBpm;
    
    if (state.metronomePlaying) {
        stopMetronome();
        startMetronome();
    }
}

metroSlider.addEventListener('input', (e) => updateBpm(parseInt(e.target.value)));
metroMinus.addEventListener('click', () => updateBpm(state.metronomeBpm - 1));
metroPlus.addEventListener('click', () => updateBpm(state.metronomeBpm + 1));

metroToggle.addEventListener('click', () => {
    if (state.metronomePlaying) {
        stopMetronome();
    } else {
        startMetronome();
    }
});

function startMetronome() {
    state.metronomePlaying = true;
    metroToggle.textContent = 'Arrêter';
    metroToggle.classList.replace('btn-primary', 'btn-secondary');
    
    const intervalMs = (60 / state.metronomeBpm) * 1000;
    state.metronomeInterval = setInterval(playMetronomeTick, intervalMs);
}

function stopMetronome() {
    state.metronomePlaying = false;
    metroToggle.textContent = 'Démarrer';
    metroToggle.classList.replace('btn-secondary', 'btn-primary');
    if (state.metronomeInterval) {
        clearInterval(state.metronomeInterval);
    }
}

function playMetronomeTick() {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    // Accentuate the first beat of 4
    const isFirstBeat = state.metronomeBeatCount % 4 === 0;
    osc.frequency.value = isFirstBeat ? 1000 : 800;
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
    
    // Visual Flash
    metroVisual.classList.add('flash');
    setTimeout(() => {
        metroVisual.classList.remove('flash');
    }, 50);
    
    state.metronomeBeatCount++;
}

// --- PWA INSTALLATION HINT ---
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';
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

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker enregistré !', reg))
            .catch(err => console.warn('Erreur d\'enregistrement du Service Worker', err));
    });
}

// Initial Render
renderChords();
renderSongs();