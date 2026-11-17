import { ChangeDetectionStrategy, Component, OnInit, input, model } from "@angular/core";
import { warnMissingName, warnMissingProp } from "./dev-warning";

let nextSignatureId = 0;

/**
 * SignaturePad — a drawing area for capturing a handwritten signature
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `signature-pad` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-signature-pad",
    standalone: true,
    template: `<div
        class="signature-pad {{ className() }}"
        role="group"
        [attr.aria-label]="label() || null"
        [attr.aria-describedby]="attestation() ? uid + '-attestation' : null"
        [attr.data-outcome]="outcome() || null"
    >
        @if (attestation()) {
            <p class="signature-pad-attestation" [id]="uid + '-attestation'">{{ attestation() }}</p>
        }
        <ng-content />
        @if (typedNameLabel()) {
            <p class="signature-pad-typed">
                <label [attr.for]="uid + '-typed'">{{ typedNameLabel() }}</label>
                <input
                    [id]="uid + '-typed'"
                    type="text"
                    autocomplete="name"
                    [attr.name]="name() || null"
                    [value]="typedName()"
                    (input)="typedName.set($any($event.target).value)"
                />
            </p>
        }
        @if (outcome() && outcomeLabel()) {
            <p class="signature-pad-outcome">{{ outcomeLabel() }}</p>
        }
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignaturePad implements OnInit {
    readonly label = input<string>("");
    /** What the signer confirms, in the consumer's words; shown first and the group's accessible description. */
    readonly attestation = input<string>("");
    /** The signature's outcome; rendered as data-outcome, with outcomeLabel as its words. */
    readonly outcome = input<
        "signed" | "declined" | "unable" | "verbal" | "on-paper" | "pending" | "revoked" | ""
    >("");
    /** The outcome in the consumer's words; required with outcome. */
    readonly outcomeLabel = input<string>("");
    /** Adds a typed-name field with this label, so a signature can be given by keyboard alone (WCAG 2.1.1). */
    readonly typedNameLabel = input<string>("");
    /** The typed name; two-way with [(typedName)]. */
    readonly typedName = model<string>("");
    /** The typed-name field's form name. */
    readonly name = input<string>("");
    protected readonly uid = `signature-pad-${++nextSignatureId}`;

    ngOnInit(): void {
        warnMissingName("SignaturePad", this.label(), null, null);
        if (this.outcome())
            warnMissingProp(
                "SignaturePad",
                "outcomeLabel",
                this.outcomeLabel(),
                "a signature's outcome needs words, never an empty line.",
            );
    }
    readonly className = input<string>("");
}
