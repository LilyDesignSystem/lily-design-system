# GrailLayoutBottomFooter

A headless structural wrapper for the bottom slot of a `GrailLayout`. It spans the full width of the layout and typically contains copyright, links, or site-wide footer content.

## What it is

A Svelte 5 component that renders a plain `<div class="grail-layout-bottom-footer ...">` around the `children` snippet. Note the source renders a `<div>`, not a `<footer>` - add a semantic `<footer>` (or the `Footer` component) inside if you need `contentinfo` landmark semantics.

## What it does

- Renders `<div class="grail-layout-bottom-footer ...">` wrapping the `children` snippet.
- Spreads any additional HTML attributes onto the `<div>`.

## When to use it

- As the bottom slot inside `GrailLayout`.
- When you need the `grail-layout-bottom-footer` hook class for consumer CSS (e.g. to position the slot in a CSS Grid layout).

## When not to use it

- For the `<footer>` landmark itself. Place `Footer` (or a native `<footer>`) inside this slot.
- For section-level footers inside articles. Use `Footer` directly where needed.

## How to use it

Place as a direct child of `GrailLayout`, and nest a semantic `<footer>` (or `Footer` component) inside for accessibility.

## Props

- `class` (string, optional) - CSS class appended after the base `grail-layout-bottom-footer` class.
- `children` (Snippet, required) - Content for the bottom slot.
- `...restProps` - Additional HTML attributes spread onto the `<div>`.

## Usage

```svelte
<script lang="ts">
    import GrailLayoutBottomFooter from "./GrailLayoutBottomFooter.svelte";
</script>

<GrailLayoutBottomFooter>
    <footer><small>Copyright 2026</small></footer>
</GrailLayoutBottomFooter>
```

```svelte
<script lang="ts">
    import GrailLayoutBottomFooter from "./GrailLayoutBottomFooter.svelte";
    import Footer from "../Footer/Footer.svelte";
</script>

<GrailLayoutBottomFooter>
    <Footer label="Site footer">
        <nav aria-label="Footer">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
        </nav>
    </Footer>
</GrailLayoutBottomFooter>
```

```svelte
<script lang="ts">
    import GrailLayout from "../GrailLayout/GrailLayout.svelte";
    import GrailLayoutCenterMain from "../GrailLayoutCenterMain/GrailLayoutCenterMain.svelte";
    import GrailLayoutBottomFooter from "./GrailLayoutBottomFooter.svelte";
</script>

<GrailLayout>
    <GrailLayoutCenterMain><main>Content</main></GrailLayoutCenterMain>
    <GrailLayoutBottomFooter><footer>Footer</footer></GrailLayoutBottomFooter>
</GrailLayout>
```

```svelte
<script lang="ts">
    import GrailLayoutBottomFooter from "./GrailLayoutBottomFooter.svelte";
</script>

<GrailLayoutBottomFooter class="site-bottom" data-testid="grail-bottom">
    <footer>
        <p>Custom footer with hooks.</p>
    </footer>
</GrailLayoutBottomFooter>
```

```svelte
<script lang="ts">
    import GrailLayoutBottomFooter from "./GrailLayoutBottomFooter.svelte";
    const links = [
        { href: "/about", text: "About" },
        { href: "/jobs", text: "Jobs" },
    ];
</script>

<GrailLayoutBottomFooter>
    <footer>
        <ul>
            {#each links as l}<li><a href={l.href}>{l.text}</a></li>{/each}
        </ul>
    </footer>
</GrailLayoutBottomFooter>
```

## Accessibility

- The rendered element is a `<div>`, not `<footer>`. Wrap children in a real `<footer>` (or use `Footer`) to get the `contentinfo` landmark.
- No ARIA applied by this component.

## Related components

- `GrailLayout` - parent layout container.
- `GrailLayoutTopHeader`, `GrailLayoutLeftAside`, `GrailLayoutCenterMain`, `GrailLayoutRightAside` - sibling slots.
- `Footer` - semantic `<footer>` landmark component.
- `Header` - semantic `<header>` landmark component.
