# Reference themes (copied, not generated)

These 45 files are a byte-for-byte copy of the monorepo's canonical
[`themes/`](https://github.com/LilyDesignSystem/lily-design-system/tree/main/themes)
directory, copied here so the site's `ThemePicker` (see
`src/lib/components/SitePreferences.svelte`) can load them at runtime via
`themesUrl="/assets/themes/"`.

`bin/sync` (run from the monorepo root) keeps this copy in step with the canonical
`themes/` directory: it rsyncs the `*.css` files here and leaves this README alone. If a
theme is added, removed, or renamed, run `bin/sync` and then update the `themes` array in
`SitePreferences.svelte` to match. (Until 2026-10-06 this copy was manual and had drifted
from the canonical files.)


