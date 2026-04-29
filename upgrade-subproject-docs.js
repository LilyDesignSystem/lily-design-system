#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const TOP = __dirname;

// Subproject definitions
const subprojects = [
  {
    dir: "lily-design-system-html-headless",
    title: "Lily Design System — HTML Headless",
    framework: "HTML",
    tech: "Plain HTML + vanilla JavaScript",
    testFramework: "WebDriverIO",
    testCommand: "npx wdio run wdio.conf.js",
    fileExt: ".html",
    componentDir: "components",
    type: "headless",
  },
  {
    dir: "lily-design-system-svelte-headless",
    title: "Lily Design System — Svelte Headless",
    framework: "Svelte",
    tech: "Svelte 5 with runes + TypeScript",
    testFramework: "Vitest",
    testCommand: "npx vitest run",
    fileExt: ".svelte",
    componentDir: "components",
    type: "headless",
  },
  {
    dir: "lily-design-system-react-headless",
    title: "Lily Design System — React Headless",
    framework: "React",
    tech: "React 19 + TypeScript",
    testFramework: "Vitest",
    testCommand: "npx vitest run",
    fileExt: ".tsx",
    componentDir: "components",
    type: "headless",
  },
  {
    dir: "lily-design-system-vue-headless",
    title: "Lily Design System — Vue Headless",
    framework: "Vue",
    tech: "Vue 3 Composition API + TypeScript",
    testFramework: "Vitest",
    testCommand: "npx vitest run",
    fileExt: ".vue",
    componentDir: "components",
    type: "headless",
  },
  {
    dir: "lily-design-system-blazor-headless",
    title: "Lily Design System — Blazor Headless",
    framework: "Blazor",
    tech: "Blazor .NET 9 + C#",
    testFramework: "bUnit",
    testCommand: "dotnet test",
    fileExt: ".razor",
    componentDir: "Components",
    type: "headless",
  },
  {
    dir: "lily-design-system-html-javascript-examples",
    title: "Lily Design System — HTML JavaScript Examples",
    framework: "HTML",
    tech: "Plain HTML + vanilla JavaScript with simple styling",
    testFramework: "WebDriverIO",
    testCommand: "npx wdio run wdio.conf.js",
    fileExt: ".html",
    componentDir: "pages",
    type: "examples",
  },
  {
    dir: "lily-design-system-svelte-sveltekit-examples",
    title: "Lily Design System — Svelte SvelteKit Examples",
    framework: "Svelte",
    tech: "SvelteKit + Svelte 5 with simple styling",
    testFramework: "Vitest + Playwright",
    testCommand: "npx vitest run",
    fileExt: ".svelte",
    componentDir: "src/routes",
    type: "examples",
  },
  {
    dir: "lily-design-system-react-next-examples",
    title: "Lily Design System — React Next.js Examples",
    framework: "React",
    tech: "Next.js 14 + React 19 with simple styling",
    testFramework: "Vitest",
    testCommand: "npx vitest run",
    fileExt: ".tsx",
    componentDir: "src/app",
    type: "examples",
  },
  {
    dir: "lily-design-system-vue-nuxt-examples",
    title: "Lily Design System — Vue Nuxt.js Examples",
    framework: "Vue",
    tech: "Nuxt 3 + Vue 3 with simple styling",
    testFramework: "Vitest",
    testCommand: "npx vitest run",
    fileExt: ".vue",
    componentDir: "pages",
    type: "examples",
  },
  {
    dir: "lily-design-system-blazor-web-examples",
    title: "Lily Design System — Blazor Web Examples",
    framework: "Blazor",
    tech: "Blazor Web App .NET 9 with simple styling",
    testFramework: "bUnit",
    testCommand: "dotnet test",
    fileExt: ".razor",
    componentDir: "Components/Pages",
    type: "examples",
  },
];

let count = 0;

for (const sp of subprojects) {
  const dir = path.join(TOP, sp.dir);

  // Create directory if it doesn't exist (e.g., html-javascript-examples)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${sp.dir}`);
  }

  // --- plan.md ---
  const planPath = path.join(dir, "plan.md");
  let planMd;

  if (sp.type === "headless") {
    planMd = `# ${sp.title} — Implementation Plan

## Goal

Implement all headless components using ${sp.tech}. Every component must be headless (zero CSS), fully accessible (WCAG 2.2 AAA), and have comprehensive tests.

## Technology

- Framework: ${sp.tech}
- Test framework: ${sp.testFramework}
- Test command: \`${sp.testCommand}\`
- Component file extension: ${sp.fileExt}
- Component directory: ${sp.componentDir}/

## Approach

1. Set up project infrastructure (package.json, config, test setup)
2. Implement components in priority order:
   a. Static wrappers (badge, banner, card, panel, alert, etc.)
   b. Form inputs (text-input, email-input, checkbox-input, etc.)
   c. Links and views (action-link, postal-code-view, etc.)
   e. Table families (table, data-table, calendar-table, etc.)
   f. Navigation patterns (accordion-nav, breadcrumb-nav, etc.)
   g. List patterns (check-list, summary-list, task-list, etc.)
   h. Bar patterns (tab-bar, menu-bar, tool-bar, etc.)
   i. Picker patterns (color-picker, five-star-rating-picker, etc.)
   j. Form composition (form, field, fieldset, error-summary)
   k. Overlays and menus (dialog, popover, tooltip, dropdown-menu)
   l. Layout (grail-layout, sidebar, floating-panel, scroll-area)
   m. Interactive specialty (combobox, carousel, slider, signature-pad)
3. Create tests for each component
4. Cross-check all components against canonical list in AGENTS.md

## Acceptance Criteria

- [ ] All components from the canonical list are implemented
- [ ] Each component file follows the architecture in AGENTS.md
- [ ] Every component has a corresponding test file
- [ ] All tests pass: \`${sp.testCommand}\`
- [ ] Zero CSS in any component — fully headless
- [ ] WCAG 2.2 AAA compliant (ARIA attributes, keyboard navigation)
- [ ] No hardcoded user-facing strings (internationalization-ready)
- [ ] CSS class names match css-style-sheet-template.css
`;
  } else {
    planMd = `# ${sp.title} — Implementation Plan

## Goal

Create styled example pages demonstrating component usage with ${sp.tech}. Examples use NHS UK design system CSS for visual styling on top of headless components.

## Technology

- Framework: ${sp.tech}
- Test framework: ${sp.testFramework}
- Test command: \`${sp.testCommand}\`
- Component directory: ${sp.componentDir}/

## Approach

1. Set up project infrastructure and NHS UK CSS integration
2. Create example pages demonstrating component families:
   a. Form page (text-input, email-input, select, checkbox, radio, etc.)
   b. Navigation page (breadcrumb, pagination, accordion, tree)
   c. Table page (data-table, calendar-table)
   d. Dialog and overlay page (dialog, popover, tooltip, toast)
   e. Layout page (grail-layout, sidebar, card)
   g. Rating and picker page
   h. Additional showcase pages as needed
3. Import headless components from the corresponding headless library
4. Apply NHS UK CSS classes for styling
5. Create tests for each example page

## Acceptance Criteria

- [ ] Example pages demonstrate all major component families
- [ ] NHS UK CSS styling applied correctly
- [ ] Headless components imported from the headless library
- [ ] All pages are accessible (WCAG 2.2 AAA)
- [ ] All tests pass: \`${sp.testCommand}\`
- [ ] Responsive layout works on mobile and desktop
`;
  }

  fs.writeFileSync(planPath, planMd, "utf8");

  // --- tasks.md ---
  const tasksPath = path.join(dir, "tasks.md");
  let tasksMd;

  if (sp.type === "headless") {
    tasksMd = `# ${sp.title} — Tasks

## Done

- [x] Create subproject directory
- [x] Create AGENTS.md with component list and architecture
- [x] Create CLAUDE.md
- [x] Create index.md with project overview
- [x] Create README.md symlink

## In Progress

- [ ] Set up project infrastructure (package.json, config files)
- [ ] Implement static wrapper components (badge, banner, card, panel, alert, etc.)
- [ ] Implement form input components (text-input, email-input, etc.)
- [ ] Create tests for implemented components

## Backlog

- [ ] Implement link components (action-link, back-link, skip-link, etc.)
- [ ] Implement view components (postal-code-view, measurement views, etc.)
- [ ] Implement table families (5 families x 7 parts each)
- [ ] Implement navigation patterns (accordion-nav, breadcrumb-nav, etc.)
- [ ] Implement list patterns (check-list, summary-list, task-list, etc.)
- [ ] Implement bar patterns (tab-bar, menu-bar, tool-bar, etc.)
- [ ] Implement picker patterns (color-picker, five-star-rating-picker, etc.)
- [ ] Implement form composition (form, field, fieldset, error-summary)
- [ ] Implement overlays and menus (dialog, popover, tooltip, etc.)
- [ ] Implement layout components (grail-layout, sidebar, etc.)
- [ ] Implement interactive specialty (combobox, carousel, slider, etc.)
- [ ] Cross-check all components vs canonical list in AGENTS.md
- [ ] Run full test suite and fix failures
- [ ] Verify CSS class names match css-style-sheet-template.css
`;
  } else {
    tasksMd = `# ${sp.title} — Tasks

## Done

- [x] Create subproject directory
- [x] Create AGENTS.md with component list and architecture
- [x] Create CLAUDE.md
- [x] Create index.md with project overview
- [x] Create README.md symlink

## In Progress

- [ ] Set up project infrastructure
- [ ] Integrate NHS UK CSS styling
- [ ] Create example pages for component families

## Backlog

- [ ] Create form example page
- [ ] Create navigation example page
- [ ] Create table example page
- [ ] Create dialog and overlay example page
- [ ] Create layout example page
- [ ] Create rating and picker example page
- [ ] Add tests for each example page
- [ ] Verify responsive design on mobile and desktop
- [ ] Cross-check accessibility (WCAG 2.2 AAA)
`;
  }

  fs.writeFileSync(tasksPath, tasksMd, "utf8");

  // --- Ensure index.md exists (especially for html-javascript-examples) ---
  const indexPath = path.join(dir, "index.md");
  if (!fs.existsSync(indexPath) || fs.statSync(indexPath).size === 0) {
    let indexMd;
    if (sp.type === "headless") {
      indexMd = `# ${sp.title}

A headless ${sp.framework} component library with 284 components. All components are headless (no built-in styles), fully accessible (WCAG 2.2 AAA), and built with ${sp.tech}.

**Headless** means zero CSS, zero styles, zero opinions about appearance. You provide all styling. Components provide structure, semantics, accessibility, and behavior.

## Features

- 284 headless ${sp.framework} components
- Built with ${sp.tech}
- WCAG 2.2 AAA accessibility compliance
- Full keyboard navigation support
- ARIA attributes and roles
- Internationalization-ready (no hardcoded strings)
- Works with any CSS framework or custom styles

## Architecture

- **${sp.tech}** for component implementation
- **Headless design**: no CSS, no styles — consumers provide all styling
- **Accessible**: WCAG 2.2 AAA, ARIA attributes, keyboard navigation
- **Internationalization**: no hardcoded user-facing strings

## Testing

- Test framework: ${sp.testFramework}
- Run tests: \`${sp.testCommand}\`

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0, or contact us for more options.

## Contact

Joel Parker Henderson (joel@joelparkerhenderson.com)
`;
    } else {
      indexMd = `# ${sp.title}

Styled example pages demonstrating headless components with ${sp.tech}. Examples use NHS UK design system CSS for visual styling on top of headless components.

## Features

- Example pages demonstrating all major component families
- ${sp.tech}
- NHS UK design system CSS for consistent styling
- WCAG 2.2 AAA accessibility compliance
- Responsive design for mobile and desktop

## Architecture

- **${sp.tech}** for page implementation
- **Headless components** imported from the corresponding headless library
- **NHS UK CSS** for visual styling
- **Accessible**: WCAG 2.2 AAA

## Testing

- Test framework: ${sp.testFramework}
- Run tests: \`${sp.testCommand}\`

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0, or contact us for more options.

## Contact

Joel Parker Henderson (joel@joelparkerhenderson.com)
`;
    }
    fs.writeFileSync(indexPath, indexMd, "utf8");
    console.log(`Created index.md: ${sp.dir}`);
  }

  // --- Ensure AGENTS.md exists ---
  const agentsPath = path.join(dir, "AGENTS.md");
  if (!fs.existsSync(agentsPath) || fs.statSync(agentsPath).size === 0) {
    const agentsMd = `# ${sp.title}

## Metadata

- Package: ${sp.dir}
- Framework: ${sp.framework}
- Technology: ${sp.tech}
- Type: ${sp.type}

## Architecture

See index.md for full documentation.
See plan.md for implementation plan.
See tasks.md for task tracking.
`;
    fs.writeFileSync(agentsPath, agentsMd, "utf8");
    console.log(`Created AGENTS.md: ${sp.dir}`);
  }

  // --- Ensure CLAUDE.md exists ---
  const claudePath = path.join(dir, "CLAUDE.md");
  if (!fs.existsSync(claudePath) || fs.statSync(claudePath).size === 0) {
    fs.writeFileSync(claudePath, "@AGENTS.md\n", "utf8");
    console.log(`Created CLAUDE.md: ${sp.dir}`);
  }

  // --- Ensure README.md is a symlink ---
  const readmePath = path.join(dir, "README.md");
  if (fs.existsSync(readmePath)) {
    try {
      if (!fs.lstatSync(readmePath).isSymbolicLink()) {
        // Regular file exists but isn't a symlink — leave it
      }
    } catch (e) {
      /* ignore */
    }
  } else {
    fs.symlinkSync("index.md", readmePath);
    console.log(`Created README.md symlink: ${sp.dir}`);
  }

  count++;
}

console.log(`Upgraded ${count} subproject directories`);
