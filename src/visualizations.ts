import * as THREE from 'three'
import { AUDIO, AUDIO_TIME_DOMAIN_DATA, AUDIO_FREQUENCY_DATA } from './audio';


export function runVisualizations() {
    if (AUDIO.enabled) {
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        
        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(400, 300)
        document.querySelector<HTMLDivElement>('#audioInfoContainer')!.innerHTML = ''
        document.querySelector<HTMLDivElement>('#audioInfoContainer')!.appendChild(renderer.domElement)
        
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        const cube = new THREE.Mesh(geometry, material)
        scene.add(cube)
        
        camera.position.z = 5
        
        function animate() {
            requestAnimationFrame(animate)
        
            cube.rotation.x += 0.1
            cube.rotation.y += 0.1
        
            renderer.render(scene, camera)
        }
        
        animate()    
    }
}


// await startAudio()

// async function startAudio() {
//   const stream = await navigator.mediaDevices.getUserMedia({ 
//     audio: { 
//       echoCancellation: false,
//       noiseSuppression: false,
//       autoGainControl: true
//     } 
//   });
//   const audioContext = new AudioContext();
//   const source = audioContext.createMediaStreamSource(stream);
  
//   const analyser = audioContext.createAnalyser();
//   analyser.fftSize = 4096; // Larger FFT for better resolution
//   analyser.smoothingTimeConstant = 0.75; // Reduced smoothing for faster response
//   analyser.minDecibels = -80;
//   analyser.maxDecibels = -20;
  
//   source.connect(analyser); 

//   analyser.getFloatFrequencyData(audioFrequencyData);
//   analyser.getFloatTimeDomainData(audioTimeDomainData);

//   function processAudio(): void {
//     const sampleRate = analyser.context.sampleRate;
//     const frequencyResolution = sampleRate / (2 * analyser.frequencyBinCount);
    
//     // Noise floor threshold (adjust based on your environment)
//     const NOISE_THRESHOLD = -75;
//   }

// }