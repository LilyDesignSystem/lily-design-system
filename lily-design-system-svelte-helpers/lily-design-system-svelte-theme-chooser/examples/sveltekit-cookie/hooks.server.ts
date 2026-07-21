import type { Handle } from "@sveltejs/kit";

const KNOWN_THEMES = new Set(["light", "dark", "abyss"]);
const DEFAULT_THEME = "light";

export const handle: Handle = async ({ event, resolve }) => {
    const cookie = event.cookies.get("theme") ?? "";
    event.locals.theme = KNOWN_THEMES.has(cookie) ? cookie : DEFAULT_THEME;
    return resolve(event, {
        transformPageChunk: ({ html }) =>
            html.replace("%theme%", event.locals.theme),
    });
};
