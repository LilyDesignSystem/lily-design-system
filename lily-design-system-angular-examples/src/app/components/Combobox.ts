import {
    afterRenderEffect,
    effect,
    signal,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    input,
    model,
    OnInit,
    output,
    viewChild,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";
import { syncPopover } from "./Popover";
import { restoreOnFormReset } from "./form-reset";
import { attachCombobox, setActiveOption } from "./combobox-keys";

let nextId = 0;

/**
 * Combobox — a text input combined with a dropdown list for filtering options
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `combobox` and the consumer-provided `className`: a
 * text input with `role="combobox"` and, while `open`, a listbox holding the
 * projected options. combobox-keys.ts owns the keys, typing, blur and pointer,
 * the module the catalogs share: arrows open and move (wrapping), Home and End
 * jump, Enter chooses, Escape closes, Alt+ArrowDown opens, Alt+ArrowUp closes.
 * Filtering is the consumer's. Ported from the Svelte reference (tasks.md
 * P12-T5a; this was a stub with no input or listbox).
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-combobox",
    standalone: true,
    template: `<div class="combobox {{ className() }}">
    <input
      #field
      type="text"
      role="combobox"
      [attr.aria-label]="label()"
      [attr.aria-expanded]="open() ? 'true' : 'false'"
      [attr.aria-controls]="listboxId"
      aria-autocomplete="list"
      [value]="value()"
      (input)="value.set($any($event.target).value)"
    />
    <div #panel popover="manual" role="listbox" [id]="listboxId" [attr.aria-label]="label()"><ng-content /></div>
    @if (resultsLabel() || noResultsLabel()) {
      <p class="combobox-status" role="status" [attr.data-results]="resultCount() ?? null">{{ status() }}</p>
    }
  </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Combobox implements OnInit, AfterViewInit {
    private readonly lilyHost = inject(ElementRef);
    private readonly destroyRef = inject(DestroyRef);

    private readonly panel = viewChild<ElementRef<HTMLElement>>("panel");
    private readonly field = viewChild<ElementRef<HTMLInputElement>>("field");

    private readonly syncPanel = afterRenderEffect(() => {
        const el = this.panel()?.nativeElement;
        const input = this.field()?.nativeElement;
        const open = this.open();
        if (el) syncPopover(el, open);
        // Closed from outside: no highlight survives into the next opening.
        if (el && input && !open) setActiveOption(input, el, null);
    });
    /** Accessible label, on both the input and the listbox. */
    readonly label = input<string>("");
    /** Current input value. Two-way bindable. */
    readonly value = model<string>("");
    /** Whether the listbox is shown. Two-way bindable; Escape sets it to false. */
    readonly open = model<boolean>(false);
    /** The chosen option's `data-value`, else its text. */
    readonly selected = output<string>();
    readonly className = input<string>("");
    /** How many options match the text, as the consumer counts them. */
    readonly resultCount = input<number | undefined>(undefined);
    /** The count in the consumer's words, announced politely when typing pauses. */
    readonly resultsLabel = input<((count: number) => string) | undefined>(undefined);
    /** The consumer's words when nothing matches, shown and announced. */
    readonly noResultsLabel = input<string>("");
    /** How long typing must pause, in milliseconds, before the count is announced. Default 500. */
    readonly statusDelay = input<number>(500);

    // The count, or "no matches", in the consumer's words, after typing pauses (P34-T2).
    protected readonly status = signal("");
    private readonly statusEffect = effect((onCleanup) => {
        const count = this.resultCount();
        const words =
            count === undefined
                ? ""
                : count === 0
                  ? this.noResultsLabel()
                  : (this.resultsLabel()?.(count) ?? "");
        const open = this.open();
        this.value();
        const timer = setTimeout(() => this.status.set(open ? words : ""), this.statusDelay());
        onCleanup(() => clearTimeout(timer));
    });

    protected readonly listboxId = `combobox-listbox-${nextId++}`;

    constructor() {
        restoreOnFormReset(this.value);
    }

    ngAfterViewInit(): void {
        const detach = attachCombobox(this.field()!.nativeElement, this.panel()!.nativeElement, {
            open: () => this.open(),
            setOpen: (next) => this.open.set(next),
            choose: (chosen) => {
                this.value.set(chosen);
                this.selected.emit(chosen);
            },
        });
        this.destroyRef.onDestroy(detach);
    }

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "Combobox",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
