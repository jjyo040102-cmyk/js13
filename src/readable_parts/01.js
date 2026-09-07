    {
        title: "The last spectrum", hint: "Burn. Push. Power. Grow. Freeze. Lift. Teleport. Return all seven lights.", color: 6, width: 3270, start: [70, 546], exit: [3090, 530], terrain: [[0, 588, 681], [951, 588, 520], [1734, 514, 113], [2080, 432, 129], [2420, 306, 115], [2594, 113, 52, 580], [2780, 530, 490]], items: [object('fire', 192, 530, 44, 58, 0, {
                need: 0
            }), wood(414, 335, 253), orb(539, 530, 1), rock(625, 528, 764, 547, 113, 61), orb(1006, 530, 2), socket(1100, 530, 0), gate(1225, 285, 303, 0), orb(1344, 530, 3), plant(1440, 546, 1467, 514, 285), orb(1768, 456, 4), pool(1847, 602, 233), enemy(1909, 420, 107, 14), orb(2120, 374, 5), lift(2240, 456, 145, 333), orb(2433, 248, 6), portal(2490, 238, 0, 2860, 488), portal(2800, 462, 0, 2425, 264)], gems: [[317, 550], [820, 507], [1027, 481], [1615, 474], [1960, 337], [2310, 293], [3007, 490]]
    }
];
// Original procedural score: "A Colour Remembered". No recordings or network requests.
// D major gives all seven colours a stable pitch, shared by the score and magic.
const scale = [0, 2, 4, 5, 7, 9, 11];
const pitch = n => 293.665 * 2 ** (n / 12);
let musicBus, reverb, noiseBuffer, voices = 0, footTimer = 0, soundFocus = true;
let audioMode = '', musicHold = 0;
function startAudio() {
    try {
        if (!audio) {
            audio = new (window.AudioContext || window.webkitAudioContext)();
            master = audio.createGain();
            musicBus = audio.createGain();
            musicBus.gain.value = .6;
            musicBus.connect(master);
            const limiter = audio.createDynamicsCompressor();
            limiter.threshold.value = -12;
            limiter.knee.value = 18;
            limiter.ratio.value = 4;
            limiter.attack.value = .006;
            limiter.release.value = .2;
            master.connect(limiter);
            limiter.connect(audio.destination);
            // A short, dark stereo room generated once, shared by every voice.
            reverb = audio.createConvolver();
            const impulse = audio.createBuffer(2, audio.sampleRate * 1.4, audio.sampleRate);
            let random = 71;
            for (let c = 0; c < 2; c++) {
                const data = impulse.getChannelData(c);
                let smooth = 0;
                for (let i = 0; i < data.length; i++) {
                    random = (Math.imul(random, 1664525) + 1013904223) >>> 0;
                    smooth = smooth * .65 + (random / 2147483648 - 1) * .35;
                    data[i] = smooth * (1 - i / data.length) ** 3;
                }
            }
            reverb.buffer = impulse;
            const wet = audio.createGain();
            wet.gain.value = .21;
            reverb.connect(wet);
            wet.connect(master);
            noiseBuffer = audio.createBuffer(1, audio.sampleRate, audio.sampleRate);
            const noise = noiseBuffer.getChannelData(0);
            for (let i = 0; i < noise.length; i++) {
                random = (Math.imul(random, 1664525) + 1013904223) >>> 0;
                noise[i] = random / 2147483648 - 1;
            }
            nextNote = audio.currentTime + .05;
            master.gain.value = muted || !soundFocus ? 0 : .72;
        }
        if (audio.state === 'suspended') audio.resume().catch(() => {});
    } catch (e) {}
}
// One-shot voice; 4=noise. All voices have click-free attack/release and cleanup.
function tone(freq, duration = .3, type = 0, volume = .2, delay = 0, end = 0, pan = 0, musicVoice = false, attack = .012) {
    if (!audio || muted || !soundFocus || voices > 70) return;
    const t = audio.currentTime + Math.max(0, delay);
    const o = type === 4 ? audio.createBufferSource() : audio.createOscillator();
    const gain = audio.createGain(), stereo = audio.createStereoPanner();
    let filter;
    if (type === 4) {
        o.buffer = noiseBuffer;
        o.loop = true;
        filter = audio.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.value = .7;
        filter.frequency.setValueAtTime(freq, t);
        filter.frequency.exponentialRampToValueAtTime(end || freq, t + duration);
        o.connect(filter);
        filter.connect(gain);
    } else {
        o.type = ['sine', 'triangle', 'sawtooth', 'square'][type];
        o.frequency.setValueAtTime(freq, t);
        o.frequency.exponentialRampToValueAtTime(end || freq, t + duration);
        o.connect(gain);
    }
    gain.gain.setValueAtTime(.0001, t);
    gain.gain.exponentialRampToValueAtTime(volume, t + Math.min(attack, duration * .45));
    gain.gain.exponentialRampToValueAtTime(.0001, t + duration);
    gain.connect(stereo);
    stereo.pan.value = clamp(pan, -.85, .85);
    stereo.connect(musicVoice ? musicBus : master);
    // The score sends a restrained amount into the same room as the magic.
    const send = audio.createGain();
    send.gain.value = musicVoice ? .6 : 1;
    stereo.connect(send);
    send.connect(reverb);
    voices++;
    o.start(t);
    o.stop(t + duration + .02);
    o.onended = () => {
        voices--;
        for (const node of [o, gain, stereo, send, filter]) if (node) node.disconnect();
    };
}
function bell(n, duration = .9, volume = .2, delay = 0, pan = 0, musicVoice = false) {
    const f = pitch(n);
    tone(f, duration, 0, volume, delay, 0, pan, musicVoice);
    tone(f * 2.003, duration * .42, 0, volume * .25, delay, 0, pan, musicVoice);
}
function sound(kind, c = 0, pan = 0) {
    if (!audio || muted || !soundFocus) return;
    const n = scale[c] || 0, f = pitch(n);
    if (kind === 'step' || kind === 'land') {
        tone(kind === 'step' ? 430 : 220, .08, 4, kind === 'step' ? .055 : .1, 0, 100, pan);
        tone(kind === 'step' ? 170 : 110, .07, 0, .075, 0, 55, pan);
    } else if (kind === 'jump') {
        tone(180, .19, 0, .19, 0, 450, pan);
        tone(700, .16, 4, .07, 0, 1400, pan);
    } else if (kind === 'die') {
        tone(370, .65, 0, .28, 0, 85);
        tone(740, .52, 0, .08, .03, 170);
        tone(1200, .42, 4, .08, 0, 150);
    } else if (kind === 'take' || kind === 'undo') {
        tone(f * .5, .32, 0, .24, 0, f * 2, pan, false, .13);
        tone(400, .33, 4, .17, 0, 2300, pan, false, .16);
        bell(n + 12, .65, .17, .24, pan);
    } else if (kind === 'gem') {
        bell(n + 12, 1.25, .27, 0, pan);
        bell(n + 19, .8, .14, .09, -pan);
        if (collectCount() === 7) {
            [0, 4, 7, 12].forEach((v, i) => bell(v + 12, 1.7, .16, .25 + i * .09, (i - 1.5) * .3));
        }
    } else if (kind === 'win') {
        musicHold = audio.currentTime + 2.5;
        scale.concat(12, 16, 19, 24).forEach((v, i) => bell(v, 1.8, .24, i * .12, (i % 5 - 2) * .2));
        [0, 4, 7].forEach((v, i) => tone(pitch(v - 12), 2.8, 0, .16, 1.25, 0, (i - 1) * .4, false, .3));
    } else if (kind === 'warp') {
        tone(f / 2, .65, 0, .26, 0, f * 2, -.7, false, .15);
        tone(f * 2, .65, 0, .17, .06, f / 2, .7, false, .15);
