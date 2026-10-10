# Lily Design System™ — Angular Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that ties together the three real
Angular subprojects in this monorepo — the headless component library
(`@lilydesignsystem/angular-headless`), the helper packages (one
top-level `lily-design-system-angular-*` subproject each), and the styled example application
(`lily-design-system-angular-examples`) — and helps an agent decide which
one it needs.

It is the umbrella for two more specific sibling skills that already exist:
[`lily-design-system-angular-headless-skill`](../lily-design-system-angular-headless-skill/)
and
[`lily-design-system-angular-helpers-skill`](../lily-design-system-angular-helpers-skill/).
This skill sits one level up from those two — it maps the three
subprojects and points into the two headless/helpers skills for their own
deep-dive contracts rather than duplicating them, and gives real coverage
of the example app, which neither sibling skill documents.

## What it's for

Load this skill when someone asks what's available for Angular in Lily
Design System, which of the three Angular subprojects they need, or wants
to see Lily's Angular components styled and running (routes, the NHS UK
visual reference, composed-page demos, how to run the app). For the
headless library's or the helpers catalog's own consumption details, this
skill points at its sibling skill rather than restating it.

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself: the three-subproject map, the
  example app's routes/styling/how-to-run, pointers to the two sibling
  skills, and the Angular-wide conventions verified across all three.

Scaffolded to match the other implementation subprojects — including the
special files — and lives only in this monorepo (its standalone subtree
repository was deleted 2026-10-10).
