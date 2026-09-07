# QA — audio edition 1.1.0

Date: 2026-09-07. Browser: Chromium 144.0.7559.96.

## Shipping artifact

ZIP: 12,737 bytes; cap: 13,312; headroom: 575. Single root `index.html`; archive CRC and exact HTML equality verified. HTML before ZIP: 16,900 bytes. Context packing reconstructs the source exactly (Unicode string characters use equivalent JS escapes). Hashes: CHECKSUMS.txt.

## Gameplay and UI

All ten chapter routes collected seven diamonds and reached the clear/ending state without deaths. Routes use normal movement, jump, transfer and physics APIs; no direct player-coordinate changes or forced pickups. Each chapter is initialized with its normal load function.

Live keyboard/mouse tests pass start, help/back, absorption, undo, walking, jumping, burning thorns, pause/resume, mute, restart, invalid targets and 16:9 resizing. An additional test loads the exact shipping HTML with Playwright set_content and native eval, without a game-state bridge, captures visible title/gameplay and checks that Start/movement change the canvas.

No JavaScript errors or external resource requests occurred in these tests.

## Audio

AudioContext starts after user input. All seven emission patches, absorption, gems, teleport, jump, falling, landing, hooves and win synthesis execute. Browser analyser samples confirm a nonzero signal. Mute fades output including reverb; scheduling resumes without replaying missed notes. Focus transitions fade/restore output. One-shot voice count returns to zero after muting and waiting for tails.

Production synthesis was rendered with OfflineAudioContext for 40 seconds, stereo, 44,100 Hz. Peak: 0.374981; RMS: 0.027682; clipped PCM samples: 0; stereo difference RMS: 0.011701. These are signal measurements, not a guarantee of subjective quality on every speaker.

## Limits

The validation container blocks navigation to both file:// and localhost by administrator policy. No attempt was made to disable that policy. Browser testing therefore uses Playwright set_content; double-click launch and URL-based navigation are not verified here. The HTML itself has no external resource dependencies. Firefox, Safari, mobile hardware and the competition-hosted deployment were not tested. Desktop keyboard/mouse remains required.

The embedded decoder runs once at startup; its context tables are temporary, not part of per-frame simulation. The readable source has now been published to this GitHub repository; no js13kGames competition upload was performed as part of this QA run.
