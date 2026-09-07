# STEAL THE RAINBOW — 100 STAGE VARIED BUILD

A 2D puzzle platformer for js13kGames 2026. The last unicorn steals one colour at a time and transfers it between objects.

## What changed

This build replaces the old short repeating room generator with a longer, uneven difficulty campaign.

- 100 deterministic stages.
- Stage width ranges from about 1,585 px to 9,589 px; average is about 5,384 px.
- Difficulty deliberately rises and falls instead of climbing in a straight line.
- Stages 10/20/30/... are major peaks; 11/22/33/... are breather stages.
- Later hard stages contain 2- and 3-step colour relays: use a colour, cross the obstacle, reclaim the same colour, then reuse it on the next obstacle.
- Neutral traversal sections, gaps, steps, roaming creatures and vertical sections separate puzzle knots so the campaign does not feel like one repeated room.
- Stage 100 is a 9,294 px final spectrum gauntlet using all seven colours, with repeated re-use challenges.

## Controls

- A / D or arrows: move
- Space / W / Up: jump
- Click: take / give colour
- Z: undo a colour transfer
- R: restart
- Esc: pause
- M: sound

## Seven powers

- Red: extinguish fire / burn thorn walls
- Orange: move heavy rocks
- Yellow: power sockets and gates
- Green: grow bridges
- Blue: freeze pools and creatures
- Indigo: raise gravity lifts
- Violet: activate portal pairs

## Build

The current readable source is stored in `src/readable_v3_parts/`. Run `python assemble_source.py` to recreate `src/game.js`.

The exact current competition build is committed at:

- `dist/index.html`
- `dist/STEAL_THE_RAINBOW_js13k_SUBMIT.zip`

Final submission archive:

- 11,528 / 13,312 bytes
- 1,784 bytes free
- SHA-256: `ec4fc18905411997a2e43e3e57a0c7fb4ed392faefef1c1ecfc6875dd8b0afaf`

The ZIP contains only `index.html`.
