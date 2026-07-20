# Accessibility — LocaleSelect (Svelte)

The select targets WCAG 2.2 AAA. It is an **icon button that opens a
listbox**, built to the WAI-ARIA APG **Listbox** pattern — not a native
`<select>`, and not the APG Combobox pattern. The canonical contract is
in [`../spec/index.md`](../spec/index.md) §6, and the full tradeoff
discussion is in [`../docs/accessibility.md`](../docs/accessibility.md).

## Roles and properties

| Element          | Role / Property                                 | Source        |
| ---------------- | ----------------------------------------------- | ------------- |
| `<button>`       | implicit `role="button"`                        | Browser       |
| `<button>`       | `aria-label={label}`                            | Consumer prop |
| `<button>`       | `aria-haspopup="listbox"`                       | Component     |
| `<button>`       | `aria-expanded="true\|false"`                   | Component     |
| `<button>`       | `aria-controls="{listId}"`                      | Component     |
| `<span>` (glyph) | `aria-hidden="true"`                            | Component     |
| `<ul>`           | `role="listbox"`                                | Component     |
| `<ul>`           | `aria-label={label}`                            | Consumer prop |
| `<ul>`           | `aria-activedescendant="{optionId}"` while open  | Component     |
| `<li>`           | `role="option"`                                 | Component     |
| `<li>`           | `aria-selected="true\|false"`                   | Component     |
| `<li>`           | `lang={bcp47LocaleTag(code)}`                   | Component     |

The `lang` attribute on each option satisfies WCAG 3.1.2 (Language of
Parts) — screen readers switch pronunciation per option. The button and
the list carry none.

Focus sits on the `<ul>` while open; the active option is conveyed by
`aria-activedescendant` rather than by moving DOM focus onto an `<li>`.

## Keyboard contract

Implemented by the component — none of it is inherited from the
platform.

Button: `Enter` / `Space` / `ArrowDown` open with the selected option
active; `ArrowUp` opens with the last option active; `Tab` moves focus
in and out (single tab stop).

Listbox: `ArrowDown` / `ArrowUp` move the active option and **clamp**
(no wrap); `Home` / `End` jump to first / last; `Enter` / `Space`
select, apply, close, and refocus the button; `Escape` closes and
refocuses without changing the value; `Tab` closes without stealing
focus back; printable characters run a typeahead over the labels with a
500 ms buffer reset, searching forward from the active option and
wrapping once.

Typeahead matches the **label**, so `localeLabels` decides which
keystrokes jump where — endonyms mean a user types "Cy" for Welsh, not
"We".

Pointer: clicking an option selects it; clicking outside the root or
moving focus out of it closes the listbox.

## State signals

The active state is exposed in four independent channels — no
colour-only meaning is required:

1. `aria-selected="true"` on the active `<li role="option">`.
2. `lang="<tag>"` on the target element (default `<html>`).
3. `dir="rtl|ltr"` on the target (skipped if `applyDir=false`).
4. The hidden input's `value`, and the `bind:value` binding.

## The three tradeoffs

Do not paper over these when editing docs; state them:

1. **Icon-only naming.** The glyph is `aria-hidden`, so `aria-label` is
   the control's entire accessible name, with no visible-text fallback.
   This bites harder here than for `theme-select`: `aria-label` is
   written in *one* language, and this is the control a user reaches
   for precisely when they cannot read the page. Pairing the glyph with
   the active locale's endonym via `children` is the strongest
   mitigation.
2. **Hand-rolled listbox.** Weaker assistive-technology and mobile
   support than a native `<select>`. For some audiences — public-service
   ones especially — a plain `<select aria-label>` with one
   `<option lang>` per locale is genuinely the better choice.
3. **Font-dependent glyph.** U+1F310 + U+FE0E may render in colour
   anyway (VS15 is a request, not a guarantee), substitute to a
   mismatched font, or render as tofu.

Full text and mitigations:
[`../docs/accessibility.md`](../docs/accessibility.md).

## Per-option `lang` is important

Each `<li role="option">` carries a `lang` attribute. When a screen
reader encounters the option "Français" inside an English page, the
`lang` attribute makes the reader switch to a French voice for the
duration of that option.

Without it, "Français" gets pronounced "Franc-ess" in an English voice
— comprehensible but ugly. With it, the reader says "Fran-SAY".

This matters more than it looks: a user who cannot read the page is
scanning for a language name they recognise, and correct pronunciation
is often the only cue that lands.

### When per-option `lang` does NOT help

If your `localeLabels` are all in the **viewer's** language (e.g. you
show "English", "French", "Arabic" — all in English), the per-option
`lang` is technically incorrect: the text is English but the attribute
says French.

There is no way to suppress it — the snippet no longer renders options.
The fix is to **use endonyms**, which are both accurate under `lang`
and readable by the person who needs them. The built-in table's English
names carry this minor inaccuracy by design; it is generally harmless.

## Focus management on locale change

Selecting a locale returns focus to the trigger button and does not
navigate. This is the WCAG 3.2.2 (On Input) contract: changing a
setting must not cause an unexpected focus or context change.

Avoid `goto` calls in `onChange` that scroll or replace the page; if
you must navigate, restore focus to the select's position so the user
can keep choosing. A user who picked the wrong language and lost the
control has no way back.

## Screen-reader behaviour matrix

Coverage varies (tradeoff 2), so treat these as expectations, not
evidence:

| Reader     | OS       | Browser   | On landing on the control |
| ---------- | -------- | --------- | ------------------------- |
| VoiceOver  | macOS    | Safari    | "Language, pop-up button, collapsed"; opening announces the listbox and the active option. |
| NVDA       | Windows  | Firefox   | "Language button, collapsed"; arrowing announces each option with `lang`-correct pronunciation. |
| JAWS       | Windows  | Chrome    | "Language button, collapsed". |
| TalkBack   | Android  | Chrome    | Weakest case. Test on device. |

"`lang`-correct pronunciation" depends on the reader having a matching
voice package installed.

## RTL focus order

In RTL layout, focus moves **visually right-to-left** but **logically**
in source order — the same source order as LTR. Tab still reaches the
button in source order, and the listbox mirrors visually. This is the
browser's job.

What *is* the consumer's job: positioning the listbox with logical
properties (`inset-inline-start`, not `left`), so the popup anchors to
the correct edge once this control flips the page to RTL. See
[`../docs/styling.md`](../docs/styling.md).

## Svelte-specific notes

- `aria-label` is bound on both the `<button>` and the `<ul>` via
  `aria-label={label}`. `{...restProps}` spreads onto the **root
  `<div>`**, not onto the button, so an `aria-label` or
  `aria-labelledby` passed through rest-props lands in the wrong place.
- The `children` snippet replaces the glyph inside the `<button>`. The
  button's `aria-label` still wins as the accessible name, so visible
  text rendered by the snippet is overridden for assistive technology.
  Its output must not contain interactive elements.
- `{@render children(args)}` does not announce updates. If a consumer
  needs to announce "Language changed to French", they write the
  `aria-live` region themselves — see the status-region section in
  [`../docs/accessibility.md`](../docs/accessibility.md).
- `lang` and `dir` are set on the resolved target element. If the
  consumer passes `target={cardEl}`, only that card switches; the
  surrounding page keeps its document language. Do not let that be used
  to skip setting the document language — WCAG 3.1.1 still applies.
- Option ids come from the module-level `nextLocaleSelectId()` counter,
  which is SSR-safe. Never swap it for `Math.random()` / `Date.now()`.

## References

- WAI-ARIA APG — Listbox pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/>
- WAI-ARIA APG — Select-Only Combobox (closest published example):
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>
- WCAG 3.1.1 Language of Page:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-page>
- WCAG 3.1.2 Language of Parts:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts>
- WCAG 3.2.2 On Input (focus / context preservation):
  <https://www.w3.org/WAI/WCAG22/Understanding/on-input>
- Unicode — Variation Selectors (UTS #51, emoji presentation):
  <https://www.unicode.org/reports/tr51/#Emoji_Presentation>
