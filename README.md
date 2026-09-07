# STEAL THE RAINBOW

One horn. Seven powers. Nothing stays yours.

A self-contained 2D puzzle platformer prepared for the **Desktop** category of js13kGames 2026 and its **Unicorns and Rainbows** theme. The last unicorn cannot create colour: it can only take colour from one object and give it to another. A fire goes out when you steal its red. Give that red to thorns and a path opens. Later chapters require borrowing the same colour back instead of leaving it behind.

## Play

Run `python build_exact.py`, then open `dist/index.html` in a desktop browser. The game is a single HTML file; no runtime server, downloads, account or installation is needed. It starts on a title screen. Click **BEGIN THE HEIST** or press Enter.

The delivered standalone `STEAL_THE_RAINBOW_AUDIO_v2.html` is byte-for-byte identical to this file. This is an English-language, keyboard-and-mouse game, not a touch-optimized mobile build. Screenshots are actual captures, not concept artwork.

## Controls

| Input | Action |
|---|---|
| A / D or left / right arrows | Move |
| W / Space / up arrow | Jump; hold longer for a higher jump |
| S / down arrow | Drop through leaf bridges / faster descent |
| Left click | Take colour when the horn is empty; give it when charged |
| Z / UNDO | Undo a colour transfer, restoring that transfer's room/player snapshot |
| R | Restart this chapter |
| H | Show the chapter hint |
| Escape | Pause / resume; back from help or chapter selection |
| M / SND | Toggle sound |

Collect **all seven rainbow diamonds in every chapter**, then enter the rainbow arch. Diamonds are collectibles; the colour currently carried in the horn is a separate one-slot resource. Clicking the ground does not fire a free projectile: click the object you want to affect. There is a limited transfer range and tall barriers can block the beam. An invalid transfer does not discard the held colour.

## The seven powers

| Colour | Physical effect |
|---|---|
| Red | Remove it from fire to extinguish it; burn thorns or an ink creature |
| Orange | Move a heavy stone into position; shove an ink creature |
| Yellow | Power a generator and open its linked gate; taking it back closes that gate |
| Green | Grow a leaf bridge; reclaim it to grow a later bridge |
| Blue | Freeze a creature into a solid platform or make water walkable |
| Indigo | Raise a gravity platform; taking the colour back lowers it |
| Violet | Activate a linked portal pair; either endpoint can return the same single colour |

## Chapters

There are ten authored chapters: The last ember, Borrowed weight, A sleeping machine, A little green, Still life, Fall upwards, Somewhere else, The borrowed garden, Nothing is yours, and The last spectrum. The first seven introduce the seven powers. The eighth and ninth combine them; the final scrolling chapter uses all seven and ends with a restored rainbow.

Additional features include animated vector artwork, layered landscapes, colour beams, particles, generated audio, safe-ledge respawns, chapter selection, help, pause, and limited undo history. Where storage is available, chapter unlocks and the mute setting are saved under `str13-v1`. In-level position and best times are **not** persisted. Storage refusal is caught, so play can continue without persistence.

## Audio edition 1.1.0

The score and effects have been replaced; artwork, geometry, controls and all ten chapters are retained. See SOUND_DESIGN.md for the complete sound palette. The MP3 is only a listening preview and is not part of the shipping game.

## AI assistance

This entry was developed with AI assistance. ChatGPT assisted with game design iteration, JavaScript implementation, procedural audio design, optimization, QA automation, and documentation. The submitted game itself contains no runtime AI service, network dependency, generated external asset, or remote API call; all gameplay, graphics, audio, and data required to run are contained in the 13KB submission.

## Build

The readable gameplay source is `src/game.js`. For an exact, deterministic rebuild of the competition archive:

```sh
python -m pip install -r requirements.txt
python build_exact.py
```

`dist/game.packed.js` is the checked-in packed intermediate used for the exact competition build. `build_exact.py` combines it with `src/template.html` and writes a standard DEFLATE ZIP. The resulting archive is **12,737 / 13,312 bytes**, leaving **575 bytes**, with SHA-256 `322bb3e242df345898b89d5994beed3c3f3d896d00ea60e8b37eb64efe6c0b82`. Only `index.html` is inside.

The packed intermediate is provided for byte-for-byte reproducibility; it is **not** the review source. Reviewers should read `src/game.js`, which contains the authored gameplay, rendering, level data and procedural audio code.

## Validation

Tests consume the actual submission ZIP. The harness exports state only during testing; no test hooks ship with the game.

```sh
python -m pip install playwright numpy soundfile
python -m playwright install chromium
python tests/test_game.py
python tests/test_ui.py
python tests/test_audio.py
python tests/test_launch.py
```

`CHROMIUM_PATH` may select an installed Chromium executable. Audio testing also renders a 40-second WAV in tests/results; it is excluded from the source ZIP and submission. See QA_REPORT.md for measured results and limitations.

This repository is the readable source counterpart to the 13KB submission archive. Review the complete official competition rules before final submission.
