<script setup lang="ts">
import { components } from "~/data/components";
import { componentDemos } from "~/data/component-demos";
import { componentExamples } from "~/data/component-examples";

const route = useRoute();
const slug = route.params.slug as string;
const component = components.find(c => c.slug === slug);

if (!component) {
    throw createError({ statusCode: 404, statusMessage: "Component not found" });
}

const demoHtml = componentDemos[slug];
const example = componentExamples[slug];
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

        <details v-if="demoHtml">
            <summary>Show demo markup</summary>
            <pre tabindex="0"><code>{{ demoHtml }}</code></pre>
        </details>

        <template v-if="example?.variants?.length">
            <h2>More examples</h2>
            <div v-for="variant in example.variants" :key="variant.title">
                <h3>{{ variant.title }}</h3>
                <div class="card" style="padding: 1.5rem;" v-html="variant.html"></div>
                <details>
                    <summary>Show markup</summary>
                    <pre tabindex="0"><code>{{ variant.html }}</code></pre>
                </details>
            </div>
        </template>

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
        <pre tabindex="0"><code v-if="example?.usage">{{ example.usage.code }}</code><code v-else>&lt;{{ component!.name }} /&gt;</code></pre>
        <h2>Import</h2>
        <pre tabindex="0"><code>import {{ component!.name }} from "~/components/{{ component!.name }}.vue";</code></pre>
    </main>
</template>
