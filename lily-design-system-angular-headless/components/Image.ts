import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Image — an image element with alt text
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `image` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-image",
    standalone: true,
    template: `@if (!caption()) {
        <img class="image {{ className() }}" [attr.src]="src() ?? null" [attr.alt]="alt()" [attr.loading]="loading() ?? null" />
    } @else {
        <figure class="image {{ className() }}">
            <img [attr.src]="src() ?? null" [attr.alt]="alt()" [attr.loading]="loading() ?? null" />
            <figcaption>{{ caption() }}</figcaption>
        </figure>
    }`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Image {
    readonly className = input<string>("");
    /** Image address. */
    readonly src = input<string | undefined>(undefined);
    /** Text alternative, or empty for a decorative image. */
    readonly alt = input<string>("");
    /** Visible caption; wraps the image in a figure. */
    readonly caption = input<string | undefined>(undefined);
    /** Loading strategy. */
    readonly loading = input<"lazy" | "eager" | undefined>(undefined);
}
