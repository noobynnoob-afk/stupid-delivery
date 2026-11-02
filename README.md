# IDIOT ESCAPE — Prototype 01

A browser-based 3D multiplayer prison prototype for PC and mobile.

## Run locally

1. Install Node.js 20 or newer.
2. In this folder run `npm install`.
3. Run `npm start`.
4. Open http://localhost:3000.

## GitHub + Render

1. Create a GitHub repository and upload `server.js`, `index.html`, `package.json`, `render.yaml` (and this README).
2. In Render, select **New > Web Service**, connect the repository.
3. Choose Node runtime, build command `npm install`, start command `npm start`.
4. Deploy and open the resulting HTTPS URL. Share that URL with friends; create a room and send its 6-digit code.

Render free services may sleep while idle. Room state is kept in server memory and disappears on restart. Use a single server instance; multi-instance support requires a shared adapter/store.

## Controls

PC: WASD move, mouse look (click game to lock pointer), Shift run, Space jump, left click punch, T chat, Esc unlock pointer.
Mobile: left virtual joystick, drag right side to look, JUMP, HIT, CHAT.

## Stage 1 scope

Implemented: prison environment, chibi characters, multiplayer rooms, synced players, chat, basic punch damage, temporary knockdown effect, respawn, PC/mobile controls, three exit landmarks.

Not yet implemented: guard AI, capture and rescue, inventory, keys, win/lose escape rules, full physics ragdoll, persistent progression. Knockdown currently uses a visual tilt, not joint-based ragdoll.

The Three.js ES module loads from a CDN, so internet access is required in the browser.

This is an early prototype; movement is not fully server-authoritative and should not be treated as cheat-proof.
