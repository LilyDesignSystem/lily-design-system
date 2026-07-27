# Custom rendering

The `children` render prop replaces **the glyph inside the button**.
That is its entire scope. It does not render the options, the listbox,
or the hidden input — the component owns those, along with the keyboard
contract, the open/close state, and the DOM writes.

## The contract

```ts
type ChildArgs = {
  /** Currently selected locale code, in your form (e.g. "en_US"). */
  value: string;
  /** Is the listbox open? */
  open: boolean;
  /** Resolve a locale code to its display label. */
  labelFor: (locale: string) => string;
};
```

Whatever you return is rendered inside
`<button class="locale-chooser-button">` in place of the default
`<span class="locale-chooser-icon">`. Note the consequence: when you pass
`children`, the `.locale-chooser-icon` hook is **not** in the DOM. Every
other class hook still is.

## Why it is glyph-only

Earlier versions of this package let `children` render the whole
control. That made every consumer responsible for the APG listbox
keyboard contract — arrow keys, `Home` / `End`, typeahead, `Escape`,
`aria-activedescendant`, focus return — and in practice consumers
reimplemented a fraction of it. Narrowing the render prop to the glyph
moved that burden back where it belongs.

If you need a genuinely different interaction model (an editable
combobox with filtering, say), do not fight this prop — compose your
own control from the exported helpers `bcp47LocaleTag`, `isRtlLocale`,
`localeName`, `matchNavigatorLanguage`, and `defaultLocaleLabels`. They
are exported precisely so that is a supported path.

## Recipe: show the active locale in the button

The most common override. The default globe says "this changes
language" but not "you are reading French" — pairing it with the
endonym says both:

```tsx
<LocaleChooser label="Language" locales={locales} localeLabels={endonyms}>
    {({ value, labelFor }) => (
        <>
            <span aria-hidden="true">{GLOBE_WITH_MERIDIANS}</span>
            <span aria-hidden="true">{labelFor(value)}</span>
        </>
    )}
</LocaleChooser>
```

`GLOBE_WITH_MERIDIANS` is exported so you can re-use the exact glyph —
U+1F310 followed by U+FE0E VARIATION SELECTOR-15, which forces text
presentation so the globe renders monochrome instead of as a blue
emoji.

## Recipe: short code for narrow layouts

```tsx
<LocaleChooser label="Language" locales={["en", "fr", "de", "ja"]}>
    {({ value }) => (
        <span aria-hidden="true">{value.split(/[-_]/)[0].toUpperCase()}</span>
    )}
</LocaleChooser>
```

Two-letter codes are compact but not universally legible — "JA" reads
as nothing to a Japanese-only reader. Prefer the endonym when you have
the room. See [`../examples/compact-glyph.tsx`](../examples/compact-glyph.tsx).

## Recipe: open/closed affordance

`open` lets the glyph carry the disclosure state visually. Screen
readers already get it from `aria-expanded` on the button, so the
caret must stay hidden:

```tsx
<LocaleChooser label="Language" locales={locales}>
    {({ value, open, labelFor }) => (
        <>
            <span aria-hidden="true">{labelFor(value)}</span>
            <span aria-hidden="true">{open ? "▲" : "▼"}</span>
        </>
    )}
</LocaleChooser>
```

You can equally do this in pure CSS via
`.locale-chooser-button[aria-expanded="true"]` and skip the render prop
entirely — see [styling.md](./styling.md#attribute-hooks).

## Rules for custom glyph content

**Mark it `aria-hidden="true"`.** The button is already named by
`aria-label={label}`. Content that is not hidden is announced *in
addition* to the label, giving "Language English button" — or worse,
"Language 🌐 English button". This is the single most common mistake.

**Do not put interactive elements inside.** The glyph lives inside a
`<button>`; a nested `<button>` or `<a>` is invalid HTML and breaks
keyboard navigation. Use text and spans.

**Do not assume `value` is non-empty.** On the very first render before
the mount effect resolves the initial locale, `value` is `""`.
`labelFor("")` returns `""`, so guard if the empty string would look
broken:

```tsx
{({ value, labelFor }) => (
    <span aria-hidden="true">{value ? labelFor(value) : "🌐"}</span>
)}
```

**Do not assume `value` is BCP 47.** It is the code in the form you
supplied. Run it through the exported `bcp47LocaleTag` before handing
it to `Intl` APIs.

**Keep the tap target large enough.** Shrinking to a two-letter code
often shrinks the button with it. WCAG 2.2 AA asks for 24×24 CSS px
(2.5.8); AAA asks for 44×44 (2.5.5). Pad the button rather than relying
on the glyph's own size.

## Rendering the status line

The status line is a consumer responsibility in every rendering mode,
custom or default. The button's visible content is `aria-hidden`, so
without a status line there is no visible, selectable text naming the
active locale:

```tsx
<>
    <LocaleChooser value={locale} onChange={setLocale} label="Language" locales={locales} />
    <p className="locale-chooser-status">
        Language: <span lang={bcp47LocaleTag(locale)}>{localeName(locale)}</span>
    </p>
</>
```

Note the `lang` on the inner span — the locale's own name should be
pronounced in its own language, exactly as the options are.

---

Lily™ and Lily Design System™ are trademarks.
