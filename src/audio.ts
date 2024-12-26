import { runVisualizations } from "./visualizations";
import { setupNoteDetection } from "./tuner";

export const AUDIO_FREQUENCY_DATA: Float32Array = new Float32Array(4096);
export const AUDIO_TIME_DOMAIN_DATA: Float32Array = new Float32Array(4096);

interface Audio {
  context: AudioContext | null;
  source: MediaStreamAudioSourceNode | null;
  analyser: AnalyserNode | null;
  gain: GainNode | null;
  enabled: boolean;
}

export const AUDIO: Audio = {
  context: null,
  source: null,
  analyser: null,
  gain: null,
  enabled: false,
};
runVisualizations();

document.getElementById('beginAudioProcessing')!.addEventListener('click', async () => {
  console.log("Begin Audio Processing");
  await startAudio();
  await setupNoteDetection();
  runVisualizations();
});

async function startAudio() {
  AUDIO.enabled = true;
  const stream = await navigator.mediaDevices.getUserMedia({ 
    audio: { 
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false
    } 
  });
  if (!AUDIO.context) AUDIO.context = new AudioContext();
  AUDIO.source = AUDIO.context.createMediaStreamSource(stream);
  AUDIO.analyser = AUDIO.context.createAnalyser();
  AUDIO.analyser.fftSize = 4096; // Larger FFT for better resolution
  AUDIO.analyser.smoothingTimeConstant = 0.75; // Reduced smoothing for faster response
  AUDIO.analyser.minDecibels = -80;
  AUDIO.analyser.maxDecibels = -20;
  
  AUDIO.source.connect(AUDIO.analyser);

  function monitorAudio() {
    if (!AUDIO.analyser) return;
    AUDIO.analyser.getFloatFrequencyData(AUDIO_FREQUENCY_DATA);
    AUDIO.analyser.getFloatTimeDomainData(AUDIO_TIME_DOMAIN_DATA);
    requestAnimationFrame(monitorAudio);
  }
  monitorAudio();
}