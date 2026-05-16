# c4syn

A beginner-friendly browser-based audio synthesizer built with TypeScript and the Web Audio API. This project is part of a learning journey into web development and synthesizer design.

## Current Features

- **Play/Stop controls** — Start and stop audio output
- **Gain control slider** — Adjust master volume in real-time
- **Sine wave oscillator** — Basic tone generation using Web Audio API

## Planned Features (Phase 1)

- Waveform selection (sine, square, sawtooth, triangle)
- Effects:
  - Gain envelope (attack/release)
  - Low-pass filter
  - Delay effect

## Technologies

- **TypeScript** — Type-safe JavaScript for learning and maintainability
- **Vite** — Fast development server and build tool
- **Web Audio API** — Browser's native audio processing and synthesis

## Installation & Usage

### Prerequisites

- Node.js (v18+)
- A modern web browser with Web Audio API support

### Development

1. Clone the repository
2. Install dependencies:
  ```bash
  npm install
  ```
3. Start the development server:
  ```bash
  npm run dev
  ```
4. Open your browser to `http://localhost:5173` (or the URL shown in terminal)
5. Use the Play button to start audio, Stop to end it, and adjust the gain slider

### Building for Production

```bash
npm run build
```

The output will be in the `dist/` directory.

## How It Works

### Web Audio API Basics

c4syn uses the **Web Audio API**, a powerful JavaScript API for audio processing:

- **AudioContext** — The main audio environment, like a virtual mixing studio
- **OscillatorNode** — Generates a basic waveform (currently sine)
- **GainNode** — Controls volume at different points in the audio chain

### Current Architecture

```
User clicks Play → AudioContext starts → Oscillator connects to GainNode → GainNode outputs to speakers
                                ↓
                            Gain slider adjusts volume
```

**Code structure:**
- `src/main.ts` — UI controls and audio logic (currently combined)
- `src/audio/synth.ts` — Future home for modularized audio synthesis logic

## Development Setup

### Scripts

- `npm run dev` — Start development server with hot module reload
- `npm run build` — TypeScript compilation + Vite production build
- `npm run preview` — Preview the production build locally

### Project Goals

This project serves two main learning purposes:

1. **TypeScript fundamentals** — Learning type safety, interfaces, and modern JavaScript
2. **Web Audio API concepts** — Understanding digital audio synthesis, nodes, and signal routing

As features are added, the code will be refactored to separate concerns (UI in one module, audio synthesis logic in another), reinforcing best practices for web development.

## Next Steps

The next milestone is implementing **waveform selection and effects** (gain envelope, filter, delay). Future improvements will include keyboard input for playing notes and a visual frequency analyzer.

---

**Note:** c4syn is currently in active development. All features and code are subject to change as part of the learning process.

