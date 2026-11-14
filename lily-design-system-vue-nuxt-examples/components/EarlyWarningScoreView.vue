<script setup lang="ts">
// EarlyWarningScoreView: an early warning score with its band and escalation (spec/healthcare-ui item 5). Display only:
// it computes nothing. Props: EarlyWarningScoreView.md.
import { warnMissingProp } from "./dev-warning";

const props = defineProps<{
    label?: string;
    /** The score the consumer computed. */
    score: string | number;
    system?: string;
    /** The consumer's band key, as data-band. */
    band?: string;
    /** The band in words; required with band. */
    bandLabel?: string;
    escalation?: string;
}>();

if (props.band)
    warnMissingProp(
        "EarlyWarningScoreView",
        "bandLabel",
        props.bandLabel,
        "A band needs words, not colour alone (WCAG 1.4.1).",
    );
</script>

<template>
    <!-- EarlyWarningScoreView.vue -->
    <span
        class="early-warning-score-view"
        :data-band="band"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        ><template v-if="system"
            ><span class="early-warning-score-view-system">{{ system }}</span
            >{{ " " }}</template
        ><span class="early-warning-score-view-score">{{ score }}</span
        ><template v-if="bandLabel"
            >{{ " " }}<span class="early-warning-score-view-band">{{ bandLabel }}</span></template
        ><template v-if="escalation"
            >{{ " "
            }}<span class="early-warning-score-view-escalation">{{ escalation }}</span></template
        ></span
    >
</template>
