## Svelte 5 + SvelteKit 2

### Architecture

- Svelte 5
- SvelteKit 2
- TypeScript
- Runes ($state, $derived, $props, $bindable)
- Vite
- Paraglide-JS for internationalization
- pnpm NOT npm
- [Storybook](https://storybook.js.org/)

### Component conventions

- Props use Svelte 5 `$props()` rune with TypeScript types
- Two-way binding uses `$bindable()`
- Derived values use `$derived()`
- Local state uses `$state()`
- Children slots use `Snippet` type with `{@render children()}`
- All styling is scoped within component `<style>` blocks
- All `{#each}` blocks must have a key expression
- Color palette comes from `AGENTS/theme.md`

### Testing stack

- **vitest** (not Jest) — `npm test` runs `vitest run`
- **@testing-library/svelte** — render and query
- **@testing-library/user-event** — user interaction simulation
- **jsdom** — DOM environment

### Testing matcher rules (CRITICAL)

Vitest built-in matchers ONLY. Never use jest-dom matchers:

```tsx
// CORRECT — vitest matchers
expect(el).toBeTruthy(); // element exists
expect(el).toBeNull(); // element doesn't exist
expect(el.getAttribute("role")).toBe("button"); // check attribute
expect(el.textContent).toContain("hello"); // check text
expect(button.disabled).toBe(true); // check property
expect(handleClick).toHaveBeenCalledOnce(); // check callback

// WRONG — jest-dom matchers (NEVER use)
expect(el).toBeInTheDocument();
expect(el).toHaveAttribute("role", "button");
expect(el).toHaveTextContent("hello");
expect(button).toBeDisabled();
```

### Quick start

```sh
pnpm install
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Scripts

| Command             | Description                     |
| ------------------- | ------------------------------- |
| `pnpm run dev`      | Start development server        |
| `pnpm run build`    | Build for production            |
| `pnpm run preview`  | Preview production build        |
| `pnpm test`         | Run all tests                   |
| `pnpm audit --fix`  | Audit dependencies and fix them |
