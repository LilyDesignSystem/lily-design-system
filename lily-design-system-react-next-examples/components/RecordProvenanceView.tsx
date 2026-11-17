// RecordProvenanceView: who recorded a record, where it came from, when, and whether it is signed or sent, in the consumer's
// words (tasks.md P29-T9). States are data-* and words; a state without words warns. Props: RecordProvenanceView.md.
import React from "react";
import { warnMissingProp } from "./dev-warning";

export interface RecordProvenanceViewProps {
    className?: string;
    /** hidden text naming the provenance ("Provenance"), when no visible caption does */
    label?: string;
    /** whether the record is signed: "signed", "pending" (awaiting a signature), "unsigned", "amended" or "deleted"; rendered as data-attestation */
    attestation?: "signed" | "pending" | "unsigned" | "amended" | "deleted";
    /** that state in words; required with attestation */
    attestationLabel?: string;
    /** "pending" (saved on this device, not yet sent) or "failed" (could not be sent); rendered as data-sync */
    sync?: "pending" | "failed";
    /** that state in words; required with sync */
    syncLabel?: string;
    /** where the record came from, as the consumer's code ("clinic", "device", "patient-reported", "external", "extracted"); rendered as data-source */
    source?: string;
    /** that source in words ("From the patient's blood pressure monitor") */
    sourceLabel?: string;
    /** who wrote or recorded it, in the consumer's words ("Dr A Patel") */
    authorLabel?: string;
    /** when the thing recorded happened, as an ISO 8601 date or date and time */
    observed?: string;
    /** that time as the consumer writes it; the <time> shows only when set */
    observedLabel?: string;
    /** when it was recorded, as an ISO 8601 date or date and time */
    recorded?: string;
    /** that time as the consumer writes it; the <time> shows only when set */
    recordedLabel?: string;
    /** the version in words ("Version 3") */
    versionLabel?: string;
    [key: string]: unknown;
}

export default function RecordProvenanceView({
    className = "",
    label,
    attestation,
    attestationLabel,
    sync,
    syncLabel,
    source,
    sourceLabel,
    authorLabel,
    observed,
    observedLabel,
    recorded,
    recordedLabel,
    versionLabel,
    ...restProps
}: RecordProvenanceViewProps) {
    if (attestation)
        warnMissingProp(
            "RecordProvenanceView",
            "attestationLabel",
            attestationLabel,
            "a provenance state needs words a person can read, so an unsigned or unsent record never reads as a signed one.",
        );
    if (sync)
        warnMissingProp(
            "RecordProvenanceView",
            "syncLabel",
            syncLabel,
            "a provenance state needs words a person can read, so an unsigned or unsent record never reads as a signed one.",
        );
    return (
        <span
            className={`record-provenance-view ${className}`}
            data-attestation={attestation}
            data-sync={sync}
            data-source={source}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {attestationLabel ? (
                <>
                    <span className="record-provenance-view-attestation">
                        {attestationLabel}
                    </span>{" "}
                </>
            ) : null}
            {syncLabel ? (
                <>
                    <span className="record-provenance-view-sync">{syncLabel}</span>{" "}
                </>
            ) : null}
            {sourceLabel ? (
                <>
                    <span className="record-provenance-view-source">{sourceLabel}</span>{" "}
                </>
            ) : null}
            {authorLabel ? (
                <>
                    <span className="record-provenance-view-author">{authorLabel}</span>{" "}
                </>
            ) : null}
            {observedLabel ? (
                <>
                    <time
                        className="record-provenance-view-observed"
                        dateTime={observed}
                    >
                        {observedLabel}
                    </time>{" "}
                </>
            ) : null}
            {recordedLabel ? (
                <>
                    <time
                        className="record-provenance-view-recorded"
                        dateTime={recorded}
                    >
                        {recordedLabel}
                    </time>{" "}
                </>
            ) : null}
            {versionLabel ? (
                <>
                    <span className="record-provenance-view-version">{versionLabel}</span>{" "}
                </>
            ) : null}
        </span>
    );
}
