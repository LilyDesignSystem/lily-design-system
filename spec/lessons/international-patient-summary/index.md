# Lessons from the International Patient Summary projects (planned work)

## Summary

Eleven issues for Lily, found on 2026-11-21 while upgrading two consumers to `@lilydesignsystem/svelte-headless` 0.12.0,
`@lilydesignsystem/svelte-picker-bar` 0.8.0 and `@lilydesignsystem/themes` 0.7.0, and while reading Lily's IPS components
(added in svelte-headless 0.10.0) against a working viewer. The consumers are two projects in the
[International Patient Summary](https://github.com/international-patient-summary/international-patient-summary) repository:

- **The viewer** (`international-patient-summary-ui-with-svelte`): a SvelteKit 3 app that opens an HL7 FHIR International Patient
  Summary (IPS 2.0.1) and shows it with the record lists, `ObservationView`, `MedicalBanner` and the other medical components. It is
  checked by 204 unit tests, 73 end-to-end tests and axe in every locale.
- **The website** (`international-patient-summary.github.io`): a SvelteKit 3 static site in 127 locales with a hero, the picker bar
  and the themes.

Nothing here is built yet. Each item is an issue with the evidence, a proposal and an acceptance check. The order is the order
the consumers would benefit from them: items 1, 6, 8 and 9 first.

## Scope

### In scope

- The IPS components (`international-patient-summary`, `international-patient-summary-section`) and the `ips-sections` module.
- The `observation-view` meter, the `hero`, link colour across themes, and the 320 px layout of the themes.
- Release notes and release cadence, as they affect consumers that enforce a minimum release age.

### Explicitly out of scope

- The viewer's own FHIR reading, export and PDF code. Lily is headless and parses nothing, and should stay so.
- Adopting the viewer's class names. Lily's stay kebab-case with no project prefix.

## Limits of this review

What was run: both projects against the three versions above, the viewer's unit and end-to-end tests, and an axe pass in every
locale. What was read: the CHANGELOGs of svelte-headless 0.9.0 to 0.12.0, the source of `InternationalPatientSummary`,
`InternationalPatientSummarySection` and `ips-sections`, and a diff of `themes` 0.6.2 against 0.7.0 `light.css`. **Not found:** the
rule in `themes` 0.7.0 that causes item 9 (the diff has no obvious candidate), and any changelog for `themes` or
`svelte-picker-bar`. Statements about what Lily "should" do are proposals, not findings.

## What the consumers already match

| Lily offers                                             | The viewer today                                                                             |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Record lists with one never-blank status contract       | Used for every section (`AllergyRecordList` and the rest); the status words are the viewer's |
| `ObservationView` with value, unit, flag, range         | Used for every result; since 0.12.0 also with the meter (item 3)                             |
| `IPS_SECTIONS` with codes and levels                    | The viewer's own registry equals it; a test keeps the two the same (codes, levels, order)    |
| `ContentsNav`, `Details`, `ToggleButton`, `WarningText` | Used on the viewer's main screen                                                             |

## Issues

### 1. The IPS section component repeats the status the record lists already show

**Where:** `InternationalPatientSummarySection` (svelte-headless 0.10.0 and later).

**Problem.** For any status other than `known` the section prints `statusLabel` in a `<p>` under its heading. A section's record
list prints the same state in words as its one never-blank item (`RecordList` `status` and `statusLabel`, 0.9.0). A consumer that
uses both shows the sentence twice, for example "Information unavailable" under the heading and again in the list. The component
also warns in development (`A section that is not known must say why`) when `statusLabel` is left out, so a consumer cannot avoid
the repeat by omitting it.

**Why it matters.** The viewer already has the section structure the component provides: a `<section>` named by its heading, a
data attribute for status, and the narrative in a `<details>`. It did not adopt the component, only because of this repeat.

**Proposal.** Pick one owner for the status words and let the other follow, in this order of preference:

1. A section provides its status to the record list inside it (context), and the list reads it, so the words appear once.
2. Or add `statusPlacement="list"` (default `"heading"`), which hides the heading line and leaves `data-status` on the section.

**Acceptance.** A section with `status="unavailable"` and a record list inside shows the words once. No development warning
when the words are given once. Same behaviour in all nine catalogs.

### 2. The IPS section component has no place for what a viewer shows beside the heading

**Where:** `InternationalPatientSummarySection`, `InternationalPatientSummary`.

**Problem.** The viewer shows, between the heading and the entries: the section's level (required, recommended, optional), the
document's own title for the section when it differs, a LOINC code that a toggle reveals, and a warning when entries could not be
found in the Bundle. The component has `children` for the entries and `narrative`, nothing in between.

**Proposal.** Add an optional `meta` snippet (after the heading and status, before the children) and an optional `warning`
snippet. Both render nothing when omitted. `data-level` beside `data-required` would let a theme style the level without a
consumer's class.

**Acceptance.** A consumer can reproduce the viewer's `SectionView` markup with the component and no extra wrapper element.

### 3. Meter scale is left to every consumer

**Where:** `observation-view` `meterValue`, `meterMin`, `meterMax`, `meterLow`, `meterHigh`, `meterOptimum` (0.12.0).

**Problem.** The component draws the meter, but a consumer holding a value and a reference range (the FHIR shape) has to choose
`min` and `max`. The viewer's `meterOf` does it so: two-sided range, half a range beyond each end; one-sided range, from zero to
half as far again; always wide enough to hold the value; nothing when the value is not a number, the range is not numeric, the
range is reversed, or the units differ. Every consumer will write something like it, and write it differently.

**Proposal.** Add `meterScale(value, low?, high?)` to the `clinical-format` module, returning `{ min, max, low, high }` or
`undefined`, with those rules documented. Keep the component's props as they are.

**Acceptance.** Unit tests for each rule above, in every catalog where the module exists.

### 4. Development warnings cannot be turned off for one component

**Where:** `dev-warning` (`warnMissingName`, `warnMissingProp`).

**Problem.** `globalThis.lilyWarnings = false` silences all warnings. A consumer that uses a component in a way its author did not
foresee (item 1) has no narrower switch, so the choice is between noise and losing every other warning.

**Proposal.** Accept `globalThis.lilyWarnings = { InternationalPatientSummarySection: false }` (a map by component name) as well as a
boolean. Document it where the warnings are described.

**Acceptance.** A test that silences one component and still sees another's warning.

### 5. Print has to be done by the consumer

**Where:** `details`, and every component built on it (`Narrative`, entry sources).

**Problem.** A printed page cannot open a closed `<details>`, so clinical text inside it is lost on paper. The viewer opens every
`<details>` on `beforeprint` and restores them on `afterprint`. Any consumer printing Lily output has to do the same.

**Proposal.** Make `Details` do this itself (a `printOpen` prop, default true, with the two window events, cleaned up on
destroy), or ship a `printable` helper the root of a page calls once.

**Acceptance.** Printing a page with closed disclosures shows their content; closing them again afterwards leaves the page as
it was.

### 6. `.hero` fills with `--color-primary`, but links inside it use `--color-primary` too

**Where:** every theme's `:where(.hero)`; the global link colour.

**Problem.** `.hero` is a banner filled with `--color-primary` with `--color-primary-content` text. A consumer's global `a` rule uses
`--color-primary` for links. A link inside the hero is therefore the banner's own fill on the banner: invisible. The website's
language list lived in the hero and could not be read. The fix on the consumer's side was `color: inherit`, which every consumer
of `.hero` will have to find for itself.

**Proposal.** In each theme, `:where(.hero) a { color: inherit; text-decoration: underline; }`, and the same for `h1` to `h6`.
Add the rule to the hero's contract.

**Acceptance.** A link inside `.hero` meets 4.5:1 against the fill in every theme.

### 7. `.hero` centres text but not boxes with a maximum width

**Where:** `:where(.hero)` (`text-align: center`).

**Problem.** A paragraph with `max-inline-size` (the usual way to keep a line length readable) has its text centred inside a box that
sits at the start edge. The website's intro paragraph looked off-centre for that reason. The consumer's fix was `margin-inline: auto`.

**Proposal.** Give `:where(.hero) > *` `margin-inline: auto`, or document that a child with a maximum width needs it.

**Acceptance.** A paragraph with a 70ch maximum inside a wide hero is centred in all themes, in left-to-right and right-to-left.

### 8. `--color-primary` is not a safe link colour in every theme

**Where:** the themes' global link and `--color-primary` use.

**Problem.** Several themes choose `--color-primary` as a fill (`bumblebee` yellow, `acid` pink), with no regard for contrast of text
in that colour on the page background. Consumers set `a { color: var(--color-primary) }` (the Lily examples do), and links become
hard to read in those themes. The 0.7.0 `light.css` starts to address it for some link classes, with
`color-mix(in oklab, var(--color-primary) 55%, var(--color-base-content))`, which a comment says was needed because a dark theme
measured 3.39:1.

**Proposal.** Define `--lily-link` in every theme as a colour with at least 4.5:1 against `--lily-surface` and
`--lily-surface-alt`, and use it for every link class. Document it as the colour for links in consumers' own CSS. Add a check to the
themes' build that fails below 4.5:1.

**Acceptance.** The check passes for every theme; a consumer's `a { color: var(--lily-link) }` is readable in all of them.

### 9. `themes` 0.7.0 makes a page 47 px wider than a 320 px screen

**Where:** `@lilydesignsystem/themes` 0.7.0 (0.6.2 is fine); found by the viewer's end-to-end test of `?lang=zh-CN`.

**Problem.** With 0.7.0, a 320 px viewport scrolls 47 px sideways: a grid with one `1fr` column grew to the widest section's
minimum content width (351 px against 288 px available). With 0.6.2 and everything else the same (svelte-headless 0.12.0,
svelte-picker-bar 0.8.0) the page fits. The rule responsible was not found; the `light.css` diff has no obvious candidate, so it
may be one that raises the intrinsic width of a record list or a `details`. The consumer worked around it with
`grid-template-columns: minmax(0, 1fr)`.

**Proposal.** Find the rule by bisecting the diff of `light.css` against the viewer at 320 px. Add a 320 px page to the themes'
tests: a record list, a table, a `details` and a long unbroken word, in every theme, asserting no horizontal scroll.

**Acceptance.** The test fails on 0.7.0 and passes on the fix.

### 10. `themes` and `svelte-picker-bar` ship no changelog

**Where:** both packages (svelte-headless has one).

**Problem.** Finding the cause of item 9 meant diffing 4,000 lines of CSS. A changelog that names the components whose rules
changed would have narrowed it to minutes. The picker bar's 0.7.0 and 0.8.0 are impossible to tell apart from the outside.

**Proposal.** Add a `CHANGELOG.md` to each, in the same shape as svelte-headless's, listing the components and tokens each release
touches, with a "breaking" marker.

**Acceptance.** Every published version of both packages has an entry.

### 11. Release cadence and the minimum release age

**Where:** svelte-headless 0.9.0 to 0.12.0: 2026-11-14, 11-16, 11-18 and 11-21, two of them breaking.

**Problem.** The consumers refuse any package version younger than two days, as a supply-chain rule, and exempt only an exact version
a person names. With a release every two or three days, a consumer is always one to three releases behind, and each upgrade to the
newest needs a person to name versions. A breaking release (0.10.0 removed thirteen pickers; 0.11.0 moved 164 components to
another package) is only absorbed after two days.

**Proposal.** Prefer fewer, larger releases; group breaking changes into one; publish a `latest` that is at least two days old and
use a separate dist-tag (`next`) for the newest, so a consumer that follows `latest` is current without exemptions.

**Acceptance.** `npm view @lilydesignsystem/svelte-headless dist-tags` shows `latest` at least two days behind `next`.

## Decisions

Open. The IPS section issues (1 and 2) should be decided together, since the second is only worth doing if the first is.

## Implementation status

None of the eleven is started. The consumers' workarounds are in place: the viewer does not use the two IPS components; it
computes the meter scale itself (`meterOf` in `src/lib/fhir/models.ts`), opens `<details>` for print in `Viewer.svelte`, and uses a
`minmax(0, 1fr)` column in `static/assets/style.css`; the website sets `color: inherit` on the hero's links and
`margin-inline: auto` on its intro (`static/assets/style.css`).
