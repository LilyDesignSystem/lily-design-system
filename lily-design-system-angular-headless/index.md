# Lily Design System - Angular Headless

A headless Angular 20 component library implementing the Lily Design System catalog (490 components).

Components are standalone, signal-based, zero-CSS, and ship semantic HTML + ARIA only. Consumers provide all styling via the kebab-case class hooks documented in `css-style-sheet-template.css`.

## Sibling implementations

- [Svelte headless](../lily-design-system-svelte-headless)
- [React headless](../lily-design-system-react-headless)
- [Vue headless](../lily-design-system-vue-headless)
- [Blazor headless](../lily-design-system-blazor-headless)
- [HTML headless](../lily-design-system-html-headless)
- [Nunjucks headless](../lily-design-system-nunjucks-headless)

## Quick start

```sh
pnpm install
pnpm test     # run vitest
pnpm build    # ng-packagr → dist/
```

## Consumer usage

```ts
import { Button, TextInput } from "lily-design-system-angular-headless";

@Component({
  standalone: true,
  imports: [Button, TextInput],
  template: `
    <lily-text-input label="Email" [(value)]="email" />
    <lily-button>Submit</lily-button>
  `,
})
export class MyForm {
  email = "";
}
```

See `AGENTS.md` for the full architecture, component pattern, testing conventions, and prohibitions.

## Status

Initial scaffold. Infrastructure (package.json, vitest, tsconfig, ng-packagr config) and the full 490-component catalog are in place. Each component is a standalone Angular 20 component with signal inputs and OnPush change detection.
