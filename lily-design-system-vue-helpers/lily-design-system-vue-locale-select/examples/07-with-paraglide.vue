<!--
    07. Wiring Paraglide JS (Inlang) — Vue 3.

    Paraglide compiles each translation to a tree-shakeable function.
    Locale is set via `setLocale()` and read via `getLocale()`. The
    select calls `setLocale` from its `@change` handler.

    Inlang ships an official Paraglide adapter for Vue (often used via
    `@inlang/paraglide-js`). The Vue integration story is the same as
    Svelte's: a runtime locale getter/setter pair plus the compiled
    message bundle.

    Prerequisites:
        pnpm add @inlang/paraglide-js
        npx @inlang/paraglide-js init
        // Compiles to ./src/paraglide/

    Outcome: choosing a locale calls setLocale, which flips the
    runtime locale. Wrap UI in a key'd template so vue-i18n-style
    auto-rerender behaviour kicks in.
-->
<script setup lang="ts">
import { ref } from "vue";
import LocaleSelect from "../LocaleSelect.vue";
// import { setLocale, getLocale, type Locale } from "@/paraglide/runtime.js";
// import * as m from "@/paraglide/messages.js";

// Demo-only stand-ins so this file compiles without Paraglide installed.
type Locale = string;
const _internal = ref<Locale>("en");
const getLocale = () => _internal.value;
const setLocale = (l: Locale) => {
    _internal.value = l;
};
const m = {
    greeting: () => `Hello (${_internal.value})`,
    body: () => `This page is currently in ${_internal.value}.`,
};

const current = ref<string>(getLocale());
</script>

<template>
    <LocaleSelect
        label="Language"
        :locales="['en', 'fr', 'ar']"
        v-model:value="current"
        storage-key="paraglide-locale"
        @change="(code) => setLocale(code as Locale)"
    />

    <!--
        Re-keying the wrapper forces Vue to discard and recreate the
        subtree on each locale change so non-reactive paraglide
        message calls re-evaluate.
    -->
    <div :key="current">
        <h1>{{ m.greeting() }}</h1>
        <p>{{ m.body() }}</p>
    </div>
</template>
