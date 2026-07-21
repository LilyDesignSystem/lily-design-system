# Conventions — Lily Angular Helpers

Working rules for every helper in this catalog. The
[shared/](./shared/) files inherit from the Lily-wide
`AGENTS/headless.md`, `internationalization.md`, and `theme.md`; this
file lists the Angular-specific decisions layered on top.

## File shape per helper

```
lily-design-system-angular-<name>/
├── spec/index.md                          ← single source of truth, numbered with §
├── AGENTS.md                        ← fast-index pointer for agents
├── AGENTS/                          ← per-helper topic agent files
│   ├── api.md
│   ├── lifecycle.md
│   ├── accessibility.md
│   ├── testing.md
│   └── ssr.md
├── CLAUDE.md                        ← `@AGENTS.md`
├── index.md                         ← comprehensive human-readable guide
├── index.ts                         ← barrel re-export
├── {kebab-name}.component.ts        ← standalone Angular 20 component
├── {kebab-name}.component.spec.ts   ← vitest spec
├── CHANGELOG.md
├── docs/                            ← topic-by-topic deep-dives
└── examples/                        ← runnable Angular component .ts files
```

## Component file shape

Every helper component follows this template:

```ts
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  model,
  output,
} from "@angular/core";

/** Pure helpers exported for consumer reuse. */
export function helperName() { /* … */ }

@Component({
  selector: "lily-{kebab-name}",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <root-element
      class="{base-class} {{ className() }}"
      role="..."
      [attr.aria-label]="label() || null"
    >
      @for (item of items(); track item) {
        <!-- per-item markup -->
      }
    </root-element>
  `,
})
export class HelperName {
  readonly label = input.required<string>();
  readonly items = input.required<string[]>();
  readonly value = model<string>("");
  readonly className = input<string>("");
  readonly someChange = output<string>();

  private initialised = false;

  constructor() {
    effect(() => {
      const current = this.value();
      if (!this.initialised) {
        this.initialised = true;
        // resolve initial value (props.value > storage > navigator > defaults)
        // if resolved !== current, this.value.set(resolved); return;
      }
      if (current) this.apply(current);
    });
  }
}
```

Notes on the template:

- Class hooks combine the static base class with a consumer-supplied
  signal via `{{ className() }}` interpolation. Trailing whitespace
  is trimmed by Angular.
- ARIA attributes are bound via `[attr.aria-label]="label() || null"`
  so the attribute is omitted (not emitted as the literal string
  `"null"`) when the consumer hasn't supplied a label.
- `@for` requires a `track` expression; use the value when items are
  primitives, or `$index` / a property when not.

## Signal inputs

| Type                                           | Use                                                      |
| ---------------------------------------------- | -------------------------------------------------------- |
| `input.required<T>()`                          | Required input. TypeScript compiler enforces it.         |
| `input<T>(defaultValue)`                       | Optional input with a default.                           |
| `input<T>()`                                   | Optional input; the signal returns `undefined` if unset. |
| `model<T>(defaultValue)`                       | Two-way bindable. Consumer uses `[(value)]="x"`.         |
| `output<T>()`                                  | Typed event emitter; consumer uses `(name)="…"`.         |

Signals are read by *calling* them — `label()` not `label.value` —
because Angular signals are functions. This is the only API you
need; manual `markForCheck()`, `ChangeDetectorRef`, or `NgZone`
calls never appear in helpers.

## Two-way binding

Use `model<string>("")` (with empty-string default) for the bindable
selection. The custom-named model (`value` rather than the default
`value`) keeps the API symmetric with the Svelte canonical's
`bind:value`:

```html
<lily-theme-chooser [(value)]="theme" ... />
```

The component reads via `this.value()` and writes via
`this.value.set(next)`. The `model()` signal also fires the
`valueChange` output automatically, so consumers can listen to
`(valueChange)="..."` for one-way data flow.

## Change handlers and template casts

None of the three current helpers needs this any more: all of them
render an icon button + listbox and handle `(click)` / `(keydown)`
with typed handler methods rather than reading `$event.target`
inline. The rule below still stands for any future helper that binds
a native input's value.

When reading the changed-input value inside a template event binding:

```html
<select
  (change)="onInputChange($any($event.target).value)"
>
  @for (item of items(); track item) {
    <option [value]="item">{{ labelFor(item) }}</option>
  }
</select>
```

The `$any()` form is **required**. Angular's template parser rejects
parenthesised TypeScript casts inside method calls:

```html
<!-- DOES NOT COMPILE -->
(change)="onInputChange(($event.target as HTMLInputElement).value)"
```

This is documented in the angular-headless README and reproduced
here because every helper in this catalog hits the same pattern.

## Class / style fall-through

Angular has no implicit attribute-spread mechanism (no `$attrs`, no
`...rest`). Each helper declares the root's class hook with
`class="{base} {{ className() }}"` so a consumer can pass
`className="my-extra"` and end up with both classes on the root.

Consumers wanting to forward additional `data-*` attributes or event
handlers attach them directly on the host:

```html
<lily-theme-chooser
  data-testid="theme-chooser"
  (click)="trackClick($event)"
  ...
/>
```

Angular forwards host bindings to the component's root element via
the host element itself; the consumer's bindings sit on the
`<lily-theme-chooser>` host tag, not on the inner `<select>`. CSS
selectors that target the helper's class hook (`.theme-chooser`) still
work because the inner root has that class.

## SSR

`effect()` runs in the browser only — the server doesn't tick the
reactive scheduler. Code inside `effect()` may still execute under
SSR if the consumer calls `signal.set(...)` synchronously during
render, so DOM-writing code paths gate on
`typeof document !== "undefined"`.

This guard is mandatory for every `document.*` access. Don't reach
for `@angular/common`'s `PLATFORM_ID` / `isPlatformBrowser` for
simple guards — the `typeof document` form is portable to plain
Angular CLI, Analog, Storybook, and unit-test contexts without an
injection.

## What never lives in the helper

- Bundled CSS, fonts, icons, or images.
- A locale-aware default for `label` / `placeholder` / `error`.
- Routing, data fetching, persistence wrappers, network calls.
- Animations or transitions.

Everything visual and locale-specific is the consumer's. See
[`shared/headless-principles.md`](./shared/headless-principles.md).

## Naming

- **Selector**: `lily-{kebab-name}` — e.g. `lily-theme-chooser`,
  `lily-locale-chooser`. The `lily-` prefix avoids collisions with
  consumer components.
- **Class hooks** on the inner root are kebab-case derivatives of
  the file name: `theme-chooser`, `theme-chooser-option`,
  `locale-chooser`, `locale-chooser-option` (locale options also carry
  a `lang` attribute).
- **Data attributes** the consumer / CSS may want to observe use
  `data-*` (e.g. `data-theme`, `data-lily-theme-chooser`).
- **Don't introduce new ARIA attributes** — use the platform's.

## What we don't use

- **`@Input()` / `@Output()` decorators.** Replaced by `input()` /
  `output()` factory functions in Angular 17+. The helpers use the
  signal-based factories exclusively.
- **`@ViewChild` / `@ContentChild`.** Replaced by `viewChild()` /
  `contentChild()` factory functions when needed. Neither helper
  currently uses them, but if a future helper does, prefer the
  factory form.
- **NgModules.** Standalone components only.
- **`templateUrl` / `styleUrls`.** Template-inline only. The helpers
  ship no CSS, so `styles` / `styleUrls` have no use case.
- **`ngOnInit` / `ngOnDestroy`.** Replaced by `effect()` for
  reactive side-effects and `destroyRef.onDestroy(...)` for cleanup
  when needed. None of the current helpers need explicit teardown.
- **RxJS.** `effect()` and the signal graph cover every reactive
  scenario the helpers face. Consumers wiring to RxJS-backed stores
  read the model signal via `.subscribe()` or use Angular's
  `toObservable()` / `toSignal()` adapters in their own code.
