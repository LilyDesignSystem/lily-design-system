import {
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    input,
    model,
    viewChild,
} from "@angular/core";
import { syncPopover } from "./Popover";
import { restoreOnFormReset } from "./form-reset";

let nextId = 0;

/**
 * Combobox — a text input combined with a dropdown list for filtering options
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `combobox` and the consumer-provided `className`: a
 * text input with `role="combobox"` and, while `open`, a listbox holding the
 * projected options. Escape closes the listbox. Ported from the Svelte
 * reference (tasks.md P12-T5a; this was a stub with no input or listbox).
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-combobox",
    standalone: true,
    template: `<div class="combobox {{ className() }}">
    <input
      type="text"
      role="combobox"
      [attr.aria-label]="label()"
      [attr.aria-expanded]="open() ? 'true' : 'false'"
      [attr.aria-controls]="listboxId"
      aria-autocomplete="list"
      [value]="value()"
      (input)="value.set($any($event.target).value)"
      (keydown)="onKeydown($event)"
    />
    <div #panel popover="manual" role="listbox" [id]="listboxId" [attr.aria-label]="label()"><ng-content /></div>
  </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Combobox {
    private readonly panel = viewChild<ElementRef<HTMLElement>>("panel");

    private readonly syncPanel = effect(() => {
        const el = this.panel()?.nativeElement;
        if (el) syncPopover(el, this.open());
    });
    /** Accessible label, on both the input and the listbox. */
    readonly label = input<string>("");
    /** Current input value. Two-way bindable. */
    readonly value = model<string>("");
    /** Whether the listbox is shown. Two-way bindable; Escape sets it to false. */
    readonly open = model<boolean>(false);
    readonly className = input<string>("");

    protected readonly listboxId = `combobox-listbox-${nextId++}`;

    constructor() {
        restoreOnFormReset(this.value);
    }

    protected onKeydown(event: KeyboardEvent): void {
        if (event.key === "Escape") {
            event.preventDefault();
            this.open.set(false);
        }
    }
}
