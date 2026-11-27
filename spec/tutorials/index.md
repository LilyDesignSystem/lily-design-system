# Tutorials

## Summary

The docs site's tutorials at `/tutorials/`: one per framework, some by topic, and since 2026-11-25 **project tutorials**
(four since 2026-11-27), each of which builds a small working version of a real open-source project that uses Lily, and leads
on to it.

## Scope

Covers what a project tutorial must hold and how it is checked. The framework and topic tutorials (`/tutorials/svelte/`,
`/tutorials/forms/`) follow the same writing rules but are shorter and are not built by `bin/check-tutorials`. The example apps
are [examples](../examples/index.md); the components' own guidance is [components](../components/index.md).

## The project tutorials

| Route                                             | Leads to                                                                                                        |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `/tutorials/international-patient-summary/`       | [International Patient Summary](https://github.com/international-patient-summary/international-patient-summary) |
| `/tutorials/electronic-patient-record/`           | [Electronic Patient Record](https://github.com/electronic-patient-record/electronic-patient-record)             |
| `/tutorials/patient-administration-system/`       | [Patient Administration System](https://github.com/patient-administration-system/patient-administration-system) |
| `/tutorials/pre-operative-assessment-by-patient/` | [Form Examples](https://github.com/FormExamples/form-examples): `forms/pre-operative-assessment-by-patient`     |

## The book-an-appointment tutorials

`/tutorials/book-appointment/` (2026-11-27, tasks.md P62-T6) builds one phone screen three times: `swift/` (SwiftUI, the published
package), `kotlin/` (Jetpack Compose, a module of the repository's Gradle build until the libraries are on Maven Central) and
`maui/` (.NET MAUI, a project reference until `LilyDesignSystem.Maui` is on NuGet). Each page is the whole app and a screenshot
of it from a simulator or emulator, in `static/assets/images/tutorials/book-appointment/`. They follow the rules below where a
native app can; `bin/check-tutorials` does not build them, so when Lily's mobile packages change, rebuild each from its page and
take the screenshot again. `tests/book-appointment-tutorials.spec.ts` checks the pages.

## Principles and rules

- **The whole app is on the page.** Every file a reader writes is one code block, `<pre tabindex="0" data-file="path">`, holding the
  whole file. Nothing is elided with "...", and no file is shown twice.
- **Published packages only.** The install commands on the page are what a reader runs, so a tutorial may not use an unreleased
  prop. When a published package has a defect, the tutorial stays clear of it and the defect is a task.
- **Rules before screens.** The rules that matter (what absence means, a stale change, a silent patient) are pure code with tests,
  written before the page that shows them.
- **A test the reader can break.** Each tutorial names a mistake to make and says a test will fail. `bin/check-tutorials` makes it.
- **Honest about the target.** The page gives the project's own status: not a medical device, a pre-release scaffold, not in use
  with real patients. It never says more than the project does.
- **The last step is a map**: each part of the reader's app to the file it grows into, then one good next step, then what the
  reader's version does not do.
- **Invented patients only**, and a line near the top that says the result is for learning.
- **Words, calendars and time zones are the reader's.** One `words.ts` per app; the clinic's time zone is explicit.

## Checks

- `bin/check-tutorials --syntax` (in `bin/test`): each page's blocks parse, no file repeats, each internal link is a page, and each
  mistake is still there to make.
- `bin/check-tutorials` (`bin/ci --job tutorials`, weekly in `example-browser-suites.yml`): scaffolds a new app, installs from npm,
  copies the files off the page, type-checks, runs the tests and counts them, makes each mistake, builds, and drives the app in
  Chromium at 320 pixels wide with axe. It needs the network, so it is in neither `bin/test` nor `--full`.
- The site's `tests/project-tutorials.spec.ts`: each page's heading, its link to the project, keyboard-reachable code blocks, reflow
  and axe.

## Translation

The pages are English only. The index cards are the projects' own names and abbreviations, which are the same in every language,
so `/tutorials/` lists them in all 64. Translating the pages is the same decision as tasks.md P29-T11b.

## Acceptance criteria

- [x] Four project tutorials, each built and driven by `bin/check-tutorials` from a fresh scaffold (the pre-operative
      assessment since 2026-11-27, tasks.md P62-T2).
- [x] Each is linked from `/tutorials/`, the site map and the sitemap, and has a Markdown twin.
- [x] Every repository link resolves to a public file (checked 2026-11-25).
- [ ] A developer new to Lily follows one from start to end, and what stopped them is fixed (tasks.md P51-T5).

## Related topics

- [Examples](../examples/index.md), [healthcare-ui](../healthcare-ui/index.md), [testing](../testing/index.md)

## Sources

- [bin/check-tutorials](../../bin/check-tutorials)
- [lilydesignsystem.github.io/src/routes/tutorials](../../lilydesignsystem.github.io/src/routes/tutorials)

---

Lily™ and Lily Design System™ are trademarks.
