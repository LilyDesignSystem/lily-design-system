import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

import { ModalDialog } from "./Dialog";

let nextId = 0;

/**
 * AlertDialog — a modal dialog for urgent messages requiring user acknowledgment
 *
 * Headless Angular component: a `<dialog role="alertdialog" aria-modal="true">` named by its `title` (via
 * `aria-labelledby`) and described by its optional `description` (via `aria-describedby`); the projected content is
 * the consumer's actions. Opened with `showModal()` while `open` (ModalDialog, tasks.md P14-T4), so the page behind
 * is inert and Tab stays inside; the native `cancel` (Escape) and `close` events write `open` back. Ported from the
 * Svelte reference on 2026-10-30; it was a stub with `label` and no alertdialog role before. Ships zero CSS.
 */
@Component({
    selector: "lily-alert-dialog",
    standalone: true,
    template: `<dialog
    class="alert-dialog {{ className() }}"
    role="alertdialog"
    aria-modal="true"
    [attr.aria-labelledby]="titleId"
    [attr.aria-describedby]="description() ? descriptionId : null"
    [lilyModalDialog]="open()"
    (cancel)="onCancel($event)"
    (close)="open.set(false)"
  >
    <div>
      <p [id]="titleId"><strong>{{ title() }}</strong></p>
      @if (description()) {
        <p [id]="descriptionId">{{ description() }}</p>
      }
      <ng-content />
    </div>
  </dialog>`,
    imports: [ModalDialog],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertDialog {
    /** The dialog title, referenced by aria-labelledby (required by the contract). */
    readonly title = input<string>("");
    /** The dialog message, referenced by aria-describedby. */
    readonly description = input<string>("");
    /** Whether the dialog is shown. Two-way bindable; Escape sets it to false. */
    readonly open = model<boolean>(false);
    readonly className = input<string>("");

    private readonly uid = ++nextId;
    protected readonly titleId = `alert-dialog-title-${this.uid}`;
    protected readonly descriptionId = `alert-dialog-description-${this.uid}`;

    protected onCancel(event: Event): void {
        event.preventDefault();
        this.open.set(false);
    }
}
