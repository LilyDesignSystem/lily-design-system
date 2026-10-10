# SSR — `<lily-search-picker>` (HTML helper)

Catalog-wide rules: [`../../AGENTS/ssr.md`](../../AGENTS/ssr.md).

Like `<lily-share-picker>`, this is the easy case: nothing is persisted and
nothing is applied to the document root, so there is no flash of wrong
state to prevent. Before upgrade the element is empty; after upgrade the
button appears.

## Import safety

The module has no top-level DOM access. `location` is touched only at
search time, behind a `typeof location !== "undefined"` guard. The
barrel registers the element only when `customElements` exists and the
tag is free, so importing under SSR (or twice) never throws — asserted
by spec §7.29.
