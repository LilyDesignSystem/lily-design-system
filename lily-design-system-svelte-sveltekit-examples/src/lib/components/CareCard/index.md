# CareCard

## Overview

A headless healthcare guidance component inspired by NHS England care card
patterns. Renders a <section> landmark with a heading and body content,
supporting three urgency tiers: non-urgent (speak to a GP), urgent (visit
A&E or call 111), and immediate (call 999). The data-type attribute enables
consumer CSS styling based on urgency level.

## What it does

A medical care instruction card with urgency levels.

## When to use

- Use to group related content in a single surfaceable container.

## When not to use

- Do not nest cards deeply or use a card as a generic container when a plain element suffices.

## Usage

```svelte
<CareCard heading="See a GP if:">
  <p>You have persistent symptoms.</p>
</CareCard>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `type` | "non-urgent" \| "urgent" \| "immediate", default "non-urgent" | Urgency level. |
| `heading` | string, required | Heading text describing the care action. |
| `label` | string, optional | aria-label override; defaults to heading text. |
| `children` | Snippet, required | The care card body content. |
| `...restProps` | additional HTML attributes spread onto the <section> |  |

## Examples

```svelte
<!-- Non-urgent care card -->
<CareCard type="non-urgent" heading="Speak to a GP if:">
  <ul><li>you have symptoms for more than 3 days</li></ul>
</CareCard>

<!-- Immediate care card -->
<CareCard type="immediate" heading="Call 999 if:">
  <ul><li>you have difficulty breathing</li></ul>
</CareCard>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import CareCard from "$lib/components/CareCard/CareCard.svelte";
</script>

<CareCard heading="See a GP if:">
  <p>You have persistent symptoms.</p>
</CareCard>
```

## Keyboard

- None — this component is a passive content container.

## Accessibility

- role="region" identifies the card as a named landmark
- aria-label set from label prop or heading prop for screen reader identification
- <h2> heading provides document structure
- data-type exposes urgency level for consumer styling hooks

## Internationalization

- All text comes through heading, label, and children props; no hardcoded strings

## References

- NHS England Care Cards: https://service-manual.nhs.uk/design-system/components/care-cards
