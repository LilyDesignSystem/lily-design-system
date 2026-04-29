# Lily tutorial for React

This tutorial walks through using Lily's React headless components in a fresh
Next.js 15 app.

## What you'll build

A Next.js route at `/` with a Lily Button and Lily Alert composition that
toggles the alert when the button is clicked.

## Prerequisites

- Node.js 20+ and pnpm.
- Familiarity with React 19 functional components and TypeScript.

## Step 1 — Create a Next.js app

```sh
pnpm create next-app@latest my-lily-app --ts --eslint --app --no-src-dir --no-tailwind --no-import-alias
cd my-lily-app
```

## Step 2 — Vendor the Lily React headless source

Lily isn't on npm yet. Clone alongside your app:

```sh
cd ..
git clone https://github.com/LilyDesignSystem/lily-design-system-react-headless
cd my-lily-app
```

Then in `tsconfig.json`, add a path alias:

```json
{
  "compilerOptions": {
    "paths": {
      "lily/*": ["../lily-design-system-react-headless/components/*"]
    }
  }
}
```

## Step 3 — Use components in a page

Replace `app/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import Button from "lily/Button";
import Alert from "lily/Alert";

export default function HomePage() {
  const [saved, setSaved] = useState(false);

  return (
    <main>
      <h1>Hello, Lily.</h1>
      {saved && <Alert role="status">Saved successfully.</Alert>}
      <Button onClick={() => setSaved(true)}>Save</Button>
    </main>
  );
}
```

## Step 4 — Add styles

Replace `app/globals.css`:

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

Lily renders the Button as `<button class="button">` and the Alert as
`<div class="alert" role="alert">`. Your CSS targets the kebab-case classes.

## Step 5 — Run the dev server

```sh
pnpm dev
```

Open `http://localhost:3000`. Click **Save** — the alert appears.

## Step 6 — Test it

Add Vitest:

```sh
pnpm add -D vitest @testing-library/react @testing-library/dom jsdom
```

Create `app/page.test.tsx`:

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import HomePage from "./page";

test("clicking Save shows the alert", () => {
  render(<HomePage />);
  expect(screen.queryByRole("alert")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: /save/i }));
  expect(screen.getByRole("alert")).toBeTruthy();
});
```

Run with `pnpm vitest`. Lily's tests use Vitest's built-in matchers — no
`jest-dom`.

## What you got for free

- TypeScript-typed React component with sensible default props.
- A real `<button>` element with proper keyboard handling.
- `role="alert"` for screen reader announcements.
- Translatable labels — no hardcoded English.

## Where to go next

- Try a styled example: clone
  `lily-design-system-react-next-examples` and run `pnpm dev`.
- Browse the [component catalog](../../components/) for every pattern.
