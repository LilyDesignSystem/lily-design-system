// Minimal Svelte config consumed by `svelte-package` when it builds
// `dist/`. Plain Svelte 5 + TypeScript with no extra preprocessors;
// `vitePreprocess` handles the `lang="ts"` in the component. Not
// published: the package.json `files` allowlist ships only dist/,
// index.md, README.md.
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

export default {
  preprocess: vitePreprocess(),
};
