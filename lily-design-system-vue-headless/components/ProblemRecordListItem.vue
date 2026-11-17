<script setup lang="ts">
// ProblemRecordListItem: one problem or condition in a problem record list, with its clinical and verification status, severity, onset and resolution (tasks.md P28-T3, spec/healthcare-ui). Props: ProblemRecordListItem.md.
import { warnMissingProp } from "./dev-warning";

const props = defineProps<{
    /** whose record it is, when it is not the patient's ("Mother", "Fetus 1"); shown first */
    subjectLabel?: string;
    /** the problem or condition; never truncated */
    condition: string;
    /** FHIR Condition clinicalStatus */
    clinicalStatus?: "active" | "recurrence" | "relapse" | "inactive" | "remission" | "resolved";
    clinicalStatusLabel?: string;
    /** FHIR Condition verificationStatus; a refuted or entered-in-error record must never read as a confirmed one */
    verificationStatus?:
        | "unconfirmed"
        | "provisional"
        | "differential"
        | "confirmed"
        | "refuted"
        | "entered-in-error";
    verificationStatusLabel?: string;
    /** the severity in words */
    severityLabel?: string;
    /** when it began, for <time datetime> */
    onset?: string;
    onsetLabel?: string;
    /** when it resolved, for <time datetime> */
    abatement?: string;
    abatementLabel?: string;
}>();

if (props.clinicalStatus)
    warnMissingProp(
        "ProblemRecordListItem",
        "clinicalStatusLabel",
        props.clinicalStatusLabel,
        "a status needs words a person can read, never a code alone.",
    );
if (props.verificationStatus)
    warnMissingProp(
        "ProblemRecordListItem",
        "verificationStatusLabel",
        props.verificationStatusLabel,
        "a status needs words a person can read, never a code alone.",
    );
</script>

<template>
    <!-- ProblemRecordListItem.vue -->
    <li
        class="problem-record-list-item"
        :data-clinical-status="clinicalStatus"
        :data-verification-status="verificationStatus"
    >
        <template v-if="subjectLabel"
            ><span class="problem-record-list-item-subject">{{ subjectLabel }}</span
            >{{ " " }}</template
        >
        <span class="problem-record-list-item-condition">{{ condition }}</span>
        <template v-if="clinicalStatusLabel"
            >{{ " "
            }}<span class="problem-record-list-item-clinical-status">{{
                clinicalStatusLabel
            }}</span></template
        >
        <template v-if="verificationStatusLabel"
            >{{ " "
            }}<span class="problem-record-list-item-verification-status">{{
                verificationStatusLabel
            }}</span></template
        >
        <template v-if="severityLabel"
            >{{ " "
            }}<span class="problem-record-list-item-severity">{{ severityLabel }}</span></template
        >
        <template v-if="onsetLabel"
            >{{ " "
            }}<time
                class="problem-record-list-item-onset"
                :datetime="onset"
                >{{ onsetLabel }}</time
            ></template
        >
        <template v-if="abatementLabel"
            >{{ " "
            }}<time
                class="problem-record-list-item-abatement"
                :datetime="abatement"
                >{{ abatementLabel }}</time
            ></template
        >
        <slot />
    </li>
</template>
