<!--
  Example 3 — Replacing the icon.

  `children` replaces the icon inside the button, never the links. The
  accessible name still comes from `label`, so keep the content decorative.
-->
<script lang="ts">
  import LinkPicker from "../LinkPicker.svelte";

  const links = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about/" },
    { label: "Contact Us", href: "/contact/" },
    { label: "Privacy Policy", href: "/privacy/" },
  ];
</script>

<LinkPicker label="Pages" {links}>
  {#snippet children({ open })}
    <span aria-hidden="true">{open ? "▾" : "☰"}</span>
  {/snippet}
</LinkPicker>
