// ==========================================
// SPIRITUAL AWAKENING PORTAL SCRIPT
// ==========================================

// Tab Navigation
const tabButtons = document.querySelectorAll('.tab-btn');
const portalSections = document.querySelectorAll('.portal-section');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        portalSections.forEach(section => {
            section.classList.remove('active');
        });
        
        document.getElementById(tabId).classList.add('active');
    });
});

// Practice Button Navigation
const practiceButtons = document.querySelectorAll('.practice-btn');
practiceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const practice = btn.getAttribute('data-practice');
        const tabMapping = {
            'meditation': 'meditation',
            'chakras': 'chakras',
            'aura': 'aura',
            'frequencies': 'frequencies'
        };
        
        const targetTab = tabMapping[practice];
        if (targetTab) {
            const targetBtn = document.querySelector(`[data-tab="${targetTab}"]`);
            if (targetBtn) targetBtn.click();
        }
    });
});

// ==========================================
// WEB AUDIO API SETUP
// ==========================================

const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext;
let currentOscillator = null;
let currentGainNode = null;
let frequencyTimer = null;
let binauralTimer = null;

function initAudioContext() {
    if (!audioContext) {
        audioContext = new AudioContext();
    }
    return audioContext;
}

// ==========================================
// HEALING FREQUENCIES
// ==========================================

const frequencyData = {
    396: { name: "Liberation from Fear", chakra: "Root" },
    417: { name: "Facilitating Change", chakra: "Sacral" },
    528: { name: "DNA Repair & Miracles", chakra: "Solar Plexus" },
    639: { name: "Connection & Relationships", chakra: "Heart" },
    741: { name: "Awakening Intuition", chakra: "Throat" },
    852: { name: "Spiritual Order", chakra: "Third Eye" },
    963: { name: "Divine Consciousness", chakra: "Crown" },
    432: { name: "Universal Harmony", chakra: "All Chakras" }
};

let currentFrequency = null;
let freqStartTime = null;
let freqDuration = 0; // 0 = continuous

const freqPlayButtons = document.querySelectorAll('.freq-play-btn');
const freqStopButton = document.getElementById('freq-stop');
const freqVolumeSlider = document.getElementById('freq-volume');
const freqStatusDisplay = document.getElementById('freq-status');
const freqTimerDisplay = document.getElementById('freq-timer');
const timerButtons = document.querySelectorAll('.timer-btn');

// Timer selection
timerButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        timerButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        freqDuration = parseInt(btn.getAttribute('data-minutes')) * 60;
    });
});

// Play frequency
freqPlayButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const frequency = parseInt(btn.getAttribute('data-frequency'));
        
        if (currentFrequency === frequency) {
            stopFrequency();
        } else {
            playFrequency(frequency);
            btn.classList.add('playing');
        }
    });
});

function playFrequency(freq) {
    stopFrequency();
    
    const ctx = initAudioContext();
    currentFrequency = freq;
    freqStartTime = Date.now();
    
    // Create oscillator
    currentOscillator = ctx.createOscillator();
    currentGainNode = ctx.createGain();
    
    currentOscillator.type = 'sine';
    currentOscillator.frequency.setValueAtTime(freq, ctx.currentTime);
    
    const volume = freqVolumeSlider.value / 100;
    currentGainNode.gain.setValueAtTime(volume, ctx.currentTime);
    
    currentOscillator.connect(currentGainNode);
    currentGainNode.connect(ctx.destination);
    
    currentOscillator.start();
    
    // Update UI
    const data = frequencyData[freq];
    freqStatusDisplay.textContent = `Playing ${freq} Hz - ${data.name}`;
    freqStopButton.disabled = false;
    
    // Start timer
    updateFrequencyTimer();
    frequencyTimer = setInterval(updateFrequencyTimer, 1000);
}

function stopFrequency() {
    if (currentOscillator) {
        currentOscillator.stop();
        currentOscillator.disconnect();
        currentOscillator = null;
    }
    
    if (currentGainNode) {
        currentGainNode.disconnect();
        currentGainNode = null;
    }
    
    if (frequencyTimer) {
        clearInterval(frequencyTimer);
        frequencyTimer = null;
    }
    
    freqPlayButtons.forEach(btn => btn.classList.remove('playing'));
    freqStatusDisplay.textContent = 'Select a frequency to begin';
    freqTimerDisplay.textContent = '00:00';
    freqStopButton.disabled = true;
    currentFrequency = null;
}

function updateFrequencyTimer() {
    if (!freqStartTime) return;
    
    const elapsed = Math.floor((Date.now() - freqStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    freqTimerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // Auto-stop if duration set
    if (freqDuration > 0 && elapsed >= freqDuration) {
        stopFrequency();
    }
}

// Volume control
freqVolumeSlider.addEventListener('input', (e) => {
    if (currentGainNode) {
        const volume = e.target.value / 100;
        currentGainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    }
});

// Stop button
freqStopButton.addEventListener('click', stopFrequency);

// ==========================================
// BINAURAL BEATS
// ==========================================

const binauralWaves = {
    delta: { freq: 2, base: 200, name: "Delta Waves - Deep Sleep" },
    theta: { freq: 6, base: 200, name: "Theta Waves - Deep Meditation" },
    alpha: { freq: 10, base: 200, name: "Alpha Waves - Relaxation" },
    beta: { freq: 20, base: 200, name: "Beta Waves - Focus" },
    gamma: { freq: 40, base: 200, name: "Gamma Waves - Peak Performance" },
    awakening: { freq: 'multi', base: 200, name: "Awakening Protocol" }
};

let currentBinauralWave = null;
let leftOscillator = null;
let rightOscillator = null;
let leftGain = null;
let rightGain = null;
let binauralStartTime = null;

const binauralPlayButtons = document.querySelectorAll('.binaural-play-btn');
const binauralStopButton = document.getElementById('binaural-stop');
const binauralVolumeSlider = document.getElementById('binaural-volume');
const binauralStatusDisplay = document.getElementById('binaural-status');
const binauralTimerDisplay = document.getElementById('binaural-timer');

binauralPlayButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const wave = btn.getAttribute('data-wave');
        
        if (currentBinauralWave === wave) {
            stopBinaural();
        } else {
            playBinaural(wave);
            btn.classList.add('playing');
        }
    });
});

function playBinaural(wave) {
    stopBinaural();
    
    const ctx = initAudioContext();
    const waveData = binauralWaves[wave];
    currentBinauralWave = wave;
    binauralStartTime = Date.now();
    
    if (wave === 'awakening') {
        playAwakeningProtocol();
        return;
    }
    
    // Create stereo binaural beat
    const merger = ctx.createChannelMerger(2);
    
    // Left ear
    leftOscillator = ctx.createOscillator();
    leftGain = ctx.createGain();
    leftOscillator.type = 'sine';
    leftOscillator.frequency.setValueAtTime(waveData.base, ctx.currentTime);
    
    // Right ear (with frequency difference)
    rightOscillator = ctx.createOscillator();
    rightGain = ctx.createGain();
    rightOscillator.type = 'sine';
    rightOscillator.frequency.setValueAtTime(waveData.base + waveData.freq, ctx.currentTime);
    
    // Set volume
    const volume = binauralVolumeSlider.value / 100 * 0.3; // Lower volume for safety
    leftGain.gain.setValueAtTime(volume, ctx.currentTime);
    rightGain.gain.setValueAtTime(volume, ctx.currentTime);
    
    // Connect
    leftOscillator.connect(leftGain);
    leftGain.connect(merger, 0, 0);
    
    rightOscillator.connect(rightGain);
    rightGain.connect(merger, 0, 1);
    
    merger.connect(ctx.destination);
    
    leftOscillator.start();
    rightOscillator.start();
    
    // Update UI
    binauralStatusDisplay.textContent = `Playing ${waveData.name}`;
    binauralStopButton.disabled = false;
    
    // Start timer
    updateBinauralTimer();
    binauralTimer = setInterval(updateBinauralTimer, 1000);
}

function playAwakeningProtocol() {
    binauralStatusDisplay.textContent = 'Awakening Protocol - Multi-Stage Journey';
    binauralStopButton.disabled = false;
    
    // Simplified version - cycles through waves
    const stages = ['delta', 'theta', 'alpha', 'beta', 'gamma'];
    let stageIndex = 0;
    
    function nextStage() {
        if (stageIndex < stages.length) {
            playBinaural(stages[stageIndex]);
            stageIndex++;
            setTimeout(nextStage, 120000); // 2 minutes per stage
        } else {
            stopBinaural();
        }
    }
    
    nextStage();
}

function stopBinaural() {
    if (leftOscillator) {
        leftOscillator.stop();
        leftOscillator.disconnect();
        leftOscillator = null;
    }
    
    if (rightOscillator) {
        rightOscillator.stop();
        rightOscillator.disconnect();
        rightOscillator = null;
    }
    
    if (leftGain) leftGain.disconnect();
    if (rightGain) rightGain.disconnect();
    
    if (binauralTimer) {
        clearInterval(binauralTimer);
        binauralTimer = null;
    }
    
    binauralPlayButtons.forEach(btn => btn.classList.remove('playing'));
    binauralStatusDisplay.textContent = 'Select a brainwave state to begin';
    binauralTimerDisplay.textContent = '00:00';
    binauralStopButton.disabled = true;
    currentBinauralWave = null;
}

function updateBinauralTimer() {
    if (!binauralStartTime) return;
    
    const elapsed = Math.floor((Date.now() - binauralStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    binauralTimerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

binauralVolumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100 * 0.3;
    if (leftGain) leftGain.gain.setValueAtTime(volume, audioContext.currentTime);
    if (rightGain) rightGain.gain.setValueAtTime(volume, audioContext.currentTime);
});

binauralStopButton.addEventListener('click', stopBinaural);

// ==========================================
// GUIDED MEDITATION
// ==========================================

const meditationData = {
    'breath-awareness': {
        title: 'Breath Awareness',
        description: 'Foundation practice - connecting with your breath',
        duration: 600,
        script: [
            { time: 0, text: 'Find a comfortable seated position. Close your eyes gently.' },
            { time: 10, text: 'Begin to notice your natural breath. No need to change it.' },
            { time: 30, text: 'Feel the sensation of air entering your nostrils...' },
            { time: 60, text: 'Notice the rise and fall of your chest and belly...' },
            { time: 120, text: 'When your mind wanders, gently return to the breath...' },
            { time: 300, text: 'You are the awareness observing the breath...' },
            { time: 540, text: 'Begin to deepen your breath. Slowly return to the room...' },
            { time: 580, text: 'When ready, gently open your eyes.' }
        ]
    },
    'body-scan': {
        title: 'Body Scan Relaxation',
        description: 'Release tension and connect with physical sensations',
        duration: 900
    },
    'loving-kindness': {
        title: 'Loving-Kindness (Metta)',
        description: 'Cultivate compassion for self and all beings',
        duration: 720
    },
    'third-eye': {
        title: 'Third Eye Activation',
        description: 'Awaken intuition and inner vision',
        duration: 1200
    },
    'kundalini': {
        title: 'Kundalini Rising',
        description: 'Awaken primal energy at the base of the spine',
        duration: 1500
    },
    'cosmic-consciousness': {
        title: 'Cosmic Consciousness',
        description: 'Merge with the infinite awareness of the universe',
        duration: 1800
    }
};

let currentMeditation = null;
let meditationStartTime = null;
let meditationTimer = null;
let meditationPlaying = false;

const meditationItems = document.querySelectorAll('.meditation-item');
const medPlayButton = document.getElementById('med-play');
const medTitle = document.getElementById('med-title');
const medDescription = document.getElementById('med-description');
const medDuration = document.getElementById('med-duration');
const medCurrentTime = document.getElementById('med-current-time');
const medTotalTime = document.getElementById('med-total-time');
const medProgressFill = document.querySelector('.med-progress-fill');
const meditationMandala = document.querySelector('.meditation-mandala');

meditationItems.forEach(item => {
    item.addEventListener('click', () => {
        const medId = item.getAttribute('data-meditation');
        loadMeditation(medId);
        
        meditationItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

function loadMeditation(medId) {
    stopMeditation();
    
    currentMeditation = meditationData[medId];
    medTitle.textContent = currentMeditation.title;
    medDescription.textContent = currentMeditation.description;
    
    const duration = currentMeditation.duration;
    const minutes = Math.floor(duration / 60);
    medDuration.textContent = `${minutes} minutes`;
    medTotalTime.textContent = formatTime(duration);
    medCurrentTime.textContent = '0:00';
    
    medPlayButton.disabled = false;
}

medPlayButton.addEventListener('click', () => {
    if (meditationPlaying) {
        pauseMeditation();
    } else {
        playMeditation();
    }
});

function playMeditation() {
    if (!currentMeditation) return;
    
    meditationPlaying = true;
    medPlayButton.classList.add('playing');
    meditationMandala.classList.add('playing');
    
    if (!meditationStartTime) {
        meditationStartTime = Date.now();
    }
    
    meditationTimer = setInterval(updateMeditationProgress, 100);
}

function pauseMeditation() {
    meditationPlaying = false;
    medPlayButton.classList.remove('playing');
    meditationMandala.classList.remove('playing');
    
    if (meditationTimer) {
        clearInterval(meditationTimer);
        meditationTimer = null;
    }
}

function stopMeditation() {
    pauseMeditation();
    meditationStartTime = null;
    medProgressFill.style.width = '0%';
    medCurrentTime.textContent = '0:00';
}

function updateMeditationProgress() {
    if (!meditationStartTime || !currentMeditation) return;
    
    const elapsed = (Date.now() - meditationStartTime) / 1000;
    const duration = currentMeditation.duration;
    const progress = Math.min((elapsed / duration) * 100, 100);
    
    medProgressFill.style.width = progress + '%';
    medCurrentTime.textContent = formatTime(Math.floor(elapsed));
    
    if (elapsed >= duration) {
        stopMeditation();
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
}

// ==========================================
// CHAKRA SYSTEM
// ==========================================

const chakraPoints = document.querySelectorAll('.chakra-point');
const chakraCards = document.querySelectorAll('.chakra-card');
const chakraActivateButtons = document.querySelectorAll('.chakra-activate-btn');
const fullSequenceButton = document.getElementById('full-chakra-sequence');

chakraPoints.forEach(point => {
    point.addEventListener('click', () => {
        const chakra = point.getAttribute('data-chakra');
        showChakraCard(chakra);
        
        chakraPoints.forEach(p => p.classList.remove('active'));
        point.classList.add('active');
    });
});

function showChakraCard(chakra) {
    chakraCards.forEach(card => {
        card.classList.remove('active');
        if (card.getAttribute('data-chakra-detail') === chakra) {
            card.classList.add('active');
        }
    });
}

chakraActivateButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const chakra = btn.getAttribute('data-chakra-activate');
        activateChakra(chakra);
    });
});

function activateChakra(chakra) {
    const chakraFrequencies = {
        'root': 396,
        'sacral': 417,
        'solar-plexus': 528,
        'heart': 639,
        'throat': 741,
        'third-eye': 852,
        'crown': 963
    };
    
    const freq = chakraFrequencies[chakra];
    
    // Switch to frequencies tab and play
    const freqTab = document.querySelector('[data-tab="frequencies"]');
    if (freqTab) freqTab.click();
    
    setTimeout(() => {
        playFrequency(freq);
    }, 500);
}

fullSequenceButton.addEventListener('click', () => {
    const chakras = ['root', 'sacral', 'solar-plexus', 'heart', 'throat', 'third-eye', 'crown'];
    let index = 0;
    
    function activateNext() {
        if (index < chakras.length) {
            activateChakra(chakras[index]);
            showChakraCard(chakras[index]);
            index++;
            setTimeout(activateNext, 180000); // 3 minutes per chakra
        }
    }
    
    activateNext();
});

// ==========================================
// AURA PRACTICES
// ==========================================

const auraPracticeButtons = document.querySelectorAll('.aura-practice-btn');
const auraGuidance = document.getElementById('aura-guidance');
const guidanceTitle = document.getElementById('guidance-title');
const guidanceText = document.getElementById('guidance-text');

const auraPractices = {
    'cleansing': {
        title: 'Aura Cleansing Practice',
        steps: [
            'Close your eyes and take three deep breaths...',
            'Visualize a brilliant white light above your head...',
            'See this light cascading down through your aura...',
            'The light dissolves all darkness, negativity, and attachments...',
            'Feel yourself becoming lighter and clearer...',
            'Your aura is now pure, clean, and radiant...'
        ]
    },
    'strengthening': {
        title: 'Aura Strengthening Practice',
        steps: [
            'Stand or sit with your spine straight...',
            'Visualize a protective bubble around you...',
            'This bubble is made of golden light...',
            'It is strong, flexible, and impenetrable...',
            'Only positive energy can pass through...',
            'Your energetic boundaries are now fortified...'
        ]
    },
    'brightening': {
        title: 'Aura Brightening Practice',
        steps: [
            'Connect with your heart center...',
            'Feel love and joy expanding within you...',
            'This positive energy radiates outward...',
            'Your aura becomes brighter and more luminous...',
            'You are raising your vibrational frequency...',
            'You shine with divine light...'
        ]
    },
    'balancing': {
        title: 'Aura Balancing Practice',
        steps: [
            'Scan each layer of your aura...',
            'Notice any areas of imbalance...',
            'Breathe healing energy into these areas...',
            'All layers come into harmony...',
            'Your energy field is perfectly balanced...',
            'You feel centered and aligned...'
        ]
    },
    'protection': {
        title: 'Psychic Protection Practice',
        steps: [
            'Imagine roots growing from your feet into the earth...',
            'Draw up grounding energy from the earth...',
            'Create a shield of purple light around you...',
            'This shield reflects all negative energy...',
            'You are completely protected...',
            'You are safe and sovereign in your energy...'
        ]
    },
    'complete': {
        title: 'Complete Aura Healing',
        steps: [
            'We begin with cleansing - release all that no longer serves...',
            'Now strengthening - build your energetic boundaries...',
            'Brightening - amplify your light and vibration...',
            'Balancing - harmonize all layers of your aura...',
            'Protection - seal your work with divine protection...',
            'You are completely healed, aligned, and radiant...'
        ]
    }
};

auraPracticeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const practice = btn.getAttribute('data-practice');
        startAuraPractice(practice);
    });
});

function startAuraPractice(practiceId) {
    const practice = auraPractices[practiceId];
    guidanceTitle.textContent = practice.title;
    guidanceText.innerHTML = practice.steps.map((step, i) => 
        `<p style="margin-bottom: 1rem; opacity: 0; animation: fadeIn 1s ease ${i * 2}s forwards;">${step}</p>`
    ).join('');
    
    auraGuidance.classList.add('active');
    
    // Scroll to guidance
    auraGuidance.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ==========================================
// CLEANUP ON PAGE UNLOAD
// ==========================================

window.addEventListener('beforeunload', () => {
    stopFrequency();
    stopBinaural();
    stopMeditation();
});

console.log('🕉️ Spiritual Awakening Portal Initialized ✨');
