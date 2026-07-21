// svelte-package reads this when building dist/. It reuses the catalog's
// shared config (vitePreprocess only — no extra preprocessors). Not published:
// the package.json `files` allowlist ships only dist/, index.md, README.md.
export { default } from "../svelte.config.js";
