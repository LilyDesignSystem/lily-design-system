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
 * PopconfirmDialog — a popover dialog with confirm and cancel buttons
 *
 * Headless Angular component. A non-modal `role="alertdialog"` `<div>`, hidden
 * while `open` is false, holding an `<h2>` title, an optional description and a
 * cancel and a confirm button. The consumer owns `open`: it closes the dialog on
 * `cancelled` / `confirmed` (and on Escape, by its own handler). Ships zero CSS.
 *
 * Inputs: open, title (required), description, confirmLabel and cancelLabel
 * (required; no English from us), className. Outputs: confirmed, cancelled.
 */
@Component({
    selector: "lily-popconfirm-dialog",
    standalone: true,
    template: `<div
        class="popconfirm-dialog {{ className() }}"
        role="alertdialog"
        aria-modal="false"
        [attr.aria-labelledby]="titleId"
        [attr.aria-describedby]="description() ? descriptionId : null"
        #panel
        popover="manual"
    >
        <h2 class="popconfirm-dialog-title" [id]="titleId">{{ title() }}</h2>
        @if (description()) {
            <p class="popconfirm-dialog-description" [id]="descriptionId">{{ description() }}</p>
        }
        <button class="popconfirm-dialog-cancel" type="button" (click)="cancelled.emit($event)">
            {{ cancelLabel() }}
        </button>
        <button class="popconfirm-dialog-confirm" type="button" (click)="confirmed.emit($event)">
            {{ confirmLabel() }}
        </button>
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopconfirmDialog {
    private readonly panel = viewChild<ElementRef<HTMLElement>>("panel");

    private readonly syncPanel = afterRenderEffect(() => {
        const el = this.panel()?.nativeElement;
        if (el) syncPopover(el, this.open());
    });
    readonly open = input<boolean>(false);
    readonly title = input.required<string>();
    readonly description = input<string>("");
    readonly confirmLabel = input.required<string>();
    readonly cancelLabel = input.required<string>();
    readonly className = input<string>("");
    readonly confirmed = output<MouseEvent>();
    readonly cancelled = output<MouseEvent>();

    private readonly id = nextId++;
    protected readonly titleId = `popconfirm-dialog-title-${this.id}`;
    protected readonly descriptionId = `popconfirm-dialog-description-${this.id}`;
}
