<script setup lang="ts">
// InternationalPatientSummarySection component
//
// One section of an International Patient Summary (HL7 FHIR IPS, ISO 27269): a <section> named by its heading, carrying the
// section's key, LOINC code, status and whether the IPS requires it, as data. For any status but "known" the consumer's words
// are shown under the heading. The optional "meta" and "warning" slots sit between the heading and the entries. The "narrative" slot, when given, sits in a <details> after the entries.
// See components/international-patient-summary-section/index.md.
import { computed, ref, useSlots, watchEffect } from "vue";
import { warnMissingProp } from "./dev-warning";
import { watchConflict } from "./record-list-state";
import {
    ipsSectionCode,
    ipsSectionId,
    ipsSectionIsRequired,
    ipsSectionLevel,
} from "./ips-sections";
import type { IpsSectionStatus } from "./ips-sections";

const props = withDefaults(
    defineProps<{
        section: string;
        heading: string;
        headingLevel?: 2 | 3 | 4 | 5 | 6;
        status?: IpsSectionStatus;
        statusLabel?: string;
        /** Where a status other than "known" is said in words: "heading" (default) prints `statusLabel` under the heading; "list" leaves the words to the record list inside, whose own status item says them, so they are not shown twice. */
        statusPlacement?: "heading" | "list";
        code?: string;
        required?: boolean;
        /** The section's level in the IPS: "required", "recommended" or "optional". Default the registry's level for the key; data-level. */
        level?: "required" | "recommended" | "optional";
        id?: string;
        idPrefix?: string;
        narrativeLabel?: string;
        narrativeOpen?: boolean;
    }>(),
    {
        headingLevel: 2,
        status: "known",
        statusLabel: undefined,
        statusPlacement: "heading",
        code: undefined,
        required: undefined,
        level: undefined,
        id: undefined,
        idPrefix: undefined,
        narrativeLabel: undefined,
        narrativeOpen: false,
    },
);

const slots = useSlots();
const sectionId = computed(() => ipsSectionId(props.section, props.id, props.idPrefix));
const isRequired = computed(() => props.required ?? ipsSectionIsRequired(props.section));

warnMissingProp(
    "InternationalPatientSummarySection",
    "heading",
    props.heading,
    "A section needs a heading.",
);
if (props.status !== "known" && props.statusPlacement !== "list") {
    warnMissingProp(
        "InternationalPatientSummarySection",
        "statusLabel",
        props.statusLabel,
        "A section that is not known must say why, in words.",
    );
}
if (slots.narrative) {
    warnMissingProp(
        "InternationalPatientSummarySection",
        "narrativeLabel",
        props.narrativeLabel,
        "The narrative's disclosure needs a summary.",
    );
}
// "None known" is never printed above a record list that holds an entry (HC-C17, tasks.md P50-T29).
const root = ref<HTMLElement | null>(null);
const listInConflict = ref(false);
watchEffect((onCleanup) => {
    if (props.status !== "none-known" || !root.value) {
        listInConflict.value = false;
        return;
    }
    onCleanup(watchConflict(root.value, (found) => (listInConflict.value = found)));
});
</script>

<template>
    <!-- InternationalPatientSummarySection.vue -->
    <section
        ref="root"
        class="international-patient-summary-section"
        :id="sectionId"
        :aria-labelledby="`${sectionId}-heading`"
        :data-section="section"
        :data-code="code ?? ipsSectionCode(section)"
        :data-status="status"
        :data-required="isRequired ? 'true' : undefined"
        :data-level="level ?? ipsSectionLevel(section)"
    >
        <component
            :is="`h${headingLevel}`"
            :id="`${sectionId}-heading`"
            class="international-patient-summary-section-heading"
            >{{ heading }}</component
        >
        <p
            v-if="
                status !== 'known' && statusLabel && statusPlacement !== 'list' && !listInConflict
            "
            class="international-patient-summary-section-status"
        >
            {{ statusLabel }}
        </p>
        <div
            v-if="$slots.meta"
            class="international-patient-summary-section-meta"
        >
            <slot name="meta" />
        </div>
        <div
            v-if="$slots.warning"
            class="international-patient-summary-section-warning"
        >
            <slot name="warning" />
        </div>
        <slot />
        <details
            v-if="$slots.narrative"
            class="international-patient-summary-section-narrative"
            :open="narrativeOpen"
        >
            <summary>{{ narrativeLabel }}</summary>
            <slot name="narrative" />
        </details>
    </section>
</template>
