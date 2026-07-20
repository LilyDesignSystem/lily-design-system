# Custom rendering

`ThemeSelect` exposes exactly one rendering escape hatch: a projected
`<ng-template>` that **replaces the glyph inside the trigger button**.

That is the whole surface, and the narrowness is deliberate. The
listbox — its `role`, its options, its `aria-selected` flags, its
`aria-activedescendant` wiring, its keyboard contract — is a custom
APG widget the component implements and tests. Letting consumers
re-render it would put the accessibility contract in their hands
every time, which is exactly what this helper exists to avoid.

So: the glyph is yours, the listbox is the component's.

## The basic form

Project an `<ng-template>` as the component's content. It replaces the
default `<span class="theme-select-icon" aria-hidden="true">◑</span>`
inside the button.

```html
<lily-theme-select label="Theme" [themesUrl]="url" [themes]="themes">
    <ng-template let-args>{{ args.labelFor(args.value) }}</ng-template>
</lily-theme-select>
```

The component queries the template with `contentChild(TemplateRef)`,
so *any* projected `<ng-template>` matches — no structural directive
or template reference name is required.

## The template context

The context is the exported `ChildArgs` type:

```ts
export type ChildArgs = {
    /** Currently selected theme slug. */
    value: string;
    /** Is the listbox open? */
    open: boolean;
    /** Resolve a slug to its display label. */
    labelFor: (theme: string) => string;
};
```

It is passed as `$implicit` **and** as named properties, so both
binding styles work:

```html
<!-- Whole object via $implicit -->
<ng-template let-args>{{ args.labelFor(args.value) }}</ng-template>

<!-- Individual named properties -->
<ng-template let-value="value" let-open="open" let-labelFor="labelFor">
    {{ labelFor(value) }}{{ open ? " ▴" : " ▾" }}
</ng-template>
```

Note what is *not* in the context: no `themes`, no `setTheme`. The
template renders the button's inside, not a list of choices, so it has
nothing to iterate and nothing to select. To read or write the
selection from outside, use `[(value)]` and `(themeChange)`.

## Typed `let-` variables with `ThemeSelectIcon`

By default `let-args` is implicitly `any`. Add the exported
`ThemeSelectIcon` marker directive to get `ChildArgs` typed under
`strictTemplates`:

```ts
import {
    ThemeSelect,
    ThemeSelectIcon,
} from "./lily-design-system-angular-theme-select";

@Component({
    selector: "app-settings",
    standalone: true,
    imports: [ThemeSelect, ThemeSelectIcon],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-theme-select
            label="Theme"
            themesUrl="/assets/themes/"
            [themes]="themes"
            [(value)]="theme"
        >
            <ng-template lilyThemeSelectIcon let-args>
                {{ args.labelFor(args.value) }}
            </ng-template>
        </lily-theme-select>
    `,
})
export class Settings {
    readonly themes = ["light", "dark", "abyss"];
    theme = signal("");
}
```

The directive's selector is `ng-template[lilyThemeSelectIcon]` and its
only member is an `ngTemplateContextGuard`. It exists for
type-checking and readability — the component's `contentChild` query
does not look for it, so a plain `<ng-template>` behaves identically at
runtime.

## Recipe: an inline SVG icon

The most common reason to override the glyph: the default `◑` depends
on platform font coverage, and may render at an odd weight or as tofu.
An inline SVG is under your control.

```html
<lily-theme-select label="Theme" [themesUrl]="url" [themes]="themes">
    <ng-template>
        <svg width="16" height="16" viewBox="0 0 16 16"
             aria-hidden="true" focusable="false">
            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" />
            <path d="M8 1a7 7 0 0 1 0 14z" fill="currentColor" />
        </svg>
    </ng-template>
</lily-theme-select>
```

Keep `aria-hidden="true"` and `focusable="false"` on the SVG. The
button's accessible name comes from `aria-label`; a named or
focusable graphic inside it only adds noise.

Note that `.theme-select-icon` is *not* rendered when a template is
projected, so any CSS you wrote against that hook no longer applies.
Style your own element, or add the class yourself.

## Recipe: showing the active theme in the button

The closed button shows only a glyph and never names the active theme
— see [accessibility.md](./accessibility.md#the-status-region-is-part-of-the-pattern).
One way to address that is to put the label in the button itself:

```html
<lily-theme-select label="Theme" [themesUrl]="url" [themes]="themes"
                   [(value)]="theme">
    <ng-template let-args>{{ args.labelFor(args.value) }}</ng-template>
</lily-theme-select>
```

Two things follow from this, and both matter:

1. The button is no longer icon-only, so it will be as wide as the
   longest label it displays. Budget layout space for it.
2. The button now has visible text *and* an `aria-label`. In the
   accessibility tree `aria-label` wins, so a voice-control user
   saying the visible words may fail to activate it. WCAG 2.5.3
   (Label in Name) wants the accessible name to contain the visible
   text. Either make `label` include what is displayed, or keep the
   glyph and use the separate status-region pattern instead.

The status region remains the recommended approach precisely because
it sidesteps both problems.

## Recipe: reflecting open state

`open` lets the glyph respond to the listbox:

```html
<lily-theme-select label="Theme" [themesUrl]="url" [themes]="themes">
    <ng-template let-args>
        <span [class.is-open]="args.open" aria-hidden="true">
            {{ args.open ? "▴" : "▾" }}
        </span>
    </ng-template>
</lily-theme-select>
```

For CSS-only cases you don't need the template at all — the button
already carries `aria-expanded`, so
`.theme-select-button[aria-expanded="true"]` is available as a
selector. See [styling.md](./styling.md).

## What the template cannot do

- **Render options.** The listbox and its `<li role="option">`
  children are component-owned. There is no per-option template.
- **Change the ARIA contract.** `aria-haspopup`, `aria-expanded`,
  `aria-controls`, `role="listbox"`, `aria-activedescendant`, and
  `aria-selected` are all emitted by the component regardless of what
  is projected.
- **Alter the keyboard contract.** The key handling lives on the
  button and the `<ul>`, not on projected content.
- **Opt out of the lifecycle.** Initial-value resolution, the managed
  `<link>` swap, `data-theme`, and persistence all run unchanged.

## If you need a different control entirely

If the icon-button-plus-listbox shape is wrong for your design — you
want a swatch grid, a segmented control, a radio group — don't fight
the template. Build your own control and reuse the pure helpers plus
the behavioural contract in
[spec/index.md §5](../spec/index.md#5-behaviour). The lifecycle is
about thirty lines:

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
} from "./lily-design-system-angular-theme-select";

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
                    {{ labelFor(theme) }}
                </button>
            }
        </div>
    `,
})
export class MyThemeSwatches {
    readonly label = input.required<string>();
    readonly themesUrl = input.required<string>();
    readonly themes = input.required<string[]>();
    readonly themeLabels = input<Record<string, string>>({});
    readonly value = model<string>("");
    readonly themeChange = output<string>();

    constructor() {
        effect(() => {
            const v = this.value();
            if (typeof document === "undefined" || !v) return;
            // managed link + data-theme writes (copy from theme-select.component.ts)
            // …
            this.themeChange.emit(v);
        });
    }

    labelFor(theme: string): string {
        return this.themeLabels()[theme] ?? theme;
    }

    setTheme(slug: string): void {
        this.value.set(slug);
    }
}
```

A lighter alternative: keep `ThemeSelect` mounted so it owns the
lifecycle, hide it visually, and have your own UI write to the same
signal.

```ts
@Component({
    standalone: true,
    imports: [ThemeSelect],
    template: `
        <lily-theme-select
            [label]="hiddenLabel"
            themesUrl="/assets/themes/"
            [themes]="themes"
            [(value)]="theme"
            className="sr-only"
        />

        <div role="group" [attr.aria-label]="groupLabel">
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
    readonly themes = ["light", "dark"];
    readonly hiddenLabel = "Theme";
    readonly groupLabel = "Theme swatches";
    theme = signal("");
}
```

Two controls now exist and a screen reader sees both — usually a bug.
Hide the helper from assistive technology with `aria-hidden="true"`
and `tabindex="-1"` on the host, or accept the duplication knowingly.

## Sharing the selection across components

To react to theme changes from elsewhere, hoist the signal into a
service:

```ts
@Injectable({ providedIn: "root" })
export class ThemeStore {
    readonly current = signal<string>("");
}
```

```ts
@Component({
    standalone: true,
    imports: [ThemeSelect],
    template: `
        <lily-theme-select
            label="Theme"
            themesUrl="/assets/themes/"
            [themes]="themes"
            [(value)]="store.current"
        />
    `,
})
export class Settings {
    readonly themes = ["light", "dark"];
    constructor(public store: ThemeStore) {}
}
```

Sibling components write to `store.current` from anywhere; the
select's `effect()` applies the theme in response.

---

Lily™ and Lily Design System™ are trademarks.
