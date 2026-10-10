<!--
  Example 2 — SvelteKit: client-side navigation and the current page.

  `navigate` turns a plain left click into goto(); Ctrl/Cmd-click, middle
  click and newTab links stay native. `current` marks the page you are on
  with aria-current="page".
-->
<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import LinkPicker from "../LinkPicker.svelte";

  const pages = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about/" },
    { label: "Contact Us", href: "/contact/" },
    { label: "Privacy Policy", href: "/privacy/" },
  ];

  const links = $derived(pages.map((p) => ({ ...p, current: page.url.pathname === p.href })));
</script>

<LinkPicker label="Pages" {links} navigate={(href) => goto(href)} />
