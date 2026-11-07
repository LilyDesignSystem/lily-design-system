import { ChangeDetectionStrategy, Component, input, computed } from "@angular/core";

/**
 * CharacterCounter — a counter showing remaining or used characters in a text field
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `character-counter` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-character-counter",
    standalone: true,
    template: `<span class="character-counter {{ className() }}" role="status" aria-live="polite" [attr.aria-label]="label() || null" [attr.data-count]="count()" [attr.data-max]="max() ?? null" [attr.data-remaining]="remaining()" [attr.data-over-limit]="overLimit()">{{ displayText() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterCounter {
    protected readonly remaining = computed(() => {
        const max = this.max();
        return max === undefined ? null : max - this.count();
    });
    protected readonly overLimit = computed(() => {
        const max = this.max();
        return max !== undefined && this.count() > max ? true : null;
    });
    protected readonly displayText = computed(() => {
        const max = this.max();
        return max === undefined ? `${this.count()}` : `${this.count()} / ${max}`;
    });

    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Characters used. */
    readonly count = input<number>(0);
    /** Characters allowed. */
    readonly max = input<number | undefined>(undefined);
}
