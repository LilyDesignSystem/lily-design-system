import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  // @lilydesignsystem/svelte-locale-translations 0.2.0 was published with an extensionless relative import
  // (`export * from "./label-pack"`), which Node's ESM loader rejects. Bundling it for SSR sidesteps that;
  // the monorepo source is fixed, so this can go once a newer version is published and installed.
  ssr: { noExternal: ['@lilydesignsystem/svelte-locale-translations'] },
  plugins: [
    sveltekit({
      preprocess: vitePreprocess(),
      adapter: adapter({
        pages: 'build',
        assets: 'build',
        fallback: '404.html',
        strict: true
      }),

      prerender: {
        // The component demos are inert example snippets — some include
        // anchors like `href="#section"` that don't have a matching id on
        // the page. Demote that prerender check from error to warn so the
        // example markup can stay faithful to real-world consumer usage.
        handleMissingId: 'warn'
      }
    })
  ]
});
