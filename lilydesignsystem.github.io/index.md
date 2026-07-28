# lilydesignsystem.github.io

The public website for the [Lily Design System™](https://github.com/LilyDesignSystem) at <https://lilydesignsystem.github.io>.

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

## First deploy (one-time)

After the first `git subtree push` to `LilyDesignSystem/lilydesignsystem.github.io`:

1. Open `https://github.com/LilyDesignSystem/lilydesignsystem.github.io/settings/pages`.
2. Set **Source** to **GitHub Actions**.
3. Set **Custom domain** to `lilydesignsystem.com` (this is automated by `static/CNAME` after the first build, but the registrar DNS records still need to be configured separately).
4. Wait for DNS propagation; verify with `curl -I https://lilydesignsystem.com/` returning HTTP 200.

## Update the component catalog

The catalog data in `src/lib/components.ts` is generated from the canonical [`components.tsv`](https://github.com/LilyDesignSystem/lily-design-system/blob/main/components.tsv) in the main repo, by the main repo's own registry generator — do not hand-edit `components.ts`. To regenerate every example-app and site registry (including this one) from `components.tsv`:

```sh
cd ~/git/lilydesignsystem/lily-design-system
node bin/generate-registries
```

This overwrites `lilydesignsystem.github.io/src/lib/components.ts` in place, along
with the other framework registries. Run `bash bin/test` afterwards — it asserts
every registry's entry count matches the catalog.

## License

The site content (text, layout, CSS) is multi-licensed under BSD, MIT, Apache-2.0, GPL-2.0, or GPL-3.0 — same as the rest of Lily™. Pick whichever fits your needs.

Contact: Joel Parker Henderson — <joel@joelparkerhenderson.com>.

---

Lily™ and Lily Design System™ are trademarks.
