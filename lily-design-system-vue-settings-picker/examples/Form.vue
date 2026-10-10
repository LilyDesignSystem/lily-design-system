<!--
  A form in the panel. The default slot receives `close`; typing in the input does not close the
  panel (it is not a link or button), and submitting calls close() itself.
-->
<script setup lang="ts">
import { ref } from "vue";
import SettingsPicker from "../SettingsPicker.vue";
const query = ref("");
</script>

<template>
    <SettingsPicker label="Settings" v-slot="{ close }">
        <form @submit.prevent="close()">
            <input type="search" aria-label="Search" v-model="query" />
            <button type="submit" data-settings-picker-keep-open>Go</button>
        </form>
    </SettingsPicker>
</template>
