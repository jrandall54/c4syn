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

const gainLabel = document.createElement('label');
gainLabel.textContent = 'Gain: ';

const gainSlider = document.createElement('input') as HTMLInputElement;
gainSlider.type = 'range';
gainSlider.min = '0';
gainSlider.step = '0.01';
gainSlider.value = '0.2';
gainSlider.max = '1';

const waveformSelect = document.createElement('select') as HTMLSelectElement;

const sineOption = document.createElement('option');
sineOption.value = 'sine';
sineOption.textContent = "Sine";
waveformSelect.appendChild(sineOption);

const squareOption = document.createElement('option');
squareOption.value = 'square';
squareOption.textContent = "Square";
waveformSelect.appendChild(squareOption);

const sawOption = document.createElement('option');
sawOption.value = 'sawtooth';
sawOption.textContent = "Saw";
waveformSelect.appendChild(sawOption);

const triangleOption = document.createElement('option');
triangleOption.value = 'triangle';
triangleOption.textContent = "Triangle";
waveformSelect.appendChild(triangleOption);

controls.appendChild(playBtn);
controls.appendChild(stopBtn);
controls.appendChild(gainLabel);
controls.appendChild(gainSlider);
controls.appendChild(waveformSelect);

let audioCtx: AudioContext | null = null;
let osc: OscillatorNode | null = null;
let masterGain: GainNode | null = null;

playBtn.addEventListener('click', async () => { /* will create AudioContext and start nodes here */ 
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    await audioCtx.resume();
  }

  masterGain = audioCtx.createGain();
  masterGain.connect(audioCtx.destination);
  masterGain.gain.value = 0.2;
  
  
  osc = audioCtx.createOscillator();
  osc.type = waveformSelect.value as OscillatorType;
  osc.connect(masterGain);
  osc.start();
});

stopBtn.addEventListener('click', () => { /* stop logic goes here */
  if (osc) {
    try { osc?.stop(); } catch {}
    osc.disconnect();
    osc = null;
  }

  if (masterGain) {
    masterGain.disconnect();
    masterGain = null;
  } 
});

gainSlider.addEventListener('input', () => {
  if (masterGain) {
    masterGain.gain.value = Number(gainSlider.value);
  }

});

waveformSelect.addEventListener('change', () => {
  if (osc) {
    osc.type = waveformSelect.value as OscillatorType;
  }
});