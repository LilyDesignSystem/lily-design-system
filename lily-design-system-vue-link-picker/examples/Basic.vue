<script setup lang="ts">
import LinkPicker, { type LinkItem } from "../LinkPicker.vue";

// The app defines the links: the package ships no routes and no English.
const links: LinkItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about/" },
  { label: "Contact Us", href: "/contact/" },
  { label: "Privacy Policy", href: "/privacy/" },
];
</script>

<template>
  <LinkPicker label="Pages" :links="links" />
</template>
