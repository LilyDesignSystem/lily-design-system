<script setup lang="ts">
// SignaturePad component
//
// A headless container for capturing handwritten signatures using mouse, touch,
// or stylus input. Renders a <div> with role="application" and an accessible
// label. Commonly used in contract signing workflows, consent forms, delivery
// confirmations, and legal document processing. The consumer provides the actual
// drawing implementation (HTML canvas, SVG paths, or a third-party library).
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible description of the signature field via aria-label.
//   default slot. Drawing surface (canvas, SVG, or other input mechanism).
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <SignaturePad label="Sign here">
//     <canvas width="400" height="200"></canvas>
//   </SignaturePad>
//
// Examples:
//   <!-- With terms acceptance context -->
//   <SignaturePad label="Sign to accept terms">
//     <canvas width="400" height="200"></canvas>
//   </SignaturePad>
//
//   <!-- With SVG drawing surface -->
//   <SignaturePad label="Your signature">
//     <svg viewBox="0 0 400 200"><path d="" /></svg>
//   </SignaturePad>
//
// Keyboard:
//   - None — pointer-based interactions are handled by the consumer-provided drawing surface.
//
// Accessibility:
//   - role="application" indicates a complex widget with custom pointer interactions
//   - aria-label provides an accessible description of the signature pad purpose
//   - Assistive technologies pass keyboard events through to the application
//
// Internationalization:
//   - The label prop externalizes the accessible description for localization
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - No internal drawing logic — consumer provides canvas/SVG implementation
//   - role="application" is intentional for complex pointer interaction widgets
//
// References:
//   - WAI-ARIA application role: https://www.w3.org/TR/wai-aria-1.2/#application
import { useAttrs, useId } from "vue";
import { warnMissingName, warnMissingProp } from "./dev-warning";

const props = defineProps<{
    /** The group's accessible name. */
    label: string;
    /** What the signer confirms, in the consumer's words; shown first and the group's accessible description. */
    attestation?: string;
    /** The signature's outcome; rendered as data-outcome, with outcomeLabel as its words. */
    outcome?: "signed" | "declined" | "unable" | "verbal" | "on-paper" | "pending" | "revoked";
    /** The outcome in the consumer's words; required with outcome. */
    outcomeLabel?: string;
    /** Adds a typed-name field with this label, so a signature can be given by keyboard alone (WCAG 2.1.1). */
    typedNameLabel?: string;
    /** The typed-name field's form name. */
    name?: string;
}>();

/** The typed name. Two-way with v-model:typedName. */
const typedName = defineModel<string>("typedName", { default: "" });
const uid = useId();

warnMissingName(
    "SignaturePad",
    props.label,
    useAttrs()["aria-label"],
    useAttrs()["aria-labelledby"],
);

if (props.outcome)
    warnMissingProp(
        "SignaturePad",
        "outcomeLabel",
        props.outcomeLabel,
        "a signature's outcome needs words, never an empty line.",
    );
</script>

<template>
    <!-- SignaturePad.vue -->
    <div
        class="signature-pad"
        role="group"
        :aria-label="label"
        :aria-describedby="attestation ? `signature-pad-attestation-${uid}` : undefined"
        :data-outcome="outcome"
    >
        <p
            v-if="attestation"
            class="signature-pad-attestation"
            :id="`signature-pad-attestation-${uid}`"
        >
            {{ attestation }}
        </p>
        <slot />
        <p
            v-if="typedNameLabel"
            class="signature-pad-typed"
        >
            <label :for="`signature-pad-typed-${uid}`">{{ typedNameLabel }}</label>
            <input
                :id="`signature-pad-typed-${uid}`"
                v-model="typedName"
                type="text"
                autocomplete="name"
                :name="name"
            />
        </p>
        <p
            v-if="outcome && outcomeLabel"
            class="signature-pad-outcome"
        >
            {{ outcomeLabel }}
        </p>
    </div>
</template>
