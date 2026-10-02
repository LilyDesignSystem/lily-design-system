import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
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
