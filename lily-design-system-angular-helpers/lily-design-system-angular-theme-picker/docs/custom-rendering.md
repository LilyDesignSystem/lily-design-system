# Custom rendering

Today the `ThemePicker` renders the default radio markup
unconditionally. The bound contract (one `<fieldset
role="radiogroup">` containing one `<label>` per slug, each with a
native `<input type="radio">`) is what every accessibility test
relies on.

A future revision will expose customisable rendering via two
Angular patterns. This page documents both so consumers and
contributors can plan ahead, and explains the v0.1.0 workaround.

## Future pattern 1 — `<ng-content>` projection

The picker's `<fieldset>` will accept projected content. Consumers
will pass their own option markup as children, and the picker will
own only the radiogroup container plus the `effect()`-driven
lifecycle.

```html
<!-- Future API sketch — not implemented in v0.1.0 -->
<lily-theme-picker label="Theme" themesUrl="/t/" [themes]="['light','dark']">
    <ng-template let-theme let-value="value" let-setTheme="setTheme">
        <button
            type="button"
            class="theme-picker-swatch"
            [attr.data-theme]="theme"
            [attr.aria-pressed]="value === theme"
            (click)="setTheme(theme)"
        >
            {{ theme }}
        </button>
    </ng-template>
</lily-theme-picker>
```

The consumer's template would receive the same args the Svelte
canonical snippet exposes: `{ themes, value, setTheme, name,
labelFor }`. The picker's `<fieldset role="radiogroup">` would still
wrap the projected content so group semantics are preserved.

## Future pattern 2 — `@ContentChild(TemplateRef)`

For repeated content, an `@ContentChild` query against a named
template will give the picker an `ng-template` it can stamp out per
slug:

```html
<!-- Future API sketch -->
<lily-theme-picker
    label="Theme"
    themesUrl="/t/"
    [themes]="['light','dark']"
>
    <ng-template
        #option
        let-theme
        let-value="value"
        let-setTheme="setTheme"
        let-labelFor="labelFor"
    >
        <label class="my-radio" [class.is-active]="value === theme">
            <input
                type="radio"
                [value]="theme"
                [checked]="value === theme"
                (change)="setTheme(theme)"
            />
            <span class="my-radio-label">{{ labelFor(theme) }}</span>
        </label>
    </ng-template>
</lily-theme-picker>
```

This pattern mirrors how `CdkTable` and `NgxDatatable` expose
per-row templates today.

## The v0.1.0 workaround

Until either projection pattern lands, consumers needing bespoke
rendering have two options:

### Option A — Subclass / wrap

Build a thin wrapper component around the picker's pure helpers
(`normaliseThemesUrl`, `themeHref`) and the behavioural contract in
[spec.md §5](../spec.md#5-behaviour). Re-implement the markup with
your preferred elements; the lifecycle is ~30 lines of code:

```ts
import {
    ChangeDetectionStrategy,
    Component,
    effect,
    input,
    model,
    output,
} from "@angular/core";
import {
    normaliseThemesUrl,
    themeHref,
} from "./lily-design-system-angular-theme-picker";

@Component({
    selector: "my-theme-swatches",
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="my-theme-swatches" role="group" [attr.aria-label]="label()">
            @for (theme of themes(); track theme) {
                <button
                    type="button"
                    class="my-theme-swatch"
                    [attr.data-theme]="theme"
                    [attr.aria-pressed]="value() === theme"
                    (click)="setTheme(theme)"
                >
                    {{ theme }}
                </button>
            }
        </div>
    `,
})
export class MyThemeSwatches {
    readonly label = input.required<string>();
    readonly themesUrl = input.required<string>();
    readonly themes = input.required<string[]>();
    readonly value = model<string>("");
    readonly themeChange = output<string>();

    constructor() {
        effect(() => {
            const v = this.value();
            if (typeof document === "undefined" || !v) return;
            // managed link + data-theme writes (copy from theme-picker.component.ts)
            // …
            this.themeChange.emit(v);
        });
    }

    setTheme(slug: string): void {
        this.value.set(slug);
    }
}
```

### Option B — Render the picker hidden + a custom UI sibling

Keep the picker mounted (so it owns the lifecycle) but visually
hide its `<fieldset>`. Add your own button group that writes to the
same signal:

```ts
@Component({
    standalone: true,
    imports: [ThemePicker],
    template: `
        <!-- Hidden but accessible — the picker still owns the lifecycle. -->
        <lily-theme-picker
            label="Theme"
            themesUrl="/assets/themes/"
            [themes]="themes"
            [(value)]="theme"
            class="sr-only"
        />

        <!-- Your custom UI -->
        <div role="group" aria-label="Theme swatches">
            @for (t of themes; track t) {
                <button
                    type="button"
                    [attr.aria-pressed]="theme() === t"
                    (click)="theme.set(t)"
                >{{ t }}</button>
            }
        </div>
    `,
})
export class Custom {
    themes = ["light", "dark"];
    theme = signal("");
}
```

Both your buttons and the hidden picker share the `theme` signal,
so the picker's `effect()` applies the theme whenever your buttons
write to it. Two accessible groups exist, but a screen reader sees
both — usually a bug. Hide one from AT with
`aria-hidden="true"` plus `tabindex="-1"` on each radio.

### Option C — Two-way binding to a shared signal

If you only need to react to the picker's `themeChange` from a
sibling component, hoist the `theme` signal to a service:

```ts
@Injectable({ providedIn: "root" })
export class ThemeStore {
    readonly current = signal<string>("");
}
```

```ts
@Component({
    imports: [ThemePicker],
    template: `
        <lily-theme-picker
            label="Theme"
            themesUrl="/assets/themes/"
            [themes]="['light', 'dark']"
            [(value)]="store.current"
        />
    `,
})
export class Settings {
    constructor(public store: ThemeStore) {}
}
```

Sibling components write to `store.current` from anywhere; the
picker reacts via its `effect()`.

## What the projection / template patterns won't change

- The `<fieldset role="radiogroup">` will remain the picker's
  outermost element so screen readers always hear the group name.
- The `effect()` lifecycle (initial-value resolution + apply) will
  stay inside the picker; consumers will not be able to opt out of
  it.
- The `data-theme` / managed-`<link>` contract will not move.

The projection slot is purely a markup escape hatch; it does not
change the behavioural contract.
