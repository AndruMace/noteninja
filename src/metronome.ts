import { AUDIO } from './audio';

// Access the input fields and button
const bpmInput = document.getElementById('bpm') as HTMLInputElement;
const toggleButton = document.getElementById('toggleMetronome') as HTMLButtonElement;
const volumeSlider = document.getElementById('volume') as HTMLInputElement;
const bpmSlider = document.getElementById('bpmRange') as HTMLInputElement;

let metronomeInterval: number | null = null;
let isRunning = false;

let snareElement = document.getElementById('snare') as HTMLAudioElement;
let snareTrack: MediaElementAudioSourceNode | null = null;

let snareBuffer: AudioBuffer | null = null;

document.getElementById('minBmp')!.addEventListener('click', () => {
  bpmInput.value = String(parseInt(bpmInput.value, 10) - 15);
  if (isRunning) {
    stopMetronome();
    startMetronome();
  }
})

document.getElementById('addBmp')!.addEventListener('click', () => {
  bpmInput.value = String(parseInt(bpmInput.value, 10) + 15);
  if (isRunning) {
    stopMetronome();
    startMetronome();
  }
})

bpmSlider.addEventListener('input', () => {
    bpmInput.value = bpmSlider.value;

    if (isRunning) {
        stopMetronome();
        startMetronome();
    }
    
})

toggleButton.addEventListener('click', () => {
  console.log('click')  
  if (isRunning) {
    stopMetronome();
  } else {
    startMetronome();
  }
});

volumeSlider.addEventListener('input', () => {
  if (AUDIO.gain) {
    const volume = parseInt(volumeSlider.value, 10) / 100; // Convert slider value to a range between 0 and 1
    AUDIO.gain.gain.setValueAtTime(volume, AUDIO.context!.currentTime);
  }
});

function startMetronome() {
  const bpm = parseInt(bpmInput.value, 10);

  if (isNaN(bpm) || bpm <= 0) {
    alert('Please enter a valid BPM!');
    return;
  }

  if (!AUDIO.context) AUDIO.context = new AudioContext();
  if (!snareBuffer) {
    fetch('/snare1.mp3')
    .then(response => response.arrayBuffer())
    .then(data => AUDIO.context!.decodeAudioData(data))
    .then(decodedBuffer => snareBuffer = decodedBuffer);
  }
  if (!snareTrack) snareTrack = AUDIO.context!.createMediaElementSource(snareElement)

  if (!AUDIO.gain && AUDIO.context) AUDIO.gain = AUDIO.context.createGain();

  if (AUDIO.gain) {
    AUDIO.gain.gain.setValueAtTime(parseInt(volumeSlider.value, 10) / 100, AUDIO.context.currentTime); // Initial volume
    AUDIO.gain.connect(AUDIO.context.destination);
  };


  toggleButton.textContent = '||';

  const intervalDelay = 60000 / bpm;

  metronomeInterval = setInterval(() => {
    playSnareSound()
  }, intervalDelay);

  isRunning = true;
}

function stopMetronome() {
  if (metronomeInterval) {
    clearInterval(metronomeInterval);
  }

  toggleButton.textContent = '>';
  isRunning = false;
  snareBuffer = null;
}

function playSnareSound() {
  if (!AUDIO.context || !snareBuffer || !AUDIO.gain) return;

  const bufferSource = AUDIO.context.createBufferSource();
  bufferSource.buffer = snareBuffer; // Preloaded snare sound buffer

  bufferSource.connect(AUDIO.gain);
  bufferSource.start();
}