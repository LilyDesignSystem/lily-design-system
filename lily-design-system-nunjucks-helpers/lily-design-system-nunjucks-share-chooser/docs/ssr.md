# SSR and the first paint

Nunjucks **is** the server side. The macro produces a static HTML string
at render time; the browser parses and paints it; `share-chooser.client.js`
then takes over for the interaction. This file explains what the server
markup does and does not do on its own, and how to wire the macro into
different Nunjucks hosts.

## Read this first: what works without JavaScript, precisely

Unlike the `*-select` helpers in this catalog, this one **partially
works** with no client module. That partial degradation is worth stating
exactly, because the two halves land very differently.

### What works

**The destination links work.** Every `<a class="share-chooser-target">`
is a real anchor carrying its final `href`, rendered server-side. With
JavaScript disabled or broken they still:

- navigate when clicked or activated with `Enter`,
- open in a new tab on middle-click or `Ctrl`/`Cmd`-click,
- expose "Copy link address" and "Open in new window" in the context
  menu,
- get read as links by a screen reader, with their consumer-supplied
  label as the accessible name.

This is a direct consequence of the Nunjucks deviation in
[`../spec/index.md` §3.3](../spec/index.md): because a macro cannot call
a `href(url, title, text)` function, the consumer hands the macro a
resolved URL string, and the macro emits complete anchors. The
constraint produced a better no-JS story than the canonical helper's
API would have.

### What does not work

- **The list cannot be opened.** The `<ul>` is rendered with the
  `hidden` attribute and nothing server-side removes it. The trigger
  `<button>` has no handler: clicking it, or pressing `Enter` / `Space`
  / `ArrowDown` on it, does nothing at all. So although the links are
  live, **the user cannot reach them through the control.**
- **Copy does not function.** `<button class="share-chooser-copy">` is a
  bare button with no handler and no form action. It is visible in the
  markup but inert — the worst of the three states, because it looks
  operable.
- **The native share sheet is never reached.** `navigator.share` is
  called only from the client module.
- **The status region stays empty**, which is correct: nothing has
  happened to announce.

### How this compares to the other helpers

Better, and worth being precise about rather than waving at.

`theme-chooser`, `locale-chooser` and `text-size-chooser` each render a
glyph button plus a `hidden` listbox. Without JavaScript those controls
are **totally inert**: no preference can be chosen by any means, and the
only no-JS affordance is a hidden `<input>` that lets a surrounding form
submit the value the server already picked. There is no path from the
markup to the user's intent.

Here, the *content* of the control — the destinations — survives
intact in the DOM, and each one is independently usable. What is lost is
the *disclosure*: the packaging, not the payload. A user with no
JavaScript who can see the markup can still follow every link.

That is a real difference in kind, not degree, and it comes from a real
architectural difference: those helpers apply a *preference* to the
document, which is inherently a runtime act, while this helper's primary
affordance is *navigation*, which HTML has always done on its own.

It is still a degradation. Do not read the above as "this works without
JavaScript". It does not, as a *control*.

### If you need it to work with no JavaScript at all

Render the list without the `hidden` attribute — a permanently-open
share list is a legitimate design, and every link in it works
unassisted. The macro does not offer a flag for this because the
`hidden` attribute is the disclosure contract the client depends on;
strip it in your own wrapper macro, and omit `copyLabel` so no inert
copy button is rendered:

```njk
{% macro alwaysOpenShare(opts) %}
  {{ shareChooser(opts) | replace(' hidden data-lily-share-chooser-list', ' data-lily-share-chooser-list') | safe }}
{% endmacro %}
```

Then do not call `initShareChooser` on it. You lose the native sheet and
copy; you keep working destinations and no misleading affordances.

## What the macro does on the server

The macro is pure: same `opts` → same string. It does **not** touch:

- `localStorage` — this helper persists nothing, ever
- `matchMedia` / `navigator`
- `document.head`
- `location`
- the file system
- environment variables

It also writes nothing to the document root. There is no `data-theme`
equivalent here: the control owns an **action**, not a preference, so it
has no state to apply or remember. See
[`../spec/index.md` §3.1](../spec/index.md).

## The URL, and why it is resolved twice

There are two different URLs in play and it pays to keep them apart.

1. **The destination hrefs**, baked into the anchors at render time from
   whatever `url` the consumer used when building them.
2. **The share URL**, used by the native sheet, by copy-to-clipboard,
   and passed to `onShare` — resolved *lazily on the client* as
   `opts.url` (init) → `data-lily-share-chooser-url` (macro) → `location.href`.

When you pass `opts.url`, both agree and there is nothing to think
about. When you omit it, the anchors carry whatever you built them with
while the share URL follows the live location — which is what you want
under client-side routing, and a mismatch otherwise.

**If the page URL is not known at render time** (client-side routing, a
cached fragment reused across URLs, a page served under several paths),
pass function-`href` targets to the client and let it rebuild the
anchors:

```html
<script type="module">
    import { autoInit } from "/js/share-chooser.client.js";
    autoInit({
        targets: [
            {
                id: "mastodon",
                href: (url, title) =>
                    `https://mastodon.example/share?url=${encodeURIComponent(url)}` +
                    `&text=${encodeURIComponent(title)}`,
            },
        ],
    });
</script>
```

The client matches targets to anchors by `data-target-id` and rewrites
each `href` at init and again on every open. Anchors whose `id` is not
in the client `targets` array keep their server-rendered href, so you
can mix the two freely.

## Eleventy (build time)

```njk
{# _includes/layouts/base.njk #}
<!doctype html>
<html lang="en">
    <head><title>{{ title }}</title></head>
    <body>
        {% from "share-chooser.njk" import shareChooser %}
        {{ shareChooser({
            label: "Share this page",
            url: site.url + page.url,
            title: title,
            targets: [
                {
                    id: "mastodon",
                    label: "Mastodon",
                    href: "https://mastodon.example/share?url="
                          + (site.url + page.url) | urlencode
                },
                {
                    id: "email",
                    label: "Email",
                    href: "mailto:?subject=" + title | urlencode
                          + "&body=" + (site.url + page.url) | urlencode,
                    newTab: false
                }
            ],
            copyLabel: "Copy link",
            copiedLabel: "Link copied",
            copyFailedLabel: "Could not copy — select the address bar and copy from there"
        }) }}

        <script type="module">
            import { autoInit } from "/js/share-chooser.client.js";
            autoInit();
        </script>
    </body>
</html>
```

Because Eleventy knows every page's URL at build time, the anchors are
correct in the built HTML and no client-side re-resolution is needed.
This is the case the string-`href` deviation suits best.

### Building hrefs in Eleventy without repeating yourself

A shortcode keeps the URL-building in one place:

```js
// .eleventy.js
module.exports = function (eleventyConfig) {
    eleventyConfig.addFilter("shareTargets", (url, title) => [
        {
            id: "mastodon",
            label: "Mastodon",
            href: `https://mastodon.example/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        },
        {
            id: "email",
            label: "Email",
            newTab: false,
            href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
        },
    ]);
};
```

```njk
{{ shareChooser({
    label: "Share this page",
    url: absoluteUrl,
    targets: absoluteUrl | shareTargets(title),
    copyLabel: "Copy link"
}) }}
```

This is also the escape hatch for anyone who wants the canonical
function-`href` ergonomics on the server: a registered filter *is* a
function the template may call. The macro cannot call an arbitrary
function out of `opts`, but your environment's own filters are fair
game.

## Express

```js
import express from "express";
import nunjucks from "nunjucks";

const app = express();
nunjucks.configure("views", { express: app, autoescape: true });

app.get("/article/:slug", (req, res) => {
    const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
    const title = "Article title";
    res.render("article.njk", {
        url,
        title,
        shareTargets: [
            {
                id: "mastodon",
                label: "Mastodon",
                href: `https://mastodon.example/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            },
        ],
    });
});
```

```njk
{{ shareChooser({
    label: "Share this article",
    url: url,
    title: title,
    targets: shareTargets,
    copyLabel: "Copy link",
    copiedLabel: "Link copied"
}) }}
```

## Cloudflare Workers

The Workers runtime has no Node API, so Nunjucks needs a precompiled
loader:

```js
import nunjucks from "nunjucks";
import templates from "./templates.json";

const env = new nunjucks.Environment(new nunjucks.PrecompiledLoader(templates));

export default {
    async fetch(request) {
        const url = request.url;
        const html = env.render("page.njk", {
            url,
            shareTargets: [
                {
                    id: "mastodon",
                    label: "Mastodon",
                    href: `https://mastodon.example/share?url=${encodeURIComponent(url)}`,
                },
            ],
        });
        return new Response(html, {
            headers: { "content-type": "text/html; charset=utf-8" },
        });
    },
};
```

Build `templates.json` with `nunjucks-precompile`.

## Escaping

The macro renders inside an autoescaping environment, so an `href`
containing `&` comes out as `&amp;` in the source — which is correct
HTML and parses back to `&`. Do **not** pipe your hrefs through `| safe`
to "fix" it: that would disable escaping on a URL you may have built
from user input, which is how a `javascript:` or attribute-breaking
payload gets in. Build the URL with `encodeURIComponent` on each
component and let the macro escape the result.

## Two instances on one page

Ids are derived from `opts.name` (default `"share"`), so two macro calls
with default opts render duplicate ids. Give the second one an explicit
`id` — or a distinct `name`:

```njk
{{ shareChooser({label: "Share", targets: t, name: "header"}) }}
{{ shareChooser({label: "Share", targets: t, name: "footer"}) }}
```

`autoInit()` wires both.

## Hydration consistency

There is no virtual-DOM hydration mismatch in this catalog, because the
macro emits one-shot HTML rather than a diff. The client only ever
*adds* behaviour to markup that is already correct: it removes `hidden`
on open, flips `aria-expanded`, writes into the status region, and — if
you passed function-`href` targets — rewrites anchor hrefs. Nothing it
does contradicts what the server rendered.

---

Lily™ and Lily Design System™ are trademarks.
