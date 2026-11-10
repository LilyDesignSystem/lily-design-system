import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    input,
    signal,
    untracked,
} from "@angular/core";

/**
 * CharacterCounter — a counter showing remaining or used characters in a text field
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `character-counter` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 *
 * The visible count (.character-counter-text) is aria-hidden; a visually hidden role="status"
 * (.character-counter-status, also .screen-reader-span) takes the same text once the count has stopped
 * changing for `announceDelay` ms (default 1000), so a run of keystrokes is announced once, as GOV.UK's
 * character count does. `label` names the status.
 */
@Component({
    selector: "lily-character-counter",
    standalone: true,
    template: `<span class="character-counter {{ className() }}" [attr.data-count]="count()" [attr.data-max]="max() ?? null" [attr.data-remaining]="remaining()" [attr.data-over-limit]="overLimit()"><span class="character-counter-text" aria-hidden="true">{{ displayText() }}</span><span class="character-counter-status screen-reader-span" role="status" [attr.aria-label]="label() || null">{{ announced() }}</span></span>`,
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
    /** Milliseconds of quiet before the status takes the new count. */
    readonly announceDelay = input<number>(1000);

    protected readonly announced = signal<string | null>(null);

    constructor() {
        // The first text is the status's at once; later ones only after announceDelay ms of quiet.
        effect((onCleanup) => {
            const next = this.displayText();
            if (untracked(this.announced) === null) {
                this.announced.set(next);
                return;
            }
            const timer = setTimeout(() => this.announced.set(next), untracked(this.announceDelay));
            onCleanup(() => clearTimeout(timer));
        });
    }
}
