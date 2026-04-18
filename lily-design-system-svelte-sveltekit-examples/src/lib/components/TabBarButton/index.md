# TabBarButton

## Overview

A headless tab button for use within a tabbed interface. Renders a <button>
with role="tab" and appropriate ARIA attributes for tab selection and panel
association. It follows the roving tabindex pattern where only the selected
tab participates in the tab order. Designed to be placed inside a TabBar
container with role="tablist".

## What it does

One tab button in a tab group.

## When to use

- Use for an in-page action (not navigation).

## When not to use

- Do not use for navigation to another URL — use a link instead.

## Usage

```svelte
<TabBarButton selected={true} controls="panel-1">Label</TabBarButton>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `selected` | boolean, default false | Whether this tab is currently active. |
| `controls` | string, required | The id of the associated tabpanel element. |
| `children` | Snippet, required | Tab label content. |
| `...restProps` | additional HTML attributes spread onto the <button> |  |

## Examples

```svelte
<!-- Tab buttons within a TabBar -->
<TabBar label="Settings">
  <TabBarButton selected={activeTab === "general"} controls="panel-general"
    onclick={() => activeTab = "general"}>General</TabBarButton>
  <TabBarButton selected={activeTab === "advanced"} controls="panel-advanced"
    onclick={() => activeTab = "advanced"}>Advanced</TabBarButton>
</TabBar>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import TabBarButton from "$lib/components/TabBarButton/TabBarButton.svelte";
</script>

<TabBarButton selected={true} controls="panel-1">Label</TabBarButton>
```

## Keyboard

- Tab: moves focus to the selected tab in the tablist
- ArrowLeft/ArrowRight: moves between tabs (handled by parent tablist)
- Enter/Space: activates the tab (native button behavior)

## Accessibility

- role="tab" identifies this element as a tab in a tabbed interface
- aria-selected communicates the selection state to screen readers
- aria-controls links the tab to its panel for assistive technology
- Roving tabindex: selected tab has tabindex=0, others have tabindex=-1
- Compound component: must be placed inside a TabBar container

## Internationalization

- All visible text is provided through the children snippet
- No hardcoded strings in the component

## References

- WAI-ARIA Tabs Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/tabs/
- WAI-ARIA Tab Role: https://www.w3.org/TR/wai-aria-1.2/#tab
