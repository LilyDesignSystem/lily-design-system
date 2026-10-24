<!--
  DemoApp — the /demo/svelte/ page: a "holy grail" application shell built from headless Lily components,
  with a header navigation and picker bar, a left navigation, a content area that shows one helper at a time
  (data grid, kanban board, Gantt chart, calendar, Markdown editor, Org editor), a right aside and a footer.

  Every control is unstyled markup that the selected theme (the theme picker) turns into an interface; the
  only CSS here is the shell's own layout. The picker bar offers nine locales; the helpers' own labels come
  from the label packs in @lilydesignsystem/svelte-locale-translations, the rest from ./strings.ts.
-->
<script lang="ts">
  import { goto } from '$app/navigation';
  import PickerBar from '@lilydesignsystem/svelte-picker-bar';
  import type { ShareTarget } from '@lilydesignsystem/svelte-share-picker';
  import type { LabelPack } from '@lilydesignsystem/svelte-locale-translations';
  import {
    GrailLayout,
    GrailLayoutTopHeader,
    GrailLayoutLeftAside,
    GrailLayoutCenterMain,
    GrailLayoutRightAside,
    GrailLayoutBottomFooter,
    NavigationMenu,
    SectionNav,
    SectionList,
    SectionListItem
  } from '@lilydesignsystem/svelte-headless';
  import { THEMES } from '#lib/themes.js';
  import { DEMO_LOCALES, LOCALE_NAMES, PANELS, STRINGS, packKey, type DemoLocale, type PanelId } from './strings.js';
  import GridPanel from './GridPanel.svelte';
  import KanbanPanel from './KanbanPanel.svelte';
  import GanttPanel from './GanttPanel.svelte';
  import CalendarPanel from './CalendarPanel.svelte';
  import EditorPanel from './EditorPanel.svelte';
  import IconRail from './IconRail.svelte';

  // The label packs for the four languages, read from the installed package at build time.
  const packFiles = import.meta.glob<LabelPack>(
    '/node_modules/@lilydesignsystem/svelte-locale-translations/label-packs/{en,zh,hi,ar,cy,es,fr,de}-001.json',
    { eager: true, import: 'default' }
  );
  const packs = Object.fromEntries(
    Object.entries(packFiles).map(([path, pack]) => [path.slice(path.lastIndexOf('/') + 1, -'.json'.length), pack])
  ) as Record<string, LabelPack>;

  let locale = $state<DemoLocale>('en-001');
  const s = $derived(STRINGS[locale]);
  // Each locale uses the pack for its language: cy-gb the Welsh pack, en-gb the English one.
  const pack = $derived(packs[packKey(locale)]);

  // "Today" is read once on the client, so the sample dates (and the SSR HTML) never disagree.
  let today = $state('');
  $effect(() => {
    const now = new Date();
    today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });

  // The shown panel is the URL hash, so a panel can be linked and the back button works.
  let panel = $state<PanelId>('data-grid');
  $effect(() => {
    const read = () => {
      const id = location.hash.slice(1) as PanelId;
      if (PANELS.includes(id)) panel = id;
    };
    read();
    addEventListener('hashchange', read);
    return () => removeEventListener('hashchange', read);
  });

  // One stroke icon per panel, on the same 16x16 grid the pickers use.
  const ICONS: Record<PanelId, string> = {
    'data-grid': 'M2.5 3h11v10h-11zM2.5 6.5h11M2.5 10h11M6.5 3v10',
    'kanban-board': 'M2.5 3h3v10h-3zM6.5 3h3v6h-3zM10.5 3h3v8h-3z',
    'gantt-chart': 'M2 2v12M3.5 4h5M5.5 8h6M4 12h4.5',
    calendar: 'M2.5 4h11v9.5h-11zM2.5 7h11M5 2.5v3M11 2.5v3',
    'markdown-editor': 'M2.5 4h11v8h-11zM4.5 10V6l1.5 2 1.5-2v4M11.5 6v4M10 8.5l1.5 1.5 1.5-1.5',
    'org-editor': 'M8 2.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM5.5 8h5M8 5.5v5'
  };

  // The two side rails: icon buttons that each open the same demo dialog. Each remembers whether it is expanded.
  let leftExpanded = $state(false);
  let rightExpanded = $state(false);
  const leftItems = $derived([
    { id: 'home', label: s.leftItems.home, path: 'M2.5 8 8 3l5.5 5M4 7v6.5h3v-3.5h2v3.5h3V7' },
    { id: 'search', label: s.leftItems.search, path: 'M7 11.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM10.5 10.5l3 3' },
    { id: 'settings', label: s.leftItems.settings, path: 'M2.5 5h6M11.5 5h2M2.5 11h2M7.5 11h6M9.5 3.5v3M5.5 9.5v3' },
    { id: 'help', label: s.leftItems.help, path: 'M8 2.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM6.3 6.3a1.8 1.8 0 1 1 2.5 1.7c-.5.3-.8.7-.8 1.2M8 11.3h.01' },
    { id: 'email', label: s.leftItems.email, path: 'M2 4h12v8H2zM2.5 4.5 8 9l5.5-4.5' }
  ]);
  const rightItems = $derived([
    { id: 'users', label: s.rightItems.users, path: 'M6 7.5a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6zM2 13c.4-2.5 2-3.7 4-3.7s3.6 1.2 4 3.7M11 7a2 2 0 1 0 0-4M12 9.5c1.2.4 1.9 1.5 2 3' },
    { id: 'groups', label: s.rightItems.groups, path: 'M5 6.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM11 6.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM1.8 12.5c.3-2 1.6-3 3.2-3s2.9 1 3.2 3M7.8 12.5c.3-2 1.6-3 3.2-3s2.9 1 3.2 3' },
    { id: 'places', label: s.rightItems.places, path: 'M8 14s4.5-4 4.5-7.5a4.5 4.5 0 0 0-9 0C3.5 10 8 14 8 14zM8 8.3a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z' },
    { id: 'events', label: s.rightItems.events, path: 'M2.5 4h11v9.5h-11zM2.5 7h11M5 2.5v3M11 2.5v3M8 9l.8 1.6 1.7.3-1.2 1.2.3 1.7L8 12.9l-1.6.9.3-1.7-1.2-1.2 1.7-.3z' },
    { id: 'actions', label: s.rightItems.actions, path: 'M9 2 4 9h4l-1 5 5-7H8z' }
  ]);

  const shareTargets: ShareTarget[] = [
    { id: 'mastodon', label: 'Mastodon', href: (url, title) => `https://mastodon.social/share?text=${encodeURIComponent(`${title} ${url}`)}` },
    { id: 'email', label: 'Email', href: (url, title) => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`, newTab: false }
  ];

  const links = $derived([
    { label: s.links.home, href: '/' },
    { label: s.links.components, href: '/components/' },
    { label: s.links.help, href: '/help/' }
  ]);
</script>

<svelte:head>
  <title>{s.panels[panel]} — Lily Design System™ demo</title>
</svelte:head>

<a class="skip-link" href="#demo-main">{s.skip}</a>

<GrailLayout class="demo" data-left={leftExpanded ? 'expanded' : 'collapsed'} data-right={rightExpanded ? 'expanded' : 'collapsed'}>
  <GrailLayoutTopHeader class="demo-header">
    <a class="demo-brand" href="/" aria-label="Lily Design System™">
      <img src="/assets/images/lily-design-system-icon/lily-design-system-icon.svg" alt="" aria-hidden="true" width="28" height="28" />
      <span>Lily Design System™</span>
    </a>
    <NavigationMenu label="Lily" class="demo-nav">
      <a href="/components/">{s.headerNav.components}</a>
      <a href="/tutorials/">{s.headerNav.tutorials}</a>
      <a href="/examples/">{s.headerNav.examples}</a>
      <a href="/help/">{s.headerNav.help}</a>
    </NavigationMenu>
    <PickerBar
      class="site-preferences"
      labels={{
        link: s.pickers.link,
        theme: s.pickers.theme,
        locale: s.pickers.locale,
        textSize: s.pickers.textSize,
        share: s.pickers.share,
        search: s.pickers.search,
        searchInput: s.pickers.searchInput,
        searchSubmit: s.pickers.searchSubmit
      }}
      {links}
      linkProps={{ navigate: (href: string) => goto(href) }}
      searchProps={{ action: '/components/', navigate: (href: string) => goto(href) }}
      themesUrl="/assets/themes/"
      themes={THEMES}
      themeProps={{ detectFromSystem: true, storageKey: 'lily-site-theme' }}
      locales={[...DEMO_LOCALES]}
      localeProps={{
        value: locale,
        localeLabels: LOCALE_NAMES,
        storageKey: 'lily-demo-locale',
        onChange: (code: string) => (locale = code as DemoLocale)
      }}
      textSizeProps={{ storageKey: 'lily-site-text-size' }}
      {shareTargets}
      shareProps={{ title: 'Lily Design System™', copyLabel: s.pickers.copyLink, copiedLabel: s.pickers.copied, copyFailedLabel: s.pickers.copyFailed }}
    />
  </GrailLayoutTopHeader>

  <GrailLayoutLeftAside class="demo-left" aria-label={s.rails.left}>
    <IconRail
      side="left"
      label={s.rails.left}
      items={leftItems}
      bind:expanded={leftExpanded}
      expandLabel={s.rails.expand}
      collapseLabel={s.rails.collapse}
      dialogText={s.rails.dialogText}
      closeLabel={s.rails.close}
    />
  </GrailLayoutLeftAside>

  <GrailLayoutCenterMain class="demo-main" id="demo-main">
    <SectionNav label={s.railLabel} class="demo-tabs">
      <SectionList>
        {#each PANELS as id (id)}
          <SectionListItem>
            <a href={`#${id}`} aria-current={panel === id ? 'page' : undefined}>
              <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="1.05rem" height="1.05rem">
                <path d={ICONS[id]} />
              </svg>
              <span>{s.panels[id]}</span>
            </a>
          </SectionListItem>
        {/each}
      </SectionList>
    </SectionNav>

    <h1>{s.panels[panel]}</h1>
    {#if today}
      {#if panel === 'data-grid'}
        <GridPanel {s} {pack} {locale} {today} />
      {:else if panel === 'kanban-board'}
        <KanbanPanel {s} {pack} />
      {:else if panel === 'gantt-chart'}
        <GanttPanel {s} {pack} {locale} {today} />
      {:else if panel === 'calendar'}
        <CalendarPanel {s} {pack} {locale} {today} />
      {:else}
        <EditorPanel {s} kind={panel} {today} />
      {/if}
    {/if}

    <section class="demo-about" aria-labelledby="demo-about-title">
      <h2 id="demo-about-title">{s.aside.title}</h2>
      <p>{s.aside.body}</p>
      <h3>{s.aside.tipsTitle}</h3>
      <ul>
        {#each s.aside.tips as tip (tip)}
          <li>{tip}</li>
        {/each}
      </ul>
    </section>
  </GrailLayoutCenterMain>

  <GrailLayoutRightAside class="demo-right" aria-label={s.rails.right}>
    <IconRail
      side="right"
      label={s.rails.right}
      items={rightItems}
      bind:expanded={rightExpanded}
      expandLabel={s.rails.expand}
      collapseLabel={s.rails.collapse}
      dialogText={s.rails.dialogText}
      closeLabel={s.rails.close}
    />
  </GrailLayoutRightAside>

  <GrailLayoutBottomFooter class="demo-footer">
    <p>{s.footer}</p>
  </GrailLayoutBottomFooter>
</GrailLayout>

<style>
  /* The shell's own layout: a grid for the five grail regions, in logical properties so Arabic mirrors it. */
  :global(.demo) {
    display: grid;
    grid-template-columns: var(--demo-left, 4rem) minmax(0, 1fr) var(--demo-right, 4rem);
    grid-template-areas:
      'header header header'
      'left main right'
      'footer footer footer';
    min-block-size: 100dvh;
  }
  :global(.demo[data-left='expanded']) {
    --demo-left: 12rem;
  }
  :global(.demo[data-right='expanded']) {
    --demo-right: 12rem;
  }
  /* The header and the footer are pinned: the page scrolls between them. They are opaque so content never shows through. */
  :global(html:has(.demo)) {
    scroll-padding-block: 4.75rem;
  }
  :global(.demo-header) {
    position: sticky;
    inset-block-start: 0;
    z-index: 20;
    background: var(--lily-surface, Canvas);
    grid-area: header;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem 1.5rem;
    padding: 0.5rem 1rem;
    border-block-end: 1px solid color-mix(in srgb, currentColor 20%, transparent);
  }
  :global(.demo-brand) {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    text-decoration: none;
    color: inherit;
  }
  :global(.demo-nav) {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 1rem;
    margin-inline-end: auto;
  }
  :global(.demo-nav a) {
    color: inherit;
    text-decoration: none;
  }
  :global(.demo-nav a:hover),
  :global(.demo-nav a:focus-visible) {
    text-decoration: underline;
  }
  :global(.demo-left) {
    grid-area: left;
    padding: 0.5rem;
    border-inline-end: 1px solid color-mix(in srgb, currentColor 20%, transparent);
  }
  /* The panel switcher: a row of links above the content. */
  :global(.demo-tabs .section-list) {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin: 0 0 1rem;
    padding: 0;
    list-style: none;
  }
  :global(.demo-tabs a) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.75rem;
    border-radius: 0.4rem;
    text-decoration: none;
    color: inherit;
  }
  :global(.demo-tabs a[aria-current='page']) {
    background: color-mix(in srgb, currentColor 14%, transparent);
    font-weight: 600;
  }
  :global(.demo-tabs a:hover) {
    background: color-mix(in srgb, currentColor 8%, transparent);
  }
  :global(.demo-main) {
    grid-area: main;
    padding: 1rem 1.25rem;
    min-inline-size: 0;
    overflow-x: auto;
  }
  :global(.demo-main h1) {
    margin-block: 0 1rem;
    font-size: 1.4rem;
  }
  :global(.demo-right) {
    grid-area: right;
    padding: 0.5rem;
    border-inline-start: 1px solid color-mix(in srgb, currentColor 20%, transparent);
  }
  :global(.demo-about) {
    margin-block-start: 2rem;
    padding-block-start: 1rem;
    border-block-start: 1px solid color-mix(in srgb, currentColor 20%, transparent);
    max-inline-size: 48rem;
  }
  :global(.demo-about h2) {
    margin-block-start: 0;
    font-size: 1.05rem;
  }
  :global(.demo-about h3) {
    font-size: 0.95rem;
  }
  :global(.demo-footer) {
    position: sticky;
    inset-block-end: 0;
    z-index: 20;
    background: var(--lily-surface, Canvas);
    grid-area: footer;
    padding: 0.5rem 1rem;
    border-block-start: 1px solid color-mix(in srgb, currentColor 20%, transparent);
    font-size: 0.85rem;
  }
  :global(.demo-footer p) {
    margin: 0;
  }

  /* Tables keep a readable width and scroll sideways inside the content area instead of squeezing to a letter a column. */
  :global(.demo-main table) {
    min-inline-size: 34rem;
  }

  /* WCAG 2.5.8: every button in the content is at least 24px square, even where the helper's own markup is bare. */
  :global(.demo-main button) {
    min-block-size: 1.75rem;
    min-inline-size: 1.75rem;
  }

  /* The editors fill the content area. */
  :global(.demo-main textarea) {
    box-sizing: border-box;
    inline-size: 100%;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  /* Calendar events inside a day. */
  :global(.demo-event) {
    display: block;
    margin-block-start: 0.15rem;
    padding: 0 0.3rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    background: color-mix(in srgb, var(--color-primary, currentColor) 18%, transparent);
  }

  /* The Gantt chart: the themes style `[data-state="bar"]`, but the helper marks a task's days `data-in-range`
     (and today `data-today`), so the demo draws the bars itself. The table scrolls sideways inside its box. */
  :global(.demo-main .gantt-chart) {
    overflow-x: auto;
  }
  :global(.demo-main .gantt-table-th) {
    min-inline-size: 1.9rem;
    padding-inline: 0.2rem;
    font-size: 0.7rem;
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
  }
  :global(.demo-main .gantt-table-th:first-child),
  :global(.demo-main .gantt-table-th[scope='row']) {
    min-inline-size: 11rem;
    padding-inline: 0.5rem;
    font-size: 0.9rem;
    text-align: start;
    white-space: normal;
  }
  :global(.demo-main .gantt-table-td) {
    min-block-size: 1.7rem;
    padding: 0;
  }
  :global(.demo-main .gantt-table-td[data-in-range]) {
    background: var(--color-primary, #2563eb);
  }
  :global(.demo-main .gantt-table-td[data-in-range][data-milestone]) {
    border-radius: 50%;
    transform: scale(0.7);
  }
  :global(.demo-main .gantt-table-td[data-today]) {
    box-shadow: inset 2px 0 0 currentColor;
  }

  /* Narrow screens: one column. The rails stack above and below the content and keep their toggles. */
  @media (max-width: 48rem) {
    :global(.demo) {
      grid-template-columns: minmax(0, 1fr);
      grid-template-areas: 'header' 'left' 'main' 'right' 'footer';
    }
    :global(.demo-left) {
      border-inline-end: 0;
      border-block-end: 1px solid color-mix(in srgb, currentColor 20%, transparent);
    }
    :global(.demo-right) {
      border-inline-start: 0;
      border-block-start: 1px solid color-mix(in srgb, currentColor 20%, transparent);
    }
  }
</style>
