<!-- Synced from the canonical repository by bin/sync-special-files.
     Do not edit here; edit the root copy and re-run the script.
     Canonical: https://github.com/LilyDesignSystem/lily-design-system/blob/main/COMPARISONS.md -->

# Comparisons

How Lily Design System™ relates to the other systems in its neighbourhood, what
it does that they do not, and — more usefully — what they do that it does not.

The per-component matrix lives in [comparisons/index.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/comparisons/index.md),
generated from [comparisons/comparisons.tsv](https://github.com/LilyDesignSystem/lily-design-system/blob/main/comparisons/comparisons.tsv): 428
component rows across 18 systems.

## Read the matrix carefully

The matrix answers one question per cell: *does this system ship a component that
matches this Lily row?* The rows are Lily's catalog, so **Lily scores 428/428 by
construction**. That is a property of how the table was built, not evidence of
superiority, and anyone using this table to evaluate Lily should discount it
accordingly.

| System | Rows matched (of 428) |
| --- | --- |
| Lily | 428 *(tautological — see above)* |
| DaisyUI | 194 |
| Flowbite | 188 |
| Ant Design | 187 |
| shadcn/ui | 152 |
| Adobe Spectrum | 152 |
| ONS Digital | 142 |
| IBM Carbon | 131 |
| Ark UI | 126 |
| USWDS | 123 |
| Wonderflow Wanda | 110 |
| Skeleton | 103 |
| Bits UI | 102 |
| NHS UK | 95 |
| Melt UI | 80 |
| GOV.UK | 76 |
| Mozilla Protocol | 30 |
| 18F | not surveyed |

The honest reading: a mature system with 100–200 components has usually earned
each one through production use. Lily has more entries; it has not yet had the
same feedback.

## Where Lily is genuinely different

Four things, and only these four are worth claiming.

**1. One catalog, seven frameworks, one class contract.**
The same slug, the same PascalCase name, the same HTML element, the same ARIA and
keyboard contract, and the same kebab-case class hook, in HTML, Svelte, React,
Vue, Angular, Blazor, and Nunjucks. An organisation running React on one product
and Blazor on another can share a single stylesheet and a single set of component
docs. Ark UI is multi-framework (React, Vue, Solid); nothing else in the table
spans this range, and nothing else includes Blazor or Nunjucks.

**2. Headless *and* fully worked examples.**
Most systems pick one side. Radix, Bits, Melt, and Ark ship behaviour and leave
you the visuals. DaisyUI, Flowbite, Ant, Carbon, and Spectrum ship the visuals
and their opinions with them. Lily ships an unstyled layer with zero CSS, plus
seven complete styled applications and 45 theme stylesheets, so you can see the
end state before adopting the primitives.

**3. Internationalisation as a hard rule, not a feature.**
No component contains a user-facing string. Every label, error, and announcement
is a prop; locale-aware components take the locale rather than picking one; plural
and gender logic belongs to the consumer. Most component libraries ship English
defaults and a translation mechanism bolted on afterwards.

**4. Public-sector reference coverage.**
45 themes covering NHS England, Scotland and Wales in patient and practitioner
variants, GOV.UK GDS, and USWDS, plus 80 national personal identifier components
across 30+ countries with normalization and validation. Nothing else in the table
addresses this, and it is the one area where Lily's breadth is not just breadth.

## Where the alternatives are stronger

Written for someone deciding, not someone already convinced.

| If you need | Use | Because |
| --- | --- | --- |
| Production-proven behaviour with years of edge cases | **Radix**, **Ark UI**, **Bits UI**, **React Aria** | Lily is new. Their combobox has met more browsers, screen readers, and users than Lily's has |
| To ship a good-looking app this week | **DaisyUI**, **Flowbite**, **shadcn/ui**, **Skeleton** | They hand you the design. Lily deliberately does not |
| A design language your team can adopt wholesale | **IBM Carbon**, **Adobe Spectrum**, **Ant Design** | Full token systems, Figma kits, and design guidance. Lily's `themes/` are references, not a language |
| Actual GOV.UK or NHS compliance | **govuk-frontend**, **nhsuk-frontend** | Those are the real thing, maintained by the organisations, and audited. Lily's themes take *visual reference* from them and carry no endorsement |
| A vendor relationship, SLA, or support contract | any commercial system | Lily is one unpaid person; see [MAINTAINERS.md](MAINTAINERS.md) |
| An accessibility conformance statement or VPAT | **Carbon**, **Spectrum**, **USWDS** | Lily *targets* WCAG 2.2 AAA and runs automated AA checks. It has never been audited |
| Copy-paste ownership of the source | **shadcn/ui** | Its model is deliberate and excellent. Lily supports copying too, but shadcn's tooling for it is better |

## Honest limitations

- **New, and one maintainer.** First commit 2025-08-09. See
  [MAINTAINERS.md](MAINTAINERS.md) for what that means in practice.
- **Four of seven frameworks are not on a registry yet.** See
  [INSTALL.md](INSTALL.md).
- **Breadth outruns depth.** 491 components is more surface than one person plus
  machine gates can exercise the way production does. Point-in-time verification
  snapshots are labelled as such in [spec/index.md](spec/index.md) §11.4.
- **No design tooling.** No Figma library, no token pipeline, no design-to-code
  workflow. Systems in the table that have those, have a real advantage.
- **No audit.** Automated axe-core baselines are not an accessibility audit, and
  Lily has shipped green suites over real defects — see
  [AI_STATEMENT.md](AI_STATEMENT.md) §12.
- **Small ecosystem.** No plugins, no third-party themes, no community.

## When Lily is the right choice

- You run more than one framework and want one contract across them.
- You have a designer or a brand and want components that impose nothing.
- You are building for the public sector, or against a public-sector visual
  reference.
- Internationalisation is a requirement rather than a later phase.
- You would rather copy components into your repository than depend on a package.

## When it is not

- You need it to be proven. It is not yet.
- You want the design decided for you.
- You need a support contract, a VPAT, or a vendor.
- You need Angular, Blazor, HTML, or Nunjucks from a registry today.

## Sources

The full list of systems Lily studies is in
[AGENTS/citations.md](AGENTS/citations.md); the reference relationship with NHS UK
is in [AGENTS/nhs-uk-design-system-references.md](AGENTS/nhs-uk-design-system-references.md);
adaptation notes for the editorial and scrollytelling components are in
[spec/citations/index.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/citations/index.md).

Lily is not affiliated with, endorsed by, or connected to any system named on this
page. All marks belong to their respective owners.

---

Lily™ and Lily Design System™ are trademarks.
