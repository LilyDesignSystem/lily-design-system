<!--
    02. Customizing the <select> / <option> markup via the default
    scoped slot.

    The select already renders a native `<select>` by default, so this
    example shows how to take full control of that markup — supplying
    your own `<select>` and `<option>` elements (e.g. to add a class
    hook, group options, or change the option text) while the select
    still owns the lifecycle (lang/dir/storage/change). Best when the
    design system needs bespoke dropdown markup.

    Outcome: a single <select> populated with one <option> per locale,
    each carrying its own BCP 47 `lang`. The select's watch/onMounted
    runs the same way as the default rendering.
-->
<script setup lang="ts">
import { ref } from "vue";
import LocaleSelect from "../LocaleSelect.vue";

const locale = ref("en");
</script>

<template>
    <LocaleSelect
        label="Language"
        :locales="[
            'en', 'en_US', 'en_GB',
            'fr', 'fr_CA',
            'es', 'es_419',
            'de',
            'zh_Hans', 'zh_Hant',
            'ja', 'ko',
            'ar', 'he', 'fa', 'ur',
            'hi', 'bn',
            'pt', 'pt_BR',
            'ru', 'tr', 'vi',
        ]"
        v-model:value="locale"
        storage-key="app-locale"
        detect-from-navigator
    >
        <template
            #default="{ locales, value, setLocale, labelFor, tagFor }"
        >
            <select
                class="locale-select"
                aria-label="Language"
                :value="value"
                @change="
                    (e) =>
                        setLocale(
                            (e.target as HTMLSelectElement).value,
                        )
                "
            >
                <option
                    v-for="l in locales"
                    :key="l"
                    class="locale-select-option"
                    :value="l"
                    :lang="tagFor(l)"
                    :selected="value === l"
                >
                    {{ labelFor(l) }}
                </option>
            </select>
        </template>
    </LocaleSelect>

    <p>Selected locale: <code>{{ locale }}</code></p>
</template>
