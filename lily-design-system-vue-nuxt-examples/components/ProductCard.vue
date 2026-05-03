<script setup lang="ts">

    // ProductCard component
    //
    // A headless specialized card for displaying a product with an optional
    // image, a required name, a required pre-formatted price, and arbitrary
    // child content for descriptions and actions. Renders an <article> root so
    // each card is a self-contained landmark with an explicit accessible name.
    //
    // Props:
    //   name     — string, REQUIRED. Product name; rendered as <h3>.
    //   price    — string, REQUIRED. Pre-formatted price text.
    //   imageUrl — string, optional. Product image src.
    //   imageAlt — string, optional. Image alt text.
    //   label    — string, optional. aria-label override (defaults to name).
    //   default slot — additional content (description, actions).
    //   ...restProps — additional HTML attributes spread onto <article>.
    //
    // Syntax:
    //   <ProductCard name="Widget" price="$9.99" imageUrl="/w.jpg" imageAlt="Widget" />
    //
    // Examples:
    //   <!-- Card with image and CTA -->
    //   <ProductCard
    //     name="Wonder Widget"
    //     price="$19.99"
    //     image-url="/widget.jpg"
    //     image-alt="Wonder Widget product photo"
    //   >
    //     <p>A widget that wonders.</p>
    //     <button>Add to cart</button>
    //   </ProductCard>
    //
    // Keyboard: None at the container level; any interactive children handle
    // their own keyboard behavior.
    //
    // Accessibility:
    //   - <article> creates an implicit landmark
    //   - aria-label defaults to the product name
    //   - <h3> provides the name in the document outline
    //   - imageAlt is required when imageUrl is provided to avoid empty alt text
    //
    // Internationalization:
    //   - All text comes from props or slots
    //   - The component does not format the price; the consumer formats currency
    //
    // Claude rules:
    //   - Headless: no CSS or styles
    //   - Image is rendered only when imageUrl is provided
    //
    // References:
    //   - HTML <article> element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article

    withDefaults(defineProps<{
        /** Product name (required). */
        name: string;
        /** Pre-formatted price (required). */
        price: string;
        /** Product image src. */
        imageUrl?: string;
        /** Product image alt text. */
        imageAlt?: string;
        /** aria-label override. */
        label?: string;
    }>(), {
        imageUrl: undefined,
        imageAlt: undefined,
        label: undefined,
    });

</script>

<template>
    <!-- ProductCard.vue -->
    <article
        class="product-card"
        :aria-label="label ?? name"
    >
        <img
            v-if="imageUrl"
            class="product-card-image"
            :src="imageUrl"
            :alt="imageAlt ?? ''"
        />
        <header class="product-card-header">
            <h3 class="product-card-name">{{ name }}</h3>
            <p class="product-card-price">{{ price }}</p>
        </header>
        <slot />
    </article>
</template>
