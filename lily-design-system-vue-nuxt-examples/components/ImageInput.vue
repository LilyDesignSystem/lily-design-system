<script setup lang="ts">

    // ImageInput component
    //
    // A headless image submit button using the native HTML <input type="image">
    // element. When clicked within a form, it submits the form and sends the
    // click coordinates (x, y) as part of the form data. The component requires
    // a source image URL and alt text for accessibility. Commonly used for
    // graphical submit buttons such as custom-styled form submission controls.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   src — string, required. The URL of the image to display.
    //   alt — string, required. Alternative text describing the image button.
    //   width — number, optional. The display width of the image in pixels.
    //   height — number, optional. The display height of the image in pixels.
    //   disabled — boolean, default false. Whether the input is disabled.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <ImageInput src="/submit.png" alt="Submit" />
    //
    // Examples:
    //   <!-- Image submit with dimensions -->
    //   <ImageInput src="/submit.png" alt="Submit" :width="100" :height="40" />
    //
    //   <!-- Disabled image submit -->
    //   <ImageInput src="/submit.png" alt="Submit" disabled />
    //
    // Keyboard:
    //   - Enter: activates the image button (native behavior)
    //   - Space: activates the image button (native behavior)
    //
    // Accessibility:
    //   - Native <input type="image"> has an implicit button role
    //   - The alt attribute serves as the accessible name
    //   - No additional ARIA attributes needed beyond native semantics
    //
    // Internationalization:
    //   - The alt prop externalizes user-facing text for translation
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - No default slot -- uses src and alt attributes for display
    //
    // References:
    //   - MDN input type="image": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/image

    withDefaults(defineProps<{
        /** The URL of the image to display. */
        src: string;
        /** Alternative text describing the image button. */
        alt: string;
        /** The display width of the image in pixels. */
        width?: number;
        /** The display height of the image in pixels. */
        height?: number;
        /** Whether disabled. */
        disabled?: boolean;
    }>(), {
        width: undefined,
        height: undefined,
        disabled: false,
    });

</script>

<template>
    <!-- ImageInput.vue -->
    <input
        class="image-input"
        type="image"
        :src="src"
        :alt="alt"
        :width="width"
        :height="height"
        :disabled="disabled"
    />
</template>
