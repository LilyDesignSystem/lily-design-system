import {
    ChangeDetectionStrategy,
    Component,
    input,
    model,
    ElementRef,
    OnInit,
    inject,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";

import { ModalDialog } from "./Dialog";

/**
 * FileDialog — a dialog for browsing and selecting files
 *
 * Headless Angular component: a `<dialog tabindex="-1">` named by `label` (aria-label) holding the consumer's file
 * UI. Opened with `showModal()` while `open` (ModalDialog, tasks.md P14-T4), so the page behind is inert and Tab
 * stays inside; Escape and the native `cancel` and `close` events write `open` back. Ported from the Svelte reference
 * on 2026-10-30; it was a stub with a one-way `open` before. Ships zero CSS.
 */
@Component({
    selector: "lily-file-dialog",
    standalone: true,
    template: `<dialog
    class="file-dialog {{ className() }}"
    tabindex="-1"
    [attr.aria-label]="label() || null"
    [lilyModalDialog]="open()"
    (keydown)="onKeydown($event)"
    (cancel)="onCancel($event)"
    (close)="open.set(false)"
  ><ng-content /></dialog>`,
    imports: [ModalDialog],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDialog implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    /** Whether the dialog is shown. Two-way bindable; Escape sets it to false. */
    readonly open = model<boolean>(false);
    readonly className = input<string>("");

    protected onKeydown(event: KeyboardEvent): void {
        if (event.key === "Escape") {
            event.preventDefault();
            this.open.set(false);
        }
    }

    protected onCancel(event: Event): void {
        event.preventDefault();
        this.open.set(false);
    }

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "FileDialog",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
