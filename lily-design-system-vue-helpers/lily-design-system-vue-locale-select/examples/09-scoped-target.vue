<!--
    09. Scoped target — change locale of one region, not the whole page.

    Useful for multilingual content panels: a single page with three
    cards each in a different language. Pass `:target="panelRef"` so
    the picker writes lang/dir to that element instead of <html>.

    Outcome: the surrounding page stays in its document language; the
    chosen panel switches independently. Two panels each scoped to
    their own picker.
-->
<script setup lang="ts">
import { ref } from "vue";
import LocaleSelect from "../LocaleSelect.vue";

const panelA = ref<HTMLElement | null>(null);
const panelB = ref<HTMLElement | null>(null);

const aLocale = ref("en");
const bLocale = ref("fr");
</script>

<template>
    <article>
        <h1>Document language stays English; panels switch independently.</h1>

        <section ref="panelA" class="panel">
            <h2>Panel A</h2>
            <LocaleSelect
                label="Panel A language"
                :locales="['en', 'fr', 'ar']"
                :target="panelA"
                v-model:value="aLocale"
            />
            <p>Current panel locale: <code>{{ aLocale }}</code></p>
        </section>

        <section ref="panelB" class="panel">
            <h2>Panel B</h2>
            <LocaleSelect
                label="Panel B language"
                :locales="['en', 'fr', 'ar']"
                :target="panelB"
                v-model:value="bLocale"
            />
            <p>Current panel locale: <code>{{ bLocale }}</code></p>
        </section>
    </article>
</template>
