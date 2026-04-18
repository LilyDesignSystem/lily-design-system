# UnitedKingdomNationalHealthServiceNumberView

## Overview

A headless display component for showing a United Kingdom National Health
Service (NHS) number in a read-only format. Renders the number as an inline
<span> element with an accessible label. Suitable for patient records,
summaries, confirmation screens, or any context where an NHS number needs
to be displayed but not edited. This is the View counterpart to the Input
component in the Input/View pattern.

## What it does

A read-only display of a UK NHS number.

## When to use

- Use when displaying a value read-only (no editing).

## When not to use

- Do not use when the user must edit the value — use the matching `*Input` component instead.

## Usage

```svelte
<UnitedKingdomNationalHealthServiceNumberView label="NHS Number" value="123 456 7890" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible label for screen readers via aria-label. |
| `value` | string, default "" | The NHS number string to display. |
| `...restProps` | additional HTML attributes spread onto the <span> |  |

## Examples

```svelte
<!-- Display patient NHS number -->
<UnitedKingdomNationalHealthServiceNumberView label="Patient NHS Number" value={nhsNumber} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import UnitedKingdomNationalHealthServiceNumberView from "$lib/components/UnitedKingdomNationalHealthServiceNumberView/UnitedKingdomNationalHealthServiceNumberView.svelte";
</script>

<UnitedKingdomNationalHealthServiceNumberView label="NHS Number" value="123 456 7890" />
```

## Keyboard

- None -- passive display-only component

## Accessibility

- aria-label provides the accessible name so screen readers announce the purpose
- Screen readers announce the label followed by the text content (the number)

## Internationalization

- The label prop externalizes user-facing text for translation
- No hardcoded strings in the component

## References

- NHS Number: https://www.nhs.uk/using-the-nhs/about-the-nhs/what-is-an-nhs-number/
