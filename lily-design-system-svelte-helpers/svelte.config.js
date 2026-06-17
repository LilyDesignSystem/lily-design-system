// Minimal Svelte config consumed by `svelte-package` when it builds each
// helper sub-package's `dist/`. The helpers use plain Svelte 5 + TypeScript
// with no extra preprocessors, so this is intentionally bare; `vitePreprocess`
// handles the `lang="ts"` in each component.
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

export default {
  preprocess: vitePreprocess(),
};
