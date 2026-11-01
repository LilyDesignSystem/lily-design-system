<script setup lang="ts">
// TourList component
//
// A headless guided walkthrough overlay that presents step-by-step
// instructions to users. Useful for onboarding flows, feature tutorials, or
// contextual help systems. The consumer provides TourListItem children to
// define each step of the tour.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the tour dialog via aria-label.
//   active — boolean, default false. Whether the tour is visible; bindable with bind:active.
//   default slot. TourListItem elements.
//   ...restProps — additional HTML attributes spread onto the <ol>.
//
// Syntax:
//   <TourList label="Getting started" v-model:active>...</TourList>
//
// Examples:
//   <!-- Multi-step tour -->
//   <TourList label="Getting started" v-model:active>
//     <TourListItem label="Welcome" current={step === 0} stepNumber={1} totalSteps={3}>
//       <p>Welcome to the app!</p>
//       <button onclick={() => step++}>Next</button>
//     </TourListItem>
//     <TourListItem label="Features" current={step === 1} stepNumber={2} totalSteps={3}>
//       <p>Here are the features.</p>
//       <button onclick={() => step--}>Back</button>
//       <button onclick={() => step++}>Next</button>
//     </TourListItem>
//   </TourList>
//
// Keyboard:
//   - Escape: closes the tour by setting active to false
//
// Accessibility:
//   - native <ol> list semantics: no role="dialog" (it would hide the list) and no aria-modal (not modal);
//     dialog semantics belong to the enclosing Tour, which is non-modal
//   - aria-label={label} provides an accessible name for the tour
//   - tabindex="-1" allows the dialog to receive focus for keyboard events
//
// Internationalization:
//   - The label prop accepts any translated string
//   - All step content comes through TourListItem children
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Compound component: pair with TourListItem for each step
//   - Uses defineModel() for two-way binding on active
//
// References:
//   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

const props = defineProps<{
    /** Accessible label for the tour. */
    label: string;
}>();

const active = defineModel("active", { default: false });

function onkeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
        active.value = false;
    }
}
</script>

<template>
    <!-- TourList.vue -->
    <ol
        v-if="active"
        class="tour-list"
        :aria-label="label"
        tabindex="-1"
        @keydown="onkeydown"
    >
        <slot />
    </ol>
</template>
