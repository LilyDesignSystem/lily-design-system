import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// Serves the e2e harness page (a real browser needs a real bundle).
export default defineConfig({ root: "e2e", plugins: [svelte()], server: { port: 4181, strictPort: true } });
