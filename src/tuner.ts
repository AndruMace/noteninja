// Frequency ranges for guitar strings (in Hz)
const NOTES = {
    // 2nd Octave (thick E string open)
    'E2': 82.41,
    'F2': 87.31,
    'F#2': 92.50,
    'G2': 98.00,
    'G#2': 103.83,
    'A2': 110.00,
    'A#2': 116.54,
    'B2': 123.47,
    
    // 3rd Octave
    'C3': 130.81,
    'C#3': 138.59,
    'D3': 146.83,
    'D#3': 155.56,
    'E3': 164.81,
    'F3': 174.61,
    'F#3': 185.00,
    'G3': 196.00,
    'G#3': 207.65,
    'A3': 220.00,
    'A#3': 233.08,
    'B3': 246.94,
    
    // 4th Octave
    'C4': 261.63,
    'C#4': 277.18,
    'D4': 293.66,
    'D#4': 311.13,
    'E4': 329.63,
    'F4': 349.23,
    'F#4': 369.99,
    'G4': 392.00,
    'G#4': 415.30,
    'A4': 440.00,
    'A#4': 466.16,
    'B4': 493.88,
    
    // 5th Octave
    'C5': 523.25,
    'C#5': 554.37,
    'D5': 587.33,
    'D#5': 622.25,
    'E5': 659.26,
    'F5': 698.46,
    'F#5': 739.99,
    'G5': 783.99,
    'G#5': 830.61,
    'A5': 880.00,
    'A#5': 932.33,
    'B5': 987.77,
    
    // 6th Octave (highest notes, 24th fret territory)
    'C6': 1046.50,
    'C#6': 1108.73,
    'D6': 1174.66,
    'D#6': 1244.51,
    'E6': 1318.51
};

function detectNote(analyserNode: AnalyserNode) {
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    analyserNode.getFloatFrequencyData(dataArray);
    
    const sampleRate = analyserNode.context.sampleRate;
    const frequencyResolution = sampleRate / (2 * bufferLength);
    
    // Noise floor threshold (adjust based on your environment)
    const NOISE_THRESHOLD = -75;
    
    // Find peaks above noise threshold
    const peaks = [];
    for (let i = 2; i < bufferLength - 2; i++) {
        if (dataArray[i] > NOISE_THRESHOLD &&
            dataArray[i] > dataArray[i - 1] &&
            dataArray[i] > dataArray[i - 2] &&
            dataArray[i] > dataArray[i + 1] &&
            dataArray[i] > dataArray[i + 2]) {
            
            // Quadratic interpolation for more precise frequency estimation
            const alpha = dataArray[i - 1];
            const beta = dataArray[i];
            const gamma = dataArray[i + 1];
            const peakOffset = 0.5 * (alpha - gamma) / (alpha - 2*beta + gamma);
            const interpolatedBin = i + peakOffset;
            
            peaks.push({
                frequency: interpolatedBin * frequencyResolution,
                amplitude: beta,
                // Clarity measure: how much stronger is this peak compared to neighbors
                clarity: beta - Math.max(dataArray[i-2], dataArray[i+2])
            });
        }
    }
    
    // Sort peaks by amplitude and take the strongest that's in guitar range
    peaks.sort((a, b) => b.amplitude - a.amplitude);
    const validPeaks = peaks.filter(peak => 
        peak.frequency >= 70 && // Lowest guitar note (E2)
        peak.frequency <= 500 && // Highest note we care about (E4) <-- no longer true I increased it but reference in case it doesn't work
        peak.clarity > 10 // Minimum peak prominence
    );
    
    if (validPeaks.length === 0) {
        return null; // No clear note detected
    }
    
    const strongestPeak = validPeaks[0];
    
    // Find the closest note using a more sophisticated comparison
    let closestNote = null;
    let minCents = Infinity;
    
    for (const [note, frequency] of Object.entries(NOTES)) {
        const cents = 1200 * Math.log2(strongestPeak.frequency / frequency);
        if (Math.abs(cents) < Math.abs(minCents)) {
            minCents = cents;
            closestNote = note;
        }
    }
    
    // Calculate confidence based on multiple factors
    const confidence = Math.min(100, Math.max(0,
        // Convert dB to a 0-100 scale
        (strongestPeak.amplitude + 100) * 1.5 +
        // Bonus for clear peaks
        strongestPeak.clarity * 2 +
        // Penalty for being far from true note
        (50 - Math.abs(minCents))
    ));
    
    return {
        note: closestNote,
        frequency: strongestPeak.frequency,
        cents: minCents,
        confidence: confidence,
        amplitude: strongestPeak.amplitude
    };
}

async function setupNoteDetection() {
    const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: true
        } 
    });
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 4096; // Larger FFT for better resolution
    analyser.smoothingTimeConstant = 0.75; // Reduced smoothing for faster response
    analyser.minDecibels = -80;
    analyser.maxDecibels = -20;
    
    source.connect(analyser);
    
    function detect() {
        const result = detectNote(analyser);
        if (result && result.confidence > 40) {  // Only show confident detections
            document.querySelector<HTMLSpanElement>('#detectedNote')!.innerHTML = 
            `Detected Note: ${result.note}\n
            Frequency: ${result.frequency.toFixed(1)}Hz
            `;
            console.log(
                `Note: ${result.note} | ` +
                `Freq: ${result.frequency.toFixed(1)}Hz | ` +
                `Cents off: ${result.cents.toFixed(1)} | ` +
                `Confidence: ${result.confidence.toFixed(1)}%`
            );
        }
        requestAnimationFrame(detect);
    }
    
    detect();
}

setupNoteDetection();