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
- `src/audio/synth.ts` — planned home for the audio logic as the app grows.

## Next step

The next milestone is moving the audio wiring into `src/audio/synth.ts` so the UI code stays small and easier to learn from.

