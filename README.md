# c4syn

c4syn is a beginner-friendly browser synthesizer built with TypeScript, Vite, and the Web Audio API. It is structured as a learning project with no final goal in mind.

## What it does now

- Start and stop a generated sound in the browser.
- Switch between sine, square, sawtooth, and triangle waveforms.
- Adjust master volume with a gain slider.
- Shape the sound with a lowpass filter.
- Add echo with delay and feedback controls.

## Project structure

- `src/main.ts` — builds the UI and wires controls to the audio engine.
- `src/style.css` — styles for the interface.
- `src/audio/synth.ts` — audio engine with lazy `AudioContext` setup, play/stop, waveform, gain, filter, delay, and feedback controls.

## Next step

The next milestone is polish: improve the UI, add a small amount of verification, and keep the synth module easy to read as more features are added.

## Live demo

- Hosted on GitHub Pages: https://jrandall54.github.io/c4syn/

