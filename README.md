# STEAL THE RAINBOW

One horn. Seven powers. Nothing stays yours.

A self-contained 2D puzzle platformer prepared for the **Desktop** category of js13kGames 2026 and its **Unicorns and Rainbows** theme. The last unicorn cannot create colour: it can only take colour from one object and give it to another. A fire goes out when you steal its red. Give that red to thorns and a path opens. Later chapters require borrowing the same colour back instead of leaving it behind.

## Play

Open `dist/index.html` in a desktop browser. The game is a single HTML file; no runtime server, downloads, account or installation is needed.

## Controls

| Input | Action |
|---|---|
| A / D or left / right arrows | Move |
| W / Space / up arrow | Jump |
| S / down arrow | Drop through leaf bridges / faster descent |
| Left click | Take colour / give held colour |
| Z / UNDO | Undo a colour transfer |
| R | Restart chapter |
| Escape | Pause / resume |
| M | Toggle sound |

Collect all seven rainbow diamonds in every chapter, then enter the rainbow arch.

## Minimal UI edition

The current competition build intentionally strips away most explanatory text. During play the HUD is limited to the seven diamond state, current horn colour, pause, sound, and undo. Hover labels, long gameplay instructions, stage headings, timers, transfer counters, hint toasts, exit text, and chapter-clear text are removed. Completing an exit now transitions directly through the rainbow effect into the next chapter.

There are ten authored chapters and all seven colour powers remain unchanged.

## Build

The current submission ZIP is **11,695 / 13,312 bytes**, leaving **1,617 bytes**. Only `index.html` is inside.

SHA-256:

`4a66d843afa9eb39f2782bad1aa170c06c5b0e4c7342ba9416227ff1658c3a27`

The readable source, build tools, procedural audio, and test documentation are kept in this repository as the source counterpart to the 13KB entry.
