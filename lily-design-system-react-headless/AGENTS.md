# Lily Design System - React Headless

A headless React component library with 332 accessible, unstyled components. Based on the Lily Design System canonical component list.

@AGENTS/lily.md
@AGENTS/components.md
@AGENTS/accessibility.md
@AGENTS/internationalization.md
@AGENTS/headless.md

## Quick Reference

- **Package**: lily-design-system-react-headless
- **Version**: 0.2.0
- **Created**: 2026-03-03
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## IMPORTANT Architecture

- React 19 with TypeScript
- Functional components (no class components)
- Each component: `.tsx` + `.test.tsx` + `.md`
- All files in `components/` directory (flat structure)
- Standalone examples in `examples/` directory

## STRICT Prohibitions

- **No Next.js** — pure React only
- **No @testing-library/jest-dom** — use vitest matchers only
- **No CSS/styles** — no Tailwind, no styled-components, no DaisyUI, no inline styles
- **No images, icons, or fonts** — consumers provide these
- **No hardcoded user-facing strings** — all text through props

## Component Patterns

### File Naming

Each component has exactly three files:

```
{ComponentPascalCase}.tsx       # Implementation
{ComponentPascalCase}.test.tsx  # Tests
{ComponentPascalCase}.md        # Documentation
```

### Root Element CSS Class

Every component's first HTML element sets a class combining the kebab-case name with consumer className:

```tsx
<button className={`button ${className}`} ...>
<div className={`banner ${className}`} ...>
<nav className={`breadcrumb-nav ${className}`} ...>
```

### Props Interface Pattern

```tsx
export interface ButtonProps {
  className?: string;
  // Component-specific props...
  children: React.ReactNode;
  [key: string]: unknown; // Allow rest props
}

export default function Button({
  className = "",
  // Destructured with defaults...
  children,
  ...restProps
}: ButtonProps) {
  return (
    <button className={`button ${className}`} {...restProps}>
      {children}
    </button>
  );
}
```

### State Management

- Use `useState` for local state (e.g., `visible`, `open`, `copied`)
- Use `useRef` for DOM references
- Use `useEffect` for side effects and cleanup
- Controlled components: `value` + `onChange` callback pattern
- When a component has multiple bindable states, use distinct callbacks: `onChange` for the primary value, `onOpenChange` for open/close, `onEditingChange` for editing mode, etc.
- Auto-generate IDs with `Math.random().toString(36).slice(2, 9)` when not provided (prefer `useId()` for new components)

### Callback Naming Convention

All custom callback props use camelCase:

- `onChange`, `onSubmit`, `onReset`, `onClick` — standard React events
- `onClose`, `onCancel`, `onSuccess`, `onError` — custom callbacks
- `onOpenChange`, `onEditingChange`, `onValueChange` — secondary state callbacks
- `onAdd`, `onInputChange` — domain-specific callbacks
- Never lowercase: no `onclick`, `onsubmit`, `onadd`, etc.

### HTML Attribute Casing in JSX

React requires camelCase for DOM properties:

- `autoComplete` (not `autocomplete`)
- `inputMode` (not `inputmode`)
- `tabIndex` (not `tabindex`)
- `className` (not `class`)
- `htmlFor` (not `for`)
- `dateTime` (not `datetime`)
- `readOnly` (not `readonly`)

### Input/View Pattern

Paired components for data entry vs. read-only display:

- `FiveStarRatingPicker` (interactive) / `FiveStarRatingView` (read-only)
- `NetPromoterScorePicker` / `NetPromoterScoreView`
- `MeasurementInstanceInput` / `MeasurementInstanceView`
- `PostalCodeInput` / `PostalCodeView`

## Testing

### Stack

- **vitest** (not Jest) — `pnpm test` runs `vitest run`
- **@testing-library/react** — render and query
- **@testing-library/user-event** — user interaction simulation
- **jsdom** — DOM environment

### Matcher Rules (CRITICAL)

Vitest built-in matchers ONLY. Never use jest-dom matchers:

```tsx
// CORRECT — vitest matchers
expect(el).toBeTruthy(); // element exists
expect(el).toBeNull(); // element doesn't exist
expect(el.getAttribute("role")).toBe("button"); // check attribute
expect(el.textContent).toContain("hello"); // check text
expect(button.disabled).toBe(true); // check property
expect(handleClick).toHaveBeenCalledOnce(); // check callback

// WRONG — jest-dom matchers (NEVER use)
expect(el).toBeInTheDocument();
expect(el).toHaveAttribute("role", "button");
expect(el).toHaveTextContent("hello");
expect(button).toBeDisabled();
```

### Test File Pattern

```tsx
import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./ComponentName";

describe("ComponentName", () => {
  test("renders with correct role", () => {
    render(<Subject label="Test">Content</Subject>);
    expect(screen.getByRole("button")).toBeTruthy();
  });

  test("handles click events", async () => {
    const user: UserEvent = userEvent.setup();
    const handleClick = vi.fn();
    render(<Subject onClick={handleClick}>Click</Subject>);
    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### Test Cleanup

Automatic cleanup is configured in `vitest-setup.ts`:

```tsx
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
afterEach(() => {
  cleanup();
});
```

## Accessibility

### Standards

- WCAG 2.2 AAA compliance
- WAI-ARIA Authoring Practices patterns
- Semantic HTML elements over generic divs

### Common Patterns

- `<label htmlFor={id}>` — link labels to inputs
- `aria-labelledby` / `aria-describedby` — link related elements
- `aria-invalid` + `aria-errormessage` — error state
- `role="alert"` — announce dynamic content
- `role="group"` with `aria-label` — group related controls
- Roving tabindex (`tabIndex={selected ? 0 : -1}`) — grid navigation
- `aria-pressed` — toggle button state
- `aria-expanded` — expandable sections
- `aria-current` — current item in navigation

### Auto-Generated IDs

Components auto-generate unique IDs for ARIA linking:

```tsx
const generatedId = `component-${Math.random().toString(36).slice(2, 9)}`;
const inputId = id ?? generatedId;
const descriptionId = `${inputId}-desc`;
const errorId = `${inputId}-error`;
```

## Known Gotchas

- `BreadcrumbListItem` has NO `href` prop — wrap links in child `<a>` elements
- `Alert` uses `heading` prop (not `label` or `title`)
- `Dialog` uses `label` prop (not `title`)
- `ErrorSummary` has `title` prop + `children` (no `errors` prop — render errors as children)
- `TabBarButton` requires `controls` prop (id of the associated panel)
- `RadioInput.onChange` receives a React ChangeEvent (not a value), unlike other inputs
- `Combobox` has separate `onChange` (value) and `onOpenChange` (open state) callbacks
- `FileUpload` uses `onInputChange` (not `onChange`) for file selection
- jsdom does not support `aspectRatio` CSS — test via data attributes instead
