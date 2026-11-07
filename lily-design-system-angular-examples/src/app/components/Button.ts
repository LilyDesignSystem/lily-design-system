import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Button — a generic clickable button element
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `button` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-button",
    standalone: true,
    template: `<button
        class="button {{ className() }}"
        [attr.type]="type()"
        [disabled]="disabled()"
        [attr.aria-pressed]="pressed() ?? null"
        [attr.aria-label]="label() || null"
    >
        <ng-content />
    </button>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
    /** Optional aria-label override. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The button type: "submit" submits its form. */
    readonly type = input<"button" | "submit" | "reset">("button");
    /** Disables the button. */
    readonly disabled = input<boolean>(false);
    /** Toggle state, for a button that stays pressed. Unset is not a toggle. */
    readonly pressed = input<boolean | undefined>(undefined);
}
