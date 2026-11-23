# Lessons from Smashing Magazine's "Design Systems" (planned work)

## Summary

A review on 2026-11-23 of _Design Systems: A practical guide to creating design languages for digital products_ by Alla
Kholmatova (Smashing Media, 2017; reviewed by Karen McGrane and Jeremy Keith). The book is about how teams make a design
system work, not about code. It draws on FutureLearn, Airbnb, Atlassian, Eurostar, Sipgate and TED. It defines a design system
as **patterns and shared practices** organised around a product's purpose. Patterns are **functional** (modules, the
"nouns and verbs") or **perceptual** (styles, the "adjectives"). It holds that **a pattern library is a tool, not the system**,
and describes three dials that shape any system: **strict or loose**, **modular or integrated**, **centralised or
distributed**.

Lily already does much of what the book recommends, and in places goes further. Its names follow its markup, its docs say
when to use a component and when not to, it records maturity and replacements, its examples are living code, its specification
and checks keep design, code and docs as one system, and `call-to-action` already makes Heydon Pickering's split between a
call to action and its element (`<a>` with `href`, else `<button>`). The book points at six gaps:

- A catalog description says **what a component is, not what it is for** ("a generic clickable button element").
- Components that compete for attention have **no documented prominence ("loudness") scale**: Lily has at least eleven notice
  components and four action components.
- The catalog is **grouped by type, and one group is too big to browse**: "content" holds 169 of the 473 core components.
- Lily has **no glossary** of its own terms.
- The **principles are not ranked** and give no worked example.
- There is **no written criterion for adding a component** beyond "open an issue first".

The book's process for systemising styles (purpose, inventory, patterns, principles) also suggests a states grid and a
timing scale for the themes. Adopters need a guide to building their own system on Lily, because Lily is a pattern library,
and each adopter's system is their own. Nothing here is built yet; tasks are in
[tasks.md](../../../tasks.md#phase-46--lessons-from-smashing-magazines-design-systems-2026-11-23).

## Scope

### In scope

- The book's ten chapters: what a design system is, design principles, functional patterns, perceptual patterns, shared
  language, the three parameters, planning, the two systemising exercises, and pattern libraries.
- What each idea means for a public, headless, multi-framework catalog with one maintainer, and for the teams who adopt it.

### Explicitly out of scope

- Team rituals that fit a company and not an open-source project with one maintainer: pattern walls, Slack bots, weekly
  catch-ups, "component of the day" printouts by the kitchen sink.
- Sketch, Craft, Abstract, Brand.ai and other 2017 design-file tools. Lily ships no design files (see item 12).
- Brand work: mood boards, style tiles, element collages and design personas belong to an adopter's identity, not to Lily
  ([visual-identity](../../visual-identity/index.md)).

## Principles and rules

- **A component has a purpose, written as what it is for.** Use FutureLearn's three questions: what is it, what is it for, and
  how does it do that. Sipgate's example shows the difference. "Use Showcase to present multiple types of information with a
  media file" is factually correct and useless. "Fact Grid is a shortlist of facts. Use it to give the reader an immediate
  impression of the content that follows" says what it is for.
- **Components that compete for attention sit on a scale.** Tom Osborne's "visual loudness" idea: actions and notices are a
  suite, each at a known volume. A new one needs a volume that is not already taken. Ask the book's question: if the page
  were read aloud, which part would be louder? The answer is also the screen reader's experience.
- **Group by purpose as well as by type.** People cannot reuse a component they cannot find. The book calls findability the
  greatest barrier to adoption: a team that cannot find a pattern builds another one.
- **If you cannot name it, its purpose is unclear.** Eurostar's "le blurb", an SEO module with no function, is the warning.
  A name that is hard to find is a red flag about the component, not about naming.
- **A presentational name limits its future.** "A pink button can only be pink." Lily's names come from structure and role,
  which also keeps them predictable across nine catalogs.
- **Specificity is a choice, tested by change.** Should these be one component or two? Ask: if I change this one, do I want the
  others to change in the same way? If yes, make one pattern, perhaps with variants. If no, make two.
- **Shared use, not shared values.** A palette or type scale alone does not make a product consistent. Twenty blues are fine if
  blue always means "you can act on this". A blue heading that cannot be clicked is not fine.
- **Principles are actionable, ranked and few.** Three to five. Each phrased so it can be checked ("No needless parts", not
  "Make it simple"), paired with a real example, and ranked so a conflict has an answer (Salesforce: clarity, efficiency,
  consistency, beauty, in that order).
- **A strict system needs room outside it.** Strict systems give predictability. They fail when people do not understand the
  rules or cannot step outside them. Lily is strict on purpose (contracts, checks, allow-lists that may only shrink), so its
  room outside must be documented, not discovered.
- **Patterns should make life better.** In his 1996 OOPSLA keynote, which the book's conclusion quotes, Alexander asks
  whether a pattern improves human life. A component that can be used against its user should say so.

## Findings, by chapter

| Chapter                   | The book's idea                                                                                                                                                                | Lily today                                                                                                                                                                                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Design systems         | Patterns plus shared practices; a pattern library is a glossary for the shared language, not the system; a living library holds the real code                                  | Living examples in nine apps, generated from one demo map; the spec, `AGENTS` files and `bin/` checks are the "practices". Lily is a pattern library; each adopter's product is the system                                                            |
| 2. Design principles      | Authentic, actionable, with a point of view, memorable; three to five; ranked (Salesforce); paired with a real example; tested in critiques                                    | Seven overview principles ([overview](../../overview/index.md)), unranked, without examples; some ranking is implicit ("the spec is the authority", "Svelte wins", native platform before script)                                                     |
| 3. Functional patterns    | Purpose first; pattern map by user journey; interface inventory, done regularly; name by action; draw content structure; place on a scale; content as a hypothesis             | Props list each slot, required or optional; text-expansion and long-title rules ([responsive](../../responsive/index.md)); `bin/check-*` inventory structure automatically; no purpose line, no loudness scale, no regular purpose-directed inventory |
| 4. Perceptual patterns    | Styles at the core, not a skin; signature patterns; balance consistency against brand; small-scale experiments                                                                 | Headless by design: perceptual patterns are the themes' and the adopter's; 65 themes and brand overlays ([visual-identity](../../visual-identity/index.md))                                                                                           |
| 5. Shared language        | Names by purpose; metaphor and personality aid memory; name collaboratively; test with users; glossary; induction                                                              | Names derived from the suffix table ([components](../../components/index.md)); spec conventions list five terms; no glossary; contributor onboarding is "informal" (roadmap)                                                                          |
| 6. Parameters             | Strict or loose, modular or integrated, centralised or distributed; Conway's law; curator or producer; "the right system is the one whose downsides you can manage"            | Strict, modular, centralised, one maintainer acting as producer ([GOVERNANCE](../../../GOVERNANCE.md)); extension through class hooks, rest props, component-scoped variables, recipes                                                                |
| 7. Planning               | Business case in time saved; public progress; screenshots first, living code later; goals for the interface and for practice                                                   | Public from the start; CHANGELOG, history, NEWS, a public tasks list; adopter evidence in `docs/adopters.md`                                                                                                                                          |
| 8. Systemising functional | Purpose-directed inventory; specificity scale; content structure; variants; buttons vs links vs CTAs; one primary per screen; special cases kept rare                          | `call-to-action` renders `<a>` or `<button>` by `href`; the themes say one `primary` action per view; record-list families chose the specific end of the scale on purpose                                                                             |
| 9. Systemising perceptual | Colour by role, not value; base plus increments (type, space, timing); contrast first; interactive states; animation by purpose and feel; voice and tone                       | Colour pairs and a contrast gate; fluid spacing tokens; motion recipes ([docs/patterns/motion](../../../docs/patterns/motion/index.md)); no timing tokens, no states grid, no writing guide for the label packs                                       |
| 10. Pattern libraries     | Organise by how users think (Polaris card sort, FutureLearn by purpose); document name, purpose, example, variants; related, versioning; criteria and process for new patterns | Per-component docs in a fixed order; "When Not to Use" names alternatives; maturity, `deprecated` and `discouraged` with replacements; categories by type; the new-component path is mechanical, not a criterion                                      |
| Conclusion                | Alexander's moral test: do these patterns make life better? Dark patterns, exclusion, regret                                                                                   | Accessibility, worldwide equity and "never colour alone" are the moral core already; misuse of persuasive components is not written down                                                                                                              |

### A short purpose-directed inventory: notices and actions

The inventory the book describes (chapter 8), run on two Lily families from `components.tsv` and each component's `AGENTS.md`.
They are grouped by what they are for, not by their names:

| Purpose                                  | Components                                                           | What the catalog says today                                                             |
| ---------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Interrupt: the whole service is affected | `super-banner`                                                       | "communicates a high-priority state that affects an entire app" (and is `assertive`)    |
| Tell everyone something site-wide        | `announcement-banner`, `banner`, `phase-banner`, `government-banner` | four descriptions, all "a banner…", none ranking itself against the others              |
| Promote                                  | `sticky-promo-banner`, `hero`, `call-to-action`                      | "fixed-position promotional", "a large box", "a prominent prompt"                       |
| Respond to what the user just did        | `alert`, `notification`, `toast`                                     | "important information or feedback", "an event or update", "auto-dismissing"            |
| Set something apart in the text          | `warning-text`, `inset-text`, the `medical-banner-box-for-*` family  | each defined alone, with no ranking against the banners                                 |
| Act or navigate                          | a plain `<a>` in text, `action-link`, `button`, `call-to-action`     | `action-link` is "a hyperlink styled as an action trigger", a presentational definition |

None is redundant. Each has a distinct markup or ARIA contract, and the "When Not to Use" sections already point between some
of them. But nothing says which is louder, so an adopter can put a `super-banner`, a `sticky-promo-banner` and a `hero` on one
page and nothing will say they compete. That is the gap item 2 fills.

## Proposals and decisions

| Item                                    | Lily today                                | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. A purpose line for every component   | descriptions say what a component is      | **Adopt.** A `- Purpose:` bullet in each `components/{slug}/AGENTS.md` Metadata: one or two sentences, what it is for and how it does it, in the voice of the "Fact Grid" example. A check in `bin/test` fails on a missing or empty line. Write them family by family, starting with the notices and actions above. `components.tsv` descriptions stay short; rewrite a description only where it is presentational (`action-link`) or circular (`super-banner`).                                                                                                                                                                      |
| 2. Prominence scales                    | none                                      | **Adopt as documentation.** A "Prominence scales" section in [components](../../components/index.md) ranks two families, notices (the inventory above) and actions (a plain `<a>` in text, `action-link`, `button`, `call-to-action`), each with its live-region politeness, its rule ("one `super-banner` at a time", "one primary action per view") and the read-aloud test. Each member's "When to Use" names its place on the scale. No prop, no `data-prominence`: loudness is the consumer's CSS.                                                                                                                                 |
| 3. A purpose facet in the catalog       | categories by type; "content" holds 169   | **Adopt.** A fourth column in `components-categories.tsv`, written by `bin/generate-component-categories` from each `AGENTS.md`: a small fixed set of purposes (ask for a value, show a value, show status, notify, promote, navigate, group and lay out, show data, edit text). The `/components` page and the docs site filter by it. Agree the set by a card sort of the catalog, as Polaris did, not by one person's view.                                                                                                                                                                                                          |
| 4. A glossary                           | five terms in the spec's conventions list | **Adopt.** `spec/glossary/index.md`, linked from `spec/index.md` and `llms.txt`: component, slug, name, catalog, headless, helper, picker, recipe, composition, pattern, theme, token, brand overlay, label pack, class hook, part, contract, maturity. Each term has one sentence, the file that defines it, and the words not to use for it. Intercom's "same language from code to customer".                                                                                                                                                                                                                                        |
| 5. Ranked, actionable principles        | seven unranked principles                 | **Maintainer decision.** Proposed: rank the overview principles for conflicts, and give each a checkable phrasing and one example in the code. A draft order: accessible; worldwide; native platform before script; consumer's words; predictable from the slug; framework parity. The ranking is the maintainer's voice, so it is proposed, not written in.                                                                                                                                                                                                                                                                            |
| 6. Criteria for a new component         | "open an issue first"                     | **Adopt.** A `component-proposal.yml` issue form: the purpose (item 1's form), the user behaviour, the existing components considered and why each falls short, the prominence (item 2), two independent sources (another design system, a standard, or two real uses), the name and why. Add the book's tests to `CONTRIBUTING.md` § Adding a component: the change test for specificity, the naming red flag, and "a one-off belongs in the adopter's code".                                                                                                                                                                          |
| 7. A states grid per theme              | states shown component by component       | **Adopt.** A docs-site page, `/states`, that renders every interactive class hook in each state the themes style (rest, hover, `:focus-visible`, active, `aria-pressed`, `aria-current`, `aria-expanded`, `aria-invalid` or `:user-invalid`, disabled) in one grid, under the theme picker. Hover and focus parity can be seen at a glance. An e2e test takes it through axe in the light and dark themes.                                                                                                                                                                                                                              |
| 8. A timing scale                       | motion recipes, no timing tokens          | **Adopt in the themes.** `--lily-duration-base` with smaller and larger steps (Sarah Drasner's idea that timing works like a type scale, by distance travelled), and one easing per purpose (state change, emphasis, reveal). Each is set to `0s` under `prefers-reduced-motion: reduce` and `[data-motion="reduce"]`. DTCG `duration` is not in Lily's strict subset, so the tokens live in the theme CSS until it is (see [theme](../../theme/index.md)).                                                                                                                                                                             |
| 9. Colour means action                  | colour pairs and a contrast gate          | **Investigate.** A `bin/check-theme` rule: the action colour (`--color-primary` and `--lily-link-*`) as `color` only on interactive selectors (links, buttons, `[aria-current]`, focus rings). Count the current exceptions in the 65 themes before deciding whether to gate it.                                                                                                                                                                                                                                                                                                                                                        |
| 10. A writing guide for the label packs | 64 packs, 63 unreviewed drafts            | **Adopt.** A voice and tone section in [label-packs](../../label-packs/index.md) for the English pack and its translators: plain words, a button names its verb, never "OK"; an error says what happened and what to do; no humour in errors. Léonie Watson's point: a screen-reader user experiences a product through its writing.                                                                                                                                                                                                                                                                                                    |
| 11. Building your design system on Lily | adopter guides cover themes and migration | **Adopt.** A guide, `docs/building-your-design-system.md`: the book's process mapped to Lily. Purpose and principles are yours. Functional patterns are Lily components plus your compositions (as recipes). Perceptual patterns are a theme plus a brand overlay. Signature patterns are yours to name. Run your inventory against `components.tsv`. Name your own compositions by purpose. Be clear about which of the three dials you are setting. It also says where Lily is strict and where the room outside it is: class hooks, rest props, component-scoped variables, recipes, your own components using the same conventions. |
| 12. Design files in step with code      | none                                      | **Decline.** Lily ships no Figma or Sketch kit. A headless library would ship a styled kit that is wrong for every adopter's identity. A theme's kit belongs to its adopter. The book itself notes that teams with a living library came to need master files less.                                                                                                                                                                                                                                                                                                                                                                     |
| 13. Misuse written down                 | none                                      | **Adopt as a doc rule.** The persuasive components (`sticky-promo-banner`, `call-to-action`, `net-promoter-score-radio-group`, `toast`, `timeout-dialog`, `timer`) say in "When Not to Use" how they can be used against the user: a promo that cannot be dismissed, a false deadline, a confirm-shaming cancel label. Each points to the rule it would break (WCAG 2.2.1, 2.2.4, 3.2.6 where relevant).                                                                                                                                                                                                                                |
| Metaphorical names ("Minion", "Boss")   | —                                         | **Decline.** A memorable in-house name helps one team. Lily serves strangers across nine catalogs, so a name they can derive from the role and the element (the suffix table) beats a name they have to learn. Keep the book's lesson as a rule instead: a name says the purpose, never the look.                                                                                                                                                                                                                                                                                                                                       |
| Atomic design levels                    | —                                         | **Decline.** FutureLearn spent "far too much time" deciding between molecule and organism and merged them. Lily's composition patterns and the parent and part families already show nesting without levels to argue about.                                                                                                                                                                                                                                                                                                                                                                                                             |
| Pattern walls, Slack bots, catch-ups    | —                                         | **Decline.** Company rituals. The open-source equivalents already exist: public tasks, NEWS, the docs site and GitHub Discussions.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Distributed ownership                   | —                                         | **Note, no change.** Eurostar and Sipgate show distributed models stalling without an owner, and Lily's single producer is a deliberate choice ([GOVERNANCE](../../../GOVERNANCE.md)). The book's risk for this model is the bottleneck. Item 6's form and item 11's guide make it cheaper to propose a component and to work without one.                                                                                                                                                                                                                                                                                              |

### Item 9, investigated (2026-11-23)

A scan of the 65 themes for rules that set `color` to `--color-primary`, `--lily-link-*` or `--lily-brand` found ten selectors,
the same ten in every theme (they come from shared rules): `.submit-input`, `.reset-input`, `.image-input`, `.go-to-top`,
`.go-to-next-section`, `.go-to-previous-section` and `.call-to-action` (all interactive), `.hero` and
`.step-list-item[data-status="in-progress"]::before` (they match only through `--color-primary-content`, the text on a primary
fill, which is the pair rule and not an exception), and **one real exception, `.statistic > [data-part="value"]`**, a number in the
action colour that cannot be clicked. Decision: **do not add a gate yet.** One exception does not justify a rule that would have
to tell interactive selectors from the rest by parsing, which gives false positives. Whether the statistic value keeps the
primary colour is a visual choice for the maintainer; if it changes, or a second exception appears, add a `bin/check-theme` rule
with a reasoned allow-list that may only shrink.

## Advice

**Start with items 1 and 2 together, on the notices and the actions.** The inventory above already shows the problem, and
both families are small. Writing purpose lines for eleven notices will force the ranking, and the ranking will show whether
any notice should become `discouraged`. **Item 4 (glossary) is a day's work and pays back at once**, for contributors and for
the AI tools that read `llms.txt`. Do **6** before the next catalog addition, so the next component is the first to meet the
criteria. **7 and 8** improve the themes and can be done in parallel. **11 is the book's real lesson for Lily.** The book
argues that a pattern library is not a design system. Lily is a very complete pattern library, and its adopters still have
to build the system around it. A guide that maps the book's process onto Lily's parts is the most useful thing Lily can give
them. Leave **5** to the maintainer. The book shows principles work only when the team holding them chose them.

## Acceptance criteria

- [x] Every `components/{slug}/AGENTS.md` has a non-empty `- Purpose:` bullet, and a check in `bin/test` fails without one (item 1; 20 of 661 written, the rest on a shrinking allow-list).
- [x] `spec/components` has a prominence scale for notices and for actions, and every member's "When to Use" names its place (item 2).
- [ ] `components-categories.tsv` has a purpose column, generated and drift-checked, and the `/components` pages filter by it (item 3).
- [x] `spec/glossary/index.md` exists, is linked from `spec/index.md` and `llms.txt`, and `bin/check-links` passes (item 4).
- [x] A `component-proposal.yml` issue form exists and `CONTRIBUTING.md` states the criteria (item 6).
- [x] The docs site has a `/states` page, axe-clean in the light and dark themes (item 7).
- [x] Every theme declares the timing scale and zeroes it under reduced motion, enforced by `bin/check-theme` (item 8).
- [x] The label-packs topic has a voice and tone section (item 10); `docs/building-your-design-system.md` exists (item 11).
- [x] The persuasive components name their misuse in "When Not to Use" (item 13).

## Related topics

- [components](../../components/index.md): the catalog, name patterns, maturity; where items 1 to 3 land.
- [overview](../../overview/index.md): the principles item 5 would rank.
- [theme](../../theme/index.md) and [visual-identity](../../visual-identity/index.md): perceptual patterns; items 7 to 9.
- [label-packs](../../label-packs/index.md): item 10.
- [design-system-survey](../design-system-survey/index.md): the survey of 18 systems; the book's case studies are older
  peers of the same systems (Atlassian, Carbon, Polaris, Salesforce).
- [bootstrap](../bootstrap/index.md): its task-shaped skills and known-limitations docs pair with item 11.

## Sources

- Alla Kholmatova, _Design Systems: A practical guide to creating design languages for digital products_, Smashing Media AG,
  Freiburg, 2017, ISBN 978-3-945749-58-6. Read from the maintainer's copy, `~/Public/software-engineering-books/design-systems/design-systems.pdf`
  (289 pages); chapter references above are to its ten chapters and conclusion.
- Works the book cites and these lessons rely on: Christopher Alexander, _A Pattern Language_ and _The Timeless Way of
  Building_; Brad Frost, "Interface Inventory" and _Atomic Design_; Heydon Pickering, _Inclusive Design Patterns_ (calls to
  action); Tom Osborne, "Visual loudness"; Sarah Drasner, animation timing in design systems; Val Head, _Designing Interface
  Animation_; Nathan Curtis, design-system articles; Donella Meadows, _Thinking in Systems_.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/): 2.2.1 Timing Adjustable, 2.2.4 Interruptions, 2.3.3 Animation from Interactions,
  3.2.6 Consistent Help.

---

Lily™ and Lily Design System™ are trademarks.
