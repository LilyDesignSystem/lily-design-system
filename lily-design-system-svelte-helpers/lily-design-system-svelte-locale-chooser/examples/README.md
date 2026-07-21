# Examples

Self-contained Svelte 5 examples for
`lily-design-system-svelte-locale-chooser`. Each file is a runnable
component that can be dropped into any Svelte 5 host (SvelteKit
route, Vite + Svelte route, Astro `.svelte` island, Storybook
story).

Every example assumes:

- Svelte 5 with runes (`$state`, `$props`, `$bindable`, `$effect`).
- No CSS dependency — the select is headless. Consumers style the
  `locale-chooser`, `locale-chooser-button`, `locale-chooser-icon`,
  `locale-chooser-list`, and `locale-chooser-option` class hooks.
- **You supply the listbox's positioning CSS.** The package ships
  none, so an unstyled listbox renders in normal document flow and
  pushes the page down when it opens. Use logical properties
  (`inset-inline-start`, not `left`) — this control flips the page to
  RTL. None of these examples include it; see
  [`../docs/styling.md`](../docs/styling.md#positioning-the-listbox).

| File                                                        | Demonstrates                                                       |
|-------------------------------------------------------------|--------------------------------------------------------------------|
| [`basic.svelte`](./basic.svelte)                            | The default rendering, plus the `.locale-chooser-status` live region every consumer should ship. |
| [`custom-rendering.svelte`](./custom-rendering.svelte)      | `children` snippet — globe + the active locale's endonym + caret, inside the button. |
| [`many-locales.svelte`](./many-locales.svelte)              | A 23-locale list in a one-glyph control; typeahead, `Home` / `End`, scroll container. |
| [`persistence.svelte`](./persistence.svelte)                | `storageKey` survival across reloads plus `detectFromNavigator` on first visit. |
| [`rtl-demo.svelte`](./rtl-demo.svelte)                      | Live RTL preview — Arabic, Hebrew, Persian, Urdu, Pashto — with endonym `localeLabels`. |
| [`nhs-style.svelte`](./nhs-style.svelte)                    | NHS UK-style utility banner with endonyms, a `class` hook, and the native-`<select>` caveat. |
| [`with-svelte-i18n.svelte`](./with-svelte-i18n.svelte)      | Binding to `svelte-i18n`'s `locale` store.                          |
| [`with-paraglide.svelte`](./with-paraglide.svelte)          | Driving Paraglide JS's `setLocale()` from `onChange`.               |
| [`ssr-cookie.svelte`](./ssr-cookie.svelte)                  | SvelteKit `cookies` + `transformPageChunk` for flicker-free SSR.    |
| [`scoped-target.svelte`](./scoped-target.svelte)            | Multiple per-region selects, each scoped to its own panel.          |

### Renamed from the radio-group era

These files were numbered and named for a rendering the package no
longer has — `01-radios`, `02-select`, `03-buttons` had not rendered
radios, a `<select>`, or a button group for some time. They now carry
descriptive names matching `theme-chooser`'s convention:

| Old                        | New                     | Note |
| -------------------------- | ----------------------- | ---- |
| `01-radios.svelte`         | `basic.svelte`          | Content unchanged in substance. |
| `02-select.svelte`         | `many-locales.svelte`   | Rewritten: the custom `<select>` it built is no longer possible. |
| `03-buttons.svelte`        | `custom-rendering.svelte` | Rewritten: the button group it built is no longer possible. |
| `04-rtl-demo.svelte`       | `rtl-demo.svelte`       | |
| `05-nhs-style.svelte`      | `nhs-style.svelte`      | Rewritten to use the default listbox. |
| `06-with-svelte-i18n.svelte` | `with-svelte-i18n.svelte` | |
| `07-with-paraglide.svelte` | `with-paraglide.svelte` | |
| `08-ssr-cookie.svelte`     | `ssr-cookie.svelte`     | |
| `09-scoped-target.svelte`  | `scoped-target.svelte`  | |
| `10-combobox.svelte`       | `persistence.svelte`    | Replaced: the `<datalist>` combobox it built is no longer possible. |

## Running the examples

These files are illustrations, not a build. The fastest way to try
one is:

1. Inside any Vite + Svelte 5 project (or SvelteKit), drop the
   example into a route component or a Storybook story.
2. Import the `LocaleChooser.svelte` from this directory (or the
   `index.ts` barrel).
3. Add the positioning CSS from
   [`../docs/styling.md`](../docs/styling.md#positioning-the-listbox),
   or the popup will render inline.
4. `pnpm dev` and visit the route.

## bind:value conventions

The select exposes its bindable on `value` via `$bindable("")`.
Always use `bind:value={locale}` in templates, and pair with
`onChange` for one-shot side effects (cookie writes, imperative
i18n-library calls, analytics).

The bindable and `onChange` both carry the **consumer-form** code —
whatever form you put in `locales` — so `en_US` round-trips as
`en_US`. Only DOM writes are normalised to the BCP 47 hyphen form.

## The `children` snippet

`children` **replaces the glyph inside the trigger button**. It does
not render the options — the listbox and its `<li role="option">`
children are component-owned, since they carry the
`aria-activedescendant` target ids, the `aria-selected` state, the
per-option `lang` attributes, and the click handlers.

```ts
type ChildArgs = {
    value: string;                        // active code, consumer form
    open: boolean;                        // is the listbox open?
    labelFor: (locale: string) => string; // display label
};
```

The pre-listbox shape — `{ locales, value, setLocale, name, labelFor,
tagFor, isRtl }` — is gone. `tagFor` and `isRtl` live on as the
exported pure helpers `bcp47LocaleTag` and `isRtlLocale`; to change
the locale programmatically, write to the bindable `value`.

The snippet's output lives inside a `<button>`, so it must not contain
interactive elements. That rules out the old radio-group, button-group,
and `<datalist>`-combobox patterns; see
[`../docs/custom-rendering.md`](../docs/custom-rendering.md) for what
to do instead.

## See also

- [`../docs/concepts.md`](../docs/concepts.md) — mental model and
  lifecycle diagram.
- [`../docs/props-reference.md`](../docs/props-reference.md) —
  field-by-field prop reference.
- [`../docs/styling.md`](../docs/styling.md) — class hooks, positioning,
  RTL-safe CSS.
- [`../docs/custom-rendering.md`](../docs/custom-rendering.md) — the
  `children` snippet.
- [`../docs/accessibility.md`](../docs/accessibility.md) — the APG
  listbox contract and the three tradeoffs.
- [`../docs/recipes.md`](../docs/recipes.md) — short solutions to
  adjacent problems.
- [`../docs/troubleshooting.md`](../docs/troubleshooting.md) — symptoms
  and fixes.
- [`../docs/ssr.md`](../docs/ssr.md) — full SSR / SvelteKit recipe.
- [`../docs/rtl.md`](../docs/rtl.md) — what `dir="rtl"` actually
  changes and CSS tips.
- [`../docs/i18n-integration.md`](../docs/i18n-integration.md) —
  wiring `svelte-i18n`, Paraglide JS, Inlang, raw `Intl.*`.
- [`../spec/index.md`](../spec/index.md) — the canonical contract.
