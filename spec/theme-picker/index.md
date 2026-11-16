# Theme Picker

Label: a **contrast** icon — an outline circle with a filled right half, a bundled SVG (`viewBox="0 0 16 16"`, stroke-based), not a Unicode glyph. It was the glyph ◑ U+25D1 until 2026-09-16 (see `AGENTS/helpers.md`).

Button:

```html
<button
  type="button"
  class="theme-picker-button"
  aria-label="Theme Picker"
  aria-haspopup="listbox"
  aria-expanded="false"
  aria-controls="theme-picker-list"
>
  <svg
    class="theme-picker-icon"
    viewBox="0 0 16 16"
    width="1.05rem"
    height="1.05rem"
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle
      cx="8"
      cy="8"
      r="6"
    />
    <path
      d="M8 2a6 6 0 0 1 0 12z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
</button>
```

Tooltip (a sibling right after the button since 2026-10-04; purely visual, holds the button's own label, not linked with
`aria-describedby`):

```html
<div
  class="theme-picker-tooltip"
  role="tooltip"
  id="theme-picker-tooltip"
  hidden=""
>
  Theme Picker
</div>
```

List:

```html
<ul
  class="theme-picker-list"
  id="theme-picker-list"
  role="listbox"
  aria-label="Theme Picker List"
  tabindex="-1"
  hidden=""
></ul>
```

List item with theme picker option <slug>:

```html
<li
  role="option"
  class="theme-picker-option"
  id="theme-picker-option-lorem-ipsum"
  aria-selected="false"
>
  Lorem Ipsum
</li>
```

## No-flash head snippet (added 2026-11-02, P22-T2)

The picker applies the stored theme only when its script runs, which is after first paint on a static or server-rendered page.
To avoid a flash of the default theme, put a small classic (not `type="module"`, not `defer`) script in `<head>`, before the
stylesheet link would be needed, so it blocks the parser:

```html
<script>
  (function () {
    var slug = "light"; // the app's default
    try {
      var stored = localStorage.getItem("lily-theme"); // the picker's storage-key
      if (stored && /^[a-z0-9-]+$/.test(stored)) slug = stored;
      else if (matchMedia("(prefers-color-scheme: dark)").matches) slug = "dark"; // the app's dark slug
    } catch (e) {}
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.setAttribute("data-lily-theme-picker", "theme");
    link.href = "/themes/" + slug + ".css";
    document.head.appendChild(link);
    document.documentElement.setAttribute("data-theme", slug);
  })();
</script>
```

- Under a strict Content Security Policy, serve this as a file or hash it ([testing](../testing/index.md#content-security-policy)).
- The managed `<link data-lily-theme-picker>` is the one the picker adopts once it is defined, so no second request.
- The slug is checked against `^[a-z0-9-]+$` before it is used in a URL.
- The `prefers-color-scheme` line is the app's choice: it matches the picker's `detect-from-system`, and the two slugs are the
  app's. Remove it if the app has no dark theme.
- The picker's own `value` attribute and this snippet must agree on the default; the snippet wins on first paint.
- A framework with server rendering can instead write `data-theme` and the `<link>` into the HTML from a cookie
  ([`docs/ssr.md`](../../lily-design-system-html-theme-picker/docs/ssr.md)); the snippet is for static output.
- Reference: `assets/js/theme-boot.js` in the HTML examples app, with `e2e/no-flash-theme.spec.ts`, which blocks the picker
  script and asserts the stored theme is already applied. The other example apps load the theme through their framework; the
  Nunjucks and Alpine static apps can copy this snippet.

## Theme colour (added 2026-11-01, P21-T7)

Optional and off by default. With `themeColor` (`theme-color` on the custom elements, `data-lily-theme-picker-theme-color` from
the Nunjucks macro, `ThemeColor` in Blazor) the picker also writes `<meta name="theme-color">`, so the browser chrome (the
address bar on a phone) follows the applied theme.

- The colour is the root's computed `--lily-brand`, the decorative identity colour every theme defines
  ([visual-identity](../visual-identity/index.md)). The picker holds no colour table.
- It is written when the managed stylesheet fires `load`, because the new theme's custom properties exist only then; the
  listener is attached before the `href` changes. A stylesheet that fails to load leaves the tag as it was.
- Idempotent, like every apply: an unchanged colour writes nothing. A theme with no `--lily-brand` leaves the tag alone, and the
  tag is created only when a colour is written.
- The logic is one shared module, `shared/theme-color.ts`, copied into the TypeScript catalogs by `bin/sync-shared-modules`
  (Nunjucks gets the types-stripped `.js`); Blazor repeats the steps in its apply script.
- The value is whatever CSS colour the browser accepts for `theme-color`; it is not converted. Adopters who need a hex or
  `rgb()` value set `--lily-brand` to one.

## Follow this device, kept in a cookie (added 2026-11-16)

The listbox reads **Follow this device**, a line, then **Light** and **Dark** (and any other themes). In all eight catalogs, Svelte first. Contract: the Svelte package's [spec §5.6 and §5.7](../../lily-design-system-svelte-theme-picker/spec/index.md#56-follow-this-device-2026-11-16).

- `systemLabel` adds a first option, value `"system"` (`SYSTEM_THEME`), with no English default. While chosen it applies
  `systemThemes.light` or `.dark` (default `light`, `dark`) from `prefers-color-scheme`, and follows the device when it switches.
- The line is a border the theme draws on `.theme-picker-option-system` (all 63 `themes/`), because a listbox may hold only
  options and groups; the native select variant uses `<hr class="theme-picker-separator">`.
- `cookieName` keeps the choice, not the theme it applied, in a first-party cookie: `Path=/`, `SameSite=Lax`, `Secure` on https,
  400 days (the browser maximum). It is read before `localStorage`; a value that is not one of the choices is ignored.
- The change callback also receives the choice (`onChange(theme, choice)`), so a controlled picker keeps `"system"`.
- The pure helpers are one shared module, `shared/theme-choice.ts`, copied into the TypeScript catalogs by
  `bin/sync-shared-modules` (Nunjucks gets the `.js`); Blazor repeats them in C#.
- Both stores are on by default (2026-11-16), under `lily-{name}` (`lily-theme`); an empty `storageKey` / `cookieName` turns
  one off, and nothing is written on the first load, only when the choice changes. Done in the seven npm catalogs; Blazor
  still defaults both off.
- A server reads it with `readThemeCookie(header, name, allowed)` and sends `data-theme` and the `<link>` with the page; for
  `"system"` it links both themes by `media`. Recipe: the Svelte package's `examples/sveltekit-cookie/`.

## Acceptance criteria

- [x] Shipped as its own package in all eight frameworks: `bin/list-helper-packages <framework>` lists `<framework>-theme-picker` for
      svelte, react, vue, angular, html, web-components, nunjucks and blazor (checked 2026-10-30).
- [x] The HTML and Web Components packages carry the same class hooks, events and observed attributes (`bin/check-port-parity`,
      in `bin/test`).
- [x] The page-header rules in [AGENTS/helpers.md](../../AGENTS/helpers.md) apply: no English default text, the icon is
      decorative (`aria-hidden`), and the accessible name is the consumer's `label`.
- [ ] Verified in a real browser in Chromium, Firefox and WebKit for every framework (today: unit tests per package, and the
      example apps' own e2e where they use this picker).
- [x] `variant="select"` (a native `<select>`) in all eight frameworks, opt-in; checked in a browser by the HTML example's
      `e2e/theme-select.spec.ts` in Chromium and WebKit, with and without `appearance: base-select`.
- [x] Svelte: "Follow this device" (`systemLabel`, `systemThemes`) and the theme cookie (`cookieName`, `readThemeCookie`,
      `themeCookie`), with `ThemePicker.system.test.ts` (2026-11-16).
- [x] React (0.4.0, `ThemePicker.system.test.tsx`), on the shared `shared/theme-choice.ts` (2026-11-16).
- [x] Vue (0.4.0, `ThemePicker.system.test.ts`) (2026-11-16).
- [x] Angular (0.4.0, `theme-picker.system.spec.ts`) (2026-11-16).
- [x] HTML and Web Components (0.4.0, `theme-picker.system.test.ts`) (2026-11-16).
- [x] Nunjucks (0.4.0, `theme-picker.system.test.ts`) (2026-11-16).
- [x] Blazor (0.5.0, `ThemePickerSystemTests.cs`, with C# versions of the helpers) (2026-11-16): all eight catalogs.

## Related topics

[helpers](../helpers/index.md) · [theme](../theme/index.md) · [locale-picker](../locale-picker/index.md) · [text-size-picker](../text-size-picker/index.md)
