<script setup lang="ts">
import { ref, computed } from "vue";
import { components } from "~/data/components";

const search = ref("");
const filtered = computed(() =>
    components.filter(c =>
        c.name.toLowerCase().includes(search.value.toLowerCase()) ||
        c.slug.includes(search.value.toLowerCase()) ||
        c.description.toLowerCase().includes(search.value.toLowerCase())
    )
);
</script>

<template>
    <main class="page-wrapper">
        <h1>Components</h1>
        <p>284 headless components</p>

        <label for="search">Filter components</label>
        <input id="search" type="search" class="search-input" placeholder="Search components..." v-model="search" />

        <p>{{ filtered.length }} components</p>

        <ul style="list-style: none; padding: 0; margin: 0;">
            <li v-for="c in filtered" :key="c.slug" style="border-bottom: 1px solid var(--nhs-color-border, #d8dde0); padding: var(--nhs-space-3) 0;">
                <NuxtLink :to="`/components/${c.slug}`" style="font-weight: 700;">{{ c.name }}</NuxtLink>
                <span style="color: var(--nhs-color-secondary, #4c6272); margin-left: 0.5rem;">{{ c.description }}</span>
            </li>
        </ul>
    </main>
</template>
