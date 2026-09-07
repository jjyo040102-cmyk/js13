# Sound design — A Colour Remembered

Original procedural score and sound definitions for STEAL THE RAINBOW.

## Palette

The score is a restrained music-box arrangement at 80 BPM with a low sine foundation and soft chord swells. It uses an eight-bar progression; the upper melody joins after three diamonds, and high shimmer after six. Seven colour pitches follow D major. Every note has an attack/release envelope and ends by disconnecting its nodes.

Absorption swells upward into a glassy chime. Emission combines a short burst with a colour-specific layer: red breath/fire, orange low impact, yellow stepped electric pulses, green ascending bloom, blue glass harmonics, indigo a low beating rise, and violet opposing stereo glides. Teleport traversal has its own spatial swell. Gems use a two-note sparkle; the seventh diamond and the exit have distinct completion figures. Hooves, landing, jump, falling and menu confirmations stay quieter than major magic actions.

All audio is generated in the browser. There are no recorded samples, external music, fonts or network requests. A deterministic filtered-noise buffer and a 1.4-second stereo room impulse are constructed once. A shared dynamics compressor provides headroom. Muting fades the whole output including reverb. Focus loss fades audio and the existing game pause logic remains in effect.

## Implementation

The readable audio implementation is in `src/readable_parts/01.js`–`02.js` and is reassembled with `python assemble_source.py` into `src/game.js`. `tone` is the shared voice, `bell` adds the glass harmonic, `sound` defines actions, and `music` schedules the arrangement against AudioContext time. Voices are capped and cleaned on completion. Rebuild and recheck the competition ZIP after any edits.
