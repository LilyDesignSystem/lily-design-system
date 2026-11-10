import {
    afterRenderEffect,
    ChangeDetectionStrategy,
    Component,
    input,
    model,
    signal,
    ElementRef,
    OnInit,
    inject,
    untracked,
    viewChild,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";

/**
 * Editable — an inline-editable text element that toggles between view and edit modes
 *
 * Headless Angular component. The root is a <div class="editable {className}">; in display mode it holds a native
 * <button type="button" class="editable-button"> named "value, label", and in edit mode an <input class="editable-input">.
 * Enter commits, Escape cancels; focus moves to the field on edit and back to the button after. Ships zero CSS.
 */
@Component({
    selector: "lily-editable",
    standalone: true,
    template: `<div class="editable {{ className() }}">
  @if (editing()) {
    <input
      #field
      class="editable-input"
      type="text"
      [attr.aria-label]="label() || null"
      [value]="draft()"
      (input)="draft.set($any($event.target).value)"
      (keydown)="onInputKeydown($event)"
    />
  } @else {
    <button
      #view
      class="editable-button"
      type="button"
      [attr.aria-label]="value() ? value() + ', ' + label() : label() || null"
      [disabled]="disabled()"
      (click)="startEditing()"
    >{{ value() }}</button>
  }
</div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Editable implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    /** The committed value. Two-way bindable. */
    readonly value = model<string>("");
    /** Whether the text field is showing. Two-way bindable. */
    readonly editing = model<boolean>(false);
    readonly disabled = input<boolean>(false);
    readonly className = input<string>("");

    protected readonly draft = signal("");
    private readonly field = viewChild<ElementRef<HTMLInputElement>>("field");
    private readonly view = viewChild<ElementRef<HTMLButtonElement>>("view");
    // The element that had focus is removed by the switch, so focus follows the user to the element that replaces it.
    private focusNext: "field" | "view" | null = null;
    private readonly moveFocus = afterRenderEffect(() => {
        const field = this.field();
        const view = this.view();
        untracked(() => {
            if (this.focusNext === "field") field?.nativeElement.focus();
            else if (this.focusNext === "view") view?.nativeElement.focus();
            this.focusNext = null;
        });
    });

    protected startEditing(): void {
        if (this.disabled()) return;
        this.draft.set(this.value());
        this.focusNext = "field";
        this.editing.set(true);
    }

    protected onInputKeydown(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            event.preventDefault();
            this.value.set(this.draft());
            this.focusNext = "view";
            this.editing.set(false);
        } else if (event.key === "Escape") {
            event.preventDefault();
            this.draft.set(this.value());
            this.focusNext = "view";
            this.editing.set(false);
        }
    }

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "Editable",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
