import { ChangeDetectionStrategy, Component, ElementRef, effect, input, model, viewChild } from "@angular/core";
import {
  isWheelTypeaheadKey,
  nextWheelIndex,
  nextWheelPrefix,
  WHEEL_MOVE_KEYS,
  wheelTypeaheadIndex,
  type WheelMoveKey,
  type WheelOption,
  type WheelTypeahead,
} from "./wheel-picker";

export type { WheelOption };

let nextUid = 0;

/**
 * WheelPicker — a vertical single-select listbox where the selection follows the cursor.
 *
 * Mirrors the Svelte canonical: moving with the arrow keys, typing, or clicking an option chooses it. The component owns
 * the roles and the keys; the wheel LOOK (scroll snapping, fading) is the consumer's CSS. `value` is a two-way `model`
 * (`[(value)]`); the listbox is `.wheel-picker-list` (`role="listbox"`, vertical, `aria-activedescendant`), each option
 * `.wheel-picker-option` (`role="option"`, `aria-selected`, `aria-disabled`). Keyboard (APG listbox, selection follows
 * focus): ArrowDown / ArrowUp, Home / End, PageDown / PageUp, type-ahead over the labels; disabled options are skipped.
 *
 * Inputs: `label` (required), `options` (required), `value` (model), `loop`, `pageSize`, `disabled`, `name`, `className`.
 * Deviation from Svelte: no rest-props spread (Angular cannot spread onto an inner element).
 */
@Component({
  selector: "lily-wheel-picker",
  standalone: true,
  template: `<div class="wheel-picker {{ className() }}"><div #list class="wheel-picker-list" role="listbox" [attr.aria-label]="label()" aria-orientation="vertical" [attr.aria-disabled]="disabled() ? 'true' : null" [attr.aria-activedescendant]="selectedIndex() >= 0 ? uid + '-option-' + selectedIndex() : null" [attr.tabindex]="disabled() ? -1 : 0" (keydown)="onKeydown($event)" (click)="onClick($event)">@for (option of options(); track option.value; let i = $index) {<div class="wheel-picker-option" role="option" [attr.id]="uid + '-option-' + i" [attr.aria-selected]="i === selectedIndex()" [attr.aria-disabled]="option.disabled ? 'true' : null" [attr.data-value]="option.value" [attr.data-index]="i">{{ option.label }}</div>}</div>@if (name()) {<input type="hidden" [attr.name]="name()" [value]="value()" />}</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WheelPicker {
  readonly className = input<string>("");
  /** Accessible name. */
  readonly label = input.required<string>();
  /** The choices. */
  readonly options = input.required<WheelOption[]>();
  /** The selected option's value; two-way. */
  readonly value = model<string>("");
  /** Arrow keys wrap at the ends. */
  readonly loop = input<boolean>(false);
  /** Enabled options PageUp / PageDown move by. */
  readonly pageSize = input<number>(5);
  /** Ignores keys and clicks. */
  readonly disabled = input<boolean>(false);
  /** Form field name for a hidden input. */
  readonly name = input<string | undefined>(undefined);

  protected readonly uid = `wheel-picker-${nextUid++}`;
  private readonly list = viewChild<ElementRef<HTMLElement>>("list");
  private typeahead: WheelTypeahead = { prefix: "", at: 0 };

  protected selectedIndex(): number {
    const value = this.value();
    return this.options().findIndex((o) => o.value === value);
  }

  constructor() {
    // Keep the selected option centred in the list. Only the list scrolls (never the page), and instantly: no animation.
    effect(() => {
      const el = this.list()?.nativeElement;
      const index = this.options().findIndex((o) => o.value === this.value());
      if (!el || index < 0) return;
      const option = el.querySelector<HTMLElement>(`[data-index="${index}"]`);
      if (!option) return;
      el.scrollTop = option.offsetTop - (el.clientHeight - option.offsetHeight) / 2;
    });
  }

  private select(index: number): void {
    if (index < 0) return;
    const next = this.options()[index].value;
    if (next === this.value()) return; // applying the selection already held is a no-op
    this.value.set(next);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    if (WHEEL_MOVE_KEYS.includes(event.key)) {
      event.preventDefault();
      this.select(nextWheelIndex(this.options(), this.selectedIndex(), event.key as WheelMoveKey, { loop: this.loop(), pageSize: this.pageSize() }));
    } else if (isWheelTypeaheadKey(event)) {
      this.typeahead = nextWheelPrefix(this.typeahead, event.key, Date.now());
      this.select(wheelTypeaheadIndex(this.options(), this.selectedIndex(), this.typeahead.prefix));
    }
  }

  protected onClick(event: MouseEvent): void {
    if (this.disabled()) return;
    const target = (event.target as Element).closest<HTMLElement>('[role="option"]');
    if (!target || target.getAttribute("aria-disabled") === "true") return;
    this.select(Number(target.getAttribute("data-index")));
    this.list()?.nativeElement.focus();
  }
}
