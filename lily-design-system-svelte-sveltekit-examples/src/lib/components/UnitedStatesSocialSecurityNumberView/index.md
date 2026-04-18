# UnitedStatesSocialSecurityNumberView

## Overview

A headless display component for showing a United States Social Security
Number (SSN) in a read-only format. Renders the SSN as an inline <span>
element with an accessible label. Suitable for personal records,
confirmation screens, account summaries, or any context where an SSN needs
to be displayed but not edited. This is the View counterpart to the Input
component in the Input/View pattern.

## What it does

A read-only display of a US Social Security number.

## When to use

- Use when displaying a value read-only (no editing).

## When not to use

- Do not use when the user must edit the value — use the matching `*Input` component instead.

## Usage

```svelte
<UnitedStatesSocialSecurityNumberView label="SSN" value="123-45-6789" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible label for screen readers via aria-label. |
| `value` | string, default "" | The SSN string to display (e.g., "123-45-6789"). |
| `...restProps` | additional HTML attributes spread onto the <span> |  |

## Examples

```svelte
<!-- Display SSN with descriptive label -->
<UnitedStatesSocialSecurityNumberView label="Social Security Number" value={ssn} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import UnitedStatesSocialSecurityNumberView from "$lib/components/UnitedStatesSocialSecurityNumberView/UnitedStatesSocialSecurityNumberView.svelte";
</script>

<UnitedStatesSocialSecurityNumberView label="SSN" value="123-45-6789" />
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

- Social Security Number: https://www.ssa.gov/history/ssn/geocard.html
