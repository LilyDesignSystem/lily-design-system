import type { Handle } from "@sveltejs/kit";

const KNOWN_SIZES = new Set(["small", "medium", "large", "x-large"]);
const DEFAULT_SIZE = "medium";

export const handle: Handle = async ({ event, resolve }) => {
    const cookie = event.cookies.get("text-size") ?? "";
    event.locals.textSize = KNOWN_SIZES.has(cookie) ? cookie : DEFAULT_SIZE;
    return resolve(event, {
        transformPageChunk: ({ html }) =>
            html.replace("%textSize%", event.locals.textSize),
    });
};
