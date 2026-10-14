# Candidate component: scrollspy (research, 2026-10-14)

Research for a possible new catalog component. Nothing here is built, scaffolded or in `components.tsv`.

## What it is

A navigation list (usually a table of contents) whose link for the section currently in view is highlighted as the
reader scrolls, and updated again when they scroll back. It needs matching `href="#id"` links and element ids.

## What the catalog already has

| Existing | Covers | Gap |
| -------- | ------ | --- |
| `contents-nav` / `-list` / `-list-item` / `-link` | The static table of contents: `<nav>`, `<ol>`, `<li>`, `<a>` | No notion of the current section |
| `visible` | One element's `IntersectionObserver` | One element, not a set mapped to links |
| `scroller*` | Scrollytelling steps | Different job: steps drive a graphic |
| `breadcrumb-*`, `pagination-*` | `aria-current="page"` for a *page* | Not a position within one page |

[AGENTS/headless.md](../../AGENTS/headless.md) already lists "IntersectionObserver / scroll listeners that belong to the
component (`Visible`, `Scroller*`)" as something a component may own, so a scroll-observing component is within the
headless rules.

## How others do it

- **Bootstrap 5 ScrollSpy** uses an `IntersectionObserver` with `rootMargin` (default `0px 0px -25%`), `threshold`
  (default `[0.1, 0.5, 1]`), a `target` nav, and an optional `smoothScroll` for link clicks. Its issue tracker shows the
  known failure modes: it activates the *most visible* section rather than the one reaching the top, and a heading too
  long to be visible leaves no link active ([Bootstrap options](https://docs.w3cub.com/bootstrap~5/components/scrollspy/index),
  [issue 36431](https://github.com/twbs/bootstrap/issues/36431)).
- **Forum reports** of the same pattern: clicking "Sixth section" highlights "Fifth" (the smooth scroll passes through
  other sections), and scrolling to the footer never activates the last section
  ([thread](https://forum.bootstrapstudio.io/t/scrollspy-help-me-understand/9720)).
- **Native CSS**: `scroll-target-group` with `:target-current` does it with no script, but it is Chrome-only and
  experimental, and Chrome does not yet put `aria-current` on the active anchor
  ([Sara Soueidan](https://sarasoueidan.com/blog/css-scrollspy/),
  [W3C CSS post, Feb 2026](https://lists.w3.org/Archives/Public/public-css-archive/2026Feb/0737.html)).
- **Accessibility**: the highlight carries meaning, so it must be exposed, not only drawn (WCAG 1.3.1). `aria-current`
  is the mechanism; MDN's sticky table of contents uses `aria-current="true"`
  ([newsletter](https://www.sarasoueidan.com/newsletter/issue-2025-08-18/)). I found no source that says how each
  screen reader voices `aria-current="true"` in a list of in-page links, so that needs a real-reader test before it is
  claimed.

## Design ideas, in the order they would be decided

1. **What it owns.** Behaviour only: observe the target sections, decide which is current, and mark exactly one link.
   The markup is the consumer's `ContentsList`/`ContentsLink` (or any list of `<a href="#…">`). This follows how
   `visible` works and avoids a fifth near-copy of the contents family.
2. **Name and element.** The suffix table maps `-nav` to `<nav>`, so `scrollspy-nav` (`ScrollspyNav`, a `<nav>` with a
   required `label`) fits the rules; a bare `scrollspy` has no suffix to map. Alternative: a `spy` option on
   `contents-nav`, which adds no component but makes that one carry a script.
3. **Exposing the current link.** `aria-current` on the link, with `data-active` as the CSS hook, so a theme can
   style it without relying on colour alone (WCAG 1.4.1). The token is a prop; default `"true"`, since `"page"` would
   announce "current page" for something that is not a page. No `aria-live` region: announcing every change while the
   user scrolls would be noise, and the position is not new information they asked for.
4. **Which section is current.** One rule, stated plainly: the last section whose top has passed an *activation line*
   (default near the top of the viewport, a prop in px or %). That avoids Bootstrap's "most visible wins" regression.
   Two required special cases: at the bottom of the scroll range the last section is current (a short last section never
   reaches the line); and before the first section, the first link is current.
5. **Clicks.** A click makes that link current immediately and ignores observer updates until the scroll settles
   (`scrollend` where available, a timeout where not). Fixes the "click Sixth, highlight Fifth" bug.
6. **Scrolling.** Lily does not animate: it leaves smooth scrolling to the consumer's CSS `scroll-behavior`, behind
   `prefers-reduced-motion` (WCAG 2.3.3). A fixed header is the consumer's `scroll-margin-top`; the activation line
   prop should be set to match, and the spec should say so.
7. **Focus.** Links are ordinary links, one tab stop each, no roving tabindex. Scrolling never moves focus. After a
   click, focus goes to the target heading if it is focusable; an opt-in `focusTarget` sets `tabindex="-1"` on it
   (it edits the consumer's DOM, so it is not the default).
8. **Nesting.** For `h2`/`h3` tables of contents, the active child also marks its ancestors `data-descendant-active`
   so a parent can stay open. `aria-current` stays on the one leaf link.
9. **Scroll container.** A `root` option for a scrolling element other than the viewport (a docs layout with its own
   scroll pane). Default is the viewport.
10. **Output.** A bindable/emitted `active` id and an `onChange(id)` callback, for consumers who also want to update the
    URL hash (`history.replaceState`, never `pushState`, so Back is not flooded) or a progress bar. Lily itself does
    not touch the URL.
11. **Initial state.** On load, the URL hash wins, then the position. Server render marks the first (or hash) link, so
    there is no flash and the page works without script.
12. **Progressive enhancement.** Feature-detect `scroll-target-group`; where it works, let CSS do the highlighting but
    still set `aria-current` from script. Otherwise the observer path. Treat the native path as a later optimisation,
    not v1.
13. **Narrow screens.** A side table of contents often disappears at narrow widths (WCAG 1.4.10 reflow). The component
    should not decide that, but its docs should recommend a `<details>` wrapper rather than hiding it.

## Per-framework notes

- **Testing.** jsdom has no `IntersectionObserver` and no layout, so unit tests cannot prove the behaviour. The same
  lesson as the pickers (jsdom/bUnit missed the frozen-state bug): inject the observer or the section positions for unit
  tests, and prove the real behaviour in Playwright against a long page, including the bottom-of-page, click-lock and
  fixed-header cases.
- **Svelte, React, Vue, Angular, HTML, Web Components.** An effect/lifecycle hook creates one observer and tears it
  down; all SSR-safe (nothing runs on the server).
- **Nunjucks.** A client script, like the other Nunjucks helpers; the macro renders the links.
- **Blazor.** Needs JS interop for the observer. Existing Blazor components avoid it or use `eval`; this one is the
  first that cannot work without a small module, so it would be a documented deviation.
- **Cost.** A catalog component is implemented in 8 libraries with tests, stories, docs, demos and a docs-site page;
  `bin/new-component` scaffolds the placeholders.

## Non-goals

- A table-of-contents generator (reading headings and building the list). Possible as a separate, later component; the
  labels would be heading text, which is consumer content.
- Reading progress bars, section animation, URL management beyond the `onChange` hook.
- Highlighting on hover or focus.

## Open questions for the maintainer

- Catalog component `scrollspy-nav`, a `spy` option on `contents-nav`, or a helper package?
- Should v1 include the heading-generated list, or only the behaviour?
- Is `aria-current="true"` acceptable, or should the project test `"location"` with real screen readers first?
