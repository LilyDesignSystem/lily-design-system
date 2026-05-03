<script setup lang="ts">

    // DownloadButton component
    //
    // A download link styled as a button. Renders as an <a> element so consumers
    // can right-click and save. Pre-formatted file size and file format are
    // exposed as data attributes for styling and progressive enhancement.
    //
    // Props:
    //   href        — string, REQUIRED. File URL.
    //   label       — string, REQUIRED. Accessible label.
    //   fileSize    — string, optional. Pre-formatted size text (e.g., "2.4 MB").
    //   fileFormat  — string, optional. Format text (e.g., "PDF").
    //   download    — string | boolean, optional. Native download attribute.
    //   default slot — button content; defaults to label if omitted.
    //
    // Syntax:
    //   <DownloadButton href="/file.pdf" label="Download report" file-size="2.4 MB" file-format="PDF">
    //     Download report
    //   </DownloadButton>
    //
    // Accessibility:
    //   - Implicit link semantics
    //   - aria-label provides descriptive name including download intent
    //
    // Internationalization:
    //   - All text via props/slots
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - href and label are REQUIRED — non-optional in the interface
    //   - Inspired by Mozilla Protocol Design System

    withDefaults(defineProps<{
        /** File URL (REQUIRED). */
        href: string;
        /** Accessible label (REQUIRED). */
        label: string;
        /** Pre-formatted file size text. */
        fileSize?: string;
        /** File format text. */
        fileFormat?: string;
        /** Native download attribute (boolean true or filename string). */
        download?: string | boolean;
    }>(), {
        fileSize: undefined,
        fileFormat: undefined,
        download: undefined,
    });

</script>

<template>
    <!-- DownloadButton.vue -->
    <a
        class="download-button"
        :href="href"
        :aria-label="label"
        :data-file-size="fileSize"
        :data-file-format="fileFormat"
        :download="download === true ? '' : (download === false ? undefined : download)"
    >
        <slot>{{ label }}</slot>
    </a>
</template>
