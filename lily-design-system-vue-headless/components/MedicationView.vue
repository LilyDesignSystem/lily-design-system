<script setup lang="ts">
// MedicationView: a medicine's name, strength, form, route and frequency, none truncated (spec/healthcare-ui item 3).
// Tall man letters come from the consumer as marked segments; Lily ships no list. Props: MedicationView.md.
withDefaults(
    defineProps<{
        label?: string;
        name?: string;
        /** The name in parts, tall man letters marked; used instead of name. */
        nameSegments?: { text: string; tallMan?: boolean }[];
        /** The strength, formatted by the consumer. */
        strength?: string;
        form?: string;
        route?: string;
        frequency?: string;
    }>(),
    { name: "" },
);
</script>

<template>
    <!-- MedicationView.vue -->
    <span class="medication-view"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        ><span class="medication-view-name"
            ><template v-if="nameSegments"
                ><template
                    v-for="(segment, i) in nameSegments"
                    :key="i"
                    ><span
                        v-if="segment.tallMan"
                        class="medication-view-tall-man"
                        >{{ segment.text }}</span
                    ><template v-else>{{ segment.text }}</template></template
                ></template
            ><template v-else>{{ name }}</template></span
        ><template v-if="strength"
            >{{ " " }}<span class="medication-view-strength">{{ strength }}</span></template
        ><template v-if="form"
            >{{ " " }}<span class="medication-view-form">{{ form }}</span></template
        ><template v-if="route"
            >{{ " " }}<span class="medication-view-route">{{ route }}</span></template
        ><template v-if="frequency"
            >{{ " " }}<span class="medication-view-frequency">{{ frequency }}</span></template
        ></span
    >
</template>
