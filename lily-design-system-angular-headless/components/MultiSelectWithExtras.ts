import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  input,
  model,
  viewChild,
} from "@angular/core";

/**
 * MultiSelectWithExtras — a multiple-choice select with additional features like search, groups, or selected-value chips
 *
 * Headless Angular component. A wrapper `<div class="multi-select-with-extras">`
 * around a native `<select multiple>` (aria-label on the select). Slots:
 * `<ng-container before>` content before the select (attribute `before`),
 * `after` content after it, and default content (options) inside it.
 * `value` is a bindable string[]. Ships zero CSS.
 *
 * Deviation from the Svelte canonical: Svelte before/after are snippets;
 * Angular uses content projection with `select="[before]"` / `select="[after]"`.
 * No rest-props spread: attributes land on the `<lily-...>` host.
 */
@Component({
  selector: "lily-multi-select-with-extras",
  standalone: true,
  template: `<div class="multi-select-with-extras {{ className() }}">
    <ng-content select="[before]" />
    <select
      #select
      multiple
      [attr.aria-label]="label()"
      [attr.size]="size() ?? null"
      [required]="required()"
      [disabled]="disabled()"
      (change)="onChange()"
    ><ng-content /></select>
    <ng-content select="[after]" />
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectWithExtras {
  /** Accessible label, applied to the select's aria-label. */
  readonly label = input.required<string>();
  readonly className = input<string>("");
  /** Bindable selected option values. */
  readonly value = model<string[]>([]);
  readonly size = input<number | undefined>(undefined);
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  private readonly select = viewChild.required<ElementRef<HTMLSelectElement>>("select");

  constructor() {
    effect(() => {
      const selected = this.value();
      for (const option of Array.from(this.select().nativeElement.options)) {
        option.selected = selected.includes(option.value);
      }
    });
  }

  protected onChange(): void {
    this.value.set(
      Array.from(this.select().nativeElement.selectedOptions).map((o) => o.value),
    );
  }
}
