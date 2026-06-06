# Preloading strategies

The default loading strategy ("swap-link") swaps the `href` of one
managed `<link>` element on each theme change. This is small, simple,
and lazy — only the active theme is fetched.

When the lazy fetch matters (a user toggles between themes during a
demo, an instructor flips themes mid-presentation, a designer is
A/B comparing), preload all themes up front so switching is instant.

## Strategy 1 — `<link rel="stylesheet">` preloads

The simplest preloading approach: drop a `<link>` per theme in the
document `<head>`. Every theme's CSS is fetched and parsed once; the
`:root[data-theme="…"]` selectors mean only the active rules apply.

### Next.js App Router

```tsx
// app/layout.tsx — server component
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="/assets/themes/light.css" />
                <link rel="stylesheet" href="/assets/themes/dark.css" />
                <link rel="stylesheet" href="/assets/themes/abyss.css" />
            </head>
            <body>{children}</body>
        </html>
    );
}
```

### Plain HTML / Vite

Put the `<link>` tags in `index.html`:

```html
<!doctype html>
<html lang="en">
    <head>
        <link rel="stylesheet" href="/assets/themes/light.css" />
        <link rel="stylesheet" href="/assets/themes/dark.css" />
        <link rel="stylesheet" href="/assets/themes/abyss.css" />
    </head>
    <body>
        <div id="root"></div>
    </body>
</html>
```

The picker's managed `<link>` also exists, but its href resolves to a
URL that is already cached — the cost is a 304.

Pros:

- Instant switching.
- Works with any theme catalog.
- No extra build step.

Cons:

- Up-front bandwidth cost equal to the sum of all theme CSS sizes.
- Each theme's CSS competes for the cascade — important when themes
  declare overlapping selectors not scoped to `:root[data-theme]`.

## Strategy 2 — `<link rel="preload" as="style">` warmup

When you want the *first* switch to be instant but don't want to pay
the cost up front for every other theme:

```html
<link rel="stylesheet" href="/assets/themes/light.css" />
<link rel="preload" as="style" href="/assets/themes/dark.css" />
<link rel="preload" as="style" href="/assets/themes/abyss.css" />
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
scoped to `:root[data-theme="<slug>"]` so they don't fight. The picker
then doesn't need to swap stylesheets at all — only `data-theme`
changes.

```html
<link rel="stylesheet" href="/assets/themes/all.css" />
```

```tsx
{/* The picker still emits a managed <link>; you can point it at a
    no-op file, or ignore it entirely by reading `value` and setting
    data-theme yourself. */}
<ThemePicker
    label="Theme"
    themesUrl="/assets/themes/"
    themes={["light", "dark", "abyss"]}
    extension=".css"
/>
```

Pros:
- One round-trip, instant switching.
- Easiest to cache.

Cons:
- Largest single payload — every visitor pays for themes they will
  never use.
- Requires a build step to concatenate themes (or a single hand-
  written `all.css`).

## Which strategy to pick

| Constraint                            | Strategy        |
| ------------------------------------- | --------------- |
| Casual use, occasional theme change   | Default (no preload) |
| Designer / preview UI                 | Strategy 1      |
| Mobile-conscious, mostly-light apps   | Strategy 2      |
| Small catalog (2–4 themes), CDN-cached | Strategy 3      |

## React-specific notes

### Next.js automatic `<link>` deduplication

Next.js will dedupe identical `<link>` tags across server-rendered
chunks, so dropping them in `app/layout.tsx` is safe even if a child
route also declares the same `<link>`.

### Avoid `<link>` inside client components

Putting `<link rel="stylesheet">` inside a client component means
the stylesheet is fetched on hydration, not before paint. Always
put preload `<link>`s in the server component's `<head>`.

### React 19's `<style>` and `<link>` hoisting

React 19 hoists `<link>` and `<style>` elements rendered inside
components into `<head>`. The hoisting is automatic but happens
after hydration — for first-paint preload, still prefer the
server-rendered `<head>` declaration in `app/layout.tsx`.
