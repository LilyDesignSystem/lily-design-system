import { ChangeDetectionStrategy, Component, OnInit, input } from "@angular/core";
import { warnMissingProp } from "./dev-warning";

/**
 * DeviceRecordList: a list of a patient's medical devices, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui). For any status but "known", statusLabel is the list's
 * one item. Project `<li lily-device-record-list-item>` items. Props: DeviceRecordList.md.
 */
@Component({
    selector: "lily-device-record-list",
    standalone: true,
    template: `<ul class="device-record-list {{ className() }}" [attr.data-status]="status() || null" [attr.aria-label]="label() || statusLabel() || null">@if (status() !== "known") {<li class="device-record-list-status">{{ statusLabel() }}</li>}<ng-content /></ul>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceRecordList implements OnInit {
    readonly className = input<string>("");
    readonly status = input<
        "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | ""
    >("");
    /** The consumer's words for the status; names the list. */
    readonly statusLabel = input<string>("");
    /** The accessible name, when it should differ from statusLabel. */
    readonly label = input<string>("");

    ngOnInit(): void {
        warnMissingProp(
            "DeviceRecordList",
            "status",
            this.status(),
            "A device record list must say whether devices are known, none known, not recorded, unavailable or omitted.",
        );
        warnMissingProp(
            "DeviceRecordList",
            "statusLabel",
            this.statusLabel(),
            "The status needs words a person can read.",
        );
    }
}
