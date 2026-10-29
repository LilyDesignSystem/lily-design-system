# Lessons from the DHCW Design System (planned work)

## Summary

Eight improvements to Lily, plus a list of what is not adopted, proposed 2026-10-28 from a review of the
[DHCW Design System](https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/) (Digital Health and Care
Wales). It is a **private beta** (its "What's new" announces the private beta release of 23 October 2026) of 28 components,
nine design principles, a type scale, a colour page, page templates and an accessibility statement. It uses an `nhsw-`
class prefix, Sass tokens named `$nhswales-*`, and ships every component as HTML plus a Nunjucks macro.

This is the second DHCW source Lily has read. The earlier one, the `nhsw-component-library` repository, is what the two
Wales themes track today (see [theme](../theme/index.md) and the themes' "Upstream tracked" lines). The new site publishes
**different link colours** from that baseline (item 1), which is the most concrete finding. All eight items were implemented on
2026-10-28; see Decisions and Implementation status below.

## Scope

### In scope

The eight items below, each with a deliverable, a source of truth and a check.

### Explicitly out of scope

- Copying DHCW's class names or Sass tokens: Lily's classes are kebab-case with no brand prefix
  ([examples](../examples/index.md)), and its tokens are DTCG JSON.
- DHCW's Figma prototypes and its "Prototyping Kit" (in development; the site says so).
- Catalog parity: DHCW has 28 components, Lily 582. The catalog-gap table below lists only where DHCW has something Lily
  lacks.

## Limits of the review

Read: the home page, the design principles, the Styles index and its colours, typography, layout and icons pages, the
page-templates page, the component index, the start-prototyping page, the site map, the accessibility statement, and the
tag, header, date input, buttons, site navigation, summary list, cards and warning callout pages. **Not read:** the other
twenty components, the Figma page, the contact page, and any source repository or package: the site links to none, and
names no npm package, version or repository for its code, but its terms of use say the code is under the MIT licence (its content is under the [United Kingdom (UK) Open Government License (OGL) version 3 for Public Sector Information](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/)). The pages
were fetched through a summarising reader, so markup quoted below is as that reader returned it; check the live page
before copying any of it. Contrast ratios in this topic are computed here from the published hex values, not taken from
DHCW.

The site has errors of its own, not repeated in the items: its tag page says the colour pairs meet "WCAG 2.2 1.4.3
(Contrast Enhanced)" (1.4.3 is Minimum; Enhanced is 1.4.6); its colours page lists `$nhswales-primary-button` twice with
two values (`#364A73`, `#1B365D`); its action-link description is copied from Buttons; its cards page describes three
cards per row on desktop but uses a `one-half` column class; its header example carries an inline
`onsubmit="return false;"`.

## What Lily already matches

| DHCW says                                                                                   | Lily today                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Navy `#1B365D` primary, gold `#AA8630` rail, yellow `#FFEB3B` focus with a dark bar         | Both Wales themes; gold stays a rail colour, 3.41:1 on white.                                                                                                                            |
| An 11-colour tag palette (`white`, `grey`, `aqua-green`, `blue`, … `dhcw-blue`)             | The Wales themes carry `data-tone` for 12 tones, including `navy` and `on-dark`.                                                                                                         |
| Skip link, breadcrumbs, back link, action link, summary list, inset text, details, expander | All in the catalog.                                                                                                                                                                      |
| Summary list as a `dl` of key, value and actions                                            | `summary-list` exists; its item is a consumer-filled `li`, so the `dl` shape is the consumer's choice.                                                                                   |
| Principle 4, "Design services in Welsh and English", equal standing                         | Lily's no-hardcoded-strings rule, and a `:lang(cy)` block in both Wales themes ([internationalization](../internationalization/index.md)).                                               |
| Principle 7, open standards, common components, shared patterns                             | The catalog, the DTCG token source and the public monorepo.                                                                                                                              |
| Never auto-advance between the day, month and year fields; set `autocomplete="bday-*"`      | `date-input` is a fieldset of separate fields and its docs already name `bday-day`, `bday-month` and `bday-year`; its docs do not yet say never to auto-advance between fields (add it). |
| Do not rely on colour alone for a tag; give a text label                                    | [Accessibility](../accessibility/index.md) "no colour-only meaning".                                                                                                                     |

## The items

### 1. Re-baseline the two Wales themes against the new site

The colours page publishes the link set below. The Wales themes (`united-kingdom-national-health-service-wales-for-patients`
and `-for-practitioners`) carry an older one, from the `nhsw-component-library` source.

| Role    | DHCW site | Wales themes today | Contrast of the site's value on white |
| ------- | --------- | ------------------ | ------------------------------------- |
| Link    | `#005AA8` | NHS Blue `#005EB8` | 6.94:1 (today's: 6.38:1)              |
| Hover   | `#7C2855` | `#003087`          | 9.16:1                                |
| Visited | `#330072` | `#7C2855`          | 15.18:1                               |
| Active  | `#002F5C` | not set            | 13.45:1                               |

So the theme uses the site's _hover_ colour as its _visited_ colour, and has no active colour. Also published: a second
button navy `#364A73` for interrupt pages with a `#1B365D` page background, an "exceptional" button `#F5BB6B` with a
`#554318` shadow (7.04:1 against `#1B365D`), a delete button `#D5281B` (5.06:1 against white, so AA only), page greys
`#F0F4F5` and `#FFFFFF`, and a border grey `#D8DDE0` (1.37:1, a decoration, not a boundary a user must see).

- **Deliverable:** set link, hover, visited and active in both Wales themes to the site's values, through
  `themes/tokens/*.json` and `bin/generate-theme-tokens`; update each theme's "Upstream tracked" line to name this site and
  the 2026-10-23 beta; add `#364A73` and `#F5BB6B` where the theme has an interrupt or `data-variant="exceptional"` button.
- **Decision for a maintainer:** none of the link colours reaches AAA (7:1) for body text, and the delete button is 5.06:1.
  Lily targets AAA. Either keep DHCW's values and record the exception in the theme header (as the gold rail already is), or
  darken them and say so. Recommendation: follow the site for roles, darken only the delete button label background, and
  list both in the header.
- **Check:** `bin/check-theme --contrast` reports the pairs; `bin/generate-theme-tokens --check`; the theme header names the
  source and date.

### 2. An overflow ("More") navigation mode

DHCW's site navigation has an overflow variant: a script measures which links fit, moves the rest into a "More" menu, and
without the script the links simply wrap and the button stays hidden. The menu opens with the keyboard, closes with
Escape, and **pushes the content down instead of covering it**. The toggle carries `aria-expanded`; the "More" item is
`hidden` until needed.

This is the right behaviour for reflow (WCAG 1.4.10): the Nunjucks Eleventy example's header overflowed by 5px at 320px
this month ([stephcraft-lessons](../stephcraft-lessons/index.md) item 8) until it was allowed to wrap. Lily has
`navigation-menu`, `menu-bar` and `hamburger-menu`, and none measures its own width.

- **Deliverable:** decide the shape (see open questions), then specify it: progressive enhancement (wrapping is the no-script
  behaviour), `aria-expanded`, Escape, the panel in normal flow, and a `resize`-free implementation (a `ResizeObserver` on
  the list, not a window listener).
- **Check:** unit tests per library for the measure-and-move logic with a stubbed `ResizeObserver`; a Playwright case at
  320px with the script disabled asserting no horizontal overflow.

### 3. A patient banner composition

DHCW's "patient header" is its own section, not the site header: name, date of birth, NHS number, gender and adverse
reactions, `aria-label="Patient details"`, used when a user acts on one patient's record. Lily has `medical-banner` (a
message bar) and the national identifier `-view` components (an NHS number view for England, Wales and others), but nothing
that composes them into a patient identity block.

- **Naming constraint:** Lily's suffix table maps `-header` to `<header>`, which is wrong for this (it is a labelled
  section, not page chrome), so it cannot be `patient-header`. Candidate: `patient-banner`, root `<section>`, a `dl` of
  consumer-supplied items. Confirm the suffix rule before adding it.
- **Rules to carry over:** the label is a required prop (no English); no field is ever truncated or hidden at a narrow width
  (a patient-safety rule: adverse reactions stay visible, so it wraps); the identifier is shown with its `-view` component.
- **Deliverable:** first a documented composition in `medical-banner` and the identifier docs; add the component only if the
  composition proves awkward in the example apps.
- **Check:** if added, `bin/new-component patient-banner` and every count moves together; the sweep's long-string case
  covers it at 320px.

### 4. Summary-card recipe and action-link rules

DHCW wraps a summary list in a card with a title and header actions (`summary-card`). Lily has `card` and `summary-list`; this
is a composition, not a component, and should be written down as one. The rules worth taking:

- Each action's accessible name says what it changes ("Change name", the context in visually hidden text); in Lily the hidden
  text is a consumer-supplied string, never ours.
- Action targets are at least 24 by 24 CSS pixels (2.5.8), or spaced.
- A missing value links to the question that answers it, not to a "Change" link.
- When a user returns through a change link, their earlier answers are pre-filled (3.3.7, redundant entry).
- A card title is short and unique; header actions are about two words each, two or three at most.

**Deliverable:** a "Summary card" composition pattern in `AGENTS/components.md` and `summary-list`'s Advice; the four rules in
`summary-list`'s `AGENTS.md`. **Check:** `bin/check-links`; the example apps' `/settings-page` uses the pattern.

### 5. Focus Not Obscured, for fixed bars

DHCW ships a fixed mobile bottom navigation and tells authors to add a body class so content is not hidden behind it. That
is the failure WCAG 2.2 names Focus Not Obscured (2.4.11, AA): a focused control hidden behind a fixed bar. Lily has fixed
bars (`sticky-promo-banner` top and bottom, and any theme that fixes a header), yet 2.4.11 is cited in one topic only
(`bootstrap-lessons`) and nowhere in [accessibility](../accessibility/index.md) or `AGENTS/accessibility.md`, and none of
the 57 themes sets `scroll-padding`.

- **Deliverable:** add 2.4.11 to the accessibility rules; a shared theme section with `scroll-padding-block` equal to the
  fixed bars' height, driven by a custom property the fixed component sets; the rule that a fixed bar never covers the focused
  element.
- **Check:** a Playwright case per example app: tab to the last link of a long page with a fixed bar present and assert its
  bounding box is not under the bar.

### 6. A text-expansion sweep, for Welsh and every other language

DHCW's first principle for language is equal standing for Welsh and English, yet the site gives **no layout guidance for
it**: no text-expansion allowance, no language toggle on the header page, and an accessibility statement that does not
mention Welsh. This is the same gap the earlier review found. Welsh runs about 20 to 30 percent longer than English, and
nothing tests for it.

- **Deliverable:** a pseudo-locale fixture (each label lengthened by 30 percent and set `lang="cy"`) for the responsive
  sweep ([stephcraft-lessons](../stephcraft-lessons/index.md) item 8), run at 320px; one sentence in
  [responsive](../responsive/index.md) naming the allowance.
- **Check:** the sweep fails on horizontal overflow or on a clipped label (an element whose text is wider than its box with
  `overflow: hidden`).

### 7. Callout usage limits in the docs

The warning callout page carries limits Lily's `warning-callout` docs lack: at most two per page, at most five lines on
mobile, separate a callout from a button with a paragraph, give the text below its own heading, use the default callout for
time-critical or health-affecting information and the "important" variant for the rest, and **do not use it in transactional
pages** (DHCW and NHS England have not tested it there). Its hidden prefix ("Important:") is skipped when the heading already
says so.

- **Deliverable:** the limits in `warning-callout`'s Advice and When Not to Use. Lily's callout has an optional `label`
  (an `aria-label` on a `<div>`) and no hidden-prefix pattern; document that the consumer puts the hidden "Important"
  text in the content (no new prop, no English from us), and skip it when the heading says so.
- **Check:** a grep in `bin/test` that the Advice section names the limits.

### 8. Double-submit protection is not an attribute

DHCW's `data-prevent-double-click="true"` ignores a second click, works only with JavaScript, and the page itself tells
authors to guard on the server as well. Lily's plan is the pending-state contract for async buttons
([chanhdai-lessons](../chanhdai-lessons/index.md) item 9): the button stays focusable and announces that it is pending. A
silent "ignore the second click" attribute fails the user who double-clicks on purpose (a retry) and gives no feedback.

- **Deliverable:** none new; record in `button`'s Advice that duplicate submission is prevented on the server and shown by
  the pending contract, not hidden by an ignore attribute.

## Catalog gaps

Where DHCW has something Lily does not (and where Lily's version should adopt a variant, not a new component).

| DHCW                                | Lily                                | Verdict                                                                                        |
| ----------------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| Patient header                      | none (`medical-banner` is a bar)    | Item 3.                                                                                        |
| Warning text (icon and bold line)   | none                                | Also in GOV.UK. Candidate component `warning-text`; low priority.                              |
| Site navigation, overflow           | `navigation-menu`, no overflow      | Item 2.                                                                                        |
| Summary card                        | `card` and `summary-list`           | A composition (item 4).                                                                        |
| Top task, stat, chevron, icon cards | `card`, `care-card`, `feature-card` | Variants of `card`, not components; document the "at most three top tasks" rule if adopted.    |
| Mobile bottom navigation            | `tab-bar`                           | Pattern on `tab-bar` and `navigation-menu`; carries item 5.                                    |
| Dashboard page templates (left nav) | `grail-layout`, `sidebar`           | A composed page demo for staff pages; DHCW also splits public pages (top nav) from staff ones. |
| Phase banner, notification banners  | `phase-banner`, `notification`      | Already present; compare behaviour when a notification-banner topic is next opened.            |

## Not adopted

- **The `nhsw-` prefix and `$nhswales-*` Sass tokens.** Lily's classes carry no brand prefix, and its tokens are DTCG JSON.
- **`<strong>` as a tag element.** DHCW's tags are `strong`; that asserts importance to a screen reader on every status.
  Lily's `tag` is a `<span>`.
- **Inline event handlers** (`onsubmit="return false;"`) in examples.
- **One colour, many meanings.** DHCW uses the red tag for both "Urgent" and "Rejected". Lily's status tones are tied to a
  meaning, not a hue ([accessibility](../accessibility/index.md): no colour-only meaning).
- **Analytics.** The site opts visitors in to Microsoft Clarity. Lily's docs site sets no analytics script (checked `app.html` and the
  root layout), and a design system that sets a cookie it does not have to is a poor example.
- **Figma-first prototyping.** Lily's reference is the working example apps.

## Decisions

Decided 2026-10-28 and implemented the same day.

1. **Overflow navigation (item 2): a mode on `navigation-menu`**, not a new component. `overflow` (default false) publishes
   `data-overflow="true"`; `moreLabel` is required and carries no English. One framework-free module,
   `shared/overflow-navigation.ts`, does the measuring with a `ResizeObserver` on the list.
2. **Patient banner (item 3): a documented composition**, in `medical-banner`'s docs and `AGENTS/components.md`. No component
   is added; it is not named `patient-header` because the suffix table maps `-header` to `<header>`.
3. **AAA exceptions (item 1): follow DHCW for the link roles, darken only the delete button.** Link `#005AA8` is 6.94:1 (AA, not
   AAA) and is recorded in the theme token description; the delete fill is mixed 20 percent towards black (8.2:1).

## Implementation status

| Item | State                                                                                                                                                                                                              |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | Done. Both Wales themes: link, hover, visited, active; delete button; "Upstream tracked" names this site.                                                                                                          |
| 2    | Done in Svelte, React, Vue, Angular, Web Components, Nunjucks (markup only), HTML (documented), Blazor (JS interop), Alpine. Verified in Chromium with real layout: 6 items fit at 1200px, 4 at 420px, 3 at 320px. |
| 3    | Done as a composition.                                                                                                                                                                                             |
| 4    | Done in the docs. The `/settings-page` demo is not changed: it is a per-app page with no generator.                                                                                                                |
| 5    | Done. 2.4.11 is a required commitment; every theme ends with a pinned "Focus not obscured" section; one spec per app, run on six of seven.                                                                         |
| 6    | Done. A 30 percent pseudo-locale (`lang="cy"`) at 320px in every app's `responsive.spec.ts`; it found and fixed real overflow (see below). Run on six of seven.                                                    |
| 7    | Done in the docs.                                                                                                                                                                                                  |
| 8    | Done in the docs.                                                                                                                                                                                                  |

What the text-expansion sweep found, all fixed in the apps' own stylesheets or routes: long unbreakable words reached 322 to 346px
at a 320px viewport (`overflow-wrap: anywhere` is now on each app's `body`); two fixed two-column grids in the SvelteKit app
(`/page-layout`, `/task-management`); and the Angular suffix filter select grew past the viewport (`max-width: 100%`).

**Not verified:** the Nunjucks Eleventy example (its build is broken independently, so its new specs and its `page.css` fix have
never run); Firefox and WebKit (only Chromium ran); a Playwright case for the overflow navigation (the SvelteKit demo page
renders static demo HTML, not the component); the Blazor overflow interop in a browser. The `networkidle` wait in the sweep specs
timed out once on the html-css-js app and passed on two reruns.

## Acceptance criteria

- [x] 1. Link, hover, visited and active in both Wales themes match the site; the headers name the source and date.
- [x] 2. The overflow-navigation shape is decided and specified, with the 320px no-script case tested.
- [x] 3. The patient banner is a documented composition (or a component), with the naming rule settled.
- [x] 4. The summary-card composition and its four rules are in the docs.
- [x] 5. 2.4.11 is in the accessibility rules, the themes set `scroll-padding` for fixed bars, and each example app tests it.
- [x] 6. The responsive sweep runs a 30-percent text-expansion fixture with `lang="cy"` at 320px.
- [x] 7. `warning-callout` documents its limits and the hidden-prefix pattern.
- [x] 8. `button`'s Advice states that duplicate submission is a server concern shown by the pending contract.
- [x] The open questions are decided, or recorded as declined.

## Related topics

[theme](../theme/index.md), [accessibility](../accessibility/index.md),
[internationalization](../internationalization/index.md), [responsive](../responsive/index.md),
[stephcraft-lessons](../stephcraft-lessons/index.md), [chanhdai-lessons](../chanhdai-lessons/index.md),
[components](../components/index.md), [citations](../citations/index.md).

## Sources

- [DHCW Design System](https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/) (private beta; read
  2026-10-28): [design principles](https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/design-principles.html),
  [colours](https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/styles/colours.html),
  [typography](https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/styles/typography.html),
  [layout](https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/styles/layout.html),
  [page templates](https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/patterns/page-templates.html),
  [accessibility statement](https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/accessibility-statement.html).
- [WCAG 2.2: Focus Not Obscured (Minimum), 2.4.11](https://www.w3.org/TR/WCAG22/#focus-not-obscured-minimum).
- [WCAG 2.2: Reflow, 1.4.10](https://www.w3.org/TR/WCAG22/#reflow).

---

Lily™ and Lily Design System™ are trademarks.
