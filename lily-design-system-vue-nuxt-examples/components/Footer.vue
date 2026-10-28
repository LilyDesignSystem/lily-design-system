<script setup lang="ts">
// Footer component
//
// A semantic page footer landmark located at the bottom of a web page or section,
// typically used to provide secondary navigation, legal information, contact details,
// and links to important but less prominent content like privacy policies, terms of
// service, or social media profiles. Uses the native <footer> element.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, default undefined. Optional accessible name via aria-label, useful when multiple footers exist.
//   default slot. Footer content.
//   ...restProps — additional HTML attributes spread onto the footer element.
//
// Syntax:
//   <Footer label="Site footer">{children}</Footer>
//
// Examples:
//   <!-- Page footer with copyright -->
//   <Footer label="Site footer">
//     <p>Copyright 2024</p>
//   </Footer>
//
//   <!-- Footer with navigation links -->
//   <Footer>
//     <nav aria-label="Footer navigation">
//       <a href="/privacy">Privacy</a>
//       <a href="/terms">Terms</a>
//     </nav>
//   </Footer>
//
// Keyboard:
//   - None — this is a passive container; keyboard interactions are determined by child elements
//
// Accessibility:
//   - The <footer> element provides the contentinfo landmark role natively
//   - aria-label optionally distinguishes this footer from others on the page
//   - Screen reader users can navigate directly to the footer via landmark navigation
//
// Internationalization:
//   - The label prop allows localized accessible names; no hardcoded user-facing strings
//   - All content comes through the default slot
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses semantic <footer> element instead of div with role
//
// References:
//   - MDN footer element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer

withDefaults(
    defineProps<{
        /** Optional accessible name. */
        label?: string;
    }>(),
    {
        label: undefined,
    },
);
</script>

<template>
    <!-- Footer.vue -->
    <footer
        class="footer"
        :aria-label="label"
    >
        <slot />
    </footer>
</template>
