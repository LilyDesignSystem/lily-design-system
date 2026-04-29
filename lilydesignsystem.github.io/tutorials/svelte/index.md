# Lily tutorial for SvelteKit

This tutorial walks through wiring Lily's Svelte 5 headless components into a
fresh SvelteKit app.

## What you'll build

A SvelteKit route at `/` with a Lily Button and Lily Alert composition that
toggles when the button is clicked.

## Prerequisites

- Node.js 20+ and pnpm.
- Familiarity with SvelteKit and Svelte 5 runes.

## Step 1 — Create a SvelteKit app

```sh
pnpm create svelte@latest my-lily-app
cd my-lily-app
pnpm install
```

Pick **Skeleton project**, **TypeScript**, and any tooling you like.

## Step 2 — Add the Lily Svelte headless source

Lily isn't on npm yet, so vendor the components. Clone alongside your app:

```sh
cd ..
git clone https://github.com/LilyDesignSystem/lily-design-system-svelte-headless
cd my-lily-app
```

Then in `svelte.config.js`, add an alias so imports resolve:

```js
import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import path from "node:path";

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      "lily/*": path.resolve("../lily-design-system-svelte-headless/components/*"),
    },
  },
};
```

## Step 3 — Use components in a route

Replace `src/routes/+page.svelte`:

```svelte
<script lang="ts">
  import Button from "lily/Button/Button.svelte";
  import Alert from "lily/Alert/Alert.svelte";

  let saved = $state(false);
  const save = () => { saved = true; };
</script>

<main>
  <h1>Hello, Lily.</h1>

  {#if saved}
    <Alert role="status">Saved successfully.</Alert>
  {/if}

  <Button onclick={save}>Save</Button>
</main>

<style>
  main { max-width: 32rem; margin: 4rem auto; padding: 0 1rem; }

  :global(.button) {
    padding: 0.5rem 1rem;
    background: #2563eb;
    color: #fff;
    border: 0;
    border-radius: 0.375rem;
    cursor: pointer;
  }
  :global(.alert) {
    padding: 0.75rem 1rem;
    background: #ecfdf5;
    color: #065f46;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }
</style>
```

Lily renders the Button as `<button class="button">` and the Alert as
`<div class="alert" role="alert">`. The `:global(...)` selectors target those
classes from your scoped style block.

## Step 4 — Run the dev server

```sh
pnpm dev
```

Open `http://localhost:5173`. Click **Save** — the alert appears.

## Step 5 — Test it

SvelteKit ships with Vitest. Add a component test in
`src/routes/page.test.ts`:

```ts
import { render, screen, fireEvent } from "@testing-library/svelte";
import Page from "./+page.svelte";

test("clicking Save shows the alert", async () => {
  render(Page);
  expect(screen.queryByRole("alert")).toBeNull();
  await fireEvent.click(screen.getByRole("button", { name: /save/i }));
  expect(screen.getByRole("alert")).toBeTruthy();
});
```

Run with `pnpm test`. Lily's tests use Vitest's built-in matchers — no
`jest-dom`.

## What you got for free

- Semantic Svelte 5 component using runes (`$state`).
- Real `<button>` element with proper keyboard handling.
- `role="alert"` for screen reader announcements.
- All labels and props are translatable — no hardcoded English.

## Where to go next

- Try a styled example: clone
  `lily-design-system-svelte-sveltekit-examples` and run `pnpm dev`.
- Browse the [component catalog](../../components/) for every available
  pattern.
