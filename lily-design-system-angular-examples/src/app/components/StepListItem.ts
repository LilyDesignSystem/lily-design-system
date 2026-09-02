import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * StepListItem — one step in a step list with status of waiting, in progress, finished, or error
 *
 * Headless Angular component. Attribute selector on the native `<li>` —
 * the consumer writes `<li lily-step-list-item>`, so the host element IS the
 * `<li>` with no wrapper custom element between it and its parent (a
 * wrapper broke required parent-child content-model relationships for
 * assistive technology — see spec/index.md §11.8, Angular Material's own
 * idiom for list/table sub-elements). Renders the kebab-case class hook
 * `step-list-item` plus the consumer-provided `className` on the host. Ships
 * zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "li[lily-step-list-item]",
  standalone: true,
  template: `<ng-content />`,
  host: {
    "[class]": '"step-list-item " + className()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepListItem {
  readonly className = input<string>("");
}
