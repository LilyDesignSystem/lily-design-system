import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { attrWhenSet } from "./attr-when-set";

/**
 * CalendarTableTD — a calendar table interactive grid data cell for managing dates, days, etc. <td>
 *
 * Headless Angular component. Attribute selector on the native `<td>` —
 * the consumer writes `<td lily-calendar-table-td>`, so the host element IS the
 * `<td>` with no wrapper custom element between it and its parent (a
 * wrapper broke required parent-child content-model relationships for
 * assistive technology — see spec/index.md §11.8, Angular Material's own
 * idiom for list/table sub-elements). Renders the kebab-case class hook
 * `calendar-table-td` plus the consumer-provided `className` on the host. Ships
 * zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "td[lily-calendar-table-td]",
    standalone: true,
    template: `<ng-content />`,
    host: {
        "[class]": '"calendar-table-td " + className()',
        role: "gridcell",
        tabindex: "-1",
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarTableTD {
    readonly className = input<string>("");
    /** Whether this day is selected. */
    readonly selected = input<boolean | undefined>(undefined);
    /** Whether this day is today. */
    readonly today = input<boolean | undefined>(undefined);
    private readonly tabStop = attrWhenSet("tabindex", () => {
        const selected = this.selected();
        return selected === undefined ? undefined : selected ? "0" : "-1";
    });
    private readonly selectedState = attrWhenSet("aria-selected", () => {
        const selected = this.selected();
        return selected === undefined ? undefined : selected ? "true" : null;
    });
    private readonly current = attrWhenSet("aria-current", () => {
        const today = this.today();
        return today === undefined ? undefined : today ? "date" : null;
    });
}
