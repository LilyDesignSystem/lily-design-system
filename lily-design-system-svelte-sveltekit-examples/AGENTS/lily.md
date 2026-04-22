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

- [Lily Design System: HTML JavaScript examples](lily-design-system-html-javascript-examples)
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

- [ONSdigital design system](https://github.com/ONSdigital/design-system)
- [DaisyUI](https://daisyui.com/)
- [Reuters graphics components](https://github.com/reuters-graphics/graphics-components)
- [Shadcn](https://ui.shadcn.com/)

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
