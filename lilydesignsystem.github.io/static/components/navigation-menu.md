# Navigation Menu

A navigation menu provides a semantic `<nav>` landmark with an accessible label, containing navigation links or other interactive elements for site-wide or section-level navigation. It enables screen reader users to quickly locate and jump to the navigation area using landmark navigation, and it clearly communicates the purpose of the enclosed links.

**Status:** stable — exercised in composed page flows under e2e and axe, beyond the per-component checks.

This component is suitable for primary navigation bars, sidebar navigation, footer navigation, breadcrumb wrappers, and any grouped set of navigation links that benefit from landmark semantics.

## Implementation Notes

- Renders a native `<nav>` element, which is automatically recognized as a navigation landmark by screen readers.
- Uses `aria-label` to distinguish this navigation from other `<nav>` elements on the same page (e.g., "Main navigation" vs. "Footer navigation").
- Content is passed via the `children` slot, allowing any markup structure (links, lists, nested menus).
- Spreads `restProps` onto the `<nav>` for consumer customization.
- No internal state or keyboard handling by default; relies on native link and focus behavior.
- **Overflow mode** (opt-in, `overflow`): the same `<nav>`, but the links that do not fit on one row move into a "More" disclosure. It is progressive enhancement: with no JavaScript, or with `overflow` unset, the links simply wrap and the More item stays `hidden`. See [Overflow mode](#overflow-mode).

## Props

- `label`: string (required) -- accessible name applied via `aria-label` to distinguish this nav landmark.
- `overflow`: boolean (optional, default `false`) -- overflow mode. Publishes `data-overflow="true"` on the root. The component then renders the list itself (`<ul class="navigation-menu-list">`), so `children` must be `<li>` items.
- `moreLabel`: string (**required** with `overflow`; Web Components attribute `more-label`, Blazor `MoreLabel`) -- the accessible name of the More button. There is no English default.
- `children`: slot (required) -- navigation content to render inside the `<nav>` element (in overflow mode, `<li>` items).
- `...restProps`: unknown -- additional attributes spread onto the `<nav>` element.

## Usage

Primary site navigation with main section links:

```html
<NavigationMenu label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/products">Products</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</NavigationMenu>
```

Footer navigation with legal and support links:

```html
<NavigationMenu label="Footer navigation">
  <ul>
    <li><a href="/privacy">Privacy Policy</a></li>
    <li><a href="/terms">Terms of Service</a></li>
    <li><a href="/contact">Contact Us</a></li>
  </ul>
</NavigationMenu>
```

Sidebar section navigation:

```html
<NavigationMenu label="Documentation sections">
  <ul>
    <li><a href="/docs/getting-started">Getting Started</a></li>
    <li><a href="/docs/components">Components</a></li>
    <li><a href="/docs/api">API Reference</a></li>
  </ul>
</NavigationMenu>
```

## Overflow mode

Rendered markup (the component renders this; a script only moves the items):

```html
<nav
  class="navigation-menu"
  aria-label="Main navigation"
  data-overflow="true"
>
  <ul class="navigation-menu-list">
    <li><a href="/">Home</a></li>
    <li>
      <a
        href="/about"
        aria-current="page"
        >About</a
      >
    </li>
    <li
      class="navigation-menu-more"
      hidden
    >
      <button
        class="navigation-menu-more-button"
        type="button"
        aria-expanded="false"
        aria-controls="navigation-menu-more-list-1"
      >
        More
      </button>
      <ul
        class="navigation-menu-more-list"
        id="navigation-menu-more-list-1"
        hidden
      >
        <!-- items that do not fit are moved here, in order -->
      </ul>
    </li>
  </ul>
</nav>
```

- **Measuring.** A `ResizeObserver` on the list (never a `window` `resize` listener; skipped when `ResizeObserver` is missing) measures which items fit on one row beside the More item and moves the rest, in order, into `navigation-menu-more-list`. They move back, in order, when room returns. The More item is unhidden only while something overflows. The pure measuring step is `shared/overflow-navigation.ts`, copied into each library by `bin/sync-shared-modules`.
- **In normal flow.** The opened More list is not a popover: it sits in the page flow, so it pushes the content below it down and never covers it (WCAG 2.4.11 Focus Not Obscured). Clicking outside closes it.
- **Moved items keep their links and `aria-current`.** The component reads and writes no text; `moreLabel` is the only string and the consumer supplies it.
- **No script.** With JavaScript off, or `overflow` unset, the list wraps (the themes set `flex-wrap: wrap` on `.navigation-menu-list`) and the More item stays hidden: every link remains reachable at 320 CSS pixels (WCAG 1.4.10).
- **Static items.** The set of items must not change while mounted (the script moves the nodes the framework rendered). Give the component a new `key` (React, Vue, Svelte `{#key}`, Blazor `@key`) when the items change.
- **Per library.** Svelte, React, Vue, Angular, Web Components (`overflow` and `more-label` attributes) and Alpine (`x-data="lilyNavigationMenu"`) measure and move. Blazor does it through a collocated JS module loaded after first render (skipped during prerender; static SSR gets the wrapping fallback). Nunjucks and the HTML snippet render and document the markup only (neither library ships component scripts); call `setupOverflowNavigation(nav)` from your own script to enhance them.

## Keyboard Interactions

Default: none -- this component is a passive container. Navigation links inside use standard Tab key focus and Enter/Space key activation provided by the browser.

Overflow mode:

| Key         | Action                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------ |
| Enter/Space | On the More button: opens or closes the list of moved links.                               |
| Escape      | Closes the open list and returns focus to the More button.                                 |
| Tab         | Moves through the links in order (the moved links follow the More button when it is open). |
| Click       | A click outside the More item closes the list.                                             |

## ARIA

- The `<nav>` element implicitly has `role="navigation"`, making it a navigation landmark.
- `aria-label` -- provides an accessible name to distinguish this navigation from other `<nav>` landmarks on the page.
- Overflow mode: the More `<button>` carries `aria-expanded` (`true` while the list is open) and `aria-controls` (the id of `navigation-menu-more-list`); its accessible name is the consumer's `moreLabel`. It is a disclosure, not an ARIA menu: no `role="menu"`, because the items are real links.

## When to Use

- Use for site-wide navigation with links to main sections.
- Use as the primary navigation component wrapping a group of navigation links.
- Use when screen reader users need to quickly locate and jump to a navigation region via landmark navigation.
- Use for footer navigation, sidebar navigation, or breadcrumb wrappers.
- Use when a semantic `<nav>` landmark is needed to group related links.
- Use `overflow` when a long list of site links must fit one row on narrow screens without wrapping to many rows.

## When Not to Use

- Do not use for action menus -- use Menu or DropdownMenu instead.
- Do not use for hierarchical tree navigation -- use TreeNav instead.
- Do not use for command palettes -- use Command instead.
- Do not use `overflow` for a handful of links that fit a narrow screen anyway, or for a mobile "hamburger" that hides everything -- use `hamburger-menu` for that.

## Headless

This headless component provides a native `<nav>` element with `aria-label` for landmark identification, automatically recognized by assistive technologies. The consumer provides all visual styling, including link layout, responsive behavior, hover states, and active indicators.

## Styles

The consumer provides all CSS styling. The component renders with a `.navigation-menu` class for targeting. No default styles are included — this is a fully headless component.

Overflow mode adds the sub-class hooks `.navigation-menu-list` (the list; give it `flex-wrap: wrap` for the no-script behaviour), `.navigation-menu-more` (the More `<li>`), `.navigation-menu-more-button` and `.navigation-menu-more-list` (the moved links, in normal flow), and the `[data-overflow="true"]` attribute on the root. The 57 reference themes style them in their shared "Overflow navigation" section.

## Testing

- Verify the component renders a `<nav>` element with class `navigation-menu`
- Verify The `<nav>` element implicitly has `role="navigation"`, making it a navigation landmark.
- Verify aria-label`-- provides an accessible name to distinguish this navigation from other`<nav>` landmarks on the page.
- Verify pass-through attributes are applied
- Verify overflow unset renders as before (no list, no More item, no `data-overflow`)
- Verify, with a stubbed `ResizeObserver` and sizes, that overflow moves the extra items into the More list in order, unhides the More item, toggles `aria-expanded`, closes on Escape and refocuses the button, and moves the items back when widened

## Advice

- **Designers**: Highlight the current page link in the navigation to orient users, and ensure the navigation is responsive across screen sizes.
- **Designers**: In overflow mode keep the More button at least 24 CSS pixels tall and wide, label it in the page's language, and let the opened list push content down rather than float over it.
- **Developers**: Use distinct `aria-label` values when multiple `<nav>` elements exist on the same page (e.g., "Main navigation" vs. "Footer navigation") so screen reader users can distinguish them.

## Related components

- `sidebar` — a side panel for navigation or supplementary content
- `menu-bar` — a horizontal bar of menu triggers
- `hamburger-menu` — a toggle button that opens a mobile navigation menu
- `tree-nav` — a hierarchical navigation with expandable branches

## References

- WAI-ARIA Navigation Landmark: https://www.w3.org/TR/wai-aria-1.2/#navigation
- WAI-ARIA Landmarks: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/

---

Lily™ and Lily Design System™ are trademarks.
