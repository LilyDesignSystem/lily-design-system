// Popup component
//
// A temporary overlay that appears above page content. Renders a <div role="dialog" popover="auto">: the native Popover API puts it
// in the top layer while open and closes it on Escape and on a click outside it (light
// dismiss), with no script. `open` is a two-way model() that follows the element's
// toggle event, so a light dismiss or a command="toggle-popover" trigger keeps it in step.
// Where the Popover API is missing (jsdom, old engines) it falls back to `hidden`.
//
// Inputs:
//   label — string, required. aria-label for the dialog.
//   open — boolean, default false, two-way ([(open)]).
//   elementId — string, optional. id of the inner popover <div>, so a trigger can name it
//     with commandfor (not `id`, which stays on the host element).
//   className — string, optional. Appended to the base class.
//
// Usage:
//   <button type="button" command="toggle-popover" commandfor="info">Toggle info</button>
//   <lily-popup elementId="info" label="Additional information" [(open)]="showInfo">
//     <p>Here is some contextual information.</p>
//   </lily-popup>
//
// References:
//   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog/
//   - MDN Popover API: https://developer.mozilla.org/en-US/docs/Web/API/Popover_API

import {
    afterRenderEffect,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    input,
    model,
    viewChild,
} from "@angular/core";
import { syncPopover, toggleOpened } from "./Popover";

/**
 * Popup — a temporary overlay that appears above page content
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `popup` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-popup",
    standalone: true,
    template: `<div
    #panel
    class="popup {{ className() }}"
    role="dialog"
    popover="auto"
    [attr.id]="elementId() || null"
    [attr.aria-label]="label() || null"
    (toggle)="onToggle($event)"
  ><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Popup {
    readonly label = input<string>("");
    /** Whether the popup is open. Two-way bindable; the browser's toggle (Escape, light dismiss) writes back. */
    readonly open = model<boolean>(false);
    /** id of the inner popover element, for a commandfor / popovertarget trigger. */
    readonly elementId = input<string>("");
    readonly className = input<string>("");

    private readonly panel = viewChild.required<ElementRef<HTMLElement>>("panel");

    constructor() {
        afterRenderEffect(() => syncPopover(this.panel().nativeElement, this.open()));
    }

    protected onToggle(event: Event): void {
        this.open.set(toggleOpened(event));
    }
}
