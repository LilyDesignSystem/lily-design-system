<!--
    Example 5 — Custom rendering via the default scoped slot.

    When the default radio-list markup isn't enough, take over completely.
    The slot receives:
      - themes:   the slug list
      - value:    the active slug
      - setTheme: imperatively apply a slug (also updates `value`)
      - name:     the radio `name` (shared identity for the picker)
      - labelFor: the resolved display label for a slug

    Below, we render a row of swatch buttons. Each button:
      - exposes its pressed state via aria-pressed,
      - sets data-theme on itself so consumer CSS can preview the swatch
        colours via the same :root[data-theme] cascade.
-->
<script setup lang="ts">
import ThemePicker from "../ThemePicker.vue";
</script>

<template>
    <ThemePicker
        label="Theme"
        themes-url="/assets/themes/"
        :themes="['light', 'dark', 'abyss', 'cupcake', 'dracula']"
    >
        <template #default="{ themes, value, setTheme, labelFor }">
            <button
                v-for="t in themes"
                :key="t"
                type="button"
                class="theme-picker-swatch"
                :data-theme="t"
                :aria-pressed="value === t"
                @click="setTheme(t)"
            >
                {{ labelFor(t) }}
            </button>
        </template>
    </ThemePicker>
</template>
