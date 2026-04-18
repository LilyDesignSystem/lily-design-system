# FranceNumeroDIdentificationAuRepertoireView

## Overview

A headless display component for showing a France numéro d'identification
au répertoire (NIR) in a read-only format. Renders the number as an inline
<span> element with an accessible label. Suitable for patient records,
summaries, confirmation screens, or any context where a NIR needs
to be displayed but not edited. This is the View counterpart to the Input
component in the Input/View pattern.

## What it does

A read-only display of a France numéro d'identification au répertoire (NIR) unique national healthcare identifier.

## When to use

- Use when displaying a value read-only (no editing).

## When not to use

- Do not use when the user must edit the value — use the matching `*Input` component instead.

## Usage

```svelte
<FranceNumeroDIdentificationAuRepertoireView label="NIR" value="1 85 05 75 012 345 67" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible label for screen readers via aria-label. |
| `value` | string, default "" | The NIR string to display. |
| `...restProps` | additional HTML attributes spread onto the <span> |  |

## Examples

```svelte
<!-- Display patient NIR -->
<FranceNumeroDIdentificationAuRepertoireView label="Numéro de sécurité sociale" value={nir} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import FranceNumeroDIdentificationAuRepertoireView from "$lib/components/FranceNumeroDIdentificationAuRepertoireView/FranceNumeroDIdentificationAuRepertoireView.svelte";
</script>

<FranceNumeroDIdentificationAuRepertoireView label="NIR" value="1 85 05 75 012 345 67" />
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

- Ameli.fr: https://www.ameli.fr/assure/droits-demarches/principes/numero-securite-sociale
