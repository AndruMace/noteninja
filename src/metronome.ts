// Access the input fields and button
const bpmInput = document.getElementById('bpm') as HTMLInputElement;
const toggleButton = document.getElementById('toggleMetronome') as HTMLButtonElement;
const volumeSlider = document.getElementById('volume') as HTMLInputElement;
const bpmSlider = document.getElementById('bpmRange') as HTMLInputElement;

let metronomeInterval: number | null = null;
let isRunning = false;
let audioContext: AudioContext | null = null;
let gainNode: GainNode | null = null;

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
  if (gainNode) {
    const volume = parseInt(volumeSlider.value, 10) / 100; // Convert slider value to a range between 0 and 1
    gainNode.gain.setValueAtTime(volume, audioContext!.currentTime);
  }
});

function startMetronome() {
  const bpm = parseInt(bpmInput.value, 10);

  if (isNaN(bpm) || bpm <= 0) {
    alert('Please enter a valid BPM!');
    return;
  }

  audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(parseInt(volumeSlider.value, 10) / 100, audioContext.currentTime); // Initial volume
  gainNode.connect(audioContext.destination);

  toggleButton.textContent = 'Stop Metronome';
  const intervalDelay = 60000 / bpm;

  // Create the metronome tick using setInterval
  metronomeInterval = setInterval(() => {
    playClickSound(660);
    playClickSound(440);
  }, intervalDelay);

  isRunning = true;
}

function stopMetronome() {
  if (metronomeInterval) {
    clearInterval(metronomeInterval);
  }

  toggleButton.textContent = 'Start Metronome';
  isRunning = false;
}

function playClickSound(frequency = 660) {
  if (audioContext) {
    const click = audioContext.createOscillator();
    // click.type = 'square';
    click.frequency.setValueAtTime(frequency, audioContext.currentTime);  // Higher frequency for click sound

    // Create a GainNode for the click sound volume control
    const clickGainNode = audioContext.createGain();
    const volume = parseInt(volumeSlider.value, 10) / 100; // Convert slider value to a range between 0 and 1
    clickGainNode.gain.setValueAtTime(0, audioContext.currentTime);  // Set click volume based on slider
    clickGainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01)
    clickGainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.05)
    click.connect(clickGainNode);
    clickGainNode.connect(audioContext.destination);

    

    click.start();
    click.stop(audioContext.currentTime + 0.05); // Short click duration
  }
}