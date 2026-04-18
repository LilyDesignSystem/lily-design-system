# GrailLayoutLeftAside

A headless structural wrapper for the left aside slot of a `GrailLayout`. It typically contains navigation menus, filters, or supplementary content.

## What it is

A Svelte 5 component that renders a plain `<div class="grail-layout-left-aside ...">` around the `children` snippet. Note the source renders a `<div>`, not an `<aside>` - add a semantic `<aside>` (or `<nav>`) inside for the appropriate landmark.

## What it does

- Renders `<div class="grail-layout-left-aside ...">` wrapping the `children` snippet.
- Spreads any additional HTML attributes onto the `<div>`.

## When to use it

- As the left-side slot inside `GrailLayout` for primary navigation, filters, or a sidebar.
- When you need the `grail-layout-left-aside` hook class for consumer CSS.

## When not to use it

- For the `<aside>` or `<nav>` landmark itself. Place the semantic element inside this slot.
- For a slide-out drawer. Use `Drawer`, `Sheet`, or `SlideOutDrawer`.
- For a resizable sidebar with a drag handle. Use `Resizable` or `Splitter` with `Sidebar`.

## How to use it

Place as a direct child of `GrailLayout` and nest a semantic element (`<aside>`, `<nav>`) inside.

## Props

- `class` (string, optional) - CSS class appended after the base `grail-layout-left-aside` class.
- `children` (Snippet, required) - Content for the left aside slot.
- `...restProps` - Additional HTML attributes spread onto the `<div>`.

## Usage

```svelte
<script lang="ts">
    import GrailLayoutLeftAside from "./GrailLayoutLeftAside.svelte";
</script>

<GrailLayoutLeftAside>
    <nav aria-label="Primary navigation">
        <a href="/">Home</a>
        <a href="/about">About</a>
    </nav>
</GrailLayoutLeftAside>
```

```svelte
<script lang="ts">
    import GrailLayoutLeftAside from "./GrailLayoutLeftAside.svelte";
</script>

<GrailLayoutLeftAside>
    <aside aria-label="Filters">
        <h2>Filters</h2>
        <label><input type="checkbox" /> Active</label>
    </aside>
</GrailLayoutLeftAside>
```

```svelte
<script lang="ts">
    import GrailLayout from "../GrailLayout/GrailLayout.svelte";
    import GrailLayoutLeftAside from "./GrailLayoutLeftAside.svelte";
    import GrailLayoutCenterMain from "../GrailLayoutCenterMain/GrailLayoutCenterMain.svelte";
</script>

<GrailLayout>
    <GrailLayoutLeftAside>
        <nav aria-label="Primary">...</nav>
    </GrailLayoutLeftAside>
    <GrailLayoutCenterMain><main>Content</main></GrailLayoutCenterMain>
</GrailLayout>
```

```svelte
<script lang="ts">
    import GrailLayoutLeftAside from "./GrailLayoutLeftAside.svelte";
</script>

<GrailLayoutLeftAside class="narrow-left" data-testid="grail-left">
    <aside><p>Ad slot</p></aside>
</GrailLayoutLeftAside>
```

```svelte
<script lang="ts">
    import GrailLayoutLeftAside from "./GrailLayoutLeftAside.svelte";
    const items = [
        { href: "/", label: "Home" },
        { href: "/docs", label: "Docs" },
        { href: "/help", label: "Help" },
    ];
</script>

<GrailLayoutLeftAside>
    <nav aria-label="Primary">
        <ul>
            {#each items as i}<li><a href={i.href}>{i.label}</a></li>{/each}
        </ul>
    </nav>
</GrailLayoutLeftAside>
```

## Accessibility

- The rendered element is a `<div>`, not `<aside>`. Add a real `<aside>` or `<nav>` child to produce the `complementary` or `navigation` landmark.
- Give any `<nav>` or `<aside>` an `aria-label` when multiple navs/asides are on the page.

## Related components

- `GrailLayout` - parent layout container.
- `GrailLayoutTopHeader`, `GrailLayoutCenterMain`, `GrailLayoutRightAside`, `GrailLayoutBottomFooter` - sibling slots.
- `Sidebar` - dedicated side-panel component.
- `NavigationMenu` - site-wide navigation menu.
