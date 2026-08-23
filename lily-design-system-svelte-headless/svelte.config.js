// Consumed by `svelte-package` when it builds dist/. The library is plain
// Svelte 5 + TypeScript with no extra preprocessors, so this is bare;
// `vitePreprocess` handles the `lang="ts"` in each component.
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

export default {
  preprocess: vitePreprocess(),
};
