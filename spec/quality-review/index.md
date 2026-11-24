# Quality review (2026-11-24)

## Summary

A review of the commits of 2026-11-20 to 2026-11-24 and the specs they touched, asking what is wrong, what is claimed beyond
its evidence, and what to improve next. The code is in good shape: the local full run is green and the packages checked render
when installed. The weak points are the **claims and the gates**: GitHub CI did not pass on `main` once on 2026-11-24, one
public privacy answer is wrong, and several records say more than their tests check. Tasks:
[tasks.md Phase 48](../../tasks.md#phase-48--quality-review-2026-11-24).

## Scope

### In scope

- Gates (GitHub CI, `bin/ci`, the coverage floor, the publish receipt), the healthcare and privacy claims, the filter, the
  theme picker, the release process, label packs, and the specs' own accuracy.

### Explicitly out of scope

- The mobile packages, beyond noting them; external design systems (see [lessons](../index.md#topics)).

## Principles and rules

- **A claim cites what was observed.** "Verified", "never" and a cause are written only after the observation.
- **A skipped check is not a passed check.** A report says which checks did not run.
- **A task is ticked when its Verify line is met**, not when the code is written.
- **Absolute privacy answers are tested against every component**, not the family that prompted them.

## Findings

Each was confirmed on 2026-11-24 unless marked otherwise.

### Gates

| #   | Finding                                                                                                                                                                                                                                                                                        | Evidence                                  |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| 1   | No `CI` run on `main` passed on 2026-11-24. Of the 24 that ended, 11 failed and 13 were cancelled.                                                                                                                                                                                             | `gh run list --workflow CI --branch main` |
| 2   | `consumer-smoke` fails because `bin/smoke-packages` gives its jsdom no `MutationObserver`. It stops at the first HTML helper, so the Web Components, Nunjucks, Angular and Svelte checks after it do not run. The packages are not at fault: the published HTML picker renders when installed. | run 45497344205; a scratch install        |
| 3   | A local `--full` skips `consumer-smoke`, and the receipt still reads "clean and green", so packages were released today with the one consumer check red.                                                                                                                                       | `bin/ci --verify-receipt`                 |
| 4   | `bin/test` reports `docs/framework-comparison.md` as stale on GitHub when `bin/generate-framework-matrix` has in fact crashed: it runs the root install's prettier, which that job does not install. `bin/test` discards the output of the checks it runs, so a crash looks like drift.        | a checkout with nothing installed         |
| 5   | The Blazor branch count moves: 232 in five runs alone, 230 in some runs under load. Cause unknown. Being below the floor fails the gate as being above it does, so the flake blocks releases. Commit 4085d987f gives a cause that later proved wrong.                                          | two `bin/ci --full` runs of afd0eb9f8     |
| 6   | A background run ending in `tail` or `echo` reports success whatever `bin/test` returned. It led to one commit made on a failing run (amended before it was pushed).                                                                                                                           | the first run before 60844f3d2            |

### Privacy and healthcare claims

| #   | Finding                                                                                                                                                                                                                                                                                           | Evidence                            |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| 7   | `PHI.md` answers "Does it put patient data in attributes?" with "No". It is true of the identifier views only. `date-time-view` writes a date of birth to `datetime`, `age-view` an age to `data-duration`, `observation-view` an interpretation, `allergy-record-list-item` severity and status. | the Svelte sources                  |
| 8   | Web Components identifier **inputs** read `value` from the host, leave it there, and set `defaultValue`, which reflects into the `value` attribute. `age-view`, `date-time-view` and `duration-view` also keep the host's `value`.                                                                | their sources: no `removeAttribute` |
| 9   | The register's `tested` means "a cited file contains the id". Of 32 tested ids, 14 cite Svelte alone and 4 the shared TypeScript alone, though the rules are stated for every catalog.                                                                                                            | `requirements.md`                   |
| 10  | Corpus run 1 recorded "no digit lost" for 155 values. Only `DV_QUANTITY` and `DV_COUNT` (100) are read back; dates, durations, proportions and ranges are checked only for not throwing (a duration also for having the right HTML form).                                                         | `clinical-format.corpus.test.ts`    |
| 11  | 90 of the 94 Web Components identifier views have the same class body, name aside, so the HC-I2 fix was a 94-file edit.                                                                                                                                                                           | a normalised hash                   |

### Code

| #   | Finding                                                                                                                                                                                | Evidence                          |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| 12  | "Remove all conditions" is one click with no undo, and no confirmation.                                                                                                                | the filter sources                |
| 13  | No theme styles the `filter` helper, and no example app was found that mounts it, so its 2026-11-24 features have unit tests only: no axe, keyboard, contrast or 320px check.          | a search of `themes/` and the e2e |
| 14  | The partial-date writers no longer handle an empty list or an atom with three relations, yet the exported types allow both. Such a value would be written wrongly rather than refused. | `shared/filter-model.ts`          |
| 15  | P41-T5c was ticked although its Verify line (a Playwright check in each helper) was not met; the checks are unit tests.                                                                | `tasks.md`                        |

### Releases and docs

| #   | Finding                                                                                                                                                                                                                                                                                                                                                              | Evidence                 |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 16  | A package that pins a sibling at `^0.x` needs the sibling published before its own lockfile can be refreshed, so a picker-bar release is two releases. Nothing checks it, and `main` holds unresolvable lockfiles between the two.                                                                                                                                   | d42f352a2                |
| 17  | `bin/publish-headless` has no `--only`, so one package was published by hand today.                                                                                                                                                                                                                                                                                  | `bin/publish-headless`   |
| 18  | 50 published packages have no changelog section for their current version. Some keep no changelog of their own by design (a stub); which is not recorded.                                                                                                                                                                                                            | a scan of `package.json` |
| 19  | `spec/index.md` contradicts itself and the repository: 164 identifiers (188), 63 themes (65), 637, 633, 602, 597, 491 and 490 components (661), 184 and 225 subprojects, 88 pickers. It is 94 KB and loaded into every AI session; `tasks.md` is 568 KB with two Phase 43s.                                                                                          | counted                  |
| 20  | The `text-size` names have no stated rule for case, grammatical agreement or register. `wuu-001` mixes a Traditional character into a Simplified pack. Reported by another project's session. **Fixed 2026-11-24** in the packs and [label-packs](../label-packs/index.md#text-size-names), as unreviewed drafts; the rest of the Javanese pack is another register. | the packs                |

## Advice, in order

1. **Correct `PHI.md` first** (7). It is the page a privacy reviewer trusts, and it is wrong.
2. **Make `main` green and keep the smoke test honest** (1 to 4). Every other claim rests on it.
3. **Close the remaining attribute leak** (8), then widen the check from identifier views to every input and clinical view.
4. **Make the flake visible, then fix it** (5). Report beating the floor without failing the gate, so it cannot block a release.
5. **Say what the evidence says** (9, 10, 15): a catalog column in the register; a corpus test that reads every type back.
6. **Finish the filter** (12 to 14): undo, a mounted example with axe and 320px checks, and writers that refuse what they cannot write.
7. **Make releases one command** (16 to 18).
8. **Generate the counts** (19), and archive finished phases.

## Not adopted

- Raising or removing the coverage floor, or fixing a flake by retrying until it passes: both hide the cause.
- A confirmation dialog for "Remove all conditions": an undo is less interruptive and also covers a mistaken click.
- Removing `datetime` and `data-*` from clinical views: they are semantics and styling hooks. The claim is what is wrong; an
  adopter needs to know to mask them.

## Limits of this review

- Commits were read by title and by the files above, not line by line. Nothing was measured with a screen reader.
- Findings 12 to 14 come from reading the code; no failure was reproduced.

## Acceptance criteria

- [ ] `PHI.md` lists every attribute that can hold patient data, and a check keeps the list true (7, 8).
- [ ] A push to `main` produces a green `CI` run, `consumer-smoke` included (1, 2, 4).
- [ ] The publish gate names any skipped job and requires its last result (3).
- [ ] Every `tested` requirement names the catalogs that test it (9).
- [ ] The counts in `spec/index.md` and `AGENTS/*.md` are generated or checked (19).

## Related topics

- [testing](../testing/index.md), [local-ci](../local-ci/index.md), [healthcare-ui](../healthcare-ui/index.md),
  [label-packs](../label-packs/index.md), [helpers](../helpers/index.md).

## Sources

- [`PHI.md`](../../PHI.md), [`bin/ci`](../../bin/ci), [`bin/smoke-packages`](../../bin/smoke-packages),
  [`bin/generate-framework-matrix`](../../bin/generate-framework-matrix), [`coverage-floor.tsv`](../../coverage-floor.tsv),
  [`shared/filter-model.ts`](../../shared/filter-model.ts), [requirements register](../healthcare-ui/requirements.md).

---

Lily™ and Lily Design System™ are trademarks.
