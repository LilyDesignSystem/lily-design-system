import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * Details — a disclosure widget that shows and hides content
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `details` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-details",
    standalone: true,
    template: `<details class="details {{ className() }}" [open]="open()" (toggle)="onToggle($event)"><summary>{{ summary() }}</summary><ng-content /></details>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Details {
    /** The always-visible summary text. */
    readonly summary = input<string>("");
    /** Whether the content is shown (two-way: [(open)]). */
    readonly open = model<boolean>(false);
    readonly className = input<string>("");

    onToggle(event: Event): void {
        this.open.set((event.target as HTMLDetailsElement).open);
    }
}
