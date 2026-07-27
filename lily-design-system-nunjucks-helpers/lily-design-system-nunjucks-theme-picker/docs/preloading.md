# Preloading strategies

The default loading strategy ("swap-link") swaps the `href` of one
managed `<link>` element on each theme change. This is small,
simple, and lazy — only the active theme is fetched.

When the lazy fetch matters (a user toggles between themes during
a demo, an instructor flips themes mid-presentation, a designer is
A/B comparing), preload all themes up front so switching is
instant.

## Strategy 1 — `<link rel="stylesheet">` preloads

The simplest preloading approach: drop a `<link>` per theme in the
document `<head>`. Every theme's CSS is fetched and parsed once;
the `:root[data-theme="…"]` selectors mean only the active rules
apply.

In an Eleventy layout:

```njk
{# _includes/layouts/base.njk #}
<head>
    {% for theme in themes %}
    <link rel="stylesheet" href="/assets/themes/{{ theme }}.css">
    {% endfor %}
    <title>{{ title }}</title>
</head>
```

with `themes` either inlined or pulled from `_data/themes.js`. The
control's managed `<link>` also exists, but its href resolves to a
URL that is already cached — the cost is a 304.

Pros:
- Instant switching.
- Works with any theme catalog.
- No extra build step.

Cons:
- Up-front bandwidth cost equal to the sum of all theme CSS
  sizes.
- Each theme's CSS competes for the cascade — important when
  themes declare overlapping selectors not scoped to
  `:root[data-theme]`.

## Strategy 2 — `<link rel="preload" as="style">` warmup

When you want the *first* switch to be instant but don't want to
pay the cost up front for every other theme:

```njk
<head>
    <link rel="stylesheet" href="/assets/themes/{{ site.defaultTheme }}.css">
    {% for theme in themes %}
        {% if theme != site.defaultTheme %}
    <link rel="preload" as="style" href="/assets/themes/{{ theme }}.css">
        {% endif %}
    {% endfor %}
</head>
```

The browser fetches the preloaded files but doesn't parse / apply
them. When the client swaps the managed `<link>` href to one of
the preloaded URLs, the browser uses the cached response.

Pros:
- Lower CPU cost than Strategy 1 (only one theme parsed at a
  time).
- Instant switching after the preload completes.

Cons:
- Doesn't help the very first switch if it happens before the
  preload resolves.

## Strategy 3 — Build-time bundling

Inline every theme into a single CSS file. Each theme's rules stay
scoped to `:root[data-theme="<slug>"]` so they don't fight. The
client then doesn't need to swap stylesheets at all — only
`data-theme` changes.

```njk
<head>
    <link rel="stylesheet" href="/assets/themes/all.css">
</head>
<body>
    {# The client still manages a <link>; you can point it at a
       no-op file, or ignore it entirely by reading onChange and
       setting data-theme yourself. #}
    {{ themeChooser({
        label: "Theme",
        themesUrl: "/assets/themes/",
        themes: ["light", "dark", "abyss"],
        extension: ".css"
    }) }}
</body>
```

Pros:
- One round-trip, instant switching.
- Easiest to cache.

Cons:
- Largest single payload — every visitor pays for themes they
  will never use.
- Requires a build step to concatenate themes (or a single
  hand-written `all.css`).

## Eleventy: bundle themes at build time

Add a custom Eleventy template that concatenates `themes/*.css`
into `themes/all.css`:

```js
// .eleventy.js
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export default function (eleventyConfig) {
    eleventyConfig.on("eleventy.before", () => {
        const dir = join(process.cwd(), "src/assets/themes");
        const all = readdirSync(dir)
            .filter((f) => f.endsWith(".css") && f !== "all.css")
            .map((f) => readFileSync(join(dir, f), "utf8"))
            .join("\n");
        writeFileSync(join(dir, "all.css"), all);
    });
    eleventyConfig.addPassthroughCopy("src/assets/themes");
}
```

## Which strategy to pick

| Constraint                            | Strategy             |
| ------------------------------------- | -------------------- |
| Casual use, occasional theme change   | Default (no preload) |
| Designer / preview UI                 | Strategy 1           |
| Mobile-conscious, mostly-light apps   | Strategy 2           |
| Small catalog (2–4 themes), CDN-cached | Strategy 3          |

---

Lily™ and Lily Design System™ are trademarks.
