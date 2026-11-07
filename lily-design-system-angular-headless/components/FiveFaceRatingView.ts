import {
    ChangeDetectionStrategy,
    Component,
    input,
    computed,
    numberAttribute,
} from "@angular/core";

/**
 * FiveFaceRatingView — a read-only display of a five-face satisfaction rating
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `five-face-rating-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-five-face-rating-view",
    standalone: true,
    template: `<span class="five-face-rating-view {{ className() }}" role="img" [attr.aria-label]="label() || null" [attr.data-value]="value()">{{ faceLabel() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiveFaceRatingView {
    protected readonly faceLabel = computed(() => this.labels()[this.value() - 1] ?? "");

    /** Optional accessible label override (aria-label). */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** Text for each rating, lowest first: consumer-supplied. */
    readonly labels = input<string[]>(["1", "2", "3", "4", "5"]);
    /** The value to display read-only. */
    readonly value = input<number, unknown>(0, { transform: numberAttribute });
}
