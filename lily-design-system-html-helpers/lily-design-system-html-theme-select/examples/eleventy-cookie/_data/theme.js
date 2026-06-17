// _data/theme.js — build-time configuration for the theme select.
//
// Eleventy reads this file once per build and exposes the export at
// `{{ theme.* }}` in templates. The select resolves the per-user
// theme at runtime via localStorage; this data file only controls
// the build-time default that arrives in the SSG HTML.

module.exports = {
    defaultTheme: process.env.LILY_DEFAULT_THEME || "light",
    available: ["light", "dark", "abyss"],
};
