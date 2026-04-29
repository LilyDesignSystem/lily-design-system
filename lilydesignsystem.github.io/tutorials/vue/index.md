# Lily tutorial for Vue

This tutorial walks through using Lily's Vue 3 headless components in a fresh
Nuxt 3 app.

## What you'll build

A Nuxt route at `/` with a Lily Button and Lily Alert composition that toggles
the alert when the button is clicked.

## Prerequisites

- Node.js 20+ and pnpm.
- Familiarity with Vue 3 `<script setup>` and the Composition API.

## Step 1 — Create a Nuxt app

```sh
pnpm dlx nuxi@latest init my-lily-app
cd my-lily-app
pnpm install
```

## Step 2 — Vendor the Lily Vue headless source

Lily isn't on npm yet. Clone alongside your app:

```sh
cd ..
git clone https://github.com/LilyDesignSystem/lily-design-system-vue-headless
cd my-lily-app
```

Add an alias in `nuxt.config.ts`:

```ts
import path from "node:path";

export default defineNuxtConfig({
  alias: {
    lily: path.resolve(__dirname, "../lily-design-system-vue-headless/components"),
  },
});
```

## Step 3 — Use components in a page

Create `pages/index.vue`:

```vue
<script setup lang="ts">
import Button from "lily/Button.vue";
import Alert from "lily/Alert.vue";

const saved = ref(false);
const save = () => { saved.value = true; };
</script>

<template>
  <main>
    <h1>Hello, Lily.</h1>
    <Alert v-if="saved" role="status">Saved successfully.</Alert>
    <Button @click="save">Save</Button>
  </main>
</template>
```

Enable file-based routing by enabling `pages/` in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  pages: true,
});
```

## Step 4 — Add styles

Create `assets/main.css`:

```css
:root {
  --color-primary: #2563eb;
}
body { font: 16px/1.5 system-ui, sans-serif; color: #111827; }
main { max-width: 32rem; margin: 4rem auto; padding: 0 1rem; }

.button {
  padding: 0.5rem 1rem;
  background: var(--color-primary);
  color: #fff;
  border: 0;
  border-radius: 0.375rem;
  cursor: pointer;
}
.alert {
  padding: 0.75rem 1rem;
  background: #ecfdf5;
  color: #065f46;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}
```

Register it in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  css: ["~/assets/main.css"],
});
```

## Step 5 — Run the dev server

```sh
pnpm dev
```

Open `http://localhost:3000`. Click **Save** — the alert appears.

## Step 6 — Test it

Add Vitest and Vue Testing Library:

```sh
pnpm add -D vitest @testing-library/vue @testing-library/dom jsdom
```

Create `pages/index.test.ts`:

```ts
import { render, screen, fireEvent } from "@testing-library/vue";
import IndexPage from "./index.vue";

test("clicking Save shows the alert", async () => {
  render(IndexPage);
  expect(screen.queryByRole("alert")).toBeNull();
  await fireEvent.click(screen.getByRole("button", { name: /save/i }));
  expect(screen.getByRole("alert")).toBeTruthy();
});
```

Run with `pnpm vitest`. Lily uses Vitest's built-in matchers — no `jest-dom`.

## What you got for free

- Vue 3 SFC using `<script setup>` and the Composition API.
- A real `<button>` element with proper keyboard handling.
- `role="alert"` for screen reader announcements.
- Translatable labels — no hardcoded English.

## Where to go next

- Try a styled example: clone
  `lily-design-system-vue-nuxt-examples` and run `pnpm dev`.
- Browse the [component catalog](../../components/) for every pattern.
