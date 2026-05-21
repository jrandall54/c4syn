import './style.css'
import { initSynth } from './audio/synth';

const app = document.getElementById('app')! as HTMLDivElement
app.innerHTML = '<h1>c4syn</h1><div id="controls"></div>'

const controls = document.getElementById('controls')! as HTMLDivElement

const synth = initSynth();

const TEST_NOTE = 60;

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

playBtn.addEventListener('click', async () => { 
  synth.setWaveform(waveformSelect.value as OscillatorType);
  await synth.noteOn(TEST_NOTE, 1);
  synth.setGain(Number(gainSlider.value));
  synth.setFilter(Number(filterSlider.value));
  synth.setDelay(Number(delaySlider));
  synth.setFeedback(Number(feedbackSlider.value));
});

stopBtn.addEventListener('click', () => { 
  synth.noteOff(TEST_NOTE);
});

gainSlider.addEventListener('input', () => {
  synth.setGain(Number(gainSlider.value));
});

waveformSelect.addEventListener('change', () => {
  synth.setWaveform(waveformSelect.value as OscillatorType);
});

filterSlider.addEventListener('input', () => {
  synth.setFilter(Number(filterSlider.value));
});

delaySlider.addEventListener('input', () => {
  synth.setDelay(Number(delaySlider.value));
})

feedbackSlider.addEventListener('input', () => {
  synth.setFeedback(Number(feedbackSlider.value));
})