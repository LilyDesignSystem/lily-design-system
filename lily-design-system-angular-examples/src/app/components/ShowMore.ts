import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

let nextId = 0;

/**
 * ShowMore component
 *
 * A headless "show more / show less" toggle for long content. The content
 * stays in the accessibility tree at all times; collapsing is a visual clamp
 * the consumer applies in CSS keyed on data-expanded. (Use Expander when the
 * content should be removed from the DOM while collapsed.)
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   moreLabel — string, required. Button text while collapsed. No default.
 *   lessLabel — string, required. Button text while expanded. No default.
 *   expanded — boolean, default false. Bindable.
 *   children — content. The content.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Keyboard:
 *   - Enter / Space on the native button toggles
 *
 * Accessibility:
 *   - button aria-expanded + aria-controls pointing at the content id
 *
 * Claude rules:
 *   - Headless: no inline style; the clamp is consumer CSS on [data-expanded="false"]
 */
@Component({
    selector: "lily-show-more",
    standalone: true,
    template: `<div class="show-more {{ className() }}">
    <div class="show-more-content" [id]="contentId" [attr.data-expanded]="expanded()"><ng-content /></div>
    <button
      type="button"
      class="show-more-button"
      [attr.aria-expanded]="expanded()"
      [attr.aria-controls]="contentId"
      (click)="expanded.set(!expanded())"
    >{{ expanded() ? lessLabel() : moreLabel() }}</button>
  </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowMore {
    /** Button text while collapsed. */
    readonly moreLabel = input.required<string>();
    /** Button text while expanded. */
    readonly lessLabel = input.required<string>();
    readonly className = input<string>("");
    /** Whether the content is expanded. Bindable. */
    readonly expanded = model<boolean>(false);

    protected readonly contentId = `show-more-${nextId++}`;
}
