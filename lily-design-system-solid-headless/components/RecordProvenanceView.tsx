// RecordProvenanceView: who recorded a record, where it came from, when, and whether it is signed or sent, in the consumer's
// words (tasks.md P29-T9). States are data-* and words; a state without words warns. Props: RecordProvenanceView.md.
import { merge, omit } from "solid-js";
import { attr } from "./attr";
import { warnMissingProp } from "./dev-warning";

export interface RecordProvenanceViewProps {
    class?: string;
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

export default function RecordProvenanceView(props: RecordProvenanceViewProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(
        p,
        "class",
        "label",
        "attestation",
        "attestationLabel",
        "sync",
        "syncLabel",
        "source",
        "sourceLabel",
        "authorLabel",
        "observed",
        "observedLabel",
        "recorded",
        "recordedLabel",
        "versionLabel",
    );
    if (p.attestation)
        warnMissingProp(
            "RecordProvenanceView",
            "attestationLabel",
            p.attestationLabel,
            "a provenance state needs words a person can read, so an unsigned or unsent record never reads as a signed one.",
        );
    if (p.sync)
        warnMissingProp(
            "RecordProvenanceView",
            "syncLabel",
            p.syncLabel,
            "a provenance state needs words a person can read, so an unsigned or unsent record never reads as a signed one.",
        );
    return (
        <span
            class={`record-provenance-view ${p.class}`}
            data-attestation={attr(p.attestation)}
            data-sync={attr(p.sync)}
            data-source={attr(p.source)}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            {p.attestationLabel ? (
                <>
                    <span class="record-provenance-view-attestation">
                        {p.attestationLabel}
                    </span>{" "}
                </>
            ) : null}
            {p.syncLabel ? (
                <>
                    <span class="record-provenance-view-sync">{p.syncLabel}</span>{" "}
                </>
            ) : null}
            {p.sourceLabel ? (
                <>
                    <span class="record-provenance-view-source">{p.sourceLabel}</span>{" "}
                </>
            ) : null}
            {p.authorLabel ? (
                <>
                    <span class="record-provenance-view-author">{p.authorLabel}</span>{" "}
                </>
            ) : null}
            {p.observedLabel ? (
                <>
                    <time
                        class="record-provenance-view-observed"
                        datetime={p.observed}
                    >
                        {p.observedLabel}
                    </time>{" "}
                </>
            ) : null}
            {p.recordedLabel ? (
                <>
                    <time
                        class="record-provenance-view-recorded"
                        datetime={p.recorded}
                    >
                        {p.recordedLabel}
                    </time>{" "}
                </>
            ) : null}
            {p.versionLabel ? (
                <>
                    <span class="record-provenance-view-version">{p.versionLabel}</span>{" "}
                </>
            ) : null}
        </span>
    );
}
