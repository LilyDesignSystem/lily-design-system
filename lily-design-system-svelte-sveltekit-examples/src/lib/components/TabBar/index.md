# TabBar

## Overview

A headless tab bar container using the ARIA tablist role. It renders a <div>
with role="tablist" and manages horizontal focus movement between tab buttons
via ArrowLeft/ArrowRight keys. Each tab button controls a corresponding
tabpanel. Commonly used for navigation between content sections.

## What it does

A group of tabs for switching between content panels.

## When to use

- Use when you need a group of tabs for switching between content panels.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<TabBar label="Settings">
  <TabBarButton selected controls="panel-1">General</TabBarButton>
</TabBar>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name applied via aria-label. |
| `children` | Snippet, required | TabBarButton elements. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Tab bar with multiple tabs -->
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
  import TabBar from "$lib/components/TabBar/TabBar.svelte";
</script>

<TabBar label="Settings">
  <TabBarButton selected controls="panel-1">General</TabBarButton>
</TabBar>
```

## Keyboard

- ArrowRight: move focus to next tab, wrapping from last to first
- ArrowLeft: move focus to previous tab, wrapping from first to last
- Home: move focus to the first tab
- End: move focus to the last tab

## Accessibility

- role="tablist" identifies the container as a tab list widget
- aria-label provides an accessible name describing the tab bar purpose
- Child TabBarButton elements provide role="tab" with roving tabindex

## Internationalization

- The label prop accepts any translated string
- All tab content comes through the children snippet
- No hardcoded user-facing strings

## References

- WAI-ARIA Tabs Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/tabs/
