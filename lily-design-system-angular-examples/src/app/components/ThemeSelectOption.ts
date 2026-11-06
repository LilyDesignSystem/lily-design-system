import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ThemeSelectOption — one option in a theme select dropdown
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `theme-select-option` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-theme-select-option",
    standalone: true,
    template: `<option class="theme-select-option {{ className() }}" [value]="value()" [attr.selected]="selected() ? '' : null" [disabled]="disabled()"><ng-content /></option>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSelectOption {
    readonly value = input<string>("");
    readonly className = input<string>("");
    /** Whether this option is selected. */
    readonly selected = input<boolean>(false);
    /** Disables the option. */
    readonly disabled = input<boolean>(false);
}
