<!--
    Long locale lists: built-in typeahead, plus an optional
    free-text <datalist> combobox alongside.

    Two things changed with the icon-button rewrite:

    1. The listbox now implements APG typeahead itself. Open it and
       type "fr" and the active option jumps to "French" — no extra
       markup needed, even across all 436 built-in locales. For most
       long lists that is the whole answer.

    2. The default slot replaces the button glyph only, so you can no
       longer swap the control for an <input list>. If you genuinely
       need free-text filtering, render your own combobox NEXT TO the
       component and bind both to the same ref: LocaleSelect keeps
       owning the apply lifecycle (lang/dir/storage/change), and your
       input is simply a second way to write the bound value.

    Outcome: a globe button with built-in typeahead over 436 locales,
    plus a text input where typing "Français" and committing applies
    fr — both driving the same `locale` ref.

    Browser support note: native <datalist> is widely supported but
    iOS Safari's UX is limited. For a fully APG-compliant combobox,
    swap in Lily's headless Combobox primitive.
-->
<script setup lang="ts">
import { ref } from "vue";
import LocaleSelect, {
    defaultLocaleLabels,
    localeName,
} from "../LocaleSelect.vue";

// All 436 locale codes from the built-in table.
const ALL_LOCALES = Object.keys(defaultLocaleLabels);

const locale = ref("en");
const inputValue = ref("");

/** Commit the typed text if it names a supported locale. */
function commit(event: Event): void {
    const typed = (event.target as HTMLInputElement).value.toLowerCase();
    const match = ALL_LOCALES.find(
        (l) => (defaultLocaleLabels[l] ?? l).toLowerCase() === typed,
    );
    if (match) {
        locale.value = match;
        inputValue.value = "";
    }
}
</script>

<template>
    <LocaleSelect
        label="Language"
        :locales="ALL_LOCALES"
        v-model:value="locale"
        storage-key="combobox-locale"
    />

    <label for="locale-combobox">Or search languages</label>
    <input
        id="locale-combobox"
        type="text"
        list="locale-options"
        placeholder="Start typing a language…"
        :value="inputValue || localeName(locale)"
        @input="inputValue = ($event.target as HTMLInputElement).value"
        @change="commit"
    />
    <datalist id="locale-options">
        <option
            v-for="l in ALL_LOCALES"
            :key="l"
            :value="defaultLocaleLabels[l] ?? l"
            :lang="l.replace(/_/g, '-')"
        >
            {{ l }}
        </option>
    </datalist>

    <p class="locale-select-status" aria-live="polite">
        Current language: {{ localeName(locale) }}
    </p>

    <p>
        Selected locale: <code>{{ locale }}</code>
        ({{ defaultLocaleLabels[locale] }})
    </p>
</template>
