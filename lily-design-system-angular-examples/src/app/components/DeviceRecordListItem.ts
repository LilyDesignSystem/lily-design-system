import { ChangeDetectionStrategy, Component, OnInit, input } from "@angular/core";
import { warnMissingProp } from "./dev-warning";

/**
 * DeviceRecordListItem: one medical device in a device record list, with its status and when it was used (tasks.md P28-T3, spec/healthcare-ui). Attribute selector on the native `<li>`:
 * the consumer writes `<li lily-device-record-list-item>`, so the host element is the list item and the list's semantics hold. Props: DeviceRecordListItem.md.
 */
@Component({
    selector: "li[lily-device-record-list-item]",
    standalone: true,
    template: `<span class="device-record-list-item-device">{{ device() }}</span>@if (statusLabel()) {{{ " " }}<span class="device-record-list-item-status">{{ statusLabel() }}</span>}@if (timingLabel()) {{{ " " }}<time class="device-record-list-item-timing" [attr.datetime]="timing() || null">{{ timingLabel() }}</time>}<ng-content />`,
    host: {
        "[class]": '"device-record-list-item " + className()',
        "[attr.data-status]": "status() || null",
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceRecordListItem implements OnInit {
    readonly className = input<string>("");
    /** the device; never truncated */
    readonly device = input<string>("");
    /** FHIR DeviceUseStatement status */
    readonly status = input<
        "active" | "completed" | "entered-in-error" | "intended" | "stopped" | "on-hold" | ""
    >("");
    readonly statusLabel = input<string>("");
    /** when it was used, for <time datetime> */
    readonly timing = input<string>("");
    readonly timingLabel = input<string>("");

    ngOnInit(): void {
        if (this.status())
            warnMissingProp(
                "DeviceRecordListItem",
                "statusLabel",
                this.statusLabel(),
                "a status needs words a person can read, never a code alone.",
            );
    }
}
