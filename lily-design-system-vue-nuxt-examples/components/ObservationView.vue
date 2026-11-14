<script setup lang="ts">
// ObservationView: a read-only clinical observation or result, with unit, flag and reference range (spec/healthcare-ui
// item 1). Shows what the consumer decided; computes no flag and no range. Props and rules: ObservationView.md.
import { computed } from "vue";
import { warnMissingProp } from "./dev-warning";

const props = withDefaults(
    defineProps<{
        /** Hidden text naming the observation. */
        label?: string;
        value?: string;
        unit?: string;
        /** A FHIR v3 ObservationInterpretation code, rendered as data-interpretation. */
        interpretation?: string;
        /** The consumer's words for the flag; required when it is not normal. */
        flagLabel?: string;
        range?: string;
        status?: "final" | "preliminary" | "not-recorded" | "unavailable";
        statusLabel?: string;
    }>(),
    { value: "", status: "final" },
);

if (props.status !== "final")
    warnMissingProp(
        "ObservationView",
        "statusLabel",
        props.statusLabel,
        "A result that is not final must say so in words.",
    );
if (props.interpretation && props.interpretation !== "N")
    warnMissingProp(
        "ObservationView",
        "flagLabel",
        props.flagLabel,
        "An abnormal flag needs words, not colour alone (WCAG 1.4.1).",
    );

const missing = computed(() => props.status === "not-recorded" || props.status === "unavailable");
</script>

<template>
    <!-- ObservationView.vue -->
    <span
        class="observation-view"
        :data-interpretation="interpretation || undefined"
        :data-status="status"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        ><span
            v-if="missing"
            class="observation-view-status"
            >{{ statusLabel }}</span
        ><template v-else
            ><span class="observation-view-value">{{ value }}</span
            ><template v-if="unit"
                >{{ " " }}<span class="observation-view-unit">{{ unit }}</span></template
            ><template v-if="flagLabel"
                >{{ " " }}<span class="observation-view-flag">{{ flagLabel }}</span></template
            ><template v-if="range"
                >{{ " " }}<span class="observation-view-range">{{ range }}</span></template
            ><template v-if="status === 'preliminary' && statusLabel"
                >{{ " " }}<span class="observation-view-status">{{ statusLabel }}</span></template
            ></template
        ></span
    >
</template>
