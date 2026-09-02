import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Option — an option element within a select dropdown
 *
 * Headless Angular component. Attribute selector on the native `<option>` —
 * the consumer writes `<option lily-option>`, so the host element IS the
 * `<option>` with no wrapper custom element between it and its parent (a
 * wrapper broke required parent-child content-model relationships for
 * assistive technology — see spec/index.md §11.8, Angular Material's own
 * idiom for list/table sub-elements). Renders the kebab-case class hook
 * `option` plus the consumer-provided `className` on the host. Ships
 * zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "option[lily-option]",
  standalone: true,
  template: `<ng-content />`,
  host: {
    "[class]": '"option " + className()',
    "[value]": "value()",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Option {
  readonly value = input<string>("");
  readonly className = input<string>("");
}
