# IrelandIndividualHealthIdentifierView

## Overview

A headless display component for showing an Ireland Individual Health
Identifier (IHI) in a read-only format. The IHI is a 10-digit clinical
identifier used by the HSE to match patients with medical records.

## What it does

A read-only display of Ireland Individual Health Identifier (IHI) unique national healthcare identifier.

## When to use

- Use when displaying a value read-only (no editing).

## When not to use

- Do not use when the user must edit the value — use the matching `*Input` component instead.

## Usage

```svelte
<IrelandIndividualHealthIdentifierView label="IHI" value="1234567890" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible label via aria-label. |
| `value` | string, default "" | The IHI string to display. |
| `...restProps` | additional HTML attributes spread onto the <span> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import IrelandIndividualHealthIdentifierView from "$lib/components/IrelandIndividualHealthIdentifierView/IrelandIndividualHealthIdentifierView.svelte";
</script>

<IrelandIndividualHealthIdentifierView label="IHI" value="1234567890" />
```
