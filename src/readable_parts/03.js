        if (o !== target && (o.type === 'wood' && !o.burnt || o.type === 'gate' && o.progress < .95))
            blocks.push({
                ...o, h: o.type === 'gate' ? o.h * (1 - o.progress) : o.h
            });
    for (let i = 2; i < count - 1; i++) {
        const x = lerp(x1, x2, i / count), y = lerp(y1, y2, i / count);
        if (blocks.some(b => x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h))
            return true;
    }
    return false;
}
function pickObject(x, y) {
    let best = null, dist = Infinity;
    for (const o of objects) {
        if (o.type === 'gate')
            continue;
        let dx = Math.max(o.x - x, 0, x - o.x - o.w), dy = Math.max(o.y - y, 0, y - o.y - o.h);
        if (dx * dx + dy * dy < 484) {
            const p = center(o), d = Math.hypot(x - p.x, y - p.y);
            if (d < dist) {
                dist = d;
                best = o;
            }
        }
    }
    return best;
}
function interact(o) {
    if (!o || mode !== 'play')
        return;
    const p = center(player), q = center(o), c = portalColor(o);
    if (Math.hypot(q.x - p.x, q.y - p.y) > 510) {
        notify("Move closer: the horn has limited reach.");
        return;
    }
    if (lineBlocked(p.x, p.y - 18, q.x, q.y, o)) {
        notify("The beam is blocked. Try another angle.");
        return;
    }
    if (held < 0 && c < 0) {
        notify("No colour. Take one from a glowing object.");
        return;
    }
    if (held >= 0 && !validColor(o, held)) {
        notify(c >= 0 ? "Horn full. Give its colour to an empty object." : "Wrong colour. Nothing was lost.");
        return;
    }
    snapshot();
    moves++;
    const taking = held < 0, used = taking ? c : held;
    if (taking) {
        held = c;
        o.c = -1;
        if (o.type === 'portal')
            objects.filter(v => v.type === 'portal' && v.link === o.link).forEach(v => v.c = -1);
        sound('take', c, (q.x - camera) / 640 - 1);
    }
    else {
        o.c = held;
        held = -1;
        if (o.type === 'wood')
            o.burning = .01;
        if (o.type === 'rock' && used === 1)
            o.moving = true;
        if (o.type === 'enemy' && used === 0)
            o.burnt = true;
        if (o.type === 'enemy' && used === 1) {
            o.home = clamp(o.home + (p.x < q.x ? 95 : -95), 60, (world.width || WIDTH) - 160);
            o.x = o.home;
        }
        sound('give', used, (q.x - camera) / 640 - 1);
    }
    beams.push({
        x1: taking ? q.x : p.x + player.face * 25, y1: taking ? q.y : p.y - 36, x2: taking ? p.x + player.face * 25 : q.x, y2: taking ? p.y - 36 : q.y, c: used, life: .38
    });
    emit(q.x, q.y, used, 30, 3);
    shake = 2;
}
function collectCount() {
    return shards.reduce((a, b) => a + !!b.got, 0);
}
function respawn() {
    deaths++;
    sound('die');
    emit(player.x + 15, player.y + 20, held < 0 ? 4 : held, 40, 4);
    player.x = player.safeX;
    player.y = player.safeY;
    player.vx = player.vy = 0;
    player.inv = 1.6;
    player.tele = .5;
    shake = 7;
    flash = .35;
}
function finish() {
    mode = room === 9 ? 'ending' : 'clear';
    sound('win');
    unlocked = Math.max(unlocked, Math.min(room + 1, 9));
    save();
    exitTimer = 0;
}
// A fixed 60 Hz step keeps movement independent of display refresh rate.
function step(dt) {
    clock += dt;
    toastLife = Math.max(0, toastLife - dt);
    for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += .025;
        p.life -= dt;
    }
    particles = particles.filter(p => p.life > 0);
    for (const b of beams)
        b.life -= dt;
    beams = beams.filter(b => b.life > 0);
    shake *= .88;
    flash *= .93;
    if (mode !== 'play') {
        if (mode === 'ending')
            exitTimer += dt;
        return;
    }
    runTime += dt;
    player.inv = Math.max(0, player.inv - dt);
    player.tele = Math.max(0, player.tele - dt);
    const previousPlatforms = objects.map(o => o.y);
    for (const o of objects) {
        if (o.type === 'wood' && o.burning) {
            o.burning += dt;
            if (o.burning > .45) {
                o.burnt = true;
                o.burning = 0;
                emit(o.x + o.w / 2, o.y + o.h / 2, 0, 50, 4);
            }
        }
        if (o.type === 'gate')
            o.progress = lerp(o.progress, isPowered(o) ? 1 : 0, .095);
        if (o.type === 'seed')
            o.progress = lerp(o.progress, o.c === 3 ? 1 : 0, .11);
        if (o.type === 'rock' && o.moving) {
            o.x = lerp(o.x, o.tx, .065);
            o.y = lerp(o.y, o.ty, .065);
            if (Math.abs(o.x - o.tx) < .05)
                o.moving = false;
        }
        if (o.type === 'lift')
            o.y = lerp(o.y, o.c === 5 ? o.ty : o.base, .04);
        if (o.type === 'enemy' && o.c !== 4 && !o.burnt) {
            o.x += o.dir * .65;
            if (o.x > o.home + o.range || o.x < o.home)
                o.dir *= -1;
        }
    }
    if (player.on >= 0 && player.ground) {
        const o = objects[player.on];
        if (o && ['lift', 'rock'].includes(o.type))
            player.y += o.y - previousPlatforms[player.on];
    }
    const direction = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0);
    player.vx = lerp(player.vx, direction * 4.25, player.ground ? .22 : .13);
    if (direction)
        player.face = direction;
    player.walk += Math.abs(player.vx) * .085;
    player.coyote = player.ground ? 7 : Math.max(0, player.coyote - 1);
    jumpBuffer = Math.max(0, jumpBuffer - 1);
    if (jumpBuffer > 0 && player.coyote > 0) {
        player.vy = -11.75;
        player.ground = false;
        player.coyote = 0;
        jumpBuffer = 0;
        sound('jump');
        emit(player.x + 15, player.y + 42, held < 0 ? 5 : held, 8, 1.5);
    }
    player.vy = Math.min(player.vy + .5, 15);
    if ((keys.KeyS || keys.ArrowDown) && !player.ground)
        player.vy += .3;
    const solids = obstacles();
    player.x += player.vx;
    for (const b of solids)
        if (!b.oneWay && overlap(player, b)) {
            if (player.vx > 0)
                player.x = b.x - player.w;
            else if (player.vx < 0)
                player.x = b.x + b.w;
            player.vx = 0;
        }
    player.x = clamp(player.x, 4, (world.width || WIDTH) - player.w - 4);
    const beforeY = player.y;
    player.y += player.vy;
    const wasGround = player.ground;
    player.ground = false;
    player.on = -1;
    for (const b of solids) {
        if (b.oneWay && (keys.KeyS || keys.ArrowDown || beforeY + player.h > b.y + 3 || player.vy < 0))
            continue;
        if (overlap(player, b)) {
            if (player.vy >= 0 && beforeY + player.h <= b.y + 12) {
                player.y = b.y - player.h;
                player.vy = 0;
                player.ground = true;
                player.on = b.id === undefined ? -1 : b.id;
