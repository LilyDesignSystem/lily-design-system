# Lily Design System™ — Web Components Skill — Specification

Living specification for this subproject. Single source of truth for
spec-driven development of it. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the
eighteen-skill plan this subproject is one of.

## 1. Role in the ecosystem

A Claude Skill that ties together the real Web Components subprojects in
this monorepo — an **umbrella skill** sitting one level above
[`lily-design-system-web-components-headless-skill`](../../lily-design-system-web-components-headless-skill/)
and
[`lily-design-system-web-components-helpers-skill`](../../lily-design-system-web-components-helpers-skill/),
the same way [`lily-design-system-html-skill`](../../lily-design-system-html-skill/)
sits above its own HTML-specific siblings. Unlike the HTML umbrella, which
ties together **three** real subprojects (headless, helpers, and a styled
example application), this one ties together only **two**: there is no
Web Components example application. It is content and documentation, not
a component implementation — it ships no headless components, no example
app, no helper packages of its own.

## 2. Scope

### In scope

- `SKILL.md` — the skill: the two-subproject map
  (`lily-design-system-web-components-headless`, a partial, growing
  125/491 native-custom-element catalog; `lily-design-system-web-components-helpers`,
  the full six-helper `<lily-*-picker>` catalog), a decision guide for
  which one a given request needs, the real and current absence of a Web
  Components example application, the distinction from the plain-HTML
  catalogs (both ship helpers as custom elements, but the headless
  catalogs are separate, differently-scoped projects), and pointers into
  the two sibling skills and the general Lily concepts skill rather than a
  restatement of any of them.
- The standard subproject file set (`index.md`, `README.md` symlink,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, the special files,
  `.git-subtree-push`), since it follows the `lily-design-system-*` naming
  convention and `bin/test` holds it to the same bar as the other
  implementation subprojects.

### Explicitly out of scope

- Restating `lily-design-system-web-components-headless-skill`'s own
  content in full — the exact 33-component list, the two architecture
  decisions (autonomous custom elements over customized built-ins,
  light-DOM-only), the two structural patterns, and what's deliberately
  excluded all live there.
- Restating `lily-design-system-web-components-helpers-skill`'s own
  content in full — the six helpers, the three markup shapes, the
  attribute/property/event contract, and the precise provenance statement
  relating this catalog to `lily-design-system-html-helpers` all live
  there.
- Restating `AGENTS/*.md` or the root `spec/` topic docs in full.
- Any component implementation, example page, or helper package.
- **Claiming or implying a Web Components example application exists.**
  It does not, as of this writing — `AGENTS/lily.md`'s "Subprojects for
  web app examples" list has exactly seven entries (HTML+CSS+JS, Svelte
  SvelteKit, React Next.js, Vue Nuxt.js, Angular Analog, Blazor Web,
  Nunjucks Eleventy), and no
  `lily-design-system-web-components-*-examples` directory exists at the
  repository root. This skill states that gap plainly rather than
  inventing a route, package name, or directory for one, and does not
  substitute the headless catalog's Storybook stories or the helpers
  catalog's `examples/*.html` files as if they filled it — those are
  dev-only artifacts, not a styled reference application with the three
  required routes every other framework's example app carries.

## 3. Architecture

A `SKILL.md` file (Claude Skill format: YAML frontmatter with `name`,
`description`, `license`, followed by Markdown instructions), plus the
standard subproject scaffolding. No build step, no dependencies, no tests
to run beyond `bin/test`'s required-files checks.

## 4. Acceptance criteria

- [x] `SKILL.md` exists with a `name` + `description` frontmatter pair
      that names concrete trigger phrases, per Claude Skill authoring
      practice.
- [x] `SKILL.md` maps both real Web Components subprojects accurately
      (the partial 125/491 headless catalog; the full six-helper
      `<lily-*-picker>` catalog) without restating either sibling skill's
      deep contract.
- [x] `SKILL.md` states plainly, and does not paper over, the absence of
      a Web Components example application.
- [x] `SKILL.md` distinguishes the Web Components headless catalog from
      `lily-design-system-html-headless` without conflating the two.
- [x] Required subproject files present: `index.md`, `README.md`
      (symlink), `AGENTS.md`, `CLAUDE.md`, `spec/index.md`,
      `.git-subtree-push`.
- [x] `bin/test` passes with this subproject in place.
- [ ] The special files are present via `bin/sync-special-files`.
- [ ] A `.git-subtree-push` remote is actually configured and the first
      push to a standalone public repository has happened; not yet done
      as of 2026-09-05.

## 5. Related topics

- [../../lily-design-system-web-components-headless-skill/spec/index.md](../../lily-design-system-web-components-headless-skill/spec/index.md) —
  the deep contract for the partial (125/491) Web Components headless
  catalog this skill points at rather than restates.
- [../../lily-design-system-web-components-helpers-skill/spec/index.md](../../lily-design-system-web-components-helpers-skill/spec/index.md) —
  the deep contract for the six-helper `<lily-*-picker>` catalog this
  skill points at rather than restates.
- [../../lily-design-system-skill/spec/index.md](../../lily-design-system-skill/spec/index.md) —
  the general Lily concepts skill this subproject specialises for the
  Web Components idiom.
- [../../spec/agent-skills/index.md](../../spec/agent-skills/index.md) —
  the eighteen-skill plan and naming convention this umbrella skill
  extends.
