                if (b.static && b.w >= 75 && player.x > b.x + 9 && player.x + player.w < b.x + b.w - 9) {
                    player.safeX = player.x;
                    player.safeY = player.y;
                }
                if (!wasGround) {
                    sound('land');
                    emit(player.x + 15, player.y + 42, held < 0 ? 5 : held, 5, 1);
                }
            }
            else if (player.vy < 0 && beforeY >= b.y + b.h - 8) {
                player.y = b.y + b.h;
                player.vy = 0;
            }
        }
    }
    footTimer -= dt;
    if (player.ground && Math.abs(player.vx) > 1.4 && footTimer <= 0) {
        sound('step');
        footTimer = .26;
    }
    if (player.y > 710)
        respawn();
    for (const o of objects) {
        if (player.inv <= 0) {
            const danger = o.type === 'fire' && o.c === 0 || o.type === 'pool' && o.c !== 4 || o.type === 'enemy' && o.c !== 4 && !o.burnt;
            if (danger && overlap(player, {
                x: o.x + 5, y: o.y + 5, w: o.w - 10, h: o.h - 5
            })) {
                respawn();
                break;
            }
        }
        if (o.type === 'portal' && portalColor(o) === 6 && player.tele <= 0 && overlap(player, {
            x: o.x + 8, y: o.y + 8, w: o.w - 16, h: o.h - 8
        })) {
            emit(player.x + 15, player.y + 20, 6, 40, 3);
            player.x = o.dx;
            player.y = o.dy;
            player.vx = player.vy = 0;
            player.tele = 1;
            player.inv = .7;
            emit(player.x + 15, player.y + 20, 6, 40, 3);
            sound('warp', 6);
        }
    }
    for (const g of shards)
        if (!g.got && Math.abs(g.x - (player.x + 15)) < 27 && g.y > player.y - 12 && g.y < player.y + player.h + 12) {
            g.got = true;
            sound('gem', g.c, (g.x - camera) / 640 - 1);
            emit(g.x, g.y, g.c, 30, 3);
        }
    if (collectCount() === 7 && Math.abs(player.x + 15 - world.exit[0]) < 46 && Math.abs(player.y + player.h - world.exit[1]) < 75) {
        exitTimer += dt;
        if (exitTimer > .45)
            finish();
    }
    else
        exitTimer = 0;
    camera = lerp(camera, clamp(player.x - 450, 0, (world.width || WIDTH) - WIDTH), .08);
}
// Small drawing primitives keep all the illustrations in the 13 KB package.
function rect(x, y, w, h, fill) {
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, w, h);
}
function line(points, color, width = 1) {
    ctx.beginPath();
    ctx.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2)
        ctx.lineTo(points[i], points[i + 1]);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
}
function poly(points, fill) {
    ctx.beginPath();
    ctx.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2)
        ctx.lineTo(points[i], points[i + 1]);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
}
function ellipse(x, y, rx, ry, color) {
    ctx.beginPath();
    ctx.ellipse(x, y, Math.abs(rx), Math.abs(ry), 0, 0, TAU);
    ctx.fillStyle = color;
    ctx.fill();
}
function ring(x, y, r, color, width = 1, start = 0, end = TAU) {
    ctx.beginPath();
    ctx.arc(x, y, r, start, end);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
}
function label(str, x, y, size = 16, color = '#edece7', align = 'left', font = 'sans-serif') {
    ctx.font = `${size}px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillText(str, x, y);
}
function glow(x, y, r, c, alpha = .22) {
    ctx.save();
    ctx.globalAlpha = alpha;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, c);
    g.addColorStop(1, 'transparent');
    ellipse(x, y, r, r, g);
    ctx.restore();
}
function diamond(x, y, size, c, outline = false) {
    const points = [x, y - size, x + size * .68, y, x, y + size, x - size * .68, y];
    if (outline) {
        line([...points, x, y - size], c, 1);
    }
    else {
        poly(points, c);
        poly([x, y - size, x, y + size, x - size * .68, y], '#ffffff45');
    }
}
function glyph(c, x, y, s = 12, col = colors[c]) {
    const paths = [[-6, 8, -8, 0, 0, -10, 8, 0, 5, 8, -6, 8, 0, 1, -3, 7, 3, 7], [-10, 0, 9, 0, 2, -7, 9, 0, 2, 7], [1, -11, -7, 2, 0, 2, -1, 11, 8, -2, 1, -2, 1, -11], [0, 10, 0, -6, 7, -10, 7, -4, 0, 0, -7, -6, -7, 0, 0, 4], [-9, 0, 9, 0, 0, 0, 6, -8, -6, 8, 0, 0, 6, 8, -6, -8], [-9, 8, 9, 8, 0, 8, 0, -10, -6, -4, 0, -10, 6, -4], [3, -8, -5, -8, -9, -2, -6, 6, 3, 9, 9, 2, 5, -3, -1, -3, -4, 1, 0, 4]];
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s / 12, s / 12);
    line(paths[c], col, 1.8);
    ctx.restore();
}
function button(id, str, x, y, w, h = 42, primary = false) {
    const over = pointer.x > x && pointer.x < x + w && pointer.y > y && pointer.y < y + h;
    rect(x, y, w, h, primary ? (over ? '#fff0c5' : '#e7dec4') : (over ? '#ffffff16' : '#ffffff07'));
    ctx.strokeStyle = primary ? '#f5e9c8' : '#ffffff28';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + .5, y + .5, w - 1, h - 1);
    label(str, x + w / 2, y + h / 2, 14, primary ? '#17232c' : '#e3e5e3', 'center');
    buttons.push({
        id, x, y, w, h
    });
}
function backdrop() {
    const grad = ctx.createLinearGradient(0, 0, 0, 720);
    grad.addColorStop(0, '#080e1a');
    grad.addColorStop(.65, '#203039');
    grad.addColorStop(1, '#0f1c24');
    rect(0, 0, 1280, 720, grad);
    seed = 146;
    for (let i = 0; i < 76; i++) {
        const x = (rand() * 1380 - camera * .07 + 1380) % 1380, y = rand() * 470;
        ctx.globalAlpha = .15 + (Math.sin(clock * .55 + i) + 1) * .13;
        ellipse(x, y, rand() + .5, rand() + .5, '#d7e1e5');
    }
    ctx.globalAlpha = 1;
    glow(991 - camera * .04, 188, 150, '#c4d0cd', .10);
    ellipse(991 - camera * .04, 188, 67, 67, '#b4c0bb19');
    ring(991 - camera * .04, 188, 84, '#c5cfce18');
    for (let layer = 0; layer < 3; layer++) {
        seed = 224 + layer * 44;
        const pts = [-90, 650];
        for (let x = -160; x < 1490; x += 80)
            pts.push(x - (camera * (.08 + layer * .07) % 80), 370 + layer * 53 - rand() * (130 - layer * 22));
        pts.push(1490, 720, -90, 720);
        poly(pts, ['#19242f', '#1d2c34', '#243740'][layer]);
    }
    for (let i = 0; i < 13; i++) {
        const x = (i * 203 - camera * .23 + 3300) % 2650 - 400, h = 140 + 70 * Math.sin(i * 7), y = 497;
        rect(x, y - h, 18, h, '#15232d');
        if (i % 2 === 0) {
            ctx.beginPath();
            ctx.arc(x + 62, y - h + 65, 56, Math.PI, TAU);
            ctx.lineWidth = 13;
            ctx.strokeStyle = '#172630';
            ctx.stroke();
            rect(x + 110, y - h + 65, 16, h - 65, '#172630');
        }
    }
    const mist = ctx.createLinearGradient(0, 440, 0, 625);
    mist.addColorStop(0, '#7a9c9b00');
    mist.addColorStop(.5, '#7a9c9b12');
