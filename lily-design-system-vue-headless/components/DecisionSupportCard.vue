<script setup lang="ts">
// DecisionSupportCard: a clinical decision support card in the CDS Hooks shape (spec/healthcare-ui item 4). Not a live
// region: whether a critical card interrupts is the consumer's choice. Emits "suggestion" (id) and "dismiss" (reason).
// Props and rules: DecisionSupportCard.md.
import { ref } from "vue";

const props = withDefaults(
    defineProps<{
        summary: string;
        indicator: "info" | "warning" | "critical";
        indicatorLabel: string;
        sourceLabel: string;
        sourceHref?: string;
        suggestions?: { id: string; label: string; isRecommended?: boolean }[];
        links?: { label: string; href: string }[];
        dismissLabel?: string;
        overrideReasons?: { code: string; display: string }[];
        overrideReasonLabel?: string;
        overrideReasonPlaceholder?: string;
        label?: string;
    }>(),
    {
        suggestions: () => [],
        links: () => [],
        overrideReasons: () => [],
        overrideReasonPlaceholder: "",
    },
);

const emit = defineEmits<{ suggestion: [id: string]; dismiss: [reason?: string] }>();

const reason = ref("");
const invalid = ref(false);
const select = ref<HTMLSelectElement | null>(null);

function dismiss() {
    if (props.overrideReasons.length > 0 && !reason.value) {
        invalid.value = true;
        select.value?.focus();
        return;
    }
    invalid.value = false;
    emit("dismiss", reason.value || undefined);
}
</script>

<template>
    <!-- DecisionSupportCard.vue -->
    <div
        class="decision-support-card"
        role="group"
        :aria-label="label ?? summary"
        :data-indicator="indicator"
    >
        <p class="decision-support-card-header">
            <span class="decision-support-card-indicator">{{ indicatorLabel }}</span>
            <span class="decision-support-card-summary">{{ summary }}</span>
        </p>
        <div
            v-if="$slots.default"
            class="decision-support-card-detail"
        >
            <slot />
        </div>
        <p class="decision-support-card-source">
            <a
                v-if="sourceHref"
                :href="sourceHref"
                >{{ sourceLabel }}</a
            ><template v-else>{{ sourceLabel }}</template>
        </p>
        <div
            v-if="suggestions.length > 0"
            class="decision-support-card-suggestions"
        >
            <button
                v-for="suggestion in suggestions"
                :key="suggestion.id"
                type="button"
                class="decision-support-card-suggestion"
                :data-recommended="suggestion.isRecommended ? 'true' : undefined"
                @click="emit('suggestion', suggestion.id)"
            >
                {{ suggestion.label }}
            </button>
        </div>
        <ul
            v-if="links.length > 0"
            class="decision-support-card-links"
        >
            <li
                v-for="link in links"
                :key="link.href"
            >
                <a :href="link.href">{{ link.label }}</a>
            </li>
        </ul>
        <form
            v-if="dismissLabel"
            class="decision-support-card-override"
            novalidate
            @submit.prevent="dismiss"
        >
            <label
                v-if="overrideReasons.length > 0"
                class="decision-support-card-override-label"
                >{{ overrideReasonLabel }}
                <select
                    ref="select"
                    v-model="reason"
                    class="decision-support-card-override-reason"
                    required
                    :aria-invalid="invalid ? 'true' : undefined"
                    @change="invalid = false"
                >
                    <option value="">{{ overrideReasonPlaceholder }}</option>
                    <option
                        v-for="option in overrideReasons"
                        :key="option.code"
                        :value="option.code"
                    >
                        {{ option.display }}
                    </option>
                </select></label
            >
            <button
                type="submit"
                class="decision-support-card-dismiss"
            >
                {{ dismissLabel }}
            </button>
        </form>
    </div>
</template>
