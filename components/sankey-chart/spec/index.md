# SankeyChart — Specification

Single source of truth for the SankeyChart component: a flow chart where link width encodes the quantity moving between nodes.

## Goal

A headless `<figure role="img">` shell, identical in contract to `bar-chart`, around a consumer-drawn `<svg>`.

## HTML Tag and CSS Class

- HTML tag: <figure>
- CSS class: .sankey-chart

## Requirements

1. Root is `<figure>` with first attribute `class="sankey-chart {class}"`.
2. `role="img"`.
3. `aria-label` is set from the required `label` prop.
4. Children (the consumer svg) render inside the figure.
5. `restProps`, including `aria-describedby`, spread onto the root.
6. No drawing, CSS, inline styles or hardcoded strings.

## Acceptance Criteria

- [x] Svelte canonical implemented with one test per requirement above
- [ ] Ported to the other headless libraries
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

---

Lily™ and Lily Design System™ are trademarks.
