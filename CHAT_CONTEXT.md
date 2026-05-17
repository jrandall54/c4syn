c4syn — quick chat context

Goal: beginner-friendly browser synthesizer (sine/square/sawtooth/triangle) with three effects: gain, lowpass filter, delay+feedback.

Current state:
- Dev scaffold: Vite + TypeScript.
- Implemented in src/main.ts: Play/Stop, waveform selector, master gain, lowpass filter (smooth updates).
- Not implemented: delay effect and src/audio/synth.ts refactor.

Next steps (short):
- Add src/audio/synth.ts skeleton (lazy AudioContext, start/stop, setWaveform).
- Implement delay + feedback UI and wiring.
- Refactor audio logic into the audio module and commit milestone.

Notes / constraints:
- Developer prefers to write files themselves; assistant should provide one-line changes and explanations and wait for explicit "OK edit" before applying edits.
- Session plan saved at /memories/session/plan.md
