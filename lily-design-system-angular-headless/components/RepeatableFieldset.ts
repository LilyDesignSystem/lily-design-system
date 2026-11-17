import {
    afterRenderEffect,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    ElementRef,
    input,
    model,
    output,
    OnInit,
    signal,
    TemplateRef,
    viewChild,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { warnMissingProp } from "./dev-warning";

/**
 * RepeatableFieldset: the "add another" pattern (tasks.md P29-T10): a `<fieldset>` holding one `<fieldset>` per item, each
 * with a legend and a remove button, and an add button. The items are the consumer's; legends and labels come from
 * functions of the item's number. The item's fields are an `<ng-template let-item let-index="index">` child. Focus moves to
 * the new item's first field on add, to the add button on remove. Props: RepeatableFieldset.md.
 */
@Component({
    selector: "lily-repeatable-fieldset",
    standalone: true,
    imports: [NgTemplateOutlet],
    template: `<fieldset #root class="repeatable-fieldset {{ className() }}" [attr.data-count]="items().length">
        <legend>{{ legend() }}</legend>
        @for (entry of items(); track $index; let index = $index) {
            <fieldset class="repeatable-fieldset-item" [attr.data-index]="index">
                <legend class="repeatable-fieldset-item-legend">{{ itemLegend()(index + 1) }}</legend>
                @if (itemTemplate(); as template) {
                    <ng-container *ngTemplateOutlet="template; context: { $implicit: entry, index: index }" />
                }
                @if (canRemove()) {
                    <button type="button" class="repeatable-fieldset-remove" (click)="remove(index)">{{ removeLabel()(index + 1) }}</button>
                }
            </fieldset>
        }
        <button #add type="button" class="repeatable-fieldset-add" [disabled]="!canAdd()" (click)="addItem()">{{ addLabel() }}</button>
        @if (addedLabel() || removedLabel()) {
            <p class="repeatable-fieldset-status" role="status">{{ status() }}</p>
        }
    </fieldset>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepeatableFieldset<T = unknown> implements OnInit {
    readonly className = input<string>("");
    /** Names the whole group. */
    readonly legend = input<string>("");
    /** The consumer's items. Two-way. */
    readonly items = model<T[]>([]);
    /** Makes a new item when the add button is pressed. */
    readonly newItem = input.required<() => T>();
    /** Each item's legend; numbers start at 1. */
    readonly itemLegend = input.required<(number: number) => string>();
    /** The add button's text. */
    readonly addLabel = input<string>("");
    /** Each remove button's text. */
    readonly removeLabel = input.required<(number: number) => string>();
    readonly min = input<number>(0);
    readonly max = input<number | undefined>(undefined);
    readonly addedLabel = input<((number: number) => string) | undefined>(undefined);
    readonly removedLabel = input<((number: number) => string) | undefined>(undefined);
    /** Emits the new item's index after an add. */
    readonly itemAdded = output<number>();
    /** Emits the removed item's index after a remove. */
    readonly itemRemoved = output<number>();

    protected readonly itemTemplate = contentChild(TemplateRef);
    private readonly root = viewChild<ElementRef<HTMLFieldSetElement>>("root");
    private readonly addButton = viewChild<ElementRef<HTMLButtonElement>>("add");
    protected readonly status = signal("");
    private readonly pendingFocus = signal<{ to: "item"; index: number } | { to: "add" } | null>(
        null,
    );

    protected readonly canAdd = computed(() => {
        const max = this.max();
        return max === undefined || this.items().length < max;
    });
    protected readonly canRemove = computed(() => this.items().length > this.min());

    constructor() {
        afterRenderEffect(() => {
            const focus = this.pendingFocus();
            if (!focus) return;
            if (focus.to === "add") this.addButton()?.nativeElement.focus();
            else
                this.root()
                    ?.nativeElement.querySelectorAll<HTMLFieldSetElement>(
                        ":scope > .repeatable-fieldset-item",
                    )
                    [focus.index]?.querySelector<HTMLElement>(
                        "input, select, textarea, button, [tabindex]:not([tabindex='-1'])",
                    )
                    ?.focus();
            this.pendingFocus.set(null);
        });
    }

    ngOnInit(): void {
        warnMissingProp("RepeatableFieldset", "legend", this.legend(), "the group needs a name.");
        warnMissingProp(
            "RepeatableFieldset",
            "addLabel",
            this.addLabel(),
            "the add button needs words.",
        );
    }

    protected addItem(): void {
        if (!this.canAdd()) return;
        const index = this.items().length;
        this.items.set([...this.items(), this.newItem()()]);
        this.status.set(this.addedLabel()?.(index + 1) ?? "");
        this.pendingFocus.set({ to: "item", index });
        this.itemAdded.emit(index);
    }

    protected remove(index: number): void {
        if (!this.canRemove()) return;
        this.items.set(this.items().filter((_, i) => i !== index));
        this.status.set(this.removedLabel()?.(index + 1) ?? "");
        this.pendingFocus.set({ to: "add" });
        this.itemRemoved.emit(index);
    }
}
