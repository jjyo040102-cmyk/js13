    ctx.setTransform(canvas.width / WIDTH, 0, 0, canvas.height / HEIGHT, 0, 0);
    buttons = [];
    if (mode === 'title') {
        titleScreen();
    }
    else if (mode === 'ending') {
        ending();
    }
    else {
        backdrop();
        if (world) {
            drawWorld();
            hud();
        }
        if (mode !== 'play')
            menus();
    }
    if (flash > .01)
        rect(0, 0, 1280, 720, `rgba(213,225,221,${flash * .23})`);
    if (pointer.inside) {
        const c = held >= 0 ? colors[held] : '#e7e6d0';
        ring(pointer.x, pointer.y, 7, c, .8);
        line([pointer.x - 13, pointer.y, pointer.x - 10, pointer.y], c, .8);
        line([pointer.x + 10, pointer.y, pointer.x + 13, pointer.y], c, .8);
    }
    canvas.style.cursor = buttons.some(b => pointer.x >= b.x && pointer.x <= b.x + b.w && pointer.y >= b.y && pointer.y <= b.y + b.h) ? 'pointer' : 'none';
}
function action(id) {
    startAudio();
    if (id !== 'mute') sound('ui');
    if (id === 'start')
        loadLevel(unlocked);
    if (id === 'resume')
        mode = 'play';
    if (id === 'pause') {
        previousMode = mode;
        mode = 'pause';
    }
    if (id === 'restart')
        loadLevel(room);
    if (id === 'next')
        loadLevel(room + 1);
    if (id === 'title')
        mode = 'title';
    if (id === 'mute')
        toggleMute();
    if (id === 'undo')
        undo();
    if (id === 'help' || id === 'chapters') {
        previousMode = mode;
        mode = id;
    }
    if (id === 'back')
        mode = previousMode === 'help' || previousMode === 'chapters' ? 'title' : previousMode;
    if (id.startsWith('level')) {
        const n = +id.slice(5);
        if (n <= unlocked)
            loadLevel(n);
    }
}
function pointerPosition(e) {
    const r = canvas.getBoundingClientRect();
    pointer.x = (e.clientX - r.left) * WIDTH / r.width;
    pointer.y = (e.clientY - r.top) * HEIGHT / r.height;
    pointer.inside = true;
}
canvas.addEventListener('pointermove', pointerPosition);
canvas.addEventListener('pointerleave', () => pointer.inside = false);
canvas.addEventListener('pointerdown', e => {
    e.preventDefault();
    if (e.button)
        return;
    pointerPosition(e);
    startAudio();
    canvas.focus();
    const b = buttons.find(v => pointer.x >= b.x && pointer.x <= b.x + b.w && pointer.y >= b.y && pointer.y <= b.y + b.h);
    if (b)
        action(b.id);
    else if (mode === 'play')
        interact(pickObject(pointer.x + camera, pointer.y));
});
window.addEventListener('keydown', e => {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code))
        e.preventDefault();
    if (e.repeat)
        return;
    keys[e.code] = true;
    startAudio();
    if (e.code === 'KeyM')
        toggleMute();
    if (e.code === 'Escape') {
        if (mode === 'play')
            action('pause');
        else if (mode === 'pause')
            action('resume');
        else if (mode === 'help' || mode === 'chapters')
            action('back');
    }
    if (mode === 'title' && (e.code === 'Enter' || e.code === 'Space')) {
        action('start');
        return;
    }
    if (mode === 'clear' && (e.code === 'Enter' || e.code === 'Space')) {
        action('next');
        return;
    }
    if (mode === 'play') {
        if (['KeyW', 'ArrowUp', 'Space'].includes(e.code))
            jumpBuffer = 9;
        if (e.code === 'KeyR')
            loadLevel(room);
        if (e.code === 'KeyZ')
            undo();
        if (e.code === 'KeyH')
            notify(world.hint);
    }
});
window.addEventListener('keyup', e => {
    keys[e.code] = false;
    if (player && ['KeyW', 'ArrowUp', 'Space'].includes(e.code) && player.vy < -5)
        player.vy = -5;
});
function unfocus() {
    audioFocus(false);
    for (const k in keys)
        keys[k] = false;
    if (mode === 'play') {
        previousMode = 'play';
        mode = 'pause';
    }
}
window.addEventListener('blur', unfocus);
window.addEventListener('focus', () => audioFocus(true));
document.addEventListener('visibilitychange', () => {
    if (document.hidden) unfocus();
    else audioFocus(true);
});
function resize() {
    const d = Math.min(window.devicePixelRatio || 1, 2), w = Math.min(innerWidth, innerHeight * 16 / 9);
    canvas.style.width = w + 'px';
    canvas.style.height = w * 9 / 16 + 'px';
    canvas.width = Math.round(w * d);
    canvas.height = Math.round(w * 9 / 16 * d);
}
window.addEventListener('resize', resize);
resize();
function frame(time) {
    const delta = Math.min((time - lastFrame) / 1000, .05);
    lastFrame = time;
    accumulator += delta;
    let count = 0;
    while (accumulator >= 1 / 60 && count++ < 4) {
        step(1 / 60);
        accumulator -= 1 / 60;
    }
    music();
    render();
    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
