<script setup lang="ts">
// RecordProvenanceView: who recorded a record, where it came from, when, and whether it is signed or sent, in the consumer's
// words (tasks.md P29-T9). States are data-* and words; a state without words warns. Props: RecordProvenanceView.md.
import { warnMissingProp } from "./dev-warning";

const props = defineProps<{
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
}>();

if (props.attestation)
    warnMissingProp(
        "RecordProvenanceView",
        "attestationLabel",
        props.attestationLabel,
        "a provenance state needs words a person can read, so an unsigned or unsent record never reads as a signed one.",
    );
if (props.sync)
    warnMissingProp(
        "RecordProvenanceView",
        "syncLabel",
        props.syncLabel,
        "a provenance state needs words a person can read, so an unsigned or unsent record never reads as a signed one.",
    );
</script>

<template>
    <!-- RecordProvenanceView.vue -->
    <span
        class="record-provenance-view"
        :data-attestation="attestation"
        :data-sync="sync"
        :data-source="source"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        ><template v-if="attestationLabel"
            ><span class="record-provenance-view-attestation">{{ attestationLabel }}</span
            >{{ " " }}</template
        ><template v-if="syncLabel"
            ><span class="record-provenance-view-sync">{{ syncLabel }}</span
            >{{ " " }}</template
        ><template v-if="sourceLabel"
            ><span class="record-provenance-view-source">{{ sourceLabel }}</span
            >{{ " " }}</template
        ><template v-if="authorLabel"
            ><span class="record-provenance-view-author">{{ authorLabel }}</span
            >{{ " " }}</template
        ><template v-if="observedLabel"
            ><time
                class="record-provenance-view-observed"
                :datetime="observed"
                >{{ observedLabel }}</time
            >{{ " " }}</template
        ><template v-if="recordedLabel"
            ><time
                class="record-provenance-view-recorded"
                :datetime="recorded"
                >{{ recordedLabel }}</time
            >{{ " " }}</template
        ><template v-if="versionLabel"
            ><span class="record-provenance-view-version">{{ versionLabel }}</span
            >{{ " " }}</template
        ></span
    >
</template>
