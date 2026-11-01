import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * Tour — a tour guide, such as for sightseeing, or pathways, or demonstrations, etc.
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tour` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 *
 * Non-modal (tasks.md P18-T6): a tour points at parts of the real page and often asks the user to try them, so
 * the page stays usable; `role="dialog"` without `aria-modal`, no focus trap. Escape ends it.
 */
@Component({
    selector: "lily-tour",
    standalone: true,
    template: `@if (active()) {
    <div
      class="tour {{ className() }}"
      role="dialog"
      tabindex="-1"
      [attr.aria-label]="label() || null"
      (keydown)="onKeydown($event)"
    ><ng-content /></div>
  }`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tour {
    readonly label = input<string>("");
    /** Whether the tour is showing. Two-way bindable; Escape sets it to false. */
    readonly active = model<boolean>(false);
    readonly className = input<string>("");

    protected onKeydown(event: KeyboardEvent): void {
        if (event.key === "Escape") this.active.set(false);
    }
}
