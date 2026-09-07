# STEAL THE RAINBOW — 100 STAGE VARIED BUILD

A 2D puzzle platformer for js13kGames 2026. The last unicorn steals one colour at a time and transfers it between objects.

## Current build

- 100 deterministic stages
- stage widths roughly 1,585–9,589 px; average about 5,384 px
- difficulty deliberately rises and falls instead of climbing in a straight line
- stages 10/20/30/... are major peaks; 11/22/33/... are breather stages
- later stages use 2- and 3-step colour relays: use a colour, cross, reclaim it, then reuse it
- gaps, steps, roaming creatures, vertical sections and neutral traversal split up the puzzle knots
- stage 100 is a 9,294 px final spectrum gauntlet using all seven colours

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

## Competition build

`dist/index.html` is the GitHub playable mirror of the current 100-stage build.

The authoritative js13kGames upload is:

`dist/STEAL_THE_RAINBOW_js13k_SUBMIT.zip`

- 11,528 / 13,312 bytes
- 1,784 bytes free
- SHA-256: `ec4fc18905411997a2e43e3e57a0c7fb4ed392faefef1c1ecfc6875dd8b0afaf`
- contains only root-level `index.html`

The source repository will continue to be updated alongside the competition build; the submission ZIP above is the file to upload to js13kGames.
