<script setup lang="ts">
// InternationalPatientSummary component
//
// An International Patient Summary (HL7 FHIR IPS, ISO 27269) laid out for a clinician: an <article> holding the "banner"
// slot, a contents navigation, the sections (default slot) and the "details" slot. Structure only: Lily parses no FHIR. The
// root takes the sections as plain data too, and adds each missing required section (medications, allergies, problems) with
// the consumer's heading and omittedLabel, after the given sections, with a contents link to it.
// See components/international-patient-summary/index.md.
import { computed } from "vue";
import { warnMissingName, warnMissingProp } from "./dev-warning";
import { ipsContents } from "./ips-sections";
import type { IpsSectionEntry } from "./ips-sections";
import InternationalPatientSummarySection from "./InternationalPatientSummarySection.vue";

const props = withDefaults(
    defineProps<{
        label: string;
        sections?: IpsSectionEntry[];
        requiredHeadings: { medications: string; allergies: string; problems: string };
        omittedLabel: string;
        contentsLabel?: string;
        headingLevel?: 2 | 3 | 4 | 5 | 6;
        idPrefix?: string;
    }>(),
    { sections: () => [], contentsLabel: undefined, headingLevel: 2, idPrefix: undefined },
);

const contents = computed(() =>
    ipsContents(props.sections, props.requiredHeadings ?? {}, props.idPrefix),
);
const added = computed(() => contents.value.filter((entry) => entry.added));

warnMissingName("InternationalPatientSummary", props.label);
warnMissingProp(
    "InternationalPatientSummary",
    "omittedLabel",
    props.omittedLabel,
    "A missing required section must be shown in words.",
);
warnMissingProp(
    "InternationalPatientSummary",
    "requiredHeadings",
    props.requiredHeadings,
    "A missing required section needs a heading.",
);
</script>

<template>
    <!-- InternationalPatientSummary.vue -->
    <article
        class="international-patient-summary"
        :aria-label="label"
    >
        <div
            v-if="$slots.banner"
            class="international-patient-summary-banner"
        >
            <slot name="banner" />
        </div>
        <nav
            v-if="contentsLabel"
            class="international-patient-summary-contents"
            :aria-label="contentsLabel"
        >
            <ol>
                <li
                    v-for="entry in contents"
                    :key="entry.id"
                    :data-section="entry.key"
                    :data-status="entry.status"
                >
                    <a :href="`#${entry.id}`">{{ entry.heading }}</a>
                </li>
            </ol>
        </nav>
        <div class="international-patient-summary-sections">
            <slot />
            <InternationalPatientSummarySection
                v-for="entry in added"
                :key="entry.id"
                :section="entry.key"
                :id="entry.id"
                :heading="entry.heading"
                :heading-level="headingLevel"
                status="omitted"
                :status-label="omittedLabel"
            />
        </div>
        <div
            v-if="$slots.details"
            class="international-patient-summary-details"
        >
            <slot name="details" />
        </div>
    </article>
</template>
