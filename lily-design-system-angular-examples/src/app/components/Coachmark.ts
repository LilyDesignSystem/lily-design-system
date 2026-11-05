import {
    afterRenderEffect,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    input,
    output,
    viewChild,
} from "@angular/core";
import { syncPopover } from "./Popover";

let nextId = 0;

/**
 * Coachmark — an anchored popover that spotlights and explains a single feature
 *
 * Headless Angular component: a non-modal dialog, always rendered with `popover="manual"` and shown while `open`. Name the
 * feature with `position-anchor`. Ships zero CSS.
 */
@Component({
    selector: "lily-coachmark",
    standalone: true,
    template: `<div
        class="coachmark {{ className() }}"
        role="dialog"
        aria-modal="false"
        [attr.aria-labelledby]="titleId"
        [attr.aria-describedby]="description() ? descriptionId : null"
        #panel
        popover="manual"
    >
        <h2 class="coachmark-title" [id]="titleId">{{ title() }}</h2>
        @if (description()) {
            <p class="coachmark-description" [id]="descriptionId">{{ description() }}</p>
        }
        <button
            class="coachmark-dismiss"
            type="button"
            [attr.aria-label]="dismissLabel()"
            (click)="dismissed.emit($event)"
        >
            ×
        </button>
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Coachmark {
    private readonly panel = viewChild<ElementRef<HTMLElement>>("panel");

    private readonly syncPanel = afterRenderEffect(() => {
        const el = this.panel()?.nativeElement;
        if (el) syncPopover(el, this.open());
    });
    readonly open = input<boolean>(false);
    readonly title = input.required<string>();
    readonly description = input<string>("");
    readonly dismissLabel = input.required<string>();
    readonly className = input<string>("");
    readonly dismissed = output<MouseEvent>();

    private readonly id = ++nextId;
    protected readonly titleId = `coachmark-title-${this.id}`;
    protected readonly descriptionId = `coachmark-desc-${this.id}`;
}
