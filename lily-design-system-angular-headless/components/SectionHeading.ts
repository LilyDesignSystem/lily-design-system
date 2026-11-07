import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SectionHeading — a styled heading introducing a major content section, with optional eyebrow and subtitle
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `section-heading` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-section-heading",
    standalone: true,
    template: `<header class="section-heading {{ className() }}" >@if (eyebrow()) {<p class="section-heading-eyebrow">{{ eyebrow() }}</p>}@switch (level()) {@case (2) {<h2 class="section-heading-heading">{{ heading() }}</h2>} @case (3) {<h3 class="section-heading-heading">{{ heading() }}</h3>} @case (4) {<h4 class="section-heading-heading">{{ heading() }}</h4>} @case (5) {<h5 class="section-heading-heading">{{ heading() }}</h5>} @default {<h6 class="section-heading-heading">{{ heading() }}</h6>}}@if (subtitle()) {<p class="section-heading-subtitle">{{ subtitle() }}</p>}</header>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeading {
    readonly className = input<string>("");
    /** Section title. */
    readonly heading = input<string>("");
    /** Short line above the title. */
    readonly eyebrow = input<string | undefined>(undefined);
    /** Line below the title. */
    readonly subtitle = input<string | undefined>(undefined);
    /** Heading level. */
    readonly level = input<2 | 3 | 4 | 5 | 6>(2);
}
