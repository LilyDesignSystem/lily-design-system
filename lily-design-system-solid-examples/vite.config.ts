import solid from "@solidjs/vite-plugin";
import { defineConfig } from "vite";

// A single-page app: `vite preview` (and any static host with a fallback to index.html) serves every route from the one
// page, and @solidjs/router renders the route from the URL. The themes are static files under public/themes/, copied
// from the repository's themes/ by bin/sync.
export default defineConfig({
    plugins: [solid()],
    resolve: {
        conditions: ["browser"],
    },
});
