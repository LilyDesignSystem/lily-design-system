# Local CI/CD (planned work)

## Summary

An assessment, written 2026-11-04, of how much of Lily's verification and release can run on the maintainer's own machine
instead of on GitHub Actions, with ten proposals. The finding is narrower than the question. Lily's repository is public, so
GitHub-hosted runners are free for it; the cost worry does not apply today. The reliability worry does, but the evidence read
so far points at the repository's own workflow and tests, not at GitHub. Local CI is still worth building, for three other
reasons: pushes are fast and CI-red is caught before them, the work does not depend on one forge, and publishing is already
a local act. Tasks: [tasks.md Phase 24](../../tasks.md#phase-24--local-cicd-2026-11-04). Plan:
[plan.md § Phase 24](../../plan.md#phase-24--local-cicd-2026-11-04).

## Scope

### In scope

What runs where today, what it costs, what is red and why, the realistic options, and a recommended order.

### Explicitly out of scope

- Moving the repository off GitHub. Source hosting stays on Codeberg, GitHub and GitLab ([architecture](../architecture/index.md)).
- Replacing OIDC trusted publishing ([trusted-publishing](../trusted-publishing/index.md)); that needs a CI identity.
- Any paid service. Every option below is free or self-hosted.

## What runs where today (measured 2026-11-04)

| Fact                                                                                                                                                                                                                                     | Source                               |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| The repository is public.                                                                                                                                                                                                                | `gh repo view`                       |
| One workflow file, `.github/workflows/ci.yml` (589 lines, 13 jobs, four of them matrices), and a tag-gated `publish.yml`. No GitLab or Codeberg pipeline exists.                                                                         | the files                            |
| The 13 jobs: `verify`, `lint`, `helper-packages`, `headless`, `html-headless`, `dotnet-tests`, `dotnet-helper-packages`, `example-smoke`, `eleventy-example`, `alpine-examples`, `consumer-smoke`, `shadcn-registry`, `spell-check`.     | `ci.yml`                             |
| Triggers: every push to `main` and every pull request to `main`. A `concurrency` group cancels a superseded run, every job has a `timeout-minutes`, and a Markdown-only push skips the test matrices (P24-T4, 2026-11-09).               | `ci.yml`                             |
| Wall time of a run: 14 to 23 minutes (the 13 job definitions expand through four matrices).                                                                                                                                              | `gh run list`, last 7 runs           |
| Of the last 200 `CI` runs (since 2026-10-18), 188 failed and 10 passed. The last green run was `cff2dbc9b` on 2026-10-18; the first failure after it (`6a27fce73`) was the spell check alone. Red has been the normal state for 17 days. | `gh run list`, 2026-11-04            |
| No git hooks are installed in the working copy, and `core.hooksPath` is unset. Nothing runs before a push.                                                                                                                               | `.git/hooks`, `git config`           |
| Docker is installed locally; `act`, `gitlab-ci-local` and `lefthook` are not.                                                                                                                                                            | `which`                              |
| Publishing is already local: `bin/publish-helpers` and `bin/publish-headless` run on the maintainer's machine (no `NPM_TOKEN` in CI); CI's `publish.yml` is a dry run unless dispatched with `real`.                                     | [releasing](../../docs/releasing.md) |

### Why CI is red (one run read in detail, 2026-11-04)

Run on `9c7b13299`: 17 jobs failed. The logs of the next run, on `49e29d7be`, were read; three causes account for what was read there:

- **Playwright browsers not installed.** Two example-app jobs fail with `browserType.launch: Executable doesn't exist` for
  Firefox and WebKit. The workflow installs only Chromium (`playwright install --with-deps chromium`), while the Playwright
  configs now also run a cross-engine set in Firefox and WebKit ([tasks.md P18-T1](../../tasks.md)). The log holds 975 such launch errors.
- **A type error in one helper's test config:** `vitest.config.ts(1,36): Cannot find module 'node:url'` in the Web Components The cause: on a laptop the repo-root `node_modules` supplies `@types/node` to every package, so the check passes there; CI installs per package, so it fails. A clean-room run (proposal 6) would have caught it; 47 packages now exclude the config files from `tsc --noEmit`.
  helper packages job.
- **`cspell`** failed in the spell check job (reason not read).

The other failed jobs were not read.

The history matters more than the causes. The first failure after the last green run was one job, `cspell`, caused by names such as Forgejo, Rawline and CNIC missing from `.cspell/project-words.txt`. A red `CI` stayed red for 17 days, so each later breakage (the browsers, the `node:url` typing) landed unseen under a status that already said failed. A gate that is allowed to stay red teaches everyone to ignore it, which is the argument for a local gate that is checked before the push, and for making CI red a stop-the-line event. These are repository defects, found by CI doing its job, not GitHub outages. A local
gate would have caught the first two before they were pushed.

## What GitHub costs today (verified from GitHub's own page, 2026-11-04)

- GitHub states Actions "will remain free for public repositories" ([GitHub, 2026 pricing changes](https://github.com/resources/insights/2026-pricing-changes-for-github-actions)). Lily's CI cost is therefore zero minutes billed.
- Hosted-runner prices were cut by up to 39 percent on 2026-01-01, with a $0.002 per minute platform charge built in. That affects private repositories and larger runners.
- A $0.002 per minute charge on **self-hosted** runners, planned for 2026-03-01, was postponed on 2025-12-15 "to take time to re-evaluate our approach", with no new date. Secondary sources disagree on whether it is dead; it is not scheduled. A plan that depends on free self-hosted runners should record that risk.
- Not verified: Dependabot update runs also appear in `gh run list`; for a public repository they should be free too.

## Options assessed

Scored for Lily: three forges receive every push, only GitHub has a pipeline, the maintainer has one Apple Silicon Mac with
Docker, and the stack is pnpm, .NET, Playwright and Node.

| Option                                       | What it is                                                                                                                                                                                  | Verdict                                                                                                                                                                                                                                                                                                                                     |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. A tiered local gate script (`bin/ci`)** | Plain shell. Tier 1 (seconds) is the parts of `bin/test` that need no install; tier 2 (minutes) adds the headless suites; tier 3 is everything CI does. Each CI job maps to one named step. | **Do first.** No new dependency, works the same on every forge, and CI can call the same script so there is one definition.                                                                                                                                                                                                                 |
| **B. Committed git hooks**                   | `.githooks/pre-push` running tier 1, enabled by `git config core.hooksPath .githooks` (set up by a `bin/` script).                                                                          | **Do with A.** No dependency. A hook is advisory (`--no-verify` skips it), so CI stays the backstop.                                                                                                                                                                                                                                        |
| **C. `act`**                                 | Runs the existing workflow YAML in Docker on the laptop.                                                                                                                                    | **Trial for debugging single jobs, not as the gate.** Secondary sources report gaps (concurrency, parts of the `github` context, `workflow_dispatch` inputs, service containers) and workflows that pass in `act` and fail on GitHub. On Apple Silicon Linux jobs run as arm64 unless forced to amd64. Not verified against its repository. |
| **D. Self-hosted GitHub runner on the Mac**  | The maintainer's machine registers as a runner; the same YAML runs there.                                                                                                                   | **Defer.** Free today, but the postponed fee is a live risk, the machine must be on, and GitHub warns against self-hosted runners on **public** repositories because a pull request from a fork can run code on the host. Only safe if limited to `push` on `main`.                                                                         |
| **E. Woodpecker CI on Codeberg**             | Codeberg's hosted CI, by request form, reviewed by a volunteer.                                                                                                                             | **Ask, but do not depend on it.** Codeberg says it is "provided as-is and might break at any time", `linux/amd64` only, usage must be reasonable. Needs a new `.woodpecker/` pipeline. Free of GitHub, not free of fragility.                                                                                                               |
| **F. Forgejo Actions on Codeberg**           | The same workflow syntax, on a runner you provide (Codeberg's own hosted runners are "limited" and in open alpha).                                                                          | **Interesting.** The YAML is largely portable, so one definition could serve both forges. Needs hardware, which is the maintainer's machine or a cheap VM. Compatibility with Lily's 13 jobs is untested.                                                                                                                                   |
| **G. GitLab CI**                             | A `.gitlab-ci.yml` on the mirror. GitLab for Open Source reportedly gives Ultimate and 50,000 minutes a month, at a 0.5 cost factor for public projects.                                    | **Not worth a second dialect.** Reported figures are older secondary sources, unverified for 2026, and the benefit applies to a whole namespace. `gitlab-ci-local` runs these pipelines locally but only helps if the pipeline exists.                                                                                                      |
| **H. Dagger, Earthly, Nix**                  | A new pipeline language or build system, portable across runners.                                                                                                                           | **Reject for now.** Rewrites 13 jobs into a new model for no problem Lily has. (Earthly's current status was not found; do not assume.)                                                                                                                                                                                                     |
| **I. A macOS VM (Tart)**                     | Apple Silicon macOS and Linux VMs for CI.                                                                                                                                                   | **Not needed.** Nothing in Lily is macOS-specific.                                                                                                                                                                                                                                                                                          |

## Proposals

### 1. Make CI green before anything else

Local CI cannot replace a red one. Install Firefox and WebKit where the Playwright configs need them, fix the
`node:url` typing in the Web Components helper `vitest.config.ts`, and read the remaining failures. Until the last green
commit is known, no gate can say what "passing" means. Check: a push to `main` produces a green `CI` run.

### 2. One gate script with tiers: `bin/ci`

`bin/ci --fast | --full | --job <name> | --list`. Each CI job becomes one function with the same commands the YAML runs;
`ci.yml` then calls `bin/ci --job <name>`, so the YAML shrinks to setup (checkout, Node, pnpm, .NET, Playwright) plus one
line. The local run and the GitHub run cannot drift. The script prints a table of step, result and seconds. Check: the
`--list` output names all 13 jobs, and `ci.yml` contains no command that `bin/ci` lacks.

### 3. A pre-push hook for tier 1

`.githooks/pre-push` runs `bin/ci --fast`: the parts of `bin/test` that need no install (required files, generated-file
drift checks, links, spell check), to be split out of `bin/test` as a flag. Enabled by `bin/setup-hooks`. A hook can be skipped, so it prevents mistakes, not misconduct. Check: a
deliberately stale generated file stops a push.

### 4. Cheaper GitHub runs, whatever else happens

Add `concurrency: { group: ci-${{ github.ref }}, cancel-in-progress: true }`, `timeout-minutes` on every job, and `paths`
filters so a Markdown-only commit skips the matrices. This does not need any local tooling and removes the stacked runs seen
2026-11-04 (six within an hour). Check: two quick pushes leave one run.

_Done 2026-11-09 (P24-T4)._ Not with `paths` filters: a workflow-level filter skips `verify` too, and a skipped workflow
leaves a required check pending. Instead a `changes` job diffs the push (or the pull request against its base) and the
test jobs run only when a file other than `*.md` changed; skipped jobs report "skipped". `verify`, `eslint` (its
`format:check` reads Markdown) and `spell-check` always run. The timeouts are about three times each job's duration in
the last green run on `main` (Nunjucks Playwright 31 minutes, so 60; spell check 1, so 10).

### 5. A receipt for the local run

`bin/ci --full` writes `.ci/receipt.json`: the commit SHA, the tree state (clean or not), each job's result and duration,
tool versions and the date. It is not committed. `bin/publish-helpers` and `bin/publish-headless` refuse a real publish
unless a receipt for the same SHA exists, clean and all green. This makes the existing local publish step safer without
needing CI. A receipt is self-asserted, so it proves discipline, not integrity. Check: a publish on a dirty tree or a
different SHA refuses.

### 6. A clean-room mode

The most common local-versus-CI difference is state on the maintainer's machine. `bin/ci --clean` runs the full gate in a
fresh `git worktree` of `HEAD` with no `node_modules` carried over, in a container for the Linux jobs
(`--platform linux/amd64`, since Codeberg's runner and GitHub's are amd64). This session showed why: a worktree without the
dependencies fails `bin/test` in `bin/generate-site-pages`, which a laptop checkout hides. Check: the clean run fails on a
missing lockfile entry that a normal run does not notice.

### 7. A decision on a second forge's CI

Ask Codeberg for Woodpecker access (proposal E) and try a Forgejo runner on the Mac (F) with `ci.yml` unchanged. If the
workflow runs unmodified, the repository has two independent pipelines from one file. Maintainer decision: whether any
second pipeline is worth the upkeep. Check: one job runs green on a Forgejo runner.

### 8. A trial of `act`

For one job at a time when debugging workflow YAML. Record what does not work. Do not make it a gate. Check: the notes list
the failures found, with the job.

### 9. Measure before optimising

Record each job's duration and its cache hit rate from `gh run list` for a month. The 13 jobs install the same dependencies
many times; a shared cache or a combined install may save more than any local tool.

### 10. Say what CI is for

Once `bin/ci` exists, CI's job is to prove the **clean-room** result for an outside observer and to hold the OIDC identity
for publishing. Everything else is the maintainer's gate. State this in [tooling](../tooling/index.md) and
[releasing](../../docs/releasing.md).

## What is not adopted

- **A paid CI service or larger runners.** No problem measured needs them.
- **Making a local hook mandatory.** Hooks are skippable; the receipt and CI are the controls.
- **A self-hosted runner on a public repository for pull requests.** Fork-PR code execution on the maintainer's machine is the main risk.
- **A new pipeline language (Dagger, Earthly, Nix).** See option H.

## Limits of this review

- The web sources were search results and two fetched pages (GitHub's pricing page, Codeberg's CI page) on 2026-11-04. The `act`, GitLab and Dagger notes come from secondary sources and are marked as such; check the project pages before relying on them.
- Only one failed run's logs were read, and only three of its causes.
- Job durations are wall time from the run list, not per-job billing minutes.

## Acceptance criteria

- [ ] `CI` is green on `main` (proposal 1).
- [ ] `bin/ci --list` names every CI job and `ci.yml` calls it (proposal 2).
- [ ] A pre-push hook runs tier 1, enabled by one script (proposal 3).
- [ ] CI cancels superseded runs and skips docs-only changes (proposal 4).
- [ ] A real publish refuses without a green receipt for the same SHA (proposal 5).

## Related topics

- [tooling](../tooling/index.md) — the `bin/` scripts and `bin/test`
- [trusted-publishing](../trusted-publishing/index.md) — why publishing needs a CI identity
- [testing](../testing/index.md) — the suites CI runs
- [dependabot](../dependabot/index.md) — the other source of workflow runs

## Sources

- [GitHub: 2026 pricing changes for GitHub Actions](https://github.com/resources/insights/2026-pricing-changes-for-github-actions)
- [GitHub changelog, 2025-12-16](https://github.blog/changelog/2025-12-16-coming-soon-simpler-pricing-and-a-better-experience-for-github-actions/)
- [The Register: GitHub walks back plan to charge for self-hosted runners](https://www.theregister.com/2025/12/17/github_charge_dev_own_hardware/)
- [Codeberg: CI](https://docs.codeberg.org/ci/), [Using Forgejo Actions (self-hosted)](https://docs.codeberg.org/ci/actions/)
- [nektos/act](https://github.com/nektos/act) (limits from secondary write-ups), [gitlab-ci-local](https://github.com/firecow/gitlab-ci-local), [Tart](https://github.com/cirruslabs/tart)
- [GitLab for Open Source compute minutes](https://sources.debian.org/src/gitlab/17.6.5-19/doc/ci/pipelines/compute_minutes.md) (older documentation)
- Lily: [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml), [`publish.yml`](../../.github/workflows/publish.yml), [`bin/test`](../../bin/test)

---

Lily™ and Lily Design System™ are trademarks.
