<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AnnouncementBanner from './AnnouncementBanner.svelte';

  const { Story } = defineMeta({
    title: 'Examples/AnnouncementBanner',
    component: AnnouncementBanner,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'AnnouncementBanner'}}
>
  <span>AnnouncementBanner</span>
</Story>
