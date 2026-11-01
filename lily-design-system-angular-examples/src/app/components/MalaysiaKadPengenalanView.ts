import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MalaysiaKadPengenalanView — a read-only display of Malaysia's MyKad Number (NRIC)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `malaysia-kad-pengenalan-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-malaysia-kad-pengenalan-view",
    standalone: true,
    template: `<span class="malaysia-kad-pengenalan-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MalaysiaKadPengenalanView {
    /** Optional accessible label override (aria-label). */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
