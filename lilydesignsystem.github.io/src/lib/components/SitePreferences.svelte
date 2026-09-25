<!--
  SitePreferences — the page-header preference/action picker row,
  composed from the real, published `@lilydesignsystem/svelte-picker-bar`
  helper (theme, language, text size, share in one component) rather than
  assembling the four sibling pickers by hand — see
  lily-design-system-svelte-helpers/lily-design-system-svelte-picker-bar.

  These are headless components: PickerBar supplies no CSS of its own;
  static/assets/style.css supplies every visual decision, including the
  listboxes' open-state positioning and the [data-text-size] font-size
  mapping — see the "Site preference pickers" section there.
-->
<script lang="ts">
  import { goto } from '$app/navigation';
  import PickerBar from '@lilydesignsystem/svelte-picker-bar';
  import type { ShareTarget } from '@lilydesignsystem/svelte-share-picker';
  import { LOCALE_LABELS, locales, DEFAULT_LOCALE } from '$lib/locales';
  import { ui } from '$lib/i18n';

  let { locale = DEFAULT_LOCALE }: { locale?: string } = $props();

  const strings = $derived(ui(locale));

  // No social-network URL ships with the package (see the helper's own
  // docs) — every destination here is this site's own editorial choice.
  const shareTargets: ShareTarget[] = [
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
      href: (url, title) => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
      newTab: false
    }
  ];

  // The site only has translated content at /locales/<code>/ so far (see
  // spec/locales-for-global-sharing-with-svelte) — switching locale always
  // goes to that locale's home page, not a translated version of whatever
  // page you were on, since most pages don't have one yet.
  function onLocaleChange(code: string) {
    goto(`/locales/${code}/`);
  }
</script>

<PickerBar
  class="site-preferences"
  labels={{
    theme: strings.pickerLabels.theme,
    locale: strings.pickerLabels.locale,
    textSize: strings.pickerLabels.textSize,
    share: strings.pickerLabels.share
  }}
  themesUrl="/assets/themes/"
  themeProps={{ detectFromSystem: true, storageKey: 'lily-site-theme' }}
  locales={locales()}
  localeProps={{
    value: locale,
    localeLabels: LOCALE_LABELS,
    onChange: onLocaleChange
  }}
  textSizeProps={{ storageKey: 'lily-site-text-size' }}
  {shareTargets}
  shareProps={{
    title: 'Lily Design System™',
    copyLabel: 'Copy link',
    copiedLabel: 'Link copied',
    copyFailedLabel: 'Could not copy — copy it from the address bar'
  }}
/>
