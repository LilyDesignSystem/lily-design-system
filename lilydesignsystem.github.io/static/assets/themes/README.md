# Reference themes (copied, not generated)

These 45 files are a byte-for-byte copy of the monorepo's canonical
[`themes/`](https://github.com/LilyDesignSystem/lily-design-system/tree/main/themes)
directory, copied here so the site's `ThemePicker` (see
`src/lib/components/SitePreferences.svelte`) can load them at runtime via
`themesUrl="/assets/themes/"`.

There is no build step or script that keeps this copy in sync — if a
theme is added, removed, or renamed in the canonical `themes/` directory,
re-copy manually:

```sh
cp themes/*.css lilydesignsystem.github.io/static/assets/themes/
```

...and update the `themes` array in `SitePreferences.svelte` to match.
