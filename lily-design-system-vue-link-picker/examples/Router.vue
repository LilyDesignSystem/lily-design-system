<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import LinkPicker from "../LinkPicker.vue";

const pages = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about/" },
  { label: "Contact Us", href: "/contact/" },
  { label: "Privacy Policy", href: "/privacy/" },
];
const route = useRoute();
const router = useRouter();
// `navigate` turns a plain left click into router navigation; Ctrl/Cmd-click, middle click and
// newTab links stay native. `current` marks the page you are on with aria-current="page".
const links = computed(() => pages.map((p) => ({ ...p, current: route.path === p.href })));
</script>

<template>
  <LinkPicker label="Pages" :links="links" :navigate="(href) => router.push(href)" />
</template>
