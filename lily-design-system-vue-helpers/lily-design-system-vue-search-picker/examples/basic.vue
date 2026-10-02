<!--
  Example 1 — Basic usage.

  A search for "foo" performs a GET to "/?foo". Every user-facing string
  is a prop: the trigger, the field, and the ⏎ button each get a
  localisable accessible name.
-->
<script setup lang="ts">
import SearchPicker from "../SearchPicker.vue";

function onSearch(query: string, href: string): void {
  console.log("searching for", query, "at", href);
}
</script>

<template>
  <SearchPicker
    label="Search this site"
    input-label="Search terms"
    submit-label="Search"
    placeholder="Search…"
    @search="onSearch"
  />
</template>
