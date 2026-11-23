# Glossary

## Summary

The words Lily uses for its own parts, one sentence each, with the file that defines the term and the words not to use for
it. Use the same word for the same thing in code, docs, issues and conversation, from the markup to the customer. Added
2026-11-23 from [Smashing Magazine's "Design Systems"](../lessons/smashing-magazine-design-systems/index.md) (item 4).

## Terms

| Term              | Meaning                                                                                                                                                  | Defined in                                                                                  | Not                                                |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| catalog           | The canonical list of components, one row each in `components.tsv`; also one framework's full implementation of it.                                      | [components.tsv](../../components.tsv), [components](../components/index.md)                | "library" for the list, "registry" for the file    |
| component         | One entry in the catalog: a slug, a name, a contract and an implementation in each catalog.                                                              | [components](../components/index.md)                                                        | "widget", "element" (that is the HTML tag)         |
| slug              | A component's kebab-case identifier, such as `breadcrumb-list-item`; it is the first class on the root element and the directory name.                   | [spec/index.md](../index.md)                                                                | "id", "key"                                        |
| name              | A component's PascalCase identifier, such as `BreadcrumbListItem`, derived from the slug.                                                                | [AGENTS/components.md](../../AGENTS/components.md)                                          | "class name" (that is the slug)                    |
| contract          | What a component promises: its HTML tag, ARIA, keyboard behaviour, props and class hooks, written in its `AGENTS.md`.                                    | [AGENTS/headless.md](../../AGENTS/headless.md)                                              | "API" alone (the contract includes markup)         |
| headless          | Ships semantic markup, ARIA, focus and keyboard behaviour and no CSS, fonts, icons or imagery; the consumer styles it.                                    | [headless](../headless/index.md)                                                            | "unstyled" (a theme styles the hooks)              |
| class hook        | A stable kebab-case class on a component's markup (`button`, `byline-authors`) that a theme or the consumer's CSS selects.                               | [AGENTS/headless.md](../../AGENTS/headless.md)                                              | "CSS class" alone, "selector"                      |
| part              | A sub-component or inner element with its own class hook, such as `tool-call-name`; a `*-list-item` is a part of its list.                               | [components](../components/index.md)                                                        | "child" (a part has a name and a contract)         |
| helper            | A package that owns one whole interaction end to end, such as `theme-picker`, `data-grid` or `calendar`; one top-level subproject per framework.         | [helpers](../helpers/index.md)                                                              | "plugin", "addon"                                  |
| picker            | A helper that is an icon button opening a popup of choices, such as `locale-picker`; `date-time-picker` is the one that is a form field.                 | [AGENTS/helpers.md](../../AGENTS/helpers.md)                                                | "dropdown", "selector"                             |
| composition       | Components used together in a known arrangement (the form pattern, the summary card) that is not itself a component.                                     | [AGENTS/components.md](../../AGENTS/components.md)                                          | "pattern" alone, "template"                        |
| recipe            | A tested HTML example of one composition, in `recipes/{slug}/{name}.html`, with front matter naming the components it uses.                              | [recipes/](../../recipes)                                                                   | "snippet", "demo" (a demo is one component's page) |
| pattern           | A recurring solution: a functional pattern is a component or composition, a perceptual pattern is a style; Lily ships the first and themes the second.   | [lessons/smashing-magazine-design-systems](../lessons/smashing-magazine-design-systems/index.md) | "component" for a style                            |
| theme             | A stylesheet of design tokens plus one shared set of component rules, selected by `data-theme`; Lily ships 65.                                           | [theme](../theme/index.md)                                                                  | "skin", "style"                                    |
| token             | A named design value, one of a theme's DTCG colours, dimensions and numbers, emitted as a `--lily-*` or `--color-*` custom property.                     | [AGENTS/theme.md](../../AGENTS/theme.md)                                                    | "variable" for the source value                    |
| brand overlay     | One CSS rule on `:root[data-brand]` that re-colours a base theme without forking it.                                                                     | [visual-identity](../visual-identity/index.md)                                              | "custom theme"                                     |
| label pack        | One locale's JSON file of the labels for the grid-like helpers; 64 exist, 63 unreviewed drafts.                                                          | [label-packs](../label-packs/index.md)                                                      | "translation file", "i18n bundle"                  |
| maturity          | A component's evidence-based status, `stable`, `beta`, `experimental`, `discouraged` or `deprecated`, in its `- Status:` bullet.                         | [components](../components/index.md#maturity)                                               | "quality", "readiness"                             |
| prominence        | How loudly a component asks for attention, ranked on a scale of notices or of actions; a consumer's CSS sets it, no prop does.                           | [components](../components/index.md)                                                        | "priority", "severity"                             |
| Lily Core         | The tier of components with test, e2e and screen-reader evidence, generated by `bin/generate-core`.                                                      | [competitive-position](../competitive-position/index.md)                                    | "stable" (maturity is per component)               |

## Rules

- A new term is added here in the pull request that introduces it.
- A term here has one meaning. If a second meaning appears, rename one of them.
- A name says the purpose, never the look (`warning-text`, not `red-text`).

## Acceptance criteria

- [ ] `spec/index.md` and `llms.txt` link here, and `bin/check-links` passes.

## Related topics

- [components](../components/index.md), [headless](../headless/index.md), [theme](../theme/index.md)

---

Lily™ and Lily Design System™ are trademarks.
