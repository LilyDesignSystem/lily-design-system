import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    input,
    ElementRef,
    model,
    OnInit,
    inject,
    viewChild,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";
import { attachCommand } from "./command-keys";
import { restoreOnFormReset } from "./form-reset";

let nextId = 0;

/**
 * Command — a command palette for searching and executing actions
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `command` and the consumer-provided `className`: a
 * search input over a listbox of the projected options. command-keys.ts owns
 * the keys, the module the catalogs share. Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-command",
    standalone: true,
    template: `<div class="command {{ className() }}" role="search" [attr.aria-label]="label() || null">
    <input
      #field
      type="search"
      autocomplete="off"
      [attr.aria-label]="label() || null"
      [attr.aria-controls]="listId"
      [attr.placeholder]="placeholder()"
      [value]="value()"
      (input)="value.set($any($event.target).value)"
    />
    <div #list role="listbox" [id]="listId" [attr.aria-label]="label() || null"><ng-content /></div>
  </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Command implements OnInit, AfterViewInit {
    private readonly lilyHost = inject(ElementRef);
    private readonly destroyRef = inject(DestroyRef);
    private readonly field = viewChild<ElementRef<HTMLInputElement>>("field");
    private readonly list = viewChild<ElementRef<HTMLElement>>("list");

    readonly label = input<string>("");
    readonly placeholder = input<string | null>(null);
    /** The input's text. Two-way bindable. */
    readonly value = model<string>("");
    readonly className = input<string>("");

    protected readonly listId = `command-list-${nextId++}`;

    constructor() {
        restoreOnFormReset(this.value);
    }

    ngAfterViewInit(): void {
        this.destroyRef.onDestroy(
            attachCommand(this.field()!.nativeElement, this.list()!.nativeElement),
        );
    }

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "Command",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
