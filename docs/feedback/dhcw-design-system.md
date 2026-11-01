# Feedback for the DHCW Design System team

From the Lily Design System™ maintainers, 2026-10-29, on the private beta announced 23 October 2026.

## Why we are writing

Thank you for publishing the DHCW Design System openly. We maintain [Lily](https://lilydesignsystem.com/), a free,
open-source, headless design system with 582 components, eight framework libraries, 63 themes and two Wales themes that
track your colours. We compared the two in detail: [Lily Design System and DHCW Design System](https://lilydesignsystem.com/compare/lily-design-system-and-dhcw-design-system/).

Both systems are accessible, public-sector-minded and ship Nunjucks macros, so a service team should be able to use pieces
of each without rewriting. Today it cannot, because a few conventions differ for no strong reason. This note asks you to
align on some of them. Where your choice is better than ours, say so and we will move: we implemented eight changes in
Lily from your site in the last week, including your link colours, a Focus Not Obscured contract for fixed bars, an
overflow navigation mode, a patient banner composition and a 30 percent text-expansion test. All eight now pass their
checks, including a Nunjucks Eleventy example that runs the responsive and focus tests.

Limits of this review: we read your public pages only (home, principles, styles, page templates, the accessibility
statement and about ten component pages). We found no source repository or npm package to read, so anything below about
your macros comes from the examples on your site. Correct us where we have it wrong.

## Where Nunjucks is incompatible today

| Area                  | DHCW                                                                        | Lily                                                                  | What we ask                                                                                                      |
| --------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Macro names           | `nhswTag`, `nhswHeader`, `nhswDateInput`                                    | `tag`, `header`, `dateInput` (camelCase of the component name)        | Drop the `nhsw` prefix on macros, or export both names. Nunjucks `import ... as` already lets adopters namespace |
| Import path           | `{% from "tag/macro.njk" import nhswTag %}`                                 | `{% from "components/tag/macro.njk" import tag %}`                    | Publish under `components/{name}/macro.njk`, the layout NHS.UK frontend and Lily both use                        |
| CSS classes           | `nhsw-` prefix and BEM (`nhsw-site-header__top`, `nhsw-tag--red`)           | kebab-case, no brand prefix (`header`, `tag`, `tag-red`)              | See "Class names" below                                                                                          |
| Params                | `text`, `classes` (same as Lily), plus nested objects                       | `text`, `html`, `label`, `classes`, `attributes`, flat                | Keep the shared keys; see "Param shapes"                                                                         |
| Tag element           | `<strong class="nhsw-tag">`                                                 | `<span class="tag">` (since 2026-10-11)                               | Use `<span>`: `<strong>` adds emphasis that a screen reader may announce                                         |
| Date input            | Three text fields (day, month, year), `namePrefix`, `errorFields`, `values` | One `<input type="date">`; a separate `date-field` for day/month/year | Keep yours, it is the right pattern for known dates. We would adopt the macro shape if it were published         |
| Fieldset              | `<fieldset role="group">` with `aria-describedby`                           | `<fieldset>` with no role                                             | Drop `role="group"`: it is the implicit role, and the explicit one adds nothing                                  |
| Visually hidden class | `nhsw-visually-hidden`                                                      | `visually-hidden`                                                     | Follow the class-name decision below                                                                             |

## What we would like you to change, in order

1. **Publish the Nunjucks macros as a package.** Name the npm package, give it a version and a repository, and state the
   licence in the package. Today the site's terms of use say the code is MIT, but nothing a package manager can read says
   so. A team that cannot install from npm cannot track you.
2. **Un-prefix the macro names, or export both.** `{% from "components/tag/macro.njk" import tag %}` should work in a
   project that also uses Lily or NHS.UK frontend. With `nhsw`-prefixed names the two sets of macros coexist, but a
   template written against one cannot be switched to the other by changing the import line.
3. **Class names.** We understand `nhsw-` guards against collisions with NHS.UK frontend (`nhsuk-`) on shared pages, and
   that is a fair reason. Our request is narrower: let the prefix be a Sass or macro option (`prefix: ""` by default
   for new projects) rather than baked into every selector. Lily's headless libraries put the kebab-case component name first on every
   root (`class="tag tag-red"`) so one selector targets any framework's output. If you also adopted flat modifiers (`tag-red`
   rather than `nhsw-tag--red`), a theme written for one would style the other with a short alias sheet.
4. **Flat params first.** `fieldset: { legend: { text, classes } }` and `errorMessage: { text }` follow the GOV.UK and NHS.UK
   macros, which is a good reason to keep them. For components where Lily and you overlap (tag, summary list, warning
   callout, header, button), please keep `text`, `html`, `classes` and `attributes` as the top-level keys and
   say in each component page which params you accept, in a table. We would then document the mapping both ways.
5. **Test against Eleventy's bundled Nunjucks.** Eleventy 3 renders with its own fork, `@11ty/nunjucks`. We found that an
   environment built from plain `nunjucks` while Eleventy renders turns every macro's output into escaped text
   (`&lt;a …`), because the two libraries' safe-string classes do not recognise each other. If you publish macros, please
   say which Nunjucks they are tested against and document the `nunjucks` alias in Eleventy's install instructions.
6. **Escape rules.** State on every macro page which params are escaped (`text`) and which render raw (`html`). Lily's
   Nunjucks macros escape `text` and pass `html` through `| safe`; if yours differ, adopters will get double-escaped or
   unescaped output without warning.
7. **Treat `onsubmit="return false;"` as a demo artefact.** Your header search example has it inline. Adopters copy the markup, so
   please show a real `action` and `method="get"`, and name the field `q` so it works without JavaScript.

## Things your system does that we copied or would like to see more of

- Hidden prefix text in action links ("Change<span class="nhsw-visually-hidden"> name</span>"), which we now document in the summary-card pattern.
- The overflow navigation variant. We built it as a mode of our `navigation-menu`; please publish its script's contract
  (events, `data-` hooks) so the two can match.
- A warning callout with limits on how many to show. Ours now says the same.
- Your accessibility statement names a response time for reports, which we think every system should.

## Gaps worth closing

- **Welsh.** Your fourth principle is "Design services in Welsh and English", but the typography, header and date input
  pages say nothing about text expansion or `lang="cy"`. We test our themes at 320px with text 30 percent longer than
  English and a Welsh language attribute; we would gladly share the test.
- **WCAG 2.2 AA vs AAA.** You target AA. Lily targets AAA where it can. Your colours page lists `$nhswales-primary-button`
  twice with different values, and says "1.4.3 (Contrast Enhanced)" where 1.4.3 is Minimum and Enhanced is 1.4.6; a
  corrected colours page would help everyone who copies it.
- **Worldwide.** Lily's target is every country, region and federation, not one nation's conventions, so we are glad to share
  the Welsh-language and text-expansion work in a form other regions can reuse; a DHCW component that assumes a UK shape
  (postal code, phone, NHS number) is worth marking as regional in its page.
- **Catalog.** Lily has components DHCW lacks (a data table, calendar, Gantt chart, chat input, 164 national identifier
  inputs). Linking to Lily from your site where a team needs one would save them a search, and we link to yours from ours.

## Licensing

Your content is published under the [United Kingdom (UK) Open Government License (OGL) version 3 for Public Sector Information](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/),
and your code under MIT. Lily is released under a choice of MIT, Apache-2.0, GPL-2.0-only, GPL-3.0-only or BSD-3-Clause, so
MIT-licensed code can be exchanged both ways without conflict. If we copy your wording we will attribute it as the OGL
requires.

## How to reach us

Open an issue or a pull request at <https://github.com/lilydesignsystem/lily-design-system>, or write to
<joel@joelparkerhenderson.com>. We would rather match you than diverge: a Welsh service team should not have to choose
between two incompatible sets of macros.

---

Lily™ and Lily Design System™ are trademarks.
