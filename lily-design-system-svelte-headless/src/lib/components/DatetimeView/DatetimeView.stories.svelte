<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DatetimeView from './DatetimeView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/DatetimeView',
    component: DatetimeView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ value: '2026-01-31T10:00:00Z', format: 'Jan 31, 2026, 10:00 AM' }}
/>
