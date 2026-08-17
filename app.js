// Audio Context Setup for Tuner, Chords, and Metronome
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

// Chord Database
const CHORDS = {
    'C': { name: 'C (Do)', frets: [0, 0, 0, 3], frequencies: [392.00, 261.63, 329.63, 523.25] },
    'G': { name: 'G (Sol)', frets: [0, 2, 3, 2], frequencies: [392.00, 293.66, 392.00, 440.00] },
    'Am': { name: 'Am (La mineur)', frets: [2, 0, 0, 0], frequencies: [440.00, 261.63, 329.63, 440.00] },
    'F': { name: 'F (Fa)', frets: [2, 0, 1, 0], frequencies: [440.00, 261.63, 349.23, 440.00] },
    'D': { name: 'D (Ré)', frets: [2, 2, 2, 0], frequencies: [440.00, 293.66, 370.01, 440.00] },
    'Em': { name: 'Em (Mi mineur)', frets: [0, 4, 3, 2], frequencies: [392.00, 329.63, 392.00, 440.00] },
    'A': { name: 'A (La)', frets: [2, 1, 0, 0], frequencies: [440.00, 277.18, 329.63, 440.00] },
    'Dm': { name: 'Dm (Ré mineur)', frets: [2, 2, 1, 0], frequencies: [440.00, 293.66, 349.23, 440.00] }
};

// Song Database
const SONGS = [
    {
        id: 'riptide',
        title: 'Riptide',
        artist: 'Vance Joy',
        chords: ['Am', 'G', 'C'],
        lyrics: "[Am] I was scared of [G] dentists and the [C] dark\n[Am] I was scared of [G] pretty girls and [C] starting conversations\nOh, [Am] all my [G] friends are turning [C] green\nYou're the [Am] magician's [G] assistant in their [C] dreams\n\n[Am] Oh, [G] oh, and they [C] come unstuck\n[Am] Lady, [G] running down to the [C] riptide\nTaken away to the [Am] dark side\n[G] I wanna be your [C] left hand man"
    },
    {
        id: 'over-the-rainbow',
        title: 'Over the Rainbow',
        artist: 'Israel Kamakawiwoʻole',
        chords: ['C', 'G', 'Am', 'F'],
        lyrics: "[C] Ooh, ooh, [G] ooh, ooh... [Am] ooh, ooh... [F] ooh...\n\n[C] Somewhere [G] over the rainbow\n[F] Way up [C] high\n[F] And the [C] dreams that you dream of\n[G] Once in a lulla[Am]by, [F] oh...\n\n[C] Somewhere [G] over the rainbow\n[F] Bluebirds [C] fly\n[F] And the [C] dreams that you dream of\n[G] Dreams really do come [Am] true [F]"
    },
    {
        id: 'im-yours',
        title: "I'm Yours",
        artist: 'Jason Mraz',
        chords: ['C', 'G', 'Am', 'F'],
        lyrics: "Well, [C] you done done me and you bet I felt it\nI [G] tried to be chill but you're so hot that I melted\nI [Am] fell right through the cracks\nAnd now I'm [F] trying to get back\n\nBefore the [C] cool done run out I'll be giving it my bestest\nAnd [G] nothing's going to stop me but divine intervention\nI [Am] reckon it's again my turn\nTo [F] win some or learn some\n\nBut [C] I won't hesi[G]tate no more, no [Am] more\nIt cannot [F] wait, I'm yours"
    }
];

// App State
let currentView = 'dashboard';
let activeChord = 'C';
let activeSong = null;
let transposeOffset = 0;
let autoscrollInterval = null;
let isAutoscrolling = false;
let metronomeInterval = null;
let isStrumming = false;
let currentBeat = 0;
let strumTempo = 100;
let gameScore = 0;
let gameHighScore = 0;
let gameTargetChord = null;

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        switchView(btn.dataset.target);
    });
});

function switchView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    const targetView = document.getElementById(viewId);
    if (targetView) targetView.classList.add('active');
    
    const targetBtn = document.querySelector(`[data-target="${viewId}"]`);
    if (targetBtn) targetBtn.classList.add('active');
    
    currentView = viewId;
    
    // Stop metronome/autoscroll if leaving views
    if (viewId !== 'strumming') stopStrumming();
    if (viewId !== 'songs') stopAutoscroll();
}

// --- CHORDS LOGIC ---
function initChords() {
    const grid = document.getElementById('chords-selector-grid');
    grid.innerHTML = '';
    Object.keys(CHORDS).forEach(chordKey => {
        const btn = document.createElement('button');
        btn.className = `chord-btn ${chordKey === activeChord ? 'active' : ''}`;
        btn.innerText = chordKey;
        btn.onclick = () => selectChord(chordKey);
        grid.appendChild(btn);
    });
    drawChordDiagram(activeChord);
}

function selectChord(chordKey) {
    activeChord = chordKey;
    document.querySelectorAll('.chord-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText === chordKey);
    });
    drawChordDiagram(chordKey);
    playChord(chordKey);
}

function drawChordDiagram(chordKey) {
    const chord = CHORDS[chordKey];
    document.getElementById('chord-display-name').innerText = `Accord : ${chord.name}`;
    const dotsContainer = document.getElementById('fretboard-dots');
    dotsContainer.innerHTML = '';
    
    chord.frets.forEach((fret, stringIndex) => {
        const x = 20 + stringIndex * 40;
        if (fret === 0) {
            // Open string circle at the top
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', 10);
            circle.setAttribute('r', 5);
            circle.setAttribute('fill', 'none');
            circle.setAttribute('stroke', '#10b981');
            circle.setAttribute('stroke-width', '2');
            dotsContainer.appendChild(circle);
        } else {
            // Pressed fret dot
            const y = 20 + (fret - 0.5) * 45;
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', 8);
            circle.setAttribute('fill', '#d97706');
            dotsContainer.appendChild(circle);
        }
    });
}

function playChord(chordKey) {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    
    const chord = CHORDS[chordKey];
    if (!chord) return;
    
    // Arpeggiate chord for realistic ukulele sound
    chord.frequencies.forEach((freq, index) => {
        setTimeout(() => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 1.2);
        }, index * 80);
    });
}

document.getElementById('play-chord-btn').addEventListener('click', () => {
    playChord(activeChord);
});

// --- SONGS LOGIC ---
function initSongs() {
    const listContainer = document.getElementById('song-list-container');
    listContainer.innerHTML = '';
    SONGS.forEach(song => {
        const li = document.createElement('li');
        li.className = 'song-item';
        li.innerHTML = `<h4>${song.title}</h4><p>${song.artist}</p>`;
        li.onclick = () => selectSong(song);
        listContainer.appendChild(li);
    });
}

function selectSong(song) {
    activeSong = song;
    transposeOffset = 0;
    document.querySelectorAll('.song-item').forEach(item => {
        item.classList.toggle('active', item.querySelector('h4').innerText === song.title);
    });
    document.getElementById('song-placeholder').classList.add('hidden');
    document.getElementById('song-content').classList.remove('hidden');
    renderSong();
}

function renderSong() {
    if (!activeSong) return;
    document.getElementById('song-title').innerText = activeSong.title;
    document.getElementById('song-artist').innerText = activeSong.artist;
    document.getElementById('transpose-val').innerText = transposeOffset === 0 ? 'Ton original' : `Transpose: ${transposeOffset > 0 ? '+' : ''}${transposeOffset}`;
    
    // Render chords used
    const chordsRow = document.getElementById('song-chords-list');
    chordsRow.innerHTML = '';
    activeSong.chords.forEach(c => {
        const badge = document.createElement('span');
        badge.className = 'chord-badge';
        badge.innerText = transposeChord(c, transposeOffset);
        badge.onclick = () => playChord(transposeChord(c, transposeOffset));
        chordsRow.appendChild(badge);
    });
    
    // Render lyrics with transposed chords
    const lyricsArea = document.getElementById('song-lyrics-chords');
    let formattedLyrics = activeSong.lyrics.replace(/\[([A-G][a-m]?)\]/g, (match, chord) => {
        const transposed = transposeChord(chord, transposeOffset);
        return `<span class="chord" onclick="playChord('${transposed}')">${transposed}</span>`;
    });
    lyricsArea.innerHTML = formattedLyrics;
}

const CHORD_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
function transposeChord(chord, offset) {
    let isMinor = chord.endsWith('m');
    let root = isMinor ? chord.slice(0, -1) : chord;
    let index = CHORD_SCALE.indexOf(root);
    if (index === -1) return chord;
    let newIndex = (index + offset) % 12;
    if (newIndex < 0) newIndex += 12;
    return CHORD_SCALE[newIndex] + (isMinor ? 'm' : '');
}

function transposeSong(direction) {
    transposeOffset += direction;
    renderSong();
}

function toggleAutoscroll() {
    const viewer = document.querySelector('.song-viewer');
    const btn = document.getElementById('autoscroll-btn');
    if (isAutoscrolling) {
        stopAutoscroll();
    } else {
        isAutoscrolling = true;
        btn.classList.add('btn-primary');
        btn.classList.remove('btn-secondary');
        autoscrollInterval = setInterval(() => {
            viewer.scrollBy(0, 1);
        }, 50);
    }
}

function stopAutoscroll() {
    isAutoscrolling = false;
    clearInterval(autoscrollInterval);
    const btn = document.getElementById('autoscroll-btn');
    if (btn) {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
    }
}

function filterSongs() {
    const query = document.getElementById('song-search').value.toLowerCase();
    document.querySelectorAll('.song-item').forEach(item => {
        const title = item.querySelector('h4').innerText.toLowerCase();
        const artist = item.querySelector('p').innerText.toLowerCase();
        if (title.includes(query) || artist.includes(query)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// --- STRUMMING LOGIC ---
const STRUM_PATTERNS = {
    island: [
        { type: 'D', label: 'D' },
        { type: 'mute', label: '-' },
        { type: 'D', label: 'D' },
        { type: 'U', label: 'U' },
        { type: 'mute', label: '-' },
        { type: 'U', label: 'U' },
        { type: 'D', label: 'D' },
        { type: 'U', label: 'U' }
    ],
    pop: [
        { type: 'D', label: 'D' },
        { type: 'mute', label: '-' },
        { type: 'D', label: 'D' },
        { type: 'U', label: 'U' },
        { type: 'mute', label: '-' },
        { type: 'D', label: 'D' },
        { type: 'U', label: 'U' },
        { type: 'mute', label: '-' }
    ],
    reggae: [
        { type: 'mute', label: '-' },
        { type: 'D', label: 'D' },
        { type: 'mute', label: '-' },
        { type: 'D', label: 'D' },
        { type: 'mute', label: '-' },
        { type: 'D', label: 'D' },
        { type: 'mute', label: '-' },
        { type: 'D', label: 'D' }
    ],
    waltz: [
        { type: 'D', label: 'D' },
        { type: 'mute', label: '-' },
        { type: 'U', label: 'U' },
        { type: 'U', label: 'U' },
        { type: 'mute', label: '-' },
        { type: 'mute', label: '-' }
    ]
};

function loadStrummingPattern() {
    const key = document.getElementById('pattern-select').value;
    const pattern = STRUM_PATTERNS[key];
    const bar = document.getElementById('visual-strum-bar');
    bar.innerHTML = '';
    
    pattern.forEach((beat, index) => {
        const div = document.createElement('div');
        div.className = 'strum-beat';
        let badgeClass = 'badge-mute';
        if (beat.type === 'D') badgeClass = 'badge-down';
        if (beat.type === 'U') badgeClass = 'badge-up';
        
        div.innerHTML = `<span class="badge ${badgeClass}">${beat.label}</span>`;
        bar.appendChild(div);
    });
    currentBeat = 0;
}

function updateTempo(val) {
    strumTempo = val;
    document.querySelector('#strumming #tempo-val').innerText = val;
    if (isStrumming) {
        stopStrumming();
        startStrumming();
    }
}

function toggleStrumming() {
    if (isStrumming) {
        stopStrumming();
    } else {
        startStrumming();
    }
}

function startStrumming() {
    isStrumming = true;
    document.getElementById('start-strum-btn').innerText = '⏹️ Arrêter';
    const intervalMs = (60 / strumTempo) * 1000 / 2; // Eighth notes
    
    metronomeInterval = setInterval(() => {
        const beats = document.querySelectorAll('.strum-beat');
        beats.forEach(b => b.classList.remove('active'));
        
        if (beats[currentBeat]) {
            beats[currentBeat].classList.add('active');
            playMetronomeTick(STRUM_PATTERNS[document.getElementById('pattern-select').value][currentBeat].type);
        }
        
        currentBeat = (currentBeat + 1) % beats.length;
    }, intervalMs);
}

function stopStrumming() {
    isStrumming = false;
    clearInterval(metronomeInterval);
    const btn = document.getElementById('start-strum-btn');
    if (btn) btn.innerText = '▶️ Démarrer';
    document.querySelectorAll('.strum-beat').forEach(b => b.classList.remove('active'));
    currentBeat = 0;
}

function playMetronomeTick(type) {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    if (type === 'D') {
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
    } else if (type === 'U') {
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
    } else {
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime); // Soft click for mute
    }
    
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
}

// --- TUNER LOGIC ---
let activeTunerOsc = null;
let activeTunerGain = null;

function playTunerNote(noteName, frequency) {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    
    // Deactivate previous peg
    document.querySelectorAll('.peg').forEach(peg => {
        if (peg.querySelector('span').innerText !== noteName) {
            peg.classList.remove('active');
        }
    });
    
    const clickedPeg = Array.from(document.querySelectorAll('.peg')).find(p => p.querySelector('span').innerText === noteName);
    
    if (activeTunerOsc) {
        activeTunerOsc.stop();
        activeTunerOsc = null;
        if (clickedPeg && clickedPeg.classList.contains('active')) {
            clickedPeg.classList.remove('active');
            document.getElementById('tuner-note-display').innerText = 'Accordeur arrêté';
            return;
        }
    }
    
    clickedPeg.classList.add('active');
    document.getElementById('tuner-note-display').innerText = `Note jouée : ${noteName}`;
    
    activeTunerOsc = ctx.createOscillator();
    activeTunerGain = ctx.createGain();
    
    activeTunerOsc.type = 'sine';
    activeTunerOsc.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    activeTunerGain.gain.setValueAtTime(0.2, ctx.currentTime);
    
    activeTunerOsc.connect(activeTunerGain);
    activeTunerGain.connect(ctx.destination);
    
    activeTunerOsc.start();
}

// --- GAME LOGIC ---
function initGame() {
    gameScore = 0;
    document.getElementById('game-score').innerText = gameScore;
    nextGameRound();
}

function nextGameRound() {
    document.getElementById('game-feedback').innerText = '';
    document.getElementById('game-feedback').className = 'game-feedback';
    
    const keys = Object.keys(CHORDS);
    gameTargetChord = keys[Math.floor(Math.random() * keys.length)];
    
    // Generate options (4 unique chords including target)
    let options = [gameTargetChord];
    while (options.length < 4) {
        let randChord = keys[Math.floor(Math.random() * keys.length)];
        if (!options.includes(randChord)) {
            options.push(randChord);
        }
    }
    // Shuffle options
    options.sort(() => Math.random() - 0.5);
    
    const container = document.getElementById('game-options-container');
    container.innerHTML = '';
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-secondary btn-lg';
        btn.innerText = opt;
        btn.onclick = () => checkGameAnswer(opt);
        container.appendChild(btn);
    });
    
    playGameTargetChord();
}

function playGameTargetChord() {
    if (gameTargetChord) {
        playChord(gameTargetChord);
    }
}

function checkGameAnswer(selected) {
    const feedback = document.getElementById('game-feedback');
    if (selected === gameTargetChord) {
        feedback.innerText = 'Correct ! 🎉';
        feedback.className = 'game-feedback correct';
        gameScore++;
        document.getElementById('game-score').innerText = gameScore;
        if (gameScore > gameHighScore) {
            gameHighScore = gameScore;
            document.getElementById('game-highscore').innerText = gameHighScore;
        }
        setTimeout(nextGameRound, 1500);
    } else {
        feedback.innerText = `Faux ! C'était l'accord ${gameTargetChord} 😢`;
        feedback.className = 'game-feedback incorrect';
        gameScore = 0;
        document.getElementById('game-score').innerText = gameScore;
        setTimeout(nextGameRound, 2000);
    }
}

function resetGame() {
    initGame();
}

// --- INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    initChords();
    initSongs();
    loadStrummingPattern();
    initGame();
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log('SW registration failed', err));
}