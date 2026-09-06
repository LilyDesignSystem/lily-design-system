<!--
  SitePreferences — the three page-header preference/action pickers
  (theme, text size, share), each a real, published Lily helper package.
  Rendered once, in the root layout, so it appears in the header on
  every page.

  These are headless components: this file supplies the props (which
  themes exist, which sizes exist, which share destinations exist) and
  the surrounding stylesheet (static/assets/style.css) supplies every
  visual decision, including the two listboxes' open-state positioning
  and the [data-text-size] font-size mapping — see the "Site preference
  pickers" section there.
-->
<script lang="ts">
  import ThemePicker from 'lily-design-system-svelte-theme-picker';
  import TextSizePicker from 'lily-design-system-svelte-text-size-picker';
  import SharePicker, { type ShareTarget } from 'lily-design-system-svelte-share-picker';

  // The full 45-theme reference catalog, copied from the root themes/
  // directory into static/assets/themes/ at build time (see
  // static/assets/themes/README.md for how to keep the two in sync).
  const themes = [
    'abyss',
    'acid',
    'adobe-spectrum',
    'aqua',
    'autumn',
    'black',
    'bumblebee',
    'business',
    'caramellatte',
    'cmyk',
    'coffee',
    'corporate',
    'cupcake',
    'cyberpunk',
    'dark',
    'dim',
    'dracula',
    'emerald',
    'fantasy',
    'forest',
    'garden',
    'halloween',
    'lemonade',
    'light',
    'lofi',
    'luxury',
    'mozilla-protocol',
    'night',
    'nord',
    'pastel',
    'retro',
    'silk',
    'sunset',
    'synthwave',
    'united-kingdom-government-digital-service',
    'united-kingdom-national-health-service-england-for-patients',
    'united-kingdom-national-health-service-england-for-practitioners',
    'united-kingdom-national-health-service-scotland-for-patients',
    'united-kingdom-national-health-service-scotland-for-practitioners',
    'united-kingdom-national-health-service-wales-for-patients',
    'united-kingdom-national-health-service-wales-for-practitioners',
    'united-states-web-design-system',
    'valentine',
    'winter',
    'wireframe'
  ];

  const sizes = ['small', 'medium', 'large', 'x-large'];

  // No social-network URL ships with the package (see the helper's own
  // docs) — every destination here is this site's own editorial choice.
  const targets: ShareTarget[] = [
    {
      id: 'x',
      label: 'X',
      href: (url, title) =>
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    },
    {
      id: 'mastodon',
      label: 'Mastodon',
      href: (url, title) =>
        `https://mastodon.social/share?text=${encodeURIComponent(`${title} ${url}`)}`
    },
    {
      id: 'email',
      label: 'Email',
      href: (url, title) =>
        `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
      newTab: false
    }
  ];
</script>

<div class="site-preferences">
  <ThemePicker
    label="Theme"
    themesUrl="/assets/themes/"
    {themes}
    detectFromSystem
    storageKey="lily-site-theme"
  />
  <TextSizePicker label="Text size" {sizes} storageKey="lily-site-text-size" />
  <SharePicker
    label="Share this page"
    title="Lily Design System™"
    {targets}
    copyLabel="Copy link"
    copiedLabel="Link copied"
    copyFailedLabel="Could not copy — copy it from the address bar"
  />
</div>
