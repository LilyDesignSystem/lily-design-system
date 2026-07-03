# Lily Design System - Angular Headless

@AGENTS/lily.md
@AGENTS/components.md
@AGENTS/accessibility.md
@AGENTS/internationalization.md
@AGENTS/headless.md
@AGENTS/theme.md
@AGENTS/nhs-uk-design-system-references.md

## Metadata

- Package: lily-design-system-angular-headless
- Version: 0.1.0
- Created: 2026-05-28
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- Contact: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Project overview

A headless Angular component library that mirrors the canonical
`components.tsv` catalog (490 components). Components are standalone,
zero-CSS, signal-based, and use Angular 20's OnPush change detection.

## IMPORTANT architecture

- Angular 20 (signals, control-flow blocks, deferable views, standalone-by-default)
- Standalone components only — no NgModules
- Signal inputs / outputs (`input()`, `output()`, `model()`)
- `ChangeDetectionStrategy.OnPush` on every component
- Inline templates (no separate `.html` files)
- No CSS, no styles — components ship semantic HTML + ARIA only
- Flat-file layout: `components/{Pascal}.ts` + `.spec.ts` + `.md`
- TypeScript with `strict` and `strictTemplates`

## STRICT prohibitions

- No NgModules (standalone components only)
- No `@HostBinding` decorator (use the `host:` metadata field)
- No CSS / no styles / no Tailwind / no Angular Material
- No images, icons, or fonts
- No hardcoded user-facing strings
- Components themselves are zoneless-compatible; the test runtime
  still uses zone.js for ChangeDetection scheduling.

## Component pattern

Every component follows the same shape:

```ts
import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "lily-button",
  standalone: true,
  template: `<button class="button {{ className() }}" type="button" [attr.aria-label]="label() || null"><ng-content /></button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  /** Accessible label override (optional). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the kebab-case base class. */
  readonly className = input<string>("");
}
```

- The kebab-case base class (`.button`) is fixed in the template.
- Consumer-supplied `className` is appended via string interpolation.
- All ARIA + native attributes are explicit and minimal.

## Two-way binding pattern

For input-like components that need bindable values:

```ts
import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

@Component({
  selector: "lily-text-input",
  standalone: true,
  template: `<input class="text-input {{ className() }}" type="text" [attr.aria-label]="label()" [value]="value()" (input)="value.set(($event.target as HTMLInputElement).value)" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInput {
  readonly label = input<string>("");
  readonly className = input<string>("");
  readonly value = model<string>("");
}
```

Consumer template uses `[(value)]="x"` for two-way binding.

## Testing

### Stack

- Vitest (matches the other Lily headless libraries)
- `@analogjs/vite-plugin-angular` compiles `.ts` + inline templates
- jsdom for the DOM environment
- TestBed + ComponentFixture for component-level assertions

### Matcher rules (CRITICAL)

Vitest built-in matchers only. No `@testing-library/jest-dom` style sugar:

```ts
// CORRECT
expect(el).toBeTruthy();
expect(el.getAttribute("aria-label")).toBe("Submit");
expect(el.classList.contains("button")).toBe(true);

// WRONG
expect(el).toBeInTheDocument();
expect(el).toHaveAttribute("aria-label", "Submit");
```

### Test file pattern

```ts
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Button } from "./Button";

describe("Button", () => {
  test("renders a button with the base class", () => {
    const fixture = TestBed.createComponent(Button);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.button");
    expect(el).toBeTruthy();
  });

  test("appends the className input", () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentRef.setInput("className", "primary");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.button.primary");
    expect(el).toBeTruthy();
  });
});
```

## Build

`pnpm build` runs `ng-packagr` which produces Angular Package Format
(APF) output in `dist/`: ESM, type declarations, and a package.json
exports map. Consumers install the package and import directly:

```ts
import { Button } from "lily-design-system-angular-headless";
```

## File structure

```
components/                — one .ts + .spec.ts + .md per component (× 490)
  Accordion*.ts
  ActionBar.ts
  …
  Button.ts
  …
index.ts                   — re-exports every component
package.json
tsconfig.json
tsconfig.spec.json
ng-package.json            — ng-packagr config
vitest.config.ts
vitest-setup.ts
```

## Selector convention

Each component declares `selector: "lily-{kebab-slug}"`. Consumer
templates use the dashed form. Where the component is just a styled
wrapper around a native element, the template renders that native
element with the appropriate class hook; the wrapper `<lily-*>`
element is invisible (it has no styles, defaults to inline-display).
