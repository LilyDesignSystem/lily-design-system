# Tooling

> Lily Design System specification — topic doc. All topics: [spec index](../index.md).

**Summary.** The `bin/` scripts list and scaffold the catalog, verify required files across the repo and every subproject, sync the canonical AGENTS docs into subprojects, and push each subproject to its standalone git remote.

## Scope

Covers the `bin/` toolchain: catalog listers, directory scaffolders, the verification script, the sync model, the update driver, the subtree-push helper, and Storybook story generation. These scripts read `components.tsv` (the source of truth) and `bin/list-implementations` (the subproject list) and operate uniformly across the seven headless and seven example subprojects.

## Principles and rules

- **`components.tsv` is the catalog source of truth.** `list-components-as-kebab-case` and `-as-pascal-case` derive their output from it; nothing maintains a duplicate list.
- **AGENTS files at the repo root are canonical.** `bin/sync` rsyncs `AGENTS/` into each subproject. It uses rsync (file copies), **not** symlinks, because `git subtree push` does not follow symlinks across project boundaries — a symlinked AGENTS dir would break the standalone subtree repos.
- **`bin/test` is the single verification gate.** It checks required files across the repository, all components, the github.io site, and all implementation subprojects, and fails on missing or stub ("Not yet implemented.") files.
- **Scaffolders produce the standard file set.** Both `create-*-directory` scripts emit `index.md`, a `README.md` symlink to it, `AGENTS.md`, a `CLAUDE.md` that loads `@AGENTS.md`, plus `spec/index.md` (the spec-driven plan + tasks file that replaced the older `plan.md` / `tasks.md`).

## bin/ scripts

| Script                                | Purpose                                                                                  |
| ------------------------------------- | ---------------------------------------------------------------------------------------- |
| `list-components-as-kebab-case`       | Print every component slug (column 1 of `components.tsv`), one per line.                  |
| `list-components-as-pascal-case`      | Print every component PascalCase name, one per line.                                      |
| `list-implementations`               | List the implementation subprojects: top-level dirs matching `lily-*`, sorted.           |
| `create-component-directory`          | Scaffold one `components/{slug}/` directory with the standard file set.                   |
| `create-implementation-directory`    | Scaffold one implementation subproject directory with the standard file set.             |
| `test`                                | Verify required files across repo + components + github.io + all subprojects.             |
| `sync`                                | rsync the canonical root `AGENTS/` into every implementation's `AGENTS/`.                 |
| `update`                             | Drive an end-to-end audit/harmonise/test pass (invokes `claude` over every subproject).  |
| `git-subtree-push`                    | Push each subproject subtree to its standalone GitHub remote.                             |
| `generate-storybook-stories.mjs`      | Generate Storybook stories for the headless libraries.                                    |
| `publish-helpers`                     | Build (`build.js` per catalog) and publish the 21 helper packages — npm for the JS catalogs, NuGet for Blazor. |
| `generate-registries`                 | Regenerate every example-app catalog registry from `components.tsv` + the canonical SvelteKit demo map, so hand-copied registries cannot drift. |
| `check-links`                         | Verify every relative markdown link in tracked `*.md` files resolves (synced AGENTS copies excluded); exits non-zero on breakage. |

## Verification: bin/test

`bin/test` resolves the repo root via `git rev-parse --show-toplevel`, then runs a series of checks. Each subject must have `index.md`, a `README.md` symlink, a non-empty `AGENTS.md`, a `CLAUDE.md`, and a non-empty `spec/index.md`; `AGENTS.md` and `spec/index.md` must not contain the "Not yet implemented." marker.

| Check function                       | What it verifies                                                                         |
| ------------------------------------ | ---------------------------------------------------------------------------------------- |
| `test_repository`                    | Repo-root `CITATION.cff`, `CODE_OF_CONDUCT.md`, `LICENSE.md`, plus the standard AI files. |
| `test_components`                    | Every `components/{slug}/` has the standard AI file set.                                  |
| `test_lilydesignsystem_github_io`    | Each component has a github.io route dir with `+page.svelte`.                             |
| `test_implementations`               | Each `lily-*` subproject has the AI file set plus `.git-subtree-push`.                    |
| `test_implementations_with_vite`     | react-next / svelte-sveltekit / vue-nuxt have `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `vite.config.ts`, `vitest-setup.js`. |
| `test_implementations_with_svelte`   | Each Svelte component dir has `index.md`, `.svelte`, `.stories.svelte`, `.test.ts`.       |
| `test_implementation_nunjucks_headless` | Each nunjucks-headless component has `macro.njk`, `macro.test.js`, `index.md`.         |
| `test_implementation_nunjucks_example`  | Each nunjucks-example component has a `{slug}.njk`.                                     |

## Sync model

`bin/sync` copies the canonical root `AGENTS/` into every implementation subproject:

```sh
for implementation in $(bin/list-implementations); do
    rsync -av AGENTS/ "$implementation/AGENTS/"
done
```

| Aspect            | Detail                                                                  |
| ----------------- | ----------------------------------------------------------------------- |
| Canonical source  | Repo-root `AGENTS/`                                                      |
| Mechanism         | `rsync -av` (file copies)                                                |
| Why not symlinks  | `git subtree push` does not follow symlinks across project boundaries    |
| Targets           | Every `lily-*` implementation subproject's `AGENTS/`                     |

## Subtree push

Each subproject is a `git subtree`. `bin/git-subtree-push` publishes each one to its standalone remote at `git@github.com:LilyDesignSystem/{implementation}.git`.

| Invocation                  | Action                                                                              |
| --------------------------- | ----------------------------------------------------------------------------------- |
| `git-subtree-push`          | `git subtree push --prefix=<impl> <impl> main` for each implementation.              |
| `git-subtree-push --force`  | `git subtree split --branch temp-split` then force-push `temp-split:main` (bypasses stale subtree cache). |
| `git-subtree-push --remote-add` | Add the `LilyDesignSystem/{impl}` remote for each implementation.                |

## Acceptance criteria
- [ ] `list-components-as-kebab-case` and `-as-pascal-case` derive output from `components.tsv`.
- [ ] `list-implementations` lists every `lily-*` subproject, sorted.
- [x] `create-component-directory` and `create-implementation-directory` scaffold the standard file set (`index.md`, `README.md` symlink, `AGENTS.md`, `CLAUDE.md` loading `@AGENTS.md`, `spec/index.md`).
- [ ] `bin/test` passes against repo + all components + github.io + all subprojects.
- [ ] `bin/sync` rsyncs root `AGENTS/` into every subproject (copies, not symlinks).
- [ ] `bin/git-subtree-push` pushes each subtree to its `LilyDesignSystem/{impl}` remote.
- [ ] `generate-storybook-stories.mjs` produces stories for the headless libraries.

## Related topics
- [architecture](../architecture/index.md) — the subtree layout these scripts operate over.
- [testing](../testing/index.md) — the framework test suites that `bin/test` complements.
- [components](../components/index.md) — the `components.tsv` catalog the listers read.
- [examples](../examples/index.md) — Storybook and example apps the generators target.

## Sources
- [bin/](../../bin/) — `list-components-as-kebab-case`, `list-components-as-pascal-case`, `list-implementations`, `create-component-directory`, `create-implementation-directory`, `test`, `sync`, `update`, `git-subtree-push`, `generate-storybook-stories.mjs`
- [spec/index.md](../index.md) — §9 (Tooling table), §3 (subtree layout)
