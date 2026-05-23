import './style.css'
import { initSynth } from './audio/synth';

const app = document.getElementById('app')! as HTMLDivElement
app.innerHTML = '<h1>c4syn</h1><div id="controls"></div>'

const controls = document.getElementById('controls')! as HTMLDivElement

const startOverlay = document.createElement('button');
startOverlay.textContent = 'Tap to Start';
startOverlay.id = 'start-overlay';
document.body.appendChild(startOverlay);

const synth = initSynth();

const keyboard = document.createElement('div');
keyboard.id = 'keyboard';
controls.appendChild(keyboard);

const whiteKeys = [
  { label: 'C4', note: 60 },
  { label: 'D4', note: 62 },
  { label: 'E4', note: 64 },
  { label: 'F4', note: 65 },
  { label: 'G4', note: 67 },
  { label: 'A4', note: 69 },
  { label: 'B4', note: 71 },
  { label: 'C5', note: 72 },
];

const keyboardButtons = new Map<number, HTMLButtonElement>();

// helpers
const setKeyState = (note: number, isActive: boolean) => {
  const btn = keyboardButtons.get(note);
  if (btn) btn.classList.toggle('down', isActive);
};

const syncSynthSettings = () => {
  synth.setWaveform(waveformSelect.value as OscillatorType);
  synth.setGain(Number(gainSlider.value));
  synth.setFilter(Number(filterSlider.value));
  synth.setDelay(Number(delaySlider.value));
  synth.setFeedback(Number(feedbackSlider.value));
  synth.setWet(Number(wetSlider.value));
};

for (const { label, note } of whiteKeys) {
  const keyButton = document.createElement('button');
  keyButton.type = 'button';
  keyButton.className = 'key';
  keyButton.textContent = label;

  keyButton.addEventListener('pointerdown', async (ev: PointerEvent) => {
    // ignore non-primary mouse buttons
    if ('button' in ev && (ev as PointerEvent).button !== 0) return;
    
    // keep the pointer captured by this element so pointerup/lostpointercapture fires reliably
    try { keyButton.setPointerCapture(ev.pointerId); } catch{}
    
    setKeyState(note, true);
    syncSynthSettings();

    void synth.noteOn(note, 1);
  });

  const release = () => {
    setKeyState(note, false);
    synth.noteOff(note);
  };

  keyButton.addEventListener('pointerup', release);
  keyButton.addEventListener('pointercancel', release);
  keyButton.addEventListener('lostpointercapture', release);

  keyboardButtons.set(note, keyButton);
  keyboard.appendChild(keyButton);

}

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
feedbackLabel.textContent = 'Feedback: ';

const feedbackSlider = document.createElement('input')! as HTMLInputElement;
feedbackSlider.id = 'feedback';
feedbackSlider.type = 'range';
feedbackSlider.min = '0';
feedbackSlider.max = '1';
feedbackSlider.step = '0.01';
feedbackSlider.value = '0';

const wetLabel = document.createElement('label');
wetLabel.textContent = 'Wet: ';

const wetSlider = document.createElement('input')! as HTMLInputElement;
wetSlider.id = 'wet';
wetSlider.type = 'range';
wetSlider.min = '0';
wetSlider.max = '1';
wetSlider.step = '0.01';
wetSlider.value = '0.05';

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
controls.appendChild(wetLabel);
controls.appendChild(wetSlider);


syncSynthSettings();


startOverlay.addEventListener('click', async () => {
  await synth.resume();
  startOverlay.remove();
})

stopBtn.addEventListener('click', () => { 
  synth.stopAll();
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
});

feedbackSlider.addEventListener('input', () => {
  synth.setFeedback(Number(feedbackSlider.value));
});

wetSlider.addEventListener('input', () => {
  synth.setWet(Number(wetSlider.value));
})