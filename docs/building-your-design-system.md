# Building your design system on Lily

Lily is a pattern library: components, helpers, themes and recipes. It is not your design system. A design system is
**patterns plus the shared practices around them**, organised around your product's purpose (Alla Kholmatova, _Design Systems_,
Smashing Magazine, 2017). Lily supplies a very complete set of patterns. Your purpose, principles, names and habits are yours.
This guide maps the book's process onto Lily's parts. See also [the glossary](../spec/glossary/index.md).

## 1. Write down your purpose and a few principles

Yours to write. Three to five principles, each phrased so it can be checked ("No needless parts", not "Make it simple"), each paired
with a real example from your product, and ranked so a conflict has an answer. Lily's own binding rules are in
[AGENTS.md](../AGENTS.md); copy none of them as your principles, but let them settle what you need not decide (accessibility,
native platform before script, your words in every label).

## 2. Run your inventory against the catalog

List what your interface has, by purpose rather than by name: the notices, the actions, the ways to ask for a value. Then look each
up in [components.tsv](../components.tsv) and the [prominence scales](../spec/components/index.md#prominence-scales). Where Lily has a
component, use it. Where you have two things Lily has one of, ask the change test: if I change this one, do I want the other to
change the same way? If yes, make it one pattern with variants; if no, keep two.

## 3. Functional patterns: Lily components, plus your compositions

A component from the catalog is a functional pattern. A _composition_ of them that your product repeats (a patient banner, a booking
step) is yours: write it as a [recipe](../recipes), named for its purpose, never its look. A one-off stays in the page that uses it.

## 4. Perceptual patterns: a theme and a brand overlay

How things look is yours. Start from one of the 65 [themes](../themes), or write your own from design tokens, then put your brand
colour, radii and font on top with a [brand overlay](../brand-overlays) (at most twenty declarations, each colour pair at least 4.5:1)
rather than a fork. Colour by role, not by value: twenty blues are fine if blue always means "you can act on this". Lily ships no
logo, font or imagery; yours go in the slots it documents.

## 5. Name your own parts by purpose

Follow the same rule Lily does: a name says what a thing is for. "Fact grid", not "blue box". Keep a glossary of your own terms next to
Lily's, and use one word for one thing.

## 6. Know which of the three dials you are setting

| Dial                    | Lily's setting                                                                  | What you choose                                                    |
| ----------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Strict or loose         | Strict: contracts, checks, allow-lists that may only shrink                     | How much of that to inherit, and where your teams may step outside |
| Modular or integrated   | Modular: a component works alone                                                | Which compositions you make the default                           |
| Centralised or distributed | Centralised: one maintainer, one catalog                                     | Who in your organisation owns your layer, and how others propose   |

"The right system is the one whose downsides you can manage."

## 7. Where the room outside Lily is

A strict system fails when people cannot step outside it. Lily's room is written, not discovered:

- **Class hooks**: every component's root and parts carry stable kebab-case classes your CSS selects.
- **Rest props**: any HTML attribute you pass lands on the root element.
- **Component-scoped variables**: `--lily-*` custom properties set on one element or a containing scope.
- **Recipes**: your compositions, written as tested HTML.
- **Your own components**: built with the same conventions (slug first in the class list, a label prop, no hardcoded text).

## 8. Propose what is missing

If your inventory finds a pattern Lily lacks and it is not a one-off, open a
[component proposal](https://github.com/LilyDesignSystem/lily-design-system/issues/new?template=component-proposal.yml). The
criteria are in [CONTRIBUTING.md](../CONTRIBUTING.md#adding-a-component).

## 9. Make the practices visible

A system is also its habits: a place people look first, a review that asks "did you check the catalog?", and a record of why a
choice was made. Lily's own are public (the [specification](../spec/index.md), the [changelog](../CHANGELOG.md), the tasks list);
borrow the ones that fit your size.

---

Lily™ and Lily Design System™ are trademarks.
