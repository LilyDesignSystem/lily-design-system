<svelte:head>
  <title>Copy components with shadcn — Lily Design System</title>
  <meta name="description" content="Copy Lily's React headless components into your project with npx shadcn add @lily/<slug>, and what a copy costs: it never receives Lily's fixes." />
</svelte:head>

<section class="page-intro">
  <h1>Copy components with shadcn</h1>
  <p class="page-intro-tagline">
    Lily publishes its React headless components as a shadcn registry, so
    <code>npx shadcn add @lily/button</code> copies a component, and any
    Lily component it imports, into your project as your own code.
  </p>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>When to copy, and when to install</h2>
  <p>
    Copying gives you the source to edit. Installing
    <code>@lilydesignsystem/react-headless</code> gives you updates. Pick one
    per component: a copy is a fork. Lily's own
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/RFC.md">RFC 8</a>
    asks whether copying should be the primary path at all, because a copy
    does not receive fixes.
  </p>

  <h2>Step 1 — Add the Lily registry to components.json</h2>
  <p>
    The shadcn CLI (version 3 or later) reads namespaced registries from your
    project's <code>components.json</code>. Add Lily under the name
    <code>@lily</code>; the items refer to each other by that name.
  </p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0"><code>{`{
  "$schema": "https://ui.shadcn.com/schema.json",
  "rsc": true,
  "tsx": true,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  },
  "registries": {
    "@lily": "https://lilydesignsystem.com/r/react/{name}.json"
  }
}`}</code></pre>
  <p>
    A project that already ran <code>npx shadcn init</code> only needs the
    <code>registries</code> entry. Lily's components use no Tailwind and no
    shadcn utilities; the CLI needs <code>components.json</code> only to know
    where your components directory is.
  </p>

  <h2>Step 2 — Add components</h2>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0"><code>{`npx shadcn@latest add @lily/button
npx shadcn@latest add @lily/dialog @lily/scroller`}</code></pre>
  <p>
    Each item is the component's slug, as in the
    <a href="/components/">component list</a>. Files land in one directory,
    <code>components/lily/</code> (under <code>src/</code> if your project
    has one), so the components' relative imports keep working:
    <code>@lily/scroller</code> also copies <code>ScrollerBase.tsx</code>,
    which it imports, and a component that uses a shared helper module (such
    as <code>form-reset.ts</code>) brings that module too. No npm package is
    installed; Lily's React components need only React.
  </p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0"><code>{`import Button from "@/components/lily/Button";

export function SaveBar() {
  return <Button onClick={save}>Save</Button>;
}`}</code></pre>
  <p>
    Components that use React hooks start with <code>"use client"</code>, so
    they work in the Next.js App Router; the rest stay server components.
    Each file keeps its header comment (props, keyboard, ARIA), moved below
    the directive or the imports, because the shadcn CLI drops comments that
    lead a file. Style the components with your own CSS against their class
    hooks, or with one of Lily's <a href="/tutorials/theming/">themes</a>.
  </p>

  <h2>The registry</h2>
  <ul>
    <li>
      <code>https://lilydesignsystem.com/r/react/registry.json</code> lists
      every item (607 components and the shared helper modules) in shadcn's
      <a href="https://ui.shadcn.com/docs/registry/registry-json">registry.json</a>
      schema.
    </li>
    <li>
      <code>https://lilydesignsystem.com/r/react/&lbrace;slug&rbrace;.json</code>
      is one
      <a href="https://ui.shadcn.com/docs/registry/registry-item-json">registry item</a>,
      with the file's content inlined. You can also add one by URL, with no
      <code>components.json</code> entry:
      <code>npx shadcn add https://lilydesignsystem.com/r/react/button.json</code>
      (an item with a dependency still needs the <code>@lily</code> entry).
    </li>
    <li>
      <code>https://lilydesignsystem.com/r/&lbrace;slug&rbrace;.json</code>,
      without <code>react/</code>, is a different file: Lily's own
      per-component metadata (ARIA, keyboard, props, related components). It
      is not a shadcn item.
    </li>
  </ul>
  <p>
    The registry is generated from the React headless source by
    <code>bin/generate-registries</code>, and CI runs
    <code>npx shadcn add</code> against it into a fresh Next.js app on every
    change.
  </p>

  <h2>What copying costs</h2>
  <p>
    A copied component is your code from the moment it lands. Lily cannot
    reach it again:
  </p>
  <ul>
    <li>
      <strong>No updates.</strong> An accessibility fix to Lily's Dialog next
      year never reaches the Dialog you copied this year. Running
      <code>npx shadcn add @lily/dialog</code> again offers to overwrite your
      file with the new version, which discards your edits; there is no merge.
    </li>
    <li>
      <strong>You own the tests.</strong> Lily's tests and stories stay in
      Lily. A copy is checked only by the tests you write for it.
    </li>
    <li>
      <strong>Track what you copied.</strong> Watch Lily's
      <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/CHANGELOG.md">CHANGELOG</a>
      for the components you hold, and diff your copy against the current
      item when one changes.
    </li>
  </ul>
  <p>
    If you do not need to edit a component, install the package instead and
    receive fixes with every upgrade. See the <a href="/tutorials/react/">React tutorial</a>.
  </p>

  <h2>Svelte and Vue</h2>
  <p>
    Only React is published as a shadcn registry so far. shadcn-svelte and
    shadcn-vue each define their own registry schema, and Lily has not yet
    tested its items with their CLIs. For Svelte and Vue, install the
    headless package or copy the component file from the repository.
  </p>
</section>
