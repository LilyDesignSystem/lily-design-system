# Custom rendering

The `children` snippet **replaces the glyph inside the trigger
button**. That is its whole job.

It does *not* render the options. The popup `<ul role="listbox">` and
its `<li role="option">` children are component-owned: they carry the
ids that `aria-activedescendant` points at, the `aria-selected` state,
the per-option `lang` attributes, and the click handlers, so the
component keeps ownership of them and always emits them.

If you came from 0.3.0 or earlier: the old `ChildArgs`
(`{ locales, value, setLocale, name, labelFor, tagFor, isRtl }`)
rendered `<option>` elements inside a `<select>`, and the examples used
it to build radio groups, button groups, and a `<datalist>` combobox.
That contract is gone.

## The ChildArgs contract

```ts
type ChildArgs = {
  value: string;                        // the active code, consumer form
  open: boolean;                        // is the listbox open?
  labelFor: (locale: string) => string; // resolved display label
};
```

There is no `setLocale` and no `locales` array, because the snippet no
longer draws anything selectable. To change the locale
programmatically, write to the bindable `value` prop.

`tagFor` and `isRtl` are gone too, but their implementations are
exported as pure helpers — import them directly:

```ts
import { bcp47LocaleTag, isRtlLocale, localeName } from "../LocaleSelect.svelte";
```

## Patterns

### Glyph plus the active locale's endonym

The most useful override here, and the strongest mitigation for
[tradeoff 1](./accessibility.md#tradeoff-1--the-accessible-name-rests-entirely-on-aria-label).

The `aria-label` is written in one language; a user who cannot read
that language gets nothing from it, and nothing from a bare glyph
either. The active locale's own name, in its own script, is readable by
exactly the person who needs it:

```svelte
<script lang="ts">
  import LocaleSelect, { bcp47LocaleTag } from "../LocaleSelect.svelte";

  let locale = $state("en");

  const ENDONYMS = {
    en: "English",
    fr: "Français",
    ar: "العربية",
    cy: "Cymraeg",
  };
</script>

<LocaleSelect
  label="Language"
  locales={["en", "fr", "ar", "cy"]}
  localeLabels={ENDONYMS}
  bind:value={locale}
>
  {#snippet children({ value, labelFor })}
    <span aria-hidden="true">🌐︎</span>
    <span class="locale-select-text" lang={bcp47LocaleTag(value)}>
      {labelFor(value)}
    </span>
  {/snippet}
</LocaleSelect>
```

Note the `lang` on the span: it carries WCAG 3.1.2 (Language of Parts)
onto the trigger, so a screen reader pronounces "Français" in a French
voice. That is only correct because the labels are endonyms — with the
built-in English names, drop the `lang`.

The button's `aria-label` still supplies the accessible name and
overrides this visible text for assistive technology. Keep the two
consistent, or drop `aria-label` in favour of `aria-labelledby`.

This gives up the narrow-control benefit. For a locale select
specifically, that is often the right call.

### A short code instead of a full name

When space is tight but you still want text rather than a bare glyph:

```svelte
{#snippet children({ value })}
  <span aria-hidden="true">🌐︎</span>
  <span class="locale-select-text">{value.split(/[-_]/)[0].toUpperCase()}</span>
{/snippet}
```

"EN", "FR", "AR". Cheaper than an endonym and better than nothing,
though two-letter codes are not universally recognised — `de` for
German reads as "DE" to an English speaker and means nothing to someone
who calls it "Deutsch".

### An inline SVG instead of the Unicode glyph

Removes the font dependency and the colour-emoji risk described in
[tradeoff 3](./accessibility.md#tradeoff-3--the-glyph-is-font-dependent).
This package ships no assets, but nothing stops you supplying one.

```svelte
{#snippet children()}
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
    <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" />
    <ellipse cx="8" cy="8" rx="3" ry="7" fill="none" stroke="currentColor" />
    <path d="M1 8h14M2.5 4.5h11M2.5 11.5h11" fill="none" stroke="currentColor" />
  </svg>
{/snippet}
```

Keep `aria-hidden="true"` and `focusable="false"` on the SVG: the
accessible name must stay on the button.

### A caret that reflects the open state

`open` is in `ChildArgs` precisely so the trigger can show its state
without a CSS-only workaround. (`[aria-expanded="true"]` on
`.locale-select-button` also works, and is usually simpler.)

```svelte
{#snippet children({ open })}
  <span aria-hidden="true">🌐︎</span>
  <span aria-hidden="true">{open ? "▴" : "▾"}</span>
{/snippet}
```

Style the caret with logical properties or a transform so it does not
end up on the wrong side after an RTL switch.

### A direction indicator

`isRtlLocale` is exported, so the trigger can preview what selecting a
locale will do to the page:

```svelte
<script lang="ts">
  import LocaleSelect, { isRtlLocale } from "../LocaleSelect.svelte";
</script>

{#snippet children({ value, labelFor })}
  <span aria-hidden="true">🌐︎</span>
  <span class="locale-select-text" dir={isRtlLocale(value) ? "rtl" : "ltr"}>
    {labelFor(value)}
  </span>
{/snippet}
```

The `dir` here scopes bidi handling to the name itself, which matters
when an RTL endonym sits inside an otherwise-LTR button.

## What the snippet should *not* do

- **Don't render `<option>` elements.** There is no `<select>` to put
  them in. They will render as stray inline content inside the button.
- **Don't render interactive elements** — buttons, links, inputs, or a
  `<datalist>`-backed `<input>`. The snippet's output lives inside a
  `<button>`; nesting interactive content inside a button is invalid
  HTML and breaks keyboard behaviour. The pre-listbox
  `10-combobox.svelte` example did exactly this and has been retired.
- **Don't try to render the locale list.** If you want an
  always-visible list of languages — an NHS-style banner of endonyms,
  say — this helper is the wrong shape. Read `value`, write to it from
  your own controls, and keep the exported pure helpers
  (`bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage`) for the logic.
- **Don't build an APG Combobox here.** For 400+ locales a combobox
  with type-ahead really is the better pattern, but it needs a text
  input, which cannot live inside this button. Use a dedicated combobox
  primitive and drive it from the same helpers.
- **Don't mutate `lang` / `dir` directly.** Let the component own that
  lifecycle; write to `value` instead.
- **Don't leave decorative content exposed to assistive technology.**
  Anything decorative in the snippet should be `aria-hidden="true"` so
  the `aria-label` remains the single accessible name.

---

Lily™ and Lily Design System™ are trademarks.
