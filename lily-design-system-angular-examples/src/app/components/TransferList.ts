import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TransferList — a dual-list control for moving items between an available and a selected list
 *
 * Headless Angular component. A labelled `role="group"` `<div>` holding a labelled source
 * `<section>`, a `transfer-list-actions` `<div>` and a labelled target `<section>`. The
 * consumer supplies the two lists (`<ul source role="listbox">…`, `<ul target …>`) and the
 * move buttons (`<button actions>`), and owns their state and keys. Unlike Svelte, the
 * actions wrapper is rendered even when empty: Angular cannot see whether projected
 * content was given. Ships zero CSS.
 */
@Component({
    selector: "lily-transfer-list",
    standalone: true,
    template: `<div class="transfer-list {{ className() }}" role="group" [attr.aria-label]="label()">
        <section class="transfer-list-source" [attr.aria-label]="sourceLabel()"><ng-content select="[source]" /></section>
        <div class="transfer-list-actions"><ng-content select="[actions]" /></div>
        <section class="transfer-list-target" [attr.aria-label]="targetLabel()"><ng-content select="[target]" /></section>
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferList {
    /** Accessible name for the group (required). */
    readonly label = input.required<string>();
    /** Accessible name for the source list's section (required). */
    readonly sourceLabel = input.required<string>();
    /** Accessible name for the target list's section (required). */
    readonly targetLabel = input.required<string>();
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
}
