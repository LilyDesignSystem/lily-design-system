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

In a Blazor Web App, write the `<link>` tags in `App.razor`:

```razor
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="/assets/themes/light.css" />
    <link rel="stylesheet" href="/assets/themes/dark.css" />
    <link rel="stylesheet" href="/assets/themes/abyss.css" />
    <HeadOutlet />
</head>
<body>
    <Routes @rendermode="InteractiveServer" />
    <script src="_framework/blazor.web.js"></script>
</body>
</html>
```

In a plain Blazor WebAssembly app, write the `<link>` tags in
`wwwroot/index.html`.

The select's managed `<link>` also exists, but its href resolves to
a URL that is already cached — the cost is a 304.

**Pros:**
- Instant switching.
- Works with any theme catalog.
- No extra build step.

**Cons:**
- Up-front bandwidth cost equal to the sum of all theme CSS sizes.
- Each theme's CSS competes for the cascade — important when themes
  declare overlapping selectors not scoped to `:root[data-theme]`.

## Strategy 2 — `<link rel="preload" as="style">` warmup

When you want the *first* switch to be instant but don't want to
pay the cost up front for every other theme:

```razor
<head>
    <link rel="stylesheet" href="/assets/themes/light.css" />
    <link rel="preload" as="style" href="/assets/themes/dark.css" />
    <link rel="preload" as="style" href="/assets/themes/abyss.css" />
</head>
```

The browser fetches the preloaded files but doesn't parse / apply
them. When the select swaps the managed `<link>` href to one of the
preloaded URLs, the browser uses the cached response.

**Pros:**
- Lower CPU cost than Strategy 1 (only one theme parsed at a time).
- Instant switching after the preload completes.

**Cons:**
- Doesn't help the very first switch if it happens before the
  preload resolves.

## Strategy 3 — Build-time bundling

Inline every theme into a single CSS file. Each theme's rules stay
scoped to `:root[data-theme="<slug>"]` so they don't fight. The
select then doesn't need to swap stylesheets at all — only
`data-theme` changes.

```razor
<head>
    <link rel="stylesheet" href="/assets/themes/all.css" />
</head>
```

```razor
<!-- The select still emits a managed <link>; its href fetch
     resolves from the same origin as `all.css` so the cost is
     either a 304 or a small extra request you can ignore. -->
<ThemeChooser
    Label="Theme"
    ThemesUrl="/assets/themes/"
    Themes="@(new[] { "light", "dark", "abyss" })" />
```

**Pros:**
- One round-trip, instant switching.
- Easiest to cache.

**Cons:**
- Largest single payload — every visitor pays for themes they will
  never use.
- Requires a build step to concatenate themes (or a single
  hand-written `all.css`).

## Strategy 4 — Per-route theme loading

In a Blazor Web App with route-based theme assignment, use
`@page` parameters and only inject the relevant `<link>` per route.
This is over-engineered for most apps but useful for content sites
with locale-specific theme palettes.

```razor
@page "/{Locale}/{*Rest}"
@inject IHttpContextAccessor HttpContextAccessor

<HeadContent>
    <link rel="stylesheet" href="@($"/assets/themes/{Locale}.css")" />
</HeadContent>

<ThemeChooser ... />

@code {
    [Parameter] public string Locale { get; set; } = "en";
    [Parameter] public string? Rest { get; set; }
}
```

`<HeadContent>` is the Blazor-native way to inject head elements at
render time — it integrates with `<HeadOutlet>` in `App.razor`.

## Which strategy to pick

| Constraint                              | Strategy             |
| --------------------------------------- | -------------------- |
| Casual use, occasional theme change     | Default (no preload) |
| Designer / preview UI                   | Strategy 1           |
| Mobile-conscious, mostly-light apps     | Strategy 2           |
| Small catalog (2–4 themes), CDN-cached  | Strategy 3           |
| Locale-specific themes per route        | Strategy 4           |

## Cache-busting with `Extension`

For all four strategies, the select's `Extension` parameter is the
right place to append a cache-bust query:

```razor
<ThemeChooser
    Label="Theme"
    ThemesUrl="/assets/themes/"
    Themes="@(new[] { "light", "dark" })"
    Extension=".css?v=2026-06-05" />
```

The extension is concatenated verbatim onto the slug, so anything
that comes after the slug works.

## Avoiding double-fetch under Blazor Server

Blazor Server renders the markup on the server and serves it via
SignalR. The select's `OnAfterRenderAsync` runs over the SignalR
connection after the page is interactive. If your preload `<link>`
tags fire before the select's managed `<link>` is created, the
preloaded file is already cached and the select's `<link>` request
resolves from cache (304 or memory).

The two requests aren't redundant — the preload is a fetch hint,
the select's `<link>` is the active stylesheet. The browser handles
the dedup automatically.

---

Lily™ and Lily Design System™ are trademarks.
