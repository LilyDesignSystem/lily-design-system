/*
    Example 6 — Zero-flicker switching via preloading.

    The default loading strategy fetches the active theme CSS on demand —
    fast, but the first switch to a not-yet-loaded theme incurs a network
    round-trip. To switch instantly, preload all theme CSS files via your
    own <link> tags in the document <head>. Each theme scopes its rules
    to :root[data-theme="<slug>"], so only the rules whose attribute
    matches the live one are applied.

    In Solid, the cleanest place to drop preload <link>s is the document
    template your server renders (the <head> around renderToString's output).
    For a purely-client example, inject them in onSettled, after the first render:

    Recommended (the server's document template):

        <html lang="en">
            <head>
                <link rel="stylesheet" href="/assets/themes/light.css" />
                <link rel="stylesheet" href="/assets/themes/dark.css" />
                <link rel="stylesheet" href="/assets/themes/abyss.css" />
            </head>
            <body>{children}</body>
        </html>

    The select's managed <link> still exists, but its href resolves to
    one of the already-cached stylesheets — the network cost is just a
    304.
*/

import { onSettled } from "solid-js";
import { ThemePicker } from "../ThemePicker";

const PRELOAD = ["/assets/themes/light.css", "/assets/themes/dark.css", "/assets/themes/abyss.css"];

function injectPreload() {
    PRELOAD.forEach((href) => {
        if (document.head.querySelector(`link[href="${href}"]`)) return;
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
    });
}

export function PreloadedExample() {
    onSettled(injectPreload);

    return (
        <ThemePicker
            label="Theme"
            themesUrl="/assets/themes/"
            themes={["light", "dark", "abyss"]}
        />
    );
}

export default PreloadedExample;
