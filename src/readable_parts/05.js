    mist.addColorStop(1, '#7a9c9b00');
    rect(0, 440, 1280, 185, mist);
}
function drawTerrain(p, index) {
    const [x, y, w, h = 150] = p;
    rect(x, y, w, h, '#19262e');
    poly([x, y + 9, x + w, y + 9, x + w - 8, y + h, x + 5, y + h], '#142129');
    rect(x, y, w, 5, '#71817c');
    rect(x, y + 5, w, 5, '#354943');
    line([x, y + 12, x, y + h - 8], '#70817e24');
    line([x + w - 1, y + 9, x + w - 1, y + h - 2], '#70817e22');
}
function drawUnicorn(x, y, scale = 1, facing = 1, phase = 0, charge = -1, velocity = 0, rainbow = false) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale * facing, scale);
    ctx.rotate(clamp(velocity * .006, -.1, .1));
    const col = charge >= 0 ? colors[charge] : '#aeb9bd', bob = Math.sin(phase * 2) * 1.4;
    ctx.translate(0, bob);
    const hair = (n) => rainbow ? colors[n % 7] : col;
    // Four legs swing in opposing pairs; hooves stay connected to the hips.
    for (let i = 0; i < 4; i++) {
        const hip = i < 2 ? -15 : 13, off = i % 2 ? Math.PI : 0, step = Math.sin(phase + off + (i < 2 ? 0 : Math.PI)) * (phase ? 7 : 0);
        line([hip, -25, hip + step * .6, -12, hip + step, -2], i % 2 ? '#a9babd' : '#dfe7e4', 6);
        line([hip + step - 2, -1, hip + step + 3, -1], '#7f999d', 4);
    }
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(-20, -31);
        ctx.bezierCurveTo(-39, -49 + i * 4, -34 + Math.sin(clock * 3 + i) * 4, -11, -53, -21 + i * 3);
        ctx.strokeStyle = hair(i);
        ctx.lineWidth = 5 - i * .6;
        ctx.stroke();
    }
    ellipse(-1, -29, 25, 14, '#e4eae7');
    ellipse(-9, -33, 14, 9, '#f2f2e9');
    poly([8, -28, 12, -47, 18, -58, 26, -53, 24, -31, 18, -21], '#e9eeea');
    ellipse(25, -51, 13, 10, '#f2f1e7');
    poly([30, -54, 42, -47, 41, -41, 25, -42], '#f0efe5');
    ellipse(39, -45, 5, 4, '#d7e1dc');
    poly([15, -57, 15, -70, 24, -60], '#e3ebe5');
    poly([17, -60, 18, -67, 21, -60], col);
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(19 + i * .4, -59 + i * 1.7);
        ctx.bezierCurveTo(9 - i * 1.3, -57, 15 - i * 2, -36, 2 - i * 2, -24);
        ctx.strokeStyle = hair(i);
        ctx.lineWidth = 3.7;
        ctx.stroke();
    }
    const horn = ctx.createLinearGradient(28, -78, 34, -53);
    horn.addColorStop(0, charge >= 0 ? colors[charge] : '#fff2c3');
    horn.addColorStop(1, '#bac3b6');
    poly([27, -59, 37, -84, 34, -56], horn);
    line([30, -64, 34, -62, 31, -68, 35, -66], '#1b2c3638', .8);
    ellipse(31, -52, 2.1, 2.4, '#1b2931');
    ellipse(31.6, -53, .7, .8, '#fff');
    ellipse(40, -46, .8, .8, '#71817b');
    line([33, -40, 38, -40], '#71817b', .8);
    ctx.restore();
}
function drawObject(o) {
    const { x, y, w, h, type } = o, c = portalColor(o), col = c >= 0 ? colors[c] : '#789093', cx = x + w / 2, cy = y + h / 2;
    if (x > camera + 1340 || x + w < camera - 70)
        return;
    if (c >= 0)
        glow(cx, cy, type === 'pool' ? 105 : 78, col, .17);
    if (type === 'orb') {
        line([cx, y + 15, cx, y + h + 4], '#5a716f', 3);
        poly([x + 4, y + h, x + w - 4, y + h, x + w + 2, y + h + 8, x - 2, y + h + 8], '#536963');
        ring(cx, y + 17, 20, '#516866', 2);
        diamond(cx, y + 17 + Math.sin(clock * 2 + o.id) * 2, 13, col);
        if (c >= 0)
            glyph(c, cx, y - 24, 9);
    }
    if (type === 'fire') {
        poly([x - 6, y + h, x + 10, y + h - 10, x + w, y + h - 8, x + w + 8, y + h + 3], '#52645e');
        line([x + 2, y + h - 4, x + w - 2, y + h - 14], '#9a9682', 5);
        if (c === 0) {
            for (let j = 0; j < 4; j++) {
                const dy = Math.sin(clock * 7 + j) * 5;
                ctx.beginPath();
                ctx.moveTo(cx, y + h - 8);
                ctx.bezierCurveTo(x - 9 + j * 5, y + 29, cx + 3, y + 10 + dy, cx + 2, y - 6 - j * 3);
                ctx.bezierCurveTo(x + w + 10, y + 30, cx + 26, y + h - 3, cx, y + h - 8);
                ctx.fillStyle = j % 2 ? '#ffcc8e' : '#ff6577';
                ctx.fill();
            }
        }
        else {
            for (let j = 0; j < 3; j++)
                ellipse(cx + Math.sin(clock + j) * 7, y - ((clock * 20 + j * 16) % 38) + 40, 3, 4, '#bec9c225');
        }
    }
    if (type === 'wood') {
        if (o.burnt) {
            poly([x, y + h, x + w * .4, y + h - 15, x + w, y + h, x + w, y + h + 6, x, y + h + 6], '#65554c');
            if (o.c === 0)
                diamond(cx, y + h - 19, 9, col);
        }
        else {
            for (let i = 0; i < 5; i++) {
                const ax = x + i * w / 5;
                line([ax, y + h, ax + Math.sin(i) * 15, y + h * .6, ax - 8, y + h * .25, ax + 3, y], o.burning ? '#ed9f6a' : '#65736a', 6);
                for (let j = 1; j < 5; j++)
                    poly([ax, y + h * j / 5, ax + (j % 2 ? -18 : 18), y + h * j / 5 - 20, ax + 2, y + h * j / 5 - 10], o.burning ? '#ed9f6a' : '#778174');
            }
            glyph(0, cx, y - 22, 10, '#a8b1a2');
        }
    }
    if (type === 'rock' || type === 'lift') {
        if (type === 'rock') {
            ctx.save();
            ctx.setLineDash([4, 7]);
            ctx.strokeStyle = '#9aa7a533';
            ctx.lineWidth = 1;
            ctx.strokeRect(o.tx, o.ty, w, h);
            ctx.restore();
            line([o.originX + w / 2, o.originY + h + 8, o.tx + w / 2, o.ty + h + 8], '#94a69a18');
        }
        poly([x + 8, y, x + w - 8, y, x + w, y + 12, x + w - 6, y + h, x + 5, y + h, x, y + 9], '#405653');
        poly([x + 8, y, x + w - 8, y, x + w - 16, y + 9, x + 3, y + 9], '#899589');
        line([x + 7, y + h - 5, x + w - 8, y + h - 5], c >= 0 ? col : '#748879', 2);
        glyph(type === 'rock' ? 1 : 5, cx, cy, Math.min(13, h * .38), c >= 0 ? col : '#9ba997');
        if (type === 'lift' && c === 5) {
            for (let i = 0; i < 3; i++) {
                const dy = ((clock * 25 + i * 16) % 54);
                line([x + 22 + i * 42, y + h + dy, x + 22 + i * 42, y + h + dy + 7], '#9499ff55', 2);
            }
        }
    }
    if (type === 'socket') {
        rect(x, y + h - 8, w, 8, '#59706a');
        poly([x + 4, y, x + w - 4, y, x + w, y + h - 8, x, y + h - 8], '#304b4a');
        ring(cx, cy - 5, 16, c >= 0 ? col : '#81908a', 2);
        glyph(2, cx, cy - 5, 10, c >= 0 ? col : '#81908a');
        const g = objects.find(v => v.type === 'gate' && v.link === o.link);
        if (g) {
            ctx.save();
            ctx.setLineDash([3, 5]);
            line([cx, y + h + 8, g.x + g.w / 2, y + h + 8, g.x + g.w / 2, g.y + g.h], c >= 0 ? '#f9dd7977' : '#75878235', 1);
            ctx.restore();
        }
    }
    if (type === 'gate') {
        const hh = h * (1 - o.progress);
        rect(x - 8, y - 8, w + 16, 14, '#556a66');
        for (let i = 0; i < 3; i++) {
            rect(x + i * 18, y, 12, hh, '#415956');
            line([x + i * 18 + 3, y + 4, x + i * 18 + 3, y + hh], isPowered(o) ? '#f9dd79' : '#71877c', 1);
        }
        if (hh > 25)
