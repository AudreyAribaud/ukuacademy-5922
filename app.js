// UkuAcademy - Application Logic

// 1. Chords Database
const CHORDS = {
    'C': { name: 'Do (C)', frets: [0, 0, 0, 3], type: 'major', fingers: [0, 0, 0, 3] },
    'G': { name: 'Sol (G)', frets: [0, 2, 3, 2], type: 'major', fingers: [0, 1, 3, 2] },
    'Am': { name: 'La min (Am)', frets: [2, 0, 0, 0], type: 'minor', fingers: [2, 0, 0, 0] },
    'F': { name: 'Fa (F)', frets: [2, 0, 1, 0], type: 'major', fingers: [2, 0, 1, 0] },
    'D': { name: 'Ré (D)', frets: [2, 2, 2, 0], type: 'major', fingers: [1, 2, 3, 0] },
    'Em': { name: 'Mi min (Em)', frets: [0, 4, 3, 2], type: 'minor', fingers: [0, 3, 2, 1] },
    'A': { name: 'La (A)', frets: [2, 1, 0, 0], type: 'major', fingers: [2, 1, 0, 0] },
    'E': { name: 'Mi (E)', frets: [4, 4, 4, 2], type: 'major', fingers: [2, 3, 4, 1] },
    'Bm': { name: 'Si min (Bm)', frets: [4, 2, 2, 2], type: 'minor', fingers: [3, 1, 1, 1] },
    'C7': { name: 'Do 7 (C7)', frets: [0, 0, 0, 1], type: '7th', fingers: [0, 0, 0, 1] },
    'G7': { name: 'Sol 7 (G7)', frets: [0, 2, 1, 2], type: '7th', fingers: [0, 2, 1, 3] },
    'D7': { name: 'Ré 7 (D7)', frets: [2, 0, 2, 0], type: '7th', fingers: [1, 0, 2, 0] },
    'E7': { name: 'Mi 7 (E7)', frets: [1, 2, 0, 2], type: '7th', fingers: [1, 2, 0, 3] },
    'A7': { name: 'La 7 (A7)', frets: [1, 0, 0, 0], type: '7th', fingers: [1, 0, 0, 0] }
};

// 2. Chord Progressions Database (Suites d'accords)
const PROGRESSIONS = [
    {
        id: 'pop-classic',
        title: 'La Classique Pop',
        description: 'La suite la plus célèbre au monde. Utilisée dans des centaines de tubes (Let It Be, I\'m Yours, Despacito).',
        chords: ['C', 'G', 'Am', 'F'],
        difficulty: 'Facile ⭐️'
    },
    {
        id: 'happy-standard',
        title: 'Le Standard Joyeux',
        description: 'Une progression entraînante et chaleureuse, idéale pour les chansons de feu de camp et de plage.',
        chords: ['C', 'F', 'G', 'C'],
        difficulty: 'Très Facile ⭐️'
    },
    {
        id: 'melancholic-folk',
        title: 'La Ballade Mélancolique',
        description: 'Parfait pour exprimer des émotions douces-amères. Très populaire en folk et indie rock.',
        chords: ['Am', 'F', 'C', 'G'],
        difficulty: 'Facile ⭐️'
    },
    {
        id: 'blues-12-bar',
        title: 'Le Blues en Do',
        description: 'La structure classique du blues de 12 mesures simplifiée pour ukulélé. Ambiance rétro garantie !',
        chords: ['C7', 'F', 'C7', 'G7'],
        difficulty: 'Moyen ⭐️⭐️'
    },
    {
        id: 'island-reggae',
        title: 'Le Rythme des Îles',
        description: 'Une suite d\'accords ensoleillée qui donne immédiatement envie de danser sous les cocotiers.',
        chords: ['C', 'Am', 'F', 'G7'],
        difficulty: 'Facile ⭐️'
    },
    {
        id: 'jazz-turnaround',
        title: 'Le Turnaround Jazz',
        description: 'Une progression sophistiquée pour donner une touche jazzy et élégante à votre jeu.',
        chords: ['C', 'Am', 'Dm', 'G7'],
        difficulty: 'Moyen ⭐️⭐️'
    }
];

// 3. Audio Engine (Web Audio API Synthesizer for Ukulele)
class UkeSynth {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // Frequencies for G4, C4, E4, A4 standard tuning
    getStringFrequency(stringIdx, fret) {
        const baseFreqs = [392.00, 261.63, 329.63, 440.00]; // G, C, E, A
        return baseFreqs[stringIdx] * Math.pow(2, fret / 12);
    }

    playChord(frets, duration = 1.2) {
        this.init();
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const now = this.ctx.currentTime;
        
        // Strumming effect: slight delay between each string pluck
        frets.forEach((fret, idx) => {
            if (fret === -1) return; // Muted string
            
            const pluckDelay = idx * 0.04; // 40ms delay between strings
            const freq = this.getStringFrequency(idx, fret);
            this.pluckString(freq, now + pluckDelay, duration - pluckDelay);
        });
    }

    pluckString(frequency, startTime, duration) {
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        
        // Triangle wave gives a warmer, more acoustic-like sound than sine or square
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(frequency, startTime);
        
        // Simple pluck envelope
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01); // Attack
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // Decay
        
        // Lowpass filter to soften the high frequencies and sound more organic
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, startTime);
        filter.frequency.exponentialRampToValueAtTime(300, startTime + duration);

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
    }
}

const synth = new UkeSynth();

// 4. SVG Chord Diagram Generator
function generateChordSVG(frets, fingers) {
    const width = 100;
    const height = 120;
    const numFrets = 5;
    const numStrings = 4;
    
    let svg = `<svg viewBox="0 0 ${width} ${height}" class="w-24 h-28 mx-auto">`;
    
    // Draw Nut (top thick line)
    svg += `<line x1="20" y1="20" x2="80" y2="20" stroke="#475569" stroke-width="4" />`;
    
    // Draw Frets
    for (let i = 1; i <= numFrets; i++) {
        const y = 20 + (i * 18);
        svg += `<line x1="20" y1="${y}" x2="80" y2="${y}" class="fretboard-line" />`;
    }
    
    // Draw Strings
    for (let i = 0; i < numStrings; i++) {
        const x = 20 + (i * 20);
        svg += `<line x1="${x}" y1="20" x2="${x}" y2="110" class="string-line" />`;
    }
    
    // Draw Markers / Dots
    frets.forEach((fret, stringIdx) => {
        const x = 20 + (stringIdx * 20);
        if (fret === 0) {
            // Open string circle above nut
            svg += `<circle cx="${x}" cy="10" r="4" class="open-string-marker" />`;
        } else if (fret > 0) {
            // Pressed fret dot
            const y = 20 + (fret * 18) - 9;
            svg += `<circle cx="${x}" cy="${y}" r="6" class="fret-marker" />`;
            // Finger number inside dot
            const finger = fingers[stringIdx];
            if (finger > 0) {
                svg += `<text x="${x}" y="${y + 3}" font-size="8" font-weight="bold" fill="white" text-anchor="middle">${finger}</text>`;
            }
        }
    });
    
    svg += `</svg>`;
    return svg;
}

// 5. Render Chord Dictionary
function renderChords(filter = 'all') {
    const grid = document.getElementById('chordsGrid');
    grid.innerHTML = '';
    
    Object.entries(CHORDS).forEach(([key, chord]) => {
        if (filter !== 'all' && chord.type !== filter) return;
        
        const card = document.createElement('div');
        card.className = 'chord-card bg-white rounded-2xl p-4 border border-amber-100 shadow-sm flex flex-col items-center justify-between cursor-pointer hover:border-amber-300';
        card.dataset.chord = key;
        
        card.innerHTML = `
            <div class="text-center mb-2">
                <h4 class="font-bold text-lg text-slate-800">${chord.name}</h4>
                <span class="text-xs text-slate-400 uppercase font-semibold">${chord.type}</span>
            </div>
            <div class="my-2">
                ${generateChordSVG(chord.frets, chord.fingers)}
            </div>
            <button class="mt-2 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1">
                <i class="fa-solid fa-volume-high"></i> Écouter
            </button>
        `;
        
        card.addEventListener('click', () => {
            synth.playChord(chord.frets);
            // Visual feedback
            card.classList.add('scale-95');
            setTimeout(() => card.classList.remove('scale-95'), 100);
        });
        
        grid.appendChild(card);
    });
}

// 6. Render Chord Progressions
let activeProgressionInterval = null;
let activeProgressionTimeout = null;

function stopAllProgressions() {
    if (activeProgressionInterval) clearInterval(activeProgressionInterval);
    if (activeProgressionTimeout) clearTimeout(activeProgressionTimeout);
    document.querySelectorAll('.progression-chord-badge').forEach(b => b.classList.remove('bg-amber-500', 'text-white', 'scale-110'));
    document.querySelectorAll('.play-prog-btn').forEach(btn => {
        btn.innerHTML = `<i class="fa-solid fa-play"></i> <span>Jouer la suite</span>`;
        btn.classList.remove('bg-red-500', 'hover:bg-red-600');
        btn.classList.add('bg-amber-500', 'hover:bg-amber-600');
    });
}

function playProgression(progId, chordsList, button) {
    if (button.classList.contains('bg-red-500')) {
        stopAllProgressions();
        return;
    }
    
    stopAllProgressions();
    
    button.innerHTML = `<i class="fa-solid fa-stop"></i> <span>Arrêter</span>`;
    button.classList.remove('bg-amber-500', 'hover:bg-amber-600');
    button.classList.add('bg-red-500', 'hover:bg-red-600');
    
    let currentIdx = 0;
    const tempo = 100; // BPM
    const beatDuration = 60 / tempo * 2; // 2 beats per chord
    
    const playStep = () => {
        // Reset previous highlights
        const badges = document.querySelectorAll(`[data-prog-id="${progId}"] .progression-chord-badge`);
        badges.forEach(b => b.classList.remove('bg-amber-500', 'text-white', 'scale-110'));
        
        // Highlight current chord
        const activeBadge = badges[currentIdx];
        if (activeBadge) {
            activeBadge.classList.add('bg-amber-500', 'text-white', 'scale-110');
        }
        
        // Play chord sound
        const chordKey = chordsList[currentIdx];
        if (CHORDS[chordKey]) {
            synth.playChord(CHORDS[chordKey].frets, beatDuration);
        }
        
        currentIdx = (currentIdx + 1) % chordsList.length;
    };
    
    playStep(); // Play first immediately
    activeProgressionInterval = setInterval(playStep, beatDuration * 1000);
}

function renderProgressions() {
    const grid = document.getElementById('progressionsGrid');
    grid.innerHTML = '';
    
    PROGRESSIONS.forEach(prog => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl p-6 border border-amber-100 shadow-sm flex flex-col justify-between space-y-4';
        card.dataset.progId = prog.id;
        
        const chordsHTML = prog.chords.map(c => `
            <div class="progression-chord-badge flex flex-col items-center p-2 rounded-xl border border-slate-100 bg-slate-50 transition-all duration-300 w-16">
                <span class="font-bold text-lg">${c}</span>
                <span class="text-[10px] text-slate-400">${CHORDS[c] ? CHORDS[c].name.split(' ')[0] : ''}</span>
            </div>
        `).join('');
        
        card.innerHTML = `
            <div class="space-y-2">
                <div class="flex justify-between items-start">
                    <h4 class="font-bold text-xl text-slate-900">${prog.title}</h4>
                    <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">${prog.difficulty}</span>
                </div>
                <p class="text-sm text-slate-500">${prog.description}</p>
            </div>
            
            <div class="flex items-center justify-center gap-3 py-2">
                ${chordsHTML}
            </div>
            
            <div class="flex justify-between items-center pt-2">
                <button class="play-prog-btn bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition flex items-center space-x-2 shadow-md shadow-amber-500/10">
                    <i class="fa-solid fa-play"></i>
                    <span>Jouer la suite</span>
                </button>
                <span class="text-xs text-slate-400 italic">Enchaînement fluide conseillé</span>
            </div>
        `;
        
        const playBtn = card.querySelector('.play-prog-btn');
        playBtn.addEventListener('click', () => playProgression(prog.id, prog.chords, playBtn));
        
        grid.appendChild(card);
    });
}

// 7. Custom Composer Logic
let composerChords = [];
let composerInterval = null;

function renderComposer() {
    const workspace = document.getElementById('composerWorkspace');
    const placeholder = document.getElementById('composerPlaceholder');
    const playBtn = document.getElementById('playComposer');
    
    if (composerChords.length === 0) {
        placeholder.classList.remove('hidden');
        playBtn.disabled = true;
        // Clear previous chord elements
        const badges = workspace.querySelectorAll('.composer-badge');
        badges.forEach(b => b.remove());
        return;
    }
    
    placeholder.classList.add('hidden');
    playBtn.disabled = false;
    
    // Clear previous chord elements
    const badges = workspace.querySelectorAll('.composer-badge');
    badges.forEach(b => b.remove());
    
    composerChords.forEach((chordKey, idx) => {
        const badge = document.createElement('div');
        badge.className = 'composer-badge relative group flex flex-col items-center p-3 rounded-xl border-2 border-amber-300 bg-white shadow-sm w-16 animate-bounce-short';
        badge.innerHTML = `
            <span class="font-bold text-lg text-slate-800">${chordKey}</span>
            <span class="text-[10px] text-slate-400">${CHORDS[chordKey].name.split(' ')[0]}</span>
            <button class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md" onclick="removeComposerChord(${idx})">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;
        workspace.appendChild(badge);
    });
}

window.removeComposerChord = function(idx) {
    composerChords.splice(idx, 1);
    renderComposer();
};

function playComposerProgression() {
    const playBtn = document.getElementById('playComposer');
    const stopBtn = document.getElementById('stopComposer');
    const tempoInput = document.getElementById('composerTempo');
    
    playBtn.classList.add('hidden');
    stopBtn.classList.remove('hidden');
    
    let currentIdx = 0;
    const tempo = parseInt(tempoInput.value);
    const beatDuration = 60 / tempo * 2;
    
    const playStep = () => {
        const badges = document.querySelectorAll('#composerWorkspace .composer-badge');
        badges.forEach(b => b.classList.remove('border-emerald-500', 'bg-emerald-50', 'scale-105'));
        
        const activeBadge = badges[currentIdx];
        if (activeBadge) {
            activeBadge.classList.add('border-emerald-500', 'bg-emerald-50', 'scale-105');
        }
        
        const chordKey = composerChords[currentIdx];
        if (CHORDS[chordKey]) {
            synth.playChord(CHORDS[chordKey].frets, beatDuration);
        }
        
        currentIdx = (currentIdx + 1) % composerChords.length;
    };
    
    playStep();
    composerInterval = setInterval(playStep, beatDuration * 1000);
}

function stopComposerProgression() {
    const playBtn = document.getElementById('playComposer');
    const stopBtn = document.getElementById('stopComposer');
    
    playBtn.classList.remove('hidden');
    stopBtn.classList.add('hidden');
    
    if (composerInterval) clearInterval(composerInterval);
    const badges = document.querySelectorAll('#composerWorkspace .composer-badge');
    badges.forEach(b => b.classList.remove('border-emerald-500', 'bg-emerald-50', 'scale-105'));
}

// 8. Event Listeners & Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Render initial views
    renderChords();
    renderProgressions();
    
    // Filter chords handler
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderChords(btn.dataset.filter);
        });
    });
    
    // Populate Composer Quick Add Buttons
    const quickAddContainer = document.getElementById('composerQuickAdd');
    Object.keys(CHORDS).forEach(key => {
        const btn = document.createElement('button');
        btn.className = 'bg-white hover:bg-amber-100 text-slate-800 border border-amber-200 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm';
        btn.textContent = key;
        btn.addEventListener('click', () => {
            if (composerChords.length < 8) {
                composerChords.push(key);
                renderComposer();
                // Play chord sound on add
                synth.playChord(CHORDS[key].frets);
            } else {
                alert('Vous pouvez ajouter un maximum de 8 accords à votre suite.');
            }
        });
        quickAddContainer.appendChild(btn);
    });
    
    // Composer controls
    document.getElementById('clearComposer').addEventListener('click', () => {
        stopComposerProgression();
        composerChords = [];
        renderComposer();
    });
    
    document.getElementById('playComposer').addEventListener('click', playComposerProgression);
    document.getElementById('stopComposer').addEventListener('click', stopComposerProgression);
    
    const tempoInput = document.getElementById('composerTempo');
    const tempoVal = document.getElementById('tempoVal');
    tempoInput.addEventListener('input', (e) => {
        tempoVal.textContent = `${e.target.value} BPM`;
        if (composerInterval) {
            // Restart with new tempo if already playing
            stopComposerProgression();
            playComposerProgression();
        }
    });
    
    // PWA Installation Prompt
    let deferredPrompt;
    const installBtn = document.getElementById('installBtn');
    
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
});

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker enregistré avec succès !', reg.scope))
            .catch(err => console.log('Échec de l\'enregistrement du Service Worker :', err));
    });
}