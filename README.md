# STEAL THE RAINBOW

One horn. Seven powers. Nothing stays yours.

A self-contained 2D puzzle platformer for the **Desktop** category of js13kGames 2026 and its **Unicorns and Rainbows** theme. The last unicorn cannot create colour: it can only take colour from one object and give it to another.

## Play / exact build

```sh
python -m pip install -r requirements.txt
python build_exact.py
```

Then open `dist/index.html` in a desktop browser. The game is a single self-contained HTML file with Canvas 2D graphics and Web Audio synthesis; there are no runtime downloads, APIs or external assets.

The exact competition ZIP produced by the build is **12,737 / 13,312 bytes**, leaving **575 bytes**. It contains only root `index.html` and has SHA-256:

`322bb3e242df345898b89d5994beed3c3f3d896d00ea60e8b37eb64efe6c0b82`

## Readable source

The authored readable JavaScript is stored in order under `src/readable_parts/00.js` through `08.js`. They are split only to make repository transport robust. Reconstruct the convenience file with:

```sh
python assemble_source.py
```

That creates `src/game.js` byte-for-byte from the ordered parts. The readable source contains the gameplay, ten level definitions, rendering and procedural audio implementation.

For deterministic reproduction of the tiny shipping build, the already-packed intermediate is likewise stored as ordered pieces under `dist/packed_parts/00.js` through `07.js`. `build_exact.py` concatenates those pieces, inserts them into `src/template.html`, and creates the exact standard-DEFLATE submission ZIP. The packed intermediate is for reproducibility; it is **not** the review source.

## Controls

| Input | Action |
|---|---|
| A / D or left / right arrows | Move |
| W / Space / up arrow | Jump; hold longer for a higher jump |
| S / down arrow | Drop through leaf bridges / faster descent |
| Left click | Take colour when the horn is empty; give it when charged |
| Z / UNDO | Undo a colour transfer |
| R | Restart chapter |
| H | Show chapter hint |
| Escape | Pause / resume |
| M / SND | Toggle sound |

Collect all seven rainbow diamonds in each chapter and enter the rainbow arch. The horn carries only one colour at a time, so puzzles revolve around borrowing a power, using it and deciding when to reclaim it.

## Seven powers

| Colour | Effect |
|---|---|
| Red | Heat / burn |
| Orange | Force / push |
| Yellow | Electricity / power machines |
| Green | Growth / create bridges |
| Blue | Frost / freeze enemies or water |
| Indigo | Gravity / raise platforms |
| Violet | Portals / teleportation |

There are ten handcrafted chapters. The first seven introduce one colour each, later chapters combine the mechanics, and the final scrolling chapter uses all seven.

## Audio

The original procedural score **A Colour Remembered** and all effects are synthesized at runtime with Web Audio. Colour transfers have distinct sound layers; gems, teleport, hooves, landing, jump, falling, UI and completion have separate cues. See `SOUND_DESIGN.md`.

## AI assistance

This entry was developed with AI assistance. ChatGPT assisted with design iteration, JavaScript implementation, procedural audio design, optimization, QA automation and documentation. The game contains no runtime AI service or network dependency.

## QA and submission notes

See `QA_REPORT.md`, `CHECKSUMS.txt`, `SUBMISSION_FORM_COPY.md` and `README_KO.txt`. Chromium testing covered the ten chapter routes, keyboard/mouse controls, colour transfer/undo, UI states, resizing and synthesized audio. The competition-hosted deployment has not yet been tested from this repository.

This repository is the readable-source counterpart to the 13 KB submission archive. Review the current official js13kGames rules before final submission.
