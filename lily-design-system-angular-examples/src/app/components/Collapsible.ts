import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * Collapsible — a container that can be expanded or collapsed
 *
 * Headless Angular component: native `<details>` and `<summary>`, like the Svelte, React, Vue and Nunjucks ports, so the
 * browser supplies the keys. `[(open)]` is two-way. Ships zero CSS.
 */
@Component({
    selector: "lily-collapsible",
    standalone: true,
    template: `<details
        class="collapsible {{ className() }}"
        [open]="open()"
        (toggle)="open.set($any($event.target).open)"
    >
        <summary>{{ summary() }}</summary>
        <ng-content />
    </details>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Collapsible {
    readonly summary = input.required<string>();
    readonly open = model<boolean>(false);
    readonly className = input<string>("");
}
