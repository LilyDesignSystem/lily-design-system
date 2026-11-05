import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * TaskListItem — one task item with a checkbox and label
 *
 * Headless Angular component. Attribute selector on the native `<li>`: the consumer writes `<li lily-task-list-item>`, so the
 * host element IS the `<li>`. It holds a checkbox in a label; the text is `label`, content, or both. `[(checked)]` is two-way.
 * Ships zero CSS.
 */
@Component({
    selector: "li[lily-task-list-item]",
    standalone: true,
    template: `<label>
        <input
            type="checkbox"
            [checked]="checked()"
            [disabled]="disabled()"
            (change)="checked.set($any($event.target).checked)"
        />
        {{ label() }}<ng-content />
    </label>`,
    host: {
        "[class]": '"task-list-item " + className()',
        "[attr.data-checked]": "checked()",
        "[attr.data-disabled]": "disabled() || null",
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListItem {
    readonly label = input<string>("");
    readonly checked = model<boolean>(false);
    readonly disabled = input<boolean>(false);
    readonly className = input<string>("");
}
