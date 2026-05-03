# lilydesignsystem.github.io

The public website for the [Lily Design System](https://github.com/LilyDesignSystem) at <https://lilydesignsystem.github.io>.

## What's here

A SvelteKit project using `@sveltejs/adapter-static` that prerenders the entire site, deployed automatically by GitHub Actions to `https://lilydesignsystem.com/`.

```
lilydesignsystem.github.io/
├── src/
│   ├── app.html              SvelteKit document shell
│   ├── lib/components.ts     Component catalog (generated from components.tsv)
│   └── routes/               One folder per URL — +layout.svelte, +page.svelte
├── static/
│   ├── CNAME                 Custom domain (lilydesignsystem.com)
│   ├── .nojekyll             Disables Jekyll on GitHub Pages
│   └── assets/               style.css, favicon.svg, images/
├── .github/workflows/
│   └── deploy.yml            CI: builds and deploys on push to main
├── svelte.config.js          adapter-static config
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Develop

```sh
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # produces build/ for deploy
pnpm preview      # http://localhost:4173 — production-mode preview
pnpm check        # type-check
```

## Deploy

GitHub Actions deploys automatically on push to `main` of the public
`LilyDesignSystem/lilydesignsystem.github.io` repo. The site is served from
`https://lilydesignsystem.com/` (with a fallback on `https://lilydesignsystem.github.io/`).

## Update the component catalog

The catalog data in `src/lib/components.ts` is generated from the canonical [`components.tsv`](https://github.com/LilyDesignSystem/lily-design-system/blob/main/components.tsv) in the main repo. To regenerate:

```sh
cd ~/git/lilydesignsystem/lily-design-system
{
  echo "// Lily component catalog — generated from components.tsv"
  echo "// Components across HTML, Svelte, React, Vue, Blazor, Nunjucks headless"
  echo ""
  echo "export type LilyComponent = {"
  echo "  name: string;"
  echo "  pascal: string;"
  echo "  description: string;"
  echo "};"
  echo ""
  echo "export const LILY_COMPONENTS: LilyComponent[] = ["
  awk -F'\t' '{
    gsub(/"/, "\\\"", $1); gsub(/"/, "\\\"", $2); gsub(/"/, "\\\"", $3);
    printf "  { name: \"%s\", pascal: \"%s\", description: \"%s\" },\n", $1, $2, $3
  }' components.tsv
  echo "];"
} > ../lilydesignsystem.github.io/src/lib/components.ts
```

## License

The site content (text, layout, CSS) is multi-licensed under BSD, MIT, Apache-2.0, GPL-2.0, or GPL-3.0 — same as the rest of Lily. Pick whichever fits your needs.

Contact: Joel Parker Henderson — <joel@joelparkerhenderson.com>.
