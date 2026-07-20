# Accessibility — LocaleSelect (Blazor)

The select targets WCAG 2.2 AAA and uses the native `<select>`
form control. The canonical contract is in
[`../spec/index.md`](../spec/index.md) §6.

## Roles and properties

| Element        | Role / Property             | Source             |
| -------------- | --------------------------- | ------------------ |
| `<select>`     | implicit `role="combobox"`  | Browser            |
| `<select>`     | `aria-label="@Label"`       | Consumer parameter |
| `<select>`     | `name`                      | Component          |
| `<option>`     | implicit `role="option"`    | Browser            |
| `<option>`     | `lang` (per-option, WCAG 3.1.2) | Component       |
| `<option>`     | selected state (implicit)   | Browser            |

The `lang` attribute on each `<option>` satisfies WCAG 3.1.2
(Language of Parts) — screen readers switch pronunciation per
option.

## Keyboard contract

Provided entirely by the platform's native `<select>`:

| Key               | Action                                          |
| ----------------- | ----------------------------------------------- |
| `Tab`             | Move focus to the select (one stop).            |
| `Shift+Tab`       | Move focus away from the select.                |
| `Arrow Down`      | Select the next option.                         |
| `Arrow Up`        | Select the previous option.                     |
| `Home` / `End`    | Select the first / last option.                 |
| Typeahead         | Type characters to jump to a matching option.   |
| `Enter` / `Space` | Open the option list (platform-dependent).      |
| `Escape`          | Close the option list.                          |

This is all native behaviour. The select does not add JS keyboard
handlers — it doesn't need to.

## State signals

The active state is exposed in independent channels — no
colour-only meaning is required:

1. `lang="<tag>"` on the document root.
2. `dir="rtl|ltr"` on the root (skipped if `ApplyDir=false`).
3. The `@bind-Value` binding in user code.

Note what is *not* in that list: the `<select>`'s own value. A
component-owned placeholder option is always the selected one, so the
closed control reads `Placeholder ?? Label` rather than the active
locale — which means screen readers do not announce the active locale
as the combobox value. Consumers who need it announced should surface
it in visible text (with its own `lang`) or a polite live region. See
[`../docs/accessibility.md`](../docs/accessibility.md#the-placeholder-tradeoff).

## Per-option `lang` is important

The default rendering carries `lang="…"` on each `<option>`.
This satisfies WCAG 3.1.2 (Language of Parts): when a screen reader
encounters the option "Français" inside an English page, the
`lang` attribute makes the reader switch to a French voice for the
duration of that span.

Without the per-option `lang`, "Français" gets pronounced
"Franc-ess" in an English voice — comprehensible but ugly. With
it, the reader says "Fran-SAY".

The same logic applies when you supply custom `<option>` markup via
`ChildContent`. Always carry the locale's BCP 47 tag onto each
`<option>`:

```razor
<select>
    @foreach (var l in ctx.Locales)
    {
        <option value="@l" lang="@ctx.TagFor(l)">@ctx.LabelFor(l)</option>
    }
</select>
```

## Focus management on locale change

By default the focused element stays focused when the locale
changes. This is the WCAG 3.2.2 (On Input) contract: changing a
setting must not cause a focus or context change. Avoid
`NavigationManager.NavigateTo` calls in `OnChange` that scroll the
page; if you must navigate, scroll-restore to the select's position
so the user can keep choosing.

## Screen-reader behaviour matrix

Tested against the major combinations:

| Reader     | OS       | Browser   | What's announced when user lands on the select |
| ---------- | -------- | --------- | ---------------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "Language, pop-up button, English". |
| NVDA       | Windows  | Firefox   | "Language combo box, English, 1 of 5". |
| Narrator   | Windows  | Edge      | "Language combo box, English selected". |
| JAWS       | Windows  | Chrome    | "Language combo box, English, 1 of 5". |
| TalkBack   | Android  | Chrome    | "Language, English, drop-down list, double-tap to activate". |

The "lang-correct pronunciation" depends on the reader having a
matching voice package installed.

## When per-option `lang` does NOT help

If your `LocaleLabels` are all in the **viewer's** language (e.g.
you show "English", "French", "Arabic" — all in English so the
user recognises them), the per-option `lang` attribute is
technically incorrect. In that case, drop the `lang` attribute by
using a custom `ChildContent`:

```razor
<ChildContent Context="ctx">
    @foreach (var l in ctx.Locales)
    {
        <option class="locale-select-option" value="@l">
            @ctx.LabelFor(l)
        </option>
    }
</ChildContent>
```

## Native `<select>` accessibility

The default rendering is a native `<select>` (see
[examples/02_Select.razor](../examples/02_Select.razor) for a
customised variant). Native `<select>` is fully accessible:

- Keyboard: Enter / Space / Down arrow open the list; typing
  searches; Escape closes.
- Screen reader: announces "combobox" + label + current value +
  count.
- Mobile: pops the OS-native picker (iOS scroll wheel, Android
  dialog).

The tradeoffs:

- Compact (one widget regardless of N).
- Scales to 100+ locales.
- Choices hidden until opened (worse discoverability).
- Can't show option text in mixed scripts as easily (some OS
  selects don't honour per-option `lang`).

For 9+ locales the native `<select>` is ideal; for a handful of
locales a custom button group via `ChildContent` can improve
discoverability.

## RTL focus order

In RTL layout, focus moves visually right-to-left but logically in
source order — which is the same source order as LTR. The
`<select>` itself is a single tab stop; its option list follows the
order they appear in your `Locales` array. This is the browser's
job.

## References

- HTML Living Standard — `<select>` element:
  <https://html.spec.whatwg.org/multipage/form-elements.html#the-select-element>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>
- WCAG 3.1.1 Language of Page:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-page>
- WCAG 3.1.2 Language of Parts:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts>
- WCAG 3.2.2 On Input:
  <https://www.w3.org/WAI/WCAG22/Understanding/on-input>
