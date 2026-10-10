<script setup lang="ts">
import LinkPicker from "../LinkPicker.vue";

const links = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about/" },
  { label: "Contact Us", href: "/contact/" },
  { label: "Privacy Policy", href: "/privacy/" },
];
</script>

<template>
  <!-- The default slot replaces the icon inside the button, never the links. -->
  <LinkPicker label="Pages" :links="links">
    <template #default="{ open }"><span aria-hidden="true">{{ open ? "▾" : "☰" }}</span></template>
  </LinkPicker>
</template>
