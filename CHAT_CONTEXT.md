c4syn — quick chat context

Goal: beginner-friendly browser synthesizer (sine/square/sawtooth/triangle) with three effects: gain, lowpass filter, delay+feedback.

Current state:
- Dev scaffold: Vite + TypeScript.
- Implemented in src/main.ts: Play/Stop, waveform selector, master gain, lowpass filter (smooth updates), and effect controls.
- Implemented in src/audio/synth.ts: lazy AudioContext setup, oscillator lifecycle, gain, filter, delay, and feedback wiring.

Next steps (short):
- Refresh the UI copy and styling to match the current feature set.
- Add lightweight verification for the synth API and UI wiring.
- Keep the handoff notes in sync as the project grows.

Notes / constraints:
- Session plan saved at /memories/session/plan.md
