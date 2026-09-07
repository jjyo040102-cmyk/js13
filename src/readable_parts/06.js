            glyph(2, cx, y + hh - 20, 10, isPowered(o) ? colors[2] : '#a0ac9a');
    }
    if (type === 'seed') {
        ellipse(cx, y + h, 23, 8, '#43584b');
        line([cx, y + h, cx - 1, y + 8], '#76927c', 3);
        ellipse(cx - 9, y + 14, 11, 5, c >= 0 ? col : '#738677');
        ellipse(cx + 8, y + 5, 10, 5, c >= 0 ? col : '#738677');
        if (o.progress > .015) {
            const bw = o.bw * o.progress;
            ctx.save();
            ctx.beginPath();
            ctx.rect(o.bx - 20, o.by - 70, bw + 20, 180);
            ctx.clip();
            line([cx, y + h, o.bx + 10, o.by + 13, o.bx + o.bw * .4, o.by + 9, o.bx + o.bw, o.by + 7], '#497b61', 9);
            line([o.bx, o.by + 1, o.bx + o.bw, o.by + 1], '#94d3a5', 3);
            for (let i = 10; i < o.bw; i += 26) {
                const a = o.bx + i;
                line([a, o.by + 8, a + 6, o.by - 9], '#6fb991', 2);
                ellipse(a + 8, o.by - 8, 10, 4, '#91d6a4');
                ellipse(a - 5, o.by + 20, 9, 4, '#527d65');
            }
            ctx.restore();
        }
        if (c < 0)
            glyph(3, cx, y - 18, 9, '#9caf9c');
    }
    if (type === 'pool') {
        const water = ctx.createLinearGradient(0, y, 0, y + h);
        water.addColorStop(0, c === 4 ? '#7ccefc80' : '#93a5ab30');
        water.addColorStop(1, '#26343b05');
        rect(x, y, w, h, water);
        for (let j = 0; j < 3; j++) {
            const pts = [];
            for (let i = 0; i <= w; i += 10)
                pts.push(x + i, y + j * 9 + (c === 4 ? 0 : Math.sin(clock * 2 + i * .06 + j) * 2));
            line(pts, c === 4 ? '#b6e8ff' : j ? '#a5bfc523' : '#8ba3ac77', j ? 1 : 2);
        }
        if (c === 4) {
            for (let k = 20; k < w; k += 57)
                line([x + k, y + 3, x + k + 15, y + 10, x + k + 29, y + 4], '#e3f9ff80');
        }
        else
            glyph(4, cx, y + 27, 13, '#a8bfc079');
    }
    if (type === 'enemy') {
        if (o.burnt) {
            ellipse(cx, y + h - 6, 25, 7, '#3b3239');
            diamond(cx, y + h - 17, 9, o.c >= 0 ? colors[o.c] : '#728187');
        }
        else {
            const bob = o.c === 4 ? 0 : Math.sin(clock * 4 + o.id) * 4;
            ellipse(cx, y + 24 + bob, w * .46, 25, '#18242d');
            ellipse(cx - 15, y + 19 + bob, 5, 3, '#d9dfdb');
            ellipse(cx + 15, y + 19 + bob, 5, 3, '#d9dfdb');
            if (o.c === 4) {
                rect(x - 3, y - 4, w + 6, h + 7, '#88cdef55');
                line([x, y - 4, x + w, y - 4], '#d2f4ff', 3);
                glyph(4, cx, y + 20, 10);
            }
        }
    }
    if (type === 'portal') {
        poly([x - 11, y + h + 3, x + w + 11, y + h + 3, x + w + 4, y + h + 10, x - 4, y + h + 10], '#486057');
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(.62, 1);
        ring(0, 0, 35, c >= 0 ? col : '#6c8278', 4);
        ring(0, 0, 29, c >= 0 ? '#db9cf450' : '#31453e', 2);
        if (c >= 0) {
            glow(0, 0, 42, col, .4);
            ring(0, 0, 15, col, 1, clock, clock + 4);
        }
        ctx.restore();
        label(String.fromCharCode(65 + o.link), cx, y - 19, 11, c >= 0 ? col : '#9eada1', 'center');
    }
    if (o === hovered) {
        ctx.save();
        ctx.globalAlpha = .8;
        const edge = held < 0 ? (c >= 0 ? colors[c] : '#d9dacc') : (validColor(o, held) ? colors[held] : '#b0a3a0');
        ctx.setLineDash([4, 5]);
        ctx.strokeStyle = edge;
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 7, y - 7, w + 14, h + 14);
        ctx.restore();
    }
}
function drawExit() {
    const [x, y] = world.exit, amount = collectCount();
    rect(x - 46, y - 4, 92, 9, '#7c8b79');
    poly([x - 53, y + 5, x + 53, y + 5, x + 41, y + 17, x - 41, y + 17], '#425b52');
    for (let i = 0; i < 7; i++) {
        const r = 38 + i * 4;
        ctx.save();
        ctx.translate(x, y - 54);
        ctx.scale(.73, 1);
        ring(0, 0, r, shards[i].got ? colors[i] : '#71877c30', 2.5, Math.PI * .9, Math.PI * 2.1);
        ctx.restore();
    }
    if (amount === 7) {
        glow(x, y - 47, 108, '#b9e5e0', .25);
        for (let i = 0; i < 5; i++)
            ellipse(x + Math.sin(clock * 2 + i * 2) * 16, y - 17 - (clock * 18 + i * 16) % 80, 1.5, 1.5, colors[i]);
    }
    label(amount === 7 ? ("RETURN THE LIGHT") : amount + ' / 7', x, y - 129, 11, amount === 7 ? '#e0e9d4' : '#aebcb0', 'center');
}
function drawWorld() {
    ctx.save();
    ctx.translate(-camera + (Math.random() - .5) * shake, (Math.random() - .5) * shake);
    for (let i = 0; i < world.terrain.length; i++)
        drawTerrain(world.terrain[i], i);
    hovered = pointer.inside ? pickObject(pointer.x + camera, pointer.y) : null;
    for (const o of objects)
        if (o.type === 'pool')
            drawObject(o);
    for (const o of objects)
        if (o.type !== 'pool')
            drawObject(o);
    drawExit();
    for (const g of shards)
        if (!g.got) {
            const y = g.y + Math.sin(clock * 2.5 + g.c) * 3;
            glow(g.x, y, 35, colors[g.c], .21);
            diamond(g.x, y, 10, colors[g.c]);
            ring(g.x, y, 17, '#d6e8dc18');
        }
    ctx.save();
    if (player.inv > 0)
        ctx.globalAlpha = .55 + Math.sin(clock * 28) * .25;
    ellipse(player.x + 15, player.y + player.h + 3, 24, 4, '#010a0c44');
    if (held >= 0)
        glow(player.x + 15, player.y + 2, 74, colors[held], .18);
    drawUnicorn(player.x + 15, player.y + 42, 1, player.face, Math.abs(player.vx) > .15 ? player.walk : 0, held, player.vy);
    ctx.restore();
    for (const p of particles) {
        ctx.globalAlpha = clamp(p.life / .55, 0, 1);
        rect(p.x, p.y, p.size, p.size, colors[p.c] || '#c8d6d2');
    }
    ctx.globalAlpha = 1;
    for (const b of beams) {
        ctx.globalAlpha = b.life / .38;
        const pts = [];
        for (let j = 0; j <= 24; j++) {
            const t = j / 24;
            pts.push(lerp(b.x1, b.x2, t), lerp(b.y1, b.y2, t) + Math.sin(t * TAU + clock * 15) * 10 * Math.sin(t * Math.PI));
        }
        line(pts, colors[b.c], 3);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
    const shade = ctx.createLinearGradient(0, 590, 0, 720);
    shade.addColorStop(0, '#07101800');
    shade.addColorStop(1, '#071018');
    rect(0, 590, 1280, 130, shade);
    if (hovered && mode === 'play' && pointer.y > 105 && pointer.y < 615) {
        const c = portalColor(hovered), want = held < 0 ? c : held, action = held < 0 ? ("TAKE") : ("GIVE");
        const t = hovered.type.toUpperCase() + (want >= 0 ? '  /  ' + action + ' ' + (colorNames[want]) : '');
        const x = clamp(pointer.x, 160, 1110), y = clamp(pointer.y - 44, 137, 580);
        ctx.font = '12px sans-serif';
        const w = ctx.measureText(t).width + 30;
        rect(x - w / 2, y - 14, w, 28, '#0a151eea');
        label(t, x, y, 12, want >= 0 ? colors[want] : '#c1d1c8', 'center');
    }
}
function timeText(t) {
