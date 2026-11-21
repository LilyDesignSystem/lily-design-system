import {
    afterNextRender,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    input,
    model,
} from "@angular/core";

import { keepOpenForPrint } from "./print-open";

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
    /** Open the disclosure while printing, and restore it afterwards. Default true. */
    readonly printOpen = input<boolean>(true);

    private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

    constructor() {
        // A printed page cannot open a closed disclosure: open it for print and close it again (P42-T9).
        const destroyRef = inject(DestroyRef);
        afterNextRender(() => {
            const target = this.host.nativeElement.querySelector("details");
            if (!this.printOpen() || !target) return;
            destroyRef.onDestroy(keepOpenForPrint(() => [target]));
        });
    }

    onToggle(event: Event): void {
        this.open.set((event.target as HTMLDetailsElement).open);
    }
}
