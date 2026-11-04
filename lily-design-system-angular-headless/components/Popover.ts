// Popover component
//
// A floating content box anchored to a trigger element. Renders a <div role="dialog" popover="auto">: the native Popover API puts it
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
//   <lily-popover elementId="info" label="Additional information" [(open)]="showInfo">
//     <p>Here is some contextual information.</p>
//   </lily-popover>
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
    OnInit,
    inject,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";

/** Whether this element has the Popover API (`showPopover` and `hidePopover`). */
export function popoverSupported(node: HTMLElement): boolean {
    return typeof node.showPopover === "function" && typeof node.hidePopover === "function";
}

/**
 * Open or close a popover element. Where the Popover API is missing (jsdom, engines before Chrome 114,
 * Firefox 125 and Safari 17) it falls back to the `hidden` attribute, and drops the `popover` attribute,
 * which does nothing there except in jsdom, whose UA stylesheet hides every [popover] it cannot open.
 */
export function syncPopover(node: HTMLElement, open: boolean): void {
    if (!popoverSupported(node)) {
        node.removeAttribute("popover");
        node.toggleAttribute("hidden", !open);
        return;
    }
    // Showing an open popover or hiding a closed one is a no-op in current engines; older ones throw.
    try {
        if (open) node.showPopover();
        else node.hidePopover();
    } catch {
        // Already in that state, or not a valid popover: nothing to do.
    }
}

/** The `toggle` event's new state, as a boolean (true when the popover opened). */
export function toggleOpened(event: Event): boolean {
    return (event as ToggleEvent).newState === "open";
}

/**
 * Popover — a floating content box anchored to a trigger element
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `popover` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-popover",
    standalone: true,
    template: `<div
    #panel
    class="popover {{ className() }}"
    role="dialog"
    popover="auto"
    [attr.id]="elementId() || null"
    [attr.aria-label]="label() || null"
    (toggle)="onToggle($event)"
  ><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Popover implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    /** Whether the popover is open. Two-way bindable; the browser's toggle (Escape, light dismiss) writes back. */
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

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "Popover",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
