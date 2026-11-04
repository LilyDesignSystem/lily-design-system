import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    model,
    output,
    signal,
    ElementRef,
    OnInit,
    inject,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";
import { restoreOnFormReset } from "./form-reset";

let nextId = 0;

export interface AutosuggestSuggestion {
    value: string;
    label: string;
}

/**
 * Autosuggest — a text input that proposes matching options as users type
 *
 * Headless Angular component: the WAI-ARIA combobox pattern with list
 * autocomplete, rooted on `<div class="autosuggest {className}">`. The input
 * is the combobox; the suggestions are a listbox of options. The consumer
 * computes `suggestions` from the `query` output (filtering, fetching); the
 * component owns the open state, the highlight, the keys and the selection.
 * Ships zero CSS.
 *
 * Keyboard: ArrowDown / ArrowUp open the list and move the highlight
 * (wrapping), Home / End jump while open, Enter chooses, Escape closes.
 * Choosing writes the suggestion's `value` into the two-way `value`, emits
 * `selected` and closes. Blur closes; pressing an option keeps focus in the
 * input so a click can choose it.
 */
@Component({
    selector: "lily-autosuggest",
    standalone: true,
    template: `<div class="autosuggest {{ className() }}">
    <input
      class="autosuggest-input"
      type="text"
      role="combobox"
      autocomplete="off"
      [attr.aria-label]="label()"
      aria-autocomplete="list"
      [attr.aria-expanded]="open() ? 'true' : 'false'"
      [attr.aria-controls]="listId"
      [attr.aria-activedescendant]="open() && active() >= 0 ? optionId(active()) : null"
      [attr.placeholder]="placeholder() || null"
      [attr.name]="name() || null"
      [value]="value()"
      (input)="onInput($event)"
      (keydown)="onKeydown($event)"
      (blur)="close()"
    />
    <ul
      class="autosuggest-list"
      role="listbox"
      [id]="listId"
      [attr.aria-label]="label()"
      [hidden]="!open()"
      (mousedown)="$event.preventDefault()"
    >
      @for (suggestion of suggestions(); track suggestion.value; let index = $index) {
        <li
          class="autosuggest-option"
          role="option"
          [id]="optionId(index)"
          [attr.aria-selected]="index === active() ? 'true' : 'false'"
          [attr.data-value]="suggestion.value"
          (click)="choose(index)"
        >{{ suggestion.label }}</li>
      }
    </ul>
  </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Autosuggest implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    /** Accessible label, on both the input and the listbox. */
    readonly label = input<string>("");
    /** The input's text. Two-way bindable. */
    readonly value = model<string>("");
    /** The options to show. */
    readonly suggestions = input<AutosuggestSuggestion[]>([]);
    readonly placeholder = input<string>("");
    /** Form field name of the input. */
    readonly name = input<string>("");
    readonly className = input<string>("");
    /** The typed text, as the user types. */
    readonly query = output<string>();
    /** The chosen suggestion's value. */
    readonly selected = output<string>();

    protected readonly listId = `autosuggest-list-${nextId++}`;
    private readonly wanted = signal(false);
    protected readonly active = signal(-1);
    protected readonly open = computed(() => this.wanted() && this.suggestions().length > 0);

    constructor() {
        restoreOnFormReset(this.value);
    }

    protected optionId(index: number): string {
        return `${this.listId}-option-${index}`;
    }

    protected choose(index: number): void {
        const suggestion = this.suggestions()[index];
        if (!suggestion) return;
        this.value.set(suggestion.value);
        this.close();
        this.selected.emit(suggestion.value);
    }

    protected close(): void {
        this.wanted.set(false);
        this.active.set(-1);
    }

    protected onInput(event: Event): void {
        this.value.set((event.target as HTMLInputElement).value);
        this.wanted.set(true);
        this.active.set(-1);
        this.query.emit(this.value());
    }

    protected onKeydown(event: KeyboardEvent): void {
        const count = this.suggestions().length;
        const open = this.open();
        const active = this.active();
        switch (event.key) {
            case "ArrowDown":
                if (count === 0) return;
                this.active.set(open ? (active + 1) % count : 0);
                this.wanted.set(true);
                break;
            case "ArrowUp":
                if (count === 0) return;
                this.active.set(open && active > 0 ? active - 1 : count - 1);
                this.wanted.set(true);
                break;
            case "Home":
                if (!open) return;
                this.active.set(0);
                break;
            case "End":
                if (!open) return;
                this.active.set(count - 1);
                break;
            case "Enter":
                if (!open || active < 0) return;
                this.choose(active);
                break;
            case "Escape":
                if (!open) return;
                this.close();
                break;
            default:
                return;
        }
        event.preventDefault();
    }

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "Autosuggest",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
