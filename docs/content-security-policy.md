# Content Security Policy

How to run Lily™ under a strict Content Security Policy (CSP). Lily ships no stylesheet and no third-party request, so
most components need nothing from your policy. Ten components are the exception, and which ones depends on how you render
them.

## A policy to start from

```text
default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'self'
```

The HTML examples app runs its 16 composed pages, its catalog and all 609 component pages under this policy with no violation
(`e2e/csp.spec.ts`). Its demo pages get there by applying `style` values through the CSSOM, so that result does not extend to your
own server-rendered or static markup for the components below.

## Components that write a `style` attribute

These ten are sized by a prop: `affix`, `clamp-text`, `container-with-fixed-width`, `container-with-fluid-width`, `flex-stack`,
`float-button`, `grid`, `masonry`, `sticky-promo-banner`, `theme-provider`.

| Catalog                | What the ten do                                                                  | Under `style-src 'self'`          |
| ---------------------- | -------------------------------------------------------------------------------- | --------------------------------- |
| Svelte, React, Vue     | Write a `style` attribute                                                        | Blocked when rendered on a server |
| HTML, Nunjucks, Alpine | Write a `style` attribute in markup (Alpine has no `sticky-promo-banner` one)    | Blocked                           |
| Angular, Blazor        | Write `data-*` for your CSS, on purpose, except `grid`                           | Passes, except `grid`             |
| Web Components         | Set styles through the CSSOM, or write `data-*`; `float-button` has an attribute | Passes, except `float-button`     |

When the attribute is blocked the browser drops it silently: the component renders, but without its size. The console reports a
CSP violation.

You have two ways through:

- **Allow style attributes only.** Add `style-src-attr 'unsafe-inline'`. A `style` attribute then works, and a `<style>` element
  stays blocked by `style-src 'self'`. Checked in Chromium on 2026-11-04. A `nonce` cannot do this: nonces do not apply to style
  attributes.
- **Size them from your stylesheet.** Leave the prop unset and set the value on your own class. `clamp-text` reads
  `--clamp-text-lines`, so a rule on your class is enough.

## The no-flash theme snippet

The snippet that applies a saved theme before first paint is an inline script. Serve it as a file, as the HTML examples app does
with `assets/js/theme-boot.js`, or add its hash to `script-src`.

## Your own markup

- No inline event handlers. `onclick="…"` fails under `script-src 'self'`, and only when it is clicked.
- Setting `element.style` from a script is not blocked. Only the attribute in markup, or `setAttribute("style", …)`, is.

## Sources

- [spec/testing](../spec/testing/index.md#content-security-policy)
- [MDN: Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)
- [MDN: style-src-attr](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/style-src-attr)

---

Lily™ and Lily Design System™ are trademarks.
