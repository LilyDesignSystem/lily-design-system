<script setup lang="ts">

    // GovernmentIdentifier component
    //
    // An identifier section with a parent agency logo, agency name, and
    // required government links. Renders <section class="government-identifier">
    // with a masthead area and a nested <nav> for required links.
    //
    // Props:
    //   label       — string, REQUIRED. aria-label for the section AND the nav.
    //   agencyName  — string, REQUIRED. Parent agency name.
    //   agencyHref  — string, optional. Link to the agency's site.
    //   logoUrl     — string, optional. Agency logo image src.
    //   logoAlt     — string, optional. Logo alt text.
    //   description — string, optional. Agency description.
    //   default slot — required-links list content (e.g., a <ul> of links).
    //
    // Syntax:
    //   <GovernmentIdentifier
    //     label="Agency identifier"
    //     agencyName="General Services Administration"
    //     agencyHref="https://gsa.gov"
    //     logoUrl="/gsa.svg"
    //     logoAlt="GSA logo"
    //   >…</GovernmentIdentifier>
    //
    // Accessibility:
    //   - <section> as a region landmark with aria-label
    //   - inner <nav> with aria-label for the required links
    //
    // Internationalization:
    //   - All text strings come from props
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - label and agencyName are required
    //
    // References:
    //   - USWDS Identifier: https://designsystem.digital.gov/components/identifier/

    withDefaults(defineProps<{
        /** aria-label for the section and nav (REQUIRED). */
        label: string;
        /** Parent agency name (REQUIRED). */
        agencyName: string;
        /** Link to the agency's site. */
        agencyHref?: string;
        /** Agency logo src. */
        logoUrl?: string;
        /** Agency logo alt text. */
        logoAlt?: string;
        /** Agency description. */
        description?: string;
    }>(), {
        agencyHref: undefined,
        logoUrl: undefined,
        logoAlt: undefined,
        description: undefined,
    });

</script>

<template>
    <!-- GovernmentIdentifier.vue -->
    <section
        class="government-identifier"
        :aria-label="label"
    >
        <div class="government-identifier-masthead">
            <img
                v-if="logoUrl"
                class="government-identifier-logo"
                :src="logoUrl"
                :alt="logoAlt ?? ''"
            />
            <p class="government-identifier-agency">
                <a v-if="agencyHref" :href="agencyHref">{{ agencyName }}</a>
                <span v-else>{{ agencyName }}</span>
            </p>
            <p
                v-if="description"
                class="government-identifier-description"
            >
                {{ description }}
            </p>
        </div>
        <nav
            class="government-identifier-links"
            :aria-label="label"
        >
            <slot />
        </nav>
    </section>
</template>
