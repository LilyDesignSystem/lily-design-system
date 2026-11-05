import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * AccordionListItem — an accordion list item component
 *
 * Headless Angular component. Attribute selector on the native `<li>`: the consumer writes
 * `<li lily-accordion-list-item>`, so the host element IS the `<li>`, with no wrapper custom element between it and its
 * parent (a wrapper broke required parent-child relationships for assistive technology; see spec/index.md §11.8). It
 * holds a native `<details>`. `summary` is the header; leave it out to project your own `<summary>`. `[(open)]` is
 * two-way. Ships zero CSS.
 */
@Component({
    selector: "li[lily-accordion-list-item]",
    standalone: true,
    template: `<details [open]="open()" (toggle)="open.set($any($event.target).open)">
        @if (summary()) {
            <summary>{{ summary() }}</summary>
        }
        <ng-content />
    </details>`,
    host: {
        "[class]": '"accordion-list-item " + className()',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionListItem {
    readonly summary = input<string>("");
    readonly open = model<boolean>(false);
    readonly className = input<string>("");
}
