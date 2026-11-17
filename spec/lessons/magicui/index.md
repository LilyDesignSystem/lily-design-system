# Lessons from Magic UI (planned work)

## Summary

A review on 2026-11-16 of [Magic UI](https://magicui.design/), a library of more than 150 animated React components and effects
(MIT, about 23,000 GitHub stars), built with TypeScript, Tailwind CSS and Motion and installed as source through a shadcn/ui
registry namespace (`shadcn add @magicui/marquee`). It describes itself as a companion for shadcn/ui and sells landing-page
templates as Magic UI Pro. Almost everything in it is motion and decoration: text animations, animated backgrounds, glowing
borders, particles, confetti, cursors, a magnifying lens, a globe. Lily's headless rule is the opposite (components never
animate; motion is the consumer's CSS, and must respect `prefers-reduced-motion`), and none of the component pages reviewed
mention reduced motion, a pause control or ARIA. So most of Magic UI is declined, and the lessons are few and narrow: a
`marquee` built the accessible way (a real pause control, the copies hidden), an overflow count on `avatar-group`, a terminal
transcript pattern with `kbd` and `samp`, an opt-in view transition when the theme picker changes theme, and a motion recipes
page that shows how to get several Magic UI effects on Lily components without failing WCAG. Nothing here is built yet; tasks
are in [tasks.md](../../../tasks.md#phase-32--lessons-from-magic-ui-2026-11-16).

## Scope

### In scope

- Magic UI's free components, against Lily's catalog, its animated-text rule and its reduced-motion rule.
- Its distribution model (a namespaced shadcn registry), against Lily's own shadcn-compatible registry.

### Explicitly out of scope

- Animation in the headless layer ([headless](../../headless/index.md): no animation choreography; [accessibility](../../accessibility/index.md): headless components never auto-animate).
- Magic UI Pro's templates and blocks.
- Visual effects as components: backgrounds, beams, borders, particles, meteors, confetti, cursors.

## Principles and rules

- **Motion is the consumer's, and it stops.** Anything that moves for more than five seconds needs a way to pause, stop or hide it
  (WCAG 2.2.2), and `prefers-reduced-motion: reduce` turns it off. A component may supply the pause control and the state; the
  movement is CSS in a theme or the consumer's stylesheet.
- **Animated text keeps the real text at rest.** Lily's existing rule ([accessibility](../../../AGENTS/accessibility.md), from the
  detent lessons) covers Magic UI's number ticker, typing animation, word rotate, morphing text and text reveal: the final text is
  in the DOM, any animated copy is `aria-hidden`, and intermediate values are never announced.
- **Hover is never the only way.** Magic UI's dock magnifies on pointer distance only; anything shown on hover is shown on focus
  too (WCAG 1.4.13, 2.1.1).
- **Duplicated content is hidden once.** A marquee repeats its children to loop; every copy after the first is `aria-hidden` and
  `inert`, so a screen reader and the Tab key meet each item once.

## Findings

From the [component list](https://magicui.design/docs/components), the
[Marquee](https://magicui.design/docs/components/marquee), [Number Ticker](https://magicui.design/docs/components/number-ticker)
and [Dock](https://magicui.design/docs/components/dock) pages, and the [repository](https://github.com/magicuidesign/magicui):

| Magic UI group       | Components                                                                                                                                                 | Lily today                                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Marquee              | Scrolling repeated content; `reverse`, `vertical`, `repeat`, and `pauseOnHover` as its only pause                                                          | none; `carousel` and `horizontal-scroller` are user-driven                                                   |
| Text animations (18) | Number Ticker, Typing Animation, Word Rotate, Morphing Text, Text Reveal, Hyper Text, Sparkles Text, Aurora Text and others                                | the animated-text rule; `statistic`, `mark`                                                                  |
| Layout and display   | Bento Grid, Animated List, Dock, Avatar Circles ("+99"), Orbiting Circles, Icon Cloud, Globe, Dotted Map, Tweet Card, Terminal, File Tree, Code Comparison | `grid`, `tool-bar`, `avatar-group` (no overflow count), `tile-map`, `code-block`, `kbd`, `file-tree`, `diff` |
| Device mocks         | Safari, iPhone, Android                                                                                                                                    | nine `mockup-*` components                                                                                   |
| Buttons and effects  | Rainbow, Shimmer, Ripple, Pulsating buttons; Border Beam, Shine Border, Magic Card, Glare Hover, Meteors, Confetti, Particles, Lens, Smooth Cursor         | `button`; nothing else, by rule                                                                              |
| Backgrounds (13)     | Grid, dot, hexagon and striped patterns, Retro Grid, Light Rays, Noise Texture, Dither Field                                                               | none, by rule                                                                                                |
| Progress             | Scroll Progress, Animated Circular Progress Bar                                                                                                            | `progress`, `progress-bar`, `progress-circle`                                                                |
| Theme                | Animated Theme Toggler (a circular reveal between light and dark)                                                                                          | the `theme-picker` helper                                                                                    |
| Distribution         | A namespaced shadcn registry (`@magicui/…`), a showcase of sites using it                                                                                  | Lily's shadcn-compatible registry (`static/r/react/`), `docs/adopters.md`                                    |

## Proposals and decisions

| Item                                                                    | Lily today                              | Decision                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----------------------------------------------------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. `marquee` (maintainer decision)                                      | none                                    | **Consider.** A `<section aria-label>` holding a `<ul>` of the consumer's items, the copies `aria-hidden` and `inert`, and a real pause button (`aria-pressed`, consumer label) that sets `data-paused`; no movement in the component. The themes animate it with CSS, only when `prefers-reduced-motion` is not `reduce` and `data-paused` is not set. Logo strips and tickers are common enough to want one safe version. |
| 2. `avatar-group` overflow count                                        | label and children only                 | **Adopt** `overflowLabel` (consumer words, "and 12 more"), rendered as a last `-overflow` part, so a truncated group says how many it hides.                                                                                                                                                                                                                                                                                |
| 3. Terminal transcript                                                  | `code-block`, `kbd`                     | **Adopt as a pattern**: a `code-block` whose input lines are `<kbd>` and output lines `<samp>`, with the prompt as CSS-generated text so copying a command does not copy the prompt. A typing effect, if any, follows the animated-text rule.                                                                                                                                                                               |
| 4. Theme change view transition                                         | applies at once                         | **Adopt, opt in**: a `viewTransition` option on `theme-picker` in the eight catalogs that wraps the apply in `document.startViewTransition()` when it exists and reduced motion is not requested; the animation itself is the consumer's CSS (`::view-transition-*`). Off by default.                                                                                                                                       |
| 5. Motion recipes page                                                  | none                                    | **Adopt** `docs/patterns/motion/index.md`: how to animate Lily components accessibly in CSS, with a reduced-motion fallback and a pause where motion lasts: a marquee on item 1, a number change on `statistic` under the animated-text rule, a fade-in on scroll that never hides content from the accessibility tree, the theme transition from item 4. Each recipe names the WCAG criterion it keeps.                    |
| 6. Hover and focus parity                                               | the tooltip rule in the helpers         | **Adopt a guide sentence**: an effect shown on hover (magnification, glare, a lens) is shown on focus too, or is decoration only.                                                                                                                                                                                                                                                                                           |
| 7. A namespaced registry listing                                        | `static/r/react/`                       | **Maintainer decision.** List Lily's existing registry in the shadcn registry directory under a namespace (`@lily/…`). It is outward-facing, so it waits for the maintainer.                                                                                                                                                                                                                                                |
| Text animation components                                               | —                                       | **Decline.** Motion; the animated-text rule says how a consumer does it.                                                                                                                                                                                                                                                                                                                                                    |
| Backgrounds, beams, particles, confetti, cursors, lens, glowing buttons | —                                       | **Decline.** Decoration with no semantics.                                                                                                                                                                                                                                                                                                                                                                                  |
| Globe, icon cloud, orbiting circles                                     | —                                       | **Decline.** Decoration; `tile-map` and the charts cover data on maps.                                                                                                                                                                                                                                                                                                                                                      |
| Tweet card                                                              | —                                       | **Decline.** A third-party embed; privacy and platform terms are the consumer's.                                                                                                                                                                                                                                                                                                                                            |
| Device mocks, file tree, code comparison, bento grid                    | `mockup-*`, `file-tree`, `diff`, `grid` | **Nothing to do.** Lily has them.                                                                                                                                                                                                                                                                                                                                                                                           |

## Advice

Magic UI is popular for reasons Lily deliberately does not compete on, and that is fine: an adopter who wants its effects can put
them on Lily's markup. The useful work is small. Do **2 (overflow count)** and **6 (hover and focus)** now; both are tiny. Write
**5 (motion recipes)** next, since it answers "how do I make Lily look like Magic UI" without breaking the headless rule, and
add **4 (view transition)** with it. **1 (`marquee`)** is worth building only if the recipes show the CSS-only version is too easy
to get wrong (the copies and the pause are what people forget). Leave **7** to the maintainer.

## Acceptance criteria

- [x] `avatar-group` renders `overflowLabel` in all nine catalogs (item 2).
- [x] The motion recipes page exists, with a reduced-motion fallback in every recipe, linked from the site (items 3, 5, 6).
- [x] `theme-picker` takes `viewTransition`, tested to call `startViewTransition` only when it exists and reduced motion is off (item 4).
- [ ] `marquee` is built with its pause control, or declined with a reason here (item 1).
- [ ] The registry listing is decided (item 7).

## Related topics

- [accessibility](../../accessibility/index.md) — the reduced-motion and animated-text rules.
- [detent](../../detent-lessons/index.md) — where the animated-text rule came from.
- [competitive-position](../../competitive-position/index.md) — the shadcn-compatible registry.
- [theme-picker](../../theme-picker/index.md) — the helper item 4 changes.

## Sources

- [Magic UI](https://magicui.design/) and its [components](https://magicui.design/docs/components)
- [Marquee](https://magicui.design/docs/components/marquee), [Number Ticker](https://magicui.design/docs/components/number-ticker),
  [Dock](https://magicui.design/docs/components/dock)
- [Magic UI on GitHub](https://github.com/magicuidesign/magicui) (MIT)
- [WCAG 2.2 SC 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
- [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)

---

Lily™ and Lily Design System™ are trademarks.
