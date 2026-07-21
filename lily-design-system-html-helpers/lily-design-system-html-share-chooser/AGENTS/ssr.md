# SSR — `<share-chooser>` (HTML helper)

Catalog-wide rules: [`../../AGENTS/ssr.md`](../../AGENTS/ssr.md).

## This helper is the easy one

`theme-chooser` has a genuine SSR problem: the theme must be applied
before first paint or the user sees a flash of the wrong theme, which is
why it ships a cookie + inline-script recipe. `locale-chooser` and
`text-size-chooser` have smaller versions of the same problem.

`<share-chooser>` has **none of it**. It is an action, not a preference:

- nothing is persisted, so there is nothing to restore,
- nothing is applied to the document root, so there is no flash,
- the control does nothing until the user clicks it.

Before upgrade the element is empty and renders nothing. After upgrade
the trigger appears. There is no wrong intermediate state to prevent —
only a brief absence, which is correct, because a share control that
cannot share yet should not be visible.

## Import safety

The module has no top-level DOM access. `location` is touched only
inside `currentUrl()`, which is called lazily at share time or when
building hrefs — never at import. Both capability probes guard:

```ts
export function canShareNatively(): boolean {
    return typeof navigator !== "undefined" && typeof navigator.share === "function";
}
export function canCopy(): boolean {
    return typeof navigator !== "undefined" &&
        typeof navigator.clipboard?.writeText === "function";
}
```

`index.ts` guards registration on `typeof customElements !== "undefined"`,
so importing the barrel in a Node render pass is safe and a test asserts
it.

`nextShareChooserId()` uses a module counter, not `Math.random()` or
`Date.now()`, so ids are deterministic — the usual hydration-mismatch
trap, avoided.

## Prerendering

Emit the tag with its attributes and let it upgrade:

```html
<share-chooser
  label="Share this page"
  url="https://example.com/article"
  share-title="The article title"
  copy-label="Copy link"
  copied-label="Link copied"
  copy-failed-label="Could not copy — press Ctrl+C to copy the address bar"
></share-chooser>
```

`targets` cannot be prerendered as an attribute (its `href` is a
function), so wire it in the client module:

```html
<script type="module">
  import "lily-design-system-html-share-chooser";
  for (const el of document.querySelectorAll("share-chooser")) {
    el.targets = SHARE_TARGETS;
  }
</script>
```

Setting `targets` after upgrade re-renders the list; setting it before
upgrade on a not-yet-defined element would be lost, so either run after
the import or use the standard custom-element property-upgrade pattern.

## Reserving space

The element is empty until upgrade, so it contributes no layout. If the
trigger sits inline with other controls, give it a reserved size in CSS
to avoid a small reflow:

```css
share-chooser { display: inline-block; min-inline-size: 2.5rem; min-block-size: 2.5rem; }
```

## No-JS

Without JavaScript the element never upgrades and nothing renders. That
is the honest outcome: every path this control offers — the native
sheet, the clipboard, and a JS-built destination URL — requires
JavaScript. If a no-JS share path matters, render a plain `<a>` to a
server-built share URL in your own markup and let this element enhance
alongside it.
