import './style.css'
import kbSvg from './assets/design/kb.svg?raw';
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
keyboard.innerHTML = kbSvg;
controls.appendChild(keyboard);

const effectsPanel = document.createElement('div');
effectsPanel.id = 'effects-panel';
controls.appendChild(effectsPanel);

const keyIdToMidi: Record<string, number> = {
  C4: 60, Db4: 61, D4: 62, Eb4: 63, E4: 64,
  F4: 65, Gb4: 66, G4: 67, Ab4: 68, A4: 69,
  Bb4: 70, B4: 71, C5: 72,
}

const svgKeyEls = new Map<number, SVGPathElement>();

const setSvgKeyState = (note: number, isActive: boolean) => {
  const keyEl = svgKeyEls.get(note);
  if (keyEl) keyEl.classList.toggle('down', isActive);
};

for (const [id, midi] of Object.entries(keyIdToMidi)) {
  const el = keyboard.querySelector(`#${id}`);
  if (el instanceof SVGPathElement) {
    svgKeyEls.set(midi, el);
  }
}

for (const [midi, keyEl] of svgKeyEls) {
  const release = () => {
    setSvgKeyState(midi, false);
    synth.noteOff(midi);
  };

  keyEl.addEventListener('pointerdown', async (ev: PointerEvent) => {
    if (ev.button !== 0) return;

    try { keyEl.setPointerCapture(ev.pointerId) } catch { }

    setSvgKeyState(midi, true);
    syncSynthSettings();
    void synth.noteOn(midi, 1);
  });

  keyEl.addEventListener('pointerup', release);
  keyEl.addEventListener('pointercancel', release);
  keyEl.addEventListener('lostpointercapture', release);
}

const keyboardSvg = keyboard.querySelector('svg');
if (keyboardSvg) {
  keyboardSvg.setAttribute('width', '100%');
  keyboardSvg.removeAttribute('height');
}

const qwertyMap: Record<string, number> = {
  // C3 row
  KeyZ: 48, KeyS: 49, KeyX: 50, KeyD: 51, KeyC: 52,
  KeyV: 53, KeyG: 54, KeyB: 55, KeyH: 56, KeyN: 57,
  KeyJ: 58, KeyM: 59, Comma: 60, KeyL: 61, Period: 62,
  Semicolon: 63, Slash: 64,

  // C4 row
  KeyQ: 60, Digit2: 61, KeyW: 62, Digit3: 63, KeyE: 64,
  KeyR: 65, Digit5: 66, KeyT: 67, Digit6: 68, KeyY: 69,
  Digit7: 70, KeyU: 71, KeyI: 72, Digit9: 73, KeyO: 74,
  Digit0: 75, KeyP: 76, BracketLeft: 77, Equal: 78, BracketRight: 79,
};
let octaveOffset = 0;

window.addEventListener('keydown', (ev) => {
  if (ev.repeat) return;
  const n = qwertyMap[ev.code];
  if (n != null) {
    synth.noteOn(n + octaveOffset * 12, 1);
  }
});

window.addEventListener('keyup', (ev) => {
  const n = qwertyMap[ev.code];
  if (n != null) {
    synth.noteOff(n + octaveOffset * 12);
  }
});

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
    try { keyButton.setPointerCapture(ev.pointerId); } catch { }

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
gainLabel.textContent = 'Volume: ';

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
feedbackLabel.textContent = 'Feedback (repeats)';

const feedbackSlider = document.createElement('input')! as HTMLInputElement;
feedbackSlider.id = 'feedback';
feedbackSlider.type = 'range';
feedbackSlider.min = '0';
feedbackSlider.max = '1';
feedbackSlider.step = '0.01';
feedbackSlider.value = '0';

const wetLabel = document.createElement('label');
wetLabel.textContent = 'Delay Volume';

const wetSlider = document.createElement('input')! as HTMLInputElement;
wetSlider.id = 'wet';
wetSlider.type = 'range';
wetSlider.min = '0';
wetSlider.max = '1';
wetSlider.step = '0.01';
wetSlider.value = '0.05';

effectsPanel.appendChild(stopBtn);
effectsPanel.appendChild(gainLabel);
effectsPanel.appendChild(gainSlider);
effectsPanel.appendChild(waveformSelect);
effectsPanel.appendChild(filterLabel);
effectsPanel.appendChild(filterSlider);
effectsPanel.appendChild(delayLabel);
effectsPanel.appendChild(delaySlider);
effectsPanel.appendChild(feedbackLabel);
effectsPanel.appendChild(feedbackSlider);
effectsPanel.appendChild(wetLabel);
effectsPanel.appendChild(wetSlider);

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