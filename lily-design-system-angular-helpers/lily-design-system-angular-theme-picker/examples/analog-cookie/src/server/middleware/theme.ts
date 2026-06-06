// src/server/middleware/theme.ts
//
// Analog v1 server middleware: read the `theme` cookie on every
// request and stash the resolved slug on event.context so the
// INITIAL_THEME injection token can forward it to the Angular tree.
//
// Equivalent to SvelteKit's `hooks.server.ts` + `transformPageChunk`.

import { defineEventHandler, getCookie } from "h3";

const KNOWN_THEMES = new Set(["light", "dark", "abyss"]);
const DEFAULT_THEME = "light";

export default defineEventHandler((event) => {
    const cookie = getCookie(event, "theme") ?? "";
    event.context.theme = KNOWN_THEMES.has(cookie) ? cookie : DEFAULT_THEME;
});
