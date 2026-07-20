# SSR and the first paint

Nunjucks **is** the server side. The macro produces a static HTML
string at render time; the browser parses and paints it; the
client.js then takes over for the runtime lifecycle. This file
explains how to wire the macro into different Nunjucks hosts for a
flicker-free first paint.

## Read this first: the control does not work without JavaScript

The server-rendered markup paints correctly, but it is **not
operable** until `text-size-select.client.js` runs. Specifically:

- The button has no handler. Clicking it, or pressing `Enter` /
  `Space` / `ArrowDown` on it, does nothing.
- The listbox is rendered with the `hidden` attribute and nothing
  server-side removes it. The user cannot see the options at all.
- Therefore, with JavaScript disabled or broken, **there is no way to
  change the text size**.

This is a real regression. Until the icon-button release this helper
rendered a native `<select>`, which was fully operable with no
JavaScript whatsoever — the browser itself opened the list, moved
through it, and fired `change`. Moving to a custom listbox traded that
away for an icon-sized control and full styling control over the open
list. We are not going to pretend otherwise: if your users may run
without JavaScript, this helper does not serve them.

**This helper deserves more caution on that point than its two
siblings.** A text-size control exists to satisfy WCAG 1.4.4 (Resize
Text). The people who most need it — users with low vision, users on
old or locked-down devices, users behind aggressive content blockers —
overlap meaningfully with the population most likely to be running
without working JavaScript. A theme or locale control failing closed is
an inconvenience; a text-size control failing closed can make the page
unreadable for exactly the person it was added for. Weigh that before
adopting.

Note also that browser zoom and the user's own default font size
remain available regardless, and satisfy 1.4.4 on their own. This
helper is an in-page convenience layered on top of those — not the
only route to a larger text size. That is the honest mitigation, and
it is a reason to keep the control from being load-bearing, not a
reason to dismiss the regression.

What still works with no JS:

- The correct size paints, provided you resolve it server-side and
  write `<html data-text-size>` into your shell (see below). Your
  typography CSS keys off that attribute, and CSS needs no JS.
- The hidden `<input name="{name}">` is pre-filled server-side with the
  resolved slug, so a form containing the control still submits a size.
  That is the only no-JS affordance the control itself offers, and it
  is a submit path, not a choice path — the user cannot change the
  value.

If no-JS operability is a hard requirement, render a plain
`<select>` of the same slugs yourself and wire it to
`initTextSizeSelect`'s `setSize`, or use the headless catalog's plain
`<select>` container pattern that `theme-select` points at for the
same reason.

## What the macro does on the server

The macro is pure: same `opts` → same string. It does **not** touch:

- `localStorage`
- `matchMedia` / `navigator`
- `document.head`
- the file system
- environment variables

If the consumer passes `opts.value="large"`, the root `<div>` gets
`data-lily-text-size-select-value="large"` rendered server-side, the
matching `<li>` gets `aria-selected="true"`, and the hidden input is
pre-filled with `large`.

`data-text-size` is **not** written to `<html>` on the server. That
happens on the client.

## What happens on first paint

If `<html>` arrives with no `data-text-size` and your CSS sizes
typography with `[data-text-size="large"] { … }`, the first paint uses
your unqualified base type scale, then on hydration the client.js sets
`data-text-size="large"` and the page reflows. That reflow is more
visible than theme-select's colour swap, because changing the type
scale moves every line of text on the page.

The fix is to **resolve the size on the server** and write
`<html data-text-size="<slug>">` into the document shell, so the
right scale is in place before any pixel is painted.

A defensive CSS habit helps too: give your base rule the same values
as your default slug, so the pre-hydration paint already matches the
common case.

```css
:root,
[data-text-size="medium"] { --text-scale: 1; }
[data-text-size="small"]  { --text-scale: 0.875; }
[data-text-size="large"]  { --text-scale: 1.25; }
[data-text-size="x-large"]{ --text-scale: 1.5; }
```

### The `opts.value` control flash — fixed by the data attribute

**There is no pre-hydration flash of the control when you pass
`opts.value`.** The `data-lily-text-size-select-value` attribute is how
`opts.value` reaches the client, and the macro communicates the value
out-of-band rather than baking it into control state the browser would
paint before the client could correct it.

```html
<div class="text-size-select" … data-lily-text-size-select-value="large">
  <input type="hidden" name="text-size" value="large"
         data-lily-text-size-select-input>
  <button type="button" class="text-size-select-button" aria-label="Text size"
          aria-haspopup="listbox" aria-expanded="false"
          aria-controls="text-size-select-text-size-list">
    <span class="text-size-select-icon" aria-hidden="true">A</span>
  </button>
  <ul class="text-size-select-list" id="text-size-select-text-size-list"
      role="listbox" aria-label="Text size" tabindex="-1" hidden>
    <li class="text-size-select-option" id="text-size-select-text-size-option-0"
        role="option" aria-selected="false" data-value="small">Small</li>
    <li class="text-size-select-option" id="text-size-select-text-size-option-1"
        role="option" aria-selected="false" data-value="medium">Medium</li>
    <li class="text-size-select-option" id="text-size-select-text-size-option-2"
        role="option" aria-selected="true" data-value="large">Large</li>
  </ul>
</div>
```

There is nothing left to flash in the control itself. The closed
control is a glyph, which looks identical whatever the value is; the
listbox is `hidden`, so its `aria-selected` state is not painted at
all. What the server markup guarantees is **consistency**: exactly one
option carries `aria-selected="true"`, and the hidden input agrees with
it, so the DOM is never internally contradictory even for the frames
before `initTextSizeSelect(root)` runs.

The page *content* can still reflow, though — that is the
`data-text-size` concern above, and it is fixed in your shell, not
here.

`initTextSizeSelect(root)` reads the attribute during initial-value
resolution (step 1 of the order in spec §5.1) and applies the size —
mutating `data-text-size`, the hidden input, and the options'
`aria-selected`.

The attribute is omitted entirely when `opts.value` is unset, so it
falls through to storage / `defaultValue` / `"medium"` / first-option.
Pass `opts.value` freely: it costs nothing visually.

Note that the server's own resolution (`value or defaultValue or
"medium" or sizes[0]`) cannot see `localStorage`. When the two
disagree, the client wins and silently re-derives `aria-selected` —
while the listbox is still closed, so no one sees the correction.

**`opts.value` is not one of the things the client overrides.** It is
the first input in the runtime resolution order, ahead of storage, so a
size you resolved server-side survives hydration intact. Unlike
`theme-select`, this was always true here — there is no precedence
reversal to migrate across.

## Eleventy (build time)

For sites where the default size is acceptable on first paint:

```njk
{# _includes/layouts/base.njk #}
<!doctype html>
<html lang="en" data-text-size="{{ site.defaultTextSize }}">
    <head>
        <link rel="stylesheet" href="/assets/type-scale.css">
        <title>{{ title }}</title>
    </head>
    <body>
        {% block content %}{% endblock %}
        <script type="module">
            import { autoInit } from "/lily-design-system-nunjucks-text-size-select/text-size-select.client.js";
            autoInit();
        </script>
    </body>
</html>
```

With no `opts.value` passed, the control still flips to the user's
`localStorage` value when the client.js runs, so returning users see a
one-frame reflow unless you also store the choice in a cookie or use
the edge-function pattern below.

## Eleventy edge function (Cloudflare Pages)

For per-request resolution:

```js
// functions/_middleware.js
export async function onRequest(context) {
    const cookie = context.request.headers.get("cookie") ?? "";
    const size = /(?:^|; )text-size=([^;]+)/.exec(cookie)?.[1] ?? "medium";
    const response = await context.next();
    if (!response.headers.get("content-type")?.startsWith("text/html")) {
        return response;
    }
    const html = await response.text();
    const out = html.replace('data-text-size="PLACEHOLDER"',
                             `data-text-size="${size}"`);
    return new Response(out, response);
}
```

The Eleventy layout uses a placeholder the function substitutes:

```njk
<html lang="en" data-text-size="PLACEHOLDER">
```

## Express + cookie-parser

```js
import express from "express";
import nunjucks from "nunjucks";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
nunjucks.configure("views", { express: app, autoescape: true });

const SUPPORTED = new Set(["small", "medium", "large", "x-large"]);

app.get("/", (req, res) => {
    const cookie = req.cookies["text-size"];
    const textSize = cookie && SUPPORTED.has(cookie) ? cookie : "medium";
    res.render("index.njk", { textSize });
});

app.post("/api/text-size", express.json(), (req, res) => {
    const size = String(req.body?.size ?? "");
    if (!SUPPORTED.has(size)) return res.status(400).end();
    res.cookie("text-size", size, {
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365 * 1000,
    });
    res.status(204).end();
});
```

```njk
<html lang="en" data-text-size="{{ textSize }}">
    <body>
        {{ textSizeSelect({
            label: "Text size",
            sizes: ["small", "medium", "large", "x-large"],
            value: textSize,
            storageKey: "lily-text-size"
        }) }}

        <script type="module">
            import { autoInit } from "/path/to/text-size-select.client.js";
            autoInit({
                onChange(size) {
                    fetch("/api/text-size", {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({ size }),
                    });
                },
            });
        </script>
    </body>
</html>
```

## Cloudflare Workers

The Workers runtime has no Node API. Nunjucks needs a precompiled
loader:

```js
import nunjucks from "nunjucks";
import templates from "./templates.json";

const env = new nunjucks.Environment(
    new nunjucks.PrecompiledLoader(templates),
);

export default {
    async fetch(request) {
        const cookie = request.headers.get("cookie") ?? "";
        const textSize =
            /(?:^|; )text-size=([^;]+)/.exec(cookie)?.[1] ?? "medium";
        const html = env.render("index.njk", { textSize });
        return new Response(html, {
            headers: { "content-type": "text/html; charset=utf-8" },
        });
    },
};
```

Build `templates.json` with `nunjucks-precompile`.

## Why the macro doesn't auto-resolve cookies

The macro has no opinion about transport (cookie? header? URL
parameter? session store?). Cookies are right for Express, headers for
some Workers setups, query strings for embeds. The macro stays
transport-agnostic and lets the consumer wire the integration via
`opts.value`.

## Hydration consistency

There is no virtual-DOM hydration mismatch in this catalog because the
macro is one-shot HTML, not a diff. The only cross-render gotcha is:

- The server renders no `data-lily-text-size-select-value`, but the
  client picks a non-empty value from `localStorage`. The page
  therefore paints at the base type scale for one frame before
  `data-text-size` lands, and every line of text reflows. The control
  itself is unaffected — it shows the same glyph throughout, and its
  listbox is closed.
- **Fix.** Resolve the value server-side, write `<html data-text-size>`
  into the shell yourself, and pass the slug as `opts.value`.

## Plain `nunjucks.render`

```js
import nunjucks from "nunjucks";
nunjucks.configure("templates", { autoescape: true });
const html = nunjucks.render("page.njk", { textSize: "large" });
require("node:fs").writeFileSync("dist/index.html", html);
```

Static-site output works without any hosting glue. The user gets the
chosen size on first paint. If the render passed the slug through as
`opts.value`, it stays applied; if it only baked the slug into the
document shell without passing `opts.value`, a stored choice takes over
when the client runs.

---

Lily™ and Lily Design System™ are trademarks.
