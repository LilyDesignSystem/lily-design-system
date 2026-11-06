import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * StatusTag — a tag showing the current status of a task
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `status-tag` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-status-tag",
    standalone: true,
    template: `<span class="status-tag {{ className() }}" [attr.data-type]="type()">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}<ng-content /></span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusTag {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** The kind of status, read by the consumer's CSS. */
    readonly type = input<"default" | "info" | "success" | "warning" | "error">("default");
}
