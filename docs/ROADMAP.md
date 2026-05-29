# c4syn Roadmap

A prioritized feature plan spanning versions v2–v5, with actionable milestones to evolve c4syn from a basic web synthesizer into a playable instrument.

## Overview

**Current state:** v2.x (note-based synth API, on-screen keyboard input, effects controls; UI polish in progress)
**Goal:** Build towards a fully playable, polyphonic Web Audio synthesizer with effects, MIDI support, a sequencer, and a polished UI.

---

## Planned Features

- Playable input: on-screen keyboard, QWERTY mapping, and MIDI device support
- Musical API: replace `play`/`stop` with `noteOn`/`noteOff` for note-based control
- Advanced synthesis: multiple oscillators, envelopes (ADSR), LFOs, and flexible filters
- Effects: reverb, chorus, phaser, tempo-sync delay, ping-pong delay
- Presets & patches: JSON-based save/load and import/export
- Sequencer & arpeggiator: step sequencer for melodic patterns
- Recording & export: record output and download WAV
- Polyphony & voice management: voice allocation and anti-aliasing

---

## Version Breakdown

### v2 — Playable Input & UI Polish
Goal: make the synth playable from keyboard and on-screen controls

- 2.1 Replace `play`/`stop` with `noteOn(note, velocity?)` and `noteOff(note)` API (2–4h)
- 2.2 Implement on-screen keyboard component with visual feedback; add wet/dry delay mix (`wetGain`) so notes play immediately with delay on top (2–4h) — completed
- 2.3 Implement on-screen piano keyboard graphic and wire one octave (C4–C5): map white keys, add black keys (C#4, D#4, F#4, G#4, A#4), ensure overlay and pointer-blocking; pointer-only input (1–2h)
- 2.4 Add QWERTY key mapping and octave shift controls (1–2h) — completed
-- 2.5 Basic voice allocation (configurable pooled voice manager — default: 8 voices) (4–6h)

### v3 — Enhanced Synthesis & Modulation
Goal: richer sound design capabilities

- 3.1 Add multiple oscillators per voice with independent controls (6–10h)
- 3.2 Implement ADSR envelope for amplitude and filter (4–8h)
- 3.3 Add filter types and resonance control (3–6h)
- 3.4 Add LFO with routing options (pitch, filter, amp) (4–6h)

### v4 — Effects, MIDI, & Presets
Goal: production-ready features

- 4.1 Advanced delay (tempo sync, ping-pong), reverb, chorus (6–12h)
- 4.2 MIDI In support via Web MIDI API (4–10h)
- 4.3 Preset management: save/load/export JSON (3–6h)
- 4.4 Polyphony scaling & voice-stealing improvements (4–6h)

### v5 — Sequencer, Recording & Polish
Goal: complete feature set and UI polish

- 5.1 Step sequencer and arpeggiator with tempo sync (6–12h)
- 5.2 Recording & WAV export via MediaRecorder (4–8h)
- 5.3 UI redesign, accessibility, and mobile optimization (8–16h)

---

## Implementation Guidance

- Input: map QWERTY keys and on-screen clicks to `noteOn/noteOff`; handle `keydown`/`keyup` with focus handling to avoid repeats.
- Voice management: implement a `Voice` class that owns oscillator(s), filter, envelope, and returns to pool on release after ADSR completes. Use a configurable pool size (default: 8 voices) and a deterministic stealing policy (oldest-active-first).
- Oscillators: create per-voice `OscillatorNode`s mixed into a per-voice `GainNode` before filter -> master gain.
- Envelopes: control `GainNode.gain` with `setValueAtTime` and `linearRampToValueAtTime` for smooth transitions.
- MIDI: use `navigator.requestMIDIAccess()` and map MIDI `noteOn`/`noteOff` messages to the synth API.
- Presets: serialize patch parameter values to JSON; persist in `localStorage` and allow export/import.
- Effects chain: route `voice -> filter -> send/return fx -> masterGain -> destination` so effects are togglable and configurable.

---

## Key Files & Code Areas

- `src/audio/synth.ts` — main engine: restructure to note-based API and voice manager
- `src/main.ts` — UI wiring, keyboard mapping, on-screen keyboard
- `src/ui/*` — optional UI components for keyboard, effects panel, preset manager
- `src/style.css` — UI polish and responsive layout
- `README.md` / `SESSION_SUMMARY.md` — update per release

---

## Testing & Verification

- Unit tests: mapping functions, note number conversions, preset serialization
- Manual tests: QWERTY + on-screen keyboard play, polyphony, effects toggles, MIDI device handling
- Performance: monitor CPU usage; optimize oscillators or move heavy work to AudioWorklet if needed

---

## Project Governance

- Use small, focused commits & PRs per milestone (1–2 features each)
- Tag releases at major milestones (v2.0.0, v3.0.0, ...)
