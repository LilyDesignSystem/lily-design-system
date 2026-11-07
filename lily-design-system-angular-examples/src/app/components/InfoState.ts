import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * InfoState — a composition of illustration, title, description, and action for empty, error, or info states
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `info-state` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-info-state",
    standalone: true,
    template: `<section class="info-state {{ className() }}" role="status" [attr.data-level]="level()" [attr.aria-label]="label() || title() || null">
        <div class="info-state-illustration"><ng-content select="[illustration]" /></div>
        @if (title()) {<h2 class="info-state-title">{{ title() }}</h2>}
        @if (description()) {<p class="info-state-description">{{ description() }}</p>}
        <ng-content />
        <div class="info-state-action"><ng-content select="[action]" /></div>
    </section>`,
    // title is an input here: left on the host too it would be a tooltip.
    host: { "[attr.title]": "null" },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoState {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** The kind of state, read by the consumer's CSS. */
    readonly level = input<"info" | "empty" | "error" | "success">("info");
    /** Visible title; also its name unless label is given. */
    readonly title = input<string>("");
    /** Explanation. */
    readonly description = input<string | undefined>(undefined);
}
