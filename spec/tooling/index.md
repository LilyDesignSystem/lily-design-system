# Tooling

> Lily Design System™ specification — topic doc. All topics: [spec index](../index.md).

**Summary.** The `bin/` scripts list and scaffold the catalog, generate the derived files, verify required files and contracts across the repo and every subproject, sync the canonical AGENTS docs, shared modules and special files into subprojects, publish packages, and push the docs site to its own repository.

## Scope

Covers the `bin/` toolchain: catalog listers, directory scaffolders, the verification script, the sync model, the update driver, and Storybook story generation. These scripts read `components.tsv` (the source of truth) and `bin/list-implementations` (the subproject list) and operate across the nine headless libraries, eight example apps, helper packages and skills.

## Principles and rules

- **`components.tsv` is the catalog source of truth.** `list-components-as-kebab-case` and `-as-pascal-case` derive their output from it; nothing maintains a duplicate list.
- **AGENTS files at the repo root are canonical.** `bin/sync` rsyncs `AGENTS/` into each subproject. It uses rsync (file copies), **not** symlinks, because a copy stays correct when a subproject is packaged or copied out on its own, unlike symlinks across project boundaries.
- **`bin/test` is the single verification gate.** It checks required files across the repository, all components, the github.io site, and all implementation subprojects, and fails on missing or stub ("Not yet implemented.") files.
- **Lockfiles are always committed.** Every `pnpm-lock.yaml` (and any other package-manager lockfile) that exists in the tree is tracked in git — never gitignored, never left untracked. Reproducible installs are the point: CI, a fresh clone, and each published package must resolve the same dependency graph the maintainer tested, and a subproject published without its lockfile silently loses that. Lockfiles live where their `pnpm install` runs (a catalog or app root, or a package with its own install), and `bin/test` fails on any lockfile left untracked or ignored.
- **Scaffolders produce the standard file set.** Both `create-*-directory` scripts emit `index.md`, a `README.md` symlink to it, `AGENTS.md`, plus `spec/index.md` (the spec-driven plan + tasks file that replaced the older `plan.md` / `tasks.md`).

## bin/ scripts

Every script in `bin/` (2026-10-30). "Gate" means `bin/test` runs it and fails when it fails; "Report" means it prints and
always exits 0.

### Catalog, scaffolding and listing

| Script                             | Purpose                                                                                                                                           |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `list-components-as-kebab-case`    | Print every component slug (column 1 of `components.tsv`), one per line.                                                                          |
| `list-components-as-pascal-case`   | Print every component PascalCase name, one per line.                                                                                              |
| `list-implementations`             | List the implementation subprojects: top-level dirs matching `lily-design-system-*`, sorted (213 on 2026-10-30, skills and `themes` included).    |
| `list-helper-packages <framework>` | List one framework's top-level helper packages in dependency (build) order (20 each; Nunjucks 21 with `nunjucks-listbox-behavior`; Alpine 6).     |
| `create-component-directory`       | Scaffold one `components/{slug}/` directory with the standard file set; `--dry-run` lists paths without writing (gate: the tree must not change). |
| `create-implementation-directory`  | Scaffold one implementation subproject directory with the standard file set; `--dry-run` as above.                                                |
| `new-component`                    | End-to-end scaffolder for one new placeholder component across every layer `bin/test` verifies; `--dry-run` as above.                             |
| `generate-component-categories`    | Regenerate `components-categories.tsv` (HTML tag and category per component). No `--check`.                                                       |

### Generators (edit the source, never the output; see the Generated files table in `AGENTS/lily.md`)

| Script                           | Purpose                                                                                                                                                        | In `bin/test`             |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `generate-registries`            | Example-app registries, `component-demos.ts` copies, the site's component list, the listing in the root `index.md`, and the shadcn registry `static/r/react/`. | Gate (`--check`)          |
| `generate-examples`              | Per-component usage examples (from the docs) and rendered variants (`component-variants.json`) for every demonstration page.                                   | No `--check`              |
| `generate-site-pages`            | Rebuild placeholder docs-site component pages from `components/{slug}/index.md` and refresh every page's Example section.                                      | No `--check`              |
| `generate-api-docs`              | Canonical-contract sections on site pages, `/r/{slug}.json`, `/r/index.json` and `/components/{slug}.md`, from `components/*/AGENTS.md`.                       | Gate (`--check`)          |
| `generate-comparisons`           | The component matrix in `compare/index.md` from `compare/compare.tsv`; `--counts` prints each system's matched rows.                                           | Gate (`--check`)          |
| `generate-core`                  | Lily Core from test, e2e and screen-reader evidence: `core.json`, `docs/core.md`, `docs/accessibility-conformance-report.md`, the site's `/quality` page.      | Gate (`--check`)          |
| `generate-theme-tokens`          | DTCG token source under `themes/tokens/`: extract, generate the theme token blocks and `lily.resolver.json`, drift-check.                                      | Gate (`--check`)          |
| `generate-zone-names`            | `shared/zone-names/*.json` (Unicode CLDR time zone names for the 64 label-pack locales, through Node's ICU).                                                   | Gate (`--check`)          |
| `generate-page-markdown`         | A `.md` twin of each English site text page.                                                                                                                   | Gate (`--check`)          |
| `extract-site-pages`             | The docs site's main English pages, and those in `src/lib/extra-pages.json`, as translation sources (`src/lib/pages/*/en.html`).                               | Gate (`--check`)          |
| `generate-locale-pages`          | `/<code>/<page>/` routes for every translated language.                                                                                                        | Gate (`--check`)          |
| `generate-sitemap`               | The docs site's `sitemap.xml` from the route tree.                                                                                                             | `--check` exists, not run |
| `generate-storybook-stories.mjs` | Svelte Storybook stories (see the open acceptance criterion below).                                                                                            | No                        |
| `test-generators`                | Golden tests: runs four generators on the three-component fixture in `test/generators/` and compares with the goldens; `--update-goldens` rewrites them.       | Gate                      |

### Sync

| Script                    | Purpose                                                                                                                                 | In `bin/test`    |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `sync`                    | rsync the canonical root `AGENTS/` and `themes/` into subprojects (helper packages keep their own `AGENTS/` set).                       | No               |
| `sync-special-files`      | Propagate the top-level special files (LICENSE, CONTRIBUTING, SECURITY, GOVERNANCE, MAINTAINERS, …) into every subproject.              | Gate (`--check`) |
| `sync-shared-modules`     | Copy the pure modules in `shared/` (search, typeahead, listbox machine, zones, label-pack loaders, …) into each package that uses them. | Gate (`--check`) |
| `sync-example-components` | Mirror each headless library's components (and companion modules) into its example app's copy.                                          | Gate (`--check`) |
| `update`                  | Drive an end-to-end audit/harmonise/test pass (invokes `claude` over every subproject).                                                 | No               |

### Checks

| Script                         | Purpose                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | In `bin/test` |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `check-class-names`            | Every implementation in the 8 headless libraries carries its slug as the first token of a class list (583 × 7, 548 in Web Components).                                                                                                                                                                                                                                                                                                                                                                                                                  | Gate          |
| `check-html-tags`              | Every implementation's root element (the element its base class leads) is the contract's "HTML tag"; differences are listed with a reason in `bin/check-html-tags.allow.json`, which may only shrink (P10-T12).                                                                                                                                                                                                                                                                                                                                         | Gate          |
| `check-coverage`               | Drift matrix across the 7 full-catalog headless libraries: implementation, test, story, the demo map and CSS hooks (all 0 missing of 609), plus a **keys** column: of the 65 components whose `AGENTS.md` Keyboard section names an APG key, those whose test sends no key event (Svelte 42, React 42, Vue 42, Angular 41, HTML 36, Blazor 57; Nunjucks n/a). The 260 known gaps are in `check-coverage.keys-allow.json`; an unlisted gap fails, and so does a listed gap that has closed, so the list only shrinks. `--keys-baseline` prints the list. | Gate          |
| `check-native-primitives`      | Every Svelte overlay or popup component has a `## Native platform` section in its `AGENTS.md` in step with `spec/competitive-position/native-primitives.tsv` (52 components: 25 native, 18 hand-rolled, 9 candidates); `--write` regenerates the sections.                                                                                                                                                                                                                                                                                              | Gate          |
| `check-worldwide`              | Fails on a currency-code default, a `[0, 6]` weekend default, an English label default or an English locale default in shipped package code (allow-list `check-worldwide.allow.json`, empty; a stale entry fails); prints national identifier types by region and the label-pack review status.                                                                                                                                                                                                                                                         | Gate          |
| `check-port-parity`            | Web Components helpers against the HTML helpers, and Alpine against Svelte: class hooks, custom events and attributes missing from the port, unless allow-listed with a reason in `check-port-parity.allow.json`.                                                                                                                                                                                                                                                                                                                                       | Gate          |
| `check-port-logic`             | Angular and Blazor against Svelte: a port with no logic where Svelte has behaviour, and every Svelte prop missing from Angular (input, model, output or named slot), unless allow-listed with a reason; the list may only shrink. It finds a stub or a missing prop, it does not prove a port behaves the same.                                                                                                                                                                                                                                                                                                                                                    |
| `check-theme`                  | Conformance rules for the 63 reference themes; `--contrast` reports token-pair contrast against WCAG AA/AAA (report only).                                                                                                                                                                                                                                                                                                                                                                                                                              | Gate          |
| `check-dtcg-tokens`            | `themes/tokens/*.json` and `lily.resolver.json` are strict DTCG 2025.10.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Gate          |
| `check-theme-references`       | Public-sector themes whose upstream package has a newer major release than `themes/references.tsv` records.                                                                                                                                                                                                                                                                                                                                                                                                                                             | Report        |
| `check-helper-docs`            | Every Svelte grid-like helper documents each prop it has and lists no shipped prop as a non-goal.                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Gate          |
| `check-label-packs`            | The 64 label packs have the English pack's keys and placeholders, and the helpers still take every key a pack holds.                                                                                                                                                                                                                                                                                                                                                                                                                                    | Gate          |
| `check-site-page-translations` | Translated site pages keep the English markup structure and code samples, and each language is complete.                                                                                                                                                                                                                                                                                                                                                                                                                                                | Gate          |
| `check-package-metadata`       | Every published npm/NuGet package names the monorepo as its source repository.                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Gate          |
| `check-generated-files`        | The Generated files table in `AGENTS/lily.md` names only real scripts, claims no `--check` a script lacks, and omits no script that has one.                                                                                                                                                                                                                                                                                                                                                                                                            | Gate          |
| `check-links`                  | Every relative markdown link in tracked `*.md` files resolves (synced AGENTS copies excluded).                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Gate          |

### Publishing and release

| Script              | Purpose                                                                                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `publish-headless`  | Build and publish the 7 headless libraries (npm / NuGet); continues past an already-published package.                 |
| `publish-helpers`   | Build (in `list-helper-packages` order) and publish every helper package: npm for the JS frameworks, NuGet for Blazor. |
| `verify-published`  | Is every helper package's local version on npm / nuget.org? `--wait N` polls through registry lag. Never publishes.    |
| `smoke-packages`    | Pack and install each headless and npm helper tarball into a scratch consumer and render it.                           |
| `make-github-pages` | Push `lilydesignsystem.github.io/` to its own repository via git subtree (`make github-pages`).                        |

## Verification: bin/test

`bin/test` resolves the repo root via `git rev-parse --show-toplevel`, then runs its own check functions followed by the
gate scripts marked above. Each subject must have `index.md`, a `README.md` symlink, a non-empty `AGENTS.md` and a
non-empty `spec/index.md`; `AGENTS.md` and `spec/index.md` must not contain the "Not yet implemented." marker. It took
about 5 to 6 minutes on 2026-10-21 and about 50 seconds since 2026-10-31 (P12-T7); keep per-file process loops and
unbounded `find` walks out of it. One unit-test project runs here, because nothing else catches it locally: the Angular
prerender sweep, about 20 seconds, skipped with a note when `lily-design-system-angular-headless` is not installed.

| Check function                          | What it verifies                                                                                                                                                                             |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `test_repository`                       | Repo-root `CITATION.cff`, `CODE_OF_CONDUCT.md`, `LICENSE.md`, plus the standard AI files.                                                                                                    |
| `test_catalog_consistency`              | No duplicate slug or name in `components.tsv`; `components/` dirs match the catalog both ways; one CSS-template hook per slug; each example-app registry has one entry per row.              |
| `test_components`                       | Every `components/{slug}/` has the standard AI file set.                                                                                                                                     |
| `test_lilydesignsystem_github_io`       | Each component has a github.io route dir with `+page.svelte`.                                                                                                                                |
| `test_implementations`                  | Each `lily-design-system-*` subproject has the AI file set and the special files.                                                                                                            |
| `test_implementations_with_vite`        | react-next / svelte-sveltekit / vue-nuxt have `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `vite.config.ts`, `vitest-setup.js`.                                                        |
| `test_implementations_with_svelte`      | Each Svelte component dir has `index.md`, `.svelte`, `.stories.svelte`, `.test.ts`.                                                                                                          |
| `test_implementation_nunjucks_headless` | Each nunjucks-headless component has `macro.njk`, `macro.test.js`, `index.md`.                                                                                                               |
| `test_implementation_nunjucks_example`  | Each nunjucks-example component has a `{slug}.njk`.                                                                                                                                          |
| `test_helper_glyphs_are_bare`           | Glyph constants and `-picker-icon` / `-picker-submit-symbol` markup hold a bare character, not an escape or HTML entity (`date-time-picker`'s calendar and `search-picker`'s `⏎`).           |
| `test_locale_directories_have_a_region` | The docs site's locale route directories are `<language>-<region>`.                                                                                                                          |
| `test_no_subtree_mirrors`               | No tracked file links to a deleted subtree mirror (GitHub, GitLab or Codeberg; dated plans in `docs/superpowers` excepted), and no `.git-subtree-push` or `bin/git-subtree-push` is tracked. |
| `test_no_package_json_pnpm_overrides`   | No `package.json` carries a `pnpm.overrides` block (overrides live in `pnpm-workspace.yaml`).                                                                                                |
| `test_lockfiles_are_tracked`            | Every `pnpm-lock.yaml` on disk is tracked in git.                                                                                                                                            |

It also checks that `AGENTS/responsive.md` and `spec/responsive/index.md` exist and that `AGENTS.md` loads the former.

## Sync model

### bin/sync-special-files

Every subproject carries the top-level files a public project is expected to
carry (a published package ships its LICENSE). `bin/sync-special-files`
propagates them from the canonical root into every subproject, rewriting relative links so each copy is correct where
it lands, and generating `CITATION.cff` and `INSTALL.md` per subproject. It is
idempotent, and `--check` makes it a gate (`bin/test` calls it that way).

The full file set and the copy-versus-generate rule are in
[special-files-for-public-repos](../special-files-for-public-repos/index.md).

### bin/sync

`bin/sync` copies the canonical root `AGENTS/` into every implementation subproject:

```sh
for implementation in $(bin/list-implementations); do
    rsync -av AGENTS/ "$implementation/AGENTS/"
done
```

| Aspect           | Detail                                                                 |
| ---------------- | ---------------------------------------------------------------------- |
| Canonical source | Repo-root `AGENTS/`                                                    |
| Mechanism        | `rsync -av` (file copies)                                              |
| Why not symlinks | A copy stays correct when a subproject is packaged or copied out alone |
| Targets          | Every `lily-design-system-*` subproject's `AGENTS/` except helpers     |

## Subtree push (retired)

`bin/git-subtree-push` pushed each subproject to its own standalone repository until 2026-10-10, when those mirrors were deleted and the script removed. Only the docs site is still a subtree; `bin/make-github-pages` (`make github-pages`) pushes it. Packages publish from the monorepo: see [trusted-publishing](../trusted-publishing/index.md) § Monorepo publishing.

## Acceptance criteria

- [x] `list-components-as-kebab-case` and `-as-pascal-case` derive output from `components.tsv`.
- [x] `list-implementations` lists every `lily-design-system-*` subproject, sorted.
- [x] `create-component-directory` and `create-implementation-directory` scaffold the standard file set (`index.md`, `README.md` symlink, `AGENTS.md` loading `@AGENTS.md`, `spec/index.md`).
- [x] `bin/test` passes against repo + all components + github.io + all subprojects.
- [x] `bin/sync` rsyncs root `AGENTS/` into every subproject (copies, not symlinks). (Deliberately excludes the helper packages, which keep their own helper `AGENTS/` set — the script skips every name `bin/list-helper-packages` prints — so "every subproject" means every non-helper implementation, as documented in `AGENTS/lily.md`.)
- [x] Every `pnpm-lock.yaml` on disk (outside `node_modules/`) is tracked in git; `bin/test` fails on an untracked or ignored one.
- [x] `bin/sync-special-files` propagates the top-level special files into every
      subproject, is idempotent, and gates via `--check` from `bin/test`.
- [x] Every script in `bin/` appears in the tables above, with whether `bin/test` runs it.
- [ ] Every generator has a `--check` in `bin/test`: `generate-examples`, `generate-site-pages` and
      `generate-component-categories` have none, and `generate-sitemap --check` is not run (tasks.md P13-T1).
- [ ] `generate-storybook-stories.mjs` produces stories for the headless libraries. Overstated as written: reading the script, its `PROJECTS` array only targets `@lilydesignsystem/svelte-headless` (plus the SvelteKit examples app) — it does not touch React, Vue, Angular, HTML, Nunjucks, or Web Components headless at all. Those five full-catalog libraries do carry 609/609 `.stories.*` files each (`bin/check-coverage`, 2026-10-30) and Web Components carries 574/574 (its full achievable scope), so stories exist everywhere they should, but not because this script produced them — no other generator script exists in `bin/` for the other frameworks, so how those non-Svelte story files were produced/kept in sync is undocumented. Leaving open as a real doc/tooling mismatch, not a missing-stories defect.

## Local CI (planned)

The gate today is `bin/test` plus 13 GitHub Actions jobs. A tiered `bin/ci`, a pre-push hook and a run receipt are planned so the same checks run on the maintainer's machine first: [local-ci](../local-ci/index.md).

## Related topics

- [architecture](../architecture/index.md) — the monorepo layout these scripts operate over.
- [testing](../testing/index.md) — the framework test suites that `bin/test` complements.
- [components](../components/index.md) — the `components.tsv` catalog the listers read.
- [examples](../examples/index.md) — Storybook and example apps the generators target.

## Sources

- [bin/](../../bin/) — every script in the tables above; [bin/test](../../bin/test) for what the gate runs
- [AGENTS/lily.md](../../AGENTS/lily.md) — the Generated files table
- [spec/index.md](../index.md) — §9 (Tooling table), §3 (architecture)

---

Lily™ and Lily Design System™ are trademarks.
