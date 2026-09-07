    return Math.floor(t / 60) + ':' + String(Math.floor(t % 60)).padStart(2, '0');
}
function hud() {
    const top = ctx.createLinearGradient(0, 0, 0, 125);
    top.addColorStop(0, '#071018ee');
    top.addColorStop(1, '#07101800');
    rect(0, 0, 1280, 125, top);
    rect(35, 32, 3, 49, colors[world.color]);
    label(String(room + 1).padStart(2, '0') + ' / 10', 51, 39, 11, '#a4b5b2');
    label((world.title), 51, 67, 22, '#ecede3');
    label(("STOLEN LIGHT"), 646, 31, 10, '#9badaa', 'center');
    for (let i = 0; i < 7; i++) {
        const x = 550 + i * 32;
        diamond(x, 62, 10, shards[i].got ? colors[i] : '#82988d50', !shards[i].got);
        if (shards[i].got)
            glow(x, 62, 19, colors[i], .2);
    }
    label(timeText(runTime), 894, 43, 18, '#dce4d9', 'center');
    label(moves + ' ' + ("TRANSFERS"), 894, 69, 10, '#8fa39d', 'center');
    button('pause', 'II', 980, 33, 40, 38);
    button('help', '?', 1028, 33, 40, 38);
    button('mute', muted ? 'OFF' : 'SND', 1076, 33, 56, 38);
    button('undo', 'UNDO', 1140, 33, 91, 38);
    const c = held < 0 ? '#9bb0a4' : colors[held];
    ring(59, 647, 22, c, 1.5);
    if (held >= 0)
        glyph(held, 59, 647, 13);
    else
        diamond(59, 647, 9, c, true);
    label(("HORN"), 96, 634, 10, '#90a69d');
    label(held < 0 ? ("EMPTY") : (colorNames[held]) + ' / ' + (powers[held]), 96, 656, 15, c);
    line([281, 624, 281, 672], '#b2c3ad26');
    label((world.hint), 305, 641, 15, '#cbd5c8');
    label(("A D  MOVE    W / SPACE  JUMP    CLICK  TAKE / GIVE    Z  UNDO    R  RESTART    H  HINT"), 305, 669, 11, '#869c92');
    if (toastLife > 0) {
        rect(250, 106, 780, 38, '#0a161eef');
        label(toast, 640, 125, 14, '#ecdec6', 'center');
    }
}
function titleScreen() {
    backdrop();
    const cx = 957, cy = 368;
    for (let i = 0; i < 7; i++) {
        ctx.save();
        ctx.globalAlpha = .65;
        ring(cx, cy, 196 - i * 9, colors[i], 3, Math.PI * 1.06 + i * .025, TAU - .27 + i * .014);
        ctx.restore();
        const a = Math.PI * 1.08 + i * .40;
        const x = cx + Math.cos(a) * (166 + i * 4), y = cy + Math.sin(a) * (166 + i * 4);
        glow(x, y, 45, colors[i], .16);
        diamond(x, y + Math.sin(clock * 1.5 + i) * 4, 9, colors[i]);
    }
    line([730, 570, 1140, 570], '#899688', 2);
    poly([733, 572, 1150, 572, 1111, 598, 1117, 643, 1054, 672, 1025, 645, 920, 683, 877, 643, 799, 653, 769, 607], '#18282b');
    line([780, 580, 791, 602, 779, 629], '#59695344');
    line([1110, 580, 1088, 613, 1097, 640], '#59695344');
    for (let i = 0; i < 25; i++) {
        const x = 754 + i * 15;
        line([x, 571, x + Math.sin(i) * 5, 563 - Math.sin(i * 3) * 6], '#617c6677');
    }
    drawUnicorn(934, 568, 2.25, -1, 0, -1, 0, true);
    glow(916, 397, 110, '#fbdfac', .10);
    label('S T E A L   T H E', 82, 182, 24, '#e9e7d5');
    const rainbow = ctx.createLinearGradient(80, 0, 600, 0);
    colors.forEach((c, i) => rainbow.addColorStop(i / 6, c));
    label('RAINBOW', 76, 256, 83, rainbow, 'left', 'Georgia,serif');
    label(("The world forgot its colours."), 84, 328, 19, '#c6d1c6');
    label(("You remembered how to steal them."), 84, 357, 19, '#c6d1c6');
    label(("One horn. Seven powers. Nothing stays yours."), 84, 404, 13, '#8da59b');
    button('start', (unlocked ? "CONTINUE THE HEIST   →" : "BEGIN THE HEIST   →"), 84, 460, 318, 55, true);
    button('chapters', ("CHAPTERS"), 84, 529, 153, 43);
    button('help', ("HOW TO PLAY"), 249, 529, 153, 43);
    button('mute', muted ? 'SOUND OFF' : 'SOUND ON', 1013, 39, 105, 35);
    label('js13kGames 2026', 1198, 650, 11, '#82998b', 'right');
}
function panel(title, subtitle) {
    rect(0, 0, 1280, 720, '#06111de9');
    line([350, 171, 930, 171], '#e3dfbd3c');
    label(title, 640, 218, 42, '#eae6d2', 'center', 'Georgia,serif');
    label(subtitle, 640, 263, 15, '#acbbb0', 'center');
}
function menus() {
    if (mode === 'pause') {
        panel(("PAUSED"), ("Paused."));
        button('resume', ("RESUME"), 490, 315, 300, 48, true);
        button('restart', ("RESTART CHAPTER"), 490, 377, 300, 44);
        button('chapters', ("CHAPTERS"), 490, 435, 300, 44);
        button('title', ("TITLE SCREEN"), 490, 493, 300, 44);
    }
    if (mode === 'help') {
        panel(("HOW TO PLAY"), ("Click to TAKE. Click again to GIVE."));
        for (let i = 0; i < 7; i++) {
            const x = 234 + i * 136;
            glyph(i, x, 341, 18);
            label((colorNames[i]), x, 383, 12, colors[i], 'center');
            label((powers[i]), x, 408, 11, '#a7b9ae', 'center');
        }
        label(("Carry one colour. Find 7 diamonds. Reach the arch."), 640, 460, 15, '#d8ddcf', 'center');
        label(("A / D or arrows: move   •   W / SPACE: jump   •   S: drop through leaves"), 640, 499, 14, '#94aa9c', 'center');
        label(("Z: undo a transfer   •   R: restart   •   H: hint   •   ESC: pause   •   M: sound"), 640, 530, 14, '#94aa9c', 'center');
        button('back', ("BACK"), 500, 582, 280, 46, true);
    }
    if (mode === 'chapters') {
        panel(("CHAPTERS"), ("Choose a chapter."));
        for (let i = 0; i < 10; i++) {
            const x = 158 + (i % 5) * 196, y = 314 + Math.floor(i / 5) * 120, open = i <= unlocked;
            button('level' + i, String(i + 1).padStart(2, '0') + (open ? '  ' + (colorNames[levels[i].color]) : '  —'), x, y, 180, 62, open && i === unlocked);
            label(open ? (levels[i].title) : ("NOT YET"), x + 90, y + 82, 12, open ? '#b8c9b9' : '#667e71', 'center');
        }
        button('back', ("BACK"), 500, 608, 280, 42);
    }
    if (mode === 'clear') {
        panel(("LIGHT RETURNED"), ("Seven colours returned to the sky."));
        for (let i = 0; i < 7; i++) {
            glow(496 + i * 48, 339, 30, colors[i], .2);
            diamond(496 + i * 48, 339, 14, colors[i]);
        }
        label(timeText(runTime) + '  /  ' + moves + ' ' + ("TRANSFERS") + '  /  ' + deaths + ' ' + ("FALLS"), 640, 405, 15, '#c5d4c1', 'center');
        button('next', ("NEXT CHAPTER   →"), 463, 459, 354, 53, true);
        button('restart', ("REPLAY CHAPTER"), 463, 528, 354, 43);
        button('title', ("TITLE SCREEN"), 530, 586, 220, 36);
    }
}
function ending() {
    backdrop();
    const t = clamp(exitTimer / 2.5, 0, 1);
    for (let i = 0; i < 7; i++)
        ring(640, 526, 262 - i * 14, colors[i], 9, Math.PI, Math.PI + t * Math.PI);
    glow(640, 417, 250, '#d1e4ab', .13);
    drawTerrain([200, 622, 880, 110], 1);
    drawUnicorn(639, 620, 1.6, 1, 0, 6, 0, true);
    label(("NOTHING WAS EVER YOURS."), 640, 93, 15, '#cadbc5', 'center');
    label(("Except the way home."), 640, 139, 40, '#ede8ce', 'center', 'Georgia,serif');
    label(("You gave the world its rainbow back."), 640, 194, 17, '#b8d0b7', 'center');
    button('chapters', ("PLAY AGAIN"), 1010, 620, 213, 44, true);
    button('title', ("TITLE"), 48, 620, 155, 44);
}
function render() {
