<script setup lang="ts">
// Card component
//
// A headless card that groups related content in a <div>, which has
// role="group" when labelled. Supports a configurable heading level (h2-h6) for proper
// document outline, with an optional link wrapper on the heading. Commonly used
// for product listings, user profiles, article previews, and dashboard widgets.
//
// Props:
//   className — string, optional. CSS class name.
//   heading — string, optional. Heading text for the card.
//   headingLevel — 2 | 3 | 4 | 5 | 6, default 3. HTML heading level.
//   href — string, optional. Makes the heading a link.
//   label — string, optional. Names the card, which then has role="group".
//   default slot. Card body content.
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <Card><h3>Title</h3><p>Content</p></Card>
//
// Examples:
//   <!-- Card with heading link -->
//   <Card heading="Product" href="/products/1"><p>Description</p></Card>
//
//   <!-- Card with custom heading level and label -->
//   <Card heading="Dashboard" headingLevel={2} label="Sales dashboard">
//     <p>Revenue metrics</p>
//   </Card>
//
// Keyboard:
//   - Tab: Focus the heading link when href is provided
//   - Enter: Activate the heading link (browser default)
//
// Accessibility:
//   - A <div>, not an <article>: an article on every card in a list is noise. Pass role="article" for a stand-alone card
//   - Optional label names the card as role="group"; with no label the <div> is generic and unnamed
//   - Heading provides document outline structure at the specified level
//
// Internationalization:
//   - All text comes through heading and children props; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Heading level should match the card's position in the document outline
//
// References:
//   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group

withDefaults(
    defineProps<{
        heading?: string;
        headingLevel?: 2 | 3 | 4 | 5 | 6;
        href?: string;
        label?: string;
    }>(),
    {
        heading: undefined,
        headingLevel: 3,
        href: undefined,
        label: undefined,
    },
);
</script>

<template>
    <!-- Card.vue -->
    <div
        class="card"
        :role="label ? 'group' : undefined"
        :aria-label="label || undefined"
    >
        <template v-if="heading">
            <h2 v-if="headingLevel === 2">
                <a
                    v-if="href"
                    :href="href"
                    >{{ heading }}</a
                >
                <template v-else>{{ heading }}</template>
            </h2>
            <h3 v-else-if="headingLevel === 3">
                <a
                    v-if="href"
                    :href="href"
                    >{{ heading }}</a
                >
                <template v-else>{{ heading }}</template>
            </h3>
            <h4 v-else-if="headingLevel === 4">
                <a
                    v-if="href"
                    :href="href"
                    >{{ heading }}</a
                >
                <template v-else>{{ heading }}</template>
            </h4>
            <h5 v-else-if="headingLevel === 5">
                <a
                    v-if="href"
                    :href="href"
                    >{{ heading }}</a
                >
                <template v-else>{{ heading }}</template>
            </h5>
            <h6 v-else-if="headingLevel === 6">
                <a
                    v-if="href"
                    :href="href"
                    >{{ heading }}</a
                >
                <template v-else>{{ heading }}</template>
            </h6>
        </template>
        <slot />
    </div>
</template>
