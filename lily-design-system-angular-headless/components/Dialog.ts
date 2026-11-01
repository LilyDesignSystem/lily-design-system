import {
    ChangeDetectionStrategy,
    Component,
    Directive,
    ElementRef,
    effect,
    inject,
    input,
    model,
} from "@angular/core";

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Shows the host `<dialog>` while `lilyModalDialog` is true (tasks.md P14-T4), shared by Dialog, AlertDialog,
 * FileDialog and TimeoutDialog. With `modal` (the default) it opens with `showModal()`: the top layer, an inert page
 * behind, Tab trapped, and Escape firing `cancel`; otherwise, or where `showModal` is missing (jsdom), with the
 * `open` attribute. Focus moves to the first focusable descendant (as `showModal()` does), else the dialog, and
 * returns to the opener on close. The same logic as the Svelte catalog's Dialog/modal.ts.
 */
@Directive({ selector: "dialog[lilyModalDialog]", standalone: true })
export class ModalDialog {
    readonly lilyModalDialog = input<boolean>(false);
    readonly modal = input<boolean>(true);
    private readonly host = inject<ElementRef<HTMLDialogElement>>(ElementRef);
    private opener: HTMLElement | null = null;

    constructor() {
        effect(() => {
            const node = this.host.nativeElement;
            if (this.lilyModalDialog()) {
                if (node.open) return;
                this.opener = document.activeElement as HTMLElement | null;
                if (this.modal() && typeof node.showModal === "function") node.showModal();
                else node.setAttribute("open", "");
                if (!node.contains(document.activeElement)) {
                    (node.querySelector<HTMLElement>(FOCUSABLE) ?? node).focus();
                }
            } else if (node.open) {
                if (typeof node.close === "function") node.close();
                else node.removeAttribute("open");
                const opener = this.opener;
                this.opener = null;
                if (opener && opener !== document.body && opener.isConnected) opener.focus();
            }
        });
    }
}

/**
 * Dialog — a modal or non-modal dialog window
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `dialog` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook. Opened with `showModal()` when `modal` (ModalDialog);
 * the native `cancel` (Escape) and `close` events keep `open` in step.
 */
@Component({
    selector: "lily-dialog",
    standalone: true,
    template: `<dialog
    class="dialog {{ className() }}"
    tabindex="-1"
    [attr.aria-label]="label() || null"
    [attr.aria-modal]="modal() ? 'true' : null"
    [lilyModalDialog]="open()"
    [modal]="modal()"
    (keydown)="onKeydown($event)"
    (cancel)="onCancel($event)"
    (close)="open.set(false)"
  ><ng-content /></dialog>`,
    imports: [ModalDialog],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dialog {
    readonly label = input<string>("");
    /** Whether the dialog is visible. Two-way bindable; Escape sets it to false. */
    readonly open = model<boolean>(false);
    /** Whether the dialog is modal (`aria-modal`). */
    readonly modal = input<boolean>(true);
    readonly className = input<string>("");

    protected onCancel(event: Event): void {
        event.preventDefault();
        this.open.set(false);
    }

    protected onKeydown(event: KeyboardEvent): void {
        if (event.key === "Escape") {
            event.preventDefault();
            this.open.set(false);
        }
    }
}
