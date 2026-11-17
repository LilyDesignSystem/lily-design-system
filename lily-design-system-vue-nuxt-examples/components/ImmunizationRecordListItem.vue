<script setup lang="ts">
// ImmunizationRecordListItem: one immunization in an immunization record list, with vaccine, date, dose and status (tasks.md P28-T3, spec/healthcare-ui). Props: ImmunizationRecordListItem.md.
import { warnMissingProp } from "./dev-warning";

const props = defineProps<{
    /** whose record it is, when it is not the patient's ("Mother", "Fetus 1"); shown first */
    subjectLabel?: string;
    /** the vaccine given; never truncated */
    vaccine: string;
    /** when it was given, for <time datetime> */
    occurrence?: string;
    occurrenceLabel?: string;
    /** the dose in words ("Dose 2 of 2") */
    doseNumberLabel?: string;
    /** FHIR Immunization status */
    status?: "completed" | "entered-in-error" | "not-done";
    statusLabel?: string;
    /** the vaccine's lot number */
    lotNumber?: string;
}>();

if (props.status)
    warnMissingProp(
        "ImmunizationRecordListItem",
        "statusLabel",
        props.statusLabel,
        "a status needs words a person can read, never a code alone.",
    );
</script>

<template>
    <!-- ImmunizationRecordListItem.vue -->
    <li
        class="immunization-record-list-item"
        :data-status="status"
    >
        <template v-if="subjectLabel"
            ><span class="immunization-record-list-item-subject">{{ subjectLabel }}</span
            >{{ " " }}</template
        >
        <span class="immunization-record-list-item-vaccine">{{ vaccine }}</span>
        <template v-if="occurrenceLabel"
            >{{ " "
            }}<time
                class="immunization-record-list-item-occurrence"
                :datetime="occurrence"
                >{{ occurrenceLabel }}</time
            ></template
        >
        <template v-if="doseNumberLabel"
            >{{ " "
            }}<span class="immunization-record-list-item-dose-number">{{
                doseNumberLabel
            }}</span></template
        >
        <template v-if="statusLabel"
            >{{ " "
            }}<span class="immunization-record-list-item-status">{{ statusLabel }}</span></template
        >
        <template v-if="lotNumber"
            >{{ " "
            }}<span class="immunization-record-list-item-lot-number">{{
                lotNumber
            }}</span></template
        >
        <slot />
    </li>
</template>
