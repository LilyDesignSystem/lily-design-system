/*
    Example 5 — Custom rendering workaround.

    The v0.1.0 ThemeSelect doesn't yet expose a content-projection
    slot, so this example illustrates the recommended workaround:
    a sibling button group that writes to the same `theme` signal the
    select reads via `[(value)]`. The select is visually hidden but
    still owns the lifecycle.

    A future revision will expose <ng-content> + <ng-template>
    projection; see docs/custom-rendering.md for the planned API.
*/
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { ThemeSelect } from "../theme-select.component";

@Component({
    selector: "example-custom-rendering",
    standalone: true,
    imports: [ThemeSelect],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <!-- The select owns the lifecycle; we hide its UI. -->
        <lily-theme-select
            label="Theme (hidden)"
            themesUrl="/assets/themes/"
            [themes]="themes"
            [(value)]="theme"
            className="sr-only"
        />

        <!-- Custom swatch UI bound to the same signal. -->
        <div role="group" aria-label="Theme swatches" class="my-swatch-row">
            @for (t of themes; track t) {
                <button
                    type="button"
                    class="my-swatch"
                    [attr.data-theme]="t"
                    [attr.aria-pressed]="theme() === t"
                    (click)="theme.set(t)"
                >
                    {{ t }}
                </button>
            }
        </div>
    `,
})
export class CustomRenderingExample {
    readonly themes = ["light", "dark", "abyss", "cupcake", "dracula"];
    theme = signal("");
}
