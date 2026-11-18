# Lily Design System™ — Solid Headless Skill — Specification

Living specification for this subproject. For project-wide rules read the root [spec/index.md](../../spec/index.md),
and [spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the skills plan.

## 1. Role

A Claude Skill covering the headless library for Solid 2.0 (tasks.md P36-T5, 2026-11-18). It explains how to install, import and use `@lilydesignsystem/solid-headless`, the Solid 2.0 implementation of the 637-component catalog: its two builds, `class` and rest props, controlled props with signals, and form reset. It is content, not code:
it ships no components and no packages.

## 2. Scope

- In scope: `SKILL.md`, and the required files (`index.md`, `README.md` linking to it, `AGENTS.md`, `spec/index.md`).
- Out of scope: restating the catalog, the naming rules or the general Lily concepts, which `lily-design-system-skill`
  and `AGENTS/*.md` own.

## 3. Acceptance criteria

- [x] `SKILL.md` has `name`, `description` and `license` front matter, and its `name` is the directory name.
- [x] Every package name, prop and command it states exists in the package it describes (checked 2026-11-18).
- [x] It points at its two Solid siblings and at `lily-design-system-skill` rather than restating them.

---

Lily™ and Lily Design System™ are trademarks.
