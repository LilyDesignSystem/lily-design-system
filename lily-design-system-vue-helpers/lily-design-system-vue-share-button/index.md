# ShareButton (Vue helper)

A headless Vue 3 share control: a single-glyph button (↪) that opens the
**native share sheet** where the browser has one, and otherwise shows a
list of destinations you supply, plus **copy the page URL**.

The single source of truth is [spec/index.md](./spec/index.md). This file
is the human-readable guide.

## Install

```ts
import ShareButton from "./lily-design-system-vue-share-button/ShareButton.vue";
// or via the barrel:
import { ShareButton, canShareNatively, type ShareTarget }
  from "./lily-design-system-vue-share-button";
```

## Quick start

```vue
<script setup lang="ts">
import ShareButton, { type ShareTarget }
  from "./lily-design-system-vue-share-button/ShareButton.vue";

const targets: ShareTarget[] = [
  {
    id: "mastodon",
    label: "Mastodon",
    href: (url, title) =>
      `https://mastodon.social/share?text=${encodeURIComponent(title)}%20${encodeURIComponent(url)}`,
  },
  {
    id: "email",
    label: "Email",
    href: (url, title) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
    newTab: false,
  },
];
</script>

<template>
  <ShareButton
    label="Share this page"
    title="An article worth reading"
    :targets="targets"
    copy-label="Copy link"
    copied-label="Link copied"
    copy-failed-label="Could not copy — copy it from the address bar"
    @share="(id, url) => console.log('shared to', id, url)"
  />
</template>
```

`url` defaults to the current page, so the common case needs no wiring.

## You supply the destinations

This package ships **no** social-network URLs. That is deliberate: which
networks belong in your product is an editorial and privacy decision, the
share endpoints change, and networks die. You pass `targets`, so the
labels localise with the rest of your copy and no third-party endpoint is
baked into a design system.

`href` is a function, so you own the whole URL and its encoding:

```ts
{ id: "linkedin", label: "LinkedIn",
  href: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` }
```

## Events

| Event | Payload | Fires when |
| ----- | ------- | ---------- |
| `@share` | `(targetId, url)` | A destination is chosen. |
| `@copy` | `(url)` | The URL was copied successfully. |
| `@native-share` | `(url)` | The native sheet was used instead of the list. |

There is no `v-model`: this helper owns an action, not a value.

## Native share sheet

With `strategy="auto"` (the default), pressing the button on a device
with `navigator.share` opens the OS sheet — the user gets their real
installed apps, and nothing is disclosed to a third party by the act of
opening it. Where there is no sheet, the list opens instead.

This means **behaviour differs by platform**, which is worth knowing when
you write help text or test scripts. Force one path with
`strategy="list"` or `strategy="native"`.

A dismissed sheet ends the interaction — the list does not then pop open,
which would resurrect UI the user just dismissed.

## Copy to clipboard

Supply `copyLabel` and a copy item appears. There is no default label,
because a default would be a hardcoded English string. `copiedLabel` and
`copyFailedLabel` are announced in a polite live region — copying is
otherwise silent, so without them the user gets no confirmation.

Failure is handled, not assumed away: a denied permission, an insecure
context, or a browser with no async clipboard all announce
`copyFailedLabel` rather than throwing.

## Why links, not a menu

Destinations render as real `<a>` elements, not `role="menuitem"`. A
menuitem role strips middle-click, open-in-new-tab, and copy-link-address
— affordances users genuinely reach for on a share list. The WAI-ARIA APG
suggests a disclosure when the items are links. Copy is a real action, so
it is a `<button>`.

This also makes ShareButton the one helper in this catalog that is **not**
an APG listbox: `theme-select`, `locale-select` and `text-size-select` use
`aria-activedescendant` over virtual options, while here focus moves for
real between real elements.

## Custom glyph

The default scoped slot replaces the button glyph and receives
`{ open, url }`:

```vue
<ShareButton label="Share this page" :targets="targets">
  <template #default="{ open }">
    <span aria-hidden="true">{{ open ? "×" : "↪" }}</span>
  </template>
</ShareButton>
```

Slot content renders inside the `<button>`, so keep it non-interactive;
the accessible name always comes from `label`.

## Props

Full table in [spec/index.md §4.1](./spec/index.md#41-props). Required:
`label`. Everything else is optional.

## Accessibility

- The glyph is `aria-hidden`; the name comes from `aria-label`.
- `Escape` closes and returns focus to the button; arrows move between
  items and clamp; `Home` / `End` jump; `Tab` closes and moves on.
- The status region is polite and empty on load.
- **Tradeoff:** an icon-only control's name rests entirely on
  `aria-label` — there is no visible text fallback. See
  [docs/accessibility.md](./docs/accessibility.md).

## Styling

Class hooks: `.share-button` (root), `.share-button-trigger`,
`.share-button-icon`, `.share-button-list`, `.share-button-list-item`,
`.share-button-target`, `.share-button-copy`, `.share-button-status`.

The package ships no CSS. The root `themes/` stylesheets style the button
and popup, including the optical glyph sizing that keeps ↪ visually the
same size as the other helpers' glyphs.

## Tests

`npx vitest run lily-design-system-vue-share-button` from the catalog
root — 35 cases, one or more per §7 clause.

---

Lily™ and Lily Design System™ are trademarks.
