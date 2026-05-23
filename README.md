# c4syn

c4syn is a browser-based synthesizer built with TypeScript, Vite, and the Web Audio API. It is being developed as a small learning project that grows in clear milestones.

## Current status

- v2.2 is complete: the app now has a playable on-screen white-key keyboard with visual feedback.
- Delay now uses a wet/dry mix, so notes play immediately while echo is layered on top.
- The basic control panel is in place for waveform, gain, filter, delay, feedback, and wet mix.

## Goals

- Add black keys and basic UI polish next.
- Add QWERTY key mapping and octave controls after that.
- Continue toward voice allocation, MIDI input, and richer synthesis features over later milestones.

## Project structure

- `src/main.ts` — builds the UI and wires controls to the audio engine.
- `src/audio/synth.ts` — audio engine and note-based playback.

## Demo

- Hosted on GitHub Pages: https://jrandall54.github.io/c4syn/

