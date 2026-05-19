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

const filterLabel = document.createElement('label');
filterLabel.textContent = 'Filter (Hz): ';

const filterSlider = document.createElement('input') as HTMLInputElement;
filterSlider.type = 'range';
filterSlider.min = '200';
filterSlider.max = '8000';
filterSlider.step = '1';
filterSlider.value = '1200';

const delayLabel = document.createElement('label');
delayLabel.textContent = 'Delay (s): ';

const delaySlider = document.createElement('input')! as HTMLInputElement;
delaySlider.id = 'delay';
delaySlider.type = 'range';
delaySlider.min = '0';
delaySlider.max = '1';
delaySlider.step = '0.01';
delaySlider.value = '0';

const feedbackLabel = document.createElement('label');
feedbackLabel.textContent = 'Feeback: ';

const feedbackSlider = document.createElement('input')! as HTMLInputElement;
feedbackSlider.id = 'feedback';
feedbackSlider.type = 'range';
feedbackSlider.min = '0';
feedbackSlider.max = '1';
feedbackSlider.step = '0.01';
feedbackSlider.value = '0';



controls.appendChild(playBtn);
controls.appendChild(stopBtn);
controls.appendChild(gainLabel);
controls.appendChild(gainSlider);
controls.appendChild(waveformSelect);
controls.appendChild(filterLabel);
controls.appendChild(filterSlider);
controls.appendChild(delayLabel);
controls.appendChild(delaySlider);
controls.appendChild(feedbackLabel);
controls.appendChild(feedbackSlider);

let audioCtx: AudioContext | null = null;
let osc: OscillatorNode | null = null;
let masterGain: GainNode | null = null;
let filter: BiquadFilterNode | null = null;
let delay: DelayNode | null = null;
let delayFeedback: GainNode | null = null;

playBtn.addEventListener('click', async () => { /* will create AudioContext and start nodes here */ 
  if (osc) {
    return;
  }
  
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    await audioCtx.resume();
  }

  if (!masterGain) {
    masterGain = audioCtx.createGain();
    masterGain.connect(audioCtx.destination);
    masterGain.gain.value = Number(gainSlider.value);
  }
  
  if (!delay) {
    delay = audioCtx.createDelay();
    delay.delayTime.value = Number(delaySlider.value);
    delay.connect(masterGain);
  }

  if (!delayFeedback) {
    delayFeedback = audioCtx.createGain();
    delayFeedback.gain.value = Number(feedbackSlider.value);
    delay.connect(delayFeedback);
    delayFeedback.connect(delay);
  }
  
  const f = audioCtx.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = Number(filterSlider.value);;
  f.connect(delay!);
  filter = f;

  
  if (!osc) {
    osc = audioCtx.createOscillator();
    osc.type = waveformSelect.value as OscillatorType;
    osc.connect(filter!);
    osc.start();
  }
});

stopBtn.addEventListener('click', () => { /* stop logic goes here */
  if (filter) {
    try { filter.disconnect(); } catch {}
    filter = null;
  }
  
  if (osc) {
    try { osc?.stop(); } catch {}
    try { osc.disconnect(); } catch {}
    osc = null;
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

filterSlider.addEventListener('input', () => {
  if (filter && audioCtx) {
    const v = Number(filterSlider.value);
    filter.frequency.cancelScheduledValues(audioCtx.currentTime);
    filter.frequency.setValueAtTime(v, audioCtx.currentTime);
  }
});

delaySlider.addEventListener('input', () => {
  if (delay) {
    delay.delayTime.value = Number(delaySlider.value);
  }
})

feedbackSlider.addEventListener('input', () => {
  if (delayFeedback) {
    delayFeedback.gain.value = Number(feedbackSlider.value);
  }
})