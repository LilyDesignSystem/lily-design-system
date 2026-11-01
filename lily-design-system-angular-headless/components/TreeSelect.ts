import {
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    input,
    output,
    viewChild,
} from "@angular/core";
import { syncPopover } from "./Popover";

/**
 * TreeSelect — a dropdown that shows a hierarchical tree for selection
 *
 * Headless Angular component. A labelled `<div role="combobox" aria-haspopup="tree">`
 * whose `aria-expanded` follows `expanded`, holding a trigger `<button>` that shows the
 * current `value` (or `placeholder`) and a panel, hidden unless `expanded`, for the
 * consumer's tree (projected content; `TreeNav` / `TreeList` fit). The consumer owns the
 * state: it toggles `expanded` on `triggerClick`, moves through the tree with the arrows,
 * and closes on Escape. `data-multiple` marks multiple selection. Ships zero CSS.
 */
@Component({
    selector: "lily-tree-select",
    standalone: true,
    template: `<div
        class="tree-select {{ className() }}"
        role="combobox"
        aria-haspopup="tree"
        [attr.aria-expanded]="expanded() ? 'true' : 'false'"
        [attr.aria-label]="label()"
        [attr.data-multiple]="multiple() ? 'true' : null"
    >
        <button class="tree-select-trigger" type="button" [disabled]="disabled()" (click)="triggerClick.emit($event)">
            {{ value() || placeholder() }}
        </button>
        <div #panel popover="manual" class="tree-select-panel"><ng-content /></div>
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeSelect {
    private readonly panel = viewChild<ElementRef<HTMLElement>>("panel");

    private readonly syncPanel = effect(() => {
        const el = this.panel()?.nativeElement;
        if (el) syncPopover(el, this.expanded());
    });
    /** Accessible name (required). */
    readonly label = input.required<string>();
    /** Whether the tree panel is open. */
    readonly expanded = input<boolean>(false);
    /** Disables the trigger. */
    readonly disabled = input<boolean>(false);
    /** Whether several items may be chosen; published as data-multiple. */
    readonly multiple = input<boolean>(false);
    /** Trigger text while nothing is chosen. */
    readonly placeholder = input<string>("");
    /** The chosen item's text, shown on the trigger. */
    readonly value = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The trigger was clicked (or activated with Enter / Space). */
    readonly triggerClick = output<MouseEvent>();
}
