import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    input,
    output,
} from "@angular/core";
import { attachToolbar } from "./widget-keys";

/**
 * ActionBar — a toolbar of bulk actions on a selection
 *
 * Headless Angular component: a `<div role="toolbar">` with the count, the projected action buttons and an optional
 * clear button. widget-keys.ts owns the keys, the module the catalogs share. Ships zero CSS.
 */
@Component({
    selector: "lily-action-bar",
    standalone: true,
    template: `<div
    class="action-bar {{ className() }}"
    role="toolbar"
    [attr.aria-label]="label() || null"
    [attr.data-selected-count]="selectedCount()"
  >
    <span class="action-bar-count">{{ selectedCountLabel() }}</span>
    <ng-content />
    @if (clearSelectionLabel()) {
      <button
        class="action-bar-clear"
        type="button"
        [attr.aria-label]="clearSelectionLabel()"
        (click)="clearSelection.emit()"
      >×</button>
    }
  </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionBar {
    private readonly keysHost = inject(ElementRef);
    private readonly keysDestroy = inject(DestroyRef);

    ngAfterViewInit(): void {
        const root = this.keysHost.nativeElement.querySelector(".action-bar");
        this.keysDestroy.onDestroy(attachToolbar(root, { dismiss: ".action-bar-clear" }));
    }

    readonly label = input<string>("");
    readonly selectedCount = input<number>(0);
    readonly selectedCountLabel = input<string>("");
    readonly clearSelectionLabel = input<string | undefined>(undefined);
    /** The clear button was pressed, or Escape. */
    readonly clearSelection = output<void>();
    readonly className = input<string>("");
}
