# GovernmentBanner

A banner identifying a website as belonging to a government, with an expandable details panel explaining how to recognize an official site. Inspired by the USWDS Banner component.

## Implementation Notes

- Root element is `<aside>` (complementary landmark)
- `label`, `headerText`, and `expandLabel` are non-optional
- A stable panel id is generated via React's `useId()`
- The panel uses the native `hidden` attribute when collapsed
- The toggle's `aria-expanded` and `aria-controls` are wired automatically

## Props

- `label`: string (**required**) — `aria-label` for the banner section
- `headerText`: string (**required**) — top headline text
- `expandLabel`: string (**required**) — toggle button text
- `expanded`: boolean (default `false`) — whether the details panel is open
- `onToggle`: `() => void` (optional) — toggle handler
- `children`: ReactNode (optional) — details panel content
- `className`: string (optional) — appended after the root `government-banner` class
- `...restProps`: any additional HTML attributes passed to the `<aside>`

## Usage

```tsx
const [open, setOpen] = useState(false);

<GovernmentBanner
  label="Official government website"
  headerText="An official website of the United States government"
  expandLabel="Here's how you know"
  expanded={open}
  onToggle={() => setOpen(!open)}
>
  <div>
    <p><strong>Official websites use .gov</strong> — A .gov website belongs to an official government organization.</p>
    <p><strong>Secure .gov websites use HTTPS</strong> — A lock or HTTPS means you have securely connected to the .gov website.</p>
  </div>
</GovernmentBanner>
```

## ARIA

- `<aside>` complementary landmark with `aria-label`
- Toggle button with `aria-expanded` reflecting state
- `aria-controls` linking the toggle to the panel id (generated via `useId()`)

## References

- [USWDS Banner](https://designsystem.digital.gov/components/banner/)
- [WAI-ARIA Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)
