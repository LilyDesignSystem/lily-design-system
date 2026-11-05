import {
    afterRenderEffect,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    input,
    model,
    output,
    viewChild,
} from "@angular/core";
import { syncPopover } from "./Popover";
import { attachTreePopup, type TreeSelection } from "./widget-keys";

/**
 * Cascader — a trigger opening a tree of the consumer's options
 *
 * Headless Angular component. widget-keys.ts owns the keys, the module the catalogs share. Project a `role="tree"`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-cascader",
    standalone: true,
    template: `<div
        class="cascader {{ className() }}"
        role="combobox"
        aria-haspopup="tree"
        [attr.aria-expanded]="expanded() ? 'true' : 'false'"
        [attr.aria-label]="label()"
        [attr.data-multiple]="multiple() ? 'true' : null"
    >
        <button class="cascader-trigger" type="button" [disabled]="disabled()" (click)="triggerClick.emit($event)">
            {{ value() || placeholder() }}
        </button>
        <div #panel popover="manual" class="cascader-panel"><ng-content /></div>
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cascader {
    private readonly keysHost = inject(ElementRef);
    private readonly keysDestroy = inject(DestroyRef);
    private readonly panel = viewChild<ElementRef<HTMLElement>>("panel");

    private readonly syncPanel = afterRenderEffect(() => {
        const el = this.panel()?.nativeElement;
        if (el) syncPopover(el, this.expanded());
    });

    readonly label = input<string>("");
    /** Whether the panel is open. Two-way bindable. */
    readonly expanded = model<boolean>(false);
    readonly disabled = input<boolean>(false);
    readonly multiple = input<boolean>(false);
    readonly placeholder = input<string>("");
    readonly value = input<string>("");
    readonly className = input<string>("");
    readonly triggerClick = output<MouseEvent>();
    /** The chosen item, its path and every selected value. */
    readonly selectionChange = output<TreeSelection>();

    ngAfterViewInit(): void {
        const root = this.keysHost.nativeElement.querySelector(".cascader");
        this.keysDestroy.onDestroy(
            attachTreePopup(root, {
                exclusive: true,
                onOpen: (open) => this.expanded.set(open),
                onSelect: (selection) => this.selectionChange.emit(selection),
            }),
        );
    }
}
