# Lily Design System - HTML Headless

@AGENTS/lily.md
@AGENTS/components.md
@AGENTS/accessibility.md
@AGENTS/internationalization.md
@AGENTS/headless.md
@AGENTS/theme.md
@AGENTS/nhs-uk-design-system-references.md

## Metadata

- Package: lily-design-system-html-headless
- Version: 0.2.0
- Created: 2026-03-08
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- Contact: Joel Parker Henderson (joel@joelparkerhenderson.com)

## IMPORTANT component architecture

- Plain HTML only; vanilla HTML; no frameworks
- Vanilla JavaScript for interactivity
- Headless design: no CSS, no styles — consumers provide all styling
- Comprehensive comments with syntax, usage, examples, explanations
- Input/View pattern for paired -Input/-View components
- All tasks reference plan.md for implementation details
- Set HTML tag class using the component kebab-case name

## NO

- No frameworks (no React, no Svelte, no Vue, no Angular)
- No TypeScript (plain JavaScript only)
- No build tools required
- No CSS or styles — consumers provide all styling
- No images, icons, or fonts
- No Tailwind, no DaisyUI

## Component file structure

Each component has these files:

- {component-kebab-case}.html (HTML component with embedded vanilla JavaScript, with plenty of help comments)
- {component-kebab-case}.test.js (WebDriverIO test using vanilla JavaScript)

## Component success checklist

- **Keyboard navigation**: tested Tab, Enter, Space, Arrow keys, Escape as appropriate
- **Screen reader**: tested aria-label, aria-describedby, aria-live, etc.
- **WCAG 2.2 AAA**: tested compliance
- **ARIA attributes**: tested roles, states, properties, etc.
- **Focus management**: visible focus indicators via consumer CSS, proper tab order
- **Semantic HTML**: proper use of semantic elements

## Component granularity

- If a directory represents a compound pattern, then stop and ask for help.
- The directory must be changed to have separate component directories.
- The directory must not have sub-components within the same directory.

### Headless component scope

- Semantic HTML
- ARIA attributes
- Data attributes for state
- Vanilla JavaScript for interactivity
- No visual styling
- Consumers bring all their own CSS

## Titles

- PackagePascalCase: LilyHtmlHeadless
- package-kebab-case: lily-design-system-html-headless
- package_snake_case: lily_html_headless

## Helpers

- List components: Bash(find components -type d -depth 1 -exec basename {} \; | sort)

## Testing

- WebDriverIO for browser-based testing: https://webdriver.io/
- Vanilla JavaScript test files
- No TypeScript in tests

## Accessibility

- Semantic HTML, alt text, link text, form labels, scoping, table row headings, table column headings
- Provide keyboard navigation, screen readers, color contrast, etc.
- Web Content Accessibility Guidelines (WCAG) 2.2 AAA
- Accessible Rich Internet Applications (ARIA) attributes
- ARIA pattern references: Mapping to WAI-ARIA Authoring Practices

## Internationalization

- Never hardcode user-facing strings
- All text content comes through data attributes or JavaScript configuration
- Labels, placeholders, error messages are all configurable

## Template

```html
<!-- component-kebab-case.html -->
<!-- ComponentPascalCase component -->
<!--
  Description: {comprehensive description}

  Attributes:
    class — CSS class name(s) provided by consumer
    data-label — accessible label for the component
    ...

  Usage:
    <div class="component-kebab-case" data-label="Example">
      ...
    </div>
-->

<div class="component-kebab-case" role="region" aria-label="Example">...</div>

<script>
  // ComponentPascalCase behavior
  (function () {
    "use strict";
    // Vanilla JavaScript for interactivity
  })();
</script>
```

## Implementation plan

- Implementation priority: start with infrastructure tasks first, then proceed alphabetically
- Batch size: Implement as many components as possible per session, until out of tokens

## Timeline

- There is no specific deadline.
- There is no preferred timeline.
