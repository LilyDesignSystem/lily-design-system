<script setup lang="ts">
import { components } from "~/data/components";
import { componentDemos } from "~/data/component-demos";

const route = useRoute();
const slug = route.params.slug as string;
const component = components.find(c => c.slug === slug);

if (!component) {
    throw createError({ statusCode: 404, statusMessage: "Component not found" });
}

const demoHtml = componentDemos[slug];
</script>

<template>
    <main class="page-wrapper">
        <p><NuxtLink to="/components">&larr; Back to components</NuxtLink></p>
        <h1>{{ component!.name }}</h1>
        <p>{{ component!.description }}</p>

        <h2>Demo</h2>
        <div class="card" style="padding: 1.5rem;">
            <div v-if="demoHtml" v-html="demoHtml"></div>
            <p v-else><em>No demo available.</em></p>
        </div>

        <h2>Details</h2>
        <dl>
            <dt>Name</dt>
            <dd>{{ component!.name }}</dd>
            <dt>Slug</dt>
            <dd><code>{{ component!.slug }}</code></dd>
            <dt>Description</dt>
            <dd>{{ component!.description }}</dd>
        </dl>
        <h2>Usage</h2>
        <pre tabindex="0"><code>&lt;{{ component!.name }} /&gt;</code></pre>
        <h2>Import</h2>
        <pre tabindex="0"><code>import {{ component!.name }} from "~/components/{{ component!.name }}.vue";</code></pre>
    </main>
</template>
