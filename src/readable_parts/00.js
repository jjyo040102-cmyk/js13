/* STEAL THE RAINBOW — readable source.
Canvas artwork and Web Audio synthesis are generated locally. No dependencies.
Fixed-step physics, reversible colour transfers and ten authored puzzle rooms. */
'use strict';
const canvas = document.getElementById('game'), ctx = canvas.getContext('2d');
const WIDTH = 1280, HEIGHT = 720, TAU = Math.PI * 2;
const colors = ['#ff6577', '#ffad61', '#f9dd79', '#83dfac', '#7ccefc', '#9499ff', '#db9cf4'];
const colorNames = ["RED", "ORANGE", "YELLOW", "GREEN", "BLUE", "INDIGO", "VIOLET"];
const powers = ["HEAT", "FORCE", "POWER", "GROWTH", "FROST", "GRAVITY", "PORTALS"];
const keys = {}, pointer = {
    x: 0, y: 0, inside: false
};
let buttons = [], mode = 'title', previousMode = 'play', muted = false, room = 0, world, player, objects = [], shards = [], particles = [], beams = [], history = [];
let held = -1, camera = 0, clock = 0, runTime = 0, moves = 0, deaths = 0, shake = 0, flash = 0, toast = '', toastLife = 0, exitTimer = 0, accumulator = 0, lastFrame = 0, jumpBuffer = 0;
let audio, master, nextNote = 0, noteIndex = 0, unlocked = 0, seed = 31, hovered = null;
const clamp = (n, a, b) => Math.max(a, Math.min(b, n)), lerp = (a, b, t) => a + (b - a) * t;
const rand = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
};
const overlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
const center = o => ({
    x: o.x + o.w / 2, y: o.y + o.h / 2
});
function save() {
    try {
        localStorage.setItem('str13-v1', JSON.stringify({
            unlocked, muted
        }));
    }
    catch (e) {
    }
}
try {
    const s = JSON.parse(localStorage.getItem('str13-v1') || '{}');
    unlocked = clamp(s.unlocked || 0, 0, 9);
    muted = !!s.muted;
}
catch (e) {
}
// Geometry records: platforms are [x,y,width,height], object extras override defaults.
const platform = (x, y, w, h = 140) => ({
    x, y, w, h, static: true
});
const object = (type, x, y, w, h, c = -1, extra = {}) => ({
    type, x, y, w, h, c, progress: 0, ...extra
});
const orb = (x, y, c) => object('orb', x, y, 36, 50, c, {
    need: c
});
const wood = (x, y, h = 218) => object('wood', x, y, 52, h, -1, {
    need: 0
});
const rock = (x, y, tx, ty, w = 110, h = 64) => object('rock', x, y, w, h, -1, {
    need: 1, tx, ty
});
const socket = (x, y, link) => object('socket', x, y, 40, 54, -1, {
    need: 2, link
});
const gate = (x, y, h, link) => object('gate', x, y, 48, h, -1, {
    link
});
const plant = (x, y, bx, by, bw) => object('seed', x, y, 34, 42, -1, {
    need: 3, bx, by, bw
});
const pool = (x, y, w) => object('pool', x, y, w, 100, -1, {
    need: 4
});
const enemy = (x, y, w = 96, range = 46) => object('enemy', x, y, w, 44, -1, {
    home: x, range, dir: 1
});
const lift = (x, y, w, ty) => object('lift', x, y, w, 24, -1, {
    need: 5, ty, base: y
});
const portal = (x, y, link, dx, dy) => object('portal', x, y, 48, 68, -1, {
    need: 6, link, dx, dy
});
const levels = [
    {
        title: "The last ember", hint: "Take red from the fire. Give it to the thorns.", color: 0, start: [90, 546], exit: [1190, 588], terrain: [[0, 588, 1280], [755, 513, 105, 22], [924, 443, 110, 22]], items: [object('fire', 335, 530, 44, 58, 0, {
                need: 0
            }), wood(586, 340, 248)], gems: [[155, 550], [351, 463], [511, 548], [704, 550], [806, 475], [979, 405], [1139, 548]]
    },
    {
        title: "Borrowed weight", hint: "Give orange to the stone. Jump across the gap.", color: 1, start: [80, 546], exit: [1190, 588], terrain: [[0, 588, 500], [803, 588, 477], [929, 501, 118, 22]], items: [orb(240, 526, 1), rock(403, 524, 608, 545, 108, 64)], gems: [[155, 550], [337, 493], [468, 548], [660, 505], [853, 550], [987, 461], [1140, 549]]
    },
    {
        title: "A sleeping machine", hint: "Give yellow to the generator to open the gate.", color: 2, start: [80, 546], exit: [1200, 588], terrain: [[0, 588, 1280], [783, 514, 104, 22], [937, 444, 108, 22]], items: [orb(189, 530, 2), socket(432, 528, 0), gate(620, 288, 300, 0)], gems: [[130, 550], [294, 496], [519, 550], [721, 550], [836, 475], [990, 405], [1140, 550]]
    },
    {
        title: "A little green", hint: "Grow the first seed. Cross. Take green back and grow the second.", color: 3, start: [85, 546], exit: [1200, 588], terrain: [[0, 588, 416], [652, 505, 90], [945, 588, 335]], items: [orb(201, 530, 3), plant(364, 546, 404, 511, 274), plant(684, 463, 718, 460, 250)], gems: [[148, 550], [326, 548], [514, 472], [688, 465], [827, 420], [992, 549], [1138, 550]]
    },
    {
        title: "Still life", hint: "Freeze the creature for the high diamond, then move blue into the water.", color: 4, start: [85, 546], exit: [1200, 588], terrain: [[0, 588, 443], [663, 522, 82], [921, 588, 359]], items: [orb(213, 528, 4), pool(443, 588, 478), enemy(501, 521, 108, 46)], gems: [[143, 550], [361, 548], [561, 399], [704, 482], [816, 548], [990, 550], [1139, 548]]
    },
    {
        title: "Fall upwards", hint: "Give indigo to the stone. Climb the step, then the floating islands.", color: 5, start: [80, 546], exit: [1200, 470], terrain: [[0, 588, 444], [327, 514, 100, 22], [690, 371, 106, 32], [854, 421, 78, 30], [1010, 470, 270]], items: [orb(211, 530, 5), lift(455, 553, 155, 410)], gems: [[142, 550], [376, 474], [531, 370], [743, 331], [891, 381], [1066, 430], [1170, 430]]
    },
    {
        title: "Somewhere else", hint: "Power a portal and walk in. Take violet back; power the next pair.", color: 6, start: [80, 546], exit: [1210, 550], terrain: [[0, 588, 420], [441, 183, 52, 480], [553, 480, 212], [966, 550, 314], [1137, 477, 93, 20]], items: [orb(170, 530, 6), portal(322, 520, 0, 619, 438), portal(565, 412, 0, 245, 546), portal(711, 412, 1, 1080, 508), portal(1005, 482, 1, 646, 438)], gems: [[129, 550], [270, 550], [647, 442], [688, 368], [1100, 510], [1183, 438], [1244, 510]]
    },
    {
        title: "The borrowed garden", hint: "Green grows a bridge. Red burns thorns. Borrow green for the last bridge.", color: 3, start: [82, 546], exit: [1200, 588], terrain: [[0, 588, 402], [649, 515, 165], [1033, 588, 247]], items: [orb(173, 530, 3), plant(369, 546, 401, 515, 270), object('fire', 679, 457, 42, 58, 0, {
                need: 0
            }), wood(746, 258, 257), plant(787, 473, 813, 515, 246)], gems: [[139, 550], [326, 550], [514, 475], [694, 419], [768, 475], [919, 475], [1140, 550]]
    },
    {
        title: "Nothing is yours", hint: "Reclaim yellow beyond the gate. Power the far socket. Push, then freeze.", color: 4, start: [80, 546], exit: [1210, 588], terrain: [[0, 588, 754], [1056, 588, 224]], items: [orb(171, 530, 2), socket(348, 530, 0), gate(483, 282, 306, 0), orb(552, 530, 4), orb(643, 529, 1), rock(702, 534, 866, 548, 108, 54), pool(754, 588, 302), enemy(915, 444, 96, 22), socket(1030, 530, 1), gate(1110, 288, 300, 1)], gems: [[129, 550], [421, 550], [578, 488], [690, 504], [960, 338], [1072, 550], [1197, 550]]
    },
