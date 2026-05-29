# c4syn

c4syn is a browser-based synthesizer built with TypeScript, Vite, and the Web Audio API. It is being developed as a small learning project that grows in clear milestones.

## Current status

- v2.4 is complete: QWERTY mapping, octave shift controls, robust key handling, and effects panel wired.
- An inline SVG piano keyboard graphic is mounted in the app (one octave C4–C5) with pointer events (touch + mouse) and visual “pressed” feedback.
- Startup overlay (“Tap to Start”) unlocks/resumes audio on mobile browsers.
- Delay uses a wet/dry mix so notes play immediately while echo layers on top.
- The effects/control panel is wired for waveform, gain, filter cutoff, delay time, feedback, and wet mix, plus a “Stop” (panic) action.
- Mobile layout is responsive (portrait stacked / landscape two-column), with viewport meta tuned for more stable rotation behavior.

### QWERTY Playback

- The app supports playing the synth from your computer keyboard using a two-row mapping that mimics piano key positions. Mapping uses `KeyboardEvent.code` (physical key positions) so layout stays consistent across keyboard locales.

- Use the on-screen `Octave +` / `Octave -` buttons in the effects panel to shift the entire mapping up or down by octaves.

- How to visualize the layout (white vs. black keys):

	- Lower octave (C3 → E4) — bottom letter row

		```text
				 Black:   S   D       G   H   J       L   ;
				 White: Z   X   C   V   B   N   M   ,   .   /
				       (C3)(D3)(E3)(F3)(G3)(A3)(B3)(C4)(D4)(E4)
		```

	- Higher octave (C4 → G5) — top number/letter row

		```text
				 Black:   2   3       5   6   7       9   0       = 
				 White: Q   W   E   R   T   Y   U   I   O   P   [   ]
				       (C4)(D4)(E4)(F4)(G4)(A4)(B4)(C5)(D5)(E5)(F5)(G5)
		```

- Play and hold keys for sustained notes; release to stop. Multiple simultaneous keys produce chords (polyphony supported by the synth engine).

## Goals

- v2.5: Add basic voice allocation (monophonic → 4-voice polyphony).
- Continue toward MIDI input and richer synthesis features in later milestones.

## Project structure

- `src/main.ts` — builds the UI and wires controls to the audio engine.
- `src/audio/synth.ts` — audio engine and note-based playback.

## Demo

- Hosted on GitHub Pages: https://jrandall54.github.io/c4syn/

