# NetPromoterScoreView

## Overview

A headless Net Promoter Score (NPS) rating view that displays an NPS score
value as read-only text within a <span> element. Used to show previously
captured NPS data in dashboards, reports, or detail views. NPS scores range
from 0 to 10, with respondents classified as Detractors (0-6), Passives (7-8),
or Promoters (9-10).

## What it does

A read-only display of a Net Promoter Score.

## When to use

- Use when displaying a value read-only (no editing).

## When not to use

- Do not use when the user must edit the value — use the matching `*Input` component instead.

## Usage

```svelte
<NetPromoterScoreView label="NPS Score" value="8" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible label for screen readers via aria-label. |
| `value` | string, default "" | The NPS score value to display. |
| `...restProps` | additional HTML attributes spread onto the <span> |  |

## Examples

```svelte
<!-- Display a static NPS score -->
<NetPromoterScoreView label="NPS Score" value="8" />

<!-- Display a dynamic score with reactive binding -->
<NetPromoterScoreView label="Customer rating" value={score} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import NetPromoterScoreView from "$lib/components/NetPromoterScoreView/NetPromoterScoreView.svelte";
</script>

<NetPromoterScoreView label="NPS Score" value="8" />
```

## Keyboard

- None — this is a passive informational display, not interactive.

## Accessibility

- aria-label provides the accessible name so screen readers announce context
- Screen readers announce both the label and the displayed value

## Internationalization

- The label prop accepts any translated string
- The value is displayed as-is, allowing localized formatting
- No hardcoded user-facing strings

## References

- Net Promoter Score: https://en.wikipedia.org/wiki/Net_promoter_score
