# EspanaTarjetaSanitariaIndividualView

## Overview

A headless display component for showing a España Tarjeta Sanitaria
Individual (TSI) / CIP-SNS in a read-only format. The TSI is the unique
Spanish national healthcare identifier printed on the tarjeta sanitaria.

## What it does

A read-only display of a España Tarjeta Sanitaria Individual (TSI) unique national healthcare identifier.

## When to use

- Use when displaying a value read-only (no editing).

## When not to use

- Do not use when the user must edit the value — use the matching `*Input` component instead.

## Usage

```svelte
<EspanaTarjetaSanitariaIndividualView label="TSI" value="BBBB12345678" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible label via aria-label. |
| `value` | string, default "" | The TSI string to display. |
| `...restProps` | additional HTML attributes spread onto the <span> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import EspanaTarjetaSanitariaIndividualView from "$lib/components/EspanaTarjetaSanitariaIndividualView/EspanaTarjetaSanitariaIndividualView.svelte";
</script>

<EspanaTarjetaSanitariaIndividualView label="TSI" value="BBBB12345678" />
```

## Keyboard

- None -- passive display-only component

## Accessibility

- aria-label provides the accessible name for screen readers
