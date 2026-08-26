<!-- Synced from the canonical repository by bin/sync-special-files.
     Do not edit here; edit the root copy and re-run the script.
     Canonical: https://github.com/LilyDesignSystem/lily-design-system/blob/main/CONTRIBUTING.md -->

# Contributing

Lily Design System™ welcomes contributions. This file tells you what the project
expects, so your work lands rather than stalls.

Two things to know before you start:

- **There is one maintainer**, unpaid, and no response-time commitment. See
  [MAINTAINERS.md](MAINTAINERS.md).
- **The specification is the authority.** [spec/](spec/index.md) and the rules in
  [AGENTS/](AGENTS/) decide what is correct here. A change that disagrees with them
  is either a spec change or a bug — say which.

If what you have is an opinion rather than a patch, [RFC.md](RFC.md) is the better
door. It lists the questions this project is genuinely unsure about.

## Three ways to contribute

| | | |
| --- | --- | --- |
| **Time** | Testing, reports, review, triage, writing | No code required, and currently the scarcest input |
| **Code** | Fixes, parity work, components, docs | The specification is the bar |
| **Money** | [GitHub Sponsors](https://github.com/sponsors/joelparkerhenderson) | Buys time and an audit; buys no influence |

---

# Contribute time

Ranked by what the project actually needs, not by effort. None of these require
writing code, and the first three are worth more than most patches.

1. **Tell us Lily is wrong.** An accessibility defect, a broken keyboard contract,
   a component whose ARIA does not match its documented pattern. These are the most
   valuable reports this project can receive, and the habit here is to write them up
   rather than fix them quietly — read [CHANGELOG.md](CHANGELOG.md) for what that
   looks like.
2. **Screen-reader testing.** Automated tooling covers a minority of WCAG success
   criteria. VoiceOver, NVDA, or JAWS results on *any* component are genuinely
   scarce here, and a report of the form "component X announces Y, which is wrong
   because Z" is directly actionable. You do not need to be an expert; you need a
   screen reader and patience.
3. **Real-world use reports.** You tried Lily and something did not fit — the class
   hooks fought your CSS, a prop was missing, the docs assumed knowledge you did not
   have. Even without a patch, this is worth more than a feature request, because
   nobody here can see your context.
4. **Translation and locale review.** Every string in Lily is consumer-supplied by
   design, so there is nothing to translate — but the locale-aware behaviour needs
   checking by people who read those scripts. Is the `dir` detection right for your
   language? Is the endonym label correct? Does the date picker's week start where
   you expect?
5. **Documentation corrections**, including in the specification. A sentence that
   misled you is a defect.
6. **Issue triage.** Reproducing someone else's report, or narrowing it, saves the
   maintainer the scarcest thing the project has.
7. **Tell someone.** A link in a design-systems community, a mention in a talk, a
   comparison you wrote. The project's outreach plan is written down openly in
   [help/outreach/index.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/help/outreach/index.md) if you want to see where the
   gaps are.

No contribution-size threshold applies. A one-line correction is welcome.

---

# Contribute code

## Before you open a pull request

Run both:

```sh
bin/test          # required files across the repo, components, and subprojects
bin/check-links   # every relative markdown link resolves
```

Then run the test suite for whatever you touched — `npm test` in the JavaScript
subprojects, `dotnet test` for Blazor.

## The rules that will get a change rejected

These are not style preferences; they are the contracts Lily exists to hold.

- **No CSS in the headless layer.** No stylesheets, no `style="..."` attributes
  (except where structurally required), no colour, spacing, typography, or
  breakpoint literals. [AGENTS/headless.md](AGENTS/headless.md) has the forbidden
  list.
- **No hardcoded user-facing strings.** Every label, error, placeholder, and
  announcement is a prop. No English defaults, including ones that seem obviously
  safe. [AGENTS/internationalization.md](AGENTS/internationalization.md).
- **Semantic HTML first, ARIA second.** `role="button"` on a `<div>` is a defect.
  The canonical element for each component is fixed in `components/{slug}/AGENTS.md`
  and is not negotiable in an implementation PR.
- **Do not weaken a test to make a build pass.** Ever. If a test is wrong, say why
  it is wrong and change it deliberately.
- **A regression test must bite.** Confirm it fails without your fix before you
  submit it. This project has shipped green suites over real defects more than once;
  a test that passes both ways proves nothing.
- **Class hooks are a public contract.** Renaming or removing a base class or a
  sub-class (`breadcrumb-list-item`) breaks consumer CSS. It is a breaking change
  and needs a reason.
- **Cross-framework parity.** A behaviour change to one framework's component
  usually needs the same change in the other six. If it genuinely should not —
  Blazor's async event ordering has justified an exception before — say so in the PR
  and record why.

## Adding a component

Open an issue first. A new component means work in 14 subprojects plus docs, so
agreeing it exists is cheaper than reverting it.

Once agreed, the mechanical path:

```sh
bin/create-component-directory <kebab-case-slug>
```

Then add the row to [components.tsv](https://github.com/LilyDesignSystem/lily-design-system/blob/main/components.tsv), implement it in the seven
headless libraries, add tests and a Storybook story, add the demo to the canonical
demo map, and run `bin/generate-registries`. `bin/test` will tell you what is still
missing.

## Commit and pull request conventions

- One logical change per pull request. A rename and a behaviour change in the same
  PR is two PRs.
- Explain **why** in the description, not just what. The repository's own history is
  written this way — read a few entries in [CHANGELOG.md](CHANGELOG.md) for the
  expected altitude.
- If you used an AI tool for anything substantial, say so in the PR description —
  which tool, and what it did. Not in commit trailers. The reasoning is in
  [AI_STATEMENT.md](AI_STATEMENT.md) §10, and the project discloses its own use in
  the same document.
- You remain responsible for what you submit: understood, explained on request,
  tested, and honest. A contribution its author cannot explain is not accepted,
  whoever or whatever wrote it.

## Licensing your contribution

By contributing, you agree your work is offered under the same terms as the rest of
the project — the license menu in [LICENSE.md](LICENSE.md). There is no CLA and no
copyright assignment.

Do not contribute code, CSS, or documentation copied from another design system.
Lily learns from the systems in [AGENTS/citations.md](AGENTS/citations.md) by taking
*patterns and research* — what a component is for, which ARIA pattern applies —
never their source.

---

# Contribute money

**[github.com/sponsors/joelparkerhenderson](https://github.com/sponsors/joelparkerhenderson)** —
recurring or one-time. For anything else, including invoicing an organisation,
email <joel@joelparkerhenderson.com>.

## What it would actually pay for

Stated concretely, because "support the project" means nothing:

1. **An independent accessibility audit.** This is the single highest-value thing
   money could buy here. Lily *targets* WCAG 2.2 AAA and has never been audited by
   anyone; the automated baselines run AA rule sets and cover a minority of success
   criteria ([AI_STATEMENT.md](AI_STATEMENT.md) §12). An audit by a firm that does
   this properly would tell the project — and every adopter — what is actually true.
2. **Screen-reader and device testing.** JAWS is commercial software. Real testing
   needs Windows hardware, iOS and Android devices, and time on each.
3. **Maintainer time.** Everything here is unpaid evenings. The most honest thing
   money buys is more of them.
4. **Conference travel**, if a talk is accepted somewhere that does not cover it.

## What it does not buy

- **Not support.** There is no SLA, paid or otherwise, and sponsorship creates none.
- **Not priority.** A sponsor's bug does not jump a non-sponsor's bug. Severity and
  the number of people affected decide the order.
- **Not influence over the design.** The contracts in [spec/](spec/index.md) are
  argued on merit. If you want to change one, [RFC.md](RFC.md) is the route, and it
  is the same route for everybody.
- **Not a feature.** If you need specific work done to a deadline, that is paid
  contract work rather than sponsorship. Email and say so plainly.

## Other ways an organisation can help without money

Often worth more, and free to you:

- **Let your team use Lily and report back**, on the record if you can.
- **Contribute an audit you already commissioned.** If your accessibility team
  reviewed a Lily component as part of your own work, those findings are gold.
- **Sponsor time rather than cash** — an engineer's day per month on parity work or
  screen-reader testing.
- **Say publicly that you use it.** A named adopter is the credibility this project
  cannot manufacture.

## Transparency

There is no legal entity, no foundation, and no treasury. Money goes to an
individual, via GitHub Sponsors, and is taxed as his income. If sponsorship ever
reaches a level where that structure stops being appropriate, that change will be
announced in [NEWS.md](NEWS.md) rather than quietly made.

---

# Everything else

## Code of conduct

[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) applies everywhere this project happens.

## Reporting security issues

Email <joel@joelparkerhenderson.com> rather than opening an issue, and say so in the
subject line. There is no security team; the maintainer is the whole path.

## Becoming a maintainer

The route is open and described in [MAINTAINERS.md](MAINTAINERS.md). What earns it
is demonstrated judgement about the contracts above.

## Questions

Open an issue at <https://github.com/LilyDesignSystem/lily-design-system/> or email
<joel@joelparkerhenderson.com>.

---

Lily™ and Lily Design System™ are trademarks.
