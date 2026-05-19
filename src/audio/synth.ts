export function initSynth() {

    let audioCtx: AudioContext | null = null;
    let osc: OscillatorNode | null = null;
    let masterGain: GainNode | null = null;
    let filter: BiquadFilterNode | null = null;
    let delay: DelayNode | null = null;
    let delayFeedback: GainNode | null = null;

    return {
        play: async () => {
            if (!audioCtx) {
                audioCtx = new AudioContext();
            }
            await audioCtx.resume();

            if (!masterGain) {
                masterGain = audioCtx.createGain();
                masterGain.connect(audioCtx.destination);
                masterGain.gain.value = 0.2;
            }

            if (!delay) {
                delay = audioCtx.createDelay();
                delay.delayTime.value = 0;
                delay.connect(masterGain);
            }

            if (!delayFeedback) {
                delayFeedback = audioCtx.createGain();
                delayFeedback.gain.value = 0;
                delay.connect(delayFeedback);
                delayFeedback.connect(delay);
            }

            if (!filter) {
                filter = audioCtx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.value = 1200;
                filter.connect(delay);
            }

            if (!osc) {
                osc = audioCtx.createOscillator();
                osc.type = 'sine';
                osc.connect(filter);
                osc.start();
            }


        },

        stop: () => {
            if (filter) {
                try { filter.disconnect(); } catch {}
                filter = null;
            }

            if (osc) {
                try { osc.stop(); } catch {}
                try { osc.disconnect(); } catch {}
                osc = null;
            }
        },

        setGain: (value: number) => {
            if (masterGain) {
                masterGain.gain.value = value;
            }
        },

        setWaveform: (type: OscillatorType) => {
            if (osc) {
                osc.type = type;
            }
        },

        setFilter: (frequency: number) => {
            if (filter) {
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
    }

}