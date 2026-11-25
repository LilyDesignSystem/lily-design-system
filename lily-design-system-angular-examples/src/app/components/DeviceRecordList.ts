import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnInit,
    input,
    viewChild,
} from "@angular/core";
import { warnMissingProp } from "./dev-warning";
import { recordListShown } from "./record-list-entries";

/**
 * DeviceRecordList: a list of a patient's medical devices, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui). For any status but "known", statusLabel is the list's
 * one item. Project `<li lily-device-record-list-item>` items. Props: DeviceRecordList.md.
 */
@Component({
    selector: "lily-device-record-list",
    standalone: true,
    template: `<ul #list class="device-record-list {{ className() }}" [attr.data-status]="shown().status || null" [attr.aria-label]="shown().name || null">@if (shown().showItem) {<li class="device-record-list-status">{{ shown().words }}</li>}<ng-content /></ul>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceRecordList implements OnInit {
    readonly className = input<string>("");
    readonly status = input<
        "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable" | ""
    >("");
    /** The consumer's words for the status; names the list. */
    readonly statusLabel = input<string>("");
    /** The accessible name, when it should differ from statusLabel. */
    readonly label = input<string>("");
    /** Your words for a list that says none are known and holds an entry, shown instead of `statusLabel`; it never says both. */
    readonly conflictLabel = input<string>("");

    private readonly list = viewChild<ElementRef<HTMLElement>>("list");
    protected readonly shown = recordListShown(
        "DeviceRecordList",
        "device-record-list",
        this.list,
        this,
    );

    ngOnInit(): void {
        warnMissingProp(
            "DeviceRecordList",
            "status",
            this.status(),
            "A device record list must say whether devices are known, none known, not recorded, unavailable, omitted or not applicable.",
        );
        warnMissingProp(
            "DeviceRecordList",
            "statusLabel",
            this.statusLabel(),
            "The status needs words a person can read.",
        );
    }
}
