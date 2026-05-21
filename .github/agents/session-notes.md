## Session 1 — 2026-05-15 09:00 PDT → 2026-05-17 17:30 PDT

## 1. Work Completed
- Replaced Vite demo with a minimal app shell and control UI.
- Implemented Play / Stop behavior with lazy `AudioContext` creation.
- Added waveform selection (sine, square, sawtooth, triangle).
- Added a master gain control (volume slider).
- Added a lowpass `BiquadFilterNode` with smooth parameter updates (uses scheduling).
- Fixed stability issues: prevented duplicate oscillators, created `masterGain` once and persisted it across plays, ensured nodes are stopped/disconnected to avoid leaks.

## 2. Key Concepts Learned
- Web Audio graph basics: `OscillatorNode` → `BiquadFilterNode` → `GainNode` → `destination`.
- Autoplay policy constraints: create/resume `AudioContext` only after a user gesture.
- Oscillator lifecycle management: create/start on play; stop/disconnect on stop.
- Smoothing parameter changes: cancel old schedules and set the new value at `audioCtx.currentTime`.

## 3. Code & TypeScript Details
- DOM typing patterns: non-null assertion (`!`) + type assertions (e.g. `as HTMLDivElement`).
- Nullable Web Audio node variables (e.g. `OscillatorNode | null`) to model lifecycle safely.
- `AudioParam` scheduling API: `cancelScheduledValues()` + `setValueAtTime()` to prevent stepping/clicks.

## 4. Project Structure Changes
- Modified [src/index.html](../../src/index.html) — minimal app shell (controls).
- Modified [src/main.ts](../../src/main.ts) — DOM wiring & audio node management.
- Modified [src/style.css](../../src/style.css) — small control styles.
- Created [CHAT_CONTEXT.md](../../CHAT_CONTEXT.md) — short repo-level context for agents.

## 5. Next Steps (from roadmap only)
- Implement delay + feedback nodes and UI wiring.
- Move audio logic into [src/audio/synth.ts](../../src/audio/synth.ts) so [src/main.ts](../../src/main.ts) is UI wiring only.
- Add verification steps and commit after small milestones.

## Session 2 — 2026-05-18 14:00 PDT → 2026-05-18 15:20 PDT

## 1. Work Completed
- Implemented `initSynth()` in [src/audio/synth.ts](../../src/audio/synth.ts) and moved audio node declarations into its scope.
- Defined a public API returned by `initSynth()`: `play()`, `stop()`, `setGain()`, `setWaveform()`, `setFilter()`, `setDelay()`, `setFeedback()`.
- Implemented `play()` to lazily create `AudioContext`, shared nodes, and the oscillator, then wire the audio graph.
- Implemented `stop()` to stop and disconnect `osc`/`filter` while preserving shared nodes across plays.
- Implemented setter methods to update parameters safely (`setFilter` uses scheduling).

## 2. Key Concepts Learned
- “Module API” pattern: return an object of methods so the engine state is private.
- Shared vs per-play nodes: keep long-lived nodes (e.g. `masterGain`) stable, recreate short-lived nodes (`osc`) as needed.
- Delay feedback loop: `delay` ↔ `delayFeedback` to create repeats.

## 3. Code & TypeScript Details
- Private state via closure: variables declared inside `initSynth()` are only accessible through the returned API.
- Safe initialization checks: create nodes once, reuse on subsequent `play()` calls.
- `AudioParam` scheduling for filter changes: cancel scheduled values, then set the new value at `currentTime`.

## 4. Project Structure Changes
- Modified [src/audio/synth.ts](../../src/audio/synth.ts) — added `initSynth()` and the synth API.
- Modified [src/main.ts](../../src/main.ts) — UI wiring calls into the synth API.

## 5. Next Steps (from roadmap only)
- Product polish and validation (UI and verification).

## Session 3 — 2026-05-19

## 1. Work Completed
- Added [vite.config.ts](../../vite.config.ts) with `base: '/c4syn/'` for GitHub Pages.
- Created a GitHub Actions workflow [deploy.pages.yml](../workflows/deploy.pages.yml) to build and publish `dist/`.
- Migrated ESLint configuration to [eslint.config.cjs](../../eslint.config.cjs) and verified `npm run lint`.
- Bumped project version to `1.0.0` and pushed changes.
- Verified the GitHub Pages site loads and the controls work.

## 2. Key Concepts Learned
- Vite `base` setting: ensures asset paths resolve correctly when hosted under a subpath (GitHub Pages).
- CI/CD workflow basics: `npm ci` → `npm run build` → deploy `dist/`.
- Verification mindset: lint + build + manual smoke test.

## 3. Code & TypeScript Details
- Configuration-driven behavior: small config changes (Vite base) can have large deployment impact.
- Linting as feedback loop: keeping `npm run lint` clean reduces friction during learning.

## 4. Project Structure Changes
- Created [vite.config.ts](../../vite.config.ts).
- Created [deploy.pages.yml](../workflows/deploy.pages.yml).
- Modified [eslint.config.cjs](../../eslint.config.cjs).

## 5. Next Steps (from roadmap only)
- Continue with UI polish and input/playability roadmap items.

## Session 4 — 2026-05-20 23:13

## 1. Work Completed
- Implemented a note-based synth API in the engine: `noteOn(note, velocity?)` and `noteOff(note)`.
- Added per-note voice tracking via `activeNotes: Map<number, { osc: OscillatorNode; gain: GainNode }>`.
- Implemented `noteOff(note)` with a short gain ramp down (release) and a scheduled `osc.stop(...)` to reduce clicks; guarded with `try/catch` to avoid edge-case throws.
- Made waveform selection affect new notes by storing `currentWaveform: OscillatorType` and using it when creating each per-note oscillator.
- Updated UI wiring so the app no longer calls `play()` / `stop()`; the buttons now trigger a single test note via `noteOn` / `noteOff`.

## 2. Key Concepts Learned
- Note-based control vs transport control: playable synth input should emit note events (`noteOn`/`noteOff`) rather than global `play`/`stop`.
- Web Audio “voice” model: each note press creates its own `OscillatorNode` routed through a `GainNode` before the shared processing chain.
- MIDI note → frequency conversion: $f = 440 \cdot 2^{(n-69)/12}$ maps MIDI note numbers to Hz.
- Click prevention: abrupt changes create waveform discontinuities; using `AudioParam` ramps (e.g. `linearRampToValueAtTime`) makes transitions smooth.
- Lazy audio initialization: `AudioContext` and shared nodes are created on first use and resumed after a user gesture.

## 3. Code & TypeScript Details
- Used an object-returning factory pattern (`initSynth()`) to expose a small API surface.
- Used `Map<number, ...>` keyed by MIDI note number for constant-time lookup of active voices.
- Used `OscillatorType` for waveform typing, and `async`/`await` in `noteOn` to ensure audio is initialized and resumed.
- Used `AudioContext.currentTime` + `AudioParam` scheduling (`setValueAtTime`, `linearRampToValueAtTime`) to time the release ramp precisely.

## 4. Project Structure Changes
- Modified [src/audio/synth.ts](../../src/audio/synth.ts)
  - Added `noteOn`/`noteOff` API.
  - Added `currentWaveform` state and connected it to oscillator creation.
- Modified [src/main.ts](../../src/main.ts)
  - Replaced `synth.play()` / `synth.stop()` usage with `noteOn` / `noteOff` for a test note.
- No new source files were created this session.

## 5. Next Steps (from roadmap only)
- v2.2 Implement an on-screen keyboard component with visual feedback.
- v2.3 Add QWERTY key mapping and octave shift controls.
- v2.4 Basic voice allocation (monophonic → 4-voice polyphony).
