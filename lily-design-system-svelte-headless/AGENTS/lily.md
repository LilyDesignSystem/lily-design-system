## Lily Design System

[CSS style sheet template](css-style-sheet-template.css)

Canonical component list: [components.tsv](components.tsv)

### Subprojects for headless components

- [Lily Design System: HTML headless](lily-design-system-html-headless)
- [Lily Design System: Svelte headless](lily-design-system-svelte-headless)
- [Lily Design System: Blazor headless](lily-design-system-blazor-headless)
- [Lily Design System: React headless](lily-design-system-react-headless)
- [Lily Design System: Vue headless](lily-design-system-vue-headless)
- [Lily Design System: Nunjucks headless](lily-design-system-nunjucks-headless)

### Subprojects for web app examples

- [Lily Design System: HTML CSS JS examples](lily-design-system-html-css-js-examples)
- [Lily Design System: Svelte SvelteKit examples](lily-design-system-svelte-sveltekit-examples)
- [Lily Design System: Blazor Web examples](lily-design-system-blazor-web-examples)
- [Lily Design System: React Next.js examples](lily-design-system-react-next-examples)
- [Lily Design System: Vue Nuxt.js examples](lily-design-system-vue-nuxt-examples)

### Tools

- [list-components-as-kebab-case](bin/list-components-as-kebab-case): List components as kebab case
- [list-components-as-pascal-case](bin/list-components-as-pascal-case): List components as title case
- [list-implementations](bin/list-implementations): List implementation directories
- [create-component-directory](bin/create-component-directory): Scaffold one component directory
- [create-implementation-directory](bin/create-implementation-directory): Scaffold one implementation directory
- [test](bin/test): Run all tests
- [sync](bin/sync): Sync files across subprojects
- [update](bin/update): Update shared files
- [git-subtree-push](bin/git-subtree-push): Push subtree to its remote

### Inspirations

See [citations.md](citations.md) for the full list of design systems Lily draws from. Short list:

- [NHS UK Design System](https://service-manual.nhs.uk/design-system)
- [GOV.UK Design System](https://design-system.service.gov.uk/)
- [ONSdigital Design System](https://github.com/ONSdigital/design-system)
- [U.S. Web Design System (USWDS)](https://designsystem.digital.gov/)
- [Mozilla Protocol Design System](https://protocol.mozilla.org/)
- [Adobe Spectrum](https://spectrum.adobe.com/)
- [Ant Design](https://ant.design/)
- [Wonderflow Wanda](https://design.wonderflow.ai/)
- [Design System AU: Australian Government](https://designsystemau.org/)
- [DaisyUI](https://daisyui.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Reuters graphics components](https://github.com/reuters-graphics/graphics-components)

### For each subproject

- `index.md`
- `README.md` symlink to `index.md`
- `AGENTS.md` with AI coding help
- `AGENTS/` directory with modular agent files
- `CLAUDE.md` that loads `AGENTS.md`
- `.git-subtree-push`

### For each component directory

- `index.md`
- `README.md` symlink to `index.md`
- `AGENTS.md`
- `CLAUDE.md`
- `plan.md`
- `tasks.md`

### Verify

Run `bin/test`.
