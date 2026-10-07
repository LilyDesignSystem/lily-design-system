<!--
  Example 1 — Basic usage.

  The app defines the links: the package ships no routes and no English.
  `label` names the button, the list and the tooltip.
-->
<script lang="ts">
  import LinkPicker, { type LinkItem } from "../LinkPicker.svelte";

  const links: LinkItem[] = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about/" },
    { label: "Contact Us", href: "/contact/" },
    { label: "Privacy Policy", href: "/privacy/" },
  ];
</script>

<LinkPicker label="Pages" {links} />
