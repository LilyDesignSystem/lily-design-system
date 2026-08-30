# llms.json and llms.txt

## Summary

Two AI-guidance files — [`llms.txt`](../../llms.txt) (Markdown) and
[`llms.json`](../../llms.json) (structured JSON) — give AI tools a clean,
curated map of the project's most important content, following the
[llms.txt convention](https://llmstxt.org). The docs site publishes its
own pair with the same shape but different link targets, since a
repo-relative path and a site route don't resolve the same way.

## Scope

### In scope

- The workspace-root `llms.txt` / `llms.json`: a curated map of the
  monorepo's own docs (`spec/index.md`, `AGENTS.md`, `components.tsv`,
  the subprojects, the two agent skills).
- `lilydesignsystem.github.io/static/llms.txt` / `llms.json`: the
  site-facing pair, served at the deployed site's root once built.
- Keeping both pairs under the file-size budget and their links working.

### Explicitly out of scope

- A generator that produces one pair from the other — the two serve
  different domains (a git checkout vs. a live website) and are
  hand-maintained in parallel instead.
- `llms-full.txt` (a fuller, uncurated content dump some sites also
  publish) — not adopted; both pairs stay deliberately curated.

## Principles and rules

- **Curated, not exhaustive.** The point is a map an LLM can read without
  crawling the whole project — a handful of high-value links per
  section, not every file. The convention's own `## Optional` section
  marks what can be skipped under a shorter context budget.
- **Links must actually resolve from where the file is served.**
  Repo-relative paths (`spec/index.md`, `AGENTS.md`) resolve on GitHub
  and in a local checkout, but not as routes on a deployed static site —
  and a site route (`/components/`) isn't a path in the repo. Each copy
  uses whichever kind of link works for its own serving context; neither
  copy mixes the two.
- **`llms.json` mirrors `llms.txt`'s curated map**, not a superset or a
  differently-organised one — same sections, same entries, structured as
  `{title, url, description}` instead of Markdown bullets.
- **Placeholder content doesn't get a curated slot.** A page marked
  "Content coming soon" isn't yet "important content" — it's left out
  until it has real content, and re-added then.
- **File size stays under the budget.** Both files must stay under 40 KB;
  in practice each is well under (root: ~4.9 KB / ~6.9 KB; site: ~3.9 KB
  / ~5.0 KB) because the curation itself keeps them short.

## Detail sections

### The two pairs, and why their content differs

| | Workspace-root `llms.txt`/`llms.json` | Site `static/llms.txt`/`llms.json` |
| --- | --- | --- |
| Served from | A git checkout / GitHub | `https://lilydesignsystem.github.io/` |
| Link style | Repo-relative (`spec/index.md`, `AGENTS.md`) | Absolute site routes (`/components/`, `/why/`) + absolute GitHub URLs for source content |
| Points at | The specification, the design-principle rules, the 21 subprojects, the two agent skills | The site's own pages (`/`, `/why/`, `/about/`, `/help/`, `/components/`, `/tutorials/`, `/examples/`, `/comparisons/`, `/accessibility/`, `/news/`, `/roadmap/`, `/lily-figma/`), plus a "Source (GitHub)" section for the deeper technical docs |
| Placed at | Repository root | `lilydesignsystem.github.io/static/` (the `adapter-static` folder copied verbatim to the build output root) |

The workspace-root pair was written first (as a direct copy would be
correct on GitHub, where it's read from). Copying that same text
verbatim into the site's `static/` folder was tried and rejected: every
repo-relative link 404s when served from the site's own domain, since
`spec/index.md` and `AGENTS.md` aren't routes this SvelteKit site
serves. The site pair was rewritten instead, verified route-by-route
against `lilydesignsystem.github.io/src/routes/`.

### Format

`llms.txt`: H1 title, a blockquote summary, then `##` sections of
Markdown link bullets (title, target, and a colon-separated
description on one line), ending in a conventional `## Optional`
section. `llms.json`: `{name, summary, description, license, sections:
[{title, links: [{title, url, description}]}]}`.

## Acceptance criteria

- [x] `llms.txt` and `llms.json` exist at the repository root.
- [x] Both are valid (Markdown renders; `llms.json` parses as JSON).
- [x] Both stay under 40 KB.
- [x] Every link in both root files resolves (verified via
      `bin/check-links` and by checking each target path exists).
- [x] `lilydesignsystem.github.io/static/llms.txt` and `llms.json` exist,
      with every link resolving to a route this site actually serves,
      verified against `src/routes/`.
- [x] This topic is linked from [spec/index.md](../index.md)'s topic
      table.

## Related topics

- [agent-skills](../agent-skills/index.md) — the other AI-guidance
  addition from this same work session.
- [architecture](../architecture/index.md) — the monorepo layout these
  files map.
- [examples](../examples/index.md) — the required routes the site copy's
  links point at.

## Sources

- [`llms.txt`](../../llms.txt), [`llms.json`](../../llms.json)
- [`lilydesignsystem.github.io/static/llms.txt`](../../lilydesignsystem.github.io/static/llms.txt),
  [`llms.json`](../../lilydesignsystem.github.io/static/llms.json)
- [llmstxt.org](https://llmstxt.org) — the convention both files follow
