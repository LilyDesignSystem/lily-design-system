<script setup lang="ts">
// ProcedureRecordListItem: one procedure in a procedure record list, with its status and when it was performed (tasks.md P28-T3, spec/healthcare-ui). Props: ProcedureRecordListItem.md.
import { warnMissingProp } from "./dev-warning";

const props = defineProps<{
    /** the procedure; never truncated */
    procedure: string;
    /** FHIR Procedure status */
    status?:
        | "preparation"
        | "in-progress"
        | "not-done"
        | "on-hold"
        | "stopped"
        | "completed"
        | "entered-in-error"
        | "unknown";
    statusLabel?: string;
    /** when it was performed, for <time datetime> */
    performed?: string;
    performedLabel?: string;
}>();

if (props.status)
    warnMissingProp(
        "ProcedureRecordListItem",
        "statusLabel",
        props.statusLabel,
        "a status needs words a person can read, never a code alone.",
    );
</script>

<template>
    <!-- ProcedureRecordListItem.vue -->
    <li
        class="procedure-record-list-item"
        :data-status="status"
    >
        <span class="procedure-record-list-item-procedure">{{ procedure }}</span>
        <template v-if="statusLabel"
            >{{ " "
            }}<span class="procedure-record-list-item-status">{{ statusLabel }}</span></template
        >
        <template v-if="performedLabel"
            >{{ " "
            }}<time
                class="procedure-record-list-item-performed"
                :datetime="performed"
                >{{ performedLabel }}</time
            ></template
        >
        <slot />
    </li>
</template>
