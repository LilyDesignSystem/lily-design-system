// ContextualHelp component
//
// A help button that opens a popover with explanatory content. Renders a <div> wrapper
// containing a <button> trigger (aria-haspopup="dialog", aria-expanded, aria-controls) and a
// <div role="dialog" popover="auto"> panel. The trigger opens and closes the panel through the
// native Popover API with command="toggle-popover" commandfor (and popovertarget for engines
// before command/commandfor): open, Escape and light dismiss need no script, and the panel's
// toggle event keeps `expanded` in step. Where the Popover API is missing (jsdom, old engines)
// the click toggles `expanded` and the panel's `hidden` attribute.
//
// Inputs:
//   label — string, REQUIRED. aria-label for the trigger (its accessible name).
//   triggerLabel — string, REQUIRED. Visible text of the trigger, such as "?" or "؟". No
//     default; pass "" when CSS draws an icon.
//   expanded — boolean, default false, two-way ([(expanded)]).
//   className — string, optional. Appended to the base class.
// Outputs:
//   triggerClick — the trigger's click event; preventDefault() stops the toggle.
//
// Usage:
//   <lily-contextual-help label="Help for username" triggerLabel="?" [(expanded)]="open">
//     <p>Use 3-20 characters.</p>
//   </lily-contextual-help>
//
// References:
//   - Adobe Spectrum ContextualHelp: https://spectrum.adobe.com/page/contextual-help/
//   - HTML command and commandfor: https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-command

import {
    afterRenderEffect,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    input,
    model,
    output,
    viewChild,
} from "@angular/core";

import { popoverSupported, syncPopover, toggleOpened } from "./Popover";

let nextId = 0;

/**
 * ContextualHelp — a help button that opens a popover with explanatory content
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `contextual-help` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-contextual-help",
    standalone: true,
    template: `<div class="contextual-help {{ className() }}">
    <button
      class="contextual-help-trigger"
      type="button"
      [attr.aria-label]="label() || null"
      aria-haspopup="dialog"
      [attr.aria-expanded]="expanded() ? 'true' : 'false'"
      [attr.aria-controls]="panelId"
      command="toggle-popover"
      [attr.commandfor]="panelId"
      [attr.popovertarget]="panelId"
      (click)="onClick($event)"
    >{{ triggerLabel() }}</button>
    <div
      #panel
      class="contextual-help-panel"
      [id]="panelId"
      role="dialog"
      popover="auto"
      (toggle)="onToggle($event)"
    ><ng-content /></div>
  </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextualHelp {
    readonly label = input.required<string>();
    /** Visible text of the trigger, such as "?" (required; no default). */
    readonly triggerLabel = input.required<string>();
    /** Whether the popover is open. Two-way bindable; the browser's toggle writes back. */
    readonly expanded = model<boolean>(false);
    readonly className = input<string>("");
    /** The trigger's click; call preventDefault() to stop the toggle. */
    readonly triggerClick = output<MouseEvent>();

    protected readonly panelId = `contextual-help-panel-${++nextId}`;
    private readonly panel = viewChild.required<ElementRef<HTMLElement>>("panel");

    constructor() {
        afterRenderEffect(() => syncPopover(this.panel().nativeElement, this.expanded()));
    }

    protected onClick(event: MouseEvent): void {
        this.triggerClick.emit(event);
        if (event.defaultPrevented) return;
        // With the Popover API the browser toggles the panel and onToggle follows it.
        if (!popoverSupported(this.panel().nativeElement)) this.expanded.set(!this.expanded());
    }

    protected onToggle(event: Event): void {
        this.expanded.set(toggleOpened(event));
    }
}
