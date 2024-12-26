import * as THREE from 'three'
import { AUDIO_TIME_DOMAIN_DATA, AUDIO_FREQUENCY_DATA, AUDIO } from './audio';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function runVisualizations() {
    if (AUDIO.enabled) {
    // if (true) {
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        
        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(900, 620)
        document.querySelector<HTMLDivElement>('#audioInfoContainer')!.innerHTML = ''
        document.querySelector<HTMLDivElement>('#audioInfoContainer')!.appendChild(renderer.domElement)
        

        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        );
        scene.add(cube);

        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(10, 30, 10);
        scene.add(light);
      
        const ambientLight = new THREE.AmbientLight(0x404040, 100); // Soft ambient light
        scene.add(ambientLight);
        
        camera.position.set(0, 0, 3);
        // camera.position.set(0, 20, 40);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        function animate() {
            requestAnimationFrame(animate);
    
        
            // Map audio data to grid
            // let i = 0;
            // for (let x = 0; x < gridWidth; x++) {
            //   for (let z = 0; z < gridDepth; z++) {
            //     const freqValue = Math.abs(AUDIO_FREQUENCY_DATA[x % AUDIO_FREQUENCY_DATA.length]) / 100;
            //     const timeValue = Math.abs(AUDIO_TIME_DOMAIN_DATA[z % AUDIO_TIME_DOMAIN_DATA.length]) / 128;
            //     const amplitude = Math.max(freqValue, timeValue); // Blend amplitude and frequency
            //     cubes[i].scale.y = amplitude * 10;
            //     cubes[i].position.y = (amplitude * 10) / 2;
            //     i++;
            //   }
            // }
            let sum = 0;
            for (let i = 0; i < AUDIO_TIME_DOMAIN_DATA.length; i++) {
                sum += AUDIO_TIME_DOMAIN_DATA[i] ** 2;
            }        
            renderer.render(scene, camera);
        }
        
        animate()    
    }
}