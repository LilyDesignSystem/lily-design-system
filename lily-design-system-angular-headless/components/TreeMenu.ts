import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TreeMenu — a hierarchical tree menu with expandable branches
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tree-menu` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-tree-menu",
    standalone: true,
    template: `<div
    class="tree-menu {{ className() }}"
    role="tree"
    tabindex="-1"
    [attr.aria-label]="label() || null"
    (keydown)="onKeydown($event)"
  ><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeMenu {
    readonly label = input<string>("");
    readonly className = input<string>("");

    /** ArrowDown / ArrowUp move between the projected [role="treeitem"] items, wrapping; Home / End jump. */
    protected onKeydown(event: KeyboardEvent): void {
        if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
        const root = event.currentTarget as HTMLElement;
        const items = Array.from(root.querySelectorAll<HTMLElement>('[role="treeitem"]'));
        if (items.length === 0) return;
        const current = items.indexOf((event.target as Element).closest('[role="treeitem"]') as HTMLElement);
        const last = items.length - 1;
        let next: number;
        if (event.key === "Home") next = 0;
        else if (event.key === "End") next = last;
        else if (event.key === "ArrowDown") next = current >= last ? 0 : current + 1;
        else next = current <= 0 ? last : current - 1;
        event.preventDefault();
        items[next].focus();
    }
}
