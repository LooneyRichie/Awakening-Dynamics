// Navigation
const navButtons = document.querySelectorAll('.nav-btn');
const modelSections = document.querySelectorAll('.model-section');

// Store initialization functions
const initFunctions = {
    'logistic': null,
    'contagion': null,
    'resistance': null,
    'threshold': null,
    'quantum': null
};

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const modelId = btn.getAttribute('data-model');
        
        // Update active states
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        modelSections.forEach(section => {
            section.classList.remove('active');
        });
        
        document.getElementById(modelId).classList.add('active');
        
        // Reinitialize the canvas for the newly visible section
        setTimeout(() => {
            if (initFunctions[modelId]) {
                initFunctions[modelId]();
            }
        }, 50);
    });
});

// Canvas Setup
function setupCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error('Canvas not found:', canvasId);
        return null;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Get parent width (fallback to 1000 if hidden)
    const parent = canvas.parentElement;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width > 0 ? rect.width : (parent.offsetWidth || 1000);
    const height = 400;
    
    // Set canvas size with proper resolution
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    
    // Set display size
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    
    return { canvas, ctx, width, height };
}

// Logistic Model
function initLogisticModel() {
    const setup = setupCanvas('logistic-canvas');
    if (!setup) return;
    
    const { canvas, ctx, width, height } = setup;
    const rSlider = document.getElementById('r-slider');
    const kSlider = document.getElementById('k-slider');
    const rValue = document.getElementById('r-value');
    const kValue = document.getElementById('k-value');
    const resetBtn = document.getElementById('reset-logistic');
    
    if (!rSlider || !kSlider) return;
    
    let animationId;
    let time = 0;
    let data = [];
    
    function logisticGrowth(A, r, K) {
        return r * A * (1 - A / K);
    }
    
    function drawGraph() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 10; i++) {
            const y = (height / 10) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Draw curve
        if (data.length > 1) {
            ctx.strokeStyle = '#6366f1';
            ctx.lineWidth = 3;
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(99, 102, 241, 0.8)';
            
            ctx.beginPath();
            ctx.moveTo(0, height - (data[0] / 100) * height);
            
            for (let i = 1; i < data.length; i++) {
                const x = (i / data.length) * width;
                const y = height - (data[i] / 100) * height;
                ctx.lineTo(x, y);
            }
            
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
        
        // Draw current point
        if (data.length > 0) {
            const lastValue = data[data.length - 1];
            const x = ((data.length - 1) / data.length) * width;
            const y = height - (lastValue / 100) * height;
            
            ctx.fillStyle = '#a855f7';
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        
        // Draw labels
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.fillText('Time →', width - 60, height - 10);
        ctx.fillText('Awakened', 10, 20);
    }
    
    function animate() {
        const r = parseFloat(rSlider.value);
        const K = parseFloat(kSlider.value);
        
        if (data.length === 0) {
            data.push(1);
        }
        
        const currentA = data[data.length - 1];
        const dA = logisticGrowth(currentA, r, K);
        const newA = Math.max(0, Math.min(K, currentA + dA * 0.1));
        
        data.push(newA);
        
        if (data.length > 200) {
            data.shift();
        }
        
        drawGraph();
        
        time++;
        if (time < 500) {
            animationId = requestAnimationFrame(animate);
        }
    }
    
    function reset() {
        cancelAnimationFrame(animationId);
        time = 0;
        data = [];
        ctx.clearRect(0, 0, width, height);
        animate();
    }
    
    rSlider.addEventListener('input', (e) => {
        rValue.textContent = e.target.value;
        reset();
    });
    
    kSlider.addEventListener('input', (e) => {
        kValue.textContent = e.target.value;
        reset();
    });
    
    resetBtn.addEventListener('click', reset);
    
    animate();
}

// Store the function
initFunctions['logistic'] = initLogisticModel;

// Contagion Model
function initContagionModel() {
    const setup = setupCanvas('contagion-canvas');
    if (!setup) return;
    
    const { canvas, ctx, width, height } = setup;
    const betaSlider = document.getElementById('beta-slider');
    const nSlider = document.getElementById('n-slider');
    const betaValue = document.getElementById('beta-value');
    const nValue = document.getElementById('n-value');
    const resetBtn = document.getElementById('reset-contagion');
    
    if (!betaSlider || !nSlider) return;
    
    let animationId;
    let time = 0;
    let data = [];
    
    function contagionGrowth(A, beta, N) {
        return beta * A * (N - A);
    }
    
    function drawGraph() {
        ctx.clearRect(0, 0, width, height);
        
        const N = parseFloat(nSlider.value);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 10; i++) {
            const y = (height / 10) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Draw curve
        if (data.length > 1) {
            ctx.strokeStyle = '#a855f7';
            ctx.lineWidth = 3;
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
            
            ctx.beginPath();
            ctx.moveTo(0, height - (data[0] / N) * height);
            
            for (let i = 1; i < data.length; i++) {
                const x = (i / data.length) * width;
                const y = height - (data[i] / N) * height;
                ctx.lineTo(x, y);
            }
            
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
        
        // Draw current point
        if (data.length > 0) {
            const lastValue = data[data.length - 1];
            const x = ((data.length - 1) / data.length) * width;
            const y = height - (lastValue / N) * height;
            
            ctx.fillStyle = '#ec4899';
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(236, 72, 153, 0.8)';
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    function animate() {
        const beta = parseFloat(betaSlider.value);
        const N = parseFloat(nSlider.value);
        
        if (data.length === 0) {
            data.push(5);
        }
        
        const currentA = data[data.length - 1];
        const dA = contagionGrowth(currentA, beta, N);
        const newA = Math.max(0, Math.min(N, currentA + dA));
        
        data.push(newA);
        
        if (data.length > 200) {
            data.shift();
        }
        
        drawGraph();
        
        time++;
        if (time < 500) {
            animationId = requestAnimationFrame(animate);
        }
    }
    
    function reset() {
        cancelAnimationFrame(animationId);
        time = 0;
        data = [];
        ctx.clearRect(0, 0, width, height);
        animate();
    }
    
    betaSlider.addEventListener('input', (e) => {
        betaValue.textContent = e.target.value;
        reset();
    });
    
    nSlider.addEventListener('input', (e) => {
        nValue.textContent = e.target.value;
        reset();
    });
    
    resetBtn.addEventListener('click', reset);
    
    animate();
}

// Store the function
initFunctions['contagion'] = initContagionModel;

// Resistance Model
function initResistanceModel() {
    const setup = setupCanvas('resistance-canvas');
    if (!setup) return;
    
    const { canvas, ctx, width, height } = setup;
    const rSlider = document.getElementById('r-resist-slider');
    const gammaSlider = document.getElementById('gamma-slider');
    const rValue = document.getElementById('r-resist-value');
    const gammaValue = document.getElementById('gamma-value');
    const resetBtn = document.getElementById('reset-resistance');
    
    if (!rSlider || !gammaSlider) return;
    
    let animationId;
    let time = 0;
    let data = [];
    const K = 100;
    
    function resistanceGrowth(A, r, gamma, K) {
        return r * A * (1 - A / K) - gamma * A;
    }
    
    function drawGraph() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 10; i++) {
            const y = (height / 10) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Draw zero line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw curve
        if (data.length > 1) {
            ctx.strokeStyle = '#ec4899';
            ctx.lineWidth = 3;
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(236, 72, 153, 0.8)';
            
            ctx.beginPath();
            const firstY = height - (data[0] / K) * height;
            ctx.moveTo(0, Math.max(0, Math.min(height, firstY)));
            
            for (let i = 1; i < data.length; i++) {
                const x = (i / data.length) * width;
                const y = height - (data[i] / K) * height;
                ctx.lineTo(x, Math.max(0, Math.min(height, y)));
            }
            
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
        
        // Draw current point
        if (data.length > 0) {
            const lastValue = data[data.length - 1];
            const x = ((data.length - 1) / data.length) * width;
            const y = height - (lastValue / K) * height;
            
            ctx.fillStyle = '#6366f1';
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(99, 102, 241, 0.8)';
            ctx.beginPath();
            ctx.arc(x, Math.max(0, Math.min(height, y)), 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    function animate() {
        const r = parseFloat(rSlider.value);
        const gamma = parseFloat(gammaSlider.value);
        
        if (data.length === 0) {
            data.push(10);
        }
        
        const currentA = data[data.length - 1];
        const dA = resistanceGrowth(currentA, r, gamma, K);
        const newA = Math.max(0, Math.min(K, currentA + dA * 0.1));
        
        data.push(newA);
        
        if (data.length > 200) {
            data.shift();
        }
        
        drawGraph();
        
        time++;
        if (time < 500) {
            animationId = requestAnimationFrame(animate);
        }
    }
    
    function reset() {
        cancelAnimationFrame(animationId);
        time = 0;
        data = [];
        ctx.clearRect(0, 0, width, height);
        animate();
    }
    
    rSlider.addEventListener('input', (e) => {
        rValue.textContent = e.target.value;
        reset();
    });
    
    gammaSlider.addEventListener('input', (e) => {
        gammaValue.textContent = e.target.value;
        reset();
    });
    
    resetBtn.addEventListener('click', reset);
    
    animate();
}

// Store the function
initFunctions['resistance'] = initResistanceModel;

// Threshold Model
function initThresholdModel() {
    const setup = setupCanvas('threshold-canvas');
    if (!setup) return;
    
    const { canvas, ctx, width, height } = setup;
    const thetaSlider = document.getElementById('theta-slider');
    const densitySlider = document.getElementById('density-slider');
    const thetaValue = document.getElementById('theta-value');
    const densityValue = document.getElementById('density-value');
    const resetBtn = document.getElementById('reset-threshold');
    
    if (!thetaSlider || !densitySlider) return;
    
    let animationId;
    let nodes = [];
    const nodeCount = 50;
    
    class Node {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.awakened = false;
            this.neighbors = [];
            this.radius = 8;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            
            if (this.awakened) {
                ctx.fillStyle = '#a855f7';
                ctx.shadowBlur = 15;
                ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
            } else {
                ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
                ctx.shadowBlur = 0;
            }
            
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        
        checkThreshold(theta) {
            const awakenedNeighbors = this.neighbors.filter(n => n.awakened).length;
            if (awakenedNeighbors >= theta) {
                this.awakened = true;
            }
        }
    }
    
    function initNodes() {
        nodes = [];
        const padding = 30;
        
        for (let i = 0; i < nodeCount; i++) {
            const x = padding + Math.random() * (width - 2 * padding);
            const y = padding + Math.random() * (height - 2 * padding);
            nodes.push(new Node(x, y));
        }
        
        // Seed initial awakened nodes
        for (let i = 0; i < 3; i++) {
            nodes[i].awakened = true;
        }
        
        updateNeighbors();
    }
    
    function updateNeighbors() {
        const density = parseFloat(densitySlider.value);
        const maxDistance = Math.sqrt(width * height) * density;
        
        nodes.forEach(node => {
            node.neighbors = [];
            nodes.forEach(other => {
                if (node !== other) {
                    const dist = Math.hypot(node.x - other.x, node.y - other.y);
                    if (dist < maxDistance) {
                        node.neighbors.push(other);
                    }
                }
            });
        });
    }
    
    function drawConnections() {
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
        ctx.lineWidth = 1;
        
        nodes.forEach(node => {
            node.neighbors.forEach(neighbor => {
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(neighbor.x, neighbor.y);
                ctx.stroke();
            });
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        const theta = parseInt(thetaSlider.value);
        
        // Draw connections
        drawConnections();
        
        // Update nodes
        const nodesToCheck = [...nodes];
        nodesToCheck.forEach(node => {
            if (!node.awakened) {
                node.checkThreshold(theta);
            }
        });
        
        // Draw nodes
        nodes.forEach(node => node.draw());
        
        // Check if all nodes are awakened
        const allAwakened = nodes.every(n => n.awakened);
        if (!allAwakened) {
            animationId = requestAnimationFrame(animate);
        }
    }
    
    function reset() {
        cancelAnimationFrame(animationId);
        initNodes();
        animate();
    }
    
    thetaSlider.addEventListener('input', (e) => {
        thetaValue.textContent = e.target.value;
        reset();
    });
    
    densitySlider.addEventListener('input', (e) => {
        densityValue.textContent = e.target.value;
        updateNeighbors();
        reset();
    });
    
    resetBtn.addEventListener('click', reset);
    
    initNodes();
    animate();
}

// Store the function
initFunctions['threshold'] = initThresholdModel;

// Quantum Model
function initQuantumModel() {
    const setup = setupCanvas('quantum-canvas');
    if (!setup) return;
    
    const { canvas, ctx, width, height } = setup;
    const omegaSlider = document.getElementById('omega-slider');
    const alphaSlider = document.getElementById('alpha-slider');
    const omegaValue = document.getElementById('omega-value');
    const alphaValue = document.getElementById('alpha-value');
    const resetBtn = document.getElementById('reset-quantum');
    
    if (!omegaSlider || !alphaSlider) return;
    
    let animationId;
    let time = 0;
    let data = [];
    const maxValue = 100;
    
    function sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }
    
    function quantumJump(A, omega, alpha, t, phi = 0) {
        return A + alpha * sigmoid(omega * t - phi);
    }
    
    function drawGraph() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 10; i++) {
            const y = (height / 10) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Draw wave pattern
        if (data.length > 1) {
            // Create gradient for wave
            const gradient = ctx.createLinearGradient(0, 0, width, 0);
            gradient.addColorStop(0, '#6366f1');
            gradient.addColorStop(0.5, '#a855f7');
            gradient.addColorStop(1, '#ec4899');
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3;
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(168, 85, 247, 0.6)';
            
            ctx.beginPath();
            ctx.moveTo(0, height - (data[0] / maxValue) * height);
            
            for (let i = 1; i < data.length; i++) {
                const x = (i / data.length) * width;
                const y = height - (data[i] / maxValue) * height;
                ctx.lineTo(x, y);
            }
            
            ctx.stroke();
            ctx.shadowBlur = 0;
            
            // Fill area under curve
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
            
            const fillGradient = ctx.createLinearGradient(0, 0, 0, height);
            fillGradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
            fillGradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
            ctx.fillStyle = fillGradient;
            ctx.fill();
        }
        
        // Draw quantum jumps as pulses
        for (let i = 0; i < data.length - 1; i++) {
            const diff = data[i + 1] - data[i];
            if (diff > 2) {
                const x = (i / data.length) * width;
                const y = height - (data[i] / maxValue) * height;
                
                ctx.fillStyle = '#ec4899';
                ctx.shadowBlur = 20;
                ctx.shadowColor = 'rgba(236, 72, 153, 1)';
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    }
    
    function animate() {
        const omega = parseFloat(omegaSlider.value);
        const alpha = parseFloat(alphaSlider.value);
        
        if (data.length === 0) {
            data.push(0);
        }
        
        const t = time * 0.1;
        const currentA = data[data.length - 1];
        const newA = Math.min(maxValue, quantumJump(currentA, omega, alpha, t, 0));
        
        data.push(newA);
        
        if (data.length > 200) {
            data.shift();
        }
        
        drawGraph();
        
        time++;
        if (time < 500 && data[data.length - 1] < maxValue * 0.95) {
            animationId = requestAnimationFrame(animate);
        }
    }
    
    function reset() {
        cancelAnimationFrame(animationId);
        time = 0;
        data = [];
        ctx.clearRect(0, 0, width, height);
        animate();
    }
    
    omegaSlider.addEventListener('input', (e) => {
        omegaValue.textContent = e.target.value;
        reset();
    });
    
    alphaSlider.addEventListener('input', (e) => {
        alphaValue.textContent = e.target.value;
        reset();
    });
    
    resetBtn.addEventListener('click', reset);
    
    animate();
}

// Store the function
initFunctions['quantum'] = initQuantumModel;

// Initialize all models on page load
window.addEventListener('load', () => {
    console.log('Initializing models...');
    initLogisticModel();
    initContagionModel();
    initResistanceModel();
    initThresholdModel();
    initQuantumModel();
    console.log('Models initialized!');
});

// Handle window resize
window.addEventListener('resize', () => {
    setTimeout(() => {
        initLogisticModel();
        initContagionModel();
        initResistanceModel();
        initThresholdModel();
        initQuantumModel();
    }, 100);
});
