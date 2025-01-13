import * as THREE from 'three'

const scale = ['E', 'A', 'B', 'C', 'D', 'E', 'F'];

const time_samples = 1200; // X resolution
let frequency_samples = 512; // Y resolution

let n_vertices = (frequency_samples+1) * (time_samples+1);
let xsegments = time_samples;
let ysegments = frequency_samples;
let xsize = 35; 
let ysize = 20;
let xhalfSize = xsize/2;
let yhalfSize = ysize / 2;
let xsegmentSize = xsize / xsegments; //Size of one square
let ysegmentSize = ysize / ysegments;


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 64;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(500, 500);
document.querySelector<HTMLCanvasElement>('#spectrogram')!.appendChild(renderer.domElement);

let frequencySamples = 512;
let DATA = new Uint8Array(frequencySamples);

export function runVisualizations() {
    let geometry = new THREE.BufferGeometry();
    let indices = []
    let heights = []
    let vertices = []

    for (let i =0; i <= xsegments; i++) {
        let x = (i * xsegmentSize) - xhalfSize;
        for (let j = 0; j <= ysegments; j++) {
            let y = (j * ysegmentSize) - yhalfSize;
            vertices.push(x, y, 0);
            heights.push(0);
        }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    for (let i = 0; i < xsegments; i++) {
        for (let j = 0; j < ysegments; j++) {
            let a = i * (ysegments + 1) + (j + 1);
            let b = i * (ysegments + 1) + j;
            let c = (i + 1) * (ysegments + 1) + j;
            let d = (i + 1) * (ysegments + 1) + (j + 1);
            // Face 1
            indices.push(a, b, d);
            // Face 2
            indices.push(b, c, d);
        }
    }

    geometry.setIndex(indices);

    let material = new THREE.MeshBasicMaterial({color:"purple"});
	let mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

    renderer.render(scene, camera);
}