# Preloading strategies

The default loading strategy ("swap-link") swaps the `href` of one
managed `<link>` element on each theme change. This is small,
simple, and lazy — only the active theme is fetched.

When the lazy fetch matters (a user toggles between themes during a
demo, an instructor flips themes mid-presentation, a designer is
A/B comparing), preload all themes up front so switching is instant.

## Strategy 1 — `<link rel="stylesheet">` preloads

The simplest preloading approach: drop a `<link>` per theme in the
document `<head>`. Every theme's CSS is fetched and parsed once;
the `:root[data-theme="…"]` selectors mean only the active rules
apply.

In an SSG template (`_includes/layout.njk` for Eleventy,
`layout.astro` for Astro, etc.):

```html
<head>
    <link rel="stylesheet" href="/assets/themes/light.css">
    <link rel="stylesheet" href="/assets/themes/dark.css">
    <link rel="stylesheet" href="/assets/themes/abyss.css">
    <script type="module" src="/dist/theme-picker.js"></script>
</head>
```

In a plain HTML page, write the `<link>` tags directly in the
document.

The picker's managed `<link>` also exists, but its href resolves to
a URL that is already cached — the cost is a 304.

Pros:
- Instant switching.
- Works with any theme catalog.
- No extra build step.

Cons:
- Up-front bandwidth cost equal to the sum of all theme CSS sizes.
- Each theme's CSS competes for the cascade — important when themes
  declare overlapping selectors not scoped to `:root[data-theme]`.

## Strategy 2 — `<link rel="preload" as="style">` warmup

When you want the *first* switch to be instant but don't want to
pay the cost up front for every other theme:

```html
<head>
    <link rel="stylesheet" href="/assets/themes/light.css">
    <link rel="preload" as="style" href="/assets/themes/dark.css">
    <link rel="preload" as="style" href="/assets/themes/abyss.css">
    <script type="module" src="/dist/theme-picker.js"></script>
</head>
```

The browser fetches the preloaded files but doesn't parse / apply
them. When the picker swaps the managed `<link>` href to one of the
preloaded URLs, the browser uses the cached response.

Pros:
- Lower CPU cost than Strategy 1 (only one theme parsed at a time).
- Instant switching after the preload completes.

Cons:
- Doesn't help the very first switch if it happens before the
  preload resolves.

## Strategy 3 — Build-time bundling

Inline every theme into a single CSS file. Each theme's rules stay
scoped to `:root[data-theme="<slug>"]` so they don't fight. The
picker then doesn't need to swap stylesheets at all — only
`data-theme` changes.

```html
<head>
    <link rel="stylesheet" href="/assets/themes/all.css">
    <script type="module" src="/dist/theme-picker.js"></script>
</head>

<!-- The picker still emits a managed <link>; you can point it at a
     no-op file, or leave it: themes-url + slug + .css 404s, but
     data-theme still switches because every theme's rules are
     already in all.css. -->
<theme-picker
    label="Theme"
    themes-url="/assets/themes/"
    themes="light,dark,abyss"
></theme-picker>
```

Pros:
- One round-trip, instant switching.
- Easiest to cache.

Cons:
- Largest single payload — every visitor pays for themes they will
  never use.
- Requires a build step to concatenate themes (or a single
  hand-written `all.css`).

## Strategy 4 — Service worker pre-cache

If your app is a PWA, pre-cache the entire theme catalog at
service-worker install time. Subsequent fetches are served from
cache (offline-friendly, instant on weak networks):

```js
// service-worker.js
self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open("themes-v1").then((cache) =>
            cache.addAll([
                "/assets/themes/light.css",
                "/assets/themes/dark.css",
                "/assets/themes/abyss.css",
            ]),
        ),
    );
});
self.addEventListener("fetch", (e) => {
    if (e.request.url.includes("/assets/themes/")) {
        e.respondWith(
            caches.match(e.request).then((r) => r ?? fetch(e.request)),
        );
    }
});
```

The picker still hits the network the first time, then never again
until you bump `themes-v1` to `themes-v2`.

Pros:
- Works offline.
- Pays the cost once across all visits, ever.
- Instant switching from the first switch onward.

Cons:
- Requires a service-worker registration step.
- Cache invalidation is the consumer's problem (bump the cache key
  when a theme changes).

## Which strategy to pick

| Constraint                            | Strategy             |
| ------------------------------------- | -------------------- |
| Casual use, occasional theme change   | Default (no preload) |
| Designer / preview UI                 | Strategy 1           |
| Mobile-conscious, mostly-light apps   | Strategy 2           |
| Small catalog (2–4 themes), CDN-cached | Strategy 3          |
| PWA, offline support                  | Strategy 4           |

The picker's behaviour is identical under every strategy — only
the surrounding HTML / service worker / build pipeline changes.
