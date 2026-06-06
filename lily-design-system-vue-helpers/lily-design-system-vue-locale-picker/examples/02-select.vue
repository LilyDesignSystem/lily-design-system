<!--
    02. Native <select> via the default scoped slot.

    The picker still owns the lifecycle (lang/dir/storage/change) but
    delegates the markup to a <select>. Best for >~12 locales or when
    the design system uses dropdowns for setting controls.

    Outcome: a single <select> populated with one <option> per locale,
    each carrying its own BCP 47 `lang`. The picker's watch/onMounted
    runs the same way as the default rendering.
-->
<script setup lang="ts">
import { ref } from "vue";
import LocalePicker from "../LocalePicker.vue";

const locale = ref("en");
</script>

<template>
    <LocalePicker
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
                class="locale-picker-select"
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
                    :value="l"
                    :lang="tagFor(l)"
                >
                    {{ labelFor(l) }}
                </option>
            </select>
        </template>
    </LocalePicker>

    <p>Selected locale: <code>{{ locale }}</code></p>
</template>
