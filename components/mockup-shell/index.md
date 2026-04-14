# MockupShell

A mockup shell is a decorative container that visually resembles a terminal shell or command-line interface, used to frame terminal output, commands, or CLI examples in documentation and tutorials.

This headless component uses a `<div>` element with `role="img"` and `aria-label` to present the mockup as a decorative image to assistive technologies.

## Implementation Notes

- Uses `<div>` element with `role="img"` for decorative presentation
- `aria-label` describes the mockup content for screen readers
- Contains a slot for the terminal content area
- Consumer styles the shell chrome (title bar, prompt, background)

## Props

- `label`: string (required) -- accessible label describing the mockup content
- `children`: slot (required) -- the content displayed inside the shell mockup
- `...restProps`: Any additional HTML attributes

## Usage

Basic shell mockup with an installation command:

```html
<MockupShell label="Terminal showing installation command">
  <code>npm install lily-design-system</code>
</MockupShell>
```

Shell mockup with multi-line output:

```html
<MockupShell label="Terminal showing build output">
  <pre><code>$ pnpm build
Building project...
✓ Compiled 42 components
✓ Generated type definitions
✓ Build complete in 3.2s</code></pre>
</MockupShell>
```

Shell mockup in a getting-started guide:

```html
<h3>Step 1: Install dependencies</h3>
<MockupShell label="Terminal showing project setup commands">
  <pre><code>$ mkdir my-app && cd my-app
$ pnpm init
$ pnpm add lily-design-system</code></pre>
</MockupShell>
```

## Keyboard Interactions

- None -- mockups are decorative, not interactive

## ARIA

- `role="img"` -- presents the mockup as a single image to assistive technologies
- `aria-label` -- describes the mockup content for screen readers

## When to Use

- Use to showcase terminal commands, CLI output, or shell interactions in a realistic frame.
- Use in documentation and tutorials to frame command-line installation or setup steps.
- Use in developer-facing marketing pages to highlight CLI tooling.
- Use in README previews or onboarding guides to show expected terminal output.

## When Not to Use

- Do not use for code snippets or source code display -- use CodeBlock instead.
- Do not use for functional terminal emulators -- build a custom interactive terminal instead.
- Do not use for non-terminal content -- use MockupWindow or MockupBrowser instead.

## Headless

This component provides a `<div>` with `role="img"` and `aria-label` for accessible decorative presentation, with zero visual styling. The consumer is responsible for all CSS including terminal chrome, title bar, prompt styling, monospace font, background color, and content area sizing.

## Styles

The consumer provides all CSS styling. The component renders with a `.mockup-shell` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `mockup-shell`
- Verify `role="img"` is present
- Verify `aria-label` is applied
- Verify child content is rendered
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use a dark background with light monospace text for a recognizable terminal appearance. Include a title bar with window controls for authenticity.
- **Developers**: Always provide a descriptive `label` prop so screen readers can convey the mockup's purpose.
