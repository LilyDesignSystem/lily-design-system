<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignBodyFatAsPercentageView from './VitalSignBodyFatAsPercentageView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VitalSignBodyFatAsPercentageView',
    component: VitalSignBodyFatAsPercentageView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Body Fat As Percentage View'}}
/>
