# Lily Design System™ - Angular Headless

A headless Angular component library (Angular 20–22 peer range) implementing the Lily Design System catalog (609 components).

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
import { Button, TextInput } from "@lilydesignsystem/angular-headless";

@Component({
  standalone: true,
  imports: [Button, TextInput],
  template: `
    <lily-text-input
      label="Email"
      [(value)]="email"
    />
    <lily-button>Submit</lily-button>
  `,
})
export class MyForm {
  email = "";
}
```

See `AGENTS.md` for the full architecture, component pattern, testing conventions, and prohibitions.

## Keyboard

Native elements are keyboard-operable by default. The Arrow, Home/End, Escape and similar patterns (WAI-ARIA APG) are
implemented, ported from the Svelte reference, in the 23 components whose `AGENTS.md` names them: `ColorPicker`,
`ContextMenu`, `Dial`, `Dialog`, `Drawer`, `DropdownMenu`, `Editable`, `EditableForm`, `HorizontalScroller`, `Menu`,
`MenuBar`, `PinInputDiv`, `Sheet`, `SlideOutDrawer`, `SwitchButton`, `TabBar`, `TaskBar`, `TileMap`, `ToggleButton`,
`ToolBar`, `Tour`, `TourList`, `TreeList`, each with key tests; and `Listbox` (the shared listbox machine). The
popover menus (`SplitButton`, `ActionGroup`, `DropdownMenu`, `ContextMenu`) get Escape and light dismiss from the
browser's `popover="auto"`. Other components rely on native element behaviour.

## Status

Complete and published: all 609 catalog components as standalone, signal-based, OnPush Angular components (peer range Angular `>=20 <23`), each with a vitest spec and a Storybook story. Version 0.5.0.

---

Lily™ and Lily Design System™ are trademarks.
