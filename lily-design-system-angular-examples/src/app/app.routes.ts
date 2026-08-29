import type { Routes } from "@angular/router";

// Explicit route table with plain lazy imports. The route components
// live in src/app/views/ as ordinary standalone components — NOT under
// the Analog pages/*.page.ts convention. Two independent failures made
// the conventional wiring untrustworthy here:
//
//   1. Analog's `analog-glob-routes` injects file routes by a brittle
//      string replace on `@analogjs/router` that other transforms can
//      break, leaving the route set silently empty in every mode
//      (upstream: analogjs/analog#2498).
//   2. Even a self-owned `import.meta.glob` over `pages/**/*.page.ts`
//      resolves each module as EMPTY (zero exports) in the production
//      build — the plugin claims `.page.ts` files regardless of who
//      imports them.
//
// Plain paths and plain imports side-step both. Keep this table in
// sync with src/app/views/ (one route per view; `bin/test` counts the
// registry, Playwright exercises every route).
export const routes: Routes = [
  { path: "", loadComponent: () => import("./views/home").then((m) => m.default) },
  { path: "components", loadComponent: () => import("./views/components-index").then((m) => m.default) },
  { path: "components/:slug", loadComponent: () => import("./views/component-detail").then((m) => m.default) },
  { path: "book-an-appointment", loadComponent: () => import("./views/book-an-appointment").then((m) => m.default) },
  { path: "contact-form", loadComponent: () => import("./views/contact-form").then((m) => m.default) },
  { path: "dashboard", loadComponent: () => import("./views/dashboard").then((m) => m.default) },
  { path: "dialog-flow", loadComponent: () => import("./views/dialog-flow").then((m) => m.default) },
  { path: "file-upload-form", loadComponent: () => import("./views/file-upload-form").then((m) => m.default) },
  { path: "navigation-and-menus", loadComponent: () => import("./views/navigation-and-menus").then((m) => m.default) },
  { path: "page-layout", loadComponent: () => import("./views/page-layout").then((m) => m.default) },
  { path: "rating-and-feedback", loadComponent: () => import("./views/rating-and-feedback").then((m) => m.default) },
  { path: "search-and-filter", loadComponent: () => import("./views/search-and-filter").then((m) => m.default) },
  { path: "settings-page", loadComponent: () => import("./views/settings-page").then((m) => m.default) },
  { path: "tabbed-interface", loadComponent: () => import("./views/tabbed-interface").then((m) => m.default) },
  { path: "task-management", loadComponent: () => import("./views/task-management").then((m) => m.default) },
  { path: "timeline-and-cards", loadComponent: () => import("./views/timeline-and-cards").then((m) => m.default) },
];
