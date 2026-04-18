# NorthernIrelandHealthAndCareNumberView

## Overview

A headless display for a Northern Ireland Health and Care (H&C) Number.
The H&C Number is a 10-digit identifier displayed as 3-3-4 (e.g. 320 000 0001).

## What it does

A read-only display of Northern Ireland Health and Care (H&C) Number unique national healthcare identifier.

## When to use

- Use when displaying a value read-only (no editing).

## When not to use

- Do not use when the user must edit the value — use the matching `*Input` component instead.

## Usage

```svelte
<NorthernIrelandHealthAndCareNumberView label="H&C Number" value="320 000 0001" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional |  |
| `label` | string, required | Accessible label via aria-label. |
| `value` | string, default "" |  |
| `...restProps` | spread onto the <span> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import NorthernIrelandHealthAndCareNumberView from "$lib/components/NorthernIrelandHealthAndCareNumberView/NorthernIrelandHealthAndCareNumberView.svelte";
</script>

<NorthernIrelandHealthAndCareNumberView label="H&C Number" value="320 000 0001" />
```
