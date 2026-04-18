# GrailLayoutCenterMain

A headless structural wrapper for the center main slot of a `GrailLayout`. It holds the primary page content and is flanked by the left and right aside slots.

## What it is

A Svelte 5 component that renders a plain `<div class="grail-layout-center-main ...">` around the `children` snippet. Note the source renders a `<div>`, not a `<main>` - add a semantic `<main>` element inside if you need the `main` landmark.

## What it does

- Renders `<div class="grail-layout-center-main ...">` wrapping the `children` snippet.
- Spreads any additional HTML attributes onto the `<div>`.

## When to use it

- As the center slot inside `GrailLayout` to host the primary page content.
- When you need the `grail-layout-center-main` hook class for consumer CSS.

## When not to use it

- For the `<main>` landmark itself. Place a native `<main>` element inside this slot.
- Outside a `GrailLayout`. The layout slot classes are only meaningful paired with the rest of the Grail Layout.

## How to use it

Place as a direct child of `GrailLayout`, and nest a semantic `<main>` element inside for accessibility.

## Props

- `class` (string, optional) - CSS class appended after the base `grail-layout-center-main` class.
- `children` (Snippet, required) - Content for the center main slot.
- `...restProps` - Additional HTML attributes spread onto the `<div>`.

## Usage

```svelte
<script lang="ts">
    import GrailLayoutCenterMain from "./GrailLayoutCenterMain.svelte";
</script>

<GrailLayoutCenterMain>
    <main>
        <h1>Welcome</h1>
        <p>This is the primary content.</p>
    </main>
</GrailLayoutCenterMain>
```

```svelte
<script lang="ts">
    import GrailLayout from "../GrailLayout/GrailLayout.svelte";
    import GrailLayoutCenterMain from "./GrailLayoutCenterMain.svelte";
</script>

<GrailLayout>
    <GrailLayoutCenterMain><main>Primary content</main></GrailLayoutCenterMain>
</GrailLayout>
```

```svelte
<script lang="ts">
    import GrailLayoutCenterMain from "./GrailLayoutCenterMain.svelte";
</script>

<GrailLayoutCenterMain class="main-area" data-testid="grail-main">
    <main>
        <article>
            <h2>Article title</h2>
            <p>Body.</p>
        </article>
    </main>
</GrailLayoutCenterMain>
```

```svelte
<script lang="ts">
    import GrailLayoutCenterMain from "./GrailLayoutCenterMain.svelte";
    const posts = [
        { id: 1, title: "Post one" },
        { id: 2, title: "Post two" },
    ];
</script>

<GrailLayoutCenterMain>
    <main>
        <h2>Latest posts</h2>
        <ul>
            {#each posts as p}<li>{p.title}</li>{/each}
        </ul>
    </main>
</GrailLayoutCenterMain>
```

```svelte
<script lang="ts">
    import GrailLayoutCenterMain from "./GrailLayoutCenterMain.svelte";
</script>

<GrailLayoutCenterMain>
    <main aria-labelledby="page-heading">
        <h1 id="page-heading">Dashboard</h1>
        <p>Your metrics.</p>
    </main>
</GrailLayoutCenterMain>
```

## Accessibility

- The rendered element is a `<div>`, not `<main>`. Add a real `<main>` child to get the `main` landmark.
- A `SkipLink` should typically target the inner `<main>`'s id.
- No ARIA applied by this component.

## Related components

- `GrailLayout` - parent layout container.
- `GrailLayoutTopHeader`, `GrailLayoutLeftAside`, `GrailLayoutRightAside`, `GrailLayoutBottomFooter` - sibling slots.
- `ArticleLayout` - wrapper for article-scoped content.
- `SkipLink` - hidden link to jump to main content.
