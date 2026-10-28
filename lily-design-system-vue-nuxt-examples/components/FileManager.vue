<script setup lang="ts">
// FileManager component
//
// A file management interface for browsing, organizing, and managing files and
// directories. Renders a <div> with role="region" and an accessible label,
// defining a semantic boundary for the file management area. Used in content
// management systems, cloud storage apps, document editors, and admin dashboards.
// The consumer provides file listings, navigation controls, and interaction behavior.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name describing the file manager.
//   default slot. The file browser content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <FileManager label="Project files">Content</FileManager>
//
// Examples:
//   <!-- Basic file listing -->
//   <FileManager label="Project files">
//     <ul>
//       <li>document.pdf</li>
//       <li>image.png</li>
//       <li>data.csv</li>
//     </ul>
//   </FileManager>
//
// Keyboard:
//   - None built-in — consumer implements keyboard navigation for file
//     selection, folder traversal, and action triggers
//
// Accessibility:
//   - role="region" defines the file manager as a named landmark section
//   - aria-label provides an accessible name for the region
//
// Internationalization:
//   - The label prop accepts any string; consumers provide localized text
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - No internal state — purely a structural wrapper
//   - Consumer provides all file listing and action logic
//
// References:
//   - WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region
//   - WAI-ARIA Landmark Regions: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
defineProps<{
    label: string;
}>();
</script>

<template>
    <!-- FileManager.vue -->
    <div
        class="file-manager"
        role="region"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
