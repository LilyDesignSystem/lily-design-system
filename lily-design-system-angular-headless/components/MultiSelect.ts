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
 * MultiSelect — a native select that allows choosing several options at once
 *
 * Headless Angular component. Renders `<select multiple>` with the kebab-case
 * class hook `multi-select` plus the consumer-provided `className`; project
 * `<option lily-option>` children. `value` is a bindable string[].
 * Native keyboard only. Ships zero CSS.
 *
 * Deviation from the Svelte canonical: no rest-props spread (attributes land
 * on the host element); use the named inputs.
 */
@Component({
  selector: "lily-multi-select",
  standalone: true,
  template: `<select
    #select
    class="multi-select {{ className() }}"
    multiple
    [attr.aria-label]="label()"
    [attr.size]="size() ?? null"
    [required]="required()"
    [disabled]="disabled()"
    (change)="onChange()"
  ><ng-content /></select>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelect {
  /** Accessible label, applied to aria-label. */
  readonly label = input.required<string>();
  readonly className = input<string>("");
  /** Bindable selected option values. */
  readonly value = model<string[]>([]);
  /** Number of visible rows. */
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
