# Outreach

> Lily Design System™ help doc. The living specification is the [spec index](../../spec/index.md).

**Summary.** How Lily reaches working professionals — front-end engineers, design-system
leads, accessibility specialists, and public-sector delivery teams — through owned
channels, practitioner communities, directories, newsletters, trade press, conference
talks, and direct email. Lily is not a product with a budget; it is a large, unusually
complete, single-maintainer open-source project. That shapes everything below: the
strategy is **credibility first, reach second**, because the one thing Lily has that
nothing else in its category has is scope — 491 components × 7 frameworks, 35 helper
packages, 45 themes, WCAG 2.2 AAA as a stated target — and the one thing it lacks is
social proof.

## Scope

This topic covers audience segmentation, the readiness gates that must close before
outreach begins, the channel catalog (with the etiquette rules each channel enforces),
a sequenced campaign, reusable message templates, and the metrics that tell us whether
any of it worked.

It does **not** cover: the trademark usage convention (see
[trademarks](../../spec/trademarks.md)), the design systems Lily *learns from* as opposed to
*markets to* (see [citations](../../spec/citations/index.md)), the publish pipeline mechanics
(see [tooling](../../spec/tooling/index.md) and [helpers](../../spec/helpers/index.md)), or the
contents of the claims being made (see [overview](../../spec/overview/index.md),
[accessibility](../../spec/accessibility/index.md)).

## Principles and rules

- **Every claim must survive a click.** Lily's headline numbers are its whole pitch, so
  each one must land a skeptic on a page that proves it. "491 components" → the catalog
  route. "WCAG 2.2 AAA target" → the axe baselines and the honest gap between *target*
  and *audited*. A claim a reader cannot verify in one click reads as marketing, and a
  design-system audience is specifically trained to distrust it.
- **Say "target", not "compliant".** [accessibility](../../spec/accessibility/index.md) states
  AAA as a target and records axe-core AA rule-set baselines. Accessibility
  professionals are the highest-value audience Lily has and the least forgiving of
  overclaiming; "WCAG 2.2 AAA compliant" in an npm description is a claim no automated
  suite can support. Fix the description before pitching that audience.
- **Disclose that it is one person, brand new.** It is a weakness on a procurement
  checklist and an asset in a practitioner community. Volunteering it converts the
  discovery from "gotcha" to "context", and it is the honest framing of a project whose
  own front page says "This is brand new work and we welcome collaboration."
- **Respect each community's self-promotion rule, literally.** These communities are
  small and have long memories; one ignored rule costs the channel permanently. r/webdev
  confines non-commercial project posts to Showoff Saturday; r/reactjs and r/sveltejs
  route self-promotion to a megathread; the Design Systems Slack asks that anyone
  sharing a resource be "open and honest about any costs associated with using the
  resource". Read the sidebar every time — these rules change.
- **Lead with the artifact, not the announcement.** The thing that travels in this
  audience is a *useful page*: a comparison, a technique writeup, a table nobody had
  built. "We shipped v0.4" travels nowhere. Lily has several such artifacts sitting
  unpublished inside the repo already (see "Content assets" below).
- **One audience per asset.** The pitch that works on an NHS delivery lead (public-sector
  reference themes, 80 national identifier components, no CSS framework dependency) is
  not the pitch that works on a React developer (headless primitives, rest-props, tree
  shaking). Sending one generic announcement to both wastes both.
- **No astroturfing, ever.** No sockpuppets, no vote rings, no "found this cool library"
  posts from accounts that are the maintainer. It is against every one of these
  platforms' rules, it is the single fastest way to become an anti-example, and the
  project is trademarked and named after its author, so it would not stay secret.
- **Nothing is time-critical.** A single-maintainer project has no launch window to hit.
  Every gate below should close before the corresponding channel opens, because a
  channel spent early is spent.

## 1. Readiness gates

Outreach amplifies whatever a visitor finds. Right now some of what they find
contradicts the pitch. These are ordered by how badly they damage a professional
evaluation. **Gates 1–3 block all outreach.**

### Gate 1 — Fix the license contradiction (blocking, legal)

The project currently gives four different answers to "may I use this at work?":

| Source | Answer |
| --- | --- |
| [LICENSE.md](../../LICENSE.md) | `CC BY-NC-SA` — **non-commercial**, share-alike, and a *content* licence, not a software licence |
| [spec/index.md](../../spec/index.md) §14 | "MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause (or contact for other terms)" |
| `lily-design-system-svelte-headless` on npm | `MIT` |
| `lily-design-system-react-headless`, `…-vue-headless` on npm | `ISC` |

Meanwhile [index.md](../../index.md) and the website both say "free open source".
CC BY-NC-SA is not an open-source licence, is not OSI-approved, and its `NC` clause
disqualifies exactly the professional audience this topic targets — every commercial
team, every agency, and arguably any NHS supplier. A legal reviewer who reaches
`LICENSE.md` stops there, and no amount of downstream promotion recovers that.

Pick one OSI-approved licence (MIT and Apache-2.0 are the two this audience expects;
Apache-2.0 additionally grants patent rights and pairs naturally with a trademark
policy, which matters because Lily™ is a claimed mark). Then make `LICENSE.md`, the
spec, every `package.json`, every `.csproj`, and the website say the same word. Keep
the trademark notice separate — it already is, correctly.

### Gate 2 — Ship the four unpublished frameworks (blocking, credibility)

The site promises seven frameworks. npm has three:

| Package | npm latest | Downloads/mo (2026-07-26 → 08-24) |
| --- | --- | --- |
| `lily-design-system-svelte-headless` | 0.3.0 | 183 |
| `lily-design-system-vue-headless` | 0.3.0 | 173 |
| `lily-design-system-react-headless` | 0.3.0 | 161 |
| `lily-design-system-html-headless` | — not published | — |
| `lily-design-system-angular-headless` | — not published | — |
| `lily-design-system-nunjucks-headless` | — not published | — |
| `lily-design-system-blazor-headless` | — not published (NuGet) | — |

An Angular or Blazor developer arriving from an Angular or Blazor pitch finds nothing
installable. Publish the remaining four (Blazor to NuGet) before any framework-specific
outreach, or scope each pitch to the frameworks that are actually installable and say so.

### Gate 3 — Make the first five minutes work (blocking, conversion)

Before sending anyone anywhere, walk the path a stranger walks and time it: land on the
site → understand what Lily is → copy something → have it render. The site already does
this well (three-step quick start, per-framework tutorials, a searchable catalog with
live demos). Verify specifically that (a) the npm install path in each tutorial matches
the published package name and version, (b) the helper packages' dependency lists are
honest — `lily-design-system-svelte-theme-picker` currently declares `@sveltejs/kit` as
a runtime `dependency`, which pulls a framework into any consumer's tree and will be
read as carelessness by exactly the reviewers Lily wants, and (c) `CONTRIBUTING.md`
exists — a project inviting collaboration with no contribution guide converts interest
into nothing. (`CODE_OF_CONDUCT.md` is already present.)

### Gate 4 — Repo hygiene for discovery (non-blocking, compounding)

- **GitHub topics** on every repo. Convention is roughly five, covering language,
  framework, domain, and artifact type — e.g. `design-system`, `accessibility`,
  `headless-ui`, `svelte`, `wcag`. Blank topics is the most common miss and costs free
  search traffic; 18 crammed topics reads as manipulation.
- **npm keywords** and a one-line description per package, deduplicated across the 35
  helpers (they currently vary in quality). Fix the "WCAG 2.2 AAA compliant" wording
  here at the same time as Gate 1.
- **`repository`, `homepage`, `bugs`** fields in every manifest, so npm renders the
  links that make a package look maintained.
- **Screenshots in the root README.** This is a *design* system; a text-only README is
  a self-inflicted wound. Two images — the styled example app, and the same markup
  unstyled — tell the headless story faster than the paragraph does.
- **Remove or fold `plan.md` and `tasks.md`** at the repo root; the spec says they were
  superseded by `spec/`, and stale planning files at the top level read as abandonment.

### Gate 5 — Baseline the metrics before the first campaign (non-blocking)

Record today's numbers so later movement is attributable. Current baseline
(2026-08-25): ~180 monthly npm downloads on each of the three published headless
packages, GitHub stars per repo, and whatever the github.io analytics show. See
"Measurement" below.

## 2. Audiences and the hook for each

| # | Audience | Where they are | The hook that works | The hook that fails |
| --- | --- | --- | --- | --- |
| 1 | **Design-system leads / DS teams** | Design Systems Slack, zeroheight Slack, Clarity/Into Design Systems, LinkedIn | Cross-framework parity from one catalog: the same 491 slugs and the same class hooks in 7 frameworks, so a multi-stack org has one contract | Component count alone — they own systems and know count ≠ quality |
| 2 | **Accessibility specialists** | web-a11y Slack, r/accessibility, axe-con, WebAIM newsletter audience | The APG-conformance work, the keyboard contract per component, and the honest write-ups of *found* defects (the idempotent-apply bug, the pointer-close contract gap) | "AAA compliant" — instantly disqualifying |
| 3 | **Framework developers** (React/Svelte/Vue/Angular/Blazor/Nunjucks) | Cooper Press newsletters, r/reactjs, r/sveltejs, Bluesky/Mastodon front-end circles, HN | Headless primitives with rest-props and zero CSS in *their* idiom; Blazor and Nunjucks are genuinely underserved | Generic "new component library" — the category is saturated for React |
| 4 | **Public-sector / civic delivery teams** | NHS service manual Slack, cross-gov Slack, GOV.UK DS community, local-gov digital | The 45 reference themes (NHS England/Scotland/Wales, GOV.UK GDS, USWDS), the 80 national identifier components, no CSS-framework dependency | Anything that looks like a vendor pitch |
| 5 | **Healthcare IT / digital health** | HTN, Health Tech Digital, HIMSS-adjacent press | Patient-facing UI built to public-sector visual references, free and forkable | Deep front-end detail — wrong altitude for this audience |
| 6 | **Agencies and consultancies** | LinkedIn, design-system Slacks, conference hallways | A ready-made client starting point they can theme and bill against — which requires Gate 1 (an `NC` licence forbids exactly this) | Purity arguments about headless architecture |

## 3. Channel catalog

### 3.1 Owned (control: total; cost: time)

| Channel | Status | Action |
| --- | --- | --- |
| `lilydesignsystem.github.io` | Live, good | Add a changelog/blog route — every campaign below needs a canonical URL to point at, and a project with no dated posts looks dormant |
| Root `index.md` / README | Live | Screenshots, one-paragraph "why", licence badge |
| npm / NuGet package pages | 3 of 7 published | Gates 2 and 4 |
| A low-volume email list | Does not exist | Add a plain "get an email when Lily ships something" form. It is the only channel that isn't rented, and design-system practitioners subscribe to things |
| Mastodon + Bluesky + LinkedIn accounts | Unknown | One account per network, posting the artifacts from §4, not announcements. LinkedIn is where audiences 1, 4, 5 actually are |

### 3.2 Practitioner communities (control: none; cost: participation)

These are the highest-value and slowest channels. The rule in all of them: contribute
for weeks before you post about your own work.

| Community | Who's there | Entry | Notes |
| --- | --- | --- | --- |
| **Design Systems Slack** (design.systems, run by the Design Systems Coalition) | Audience 1, the densest concentration anywhere | Open join link from design.systems | Code of Conduct; asks resource-sharers to disclose any costs. Introduce in the relevant channel, not `#general` |
| **zeroheight Slack** | DS practitioners and buyers | Open join | Vendor-adjacent but active; sessions and webinars |
| **web-a11y Slack** (`accessibility.github.io/a11yslack`) | Audience 2 | Open invite page | The single best room for the APG-conformance story. High expertise; do not overclaim |
| **NHS digital service manual Slack** | Audience 4 | Free workspace, join from the service manual | See §3.3 — its community-resources page already lists third-party implementations |
| **Cross-government Slack** (`#govuk-design-system`, `#frontend`) | Audience 4 | **Requires a `.gov.uk` (or approved public-sector) email** | Joel cannot join directly. Route: find a public-sector user who will raise Lily internally, or engage via the GOV.UK Design System's public GitHub instead |
| **Reddit**: r/webdev, r/reactjs, r/sveltejs, r/vuejs, r/angular, r/Blazor, r/accessibility, r/UXDesign | Audiences 2, 3 | Open, rules vary sharply | r/webdev: Showoff Saturday only, technical framing. r/reactjs and r/sveltejs: megathread. Roughly four genuine contributions per self-promotional post is the norm people cite |
| **Storybook / framework Discords** | Audience 3 | Open | Useful for a specific technical question that doubles as an introduction |

### 3.3 Directories and listings (control: application; cost: an hour each)

Free, permanent, and they compound with search. Do all of them.

- **The Component Gallery** (component.gallery) — catalogs ~60 components across ~95
  design systems with ~2,676 examples, **filterable by tech stack and by features
  including accessibility and open source**. Lily is unusually well-suited: it can be
  listed once as a system, and its per-component docs feed the per-component pages.
  Submit via the site's Contribute page. *Highest-ROI single item in this document.*
- **NHS digital service manual → Community resources** — this page already lists
  community-built frontend implementations (an Eleventy theme, Jinja components, React
  components, a WordPress theme) alongside a Figma library, each with its own Slack
  channel. Lily's NHS-referenced example apps and NHS-variant themes are a direct fit.
  Use the page's "get in touch" route to propose a listing. *Second-highest ROI, and the
  only one that reaches audience 4 without a `.gov.uk` address.*
- **Design System Gallery** (designsystem.gallery), **designsystems.one**,
  **Adele** (UXPin's design-systems repository) — public design-system archives.
- **Awesome lists** — `awesome-design-systems`, `awesome-a11y`, per-framework awesome
  lists (`awesome-svelte`, `awesome-blazor`, `awesome-vue`, `awesome-angular`,
  `awesome-eleventy`). One PR each, following each list's contribution rules.
- **Libraries.io**, GitHub Topics pages, and npm keyword search — passive, driven
  entirely by Gate 4.

### 3.4 Newsletters (control: pitch; cost: minutes; reach: large)

The fastest path to thousands of qualified professionals, and it is free.

| Newsletter | Audience | Reach (stated) |
| --- | --- | --- |
| **JavaScript Weekly** (Cooper Press) | Audience 3 | 170,000+ |
| **React Status** (Cooper Press) | React | ~40,000 |
| **Frontend Focus** (Cooper Press) | HTML/CSS/browser — the best fit for a headless, semantic-HTML system | 754+ issues since 2011 |
| **Node Weekly** (Cooper Press) | Tooling angle | Large |
| **Smashing Magazine newsletter** | Audiences 1–3 | Weekly, Tuesdays |
| **WebAIM monthly newsletter** | Audience 2 | Long-running |
| **Svelte / Vue / Angular / .NET community newsletters** | Audience 3 | Per-framework |

Cooper Press does not publish a submission form on the newsletter pages themselves —
use the contact route on cooperpress.com and pitch **the artifact, not the release**.
Curators pick links their readers will click; "491-component headless system across 7
frameworks, here's how the cross-framework class-hook contract works" is a link, "Lily
0.4 released" is not.

Note for audience 2: the **WebAIM email discussion list**, which ran from 1999, has
ended — the mailing list is no longer a live channel, though WebAIM's monthly newsletter
and the web-a11y Slack are.

### 3.5 Aggregators and launch platforms (control: none; cost: one shot each)

- **Hacker News, "Show HN"** — the highest-variance channel. Title states the problem,
  not the product. Post a detailed founder comment within minutes covering motivation,
  stack, limitations, and what feedback is wanted. Tue–Thu, ~08:00–10:00 PT. **One
  shot**: Lily gets one credible Show HN, so spend it after Gates 1–3, not before. The
  headless + 7-framework + accessibility angle is HN-shaped; the component count alone
  will draw "how many are actually good?" — have the answer ready.
- **Lobste.rs** — smaller, more technical, invite-only to post; better signal than HN if
  an invite exists.
- **Product Hunt** — weaker fit for a developer library than for a product, but free.
  Launches start 00:01 PT for the full 24-hour cycle and need images.
- **dev.to / Hashnode** — republish the §4 artifacts with canonical links back to the
  site.

### 3.6 Trade press and journalists (control: pitch; cost: hours)

- **Smashing Magazine** — pitch via their contact form with: target audience and
  experience level, what the reader takes away, why you're the person to write it (with
  links to prior writing), and a 200–300 word outline with headings. Assume a
  knowledgeable peer. A Smashing article on cross-framework design-system parity, or on
  the accessibility defects Lily found in its own pickers, would reach audiences 1–3 at
  once and is the highest-value press target.
- **InfoQ** — practitioner-written technical articles for senior engineers, architects,
  and team leads; values timeliness. Author guidelines at infoq.com/guidelines.
- **The New Stack** — **its contributed-article program is paused as of July 2026**;
  paid/sponsored programs remain (sales@thenewstack.io). Treat as closed for now, revisit.
- **HTN Health Tech News** (audience 5) — UK health tech daily; accepts news at
  press@htn.co.uk and has a "Submit your news" route for suppliers. Covers NHS, ICBs,
  ICSs. A free, open-source, NHS-referenced component library is a plausible story.
- **Health Tech Digital**, **Digital Health**, **NHS England Digital news** — same
  audience, same angle.
- **Journalist-request platforms** — Qwoted (~30k journalists, ~100k experts), Featured
  (which acquired the HARO brand in April 2025 and runs free daily digests), Source of
  Sources (free, from HARO's original founder), Help a B2B Writer. Overlap between any
  two platforms averages ~17%, so monitoring one misses most requests. Respond as an
  *expert on accessible component architecture*, not as a project pitching itself —
  the byline and link follow from the expertise.

### 3.7 Conferences and CFPs (control: application; cost: weeks; payoff: authority)

A conference talk is the single most durable credibility asset available to a
single-maintainer project — it converts "unknown repo" into "the person who gave that
talk". Relative to 2026-08-25:

| Event | Format | Window |
| --- | --- | --- |
| **axe-con** (Deque) | Free, virtual, 45+ sessions across development / design / organizational / wildcard tracks | 2026 ran Feb 24–25 with speaker applications closing the prior 7 November. **Watch Sept–Nov 2026 for the 2027 CFS** — free, virtual, and the best-matched audience Lily has |
| **Into Design Systems** | Online, won Best Event at the 2025 Design Systems Awards | 2026 ran March 19–20; check the 2027 CFP in late 2026 |
| **SmashingConf** | In-person Europe | Freiburg Sep 7–10 2026, Antwerp Oct 12–15 2026 — too late to speak, viable to attend; Smashing Meets runs cheaper online editions |
| **Clarity**, **CSUN**, **a11yTO**, **Design Systems Days** | Mixed | Verify each year's CFP window directly; these move |
| **Local meetups** — front-end, a11y, .NET, Svelte/Vue/Angular user groups | In-person | Always hungry for speakers. The lowest-friction place to rehearse the talk |

Two talk proposals Lily can support today, both grounded in work already done:

1. *"One catalog, seven frameworks: what stayed the same and what didn't."* The
   cross-framework parity problem, the class-hook contract, and where the idioms
   genuinely diverge (Blazor's async event order, Angular's change detection).
2. *"The accessibility bugs our tests couldn't see."* The re-entrant apply that froze a
   picker at `aria-expanded="true"` while jsdom and bUnit stayed green; the pointer-close
   clause that six of seven catalogs implemented correctly with nothing asserting it.
   This is a genuinely good talk — it's about the limits of automated a11y testing, with
   Lily as the case study rather than the subject.

### 3.8 Direct email (control: total; cost: research per message)

Small, researched, one-at-a-time. Never a blast.

- **Design-system leads** who have publicly asked for multi-framework or headless
  options — reply to the public post, then email.
- **Accessibility consultants and auditors** — offer Lily as something to audit and
  publish on. An external audit report is worth more than any announcement.
- **University and bootcamp instructors** teaching accessible front-end — a
  491-component annotated catalog with per-component ARIA and keyboard contracts is a
  teaching resource.
- **Public-sector delivery leads** — the route to cross-gov Slack that a `.gov.uk`
  address requirement otherwise closes.
- **Maintainers of adjacent projects** (Eleventy NHS themes, Jinja/NHS components,
  govuk-frontend adjacent tools) — collaboration, not competition; they share an audience.

## 4. Content assets Lily already has and hasn't published

Every one of these exists in the repo as engineering work and needs only a public
write-up. They are the raw material for §3.4–§3.6, and they are what makes Lily
interesting rather than merely large.

| Asset | Where it lives | Audience |
| --- | --- | --- |
| The frozen-picker bug: a re-entrant apply, `effect_update_depth_exceeded`, a stale `aria-expanded` over a hidden list, invisible to jsdom and bUnit | [helpers](../../spec/helpers/index.md), CHANGELOG | 1, 2, 3 |
| The pointer-close contract gap — correct behaviour, unasserted, in six of seven catalogs | [helpers](../../spec/helpers/index.md) | 1, 2 |
| Optical glyph matching: why one `font-size` looks wrong across ◑ 🌐 A ➤, and the per-glyph scale factors | [helpers](../../spec/helpers/index.md), `themes/*.css` | 1 |
| Endonym locale labels — "Cymraeg" not "Welsh" — and claiming `lang` only when true | [internationalization](../../spec/internationalization/index.md) | 1, 2, 4 |
| 80 national personal identifier components: normalization and validation across 30+ countries | [national-identifiers](../../spec/national-identifiers/index.md) | 4, 5 |
| The suffix → HTML element mapping as a naming discipline | [components](../../spec/components/index.md) | 1 |
| Seven-framework parity: the honest report of what didn't port cleanly | [frameworks](../../spec/frameworks/index.md) | 1, 3 |

## 5. Sequenced campaign

**Phase 0 — Close the gates (do not skip).** Gates 1–3. Nothing else in this document
runs before the licence says one thing and every advertised framework installs.

**Phase 1 — Permanent listings.** Component Gallery, NHS service manual community
resources, design-system galleries, awesome lists, GitHub topics, npm metadata. Silent,
compounding, no audience required. Establishes the search footprint that makes every
later campaign land somewhere credible.

**Phase 2 — Show up before selling.** Join Design Systems Slack, web-a11y Slack, NHS
service manual Slack. Answer other people's questions for several weeks. Introduce Lily
where the channel's rules invite it, disclosing that it is new, single-maintainer, and
free.

**Phase 3 — Publish the artifacts.** Two or three of the §4 write-ups on the site's new
blog route, cross-posted to dev.to with canonical links. These are what §4–§6 channels
need to point at.

**Phase 4 — Newsletters and press.** Pitch Frontend Focus and JavaScript Weekly with the
best artifact. Pitch Smashing with a 200–300 word outline. Pitch HTN with the
public-sector angle. Register on Qwoted / Featured / Source of Sources and answer
accessibility and design-system queries as they arrive.

**Phase 5 — Show HN.** Once the site, the licence, the packages, and at least one
substantial write-up all hold up. One shot.

**Phase 6 — Speak.** Submit to the axe-con 2027 CFS when it opens (watch Sept–Nov 2026),
plus a local meetup as a rehearsal. Ongoing thereafter.

**Continuous** — Showoff Saturday posts when there is something genuinely new; a
monthly-or-quieter email to the list; LinkedIn posts of the §4 artifacts for audiences
1, 4, 5.

## 6. Message templates

### Community introduction (Slack, first post in a relevant channel)

> Hi all — I've been building an open-source design system called Lily and I'd value a
> reality check from people who do this professionally. It's headless (no CSS shipped),
> and the same catalog is implemented across HTML, Svelte, React, Vue, Angular, Blazor
> and Nunjucks, with the same class hooks in each, so a multi-stack org gets one
> contract. It's free, MIT, no paid tier and nothing to buy. It's also brand new and
> currently one person, which is exactly why I'm asking rather than announcing. The
> thing I'd most like feedback on is [ONE SPECIFIC QUESTION]. Repo: [link].

### Newsletter pitch (short, artifact-first)

> Subject: Cross-framework design-system parity — write-up you might like for [NEWSLETTER]
>
> Hi [NAME] — I wrote up what breaks when you implement the same component catalog in
> seven frameworks and hold the markup contract identical: [LINK]. It covers [TWO
> CONCRETE FINDINGS]. It comes out of an open-source system I maintain (MIT, [repo]),
> but the write-up stands alone and isn't a product pitch. Happy to be ignored — thanks
> for the newsletter either way.

### Directory / listing submission (NHS service manual, Component Gallery)

> Lily Design System is a free, MIT-licensed, headless component catalog (491 components)
> with implementations for HTML, Svelte, React, Vue, Angular, Blazor and Nunjucks. Its
> example applications use the NHS UK design system as their visual reference, and it
> ships NHS England / Scotland / Wales theme stylesheets among 45 reference themes. It
> ships no CSS in the component layer, has no CSS-framework dependency, targets WCAG 2.2
> AAA, and follows WAI-ARIA APG patterns. It is community-maintained and not affiliated
> with or endorsed by [ORGANISATION]. Docs: [link]. Source: [link].

### Conference proposal abstract (axe-con-shaped)

> **The accessibility bugs our tests couldn't see.** We built the same five interactive
> helpers in seven frameworks, wrote a test per acceptance clause, and went green. Then
> a user reported a picker that got stuck open. The close path was fine — a re-entrant
> "apply" had frozen the component's DOM, and neither jsdom nor bUnit could see it.
> This talk walks through that bug and a second one where six of seven implementations
> did the right thing with nothing asserting it, and draws out what automated a11y
> testing structurally cannot catch — and what to do instead.

## 7. Measurement

Track monthly; compare against the 2026-08-25 baseline in Gate 5.

| Signal | Why it matters | Baseline (2026-08-25) |
| --- | --- | --- |
| npm downloads/month per package | The only unfakeable adoption signal | svelte 183, vue 173, react 161; four packages unpublished |
| GitHub stars and forks | Weak on adoption, strong on reach | Record per repo |
| **Issues and PRs from strangers** | The metric that actually matters — it means someone used it | Record |
| Referrer sources on the site | Tells you which channel worked | Record |
| Directory listings accepted | Phase 1 completion | 0 |
| Newsletter/press placements | Phase 4 completion | 0 |
| Talks accepted | Phase 6 completion | 0 |

A caution: stars respond to launches, downloads respond to usefulness, and they
diverge. Optimise for the third row.

## 8. Anti-patterns

- Promoting before Gate 1 — a reviewer who hits `CC BY-NC-SA` does not come back.
- "WCAG 2.2 AAA compliant" anywhere. It is "targets WCAG 2.2 AAA" and the axe baselines
  are AA rule sets. Audience 2 will check.
- Leading with "491 components". It invites "and how many are good?", which is the wrong
  first conversation. Lead with the parity contract or the accessibility work.
- Posting the same text to six subreddits. Reddit surfaces this and the communities
  punish it.
- Implying NHS, GOV.UK, or USWDS endorsement. The themes are *references*; every listing
  and pitch must say "not affiliated with or endorsed by".
- Paying for placement before the free channels are exhausted. Every channel in §3 is
  free except conference travel.
- Announcing releases as the content strategy. Nobody outside the project cares about
  0.6.1; they care about what you learned building it.

## Acceptance criteria

- [ ] `LICENSE.md`, `spec/index.md` §14, the website, and all 42+ package manifests
      state one OSI-approved licence.
- [ ] Every framework the website advertises is installable from npm or NuGet.
- [ ] No published artifact claims WCAG "compliance"; all say "target".
- [ ] `CONTRIBUTING.md` exists at the repo root; `plan.md` / `tasks.md` are removed or folded.
- [ ] Every repo has 4–6 GitHub topics; every package has keywords, `repository`,
      `homepage`, `bugs`, and a distinct description.
- [ ] Root README shows at least two screenshots.
- [ ] Lily is listed in The Component Gallery.
- [ ] A listing proposal has been sent to the NHS digital service manual community-resources page.
- [ ] Lily appears in at least three further galleries or awesome lists.
- [ ] The site has a dated blog/changelog route with at least two §4 artifacts published.
- [ ] Introductions posted, per each community's own rules, in Design Systems Slack and
      web-a11y Slack — after a period of participation.
- [ ] At least three newsletter or press pitches sent.
- [ ] Show HN posted, after all of the above.
- [ ] One conference or meetup proposal submitted.
- [ ] Baseline metrics recorded and reviewed monthly.

## Related specification topics

- [overview](../../spec/overview/index.md) — the vision and key facts the pitches draw on.
- [accessibility](../../spec/accessibility/index.md) — the AAA target and axe baselines; the
  source of the "target, not compliant" rule.
- [helpers](../../spec/helpers/index.md) — the source of most of the §4 content assets.
- [citations](../../spec/citations/index.md) — the systems Lily learns from, several of which
  are also the communities in §3.2.
- [trademarks](../../spec/trademarks.md) — the ™ convention every public artifact must follow.
- [frameworks](../../spec/frameworks/index.md) — the seven-framework parity story.
- [national-identifiers](../../spec/national-identifiers/index.md) — the public-sector hook.

## Sources

Repo:

- [LICENSE.md](../../LICENSE.md), [index.md](../../index.md), [spec/index.md](../../spec/index.md) §14 — the licence contradiction in Gate 1.
- [CHANGELOG.md](../../CHANGELOG.md) — the incident write-ups behind the §4 assets.
- npm registry, 2026-08-25 — published versions, licences, and download counts in Gates 2 and 5.

External (retrieved 2026-08-25):

- [Design.Systems — connect / Slack](https://next.design.systems/connect/slack/) and [designsystemscoalition/design-systems-slack](https://github.com/designsystemscoalition/design-systems-slack)
- [zeroheight Slack community](https://zeroheight.com/slack/)
- [NHS digital service manual — community resources](https://service-manual.nhs.uk/community-and-contribution/community-resources)
- [GOV.UK Design System — community](https://design-system.service.gov.uk/community/) and [How to use cross-government Slack](https://x-govuk.org/posts/how-to-use-cross-government-slack/)
- [GOV.UK service manual — frontend development community](https://gov.uk/service-manual/communities/technology-community-frontend-development)
- [WebAIM — community](https://webaim.org/community/), [Web A11y Slack](https://accessibility.github.io/a11yslack/), [The A11Y Project — resources](https://www.a11yproject.com/resources/), [DigitalA11y — accessibility forums roundup](https://www.digitala11y.com/accessibility-forums-roundup/)
- [The Component Gallery](https://component.gallery/) and its [design systems index](https://component.gallery/design-systems/); [Design System Gallery](https://designsystem.gallery/)
- [Cooper Press publications](https://cooperpress.com/publications/) — JavaScript Weekly, Frontend Focus, React Status, Node Weekly
- [Smashing Magazine — write for us](https://www.smashingmagazine.com/write-for-us/) and [Pitching your writing to publications](https://www.smashingmagazine.com/2019/08/pitching-writing-publications/)
- [InfoQ author guidelines](https://www.infoq.com/guidelines/); [The New Stack — contributions](https://thenewstack.io/contributions/)
- [HTN Health Tech News — submit your news](https://htn.co.uk/suppliers/) and [contact](https://htn.co.uk/contact/); [Health Tech Digital](https://healthtechdigital.com/)
- [axe-con](https://www.deque.com/axe-con/) and [axe-con 2026 announcement](https://www.deque.com/blog/the-global-community-is-coming-together-to-accelerate-digital-accessibility-at-axe-con-2026/)
- [Into Design Systems](https://www.intodesignsystems.com/); [SmashingConf Meets Design Systems 2026](https://smashingconf.com/meets-design-systems-2026)
- [How to launch a dev tool on Hacker News](https://www.markepear.dev/blog/dev-tool-hacker-news-launch); [How to crush your Hacker News launch](https://dev.to/dfarrell/how-to-crush-your-hacker-news-launch-10jk); [Promote your open source project — daily.dev](https://business.daily.dev/resources/promote-open-source-project-step-by-step-launch-guide/)
- [r/webdev promotion rules](https://rankhog.com/subreddits/webdev); [Reddit self-promotion rules by subreddit](https://www.soar.sh/blog/self-promotion-rules-by-subreddit-database)
- [Best journalist request platforms 2026](https://hey.press/best-journalist-request-platforms); [HARO alternatives](https://www.prezly.com/academy/the-best-haro-alternatives)
- [GitHub repository topics for discoverability](https://slategit.com/blog/github-repository-topics-for-discoverability); [awesome-npm](https://github.com/sindresorhus/awesome-npm)

---

Lily™ and Lily Design System™ are trademarks.
