<script setup lang="ts">

    // NewsletterSignup component
    //
    // An email subscription form composition with idle, submitting, success, and
    // error states. Renders a <form> with optional <header>, an email <input>,
    // a submit <button>, and conditional success/error messages.
    //
    // Props:
    //   label             — string, REQUIRED. aria-label for the form.
    //   heading           — string, optional. Visible heading.
    //   description       — string, optional. Body text below heading.
    //   emailLabel        — string, REQUIRED. Visible label for the email input.
    //   emailPlaceholder  — string, optional.
    //   submitLabel       — string, REQUIRED. Submit button text.
    //   state             — "idle" | "submitting" | "success" | "error", default "idle".
    //   successMessage    — string, optional. Confirmation message.
    //   errorMessage      — string, optional. Error message.
    //   emits submit(event) — submit handler.
    //
    // Syntax:
    //   <NewsletterSignup label="Subscribe" email-label="Email" submit-label="Subscribe"
    //     :state="state" success-message="Thanks!" error-message="Try again"
    //     @submit="onSubmit" />
    //
    // Accessibility:
    //   - Form has aria-label
    //   - Success message uses role="status" + aria-live="polite"
    //   - Error message uses role="alert"
    //   - Both messages are conditionally hidden via the `hidden` attribute
    //
    // Internationalization:
    //   - All text via props
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - label, emailLabel, submitLabel are REQUIRED
    //   - Inspired by Mozilla Protocol Design System

    withDefaults(defineProps<{
        /** aria-label for the form (REQUIRED). */
        label: string;
        /** Visible heading. */
        heading?: string;
        /** Body text below heading. */
        description?: string;
        /** Visible email input label (REQUIRED). */
        emailLabel: string;
        /** Email input placeholder. */
        emailPlaceholder?: string;
        /** Submit button text (REQUIRED). */
        submitLabel: string;
        /** Form state. */
        state?: "idle" | "submitting" | "success" | "error";
        /** Success confirmation message. */
        successMessage?: string;
        /** Error message. */
        errorMessage?: string;
    }>(), {
        heading: undefined,
        description: undefined,
        emailPlaceholder: undefined,
        state: "idle",
        successMessage: undefined,
        errorMessage: undefined,
    });

    defineEmits<{
        (e: "submit", event: Event): void;
    }>();

</script>

<template>
    <!-- NewsletterSignup.vue -->
    <form
        class="newsletter-signup"
        :aria-label="label"
        :data-state="state"
        @submit="$emit('submit', $event)"
    >
        <header v-if="heading || description" class="newsletter-signup-header">
            <h3 v-if="heading" class="newsletter-signup-heading">{{ heading }}</h3>
            <p v-if="description" class="newsletter-signup-description">{{ description }}</p>
        </header>
        <label class="newsletter-signup-label">
            {{ emailLabel }}
            <input
                type="email"
                class="newsletter-signup-input"
                :placeholder="emailPlaceholder"
                :disabled="state === 'submitting'"
            >
        </label>
        <button
            type="submit"
            class="newsletter-signup-submit"
            :disabled="state === 'submitting'"
        >{{ submitLabel }}</button>
        <p
            class="newsletter-signup-success"
            role="status"
            aria-live="polite"
            :hidden="state !== 'success'"
        >{{ successMessage }}</p>
        <p
            class="newsletter-signup-error"
            role="alert"
            :hidden="state !== 'error'"
        >{{ errorMessage }}</p>
    </form>
</template>
