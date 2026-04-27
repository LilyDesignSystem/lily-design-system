<script setup lang="ts">

    // CollectionListItem component
    //
    // One item in a CollectionList with optional image, heading, meta line,
    // and description. When `href` is provided, the heading text is wrapped in
    // an anchor.
    //
    // Props:
    //   heading     — string, REQUIRED. Item heading text.
    //   meta        — string, optional. Meta line (date/category).
    //   description — string, optional. Body description.
    //   imageUrl    — string, optional. Thumbnail src.
    //   imageAlt    — string, optional. Thumbnail alt text.
    //   href        — string, optional. When provided, heading becomes a link.
    //   label       — string, optional. aria-label override for the <li>.
    //   default slot — additional content rendered after the description.
    //
    // Syntax:
    //   <CollectionListItem heading="Article" href="/a" meta="2025-01-01">…</CollectionListItem>
    //
    // Examples:
    //   <CollectionListItem
    //     heading="Hello"
    //     href="/hello"
    //     meta="Jan 1, 2026"
    //     description="A short summary"
    //   />
    //
    // Accessibility:
    //   - aria-label optional, augments the implicit name
    //   - decorative image still requires alt; consumers must supply meaningful alt
    //
    // Internationalization:
    //   - All strings come from props
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - heading is required — non-optional in the interface
    //   - <a> only when href is provided
    //
    // References:
    //   - USWDS Collection item: https://designsystem.digital.gov/components/collection/

    withDefaults(defineProps<{
        /** Item heading (REQUIRED). */
        heading: string;
        /** Meta line. */
        meta?: string;
        /** Body description. */
        description?: string;
        /** Image src. */
        imageUrl?: string;
        /** Image alt text. */
        imageAlt?: string;
        /** Optional link. */
        href?: string;
        /** aria-label override. */
        label?: string;
    }>(), {
        meta: undefined,
        description: undefined,
        imageUrl: undefined,
        imageAlt: undefined,
        href: undefined,
        label: undefined,
    });

</script>

<template>
    <!-- CollectionListItem.vue -->
    <li
        class="collection-list-item"
        :aria-label="label"
    >
        <img
            v-if="imageUrl"
            class="collection-list-item-image"
            :src="imageUrl"
            :alt="imageAlt ?? ''"
        />
        <h3 class="collection-list-item-heading">
            <a v-if="href" :href="href">{{ heading }}</a>
            <template v-else>{{ heading }}</template>
        </h3>
        <p v-if="meta" class="collection-list-item-meta">{{ meta }}</p>
        <p v-if="description" class="collection-list-item-description">{{ description }}</p>
        <slot />
    </li>
</template>
