<!--
  Example 1 — Basic usage.

  Destinations come from you, not the package: no social-network URLs
  ship with Lily. `url` defaults to the current page, so the common case
  needs no wiring.

  On a device with a native share sheet (most phones, Safari) the button
  opens that instead of this list — pass strategy="list" to force the
  list everywhere.
-->
<script setup lang="ts">
import ShareButton, { type ShareTarget } from "../ShareButton.vue";

const targets: ShareTarget[] = [
  {
    id: "mastodon",
    label: "Mastodon",
    href: (url, title) =>
      `https://mastodon.social/share?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    id: "email",
    label: "Email",
    href: (url, title) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
    newTab: false,
  },
];

function onShare(targetId: string, url: string): void {
  console.log("shared to", targetId, url);
}
</script>

<template>
  <ShareButton
    label="Share this page"
    title="An article worth reading"
    :targets="targets"
    copy-label="Copy link"
    copied-label="Link copied"
    copy-failed-label="Could not copy — copy it from the address bar"
    @share="onShare"
  />
</template>
