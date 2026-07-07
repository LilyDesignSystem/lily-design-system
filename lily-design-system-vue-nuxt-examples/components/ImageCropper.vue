<script setup lang="ts">

    // ImageCropper component
    //
    // A headless container for cropping and resizing an image to a selected region.
    // Renders a <div> with role="application" and an accessible label. Commonly used
    // in avatar editors, media upload flows, and document scanning. The consumer
    // provides the actual cropping implementation (HTML canvas, SVG overlay, or a
    // third-party cropping library).
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible description of the crop region via aria-label.
    //   default slot. Crop surface (image, canvas, SVG overlay, or other mechanism).
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <ImageCropper label="Crop image">
    //     <img src="photo.jpg" alt="" />
    //   </ImageCropper>
    //
    // Examples:
    //   <!-- With avatar editing context -->
    //   <ImageCropper label="Crop your profile photo">
    //     <img src="avatar.jpg" alt="" />
    //   </ImageCropper>
    //
    //   <!-- With canvas crop surface -->
    //   <ImageCropper label="Select crop region">
    //     <canvas width="400" height="300"></canvas>
    //   </ImageCropper>
    //
    // Keyboard:
    //   - None — pointer-based interactions are handled by the consumer-provided crop surface.
    //
    // Accessibility:
    //   - role="application" indicates a complex widget with custom pointer interactions
    //   - aria-label provides an accessible description of the image cropper purpose
    //   - Assistive technologies pass keyboard events through to the application
    //
    // Internationalization:
    //   - The label prop externalizes the accessible description for localization
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - No internal cropping logic — consumer provides image/canvas implementation
    //   - role="application" is intentional for complex pointer interaction widgets
    //
    // References:
    //   - WAI-ARIA application role: https://www.w3.org/TR/wai-aria-1.2/#application
    defineProps<{
        label: string;
    }>();

</script>

<template>
    <!-- ImageCropper.vue -->
    <div
        class="image-cropper"
        role="application"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
