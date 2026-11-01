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
 * MentionsInput — a text input that suggests people or items after a trigger character
 *
 * Headless Angular component. A `<div>` (publishing `data-trigger-char`) holding a
 * text `<input role="combobox" aria-autocomplete="list" aria-haspopup="listbox">` and
 * the suggestions panel it controls, hidden unless `expanded`. The consumer watches
 * the value for the trigger character, fills the panel (projected content), sets
 * `expanded`, and handles Arrow Down / Up, Enter and Escape. `value` is two-way and
 * goes back to its first value on form reset. Ships zero CSS.
 */
@Component({
    selector: "lily-mentions-input",
    standalone: true,
    template: `<div class="mentions-input {{ className() }}" [attr.data-trigger-char]="triggerChar()">
        <input
            class="mentions-input-control"
            type="text"
            role="combobox"
            [attr.aria-label]="label()"
            aria-haspopup="listbox"
            [attr.aria-controls]="suggestionsId"
            [attr.aria-expanded]="expanded() ? 'true' : 'false'"
            aria-autocomplete="list"
            [value]="value()"
            [attr.placeholder]="placeholder() || null"
            [disabled]="disabled()"
            (input)="value.set($any($event.target).value)"
        />
        <div #panel popover="manual" class="mentions-input-suggestions" [id]="suggestionsId">
            <ng-content />
        </div>
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MentionsInput {
    private readonly panel = viewChild<ElementRef<HTMLElement>>("panel");

    private readonly syncPanel = effect(() => {
        const el = this.panel()?.nativeElement;
        if (el) syncPopover(el, this.expanded());
    });
    /** Accessible name of the input (required). */
    readonly label = input.required<string>();
    /** The text (two-way). */
    readonly value = model<string>("");
    /** The character that opens the suggestions, published as data-trigger-char. */
    readonly triggerChar = input<string>("@");
    /** Whether the suggestions panel is open. */
    readonly expanded = input<boolean>(false);
    readonly placeholder = input<string>("");
    readonly disabled = input<boolean>(false);
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");

    protected readonly suggestionsId = `mentions-input-suggestions-${nextId++}`;

    constructor() {
        restoreOnFormReset(this.value);
    }
}
