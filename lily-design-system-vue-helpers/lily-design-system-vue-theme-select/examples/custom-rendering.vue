<!--
    Example 5 — Custom rendering via the default scoped slot.

    By default the select renders native <option class="theme-select-option">
    elements inside the <select class="theme-select">. When that markup isn't
    enough, take over completely. The slot receives:
      - themes:   the slug list
      - value:    the active slug
      - setTheme: imperatively apply a slug (also updates `value`)
      - name:     the shared identity for the select
      - labelFor: the resolved display label for a slug

    Below, we render a row of swatch buttons. Note: rendering anything other
    than <option> elements means you are rendering outside native <select>
    semantics, so you own the accessibility contract for whatever you render.
    Each button here:
      - exposes its pressed state via aria-pressed,
      - sets data-theme on itself so consumer CSS can preview the swatch
        colours via the same :root[data-theme] cascade.
-->
<script setup lang="ts">
import ThemeSelect from "../ThemeSelect.vue";
</script>

<template>
    <ThemeSelect
        label="Theme"
        themes-url="/assets/themes/"
        :themes="['light', 'dark', 'abyss', 'cupcake', 'dracula']"
    >
        <template #default="{ themes, value, setTheme, labelFor }">
            <button
                v-for="t in themes"
                :key="t"
                type="button"
                class="theme-select-swatch"
                :data-theme="t"
                :aria-pressed="value === t"
                @click="setTheme(t)"
            >
                {{ labelFor(t) }}
            </button>
        </template>
    </ThemeSelect>
</template>
