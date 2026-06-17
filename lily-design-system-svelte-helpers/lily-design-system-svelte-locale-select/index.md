# LocaleSelect (Svelte helper)

A reusable, headless Svelte 5 locale picker that applies the chosen
locale to the document root via `lang` and `dir`, with optional
`localStorage` persistence and `navigator.languages` detection.

For the full contract see [spec.md](./spec.md) — it is the single source
of truth for the API, behaviour, and tests.

## Install

This directory is published as a folder-style import; consumers either
copy it into their project or wire it as a workspace dependency. The
only runtime dependency is `svelte` ≥ 5.

```ts
import LocaleSelect from "./lily-design-system-svelte-locale-select/LocaleSelect.svelte";
```

Or via the barrel (recommended; gives you the typed helpers too):

```ts
import LocaleSelect, {
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    type Props,
    type ChildArgs,
} from "./lily-design-system-svelte-locale-select";
```

## Quick start

Render the picker with a `label` and the list of locales your app
supports. The picker writes `lang` and `dir` onto `<html>` so your
i18n library, your CSS (`html[dir="rtl"]`), and assistive technology
all see the change.

```svelte
<script lang="ts">
    import LocaleSelect from "./lily-design-system-svelte-locale-select/LocaleSelect.svelte";

    let locale = $state("");
</script>

<LocaleSelect
    label="Language"
    locales={["en", "en_US", "fr", "fr_CA", "ar", "he"]}
    bind:value={locale}
    storageKey="lily-locale"
    detectFromNavigator
/>
```

When the user picks `ar`, the component:

- sets `lang="ar"` on `<html>`,
- sets `dir="rtl"` on `<html>` (auto-detected from the locale),
- writes `"ar"` to `localStorage["lily-locale"]`,
- fires `onChange("ar")` if provided.

The picker does NOT translate strings — that is the consumer's
i18n library (e.g. `svelte-i18n`, Paraglide, Inlang, Tolgee, raw
`Intl.*`). Wire the bindable `value` or `onChange` to your library so
it loads the right messages.

## BCP 47 normalisation

Language tags follow **BCP 47** (RFC 5646). The `lang` attribute on
HTML elements must use hyphens, while many applications carry locale
identifiers with underscores (`en_US`, `zh_Hant_TW`). The picker
accepts whichever form you prefer in the `locales` array and converts
to the hyphen form when writing to the DOM. The bindable `value`
preserves your original form, so round-trips are lossless.

```ts
bcp47LocaleTag("en_US");      // "en-US"
bcp47LocaleTag("zh_Hant_TW"); // "zh-Hant-TW"
bcp47LocaleTag("en");         // "en"
```

References:

- W3C — [Language tags in HTML and XML](https://www.w3.org/International/articles/language-tags/)
- IETF — [RFC 5646 (BCP 47), Tags for Identifying Languages](https://www.rfc-editor.org/rfc/rfc5646)
- IANA — [Language Subtag Registry (registry file)](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry)

## RTL auto-detection

`isRtlLocale(locale)` returns `true` for any locale whose base
language is one of `ar`, `arc`, `ckb`, `dv`, `fa`, `he`, `iw`, `ji`,
`ks`, `ku`, `mzn`, `ps`, `sd`, `ug`, `ur`, `yi`, OR whose script
subtag is one of `Arab`, `Hebr`, `Thaa`, `Syrc`, `Nkoo`, `Mong`,
`Adlm`.

```ts
isRtlLocale("ar");         // true
isRtlLocale("he_IL");      // true
isRtlLocale("uz_Arab_AF"); // true (script subtag)
isRtlLocale("en");         // false
```

Pass `applyDir={false}` if you want full control of `dir` yourself.

## Examples

### Default select with NHS-style markup

```svelte
<script lang="ts">
    import LocaleSelect from "./lily-design-system-svelte-locale-select/LocaleSelect.svelte";
    let locale = $state("en");
</script>

<LocaleSelect label="Language" locales={["en", "cy"]} bind:value={locale} />

<!-- Renders:
<select class="locale-select" aria-label="Language" name="locale">
    <option class="locale-select-option" value="en" lang="en">English</option>
    <option class="locale-select-option" value="cy" lang="cy">Welsh</option>
</select>
-->
```

Each option carries its own `lang` attribute so a screen reader
pronounces "Cymraeg" with a Welsh voice (WCAG 3.1.2, Language of
Parts).

### Pretty labels for the option text

By default the picker uses the English names from `locales.tsv` (and
falls back to `Intl.DisplayNames` if available, then to the raw code).
Override per-code with `localeLabels`:

```svelte
<LocaleSelect
    label="Langue"
    locales={["en", "fr", "ar"]}
    localeLabels={{ en: "English", fr: "Français", ar: "العربية" }}
    bind:value={locale}
/>
```

Each option carries a `lang="…"` attribute so each one is
announced in its own language.

### Driving custom `<option>` markup

Use the `children` snippet for full markup control. The picker still
owns the apply lifecycle:

```svelte
<script lang="ts">
    import LocaleSelect from "./lily-design-system-svelte-locale-select/LocaleSelect.svelte";
    let locale = $state("en");
</script>

<LocaleSelect
    label="Language"
    locales={["en", "fr", "es", "de", "ar"]}
    bind:value={locale}
    storageKey="lily-locale"
>
    {#snippet children({ locales, value, setLocale, labelFor, tagFor })}
        <select
            aria-label="Language"
            value={value}
            onchange={(e) => setLocale((e.currentTarget as HTMLSelectElement).value)}
        >
            {#each locales as l (l)}
                <option value={l} lang={tagFor(l)}>{labelFor(l)}</option>
            {/each}
        </select>
    {/snippet}
</LocaleSelect>
```

### Driving a button group

```svelte
<LocaleSelect label="Language" locales={["en", "fr", "ar"]} bind:value={locale}>
    {#snippet children({ locales, value, setLocale, labelFor, tagFor, isRtl })}
        <ul class="locale-select-list">
            {#each locales as l (l)}
                <li>
                    <button
                        type="button"
                        aria-pressed={value === l}
                        lang={tagFor(l)}
                        dir={isRtl(l) ? "rtl" : "ltr"}
                        onclick={() => setLocale(l)}
                    >
                        {labelFor(l)}
                    </button>
                </li>
            {/each}
        </ul>
    {/snippet}
</LocaleSelect>
```

### Wiring an i18n library

```svelte
<script lang="ts">
    import LocaleSelect from "./lily-design-system-svelte-locale-select/LocaleSelect.svelte";
    import { locale as i18nLocale } from "svelte-i18n"; // or Paraglide, Inlang, …

    let current = $state("");
</script>

<LocaleSelect
    label="Language"
    locales={["en", "fr", "ar"]}
    bind:value={current}
    detectFromNavigator
    storageKey="app-locale"
    onChange={(code) => i18nLocale.set(code)}
/>
```

### Server-resolved initial value (SSR)

For flicker-free first paint, resolve the locale on the server (from a
cookie or `Accept-Language`) and pass it as `value`:

```svelte
<script lang="ts">
    let { initialLocale }: { initialLocale: string } = $props();
    let locale = $state(initialLocale);
</script>

<LocaleSelect
    label="Language"
    locales={["en", "fr", "ar"]}
    value={locale}
    bind:value={locale}
/>
```

During SSR the component renders the `<select>` with the supplied
value selected, and the document already arrives with the correct
`lang` attribute on `<html>`.

### Render into a scoped target instead of `<html>`

Set `target` to a specific element when you want the locale scoped to a
region (e.g. a multilingual side panel):

```svelte
<script lang="ts">
    import LocaleSelect from "./lily-design-system-svelte-locale-select/LocaleSelect.svelte";
    let region: HTMLElement | null = $state(null);
    let panelLocale = $state("fr");
</script>

<section bind:this={region}>
    <p>This panel switches language independently of the page.</p>
    <LocaleSelect
        label="Panel language"
        locales={["en", "fr", "ar"]}
        target={region}
        bind:value={panelLocale}
    />
</section>
```

`<html>` stays in the page's default locale; the section gets the
chosen one.

## Built-in locale data

`locales.ts` ships the 436 codes from `locales.tsv` mapped to their
English names. The component falls back to this table when
`localeLabels` does not have an entry for a code. You can also import
the data directly:

```ts
import {
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
} from "./lily-design-system-svelte-locale-select";

console.log(defaultLocaleLabels["en_US"]); // "English (United States)"
console.log(RTL_LANGUAGE_TAGS.has("ar"));  // true
```

## Props

See [spec.md §4](./spec.md#4-public-api) for the full table.

Required props: `label`, `locales`.

Common optional props: `value` (bindable), `defaultValue`,
`storageKey`, `detectFromNavigator`, `localeLabels`, `applyDir`,
`target`, `onChange`, `class`, `name`, `children`.

## Accessibility

- `<select aria-label="…">` is the announced control (implicit
  `combobox` role).
- The native `<select>` gives Arrow / Home / End / typeahead semantics
  for free.
- Each `<option>` carries `lang="…"` so its name is pronounced in
  the right language (WCAG 3.1.2, Language of Parts).
- The document root carries `lang` and (by default) `dir` so the page
  satisfies WCAG 3.1.1 (Language of Page) and bidi text/layout
  inverts correctly for RTL locales.
- No colour-only meaning; the active state is also visible in the
  resolved `lang` attribute and in the `<select>`'s current value.

## Tests

`pnpm test` under a vitest + jsdom + `@testing-library/svelte` setup
exercises every numbered acceptance criterion in
[spec.md §7](./spec.md#7-testing-acceptance-criteria) — 23 numbered
items plus extras for case-insensitive RTL detection and the
navigator-matcher helper.

## Files in this directory

| File                          | Purpose                                          |
| ----------------------------- | ------------------------------------------------ |
| `spec.md`                     | Single source of truth — API, behaviour, tests.  |
| `LocaleSelect.svelte`       | The component implementation.                    |
| `LocaleSelect.test.ts`      | vitest suite covering every spec §7 item.        |
| `locales.ts`                  | Built-in code → English-name map and RTL sets.   |
| `locales.tsv`                 | Canonical 436-row source for `locales.ts`.       |
| `index.ts`                    | Re-export barrel.                                |
| `index.md`                    | This file — quick start + worked examples.       |
| `docs/`                       | Deep-dive guides — see [Documentation](#documentation). |
| `examples/`                   | Runnable Svelte 5 example components — see [Examples](#examples). |

## Documentation

| Guide                                                | Covers                                                              |
| ---------------------------------------------------- | ------------------------------------------------------------------- |
| [docs/concepts.md](./docs/concepts.md)               | Mental model, lifecycle diagram, why the defaults are what they are. |
| [docs/bcp47.md](./docs/bcp47.md)                     | Language-tag syntax (RFC 5646), IANA registry, subtag composition.   |
| [docs/rtl.md](./docs/rtl.md)                         | What's auto-detected, what `dir="rtl"` actually changes, CSS tips.   |
| [docs/i18n-integration.md](./docs/i18n-integration.md) | Wiring svelte-i18n, Paraglide, Tolgee, raw `Intl.*`, SvelteKit URL strategies. |
| [docs/ssr.md](./docs/ssr.md)                         | Cookie, URL-prefix, Accept-Language, streaming SSR, FOUC avoidance.  |
| [docs/accessibility.md](./docs/accessibility.md)     | WCAG 2.2 AAA mapping, keyboard contract, screen-reader matrix.       |

## Examples

Each file in `examples/` is a complete, runnable Svelte 5 component
you can copy into your project.

| Example                                                                                 | Demonstrates                                                       |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [01-radios.svelte](./examples/01-radios.svelte)                                         | The default native `<select>` rendering.                          |
| [02-select.svelte](./examples/02-select.svelte)                                         | Custom `<select>` markup via the `children` snippet.              |
| [03-buttons.svelte](./examples/03-buttons.svelte)                                       | Toggle-button group with short codes / glyphs.                     |
| [04-rtl-demo.svelte](./examples/04-rtl-demo.svelte)                                     | Live RTL preview — Arabic, Hebrew, Persian, Urdu, Pashto.          |
| [05-nhs-style.svelte](./examples/05-nhs-style.svelte)                                   | NHS UK-style language banner with endonyms.                        |
| [06-with-svelte-i18n.svelte](./examples/06-with-svelte-i18n.svelte)                     | Binding to svelte-i18n's `locale` store.                           |
| [07-with-paraglide.svelte](./examples/07-with-paraglide.svelte)                         | Driving Paraglide JS's `setLocale()` from `onChange`.              |
| [08-ssr-cookie.svelte](./examples/08-ssr-cookie.svelte)                                 | SvelteKit cookie-based SSR — no flash of default locale.           |
| [09-scoped-target.svelte](./examples/09-scoped-target.svelte)                           | Multiple per-region pickers, each scoped to its own panel.         |
| [10-combobox.svelte](./examples/10-combobox.svelte)                                     | Native `<datalist>` type-ahead for 436 locales.                    |
