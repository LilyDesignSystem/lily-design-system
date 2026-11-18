import { createRouter } from "@solidjs/router";
import Home from "./pages/Home";
import Components from "./pages/Components";
import Component from "./pages/Component";
import NotFound from "./pages/NotFound";

// One router for the app (Solid Router 2.0): routes are config objects; links are plain <a> elements, which the router
// intercepts and marks with aria-current.
export const Router = createRouter({
    routes: [
        { path: "/", component: Home },
        { path: "/components", component: Components },
        { path: "/components/:slug", component: Component },
        { path: "*404", component: NotFound },
    ],
});
