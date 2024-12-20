import './style.css'
// import 'audio.ts'

// Create and append initial HTML structure
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Note Ninja</h1>
    <div></div>
    <div class="container" id="metronomeContainer">
      <div class="metronome" id="metronome">
        <h3>Metronome</h3>
        <label for="bpm">BPM</label>
        <input type="text" id="bpm" value="60" />
        <input type="range" id="bpmRange" min="0" max="150" value="60" />
        <button id="toggleMetronome">I/O</button>
        <label for="volume">Volume</label>
        <input type="range" id="volume" min="0" max="100" value="15" />
      </div>
    </div>
    <div class="container" id="tunerContainer">
      <div class="tuner" id="tuner">
        <h3>Tuner</h3>
        <span id="detectedNote">Detected Note: None yet!</span>
      </div>
    </div>
    <div></div>
  </div>
`
