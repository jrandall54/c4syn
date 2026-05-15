import './style.css'

const app = document.getElementById('app')! as HTMLDivElement
app.innerHTML = '<h1>c4syn</h1><div id="controls"></div>'

const controls = document.getElementById('controls')! as HTMLDivElement

const playBtn = document.createElement('button') as HTMLButtonElement
playBtn.id = 'play'; 
playBtn.textContent = 'Play';

const stopBtn = document.createElement('button') as HTMLButtonElement
stopBtn.id = 'stop';
stopBtn.textContent = 'Stop';

controls.appendChild(playBtn);
controls.appendChild(stopBtn);

let audioCtx: AudioContext | null = null;
let osc: OscillatorNode | null = null;
let masterGain: GainNode | null = null;

playBtn.addEventListener('click', async () => { /* will create AudioContext and start nodes here */ 
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    await audioCtx.resume();
  }
});