<script setup lang="ts">
// AllergyRecordListItem: one allergy or intolerance in an allergy record list, with substance, reaction, severity, criticality and status (tasks.md P28-T3, spec/healthcare-ui). Props: AllergyRecordListItem.md.
import { warnMissingProp } from "./dev-warning";

const props = defineProps<{
    /** whose record it is, when it is not the patient's ("Mother", "Fetus 1"); shown first */
    subjectLabel?: string;
    /** what the patient reacts to; never truncated */
    substance: string;
    /** the manifestation */
    reaction?: string;
    /** the reaction's severity (FHIR reaction.severity) */
    severity?: "mild" | "moderate" | "severe";
    severityLabel?: string;
    /** the risk of a future reaction (FHIR criticality), not the severity of a past one */
    criticality?: "low" | "high" | "unable-to-assess";
    criticalityLabel?: string;
    /** FHIR clinicalStatus */
    clinicalStatus?: "active" | "inactive" | "resolved";
    clinicalStatusLabel?: string;
    /** FHIR verificationStatus; a refuted or entered-in-error record must never read as a confirmed one */
    verificationStatus?: "unconfirmed" | "presumed" | "confirmed" | "refuted" | "entered-in-error";
    verificationStatusLabel?: string;
    /** allergy or intolerance, in words (FHIR type) */
    typeLabel?: string;
    /** food, medication, environment or biologic, in words (FHIR category) */
    categoryLabel?: string;
    /** when the record was last updated */
    updated?: string;
    updatedLabel?: string;
}>();

if (props.severity)
    warnMissingProp(
        "AllergyRecordListItem",
        "severityLabel",
        props.severityLabel,
        "a status needs words a person can read, never a code alone.",
    );
if (props.criticality)
    warnMissingProp(
        "AllergyRecordListItem",
        "criticalityLabel",
        props.criticalityLabel,
        "a status needs words a person can read, never a code alone.",
    );
if (props.clinicalStatus)
    warnMissingProp(
        "AllergyRecordListItem",
        "clinicalStatusLabel",
        props.clinicalStatusLabel,
        "a status needs words a person can read, never a code alone.",
    );
if (props.verificationStatus)
    warnMissingProp(
        "AllergyRecordListItem",
        "verificationStatusLabel",
        props.verificationStatusLabel,
        "a status needs words a person can read, never a code alone.",
    );
</script>

<template>
    <!-- AllergyRecordListItem.vue -->
    <li
        class="allergy-record-list-item"
        :data-severity="severity"
        :data-criticality="criticality"
        :data-clinical-status="clinicalStatus"
        :data-verification-status="verificationStatus"
    >
        <template v-if="subjectLabel"
            ><span class="allergy-record-list-item-subject">{{ subjectLabel }}</span
            >{{ " " }}</template
        >
        <span class="allergy-record-list-item-substance">{{ substance }}</span>
        <template v-if="reaction"
            >{{ " "
            }}<span class="allergy-record-list-item-reaction">{{ reaction }}</span></template
        >
        <template v-if="severityLabel"
            >{{ " "
            }}<span class="allergy-record-list-item-severity">{{ severityLabel }}</span></template
        >
        <template v-if="criticalityLabel"
            >{{ " "
            }}<span class="allergy-record-list-item-criticality">{{
                criticalityLabel
            }}</span></template
        >
        <template v-if="clinicalStatusLabel"
            >{{ " "
            }}<span class="allergy-record-list-item-clinical-status">{{
                clinicalStatusLabel
            }}</span></template
        >
        <template v-if="verificationStatusLabel"
            >{{ " "
            }}<span class="allergy-record-list-item-verification-status">{{
                verificationStatusLabel
            }}</span></template
        >
        <template v-if="typeLabel"
            >{{ " " }}<span class="allergy-record-list-item-type">{{ typeLabel }}</span></template
        >
        <template v-if="categoryLabel"
            >{{ " "
            }}<span class="allergy-record-list-item-category">{{ categoryLabel }}</span></template
        >
        <template v-if="updatedLabel"
            >{{ " "
            }}<time
                class="allergy-record-list-item-updated"
                :datetime="updated"
                >{{ updatedLabel }}</time
            ></template
        >
        <slot />
    </li>
</template>
