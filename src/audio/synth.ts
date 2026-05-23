export function initSynth() {

    let audioCtx: AudioContext | null = null;
    // let osc: OscillatorNode | null = null;
    let masterGain: GainNode | null = null;
    let filter: BiquadFilterNode | null = null;
    let delay: DelayNode | null = null;
    let delayFeedback: GainNode | null = null;
    let currentWaveform: OscillatorType = 'sine';
    let wetGain: GainNode | null = null;



    // Convert MIDI note number to frequency (A4 = 69 => 440 Hz)
    const midiNoteToFrequency = (note: number) => 440 * Math.pow(2, (note - 69) / 12);

    // Track active notes: MIDI note -> per-note nodes (oscillator + gain)
    const activeNotes = new Map<number, { osc: OscillatorNode; gain: GainNode }>();

    // Ensure AudioContext and global nodes exist (used by noteOn and play)
    const ensureAudio = async () => {
        if (!audioCtx) {
            audioCtx = new AudioContext();
        }
        await audioCtx.resume();

        if (!masterGain && audioCtx) {
            masterGain = audioCtx.createGain();
            masterGain.connect(audioCtx.destination);
            masterGain.gain.value = 0.2; // default master level
        }

        if (!wetGain && masterGain && audioCtx) {
            wetGain = audioCtx.createGain();
            wetGain.gain.value = 1;
            wetGain.connect(masterGain);
        }

        if (!delay && audioCtx && wetGain) {
            delay = audioCtx.createDelay();
            delay.delayTime.value = 0;
            delay.connect(wetGain);
        }

        if (!delayFeedback && audioCtx && delay) {
            delayFeedback = audioCtx.createGain();
            delayFeedback.gain.value = 0;
            delay.connect(delayFeedback);
            delayFeedback.connect(delay);
        }

        if (!filter && audioCtx && delay && masterGain) {
            filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 1200;
            filter.connect(masterGain);
            filter.connect(delay);
        }
    }

    return {

        // Create and start a per-note oscillator + gain, store in activeNotes
        noteOn: async (note: number, velocity = 1) => {
            await ensureAudio();
            if (!audioCtx) return;
            if (activeNotes.has(note)) return; // already playing
            
            const voiceOsc = audioCtx.createOscillator();
            voiceOsc.type = currentWaveform;
            voiceOsc.frequency.value = midiNoteToFrequency(note);

            const voiceGain = audioCtx.createGain();
            voiceGain.gain.value = Math.max(0, Math.min(1, velocity)) * 0.2; // scale velocity

            voiceOsc.connect(voiceGain);

            // routing: connect to filter (wet) if present, else masterGain, else destination
            if (filter) {
                voiceGain.connect(filter);
            } else if (masterGain) {
                voiceGain.connect(masterGain);
            } else {
                voiceGain.connect(audioCtx.destination);
            }

            voiceOsc.start();
            activeNotes.set(note, { osc: voiceOsc, gain: voiceGain });
        },

        noteOff: (note: number) => {
            if (!audioCtx) return;
            const voice = activeNotes.get(note);
            if (!voice) return;
            
            const t = audioCtx.currentTime;
            voice.gain.gain.setValueAtTime(voice.gain.gain.value, t);
            voice.gain.gain.linearRampToValueAtTime(0, t + 0.03);
            
            try {
                voice.osc.stop(t + 0.04) 
            } catch {};
            
            activeNotes.delete(note);

        },    

        setGain: (value: number) => {
            if (masterGain) {
                masterGain.gain.value = value;
            }
        },

        setWaveform: (type: OscillatorType) => {
            currentWaveform = type;          
        },

        setFilter: (frequency: number) => {
            if (filter && audioCtx) {
                filter.frequency.cancelScheduledValues(audioCtx.currentTime);
                filter.frequency.setValueAtTime(frequency, audioCtx.currentTime);
            }
        },

        setDelay: (time: number) => {
            if (delay) {
                delay.delayTime.value = time;
            }

        },

        setFeedback: (amount: number) => {
            if (delayFeedback) {
                delayFeedback.gain.value = amount;
            }

        },

        setWet: (amount: number) => {
            if (wetGain) {
                wetGain.gain.value = amount;
            }
        },
    }

}