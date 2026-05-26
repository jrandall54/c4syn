# c4syn

c4syn is a browser-based synthesizer built with TypeScript, Vite, and the Web Audio API. It is being developed as a small learning project that grows in clear milestones.

## Current status

- v2.2 is complete: the synth is note-based (`noteOn`/`noteOff`) and playable from the UI.
- An inline SVG piano keyboard graphic is mounted in the app (one octave C4–C5).
- Keys use pointer events (touch + mouse) with visual “pressed” feedback.
- A startup overlay (“Tap to Start”) is used to ensure the first interaction unlocks/resumes audio on mobile browsers.
- Delay uses a wet/dry mix so notes play immediately while echo layers on top.
- The effects/control panel is wired for waveform, gain, filter cutoff, delay time, feedback, and wet mix, plus a “Stop” (panic) action.
- Mobile layout is responsive (portrait stacked / landscape two-column), with viewport meta tuned for more stable rotation behavior.

## Goals

- Finish v2 UI/playability milestones: QWERTY key mapping and octave shift.
- Add basic voice allocation (monophonic → 4-voice polyphony).
- Continue toward MIDI input and richer synthesis features over later milestones.

## Project structure

- `src/main.ts` — builds the UI and wires controls to the audio engine.
- `src/audio/synth.ts` — audio engine and note-based playback.

## Demo

- Hosted on GitHub Pages: https://jrandall54.github.io/c4syn/

