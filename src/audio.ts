import * as THREE from 'three'

let audioFrequencyData: Float32Array = new Float32Array(4096);
let audioTimeDomainData: Float32Array = new Float32Array(4096);

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
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

await setupAudio()

async function setupAudio() {
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

  analyser.getFloatFrequencyData(audioFrequencyData);
  analyser.getFloatTimeDomainData(audioTimeDomainData);
}