# Lily Design System - Svelte Headless

@AGENTS/lily.md
@AGENTS/components.md
@AGENTS/accessibility.md
@AGENTS/internationalization.md
@AGENTS/headless.md

## Metadata

- Package: lily-design-system-svelte-headless
- Version: 0.2.0
- Created: 2021-03-30T15:47:49Z
- Updated: 2026-03-01T19:15:49Z
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or contact us for more
- Contact: Joel Parker Henderson (joel@joelparkerhenderson.com)

## IMPORTANT component architecture

- Svelte 5
- Runes patterns
- Prop conventions
- TypeScript conventions
- Headless design
- Comprehensive comments with syntax, usage, examples, explanations, etc.
- Input/View pattern for paired -Input/-View components
- All tasks reference plan.md for implementation details
- Set HTML tag class by using className props

## NO

- No SvelteKit
- No images
- No icons
- No fonts
- No DaisyUI
- No Paraglide
- No svelte-i18n
- No @testing-library/jest-dom

## Headless design principles

- Semantic HTML structure
- ARIA attributes for accessibility
- Props and events for behavior
- Consumers provide all CSS
- No visual styling
- No stylesheets
- No CSS classes beyond semantic ones
- No Tailwind
- No built-in styles

## Component file structure

Each component has these files:

- {ComponentTitlePascalCase}.md (markdown documentation of the component purpose, syntax, examples, help, claude rules, etc.)
- {ComponentTitlePascalCase}.svelte (Svelte TypeScript component headless, with plenty of help comments)
- {ComponentTitlePascalCase}.test.ts (testing-library svelte-testing-library component test)

## Component success checklist

- **Keyboard navigation**: tested Tab, Enter, Space, Arrow keys, Escape as appropriate.
- **Screen reader**: tested aria-label, aria-describedby, aria-live, etc.
- **WCAG 2.2 AAA**: tested compliance
- **ARIA attributes**: tested roles, states, properties, etc.
- **Focus management**: visible focus indicators via consumer CSS, proper tab order
- **TypeScript**: types exported tested
- **Component CLAUDE.md file**: updated with any improvements

## Component granularity

- If a directory represents a compound pattern, then stop and ask for help.
- The directory must be changed to have separate component directories
- The directory must not have sub-components within the same directory.

### Headless component scope

- Semantic HTML
- ARIA attributes
- Props
- Events
- No visual styling
- Consumers bring all their own CSS

## Titles

- PackagePascalCase: LilySvelteHeadless
- package-kebab-case: lily-design-system-svelte-headless
- package_snake_case: lily_svelte_headless

## Helpers

- List components: Bash(find components -type d -depth 1 -exec basename {} \; | sort)

## Testing

- testing-library svelte-testing-library https://github.com/testing-library/svelte-testing-library
- testing-library user-event: https://github.com/testing-library/user-event
- example help/testing-library/svelte-testing-library/examples/MyComponent.svelte
- example help/testing-library/svelte-testing-library/examples/MyComponent.svelte.test.ts

### Testing with vitest not jest-dom

Prohibit `@testing-library/jest-dom`. All tests use vitest built-in matchers only.

- `expect(el).toBeTruthy()` instead of `expect(el).toBeInTheDocument()`
- `expect(el).toBeNull()` instead of `expect(el).not.toBeInTheDocument()`
- `expect(el.getAttribute('role')).toBe('button')` instead of `expect(el).toHaveAttribute('role', 'button')`
- `expect(el.textContent).toContain('text')` instead of `expect(el).toHaveTextContent('text')`

## Accessibility

- Semantic HTML, alt text, link text, form labels, scoping, table row headings, table column headings.
- Provide keyboard navigation, screen readers, color contrast, etc.
- Web Content Accessibility Guidelines (WCAG) 2.2 AAA
- Accessible Rich Internet Applications (ARIA) attributes
- ARIA pattern references: Mapping to WAI-ARIA Authoring Practices

## Internationalization

- Never hardcode user-facing strings
- All text content comes through props
- Labels, placeholders, error messages are all configurable

## Setup

```sh
pnpm install --save-dev @sveltejs/vite-plugin-svelte
pnpm install --save-dev @sveltejs/adapter-auto
pnpm install --save-dev svelte
pnpm install --save-dev @vitest/ui
pnpm install --save-dev vitest
pnpm install --save-dev @testing-library/svelte
pnpm install --save-dev @testing-library/user-event
pnpm install --save-dev jsdom
```

## Template

```svelte
<script lang="ts">
    // {ComponentPascalTitle} component
    //
    // {comprehensive description}
    //
    // Props:
    //   className — string, optional. CSS class name.
    //     …
    //
    // Usage:
    //     …

    …

</script>

<!-- ComponentPascalTitle.svelte -->
<div
    class={`component-kebab-title ${className}`}
    role="region"
    aria-label={label}
    {...restProps}
>
    …
</div>
```

## Implementation plan

- Infrastructure prerequisites: Missing svelte dependency, vitest-setup.js, test pipeline verification
- Verify Test Pipeline: run `pnpm test` to confirm testing works end-to-end before writing component tests.
- Templates: .svelte, .test.ts, .md
- Implementation priority: start with infrastructure tasks first, then proceed alphabetically
- Batch size: Implement as many components as possible per session, until out of tokens

## Timeline

- There is no specific deadline.
- There is no preferred timeline.

# Verify

Each Svelte component:

- Svelte script gets the class name via props: `class: className = "",`

- Svelte HTML starts with a comment using format: `<!-- ComponentPascalTitle.svelte -->`
- Svelte HTML first tag attribute sets the class using format: `class={`component-kebab-title ${className}`}`
