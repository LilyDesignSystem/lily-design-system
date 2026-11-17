import { ChangeDetectionStrategy, Component, input, OnInit } from "@angular/core";
import { warnMissingProp } from "./dev-warning";

/**
 * RecordProvenanceView: who recorded a record, where it came from, when, and whether it is signed or sent, in the consumer's
 * words (tasks.md P29-T9). States are data-* and words; a state without words warns. Props: RecordProvenanceView.md.
 */
@Component({
    selector: "lily-record-provenance-view",
    standalone: true,
    template: `<span class="record-provenance-view {{ className() }}" [attr.data-attestation]="attestation() || null" [attr.data-sync]="sync() || null" [attr.data-source]="source() || null">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}@if (attestationLabel()) {<span class="record-provenance-view-attestation">{{ attestationLabel() }}</span>{{ " " }}}@if (syncLabel()) {<span class="record-provenance-view-sync">{{ syncLabel() }}</span>{{ " " }}}@if (sourceLabel()) {<span class="record-provenance-view-source">{{ sourceLabel() }}</span>{{ " " }}}@if (authorLabel()) {<span class="record-provenance-view-author">{{ authorLabel() }}</span>{{ " " }}}@if (observedLabel()) {<time class="record-provenance-view-observed" [attr.datetime]="observed() || null">{{ observedLabel() }}</time>{{ " " }}}@if (recordedLabel()) {<time class="record-provenance-view-recorded" [attr.datetime]="recorded() || null">{{ recordedLabel() }}</time>{{ " " }}}@if (versionLabel()) {<span class="record-provenance-view-version">{{ versionLabel() }}</span>{{ " " }}}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordProvenanceView implements OnInit {
    readonly className = input<string>("");
    /** hidden text naming the provenance ("Provenance"), when no visible caption does */
    readonly label = input<string>("");
    /** whether the record is signed: "signed", "pending" (awaiting a signature), "unsigned", "amended" or "deleted"; rendered as data-attestation */
    readonly attestation = input<"signed" | "pending" | "unsigned" | "amended" | "deleted" | "">(
        "",
    );
    /** that state in words; required with attestation */
    readonly attestationLabel = input<string>("");
    /** "pending" (saved on this device, not yet sent) or "failed" (could not be sent); rendered as data-sync */
    readonly sync = input<"pending" | "failed" | "">("");
    /** that state in words; required with sync */
    readonly syncLabel = input<string>("");
    /** where the record came from, as the consumer's code ("clinic", "device", "patient-reported", "external", "extracted"); rendered as data-source */
    readonly source = input<string>("");
    /** that source in words ("From the patient's blood pressure monitor") */
    readonly sourceLabel = input<string>("");
    /** who wrote or recorded it, in the consumer's words ("Dr A Patel") */
    readonly authorLabel = input<string>("");
    /** when the thing recorded happened, as an ISO 8601 date or date and time */
    readonly observed = input<string>("");
    /** that time as the consumer writes it; the <time> shows only when set */
    readonly observedLabel = input<string>("");
    /** when it was recorded, as an ISO 8601 date or date and time */
    readonly recorded = input<string>("");
    /** that time as the consumer writes it; the <time> shows only when set */
    readonly recordedLabel = input<string>("");
    /** the version in words ("Version 3") */
    readonly versionLabel = input<string>("");

    ngOnInit(): void {
        if (this.attestation())
            warnMissingProp(
                "RecordProvenanceView",
                "attestationLabel",
                this.attestationLabel(),
                "a provenance state needs words a person can read, so an unsigned or unsent record never reads as a signed one.",
            );
        if (this.sync())
            warnMissingProp(
                "RecordProvenanceView",
                "syncLabel",
                this.syncLabel(),
                "a provenance state needs words a person can read, so an unsigned or unsent record never reads as a signed one.",
            );
    }
}
