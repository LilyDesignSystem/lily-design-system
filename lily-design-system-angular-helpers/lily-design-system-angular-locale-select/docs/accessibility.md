# Accessibility

The select targets **WCAG 2.2 AAA**. It is an icon button that opens a
custom [WAI-ARIA APG listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/),
which means every role, state, and keystroke is implemented in the
component rather than inherited from the platform. This page lists
what's built in, what it costs, and what remains the consumer's
responsibility.

## Built-in

| WCAG item | How the select satisfies it |
| --------------- | --------------------------- |
| WCAG 3.1.1 Language of Page | Writes `lang` to the document root on every locale change. |
| WCAG 3.1.2 Language of Parts | Each option carries its own `lang` attribute so option text is announced in the right language. |
| WCAG 1.4.10 Reflow (RTL bidi) | Writes `dir="rtl"` for RTL locales so layout, scrollbar, and text inversion are correct. |
| WCAG 4.1.2 Name, Role, Value | `<button aria-label aria-haspopup="listbox" aria-expanded aria-controls>` exposes the trigger; `<ul role="listbox">` and `<li role="option" aria-selected>` expose the list and each choice. |
| WCAG 2.1.1 Keyboard | Full APG listbox keyboard contract, implemented in the component — see [Keyboard contract](#keyboard-contract). |
| WCAG 2.4.3 Focus Order | Opening moves focus to the list; committing or cancelling returns it to the button. `Tab` closes without hijacking focus. |
| WCAG 2.4.7 Focus Visible | The component never sets `outline: none`. Supplying a visible ring on the button **and** the `<ul>` is your CSS's job. |
| WCAG 1.4.1 Use of Color | Selection is exposed via `aria-selected`, the `lang` attribute, and the `[(value)]` binding — not colour alone. |
| WCAG 3.2.2 On Input | Choosing a locale changes no context beyond the documented `lang` / `dir` write; focus returns to the trigger. |

## What this control costs

The move from a native `<select>` to an icon button plus a custom
listbox buys a compact, fully styleable control. It is not free, and
the costs are not cosmetic.

**1. The accessible name is entirely yours.** The button renders a
globe glyph marked `aria-hidden="true"`, so there is no text content
to fall back on. `aria-label` — i.e. the `label` input — is the whole
accessible name. A native `<select>` degrades gracefully: even
unlabelled, it announces its current value. This does not. If you pass
`label="Select"` or something equally vague, the control is unusable
to screen-reader users, and voice-control users have nothing to say to
activate it ("click Language" only works if the name is "Language").
Treat `label` with the care you would give visible link text.

**2. A custom listbox is weaker than a native `<select>`.** This is a
regression, and worth naming as one. A native `<select>` gets, for
free and consistently: platform-native pickers on mobile, correct
forms-mode and browse-mode handling in Windows screen readers,
reliable value announcement, and years of assistive-technology
bug-fixing. A `<ul role="listbox">` driven by `aria-activedescendant`
reimplements all of it, and AT support for that pattern is materially
patchier — behaviour varies across reader, browser, and version in
ways a native control's does not. The implementation here follows the
APG closely, but following the APG is not the same as matching a
native control.

If your context makes that trade a bad one — a government service, an
unfamiliar-locale audience, a low-bandwidth or low-spec device
population — bind a sibling native `<select>` to the same `[(value)]`
signal. The helper still owns `lang` / `dir` / storage /
`localeChange`; you just replace the affordance. See
[examples/sibling-select.component.ts](../examples/sibling-select.component.ts).

**3. The glyph may not render.** U+1F310 GLOBE WITH MERIDIANS depends
entirely on the platform's fonts and emoji coverage. It may render as
a flat glyph, as a colour emoji, as a tofu box, or not at all —
Linux systems without an emoji font and locked-down corporate Windows
images are the usual culprits. Because the glyph is `aria-hidden` the
accessible name survives, but sighted users can be left with an empty
button. Project your own `<ng-template>` with an inline SVG if you
need a guarantee.

## The status region is part of the pattern

The closed button shows only the globe glyph — never the active locale
name. A screen-reader user focusing it hears the accessible name and
the collapsed state, **not** the locale currently in effect; a sighted
user sees an icon that looks identical whichever locale is active. The
active locale is not discoverable from the control until it is opened.

The `lang` attribute on the document root still carries the active
locale, and assistive technology uses it for pronunciation — but users
cannot *learn* which locale is selected by looking at or focusing the
control.

Because Lily targets WCAG 2.2 AAA, the compensation is **the default,
not a suggestion**. Every example in [`examples/`](../examples/) ships
it, the [quick start](../index.md#quick-start) opens with it, and it
is what an adopter copying this package gets unless they take it out.
Removing it is the deliberate choice; adding it is not.

The pattern: bind `[(value)]` and render a visible status line beside
the control.

```html
<lily-locale-select label="Language" [locales]="locales"
                    [(value)]="locale" />

<p class="locale-select-status" aria-live="polite">
    Active language:
    <span [attr.lang]="tagFor(locale())">{{ nameFor(locale()) }}</span>
</p>
```

```ts
// In the component class — both are exported from the package barrel.
nameFor = localeName;
tagFor = bcp47LocaleTag;
```

Why each part is the way it is:

- **Visible, not `sr-only`.** Naming the current setting in plain text
  serves sighted, low-vision, and cognitively-impaired users as well as
  screen-reader users, and it needs no live-region timing care. AAA
  favours the visible form.
- **`aria-live="polite"` announces mutations only.** The region is
  silent on first paint and speaks once on each subsequent change — a
  confirmation per switch, not a greeting on load. (`role="status"`
  carries an implicit `aria-live="polite"`; either is fine, but do not
  use `assertive` — a locale change is not an interruption.)
- **`localeName()`** is the package's exported label resolver, so the
  status text shows the same human label as the option ("Français",
  not `fr`).
- **The name carries its own `lang`**, via `bcp47LocaleTag()`, for
  exactly the reason each `<option>` does — see [Per-option `lang` is
  important](#per-option-lang-is-important) below. Wrap only the name;
  the surrounding "Active language:" text stays in the page language.
- **`locale-select-status`** is the class hook, kebab-case like the
  rest of the system.

If a design truly cannot spare the space, keep the element and its
`aria-live` and hide it visually with a `.sr-only` recipe
(`clip-path: inset(50%)` + `position: absolute` — never
`display: none`, which removes it from the accessibility tree along
with its announcements). Dropping it entirely puts the control back in
the state described at the top of this section.

### What this does and does not fix

Honest accounting. The status region gives every user a reliable
statement of the active locale, announced on every change. That is a
genuine fix for the discoverability problem, and it is why the pattern
is the default.

It does not fix the other two costs above. It does not improve the
button's accessible name — that is still entirely your `label`. It
does not make a custom listbox behave like a native `<select>` across
readers and browsers. And a user who reaches the button without
encountering the status region still learns nothing about the current
locale from the control itself. Those are residual gaps that no
sibling element recovers; they are the price of this control shape,
and the reason this page documents them rather than declaring them
solved.

## Per-option `lang` is important

Each `<li role="option">` carries a `lang="…"` attribute. This
satisfies WCAG 3.1.2 (Language of Parts): when a screen reader
encounters the option "Français" inside an English page, the `lang`
attribute makes the reader switch to a French voice for the duration
of that option.

Without the per-option `lang`, "Français" gets pronounced
"Franc-ess" in an English voice — comprehensible but ugly. With
it, the reader says "Fran-SAY".

The button and the list deliberately carry **no** `lang` of their own.
Their text — the accessible name — is in the page's language, not in
any of the listed locales; tagging them would tell a reader to
pronounce an English label with a French voice.

The same logic applies when you render a `<select>` in a sibling
widget. Always carry the locale's BCP 47 tag onto each `<option>`:

```html
<select>
    @for (l of locales; track l) {
        <option [value]="l" [attr.lang]="tagFor(l)">
            {{ labelFor(l) }}
        </option>
    }
</select>
```

## Keyboard contract

Every key below is implemented in the component, following the APG
listbox pattern. Nothing is inherited from a native control.

On the **button**:

| Key                    | Action                                                          |
| ---------------------- | --------------------------------------------------------------- |
| Tab / Shift+Tab        | Move focus to / from the button.                                |
| Enter / Space          | Open the list, active option = the selected one (or the first). |
| Arrow Down             | Open the list, active option = the selected one (or the first). |
| Arrow Up               | Open the list, active option = the **last** one.                |

Opening always moves focus to the `<ul>`.

On the **list**:

| Key                    | Action                                                          |
| ---------------------- | --------------------------------------------------------------- |
| Arrow Down / Arrow Up  | Move the active option one step. **Clamps** at the ends — it does not wrap. |
| Home / End             | Jump to the first / last option.                                |
| Enter / Space          | Choose the active option, apply it, close, return focus to the button. |
| Escape                 | Close and return focus to the button. The locale is unchanged.  |
| Tab                    | Close **without** pulling focus back, so the browser's own Tab handling moves on normally. |
| Printable characters   | Typeahead over the option **labels** (not the codes), searching forward from the active option. The buffer clears 500 ms after the last keystroke. |

Pointer and focus equivalents:

| Interaction             | Action                                          |
| ----------------------- | ----------------------------------------------- |
| Click the button        | Toggle the list open / closed.                  |
| Click an option         | Choose it, apply it, and close.                 |
| Click outside the root  | Close, leaving focus where the user put it.     |
| Focus leaves the root   | Close, leaving focus where the user put it.     |

Two implementation details worth knowing when you style or test this:

- **Focus lives on the `<ul>` while the list is open**, never on an
  individual option. The active option is conveyed only by
  `aria-activedescendant` and mirrored to CSS as `[data-active]`. Put
  your focus ring on `.locale-select-list`, and style `[data-active]`
  separately from `[aria-selected="true"]` — they are different states
  and can sit on different options.
- **Clamping, not wrapping**, is deliberate: the APG listbox pattern
  specifies it, and wrapping makes it easy to overshoot a long locale
  list without noticing.

## Focus management on locale change

Choosing a locale closes the list and returns focus to the button —
the control the user opened. `Escape` does the same without changing
the value. This is the WCAG 3.2.2 (On Input) contract: changing a
setting must not throw the user somewhere unexpected, and returning to
the trigger is the expected APG listbox behaviour.

Focus is deliberately not pulled back when the list closes because of
`Tab`, an outside click, or focus leaving the control — in those cases
the user has already expressed where focus should go, and yanking it
back to the button would be the context change WCAG 3.2.2 warns about.

Beyond the control itself: avoid `router.navigate()` calls in
`(localeChange)` that scroll the page; if you must navigate,
scroll-restore to the select's position so the user can keep
choosing.

## Screen-reader behaviour matrix

The control is an icon button, so what a reader announces on focus is
the `label` plus the collapsed state — never the active locale:

| Reader     | OS       | Browser   | What's announced when the user lands on the button |
| ---------- | -------- | --------- | ---------------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "Language, pop-up button, collapsed". Opening announces the list; arrowing announces each option's `lang`-correct pronunciation and its selected state. |
| NVDA       | Windows  | Firefox   | "Language button, collapsed". After opening: "list box, English (United States), selected, 1 of 5". Pronounces "Français" in a French voice if that voice is installed. |
| JAWS       | Windows  | Chrome    | "Language button, collapsed". |
| TalkBack   | Android  | Chrome    | "Language, button, double-tap to activate". No OS picker — the in-page list opens. |

In every row the active locale is announced by the
`locale-select-status` live region on change, not by the control —
which is why that region is part of the default pattern.

Two caveats. The "lang-correct pronunciation" depends on the reader
having a matching voice package installed; NVDA's default ships with
English only, and users add other voices through eSpeak NG or
commercial voice packs. And treat the rows above as *expected*
behaviour rather than a guarantee: `aria-activedescendant` on a custom
listbox is exactly the pattern whose support varies most across reader
and browser versions, which is the regression named in
[What this control costs](#what-this-control-costs). Test with the
readers your users actually run.

## When per-option `lang` does NOT help

If your `localeLabels` are all in the **viewer's** language (e.g.
you show "English", "French", "Arabic" — all in English so the
user recognises them), the per-option `lang` attribute is
technically incorrect (the visible text is English even though
the attribute says French).

In that case, the select still emits `lang` faithfully — consider
switching the visible labels to endonyms instead. The default
rendering's tradeoff is: the labels show **in their own language**
(English / Français / العربية), so per-option `lang` is correct
and helpful.

## When a native `<select>` is the better choice

Nothing stops you from using one. A native `<select>` gives you, for
free and consistently across platforms:

- Keyboard: Enter / Space / Down arrow open it; typing searches;
  Escape closes.
- Screen reader: announces "combobox" + label + **current value** +
  count.
- Mobile: pops the OS-native picker (iOS scroll wheel, Android
  dialog).

Prefer it when your users may not read the page's language, when you
support assistive technology you cannot test against, or when the
control appears inside a form that users complete under pressure. Bind
a sibling `<select>` to the same `[(value)]` signal — this helper
still owns `lang` / `dir` / storage / `localeChange`, so you only swap
the affordance. See
[examples/sibling-select.component.ts](../examples/sibling-select.component.ts).

For an always-visible list of 2–8 locales, render radios or buttons
via a sibling widget bound to the same signal.

## Colour contrast

The select ships no colour. WCAG 1.4.3 contrast (4.5:1 normal,
3:1 large, 7:1 AAA) is your CSS's responsibility. A safe default
for the button's text and border:

```css
.locale-select-button {
    /* WCAG AAA-grade contrast against white */
    color: #003087; /* NHS blue */
    border: 1px solid #003087;
}
```

The glyph counts as text for contrast purposes when it renders as a
monochrome glyph, and as a non-text element (WCAG 1.4.11, 3:1) when it
renders as a colour emoji — which of the two you get is up to the
platform. If that ambiguity matters to your audit, project your own
`<ng-template>` with an inline SVG you control.

Two focus rings need styling, not one: the button, and the `<ul>`
itself, which is what receives focus while the list is open. Both
should meet WCAG 2.4.13 Focus Appearance — a minimum 2px-wide outline
that contrasts with both the focused element and the background.

Also give `[data-active]` and `[aria-selected="true"]` visibly
different treatments. They are different states, they can land on
different options, and a user arrowing through a long list needs to
tell "where I am" from "what is chosen".

## RTL focus order

In RTL layout, focus moves **visually right-to-left** but
**logically** in source order — which is the same source order
as LTR. So Tab still moves to and from the button in source
order, and the list mirrors visually. This is the
browser's job, not yours.

One thing that *is* your job: anchor the list with logical properties.
`inset-inline-start: 0` rather than `left: 0` keeps the list aligned
to the correct edge when this very component sets `dir="rtl"` on the
document root.

## Angular-specific notes

- `aria-label` is bound via `[attr.aria-label]="label() || null"` on
  both the button and the `<ul>`, so an empty label omits the
  attribute rather than emitting `aria-label=""`.
- `[attr.lang]` (not `lang`) is used on each option so empty
  tags don't emit `lang=""`.
- `[attr.hidden]="open() ? null : ''"` toggles the list's `hidden`
  attribute. Binding the `[hidden]` property instead would interact
  badly with consumer `display` rules.
- `aria-activedescendant` is a `computed()` that returns `null` unless
  the list is open, so the attribute is absent while closed rather
  than pointing at a hidden element.
- `OnPush` change detection is in effect. Signal changes drive
  view updates without manual `markForCheck()`.

## References

- WAI-ARIA APG — Listbox pattern (the pattern this control implements):
  <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/>
- WAI-ARIA APG — Combobox pattern (for a filtering sibling):
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/>
- MDN — `aria-activedescendant`:
  <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-activedescendant>
- HTML Living Standard — the `<select>` element (for the sibling-widget escape hatch):
  <https://html.spec.whatwg.org/multipage/form-elements.html#the-select-element>
- WCAG 2.4.13 Focus Appearance:
  <https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>
- WCAG 3.1.1 Language of Page:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-page>
- WCAG 3.1.2 Language of Parts:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts>
- WCAG 3.2.2 On Input (focus / context preservation):
  <https://www.w3.org/WAI/WCAG22/Understanding/on-input>
- MDN — `lang` attribute and `:lang()` selector:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang>

---

Lily™ and Lily Design System™ are trademarks.
