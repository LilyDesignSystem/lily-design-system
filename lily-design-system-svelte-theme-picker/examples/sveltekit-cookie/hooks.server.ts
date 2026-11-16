import type { Handle } from "@sveltejs/kit/hooks";
import { readThemeCookie, SYSTEM_THEME } from "@lilydesignsystem/svelte-theme-picker";

// The choices the picker offers: "system" ("Follow this device") and the themes. A cookie holding anything else
// is ignored, so it never reaches a stylesheet URL.
const CHOICES = [SYSTEM_THEME, "light", "dark", "abyss"];

function themeLinks(choice: string): string {
    // The server cannot see the device's colour scheme, so for "system" it links both and lets the browser choose.
    if (choice === SYSTEM_THEME) {
        return (
            '<link rel="stylesheet" href="/assets/themes/light.css" media="(prefers-color-scheme: light)">' +
            '<link rel="stylesheet" href="/assets/themes/dark.css" media="(prefers-color-scheme: dark)">'
        );
    }
    return `<link rel="stylesheet" href="/assets/themes/${choice}.css">`;
}

export const handle: Handle = async ({ event, resolve }) => {
    const choice =
        readThemeCookie(event.request.headers.get("cookie"), "theme", CHOICES) || SYSTEM_THEME;
    event.locals.theme = choice;
    return resolve(event, {
        transformPageChunk: ({ html }) =>
            html
                .replace("%theme%", choice === SYSTEM_THEME ? "" : choice)
                .replace("%theme-links%", themeLinks(choice)),
    });
};
