# IDIOT ESCAPE — Rebuilt 3D prison

A browser multiplayer prototype using Three.js, Express and Socket.IO. Includes a rebuilt connected prison with two levels of cells, stairs, a canteen, security room, courtyard, guard towers and three marked escape routes (not yet functional).

## Run locally
1. Install Node.js 20 or newer.
2. Run `npm install` then `npm start` from this folder.
3. Open http://localhost:3000 in your browser.

## Deploy on Render
Create a GitHub repository with these files at its root. In Render choose New > Web Service, connect the repository, set Build Command to `npm install` and Start Command to `npm start`. The app listens on `process.env.PORT`.

## Controls
Desktop: WASD move, mouse look (click game to lock pointer), Shift sprint, Space jump, left mouse attack, T chat, Esc release pointer. Mobile: left virtual stick, drag right half to look, JUMP and HIT buttons.

## Current limitations
Multiplayer rooms and chat, basic player attacks and hit reactions are present. Guard AI, arrest/carry, items, ragdoll joints, functional exits, authoritative physics and game win conditions are not yet implemented. The scene uses procedural geometry and stylized materials, not external authored 3D assets. Requires internet to load Three.js from CDN. Not browser-playtested in this environment.
