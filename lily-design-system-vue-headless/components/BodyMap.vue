<script setup lang="ts">
// BodyMap: marking regions of the body on a consumer-supplied drawing (spec/healthcare-ui item 11). A fieldset named by
// its legend; the drawing (default slot) is aria-hidden; every region is a real checkbox in a list, which submits with
// the form, and a click on a shape marked data-region toggles it. v-model:selected. Props: BodyMap.md.
import { onMounted, ref, useAttrs, watch } from "vue";
import { warnMissingName } from "./dev-warning";

const props = defineProps<{
    /** The question, rendered as the legend. */
    label: string;
    regions: { id: string; label: string }[];
    /** The checkboxes' form name. */
    name?: string;
}>();
const selected = defineModel<string[]>("selected", { default: () => [] });
warnMissingName("BodyMap", props.label, useAttrs()["aria-labelledby"]);

const figure = ref<HTMLDivElement | null>(null);

function toggle(id: string) {
    selected.value = selected.value.includes(id)
        ? selected.value.filter((s) => s !== id)
        : [...selected.value, id];
}

function onFigureClick(event: MouseEvent) {
    const id = (event.target as Element).closest("[data-region]")?.getAttribute("data-region");
    if (id && props.regions.some((r) => r.id === id)) toggle(id);
}

function mirror() {
    for (const shape of figure.value?.querySelectorAll("[data-region]") ?? []) {
        if (selected.value.includes(shape.getAttribute("data-region") ?? ""))
            shape.setAttribute("data-selected", "true");
        else shape.removeAttribute("data-selected");
    }
}
onMounted(mirror);
watch(selected, mirror, { flush: "post" });
</script>

<template>
    <!-- BodyMap.vue -->
    <fieldset class="body-map">
        <legend class="body-map-legend">{{ label }}</legend>
        <div
            v-if="$slots.default"
            ref="figure"
            class="body-map-figure"
            aria-hidden="true"
            @click="onFigureClick"
        >
            <slot />
        </div>
        <ul class="body-map-regions">
            <li
                v-for="region in regions"
                :key="region.id"
            >
                <label class="body-map-region"
                    ><input
                        type="checkbox"
                        :name="name"
                        :value="region.id"
                        :checked="selected.includes(region.id)"
                        @change="toggle(region.id)"
                    />
                    {{ region.label }}</label
                >
            </li>
        </ul>
    </fieldset>
</template>
