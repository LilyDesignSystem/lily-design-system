<script setup lang="ts">

    // Alert component
    //
    // A headless alert for displaying important messages to the user, such as
    // warnings, errors, confirmations, or status updates. Renders a <div> with
    // ARIA live region attributes so screen readers announce content automatically.
    //
    // Supports severity types (info, success, warning, error) exposed via a
    // data-type attribute for consumer CSS styling. An optional heading is
    // rendered with <strong> emphasis without assuming a heading level.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   type     — "info" | "success" | "warning" | "error", default "info".
    //              Severity type exposed as data-type attribute.
    //   heading  — string, optional. Heading text rendered as <p><strong>.
    //   role     — "alert" | "status", default "alert". ARIA role:
    //              "alert" for assertive (immediate), "status" for polite.
    //   live     — "assertive" | "polite" | "off", optional. Overrides the
    //              default aria-live value derived from the role.
    //   default slot. The alert content.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <Alert>Message</Alert>
    //   <Alert type="error" heading="Error">Details here.</Alert>
    //
    // Examples:
    //   <!-- Simple info alert (default) -->
    //   <Alert>Something happened.</Alert>
    //
    //   <!-- Error alert with heading -->
    //   <Alert type="error" heading="Error">Something went wrong.</Alert>
    //
    //   <!-- Success notification -->
    //   <Alert type="success" heading="Saved">Your changes were saved.</Alert>
    //
    //   <!-- Polite status message -->
    //   <Alert role="status">Loading complete.</Alert>
    //
    //   <!-- Warning with custom attributes -->
    //   <Alert type="warning" data-testid="warn-alert">Check your input.</Alert>
    //
    // Keyboard: None — alerts are passive announcements, not interactive.
    //
    // Accessibility:
    //   - role="alert" with aria-live="assertive" for immediate announcements
    //   - role="status" with aria-live="polite" for less urgent messages
    //   - aria-atomic="true" ensures the entire region is re-read on change
    //   - data-type exposes severity for consumer styling (not for assistive tech)
    //
    // Internationalization:
    //   - All text comes through default slot and heading prop
    //   - No hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Do not use heading elements (h1-h6); use <p><strong> for the heading
    //   - The live prop overrides the default; omit it to use role-based defaults
    //   - data-type is for styling hooks, not semantics
    //
    // References:
    //   - WAI-ARIA Alert Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alert/
    //   - WAI-ARIA alert role: https://www.w3.org/TR/wai-aria-1.2/#alert
    //   - WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status

    import { computed } from "vue";

    const props = withDefaults(defineProps<{
        /** The alert severity type */
        type?: "info" | "success" | "warning" | "error";
        /** Optional heading text for the alert */
        heading?: string;
        /** ARIA role: "alert" for assertive, "status" for polite */
        role?: "alert" | "status";
        /** ARIA live region politeness override */
        live?: "assertive" | "polite" | "off";
    }>(), {
        type: "info",
        heading: undefined,
        role: "alert",
        live: undefined,
    });

    const ariaLive = computed(() =>
        props.live ?? (props.role === "alert" ? "assertive" : "polite"),
    );

</script>

<template>
    <!-- Alert.vue -->
    <div
        class="alert"
        :role="role"
        :aria-live="ariaLive"
        aria-atomic="true"
        :data-type="type"
    >
                <p v-if="heading"><strong>{{ heading }}</strong></p>
        <slot />
    </div>
</template>
