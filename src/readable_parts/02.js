        tone(800, .7, 4, .2, 0, 3000, 0, false, .3);
        bell(n + 12, 1.3, .23, .42);
    } else if (kind === 'give') {
        bell(n, .8, .21, 0, pan);
        tone(2100, .19, 4, .14, 0, 350, pan);
        if (c === 0) {
            tone(350, .45, 4, .25, 0, 1700, pan);
            tone(90, .24, 1, .2, 0, 170, pan);
        }
        if (c === 1) {
            tone(125, .32, 0, .45, 0, 38, pan);
            tone(480, .2, 4, .22, 0, 90, pan);
        }
        if (c === 2) for (let i = 0; i < 3; i++) tone(f * 2, .055, 1, .19, i * .065, f * 3, pan);
        if (c === 3) [0, 4, 7, 12].forEach((v, i) => bell(n + v - 12, .65, .18, i * .09, pan));
        if (c === 4) [12, 19, 24].forEach((v, i) => bell(n + v, .9, .14, i * .075, pan));
        if (c === 5) {
            tone(65, 1.1, 0, .3, 0, 195, pan, false, .25);
            tone(66, 1.05, 0, .2, 0, 198, -pan, false, .3);
        }
        if (c === 6) {
            tone(f, .65, 0, .18, 0, f / 2, -.6, false, .1);
            tone(f / 2, .7, 0, .18, 0, f * 2, .6, false, .1);
        }
    } else if (kind === 'ui') bell(12, .22, .09);
}
// 80 BPM; eight-bar arrangement, not an endlessly repeated four-note beep.
// The voicing opens up as light returns. Audio-clock lookahead avoids drift.
function music() {
    if (!audio) return;
    const now = audio.currentTime;
    if (audioMode !== mode) {
        audioMode = mode;
        musicBus.gain.setTargetAtTime(mode === 'pause' || mode === 'help' || mode === 'chapters' ? .25 : .6, now, .25);
    }
    if (muted || !soundFocus || document.hidden || audio.state !== 'running' || now < musicHold) {
        nextNote = now + .08;
        return;
    }
    if (nextNote < now - .2) nextNote = now + .04;
    while (nextNote < now + .12) {
        const delay = Math.max(0, nextNote - now), beat = noteIndex % 16, bar = Math.floor(noteIndex / 16) % 8;
        const chord = [[0, 4, 7, 14], [-3, 0, 4, 9], [-7, -3, 2, 7], [-5, 2, 7, 11]][bar % 4];
        const light = mode === 'ending' || mode === 'clear' ? 7 : mode === 'title' ? 3 : collectCount();
        if (beat === 0) {
            tone(pitch(chord[0] - 24), 3.5, 0, .13, delay, 0, 0, true, .25);
            [chord[0], chord[2], light > 2 ? chord[1] : chord[3]].forEach((n, i) => tone(pitch(n - 12), 3.2, 0, .07, delay + i * .035, 0, (i - 1) * .55, true, .45));
        }
        if (beat % 2 === 0) {
            const n = chord[[0, 2, 1, 3, 2, 1, 3, 2][beat / 2]];
            bell(n, 1.5, .12, delay, Math.sin(noteIndex * .8) * .55, true);
        }
        if (light >= 3 && [3, 7, 10, 14].includes(beat)) {
            const melody = [[12, 14, 19, 16], [16, 12, 9, 7], [7, 9, 14, 12], [14, 11, 7, 14]][bar % 4];
            bell(melody[[3, 7, 10, 14].indexOf(beat)] + (bar > 3 ? 12 : 0), 1.7, .07 + light * .006, delay, -.35, true);
        }
        if (light >= 6 && beat === 12) bell(chord[3] + 12, 2.2, .07, delay, .65, true);
        noteIndex++;
        nextNote += .1875;
    }
}
function toggleMute() {
    muted = !muted;
    if (master) master.gain.setTargetAtTime(muted || !soundFocus ? 0 : .72, audio.currentTime, .025);
    save();
}
function audioFocus(on) {
    soundFocus = on && !document.hidden;
    if (master) {
        master.gain.setTargetAtTime(muted || !soundFocus ? 0 : .72, audio.currentTime, .035);
        nextNote = audio.currentTime + .08;
    }
}

function notify(s) {
    toast = (s);
    toastLife = 2.8;
}
function emit(x, y, c, n = 22, speed = 2) {
    for (let i = 0; i < n; i++) {
        const a = Math.random() * TAU, r = Math.random() * speed;
        particles.push({
            x, y, vx: Math.cos(a) * r, vy: Math.sin(a) * r - 1, life: .5 + Math.random() * .6, c, size: 1 + Math.random() * 3
        });
    }
    if (particles.length > 450)
        particles.splice(0, particles.length - 450);
}
function loadLevel(index) {
    room = clamp(index, 0, levels.length - 1);
    world = levels[room];
    objects = JSON.parse(JSON.stringify(world.items));
    objects.forEach((o, i) => {
        o.id = i;
        o.originX = o.x;
        o.originY = o.y;
    });
    shards = world.gems.map((g, i) => ({
        x: g[0], y: g[1], c: i, got: false
    }));
    player = {
        x: world.start[0], y: world.start[1], w: 30, h: 42, vx: 0, vy: 0, face: 1, ground: false, coyote: 0, safeX: world.start[0], safeY: world.start[1], inv: 0, tele: 0, walk: 0, on: -1
    };
    held = -1;
    camera = 0;
    runTime = 0;
    moves = 0;
    deaths = 0;
    history = [];
    particles = [];
    beams = [];
    exitTimer = 0;
    shake = 0;
    flash = 0;
    jumpBuffer = 0;
    toastLife = 0;
    mode = 'play';
    for (const k in keys)
        keys[k] = false;
}
function snapshot() {
    history.push(JSON.stringify({
        objects, shards, player, held, moves
    }));
    if (history.length > 32)
        history.shift();
}
function undo() {
    if (mode !== 'play')
        return;
    if (!history.length) {
        notify("Nothing to undo yet.");
        return;
    }
    const s = JSON.parse(history.pop());
    objects = s.objects;
    shards = s.shards;
    player = s.player;
    held = s.held;
    moves = s.moves;
    player.inv = .7;
    beams = [];
    particles = [];
    sound('undo', held < 0 ? 0 : held);
    notify("Transfer undone.");
}
function portalColor(o) {
    if (o.type !== 'portal')
        return o.c;
    const source = objects.find(v => v.type === 'portal' && v.link === o.link && v.c === 6);
    return source ? 6 : -1;
}
function isPowered(o) {
    return objects.some(v => v.type === 'socket' && v.link === o.link && v.c === 2);
}
function validColor(o, c) {
    if (o.type === 'gate')
        return false;
    if (portalColor(o) >= 0)
        return false;
    return o.type === 'enemy' ? [0, 1, 4].includes(c) : o.type === 'orb' || o.need === c;
}
function obstacles() {
    let result = world.terrain.map(v => platform(...v));
    for (const o of objects) {
        let b = null;
        if (o.type === 'wood' && !o.burnt)
            b = o;
        if (o.type === 'gate' && o.progress < .98)
            b = {
                ...o, h: o.h * (1 - o.progress)
            };
        if (['rock', 'lift'].includes(o.type))
            b = o;
        if (o.type === 'enemy' && o.c === 4)
            b = o;
        if (o.type === 'pool' && o.c === 4)
            b = {
                x: o.x, y: o.y, w: o.w, h: 12, id: o.id
            };
        if (b)
            result.push({
                ...b, static: false, id: o.id
            });
        if (o.type === 'seed' && o.progress > .85)
            result.push({
                x: o.bx, y: o.by, w: o.bw, h: 12, oneWay: true, static: false, id: o.id
            });
    }
    return result;
}
function lineBlocked(x1, y1, x2, y2, target) {
    const count = Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 14);
    const blocks = world.terrain.filter(a => a[3] > 220 || a[1] < 250).map(a => platform(...a));
    for (const o of objects)
