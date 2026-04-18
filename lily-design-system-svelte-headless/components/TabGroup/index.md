# TabGroup

A headless tab list container with arrow-key navigation over descendant `[role='tab']` elements.

## Source note

As of the current source, `TabGroup.svelte` is effectively a duplicate of `TabBar.svelte`:

- The script's leading comment header is labelled "TabBar component".
- The rendered root element uses the class `tab-bar` (not `tab-group`), so CSS targeting must use `.tab-bar`.
- The HTML comment above the markup is `<!-- TabBar.svelte -->`.
- Behavior is identical to `TabBar`: a `<div role="tablist">` that listens for ArrowLeft/ArrowRight/Home/End and moves focus across descendants with `role="tab"`.

Consumers should treat `TabGroup` and `TabBar` as equivalent tab-list containers until this is deduplicated. The directory/file/import name `TabGroup` is preserved, but most usage and styling should mirror `TabBar`.

## What it is

A Svelte 5 headless component rendering `<div class="tab-bar ...">` with `role="tablist"`, `aria-label`, and built-in arrow-key navigation.

## What it does

- Renders a tablist container.
- Applies the required `aria-label`.
- Handles keyboard navigation:
  - ArrowRight -> next `[role='tab']` (wraps to first)
  - ArrowLeft -> previous (wraps to last)
  - Home -> first
  - End -> last
- Renders `children` (expected to include elements with `role="tab"`).
- Spreads `...restProps` onto the `<div>`.

## When to use it

- Tab interfaces where you want a different public name from `TabBar`.
- Anywhere `TabBar` would be used; the behavior is the same.

## When not to use it

- Toolbars of actions - use `ToolBar` or `TaskBar`.
- Vertical navigation lists - use `TreeNav`.
- Radio-style segment control - use `SegmentGroup`.

## How to use it

1. Import `TabGroup` and pair it with `TabBarButton` (or plain `role="tab"` buttons).
2. Provide a translated `label`.
3. Manage active-tab state yourself.
4. Style via the `.tab-bar` class (note: not `.tab-group` - see the Source note above).

## Props

- `class` (string, optional, default `""`) - merged after the `tab-bar` base class.
- `label` (string, required) - accessible name via `aria-label`.
- `children` (Snippet, required) - tab elements.
- `...restProps` - spread onto the `<div>`.

## Usage

Using `TabBarButton` children:

```svelte
<script lang="ts">
    import TabGroup from "./TabGroup.svelte";
    import TabBarButton from "../TabBarButton/TabBarButton.svelte";
    let active = $state("one");
</script>

<TabGroup label="Sections">
    <TabBarButton selected={active === "one"} controls="p1" onclick={() => (active = "one")}>One</TabBarButton>
    <TabBarButton selected={active === "two"} controls="p2" onclick={() => (active = "two")}>Two</TabBarButton>
</TabGroup>
```

Plain-button children:

```svelte
<script lang="ts">
    import TabGroup from "./TabGroup.svelte";
</script>

<TabGroup label="Manual">
    <button role="tab" aria-selected="true" tabindex="0">A</button>
    <button role="tab" aria-selected="false" tabindex="-1">B</button>
    <button role="tab" aria-selected="false" tabindex="-1">C</button>
</TabGroup>
```

With a dynamic list:

```svelte
<script lang="ts">
    import TabGroup from "./TabGroup.svelte";
    import TabBarButton from "../TabBarButton/TabBarButton.svelte";
    const items = ["a", "b", "c"];
    let active = $state("a");
</script>

<TabGroup label="Dynamic">
    {#each items as t}
        <TabBarButton
            selected={active === t}
            controls={`p-${t}`}
            onclick={() => (active = t)}
        >{t}</TabBarButton>
    {/each}
</TabGroup>
```

With extra attributes:

```svelte
<script lang="ts">
    import TabGroup from "./TabGroup.svelte";
    import TabBarButton from "../TabBarButton/TabBarButton.svelte";
</script>

<TabGroup label="Views" id="views-tabs" data-testid="views">
    <TabBarButton selected controls="p1">One</TabBarButton>
    <TabBarButton controls="p2">Two</TabBarButton>
</TabGroup>
```

Styling against the rendered class:

```svelte
<style>
    .tab-bar { display: flex; gap: 8px; }
</style>
```

## Accessibility

- `role="tablist"` + `aria-label` announces the tab list.
- Arrow / Home / End navigate between descendants with `role="tab"`.
- Consumers should supply `role="tabpanel"` containers with ids matching each tab's `aria-controls`.

References:
- WAI-ARIA Tabs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/

## Related components

- `TabBar` - functionally identical; `TabGroup` duplicates it in source.
- `TabBarButton` - intended child.
- `SegmentGroup` - radio-style alternative.
