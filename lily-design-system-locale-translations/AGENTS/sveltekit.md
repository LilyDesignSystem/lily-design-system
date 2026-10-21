## Svelte 5 + SvelteKit 2

### Architecture

- Svelte 5 with runes (`$state`, `$derived`, `$props`, `$bindable`, `$effect`)
- SvelteKit 2 (used by the example subproject; the headless subproject ships components only and does NOT depend on SvelteKit)
- TypeScript everywhere
- Vite as the build tool
- pnpm (not npm)
- Internationalisation is the consumer's concern — components accept text via props, no i18n library is bundled (no Paraglide, no svelte-i18n)

### Component conventions

- Props use Svelte 5 `$props()` rune with TypeScript types
- Two-way binding uses `$bindable()`
- Derived values use `$derived()`
- Local state uses `$state()`
- Children slots use `Snippet` type with `{@render children?.()}` (the optional invocation form so missing children don't throw)
- Headless components do NOT include `<style>` blocks — consumers provide all CSS. Style scoping only applies inside the example subproject.
- All `{#each}` blocks must have a key expression
- Color palette comes from `AGENTS/theme.md`

### Testing stack

- **vitest** (not Jest) — `pnpm test` runs `vitest run`
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
