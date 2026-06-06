// src/server/routes/api/theme.post.ts
//
// Tiny Analog v1 endpoint to write the `theme` cookie when the user
// picks a new theme. Validates against a known set first.

import { defineEventHandler, readBody, setCookie } from "h3";

const KNOWN_THEMES = new Set(["light", "dark", "abyss"]);

export default defineEventHandler(async (event) => {
    const body = (await readBody<{ theme?: string }>(event)) ?? {};
    const slug = String(body.theme ?? "");
    if (!KNOWN_THEMES.has(slug)) {
        event.node.res.statusCode = 400;
        return { error: "Unknown theme" };
    }
    setCookie(event, "theme", slug, {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
    });
    event.node.res.statusCode = 204;
    return null;
});
