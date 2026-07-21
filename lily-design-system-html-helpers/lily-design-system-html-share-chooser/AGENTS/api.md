# API — `<share-chooser>` (HTML helper)

Canonical table: [`../spec/index.md` §4](../spec/index.md#4-public-api).
This file is the agent-facing summary, with emphasis on the two places
the custom-element idiom forced a change.

## Attributes → properties

| Attribute | Property | Type | Default |
| --------- | -------- | ---- | ------- |
| `label` | `label` | string | `""` (required in practice) |
| `url` | `url` | string | `""` → falls back to `location.href` |
| `share-title` | `shareTitle` | string | `""` |
| `text` | `text` | string | `""` |
| `copy-label` | `copyLabel` | string | `""` (no copy item) |
| `copied-label` | `copiedLabel` | string | `""` |
| `copy-failed-label` | `copyFailedLabel` | string | `""` |
| `strategy` | `strategy` | `"auto"\|"native"\|"list"` | `"auto"` |
| `class` | — | string | `""` |

Writing a property writes the attribute; reading reads it. There is no
separate backing field for any of them, so the attribute is always the
truth. Empty-string assignment removes the attribute (except `label`,
which is always set).

`strategy` coerces: anything that is not `"native"` or `"list"` reads
back as `"auto"`.

## Deviation 1 — `share-title`, not `title`

`title` is a global HTML attribute and an `HTMLElement` property.
Observing it would:

- paint a native tooltip over the entire control, and
- shadow `HTMLElement.prototype.title`.

So the share title is `share-title` / `shareTitle`, and `el.title` keeps
its ordinary meaning. This is the **only** renamed prop against the
Svelte/React/Vue versions. Do not "fix" it.

## Deviation 2 — property-only members

Attributes are strings. These carry functions, so they cannot be
attributes at all:

| Member | Type |
| ------ | ---- |
| `targets` | `ShareTarget[]` — `href` is a function |
| `onShare` | `(targetId: string, url: string) => void` |
| `onCopy` | `(url: string) => void` |
| `onNativeShare` | `(url: string) => void` |

`targets` has a getter that returns a **copy**, so callers cannot mutate
the element's internals by mutating what they read. Its setter
re-renders.

A declarative attribute form of `targets` was considered and rejected:
the only encoding that would work is a URL template string, and shipping
one would bake in the query-parameter convention this package
deliberately refuses to own (`spec/index.md` §2, §8).

## Events are the primary contract

Every callback is paired with a bubbling, composed `CustomEvent`,
matching `theme-chooser`'s `themechange` and `locale-chooser`'s
`localechange`:

| Event | Detail | Callback |
| ----- | ------ | -------- |
| `share` | `ShareChooserShareDetail` = `{ targetId, url }` | `onShare(targetId, url)` |
| `copy` | `ShareChooserUrlDetail` = `{ url }` | `onCopy(url)` |
| `nativeshare` | `ShareChooserUrlDetail` = `{ url }` | `onNativeShare(url)` |

Ordering: callback first, then `dispatchEvent`. Both always fire — the
callback is a convenience, not an alternative.

**A dismissed native sheet fires neither.** It is not a success and not
an error.

## Read-only getters

| Getter | Meaning |
| ------ | ------- |
| `open` | Is the list open? |
| `status` | Current live-region text. |
| `listId` | id of the rendered `<ul>`, `${baseId}-list`. |

## Methods

| Method | Notes |
| ------ | ----- |
| `openList(focusLast = false)` | No-op when `items()` is empty — a list with no targets and no copy item has nothing to show. |
| `closeList(refocus = true)` | No-op when already closed. |
| `items()` | `.share-chooser-target, .share-chooser-copy` in DOM order. |
| `currentUrl()` | `url` attribute, else `location.href`. Lazy — never evaluated at import. |
| `renderButtonContent()` | Overridable. See [`../docs/custom-rendering.md`](../docs/custom-rendering.md). |

## Module exports

From `share-chooser.ts` and re-exported by `index.ts`:

- `ShareChooser` (class)
- `canShareNatively()`, `canCopy()` — SSR-safe capability probes
- `nextShareChooserId()` — module-counter id minter
- `RIGHTWARDS_ARROW_WITH_HOOK` — the `"↪"` glyph constant
- types `ShareChooserProps`, `ShareChooserShareDetail`,
  `ShareChooserUrlDetail`, `ShareTarget`, `ShareStrategy`

`index.ts` additionally registers `<share-chooser>` as a side effect,
guarded by a `customElements.get` check so re-imports do not throw.
