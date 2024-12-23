import './style.css'
// import 'audio.ts'

// Create and append initial HTML structure 
document.querySelector<HTMLDivElement>('#app')!.innerHTML = /*html*/`
  <div class="app">
    <h1>Note Ninja</h1>
    <div class="controlBar" id="controlBar">
      <div class="innerContainer" id="mic">
        <h3>Mic</h3>
        <button id="micButton">Begin</button>
      </div>
      <div class="innerContainer" id="metronome">
        <audio src="/snare1.mp3" id="snare"></audio>
        <h3>Metronome</h3>
        <label for="bpm">BPM</label>
        <input type="text" id="bpm" value="60" />
        <div>
          <button id="minBmp">-15 BPM</button>
          <input type="range" id="bpmRange" min="0" max="150" value="60" />
          <button id="addBmp">+15 BPM</button>
        </div>
        <button id="toggleMetronome">></button>
        <label for="volume">Volume</label>
        <input type="range" id="volume" min="1" max="100" value="15" />
      </div>
      <div class="innerContainer">
        <div class="tuner" id="tuner">
          <h3>Tuner</h3>
          <span id="detectedNote">Detected Note: None yet!</span>
        </div>
      </div>
    </div>
    <div class="mainContainer">
      <div class="container" id="audioInfoContainer">\
        <button id="beginAudioProcessing">Begin Audio Processing</button>
      </div>
      <div class="container" id="gameContainer">
      </div>
    </div>
  </div>
`
